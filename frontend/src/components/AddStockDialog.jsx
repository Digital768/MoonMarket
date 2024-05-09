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
  } = useForm();

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [portfolioStock, setPortfolioStock] = useState({
    name: stock.name,
    ticker: stock.ticker,
    description: stock.description,
    price: stock.price,
  });

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
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <React.Fragment>
      <Button variant="contained" onClick={handleClickOpen}>
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
            <label>Enter bought price</label>
            <input
              {...register("price", {
                required: "must be greater than 0",
                min: 1,
                valueAsNumber: true,
              })}
              type="number"
            />
            {errors.price && <span>This field is required</span>}
            <label>Enter quantity</label>
            <input
              {...register("quantity", {
                required: "must be greater than 0",
                min: 1,
                valueAsNumber: true,
              })}
              type="number"
            />
            {errors.price && <span>This field is required</span>}
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
