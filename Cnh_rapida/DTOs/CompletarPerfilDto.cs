using System.ComponentModel.DataAnnotations;

namespace Cnh_rapida.DTOs;

public class CompletarPerfilDto
{
    [Required(ErrorMessage = "Nome completo é obrigatório.")]
    [MaxLength(200)]
    public string NomeCompleto { get; set; } = string.Empty;

    [Required(ErrorMessage = "Data de nascimento é obrigatória.")]
    public DateTime DataNascimento { get; set; }

    [Required(ErrorMessage = "CPF é obrigatório.")]
    [RegularExpression(@"^\d{11}$", ErrorMessage = "CPF deve conter exatamente 11 dígitos numéricos.")]
    public string CPF { get; set; } = string.Empty;

    [Required(ErrorMessage = "Estado é obrigatório.")]
    public string Estado { get; set; } = string.Empty;

    [Required(ErrorMessage = "Tipo de conta é obrigatório.")]
    [RegularExpression(@"^(Aluno|Instrutor|AutoEscola)$", ErrorMessage = "Tipo de conta inválido.")]
    public string TipoConta { get; set; } = string.Empty;

    // Campos exclusivos para Auto Escola
    [MaxLength(200)]
    public string? NomeFantasia { get; set; }

    [MaxLength(200)]
    public string? RazaoSocial { get; set; }

    [RegularExpression(@"^\d{14}$", ErrorMessage = "CNPJ deve conter exatamente 14 dígitos numéricos.")]
    public string? CNPJ { get; set; }
}
