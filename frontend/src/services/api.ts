/* eslint-disable @typescript-eslint/no-explicit-any */
// Cnh_rapida/frontend/src/services/api.ts
import axios, { InternalAxiosRequestConfig } from 'axios';

// 🔥 Instância única centralizada
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5143';

if (typeof window !== 'undefined') {
    console.log('[API] Using baseURL:', baseURL);
}

const api = axios.create({
    baseURL,
    timeout: 30000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Interceptor de Request
 * Adiciona o Bearer Token em todas as requisições se disponível
 */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('cnhrapido_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

/**
 * Interceptor de Response
 * Trata erros 401 (não autorizado) globalmente
 */
api.interceptors.response.use(
    (res) => res,
    (error: any) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('cnhrapido_token');
                localStorage.removeItem('cnhrapido_user');

                const publicPaths = ['/login', '/cadastro'];
                if (!publicPaths.includes(window.location.pathname)) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

// Aliases para manter compatibilidade com os services existentes
export const authApi = api;
export const alunoApi = api;
export const adminApi = api;
export const instrutorApi = api;
export const autoEscolaApi = api;

export default api;