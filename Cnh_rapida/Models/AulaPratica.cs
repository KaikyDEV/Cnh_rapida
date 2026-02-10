namespace Cnh_rapida.Models;

public class AulaPratica
{
    public int Id { get; set; }

    public int AlunoCnhStatusId { get; set; }
    public virtual AlunoCnhStatus AlunoStatus { get; set; }

    public DateTime Data { get; set; }

    public int QuantidadeHoras { get; set; } // mínimo 2

    public bool Confirmada { get; set; } = false;
    public bool Realizada { get; set; } = false;

    public string? Observacao { get; set; }

    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

    public bool Aprovada { get; set; } = false;
}