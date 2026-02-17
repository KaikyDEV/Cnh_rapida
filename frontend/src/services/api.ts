import axios from 'axios';

// Instância Axios configurada para o backend externo
// Altere a baseURL quando o backend estiver disponível
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('cnhrapido_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('cnhrapido_token');
                localStorage.removeItem('cnhrapido_user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
