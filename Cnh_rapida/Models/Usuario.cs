using Microsoft.AspNetCore.Identity;

namespace Cnh_rapida.Models;

public class Usuario : IdentityUser
{
    // Informações pessoais
    public string NomeCompleto { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public DateTime DataNascimento { get; set; } // opcional
    public string CPF { get; set; } = string.Empty; // opcional

    // Data de registro no sistema
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    // Navegação para relacionamentos futuros (exemplo: CNH)
    public virtual AlunoCnhStatus? AlunoCnhStatus { get; set; }

    // Método auxiliar para mostrar nome ou email
    public string NomeOuEmail => string.IsNullOrWhiteSpace(NomeCompleto) ? Email! : NomeCompleto;
}