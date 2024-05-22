import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "@/styles/App.css";
import SharesDialog from "@/components/SharesDialog.jsx";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import PortfolioStockSkeleton from "@/Skeletons/PortfolioStockSkeleton.jsx";
import { addUserPurchase, addUserSale } from "@/api/user";
import { useAuth } from "@/pages/AuthProvider";
import { useLocation } from "react-router-dom";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { ellipsis } from "polished";
import styled from "styled-components";
import { useLoaderData } from "react-router-dom";
import LoadingImage from "@/components/LoadingImage";

const DescriptionText = styled.div`
  font-size: 14px;
  margin-top: 20px;
  margin-bottom: 5px;
  ${({ showMore }) => showMore && ellipsis(undefined, 3)}
`;

function StockPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isShowMore, setIsShowMore] = useState(true);
  const toggleReadMore = () => setIsShowMore((show) => !show);

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

  const data = useLoaderData();

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
        stock: data,
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
        stock: data,
      };
      return newDialog;
    });
  };
  useEffect(() => {
    if (data) {
      setStockData(data);
    }
  }, [data]);

  return (
    <div>
      <Card
        elevation={8}
        sx={{
          width: 800,
          p: 1,
          padding: 7,
          margin: "auto",
          marginTop: "70px",
          bgcolor: "#423F3E",
        }}
      >
        <Box
          className="card-header"
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            color: "whitesmoke",
            width: "65%",
            margin: "auto",
          }}
        >
          <Box className="card-title">
            <h2 style={{ marginBottom: "5px" }}>{stockData.name}</h2>
            <h4 style={{ marginTop: "0px", color: "#fff9" }}>
              {" "}
              {stockData.ticker}
            </h4>

            <LoadingImage
              src={`https://financialmodelingprep.com/image-stock/${stockTicker}.png`}
              width="100"
              height="100"
              alt={stockTicker}
              className="stock-img"
            />
          </Box>
          <Box className="card-details">
            <h3>stock price is {stockData.price}$</h3>
            <h3>number of shares owned : {location.state.quantity}</h3>
            <h3>Part of portfolio; {location.state.percentageOfPortfolio}%</h3>
          </Box>
        </Box>

        <Box
          className="buttons"
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "2em",
            justifyContent: "center",
            padding: "2em",
          }}
        >
          <Button variant="contained" onClick={handleAddClick}>
            {" "}
            Buy
          </Button>
          <Button
            style={{ background: "red" }}
            variant="contained"
            onClick={handleDecreaseClick}
          >
            Sell
          </Button>
        </Box>
        <Box className="description" sx={{ color: "whitesmoke" }}>
          <DescriptionText showMore={isShowMore}>
            Description: {stockData.description}
          </DescriptionText>
          <button
            style={{
              float: "left",
              borderRadius: "5px",
              border: "none",
              marginTop: "5px",
              cursor: "pointer",
              height:'1.5em',
              backgroundColor:'transparent',
              color:'whitesmoke'
            }}
            onClick={toggleReadMore}
          >
            {isShowMore ? "SHOW MORE" : "SHOW LESS"}
          </button>
          {/* todo: find a way to limit the description to X rows */}
        </Box>
      </Card>

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

{
  /* <PortfolioStockSkeleton /> */
}
