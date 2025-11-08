import axios from 'axios';
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4002/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});
// Request interceptor to add Bearer token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response, 
    (error) => {
        // Solo redirigir a /login en 401 si NO es un error de pago/stripe
        if (error.response?.status === 401) {
            const url = error.config?.url || '';
            // No redirigir si es un endpoint de pagos
            if (!url.includes('/payments/') && !url.includes('/orders')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
