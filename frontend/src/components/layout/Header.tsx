'use client';

import { Calendar, Bell } from 'lucide-react';
import Link from 'next/link';
import Logo from './Logo';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

export default function Header() {
    const { usuario } = useAuth();

    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-cnh-border">
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                {/* Logo (visible on mobile, hidden on desktop since sidebar has it) */}
                <div className="lg:hidden">
                    <Logo size="sm" />
                </div>
                {/* Spacer on desktop */}
                <div className="hidden lg:block" />

                {/* Right section */}
                <div className="flex items-center gap-3">
                    {/* Calendar shortcut */}
                    <Link
                        href="/agendamento"
                        className="p-2 rounded-lg hover:bg-cnh-bg-base text-cnh-text-secondary hover:text-cnh-primary transition-colors"
                        aria-label="Agendar aula"
                    >
                        <Calendar size={20} />
                    </Link>

                    {/* Notifications (visual only) */}
                    <button
                        className="relative p-2 rounded-lg hover:bg-cnh-bg-base text-cnh-text-secondary hover:text-cnh-primary transition-colors"
                        aria-label="Notificações"
                    >
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cnh-error rounded-full" />
                    </button>

                    {/* User info */}
                    {usuario && (
                        <Link href="/perfil" className="flex items-center gap-2.5 ml-1">
                            <div className="w-8 h-8 rounded-full bg-cnh-primary-dark flex items-center justify-center text-white text-sm font-semibold">
                                {usuario.nomeCompleto.charAt(0).toUpperCase()}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-cnh-text-primary leading-tight">
                                    {usuario.nomeCompleto.split(' ')[0]}
                                </p>
                                <Badge
                                    variant="secondary"
                                    className="text-[10px] px-1.5 py-0 h-4 font-medium"
                                >
                                    {usuario.role}
                                </Badge>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
