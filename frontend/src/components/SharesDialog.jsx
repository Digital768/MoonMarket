import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm } from "react-hook-form";


function SharesDialog({ handleClose, open, dialog,addUserPurchase, addUserSale }) {
  // const [shares, setShares] = useState({
  //   price: 0,
  //   quantity: 0,
  // });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   if (name === "quantity" || name === "price") {
  //     if (parseFloat(value) > 0) {
  //       setShares((prevState) => {
  //         const newShares = {
  //           ...prevState,
  //           [name]: parseFloat(value),
  //         };
  //         return newShares
  //       });
  //       setError(""); // Clear error if value is valid
  //     } else {
  //       setError(
  //         name.charAt(0).toUpperCase() +
  //         name.slice(1) +
  //         " must be greater than zero"
  //       );
  //     }
  //   }
  // };

  //   const handleSubmit = () => {
  //     if (shares.quantity > 0 && shares.price > 0) {
  //       dialog.function(dialog.stock._id, shares)
  //             .then(() => {
  //                 handleClose();
  //             })
  //             .catch(error => {
  //                 console.error("Error:", error);
  //                 // Handle error, display error message to the user
  //             });
  //     } else {
  //         setError("Quantity and price MUST be above 0");
  //     }
  // };
  // useEffect(() => {console.log(dialog)},[]);

  const onSubmit = async (data,event) => {
    event.preventDefault();

    try {
      if (dialog && dialog.function && dialog.stock && dialog.stock.ticker && dialog.token) {
        if (dialog.function === addUserPurchase) {
          await dialog.function(data.price, dialog.stock.ticker, data.quantity, dialog.token);
        } else if (dialog.function === addUserSale) {
          await dialog.function(dialog.stock.ticker, data.quantity, data.price, dialog.token);
        }
        handleClose();
      } else {
        console.error("Missing required properties in the dialog object.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{dialog.title}</DialogTitle>
        <DialogContent className="addStockForm">
          <DialogContentText>
            {dialog.text}
          </DialogContentText>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="price-row" >
              <label>{dialog.labelText}</label>
              <input
                {...register("price", {
                  required: "must be greater than 0",
                  min: 1,
                  valueAsNumber: true,
                })}
                type="number"
                style={{ marginLeft: '10px', marginRight: '10px' }}
              />
              {errors.price && <span>This field is required</span>}
            </div>
            <div className="quantity-row">
              <label>Enter quantity of shares</label>
              <input
                {...register("quantity", {
                  required: "must be greater than 0",
                  min: 1,
                  valueAsNumber: true,
                })}
                type="number"
                style={{ marginLeft: '10px', marginRight: '10px' }}
              />
              {errors.price && <span>This field is required</span>}
            </div>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button variant="contained" type="submit">{dialog.buttonText}</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default SharesDialog;
