import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/stylesAdmin/Categories.css';

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('categorias/');
        setCategories(response.data.results || []);
      } catch (error) {
        toast.error('Error al cargar las categorías', {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`¿Estás seguro de eliminar la categoría "${name}"?`)) {
      try {
        await api.delete(`categorias/${id}/`);
        setCategories(categories.filter(category => category.id !== id));
        toast.success(`Categoría "${name}" eliminada correctamente`, {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        toast.error(`Error al eliminar la categoría: ${error.response?.data?.message || error.message}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="category-list-container">
      <div className="category-list-header">
        <h2>Listado de Categorías</h2>
        <div className="actions">
          <button 
            onClick={() => navigate('/new-category')}
            className="add-button"
          >
            <i className="fas fa-plus"></i> Nueva Categoría
          </button>

          <button 
            onClick={() => navigate('/dashboard')}
            className="add-button"
          >
            <i className="fas fa-plus"></i> Back
          </button>
         
        </div>
         <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Buscar categorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
      </div>

      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando categorías...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="no-results">
          {searchTerm ? (
            <p>No se encontraron categorías con ese nombre</p>
          ) : (
            <p>No hay categorías registradas aún</p>
          )}
        </div>
      ) : (
        <div className="category-grid">
          {filteredCategories.map(category => (
            <div key={category.id} className="category-card">
              <div className="category-image">
                {category.image ? (
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="no-image">
                    <i className="fas fa-image"></i>
                  </div>
                )}
              </div>
              <div className="category-info">
                <h3>{category.name}</h3>
                <p className="description">
                  {category.description || 'Sin descripción'}
                </p>
                <div className="category-actions">
                  <button
                    onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
                    className="edit-button"
                  >
                    <i className="fas fa-edit"></i> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
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

export default Categories