import React from "react";
import "./CardHover.css";
function CardHover({ stock, inYourPorfolio }) {
  return (
    <div className="popup-card">
      <div className="card-header">
        <h4>{stock.name}</h4>
        <div className="profit-percentage">
          {Math.round(
            ((stock.last_price - stock.bought_price) / stock.bought_price) * 100
          )}
          %
        </div>
      </div>
      <hr />
      <div className="card-body">
        <p>In your portfolio: {Math.round(inYourPorfolio)}%</p>
        <p>
          value ({stock.quantity} shares) :{" "}
          {Math.round(stock.value).toLocaleString("en-US")}$
        </p>
        <p>Last Price: {stock.last_price}$</p>
        <p>Bought Price: {stock.bought_price}$</p>
      </div>
    </div>
  );
}

export default CardHover;
