import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";


function SharesDialog({handleClose, open, id, dialog}) {
  console.log(dialog)
  const [error, setError] = useState(""); // State variable to track form errors
  const [shares, setShares] = useState({
    price: 0,
    quantity: 0,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "quantity" || name === "price") {
      if (parseFloat(value) > 0) {
        setShares((prevState) => {
          const newShares = {
            ...prevState,
            [name]: parseFloat(value),
          };
          return newShares
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
    if (shares.quantity > 0 && shares.price > 0) {
      dialog.function(id, shares)
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
        <DialogTitle>{dialog.title}</DialogTitle>
        <DialogContent className="addStockForm">
          <DialogContentText>
            {dialog.text}
          </DialogContentText>
          <label>{dialog.labelText}</label>
          <input
            type="number"
            name="price"
            value={shares.price}
            onChange={handleInputChange}
          />
          <label>Enter quantity</label>
          <input
            type="number"
            name="quantity"
            value={shares.quantity}
            onChange={handleInputChange}
          />
          {error && <div style={{ color: "red" }}>{error}</div>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">{dialog.buttonText}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default SharesDialog;
