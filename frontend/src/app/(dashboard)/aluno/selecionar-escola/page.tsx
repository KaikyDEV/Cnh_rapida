'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { autoEscolaService } from '@/services/autoEscolaService';
import { Building2, Search, MapPin, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface AutoEscolaResumo {
    id: number;
    nomeFantasia: string;
    cidade: string;
    endereco: string;
}

export default function SelecionarEscolaPage() {
    const [escolas, setEscolas] = useState<AutoEscolaResumo[]>([]);
    const [filtro, setFiltro] = useState('');
    const [loading, setLoading] = useState(true);
    const [selecionando, setSelecionando] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function loadEscolas() {
            try {
                const data = await autoEscolaService.listarTodas();
                setEscolas(data);
            } catch (error) {
                toast.error('Erro ao carregar lista de auto escolas');
            } finally {
                setLoading(false);
            }
        }
        loadEscolas();
    }, []);

    const handleSelecionar = async (id: number) => {
        setSelecionando(id);
        try {
            await autoEscolaService.selecionarEscola(id);
            toast.success('Auto escola selecionada com sucesso!');
            router.push('/aluno');
        } catch (error) {
            toast.error('Erro ao vincular auto escola');
        } finally {
            setSelecionando(null);
        }
    };

    const escolasFiltradas = escolas.filter(e => 
        e.nomeFantasia.toLowerCase().includes(filtro.toLowerCase()) ||
        e.cidade.toLowerCase().includes(filtro.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-cnh-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <header className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-cnh-text-primary">Escolha sua Auto Escola</h1>
                <p className="text-cnh-text-secondary">Selecione a unidade onde você deseja realizar suas aulas práticas.</p>
            </header>

            <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cnh-text-muted" size={18} />
                <Input 
                    placeholder="Buscar por nome ou cidade..." 
                    className="pl-10 h-12 rounded-xl border-cnh-border bg-white shadow-sm focus:ring-cnh-primary/20"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {escolasFiltradas.length > 0 ? (
                    escolasFiltradas.map((escola) => (
                        <Card key={escola.id} className="p-6 rounded-2xl border border-cnh-border transition-all hover:border-cnh-primary/30 hover:shadow-md group">
                            <div className="flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-cnh-primary/10 flex items-center justify-center text-cnh-primary">
                                        <Building2 size={24} />
                                    </div>
                                    <div className="px-2 py-1 rounded-full bg-cnh-success/10 text-cnh-success text-[10px] font-bold uppercase tracking-wider">
                                        Credenciada
                                    </div>
                                </div>
                                
                                <h3 className="text-lg font-bold text-cnh-text-primary group-hover:text-cnh-primary transition-colors">
                                    {escola.nomeFantasia}
                                </h3>
                                
                                <div className="mt-2 space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-cnh-text-secondary">
                                        <MapPin size={14} className="shrink-0" />
                                        <span>{escola.cidade}</span>
                                    </div>
                                    <p className="text-xs text-cnh-text-muted line-clamp-1">{escola.endereco}</p>
                                </div>

                                <div className="mt-8">
                                    <Button 
                                        onClick={() => handleSelecionar(escola.id)}
                                        disabled={selecionando !== null}
                                        className={`w-full h-11 rounded-xl font-bold transition-all ${
                                            selecionando === escola.id 
                                            ? 'bg-gray-100 text-gray-400' 
                                            : 'bg-cnh-primary hover:bg-cnh-primary-dark text-white shadow-lg shadow-cnh-primary/20 btn-press'
                                        }`}
                                    >
                                        {selecionando === escola.id ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            'Vincular-se a esta Unidade'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center space-y-3">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-gray-300">
                            <Building2 size={40} />
                        </div>
                        <p className="text-cnh-text-muted">Nenhuma auto escola cadastrada ou aprovada encontrada com esses termos.</p>
                    </div>
                )}
            </div>

            <section className="bg-white p-6 rounded-2xl border border-cnh-border">
                <h4 className="text-sm font-bold text-cnh-text-primary mb-3">Como funciona a vinculação?</h4>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-cnh-text-secondary">
                        <CheckCircle2 size={18} className="text-cnh-success shrink-0 mt-0.5" />
                        <span>Após selecionar a unidade, você poderá visualizar os instrutores e agendar suas aulas imediatamente.</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-cnh-text-secondary">
                        <CheckCircle2 size={18} className="text-cnh-success shrink-0 mt-0.5" />
                        <span>A auto escola será notificada do seu interesse e terá acesso ao seu progresso.</span>
                    </li>
                </ul>
            </section>
        </div>
    );
}
