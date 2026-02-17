import { InstrutorDisplay } from '@/types';
import { mockUsuarios } from '@/mocks/usuarios';

// Dados de exibição dos instrutores (extras além do Usuario)
export const mockInstrutores: InstrutorDisplay[] = [
    {
        usuario: mockUsuarios[1],
        especialidade: "Especialista em baliza e estacionamento",
        avaliacao: 4.9,
        aulasMinistradas: 450,
    },
    {
        usuario: mockUsuarios[2],
        especialidade: "Foco em segurança e direção defensiva",
        avaliacao: 4.8,
        aulasMinistradas: 380,
    },
    {
        // Mock de um 3o instrutor — Roberto Santos
        usuario: {
            id: "usr-004",
            nomeCompleto: "Roberto Santos",
            email: "roberto.santos@email.com",
            phoneNumber: "(11) 96666-6666",
            estado: "SP",
            dataNascimento: "1988-07-15T00:00:00",
            cpf: "321.654.987-00",
            dataCriacao: "2023-06-01T10:00:00",
            role: "Instrutor",
            nomeOuEmail: "Roberto Santos",
        },
        especialidade: "Preparação para exame prático",
        avaliacao: 4.7,
        aulasMinistradas: 320,
    },
];

// Mockup: agenda do instrutor para hoje
export interface AgendaItem {
    horario: string;
    nomeAluno: string;
    status: 'Agendada' | 'Concluída' | 'Cancelada';
    tipoAula: string;
}

export const mockAgendaHoje: AgendaItem[] = [
    { horario: "09:00", nomeAluno: "Marcos Silva", status: "Agendada", tipoAula: "Prática Diurna" },
    { horario: "10:00", nomeAluno: "Paula Santos", status: "Agendada", tipoAula: "Baliza" },
    { horario: "11:00", nomeAluno: "Ricardo Lima", status: "Agendada", tipoAula: "Simulado" },
    { horario: "14:30", nomeAluno: "André Costa", status: "Agendada", tipoAula: "Prática Diurna" },
    { horario: "18:00", nomeAluno: "Fernanda Alves", status: "Agendada", tipoAula: "Prática Noturna" },
];

export const instrutorService = {
    /**
     * Busca lista de instrutores disponíveis
     */
    async buscarInstrutores(): Promise<InstrutorDisplay[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockInstrutores;
    },

    /**
     * Busca a agenda de um instrutor para uma data
     */
    async buscarAgenda(instrutorId: string, data: string): Promise<AgendaItem[]> {
        await new Promise(resolve => setTimeout(resolve, 400));
        // Mock: retorna agenda padrão para qualquer data
        void instrutorId;
        void data;
        return mockAgendaHoje;
    },

    /**
     * Bloqueia um horário na agenda do instrutor
     */
    async bloquearHorario(instrutorId: string, data: string, horaInicio: string, horaFim: string, motivo?: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 600));
        void instrutorId;
        console.log(`Horário bloqueado: ${data} ${horaInicio}-${horaFim} - ${motivo || 'Sem motivo'}`);
    },

    /**
     * Busca horários disponíveis para agendamento
     */
    async buscarHorariosDisponiveis(instrutorId: string, data: string): Promise<string[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        void instrutorId;
        void data;
        // Mock: alguns horários disponíveis
        return ["09:00", "09:30", "10:30", "11:00", "14:00", "14:30", "15:00", "16:30", "17:00", "17:30"];
    },
};
