import axios from "axios";

export async function postSnapshot(value, token) {
    const numericValue = Number(value);
    if (isNaN(numericValue)) {
        throw new Error("Value must be a valid number");
    }
    return await axios.post("http://localhost:8000/PortfolioSnapshot/snapshot", null, {
        params: { value },
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
}


export async function getPortfolioSnapshots(token, timeframe) {
    return await axios.get(`http://localhost:8000/PortfolioSnapshot/${timeframe}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
}