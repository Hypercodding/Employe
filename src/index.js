import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/authContext'; // Import the AuthProvider
import './index.css';
import App from './App';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap your App with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
