// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/pageAdmin/LoginPage";
import Dashboard from "./pages/pageAdmin/Dashboard";
import NewProduct from "./components/componentsAdmin/NewProduct";
import NewService from "./components/componentsAdmin/NewService";
import ServiceGallery from "./components/componentsAdmin/ServiceGallery";
import EditService from "./components/componentsAdmin/EditService";
import NewCategory from "./components/componentsAdmin/NewCategory";
import Categories from "./components/componentsAdmin/Categories";
import Brands from "./components/componentsAdmin/Brands";
import NewBrand from "./components/componentsAdmin/NewBrand";


import EditProduct from './components/componentsAdmin/EditProduct';
import ProductGallery from "./components/componentsAdmin/ProductGallery";

function App() {
  return (
    <Router>
      <Routes>
        <><Route path="/" element={<LoginPage />} /></>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/new-product" element={<NewProduct />} />
        <Route path="/edit-product/:id" element={<EditProduct />} /> 
         
        <Route path="/new-service" element={<NewService />} />
        <Route path="/edit-service/:id" element={<EditService />} />

        <Route path="/new-category" element={<NewCategory />} />
        {/*<Route path="/edit-category/:id" element={<EditCategory />} /> */}
        <Route path="/categories" element={<Categories />} />
        
        <Route path="/brands" element={<Brands />} />
        <Route path="/new-brand" element={<NewBrand />} />
       
        <Route path="/galery-services" element={<ServiceGallery />} />
        <Route path="/galery-products" element={<ProductGallery />} />
        

      </Routes>
    </Router>
  );
}

export default App;
