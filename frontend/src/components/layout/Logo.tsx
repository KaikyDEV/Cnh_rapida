'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeMap = {
    sm: { width: 120, height: 40 },
    md: { width: 160, height: 53 },
    lg: { width: 200, height: 67 },
    xl: { width: 280, height: 93 },
};

export default function Logo({ size = 'md', className = '' }: LogoProps) {
    const { width, height } = sizeMap[size];

    return (
        <Link href="/home" className={`inline-block ${className}`}>
            <Image
                src="/logo_cnh_rapido.png"
                alt="CNH Rápido"
                width={width}
                height={height}
                priority
                className="object-contain"
            />
        </Link>
    );
}
