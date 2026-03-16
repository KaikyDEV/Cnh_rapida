import { AlunoCnhStatus } from '@/types';
import { alunoApi } from './api';

export interface AulaPraticaResponse {
    id: number;
    data: string;
    quantidadeHoras: number;
    realizada: boolean;
}

export const alunoService = {
    // Busca status do aluno
    async buscarStatus(): Promise<AlunoCnhStatus> {
        const response = await alunoApi.get<AlunoCnhStatus>('/api/aluno/status');
        return response.data;
    },

    // Agendar Aula Prática
    async agendarAula(data: string, horas: number, instrutorId?: string | null) {
        const response = await alunoApi.post('/api/aluno/agendar-aula', {
            data,
            horas,
            instrutorId
        });
        return response.data;
    },

    // Buscar TODAS as aulas do aluno
    async buscarMinhasAulas(): Promise<AulaPraticaResponse[]> {
        const response = await alunoApi.get<AulaPraticaResponse[]>('/api/aluno/minhas-aulas');
        return response.data;
    },

    // --- MÉTODOS AUXILIARES FALTANTES --- //

    // Filtra apenas as próximas aulas (não realizadas)
    async buscarProximasAulas(): Promise<AulaPraticaResponse[]> {
        const aulas = await this.buscarMinhasAulas();
        return aulas.filter(a => !a.realizada);
    },

    // Filtra apenas as aulas passadas (já realizadas)
    async buscarAulasRealizadas(): Promise<AulaPraticaResponse[]> {
        const aulas = await this.buscarMinhasAulas();
        return aulas.filter(a => a.realizada);
    }
};