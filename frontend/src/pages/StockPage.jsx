import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "@/styles/App.css";
import SharesDialog from "@/components/SharesDialog.jsx";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import PortfolioStockSkeleton from "@/Skeletons/PortfolioStockSkeleton.jsx";
import { addUserPurchase, addUserSale } from '@/api/user'
import { getStockFromPortfolio } from '@/api/stock'
import { useAuth } from "@/pages/AuthProvider";
import { useLocation } from 'react-router-dom';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';


function StockPage() {
  const navigate = useNavigate();
  const location = useLocation();

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

  const { data, status } = useQuery({
    queryKey: ["stock", stockTicker],
    queryFn: () => getStockFromPortfolio(stockTicker, token),
    refetchOnWindowFocus: false,
    retry: 0,
  });

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
      setStockData(data);
    }
    if (status === "error") {
      navigate("/");
    }
  }, [status, data]);


  return (
    <div>
      <nav className="logo-row">
        <a href="/" className="logo">
          MoonMarket
        </a>
      </nav>
      {status === "success" ? (
        <Card elevation={8}
          sx={{
            width: 800,
            p: 1,
            padding: 7,
            margin: "auto",
            marginTop: "70px"
          }}
        >
          <div className="card-header" style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '26px', margin: '0' }}>{stockData.name}</p>
              <p style={{ fontSize: '18px', margin: '4px' }}> {stockData.ticker}</p>
            </div>
            <img src={`https://financialmodelingprep.com/image-stock/${stockTicker}.png`} width='100' height='100' alt={stockTicker} className="stock-img" style={{ marginLeft: 'auto' }}></img>
          </div>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '2em', justifyContent:'center' }}>
            <Button variant="contained" onClick={handleAddClick}> Buy</Button>
            <Button style={{ background: 'red' }} variant="contained" onClick={handleDecreaseClick}>Sell</Button>
          </Box>
          <p>stock price is {stockData.price}$</p>
          <p>number of shares owned : {location.state.quantity}</p>
          <p>Part of portfolio; {location.state.percentageOfPortfolio}%</p>
          <p>{stockData.description}</p>
          {/* todo: find a way to limit the description to X rows */}
        </Card>
      ) : (
        <PortfolioStockSkeleton />
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
