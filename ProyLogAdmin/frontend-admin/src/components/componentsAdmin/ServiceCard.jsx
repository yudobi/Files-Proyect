import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from "../../api";
import '../../styles/stylesAdmin/ServiceCard.css';

const ServiceCard = ({ service, onDelete }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === service.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? service.images.length - 1 : prevIndex - 1
    );
  };

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de eliminar el servicio "${service.nombreServicio}"?`)) {
      setIsDeleting(true);
      try {
        await api.delete(`servicios/${service.id}/`);
        onDelete(service.id);
      } catch (error) {
        console.error("Error eliminando servicio:", error);
        alert("Ocurrió un error al eliminar el servicio");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="service-card">
      {/* Carrusel de imágenes */}
      <div className="image-carousel">
        {service.images.length > 1 && (
          <button className="carousel-button prev" onClick={prevImage}>&lt;</button>
        )}
        
        <img 
          src={service.images[currentImageIndex]?.image} 
          alt={service.nombreServicio} 
          className="service-image"
        />
        
        {service.images.length > 1 && (
          <button className="carousel-button next" onClick={nextImage}>&gt;</button>
        )}
        
        {/* Indicadores de imágenes */}
        {service.images.length > 1 && (
          <div className="image-indicators">
            {service.images.map((_, index) => (
              <span 
                key={index} 
                className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Información del servicio */}
      <div className="service-info">
        <h3 className="service-title">{service.nombreServicio}</h3>
        <p className="service-description">{service.descripcion}</p>
        
        <div className="price-section">
          <div className="original-price">${service.precioOriginal}</div>
          <div className="current-price">${service.precio}</div>
          {service.descuento > 0 && (
            <div className="discount-badge">-{service.descuento}%</div>
          )}
        </div>
        
        {/* Botones de administración */}
        <div className="admin-actions">
          <Link 
            to={`/edit-service/${service.id}`}
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

export default ServiceCard;