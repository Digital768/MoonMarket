import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import "@/styles/index.css";
import Routes from "./Routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "@/pages/AuthProvider.jsx";
import { darkTheme } from "./theme";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <AuthProvider>
          <CssBaseline />
          <Routes />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);


