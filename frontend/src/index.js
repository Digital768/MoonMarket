import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import ErrorPage from './ErrorPage';
import StockPage from './StockPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App /> ,
    errorElement: <ErrorPage/>
  }, 
  {
    path: "stock/:stockTicker",
    element: <StockPage />,
    errorElement: <ErrorPage/>
  }
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
    </React.StrictMode>
);

