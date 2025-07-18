import React from 'react';
import '../../stayles/estiloPaginaDeGaleria.css';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/product");
  }

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Bienvenido a MiTienda</h1>
        <p className="hero-subtitle">Descubre los mejores productos con las mejores ofertas del mercado</p>
        <button className="hero-btn" onClick={handleClick}>Explorar Productos</button>
      </div>
    </section>
  );
};

export default HeroSection;