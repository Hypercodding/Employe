import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import { Login } from './components/Login';
// import Register from './components/Register';
import Employee from './components/Employee';
import { Signin } from './components/Signin';
// import { AuthProvider } from './context/emp/authContext';
import EmpStates from './context/emp/EmpStates';
import {Register_company} from './components/Register_company';
import Company from './components/Company';
import Inventry from './components/Inventry';
import FetchUserData from './components/FetchUserData';
import { Add_item } from './components/Add_item';
import { SellProduct } from './components/SellProduct';

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
          <Route element={<Add_item />} path="/add_item" exact />
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
        </Route>
      </Routes>
      </EmpStates>
    </>
  );
}

export default App;
