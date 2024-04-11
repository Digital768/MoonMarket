import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import "./portfolio.css";
import TreemapStocks from "./TreemapStocks";

function Portfolio({ getStockData }) {
  const [totalValue, setTotalValue] = useState(0);
  const [sortedData, setSortedData] = useState([]);
  const [stocksTree, setStocksTree] = useState(null); // Define stocksTree state

  const { data, status, refetch } = useQuery({
    queryKey: ["stocks"],
    queryFn: getStocksFromDb,
    refetchOnWindowFocus: false,
  },
  );

  async function getStocksFromDb() {
    const dbStocks = await axios.get("http://localhost:8000/stocks/");
    return dbStocks;
  }

  async function updateStockPrice(id, new_price) {
    await axios.put(`http://localhost:8000/stocks/${id}`, {
      last_price: new_price,
      quantity: null,
    });
  }

  async function deleteStock(id) {
    await axios.delete(`http://localhost:8000/stocks/${id}`);
    refetch();
  }

  async function refreshStockPrices() {
    const response = await getStocksFromDb();
    const stock_collection = response["data"];

    const updatePromises = stock_collection.map(async (stock) => {
      const ticker = stock.ticker;
      const apiResponse = await getStockData(ticker);
      const newPrice = apiResponse.data[0].price;
      const StockId = stock._id;
      return updateStockPrice(StockId, newPrice);
    });

    await Promise.all(updatePromises);
    refetch();
  }

  function isStockProfitable(stock) {
    return stock.last_price > stock.bought_price;
  }

  useEffect(() => {
    if (data?.data) {
      const stockCollection = data.data;
      const sum = data.data.reduce((acc, stock) => acc + stock.value, 0);
      setTotalValue(Math.round(sum));
  
      const positiveStocks = [];
      const negativeStocks = [];
  
      stockCollection.forEach(stock => {
        if (isStockProfitable(stock)) {
          positiveStocks.push({
            category: 'Positive',
            name: stock.name,
            value: Math.round(stock.value),
          });
        } else {
          negativeStocks.push({
            category: 'Negative',
            name: stock.name,
            value: Math.round(stock.value),
          });
        }
      });
  
      const newStocksTree = {
        name: 'Stocks',
        value: 0,
        children: [
          { name: 'Positive', children: positiveStocks },
          { name: 'Negative', children: negativeStocks },
        ],
      };
  
      setStocksTree(newStocksTree); // Trigger a re-render of the Treemap
    }
  }, [data]);


  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "error") {
    return <p>Error</p>;
  }

  return (
    <div className="portfolio">
      <div className="navbar">
        <span>total value: {totalValue.toLocaleString("en-US")}$</span>
        <button onClick={refreshStockPrices}>Refresh Data</button>
      </div>
      {stocksTree && <TreemapStocks data={stocksTree} />}
      
    </div>
  );
}

export default Portfolio;