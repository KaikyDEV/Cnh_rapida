'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProgressCircle from '@/components/shared/ProgressCircle';
import StepIndicator from '@/components/shared/StepIndicator';
import { alunoService } from '@/services/alunoService';
import type { AulaPraticaResponse } from '@/services/alunoService';
import { instrutorService } from '@/services/instrutorService';
import { AlunoCnhStatus, InstrutorDisplay } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import {
    Star, ArrowRight, Building2, Trophy, Calendar,
    Clock, BookOpen, Lightbulb, CheckCircle2, Target
} from 'lucide-react';
import Link from 'next/link';

const tiposAula = [
    { tipo: 'Diurna', emoji: '🚗', label: 'Aula Prática', duracao: '50 min', cor: 'bg-blue-50 border-blue-200' },
    { tipo: 'Noturna', emoji: '🌙', label: 'Aula Noturna', duracao: '50 min', cor: 'bg-indigo-50 border-indigo-200' },
    { tipo: 'Simulado', emoji: '🎯', label: 'Simulado Prático', duracao: '90 min', cor: 'bg-amber-50 border-amber-200' },
    { tipo: 'Baliza', emoji: '🅿️', label: 'Baliza e Estac.', duracao: '50 min', cor: 'bg-emerald-50 border-emerald-200' },
];

function getGreeting(): { text: string; emoji: string } {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Bom dia', emoji: '☀️' };
    if (hour < 18) return { text: 'Boa tarde', emoji: '🌤️' };
    return { text: 'Boa noite', emoji: '🌙' };
}

function getCnhStep(status: AlunoCnhStatus | null): number {
    if (!status) return 1;
    if (!status.documentosAprovados) return 1;
    if (!status.exameMedicoAprovado) return 2;
    if (!status.exameTeoricoAprovado) return 3;
    if (!status.aulasPraticasIniciadas) return 4;
    return 5;
}

const cnhSteps = ['Documentos', 'Exame Médico', 'Teórico', 'Aulas Práticas', 'Exame Final'];

export default function AlunoPage() {
    const { usuario } = useAuth();
    const [status, setStatus] = useState<AlunoCnhStatus | null>(null);
    const [aulas, setAulas] = useState<AulaPraticaResponse[]>([]);
    const [instrutores, setInstrutores] = useState<InstrutorDisplay[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (usuario?.role !== 'Aluno') {
                setLoading(false);
                return;
            }
            try {
                const [statusData, aulasData, instrutoresData] = await Promise.all([
                    alunoService.buscarStatus(),
                    alunoService.buscarMinhasAulas().catch(() => []),
                    instrutorService.buscarInstrutores().catch(() => []),
                ]);
                setStatus(statusData);
                setAulas(aulasData);
                setInstrutores(instrutoresData);
            } catch (error) {
                console.error('Erro ao carregar dados do aluno:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [usuario]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-3 border-cnh-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const linkedToSchool = !!status?.autoEscolaId;
    const aulasRealizadas = aulas.filter(a => a.realizada).length;
    const totalAulas = 25;
    const proximasAulas = aulas.filter(a => !a.realizada);
    const porcentagem = Math.round((aulasRealizadas / totalAulas) * 100);
    const horasRestantes = (totalAulas - aulasRealizadas) * 2;
    const greeting = getGreeting();
    const currentCnhStep = getCnhStep(status);
    const firstName = usuario?.nomeCompleto?.split(' ')[0] ?? 'Aluno';

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
            {/* ───── Hero Greeting ───── */}
            <Card className="gradient-hero p-6 sm:p-8 rounded-2xl border-0 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-40 h-40 opacity-[0.07] pointer-events-none">
                    <span className="text-[100px]">🚗</span>
                </div>
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-14 h-14 rounded-full gradient-avatar flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
                        {firstName.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-xl sm:text-2xl font-bold text-white">
                            {greeting.text}, {firstName}! {greeting.emoji}
                        </h1>
                        <p className="text-white/70 text-sm mt-1">
                            {porcentagem > 0
                                ? `Você já completou ${porcentagem}% das suas aulas práticas. Continue assim!`
                                : 'Bem-vindo ao seu painel. Vamos começar sua jornada para a CNH!'}
                        </p>
                    </div>
                    <Link href="/agendamento" className="shrink-0">
                        <Button className="bg-cnh-accent hover:bg-cnh-accent-dark text-cnh-text-primary font-semibold btn-press shadow-lg">
                            <Calendar size={16} className="mr-1.5" /> Agendar Aula
                        </Button>
                    </Link>
                </div>
            </Card>

            {/* ───── Escolha da Auto Escola ───── */}
            {!linkedToSchool && (
                <Card className="p-6 rounded-xl border-2 border-dashed border-cnh-primary/30 bg-cnh-primary/5">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-cnh-primary/10 flex items-center justify-center text-cnh-primary shrink-0 animate-pulse-gentle">
                            <Building2 size={32} />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-xl font-bold text-cnh-text-primary mb-1">Escolha sua Auto Escola</h2>
                            <p className="text-cnh-text-secondary text-sm mb-0">Para começar a agendar suas aulas e acompanhar seu progresso, você precisa estar vinculado a uma unidade.</p>
                        </div>
                        <Link href="/aluno/selecionar-escola">
                            <Button className="bg-cnh-primary hover:bg-cnh-primary-dark text-white px-8 btn-press">
                                Procurar Escola
                            </Button>
                        </Link>
                    </div>
                </Card>
            )}

            {/* ───── KPI Cards ───── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-fade-in">
                {/* Aulas Concluídas */}
                <Card className="p-5 rounded-xl border border-cnh-border card-hover">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-cnh-primary/10 flex items-center justify-center">
                            <Trophy size={20} className="text-cnh-primary" />
                        </div>
                        <span className="text-sm text-cnh-text-secondary font-medium">Aulas Concluídas</span>
                    </div>
                    <p className="text-2xl font-bold text-cnh-text-primary">{aulasRealizadas}<span className="text-lg text-cnh-text-muted">/{totalAulas}</span></p>
                    <div className="mt-3 h-2.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-cnh-primary to-cnh-primary-light transition-all duration-700"
                            style={{ width: `${porcentagem}%` }}
                        />
                    </div>
                </Card>

                {/* Próxima Aula */}
                <Card className="p-5 rounded-xl border border-cnh-border card-hover">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-cnh-accent/15 flex items-center justify-center">
                            <Calendar size={20} className="text-cnh-accent-dark" />
                        </div>
                        <span className="text-sm text-cnh-text-secondary font-medium">Próxima Aula</span>
                    </div>
                    {proximasAulas.length > 0 ? (
                        <>
                            <p className="text-xl font-bold text-cnh-text-primary">
                                {new Date(proximasAulas[0].data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                            </p>
                            <p className="text-sm text-cnh-text-secondary mt-0.5">
                                {new Date(proximasAulas[0].data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                {' '}• {proximasAulas[0].quantidadeHoras}h
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-cnh-text-muted">Nenhuma aula agendada</p>
                    )}
                </Card>

                {/* Horas Restantes */}
                <Card className="p-5 rounded-xl border border-cnh-border card-hover">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-cnh-success/10 flex items-center justify-center">
                            <Clock size={20} className="text-cnh-success" />
                        </div>
                        <span className="text-sm text-cnh-text-secondary font-medium">Horas Restantes</span>
                    </div>
                    <p className="text-2xl font-bold text-cnh-text-primary">{horasRestantes}<span className="text-lg text-cnh-text-muted">h</span></p>
                    <p className="text-xs text-cnh-text-muted mt-1">
                        {totalAulas - aulasRealizadas} aulas para o exame prático
                    </p>
                </Card>
            </div>

            {/* ───── Timeline do Processo CNH ───── */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Target size={18} className="text-cnh-primary" />
                    <h2 className="text-lg font-bold text-cnh-text-primary">Progresso da CNH</h2>
                </div>
                <Card className="p-5 rounded-xl border border-cnh-border">
                    <StepIndicator currentStep={currentCnhStep} steps={cnhSteps} />
                    <p className="text-center text-sm text-cnh-text-secondary mt-3">
                        {currentCnhStep <= 4
                            ? `Etapa atual: ${cnhSteps[currentCnhStep - 1]}`
                            : '🎉 Você está pronto para o exame final!'}
                    </p>
                </Card>
            </section>

            {/* ───── Próximas Aulas ───── */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-cnh-primary" />
                        <h2 className="text-lg font-bold text-cnh-text-primary">Próximas Aulas</h2>
                    </div>
                    <Link href="/agendamento" className="text-sm text-cnh-primary hover:text-cnh-primary-dark font-medium flex items-center gap-1">
                        Ver todas <ArrowRight size={14} />
                    </Link>
                </div>

                {proximasAulas.length > 0 ? (
                    <div className="space-y-3 stagger-fade-in">
                        {proximasAulas.slice(0, 4).map((aula) => (
                            <Card key={aula.id} className="p-4 rounded-xl border border-cnh-border card-hover">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-xl bg-cnh-primary/10 flex items-center justify-center shrink-0">
                                            <span className="text-lg">📅</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-cnh-text-primary">
                                                {new Date(aula.data).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                                                {' '}às{' '}
                                                {new Date(aula.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <p className="text-xs text-cnh-text-muted mt-0.5">
                                                {aula.quantidadeHoras}h de aula prática
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-cnh-primary bg-cnh-primary/10 px-2.5 py-1 rounded-full">
                                        Agendada
                                    </span>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-8 rounded-xl border border-cnh-border text-center">
                        <div className="text-4xl mb-3">📅</div>
                        <p className="text-cnh-text-secondary font-medium mb-1">Nenhuma aula agendada</p>
                        <p className="text-sm text-cnh-text-muted mb-4">Agende sua primeira aula prática!</p>
                        <Link href="/agendamento">
                            <Button className="bg-cnh-primary hover:bg-cnh-primary-dark text-white btn-press">
                                Agendar Aula
                            </Button>
                        </Link>
                    </Card>
                )}
            </section>

            {/* ───── Histórico de Aulas ───── */}
            {aulas.filter(a => a.realizada).length > 0 && (
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 size={18} className="text-cnh-success" />
                        <h2 className="text-lg font-bold text-cnh-text-primary">Aulas Concluídas</h2>
                        <span className="text-xs bg-cnh-success/10 text-cnh-success font-semibold px-2 py-0.5 rounded-full">
                            {aulas.filter(a => a.realizada).length}
                        </span>
                    </div>
                    <div className="space-y-3">
                        {aulas.filter(a => a.realizada).slice(0, 3).map((aula) => (
                            <Card key={aula.id} className="p-4 rounded-xl border border-cnh-border bg-cnh-bg-base/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-xl bg-cnh-success/10 flex items-center justify-center shrink-0">
                                            <CheckCircle2 size={18} className="text-cnh-success" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-cnh-text-secondary">
                                                {new Date(aula.data).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                                                {' '}às{' '}
                                                {new Date(aula.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <p className="text-xs text-cnh-text-muted mt-0.5">{aula.quantidadeHoras}h de aula</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-cnh-success bg-cnh-success/10 px-2.5 py-1 rounded-full">
                                        ✓ Finalizada
                                    </span>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* ───── Seu Progresso ───── */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Trophy size={18} className="text-cnh-primary" />
                    <h2 className="text-lg font-bold text-cnh-text-primary">Seu Progresso</h2>
                </div>
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

                    <Card className="p-6 rounded-xl border border-cnh-border flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm text-cnh-text-secondary font-medium mb-3">Resumo do Progresso</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-cnh-success/10 flex items-center justify-center">
                                        <CheckCircle2 size={14} className="text-cnh-success" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-cnh-text-primary">Aulas Realizadas</p>
                                        <p className="text-xs text-cnh-text-muted">{aulasRealizadas} concluídas</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-cnh-primary/10 flex items-center justify-center">
                                        <Calendar size={14} className="text-cnh-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-cnh-text-primary">Aulas Agendadas</p>
                                        <p className="text-xs text-cnh-text-muted">{proximasAulas.length} pendentes</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-cnh-warning/10 flex items-center justify-center">
                                        <Clock size={14} className="text-cnh-warning" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-cnh-text-primary">Horas Restantes</p>
                                        <p className="text-xs text-cnh-text-muted">{horasRestantes}h estimadas</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {porcentagem >= 50 && (
                            <p className="text-xs text-cnh-success font-medium mt-4 flex items-center gap-1">
                                <Star size={12} className="fill-cnh-success" /> Você está no caminho certo!
                            </p>
                        )}
                    </Card>
                </div>
            </section>

            {/* ───── Tipos de Aula ───── */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <BookOpen size={18} className="text-cnh-primary" />
                    <h2 className="text-lg font-bold text-cnh-text-primary">Tipos de Aula Disponíveis</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-fade-in">
                    {tiposAula.map((tipo) => (
                        <Link key={tipo.tipo} href={`/agendamento?tipo=${tipo.tipo}`}>
                            <Card className={`p-4 rounded-xl border card-hover cursor-pointer text-center h-full ${tipo.cor}`}>
                                <span className="text-3xl block mb-2">{tipo.emoji}</span>
                                <h3 className="text-sm font-semibold text-cnh-text-primary mb-0.5">{tipo.label}</h3>
                                <p className="text-xs text-cnh-text-muted">{tipo.duracao}</p>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ───── Instrutores ───── */}
            {instrutores.length > 0 && (
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Star size={18} className="text-cnh-warning" />
                        <h2 className="text-lg font-bold text-cnh-text-primary">Instrutores Mais Avaliados</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-fade-in">
                        {instrutores.map((inst) => (
                            <Link key={inst.usuario.id} href={`/agendamento?instrutor=${inst.usuario.id}`}>
                                <Card className="p-4 rounded-xl border border-cnh-border card-hover cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full gradient-avatar flex items-center justify-center text-white font-semibold text-lg shrink-0 shadow-md">
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
            )}

            {/* ───── Card Motivacional ───── */}
            <Card className="p-6 rounded-2xl gradient-hero text-white border-0 overflow-hidden relative">
                <div className="absolute top-2 right-4 w-32 h-32 opacity-[0.07] pointer-events-none">
                    <span className="text-[80px]">💡</span>
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Lightbulb size={18} className="text-cnh-accent" />
                        <h3 className="font-bold text-lg">Dica Importante</h3>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed max-w-xl">
                        Pratique regularmente para fixar os conceitos. Recomendamos pelo menos 2 aulas por semana
                        para um aprendizado mais eficiente e preparação adequada para o exame prático.
                    </p>
                    <Link href="/agendamento">
                        <Button size="sm" className="mt-4 bg-cnh-accent hover:bg-cnh-accent-dark text-cnh-text-primary font-semibold btn-press">
                            Agendar Agora
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}
