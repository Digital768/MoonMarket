import { addStockToPortfolio } from "@/api/user";
import { transactionSchema } from "@/schemas/transaction";
import "@/styles/portfolio.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate} from "react-router-dom";

function TradeStocksForm({ stock, token, cancelAction }) {
  const [serverError, setServerError] = useState(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    defaultValues: {
      price: stock.price.toFixed(2),
    },
    resolver: zodResolver(transactionSchema),
    criteriaMode: 'all'
  });

  const navigate = useNavigate();

  const { mutateAsync: addStockMutation } = useMutation({
    mutationFn: ({ portfolioStock, price, quantity, token }) =>
      addStockToPortfolio(portfolioStock, price, quantity, token),
  });

  const onSubmit = async (data) => {
    try {
      const portfolioStock = {
        name: stock.name,
        ticker: stock.ticker,
        description: stock.description,
        price: stock.price,
      };
  
      // Only include earnings if it's not null
      if (stock.earningsAnnouncement !== null) {
        portfolioStock.earnings = stock.earningsAnnouncement;
      }
  
      await addStockMutation({
        portfolioStock,
        price: data.price,
        quantity: data.quantity,
        token,
      });
      navigate("/portfolio");
    } catch (error) {
      if (error.response && error.response.status > 200) {
        setServerError("ERROR! " + error.response.data.detail);
      }
      console.error("Error:", error);
    }
  };

  useEffect(()=>{
    console.log(stock)
  }, [])

  return (
    <Box
      component={"form"}
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <label>Enter bought price</label>
        <TextField {...register("price")} />
        <Typography variant="body2" sx={{ color: "red" }}>
          {errors.price?.message ?? null}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <label>Enter quantity</label>
        <TextField {...register("quantity")} />
        <Typography variant="body2" sx={{ color: "red" }}>
          {errors.quantity?.message ?? null}
          {serverError}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button variant="outlined" onClick={cancelAction}>
          Cancel
        </Button>
        <Button variant="contained" type="submit">
          Add
        </Button>
      </Box>
    </Box>
  );
}

export default TradeStocksForm;
