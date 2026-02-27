import { Usuario } from '@/types';
import { LoginFormData } from '@/schemas/loginSchema';
import { CadastroFormData } from '@/schemas/cadastroSchema';
import { authApi } from './api';

/**
 * ASP.NET Identity minimal API:
 *  - POST /login       → retorna { accessToken, ... } ou setar Cookie
 *  - POST /register    → retorna 200 OK
 *  - GET /manage/info  → retorna informações do usuário logado
 */

interface IdentityLoginResponse {
    accessToken?: string;
    tokenType?: string;
    expiresIn?: number;
    refreshToken?: string;
}

interface IdentityInfoResponse {
    email: string;
    isEmailConfirmed: boolean;
}

export const authService = {
    /**
     * Login com email e senha
     * POST /login
     */
    async login(data: LoginFormData): Promise<{ usuario: Usuario; token: string }> {
        const response = await authApi.post<IdentityLoginResponse>('/login', {
            email: data.email,
            password: data.senha,
        });

        const token = response.data.accessToken || '';

        if (token && typeof window !== 'undefined') {
            localStorage.setItem('cnhrapido_token', token);
        }

        const infoResponse = await authApi.get<IdentityInfoResponse>('/manage/info');

        const usuario: Usuario = {
            id: infoResponse.data.email,
            nomeCompleto: infoResponse.data.email.split('@')[0],
            email: infoResponse.data.email,
            role: 'Aluno',
            dataCriacao: new Date().toISOString(),
            dataNascimento: new Date().toISOString(),
            cpf: '',
            estado: '',
            nomeOuEmail: infoResponse.data.email,
        };

        return { usuario, token };
    },

    /**
     * Cadastro de novo usuário
     * POST /register
     */
    async cadastro(data: CadastroFormData): Promise<{ usuario: Usuario; token: string }> {
        await authApi.post('/register', {
            email: data.email,
            password: data.senha,
        });

        return this.login({
            email: data.email,
            senha: data.senha,
        });
    },

    /**
     * Logout
     */
    async logout(): Promise<void> {
        try {
            await authApi.post('/logout');
        } catch (e) {
            console.warn('Logout failed', e);
        } finally {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('cnhrapido_token');
                localStorage.removeItem('cnhrapido_user');
            }
        }
    },
};
