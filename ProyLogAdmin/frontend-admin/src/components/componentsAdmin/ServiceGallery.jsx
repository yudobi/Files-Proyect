import React, { useEffect, useState } from 'react';
import api from '../../api';
import ServiceCard from "../../components/componentsAdmin/ServiceCard";
import '../../styles/stylesAdmin/ServiceGallery.css';
import { useNavigate } from 'react-router-dom';
import "../../styles/stylesAdmin/Dashboard.css";

const ServiceGallery = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const newService = () => {
    navigate('/new-service');
  };
   // Navegación para el botón de nuevo producto
  const newProductBack = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('servicios/');
        setServices(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <div className="loading">Cargando servicios...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const handleDelete = (deletedServiceId) => {
    setServices(services.filter(service => service.id !== deletedServiceId));
  };
  
  return (
    <div className="service-gallery">
      
       <div className="nav-button-container">

      <button onClick={newService} className="nav-button">
        <i className="fas fa-plus"></i> Nuevo Servicio
      </button>

      <button onClick={newProductBack} className="nav-button"><i className="fas fa-plus"></i> Back</button>

      </div>
      
      <h2 className="gallery-title">Nuestros Servicios</h2>
      <div className="services-grid">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default ServiceGallery;