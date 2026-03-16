namespace Cnh_rapida.DTOs;

public class AlunoProgressoDto
{
    public int Id { get; set; }
    public string NomeCompleto { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    public bool PossuiContaGov { get; set; }
    public bool ProcessoIniciadoDetran { get; set; }
    public bool ExameMedicoRealizado { get; set; }
    public bool ExameTeoricoRealizado { get; set; }
    public bool AulasPraticasIniciadas { get; set; }
    public bool ExamesEnviados { get; set; }
    public bool ExameMedicoAprovado { get; set; }
    public bool ExameTeoricoAprovado { get; set; }
    public bool DocumentosAprovados { get; set; }

    public DateTime UltimaAtualizacao { get; set; }
}
