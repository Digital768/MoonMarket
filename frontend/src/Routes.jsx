import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import App from './App';
import ErrorPage from './ErrorPage';
import StockPage from './StockPage';
import StockItem from './StockItem';
import Login from "./Login";
import Logout from "./Logout";

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
          errorElement: <ErrorPage/>
        },
        {
          path: "portfolio/:stockTicker",
          element: <StockPage />,
          errorElement: <ErrorPage/>
        },
        {
          path: "/logout",
          element: <Logout/>,
        },
        {
          path: "stock/:stockTicker",
          element: <StockItem/>,
          errorElement: <ErrorPage/>
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