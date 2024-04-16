import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";

function AddSharesDialog({handleClose, open, id, updateStockShares}) {
  const [error, setError] = useState(""); // State variable to track form errors
  const [purchase, setPurchase] = useState({
    price: 0,
    quantity: 0,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "quantity" || name === "price") {
      if (parseFloat(value) > 0) {
        setPurchase((prevState) => {
          const newPurchase = {
            ...prevState,
            [name]: parseFloat(value),
          };
          return newPurchase
        });
        setError(""); // Clear error if value is valid
      } else {
        setError(
          name.charAt(0).toUpperCase() +
            name.slice(1) +
            " must be greater than zero"
        );
      }
    }
  };

  const handleSubmit = () => {
    if (purchase.quantity > 0 && purchase.price > 0) {
        updateStockShares(id, purchase)
            .then(() => {
                handleClose();
            })
            .catch(error => {
                console.error("Error:", error);
                // Handle error, display error message to the user
            });
    } else {
        setError("Quantity and price MUST be above 0");
    }
};


  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            handleSubmit();
          },
        }}
      >
        <DialogTitle>Add shares</DialogTitle>
        <DialogContent className="addStockForm">
          <DialogContentText>
            To add shares of the stock, please enter how many shares of the
            stock you bought and at which price.
          </DialogContentText>
          <label>Enter bought price</label>
          <input
            type="number"
            name="price"
            value={purchase.price}
            onChange={handleInputChange}
          />
          <label>Enter quantity</label>
          <input
            type="number"
            name="quantity"
            value={purchase.quantity}
            onChange={handleInputChange}
          />
          {error && <div style={{ color: "red" }}>{error}</div>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default AddSharesDialog;
