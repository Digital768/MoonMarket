import React, { useState, useEffect, useRef } from "react";
import "./CardHover.css";

function CardHover({ stock, inYourPorfolio, containerRef }) {
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const popupRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const handleMouseMove = (event) => {
        const containerRect = containerRef.current.getBoundingClientRect();
        const popupRect = popupRef.current.getBoundingClientRect();

        let x = event.clientX - containerRect.left;
        let y = event.clientY - containerRect.top;

        // Adjust the position to stay within the container
        x = Math.max(10, Math.min(x + 150, containerRect.width - popupRect.width - 10)); // Move the popup to the right
        y = Math.max(10, Math.min(y - popupRect.height / 2, containerRect.height - popupRect.height - 10)); // Move the popup above the stock cube

        setPopupPosition({ x, y });
      };

      document.addEventListener("mousemove", handleMouseMove);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [containerRef]);

  return (
    <div
      className="popup-card"
      style={{
        left: popupPosition.x,
        top: popupPosition.y,
      }}
      ref={popupRef}
    >
      <div className="card-header">
        <h4>{stock.name}</h4>
        <div className="profit-percentage">
          {Math.round(((stock.last_price - stock.bought_price) / stock.bought_price) * 100)}%
        </div>
      </div>
      <hr />
      <div className="card-body">
        <p>In your portfolio: {Math.round(inYourPorfolio)}%</p>
        <p>Value ({stock.quantity} shares): {Math.round(stock.value).toLocaleString("en-US")}$</p>
        <p>Last Price: {stock.last_price}$</p>
        <p>Bought Price: {stock.bought_price}$</p>
      </div>
    </div>
  );
}

export default CardHover;