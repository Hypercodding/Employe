import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import '/node_modules/primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import {AuthProvider} from './context/emp/authContext';

import "primereact/resources/themes/lara-light-cyan/theme.css";
// /node_modules/primeflex/primeflex.css


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
  <App />
  </AuthProvider>
</React.StrictMode>
);

