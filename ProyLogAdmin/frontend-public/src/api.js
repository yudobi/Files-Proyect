import axios from "axios";

const BASE_URL = "https://files-proyect.onrender.com/api" // import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // 10 segundos de timeout
});

// ✅ INTERCEPTOR DE REQUEST CORRECTO
api.interceptors.request.use(
  (config) => {
    // Puedes agregar headers aquí si necesitas
    console.log("Enviando request a:", config.url);
    return config;
  },
  (error) => {
    console.error("Error en request:", error.message);
    return Promise.reject(error);
  }
);

// ✅ INTERCEPTOR DE RESPONSE (OPCIONAL PERO RECOMENDADO)
api.interceptors.response.use(
  (response) => {
    console.log("Respuesta recibida:", response.status);
    return response;
  },
  (error) => {
    console.error("Error en respuesta:", error.message);
    
    if (error.response) {
      // El servidor respondió con un error
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      // La request se hizo pero no hubo respuesta
      console.error("No se recibió respuesta del servidor");
    }
    
    return Promise.reject(error);
  }
);

export default api;