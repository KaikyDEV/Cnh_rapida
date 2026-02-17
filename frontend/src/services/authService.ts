import { Usuario } from '@/types';
import { LoginFormData } from '@/schemas/loginSchema';
import { CadastroFormData } from '@/schemas/cadastroSchema';
import { mockUsuarios } from '@/mocks/usuarios';

// Mock: simula autenticação até o backend estar disponível
// Substituir por chamadas reais em api.ts quando integrado

export const authService = {
    /**
     * Login com email e senha (mock)
     * Verifica contra a lista de usuários mockados
     */
    async login(data: LoginFormData): Promise<{ usuario: Usuario; token: string }> {
        // Simula delay de rede
        await new Promise(resolve => setTimeout(resolve, 800));

        const usuario = mockUsuarios.find(u => u.email === data.email);
        if (!usuario) {
            throw new Error('E-mail ou senha incorretos');
        }

        // Mock: qualquer senha >= 6 chars é aceita
        const token = `mock_token_${usuario.id}_${Date.now()}`;

        return { usuario, token };
    },

    /**
     * Cadastro de novo usuário (mock)
     */
    async cadastro(data: CadastroFormData): Promise<{ usuario: Usuario; token: string }> {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verifica se email já existe
        const existente = mockUsuarios.find(u => u.email === data.email);
        if (existente) {
            throw new Error('Este e-mail já está cadastrado');
        }

        const novoUsuario: Usuario = {
            id: `usr-${Date.now()}`,
            nomeCompleto: data.nomeCompleto,
            email: data.email,
            phoneNumber: data.phoneNumber,
            estado: data.estado,
            dataNascimento: data.dataNascimento,
            cpf: data.cpf,
            dataCriacao: new Date().toISOString(),
            role: data.tipoConta,
            nomeOuEmail: data.nomeCompleto,
        };

        const token = `mock_token_${novoUsuario.id}_${Date.now()}`;
        return { usuario: novoUsuario, token };
    },

    /**
     * Logout — limpa dados de autenticação
     */
    async logout(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300));
        if (typeof window !== 'undefined') {
            localStorage.removeItem('cnhrapido_token');
            localStorage.removeItem('cnhrapido_user');
        }
    },
};
