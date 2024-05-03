import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import "./portfolio.css";
import { Treemap } from "./Treemap";
import TreeMapSkeleton from "./Skeletons/TreeMapSkeleton";
import { useAuth } from "./AuthProvider";


function Portfolio() {
  const { token } = useAuth();
  const [totalValue, setTotalValue] = useState(0);
  const [stocksTree, setStocksTree] = useState(null); // Define stocksTree state
  const [stocks, setStocks] = useState(null);

  const { data, status, refetch } = useQuery({
    queryKey: [token],
    queryFn: getUserData,
    refetchOnWindowFocus: false,
  });


  async function getUserData() {
    return await axios.get('http://localhost:8000/user/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

  }


  // async function refreshStockPrices() {
  //   const response = await getStocksFromDb();
  //   const stock_collection = response["data"];

  //   const updatePromises = stock_collection.map(async (stock) => {
  //     const ticker = stock.ticker;
  //     const apiResponse = await getStockData(ticker);
  //     const newPrice = apiResponse.data[0].price;
  //     const StockId = stock._id;
  //     return updateStockPrice(StockId, newPrice);
  //   });

  //   await Promise.all(updatePromises);
  //   refetch();
  // }


  useEffect(() => {
    // if (Array.isArray(data?.data) && data.data.length !== 0) {
    //   setStocks(data.data.holdings)
    // }
    //   const stockCollection = data.data.holdings
  //     const sum = data.data.reduce((acc, stock) => acc + stock.value, 0);
  //     setTotalValue(Math.round(sum*100)/100)
  //     const positiveStocks = [];
  //     const negativeStocks = [];

  //     stockCollection.forEach((stock) => {
  //       const stock_avg_price = calculate_average_price(stock);
  //       const quantity = calculate_total_quantity(stock);
  //       if (isStockProfitable(stock)) {
  //         positiveStocks.push({
  //           name: stock.name,
  //           id: stock._id,
  //           ticker: stock.ticker,
  //           value: Math.round(stock.value*100)/100,
  //           avgSharePrice: Math.round(stock_avg_price*100)/100,
  //           last_price: Math.round(stock.last_price*100)/100,
  //           quantity: quantity,
  //           priceChangePercentage: Math.round(
  //             ((stock.last_price - stock_avg_price) / stock_avg_price) * 100
  //           ),  
  //           percentageOfPortfolio: Math.round(
  //             (stock.value / Math.round(sum)) * 100
  //           ),
  //         });
  //       } else {
  //         negativeStocks.push({
  //           name: stock.name,
  //           ticker: stock.ticker,
  //           id: stock._id,
  //           value: Math.round(stock.value*100)/100,
  //           avgSharePrice: Math.round(stock_avg_price*100)/100,
  //           last_price: Math.round(stock.last_price*100)/100,
  //           quantity: quantity,
  //           priceChangePercentage: Math.round(
  //             ((stock.last_price - stock_avg_price) / stock_avg_price) * 100
  //           ),
  //           percentageOfPortfolio: Math.round(
  //             (stock.value / Math.round(sum)) * 100
  //           ),
  //         });
  //       }
  //     });

  //     const newStocksTree = {
  //       name: "Stocks",
  //       value: 0,
  //       children: [],
  //     };

  //     if (positiveStocks.length > 0) {
  //       newStocksTree.children.push({
  //         name: "Positive",
  //         value: 0,
  //         children: positiveStocks,
  //       });
  //     }

  //     if (negativeStocks.length > 0) {
  //       newStocksTree.children.push({
  //         name: "Negative",
  //         value: 0,
  //         children: negativeStocks,
  //       });
  //     }

  //     setStocksTree(newStocksTree); // Trigger a re-render of the Treemap
  //   }
  //   else {
  //      setStocksTree(null)
  //      setTotalValue(0)
  //      }
  }, [data]);

  if (status === "error") {
    return <p>Error</p>;
  }

  return (
    <div className="portfolio">
      <div className="navbar">
        <span>total value: {totalValue.toLocaleString("en-US")}$</span>
        {/* <button onClick={refreshStockPrices}>Refresh Data</button> */}
      </div>
      {status === "pending" ? <TreeMapSkeleton></TreeMapSkeleton>: stocksTree && (
        <Treemap 
          data={stocksTree}
          width={1000}
          height={600}
        ></Treemap> )}
    </div>
   
  );
}

export default Portfolio;
