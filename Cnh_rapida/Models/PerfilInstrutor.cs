using System.ComponentModel.DataAnnotations;

namespace Cnh_rapida.Models;

public class PerfilInstrutor
{
    public int Id { get; set; }

    [Required]
    public string UsuarioId { get; set; } = string.Empty;

    public Usuario Usuario { get; set; } = null!;

    public int? AutoEscolaId { get; set; }
    public virtual AutoEscola? AutoEscola { get; set; }

    // CNH profissional
    [Required]
    [StringLength(11, MinimumLength = 11)]
    [RegularExpression(@"^\d{11}$", ErrorMessage = "CNH deve conter 11 números")]
    public string Cnh { get; set; } = string.Empty;

    // Categoria permitida para instrução
    [Required]
    [RegularExpression(@"^(A|B|AB|C|D|E)$")]
    public string Categoria { get; set; } = string.Empty;

    // Registro profissional do DETRAN
    [Required]
    [MaxLength(30)]
    public string RegistroDetran { get; set; } = string.Empty;

    // Instrutor pode estar ativo ou suspenso
    public bool Ativo { get; set; } = true;

    // Data que começou na autoescola
    public DateTime DataContratacao { get; set; } = DateTime.UtcNow;

    // Data validade da CNH
    [Required]
    public DateTime DataValidadeCnh { get; set; }

    // Observações administrativas
    [MaxLength(500)]
    public string? Observacoes { get; set; }

    public bool DocumentosAprovados { get; set; } = false;
}