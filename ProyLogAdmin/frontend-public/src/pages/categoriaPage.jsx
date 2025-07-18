import React, { useState, useEffect } from 'react';
import ProductCard from '../components/componentesPaginaProducts/ProductCard';
import { useParams } from 'react-router-dom';

const CategoriaPage = () => {
  const { id } = useParams();
  const [categoria, setCategoria] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener datos de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Obtener la categoría específica
        const categoriaResponse = await fetch(`http://localhost:8000/api/categorias/${id}/`);
        if (!categoriaResponse.ok) {
          throw new Error('Categoría no encontrada');
        }
        const categoriaData = await categoriaResponse.json();
        setCategoria(categoriaData);

        // 2. Obtener todos los productos
        const productosResponse = await fetch('http://localhost:8000/api/productos/');
        if (!productosResponse.ok) {
          throw new Error('Error al obtener productos');
        }
        const productosData = await productosResponse.json();

        // Filtrar productos por categoría
        const productosFiltrados = productosData.filter(
          producto => producto.categoria === categoriaData.tipoDeCategoria
        );
        setProductos(productosFiltrados);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  if (!categoria) {
    return (
      <div className="container">
        <div className="not-found">Categoría no encontrada</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="categoria-title">{categoria.tipoDeCategoria}</h1>
      
      
      <div className="product-flex">
        {productos.length > 0 ? (
          productos.map(product => (
            <ProductCard 
              key={product.id} 
              products={product} 
              // Pasar todas las props necesarias para el ProductCard
              title={product.title}
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              images={product.images}
              brand={product.brand}
              availability={product.availability}
            />
          ))
        ) : (
          <div className="no-products">
            No hay productos disponibles en esta categoría
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriaPage;