'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, BookOpen, Trophy, Clock, Users, Ban, Star } from 'lucide-react';
import Link from 'next/link';
import { mockAulasPraticas } from '@/mocks/aulasPraticas';

export default function HomePage() {
    const { usuario } = useAuth();

    if (!usuario) return null;

    const isAluno = usuario.role === 'Aluno';

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up">
            {/* Greeting */}
            <div>
                <h1 className="text-2xl font-bold text-cnh-text-primary">
                    Olá, {usuario.nomeCompleto.split(' ')[0]}! {isAluno ? '👋' : '🚗'}
                </h1>
                <p className="text-cnh-text-secondary mt-1">
                    {isAluno
                        ? 'Bem-vindo ao seu painel de estudos.'
                        : 'Gerencie sua agenda e acompanhe seus alunos.'
                    }
                </p>
            </div>

            {isAluno ? <AlunoDashboard /> : <InstrutorDashboardHome />}
        </div>
    );
}

function AlunoDashboard() {
    const aulasRealizadas = mockAulasPraticas.filter(a => a.realizada).length;
    const totalAulas = 25;
    const proximaAula = mockAulasPraticas.find(a => !a.realizada);

    return (
        <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Aulas Concluídas */}
                <Card className="p-5 rounded-xl border border-cnh-border card-hover">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-cnh-primary/10 flex items-center justify-center">
                            <Trophy size={20} className="text-cnh-primary" />
                        </div>
                        <span className="text-sm text-cnh-text-secondary font-medium">Aulas Concluídas</span>
                    </div>
                    <p className="text-2xl font-bold text-cnh-text-primary">{aulasRealizadas}/{totalAulas}</p>
                    <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-cnh-primary transition-all duration-500"
                            style={{ width: `${(aulasRealizadas / totalAulas) * 100}%` }}
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
                    {proximaAula ? (
                        <>
                            <p className="text-lg font-bold text-cnh-text-primary">
                                {new Date(proximaAula.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                            </p>
                            <p className="text-sm text-cnh-text-secondary">
                                {new Date(proximaAula.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-cnh-text-muted">Nenhuma aula agendada</p>
                    )}
                </Card>

                {/* Status */}
                <Card className="p-5 rounded-xl border border-cnh-border card-hover">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-cnh-success/10 flex items-center justify-center">
                            <Clock size={20} className="text-cnh-success" />
                        </div>
                        <span className="text-sm text-cnh-text-secondary font-medium">Status</span>
                    </div>
                    <p className="text-lg font-bold text-cnh-text-primary">Em Progresso</p>
                    <p className="text-sm text-cnh-text-secondary">Categoria B</p>
                </Card>
            </div>

            {/* Como Começar */}
            <div>
                <h2 className="text-lg font-bold text-cnh-text-primary mb-4">Como Começar</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="p-5 rounded-xl border border-cnh-border card-hover">
                        <div className="w-12 h-12 rounded-xl bg-cnh-primary/10 flex items-center justify-center mb-3">
                            <span className="text-2xl">📅</span>
                        </div>
                        <h3 className="font-semibold text-cnh-text-primary mb-1">Agende suas Aulas</h3>
                        <p className="text-sm text-cnh-text-secondary mb-4">Escolha o melhor horário e instrutor para suas aulas práticas.</p>
                        <Link href="/agendamento">
                            <Button size="sm" className="bg-cnh-primary hover:bg-cnh-primary-dark text-white btn-press">
                                Agendar Agora
                            </Button>
                        </Link>
                    </Card>

                    <Card className="p-5 rounded-xl border border-cnh-border card-hover">
                        <div className="w-12 h-12 rounded-xl bg-cnh-accent/15 flex items-center justify-center mb-3">
                            <span className="text-2xl">📖</span>
                        </div>
                        <h3 className="font-semibold text-cnh-text-primary mb-1">Material de Estudo</h3>
                        <p className="text-sm text-cnh-text-secondary mb-4">Acesse materiais complementares para sua formação.</p>
                        <Button size="sm" variant="outline" className="border-cnh-border">
                            Ver Material
                        </Button>
                    </Card>

                    <Card className="p-5 rounded-xl border border-cnh-border card-hover">
                        <div className="w-12 h-12 rounded-xl bg-cnh-success/10 flex items-center justify-center mb-3">
                            <span className="text-2xl">🏆</span>
                        </div>
                        <h3 className="font-semibold text-cnh-text-primary mb-1">Acompanhe seu Progresso</h3>
                        <p className="text-sm text-cnh-text-secondary mb-4">Veja quantas aulas já realizou e o que falta.</p>
                        <Link href="/aluno">
                            <Button size="sm" variant="outline" className="border-cnh-border">
                                Ver Progresso
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>

            {/* Dica */}
            <Card className="p-5 rounded-xl bg-cnh-primary-dark text-white border-0 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                    <span className="text-[80px]">🚗</span>
                </div>
                <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-2">💡 Dica Importante</h3>
                    <p className="text-white/80 text-sm leading-relaxed max-w-xl">
                        Pratique regularmente para fixar os conceitos. Recomendamos pelo menos 2 aulas por semana
                        para um aprendizado mais eficiente e preparação adequada para o exame prático.
                    </p>
                    <Button size="sm" className="mt-4 bg-cnh-accent hover:bg-cnh-accent-dark text-cnh-text-primary font-semibold btn-press">
                        Saiba Mais
                    </Button>
                </div>
            </Card>
        </>
    );
}

function InstrutorDashboardHome() {
    return (
        <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-5 rounded-xl border border-cnh-border card-hover">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-cnh-primary/10 flex items-center justify-center">
                            <Calendar size={20} className="text-cnh-primary" />
                        </div>
                        <span className="text-sm text-cnh-text-secondary font-medium">Aulas Hoje</span>
                    </div>
                    <p className="text-3xl font-bold text-cnh-text-primary">5</p>
                </Card>

                <Card className="p-5 rounded-xl border border-cnh-border card-hover">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-cnh-accent/15 flex items-center justify-center">
                            <Clock size={20} className="text-cnh-accent-dark" />
                        </div>
                        <span className="text-sm text-cnh-text-secondary font-medium">Próxima Aula</span>
                    </div>
                    <p className="text-lg font-bold text-cnh-text-primary">09:00</p>
                    <p className="text-sm text-cnh-text-secondary">Marcos Silva</p>
                </Card>

                <Card className="p-5 rounded-xl border border-cnh-border card-hover">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-cnh-warning/10 flex items-center justify-center">
                            <Star size={20} className="text-cnh-warning" />
                        </div>
                        <span className="text-sm text-cnh-text-secondary font-medium">Avaliação</span>
                    </div>
                    <p className="text-2xl font-bold text-cnh-text-primary">⭐ 4.9</p>
                </Card>
            </div>

            {/* Ferramentas */}
            <div>
                <h2 className="text-lg font-bold text-cnh-text-primary mb-4">Ferramentas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="p-5 rounded-xl border border-cnh-border card-hover">
                        <div className="w-12 h-12 rounded-xl bg-cnh-primary/10 flex items-center justify-center mb-3">
                            <span className="text-2xl">📅</span>
                        </div>
                        <h3 className="font-semibold text-cnh-text-primary mb-1">Minha Agenda</h3>
                        <p className="text-sm text-cnh-text-secondary mb-4">Veja e gerencie sua agenda de aulas.</p>
                        <Link href="/instrutor">
                            <Button size="sm" className="bg-cnh-primary hover:bg-cnh-primary-dark text-white btn-press">
                                Ver Agenda
                            </Button>
                        </Link>
                    </Card>

                    <Card className="p-5 rounded-xl border border-cnh-border card-hover">
                        <div className="w-12 h-12 rounded-xl bg-cnh-accent/15 flex items-center justify-center mb-3">
                            <span className="text-2xl">👥</span>
                        </div>
                        <h3 className="font-semibold text-cnh-text-primary mb-1">Meus Alunos</h3>
                        <p className="text-sm text-cnh-text-secondary mb-4">Acompanhe o progresso dos seus alunos.</p>
                        <Button size="sm" variant="outline" className="border-cnh-border">
                            <Users size={16} className="mr-1" />
                            Ver Alunos
                        </Button>
                    </Card>

                    <Card className="p-5 rounded-xl border border-cnh-border card-hover">
                        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-3">
                            <span className="text-2xl">🚫</span>
                        </div>
                        <h3 className="font-semibold text-cnh-text-primary mb-1">Bloquear Horário</h3>
                        <p className="text-sm text-cnh-text-secondary mb-4">Bloqueie horários para folgas ou compromissos.</p>
                        <Link href="/instrutor">
                            <Button size="sm" variant="outline" className="border-cnh-border">
                                <Ban size={16} className="mr-1" />
                                Bloquear
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </>
    );
}
