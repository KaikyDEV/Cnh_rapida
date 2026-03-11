import { alunoService, AulaPraticaResponse } from './alunoService';
import { instrutorService } from './instrutorService';
import { InstrutorDisplay } from '@/types';

/**
 * Serviço dedicado ao fluxo de agendamento de aulas práticas.
 */
export const agendamentoService = {
    /**
     * Lista instrutores disponíveis para seleção
     */
    async listarInstrutores(): Promise<InstrutorDisplay[]> {
        return instrutorService.buscarInstrutores();
    },

    /**
     * Busca horários disponíveis de um instrutor em uma data
     */
    async buscarHorariosDisponiveis(instrutorId: string, data: string): Promise<string[]> {
        return instrutorService.buscarHorariosDisponiveis(instrutorId, data);
    },
    
    /**
     * Confirma e cria um novo agendamento de aula prática
     * Usa POST /api/aluno/agendar-aula
     */
    async confirmarAgendamento(data: string, horas: number, instrutorId?: string | null): Promise<{ message: string }> {
        return alunoService.agendarAula(data, horas, instrutorId);
    },

    /**
     * Busca próximas aulas agendadas do aluno logado
     */
    async buscarProximasAulas(): Promise<AulaPraticaResponse[]> {
        return alunoService.buscarProximasAulas();
    },

    /**
     * Busca histórico de aulas realizadas do aluno logado
     */
    async buscarAulasRealizadas(): Promise<AulaPraticaResponse[]> {
        return alunoService.buscarAulasRealizadas();
    },
};
