import api from '../api'; // tu instancia de axios

export async function registerOrder(orderData) {
  try {
    const response = await api.post('/register-order/', orderData);
    return response.data;
  } catch (error) {
    console.error("Error registrando la orden:", error);
    throw error;
  }
}