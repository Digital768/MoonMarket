import React, { useState } from "react";
import axios from "axios";
import StockItem from "./StockItem.jsx";
import FormDialog from "./AddStockDialog.jsx";
import "./App.css";
import { CiSearch } from "react-icons/ci";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Portfolio from "./Portfolio.jsx";
import {Link} from "react-router-dom"

const queryClient = new QueryClient();

function App() {
  const [tickerInput, setTickerInput] = useState(""); // State to store the typed ticker input
  const [portfolioVisible, setPortfolioVisible] = useState(true); // State to track if portfolio is visible
  const [stock, setStock] = useState({
    name: "",
    price: 0,
    ticker: "",
    exchange: "",
    nextEarningsAnnouncement: "",
    priceAvg50: 0,
    priceAvg200: 0,
    yearHigh: 0,
    yearLow: 0,
  });
  const [stockSearched, setStockSearched] = useState(false); // State to track if a stock has been searched

  const handleChange = (event) => {
    setTickerInput(event.target.value); // Update the typed ticker input
  };

  async function getStockData(ticker) {
    return axios.get(`http://localhost:8000/stocks/api/quote/${ticker}`);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await getStockData(tickerInput); // Wait for the promise to resolve
    const stockResponse = response.data[0];
    if (stockResponse === undefined) {
      return alert("stock not found");
    }
    const EarningsDate = stockResponse.earningsAnnouncement;
    const dateObj = new Date(EarningsDate);
    const formattedEarningsDate = `${dateObj.getDate()}-${
      dateObj.getMonth() + 1
    }-${dateObj.getFullYear()}`;
    setStock({
      ...stock,
      price: stockResponse.price,
      name: stockResponse.name,
      ticker: tickerInput.toUpperCase(), // Set the ticker after submission
      exchange: stockResponse.exchange,
      nextEarningsAnnouncement: formattedEarningsDate,
      priceAvg50: stockResponse.priceAvg50,
      priceAvg200: stockResponse.priceAvg200,
      yearHigh: stockResponse.yearHigh,
      yearLow: stockResponse.yearLow,
    });
    setTickerInput(""); // Clear the input value after submission
    setStockSearched(true); // Set stockSearched to true after the stock has been searched
    setPortfolioVisible(false)
  };

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <nav className="logo-row">
          <Link to="/" className="logo">
            MoonMarket
          </Link>
        </nav>
        <form onSubmit={handleSubmit}>
          <div className="search-bar">
            <div className="search-container">
            <CiSearch className="search-icon"/> {/* Place CiSearch component before the input */}
            <input
              className="search-input"
              type="text"
              name="ticker"
              value={tickerInput}
              onChange={handleChange}
              placeholder="Enter ticker"
            />
            <input type="submit" hidden />
            </div>
          </div>
        </form>
        {portfolioVisible && (<Portfolio getStockData ={getStockData}></Portfolio>)}
        {stockSearched && stock && (
          <div className="stock-data">
            <div className="stock-info">
              <StockItem {...stock} />
            </div>
            <div className="addStockBox">
              <FormDialog stock={stock} setPortfolioVisible ={setPortfolioVisible} setStockSearched ={setStockSearched}></FormDialog>
            </div>
          </div>
        )}
      </QueryClientProvider>
    </div>
  );
}

export default App;
