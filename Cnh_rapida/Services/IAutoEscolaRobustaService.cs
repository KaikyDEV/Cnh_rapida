using Cnh_rapida.DTOs;

namespace Cnh_rapida.Services;

public interface IAutoEscolaRobustaService
{
    Task<AutoEscolaPerfilDto> GetPerfilAsync(string usuarioId);
    Task<IEnumerable<InstrutorResumoDto>> ListarInstrutoresAsync(int autoEscolaId);
    Task<IEnumerable<AlunoResumoDto>> ListarAlunosAsync(int autoEscolaId);
    Task VincularAlunoAsync(int autoEscolaId, string identificador);
    Task VincularInstrutorAsync(int autoEscolaId, string identificador);
    Task DesvincularInstrutorAsync(int autoEscolaId, int instrutorId);
    Task<InstrutorPerfilDto> BuscarPerfilInstrutorAsync(int autoEscolaId, int instrutorId);
    Task<AlunoProgressoDto> BuscarProgressoAlunoAsync(int autoEscolaId, int alunoId);
    
    // Funcionalidades para o aluno
    Task<IEnumerable<AutoEscolaListaDto>> ListarTodasEscolasAsync();
    Task SelecionarEscolaPeloAlunoAsync(string alunoUsuarioId, int autoEscolaId);
}
