'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';
import Header from '@/components/layout/Header';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

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

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-cnh-bg-base">
            <Sidebar />
            <div className="lg:pl-[240px]">
                <Header />
                <main className="p-4 lg:p-6 pb-24 lg:pb-6 animate-fade-in">
                    {children}
                </main>
            </div>
            <BottomNav />
        </div>
    );
}
