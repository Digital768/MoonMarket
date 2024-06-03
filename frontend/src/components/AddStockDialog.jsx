import TradeStocksForm from "@/components/TradeStocksForm";
import "@/styles/portfolio.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useState } from "react";

export default function AddStockDialog({ stock, token }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        sx={{ marginLeft: "10px" }}
      >
        Add stock
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a stock</DialogTitle>
        <DialogContent className="addStockForm">
          <DialogContentText>
            To add a stock to your portfolio, please enter how many shares of
            the company you bought and at which price.
          </DialogContentText>
          <TradeStocksForm
            stock={stock}
            token={token}
            cancelAction={handleClose}
          />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
