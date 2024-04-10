import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import "./portfolio.css";
import Treemap from "./Treemap";

function Portfolio({ getStockData }) {
  const [totalValue, setTotalValue] = useState(0);
  const [sortedData, setSortedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
      const sum = data.data.reduce((acc, stock) => acc + stock.value, 0);
      setTotalValue(Math.round(sum));

      // Sort the stocks by value
      const sortedStocks = sortStocksByValue(data.data);
      setSortedData(sortedStocks);

      const positiveStocks = [];
      const negativeStocks = [];

      sortedStocks.forEach(stock => {
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
        children: [
          {
            name: 'Positive',
            children: positiveStocks
          },
          {
            name: 'Negative',
            children: negativeStocks
          }
        ]
      };
      setStocksTree(newStocksTree); // Set stocksTree state
      setIsLoading(false);
    }
  }, [data]);

  // Function to sort stocks by value
  const sortStocksByValue = (stocks) => {
    return stocks.slice().sort((a, b) => b.value - a.value);
  };

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
      {stocksTree && <Treemap data={stocksTree} />} {/* Render Treemap if stocksTree is not null */}
    </div>
  );
}

export default Portfolio;