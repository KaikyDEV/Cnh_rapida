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

        // 🔎 Buscar informações detalhadas do usuário (incluindo Role e Documentos)
        const infoResponse = await authApi.get<any>('/api/auth/me');
        const userData = infoResponse.data;

        const usuario: Usuario = {
            id: userData.id,
            nomeCompleto: userData.nomeCompleto,
            email: userData.email,
            role: userData.role,
            documentosAprovados: userData.documentosAprovados,
            perfilIncompleto: userData.perfilIncompleto || false,
            dataCriacao: new Date().toISOString(), // Fallback
            dataNascimento: userData.dataNascimento || '',
            cpf: userData.cpf,
            estado: userData.estado || '',
            nomeOuEmail: userData.nomeCompleto || userData.email,
        };

        return { usuario, token };
    },

    /**
     * Cadastro de novo usuário customizado
     * POST /api/auth/register
     */
    async cadastro(data: CadastroFormData): Promise<{ usuario: Usuario; token: string }> {
        // Enviar todos os campos para o novo endpoint de registro
        await authApi.post('/api/auth/register', {
            email: data.email,
            senha: data.senha,
            nomeCompleto: data.nomeCompleto,
            phoneNumber: data.phoneNumber,
            tipoConta: data.tipoConta,
            estado: data.estado,
            dataNascimento: data.dataNascimento,
            cpf: data.cpf
        });

        // Após registrar, faz login para obter o token
        return this.login({
            email: data.email,
            senha: data.senha,
        });
    },

    /**
     * Logout
     */
    async logout(): Promise<void> {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('cnhrapido_token');
            localStorage.removeItem('cnhrapido_user');
        }
    },

    /**
     * Login com Google
     */
    async googleLogin(idToken: string): Promise<{ usuario: Usuario; token: string; perfilIncompleto: boolean }> {
        const response = await authApi.post<any>('/api/auth/google', { idToken }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const userData = response.data;
        const token = userData.token || idToken;

        const usuario: Usuario = {
            id: userData.id,
            nomeCompleto: userData.nomeCompleto,
            email: userData.email,
            role: userData.role,
            documentosAprovados: userData.documentosAprovados || false,
            perfilIncompleto: userData.perfilIncompleto || false,
            dataCriacao: new Date().toISOString(),
            dataNascimento: userData.dataNascimento || '',
            cpf: userData.cpf || '',
            estado: userData.estado || '',
            nomeOuEmail: userData.nomeCompleto || userData.email,
        };

        if (typeof window !== 'undefined') {
            localStorage.setItem('cnhrapido_token', token);
            localStorage.setItem('cnhrapido_user', JSON.stringify(usuario));
        }

        return { usuario, token, perfilIncompleto: userData.perfilIncompleto };
    },
};
