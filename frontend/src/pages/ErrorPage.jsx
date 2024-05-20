// ErrorPage.js
import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { useAuth } from "@/pages/AuthProvider";

const ErrorPage = () => {
  const error = useRouteError();
  const { clearToken } = useAuth();
  const navigate = useNavigate();

  // Log the error object to the console for debugging
  console.error('Route Error:', error);

  let errorMessage;
  let isUnauthorized = false;

  // Check if the error is an AxiosError with status 401
  if (error?.response?.status === 401) {
    clearToken(); // Clear the authentication token
    navigate('/login');
    errorMessage = "Credentials are not provided.";
    isUnauthorized = true;
  } else {
    errorMessage = "An unexpected error occurred.";
  }

  const handleLoginRedirect = () => {
    clearToken(); // Clear the authentication token
    navigate('/login');
  };

  return (
    <div>
      <h1>Error</h1>
      <p>{errorMessage}</p>
      {isUnauthorized && (
        <button onClick={handleLoginRedirect}>Go to Login</button>
      )}
    </div>
  );
};

export default ErrorPage;
