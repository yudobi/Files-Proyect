import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/stylesAdmin/NewCategory.css'; // Import your CSS styles

const NewCategory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await api.post('categorias/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(`Categoría "${response.data.name}" creada exitosamente!`, {
        position: "top-right",
        autoClose: 5000,
      });

      setTimeout(() => navigate('/categories'), 1000);
      
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error(`Error al crear la categoría: ${error.response?.data?.message || error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-category-container">
      <button onClick={() => navigate(-1)} className="nav-button">
        <i className="fas fa-arrow-left"></i> Volver
      </button>
      <h2>Crear Nueva Categoría</h2>
      
      <form onSubmit={handleSubmit} className="category-form">
        <div className="form-group">
          <label>Nombre de la categoría:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength="100"
          />
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Imagen de la categoría:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <small>Recomendado: imagen cuadrada (ej. 500x500px)</small>
          
          {previewImage && (
            <div className="image-preview-container">
              <p>Vista previa:</p>
              <img 
                src={previewImage} 
                alt="Preview de la categoría" 
                className="category-image-preview"
              />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/categories')}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Creando Categoría...
              </>
            ) : (
              'Crear Categoría'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewCategory;