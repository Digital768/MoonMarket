import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Logo from "@/components/Logo";
import '@/styles/logo.css'
import {getUserName} from '@/api/user'
import { useLoaderData } from "react-router-dom";
import { useEffect } from "react";


export const loader = (token) => async () => {
  // console.log("loader activated")
  const userName = await getUserName(token)
  // console.log("user: " , user.data)
  return userName
}


export const ProtectedRoute = () => {
    const { token } = useAuth();
    const data = useLoaderData();
    const username = data.data
    const firstLetter = data.data.charAt(0);
  // todo: need to check if the token is acutally valid and not just exist
    // Check if the user is authenticated
    if (!token) {
      // If not authenticated, redirect to the login page
      return <Navigate to="/login" replace={true}/>;
    }

    // useEffect(() => {console.log(username);}, 
    // [data]);
  
    // If authenticated, render the child routes
    return <>
    <Logo firstLetter={firstLetter}/>
    <Outlet />
    </>;
  };