import axios from "axios";

export async function postApiStock(portfolioStock, token) {
  return axios.post("http://localhost:8000/stocks/add_stock", portfolioStock, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getStockData(ticker) {
  const data = await axios.get(`http://localhost:8000/stocks/quote/${ticker}`);
  return data
}