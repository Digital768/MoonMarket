import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '@/styles/logo.css';
import AccountMenu from '@/components/AccountMenu';
import mainlogo from '../../public/moonMarket_logo.png';

function Logo({firstLetter}) {

  return (
    <nav className="logo-row">
    <Link to="/portfolio" className="logo">
    <img src={mainlogo} style={{height:'80px', width:'80px'}}/>
    </Link>
    <AccountMenu Letter={firstLetter}/>
  </nav>
  )
}

export default Logo