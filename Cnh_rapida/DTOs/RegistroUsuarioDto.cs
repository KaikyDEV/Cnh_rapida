using System.ComponentModel.DataAnnotations;

namespace Cnh_rapida.DTOs;

public class RegistroUsuarioDto
{
    [Required(ErrorMessage = "Email é obrigatório.")]
    [EmailAddress(ErrorMessage = "Email inválido.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Senha é obrigatória.")]
    [MinLength(6, ErrorMessage = "Senha deve ter no mínimo 6 caracteres.")]
    public string Senha { get; set; } = string.Empty;

    [Required(ErrorMessage = "Nome completo é obrigatório.")]
    [MaxLength(200)]
    public string NomeCompleto { get; set; } = string.Empty;

    [Phone(ErrorMessage = "Telefone inválido.")]
    public string? PhoneNumber { get; set; }

    [Required(ErrorMessage = "Tipo de conta é obrigatório.")]
    [RegularExpression(@"^(Aluno|Instrutor|AutoEscola)$", ErrorMessage = "Tipo de conta inválido.")]
    public string TipoConta { get; set; } = string.Empty;

    public string Estado { get; set; } = string.Empty;
    public DateTime? DataNascimento { get; set; }

    [RegularExpression(@"^\d{11}$", ErrorMessage = "CPF deve conter exatamente 11 dígitos numéricos.")]
    public string? CPF { get; set; }

    // Campos exclusivos para Auto Escola
    [MaxLength(200)]
    public string? NomeFantasia { get; set; }

    [MaxLength(200)]
    public string? RazaoSocial { get; set; }

    [RegularExpression(@"^\d{14}$", ErrorMessage = "CNPJ deve conter exatamente 14 dígitos numéricos.")]
    public string? CNPJ { get; set; }
}

