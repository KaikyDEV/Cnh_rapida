import { Usuario } from '@/types';

export const mockUsuarios: Usuario[] = [
    {
        id: "usr-001",
        nomeCompleto: "Carlos Eduardo Silva",
        email: "carlos.silva@email.com",
        phoneNumber: "(11) 99999-9999",
        estado: "SP",
        dataNascimento: "1998-05-14T00:00:00",
        cpf: "123.456.789-00",
        dataCriacao: "2024-08-15T10:30:00",
        role: "Aluno",
        documentosAprovados: true,
        perfilIncompleto: false,
        nomeOuEmail: "Carlos Eduardo Silva"
    },
    {
        id: "usr-002",
        nomeCompleto: "Carlos Silva",
        email: "instrutor.carlos@email.com",
        phoneNumber: "(11) 98888-8888",
        estado: "SP",
        dataNascimento: "1985-03-22T00:00:00",
        cpf: "987.654.321-00",
        dataCriacao: "2023-01-10T08:00:00",
        role: "Instrutor",
        documentosAprovados: true,
        perfilIncompleto: false,
        nomeOuEmail: "Carlos Silva"
    },
    {
        id: "usr-003",
        nomeCompleto: "Ana Paula",
        email: "ana.paula@email.com",
        phoneNumber: "(11) 97777-7777",
        estado: "SP",
        dataNascimento: "1990-11-08T00:00:00",
        cpf: "456.789.123-00",
        dataCriacao: "2023-03-20T09:00:00",
        role: "Instrutor",
        documentosAprovados: true,
        perfilIncompleto: false,
        nomeOuEmail: "Ana Paula"
    }
];

