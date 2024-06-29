import axios from "axios";

export function postSnapshot(value, token) {
    return axios.post("http://localhost:8000/PortfolioSnapshot/snapshot", value, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
}

export async function getPortfolioSnapshots(token) {
    return axios.get("http://localhost:8000/PortfolioSnapshot/snapshots", {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
}