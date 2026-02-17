import { AlunoCnhStatus, AulaPratica } from '@/types';
import { mockAlunoCnhStatus } from '@/mocks/alunoCnhStatus';

// Mock: simula chamadas ao backend para dados do aluno
// Substituir por chamadas reais em api.ts quando integrado

export const alunoService = {
    /**
     * Busca o status completo do CNH do aluno
     */
    async buscarStatus(usuarioId: string): Promise<AlunoCnhStatus> {
        await new Promise(resolve => setTimeout(resolve, 500));

        if (usuarioId === mockAlunoCnhStatus.usuarioId) {
            return mockAlunoCnhStatus;
        }
        throw new Error('Aluno não encontrado');
    },

    /**
     * Busca as próximas aulas agendadas
     */
    async buscarProximasAulas(usuarioId: string): Promise<AulaPratica[]> {
        await new Promise(resolve => setTimeout(resolve, 400));

        const status = await this.buscarStatus(usuarioId);
        return status.aulasPraticas.filter(a => !a.realizada);
    },

    /**
     * Busca aulas realizadas
     */
    async buscarAulasRealizadas(usuarioId: string): Promise<AulaPratica[]> {
        await new Promise(resolve => setTimeout(resolve, 400));

        const status = await this.buscarStatus(usuarioId);
        return status.aulasPraticas.filter(a => a.realizada);
    },

    /**
     * Agenda uma nova aula prática
     */
    async agendarAula(aula: Omit<AulaPratica, 'id' | 'criadoEm'>): Promise<AulaPratica> {
        await new Promise(resolve => setTimeout(resolve, 800));

        const novaAula: AulaPratica = {
            ...aula,
            id: Math.floor(Math.random() * 10000),
            criadoEm: new Date().toISOString(),
        };

        return novaAula;
    },

    /**
     * Cancela uma aula agendada
     */
    async cancelarAula(aulaId: number): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 600));
        // Mock: sem efeito real, apenas simula a chamada
        console.log(`Aula ${aulaId} cancelada (mock)`);
    },
};
