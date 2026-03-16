'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';
import Header from '@/components/layout/Header';

import ErrorBoundary from '@/components/shared/ErrorBoundary';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading, usuario } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (usuario) {
                const pathname = window.location.pathname;
                const isInstrutorPath = pathname.startsWith('/instrutor');
                const isAlunoPath = pathname.startsWith('/aluno');
                const isDocumentosPath = pathname === '/documentos';
                const isAdmin = usuario.role === 'Admin';

                // Se o perfil estiver incompleto, força a completar
                if (usuario.perfilIncompleto) {
                    router.push('/completar-perfil');
                    return;
                }

                // Se não for admin e os documentos não estiverem aprovados, força a página de documentos
                if (!isAdmin && !usuario.documentosAprovados && !isDocumentosPath) {
                    router.push('/documentos');
                    return;
                }

                if (usuario.role === 'Aluno' && isInstrutorPath) {
                    router.push('/aluno');
                } else if (usuario.role === 'Instrutor' && (isAlunoPath || pathname.startsWith('/home'))) {
                    router.push('/instrutor');
                } else if (usuario.role === 'AutoEscola' && (isAlunoPath || isInstrutorPath || pathname.startsWith('/home'))) {
                    router.push('/auto-escola');
                }
            }
        }
    }, [isAuthenticated, isLoading, router, usuario]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cnh-bg-base">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-cnh-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-cnh-text-secondary">Carregando...</p>
                </div>
            </div>
        );
    }

    // 🛡️ Proteção: Se não autenticado ou perfil incompleto, não renderiza nada (o useEffect cuidará do redirecionamento)
    if (!isAuthenticated || usuario?.perfilIncompleto) {
        return null;
    }

    return (
        <div className="min-h-screen bg-cnh-bg-base">
            <Sidebar />
            <div className="lg:pl-[240px]">
                <Header />
                <main className="p-4 lg:p-6 pb-24 lg:pb-6 animate-fade-in">
                    <ErrorBoundary>
                        {children}
                    </ErrorBoundary>
                </main>
            </div>
            <BottomNav />
        </div>
    );
}
