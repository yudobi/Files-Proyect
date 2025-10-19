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

export default App;
