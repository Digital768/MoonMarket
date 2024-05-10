import axios from "axios";

export async function postApiStock(portfolioStock, token) {
  return axios.post("http://localhost:8000/stocks/add_stock", portfolioStock, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getStockData(ticker, token) {
  const stock = await axios.get(`http://localhost:8000/stocks/quote/${ticker}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return stock.data
}

export async function getStockFromPortfolio(ticker, token) {
  const stock = await axios.get(`http://localhost:8000/stocks/${ticker}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return stock.data
}

export async function updateStockPrice(ticker, token){
  const stock = await axios.put(`http://localhost:8000/stocks/update_stock_price/${ticker}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}
