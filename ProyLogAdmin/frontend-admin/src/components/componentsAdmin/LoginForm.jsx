import React, { useState } from "react";
import axios from "axios";
import "../../styles/stylesAdmin/LoginForm.css"; // Asegúrate de importar el CSS

function LoginForm({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post( `${import.meta.env.VITE_API_URL}/token/`, credentials );
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      onLogin();
    } catch (error) {
      console.error("Error de login:", error.response?.data || error.message);
      setError("Usuario o contraseña incorrectos");
    }
  };
  console.log("API URL:", import.meta.env.VITE_API_URL);

  return (
    <div className="login-form">
      <h2>Iniciar sesión</h2>
      <form onSubmit={login}>
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Usuario" 
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} 
            className={error ? "error" : ""}
          />
        </div>
        <div className="form-group">
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} 
            className={error ? "error" : ""}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}

export default LoginForm;











{/* 
import React, { useState } from "react";
import axios from "axios";

function LoginForm({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/token/", credentials);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      onLogin();
    } catch (error) {
      console.error("Error de login:", error.response?.data || error.message);
      alert("Error al iniciar sesión");
    }
  };

  return (
    <form onSubmit={login}>
      <input type="text" placeholder="Usuario" onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} />
      <input type="password" placeholder="Contraseña" onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
      <button type="submit">Iniciar sesión</button>
    </form>
  );
}
export default LoginForm;
*/}