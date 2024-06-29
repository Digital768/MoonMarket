
export async function getPortfolioStats(stocksList, stocksInfo) {
  let tickers = [];
  let sum = 0;
  let totalSpent = 0;

  for (let i = 0; i < stocksInfo.length; i++) {
    const res = stocksInfo[i];
    const holding = stocksList[i];
    const stock_avg_price = holding.avg_bought_price;
    const value = holding.quantity * res.price;
    sum += value;
    totalSpent += holding.avg_bought_price * holding.quantity;
    const ticker = holding.ticker;
    tickers.push(ticker);
  }

  return { tickers, sum, totalSpent };
}

export function processTreemapData(stocksList, stocksInfo) {
  const positiveStocks = [];
  const negativeStocks = [];
  let sum = 0;

  for (let i = 0; i < stocksInfo.length; i++) {
    const res = stocksInfo[i];
    const holding = stocksList[i];
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

export function processDonutData(stocksList, stocksInfo) {
  let stocks = [];
  let totalPortfolioValue = 0;
  let othersStocks = []; // Define othersStocks here

  stocksInfo.forEach((res, i) => {
    const holding = stocksList[i];
    const value = holding.quantity * res.price;
    totalPortfolioValue += value;
  });

  // Calculate percentage of portfolio for each stock
  stocksList.forEach((holding, i) => {
    const res = stocksInfo[i];
    const value = holding.quantity * res.price;
    const percentageOfPortfolio = Math.round(
      (value / totalPortfolioValue) * 100
    );

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
    othersStocks = stocks.slice(8).map(stock => ({
      name: stock.name,
      value: stock.value,
      quantity: stock.quantity,
      percentageOfPortfolio: stock.percentageOfPortfolio
    }));

    const othersValue = othersStocks.reduce((acc, curr) => acc + curr.value, 0);
    const othersPercentage = othersStocks.reduce((acc, curr) => acc + curr.percentageOfPortfolio, 0);

    stocks = stocks.slice(0, 8);
    stocks.push({
      name: "Others",
      value: othersValue,
      percentageOfPortfolio: othersPercentage,
    });
  }

  stocks.othersStocks = othersStocks;

  return stocks;
}

// export function processTableData(stocksList, stocksInfo) {
//   // console.log("stocksList", stocksList);
//   // console.log("stocksInfo", stocksInfo);
//   let totalPortfolioValue = 0;
//   stocksInfo.forEach((res, i) => {
//     const holding = stocksList[i];
//     const value = holding.quantity * res.price;
//     totalPortfolioValue += value;
//   });
//   let tableData = [];
//   stocksList.forEach((stock, i) => {
//     const value = stock.quantity * stocksInfo[i].price;
//     const ticker = stock.ticker;
//     const name = stocksInfo[i].name;
//     const avg_bought_price = stock.avg_bought_price;
//     const priceChange = stocksInfo[i].price - avg_bought_price;
//     const priceChangePercentage = Math.round(
//       ((stocksInfo[i].price - avg_bought_price) / avg_bought_price) * 100
//     );
//     const percentageOfPortfolio = Math.round(
//       (value / totalPortfolioValue) * 100
//     );

//     tableData.push({
//       ticker: ticker,
//       name: name,
//       value: value,
//       priceChange: priceChange,
//       priceChangePercentage: priceChangePercentage,
//       sharePrice: stocksInfo[i].price,
//       earnings: stocksInfo[i].earnings,
//       quantity: stock.quantity,
//       percentageOfPortfolio: percentageOfPortfolio,
//     });
//   });
//   tableData.sort((a, b) => b.value - a.value);

//   return tableData;
// }

export function processCircularData(stocksList, stocksInfo) {
  let children = [];
  let sum = 0;
  let totalPortfolioValue = 0;

  stocksInfo.forEach((res, i) => {
    const holding = stocksList[i];
    const value = holding.quantity * res.price;
    totalPortfolioValue += value;
  });

  for (let i = 0; i < stocksInfo.length; i++) {
    const res = stocksInfo[i];
    const holding = stocksList[i];
    const value = holding.quantity * res.price;
    const ticker = holding.ticker;
    sum += value;
    const stock_avg_price = holding.avg_bought_price;
    const percentageOfPortfolio = Math.round(
      (value / totalPortfolioValue) * 100
    );
    let stockType;
    if (res.price > stock_avg_price) {
      stockType = "positive";
    } else {
      stockType = "negative";
    }
    children.push({
      type: "leaf",
      ticker: ticker,
      name: res.name,
      value: value,
      stockType: stockType,
      quantity: holding.quantity,
      avgSharePrice: stock_avg_price,
      last_price: res.price,
      percentageOfPortfolio: percentageOfPortfolio,
    });
  }

  const circularDataObject = {
    type: "node",
    name: "stocks",
    value: sum,
    children: children,
  };
  return circularDataObject;
}

export function processLeaderboardsData(stocksList, stocksInfo) {
  // console.log("stocksList", stocksList);
  // console.log("stocksInfo", stocksInfo);

  let totalPortfolioValue = 0;
  stocksInfo.forEach((res, i) => {
    const holding = stocksList[i];
    const value = holding.quantity * res.price;
    totalPortfolioValue += value;
  });
  let LeaderboardsData = [];
  stocksList.forEach((stock, i) => {
    const value = stock.quantity * stocksInfo[i].price;
    const ticker = stock.ticker;
    const name = stocksInfo[i].name;
    const avg_bought_price = stock.avg_bought_price;
    const priceChange = stocksInfo[i].price - avg_bought_price;
    const priceChangePercentage = Math.round(
      ((stocksInfo[i].price - avg_bought_price) / avg_bought_price) * 100
    );
    const percentageOfPortfolio = Math.round(
      (value / totalPortfolioValue) * 100
    );

    const gainLoss = (value - (stock.avg_bought_price * stock.quantity)).toFixed(2);

    LeaderboardsData.push({
      ticker: ticker,
      name: name,
      value: value,
      priceChange: priceChange,
      priceChangePercentage: priceChangePercentage,
      sharePrice: stocksInfo[i].price,
      earnings: stocksInfo[i].earnings,
      quantity: stock.quantity,
      percentageOfPortfolio: percentageOfPortfolio,
      gainLoss: gainLoss,
    });
  });
  LeaderboardsData.sort(
    (a, b) => b.priceChangePercentage - a.priceChangePercentage
  );
  // console.log("LeaderboardsData is: " , LeaderboardsData)

  return LeaderboardsData;
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
  return { formattedDate };
}
