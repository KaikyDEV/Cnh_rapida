'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/shared/StatusBadge';
import { instrutorService, AulaHistoricoItem } from '@/services/instrutorService';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Search, Calendar as CalendarIcon, Filter } from 'lucide-react';
import Link from 'next/link';

function getStatusForBadge(status: AulaHistoricoItem['status']): 'Agendada' | 'Realizada' | 'Cancelada' {
    if (status === 'Concluída') return 'Realizada';
    return status;
}

export default function TodasAulasInstrutorPage() {
    const { usuario } = useAuth();
    const [aulas, setAulas] = useState<AulaHistoricoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroStatus, setFiltroStatus] = useState<string>('Todos');
    const [termoPesquisa, setTermoPesquisa] = useState('');

    useEffect(() => {
        async function fetchTodasAulas() {
            if (!usuario) return;
            try {
                setLoading(true);
                const data = await instrutorService.buscarTodasAulas(usuario.id);
                setAulas(data);
            } catch (error) {
                console.error('Erro ao carregar histórico de aulas:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchTodasAulas();
    }, [usuario]);

    const aulasFiltradas = aulas.filter((aula) => {
        const matchStatus = filtroStatus === 'Todos' || aula.status === filtroStatus;
        const matchPesquisa = aula.nomeAluno.toLowerCase().includes(termoPesquisa.toLowerCase()) || 
                              aula.tipoAula.toLowerCase().includes(termoPesquisa.toLowerCase());
        return matchStatus && matchPesquisa;
    });

    const statusOptions = ['Todos', 'Agendada', 'Concluída', 'Cancelada'];

    return (
        <div className="max-w-6xl mx-auto animate-fade-in-up pb-10">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/instrutor">
                    <Button variant="ghost" size="icon" className="text-cnh-text-secondary hover:text-cnh-primary">
                        <ArrowLeft size={20} />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-cnh-text-primary flex items-center gap-2">
                        <CalendarIcon className="text-cnh-primary" /> Histórico de Aulas
                    </h1>
                    <p className="text-sm text-cnh-text-secondary">Visualize todas as aulas ministradas ou agendadas.</p>
                </div>
            </div>

            <Card className="p-6 rounded-xl border border-cnh-border mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                     {/* Search */}
                     <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cnh-text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por aluno ou tipo de aula..."
                            className="w-full pl-10 pr-4 py-2 border border-cnh-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cnh-primary/20 focus:border-cnh-primary text-sm"
                            value={termoPesquisa}
                            onChange={(e) => setTermoPesquisa(e.target.value)}
                        />
                    </div>
                    
                    {/* Filters */}
                    <div className="flex items-center gap-2 self-start md:self-auto overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                        <span className="text-sm text-cnh-text-secondary flex items-center gap-1 font-medium mr-2">
                            <Filter size={16} /> Status:
                        </span>
                        {statusOptions.map((status) => (
                            <button
                                key={status}
                                onClick={() => setFiltroStatus(status)}
                                className={`
                                    px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors
                                    ${filtroStatus === status 
                                        ? 'bg-cnh-primary text-white' 
                                        : 'bg-cnh-bg-base text-cnh-text-secondary hover:bg-gray-200'}
                                `}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-3 border-cnh-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : aulasFiltradas.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-cnh-border">
                                    <th className="pb-3 px-4 font-semibold text-cnh-text-secondary text-sm">Data</th>
                                    <th className="pb-3 px-4 font-semibold text-cnh-text-secondary text-sm">Horário</th>
                                    <th className="pb-3 px-4 font-semibold text-cnh-text-secondary text-sm">Aluno</th>
                                    <th className="pb-3 px-4 font-semibold text-cnh-text-secondary text-sm">Tipo de Aula</th>
                                    <th className="pb-3 px-4 font-semibold text-cnh-text-secondary text-sm">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {aulasFiltradas.map((aula) => (
                                    <tr key={aula.id} className="border-b border-cnh-border last:border-0 hover:bg-cnh-bg-base/50 transition-colors">
                                        <td className="py-4 px-4 text-sm font-medium text-cnh-text-primary whitespace-nowrap">
                                            {aula.dataFormatada}
                                        </td>
                                        <td className="py-4 px-4 text-sm text-cnh-text-secondary font-medium whitespace-nowrap">
                                            {aula.horario}
                                        </td>
                                        <td className="py-4 px-4 text-sm font-semibold text-cnh-text-primary">
                                            {aula.nomeAluno}
                                        </td>
                                        <td className="py-4 px-4 text-sm text-cnh-text-secondary">
                                            {aula.tipoAula}
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <StatusBadge status={getStatusForBadge(aula.status)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-4xl mb-3 text-cnh-text-muted">📭</div>
                        <p className="text-cnh-text-secondary font-medium mb-1">Nenhuma aula encontrada</p>
                        <p className="text-sm text-cnh-text-muted">Não há registros correspondentes aos filtros atuais.</p>
                        <Button 
                            variant="link" 
                            className="mt-2 text-cnh-primary"
                            onClick={() => { setFiltroStatus('Todos'); setTermoPesquisa(''); }}
                        >
                            Limpar Filtros
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
}
