'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, GraduationCap, Car, User, LogOut } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/aluno', label: 'Dashboard Aluno', icon: GraduationCap },
    { href: '/instrutor', label: 'Dashboard Instrutor', icon: Car },
    { href: '/perfil', label: 'Perfil', icon: User },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { usuario, logout } = useAuth();

    return (
        <aside className="hidden lg:flex lg:flex-col lg:w-[240px] lg:fixed lg:inset-y-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border z-40">
            {/* Logo */}
            <div className="flex items-center h-16 px-5 border-b border-sidebar-border">
                <Logo size="sm" />
            </div>

            {/* Navigation links */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 ease-in-out
                ${isActive
                                    ? 'bg-sidebar-accent text-white'
                                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white'
                                }
              `}
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User section at bottom */}
            {usuario && (
                <div className="border-t border-sidebar-border p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-cnh-primary flex items-center justify-center text-white text-sm font-semibold">
                            {usuario.nomeCompleto.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {usuario.nomeCompleto}
                            </p>
                            <p className="text-xs text-sidebar-foreground/60 truncate">
                                {usuario.role}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                window.location.href = '/login';
                            }}
                            className="p-1.5 rounded-md hover:bg-sidebar-accent/50 text-sidebar-foreground/60 hover:text-white transition-colors"
                            aria-label="Sair"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            )}
        </aside>
    );
}
