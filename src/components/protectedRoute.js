import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const ProtectedRoute = () => {
  const isAuthenticated = checkAuthentication();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await checkAuthentication();
        if (!isAuthenticated) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        navigate('/');
      }
    };

    checkAuth();
  }, [navigate]);

  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;

const checkAuthentication = async () => {
  try {
    const token = sessionStorage.getItem('token');
    // Simulate an asynchronous check (e.g., validate token with a server)
    // Replace this with your actual async logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};
