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
  });
  const [stockSearched, setStockSearched] = useState(false); // State to track if a stock has been searched

  const handleChange = (event) => {
    setTickerInput(event.target.value); // Update the typed ticker input
  };

  async function getApiStocks(ticker) {
    return axios.get(`http://localhost:8000/api/quote/${ticker}`);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await getApiStocks(tickerInput); // Wait for the promise to resolve
      const stockResponse = response.data[0];
      setStock({
        ...stock,
        price: stockResponse.price,
        name: stockResponse.name,
        ticker: tickerInput.toUpperCase(), // Set the ticker after submission
        exchange: stockResponse.exchange,
      });
      setTickerInput(""); // Clear the input value after submission
      setStockSearched(true); // Set stockSearched to true after the stock has been searched
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="App">
      <nav></nav>
      <h1>MOONMARKET</h1>
      <form onSubmit={handleSubmit}>
        <label>Stock ticker</label>
        <input
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
