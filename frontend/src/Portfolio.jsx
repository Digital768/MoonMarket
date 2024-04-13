import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import "./portfolio.css";
import { Treemap } from "./Treemap";

function Portfolio({ getStockData }) {
  const [totalValue, setTotalValue] = useState(0);
  const [stocksTree, setStocksTree] = useState(null); // Define stocksTree state

  const { data, status, refetch } = useQuery({
    queryKey: ["stocks"],
    queryFn: getStocksFromDb,
    refetchOnWindowFocus: false,
  });

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

  // async function refreshStockPrices() {
  //   const response = await getStocksFromDb();
  //   const stock_collection = response["data"];

  //   const updatePromises = stock_collection.map(async (stock) => {
  //     const ticker = stock.ticker;
  //     const apiResponse = await getStockData(ticker);
  //     const newPrice = apiResponse.data[0].price;
  //     const StockId = stock._id;
  //     return updateStockPrice(StockId, newPrice);
  //   });

  //   await Promise.all(updatePromises);
  //   refetch();
  // }

  function isStockProfitable(stock) {
    const stock_avg_price = calculate_average_purchase_price(stock)
    return stock.last_price > stock_avg_price;
  }
  function calculate_average_purchase_price(stock) {
    let total_cost = 0;
    let total_quantity = 0;
    for (const purchase of stock.purchases) {
        total_cost += purchase.price * purchase.quantity;
        total_quantity += purchase.quantity;
    }
    if (total_quantity === 0) {
        return 0;
    }
    return total_cost / total_quantity;
}
function calculate_total_quantity(stock) {
  let total_quantity = 0;
  for (const purchase of stock.purchases) {
      total_quantity += purchase.quantity;
  }
  return total_quantity;
}


  useEffect(() => {
    if (data?.data) {
      const stockCollection = data.data;
      const sum = data.data.reduce((acc, stock) => acc + stock.value, 0);
      setTotalValue(Math.round(sum));
      const positiveStocks = [];
      const negativeStocks = [];

      stockCollection.forEach((stock) => {
        const stock_avg_price = calculate_average_purchase_price(stock)
        const quantity = calculate_total_quantity(stock)
        if (isStockProfitable(stock)) {
          positiveStocks.push({
            name: stock.name,
            id: stock._id,
            ticker: stock.ticker,
            value: Math.round(stock.value),
            last_price: Math.round(stock.last_price),
            quantity: quantity,
            priceChangePercentage: Math.round(((stock.last_price - stock_avg_price) /stock_avg_price)*100),
            percentageOfPortfolio: Math.round((stock.value/Math.round(sum))* 100)
          });
        } else {
          negativeStocks.push({
            name: stock.name,
            ticker: stock.ticker,
            id: stock._id,
            value: Math.round(stock.value),
            last_price: Math.round(stock.last_price),
            quantity: quantity,
            priceChangePercentage: Math.round(((stock.last_price - stock_avg_price) /stock_avg_price)*100),
            percentageOfPortfolio: Math.round((stock.value/Math.round(sum))* 100)
          });
        }
      });

      const newStocksTree = {
        name: "Stocks",
        value: 0,
        children: [
          {
            name: "Positive",
            value: 0,
            children: positiveStocks,
          },
          {
            name: "Negative",
            value: 0,
            children: negativeStocks,
          },
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
        {/* <button onClick={refreshStockPrices}>Refresh Data</button> */}
      </div>
      {stocksTree && <Treemap data={stocksTree} width={1000} height={600} deletestock={deleteStock}></Treemap>}
    </div>
  );
}

export default Portfolio;
