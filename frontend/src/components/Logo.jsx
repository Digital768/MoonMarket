import React from 'react'
import { Link } from 'react-router-dom'
import "@/styles/App.css";

function Logo() {
  return (
    <nav className="logo-row">
    <Link to="/" className="logo">
      MoonMarket
    </Link>
  </nav>
  )
}

export default Logo