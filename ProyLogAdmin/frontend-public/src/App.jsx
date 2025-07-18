import React from 'react';
import Navbar from './components/componentesGenerales/Navbar';
import WhatsAppFloat from './components/componentesGenerales/WhatsAppFloat';
import Footer from './components/componentesGenerales/Footer';
import AppRoutes from './routes/Routes';



function App() {
  return (
    <div >
      <Navbar />
      <main>
        <AppRoutes />
      </main>
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}

export default App;
