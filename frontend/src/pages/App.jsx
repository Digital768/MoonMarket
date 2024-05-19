import TreeMapSkeleton from "@/Skeletons/TreeMapSkeleton";
import SearchBar from "@/components/SearchBar.jsx";
import { Treemap } from "@/components/Treemap";
import { useAuth } from "@/pages/AuthProvider";
import "@/styles/portfolio.css";
import Button from "@mui/material/Button";
import { useLoaderData } from "react-router-dom";
import useTreeMapData from "@/hooks/useTreeMapData";
import { calculateUserInfo } from '@/utils/dataProcessing'
import { useEffect } from "react";
import '@/styles/App.css';
import '@/styles/portfolio.css';

function App() {
  const data = useLoaderData();
  const [stockTickers, visualizationData, value] = useTreeMapData(data);
  const { deposit, formattedDate } = calculateUserInfo(data);

  return (
    <div className="App">
      <SearchBar />
      <div className="navbar">
        <p>{" deposit: " + deposit.toLocaleString("en-US")}$</p>
        <p>{"last updated at: " + formattedDate}</p>
        <p>{"total value: " + value.toLocaleString("en-US")}$</p>
        {/* <Button variant="text" style={{ "padding": 0 }} onClick={() => refreshPrices(tickers)}>Update prices</Button> */}
        <Button variant="text" style={{ padding: 0 }}>
          Update prices
        </Button>
      </div>
      <div className="portfolio">
        {!visualizationData ? (
          <TreeMapSkeleton />
        ) : (
          <Treemap data={visualizationData} width={1000} height={600} />
        )}
      </div>
    </div>
  );
}

export default App;
