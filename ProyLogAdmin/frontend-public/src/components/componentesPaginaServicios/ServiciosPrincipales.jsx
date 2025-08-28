import { useState, useEffect } from "react";
import "../../stayles/estiloPaginaDeServicios.css";
import api from '../../api'; // Asegúrate de que la ruta sea correcta

const ServiciosPrincipales = () => {
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState({});

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const response = await api.get('/servicios/');
                
                const data = response.data;
                setServicios(data.results || []); // Asegúrate de que la estructura de datos sea correcta
                
                // Inicializar el índice de imagen actual para cada servicio
                const initialIndexes = {};
                data.results.forEach(servicio => {
                    initialIndexes[servicio.id] = 0;
                });
                setCurrentImageIndex(initialIndexes);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchServicios();
    }, []);

    const nextImage = (servicioId) => {
        setCurrentImageIndex(prev => ({
            ...prev,
            [servicioId]: (prev[servicioId] + 1) % servicios.find(s => s.id === servicioId).images.length
        }));
    };

    const prevImage = (servicioId) => {
        setCurrentImageIndex(prev => ({
            ...prev,
            [servicioId]: (prev[servicioId] - 1 + servicios.find(s => s.id === servicioId).images.length) % 
                          servicios.find(s => s.id === servicioId).images.length
        }));
    };

    if (loading) {
        return <div className="categories-section">Cargando servicios...</div>;
    }

    if (error) {
        return <div className="categories-section">Error: {error}</div>;
    }

    if (!servicios || servicios.length === 0) {
        return <div className="categories-section">No se encontraron servicios</div>;
    }

    return (
        <section className="service-section">
            <h2 className="section-title">Nuestros Servicios Destacados</h2>

            <div className="services-grid">
                {servicios.map((servicio) => (
                    <div className="service-card" key={servicio.id}>
                        <div className="service-image-container">
                            {servicio.images && servicio.images.length > 0 && (
                                <>
                                    <div className="service-image">
                                        <img 
                                            src={servicio.images[currentImageIndex[servicio.id]]?.image} 
                                            alt={servicio.nombreServicio}
                                            loading="lazy"
                                        />
                                    </div>
                                    
                                    {servicio.images.length > 1 && (
                                        <>
                                            <button 
                                                className="image-nav-btn prev-btn"
                                                onClick={() => prevImage(servicio.id)}
                                            >
                                                &lt;
                                            </button>
                                            <button 
                                                className="image-nav-btn next-btn"
                                                onClick={() => nextImage(servicio.id)}
                                            >
                                                &gt;
                                            </button>
                                            <div className="image-counter">
                                                {currentImageIndex[servicio.id] + 1}/{servicio.images.length}
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="service-content">
                            <h3 className="service-title">{servicio.nombreServicio}</h3>
                            <div className="price-container">
                                {servicio.descuento > 0 && (
                                    <>
                                        <span className="original-price">${servicio.precioOriginal}</span>
                                        <span className="discount-badge">-{servicio.descuento}%</span>
                                    </>
                                )}
                                <div className="service-price">${servicio.precio}</div>
                            </div>
                            <p className="service-description">{servicio.descripcion}</p>

                            <button className="service-btn">Solicitar Información</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ServiciosPrincipales;