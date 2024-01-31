import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import { Login } from './components/Login';
import Register from './components/Register';
import Employee from './components/Employee';
import { Signin } from './components/Signin';
// import { AuthProvider } from './context/emp/authContext';
import EmpStates from './context/emp/EmpStates';
import {Register_company} from './components/Register_company';
import Company from './components/Company';
import Inventry from './components/Inventry';
import FetchUserData from './components/FetchUserData';

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
      <EmpStates>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Home />} path="/home" exact />
          <Route element={<Employee />} path="/employee" exact />
          <Route element={<Signin />} path="/signin" exact />
          <Route element={<Register />} path="/register" exact />
          <Route element={<Company />} path="/company" exact />
          <Route element={<Register_company />} path="/register_company" exact />
          <Route element={<FetchUserData />} path="/fetchUserData" exact />
          <Route element={<Inventry />} path="/inventry" exact />
        </Route>
      </Routes>
      </EmpStates>
    </>
  );
}

export default App;
