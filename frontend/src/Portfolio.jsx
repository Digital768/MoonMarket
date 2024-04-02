import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import "./portfolio.css";

function Portfolio({ getStockData }) {
  const [totalValue, setTotalValue] = useState(0);
  const [stockValues, setStockValues] = useState([]);
  const [formattedTotalValue, setFormattedTotalValue] = useState("");

  async function getStocksFromDb() {
    const dbStocks = await axios.get("http://localhost:8000/stocks/");
    return dbStocks
  }

  async function updateStockPrice(id, new_price) {
    await axios.put(`http://localhost:8000/stocks/${id}`, { last_price: new_price, quantity: null })
  }

  const { data, status, refetch } = useQuery({
    queryKey: ["stocks"],
    queryFn: getStocksFromDb,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (data?.data) {
      const stockValues = data.data.map((stock) => ({ value: stock.value }));
      setStockValues(stockValues);
    }
  }, [data]);

  useEffect(() => {
    const sum = stockValues.reduce((acc, obj) => acc + obj.value, 0);
    setTotalValue(Math.round(sum));
  }, [stockValues]);

  useEffect(() => {
    setFormattedTotalValue(totalValue.toLocaleString("en-US"));
  }, [totalValue]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "error") {
    return <p>Error</p>;
  }

  async function refreshStockPrices() {
    // retrive all stocks from db, then get newest stock price for each stock and then update stock prices in db
    const response = await getStocksFromDb()
    const stock_collection = response["data"]
    console.log("stock_collection: ", stock_collection)
  
    const updatePromises = stock_collection.map(async (stock) => {
      const ticker = stock.ticker
      const apiResponse = await getStockData(ticker)
      const newPrice = apiResponse.data[0].price // Corrected
      const StockId = stock._id;
      return updateStockPrice(StockId, newPrice)
    });
  
    await Promise.all(updatePromises);
    refetch(); // Refetch the data after updating all the stock prices
  }
  

  function isStockProfitable(stock) {
    if (stock.last_price > stock.bought_price) {
      return true
    }
    return false
  }

  return (
    <div className="portfolio">
      <div className="navbar">
        <span>total value: {formattedTotalValue}$</span>
        <button onClick={refreshStockPrices}>Refresh Data</button>
      </div>
      <div className="stock-container">
        {data?.data.map((stock) => (
          <div className={`stock-cube ${isStockProfitable(stock) ? 'positive' : 'negative'}`} key={stock._id}>
            <div className="stock-ticker">{stock.ticker}</div>
            <div className="stock-price">{Math.round(stock.value)}$</div>
            <div>
              {Math.round(
                ((stock.last_price - stock.bought_price) / stock.bought_price) *
                100
              )}
              %
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Portfolio;
