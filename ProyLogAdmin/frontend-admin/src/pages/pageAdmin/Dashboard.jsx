import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";
import ProductGallery from "../../components/componentsAdmin/ProductGallery";
import "../../styles/stylesAdmin/Dashboard.css"; // Import your CSS styles
import Inicio from "../../components/componentsAdmin/Inicio";


function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1 className="dashboard-logo">MiTienda</h1>
        <div className="nav-links">

          <Link to="/galery-products" className="nav-button">
            <i className="fas fa-plus"></i> Productos
          </Link>

           <Link to="/galery-services" className="nav-button">
            <i className="fas fa-plus"></i> Servicios
          </Link>

          <Link to="/galery-services" className="nav-button">
            <i className="fas fa-plus"></i> Crear Marcas Productos
          </Link>

          <Link to="/galery-services" className="nav-button">
            <i className="fas fa-plus"></i> Crear Categorias Productos
          </Link>

          <button className="nav-button">
            <i className="fas fa-users"></i> Usuarios
          </button>
          <button onClick={logout} className="nav-button logout">
            <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <Inicio />
      </main>
    </div>
  );
}

export default Dashboard;

