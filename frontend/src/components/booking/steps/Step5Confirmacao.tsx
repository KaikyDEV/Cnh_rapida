'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Car, User, Calendar, Clock, MapPin, Lightbulb } from 'lucide-react';
import { TipoAula } from '@/types';

interface BookingData {
    tipoAula: TipoAula | null;
    instrutorId: string | null;
    instrutorNome: string | null;
    data: string | null;
    horario: string | null;
}

interface Step5Props {
    bookingData: BookingData;
    onBack: () => void;
    onConfirm: () => void;
}

const tipoLabels: Record<string, { label: string; duracao: string }> = {
    Diurna: { label: 'Aula Prática Diurna', duracao: '50 min' },
    Noturna: { label: 'Aula Prática Noturna', duracao: '50 min' },
    Baliza: { label: 'Baliza e Estacionamento', duracao: '50 min' },
    Simulado: { label: 'Simulado Prático', duracao: '90 min' },
};

function formatDateBR(dateStr: string): string {
    const [year, month, day] = dateStr.split('-').map(Number);
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    return `${day} de ${meses[month - 1]} de ${year}`;
}

export default function Step5Confirmacao({ bookingData, onBack, onConfirm }: Step5Props) {
    const tipo = bookingData.tipoAula ? tipoLabels[bookingData.tipoAula] : null;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="text-center mb-2">
                <div className="w-16 h-16 rounded-full bg-cnh-success/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-cnh-success" />
                </div>
                <h2 className="text-xl font-bold text-cnh-text-primary">Confirme sua Aula</h2>
                <p className="text-sm text-cnh-text-secondary mt-1">
                    Revise os detalhes antes de finalizar o agendamento
                </p>
            </div>

            {/* Summary card */}
            <Card className="p-5 rounded-xl border border-cnh-border">
                {/* Tipo de Aula */}
                <div className="flex items-center gap-3 py-3">
                    <Car size={18} className="text-cnh-primary shrink-0" />
                    <div>
                        <p className="text-xs text-cnh-text-muted">Tipo de Aula</p>
                        <p className="text-sm font-semibold text-cnh-text-primary">
                            {tipo?.label} — {tipo?.duracao}
                        </p>
                    </div>
                </div>
                <Separator />

                {/* Instrutor */}
                <div className="flex items-center gap-3 py-3">
                    <User size={18} className="text-cnh-primary shrink-0" />
                    <div>
                        <p className="text-xs text-cnh-text-muted">Instrutor</p>
                        <p className="text-sm font-semibold text-cnh-text-primary">
                            {bookingData.instrutorNome || 'Atribuição automática'}
                        </p>
                    </div>
                </div>
                <Separator />

                {/* Data */}
                <div className="flex items-center gap-3 py-3">
                    <Calendar size={18} className="text-cnh-primary shrink-0" />
                    <div>
                        <p className="text-xs text-cnh-text-muted">Data</p>
                        <p className="text-sm font-semibold text-cnh-text-primary">
                            {bookingData.data ? formatDateBR(bookingData.data) : '—'}
                        </p>
                    </div>
                </div>
                <Separator />

                {/* Horário */}
                <div className="flex items-center gap-3 py-3">
                    <Clock size={18} className="text-cnh-primary shrink-0" />
                    <div>
                        <p className="text-xs text-cnh-text-muted">Horário</p>
                        <p className="text-sm font-semibold text-cnh-text-primary">
                            {bookingData.horario || '—'}
                        </p>
                    </div>
                </div>
                <Separator />

                {/* Local */}
                <div className="flex items-center gap-3 py-3">
                    <MapPin size={18} className="text-cnh-primary shrink-0" />
                    <div>
                        <p className="text-xs text-cnh-text-muted">Local</p>
                        <p className="text-sm font-semibold text-cnh-text-primary">
                            Centro de Treinamento - Zona Sul
                        </p>
                        <p className="text-xs text-cnh-text-secondary">
                            Av. Principal, 1234 - São Paulo, SP
                        </p>
                    </div>
                </div>
            </Card>

            {/* Important notice */}
            <Card className="p-4 rounded-xl border border-cnh-accent/30 bg-cnh-accent/5">
                <div className="flex items-start gap-3">
                    <Lightbulb size={18} className="text-cnh-accent-dark mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-cnh-text-primary mb-1.5">💡 Importante:</p>
                        <ul className="space-y-1 text-sm text-cnh-text-secondary">
                            <li>• Chegue 10 minutos antes do horário agendado</li>
                            <li>• Traga seus documentos (RG e CPF)</li>
                            <li>• Cancelamentos devem ser feitos com 24h de antecedência</li>
                        </ul>
                    </div>
                </div>
            </Card>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
                <Button variant="outline" onClick={onBack} className="flex-1 h-11 border-cnh-border">
                    Voltar
                </Button>
                <Button
                    onClick={onConfirm}
                    className="flex-1 h-11 bg-cnh-accent hover:bg-cnh-accent-dark text-cnh-text-primary font-semibold btn-press"
                >
                    Confirmar Agendamento
                </Button>
            </div>
        </div>
    );
}
