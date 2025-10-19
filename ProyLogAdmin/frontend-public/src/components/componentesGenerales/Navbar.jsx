import '../../stayles/estiloNav.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../../context/CartContext'; // Importar el contexto

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);
  const { getCartItemsCount } = useCart(); // Usar el hook del carrito

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
        <li className="cart-nav-item">
          <Link to="/cart" className="cart-link">
            <FontAwesomeIcon icon={faShoppingCart} />
            <span className="cart-text">Carrito</span>
            {getCartItemsCount() > 0 && (
              <span className="cart-badge">{getCartItemsCount()}</span>
            )}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;


/*
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
*/