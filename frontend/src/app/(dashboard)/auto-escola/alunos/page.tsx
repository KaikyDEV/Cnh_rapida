'use client';

import { useState, useEffect } from 'react';
import { autoEscolaService, AlunoResumo } from '@/services/autoEscolaService';
import { 
    UserCheck, 
    Plus, 
    Search, 
    Loader2, 
    ShieldCheck, 
    ShieldAlert,
    UserPlus,
    Calendar,
    Eye,
    Activity,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function GestaoAlunos() {
    const [alunos, setAlunos] = useState<AlunoResumo[]>([]);
    const [loading, setLoading] = useState(true);
    const [buscando, setBuscando] = useState(false);
    const [identificador, setIdentificador] = useState('');
    const [alunoSelecionado, setAlunoSelecionado] = useState<any>(null);
    const [abrirModal, setAbrirModal] = useState(false);
    const [carregandoProgresso, setCarregandoProgresso] = useState(false);

    useEffect(() => {
        carregarAlunos();
    }, []);

    const carregarAlunos = async () => {
        try {
            setLoading(true);
            const data = await autoEscolaService.getAlunos();
            setAlunos(data);
        } catch (error) {
            toast.error('Erro ao carregar alunos');
        } finally {
            setLoading(false);
        }
    };

    const handleVerProgresso = async (id: number) => {
        try {
            setCarregandoProgresso(true);
            setAbrirModal(true);
            const data = await autoEscolaService.getProgressoAluno(id);
            setAlunoSelecionado(data);
        } catch (error) {
            toast.error('Erro ao carregar progresso do aluno');
            setAbrirModal(false);
        } finally {
            setCarregandoProgresso(false);
        }
    };

    const handleVincular = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identificador) return;

        try {
            setBuscando(true);
            await autoEscolaService.vincularAluno(identificador);
            toast.success('Aluno vinculado com sucesso!');
            setIdentificador('');
            carregarAlunos();
        } catch (error: any) {
            const msg = error.response?.data || 'Erro ao vincular aluno';
            toast.error(typeof msg === 'string' ? msg : 'Erro ao vincular aluno');
        } finally {
            setBuscando(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-cnh-text-primary">Gestão de Alunos</h1>
                    <p className="text-cnh-text-secondary">Acompanhe os futuros motoristas da sua unidade.</p>
                </div>
            </div>

            <Card className="border-none shadow-sm bg-white/60 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <UserPlus size={20} className="text-cnh-primary" />
                        Vincular Novo Aluno
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleVincular} className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cnh-text-muted" size={18} />
                            <Input 
                                placeholder="Digite o CPF ou E-mail do aluno" 
                                className="pl-10"
                                value={identificador}
                                onChange={(e) => setIdentificador(e.target.value)}
                            />
                        </div>
                        <Button type="submit" disabled={buscando} className="bg-cnh-primary hover:bg-cnh-primary-dark">
                            {buscando ? <Loader2 className="animate-spin" size={18} /> : 'Vincular Aluno'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white/60 backdrop-blur-sm">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-cnh-text-muted">
                            <Loader2 className="animate-spin mb-2" />
                            <p>Carregando alunos...</p>
                        </div>
                    ) : alunos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-cnh-text-muted">
                            <UserCheck size={48} className="mb-4 opacity-20" />
                            <p>Nenhum aluno vinculado.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-cnh-background/50 text-cnh-text-muted text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Nome</th>
                                        <th className="px-6 py-4 font-semibold">E-mail</th>
                                        <th className="px-6 py-4 font-semibold text-center">Documentos</th>
                                        <th className="px-6 py-4 font-semibold text-center">Última Atividade</th>
                                        <th className="px-6 py-4 font-semibold text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-cnh-background">
                                    {alunos.map((aluno) => (
                                        <tr key={aluno.id} className="hover:bg-cnh-background/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-cnh-text-primary">{aluno.nomeCompleto}</td>
                                            <td className="px-6 py-4 text-cnh-text-secondary">{aluno.email}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    {aluno.documentosAprovados ? (
                                                        <ShieldCheck className="text-green-500" size={20} />
                                                    ) : (
                                                        <ShieldAlert className="text-orange-500" size={20} />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-sm text-cnh-text-primary">
                                                        {new Date(aluno.ultimaAtualizacao).toLocaleDateString('pt-BR')}
                                                    </span>
                                                    <span className="text-[10px] text-cnh-text-muted">
                                                        {new Date(aluno.ultimaAtualizacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="text-cnh-primary hover:bg-cnh-primary/10 gap-2"
                                                    onClick={() => handleVerProgresso(aluno.id)}
                                                >
                                                    <Eye size={16} /> Ver Detalhes
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={abrirModal} onOpenChange={setAbrirModal}>
                <DialogContent className="sm:max-w-[500px] border-none shadow-2xl bg-white/95 backdrop-blur-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-cnh-text-primary flex items-center gap-2">
                            <Activity className="text-cnh-primary" />
                            Progresso do Aluno
                        </DialogTitle>
                    </DialogHeader>

                    {carregandoProgresso ? (
                        <div className="py-20 flex flex-col items-center justify-center text-cnh-text-muted">
                            <Loader2 className="animate-spin mb-4 text-cnh-primary" size={32} />
                            <p className="animate-pulse">Buscando dados detalhados...</p>
                        </div>
                    ) : alunoSelecionado ? (
                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-4 p-4 bg-cnh-background/30 rounded-2xl">
                                <div className="w-16 h-16 rounded-2xl bg-cnh-primary/10 flex items-center justify-center text-cnh-primary text-2xl font-bold">
                                    {alunoSelecionado.nomeCompleto.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-cnh-text-primary leading-tight">
                                        {alunoSelecionado.nomeCompleto}
                                    </h3>
                                    <p className="text-sm text-cnh-text-secondary">{alunoSelecionado.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <ProgressStep label="Conta Gov.br vinculada" done={alunoSelecionado.possuiContaGov} />
                                <ProgressStep label="Processo DETRAN iniciado" done={alunoSelecionado.processoIniciadoDetran} />
                                <ProgressStep label="Exames e Documentos Enviados" done={alunoSelecionado.examesEnviados} />
                                <ProgressStep label="Aprovação Documentos Pessoais" done={alunoSelecionado.documentosAprovados} />
                                <ProgressStep label="Exame Médico Realizado" done={alunoSelecionado.exameMedicoRealizado} />
                                <ProgressStep label="Exame Médico Aprovado" done={alunoSelecionado.exameMedicoAprovado} />
                                <ProgressStep label="Exame Teórico Realizado" done={alunoSelecionado.exameTeoricoRealizado} />
                                <ProgressStep label="Exame Teórico Aprovado" done={alunoSelecionado.exameTeoricoAprovado} />
                                <ProgressStep label="Aulas Práticas Iniciadas" done={alunoSelecionado.aulasPraticasIniciadas} />
                            </div>

                            <div className="flex justify-between items-center pt-4 text-xs text-cnh-text-muted">
                                <span>Última atualização: {new Date(alunoSelecionado.ultimaAtualizacao).toLocaleString('pt-BR')}</span>
                                <Button 
                                    onClick={() => setAbrirModal(false)}
                                    className="bg-cnh-primary hover:bg-cnh-primary-dark sm:w-auto px-8"
                                >
                                    Fechar
                                </Button>
                            </div>
                        </div>
                    ) : null}
                </DialogContent>
            </Dialog>
        </div>
    );
}

function ProgressStep({ label, done }: { label: string, done: boolean }) {
    return (
        <div className={`flex items-center gap-3 p-3 rounded-xl border ${done ? 'bg-green-50/50 border-green-100' : 'bg-gray-50 border-gray-100'} transition-colors`}>
            {done ? <CheckCircle2 className="text-green-500" size={20} /> : <Clock className="text-gray-400" size={20} />}
            <span className={`text-sm font-medium ${done ? 'text-green-800' : 'text-gray-500'}`}>{label}</span>
        </div>
    );
}

