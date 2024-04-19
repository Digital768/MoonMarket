import React from 'react'
import { useParams } from 'react-router-dom'
import "./App.css";

function StockPage() {
    const params = useParams();   
  return (
    <div>
        <nav className="logo-row">
          <a href="/" className="logo">
            MoonMarket
          </a>
        </nav>
    </div>
  )
}

export default StockPage