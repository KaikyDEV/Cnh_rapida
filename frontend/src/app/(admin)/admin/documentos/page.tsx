'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    CheckCircle, 
    XCircle, 
    Clock, 
    ExternalLink, 
    Eye, 
    User, 
    FileText, 
    AlertCircle,
    Check,
    X,
    MessageSquare
} from 'lucide-react';
import { documentoService } from '@/services/documentoService';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface PendingDocument {
    id: number;
    tipoDocumento: string;
    urlArquivo: string;
    dataUpload: string;
    usuarioNome: string;
    usuarioEmail: string;
}

export default function AdminDocumentosPage() {
    const [documentos, setDocumentos] = useState<PendingDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoc, setSelectedDoc] = useState<PendingDocument | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const carregarPendentes = async () => {
        try {
            const data = await documentoService.listarPendentes();
            setDocumentos(data);
        } catch (error) {
            console.error('Erro ao carregar documentos pendentes:', error);
            toast.error('Erro ao carregar documentos pendentes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarPendentes();
    }, []);

    const handleAprovar = async (id: number) => {
        try {
            setIsProcessing(true);
            await documentoService.aprovar(id);
            toast.success('Documento aprovado com sucesso!');
            carregarPendentes();
        } catch (error) {
            toast.error('Erro ao aprovar documento');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRejeitar = async () => {
        if (!selectedDoc || !rejectReason.trim()) return;

        try {
            setIsProcessing(true);
            await documentoService.rejeitar(selectedDoc.id, rejectReason);
            toast.success('Documento rejeitado');
            setIsRejectDialogOpen(false);
            setRejectReason('');
            setSelectedDoc(null);
            carregarPendentes();
        } catch (error) {
            toast.error('Erro ao rejeitar documento');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-3 border-cnh-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-cnh-text-primary">Validar Documentos</h1>
                    <p className="text-cnh-text-secondary text-sm">
                        Analise e valide os documentos enviados pelos usuários do sistema.
                    </p>
                </div>
                <div className="bg-cnh-primary/10 text-cnh-primary px-4 py-2 rounded-lg flex items-center gap-2">
                    <Clock size={18} />
                    <span className="font-bold">{documentos.length}</span>
                    <span className="text-sm">Pendentes</span>
                </div>
            </header>

            {documentos.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-2 border-cnh-border">
                    <div className="w-16 h-16 bg-cnh-success/10 text-cnh-success rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-cnh-text-primary">Tudo em dia!</h3>
                    <p className="text-cnh-text-secondary">Não há nenhum documento aguardando validação no momento.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documentos.map((doc) => (
                        <Card key={doc.id} className="overflow-hidden border border-cnh-border hover:shadow-md transition-shadow">
                            <div className="p-5 space-y-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-cnh-background flex items-center justify-center text-cnh-primary">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-cnh-text-primary text-sm truncate max-w-[150px]">
                                                {doc.usuarioNome}
                                            </p>
                                            <p className="text-xs text-cnh-text-muted truncate max-w-[150px]">
                                                {doc.usuarioEmail}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="bg-cnh-background text-[10px] uppercase font-bold">
                                        {doc.tipoDocumento}
                                    </Badge>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-cnh-text-muted uppercase">Enviado em</p>
                                    <p className="text-sm text-cnh-text-primary flex items-center gap-1.5">
                                        <Clock size={14} className="text-cnh-text-muted" />
                                        {new Date(doc.dataUpload).toLocaleString('pt-BR')}
                                    </p>
                                </div>

                                <div className="pt-2 flex flex-col gap-2">
                                    <a 
                                        href={doc.urlArquivo} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="w-full"
                                    >
                                        <Button variant="outline" className="w-full border-cnh-border text-xs gap-2 py-1.5 h-9">
                                            <Eye size={14} />
                                            Visualizar Documento
                                            <ExternalLink size={12} />
                                        </Button>
                                    </a>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Button 
                                            onClick={() => handleAprovar(doc.id)}
                                            disabled={isProcessing}
                                            className="bg-cnh-success hover:bg-cnh-success/90 text-white text-xs gap-1.5 h-9"
                                        >
                                            <Check size={14} />
                                            Aprovar
                                        </Button>
                                        <Button 
                                            variant="outline"
                                            onClick={() => {
                                                setSelectedDoc(doc);
                                                setIsRejectDialogOpen(true);
                                            }}
                                            disabled={isProcessing}
                                            className="border-red-200 text-red-600 hover:bg-red-50 text-xs gap-1.5 h-9"
                                        >
                                            <X size={14} />
                                            Rejeitar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Reject Dialog */}
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertCircle size={20} />
                            Rejeitar Documento
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="bg-cnh-background p-3 rounded-lg text-sm">
                            <p className="font-bold text-cnh-text-primary">{selectedDoc?.usuarioNome}</p>
                            <p className="text-cnh-text-muted">{selectedDoc?.tipoDocumento}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-1.5">
                                <MessageSquare size={14} />
                                Motivo da Rejeição
                            </label>
                            <Textarea 
                                placeholder="Descreva por que o documento foi rejeitado (ex: foto ilegível, documento vencido...)"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="min-h-[100px] text-sm"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setIsRejectDialogOpen(false)}
                            disabled={isProcessing}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleRejeitar}
                            disabled={isProcessing || !rejectReason.trim()}
                        >
                            {isProcessing ? 'Processando...' : 'Confirmar Rejeição'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
