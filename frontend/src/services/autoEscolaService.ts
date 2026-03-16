import { autoEscolaApi as api } from './api';
import { Usuario } from '@/types';

export interface InstrutorResumo {
    id: number;
    nomeCompleto: string;
    email: string;
    ativo: boolean;
    documentosAprovados: boolean;
}

export interface InstrutorPerfil extends InstrutorResumo {
    telefone?: string;
    cnh: string;
    categoria: string;
    registroDetran: string;
    dataContratacao: string;
    dataValidadeCnh: string;
    observacoes?: string;
}

export interface AlunoResumo {
    id: number;
    nomeCompleto: string;
    email: string;
    documentosAprovados: boolean;
    ultimaAtualizacao: string;
}

export interface AlunoProgresso {
    id: number;
    nomeCompleto: string;
    email: string;
    possuiContaGov: boolean;
    processoIniciadoDetran: boolean;
    exameMedicoRealizado: boolean;
    exameTeoricoRealizado: boolean;
    aulasPraticasIniciadas: boolean;
    examesEnviados: boolean;
    exameMedicoAprovado: boolean;
    exameTeoricoAprovado: boolean;
    documentosAprovados: boolean;
    ultimaAtualizacao: string;
}

export const autoEscolaService = {
    /**
     * Busca o perfil da auto escola logada
     */
    async getPerfil() {
        const response = await api.get('/api/AutoEscola/perfil');
        return response.data;
    },

    /**
     * Lista instrutores vinculados à auto escola
     */
    async getInstrutores(): Promise<InstrutorResumo[]> {
        const response = await api.get('/api/AutoEscola/instrutores');
        return response.data;
    },

    /**
     * Lista alunos vinculados à auto escola
     */
    async getAlunos(): Promise<AlunoResumo[]> {
        const response = await api.get('/api/AutoEscola/alunos');
        return response.data;
    },

    /**
     * Vincula um aluno pelo CPF
     */
    async vincularAluno(cpf: string) {
        const response = await api.post('/api/AutoEscola/vincular-aluno', { identificador: cpf });
        return response.data;
    },

    /**
     * Vincula um instrutor pelo CPF/CNPJ
     */
    async vincularInstrutor(identificador: string) {
        const response = await api.post('/api/AutoEscola/vincular-instrutor', { identificador });
        return response.data;
    },


    /**
     * Desvincula um instrutor
     */
    async desvincularInstrutor(id: number) {
        const response = await api.delete(`/api/AutoEscola/desvincular-instrutor/${id}`);
        return response.data;
    },

    /**
     * Busca o perfil detalhado de um instrutor
     */
    async getPerfilInstrutor(id: number): Promise<InstrutorPerfil> {
        const response = await api.get<InstrutorPerfil>(`/api/AutoEscola/instrutor/${id}`);
        return response.data;
    },

    /**
     * Busca o progresso detalhado de um aluno
     */
    async getProgressoAluno(id: number): Promise<AlunoProgresso> {
        const response = await api.get<AlunoProgresso>(`/api/AutoEscola/aluno/${id}`);
        return response.data;
    },

    /**
     * Lista todas as auto escolas aprovadas (para o aluno)
     */
    async listarTodas() {
        const response = await api.get('/api/AutoEscola/lista');
        return response.data;
    },

    /**
     * Aluno seleciona sua auto escola
     */
    async selecionarEscola(id: number) {
        const response = await api.post(`/api/AutoEscola/selecionar/${id}`);
        return response.data;
    }
};


