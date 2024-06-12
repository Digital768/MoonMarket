import { getStockFromPortfolio } from "@/api/stock";


export async function getPortfolioStats(data, token) {
  const stockCollection = data.holdings;
  let tickers = [];
  let sum = 0;
  let totalSpent = 0;

  let promises = stockCollection.map((holding) =>
    getStockFromPortfolio(holding.ticker, token)
  );
  let results = await Promise.all(promises);

  for (let i = 0; i < results.length; i++) {
    const res = results[i];
    const holding = stockCollection[i];
    const stock_avg_price = holding.avg_bought_price;
    const value = holding.quantity * res.price;
    sum += value;
    totalSpent += (holding.avg_bought_price * holding.quantity);
    const ticker = holding.ticker;
    tickers.push(ticker);
  }

  return { tickers, sum, totalSpent };
}

export async function processTreemapData(data, token) {
  const stockCollection = data.holdings;
  const positiveStocks = [];
  const negativeStocks = [];
  let sum = 0;

  let promises = stockCollection.map((holding) =>
    getStockFromPortfolio(holding.ticker, token)
  );
  let results = await Promise.all(promises);

  for (let i = 0; i < results.length; i++) {
    const res = results[i];
    const holding = stockCollection[i];
    const stock_avg_price = holding.avg_bought_price;
    const value = holding.quantity * res.price;
    sum += value;
    const ticker = holding.ticker;

    if (res.price > stock_avg_price) {
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
    stock.percentageOfPortfolio = Math.round((stock.value / sum) * 100);
  });
  negativeStocks.forEach((stock) => {
    stock.percentageOfPortfolio = Math.round((stock.value / sum) * 100);
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

  return newStocksTree;
}

export async function processDonutData(data, token) {
  const stockCollection = data.holdings;
  let stocks = [];
  let promises = stockCollection.map((holding) =>
    getStockFromPortfolio(holding.ticker, token)
  );
  let results = await Promise.all(promises);
  
  for (let i = 0; i < results.length; i++) {
    const res = results[i];
    const holding = stockCollection[i];
    const value = holding.quantity * res.price;
    const ticker = holding.ticker;
    stocks.push({
      name: ticker,
      value: value
    });
  }
  return stocks;
}


export function lastUpdateDate(data) {
  let last_update_date = data.data.last_refresh;
  let date = new Date(last_update_date);
  let formattedDate = date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  return { formattedDate}
}
//   // Add similar function for Cake graph data processing
//   export async function processCakeGraphData(data, token) {
//     const stockCollection = data.holdings;
//     let sum = 0;
//     let chartData = [];

//     let promises = stockCollection.map(holding => getStockFromPortfolio(holding.ticker, token));
//     let results = await Promise.all(promises);

//     for (let i = 0; i < results.length; i++) {
//       const res = results[i];
//       const holding = stockCollection[i];
//       const value = holding.quantity * res.price;
//       sum += value;

//       chartData.push({
//         label: holding.ticker,
//         value: value,
//       });
//     }

//     return {
//       totalValue: sum,
//       chartData: chartData,
//     };
//   }
