import { z } from "zod";

// Define a schema
export const transactionSchema = z.object({
  price: z
    .number({
      coerce: true,
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive({ message: "Price must be positive" }),
  quantity: z
    .number({
      coerce: true,
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .positive({ message: "Quantity must be positive" }),
});

