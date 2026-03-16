// src/types/index.ts — Interfaces derivadas dos models C# do backend

export interface Usuario {
  id: string;                    // IdentityUser.Id (GUID string)
  nomeCompleto: string;
  email: string;
  phoneNumber?: string;
  estado: string;
  dataNascimento: string;        // ISO date string
  cpf: string;
  dataCriacao: string;           // ISO datetime
  role: 'Aluno' | 'Instrutor' | 'Admin' | 'AutoEscola';  // derivado do Identity Role
  documentosAprovados: boolean;
  perfilIncompleto: boolean;
  nomeOuEmail: string;           // computed: nomeCompleto ?? email
}

export interface AlunoCnhStatus {
  id: number;
  usuarioId: string;
  usuario: Usuario;

  // Progresso do processo
  possuiContaGov: boolean;
  processoIniciadoDetran: boolean;

  // Exames
  exameMedicoRealizado: boolean;
  exameMedicoAprovado: boolean;
  caminhoExameMedico?: string;
  caminhoPsicotecnico?: string;
  dataEnvioExames?: string;
  examesEnviados: boolean;

  exameTeoricoRealizado: boolean;
  exameTeoricoAprovado: boolean;
  caminhoExameTeorico?: string;
  dataEnvioExameTeorico?: string;

  // Aulas
  aulasPraticasIniciadas: boolean;
  aulasPraticas: AulaPratica[];

  // Auto Escola vinculada
  autoEscolaId?: number;

  // Sistema
  primeiroAcesso: boolean;
  documentosAprovados: boolean;
  ultimaAtualizacao: string;     // ISO datetime
}

export interface AulaPratica {
  id: number;
  alunoCnhStatusId: number;
  data: string;                  // ISO datetime
  quantidadeHoras: number;       // mínimo 2
  confirmada: boolean;
  realizada: boolean;
  observacao?: string;
  criadoEm: string;             // ISO datetime
  aprovada: boolean;
}

// Enums auxiliares
export type StatusAula = 'Agendada' | 'Confirmada' | 'Realizada' | 'Cancelada';
export type TipoAula = 'Diurna' | 'Noturna' | 'Baliza' | 'Simulado';

// Interface para instrutor com dados adicionais de exibição
export interface InstrutorDisplay {
  usuario: Usuario;
  especialidade: string;
  avaliacao: number;
  aulasMinistradas: number;
}
