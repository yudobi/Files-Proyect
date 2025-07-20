import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/stylesAdmin/NewBrand.css';

const NewBrand = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    logo: null
  });
  const [previewLogo, setPreviewLogo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        logo: file
      }));
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }

      const response = await api.post('brands/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(`Marca "${response.data.name}" creada exitosamente!`, {
        position: "top-right",
        autoClose: 5000,
      });

      setTimeout(() => navigate('/brands'), 1000);
      
    } catch (error) {
      console.error('Error creating brand:', error);
      toast.error(`Error al crear la marca: ${error.response?.data?.message || error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-brand-container">
      <button onClick={() => navigate(-1)} className="nav-button">
        <i className="fas fa-arrow-left"></i> Volver
      </button>
      <h2>Crear Nueva Marca</h2>
      
      <form onSubmit={handleSubmit} className="brand-form">
        <div className="form-group">
          <label>Nombre de la marca:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength="100"
            placeholder="Ej: Nike, Adidas, Apple..."
          />
        </div>

        <div className="form-group">
          <label>Logo de la marca:</label>
          <div className="logo-upload-container">
            <label className="file-upload-label">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                required
              />
              <span className="upload-button">
                <i className="fas fa-cloud-upload-alt"></i> Seleccionar imagen
              </span>
            </label>
            <small>Formatos recomendados: PNG, SVG o JPG (mín. 200x200px)</small>
          </div>
          
          {previewLogo && (
            <div className="logo-preview-container">
              <p>Vista previa del logo:</p>
              <img 
                src={previewLogo} 
                alt="Preview del logo" 
                className="logo-preview"
              />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/brands')}
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
                Creando Marca...
              </>
            ) : (
              'Crear Marca'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewBrand;