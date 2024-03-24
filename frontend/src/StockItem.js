import React from 'react'

function StockItem(props) {
    return (
      <div className="stockItem">
        <h2>
          Stock Symbol: {props.ticker} Stock Name: {props.name}
        </h2>
        <h3>Stock Price: {props.price}</h3>
      </div>
    );
  }
  
  export default StockItem;
