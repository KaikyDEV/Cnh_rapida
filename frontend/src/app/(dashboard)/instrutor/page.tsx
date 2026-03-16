'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/shared/StatusBadge';
import { instrutorService, AgendaItem } from '@/services/instrutorService';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Settings, X, Star, Clock, Calendar, Check, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import BlockScheduleModal from '@/components/booking/BlockScheduleModal';
import Link from 'next/link';

// Emoji por tipo de aula
const tipoAulaEmoji: Record<string, string> = {
    'Prática Diurna': '🚗',
    'Prática Noturna': '🌙',
    'Diurna': '🚗',
    'Noturna': '🌙',
    'Baliza': '🅿️',
    'Simulado': '🎯',
};

function getEmoji(tipo: string): string {
    const key = Object.keys(tipoAulaEmoji).find(k => tipo.toLowerCase().includes(k.toLowerCase()));
    return key ? tipoAulaEmoji[key] : '📚';
}

// Helper to get day name
const getDayLabel = (date: Date) => {
    const labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return labels[date.getDay()];
};

// Helper to get week dates
const getWeekDates = (startDate: Date) => {
    const dates = [];
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay()); // Start at Sunday

    for (let i = 0; i < 7; i++) {
        dates.push(new Date(start));
        start.setDate(start.getDate() + 1);
    }
    return dates;
};

function getStatusForBadge(status: AgendaItem['status']): 'Agendada' | 'Realizada' | 'Cancelada' {
    if (status === 'Concluída') return 'Realizada';
    return status;
}

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
}

export default function InstrutorPage() {
    const { usuario } = useAuth();
    const [dataSelecionada, setDataSelecionada] = useState(new Date());
    const [inicioSemana, setInicioSemana] = useState(new Date());
    const [modalAberto, setModalAberto] = useState(false);
    const [agenda, setAgenda] = useState<AgendaItem[]>([]);
    const [loading, setLoading] = useState(true);

    const weekDates = getWeekDates(inicioSemana);
    const firstName = usuario?.nomeCompleto?.split(' ')[0] ?? 'Instrutor';

    useEffect(() => {
        async function fetchAgenda() {
            if (!usuario) return;
            try {
                setLoading(true);
                const year = dataSelecionada.getFullYear();
                const month = (dataSelecionada.getMonth() + 1).toString().padStart(2, '0');
                const day = dataSelecionada.getDate().toString().padStart(2, '0');

                const dataStr = `${year}-${month}-${day}`;
                const data = await instrutorService.buscarAgenda(usuario.id, dataStr);
                setAgenda(data);
            } catch (error) {
                console.error('Erro ao carregar agenda:', error);
                setAgenda([]);
            } finally {
                setLoading(false);
            }
        }
        fetchAgenda();
    }, [usuario, dataSelecionada]);

    const navegarSemana = (offset: number) => {
        const novaData = new Date(inicioSemana);
        novaData.setDate(novaData.getDate() + (offset * 7));
        setInicioSemana(novaData);
    };

    const handleConcluirAula = async (aulaId: number) => {
        try {
            await instrutorService.concluirAula(aulaId);
            setAgenda(agenda.map(a => a.id === aulaId ? { ...a, status: 'Concluída' } : a));
        } catch (error) {
            console.error('Erro ao concluir aula:', error);
            alert('Não foi possível concluir a aula.');
        }
    };

    const handleCancelarAula = async (aulaId: number) => {
        if (!confirm('Tem certeza que deseja cancelar esta aula?')) return;
        try {
            await instrutorService.cancelarAula(aulaId);
            setAgenda(agenda.filter(a => a.id !== aulaId));
        } catch (error) {
            console.error('Erro ao cancelar aula:', error);
            alert('Não foi possível cancelar a aula.');
        }
    };

    // Dynamic stats from the actual agenda
    const stats = useMemo(() => {
        const aulasAgendadas = agenda.filter(a => a.status === 'Agendada').length;
        const aulasConcluidas = agenda.filter(a => a.status === 'Concluída').length;
        // Estimate 50min per lesson
        const tempoTotalMin = agenda.length * 50;
        const horas = Math.floor(tempoTotalMin / 60);
        const minutos = tempoTotalMin % 60;

        // Breakdown by type
        const breakdown: Record<string, number> = {};
        agenda.forEach(a => {
            const tipo = a.tipoAula || 'Outros';
            breakdown[tipo] = (breakdown[tipo] || 0) + 1;
        });

        return { aulasAgendadas, aulasConcluidas, horas, minutos, breakdown };
    }, [agenda]);

    const isToday = dataSelecionada.toDateString() === new Date().toDateString();

    return (
        <div className="max-w-6xl mx-auto animate-fade-in-up">
            {/* ───── Header with greeting ───── */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-cnh-text-primary">
                        {getGreeting()}, {firstName}! 🚗
                    </h1>
                    <p className="text-sm text-cnh-text-secondary mt-0.5">
                        Gerencie sua agenda e acompanhe seus alunos.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/instrutor/aulas">
                        <Button
                            variant="outline"
                            className="bg-white border-cnh-border text-cnh-text-primary hover:bg-cnh-bg-base"
                            size="sm"
                        >
                            Ver Histórico
                        </Button>
                    </Link>
                    <Button
                        onClick={() => setModalAberto(true)}
                        className="bg-cnh-primary hover:bg-cnh-primary-dark text-white btn-press"
                        size="sm"
                    >
                        <Plus size={16} className="mr-1" />
                        Bloquear Horário
                    </Button>
                    <Button variant="ghost" size="icon" className="text-cnh-text-secondary">
                        <Settings size={18} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
                {/* ═══════ Main column — Agenda ═══════ */}
                <div className="space-y-5">
                    {/* Title + date */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Calendar size={18} className="text-cnh-primary" />
                            <h2 className="text-lg font-bold text-cnh-text-primary">Agenda</h2>
                            <span className="text-sm text-cnh-text-secondary flex items-center gap-1">
                                {isToday ? (
                                    <span className="text-xs bg-cnh-primary/10 text-cnh-primary font-semibold px-2 py-0.5 rounded-full">Hoje</span>
                                ) : (
                                    dataSelecionada.toLocaleDateString('pt-BR')
                                )}
                            </span>
                            {agenda.length > 0 && (
                                <span className="text-xs bg-cnh-primary/10 text-cnh-primary font-semibold px-2 py-0.5 rounded-full">
                                    {agenda.length} aula{agenda.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => navegarSemana(-1)} className="h-8 w-8 text-cnh-text-secondary">
                                <ChevronLeft size={18} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => navegarSemana(1)} className="h-8 w-8 text-cnh-text-secondary">
                                <ChevronRight size={18} />
                            </Button>
                        </div>
                    </div>

                    {/* Day selector */}
                    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                        {weekDates.map((d) => {
                            const isSelected = d.toDateString() === dataSelecionada.toDateString();
                            const isDayToday = d.toDateString() === new Date().toDateString();
                            return (
                                <button
                                    key={d.toISOString()}
                                    onClick={() => setDataSelecionada(new Date(d))}
                                    className={`
                                        flex flex-col items-center min-w-[52px] py-2 px-3 rounded-xl text-sm
                                        transition-all duration-150 relative
                                        ${isSelected
                                            ? 'bg-cnh-primary text-white shadow-md'
                                            : isDayToday
                                                ? 'bg-cnh-primary/10 text-cnh-primary border border-cnh-primary/30'
                                                : 'bg-white text-cnh-text-secondary hover:bg-cnh-bg-base border border-cnh-border'
                                        }
                                    `}
                                >
                                    <span className="text-xs font-medium">{getDayLabel(d)}</span>
                                    <span className="text-base font-bold mt-0.5">{d.getDate()}</span>
                                    {isDayToday && !isSelected && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-cnh-primary absolute -bottom-0.5" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Lesson list */}
                    <div className="space-y-3 stagger-fade-in">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-8 h-8 border-3 border-cnh-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : agenda.length > 0 ? (
                            agenda.map((aula) => (
                                <Card key={aula.id} className="p-4 rounded-xl border border-cnh-border card-hover">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {/* Emoji icon */}
                                            <div className="w-11 h-11 rounded-xl bg-cnh-primary/10 flex items-center justify-center shrink-0">
                                                <span className="text-lg">{getEmoji(aula.tipoAula)}</span>
                                            </div>
                                            {/* Time */}
                                            <span className="text-sm font-bold text-cnh-primary min-w-[50px]">
                                                {aula.horario}
                                            </span>
                                            {/* Student name */}
                                            <div>
                                                <p className="text-sm font-semibold text-cnh-text-primary">{aula.nomeAluno}</p>
                                                <p className="text-xs text-cnh-text-muted">{aula.tipoAula}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <StatusBadge status={getStatusForBadge(aula.status)} />
                                            {aula.status === 'Agendada' && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleConcluirAula(aula.id)}
                                                        className="h-8 w-8 text-cnh-text-muted hover:text-cnh-success hover:bg-green-50"
                                                        title="Concluir Aula"
                                                    >
                                                        <Check size={16} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleCancelarAula(aula.id)}
                                                        className="h-8 w-8 text-cnh-text-muted hover:text-cnh-error hover:bg-red-50"
                                                        title="Cancelar Aula"
                                                    >
                                                        <X size={16} />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Card className="p-10 rounded-xl border border-cnh-border text-center">
                                <div className="text-5xl mb-4">📭</div>
                                <p className="text-cnh-text-secondary font-medium mb-1">Nenhuma aula agendada</p>
                                <p className="text-sm text-cnh-text-muted mb-4">
                                    {isToday
                                        ? 'Aproveite o dia livre ou bloqueie horários.'
                                        : `Não há aulas marcadas para ${dataSelecionada.toLocaleDateString('pt-BR')}.`}
                                </p>
                                <div className="flex items-center justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-cnh-border"
                                        onClick={() => setDataSelecionada(new Date())}
                                    >
                                        <Calendar size={14} className="mr-1" /> Voltar para Hoje
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-cnh-primary hover:bg-cnh-primary-dark text-white btn-press"
                                        onClick={() => setModalAberto(true)}
                                    >
                                        <Plus size={14} className="mr-1" /> Bloquear Horário
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>

                {/* ═══════ Right sidebar — Stats ═══════ */}
                <div className="space-y-4">
                    {/* Profile card */}
                    <Card className="p-5 rounded-xl border border-cnh-border text-center">
                        <div className="w-16 h-16 rounded-full gradient-avatar flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 shadow-lg">
                            {usuario?.nomeCompleto.charAt(0) ?? 'I'}
                        </div>
                        <h3 className="font-bold text-cnh-text-primary">{usuario?.nomeCompleto ?? 'Instrutor'}</h3>
                        <p className="text-xs text-cnh-text-secondary mb-2">Instrutor Certificado DETRAN</p>
                        <span className="inline-block text-xs px-2.5 py-0.5 rounded-full bg-cnh-primary/10 text-cnh-primary font-medium">
                            Categoria A e B
                        </span>
                        <div className="flex justify-center gap-6 mt-4 pt-3 border-t border-cnh-border">
                            <div className="text-center">
                                <p className="text-sm font-bold text-cnh-text-primary flex items-center gap-0.5 justify-center">
                                    <Users size={12} className="text-cnh-primary" /> {agenda.length}
                                </p>
                                <p className="text-xs text-cnh-text-muted">Hoje</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold text-cnh-text-primary flex items-center gap-0.5 justify-center">
                                    <Star size={12} className="text-cnh-warning fill-cnh-warning" /> 4.9
                                </p>
                                <p className="text-xs text-cnh-text-muted">Avaliação</p>
                            </div>
                        </div>
                    </Card>

                    {/* Aulas Hoje */}
                    <Card className="p-5 rounded-xl border border-cnh-border">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm text-cnh-text-secondary font-medium">Aulas Hoje</h4>
                            <Calendar size={16} className="text-cnh-primary" />
                        </div>
                        <p className="text-4xl font-bold text-cnh-text-primary">{agenda.length}</p>
                        {stats.aulasAgendadas > 0 && (
                            <p className="text-xs text-cnh-text-muted mt-1">
                                {stats.aulasAgendadas} agendada{stats.aulasAgendadas !== 1 ? 's' : ''}
                                {stats.aulasConcluidas > 0 && ` • ${stats.aulasConcluidas} concluída${stats.aulasConcluidas !== 1 ? 's' : ''}`}
                            </p>
                        )}
                    </Card>

                    {/* Tempo Total (dynamic) */}
                    <Card className="p-5 rounded-xl border border-cnh-border">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm text-cnh-text-secondary font-medium">Tempo Total</h4>
                            <Clock size={16} className="text-cnh-primary" />
                        </div>
                        <p className="text-2xl font-bold text-cnh-text-primary">
                            {stats.horas > 0 ? `${stats.horas}h ` : ''}{stats.minutos}min
                        </p>
                        <p className="text-xs text-cnh-text-muted mt-1">Estimativa do dia selecionado</p>
                    </Card>

                    {/* Dynamic Breakdown */}
                    <Card className="p-5 rounded-xl border border-cnh-border">
                        <h4 className="text-sm text-cnh-text-secondary font-medium mb-3">Aulas do Dia</h4>
                        {Object.keys(stats.breakdown).length > 0 ? (
                            <div className="space-y-2">
                                {Object.entries(stats.breakdown).map(([tipo, qtd]) => (
                                    <div key={tipo} className="flex items-center justify-between">
                                        <span className="text-sm text-cnh-text-secondary flex items-center gap-1.5">
                                            <span>{getEmoji(tipo)}</span> {tipo}
                                        </span>
                                        <span className="text-sm font-semibold text-cnh-text-primary">{qtd}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-cnh-text-muted">Sem aulas neste dia</p>
                        )}
                    </Card>
                </div>
            </div>

            {/* Block Schedule Modal */}
            <BlockScheduleModal
                open={modalAberto}
                onOpenChange={setModalAberto}
            />
        </div>
    );
}
