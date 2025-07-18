import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import '../../stayles/estiloFoot.css';

const Footer = () => {
  return (
    <footer id="main-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Nosotros</h3>
          <p>Comprometidos con la calidad y la satisfacción de nuestros clientes.</p>
        </div>

        <div className="footer-section">
          <h3>Enlaces Rápidos</h3>
          <a href="/">Inicio</a>
          <a href="/productos">Productos</a>
          <a href="/servicios">Servicios</a>
          <a href="/contacto">Contacto</a>
        </div>

        <div className="footer-section">
          <h3>Contacto</h3>
          <p>contacto@mitienda.com</p>
          <p>+1 234 567 890</p>
          <p>Calle Principal 123, Ciudad</p>
        </div>

        <div className="footer-section">
          <h3>Redes Sociales</h3>
          <div className="social-icons">
            <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
            <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="#"><FontAwesomeIcon icon={faLinkedinIn} /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 MiTienda. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;