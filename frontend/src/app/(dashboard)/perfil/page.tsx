'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, Calendar, Pencil, Download, FileText, Trophy } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import { mockAlunoCnhStatus } from '@/mocks/alunoCnhStatus';
import { mockAulasPraticas } from '@/mocks/aulasPraticas';

export default function PerfilPage() {
    const { usuario } = useAuth();

    if (!usuario) return null;

    const aulasRealizadas = mockAulasPraticas.filter(a => a.realizada).length;

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6">
                {/* Profile Card */}
                <Card className="p-6 rounded-xl border border-cnh-border text-center">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full bg-cnh-primary-dark flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                        {usuario.nomeCompleto.charAt(0).toUpperCase()}
                    </div>

                    <h2 className="text-lg font-bold text-cnh-text-primary">{usuario.nomeCompleto}</h2>
                    <Badge
                        className={`mt-1 ${usuario.role === 'Aluno' ? 'bg-cnh-primary/10 text-cnh-primary' : 'bg-cnh-success/10 text-cnh-success'}`}
                    >
                        {usuario.role}
                    </Badge>

                    <div className="mt-5 space-y-3 text-left">
                        <div className="flex items-center gap-2 text-sm">
                            <Mail size={16} className="text-cnh-text-muted shrink-0" />
                            <span className="text-cnh-text-secondary truncate">{usuario.email}</span>
                        </div>
                        {usuario.phoneNumber && (
                            <div className="flex items-center gap-2 text-sm">
                                <Phone size={16} className="text-cnh-text-muted shrink-0" />
                                <span className="text-cnh-text-secondary">{usuario.phoneNumber}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar size={16} className="text-cnh-text-muted shrink-0" />
                            <span className="text-cnh-text-secondary">
                                Início: {new Date(usuario.dataCriacao).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full mt-5 border-cnh-border">
                        <Pencil size={14} className="mr-2" />
                        Editar Perfil
                    </Button>
                </Card>

                {/* Certificate */}
                <Card className="rounded-xl border border-cnh-border overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-cnh-border">
                        <h3 className="font-bold text-cnh-text-primary">Certificado de Conclusão</h3>
                        <Button variant="outline" size="sm" className="border-cnh-border">
                            <Download size={14} className="mr-1" />
                            Baixar
                        </Button>
                    </div>

                    {/* Certificate document */}
                    <div className="p-6 bg-white">
                        <div className="border border-cnh-border rounded-lg p-6 space-y-4">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <Logo size="sm" />
                                <div className="text-right text-xs text-cnh-text-muted">
                                    <p className="font-semibold text-cnh-text-secondary">DETRAN-SP</p>
                                    <p>Departamento Estadual de Trânsito</p>
                                </div>
                            </div>

                            <div className="h-1 bg-gradient-to-r from-cnh-primary to-cnh-primary-light rounded-full" />

                            {/* Content */}
                            <div className="text-center py-4">
                                <h4 className="text-lg font-bold text-cnh-text-primary mb-3">
                                    Certificado de Conclusão
                                </h4>
                                <p className="text-sm text-cnh-text-secondary mb-1">Certificamos que</p>
                                <p className="text-xl font-bold text-cnh-primary mb-2">{usuario.nomeCompleto}</p>
                                <p className="text-sm text-cnh-text-secondary">
                                    Concluiu com êxito o curso de formação de condutores
                                </p>
                                <p className="text-sm font-semibold text-cnh-text-primary mt-1">
                                    Categoria B
                                </p>
                            </div>

                            {/* Details grid */}
                            <div className="grid grid-cols-2 gap-3 bg-cnh-bg-base rounded-lg p-4 text-sm">
                                <div>
                                    <p className="text-xs text-cnh-text-muted">CPF</p>
                                    <p className="font-medium text-cnh-text-primary">{usuario.cpf}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-cnh-text-muted">RG</p>
                                    <p className="font-medium text-cnh-text-primary">12.345.678-9</p>
                                </div>
                                <div>
                                    <p className="text-xs text-cnh-text-muted">Aulas Práticas</p>
                                    <p className="font-medium text-cnh-text-primary">{aulasRealizadas}/25</p>
                                </div>
                                <div>
                                    <p className="text-xs text-cnh-text-muted">Data de Conclusão</p>
                                    <p className="font-medium text-cnh-warning">Em progresso</p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-2 text-xs">
                                <div className="flex items-center gap-1.5 text-cnh-success">
                                    <Trophy size={14} />
                                    <span className="font-semibold">Certificado Válido</span>
                                </div>
                                <span className="text-cnh-text-muted">Emitido em 17/02/2026</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Documentos */}
            <Card className="rounded-xl border border-cnh-border">
                <div className="px-5 py-4 border-b border-cnh-border">
                    <h3 className="font-bold text-cnh-text-primary">Documentos</h3>
                </div>
                <div className="divide-y divide-cnh-border">
                    {[
                        { nome: 'Comprovante de Matrícula', tamanho: '245 KB' },
                        { nome: 'Histórico de Aulas', tamanho: '180 KB' },
                        { nome: 'Certificado de Conclusão Teórica', tamanho: '320 KB' },
                        ...(mockAlunoCnhStatus.caminhoExameMedico
                            ? [{ nome: 'Laudo Médico', tamanho: '156 KB' }]
                            : []),
                    ].map((doc) => (
                        <div key={doc.nome} className="flex items-center justify-between px-5 py-3.5">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                                    <FileText size={16} className="text-red-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-cnh-text-primary">{doc.nome}</p>
                                    <p className="text-xs text-cnh-text-muted">PDF, {doc.tamanho}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-cnh-text-muted hover:text-cnh-primary">
                                <Download size={16} />
                            </Button>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
