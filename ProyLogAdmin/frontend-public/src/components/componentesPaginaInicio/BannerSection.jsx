import React from 'react';
import '../../stayles/estiloPaginaDeInicio.css';

const BannerSection = () => {
  return (
    <section className="banner-section">
      <div className="banner-content">
        <h2 className="banner-title">Ofertas Especiales</h2>
        <p className="banner-text">
          Esta semana tenemos descuentos exclusivos en electrónicos y moda. No pierdas la oportunidad de adquirir tus productos favoritos con hasta un 40% de descuento.
        </p>
        <button className="hero-btn" style={{backgroundColor: '#6e8efb', color: 'white'}}>
          Ver Ofertas
        </button>
      </div>
    </section>
  );
};

export default BannerSection;