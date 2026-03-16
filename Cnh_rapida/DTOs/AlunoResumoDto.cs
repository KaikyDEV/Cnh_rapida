namespace Cnh_rapida.DTOs;

public class AlunoResumoDto
{
    public int Id { get; set; }
    public string NomeCompleto { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool DocumentosAprovados { get; set; }
    public DateTime UltimaAtualizacao { get; set; }
}
