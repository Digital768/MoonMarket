import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import "@/styles/portfolio.css"
import { Treemap } from "@/components/Treemap";
import TreeMapSkeleton from "@/Skeletons/TreeMapSkeleton";
import { useAuth } from "@/pages/AuthProvider";
import {getUserData} from '@/api/user'


function Portfolio() {
  const { token } = useAuth();
  const [totalValue, setTotalValue] = useState(0);
  const [stocksTree, setStocksTree] = useState(null); // Define stocksTree state

  const { data, status, refetch } = useQuery({
    queryKey: [token],
    queryFn: getUserData(token),
    refetchOnWindowFocus: false,
  });


  async function getStockData(ticker) {
    const stock = await axios.get(`http://localhost:8000/stocks/${ticker}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log(stock.data)
    return stock.data
  }

 // #TODO: ADD UPDATE STOCK PRICES BY API

 
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

  function isStockProfitable(avg_bought_price, stock_current_price) {
    if (stock_current_price > avg_bought_price) return true;
    return false;
  }

  useEffect(() => {
    async function processStocks() {
      if (status === 'success') {
        if (data.data.length !== 0) {
          if (data.data.holdings.length > 0) {
            const stockCollection = data.data.holdings;
            const positiveStocks = [];
            const negativeStocks = [];
            let sum = 0;
  
            for (const holding of stockCollection) {
              const res = await getStockData(holding.ticker);
              const stock_avg_price = holding.avg_bought_price;
              const value = holding.quantity * res.price;
              sum += value;
  
              if (isStockProfitable(stock_avg_price, res.price)) {
                positiveStocks.push({
                  name: res.name,
                  id: res.id,
                  ticker: holding.ticker,
                  value: value,
                  avgSharePrice: stock_avg_price,
                  quantity: holding.quantity,
                  last_price: Math.round(res.price),
                  priceChangePercentage: Math.round(((res.price - stock_avg_price) / stock_avg_price) * 100),
                });
              } else {
                negativeStocks.push({
                  name: res.name,
                  id: res.id,
                  ticker: holding.ticker,
                  value: value,
                  avgSharePrice: stock_avg_price,
                  quantity: holding.quantity,
                  last_price: Math.round(res.price * 100) / 100,
                  priceChangePercentage: Math.round(((res.price - stock_avg_price) / stock_avg_price) * 100),
                });
              }
            }
  
            positiveStocks.forEach(stock => {
              stock.percentageOfPortfolio = Math.round((stock.value / sum) * 100);
            });
            negativeStocks.forEach(stock => {
              stock.percentageOfPortfolio = Math.round((stock.value / sum) * 100);
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
  
            setStocksTree(newStocksTree);
            setTotalValue(Math.round(sum * 100) / 100);
          } else {
            setStocksTree(null);
            setTotalValue(0);
          }
        }
      }
    }
  
    processStocks();
  }, [status]);

  if (status === "error") {
    return <p>Error</p>;
  }

  return (
    <div className="portfolio">
      <div className="navbar">
        <span>total value: {totalValue.toLocaleString("en-US")}$</span>
        {/* <button onClick={refreshStockPrices}>Refresh Data</button> */}
      </div>
      {status === "pending" ? <TreeMapSkeleton></TreeMapSkeleton> : stocksTree && (
        <Treemap
          data={stocksTree}
          width={1000}
          height={600}
        ></Treemap>)}
    </div>

  );
}

export default Portfolio;
