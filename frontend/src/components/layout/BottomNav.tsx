'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Home, GraduationCap, Car, User } from 'lucide-react';

const navItems = [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/aluno', label: 'Aluno', icon: GraduationCap },
    { href: '/instrutor', label: 'Instrutor', icon: Car },
    { href: '/perfil', label: 'Perfil', icon: User },
];

export default function BottomNav() {
    const pathname = usePathname();
    const { usuario } = useAuth();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-cnh-border lg:hidden">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems
                    .filter(item => {
                        if (usuario?.role === 'Aluno' && item.href === '/instrutor') return false;
                        if (usuario?.role === 'Instrutor' && (item.href === '/aluno' || item.href === '/home')) return false;
                        return true;
                    })
                    .map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                    flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl
                    transition-all duration-150 ease-in-out min-w-[64px]
                    ${isActive
                                        ? 'bg-cnh-primary/10 text-cnh-primary'
                                        : 'text-cnh-text-muted hover:text-cnh-text-secondary'
                                    }
                  `}
                            >
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                <span className={`text-[11px] leading-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
            </div>
        </nav>
    );
}
