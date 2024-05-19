import React, { useEffect, useState } from "react";
import "@/styles/App.css";
import { useParams } from "react-router-dom";
import AddStockDialog from "@/components/AddStockDialog.jsx";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import SearchStockSkeleton from "@/Skeletons/SearchStockSkeleton";
import { useAuth } from "@/pages/AuthProvider";
import { ellipsis } from 'polished';
import styled from 'styled-components';
import { Box } from "@mui/material";
import { useLoaderData } from "react-router-dom";


const DescriptionText = styled.div`
  font-size: 14px;
  margin-top: 20px;
  margin-bottom: 5px;
  ${({ showMore }) => showMore && ellipsis(undefined, 3)}
`;



function StockItem() {
  const { token } = useAuth();
  const data = useLoaderData();
  const [stockData, setStockData] = useState(null);

  const [isShowMore, setIsShowMore] = useState(true);
  const toggleReadMore = () => setIsShowMore(show => !show);



  useEffect(() => {
    if (data) {
      const res = data;
      const options = { day: "2-digit", month: "2-digit", year: "numeric" };
      const formattedDate = new Date(
        res.earningsAnnouncement
      ).toLocaleDateString("en-GB", options);

      const stockInfo = {
        ticker: res.symbol,
        name: res.name,
        price: res.price,
        exchange: res.exchange,
        earningsAnnouncement: formattedDate, // use the formattedDate variable here
        priceAvg50: res.priceAvg50,
        priceAvg200: res.priceAvg200,
        yearHigh: res.yearHigh,
        yearLow: res.yearLow,
        imageUrl: res.image,
        sector: res.sector,
        ceo: res.ceo,
        website: res.website,
        description: res.description,
      };

      setStockData(stockInfo);
    }
  }, [data]);



  return (
    <div className="layout">
      <Card elevation={8}
        sx={{
          width: 1300,
          p: 1,
          margin: "auto",
          padding: 4,
          marginTop: "80px",
          bgcolor: "#423F3E",
          color: 'whitesmoke'
        }}
      >

        {stockData && (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box className="card-header" sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '80%', margin: 'auto' }} >
                <Box className="card-title">
                  <h2 style={{ marginBottom: '5px' }}>
                    {stockData.name}
                  </h2>
                  <h4 style={{ marginTop: '0px', color: '#fff9' }}> {stockData.ticker}</h4>

                  <img
                    src={stockData.imageUrl}
                    alt={stockData.ticker}
                    width="100"
                    height="100"
                    className="stock-img"
                  />
                </Box>
                <Box className="card-details" sx={{}}>
                  <h3>Stock Price: {stockData.price}$</h3>
                  <h3>Stock Exchange: {stockData.exchange}</h3>
                  {/* <h3>Next Earnings date: {stockData.earningsAnnouncement}</h3> */}
                  <h3>Average 50 days price: {stockData.priceAvg50}$</h3>
                  <h3>Stock's highest price this year: {stockData.yearHigh}$</h3>
                  <h3>Stock's lowest price this year: {stockData.yearLow}$</h3>
                </Box>
              </Box>
              <Box className='description'>
                <DescriptionText showMore={isShowMore}>{stockData.description}</DescriptionText>
                <button style={{ float: "right", borderRadius: '10px', border: 'none', marginTop: '10px', cursor: 'pointer' }} onClick={toggleReadMore}>
                  {isShowMore ? "Show more..." : "Show less"}
                </button>
                <div className="addStockBox" style={{ marginTop: '20px' }}>
                  <AddStockDialog stock={stockData} token={token}></AddStockDialog>
                </div>
              </Box>
            </Box>
          </>
        )}
        {stockData == null && <p>stock ticker isnt valid</p>}
      </Card>
    </div>
  );
}

export default StockItem;
