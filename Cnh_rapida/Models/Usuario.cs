using Microsoft.AspNetCore.Identity;

namespace Cnh_rapida.Models;

public class Usuario : IdentityUser
{
    // Informações pessoais
    public string NomeCompleto { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public DateTime? DataNascimento { get; set; }
    public string? CPF { get; set; }

    // Data de registro no sistema
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    public int? AutoEscolaId { get; set; }
    public virtual AutoEscola? AutoEscola { get; set; }

    // Navegação para relacionamentos futuros (exemplo: CNH)
    public virtual AlunoCnhStatus? AlunoCnhStatus { get; set; }

    // Método auxiliar para mostrar nome ou email
    public string NomeOuEmail => string.IsNullOrWhiteSpace(NomeCompleto) ? Email! : NomeCompleto;
}