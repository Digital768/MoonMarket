import '@/styles/App.css';
import '@/styles/portfolio.css';
import TreeMapSkeleton from "@/Skeletons/TreeMapSkeleton";
import SearchBar from "@/components/SearchBar.jsx";
import { Treemap } from "@/components/Treemap";
import Button from "@mui/material/Button";
import { useLoaderData, useLocation, useFetcher } from "react-router-dom";
import useTreeMapData from "@/hooks/useTreeMapData";
import { calculateUserInfo } from '@/utils/dataProcessing'
import { useEffect } from "react";
import { useAuth } from "@/pages/AuthProvider";
import {updateStockPrice} from '@/api/stock'

function App() {
  const { token } = useAuth();
  const fetcher = useFetcher();
  const data = useLoaderData();
  const [stockTickers, visualizationData, value] = useTreeMapData(data);
  const { deposit, formattedDate } = calculateUserInfo(data);
  const location = useLocation();

  async function refreshPrices(tickers, location, token) {
    if (!tickers || tickers.length === 0) {
      console.warn("No tickers available for price update.");
      return;
    }
  
    if (!token) {
      console.warn("No authentication token available.");
      return;
    }
  
    try {
      const promises = tickers.map(ticker => updateStockPrice(ticker, token));
      const results = await Promise.allSettled(promises);
  
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          console.log(`Successfully updated ${tickers[index]}:`, result.value);
        } else {
          console.error(`Failed to update ${tickers[index]}:`, result.reason);
        }
      });
  
      fetcher.load(location.pathname);
      return results;
    } catch (error) {
      console.error("Error updating stock prices:", error);
    }
  }
  

  useEffect(() => {
    console.log(fetcher.data)
    if (data) {
      console.log("Data updated:", data);
    } else {
      console.log("No data");
    }
  }, [data, fetcher.data]);

  return (
    <div className="App">
      <SearchBar />
      <div className="navbar">
        <p>{" deposit: " + deposit.toLocaleString("en-US")}$</p>
        <p>{"last updated at: " + formattedDate}</p>
        <p>{"total value: " + value.toLocaleString("en-US")}$</p>
        <Button variant="text" style={{ "padding": 0 }} onClick={() => refreshPrices(stockTickers,location, token)}>Update prices</Button>
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
