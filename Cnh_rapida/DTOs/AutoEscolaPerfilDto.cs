namespace Cnh_rapida.DTOs;

public class AutoEscolaPerfilDto
{
    public int Id { get; set; }
    public string NomeFantasia { get; set; } = string.Empty;
    public string CNPJ { get; set; } = string.Empty;
    public string? Endereco { get; set; }
    public string? Cidade { get; set; }
    public bool DocumentosAprovados { get; set; }
    public string Email { get; set; } = string.Empty;
}
