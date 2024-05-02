import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";

const Routes = () => {
  const { token } = useAuth();


  // Define routes accessible only to authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/login",
      element: <div>Login</div>,
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
          element: <div>Logout</div>,
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