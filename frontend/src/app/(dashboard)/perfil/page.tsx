'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Calendar, MapPin, Building2, ShieldCheck, ShieldAlert, Activity, Users, BookOpen } from 'lucide-react';
import { alunoService, AulaPraticaResponse } from '@/services/alunoService';
import { autoEscolaService } from '@/services/autoEscolaService';
import { AlunoCnhStatus } from '@/types';

export default function PerfilPage() {
    const { usuario } = useAuth();
    const [status, setStatus] = useState<AlunoCnhStatus | null>(null);
    const [aulas, setAulas] = useState<AulaPraticaResponse[]>([]);
    const [perfilEscola, setPerfilEscola] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!usuario) return;

        async function fetchData() {
            try {
                if (usuario!.role === 'Aluno') {
                    const [statusData, aulasData] = await Promise.all([
                        alunoService.buscarStatus(),
                        alunoService.buscarMinhasAulas(),
                    ]);
                    setStatus(statusData);
                    setAulas(aulasData);
                } else if (usuario!.role === 'AutoEscola') {
                    const data = await autoEscolaService.getPerfil();
                    setPerfilEscola(data);
                }
            } catch (error) {
                console.error('Erro ao carregar perfil:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [usuario]);

    if (!usuario) return null;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-3 border-cnh-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (usuario.role === 'AutoEscola') {
        return <PerfilAutoEscola usuario={usuario} perfil={perfilEscola} />;
    }

    if (usuario.role === 'Instrutor') {
        return <PerfilInstrutor usuario={usuario} />;
    }

    // Default: Aluno
    return <PerfilAluno usuario={usuario} status={status} aulas={aulas} />;
}

// ===================================================================
// PERFIL ALUNO
// ===================================================================
function PerfilAluno({ usuario, status, aulas }: { usuario: any, status: any, aulas: any[] }) {
    const aulasRealizadas = aulas.filter(a => a.realizada || a.concluida).length;

    const steps = [
        { label: 'Conta Gov.br', done: status?.possuiContaGov },
        { label: 'Processo DETRAN', done: status?.processoIniciadoDetran },
        { label: 'Exames Enviados', done: status?.examesEnviados },
        { label: 'Docs Aprovados', done: status?.documentosAprovados },
        { label: 'Exame Médico', done: status?.exameMedicoAprovado },
        { label: 'Exame Teórico', done: status?.exameTeoricoAprovado },
        { label: 'Aulas Práticas', done: status?.aulasPraticasIniciadas },
    ];

    const totalDone = steps.filter(s => s.done).length;
    const progress = Math.round((totalDone / steps.length) * 100);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                {/* Identity Card */}
                <Card className="p-6 rounded-xl border border-cnh-border text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-cnh-primary/10 flex items-center justify-center text-cnh-primary font-bold text-2xl mx-auto">
                        {usuario.nomeCompleto.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-cnh-text-primary">{usuario.nomeCompleto}</h2>
                        <Badge className="mt-1 bg-cnh-primary/10 text-cnh-primary">Aluno</Badge>
                    </div>
                    <div className="space-y-2 text-left text-sm">
                        <div className="flex items-center gap-2 text-cnh-text-secondary">
                            <Mail size={15} className="text-cnh-text-muted shrink-0" />
                            <span className="truncate">{usuario.email}</span>
                        </div>
                        {usuario.phoneNumber && (
                            <div className="flex items-center gap-2 text-cnh-text-secondary">
                                <Phone size={15} className="text-cnh-text-muted shrink-0" />
                                <span>{usuario.phoneNumber}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-cnh-text-secondary">
                            <Calendar size={15} className="text-cnh-text-muted shrink-0" />
                            <span>Cadastro: {new Date(usuario.dataCriacao).toLocaleDateString('pt-BR')}</span>
                        </div>
                    </div>
                    {status?.autoEscolaNome && (
                        <div className="text-xs text-center px-3 py-2 bg-cnh-background rounded-lg text-cnh-text-secondary">
                            <Building2 size={12} className="inline mr-1" />
                            {status.autoEscolaNome}
                        </div>
                    )}
                </Card>

                {/* Progress */}
                <Card className="p-6 rounded-xl border border-cnh-border space-y-5">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-cnh-text-primary flex items-center gap-2">
                            <Activity size={18} className="text-cnh-primary" />
                            Progresso CNH
                        </h3>
                        <span className="text-sm font-bold text-cnh-primary">{progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-cnh-background rounded-full overflow-hidden">
                        <div
                            className="h-full bg-cnh-primary rounded-full transition-all duration-700"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        {steps.map((step) => (
                            <div key={step.label}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm ${step.done
                                    ? 'bg-green-50 border-green-100 text-green-800'
                                    : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
                                {step.done
                                    ? <ShieldCheck size={16} className="text-green-500 shrink-0" />
                                    : <ShieldAlert size={16} className="text-gray-400 shrink-0" />}
                                {step.label}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Aulas */}
            <Card className="p-6 rounded-xl border border-cnh-border">
                <h3 className="font-bold text-cnh-text-primary flex items-center gap-2 mb-4">
                    <BookOpen size={18} className="text-cnh-primary" />
                    Aulas Práticas — {aulasRealizadas} realizadas
                </h3>
                {aulas.length === 0 ? (
                    <p className="text-cnh-text-muted text-sm text-center py-6">Nenhuma aula agendada ainda.</p>
                ) : (
                    <div className="divide-y divide-cnh-background">
                        {aulas.map((aula: any) => (
                            <div key={aula.id} className="flex items-center justify-between py-3">
                                <div className="text-sm">
                                    <p className="font-medium text-cnh-text-primary">
                                        {new Date(aula.data || aula.dataHora).toLocaleDateString('pt-BR')}
                                    </p>
                                    <p className="text-cnh-text-muted">{aula.quantidadeHoras}h</p>
                                </div>
                                <Badge className={aula.realizada || aula.concluida
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'}>
                                    {aula.realizada || aula.concluida ? 'Realizada' : 'Agendada'}
                                </Badge>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}

// ===================================================================
// PERFIL AUTO ESCOLA
// ===================================================================
function PerfilAutoEscola({ usuario, perfil }: { usuario: any, perfil: any }) {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                {/* Identity */}
                <Card className="p-6 rounded-xl border border-cnh-border text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl mx-auto">
                        {(perfil?.nomeFantasia || usuario.nomeCompleto).charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-cnh-text-primary">
                            {perfil?.nomeFantasia || usuario.nomeCompleto}
                        </h2>
                        <Badge className="mt-1 bg-blue-100 text-blue-700">Auto Escola</Badge>
                    </div>
                    <div className="space-y-2 text-left text-sm">
                        <div className="flex items-center gap-2 text-cnh-text-secondary">
                            <Mail size={15} className="text-cnh-text-muted shrink-0" />
                            <span className="truncate">{usuario.email}</span>
                        </div>
                        {perfil?.cidade && (
                            <div className="flex items-center gap-2 text-cnh-text-secondary">
                                <MapPin size={15} className="text-cnh-text-muted shrink-0" />
                                <span>{perfil.cidade}</span>
                            </div>
                        )}
                        {perfil?.endereco && (
                            <div className="flex items-start gap-2 text-cnh-text-secondary">
                                <Building2 size={15} className="text-cnh-text-muted shrink-0 mt-0.5" />
                                <span>{perfil.endereco}</span>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Dados da Escola */}
                <Card className="p-6 rounded-xl border border-cnh-border space-y-5">
                    <h3 className="font-bold text-cnh-text-primary flex items-center gap-2">
                        <Building2 size={18} className="text-cnh-primary" />
                        Dados da Auto Escola
                    </h3>
                    {perfil ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoItem label="CNPJ" value={perfil.cnpj || '—'} />
                            <InfoItem label="Cidade" value={perfil.cidade || '—'} />
                            <InfoItem label="Endereço" value={perfil.endereco || '—'} />
                            <InfoItem label="Status Documentos"
                                value={perfil.documentosAprovados ? 'Aprovados ✅' : 'Pendente ⏳'} />
                        </div>
                    ) : (
                        <p className="text-cnh-text-muted text-sm">Carregando dados...</p>
                    )}

                    <div className={`mt-4 px-4 py-3 rounded-xl flex items-center gap-3 ${perfil?.documentosAprovados
                        ? 'bg-green-50 border border-green-100'
                        : 'bg-yellow-50 border border-yellow-100'}`}>
                        {perfil?.documentosAprovados
                            ? <ShieldCheck className="text-green-500" size={20} />
                            : <ShieldAlert className="text-yellow-500" size={20} />}
                        <p className="text-sm font-medium">
                            {perfil?.documentosAprovados
                                ? 'Todos os documentos foram aprovados. Sua conta está ativa!'
                                : 'Seus documentos ainda estão em análise. Aguarde a aprovação.'}
                        </p>
                    </div>
                </Card>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="p-5 rounded-xl border border-cnh-border flex items-center gap-4">
                    <div className="w-12 h-12 bg-cnh-primary/10 rounded-xl flex items-center justify-center">
                        <Users size={22} className="text-cnh-primary" />
                    </div>
                    <div>
                        <p className="font-semibold text-cnh-text-primary">Gerenciar Alunos</p>
                        <p className="text-xs text-cnh-text-muted">Vincule e acompanhe seus alunos</p>
                    </div>
                </Card>
                <Card className="p-5 rounded-xl border border-cnh-border flex items-center gap-4">
                    <div className="w-12 h-12 bg-cnh-primary/10 rounded-xl flex items-center justify-center">
                        <Activity size={22} className="text-cnh-primary" />
                    </div>
                    <div>
                        <p className="font-semibold text-cnh-text-primary">Gerenciar Instrutores</p>
                        <p className="text-xs text-cnh-text-muted">Vincule e gerencie sua equipe</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}

// ===================================================================
// PERFIL INSTRUTOR
// ===================================================================
function PerfilInstrutor({ usuario }: { usuario: any }) {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                <Card className="p-6 rounded-xl border border-cnh-border text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-2xl mx-auto">
                        {usuario.nomeCompleto.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-cnh-text-primary">{usuario.nomeCompleto}</h2>
                        <Badge className="mt-1 bg-purple-100 text-purple-700">Instrutor</Badge>
                    </div>
                    <div className="space-y-2 text-left text-sm">
                        <div className="flex items-center gap-2 text-cnh-text-secondary">
                            <Mail size={15} className="text-cnh-text-muted shrink-0" />
                            <span className="truncate">{usuario.email}</span>
                        </div>
                        {usuario.phoneNumber && (
                            <div className="flex items-center gap-2 text-cnh-text-secondary">
                                <Phone size={15} className="text-cnh-text-muted shrink-0" />
                                <span>{usuario.phoneNumber}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-cnh-text-secondary">
                            <Calendar size={15} className="text-cnh-text-muted shrink-0" />
                            <span>Cadastro: {new Date(usuario.dataCriacao).toLocaleDateString('pt-BR')}</span>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 rounded-xl border border-cnh-border flex items-center justify-center">
                    <div className="text-center text-cnh-text-muted">
                        <Activity size={40} className="mx-auto mb-3 opacity-20" />
                        <p className="text-sm">Informações detalhadas disponíveis na sua auto escola.</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}

// Componente auxiliar
function InfoItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="p-3 bg-cnh-background/50 rounded-xl">
            <p className="text-[10px] font-bold uppercase text-cnh-text-muted mb-1">{label}</p>
            <p className="text-sm font-semibold text-cnh-text-primary">{value}</p>
        </div>
    );
}
