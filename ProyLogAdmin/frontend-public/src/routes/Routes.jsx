import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Products from '../pages/Products';
//import ProductDetail from '../pages/ProductDetail';
import Categories from '../pages/Categories';
import Services from '../pages/Services';
import NotFound from '../pages/NotFound';
import ProductDetail from '../components/componentesPaginaProducts/ProductDetail';
import CategoriaPage from '../pages/CategoriaPage' ;

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Products />} />
      <Route path="/products" element={<Products />} />

      <Route path="/product" element={<Products />} />

      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/categoria/:id" element={<CategoriaPage />} />
      <Route path="/categorias/" element={<Categories />} />
      <Route path="/servicios" element={<Services />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

//<Route path="/productos/:id" element={<ProductDetail />} />





/*
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      
    </Routes>
  );
};
*/
