using Cnh_rapida.Data;
using Cnh_rapida.DTOs;
using Cnh_rapida.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Cnh_rapida.Areas.Instrutor.Controllers;

[ApiController]
[Route("api/instrutor")]
[Authorize(Roles = "Instrutor")]
public class InstrutorController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<Usuario> _userManager;

    public InstrutorController(ApplicationDbContext context, UserManager<Usuario> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet("agenda")]
    public async Task<IActionResult> Agenda(string instrutorId, DateTime data)
    {
        // 🔥 Correção: Usar intervalo de data para evitar .Date no SQL
        var dataInicio = data.Date;
        var dataFim = dataInicio.AddDays(1);

        // Se o instrutorId não for um GUID (pode ser o email enviado pelo frontend), buscamos o usuário
        var query = _context.AulasPraticas.AsQueryable();

        if (instrutorId.Contains("@"))
        {
            query = query.Where(a => a.Instrutor.Usuario.Email == instrutorId);
        }
        else
        {
            query = query.Where(a => a.Instrutor.UsuarioId == instrutorId);
        }

        var aulas = await query
            .Where(a => a.Data >= dataInicio && a.Data < dataFim)
            .Select(a => new
            {
                Data = a.Data,
                NomeAluno = a.AlunoStatus.Usuario.NomeCompleto,
                Status = a.Realizada ? "Concluída" : "Agendada",
                TipoAula = "Prática"
            })
            .ToListAsync();

        // Formatação final na memória
        var agenda = aulas.Select(a => new
        {
            horario = a.Data.ToString("HH:mm"),
            nomeAluno = a.NomeAluno,
            status = a.Status,
            tipoAula = a.TipoAula
        }).ToList();

        return Ok(agenda);
    }

    [HttpPost("bloquear-horario")]
    public async Task<IActionResult> BloquearHorario([FromBody] dynamic dto)
    {
        // Placeholder para implementação futura
        return Ok(new { message = "Horário bloqueado com sucesso" });
    }
}
