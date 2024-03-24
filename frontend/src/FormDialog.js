import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import NumberInput from './NumberInput';
import axios from "axios";

export default function FormDialog() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // async function postApiStock(stock, quantity) {
    //     const value = stock.price * quantity;

    //     return axios.post(`http://localhost:8000/api/add/${stock}`);
    //   }

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                Open form dialog
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
                <DialogContent>
                    <DialogContentText>
                        To add a stock to your portfolio, please enter how many stocks of the company you bought and at which price.
                    </DialogContentText>
                    <NumberInput placeholder="Enter bought price" />
                    <NumberInput placeholder = "enter number of stocks"/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Add</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
