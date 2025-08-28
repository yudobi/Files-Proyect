import axios from "axios";

const BASE_URL = "https://files-proyect.onrender.com/api" // import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // 10 segundos de timeout
});

api.interceptors.request.use(
    (response) => response,
    (error) => {
        console.error("Error API:", error.message);
        return Promise.reject(error);
    }
    );

export default api;