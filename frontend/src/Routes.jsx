import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "@/pages/AuthProvider";
import { ProtectedRoute } from "@/pages/ProtectedRoute";
import App, { action as appAction, loader as appLoader } from '@/pages/App';
import ErrorPage from '@/pages/ErrorPage';
import StockPage, { loader as stockPageLoader } from '@/pages/StockPage';
import StockItem, {loader as stockItemLoader} from '@/pages/StockItem';
import Login from "@/pages/Login";
import Logout from "@/pages/Logout";
import { PublicRoute } from '@/pages/PublicRoute'

const Routes = () => {
  const { token } = useAuth();

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: '/portfolio',
          element: <App />,
          errorElement: <ErrorPage />,
          loader: appLoader(token),
          action: appAction
        },
        {
          path: "portfolio/:stockTicker",
          element: <StockPage />,
          errorElement: <ErrorPage />,
          loader: async ({ params }) => { return stockPageLoader(params.stockTicker, token) }
        },
        {
          path: "/logout",
          element: <Logout />,
        },
        {
          path: "stock/:stockTicker",
          element: <StockItem />,
          errorElement: <ErrorPage />,
          loader: ({ params }) => {
            return stockItemLoader(params.stockTicker, token)
          }
        }
      ]
    },
    {
      path: "/login",
      element: <PublicRoute />,
      children: [
        {
          path: "/login",
          element: <Login />,
        },
      ],
    },
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
