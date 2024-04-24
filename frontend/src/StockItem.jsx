import React, { useEffect, useState } from 'react'
import "./App.css";
import { useParams } from 'react-router-dom'
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AddStockDialog from "./AddStockDialog.jsx";
import {Link} from "react-router-dom"
import Box from "@mui/material/Box";
import SearchStockSkeleton from "./Skeletons/SearchStockSkeleton";

function StockItem() {
  const [stockData, setStockData] = useState(null)
  const { stockTicker } = useParams();
  const { data, status, refetch, error } = useQuery({
    queryKey: [stockTicker], // include stockTicker in the queryKey
    queryFn: () => getStockData(stockTicker), // wrap getStockData call in another function
    refetchOnWindowFocus: false,
    enabled: isValidStockTicker(stockTicker),
  });
  function isValidStockTicker(ticker) {
    // Check if ticker is a string and has length between 1 and 5
    if (typeof ticker === 'string' && ticker.length >= 1 && ticker.length <= 5) {
      // Check if ticker contains only alphabetic characters
      if (/^[A-Za-z]+$/.test(ticker)) {
        // Convert ticker to uppercase
        ticker = ticker.toUpperCase();
        return true;
      }
    }
    return false;
  }
  async function getStockData(ticker) {
    return axios.get(`http://localhost:8000/stocks/api/quote/${ticker}`);
  }
  useEffect(() => {
    if (data && data.data && data.data[0]) {
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      const formattedDate = new Date(data.data[0].earningsAnnouncement).toLocaleDateString('en-GB', options);
      
      // Create a new object from data.data[0] with 'symbol' replaced by 'ticker'
      const newData = { ...data.data[0], ticker: data.data[0].symbol };
      delete newData.symbol;
  
      setStockData({ ...newData, earningsAnnouncement: formattedDate });
    }
  }, [data]);

  if (status === 'pending'){
    return <SearchStockSkeleton></SearchStockSkeleton>
  }

  return (
    <div className="layout">
      <nav className="logo-row">
        <Link to="/" className="logo">
          MoonMarket
        </Link>
      </nav>
      <Box sx={{ width: 500, height: 500, bgcolor: "background.paper", p: 1, margin:'auto', padding: 20 }}>
        {status === 'error' && <div>Error: {error.message}</div>}
        {status === 'success' && stockData && (
          <>
            <h2>
              Stock Symbol: {stockData.ticker} Stock Name: {stockData.name}
            </h2>
            <h3>Stock Price: {stockData.price}</h3>
            <h3>Stock Exchange: {stockData.exchange}</h3>
            <h3>Next Earnings date: {stockData.earningsAnnouncement}</h3>
            <h3>Average 50 days price: {stockData.priceAvg50}</h3>
            <h3>Average 200 days price: {stockData.priceAvg200}</h3>
            <h3>Stock's highest price this year: {stockData.yearHigh}</h3>
            <h3>Stock's lowest price this year: {stockData.yearLow}</h3>
            <div className="addStockBox">
            <AddStockDialog stock={stockData}></AddStockDialog>
          </div>
          </>
        )}
        {stockData == null && (
          <p>stock ticker isnt valid</p>
        )}
      </Box>
    </div>
  );
}

export default StockItem;
