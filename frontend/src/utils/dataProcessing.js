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
  let totalPortfolioValue = 0;

  // Fetch stock prices and calculate total portfolio value
  let promises = stockCollection.map((holding) =>
    getStockFromPortfolio(holding.ticker, token)
  );
  let results = await Promise.all(promises);

  results.forEach((res, i) => {
    const holding = stockCollection[i];
    const value = holding.quantity * res.price;
    totalPortfolioValue += value;
  });

  // Calculate percentage of portfolio for each stock
  stockCollection.forEach((holding, i) => {
    const res = results[i];
    const value = holding.quantity * res.price;
    const percentageOfPortfolio = Math.round((value / totalPortfolioValue) * 100);

    stocks.push({
      name: holding.ticker,
      value: value,
      quantity: holding.quantity,
      percentageOfPortfolio: percentageOfPortfolio,
    });
  });

  // Sort stocks by value in descending order
  stocks.sort((a, b) => b.value - a.value);

  // If there are more than 8 stocks, combine the rest into "Others"
  if (stocks.length > 8) {
    const othersValue = stocks.slice(8).reduce((acc, curr) => acc + curr.value, 0);
    const othersPercentage = stocks.slice(8).reduce((acc, curr) => acc + curr.percentageOfPortfolio, 0);
    stocks = stocks.slice(0, 8);
    stocks.push({ name: "Others", value: othersValue, percentageOfPortfolio: othersPercentage });
  }

  return stocks;
}

export function processTableData(stocksList, stocksInfo) {
  console.log("stocksList", stocksList);
  console.log("stocksInfo", stocksInfo);
  let tableData = [];
  stocksList.forEach((stock, i) => {
    const value = stock.quantity * stocksInfo[i].price
    const ticker = stock.ticker
    const name = stocksInfo[i].name
    const avg_bought_price = stock.avg_bought_price
    const priceChange = stocksInfo[i].price - avg_bought_price
    const priceChangePercentage = Math.round(
      ((stocksInfo[i].price - avg_bought_price) / avg_bought_price) * 100
    )

    tableData.push({
      ticker: ticker,
      name: name,
      value: value,
      priceChange: priceChange,
      priceChangePercentage: priceChangePercentage,
      sharePrice: stocksInfo[i].price,
      earnings: stocksInfo[i].earnings
    });
  })
  tableData.sort((a, b) => b.value - a.value);

  return tableData;
}

export async function processCircularData(data, token) {
  const stockCollection = data.holdings;
  let children = []
  let sum = 0;
  let totalPortfolioValue = 0;
  let promises = stockCollection.map((holding) =>
    getStockFromPortfolio(holding.ticker, token)
  );
  let results = await Promise.all(promises);

  results.forEach((res, i) => {
    const holding = stockCollection[i];
    const value = holding.quantity * res.price;
    totalPortfolioValue += value;
  });


  for (let i = 0; i < results.length; i++) {
    const res = results[i];
    const holding = stockCollection[i];
    const value = holding.quantity * res.price;
    const ticker = holding.ticker;
    sum += value;
    const stock_avg_price = holding.avg_bought_price;
    const percentageOfPortfolio = Math.round((value / totalPortfolioValue) * 100);
    let stockType
    if (res.price > stock_avg_price) {
      stockType = 'positive'
    }
    else {
      stockType = 'negative'
    }
    children.push({
      type: 'leaf',
      ticker: ticker,
      name: res.name,
      value: value,
      stockType: stockType,
      quantity: holding.quantity,
      avgSharePrice: stock_avg_price,
      last_price: res.price,
      percentageOfPortfolio: percentageOfPortfolio
    })
  }

  const circularDataObject = {
    type: 'node',
    name: 'stocks',
    value: sum,
    children: children
  }
  return circularDataObject;
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
  return { formattedDate }
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
