'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/layout/Logo';
import { LogOut, ShieldCheck } from 'lucide-react';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading, usuario, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (usuario?.role !== 'Admin') {
                // Se não for admin, redireciona para a home
                router.push('/home');
            }
        }
    }, [isAuthenticated, isLoading, router, usuario]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cnh-bg-base">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-cnh-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-cnh-text-secondary">Verificando acessos...</p>
                </div>
            </div>
        );
    }

    // Proteção rigorosa: Se não estiver autenticado ou não for Admin, não renderiza nada
    if (!isAuthenticated || usuario?.role !== 'Admin') {
        return null;
    }

    return (
        <div className="min-h-screen bg-cnh-bg-base flex flex-col">
            {/* Minimal Admin Header */}
            <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-cnh-border">
                <div className="flex items-center justify-between h-16 px-4 lg:px-6 max-w-7xl mx-auto w-full">
                    
                    {/* Left: Branding */}
                    <div className="flex items-center gap-4">
                        <Logo size="sm" />
                        <div className="hidden sm:flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            <ShieldCheck size={14} />
                            Administração
                        </div>
                    </div>

                    {/* Right: User actions */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 border-r border-cnh-border pr-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-cnh-text-primary leading-tight">
                                    {usuario.nomeCompleto}
                                </p>
                                <p className="text-xs text-cnh-text-muted">Admin</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold">
                                {usuario.nomeCompleto.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                window.location.href = '/login';
                            }}
                            className="flex items-center gap-2 text-sm font-medium text-cnh-text-secondary hover:text-red-600 transition-colors"
                        >
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Sair</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-4 lg:p-8 animate-fade-in w-full max-w-7xl mx-auto">
                <ErrorBoundary>
                    {children}
                </ErrorBoundary>
            </main>
        </div>
    );
}
