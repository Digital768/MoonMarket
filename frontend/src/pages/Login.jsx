import { useNavigate } from 'react-router-dom';
import { useAuth } from "./AuthProvider";
import { useState } from 'react';
import {loginUser} from '@/api/user'

const Login = () => {
    const { setToken } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleLogin = (jwtToken) => {
      setToken(jwtToken);
      navigate("/", { replace: true });
    };
  

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response =  await loginUser(email,password)
        // Handle the response from the server
        const { access_token, refresh_token } = response.data;
        // Store the tokens or perform additional actions
  
        // Reset the form fields
        setEmail('');
        setPassword('');
        handleLogin(access_token);
      } catch (error) {
        // Handle the error
        if (error.response && error.response.data) {
          setError(error.response.data.detail);
        } else {
          setError('An unexpected error occurred');
        }
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        {error && <div>{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    );
  };
  
  export default Login;