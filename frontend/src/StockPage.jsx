import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from "axios";
import "./App.css";
import SharesDialog from "./SharesDialog.jsx";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';


function StockPage() {
  const navigate = useNavigate();
  const { stockTicker } = useParams();
  const [dialogOpen, setdialogOpen] = useState(false);
  const [stockData, setStockData] = useState({});
  const [dialog, setDialog] = useState({
    title: '',
    text: '',
    labelText: '',
    function: '',
    buttonText: '',
    stock: stockData
  });

  const { data, status, refetch } = useQuery({
    queryKey: ["stock", stockTicker],
    queryFn: () => getStockFromDb(stockTicker),
    refetchOnWindowFocus: false,
    retry: 0
  });

  async function getStockFromDb(stockTicker) {
    const dbStock = await axios.get(`http://localhost:8000/stocks/${stockTicker}`);
    return dbStock;
  }
  async function addStockShares(id, purchase) {
    await axios.put(`http://localhost:8000/stocks/add_shares/${id}`, purchase);
    refetch();
  }

  async function decreaseStockShares(id, sale) {
    await axios.put(`http://localhost:8000/stocks/sell_shares/${id}`, sale);
    refetch();
  }

  async function deleteStock(id) {
    await axios.delete(`http://localhost:8000/stocks/${id}`);
    refetch();
  }

  const deleteStockWithConfirmation = (id) => {
    if (window.confirm("Are you sure you want to delete this stock?")) {
      deleteStock(id);
      navigate('/');
    }
  };


  function handleClose() {
    setdialogOpen(false)
  }

  const handleAddClick = () => {
    // event.stopPropagation(); // Prevent the parent
    setdialogOpen(true);
    setDialog((prevDialog) => {
      const newDialog = {
        ...prevDialog,
        title: 'Add shares',
        text: 'To add shares of the stock, please enter how many shares of the stock you bought and at which price.',
        labelText: 'Enter bought price',
        function: addStockShares,
        buttonText: 'Add',
        stock: data.data
      }
      return newDialog
    })
  };
  const handleDecreaseClick = () => {
    // event.stopPropagation(); // Prevent the parent
    //TODO if the stock fully sold, navigate to portfolio page
    setdialogOpen(true);
    setDialog((prevDialog) => {
      const newDialog = {
        ...prevDialog,
        title: 'Sell shares',
        text: 'To sell shares of the stock, please enter how many shares of the stock you sold and at which price.',
        labelText: 'Enter sold price',
        function: decreaseStockShares,
        buttonText: 'Sell',
        stock: data.data
      }
      return newDialog
    })
  };
  useEffect(() => {
    if (status === "success") {
      setStockData(data.data);
    }
    if( status === "error") {
      navigate('/');
    }
    console.log(status)
  }, [status, data])


  return (
    <div>
      <nav className="logo-row">
        <a href="/" className="logo">
          MoonMarket
        </a>
      </nav>
      <button onClick={() => deleteStockWithConfirmation(data.data._id)}>delete stock</button>
      <button onClick={handleAddClick}> add shares</button>
      <button onClick={handleDecreaseClick}>decrease shares</button>
      {/* <p>stock name is {status === 'pending' ?'Loading...' : data.data.name}</p> */}
      {status === 'success' ? (
        <>
          <p>stock name is {stockData.name}</p>
          <p>stock ticker is {stockData.ticker}</p>
          <p>stock price is {stockData.last_price}</p>
          <p>Purchases:</p>
          {stockData.purchases && stockData.purchases.length > 0 ? (
            <ul>
              {stockData.purchases.map((purchase, index) => (
                <li key={index}>
                  Quantity: {purchase.quantity}, Price: {purchase.price}
                </li>
              ))}
            </ul>
          ) : (
            <p>No purchases found.</p>
          )}
          <p>sales:</p>
          {stockData.sales && stockData.sales.length > 0 ? (
            <ul>
              {stockData.sales.map((sale, index) => (
                <li key={index}>
                  Quantity: {sale.quantity}, Price: {sale.price}
                </li>
              ))}
            </ul>
          ) : (
            <p>No sales found.</p>
          )}
          
        </>
      ) : (
        <p>loading</p>
      )}
      {dialogOpen && (
        <SharesDialog open={dialogOpen} handleClose={handleClose} dialog={dialog} ></SharesDialog>
      )}

    </div>

  )
}

export default StockPage