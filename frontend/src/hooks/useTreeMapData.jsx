import { useAuth } from "@/pages/AuthProvider";
import "@/styles/App.css";
import "@/styles/portfolio.css";
import { processTreemapData } from "@/utils/dataProcessing.js";
import { useEffect, useState } from "react";

function useTreeMapData(data) {
  const { token } = useAuth();
  const [stockTickers, setStockTickers] = useState([]);
  const [visualizationData, setVisualizationData] = useState(null);
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (data) { 
      async function processData() {
        const { newStocksTree, tickers, sum } = await processTreemapData(
          data.data,
          token
        );
        setVisualizationData(newStocksTree);
        setStockTickers(tickers);
        setValue(sum)

      }
      processData();
    }
  }, [data]);

  return [stockTickers, visualizationData, value];
}

export default useTreeMapData;
