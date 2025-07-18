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

export default ProductsSection;





