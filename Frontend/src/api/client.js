import axios from 'axios';

// Cliente Axios preconfigurado
const client = axios.create({
  baseURL: 'http://localhost:4002', // Backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variable para almacenar el store (se setea desde main.jsx)
let store = null;

export const setAxiosStore = (storeInstance) => {
  store = storeInstance;
};

// Interceptor de request: agregar token del estado
client.interceptors.request.use(
  (config) => {
    if (store) {
      const token = store.getState().auth.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response: manejar 401
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && store) {
      // Disparar acción de logout directamente
      store.dispatch({ type: 'auth/logout' });
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
