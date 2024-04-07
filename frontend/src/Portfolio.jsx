import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import "./portfolio.css";
import { IoMdClose } from "react-icons/io";
import CardHover from "./CardHover";

function Portfolio({ getStockData }) {
  const [totalValue, setTotalValue] = useState(0);
  const [hoveredStockId, setHoveredStockId] = useState(null);
  const stockContainerRef = useRef(null);

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

  async function delteStock(id) {
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
      <div className="stock-container">
        {data?.data?.map((stock) => (
          <div
            className={`stock-cube ${isStockProfitable(stock) ? "positive" : "negative"}`}
            key={stock._id}
            style={{ height: `${(stock.value / totalValue) * 100}%`}}
            onMouseEnter={() => setHoveredStockId(stock._id)}
            onMouseLeave={() => setHoveredStockId(null)}
          >
            <IoMdClose className="delete-stock-btn" onClick={() => delteStock(stock._id)} />
            <div className="stock-ticker">{stock.ticker}</div>
            <div className="profit-percentage">
              {Math.round(((stock.last_price - stock.bought_price) / stock.bought_price) * 100)}%
            </div>
            {/* {hoveredStockId === stock._id && (
            <CardHover stock = {stock} inYourPorfolio ={(stock.value / totalValue) * 100} containerRef={stockContainerRef}></CardHover>
            )} */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Portfolio