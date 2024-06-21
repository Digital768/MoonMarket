import { useAuth } from "@/pages/AuthProvider";
import "@/styles/App.css";
import "@/styles/portfolio.css";
import { processTreemapData, getPortfolioStats, processDonutData, processCircularData, processTableData } from "@/utils/dataProcessing.js";
import { useEffect, useState } from "react";
import useHoldingsData from '@/hooks/useHoldingsData'

function useGraphData(data, selectedGraph) {
  const { token } = useAuth();
  const stockList = data.data.holdings
  const stocksInfo = useHoldingsData(stockList, token)
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
        //need to check this condition
        if (stocksInfo.length > 0) {
          switch (selectedGraph) {
            case "Treemap":
              graphData = await processTreemapData(data.data, token);
              break;
            case "DonutChart":
              graphData = await processDonutData(data.data, token);
              break;
            // Add cases for other graph types if needed
            case "Circular":
              graphData = await processCircularData(data.data, token)
              break;
            case "TableGraph":
              graphData = processTableData(stockList, stocksInfo)
              break;
            default:
              graphData = await processTreemapData(data.data, token);
          }
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
  }, [data, selectedGraph, stocksInfo]);

  return [stockTickers, visualizationData, value, moneySpent, isDataProcessed];
}

export default useGraphData;
