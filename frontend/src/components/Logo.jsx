import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '@/styles/logo.css';
import AccountMenu from '@/components/AccountMenu';

function Logo({firstLetter}) {

  return (
    <nav className="logo-row">
    <Link to="/portfolio" className="logo">
      MoonMarket
    </Link>
    <AccountMenu Letter={firstLetter}/>
  </nav>
  )
}

export default Logo