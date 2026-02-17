'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Step3Props {
    selected: string | null;
    onSelect: (data: string) => void;
}

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// Datas bloqueadas mock
const datasIndisponiveis = ['2026-02-25', '2026-02-26', '2026-03-01', '2026-03-08'];

function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
}

export default function Step3Data({ selected, onSelect }: Step3Props) {
    const hoje = new Date();
    const [mesAtual, setMesAtual] = useState(hoje.getMonth());
    const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());

    const diasNoMes = getDaysInMonth(anoAtual, mesAtual);
    const primeiroDia = getFirstDayOfMonth(anoAtual, mesAtual);

    const mesSeguinte = () => {
        if (mesAtual === 11) {
            setMesAtual(0);
            setAnoAtual(prev => prev + 1);
        } else {
            setMesAtual(prev => prev + 1);
        }
    };

    const mesAnterior = () => {
        if (mesAtual === 0) {
            setMesAtual(11);
            setAnoAtual(prev => prev - 1);
        } else {
            setMesAtual(prev => prev - 1);
        }
    };

    const formatDate = (dia: number): string => {
        return `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    };

    const isPassado = (dia: number): boolean => {
        const date = new Date(anoAtual, mesAtual, dia);
        return date < new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    };

    const isHoje = (dia: number): boolean => {
        return dia === hoje.getDate() && mesAtual === hoje.getMonth() && anoAtual === hoje.getFullYear();
    };

    const isBloqueado = (dia: number): boolean => {
        return datasIndisponiveis.includes(formatDate(dia));
    };

    return (
        <Card className="p-6 sm:p-8 rounded-xl border border-cnh-border">
            <h2 className="text-xl font-bold text-cnh-text-primary mb-1">Escolha a Data</h2>
            <p className="text-sm text-cnh-text-secondary mb-6">
                Selecione a data desejada para sua aula prática
            </p>

            {/* Calendar header */}
            <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="icon" onClick={mesAnterior} className="h-8 w-8">
                    <ChevronLeft size={18} />
                </Button>
                <span className="text-base font-semibold text-cnh-text-primary">
                    {meses[mesAtual]} {anoAtual}
                </span>
                <Button variant="ghost" size="icon" onClick={mesSeguinte} className="h-8 w-8">
                    <ChevronRight size={18} />
                </Button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {diasSemana.map((d) => (
                    <div key={d} className="text-center text-xs font-medium text-cnh-text-muted py-1">
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
                {/* Empty cells before first day */}
                {Array.from({ length: primeiroDia }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {/* Days */}
                {Array.from({ length: diasNoMes }).map((_, i) => {
                    const dia = i + 1;
                    const dateStr = formatDate(dia);
                    const passado = isPassado(dia);
                    const ehHoje = isHoje(dia);
                    const bloqueado = isBloqueado(dia);
                    const selecionado = selected === dateStr;
                    const desabilitado = passado || bloqueado;

                    return (
                        <button
                            key={dia}
                            disabled={desabilitado}
                            onClick={() => onSelect(dateStr)}
                            className={`
                h-10 rounded-lg text-sm font-medium transition-all duration-150
                ${desabilitado
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : selecionado
                                        ? 'bg-cnh-primary text-white shadow-md'
                                        : ehHoje
                                            ? 'border-2 border-cnh-primary text-cnh-primary hover:bg-cnh-primary/10'
                                            : 'text-cnh-text-primary hover:bg-cnh-bg-base'
                                }
              `}
                        >
                            {dia}
                        </button>
                    );
                })}
            </div>

            {/* Continue button */}
            {selected && (
                <div className="mt-6 flex justify-end">
                    <Button
                        className="bg-cnh-primary hover:bg-cnh-primary-dark text-white btn-press"
                    >
                        Continuar
                    </Button>
                </div>
            )}
        </Card>
    );
}
