import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import "./portfolio.css";

function Portfolio({getStockData}) {
  const [totalValue, setTotalValue] = useState(0);

  async function getStocksFromDb() {
    const dbStocks = await axios.get("http://localhost:8000/stocks/");
    console.log(dbStocks)
    return dbStocks
  }

  async function updateStockPrice(id, new_price){
    await axios.put(`http://localhost:8000/stocks/${id}`, new_price )
  }

  const { data, status } = useQuery({
    queryKey: ["stocks"],
    queryFn: getStocksFromDb,
  });

  useEffect(() => {
    if (data?.data) {
      const stockValues = data.data.map((stock) => ({ value: stock.value }));
      const sum = stockValues.reduce((acc, obj) => acc + obj.value, 0);
      setTotalValue(Math.round(sum));
    }
  }, [data]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "error") {
    return <p>Error</p>;
  }

  const formattedTotalValue = totalValue.toLocaleString("en-US");
  async function refreshStockPrices(){
    // retrive all stocks from db, then get newest stock price for each stock and then update stock prices in db
    const response = await getStocksFromDb()
    const stock_collection = response["data"]
    for (const stock of stock_collection){
      const ticker = stock.ticker
      const apiResponse = getStockData(ticker)
      const stockResponse = response.data[0];
      const newPrice = stockResponse.price;
      const StockId = stock._id; 
      await updateStockPrice(StockId, newPrice)
    }
  }

 function isStockProfitable(stock) {
  if(Math.round(((stock.last_price - stock.bought_price) / stock.bought_price) * 100) >= 0){
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
