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
      <div className="image-container">  {/* Nuevo contenedor para la imagen */}
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