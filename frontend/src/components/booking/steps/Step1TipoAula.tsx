'use client';

import { Card } from '@/components/ui/card';
import { TipoAula } from '@/types';

interface Step1Props {
    selected: TipoAula | null;
    onSelect: (tipo: TipoAula) => void;
}

const opcoes: { tipo: TipoAula; emoji: string; titulo: string; descricao: string; duracao: string }[] = [
    {
        tipo: 'Diurna',
        emoji: '🚗',
        titulo: 'Aula Prática Diurna',
        descricao: 'Aula prática em horário comercial',
        duracao: '50 min',
    },
    {
        tipo: 'Noturna',
        emoji: '🌙',
        titulo: 'Aula Prática Noturna',
        descricao: 'Aula prática no período noturno',
        duracao: '50 min',
    },
    {
        tipo: 'Baliza',
        emoji: '🅿️',
        titulo: 'Baliza e Estacionamento',
        descricao: 'Foco em manobras e estacionamento',
        duracao: '50 min',
    },
    {
        tipo: 'Simulado',
        emoji: '🏆',
        titulo: 'Simulado Prático',
        descricao: 'Simulação completa do exame prático',
        duracao: '90 min',
    },
];

export default function Step1TipoAula({ selected, onSelect }: Step1Props) {
    return (
        <Card className="p-6 sm:p-8 rounded-xl border border-cnh-border">
            <h2 className="text-xl font-bold text-cnh-text-primary mb-1">Escolha o Tipo de Aula</h2>
            <p className="text-sm text-cnh-text-secondary mb-6">
                Selecione a modalidade de aula que deseja agendar
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {opcoes.map((opcao) => {
                    const isSelected = selected === opcao.tipo;

                    return (
                        <button
                            key={opcao.tipo}
                            onClick={() => onSelect(opcao.tipo)}
                            className={`
                p-5 rounded-xl border-2 text-left transition-all duration-150 cursor-pointer
                ${isSelected
                                    ? 'border-cnh-primary bg-cnh-primary/5 shadow-md'
                                    : 'border-cnh-border hover:border-cnh-primary/40 hover:shadow-sm'
                                }
              `}
                        >
                            <div className="flex items-start justify-between">
                                <span className="text-3xl">{opcao.emoji}</span>
                                {isSelected && (
                                    <span className="w-6 h-6 rounded-full bg-cnh-primary flex items-center justify-center">
                                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                                            <path d="M2 7L5.5 10.5L12 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                            <h3 className={`font-semibold mt-3 mb-1 ${isSelected ? 'text-cnh-primary' : 'text-cnh-text-primary'}`}>
                                {opcao.titulo}
                            </h3>
                            <p className="text-sm text-cnh-text-secondary">{opcao.descricao}</p>
                            <p className="text-xs text-cnh-text-muted mt-2">{opcao.duracao}</p>
                        </button>
                    );
                })}
            </div>
        </Card>
    );
}
