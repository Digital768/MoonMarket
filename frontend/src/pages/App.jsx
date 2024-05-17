import React, { useEffect, useState } from "react";
import "@/styles/App.css";
import { useLoaderData, } from "react-router-dom";
import Logo from "@/components/Logo.jsx";
import SearchBar from "@/components/SearchBar.jsx";
import { useAuth } from "@/pages/AuthProvider";
import { Treemap } from "@/components/Treemap";
import { processTreemapData } from '@/utils/dataProcessing.js'
import TreeMapSkeleton from "@/Skeletons/TreeMapSkeleton";
import "@/styles/portfolio.css";
import Button from '@mui/material/Button';

function App() {
  const data = useLoaderData();
  const { token } = useAuth();
  const [stockTickers, setStockTickers] = useState([]);
  const [visualizationData, setVisualizationData] = useState(null);
  const [deposit, setDeposit] = useState(0);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [totalValue, setTotalValue] = useState(0);


  useEffect(() => {
    console.log(data)
    if (data) {
      async function processData() {
        const { newStocksTree, tickers } = await processTreemapData(data.data, token);
        setVisualizationData(newStocksTree);
        setStockTickers(tickers);
      }
      processData()
    }
  }, [data])


  return (
    <div className="App">
      
        <Logo />
        <SearchBar />
        <div className="navbar">
          <span>Portfolio value: {totalValue.toLocaleString("en-US")}$</span>
          <span>deposit: {deposit.toLocaleString("en-US")}$</span>
          <span>last updated at: {updatedAt}</span>
          {/* <Button variant="text" style={{ "padding": 0 }} onClick={() => refreshPrices(tickers)}>Update prices</Button> */}
          <Button variant="text" style={{ "padding": 0 }}>Update prices</Button>
        </div>
        <div className="portfolio">
        {!visualizationData ? (
          <TreeMapSkeleton />
        ) : (
          <Treemap data={visualizationData} width={1000} height={600} />
        )}
        {/* <Portfolio /> */}
      </div>
    </div>
  );
}

export default App;
