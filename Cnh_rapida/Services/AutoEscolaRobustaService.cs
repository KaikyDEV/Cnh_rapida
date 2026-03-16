using Cnh_rapida.Data;
using Cnh_rapida.DTOs;
using Cnh_rapida.Models;
using Microsoft.EntityFrameworkCore;

namespace Cnh_rapida.Services;

public class AutoEscolaRobustaService : IAutoEscolaRobustaService
{
    private readonly ApplicationDbContext _context;

    public AutoEscolaRobustaService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AutoEscolaPerfilDto> GetPerfilAsync(string usuarioId)
    {
        var autoEscola = await _context.AutoEscolas
            .Include(a => a.Usuario)
            .FirstOrDefaultAsync(a => a.UsuarioId == usuarioId);

        if (autoEscola == null) throw new KeyNotFoundException("Auto Escola não encontrada.");

        return new AutoEscolaPerfilDto
        {
            Id = autoEscola.Id,
            NomeFantasia = autoEscola.NomeFantasia,
            CNPJ = autoEscola.CNPJ,
            Endereco = autoEscola.Endereco,
            Cidade = autoEscola.Cidade,
            DocumentosAprovados = autoEscola.DocumentosAprovados,
            Email = autoEscola.Usuario.Email ?? ""
        };
    }

    public async Task<IEnumerable<InstrutorResumoDto>> ListarInstrutoresAsync(int autoEscolaId)
    {
        return await _context.PerfisInstrutor
            .Where(i => i.AutoEscolaId == autoEscolaId)
            .Select(i => new InstrutorResumoDto
            {
                Id = i.Id,
                NomeCompleto = i.Usuario.NomeCompleto,
                Email = i.Usuario.Email ?? "",
                Ativo = i.Ativo,
                DocumentosAprovados = i.DocumentosAprovados
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<AlunoResumoDto>> ListarAlunosAsync(int autoEscolaId)
    {
        return await _context.AlunoCnhStatus
            .Where(a => a.AutoEscolaId == autoEscolaId)
            .Select(a => new AlunoResumoDto
            {
                Id = a.Id,
                NomeCompleto = a.Usuario.NomeCompleto,
                Email = a.Usuario.Email ?? "",
                DocumentosAprovados = a.DocumentosAprovados,
                UltimaAtualizacao = a.UltimaAtualizacao
            })
            .ToListAsync();
    }

    public async Task VincularAlunoAsync(int autoEscolaId, string identificador)
    {
        var alunoUsuario = await _context.Users.FirstOrDefaultAsync(u => u.CPF == identificador || u.Email == identificador);
        if (alunoUsuario == null) throw new KeyNotFoundException("Aluno não encontrado.");

        var status = await _context.AlunoCnhStatus.FirstOrDefaultAsync(s => s.UsuarioId == alunoUsuario.Id);
        if (status == null) throw new InvalidOperationException("Usuário não possui perfil de aluno.");

        if (status.AutoEscolaId != null)
            throw new InvalidOperationException("Aluno já está vinculado a uma auto escola.");

        status.AutoEscolaId = autoEscolaId;
        status.UltimaAtualizacao = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    public async Task VincularInstrutorAsync(int autoEscolaId, string identificador)
    {
        var instrutorUsuario = await _context.Users.FirstOrDefaultAsync(u => u.CPF == identificador || u.Email == identificador);
        if (instrutorUsuario == null) throw new KeyNotFoundException("Instrutor não encontrado.");

        var perfil = await _context.PerfisInstrutor.FirstOrDefaultAsync(p => p.UsuarioId == instrutorUsuario.Id);
        if (perfil == null) throw new InvalidOperationException("Usuário não possui perfil de instrutor.");

        if (perfil.AutoEscolaId != null)
            throw new InvalidOperationException("Instrutor já está vinculado a uma auto escola.");

        perfil.AutoEscolaId = autoEscolaId;
        await _context.SaveChangesAsync();
    }

    public async Task DesvincularInstrutorAsync(int autoEscolaId, int instrutorId)
    {
        var perfil = await _context.PerfisInstrutor.FirstOrDefaultAsync(p => p.Id == instrutorId && p.AutoEscolaId == autoEscolaId);
        if (perfil == null) throw new KeyNotFoundException("Instrutor não encontrado nesta escola.");

        perfil.AutoEscolaId = null;
        await _context.SaveChangesAsync();
    }

    public async Task<InstrutorPerfilDto> BuscarPerfilInstrutorAsync(int autoEscolaId, int instrutorId)
    {
        var perfil = await _context.PerfisInstrutor
            .Include(p => p.Usuario)
            .FirstOrDefaultAsync(p => p.Id == instrutorId && p.AutoEscolaId == autoEscolaId);

        if (perfil == null) throw new KeyNotFoundException("Perfil do instrutor não encontrado.");

        return new InstrutorPerfilDto
        {
            Id = perfil.Id,
            NomeCompleto = perfil.Usuario.NomeCompleto,
            Email = perfil.Usuario.Email ?? "",
            Telefone = perfil.Usuario.PhoneNumber,
            Cnh = perfil.Cnh,
            Categoria = perfil.Categoria,
            RegistroDetran = perfil.RegistroDetran,
            Ativo = perfil.Ativo,
            DataContratacao = perfil.DataContratacao,
            DataValidadeCnh = perfil.DataValidadeCnh,
            Observacoes = perfil.Observacoes,
            DocumentosAprovados = perfil.DocumentosAprovados
        };
    }

    public async Task<AlunoProgressoDto> BuscarProgressoAlunoAsync(int autoEscolaId, int alunoId)
    {
        var status = await _context.AlunoCnhStatus
            .Include(a => a.Usuario)
            .FirstOrDefaultAsync(a => a.Id == alunoId && a.AutoEscolaId == autoEscolaId);

        if (status == null) throw new KeyNotFoundException("Aluno não encontrado nesta auto escola.");

        return new AlunoProgressoDto
        {
            Id = status.Id,
            NomeCompleto = status.Usuario.NomeCompleto,
            Email = status.Usuario.Email ?? "",
            PossuiContaGov = status.PossuiContaGov,
            ProcessoIniciadoDetran = status.ProcessoIniciadoDetran,
            ExamesEnviados = status.ExamesEnviados,
            ExameMedicoAprovado = status.ExameMedicoAprovado,
            ExameTeoricoAprovado = status.ExameTeoricoAprovado,
            DocumentosAprovados = status.DocumentosAprovados,
            ExameMedicoRealizado = status.ExameMedicoRealizado,
            ExameTeoricoRealizado = status.ExameTeoricoRealizado,
            AulasPraticasIniciadas = status.AulasPraticasIniciadas,
            UltimaAtualizacao = status.UltimaAtualizacao
        };
    }

    public async Task<IEnumerable<AutoEscolaListaDto>> ListarTodasEscolasAsync()
    {
        return await _context.AutoEscolas
            .Where(a => a.DocumentosAprovados)
            .Select(a => new AutoEscolaListaDto
            {
                Id = a.Id,
                NomeFantasia = a.NomeFantasia,
                Cidade = a.Cidade,
                Endereco = a.Endereco
            })
            .ToListAsync();
    }

    public async Task SelecionarEscolaPeloAlunoAsync(string alunoUsuarioId, int autoEscolaId)
    {
        var escola = await _context.AutoEscolas.FindAsync(autoEscolaId);
        if (escola == null || !escola.DocumentosAprovados)
            throw new KeyNotFoundException("Auto escola não encontrada ou não aprovada.");

        var status = await _context.AlunoCnhStatus.FirstOrDefaultAsync(s => s.UsuarioId == alunoUsuarioId);
        if (status == null) throw new InvalidOperationException("Perfil de aluno não encontrado.");

        status.AutoEscolaId = autoEscolaId;
        status.UltimaAtualizacao = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }
}
