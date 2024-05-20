// import {updateStockPrice} from '@/api/stock'
// import { useFetcher } from 'react-router-dom';

// // const fetcher = useFetcher();

// export async function refreshPrices(tickers,location, token) {
//     let promises = tickers.map(ticker => updateStockPrice(ticker, token));
//     let results = await Promise.all(promises);
//     fetcher.load(location.pathname)
//     return results;
//   }