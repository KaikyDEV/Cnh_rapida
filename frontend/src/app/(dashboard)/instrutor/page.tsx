'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/shared/StatusBadge';
import { instrutorService, AgendaItem } from '@/services/instrutorService';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Settings, User, X, Star, Clock, Calendar } from 'lucide-react';
import BlockScheduleModal from '@/components/booking/BlockScheduleModal';
import Logo from '@/components/layout/Logo';

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

export default function InstrutorPage() {
    const { usuario } = useAuth();
    const [dataSelecionada, setDataSelecionada] = useState(new Date());
    const [inicioSemana, setInicioSemana] = useState(new Date());
    const [modalAberto, setModalAberto] = useState(false);
    const [agenda, setAgenda] = useState<AgendaItem[]>([]);
    const [loading, setLoading] = useState(true);

    const weekDates = getWeekDates(inicioSemana);

    useEffect(() => {
        async function fetchAgenda() {
            if (!usuario) return;
            try {
                setLoading(true);
                // Format YYYY-MM-DD
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

    return (
        <div className="max-w-6xl mx-auto animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="hidden sm:block"><Logo size="sm" /></div>
                <div className="sm:hidden" />
                <div className="flex items-center gap-2">
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
                {/* Main column — Agenda */}
                <div className="space-y-5">
                    {/* Title + date */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-cnh-text-primary">Agenda</h2>
                            <span className="text-sm text-cnh-text-secondary flex items-center gap-1">
                                <Calendar size={14} /> {dataSelecionada.toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => navegarSemana(-1)} className="h-8 px-2 text-cnh-text-secondary">
                                Anterior
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => navegarSemana(1)} className="h-8 px-2 text-cnh-text-secondary">
                                Próximo
                            </Button>
                        </div>
                    </div>

                    {/* Day selector */}
                    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                        {weekDates.map((d) => {
                            const isSelected = d.toDateString() === dataSelecionada.toDateString();
                            return (
                                <button
                                    key={d.toISOString()}
                                    onClick={() => setDataSelecionada(new Date(d))}
                                    className={`
                      flex flex-col items-center min-w-[52px] py-2 px-3 rounded-xl text-sm
                      transition-all duration-150
                      ${isSelected
                                            ? 'bg-cnh-primary text-white shadow-md'
                                            : 'bg-white text-cnh-text-secondary hover:bg-cnh-bg-base border border-cnh-border'
                                        }
                    `}
                                >
                                    <span className="text-xs font-medium">{getDayLabel(d)}</span>
                                    <span className="text-base font-bold mt-0.5">{d.getDate()}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Lesson list */}
                    <div className="space-y-3">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-8 h-8 border-3 border-cnh-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : agenda.length > 0 ? (
                            agenda.map((aula, index) => (
                                <Card key={index} className="p-4 rounded-xl border border-cnh-border card-hover">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
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
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-cnh-text-muted hover:text-cnh-primary">
                                                <User size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-cnh-text-muted hover:text-cnh-error">
                                                <X size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Card className="p-8 rounded-xl border border-cnh-border text-center">
                                <div className="text-4xl mb-3">📅</div>
                                <p className="text-cnh-text-secondary">Nenhuma aula agendada para este dia</p>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Right sidebar — Stats */}
                <div className="space-y-4">
                    {/* Profile card */}
                    <Card className="p-5 rounded-xl border border-cnh-border text-center">
                        <div className="w-16 h-16 rounded-full bg-cnh-primary-dark flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                            {usuario?.nomeCompleto.charAt(0) ?? 'I'}
                        </div>
                        <h3 className="font-bold text-cnh-text-primary">{usuario?.nomeCompleto ?? 'Instrutor'}</h3>
                        <p className="text-xs text-cnh-text-secondary mb-2">Instrutor Certificado DETRAN</p>
                        <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-cnh-primary/10 text-cnh-primary font-medium">
                            Categoria A e B
                        </span>
                        <div className="flex justify-center gap-4 mt-4 pt-3 border-t border-cnh-border">
                            <div className="text-center">
                                <p className="text-sm font-bold text-cnh-text-primary">450</p>
                                <p className="text-xs text-cnh-text-muted">Alunos</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold text-cnh-text-primary flex items-center gap-0.5 justify-center">
                                    <Star size={12} className="text-cnh-warning fill-cnh-warning" /> 4.9
                                </p>
                                <p className="text-xs text-cnh-text-muted">Avaliação</p>
                            </div>
                        </div>
                    </Card>

                    {/* Stats */}
                    <Card className="p-5 rounded-xl border border-cnh-border">
                        <h4 className="text-sm text-cnh-text-secondary font-medium mb-2">Aulas Hoje</h4>
                        <p className="text-4xl font-bold text-cnh-text-primary">{agenda.length}</p>
                    </Card>

                    <Card className="p-5 rounded-xl border border-cnh-border">
                        <h4 className="text-sm text-cnh-text-secondary font-medium mb-2">Tempo Total</h4>
                        <p className="text-2xl font-bold text-cnh-text-primary flex items-center gap-1">
                            <Clock size={20} className="text-cnh-primary" /> 5h 10min
                        </p>
                    </Card>

                    <Card className="p-5 rounded-xl border border-cnh-border">
                        <h4 className="text-sm text-cnh-text-secondary font-medium mb-3">Aulas do Dia</h4>
                        <div className="space-y-2">
                            {[
                                { tipo: 'Práticas Diurnas', qtd: 2 },
                                { tipo: 'Práticas Noturnas', qtd: 1 },
                                { tipo: 'Baliza', qtd: 1 },
                                { tipo: 'Simulado', qtd: 1 },
                            ].map((item) => (
                                <div key={item.tipo} className="flex items-center justify-between">
                                    <span className="text-sm text-cnh-text-secondary">{item.tipo}</span>
                                    <span className="text-sm font-semibold text-cnh-text-primary">{item.qtd}</span>
                                </div>
                            ))}
                        </div>
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
