import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/componentesPaginaProducts/ProductCard';
import '../stayles/estiloPaginaDeCategorias.css'; // Asegúrate de tener este archivo CSS
import api from '../api'; // Asegúrate de que la ruta sea 

const CategoriaPage = () => {
  const { id } = useParams();
  const [categoria, setCategoria] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Obtener la categoría específica
        const [categoriaResponse, productosResponse] = await Promise.all([
          api.get(`/categorias/${id}/`, { signal }),
          api.get('/products/', { signal })
        ]);

        const [categoriaData, productosData] = await Promise.all([
          categoriaResponse.data,
          productosResponse.data
        ]);
         

        setCategoria(categoriaData);

        // Filtrar productos por ID de categoría (mejor que por nombre)
        const productosFiltrados = productosData.products.filter(
          producto => producto.category?.id === categoriaData.id
        );
        
        setProductos(productosFiltrados);

      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          // MODIFICADO: Mejor manejo de errores de Axios
          const errorMessage = err.response?.data?.message || 
                             err.message || 
                             'Error al cargar los datos';
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!categoria) {
    return (
      <div className="container">
        <div className="not-found">
          <i className="fas fa-search"></i>
          <p>Categoría no encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="categoria-container">
      <div className="categoria-header">
        <h1 className="categoria-title">{categoria.name}</h1>
        {categoria.description && (
          <p className="categoria-description">{categoria.description}</p>
        )}
        {categoria.image && (
          <img 
            src={categoria.image} 
            alt={categoria.name} 
            className="categoria-image"
          />
        )}
      </div>
      
      <div className="productos-container">
        <h2 className="productos-title">Productos ({productos.length})</h2>
        
        {productos.length > 0 ? (
          <div className="product-grid">
            {productos.map(product => (
              <ProductCard 
                key={product.id}
                product={product} // Pasa el objeto completo del producto
              />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <i className="fas fa-box-open"></i>
            <p>No hay productos disponibles en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriaPage;