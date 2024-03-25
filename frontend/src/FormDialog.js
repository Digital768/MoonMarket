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
        bought_price: 0,
        last_price: stock.price,
        quantity: 0,
        value: 0
    })

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    // function isn't working properly, need to change
    const handleInputChange = (event) => {
        if (event.target >= 0) {
            const { name, value } = event.target;
            if (name === 'quantity') {
                setPortfolioStock(prevState => ({
                    ...prevState,
                    [name]: value,
                    value: prevState.quantity * prevState.last_price
                }))
            };
            if (name === 'bought_price') {
                setPortfolioStock(prevState => ({
                    ...prevState,
                    [name]: value,
                }))
            }
        }
    };

    async function postApiStock(portfolioStock) {
        return axios.post('http://localhost:8000/add/', portfolioStock);
    }

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                add stock
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Add a stock</DialogTitle>
                <DialogContent className='addStockForm'>
                    <DialogContentText>
                        To add a stock to your portfolio, please enter how many stocks of the company you bought and at which price.
                    </DialogContentText>\
                    {/* both inputs arent working good */}
                    <input
                        placeholder='enter bought price'
                        type='number'
                        name="bought_price"
                        value={portfolioStock.bought_price}
                        onChange={handleInputChange}
                    />
                    <input
                        placeholder='enter quantity'
                        type='number'
                        name="quantity"
                        value={portfolioStock.quantity}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" onClick={postApiStock(portfolioStock)}>Add</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
