import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/stylesAdmin/NewProduct.css';

const NewProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    original_price: '',
    discount: 0,
    stock: 0,
    category: '',
    featured: false,
    category_deal: false,
    brand: "",
    images: []
  });
  const [brands, setBrands] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingBrands, setIsLoadingBrands] = useState(true);
  const controllerRef = useRef(null);

  // Navegación para el botón de nuevo producto
  const newProductBack = () => {
    navigate('/galery-products');
  };

  // Cargar marcas disponibles
  useEffect(() => {

    controllerRef.current = new AbortController();
    const { signal } = controllerRef.current;

    const fetchBrands = async () => {
      try {
        const response = await api.get('brands/', { signal });
        setBrands(response.data);
      } catch (error) {
        toast.error('Error al cargar las marcas', {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setIsLoadingBrands(false);
      }
    };

    fetchBrands();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBrandChange = (e) => {
    const selectedBrandId = parseInt(e.target.value);
    const selectedBrand = brands.find(brand => brand.id === selectedBrandId);
    setFormData(prev => ({
      ...prev,
      brand: selectedBrand || null
    }));
  };

  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Agregar campos básicos
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('original_price', formData.original_price);
      formDataToSend.append('discount', formData.discount);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('featured', formData.featured);
      formDataToSend.append('category_deal', formData.category_deal);
      //formDataToSend.append('brand', formData.brand.id);
      
      {/* // Agregar brand (solo el ID)*/}
      if (formData.brand) {
        formDataToSend.append('brand_id', formData.brand.id);
      }

     console.log('Brand seleccionado:', formData.brand); // <- revisa si es null o tiene id

     for (let [key, value] of formDataToSend.entries()) {
       console.log(key, value);  
}

      // Enviar datos al backend
      // Asegúrate de que el endpoint sea correcto y acepte multipart/form-data
      const response = await api.post('products/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });


       const productId = response.data.id;

    // 🔸 Luego, subir cada imagen relacionada con el producto creado
    for (let i = 0; i < imageFiles.length; i++) {
      const imgForm = new FormData();
      imgForm.append('product', productId);        // Relación FK
      imgForm.append('image', imageFiles[i]);      // Archivo
      imgForm.append('order', i + 1);              // Orden visual

      await api.post('product-images/', imgForm, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
      
    
      toast.success(`Producto "${response.data.title}" creado exitosamente!`, {
        position: "top-right",
        autoClose: 5000,
      });

      setTimeout(() => navigate('/galery-products'), 1000);
      
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(`Error al crear el producto: ${error.response?.data?.message || error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="new-product-container">
      <button onClick={newProductBack} className="nav-button"><i className="fas fa-plus"></i> Back</button>
      <h2>Crear Nuevo Producto</h2>
      <form onSubmit={handleSubmit} className="product-form">
        
        <div className="form-group">
          <label>Título:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
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
            required
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Precio Original:</label>
            <input
              type="number"
              name="original_price"
              value={formData.original_price}
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
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              min="0"
              max="100"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Stock:</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Categoría:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              <option value="Electronics">Electrónica</option>
              <option value="Ropa">Ropa</option>
              <option value="Hogar">Hogar</option>
              <option value="Deportes">Deportes</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              Producto Destacado
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="category_deal"
                checked={formData.category_deal}
                onChange={handleChange}
              />
              Oferta de Categoría
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Marca:</label>
          {isLoadingBrands ? (
            <p>Cargando marcas...</p>
          ) : (
            <select
              name="brand"
              value={formData.brand.id || ''}
              onChange={handleBrandChange}
              required
            >
              <option value="">Seleccione una marca</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          )}
          {formData.brand && (
            <div className="brand-preview">
              <small>Marca seleccionada: {formData.brand.name}</small>
              {formData.brand.logo && (
                <img 
                  src={formData.brand.logo} 
                  alt={formData.brand.name} 
                  className="brand-logo-preview"
                />
              )}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Imágenes del Producto:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          <small>Mínimo 1 imagen, máximo 5. Se mostrarán en el orden seleccionado.</small>
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
            disabled={isSubmitting || isLoadingBrands}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Creando Producto...
              </>
            ) : (
              'Crear Producto'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProduct;