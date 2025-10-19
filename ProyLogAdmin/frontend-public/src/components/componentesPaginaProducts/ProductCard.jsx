import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../../context/CartContext'; // Importar el contexto

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Usar el hook del carrito

  const handleClick = (e) => {
    if (e.target.closest('.add-to-cart')) return;
    navigate(`/products/${product.id}`);
  };

  // Determinar disponibilidad basada en el stock
  const getAvailability = () => {
    if (product.stock === 0) return 'out-of-stock';
    if (product.stock <= 5) return 'limited';
    return 'in-stock';
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevenir que se active el navigate
    e.preventDefault();
    
    if (availability === 'out-of-stock') return;

    // Crear objeto producto para el carrito
    const productForCart = {
      id: product.id,
      nombre: product.title,
      precio: product.price,
      imagen: product.images[0]?.image || 'https://via.placeholder.com/300',
      descripcion: product.description,
      stock: product.stock,
      brand: product.brand?.name,
      original_price: product.original_price,
      discount: product.discount
    };

    addToCart(productForCart);
    
    // Opcional: Mostrar notificación
    // Puedes usar un toast library o un state para mostrar mensajes
    console.log(`${product.title} agregado al carrito!`);
    
    // Opción simple: alert temporal
    // alert(`${product.title} agregado al carrito!`);
  };

  const availability = getAvailability();
  const availabilityText = {
    'in-stock': 'Disponible',
    'limited': 'Últimas unidades',
    'out-of-stock': 'Agotado'
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <span className={`availability ${availability}`}>
        {availabilityText[availability]}
      </span>
      <div className="brand-logo">
        <img src={product.brand?.logo} alt={`Logo ${product.brand?.name}`} />
      </div>
      <div className="image-container">
        <img 
          src={product.images[0]?.image || 'https://via.placeholder.com/300'} 
          alt={product.title} 
          className="product-image" 
        />
      </div>
      <div className="product-content">
        <h3 className="product-title">{product.title}</h3>
        <div className="product-description">
          {product.description}
        </div>
        <div className="product-price">
          {product.original_price && product.original_price > product.price && (
            <div>
              <span className="original-price">${product.original_price}</span>
              <span className="price">${product.price}</span>
            </div>
          )}
          {(!product.original_price || product.original_price <= product.price) && (
            <span className="price">${product.price}</span>
          )}
          {product.discount > 0 && (
            <span className="discount-badge">-{product.discount}%</span>
          )}
        </div>
        <button 
          className={`add-to-cart ${availability === 'out-of-stock' ? 'disabled' : ''}`}
          onClick={handleAddToCart}
          disabled={availability === 'out-of-stock'}
        >
          <FontAwesomeIcon icon={faShoppingCart} /> 
          {availability === 'out-of-stock' ? 'No disponible' : 'Añadir al carrito'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;



/*
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (e.target.closest('.add-to-cart')) return;
    navigate(`/products/${product.id}`);
  };

  // Determinar disponibilidad basada en el stock
  const getAvailability = () => {
    if (product.stock === 0) return 'out-of-stock';
    if (product.stock <= 5) return 'limited';
    return 'in-stock';
  };

  const availability = getAvailability();
  const availabilityText = {
    'in-stock': 'Disponible',
    'limited': 'Últimas unidades',
    'out-of-stock': 'Agotado'
  };

  return (
  <div className="product-card" onClick={handleClick}>
     <span className={`availability ${availability}`}>
        {availabilityText[availability]}
      </span>
      <div className="brand-logo">
        <img src={product.brand.logo} alt={`Logo ${product.brand.name}`} />
      </div>
      <div className="image-container">  
        <img 
          src={product.images[0]?.image || 'https://via.placeholder.com/300'} 
          alt={product.title} 
          className="product-image" 
        />
      </div>
    <div className="product-content">
      <h3 className="product-title">{product.title}</h3>
      <div className="product-description">
        {product.description}
      </div>
      <div className="product-price">
        {product.original_price && (
            <div>
              <span className="original-price">${product.original_price}</span>
              <span className="price">${product.price}</span>
            </div>
          )}
          {!product.original_price && <span className="price">${product.price}</span>}
          {product.discount > 0 && (
            <span className="discount-badge">-{product.discount}%</span>
          )}
      </div>
      <button className={`add-to-cart ${availability === 'out-of-stock' ? 'disabled' : ''}`}>
        <FontAwesomeIcon icon={faShoppingCart} /> 
        {availability === 'out-of-stock' ? 'No disponible' : 'Añadir al carrito'}
      </button>
    </div>
  </div>
);

 


  
};

export default ProductCard;
*/