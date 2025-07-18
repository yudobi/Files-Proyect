import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShippingFast, faShieldAlt, faHeadset } from '@fortawesome/free-solid-svg-icons';
import '../../stayles/estiloPaginaDeInicio.css';

const FeaturesSection = () => {
  const features = [
    {
      icon: <FontAwesomeIcon icon={faShippingFast} />,
      title: "Envío Rápido",
      text: "Entregamos tus productos en 24-48 horas en toda la ciudad. Envío gratuito para pedidos superiores a $50."
    },
    {
      icon: <FontAwesomeIcon icon={faShieldAlt} />,
      title: "Garantía de Calidad",
      text: "Todos nuestros productos pasan por rigurosos controles de calidad para garantizar tu satisfacción."
    },
    {
      icon: <FontAwesomeIcon icon={faHeadset} />,
      title: "Soporte 24/7",
      text: "Nuestro equipo de soporte está disponible para ayudarte en cualquier momento del día."
    }
  ];

  return (
    <section className="features-section">
      <h2 className="section-title">¿Por qué elegirnos?</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-text">{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;