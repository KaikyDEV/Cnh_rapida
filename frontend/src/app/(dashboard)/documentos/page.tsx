'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle, Clock, AlertTriangle, ExternalLink, Info } from 'lucide-react';
import { documentoService, DocumentoUsuario, StatusDocumento } from '@/services/documentoService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Documents required per role
const DOCS_ALUNO = [
    {
        id: 'exame-medico',
        apiType: 'ExameMedico',
        label: 'Exame Médico',
        descricao: 'Laudo do exame clínico realizado em clínica credenciada pelo DETRAN',
        icon: '🩺',
    },
    {
        id: 'psicotecnico',
        apiType: 'Psicotecnico',
        label: 'Exame Psicotécnico',
        descricao: 'Laudo do exame psicológico realizado em clínica credenciada',
        icon: '🧠',
    },
    {
        id: 'exame-teorico',
        apiType: 'ExameTeorico',
        label: 'Comprovante — Prova Teórica',
        descricao: 'Comprovante de aprovação na prova teórica do DETRAN',
        icon: '📝',
    },
];

const DOCS_INSTRUTOR = [
    { id: 'rg', apiType: 'RG', label: 'Documento de Identidade (RG)', icon: '🆔', descricao: 'RG ou CNH' },
    { id: 'credencial', apiType: 'CertificadoDetran', label: 'Credencial do DETRAN', icon: '🪪', descricao: 'Certificado de instrutor emitido pelo DETRAN' },
];

const DOCS_AUTOESCOLA = [
    { id: 'cnpj', apiType: 'CNPJ', label: 'Cartão CNPJ', icon: '🏢', descricao: 'Comprovante de CNPJ ativo' },
    { id: 'alvara', apiType: 'AlvaraFuncionamento', label: 'Alvará de Funcionamento', icon: '📋', descricao: 'Alvará emitido pela prefeitura' },
    { id: 'detran', apiType: 'CertificadoDetran', label: 'Certificado DETRAN', icon: '🏛️', descricao: 'Certificado de credenciamento do DETRAN' },
];

export default function DocumentosPage() {
    const { usuario } = useAuth();
    const [documentos, setDocumentos] = useState<DocumentoUsuario[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploading, setUploading] = useState<string | null>(null);

    const carregarDocumentos = async () => {
        try {
            const data = await documentoService.listarMeus();
            setDocumentos(data);
        } catch (error) {
            console.error(error);
            toast.error('Erro ao carregar seus documentos');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        carregarDocumentos();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, tipo: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(tipo);
        try {
            await documentoService.upload(file, tipo);
            toast.success('Documento enviado! Aguarde a análise.');
            carregarDocumentos();
        } catch (error: any) {
            const msg = error?.response?.data?.message || 'Falha no upload do documento';
            toast.error(msg);
        } finally {
            setUploading(null);
            e.target.value = '';
        }
    };

    if (isLoading) return <div className="p-8 text-center text-cnh-text-muted">Carregando...</div>;

    const role = usuario?.role;
    const docs = role === 'Aluno' ? DOCS_ALUNO : role === 'Instrutor' ? DOCS_INSTRUTOR : DOCS_AUTOESCOLA;
    const todosAprovados = docs.every(req => documentos.some(d => d.tipoDocumento === req.apiType && d.status === StatusDocumento.Aprovado));

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-cnh-text-primary mb-1">Verificação de Documentos</h1>
                <p className="text-cnh-text-secondary text-sm">
                    Envie os documentos abaixo para liberar o acesso completo à plataforma.
                </p>
            </header>

            {/* Gov.br step — only for Aluno */}
            {role === 'Aluno' && (
                <Card className="p-5 border border-blue-200 bg-blue-50/60 rounded-xl">
                    <div className="flex items-start gap-4">
                        <span className="text-3xl">🇧🇷</span>
                        <div className="flex-1">
                            <p className="font-bold text-cnh-text-primary">Conta Gov.br</p>
                            <p className="text-sm text-cnh-text-secondary mt-1">
                                Sua conta Gov.br é necessária para iniciar o processo no DETRAN.
                                Você precisa ter uma conta criada no portal do Governo Federal antes de enviar os documentos abaixo.
                            </p>
                            <a
                                href="https://acesso.gov.br"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold mt-2 hover:underline"
                            >
                                Criar ou acessar conta Gov.br <ExternalLink size={12} />
                            </a>
                        </div>
                        <div className="shrink-0 text-xs px-3 py-1.5 bg-blue-100 text-blue-700 font-semibold rounded-full flex items-center gap-1 whitespace-nowrap">
                            <Info size={12} /> Pré-requisito
                        </div>
                    </div>
                </Card>
            )}

            {/* Document list */}
            <div className="space-y-3">
                <h2 className="text-base font-bold text-cnh-text-primary">
                    {role === 'Aluno' ? 'Documentos para liberar Aulas Práticas' : 'Documentos Necessários'}
                </h2>

                {docs.map((req, index) => {
                    const doc = documentos.find(d => d.tipoDocumento === req.apiType);
                    const isUploading = uploading === req.apiType;
                    const isApproved = doc?.status === StatusDocumento.Aprovado;
                    const isPending = doc?.status === StatusDocumento.Pendente;
                    const isRejected = doc?.status === StatusDocumento.Rejeitado;

                    return (
                        <Card key={req.id} className={`p-5 rounded-xl border transition-colors ${
                            isApproved ? 'border-green-200 bg-green-50/40' : 'border-cnh-border'
                        }`}>
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl shrink-0">
                                        {req.icon}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {role === 'Aluno' && (
                                                <span className="text-[10px] font-bold text-cnh-text-muted bg-cnh-background px-1.5 py-0.5 rounded">
                                                    Etapa {index + 1}
                                                </span>
                                            )}
                                            <p className="font-semibold text-cnh-text-primary text-sm">{req.label}</p>
                                        </div>
                                        <p className="text-xs text-cnh-text-muted mt-0.5">{req.descricao}</p>
                                        {doc && (
                                            <div className="flex items-center gap-1.5 mt-1.5">
                                                {isApproved && <CheckCircle className="text-green-500" size={13} />}
                                                {isRejected && <AlertTriangle className="text-red-500" size={13} />}
                                                {isPending && <Clock className="text-yellow-500" size={13} />}
                                                <span className={`text-xs font-semibold ${
                                                    isApproved ? 'text-green-700' :
                                                    isRejected ? 'text-red-700' :
                                                    'text-yellow-700'
                                                }`}>
                                                    {isApproved ? 'Aprovado' :
                                                     isRejected ? `Rejeitado${doc.observacao ? ': ' + doc.observacao : ''}` :
                                                     'Em análise...'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {isApproved ? (
                                    <div className="shrink-0 text-green-600 flex items-center gap-1.5 px-3 py-1.5 bg-green-100 rounded-full text-xs font-bold">
                                        <CheckCircle size={13} /> OK
                                    </div>
                                ) : isPending ? (
                                    <div className="shrink-0 text-yellow-700 flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 rounded-full text-xs font-medium whitespace-nowrap">
                                        <Clock size={13} /> Aguardando
                                    </div>
                                ) : (
                                    <div className="relative shrink-0">
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full"
                                            onChange={(e) => handleFileUpload(e, req.apiType)}
                                            disabled={!!uploading}
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2 border-cnh-primary text-cnh-primary hover:bg-cnh-primary/5 whitespace-nowrap"
                                            disabled={!!uploading}
                                        >
                                            <Upload size={13} />
                                            {isUploading ? 'Enviando...' : isRejected ? 'Reenviar' : 'Enviar'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Summary banner */}
            <Card className={`p-5 rounded-xl border-2 ${
                todosAprovados
                    ? 'border-green-300 bg-green-50'
                    : 'border-dashed border-cnh-border bg-cnh-background/30'
            }`}>
                <div className="flex items-center gap-3">
                    {todosAprovados ? (
                        <>
                            <CheckCircle className="text-green-500 shrink-0" size={24} />
                            <div>
                                <p className="font-bold text-green-800">Tudo certo! 🎉</p>
                                <p className="text-sm text-green-700">
                                    {role === 'Aluno'
                                        ? 'Seus documentos foram aprovados. Você já pode agendar suas aulas práticas!'
                                        : 'Seus documentos foram aprovados. Sua conta está totalmente liberada.'}
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <Clock className="text-cnh-text-muted shrink-0" size={24} />
                            <div>
                                <p className="font-bold text-cnh-text-primary">Documentos pendentes</p>
                                <p className="text-sm text-cnh-text-secondary">
                                    {role === 'Aluno'
                                        ? 'Envie e aguarde a aprovação dos documentos acima para liberar o agendamento de aulas práticas.'
                                        : 'Envie e aguarde a aprovação dos documentos para liberar sua conta.'}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
}
