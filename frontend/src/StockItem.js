import React from 'react'

function StockItem(props) {
    return (
      <div className="stockItem">
        <h2>
          Stock Symbol: {props.ticker} Stock Name: {props.name}
        </h2>
        <h3>Stock Price: {props.price}</h3>
        <h3>Stock Exchange: {props.exchange}</h3>
        <h3>Next Earnings date: {props.nextEarningsAnnouncement}</h3>
        <h3>Avarage 50 days price: {props.priceAvg50}</h3>
        <h3>Avarage 200 days price: {props.priceAvg200}</h3>
        <h3>Stock's highest price this year: {props.yearHigh}</h3>
        <h3>Stock's lowest price this year: {props.yearLow}</h3>
      </div>
    );
  }
  
  export default StockItem;
