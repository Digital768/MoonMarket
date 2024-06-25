import TreeMapSkeleton from "@/Skeletons/TreeMapSkeleton";
import DonutSkeleton from "@/Skeletons/DonutSkeleton";
import { updateStockPrice } from "@/api/stock";
import SearchBar from "@/components/SearchBar.jsx";
import { Treemap } from "@/components/Treemap";
import useGraphData from "@/hooks/useGraphData";
import { useAuth } from "@/pages/AuthProvider";
import { getUserData } from "@/api/user";
import { useFetcher, useLoaderData } from "react-router-dom";
import { lastUpdateDate } from "@/utils/dataProcessing";
import { Button, Container, Typography } from "@mui/material";
import { Box } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import SyncIcon from "@mui/icons-material/Sync";
import { GraphContext } from "@/pages/ProtectedRoute";
import { useEffect, useContext } from "react";
import { DonutChart } from "@/components/DonutChart";
import { CircularPacking } from "@/components/CircularPackingChart";
import DetailsChart from "@/components/DetailsChart";
import MarketStatus from "@/components/MarketStatus";
import PortfolioValue from "@/components/AnimatedNumber";

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
};

export const loader = (token) => async () => {
  const user = await getUserData(token);
  return user;
};

function App() {
  const { selectedGraph } = useContext(GraphContext);
  const { token } = useAuth();
  const fetcher = useFetcher();
  const data = useLoaderData();
  const [stockTickers, visualizationData, value, moneySpent, isDataProcessed] =
    useGraphData(data, selectedGraph);
  const { formattedDate } = lastUpdateDate(data);
  const incrementalChange = value - moneySpent;
  const percentageChange = (incrementalChange / value) * 100;

  // useEffect(() => {
  //   console.log(visualizationData);
  // }, [data, visualizationData]);

  const renderGraph = () => {
    // todo: add skeletons or loading component when switching between graphs
    if (!isDataProcessed) {
      switch (selectedGraph) {
        case "DonutChart":
          return <DonutSkeleton />;
        case "Treemap":
        case "Circular":
        case "TableGraph":
        case "Leaderboards":
        default:
          return <TreeMapSkeleton />;
      }
    }

    switch (selectedGraph) {
      case "Treemap":
        return !visualizationData ||
          !visualizationData.children ||
          visualizationData.children.length === 0 ? (
          <TreeMapSkeleton />
        ) : (
          <Treemap data={visualizationData} width={1000} height={600} />
        );
      case "DonutChart":
        return !visualizationData ? (
          <DonutSkeleton />
        ) : (
          <DonutChart data={visualizationData} width={1000} height={650} />
        );
      case "Circular":
        return !visualizationData ? (
          <TreeMapSkeleton />
        ) : (
          <CircularPacking data={visualizationData} width={1100} height={700} />
        );
      case "TableGraph":
        return <DetailsChart data={visualizationData} />;
      case "Leaderboards":
        return <DetailsChart data={visualizationData} />;
      default:
        return null;
    }
  };

  return (
    <Box
      className="App"
      sx={{
        display: "flex",
        flexDirection: "row-reverse",
        height: "100%",
        width: '100%',
        margin: "auto",
      }}
    >

      <Box className="stats"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: 'center',
          width: '25%',
          marginTop: '5%', // This line moves the box down by 30%
          paddingRight: '8em'
        }}
      >
        <Box
          className="portfolio-details"
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <PortfolioValue value={value} />
          <Typography
            variant="body1"
            color={"#596ee7"}
          >
            {incrementalChange.toLocaleString("en-US")}$ (
            {percentageChange.toLocaleString("en-US")}%) Overall
          </Typography>

          <MarketStatus />
        </Box>
        <fetcher.Form method="post">
          <input
            type="hidden"
            name="tickers"
            value={stockTickers.join(",")}
          />
          <input type="hidden" name="token" value={token} />
          <Tooltip
            title={`last updated at: ${formattedDate}. Click to refresh Stocks price`}
            placement="top"
          >
            <Button
              sx={{
                marginTop: "10px",
                justifyContent: "flex-end",
              }}
              variant="outlined"
              type="submit"
              startIcon={<SyncIcon />}
            ></Button>
          </Tooltip>
        </fetcher.Form>
      </Box>
      <Box className="graph"
        sx={{
          margin: "auto",
          padding: 0,
        }}
      >
        {renderGraph()}
      </Box>
    </Box>
  );
}

export default App;
