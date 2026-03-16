using System.ComponentModel.DataAnnotations;

namespace Cnh_rapida.Models;

public class AutoEscola
{
    public int Id { get; set; }

    [Required]
    public string UsuarioId { get; set; } = string.Empty;
    public virtual Usuario Usuario { get; set; } = null!;

    [Required]
    [MaxLength(200)]
    public string NomeFantasia { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string RazaoSocial { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string CNPJ { get; set; } = string.Empty;

    public string? Endereco { get; set; }
    public string? Cidade { get; set; }
    public string? Estado { get; set; }
    public string? Telefone { get; set; }
    public string? EmailContato { get; set; }

    public bool Ativo { get; set; } = false;
    public bool DocumentosAprovados { get; set; } = false;

    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    // Relacionamentos
    public virtual ICollection<AlunoCnhStatus> Alunos { get; set; } = new List<AlunoCnhStatus>();
    public virtual ICollection<PerfilInstrutor> Instrutores { get; set; } = new List<PerfilInstrutor>();
}
