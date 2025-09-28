import axios from "axios";

// ================================
// 1️⃣ Base URL dinámica
// ================================
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// ================================
// 2️⃣ Crear instancia de Axios
// ================================
const api = axios.create({
  baseURL: BASE_URL,
 
});

// ================================
// 3️⃣ Interceptor de solicitudes
// ================================
// ➝ Agregar access token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  /*
  console.log('🔄 Request interceptor:');
  console.log('Data type:', config.data instanceof FormData ? 'FormData' : 'JSON');
  console.log('Content-Type header:', config.headers['Content-Type']);
  */

  // 🔹 Solo agregar JSON Content-Type si NO es FormData
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  } else {
    // ❌ NO tocar Content-Type si es FormData
    delete config.headers["Content-Type"];
  }
  
  //console.log('Content-Type after:', config.headers['Content-Type']);
  
  return config;
});
// ================================
// 4️⃣ Interceptor de respuestas
// ================================
// ➝ Manejar token expirado con refresh automático
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) throw new Error("No refresh token");

        // 🔄 Solicita un nuevo access token
        const res = await axios.post(`${BASE_URL}/token/refresh/`, {
          refresh: refresh,
        });

        const newAccess = res.data.access;

        // Guarda el nuevo token
        localStorage.setItem("access", newAccess);

        // Actualiza el header y repite la solicitud original
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (err) {
        console.error("❌ Token refresh failed:", err);

        // Limpia tokens y redirige a login
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    // Otros errores
    return Promise.reject(error);
  }
);

export default api;









{/*

  import axios from "axios";

// Crear la instancia
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL , // Ajusta si usas una URL diferente
});

// Interceptor de solicitud: agrega el token de acceso al header Authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  console.log("🛡️ Token en interceptor:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuesta: maneja errores de token expirado
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Verifica si es un 401 por token expirado y que no se haya intentado ya
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) throw new Error("No refresh token");

        // Solicita un nuevo access token
        const res = await axios.post("http://localhost:8000/api/token/refresh/", {
          refresh: refresh,
        });

        const newAccess = res.data.access;

        // Guarda el nuevo token
        localStorage.setItem("access", newAccess);

        // Actualiza el header con el nuevo token y repite la solicitud original
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest); // Reintenta
      } catch (err) {
        // Falló el refresh, redirigir al login
        console.error("Token refresh failed:", err);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login"; // o usa navigate si estás en un componente
        return Promise.reject(err);
      }
    }

    // Otros errores
    return Promise.reject(error);
  }
);

export default api;

  */}
