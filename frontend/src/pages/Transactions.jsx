import React, { useEffect } from "react";
import { getUserTransactions } from "@/api/transaction";
import { useLoaderData } from "react-router-dom";
import CustomizedTables from "@/components/TransactionsTable";
import { Divider, Container } from "@mui/material";

export const loader = (token) => async () => {
  const transactions = await getUserTransactions(token);
  return transactions;
};

function Transactions() {
  const data = useLoaderData();


  return (
    <div>
      <Divider />
      <div className="heading-text">
        <h2
          style={{
            textAlign: "center",
            margin: "auto",
            cursor: "pointer",
            color: "#049985",
            width: "200px",
          }}
          className="underline-effect"
        >
          TRANSACTIONS
        </h2>
      </div>
      <Divider />
      <Container>
        <CustomizedTables data={data} />
      </Container>
    </div>
  );
}

export default Transactions;
