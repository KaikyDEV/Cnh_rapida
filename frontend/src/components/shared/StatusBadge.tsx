'use client';

import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
    status: 'Confirmada' | 'Realizada' | 'Cancelada' | 'Agendada' | 'Aprovada' | 'Concluída';
}

const statusStyles: Record<string, string> = {
    Confirmada: 'bg-green-100 text-green-700 border-green-200',
    Realizada: 'bg-blue-100 text-blue-700 border-blue-200',
    Cancelada: 'bg-red-100 text-red-700 border-red-200',
    Agendada: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Aprovada: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Concluída: 'bg-green-100 text-green-700 border-green-200',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <Badge
            variant="outline"
            className={`text-xs font-medium px-2 py-0.5 ${statusStyles[status] || 'bg-gray-100 text-gray-700'}`}
        >
            {status}
        </Badge>
    );
}
