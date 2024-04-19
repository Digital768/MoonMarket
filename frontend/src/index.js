import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import StockPage from './StockPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App /> ,
    errorElement: <NotFoundPage/>
  }, 
  {
    path: "Stock/:stockName",
    element: <StockPage />,
    errorElement: <NotFoundPage/>
  }
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router}/>
);

