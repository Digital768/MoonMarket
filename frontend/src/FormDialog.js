import React, { useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";

export default function FormDialog({stock}) {
    const [open, setOpen] = useState(false);
    const [portfolioStock, setPortfolioStock] = useState({
        name: stock.name ,
        bought_price: '',
        last_price: stock.price ,
        quantity: '',
        value: ''
    })

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    async function postApiStock(portfolioStock, quantity) {
        const value = stock.price * quantity;

        return axios.post(`http://localhost:8000/${portfolioStock}`);
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
                    </DialogContentText>
                    <input placeholder='enter bought price' type='number' />
                    <input placeholder='enter quantity' type='number'/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Add</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
