import React, { useEffect, useState } from 'react'
import { getStockFromPortfolio } from "@/api/stock";

function useHoldingsData(holdingsList, token) {
    const [holdingsData, setHoldingsData] = useState([])
    useEffect(() => {
        const getStocksData = async () => {
            let promises = holdingsList.map((holding) =>
                getStockFromPortfolio(holding.ticker, token)
            );
            let results = await Promise.all(promises);
            
            setHoldingsData(results)
        }
        getStocksData()
    }, [holdingsList])

    return holdingsData
}

export default useHoldingsData