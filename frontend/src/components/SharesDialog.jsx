import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "@/styles/portfolio.css";


function SharesDialog({ handleClose, open, dialog,addUserPurchase, addUserSale }) {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(
    {
      defaultValues: {
        price: dialog.stock.price.toFixed(2)
      }
    }
  );


  const onSubmit = async (data,event) => {
    event.preventDefault();

    try {
        if (dialog.function === addUserPurchase) {
          await dialog.function(data.price, dialog.stock.ticker, data.quantity, dialog.token);
        } else if (dialog.function === addUserSale) {
          await dialog.function(dialog.stock.ticker, data.quantity, data.price, dialog.token);
        }
        handleClose();
        navigate("/");
    } catch (error) {
      if(error.response.data.detail === "Insufficient funds"){
        setServerError("ERROR! " +error.response.data.detail)
      }
      console.error("Error:", error);
    }
  };

  // useEffect(() => {
  //   console.log(dialog)
  // },[])


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
                type="number" step="any"
                // value = {dialog.stock.price}
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
              {serverError? <p>{serverError}</p>: null}
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
