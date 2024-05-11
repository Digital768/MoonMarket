import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "@/styles/App.css";
import SharesDialog from "@/components/SharesDialog.jsx";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import PortfolioStockSkeleton from "@/Skeletons/PortfolioStockSkeleton.jsx";
import { addUserPurchase, addUserSale } from '@/api/user'
import { useAuth } from "@/pages/AuthProvider";

function StockPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { stockTicker } = useParams();
  const [dialogOpen, setdialogOpen] = useState(false);
  const [stockData, setStockData] = useState({});
  const [dialog, setDialog] = useState({
    title: "",
    text: "",
    labelText: "",
    function: "",
    buttonText: "",
    stock: stockData,
    token: token,
  });

  const { data, status, refetch } = useQuery({
    queryKey: ["stock", stockTicker],
    queryFn: () => getStockFromDb(stockTicker),
    refetchOnWindowFocus: false,
    retry: 0,
  });

  async function getStockFromDb(stockTicker) {
    const dbStock = await axios.get(
      `http://localhost:8000/stocks/${stockTicker}`
    );
    return dbStock;
  }

  async function deleteStock(id) {
    await axios.delete(`http://localhost:8000/stocks/${id}`);
    refetch();
  }

  const deleteStockWithConfirmation = (id) => {
    if (window.confirm("Are you sure you want to delete this stock?")) {
      deleteStock(id);
      navigate("/");
    }
  };

  function handleClose() {
    setdialogOpen(false);
  }

  const handleAddClick = () => {
    // event.stopPropagation(); // Prevent the parent
    setdialogOpen(true);
    setDialog((prevDialog) => {
      const newDialog = {
        ...prevDialog,
        title: "Add shares",
        text: "To add shares of the stock, please enter how many shares of the stock you bought and at which price.",
        labelText: "Enter bought price",
        function: addUserPurchase,
        buttonText: "Add",
        stock: data.data,
      };
      return newDialog;
    });
  };
  const handleDecreaseClick = () => {
    // event.stopPropagation(); // Prevent the parent
    //TODO if the stock fully sold, navigate to portfolio page
    setdialogOpen(true);
    setDialog((prevDialog) => {
      const newDialog = {
        ...prevDialog,
        title: "Sell shares",
        text: "To sell shares of the stock, please enter how many shares of the stock you sold and at which price.",
        labelText: "Enter sold price",
        function: addUserSale,
        buttonText: "Sell",
        stock: data.data,
      };
      return newDialog;
    });
  };
  useEffect(() => {
    if (status === "success") {
      setStockData(data.data);
    }
    if (status === "error") {
      navigate("/");
    }
  }, [status, data]);

  if (status === 'pending') {
    return <PortfolioStockSkeleton></PortfolioStockSkeleton>
  }

  return (
    <div>
      <nav className="logo-row">
        <a href="/" className="logo">
          MoonMarket
        </a>
      </nav>
      {status === "success" ? (
        <Box
          sx={{
            width: 500,
            height: 500,
            bgcolor: "background.paper",
            p: 1,
            margin: "auto",
            padding: 20,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <button onClick={() => deleteStockWithConfirmation(data.data._id)}>
              delete stock
            </button>
            <button onClick={handleAddClick}> add shares</button>
            <button onClick={handleDecreaseClick}>decrease shares</button>
          </Box>
          <img src={`https://financialmodelingprep.com/image-stock/${stockTicker}.png`} width='100' height='100' alt={stockTicker} className="stock-img"></img>
          <p>stock name is {stockData.name}</p>
          <p>stock ticker is {stockData.ticker}</p>
          <p>stock price is {stockData.price}</p>
          <p>{stockData.description}</p>
        </Box>
      ) : (
        <p>loading</p>
      )}
      {dialogOpen && (
        <SharesDialog
          open={dialogOpen}
          handleClose={handleClose}
          dialog={dialog}
          addUserPurchase={addUserPurchase}
          addUserSale={addUserSale}
        ></SharesDialog>
      )}
    </div>
  );
}

export default StockPage;
