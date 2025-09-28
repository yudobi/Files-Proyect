import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/stylesAdmin/NewService.css';
import axios from 'axios';

const NewService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreServicio: '',
    descripcion: '',
    precioOriginal: '',
    descuento: 0,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const controllerRef = useRef(null);
  
  const newProductBack = () => {
    navigate('/galery-services');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'descuento' || name === 'precioOriginal' ? parseFloat(value) || 0 : value
    }));
  };

  const handleImageChange = (e) => {
    
    const files = [...e.target.files];
    if (files.length > 5) {
      toast.error("Máximo 5 imágenes permitidas");
      return;
    }
    setImageFiles(files);
  };

  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);
  };
  ////////////////////////////////////////////////////////////////////
  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const token = localStorage.getItem('access');
    if (!token) {
      toast.error('No authentication token found');
      setIsSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();
    
    // Campos básicos
    formDataToSend.append('nombreServicio', formData.nombreServicio);
    formDataToSend.append('descripcion', formData.descripcion);
    formDataToSend.append('precioOriginal', formData.precioOriginal);
    formDataToSend.append('descuento', formData.descuento);

    // 🔹 SOLO UN BUCLE para imágenes y órdenes
    //console.log('Número de imágenes:', imageFiles.length);
    //imageFiles.forEach((file, index) => {
      //console.log(`Imagen ${index + 1}:`, file.name, file.type, file.size);
    imageFiles.forEach((file) => {
       formDataToSend.append('images', file);
       });
    //formDataToSend.append('orders[]', index + 1);
    //});

    /* //🔹 Debug SOLO UNA VEZ
    console.log('=== DATOS ENVIADOS ===');
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0] + ': ', pair[1]);
    }*/

    const response = await api.post('servicios/', formDataToSend, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    toast.success(`Servicio "${response.data.nombreServicio}" creado exitosamente!`);
    setTimeout(() => navigate('/galery-services'), 1000);

  } catch (error) {
    console.error('Error creating service:', error);
    
    // 🔹 Debug más detallado del error del backend
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      
      // Esto te dirá exactamente qué error está dando el backend
      if (error.response.data) {
        console.error('Backend error details:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    toast.error(`Error al crear el servicio: ${error.response?.data?.message || error.message}`);
  } finally {
    setIsSubmitting(false);
  }
};

  const calculateFinalPrice = () => {
    const precio = parseFloat(formData.precioOriginal) || 0;
    const desc = parseFloat(formData.descuento) || 0;
    return (precio * (1 - desc / 100)).toFixed(2);
  };
  


  return (
    <div className="new-product-container">
      <button onClick={newProductBack} className="nav-button"><i className="fas fa-plus"></i> Back</button>
      <h2>Crear Nuevo Servicio</h2>
      <form onSubmit={handleSubmit} className="product-form">
        
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
          <label>Imágenes del Servicio:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <small>Máximo 5 imágenes. Se mostrarán en el orden seleccionado.</small>
          {imageFiles.length > 0 && (
            <div className="image-previews">
              <p>Previsualización ({imageFiles.length} imágenes):</p>
              <div className="preview-container">
                {imageFiles.map((file, index) => (
                  <div key={index} className="image-preview">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`Preview ${index + 1}`}
                    />
                    <span>Imagen {index + 1}</span>
                    <button 
                      type="button"
                      className="delete-image-btn"
                      onClick={() => removeImage(index)}
                    >
                      Eliminar
                    </button>
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
            onClick={() => navigate('/')}
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
                Creando Servicio...
              </>
            ) : (
              'Crear Servicio'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewService;




/*import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/stylesAdmin/NewService.css';
import axios from 'axios';

const NewService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreServicio: '',
    descripcion: '',
    precioOriginal: '',
    descuento: 0,
    images: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const controllerRef = useRef(null);
  
   // Navegación para el botón de nuevo producto
  const newProductBack = () => {
    navigate('/galery-services');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'descuento' || name === 'precioOriginal' ? parseFloat(value) || 0 : value
    }));
  };

  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('access');
            if (!token) {
              toast.error('No authentication token found');
              setIsSubmitting(false);
              return;
            }
      const formDataToSend = new FormData();
      
      // Agregar campos básicos
      formDataToSend.append('nombreServicio', formData.nombreServicio);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('precioOriginal', formData.precioOriginal);
      formDataToSend.append('descuento', formData.descuento);
      
   
      // Enviar datos al backend
      const response = await axios.post('https://files-proyect.onrender.com/api/servicios/', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          //'Content-Type': 'multipart/form-data'
        }
      });


      ///////////////Codigo para la subida de imagenes//////////////////////////////////////
      const serviceId = response.data.id;

      // 🔸 Luego, subir cada imagen relacionada con el servicio creado
      for (let i = 0; i < imageFiles.length; i++) {
        const imgForm = new FormData();
        imgForm.append('service', serviceId);        // Relación FK
        imgForm.append('image', imageFiles[i]);      // Archivo
        imgForm.append('order', i + 1);              // Orden visual

      await axios.post('https://files-proyect.onrender.com/api/servicio-imagenes/', imgForm, {
        
        headers: { //'Content-Type': 'multipart/form-data'
          Authorization: `Bearer ${token}`, }
      });
    }
      //////////////////////////////////////////////////////////








      toast.success(`Servicio "${response.data.nombreServicio}" creado exitosamente!`, {
        position: "top-right",
        autoClose: 5000,
      });

      setTimeout(() => navigate('/galery-services'), 1000);
      
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error(`Error al crear el servicio: ${error.response?.data?.message || error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateFinalPrice = () => {
    const precio = parseFloat(formData.precioOriginal) || 0;
    const desc = parseFloat(formData.descuento) || 0;
    return (precio * (1 - desc / 100)).toFixed(2);
  };
  
  return (
    <div className="new-product-container">
      <button onClick={newProductBack} className="nav-button"><i className="fas fa-plus"></i> Back</button>
      <h2>Crear Nuevo Servicio</h2>
      <form onSubmit={handleSubmit} className="product-form">
        
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
          <label>Imágenes del Servicio:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <small>Máximo 5 imágenes. Se mostrarán en el orden seleccionado.</small>
          {imageFiles.length > 0 && (
            <div className="image-previews">
              <p>Previsualización ({imageFiles.length} imágenes):</p>
              <div className="preview-container">
                {imageFiles.map((file, index) => (
                  <div key={index} className="image-preview">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`Preview ${index + 1}`}
                    />
                    <span>Imagen {index + 1}</span>
                    <button 
                      type="button"
                      className="delete-image-btn"
                      onClick={() => removeImage(index)}
                    >
                      Eliminar
                    </button>
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
            onClick={() => navigate('/')}
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
                Creando Servicio...
              </>
            ) : (
              'Crear Servicio'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewService;*/