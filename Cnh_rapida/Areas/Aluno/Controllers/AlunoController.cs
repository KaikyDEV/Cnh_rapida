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
[Authorize(Roles = "Aluno")]
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

        return Ok(status);
    }

    // 📅 Agendar aula
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

        var aula = new AulaPratica
        {
            AlunoCnhStatusId = status.Id,
            Data = dto.Data,
            QuantidadeHoras = dto.Horas
        };

        _context.AulasPraticas.Add(aula);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Aula solicitada com sucesso" });
    }

    // 📋 Listar aulas
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

    [HttpGet("instrutor/instrutores")]
    public async Task<IActionResult> ListarInstrutores()
    {
        var instrutores = await _context.PerfisInstrutor
            .Where(i => i.Ativo)
            .Select(i => new
            {
                id = i.Id,
                nome = i.Usuario.NomeCompleto,
                categoria = i.Categoria
            })
            .ToListAsync();

        return Ok(instrutores);
    }

[HttpGet("instrutor/agenda")]
public async Task<IActionResult> Agenda(int instrutorId, DateTime data)
{
    var agenda = await _context.AulasPraticas
        .Where(a => a.InstrutorPerfilId == instrutorId && a.Data.Date == data.Date)
        .Select(a => new
        {
            horario = a.Data.ToString("HH:mm"),
            nomeAluno = a.AlunoStatus.Usuario.NomeCompleto,
            status = a.Realizada ? "Concluída" : "Agendada",
            tipoAula = "Prática"
        })
        .ToListAsync();

    return Ok(agenda);
}
}