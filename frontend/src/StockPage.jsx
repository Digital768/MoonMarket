import React, { useEffect, useState, useContext  } from 'react'
import { useParams } from 'react-router-dom'
import axios from "axios";
import "./App.css";
import SharesDialog from "./SharesDialog.jsx";



function StockPage() {
  const { stockTicker } = useParams();
  const [stockData, setStockData] = React.useState(null);
  const [dialogOpen, setdialogOpen] = useState(false);
  const [dialog, setDialog] = useState({
    title: '',
    text: '',
    labelText: '',
    function: '',
    buttonText: '',
    stock: {}
  });

  function handleClose () {
    setdialogOpen(false)
  }

  const handleAddClick = () => {
    // event.stopPropagation(); // Prevent the parent
    setdialogOpen(true);
    setDialog((prevDialog) => {
      const newDialog = {
        ...prevDialog,
        title: 'Add shares',
        text : 'To add shares of the stock, please enter how many shares of the stock you bought and at which price.',
        labelText: 'Enter bought price',
        // function: addStockShares,
        buttonText: 'Add',
        stock: stockData
      }
      return newDialog
    })
  };
  const handleDecreaseClick = () => {
    // event.stopPropagation(); // Prevent the parent
    setdialogOpen(true);
    setDialog((prevDialog) => {
      const newDialog = {
        ...prevDialog,
        title: 'Sell shares',
        text : 'To sell shares of the stock, please enter how many shares of the stock you sold and at which price.',
        labelText: 'Enter sold price',
        // function: decreaseStockShares,
        buttonText: 'Sell',
        stock: stockData
      }
      return newDialog
    })
  };
  
  useEffect(() => {
    const fetchStockData = async () => {
      const result = await axios.get(`http://localhost:8000/stocks/${stockTicker}`);
      setStockData(result.data);
    };

    fetchStockData();
  }, [stockTicker]);

  return (
    <div>
        <nav className="logo-row">
          <a href="/" className="logo">
            MoonMarket
          </a>
        </nav>
        <button>delete stock</button>
        <button onClick={handleAddClick}> add shares</button>
        <button onClick={handleDecreaseClick}>decrease shares</button>
        <p>stock name is {stockData ? stockData.name : 'Loading...'}</p>
        {dialogOpen && (
        <SharesDialog open ={dialogOpen} handleClose ={handleClose} dialog={dialog}  id={stockData._id}></SharesDialog>
      )}

    </div>
  )
}

export default StockPage