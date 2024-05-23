import TreeMapSkeleton from "@/Skeletons/TreeMapSkeleton";
import { updateStockPrice } from "@/api/stock";
import SearchBar from "@/components/SearchBar.jsx";
import { Treemap } from "@/components/Treemap";
import useTreeMapData from "@/hooks/useTreeMapData";
import { useAuth } from "@/pages/AuthProvider";
import {getUserData} from '@/api/user'
import { useFetcher, useLoaderData } from "react-router-dom";
import {calculateUserInfo} from '@/utils/dataProcessing'
import { Button } from "@mui/material";
import ShowChartIcon from '@mui/icons-material/ShowChart';

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
  const [stockTickers, visualizationData, value] = useTreeMapData(data);
  const { deposit, formattedDate } = calculateUserInfo(data);

  // useEffect(() => {
  //   console.log(fetcher.data)
  //   if (data) {
  //     console.log("Data updated:", data);
  //   } else {
  //     console.log("No data");
  //   }
  // }, [data, fetcher.data]);

  return (
    <div className="App">
      <SearchBar />
      <div className="navbar">
        <p>{" Deposit: " + deposit.toLocaleString("en-US")}$</p>
        <p>{"Total Value: " + value.toLocaleString("en-US")}$</p>
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
