import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Logo from "@/components/Logo";
import '@/styles/logo.css'




export const PublicRoute = () => {
    const { token } = useAuth();
    
    return token ?<Navigate to="/portfolio" /> :<Outlet />
  };