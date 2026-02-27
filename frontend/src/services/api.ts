/* eslint-disable @typescript-eslint/no-explicit-any */
// Cnh_rapida/frontend/src/services/api.ts
import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Módulo de Autenticação (Identity Minimal API)
export const authApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:5143',
    timeout: 10000,
    withCredentials: true, // Importante se o backend usar cookies de autenticação
    headers: {
        'Content-Type': 'application/json',
    },
});

// Módulo do Aluno
export const alunoApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_ALUNO_URL || 'http://localhost:5143/api/aluno',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Módulo do Admin
export const adminApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:5143/api/admin',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Interceptor de Request Compartilhado
 * Adiciona o Bearer Token em todas as requisições se disponível
 */
const addAuthToken = (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('cnhrapido_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
};

authApi.interceptors.request.use(addAuthToken);
alunoApi.interceptors.request.use(addAuthToken);
adminApi.interceptors.request.use(addAuthToken);

/**
 * Interceptor de Response Compartilhado
 * Trata erros 401 (não autorizado)
 */
const handleAuthError = (error: any) => {
    if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('cnhrapido_token');
            localStorage.removeItem('cnhrapido_user');

            // Redireciona para o login se não já estivermos em uma página pública
            const publicPaths = ['/login', '/cadastro'];
            if (!publicPaths.includes(window.location.pathname)) {
                window.location.href = '/login';
            }
        }
    }
    return Promise.reject(error);
};

authApi.interceptors.response.use((res) => res, handleAuthError);
alunoApi.interceptors.response.use((res) => res, handleAuthError);
adminApi.interceptors.response.use((res) => res, handleAuthError);

const api = authApi;
export default api;