import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from "../../api";
import '../../styles/stylesAdmin/ProductCard.css';

const ProductCard = ({ product, onDelete }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de eliminar el producto "${product.title}"?`)) {
      setIsDeleting(true);
      try {
        await api.delete(`products/${product.id}/`);
        onDelete(product.id); // Notificar al componente padre
      } catch (error) {
        console.error("Error eliminando producto:", error);
        alert("Ocurrió un error al eliminar el producto");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="product-card">
      {/* Badges para featured y category_deal */}
      <div className="badges-container">
        {product.featured && <span className="badge featured">Destacado</span>}
        {product.category_deal && <span className="badge deal">Oferta</span>}
      </div>
      
      {/* Carrusel de imágenes */}
      <div className="image-carousel">
        {product.images.length > 1 && (
          <button className="carousel-button prev" onClick={prevImage}>&lt;</button>
        )}
        
        <img 
          src={product.images[currentImageIndex]?.image} 
          alt={product.title} 
          className="product-image"
        />
        
        {product.images.length > 1 && (
          <button className="carousel-button next" onClick={nextImage}>&gt;</button>
        )}
        
        {/* Indicadores de imágenes */}
        {product.images.length > 1 && (
          <div className="image-indicators">
            {product.images.map((_, index) => (
              <span 
                key={index} 
                className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Información del producto */}
      <div className="product-info">
        <div className="brand-info">
          <img src={product.brand?.logo} alt={product.brand?.name} className="brand-logo" />
          <span className="brand-name">{product.brand?.name}</span>
        </div>
        
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="price-section">
          {product.discount > 0 && (
            <div className="original-price">${product.original_price}</div>
          )}
          <div className="current-price">${product.price}</div>
          {product.discount > 0 && (
            <div className="discount-badge">-{product.discount}%</div>
          )}
        </div>
        
        <div className="stock-info">
          {product.stock > 0 ? (
            <span className="in-stock">Disponible ({product.stock} unidades)</span>
          ) : (
            <span className="out-of-stock">Agotado</span>
          )}
        </div>
        
        <div className="category">{product.category}</div>
        
        {/* Botones de administración */}
        <div className="admin-actions">
          <Link 
            to={`/edit-product/${product.id}`}
            className="admin-button edit-button"
          >
            <i className="fas fa-edit"></i> Editar
          </Link>
          <button 
            onClick={handleDelete}
            className="admin-button delete-button"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span>Eliminando...</span>
            ) : (
              <>
                <i className="fas fa-trash"></i> Eliminar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;






































{/* 

import React, { useState } from 'react';
import api from "../api"; // Asegúrate de que la ruta sea correcta
import '../styles/ProductCard.css'; // Asegúrate de tener un archivo CSS para estilos

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };
  console.log(product)
  return (
    
    <div className="product-card">
      
      <div className="badges-container">
        {product.featured && <span className="badge featured">Destacado</span>}
        {product.category_deal && <span className="badge deal">Oferta</span>}
        
      </div>
      
      
      
      <div className="image-carousel">
        {product.images.length > 1 && (
          <button className="carousel-button prev" onClick={prevImage}>&lt;</button>
        )}
        
        <img 
          src={product.images[currentImageIndex].image} 
          alt={product.title} 
          className="product-image"
        />
        
        {product.images.length > 1 && (
          <button className="carousel-button next" onClick={nextImage}>&gt;</button>
        )}
        
        
        {product.images.length > 1 && (
          <div className="image-indicators">
            {product.images.map((_, index) => (
              <span 
                key={index} 
                className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
      
      
      
      <div className="product-info">
        
        <div className="brand-info">
          <img src={product.brand?.logo} alt={product.brand?.name} className="brand-logo" />
          <span className="brand-name">{product.brand?.name}</span>
        </div>
        
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="price-section">
          {product.discount > 0 && (
            <div className="original-price">${product.original_price}</div>
          )}
          <div className="current-price">${product.price}</div>
          {product.discount > 0 && (
            <div className="discount-badge">-{product.discount}%</div>
          )}
        </div>
        
        <div className="stock-info">
          {product.stock > 0 ? (
            <span className="in-stock">Disponible ({product.stock} unidades)</span>
          ) : (
            <span className="out-of-stock">Agotado</span>
          )}
        </div>
        
        <div className="category">{product.category}</div>
      </div>
    </div>
  );
};

export default ProductCard;
*/}