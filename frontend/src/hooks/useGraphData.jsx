import { useAuth } from "@/pages/AuthProvider";
import "@/styles/App.css";
import "@/styles/portfolio.css";
import { processTreemapData, getPortfolioStats, processDonutData } from "@/utils/dataProcessing.js";
import { useEffect, useState } from "react";

function useGraphData(data, selectedGraph) {
  const { token } = useAuth();
  const [stockTickers, setStockTickers] = useState([]);
  const [visualizationData, setVisualizationData] = useState(null);
  const [value, setValue] = useState(0);
  const [moneySpent, setMoneySpent] = useState(0);
  const [isDataProcessed, setIsDataProcessed] = useState(false);

  useEffect(() => {
    if (data) {
      async function processData() {
        setIsDataProcessed(false);  // Set to false before processing starts
        let graphData;
        switch (selectedGraph) {
          case "Treemap":
            graphData = await processTreemapData(data.data, token);
            break;
          case "DonutChart":
            graphData = await processDonutData(data.data, token);
            break;
          // Add cases for other graph types if needed
          default:
            graphData = await processTreemapData(data.data, token);
        }

        const { tickers, sum, totalSpent } = await getPortfolioStats(data.data, token);
        setVisualizationData(graphData);
        setStockTickers(tickers);
        setValue(sum);
        setMoneySpent(totalSpent);
        setIsDataProcessed(true);  // Set to true after processing completes
      }
      processData();
    }
  }, [data, selectedGraph]);

  return [stockTickers, visualizationData, value, moneySpent, isDataProcessed];
}

export default useGraphData;
