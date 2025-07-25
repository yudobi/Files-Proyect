import React, { useEffect, useState } from 'react';
import api from '../../api'; // Asegúrate de que la ruta sea correcta
import ProductCard from "../../components/componentsAdmin/ProductCard"; // Asegúrate de que la ruta sea correcta
import '../../styles/stylesAdmin/ProductGallery.css'; // Asegúrate de tener un archivo CSS para estilos
import { useNavigate } from 'react-router-dom';

//Esta importacion de estilo se utiliza solo para el boton de nuevo producto
import "../../styles/stylesAdmin/Dashboard.css"; // Import your CSS styles


const ProductGallery = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const newProduct = () => {
    navigate('/new-product');
  };
  // Navegación para el botón de nuevo producto
  const newProductBack = () => {
    navigate('/dashboard');
  };


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('products/'); // Ajusta la URL según tu API
        setProducts(response.data.products || []); // Asegúrate de que la estructura de datos sea correcta
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="loading">Cargando productos...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  

   const handleDelete = (deletedProductId) => {
    setProducts(products.filter(product => product.id !== deletedProductId));
  };


  
  return (
    <div className="product-gallery">
      <div className="nav-button-container">
      <button onClick={newProduct} className="nav-button"><i className="fas fa-plus"></i> Nuevo Producto</button>
      <button onClick={newProductBack} className="nav-button"><i className="fas fa-plus"></i> Back</button>
      </div>
      <h2 className="gallery-title">Nuestros Productos</h2>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onDelete={handleDelete} />
        ))}
      </div>

       

    </div>
  );
};

export default ProductGallery;