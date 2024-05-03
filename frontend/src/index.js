import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Routes from "./Routes";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import AuthProvider from "./AuthProvider";

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
    <AuthProvider>
      <Routes/>
    </AuthProvider>
    </QueryClientProvider>
    </React.StrictMode>
);

