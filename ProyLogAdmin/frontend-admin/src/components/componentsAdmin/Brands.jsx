import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/stylesAdmin/Brands.css';

const Brands = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get('brands/');
        setBrands(response.data.results);
      } catch (error) {
        toast.error('Error al cargar las marcas', {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`¿Estás seguro de eliminar la marca "${name}"?`)) {
      try {
        await api.delete(`brands/${id}/`);
        setBrands(brands.filter(brand => brand.id !== id));
        toast.success(`Marca "${name}" eliminada correctamente`, {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        toast.error(`Error al eliminar la marca: ${error.response?.data?.message || error.message}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  };

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="brand-list-container">
      <div className="brand-list-header">
          <h2>Listado de Marcas</h2>

          <div className="actions">
            <button 
              onClick={() => navigate('/new-brand')}
              className="add-button"
            >
            <i className="fas fa-plus"></i> Nueva Marca
            </button>

            <button 
              onClick={() => navigate('/dashboard')}
              className="add-button"
            >
              <i className="fas fa-plus"></i> back
            </button>
          </div>

          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Buscar marcas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
           </div>

        </div>

      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando marcas...</p>
        </div>
      ) : filteredBrands.length === 0 ? (
        <div className="no-results">
          {searchTerm ? (
            <p>No se encontraron marcas con ese nombre</p>
          ) : (
            <p>No hay marcas registradas aún</p>
          )}
        </div>
      ) : (
        <div className="brand-grid">
          {filteredBrands.map(brand => (
            <div key={brand.id} className="brand-card">
              <div className="brand-logo-container">
                {brand.logo ? (
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="brand-logo"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/150x150/f0f0f0/999?text=No+Logo';
                    }}
                  />
                ) : (
                  <div className="no-logo">
                    <i className="fas fa-tag"></i>
                  </div>
                )}
              </div>
              <div className="brand-info">
                <h3>{brand.name}</h3>
                <div className="brand-actions">
                  <button
                    onClick={() => navigate(`/admin/brands/edit/${brand.id}`)}
                    className="edit-button"
                  >
                    <i className="fas fa-edit"></i> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id, brand.name)}
                    className="delete-button"
                  >
                    <i className="fas fa-trash"></i> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Brands;