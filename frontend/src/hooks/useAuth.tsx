'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Usuario } from '@/types';
import { authService } from '@/services/authService';
import { LoginFormData } from '@/schemas/loginSchema';
import { CadastroFormData } from '@/schemas/cadastroSchema';

interface AuthContextType {
    usuario: Usuario | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    role: 'Aluno' | 'Instrutor' | null;
    login: (data: LoginFormData) => Promise<void>;
    cadastro: (data: CadastroFormData) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('cnhrapido_user');
        const storedToken = localStorage.getItem('cnhrapido_token');

        if (storedUser && storedToken) {
            try {
                setUsuario(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('cnhrapido_user');
                localStorage.removeItem('cnhrapido_token');
            }
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (data: LoginFormData) => {
        const result = await authService.login(data);
        setUsuario(result.usuario);
        localStorage.setItem('cnhrapido_user', JSON.stringify(result.usuario));
        localStorage.setItem('cnhrapido_token', result.token);
    }, []);

    const cadastro = useCallback(async (data: CadastroFormData) => {
        const result = await authService.cadastro(data);
        setUsuario(result.usuario);
        localStorage.setItem('cnhrapido_user', JSON.stringify(result.usuario));
        localStorage.setItem('cnhrapido_token', result.token);
    }, []);

    const logout = useCallback(async () => {
        await authService.logout();
        setUsuario(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                usuario,
                isAuthenticated: !!usuario,
                isLoading,
                role: usuario?.role ?? null,
                login,
                cadastro,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}
