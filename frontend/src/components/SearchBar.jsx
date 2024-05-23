import '@/styles/searchBar.css';
import SearchIcon from '@mui/icons-material/Search';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [tickerInput, setTickerInput] = useState(""); // State to store the typed ticker input
  const navigate = useNavigate();

  const handleChange = (event) => {
    setTickerInput(event.target.value); // Update the typed ticker input
  };
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

  const navigateToStockPage = (ticker) => {
    navigate(`/stock/${ticker}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidStockTicker(tickerInput)) {
      navigateToStockPage(tickerInput);
    } else {
      // Handle invalid ticker input
      alert("Please enter a valid ticker");
    }
  };


  return (

    <div className="search-bar">
      <div className="search-container">
        <form onSubmit={handleSubmit}>
          {/* <CiSearch className="search-icon" />{" "} */}
          {/* Place CiSearch component before the input */}
          <TextField
            // className="search-input"
            type="text"
            name="ticker"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            value={tickerInput}
            onChange={handleChange}
            placeholder="Enter ticker"
          />
          <input type="submit" hidden />
        </form >
      </div>
    </div>

  )
}

export default SearchBar