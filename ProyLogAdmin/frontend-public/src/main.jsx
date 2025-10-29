// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import './config/fontAwesome';

// ⚙️ Configuración inicial del SDK de PayPal
const initialOptions = {
  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID, // desde .env
  currency: "MXN",
  intent: "capture", // "authorize" si manejas pagos diferidos
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Envolvemos toda la app dentro del proveedor de PayPal */}
      <PayPalScriptProvider options={initialOptions}>
        <App />
      </PayPalScriptProvider>
    </BrowserRouter>
  </React.StrictMode>
);

/*
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
//import './index.css';
import { BrowserRouter } from 'react-router-dom';
import './config/fontAwesome';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
*/