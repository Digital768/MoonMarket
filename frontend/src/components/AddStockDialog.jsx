import { postApiStock } from "@/api/stock";
import { addUserPurchase, addStockToPortfolio } from "@/api/user";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "@/styles/portfolio.css";

export default function AddStockDialog({ stock, token }) {

  const queryClient = useQueryClient();

  const { mutateAsync: addStockMutation } = useMutation({
    mutationFn: ({ portfolioStock, price, quantity, token }) =>
      addStockToPortfolio(portfolioStock, price, quantity, token),
    // onSuccess: () => {
    //   queryClient.invalidateQueries({queryKey: ["user"]})
    // }
    //NOT SURE IF WORKING
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      price: stock.price.toFixed(2)
    }
  });

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [portfolioStock, setPortfolioStock] = useState({
    name: stock.name,
    ticker: stock.ticker,
    description: stock.description,
    price: stock.price,
  });
  const [serverError, setServerError] = useState(null)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data) => {
    try {
      await addStockMutation({
        portfolioStock,
        price: data.price,
        quantity: data.quantity,
        token,
      });
      handleClose();
      navigate("/portfolio");
    } catch (error) {
      if(error.response.data.detail === "Insufficient funds"){
        setServerError("ERROR! " +error.response.data.detail)
      }
      console.error("Error:", error);
    }
  };

  return (
    <React.Fragment>
      <Button variant="contained" onClick={handleClickOpen} sx={{marginLeft:'10px'}}>
        Add stock
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a stock</DialogTitle>
        <DialogContent className="addStockForm">
          <DialogContentText>
            To add a stock to your portfolio, please enter how many stocks of
            the company you bought and at which price.
          </DialogContentText>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="price-row" >
            <label>Enter bought price</label>
            <input
              {...register("price", {
                required: "must be greater than 0",
                min: 1,
                valueAsNumber: true,
              })}
              type="number" 
              step="any"
              // value = {portfolioStock.price}
              style={{marginLeft:'10px', marginRight:'10px'}}
            />
            {errors.price && <span>This field is required</span>}
            </div>
            <div className="quantity-row">
            <label>Enter quantity</label>
            <input
              {...register("quantity", {
                required: "must be greater than 0",
                min: 1,
                valueAsNumber: true,
              })}
              type="number"
              style={{marginLeft:'10px', marginRight:'10px'}}
            />
            {errors.price && <span>This field is required</span>}
            {serverError? <p>{serverError}</p>: null}
            </div>
            <DialogActions>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Add
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
