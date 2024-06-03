import axios from "axios";

export async function getUserTransactions(token) {

    const transactions = await axios.get("http://localhost:8000/user/user_transactions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return transactions.data;
  }