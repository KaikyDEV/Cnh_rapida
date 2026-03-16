'use client';

import { useState, useEffect } from 'react';
import { autoEscolaService, InstrutorResumo } from '@/services/autoEscolaService';
import { 
    Users, 
    Plus, 
    Trash2, 
    Search, 
    Loader2, 
    ShieldCheck, 
    ShieldAlert,
    UserPlus,
    Eye,
    Calendar,
    Briefcase,
    FileText,
    Activity,
    X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function GestaoInstrutores() {
    const [instrutores, setInstrutores] = useState<InstrutorResumo[]>([]);
    const [loading, setLoading] = useState(true);
    const [buscando, setBuscando] = useState(false);
    const [identificador, setIdentificador] = useState('');
    const [perfilSelecionado, setPerfilSelecionado] = useState<any>(null);
    const [abrirModal, setAbrirModal] = useState(false);
    const [carregandoPerfil, setCarregandoPerfil] = useState(false);

    useEffect(() => {
        carregarInstrutores();
    }, []);

    const carregarInstrutores = async () => {
        try {
            setLoading(true);
            const data = await autoEscolaService.getInstrutores();
            setInstrutores(data);
        } catch (error) {
            toast.error('Erro ao carregar instrutores');
        } finally {
            setLoading(false);
        }
    };

    const handleVerPerfil = async (id: number) => {
        try {
            setCarregandoPerfil(true);
            setAbrirModal(true);
            const data = await autoEscolaService.getPerfilInstrutor(id);
            setPerfilSelecionado(data);
        } catch (error) {
            toast.error('Erro ao carregar perfil do instrutor');
            setAbrirModal(false);
        } finally {
            setCarregandoPerfil(false);
        }
    };

    const handleVincular = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identificador) return;

        try {
            setBuscando(true);
            await autoEscolaService.vincularInstrutor(identificador);
            toast.success('Instrutor vinculado com sucesso!');
            setIdentificador('');
            carregarInstrutores();
        } catch (error: any) {
            const msg = error.response?.data || 'Erro ao vincular instrutor';
            toast.error(typeof msg === 'string' ? msg : 'Erro ao vincular instrutor');
        } finally {
            setBuscando(false);
        }
    };

    const handleDesvincular = async (id: number) => {
        if (!confirm('Deseja realmente desvincular este instrutor?')) return;

        try {
            await autoEscolaService.desvincularInstrutor(id);
            toast.success('Instrutor desvinculado');
            carregarInstrutores();
        } catch (error) {
            toast.error('Erro ao desvincular instrutor');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-cnh-text-primary">Gestão de Instrutores</h1>
                    <p className="text-cnh-text-secondary">Gerencie os profissionais vinculados à sua unidade.</p>
                </div>
            </div>

            <Card className="border-none shadow-sm bg-white/60 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <UserPlus size={20} className="text-cnh-primary" />
                        Vincular Novo Instrutor
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleVincular} className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cnh-text-muted" size={18} />
                            <Input 
                                placeholder="Digite o CPF ou E-mail do instrutor" 
                                className="pl-10"
                                value={identificador}
                                onChange={(e) => setIdentificador(e.target.value)}
                            />
                        </div>
                        <Button type="submit" disabled={buscando} className="bg-cnh-primary hover:bg-cnh-primary-dark">
                            {buscando ? <Loader2 className="animate-spin" size={18} /> : 'Vincular'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white/60 backdrop-blur-sm">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-cnh-text-muted">
                            <Loader2 className="animate-spin mb-2" />
                            <p>Carregando instrutores...</p>
                        </div>
                    ) : instrutores.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-cnh-text-muted">
                            <Users size={48} className="mb-4 opacity-20" />
                            <p>Nenhum instrutor vinculado.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-cnh-background/50 text-cnh-text-muted text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Nome</th>
                                        <th className="px-6 py-4 font-semibold">E-mail</th>
                                        <th className="px-6 py-4 font-semibold text-center">Status</th>
                                        <th className="px-6 py-4 font-semibold text-center">Documentos</th>
                                        <th className="px-6 py-4 font-semibold text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-cnh-background">
                                    {instrutores.map((instrutor) => (
                                        <tr key={instrutor.id} className="hover:bg-cnh-background/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-cnh-text-primary">{instrutor.nomeCompleto}</td>
                                            <td className="px-6 py-4 text-cnh-text-secondary">{instrutor.email}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                        instrutor.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {instrutor.ativo ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    {instrutor.documentosAprovados ? (
                                                        <ShieldCheck className="text-green-500" size={20} />
                                                    ) : (
                                                        <ShieldAlert className="text-orange-500" size={20} />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="text-cnh-primary hover:text-cnh-primary-dark hover:bg-cnh-primary/10"
                                                        onClick={() => handleVerPerfil(instrutor.id)}
                                                    >
                                                        <Eye size={18} />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleDesvincular(instrutor.id)}
                                                    >
                                                        <Trash2 size={18} />
                                                    </Button>
                                                </div>
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
                            <Users className="text-cnh-primary" />
                            Perfil do Instrutor
                        </DialogTitle>
                    </DialogHeader>

                    {carregandoPerfil ? (
                        <div className="py-20 flex flex-col items-center justify-center text-cnh-text-muted">
                            <Loader2 className="animate-spin mb-4 text-cnh-primary" size={32} />
                            <p className="animate-pulse">Buscando dados detalhados...</p>
                        </div>
                    ) : perfilSelecionado ? (
                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-4 p-4 bg-cnh-background/30 rounded-2xl">
                                <div className="w-16 h-16 rounded-2xl bg-cnh-primary/10 flex items-center justify-center text-cnh-primary text-2xl font-bold">
                                    {perfilSelecionado.nomeCompleto.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-cnh-text-primary leading-tight">
                                        {perfilSelecionado.nomeCompleto}
                                    </h3>
                                    <p className="text-sm text-cnh-text-secondary">{perfilSelecionado.email}</p>
                                    <div className="mt-1 flex gap-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                            perfilSelecionado.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {perfilSelecionado.ativo ? 'Ativo' : 'Suspenso'}
                                        </span>
                                        {perfilSelecionado.documentosAprovados && (
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold uppercase">
                                                Verificado
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <InfoItem icon={<FileText size={16}/>} label="CNH" value={perfilSelecionado.cnh} />
                                <InfoItem icon={<Activity size={16}/>} label="Categoria" value={perfilSelecionado.categoria} />
                                <InfoItem icon={<ShieldCheck size={16}/>} label="Registro DETRAN" value={perfilSelecionado.registroDetran} />
                                <InfoItem icon={<Calendar size={16}/>} label="Vencimento CNH" value={formatDate(perfilSelecionado.dataValidadeCnh)} />
                                <InfoItem icon={<Briefcase size={16}/>} label="Contratação" value={formatDate(perfilSelecionado.dataContratacao)} />
                                <InfoItem icon={<Users size={16}/>} label="Telefone" value={perfilSelecionado.telefone || 'Não informado'} />
                            </div>

                            {perfilSelecionado.observacoes && (
                                <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl">
                                    <h4 className="text-xs font-bold text-orange-800 uppercase mb-1 flex items-center gap-1">
                                        <FileText size={12} />
                                        Observações
                                    </h4>
                                    <p className="text-sm text-orange-900/80 leading-relaxed">
                                        {perfilSelecionado.observacoes}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end pt-4">
                                <Button 
                                    onClick={() => setAbrirModal(false)}
                                    className="bg-cnh-primary hover:bg-cnh-primary-dark w-full sm:w-auto px-8"
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

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="p-3 bg-white border border-cnh-background rounded-xl shadow-sm">
            <div className="flex items-center gap-2 text-cnh-text-muted mb-1">
                {icon}
                <span className="text-[10px] font-bold uppercase track-wider">{label}</span>
            </div>
            <p className="text-sm font-semibold text-cnh-text-primary">{value}</p>
        </div>
    );
}
