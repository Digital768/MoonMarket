import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Logo from "@/components/Logo";
import '@/styles/logo.css'




export const ProtectedRoute = () => {
    const { token } = useAuth();
  // todo: need to check if the token is acutally valid and not just exist
    // Check if the user is authenticated
    if (!token) {
      // If not authenticated, redirect to the login page
      return <Navigate to="/login" replace={true}/>;
    }
  
    // If authenticated, render the child routes
    return <>
    <Logo/>
    <Outlet />
    </>;
  };