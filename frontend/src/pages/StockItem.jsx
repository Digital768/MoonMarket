import React, { useEffect, useState } from "react";
import "@/styles/App.css";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AddStockDialog from "@/components/AddStockDialog.jsx";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import SearchStockSkeleton from "@/Skeletons/SearchStockSkeleton";
import { getStockData } from "@/api/stock";
import { useAuth } from "@/pages/AuthProvider";

function StockItem() {
  const { token } = useAuth();
  const [stockData, setStockData] = useState(null);
  const { stockTicker } = useParams();
  const { data, status, refetch, error } = useQuery({
    queryKey: [{stockTicker, token}], // include stockTicker in the queryKey
    queryFn: () => getStockData(stockTicker, token),
    refetchOnWindowFocus: false,
    enabled: isValidStockTicker(stockTicker),
  });

  function isValidStockTicker(ticker) {
    // Check if ticker is a string and has length between 1 and 5
    if (
      typeof ticker === "string" &&
      ticker.length >= 1 &&
      ticker.length <= 5
    ) {
      // Check if ticker contains only alphabetic characters
      if (/^[A-Za-z]+$/.test(ticker)) {
        // Convert ticker to uppercase
        ticker = ticker.toUpperCase();
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    if (status === "success") {
      const res = data;
      const options = { day: "2-digit", month: "2-digit", year: "numeric" };
      const formattedDate = new Date(
        res.earningsAnnouncement
      ).toLocaleDateString("en-GB", options);

      const stockInfo = {
        ticker: res.symbol,
        name: res.name,
        price: res.price,
        exchange: res.exchange,
        earningsAnnouncement: formattedDate, // use the formattedDate variable here
        priceAvg50: res.priceAvg50,
        priceAvg200: res.priceAvg200,
        yearHigh: res.yearHigh,
        yearLow: res.yearLow,
        imageUrl: res.image,
        sector: res.sector,
        ceo: res.ceo,
        website: res.website,
        description: res.description,
      };

      setStockData(stockInfo);
    }
  }, [status]);

  if (status === "pending") {
    return <SearchStockSkeleton></SearchStockSkeleton>;
  }

  return (
    <div className="layout">
      <nav className="logo-row">
        <Link to="/" className="logo">
          MoonMarket
        </Link>
      </nav>
      <Card elevation={10}
        sx={{
          width: 1300,
          p: 1,
          margin: "auto",
          padding: 4,
        }}
      >
        {status === "error" && <div>Error: {error.message}</div>}
        {status === "success" && stockData && (
          <>
            <h2>
              Stock Symbol: {stockData.ticker} Stock Name: {stockData.name}
            </h2>
            <img
              src={stockData.imageUrl}
              alt={stockData.ticker}
              width="100"
              height="100"
              className="stock-img"
            />
            <h3>Stock Price: {stockData.price}</h3>
            <h3>Stock Exchange: {stockData.exchange}</h3>
            {/* <h3>Next Earnings date: {stockData.earningsAnnouncement}</h3> */}
            <h3>Average 50 days price: {stockData.priceAvg50}</h3>
            <h3>Stock's highest price this year: {stockData.yearHigh}</h3>
            <h3>Stock's lowest price this year: {stockData.yearLow}</h3>
            <h3>Description: {stockData.description}</h3>
            <div className="addStockBox">
              <AddStockDialog stock={stockData} token ={token}></AddStockDialog>
            </div>
          </>
        )}
        {stockData == null && <p>stock ticker isnt valid</p>}
      </Card>
    </div>
  );
}

export default StockItem;
