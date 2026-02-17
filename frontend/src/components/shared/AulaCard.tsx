'use client';

import { AulaPratica } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from './StatusBadge';
import { Clock, User, X } from 'lucide-react';

interface AulaCardProps {
    aula: AulaPratica;
    instrutor?: string;
    onCancel?: (aulaId: number) => void;
}

function getStatusLabel(aula: AulaPratica): 'Confirmada' | 'Realizada' | 'Cancelada' | 'Agendada' {
    if (aula.realizada) return 'Realizada';
    if (aula.confirmada) return 'Confirmada';
    return 'Agendada';
}

function formatDateTime(isoString: string): { date: string; time: string } {
    const d = new Date(isoString);
    const date = d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
    const time = d.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    });
    return { date, time };
}

export default function AulaCard({ aula, instrutor, onCancel }: AulaCardProps) {
    const { date, time } = formatDateTime(aula.data);
    const status = getStatusLabel(aula);
    const isFuture = new Date(aula.data) > new Date();
    const canCancel = isFuture && !aula.realizada && onCancel;

    return (
        <Card className="p-4 card-hover border border-cnh-border rounded-xl">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                    {/* Time icon */}
                    <div className="w-10 h-10 rounded-lg bg-cnh-primary/10 flex items-center justify-center shrink-0">
                        <Clock size={18} className="text-cnh-primary" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-cnh-text-primary">
                                {date} às {time}
                            </span>
                            <StatusBadge status={status} />
                        </div>

                        <p className="text-sm text-cnh-text-secondary mt-1">
                            {aula.quantidadeHoras}h de aula prática
                        </p>

                        {instrutor && (
                            <div className="flex items-center gap-1.5 mt-1.5">
                                <User size={14} className="text-cnh-text-muted" />
                                <span className="text-xs text-cnh-text-muted">{instrutor}</span>
                            </div>
                        )}

                        {aula.observacao && (
                            <p className="text-xs text-cnh-text-muted mt-1 italic">
                                {aula.observacao}
                            </p>
                        )}
                    </div>
                </div>

                {/* Cancel button */}
                {canCancel && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-cnh-text-muted hover:text-cnh-error hover:bg-red-50"
                        onClick={() => onCancel(aula.id)}
                        aria-label="Cancelar aula"
                    >
                        <X size={16} />
                    </Button>
                )}
            </div>
        </Card>
    );
}
