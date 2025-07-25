import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons';

const ProductDetail = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/products/");

        if (!response.ok) {
          throw new Error("Error al cargar los productos");
        }
       

        const data = await response.json();
        setProductos(data.products || []);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProductos();
    
  }, []);

  if (loading) {
    return <div className="categories-section">Cargando categorías...</div>;
  }

  if (error) {
    return <div className="categories-section">Error: {error}</div>;
  }

  if (!productos || productos.length === 0) {
    return <div className="categories-section">No se encontraron categorías</div>;
  } 
  
  const product = productos.find(p => p.id === parseInt(id));

  if (!product) return <div>Producto no encontrado</div>;

  const handleClose = () => {
    navigate(-1);
  };

  const handleThumbnailClick = (index) => {
    setActiveImage(index); 
  };

  // Función para determinar la disponibilidad basada en el stock
  const getAvailability = (stock) => {
    if (stock <= 0) return 'out-of-stock';
    if (stock <= 5) return 'limited';
    return 'in-stock';
  };

  return (
    <div className="product-detail-container">
      <div className="product-detail-content">
        <button className="close-detail-btn" onClick={handleClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        <div className="product-images">
          <div className="main-image-container">
            <img 
              src={product.images[activeImage]?.image} 
              alt={product.title} 
              className="main-product-image" 
            />
          </div>
          <div className="thumbnail-container">
            {product.images.map((img, index) => (
              <img 
                key={img.id}
                src={img.image} 
                alt={`Miniatura ${index + 1}`} 
                className={`thumbnail ${index === activeImage ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
          </div>
        </div>
        
        <div className="product-info">
          <span className={`availability ${getAvailability(product.stock)}`}>
            {getAvailability(product.stock) === 'in-stock' ? 'Disponible' : 
             getAvailability(product.stock) === 'limited' ? 'Últimas unidades' : 'Agotado'}
          </span>
          <h1 className="detail-product-title">{product.title}</h1>
          <div className="brand-info">
            <div className="brand-logo">
              <img src={product.brand.logo} alt={`Logo ${product.brand.name}`} />
            </div>
            <span className="product-origin">Marca: {product.brand.name}</span>
          </div>
          
          <div className="price-section">
            <div className="product-price">
              {product.original_price && (
                <div>
                  <span className="original-price">${product.original_price}</span>
                  <span className="price">${product.price}</span>
                </div>
              )}
              {!product.original_price && <span className="price">${product.price}</span>}
              {product.discount && <span className="discount-badge">-{product.discount}%</span>}
            </div>
          </div>
          
          <div className="product-description-section">
            <h3>Descripción</h3>
            <p className="detail-product-description">{product.description}</p>
          </div>
          
          <div className="product-actions">
            <button 
              className="add-to-cart" 
              disabled={getAvailability(product.stock) === 'out-of-stock'}
            >
              <FontAwesomeIcon icon={faShoppingCart} /> Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;










{/* 
import {useState , useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons';

//import products from '../data/products'; // Asume que tienes un archivo con los datos
//import '../stayles/prueva.css';

const ProductDetail = () => {

  const [productos , setProductos] = useState([]);
  const [error , setError] = useState(null);
  const [loading , setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);

  useEffect( () => {

    const fetchProductos = async () => {

      try{
        const response = await fetch("http://localhost:8000/api/products/");

        if(!response.ok){
          throw new Error("Error al cargar los productos");
        }

        const data = await response.json();

        setProductos(data)

      }catch(err){

        setError(err.message);

      }finally{

        setLoading(false);

      }
    }

    fetchProductos();

  },[]);

  
  if (loading) {
        return <div className="categories-section">Cargando categorías...</div>;
    }

  if (error) {
        return <div className="categories-section">Error: {error}</div>;
    }

  if (!productos || productos.length === 0) {
        return <div className="categories-section">No se encontraron categorías</div>;
    } 
  
  const product = productos.find(p => p.id === parseInt(id));

  if (!product) return <div>Producto no encontrado</div>;

  const handleClose = () => {
    navigate(-1); // Regresa a la página anterior
  };

  const handleThumbnailClick = (index) => {
    setActiveImage(index); 
  };

  return (
    <div className="product-detail-container">
      <div className="product-detail-content">
        <button className="close-detail-btn" onClick={handleClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        <div className="product-images">
          <div className="main-image-container">
            <img src={product.images[activeImage]} alt={product.title} className="main-product-image" />
          </div>
          <div className="thumbnail-container">
            {product.images.map((img, index) => (
              <img 
                key={index}
                src={img} 
                alt={`Miniatura ${index + 1}`} 
                className={`thumbnail ${index === activeImage ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
          </div>
        </div>
        
        <div className="product-info">
          <span className={`availability ${product.availability}`}>
            {product.availability === 'in-stock' ? 'Disponible' : 
             product.availability === 'limited' ? 'Últimas unidades' : 'Agotado'}
          </span>
          <h1 className="detail-product-title">{product.title}</h1>
          <div className="brand-info">
            <div className="brand-logo">
              <img src={product.brandLogo} alt={`Logo ${product.brand}`} />
            </div>
            <span className="product-origin">Origen: {product.origin}</span>
          </div>
          
          <div className="price-section">
            <div className="product-price">
              {product.originalPrice && (
                <div>
                  <span className="original-price">${product.originalPrice}</span>
                  <span className="price">${product.price}</span>
                </div>
              )}
              {!product.originalPrice && <span className="price">${product.price}</span>}
              {product.discount && <span className="discount-badge">-{product.discount}%</span>}
            </div>
          </div>
          
          <div className="product-description-section">
            <h3>Descripción</h3>
            <p className="detail-product-description">{product.fullDescription}</p>
          </div>
          
          <div className="product-actions">
            <button className="add-to-cart" disabled={product.availability === 'out-of-stock'}>
              <FontAwesomeIcon icon={faShoppingCart} /> Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;*/}