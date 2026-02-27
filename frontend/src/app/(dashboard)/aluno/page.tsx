'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProgressCircle from '@/components/shared/ProgressCircle';
import { alunoService } from '@/services/alunoService';
import type { AulaPraticaResponse } from '@/services/alunoService';
import { instrutorService } from '@/services/instrutorService';
import { InstrutorDisplay } from '@/types';
import { Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const tiposAula = [
    { tipo: 'Diurna', emoji: '🚗', label: 'Aula Prática', duracao: '50 min' },
    { tipo: 'Noturna', emoji: '🌙', label: 'Aula Noturna', duracao: '50 min' },
    { tipo: 'Simulado', emoji: '🎯', label: 'Simulado Prático', duracao: '90 min' },
    { tipo: 'Baliza', emoji: '🅿️', label: 'Baliza e Estacionamento', duracao: '50 min' },
];

export default function AlunoPage() {
    const [aulas, setAulas] = useState<AulaPraticaResponse[]>([]);
    const [instrutores, setInstrutores] = useState<InstrutorDisplay[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [aulasData, instrutoresData] = await Promise.all([
                    alunoService.buscarMinhasAulas(),
                    instrutorService.buscarInstrutores(),
                ]);
                setAulas(aulasData);
                setInstrutores(instrutoresData);
            } catch (error) {
                console.error('Erro ao carregar dados do aluno:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-3 border-cnh-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const aulasRealizadas = aulas.filter(a => a.realizada).length;
    const totalAulas = 25;
    const proximasAulas = aulas.filter(a => !a.realizada);
    const porcentagem = Math.round((aulasRealizadas / totalAulas) * 100);

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
            {/* Próximas Aulas */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-cnh-text-primary">Próximas Aulas</h2>
                    <Link href="/agendamento" className="text-sm text-cnh-primary hover:text-cnh-primary-dark font-medium flex items-center gap-1">
                        Ver todas <ArrowRight size={14} />
                    </Link>
                </div>

                {proximasAulas.length > 0 ? (
                    <div className="space-y-3">
                        {proximasAulas.map((aula) => (
                            <Card key={aula.id} className="p-4 rounded-xl border border-cnh-border card-hover">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-bold text-cnh-primary min-w-[80px]">
                                            {new Date(aula.data).toLocaleDateString('pt-BR')}
                                        </span>
                                        <div>
                                            <p className="text-sm font-semibold text-cnh-text-primary">
                                                {new Date(aula.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <p className="text-xs text-cnh-text-muted">{aula.quantidadeHoras}h de aula</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-8 rounded-xl border border-cnh-border text-center">
                        <div className="text-4xl mb-3">📅</div>
                        <p className="text-cnh-text-secondary mb-4">Nenhuma aula agendada</p>
                        <Link href="/agendamento">
                            <Button className="bg-cnh-primary hover:bg-cnh-primary-dark text-white btn-press">
                                Agendar Aula
                            </Button>
                        </Link>
                    </Card>
                )}
            </section>

            {/* Seu Progresso */}
            <section>
                <h2 className="text-lg font-bold text-cnh-text-primary mb-4">Seu Progresso</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="p-6 rounded-xl border border-cnh-border flex flex-col items-center justify-center">
                        <ProgressCircle value={porcentagem} size="lg" />
                        <p className="text-sm text-cnh-text-secondary mt-3 font-medium">
                            {aulasRealizadas} de {totalAulas} aulas
                        </p>
                        <p className="text-xs text-cnh-text-muted mt-1">
                            Faltam {totalAulas - aulasRealizadas} aulas para o exame
                        </p>
                    </Card>

                    <Card className="p-6 rounded-xl border border-cnh-border">
                        <h3 className="text-sm text-cnh-text-secondary font-medium mb-3">Média de Desempenho</h3>
                        <p className="text-3xl font-bold text-cnh-text-primary mb-4">8.5<span className="text-lg text-cnh-text-muted">/10</span></p>
                        <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-cnh-warning to-cnh-success transition-all duration-500"
                                style={{ width: '85%' }}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-cnh-text-muted">
                            <span>Inicial</span>
                            <span>Avançado</span>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Tipos de Aula */}
            <section>
                <h2 className="text-lg font-bold text-cnh-text-primary mb-4">Tipos de Aula Disponíveis</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {tiposAula.map((tipo) => (
                        <Link key={tipo.tipo} href={`/agendamento?tipo=${tipo.tipo}`}>
                            <Card className="p-4 rounded-xl border border-cnh-border card-hover cursor-pointer text-center h-full">
                                <span className="text-3xl block mb-2">{tipo.emoji}</span>
                                <h3 className="text-sm font-semibold text-cnh-text-primary mb-0.5">{tipo.label}</h3>
                                <p className="text-xs text-cnh-text-muted">{tipo.duracao}</p>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Instrutores */}
            <section>
                <h2 className="text-lg font-bold text-cnh-text-primary mb-4">Instrutores Mais Avaliados</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {instrutores.map((inst) => (
                        <Link key={inst.usuario.id} href={`/agendamento?instrutor=${inst.usuario.id}`}>
                            <Card className="p-4 rounded-xl border border-cnh-border card-hover cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-cnh-primary-dark flex items-center justify-center text-white font-semibold text-lg shrink-0">
                                        {inst.usuario.nomeCompleto.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-cnh-text-primary truncate">{inst.usuario.nomeCompleto}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <Star size={14} className="text-cnh-warning fill-cnh-warning" />
                                            <span className="text-xs text-cnh-text-secondary font-medium">{inst.avaliacao}</span>
                                            <span className="text-xs text-cnh-text-muted">• {inst.aulasMinistradas} aulas</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
