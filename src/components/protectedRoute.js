import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoutes = () => {
  // Assume you have a function to check the authentication status
  const isAuthenticated = checkAuthentication(); 

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;

// Function to check authentication status (replace it with your actual logic)
const checkAuthentication = () => {
  const token = localStorage.getItem('token');
   // Retrieve the token from local storage
  return !!token; // Return true if the token exists, false otherwise
};
