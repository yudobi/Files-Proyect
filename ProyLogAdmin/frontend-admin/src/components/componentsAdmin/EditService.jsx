import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/stylesAdmin/NewService.css';

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreServicio: '',
    descripcion: '',
    precioOriginal: '',
    descuento: 0,
  });
  const [existingImages, setExistingImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const controllerRef = useRef(null);

// Navegación para el botón de nuevo producto
  const newProductBack = () => {
    navigate('/galery-services');
  };

  // Cargar servicio existente
  useEffect(() => {
    controllerRef.current = new AbortController();
    const { signal } = controllerRef.current;

    const fetchService = async () => {
      try {
        const response = await api.get(`servicios/${id}/`, { signal });
        const serviceData = response.data;
        
        setFormData({
          nombreServicio: serviceData.nombreServicio,
          descripcion: serviceData.descripcion,
          precioOriginal: serviceData.precioOriginal,
          descuento: serviceData.descuento,
        });

        setExistingImages(serviceData.images || []);

      } catch (error) {
        toast.error('Error al cargar el servicio', {
          position: "top-right",
          autoClose: 3000,
        });
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();

    return () => controllerRef.current?.abort();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'discount' || name === 'precioOriginal' ? parseFloat(value) || 0 : value
    }));
  };

  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  const handleDeleteImage = (imageId) => {
    setImagesToDelete(prev => [...prev, imageId]);
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const calculateFinalPrice = () => {
    const precio = parseFloat(formData.precioOriginal) || 0;
    const desc = parseFloat(formData.descuento) || 0;
    return (precio * (1 - desc / 100)).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Agregar campos básicos
      formDataToSend.append('nombreServicio', formData.nombreServicio);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('precioOriginal', formData.precioOriginal);
      formDataToSend.append('descuento', formData.descuento);
      
      // Agregar imágenes nuevas
      await Promise.all(
        imageFiles.map((file, index) => {
          const imgForm = new FormData();
          imgForm.append('service', id);
          imgForm.append('image', file);
          imgForm.append('order', existingImages.length + index + 1);
          return api.post('servicio-imagenes/', imgForm, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        })
      );

      // 1. Actualizar datos básicos del servicio
      const response = await api.patch(`servicios/${id}/`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // 2. Eliminar imágenes marcadas para borrar
      await Promise.all(
        imagesToDelete.map(imageId => 
          api.delete(`servicio-imagenes/${imageId}/`)
        )
      );

      toast.success(`Servicio "${response.data.nombreServicio}" actualizado exitosamente!`, {
        position: "top-right",
        autoClose: 5000,
      });

      setTimeout(() => navigate('/galery-services'), 1000);
      
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error(`Error al actualizar el servicio: ${error.response?.data?.message || error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Cargando servicio...</div>;
  }

  return (
    <div className="new-service-container">
      <button onClick={newProductBack} className="nav-button"><i className="fas fa-plus"></i> Back</button>
      <h2>Editar Servicio</h2>
      <form onSubmit={handleSubmit} className="service-form">
        
        <div className="form-group">
          <label>Nombre del Servicio:</label>
          <input
            type="text"
            name="nombreServicio"
            value={formData.nombreServicio}
            onChange={handleChange}
            required
            maxLength="100"
          />
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Precio Original:</label>
            <input
              type="number"
              name="precioOriginal"
              value={formData.precioOriginal}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Descuento (%):</label>
            <input
              type="number"
              name="descuento"
              value={formData.descuento}
              onChange={handleChange}
              min="0"
              max="100"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Precio Final:</label>
          <input
            type="text"
            value={`$${calculateFinalPrice()}`}
            readOnly
            className="read-only-input"
          />
        </div>

        <div className="form-group">
          <label>Imágenes existentes:</label>
          {existingImages.length > 0 ? (
            <div className="existing-images">
              {existingImages.map(img => (
                <div key={img.id} className="existing-image">
                  <img src={img.image} alt={`Imagen ${img.id}`} />
                  <button 
                    type="button" 
                    className="delete-image-btn"
                    onClick={() => handleDeleteImage(img.id)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay imágenes existentes</p>
          )}
        </div>

        <div className="form-group">
          <label>Agregar nuevas imágenes:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <small>Máximo 5 imágenes adicionales</small>
          {imageFiles.length > 0 && (
            <div className="image-previews">
              <p>Previsualización de nuevas imágenes ({imageFiles.length}):</p>
              <div className="preview-container">
                {imageFiles.map((file, index) => (
                  <div key={index} className="image-preview">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`Nueva imagen ${index + 1}`}
                    />
                    <span>Nueva {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/galery-services')}
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
                Actualizando Servicio...
              </>
            ) : (
              'Actualizar Servicio'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditService;