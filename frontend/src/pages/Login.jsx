import { useNavigate } from 'react-router-dom';
import { useAuth } from "./AuthProvider";
import { useState } from 'react';
import { loginUser, refreshJwtKey } from '@/api/user'
import { useForm } from "react-hook-form";

const Login = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = (jwtToken) => {
    setToken(jwtToken);
    navigate("/", { replace: true });
  };


  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data.email, data.password);
      // Handle the response from the server
      const { access_token, refresh_token, access_token_expires } = response.data;
      // console.log('Access token: ' + access_token, "Refresh token: " + refresh_token);

      // Reset the form fields
      handleLogin(access_token, access_token_expires);
      scheduleTokenRefresh(refresh_token, access_token_expires);
    } catch (error) {
      // Handle the error
      if (error.response && error.response.data) {
        setError(error.response.data.detail);
      } else {
        console.log(error);
      }
    }
  };


  // Function to parse ISO 8601 durations
  function parseISO8601Duration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (match[1] ? parseInt(match[1]) : 0);
    const minutes = (match[2] ? parseInt(match[2]) : 0);
    const seconds = (match[3] ? parseInt(match[3]) : 0);
    return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
  }

  // Function to schedule the token refresh
  function scheduleTokenRefresh(token, expiresIn) {
    // Convert the ISO 8601 duration to milliseconds
    const duration = parseISO8601Duration(expiresIn);
    const delay = duration - 5000; // 5000 ms = 5 seconds
    
    // Schedule the token refresh
    setTimeout(() => refreshToken(token), delay);
  }

  async function refreshToken(token) {
    console.log("refreshing jwt key...");
    // Call your API to refresh the token
    const response = await refreshJwtKey(token)
    const { access_token } = response.data;

    // Update the tokens in your application
    setToken(access_token);
    
    // Set up the next refresh
    scheduleTokenRefresh(access_token, response.data.access_token_expires);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <div>{error}</div>}
      <input
        {...register("email", {
          required: true
        })}
        type="email"
        placeholder="Email"
      />

      <input
        {...register("password", {
          required: true
        })}
        type="password"
        placeholder="Password"
      />

      <button type="submit">Login</button>
    </form>
  );
};

export default Login;