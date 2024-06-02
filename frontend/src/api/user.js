import axios from "axios";
import { postApiStock } from "@/api/stock";

export async function getUserData(token) {

  const user = await axios.get("http://localhost:8000/user/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return user;
}

export async function getUserName(token) {
  
  const userName = await axios.get("http://localhost:8000/user/name", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return userName;
}

export async function loginUser(email, password) {
  const response = await axios.post("http://localhost:8000/auth/login", {
    email,
    password,
  });
  return response;
}

export async function refreshJwtKey(token) {
  const response = await axios.post(
    'http://localhost:8000/auth/refresh',
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
  );
  return response;
}

export async function addUserPurchase(price, ticker, quantity, token) {
  const response = await axios.post(
    "http://localhost:8000/transaction/buy_stock",
    null, // Set the request body to null if your API doesn't expect a request body
    {
      params: { price, ticker, quantity }, // Send the required fields as query parameters
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}

export async function addUserSale(ticker, quantity, price, token) {
  const response = await axios.post(
    "http://localhost:8000/transaction/sell_stock",
    null, // Set the request body to null if your API doesn't expect a request body
    {
      params: { ticker, quantity, price }, // Send the required fields as query parameters
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}


export async function addStockToPortfolio(
  portfolioStock,
  price,
  quantity,
  token
) {
  const ticker = portfolioStock.ticker;
  const stock = await axios.post(
    "http://localhost:8000/stocks/add_stock",
    portfolioStock,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const user = await axios.post(
    "http://localhost:8000/transaction/buy_stock",
    null, // Set the request body to null if your API doesn't expect a request body
    {
      params: { price, ticker, quantity }, // Send the required fields as query parameters
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
