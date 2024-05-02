import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorPage from './ErrorPage';
import StockPage from './StockPage';
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import StockItem from './StockItem';
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Routes from "./Routes";


const queryClient = new QueryClient();


// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App /> ,
//     errorElement: <ErrorPage/>
//   }, 
//   {
//     path: "portfolio/:stockTicker",
//     element: <StockPage />,
//     errorElement: <ErrorPage/>
//   },
//   {
//     path: "stock/:stockTicker",
//     element: <StockItem/>,
//     errorElement: <ErrorPage/>
//   }
// ])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    {/* <RouterProvider router={router}/> */}
    <Routes/>
    </QueryClientProvider>
    </React.StrictMode>
);

