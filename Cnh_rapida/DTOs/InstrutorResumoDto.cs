namespace Cnh_rapida.DTOs;

public class InstrutorResumoDto
{
    public int Id { get; set; }
    public string NomeCompleto { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool Ativo { get; set; }
    public bool DocumentosAprovados { get; set; }
}
