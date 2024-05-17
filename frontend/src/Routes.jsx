import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "@/pages/AuthProvider";
import { ProtectedRoute } from "@/pages/ProtectedRoute";
import App from '@/pages/App';
import ErrorPage from '@/pages/ErrorPage';
import StockPage from '@/pages/StockPage';
import StockItem from '@/pages/StockItem';
import Login from "@/pages/Login";
import Logout from "@/pages/Logout";
import {getUserData} from '@/api/user'
import {getStockFromPortfolio, getStockData} from '@/api/stock'

const Routes = () => {
  const { token } = useAuth();


  // Define routes accessible only to authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/login",
      element: <Login/>,
    },
  ];
  
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: '/',
          element: <App /> ,
          errorElement: <ErrorPage/>,
          loader: () => {
            return getUserData(token)
          }
        },
        {
          path: "portfolio/:stockTicker",
          element: <StockPage />,
          errorElement: <ErrorPage/>,
          loader: ({params}) => {
            return getStockFromPortfolio(params.stockTicker, token)
          }
        },
        {
          path: "/logout",
          element: <Logout/>,
        },
        {
          path: "stock/:stockTicker",
          element: <StockItem/>,
          errorElement: <ErrorPage/>,
          loader: ({params}) => {
            return getStockData(params.stockTicker, token)
          }
        }
      ],
    },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;