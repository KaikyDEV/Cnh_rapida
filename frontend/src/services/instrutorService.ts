import { InstrutorDisplay } from '@/types';
import { alunoApi, instrutorApi } from './api';

// Interface para itens da agenda do instrutor
export interface AgendaItem {
    horario: string;
    nomeAluno: string;
    status: 'Agendada' | 'Concluída' | 'Cancelada';
    tipoAula: string;
}

export const instrutorService = {

    /**
     * Busca lista de instrutores disponíveis
     * GET /api/aluno/instrutores
     */
    async buscarInstrutores(): Promise<InstrutorDisplay[]> {
        const response = await alunoApi.get<InstrutorDisplay[]>('/instrutores');
        return response.data;
    },

    /**
     * Busca a agenda de um instrutor para uma data
     * GET /api/instrutor/agenda?instrutorId=X&data=Y
     */
    async buscarAgenda(instrutorId: string, data: string): Promise<AgendaItem[]> {
        const response = await instrutorApi.get<AgendaItem[]>('/agenda', {
            params: { instrutorId, data },
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
        await instrutorApi.post('/bloquear-horario', {
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
        const response = await alunoApi.get<string[]>('/instrutor/horarios-disponiveis', {
            params: { instrutorId, data },
        });
        return response.data;
    },
};