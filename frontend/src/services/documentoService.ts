import api from './api';

export enum StatusDocumento {
    Pendente = 0,
    Aprovado = 1,
    Rejeitado = 2
}

export interface DocumentoUsuario {
    id: number;
    tipoDocumento: string;
    urlArquivo: string;
    status: StatusDocumento;
    observacao?: string;
    dataUpload: string;
}

export interface PendenteDocumento {
    id: number;
    tipoDocumento: string;
    urlArquivo: string;
    dataUpload: string;
    usuarioNome: string;
    usuarioEmail: string;
}

export const documentoService = {
    // 📤 Upload de documento
    async upload(arquivo: File, tipoDocumento: string) {
        const formData = new FormData();
        formData.append('arquivo', arquivo);
        formData.append('tipoDocumento', tipoDocumento);

        const response = await api.post<{ message: string; url: string }>('/api/documento/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // 📋 Meus documentos
    async listarMeus() {
        const response = await api.get<DocumentoUsuario[]>('/api/documento/meus');
        return response.data;
    },

    // 🔍 (Admin) Listar pendentes
    async listarPendentes() {
        const response = await api.get<PendenteDocumento[]>('/api/documento/pendentes');
        return response.data;
    },

    // ✅ (Admin) Aprovar
    async aprovar(id: number) {
        const response = await api.post(`/api/documento/aprovar/${id}`);
        return response.data;
    },

    // ❌ (Admin) Rejeitar
    async rejeitar(id: number, motivo: string) {
        const response = await api.post(`/api/documento/rejeitar/${id}`, JSON.stringify(motivo), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    }
};
