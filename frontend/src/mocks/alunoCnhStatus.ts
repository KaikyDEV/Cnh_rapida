import { AlunoCnhStatus } from '@/types';
import { mockUsuarios } from './usuarios';
import { mockAulasPraticas } from './aulasPraticas';

export const mockAlunoCnhStatus: AlunoCnhStatus = {
    id: 1,
    usuarioId: "usr-001",
    usuario: mockUsuarios[0],
    possuiContaGov: true,
    processoIniciadoDetran: true,
    exameMedicoRealizado: true,
    exameMedicoAprovado: true,
    caminhoExameMedico: "/docs/exame-medico.pdf",
    caminhoPsicotecnico: "/docs/psicotecnico.pdf",
    dataEnvioExames: "2024-09-01T14:00:00",
    examesEnviados: true,
    exameTeoricoRealizado: true,
    exameTeoricoAprovado: true,
    caminhoExameTeorico: "/docs/exame-teorico.pdf",
    dataEnvioExameTeorico: "2024-10-15T10:00:00",
    aulasPraticasIniciadas: true,
    aulasPraticas: mockAulasPraticas,
    primeiroAcesso: false,
    ultimaAtualizacao: "2025-02-17T08:00:00"
};
