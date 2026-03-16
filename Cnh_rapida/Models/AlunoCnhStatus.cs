namespace Cnh_rapida.Models;

public class AlunoCnhStatus
{
    public int Id { get; set; }

    public string UsuarioId { get; set; } = string.Empty;
    public virtual Usuario Usuario { get; set; } = null!;

    public int? AutoEscolaId { get; set; }
    public virtual AutoEscola? AutoEscola { get; set; }

    public bool PossuiContaGov { get; set; } = false;
    public bool ProcessoIniciadoDetran { get; set; } = false;

    public bool ExameMedicoRealizado { get; set; } = false;
    public bool ExameTeoricoRealizado { get; set; }
    public bool AulasPraticasIniciadas { get; set; }

    public bool PrimeiroAcesso { get; set; } = true;

    // 🔹 CONTROLE DO UPLOAD
    public bool ExamesEnviados { get; set; } = false;
    public bool ExameMedicoAprovado { get; set; } = false;

    public string? CaminhoExameMedico { get; set; }
    public string? CaminhoPsicotecnico { get; set; }

    public DateTime? DataEnvioExames { get; set; }

    public bool ExameTeoricoAprovado { get; set; } = false;
    public string? CaminhoExameTeorico { get; set; }
    public DateTime? DataEnvioExameTeorico { get; set; }

    public bool DocumentosAprovados { get; set; } = false;

    public DateTime UltimaAtualizacao { get; set; } = DateTime.UtcNow;

    public virtual ICollection<AulaPratica> AulasPraticas { get; set; }
    = new List<AulaPratica>();

}
