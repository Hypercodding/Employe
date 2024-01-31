import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import '/node_modules/primeflex/primeflex.css';
import 'primeicons/primeicons.css';

import "primereact/resources/themes/lara-light-cyan/theme.css";
// /node_modules/primeflex/primeflex.css


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <App />
</React.StrictMode>
);

