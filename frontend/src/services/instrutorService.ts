import { InstrutorDisplay } from '@/types';
import { alunoApi, instrutorApi } from './api';

// Interface para itens da agenda do instrutor
export interface AgendaItem {
    id: number;
    horario: string;
    nomeAluno: string;
    status: 'Agendada' | 'Concluída' | 'Cancelada';
    tipoAula: string;
}

export interface AulaHistoricoItem {
    id: number;
    data: string;
    nomeAluno: string;
    status: 'Agendada' | 'Concluída' | 'Cancelada';
    tipoAula: string;
    horario: string;
    dataFormatada: string;
}

export const instrutorService = {

    /**
     * Busca lista de instrutores disponíveis
     * GET /api/aluno/instrutores
     */
    async buscarInstrutores(): Promise<InstrutorDisplay[]> {
        const response = await alunoApi.get<InstrutorDisplay[]>('/api/aluno/instrutores');
        return response.data;
    },

    /**
     * Busca a agenda de um instrutor para uma data
     * GET /api/instrutor/agenda?instrutorId=X&data=Y
     */
    async buscarAgenda(instrutorId: string, data: string): Promise<AgendaItem[]> {
        const response = await instrutorApi.get<AgendaItem[]>('/api/instrutor/agenda', {
            params: { instrutorId, data },
        });
        return response.data;
    },

    /**
     * Marca uma aula como concluída
     * POST /api/instrutor/concluir-aula/{id}
     */
    async concluirAula(aulaId: number): Promise<void> {
        await instrutorApi.post(`/api/instrutor/concluir-aula/${aulaId}`);
    },

    /**
     * Cancela uma aula agendada
     * POST /api/instrutor/cancelar-aula/{id}
     */
    async cancelarAula(aulaId: number): Promise<void> {
        await instrutorApi.post(`/api/instrutor/cancelar-aula/${aulaId}`);
    },

    /**
     * Busca todas as aulas do instrutor
     * GET /api/instrutor/todas-aulas?instrutorId=X
     */
    async buscarTodasAulas(instrutorId: string): Promise<AulaHistoricoItem[]> {
        const response = await instrutorApi.get<AulaHistoricoItem[]>('/api/instrutor/todas-aulas', {
            params: { instrutorId }
        });
        return response.data;
    },

    /**
     * Bloqueia um horário na agenda do instrutor
     * POST /api/instrutor/bloquear-horario
     */
    async bloquearHorario(
        instrutorId: string,
        data: string,
        horaInicio: string,
        horaFim: string,
        motivo?: string
    ): Promise<void> {
        await instrutorApi.post('/api/instrutor/bloquear-horario', {
            instrutorId,
            data,
            horaInicio,
            horaFim,
            motivo,
        });
    },

    /**
     * Busca horários disponíveis para agendamento
     * GET /api/aluno/instrutor/horarios-disponiveis?instrutorId=X&data=Y
     */
    async buscarHorariosDisponiveis(
        instrutorId: string,
        data: string
    ): Promise<string[]> {
        const response = await alunoApi.get<string[]>('/api/aluno/instrutor/horarios-disponiveis', {
            params: { instrutorId, data },
        });
        return response.data;
    },
};