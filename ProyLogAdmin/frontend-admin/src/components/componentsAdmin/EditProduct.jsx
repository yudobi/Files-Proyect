import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/stylesAdmin/NewProduct.css';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    original_price: '',
    discount: 0,
    stock: 0,
    category_id: '',
    featured: false,
    category_deal: false,
    brand_id: null
  });
  const [existingImages, setExistingImages] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const controllerRef = useRef(null);
  
    // Navegación para el botón de nuevo producto
  const newProductBack = () => {
    navigate('/galery-products');
  };


  // Cargar producto y marcas disponibles
  useEffect(() => {
    controllerRef.current = new AbortController();
    const { signal } = controllerRef.current;

    const fetchData = async () => {
      try {
        // Cargar marcas
        const brandsResponse = await api.get('brands/', { signal });
        setBrands(brandsResponse.data.results || []);

        // Cargar categorías
        const categoriasResponse = await api.get('categorias/', { signal });
        setCategorias(categoriasResponse.data.results || []);

        // Cargar producto existente
        const productResponse = await api.get(`products/${id}/`, { signal });
        const productData = productResponse.data;
        
        setFormData({
          title: productData.title,
          description: productData.description,
          original_price: productData.original_price,
          discount: productData.discount,
          stock: productData.stock,
          category: productData.category,
          featured: productData.featured,
          category_deal: productData.category_deal,
          brand: productData.brand
        });

        setExistingImages(productData.images || []);

      } catch (error) {
        toast.error('Error al cargar los datos', {
          position: "top-right",
          autoClose: 3000,
        });
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => controllerRef.current?.abort();
  }, [id, navigate]);

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

     // Verifica que se encontró la marca
    if (!selectedBrand) {
      toast.error('Marca no encontrada');
      return;
    }

    setFormData(prev => ({
      ...prev,
      brand: selectedBrand || null
    }));
  };

  const handleCategoryChange = (e) => {
  const selectedId = parseInt(e.target.value);
  const selectedCategory = categorias.find(cat => cat.id === selectedId);

  // Verifica que se encontró la categoría
  if (!selectedCategory) {
    toast.error('Categoría no encontrada');
    return;
  }

  setFormData(prev => ({
    ...prev,
    category: selectedCategory || null,
  }));
 };

  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  const handleDeleteImage = (imageId) => {
    setImagesToDelete(prev => [...prev, imageId]);
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Verifica que category y brand existen antes de enviar
    if (!formData.category || !formData.brand) {
      toast.error('Selecciona una categoría y una marca válidas');
      setIsSubmitting(false);
      return; }

    try {
      // Primero actualizar los datos básicos del producto
      const payload =  {
        title: formData.title,
        description: formData.description,
        original_price: formData.original_price,
        discount: formData.discount,
        stock: formData.stock,
        category_id: formData.category?.id || formData.category,
        featured: formData.featured,
        category_deal: formData.category_deal,
        brand_id: formData.brand?.id || formData.brand
      }

      console.log('Datos a enviar:', payload); // Verifica antes de enviar

      const response = await api.patch(`products/${id}/`, payload);

      // Luego manejar las imágenes
      // 1. Eliminar imágenes marcadas para borrar
      await Promise.all(
        imagesToDelete.map(imageId => 
          api.delete(`product-images/${imageId}/`)
        )
      );

      // 2. Agregar nuevas imágenes
      await Promise.all(
        imageFiles.map((file, index) => {
          const imgForm = new FormData();
          imgForm.append('product', id);
          imgForm.append('image', file);
          imgForm.append('order', existingImages.length + index + 1);
          return api.post('product-images/', imgForm, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        })
      );

      toast.success(`Producto "${response.data.title}" actualizado exitosamente!`, {
        position: "top-right",
        autoClose: 5000,
      });

      setTimeout(() => navigate('/galery-products'), 1000);
      
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(`Error al actualizar el producto: ${error.response?.data?.message || error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
    
  };

  if (isLoading) {
    return <div className="loading">Cargando producto...</div>; 
  }
  
  return (
    <div className="new-product-container">
      <button onClick={newProductBack} className="nav-button"><i className="fas fa-plus"></i> Back</button>
      <h2>Editar Producto</h2>
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
           {/*Form para categorias***********************************/}
        <div className="form-group">
           <label>Categoría:</label>
           <select
             name="category"
             value={formData.category?.id || ''}
             onChange={handleCategoryChange}
             required
              >
                <option value="">Seleccione una categoría</option>
                 {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>
                {cat.name}
                </option>
                ))}
            </select>

                   {formData.category && (
                     <div className="brand-preview">
                       <small>Categoría seleccionada: {formData.category.name}</small>
                          {formData.category.image && (
                           <img
                          src={formData.category.image}
                          alt={formData.category.name}
                          className="brand-logo-preview"
                         />
                      )}
                    </div>
                    )}
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

         {/*Form para marcas***********************************/}
        <div className="form-group">
          <label>Marca:</label>
          <select
            name="brand"
            value={formData.brand?.id || ''}
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
            onClick={() => navigate('/galery-products')}
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
                Actualizando Producto...
              </>
            ) : (
              'Actualizar Producto'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;

  