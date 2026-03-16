using Cnh_rapida.Data;
using Cnh_rapida.DTOs;
using Cnh_rapida.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[ApiController]
[Route("api/aluno")]
[Authorize]
public class AlunoController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<Usuario> _userManager;

    public AlunoController(ApplicationDbContext context, UserManager<Usuario> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // 🔎 Buscar status
    [Authorize(Roles = "Aluno")]
    [HttpGet("status")]
    public async Task<IActionResult> Status()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var status = await _context.AlunoCnhStatus
            .Where(x => x.UsuarioId == userId)
            .OrderByDescending(x => x.UltimaAtualizacao)
            .FirstOrDefaultAsync();

        if (status == null)
            return NotFound(new { message = "Status não encontrado" });

        return Ok(new
        {
            status.Id,
            status.PossuiContaGov,
            status.ProcessoIniciadoDetran,
            status.ExameMedicoRealizado,
            status.ExameTeoricoRealizado,
            status.AulasPraticasIniciadas,
            status.PrimeiroAcesso,
            status.ExamesEnviados,
            status.ExameMedicoAprovado,
            status.ExameTeoricoAprovado,
            status.DocumentosAprovados,
            status.UltimaAtualizacao,
            status.UsuarioId
        });
    }

    // 📅 Agendar aula
    [Authorize(Roles = "Aluno")]
    [HttpPost("agendar-aula")]
    public async Task<IActionResult> AgendarAula([FromBody] AgendarAulaDto dto)
    {
        if (dto.Horas < 2)
            return BadRequest(new { message = "Mínimo 2 horas por aula." });

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var status = await _context.AlunoCnhStatus
            .FirstOrDefaultAsync(x => x.UsuarioId == userId);

        if (status == null)
            return NotFound(new { message = "Status não encontrado" });

        // 🔒 Aluno deve ter documentos aprovados
        if (!status.DocumentosAprovados)
            return BadRequest(new { message = "Você precisa ter seus documentos aprovados antes de agendar aulas práticas." });

        var aula = new AulaPratica
        {
            AlunoCnhStatusId = status.Id,
            Data = dto.Data,
            QuantidadeHoras = dto.Horas
        };

        // 🔥 Associar instrutor se fornecido
        if (!string.IsNullOrEmpty(dto.InstrutorId))
        {
            var perfil = await _context.PerfisInstrutor
                .FirstOrDefaultAsync(p => p.UsuarioId == dto.InstrutorId);

            if (perfil == null)
                return BadRequest(new { message = "Instrutor não encontrado." });

            // 🔒 Instrutor deve ter documentos aprovados
            if (!perfil.DocumentosAprovados)
                return BadRequest(new { message = "O instrutor selecionado ainda não teve seus documentos aprovados. Por favor, escolha outro instrutor." });

            aula.InstrutorPerfilId = perfil.Id;
        }

        _context.AulasPraticas.Add(aula);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Aula solicitada com sucesso" });
    }

    // 📋 Listar aulas
    [Authorize(Roles = "Aluno")]
    [HttpGet("minhas-aulas")]
    public async Task<IActionResult> MinhasAulas()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var status = await _context.AlunoCnhStatus
            .FirstOrDefaultAsync(x => x.UsuarioId == userId);

        if (status == null)
            return NotFound();

        var aulas = await _context.AulasPraticas
            .Where(x => x.AlunoCnhStatusId == status.Id)
            .Select(x => new AulaPraticaResponseDto
            {
                Id = x.Id,
                Data = x.Data,
                QuantidadeHoras = x.QuantidadeHoras,
                Realizada = x.Realizada
            })
            .ToListAsync();

        return Ok(aulas);
    }

    [Authorize(Roles = "Aluno,Instrutor,AutoEscola,Admin")]
    [HttpGet("instrutores")]
    public async Task<IActionResult> ListarInstrutores()
    {
        var instrutores = await _context.PerfisInstrutor
            .Where(i => i.Ativo)
            .Select(i => new
            {
                usuario = new
                {
                    id = i.UsuarioId,
                    nomeCompleto = i.Usuario.NomeCompleto
                },
                especialidade = "Instrutor " + i.Categoria,
                avaliacao = 4.8, // Mock por enquanto
                aulasMinistradas = 150 // Mock por enquanto
            })
            .ToListAsync();

        return Ok(instrutores);
    }
}