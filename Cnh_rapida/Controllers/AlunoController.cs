using Cnh_rapida.Data;
using Cnh_rapida.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Cnh_rapida.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Aluno")]
public class AlunoController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AlunoController(ApplicationDbContext context)
    {
        _context = context;
    }

    private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet("status")]
    public async Task<IActionResult> GetStatus()
    {
        var status = await _context.AlunoCnhStatus
            .Include(a => a.AutoEscola)
            .FirstOrDefaultAsync(s => s.UsuarioId == GetUserId());

        if (status == null)
        {
            return NotFound(new { message = "Status não encontrado." });
        }

        // Return a simplified anonymous object or DTO
        return Ok(new
        {
            status.Id,
            status.PossuiContaGov,
            status.ProcessoIniciadoDetran,
            status.ExameMedicoRealizado,
            status.ExameTeoricoRealizado,
            status.AulasPraticasIniciadas,
            status.ExamesEnviados,
            status.ExameMedicoAprovado,
            status.ExameTeoricoAprovado,
            status.DocumentosAprovados,
            status.UltimaAtualizacao,
            AutoEscolaNome = status.AutoEscola?.NomeFantasia
        });
    }

    [HttpGet("minhas-aulas")]
    public async Task<IActionResult> MinhasAulas()
    {
        var status = await _context.AlunoCnhStatus
            .Include(s => s.AulasPraticas)
            .FirstOrDefaultAsync(s => s.UsuarioId == GetUserId());

        if (status == null) return NotFound(new { message = "Aluno não encontrado." });

        var aulas = status.AulasPraticas.Select(a => new
        {
            a.Id,
            Data = a.Data,
            a.QuantidadeHoras,
            Concluida = a.Realizada
        }).ToList();

        return Ok(aulas);
    }
}
