import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import '../../stayles/ProductsSection.css';
import Pagination from '../componentesGenerales/Pagination';
import api from '../../api'; // Asegúrate de que la ruta sea correcta

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(
          `/products/`,{
            params: {
              page: pagination.currentPage,
              featured: true
            },
           signal 
      });


        const data = await response.json();
        
        if (!data.success) {
          throw new Error('La respuesta del servidor no fue exitosa');
        }

        setProducts(data.products || []);
        setPagination({
          currentPage: data.current_page,
          totalPages: data.total_pages,
          totalItems: data.total_items,
          itemsPerPage: data.items_per_page
        });
      } catch (err) {
          if (err.name === 'CanceledError' || err.name === 'AbortError') {
          console.log('Petición cancelada');
        } else {
          const errorMessage = err.response?.data?.message || err.message || 'Error al obtener productos';
          setError(errorMessage);
          console.error('Error fetching products:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [pagination.currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  if (loading) {
    return <div className="product-section">Cargando productos...</div>;
  }

  if (error) {
    return <div className="product-section">Error: {error}</div>;
  }

  if (!products.length) {
    return <div className="product-section">No se encontraron productos destacados</div>;
  }

  return (
    <div className="container products-section">
      <h1 className="section-title">Productos Destacados ({pagination.totalItems})</h1>
      <div className="product-flex">
        {products.filter(product => product.featured === true).map(product => (
          <ProductCard key={`product-${product.id}`} product={product} />
        ))}
      </div>
      
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ProductsSection;














{/* 
import { useEffect,useState } from 'react';
import ProductCard from './ProductCard';
import '../../stayles/ProductsSection.css';
//import products from '../data/products';


const ProductsSection = () => {

  const [productos , setProductos ] = useState([]);
  const [ error , setError ] = useState(null);
  const [ loading , setLoading ] = useState(true);
  
  useEffect( () => {

    const fetchProductos = async () => {
      try{

        const response = await fetch("http://localhost:8000/api/products/");

        if(!response.ok){
          throw new Error("Error al cargar los datos")
        }

        const data = await response.json();

        setProductos(data);

      }catch(err){

        setError(err.message);

      }finally{

        setLoading(false);

      }
    }

    fetchProductos();

  },[])
  
  if (loading) {
        return <div className="product-section">Cargando productos...</div>;
    }

  if (error) {
        return <div className="product-section">Error: {error}</div>;
    }

  if (!productos || productos.length === 0) {
        return <div className="product-section">No se encontraron productos</div>;
    }
  
  const productosDestacados= productos.filter(producto => producto.destacado === "si")

  return (
    <div className="container products-section">
      <h1 className="section-title">Productos Destacados</h1>
      <div className="product-flex">
        {productosDestacados.map(products => (
          <ProductCard key={products.id} products={products} />
        ))}
      </div>
    </div>
  );
};

export default ProductsSection;   */}





