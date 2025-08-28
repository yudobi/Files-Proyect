import React, { useState, useEffect } from 'react';
import ProductCard from '../components/componentesPaginaProducts/ProductCard';
import Pagination from '../components/componentesGenerales/Pagination';
import api from '../api'; // Asegúrate de que la ruta sea correcta";


const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(
          `/products/`, {
            params: {
              page: pagination.currentPage,
              page_size: pagination.itemsPerPage
            }
      });

        const data = await response.data;
        
        if (data.success) {
          setProducts(data.products);
          setPagination(prev => ({
            ...prev,
            totalPages: data.total_pages,
            totalItems: data.total_items
          }));
        } else {
          throw new Error('Formato de respuesta inesperado');
        }
      } catch (err) {
         const errorMessage = err.response?.data?.message || 
                           err.message || 
                           'Error al obtener los productos';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pagination.currentPage, pagination.itemsPerPage]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  if (loading) {
    return <div className="container">Cargando productos...</div>;
  }

  if (error) {
    return <div className="container">Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1>Todos nuestros productos ({pagination.totalItems})</h1>
      
      <div className="product-flex">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Products;











{/* 
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/componentesPaginaProducts/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {

        const response = await fetch('http://localhost:8000/api/products/');

        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }

        const data = await response.json();

        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="container">Cargando productos...</div>;
  }

  if (error) {
    return <div className="container">Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1>Todos nuestros productos</h1>
      <div className="product-flex">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;   */}