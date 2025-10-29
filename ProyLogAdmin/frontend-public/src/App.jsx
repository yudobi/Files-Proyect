// src/App.js
import React from 'react';
import Navbar from './components/componentesGenerales/Navbar';
import WhatsAppFloat from './components/componentesGenerales/WhatsAppFloat';
import Footer from './components/componentesGenerales/Footer';
import AppRoutes from './routes/Routes';
import { CartProvider } from './context/CartContext';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Tu Client ID de Sandbox


const paypalOptions = {
  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID, // ❗ obligatorio y entre comillas
  currency: "MXN",
  intent: "capture",
};

function App() {
  return (
    <PayPalScriptProvider options={paypalOptions}>
      <CartProvider>
        <div>
          <Navbar />
          <main>
            <AppRoutes />
          </main>
          <WhatsAppFloat />
          <Footer />
        </div>
      </CartProvider>
    </PayPalScriptProvider>
  );
}

export default App;


/*
import React from 'react';
import Navbar from './components/componentesGenerales/Navbar';
import WhatsAppFloat from './components/componentesGenerales/WhatsAppFloat';
import Footer from './components/componentesGenerales/Footer';
import AppRoutes from './routes/Routes';
import { CartProvider } from './context/CartContext';



function App() {
  return (
   <CartProvider> 
      <div >
        <Navbar />
        <main>
          <AppRoutes />
        </main>
        <WhatsAppFloat />
        <Footer />
      </div>
   </CartProvider>
  );
}

export default App;  */
