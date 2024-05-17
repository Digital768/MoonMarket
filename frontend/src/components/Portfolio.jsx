import TreeMapSkeleton from "@/Skeletons/TreeMapSkeleton";
import { getStockFromPortfolio, updateStockPrice } from "@/api/stock";
import { getUserData } from "@/api/user";
import { Treemap } from "@/components/Treemap";
import { useAuth } from "@/pages/AuthProvider";
import "@/styles/portfolio.css";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';

function Portfolio() {
  const navigate = useNavigate();
  const [totalValue, setTotalValue] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [stocksTree, setStocksTree] = useState(null);
  const [tickers, setTickers] = useState([]);

  const { token } = useAuth();
  const { data, status, refetch, } = useQuery({
    queryKey: ["user",  token ],
    queryFn: () => getUserData(token),
    refetchOnWindowFocus: false,
  });

  function isStockProfitable(avg_bought_price, stock_current_price) {
    if (stock_current_price > avg_bought_price) return true;
    return false;
  }
  async function refreshPrices(tickers){
    let promises = tickers.map(ticker => updateStockPrice(ticker, token));
    let results = await Promise.all(promises);
    refetch()
    return results;

  }

// todo : find a better way to change data rather than useEffect

  useEffect(() => {
    async function fetchDataAndProcess() {
      processStocks();
    }
    async function processStocks() {
      if (status === "success") {
        if (data.data.holdings.length > 0) {
          const stockCollection = data.data.holdings;
          const positiveStocks = [];
          const negativeStocks = [];
          let sum = 0;
          let promises = stockCollection.map(holding => getStockFromPortfolio(holding.ticker, token));
          let results = await Promise.all(promises);

          for (let i = 0; i < results.length; i++) {
            const res = results[i];
            const holding = stockCollection[i];
            // ... rest of your code ...
            const stock_avg_price = holding.avg_bought_price;
            const value = holding.quantity * res.price;
            sum += value;
            const ticker = holding.ticker;
            setTickers((prevState) => [...prevState, ticker]);

            if (isStockProfitable(stock_avg_price, res.price)) {
              positiveStocks.push({
                name: res.name,
                id: res.id,
                ticker: ticker,
                value: value,
                avgSharePrice: stock_avg_price.toFixed(2),
                quantity: holding.quantity,
                last_price: Math.round(res.price),
                priceChangePercentage: Math.round(
                  ((res.price - stock_avg_price) / stock_avg_price) * 100
                ),
              });
            } else {
              negativeStocks.push({
                name: res.name,
                id: res.id,
                ticker: holding.ticker,
                value: value,
                avgSharePrice: stock_avg_price,
                quantity: holding.quantity,
                last_price: Math.round(res.price * 100) / 100,
                priceChangePercentage: Math.round(
                  ((res.price - stock_avg_price) / stock_avg_price) * 100
                ),
              });
            }
          }

          positiveStocks.forEach((stock) => {
            stock.percentageOfPortfolio = Math.round(
              (stock.value / sum) * 100
            );
          });
          negativeStocks.forEach((stock) => {
            stock.percentageOfPortfolio = Math.round(
              (stock.value / sum) * 100
            );
          });

          const newStocksTree = {
            name: "Stocks",
            value: 0,
            children: [],
          };
          if (positiveStocks.length > 0) {
            newStocksTree.children.push({
              name: "Positive",
              value: 0,
              children: positiveStocks,
            });
          }
          if (negativeStocks.length > 0) {
            newStocksTree.children.push({
              name: "Negative",
              value: 0,
              children: negativeStocks,
            });
          }

          setStocksTree(newStocksTree);
          setTotalValue(Math.round(sum * 100) / 100);
        } else {
          setStocksTree(null);
          setTotalValue(0);
        }
        setDeposit(data.data.deposit);
        let last_update_date = data.data.last_refresh
        let date = new Date(last_update_date);
        let formattedDate = date.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
        setUpdatedAt(formattedDate);
      }
    }
    fetchDataAndProcess()
  }, [data]);


  if (status === "error") {
    navigate("/logout", { replace: true });
  }

  return (
    <div className="portfolio">
      <div className="navbar">
        <span>Portfolio value: {totalValue.toLocaleString("en-US")}$</span>
        <span>deposit: {deposit.toLocaleString("en-US")}$</span>
        <span>last updated at: {updatedAt}</span>
        <Button variant="text" style={{"padding": 0}} onClick={() =>refreshPrices(tickers)}>Update prices</Button>
      </div>
      {!stocksTree ? (
        <TreeMapSkeleton />
      ) : (
        <Treemap data={stocksTree} width={1000} height={600} />
      )}
    </div>
  );
}

export default Portfolio;
