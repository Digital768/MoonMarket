import React, { useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";

export default function FormDialog({ stock, setPortfolioVisible, setStockSearched }) {
    const [open, setOpen] = useState(false);
    const [portfolioStock, setPortfolioStock] = useState({
        name: stock.name,
        ticker: stock.ticker,
        purchases: [{price: 0, quantity: 0}],  // Initialize with a single purchase
        last_price: stock.price,
        value: 0
    });
    const [error, setError] = useState(""); // State variable to track form errors

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (event) => {
        console.log("portfolioStock", portfolioStock)
        const { name, value } = event.target;
        console.log("name", name ,"value" , value) 
        if (name === 'quantity' || name === 'price') {
            if (parseFloat(value) > 0) {
                setPortfolioStock(prevState => {
                    const newPurchase = {...prevState.purchases[0], [name]: parseFloat(value)};
                    return {
                        ...prevState,
                        purchases: [newPurchase],  // Update the first purchase
                        value: newPurchase.quantity * prevState.last_price  // Update value based on new quantity and last_price
                    };
                });
                setError(""); // Clear error if value is valid
            } else {
                setError(name.charAt(0).toUpperCase() + name.slice(1) + " must be greater than zero");
            }
        }
    };
    
    const handleSubmit = () => {
        if (portfolioStock.purchases[0].quantity > 0 && portfolioStock.purchases[0].price > 0) {
            postApiStock(portfolioStock)
                .then(() => {
                    console.log(portfolioStock)
                    handleClose();
                    setStockSearched(false)
                    setPortfolioVisible(true)
                })
                .catch(error => {
                    console.error("Error:", error);
                    // Handle error, display error message to the user
                });
        } else {
            setError("Quantity and price MUST be above 0");
        }
    };
    
    async function postApiStock(portfolioStock) {
        console.log(portfolioStock)
        return axios.post('http://localhost:8000/stocks/', portfolioStock);
    }

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                Add stock
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        handleSubmit();
                    },
                }}
            >
                <DialogTitle>Add a stock</DialogTitle>
                <DialogContent className='addStockForm'>
                    <DialogContentText>
                        To add a stock to your portfolio, please enter how many stocks of the company you bought and at which price.
                    </DialogContentText>
                    <label>Enter bought price</label>
                    <input
                        type='number'
                        name="price"
                        value={portfolioStock.bought_price}
                        onChange={handleInputChange}
                    />
                    <label>Enter quantity</label>
                    <input
                        type='number'
                        name="quantity"
                        value={portfolioStock.quantity}
                        onChange={handleInputChange}
                    />
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Add</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}