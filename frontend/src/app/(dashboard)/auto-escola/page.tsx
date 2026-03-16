'use client';

import { useAuth } from '@/hooks/useAuth';
import { 
    Users, 
    UserCheck, 
    FileText, 
    TrendingUp, 
    PlusCircle,
    Clock,
    CheckCircle2,
    Building2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { useState, useEffect } from 'react';
import { autoEscolaService } from '@/services/autoEscolaService';
import Link from 'next/link';

export default function AutoEscolaDashboard() {
    const { usuario } = useAuth();
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        totalInstrutores: 0,
        totalAlunos: 0,
        aulasHoje: 0,
        docsPendentes: 0
    });

    useEffect(() => {
        carregarMetricas();
    }, []);

    const carregarMetricas = async () => {
        try {
            setLoading(true);
            const [instrutores, alunos] = await Promise.all([
                autoEscolaService.getInstrutores(),
                autoEscolaService.getAlunos()
            ]);
            
            setMetrics({
                totalInstrutores: instrutores.length,
                totalAlunos: alunos.length,
                aulasHoje: 0, // Mockado por enquanto
                docsPendentes: instrutores.filter(i => !i.documentosAprovados).length + 
                               alunos.filter(a => !a.documentosAprovados).length
            });
        } catch (error) {
            console.error('Erro ao carregar métricas:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { label: 'Total Instrutores', value: metrics.totalInstrutores.toString(), icon: Users, color: 'text-blue-600' },
        { label: 'Alunos Ativos', value: metrics.totalAlunos.toString(), icon: UserCheck, color: 'text-green-600' },
        { label: 'Aulas Hoje', value: metrics.aulasHoje.toString(), icon: Clock, color: 'text-orange-600' },
        { label: 'Documentos Pendentes', value: metrics.docsPendentes.toString(), icon: FileText, color: 'text-red-600' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-cnh-text-primary">
                        Bem-vindo, {usuario?.nomeCompleto || 'Auto Escola'}! 🏢
                    </h1>
                    <p className="text-cnh-text-secondary">Painel de gerenciamento da sua unidade.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/auto-escola/instrutores">
                        <Button className="bg-cnh-primary hover:bg-cnh-primary-dark text-white gap-2 w-full md:w-auto">
                            <PlusCircle size={18} />
                            Novo Instrutor
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-none shadow-sm bg-white/60 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-medium text-cnh-text-muted">
                                {stat.label}
                            </CardTitle>
                            <stat.icon size={18} className={stat.color} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-cnh-text-primary">
                                {loading ? '...' : stat.value}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity Placeholder */}
                <Card className="border-none shadow-sm bg-white/60 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock size={20} className="text-cnh-primary" />
                            Atividade Recente
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-8 text-cnh-text-muted">
                            <p className="text-sm">Nenhuma atividade recente registrada.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions / Configuration */}
                <Card className="border-none shadow-sm bg-white/60 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp size={20} className="text-cnh-primary" />
                            Ações Rápidas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Link href="/auto-escola/instrutores">
                            <Button variant="outline" className="w-full h-20 flex flex-col gap-2 rounded-xl border-dashed border-2 hover:border-cnh-primary/50 hover:bg-cnh-primary/5">
                                <Users size={24} className="text-cnh-primary" />
                                <span className="text-xs font-semibold">Minha Equipe</span>
                            </Button>
                        </Link>
                        <Link href="/auto-escola/alunos">
                            <Button variant="outline" className="w-full h-20 flex flex-col gap-2 rounded-xl border-dashed border-2 hover:border-cnh-primary/50 hover:bg-cnh-primary/5">
                                <UserCheck size={24} className="text-cnh-primary" />
                                <span className="text-xs font-semibold">Meus Alunos</span>
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

