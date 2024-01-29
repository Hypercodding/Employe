import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ProtectedRoute from './components/protectedRoute';
import { Login } from './components/Login';
import Register from './components/Register';
import Employee from './components/Employee';
import { Signin } from './components/Signin';
// import { AuthProvider } from './context/emp/authContext';
import EmpStates from './context/emp/EmpStates';

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <>
            <header>
        {location.pathname !== '/' ? <Navbar /> : null}
      </header>
      {/* {localStorage.getItem('token') ? <Navbar /> : null} */}
      <EmpStates>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Home />} path="/home" exact />
          <Route element={<Employee />} path="/employee" exact />
          <Route element={<Signin />} path="/signin" exact />
          <Route element={<Register />} path="/register" exact />
        </Route>
      </Routes>
      </EmpStates>
    </>
  );
}

export default App;
