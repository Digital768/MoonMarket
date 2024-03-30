import React, { useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";

export default function FormDialog({ stock }) {
    const [open, setOpen] = useState(false);
    const [portfolioStock, setPortfolioStock] = useState({
        name: stock.name,
        ticker: stock.ticker,
        bought_price: 0,
        last_price: stock.price,
        quantity: 0,
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
        const { name, value } = event.target;
        if (name === 'quantity') {
            if (parseFloat(value) > 0) {
                setPortfolioStock(prevState => ({
                    ...prevState,
                    [name]: parseFloat(value),
                    value: parseFloat(value) * prevState.last_price
                }));
                setError(""); // Clear error if value is valid
            } else {
                setError("Quantity must be greater than zero");
            }
        } else if (name === 'bought_price') {
            if (parseFloat(value) > 0) {
                setPortfolioStock(prevState => ({
                    ...prevState,
                    [name]: parseFloat(value),
                }));
                setError(""); // Clear error if value is valid
            } else {
                setError("Bought price must be greater than zero");
            }
        }
    };

    const handleSubmit = () => {
        if (portfolioStock.quantity > 0 && portfolioStock.bought_price > 0) {
            postApiStock(portfolioStock)
                .then(() => {
                    handleClose();
                })
                .catch(error => {
                    console.error("Error:", error);
                    // Handle error, display error message to the user
                });
        } else {
            setError("quantity and bought price MUST be above 0");
        }
    };

    async function postApiStock(portfolioStock) {
        return axios.post('http://localhost:8000/stocks', portfolioStock);
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
                        name="bought_price"
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
