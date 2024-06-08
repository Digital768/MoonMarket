import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";




export const PublicRoute = () => {
    const { token } = useAuth();
    
    return token ?<Navigate to="/portfolio" /> :<Outlet />
  };