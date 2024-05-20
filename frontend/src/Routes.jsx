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
import {redirect} from 'react-router-dom';
import {PublicRoute} from '@/pages/PublicRoute'

const Routes = () => {
  const { token } = useAuth();


  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute/>,
      children: [
        {
          path: '/portfolio',
          element: <App /> ,
          errorElement: <ErrorPage/>,
          loader: async () => {
            console.log("loader activated")
            const user = await getUserData(token)
            // console.log("user: " , user.data)
            return user
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
      ]
    },
    {
      path: '/login',
      element: <PublicRoute />,
      children: [
        {
          path: '/login',
          element: <Login />
        }
      ]
    }
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;



