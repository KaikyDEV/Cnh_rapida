using System.ComponentModel.DataAnnotations;

namespace Cnh_rapida.Models;

public enum StatusDocumento
{
    Pendente,
    Aprovado,
    Rejeitado
}

public class DocumentoUsuario
{
    public int Id { get; set; }

    [Required]
    public string UsuarioId { get; set; } = string.Empty;
    public virtual Usuario Usuario { get; set; } = null!;

    [Required]
    [MaxLength(100)]
    public string TipoDocumento { get; set; } = string.Empty; // Ex: "RG", "CNH", "Comprovante Residência"

    [Required]
    public string UrlArquivo { get; set; } = string.Empty;

    public StatusDocumento Status { get; set; } = StatusDocumento.Pendente;

    public string? Observacao { get; set; }

    public DateTime DataUpload { get; set; } = DateTime.UtcNow;
}
