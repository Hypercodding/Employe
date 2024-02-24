import React from 'react';
// App.js
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import { Login } from './components/Login';
// import Register from './components/Register';
import Employee from './components/Employee';
import { Signin } from './components/Signin';
import {Register_company} from './components/Register_company';
import Company from './components/Company';
import Inventry from './components/Inventory';
import FetchUserData from './components/FetchUserData';
import { SellProduct } from './components/SellProduct';
import { AuthProvider, useAuth } from './context/authContext'; // Import useAuth and AuthProvider

import OutProduct  from './components/OutProduct';
import Salary  from './components/Salary';
import AddLeave from './components/AddLeaves';
import Leaves from './components/Leaves';
import Loans from './components/Loans';
import GenerateSalary from './components/GenerateSalary';
import Account from './components/Account';
import PurchaseForm from './components/PurchaseForm';
import PurchaseTable from './components/PurchaseTable';
// import AddEmp from './components/AddEmp';
import Register from './components/Register';
import ERPHome from './components/ERPHome';
import Item from './components/Item';
import ForgotPassword from './components/ForgetPassword';
import ResetPassword from './components/ResetPassword';
import AddProduct from './components/AddProduct';
import Inventory from './components/Inventory';



function App() {
  return (
    <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
  );
}
function AppContent() {
  const location = useLocation();
  const { isLoggedIn } = useAuth(); // Assuming you have a useAuth hook from your authentication context

  if (!isLoggedIn && location.pathname === '/Login') {
    // If not authenticated and on the root path, redirect to the login page
    return <Login />;
  }
  return (
    <>
            <header>
  {location.pathname !== '/login' && location.pathname !== '/' && location.pathname !== '/forgotPassword' && location.pathname !== '/resetPassword' && <Navbar />}
</header>

     
      <Routes>
      <Route path="/" element={<ERPHome />} />
      
      <Route element={<ForgotPassword />} path="/forgotPassword" exact />
      <Route element={<ResetPassword />} path="/resetPassword" exact />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Home />} path="/home" exact />
          
          <Route element={<Employee />} path="/employee" exact />
          <Route element={<Signin />} path="/signin" exact />
          <Route element={<Register />} path="/register" exact />
          <Route element={<Company />} path="/company" exact />
          <Route element={<Register_company />} path="/register_company" exact />
          <Route element={<FetchUserData />} path="/fetchUserData" exact />
          <Route element={<SellProduct />} path="/sellProduct" exact />
          <Route element={<Salary />} path="/salary" exact />
          <Route element={<AddLeave/>} path="/addLeaves" exact />  
          <Route element={<Leaves/>} path="/Leaves" exact />
          <Route element={<Loans/>} path="/Loan" exact />          
          <Route element={<OutProduct />} path="/outProduct" exact />
          <Route element={<GenerateSalary/>} path="/generateSalary" exact />
          <Route element={<Account/>} path="/account" exact />
          <Route element={<PurchaseForm/>} path="/addPurchase" exact />
          <Route element={<PurchaseTable/>} path="/Purchase" exact />
          <Route element={<Item/>} path="/Item" exact />
          <Route element={<AddProduct/>} path="/addProduct" exact />
          <Route element={<Inventory/>} path="/inventry" exact />

        </Route>
      </Routes>
    </>
  );
}

export default App;
