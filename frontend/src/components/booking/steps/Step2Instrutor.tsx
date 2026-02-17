'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { mockInstrutores } from '@/services/instrutorService';

interface Step2Props {
    selected: string | null;
    onSelect: (id: string, nome: string) => void;
    onSkip: () => void;
}

export default function Step2Instrutor({ selected, onSelect, onSkip }: Step2Props) {
    return (
        <Card className="p-6 sm:p-8 rounded-xl border border-cnh-border">
            <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-bold text-cnh-text-primary">Escolha o Instrutor</h2>
                <button
                    onClick={onSkip}
                    className="text-sm text-cnh-primary hover:text-cnh-primary-dark font-medium transition-colors"
                >
                    Pular
                </button>
            </div>
            <p className="text-sm text-cnh-text-secondary mb-6">
                Selecione seu instrutor preferido ou pule para escolher automaticamente
            </p>

            <div className="space-y-3">
                {mockInstrutores.map((inst) => {
                    const isSelected = selected === inst.usuario.id;

                    return (
                        <button
                            key={inst.usuario.id}
                            onClick={() => onSelect(inst.usuario.id, inst.usuario.nomeCompleto)}
                            className={`
                w-full p-4 rounded-xl border-2 text-left transition-all duration-150 cursor-pointer
                ${isSelected
                                    ? 'border-cnh-primary bg-cnh-primary/5 shadow-md'
                                    : 'border-cnh-border hover:border-cnh-primary/40 hover:shadow-sm'
                                }
              `}
                        >
                            <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-full bg-cnh-primary-dark flex items-center justify-center text-white font-bold text-lg shrink-0">
                                    {inst.usuario.nomeCompleto.charAt(0)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold text-cnh-text-primary">
                                            {inst.usuario.nomeCompleto}
                                        </span>
                                        <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px] px-1.5">
                                            Certificado DETRAN
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-cnh-text-secondary mt-0.5">{inst.especialidade}</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <Star size={14} className="text-cnh-warning fill-cnh-warning" />
                                        <span className="text-sm font-medium text-cnh-text-primary">{inst.avaliacao}</span>
                                        <span className="text-xs text-cnh-text-muted">• {inst.aulasMinistradas} aulas ministradas</span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </Card>
    );
}
