import TreeMapSkeleton from "@/Skeletons/TreeMapSkeleton";
import { getStockFromPortfolio } from "@/api/stock";
import { getUserData } from "@/api/user";
import { Treemap } from "@/components/Treemap";
import { useAuth } from "@/pages/AuthProvider";
import "@/styles/portfolio.css";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useMemo } from 'react';

function Portfolio() {
  const navigate = useNavigate();
  const [totalValue, setTotalValue] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [stocksTree, setStocksTree] = useState(null);

  const { token } = useAuth();
  const { data, status, refetch, fetchStatus } = useQuery({
    queryKey: ["user",  token ],
    queryFn: () => getUserData(token),
    refetchOnWindowFocus: false,
  });

  function isStockProfitable(avg_bought_price, stock_current_price) {
    if (stock_current_price > avg_bought_price) return true;
    return false;
  }

// todo : find a better way to change data rather than useEffect

  useEffect(() => {
    async function fetchDataAndProcess() {
      processStocks();
    }
    async function processStocks() {
      if (status === "success") {
        if (data.data.holdings.length > 0) {
          const stockCollection = data.data.holdings;
          const positiveStocks = [];
          const negativeStocks = [];
          let sum = 0;
          let promises = stockCollection.map(holding => getStockFromPortfolio(holding.ticker, token));
          let results = await Promise.all(promises);

          for (let i = 0; i < results.length; i++) {
            const res = results[i];
            const holding = stockCollection[i];
            // ... rest of your code ...
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
                priceChangePercentage: Math.round(
                  ((res.price - stock_avg_price) / stock_avg_price) * 100
                ),
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
                priceChangePercentage: Math.round(
                  ((res.price - stock_avg_price) / stock_avg_price) * 100
                ),
              });
            }
          }

          positiveStocks.forEach((stock) => {
            stock.percentageOfPortfolio = Math.round(
              (stock.value / sum) * 100
            );
          });
          negativeStocks.forEach((stock) => {
            stock.percentageOfPortfolio = Math.round(
              (stock.value / sum) * 100
            );
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
        setDeposit(data.data.deposit);
        setUpdatedAt(data.data.last_refresh);
      }
    }
    fetchDataAndProcess()
  }, [data]);

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

  if (status === "error") {
    setToken();
    navigate("/logout", { replace: true });
  }

  return (
    <div className="portfolio">
      <div className="navbar">
        <span>total value: {totalValue.toLocaleString("en-US")}$</span>
        <span>deposit: {deposit.toLocaleString("en-US")}$</span>
        <span>last updated at: {updatedAt}</span>
        {/* <button onClick={refreshStockPrices}>Refresh Data</button> */}
      </div>
      {!stocksTree ? (
        <TreeMapSkeleton />
      ) : (
        <Treemap data={stocksTree} width={1000} height={600} />
      )}
    </div>
  );
}

export default Portfolio;
