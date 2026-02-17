'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface Step4Props {
    selected: string | null;
    onSelect: (horario: string) => void;
}

const todosHorarios = [
    '09:00', '09:30', '10:00', '10:30', '11:00',
    '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00',
    '16:30', '17:00', '17:30', '18:00', '18:30',
];

// Mock: horários indisponíveis
const horariosIndisponiveis = ['10:00', '12:00', '12:30', '13:00', '13:30', '15:30', '18:00'];

export default function Step4Horario({ selected, onSelect }: Step4Props) {
    return (
        <Card className="p-6 sm:p-8 rounded-xl border border-cnh-border">
            <h2 className="text-xl font-bold text-cnh-text-primary mb-1">Escolha o Horário</h2>
            <p className="text-sm text-cnh-text-secondary mb-6">Selecione o melhor horário disponível</p>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {todosHorarios.map((horario) => {
                    const indisponivel = horariosIndisponiveis.includes(horario);
                    const selecionado = selected === horario;

                    return (
                        <button
                            key={horario}
                            disabled={indisponivel}
                            onClick={() => onSelect(horario)}
                            className={`
                h-12 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5
                transition-all duration-150
                ${indisponivel
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : selecionado
                                        ? 'bg-cnh-primary text-white shadow-md'
                                        : 'border border-cnh-border text-cnh-text-primary hover:border-cnh-primary hover:bg-cnh-primary/5'
                                }
              `}
                        >
                            <Clock size={14} className={indisponivel ? 'text-gray-400' : selecionado ? 'text-white' : 'text-cnh-text-muted'} />
                            {horario}
                        </button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 mt-5 text-xs text-cnh-text-muted">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded border border-cnh-border" />
                    <span>Disponível</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-gray-100" />
                    <span>Indisponível</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-cnh-primary" />
                    <span>Selecionado</span>
                </div>
            </div>

            {/* Continue button */}
            {selected && (
                <div className="mt-6 flex justify-end">
                    <Button className="bg-cnh-primary hover:bg-cnh-primary-dark text-white btn-press">
                        Continuar
                    </Button>
                </div>
            )}
        </Card>
    );
}
