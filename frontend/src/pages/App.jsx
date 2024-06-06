import TreeMapSkeleton from "@/Skeletons/TreeMapSkeleton";
import { updateStockPrice } from "@/api/stock";
import SearchBar from "@/components/SearchBar.jsx";
import { Treemap } from "@/components/Treemap";
import useTreeMapData from "@/hooks/useTreeMapData";
import { useAuth } from "@/pages/AuthProvider";
import { getUserData } from '@/api/user'
import { useFetcher, useLoaderData } from "react-router-dom";
import { calculateUserInfo } from '@/utils/dataProcessing'
import { Button } from "@mui/material";
import { Box } from "@mui/material";
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { useEffect } from "react";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const tickers = formData.get("tickers").split(",");
  const token = formData.get("token");

  if (!tickers || tickers.length === 0) {
    console.warn("No tickers available for price update.");
    return null;
  }

  if (!token) {
    console.warn("No authentication token available.");
    return null;
  }

  try {
    const promises = tickers.map((ticker) => updateStockPrice(ticker, token));
    const results = await Promise.allSettled(promises);

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        // console.log(`Successfully updated ${tickers[index]}:`, result.value);
      } else {
        console.error(`Failed to update ${tickers[index]}:`, result.reason);
      }
    });

    return results;
  } catch (error) {
    console.error("Error updating stock prices:", error);
    return null;
  }
}

export const loader = (token) => async () => {
  // console.log("loader activated")
  const user = await getUserData(token)
  // console.log("user: " , user.data)
  return user
}

function App() {
  const { token } = useAuth();
  const fetcher = useFetcher();
  const data = useLoaderData();
  const [stockTickers, visualizationData, value, moneySpent] = useTreeMapData(data);
  const { current_balance, formattedDate } = calculateUserInfo(data);
  const incrementalChange = (value-moneySpent)
  const percentageChange = ((incrementalChange / value) * 100)
  // useEffect(() => {
  //   console.log("visualizationData is: ", visualizationData)
  // }, [data, visualizationData]);

  return (
    <div className="App">
      <SearchBar />
      <div className="navbar">
        <p>{" Current balance: " + current_balance.toLocaleString("en-US")}$</p>
        <p>{"Total Value: " + value.toLocaleString("en-US")}$</p>
        <Box sx={{display:'flex', gap:1}}>
        <p>Incremental change:</p>
        <Box sx={{display:'flex', flexDirection:'column'}}>
        <p>{incrementalChange.toLocaleString("en-US")}$</p>
        <span style={{textAlign:'right'}}>{percentageChange.toLocaleString("en-US")}%</span>
        </Box>
        </Box>
        <Box sx={{display:'flex', flexDirection:'column', gap:1}}>
        <p>{"Last Updated at: " + formattedDate}</p>
        <fetcher.Form method="post">
          <input type="hidden" name="tickers" value={stockTickers.join(",")} />
          <input type="hidden" name="token" value={token} />
          <Button
            variant="outlined"
            type="submit"
            startIcon={<ShowChartIcon />}
          >
            Update prices
          </Button>
        </fetcher.Form> 
        </Box>
      </div>
      <div className="portfolio">
        {!visualizationData || visualizationData.children.length === 0 ? (
          <TreeMapSkeleton />
        ) : (
          <Treemap data={visualizationData} width={1000} height={600} />
        )}
      </div>
    </div>
  );
}

export default App;
