
import '../../stayles/estiloNav.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';


const Navbar = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <FontAwesomeIcon icon={faHouse} />
        <span>MiTienda</span>
      </Link>

      <div 
        className={`menu-toggle ${isActive ? 'active' : ''}`} 
        onClick={() => setIsActive(!isActive)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={`nav-links ${isActive ? 'active' : ''}`}>
        <li><Link to="/" className="active">Inicio</Link></li>
        <li><Link to="/productos">Productos</Link></li>
        <li><Link to="/categorias">Categorías</Link></li>
        <li><Link to="/servicios">Servicios</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;