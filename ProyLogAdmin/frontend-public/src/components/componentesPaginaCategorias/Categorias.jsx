import "../../stayles/estiloPaginaDeCategorias.css";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api'; // Asegúrate de que la ruta sea correcta

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await api.get('/categorias/');
               
                setCategorias(response.data.results || []);

            } catch (err) {
                setError(err.message || 'Error al obtener las categorías');
            } finally {
                setLoading(false);
            }
        };

        fetchCategorias();
    }, []);

    const handleClick = (idCategoria) => {
        navigate(`/categoria/${idCategoria}`);
    };

    if (loading) {
        return <div className="categories-section">Cargando categorías...</div>;
    }

    if (error) {
        return <div className="categories-section">Error: {error}</div>;
    }

    if (!categorias || categorias.length === 0) {
        return <div className="categories-section">No se encontraron categorías</div>;
    }

    return (
        <section className="categories-section">
            <h2 className="section-title">Nuestras Categorías</h2>

            <div className="categories-grid">
                {categorias.map((categoria) => (
                    <div className="category-card" key={categoria.id} onClick={() => handleClick(categoria.id)}>
                        <div className="category-image">
                            <img 
                                src={categoria.image} 
                                alt={categoria.name} 
                            />
                        </div>
                        <div className="category-content">
                            <h3 className="category-title">{categoria.name}</h3>
                            <span className="product-count">
                                {categoria.cantidad_de_productos} {categoria.cantidad_de_productos === 1 ? 'producto' : 'productos'}
                            </span>
                            {categoria.description && (
                                <p className="category-description">
                                    {categoria.description}
                                </p>
                            )}
                            <span className="view-category" onClick={() => handleClick(categoria.id)}>
                                Ver categoría <i className="fas fa-arrow-right"></i>
                            </span>
                        </div>
                    </div>
                ))} 
            </div>        
        </section>
    );
}

export default Categorias;




















{/* 

import "../../stayles/estiloPaginaDeCategorias.css";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/categorias/');
                if (!response.ok) {
                    throw new Error('Error al obtener las categorías');
                }
                const data = await response.json();
                setCategorias(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategorias();
    }, []);

    const handleClick = (idCategoria) => {
        navigate(`/categoria/${idCategoria}`);
    };

    if (loading) {
        return <div className="categories-section">Cargando categorías...</div>;
    }

    if (error) {
        return <div className="categories-section">Error: {error}</div>;
    }

    if (!categorias || categorias.length === 0) {
        return <div className="categories-section">No se encontraron categorías</div>;
    }

    return (
        <>
            <section className="categories-section">
                <h2 className="section-title">Nuestras Categorías</h2>

                
                <div className="categories-grid">
                    {categorias.filter(categoria => categoria.tipoDeCategoria !== "Ofertas Especiales" && categoria.tipoDeCategoria !== "Nuevos Lanzamientos").map((categoria) => (
                        <div className="category-card" key={categoria.id} onClick={() => handleClick(categoria.id)}>
                            <div className="category-image">
                                <img 
                                    src={categoria.imagen} 
                                    alt={categoria.alt} 
                                />
                            </div>
                            <div className="category-content">
                                <h3 className="category-title">{categoria.tipoDeCategoria}</h3>
                                <span className="product-count">128 productos</span>
                                <p className="category-description">
                                    {categoria.descripcion}
                                </p>
                                <span className="view-category" onClick={() => handleClick(categoria.id)}>
                                    Ver categoría <i className="fas fa-arrow-right"></i>
                                </span>
                            </div>
                        </div>
                    ))} 
                </div>        
            </section>

            

            
            <section className="featured-categories">
                <div className="featured-content">
                    <h2 className="section-title">Categorías Destacadas</h2>
                    
                    <div className="categories-grid">
                        {categorias.filter(categoria => categoria.tipoDeCategoria === "Ofertas Especiales" || categoria.tipoDeCategoria === "Nuevos Lanzamientos").map((categoria) => (
                            <div className="category-card" key={`featured-${categoria.id}`} onClick={() => handleClick(categoria.id)}>
                                <div className="category-image">
                                    <img 
                                        src={categoria.imagen} 
                                        alt="Ofertas" 
                                    />
                                </div>
                                <div className="category-content">
                                    <h3 className="category-title">{categoria.tipoDeCategoria}</h3>
                                    <span className="product-count">42 productos</span>
                                    <p className="category-description">
                                        {categoria.descripcion}
                                    </p>
                                    <span className="view-category" onClick={() => handleClick(categoria.id)}>
                                        Ver ofertas <i className="fas fa-arrow-right"></i>
                                    </span>
                                </div>
                            </div>
                        ))} 
                    </div>
                </div>
            </section>     
        </>
    );
}

export default Categorias;*/}