namespace Cnh_rapida.DTOs;

public class InstrutorPerfilDto
{
    public int Id { get; set; }
    public string NomeCompleto { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public string Cnh { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public string RegistroDetran { get; set; } = string.Empty;
    public bool Ativo { get; set; }
    public DateTime DataContratacao { get; set; }
    public DateTime DataValidadeCnh { get; set; }
    public string? Observacoes { get; set; }
    public bool DocumentosAprovados { get; set; }
}
