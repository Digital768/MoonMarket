import React, { useState } from "react";
import axios from "axios";
import StockItem from "./StockItem.js";
import FormDialog from "./FormDialog.js";
import "./App.css";


function App() {
  const [tickerInput, setTickerInput] = useState(""); // State to store the typed ticker input
  const [stock, setStock] = useState({
    name: "",
    price: 0,
    ticker: "",
    exchange: "",
    nextEarningsAnnouncement: '',
    priceAvg50: 0,
    priceAvg200: 0,
    yearHigh: 0,
    yearLow: 0
  });
  const [stockSearched, setStockSearched] = useState(false); // State to track if a stock has been searched

  const handleChange = (event) => {
    setTickerInput(event.target.value); // Update the typed ticker input
  };

  async function getApiStocks(ticker) {
    return axios.get(`http://localhost:8000/stocks/api/quote/${ticker}`);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await getApiStocks(tickerInput); // Wait for the promise to resolve
      const stockResponse = response.data[0];
      const EarningsDate = stockResponse.earningsAnnouncement
      const dateObj = new Date(EarningsDate);
      const formattedEarningsDate = `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;
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
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="App">
      <nav className="logo-row">
      <a className="logo">MoonMarket</a>
      </nav>
      <form onSubmit={handleSubmit}>
        <input className="search-stock"
          type="text"
          name="ticker"
          value={tickerInput} // Bind input value to tickerInput state
          onChange={handleChange}
          placeholder="Stock ticker"
        />
        <button type="submit">Search</button>
      </form>
      <div>
        <StockItem {...stock} />
      </div>
      <div>
      {stockSearched && ( // Render FormDialog only if a stock has been searched
        <div className="addStockBox">
          <FormDialog stock={stock}></FormDialog>
        </div>
      )}
      </div>
    </div>
  );
}

export default App;
