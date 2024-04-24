import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import "./portfolio.css";
import { Treemap } from "./Treemap";
import TreeMapSkeleton from "./Skeletons/TreeMapSkeleton";


function Portfolio() {
  const [totalValue, setTotalValue] = useState(0);
  const [stocksTree, setStocksTree] = useState(null); // Define stocksTree state

  const { data, status, refetch } = useQuery({
    queryKey: ["stocks"],
    queryFn: getStocksFromDb,
    refetchOnWindowFocus: false,
  });
  async function getStockData(ticker) {
    return axios.get(`http://localhost:8000/stocks/api/quote/${ticker}`);
  }


  async function getStocksFromDb() {
    const dbStocks = await axios.get("http://localhost:8000/stocks/");
    return dbStocks;
  }

  async function updateStockPrice(id, new_price) {
    await axios.put(`http://localhost:8000/stocks/update_price/${id}`, {
      last_price: new_price,
    });
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
    const avgSharePrice = calculate_average_price(stock)
    if (stock.last_price > avgSharePrice) return true;
    return false;
  }
  function calculate_average_price(stock) {
    // Step 1: Calculate the total amount spent on buying shares 
    const totalSpent = stock.purchases.reduce((total, purchase) => total + purchase.quantity * purchase.price, 0);
    // console.log("Total amount spent on buying shares " + totalSpent);
    const remainingQuantity = total_purchased_shares(stock);
    // Step 2: Calculate the average share price
    const avgSharePrice = remainingQuantity > 0 ? totalSpent / remainingQuantity : 0;
    // console.log("average share price " + avgSharePrice);
    return avgSharePrice;
  }
  function calculate_total_quantity(stock) {
    // calculate total quantity after removing sold shares quantity
    // Step 1: Calculate the total quantity of shares bought and sold
    const totalQuantityBought = stock.purchases.reduce((total, purchase) => total + purchase.quantity, 0);
    // console.log("total quantity bought " + totalQuantityBought);
    const totalQuantitySold = stock.sales.reduce((total, sale) => total + sale.quantity, 0);
    // console.log("total quantity sold " + totalQuantitySold);
    // Step 2: Calculate the remaining quantity of shares you own
    const remainingQuantity = totalQuantityBought - totalQuantitySold;
    // console.log("remaining quantity " + remainingQuantity);
    return remainingQuantity;
  }
  function total_purchased_shares(stock) {
    const totalQuantityBought = stock.purchases.reduce((total, purchase) => total + purchase.quantity, 0);
    return totalQuantityBought;
  }
  useEffect(() => {
    if (Array.isArray(data?.data) && data.data.length !== 0) {
      const stockCollection = data.data;
      const sum = data.data.reduce((acc, stock) => acc + stock.value, 0);
      setTotalValue(Math.round(sum*100)/100)
      const positiveStocks = [];
      const negativeStocks = [];

      stockCollection.forEach((stock) => {
        const stock_avg_price = calculate_average_price(stock);
        const quantity = calculate_total_quantity(stock);
        if (isStockProfitable(stock)) {
          positiveStocks.push({
            name: stock.name,
            id: stock._id,
            ticker: stock.ticker,
            value: Math.round(stock.value*100)/100,
            avgSharePrice: Math.round(stock_avg_price*100)/100,
            last_price: Math.round(stock.last_price*100)/100,
            quantity: quantity,
            priceChangePercentage: Math.round(
              ((stock.last_price - stock_avg_price) / stock_avg_price) * 100
            ),  
            percentageOfPortfolio: Math.round(
              (stock.value / Math.round(sum)) * 100
            ),
          });
        } else {
          negativeStocks.push({
            name: stock.name,
            ticker: stock.ticker,
            id: stock._id,
            value: Math.round(stock.value*100)/100,
            avgSharePrice: Math.round(stock_avg_price*100)/100,
            last_price: Math.round(stock.last_price*100)/100,
            quantity: quantity,
            priceChangePercentage: Math.round(
              ((stock.last_price - stock_avg_price) / stock_avg_price) * 100
            ),
            percentageOfPortfolio: Math.round(
              (stock.value / Math.round(sum)) * 100
            ),
          });
        }
      });

      const newStocksTree = {
        name: "Stocks",
        value: 0,
        children: [],
      };

      if (positiveStocks.length > 0) {
        newStocksTree.children.push({
          name: "Positive",
          value: 0,
          children: positiveStocks,
        });
      }

      if (negativeStocks.length > 0) {
        newStocksTree.children.push({
          name: "Negative",
          value: 0,
          children: negativeStocks,
        });
      }

      setStocksTree(newStocksTree); // Trigger a re-render of the Treemap
    }
    else {
       setStocksTree(null)
       setTotalValue(0)
       }
  }, [data]);

  if (status === "error") {
    return <p>Error</p>;
  }

  return (
    <div className="portfolio">
      <div className="navbar">
        <span>total value: {totalValue.toLocaleString("en-US")}$</span>
        <button onClick={refreshStockPrices}>Refresh Data</button>
      </div>
      {status === "pending" ? <TreeMapSkeleton></TreeMapSkeleton>: stocksTree && (
        <Treemap 
          data={stocksTree}
          width={1000}
          height={600}
        ></Treemap> )}
    </div>
   
  );
}

export default Portfolio;
