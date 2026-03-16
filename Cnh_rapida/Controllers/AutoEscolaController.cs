using Cnh_rapida.Data;
using Cnh_rapida.DTOs;
using Cnh_rapida.Models;
using Cnh_rapida.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Cnh_rapida.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AutoEscolaController : ControllerBase
{
    private readonly IAutoEscolaRobustaService _autoEscolaService;

    public AutoEscolaController(IAutoEscolaRobustaService autoEscolaService)
    {
        _autoEscolaService = autoEscolaService;
    }

    private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet("perfil")]
    [Authorize(Roles = "AutoEscola")]
    public async Task<IActionResult> Perfil()
    {
        var perfil = await _autoEscolaService.GetPerfilAsync(GetUserId());
        return Ok(perfil);
    }

    [HttpGet("instrutores")]
    [Authorize(Roles = "AutoEscola")]
    public async Task<IActionResult> ListarInstrutores()
    {
        var perfil = await _autoEscolaService.GetPerfilAsync(GetUserId());
        var instrutores = await _autoEscolaService.ListarInstrutoresAsync(perfil.Id);
        return Ok(instrutores);
    }

    [HttpGet("alunos")]
    [Authorize(Roles = "AutoEscola")]
    public async Task<IActionResult> ListarAlunos()
    {
        var perfil = await _autoEscolaService.GetPerfilAsync(GetUserId());
        var alunos = await _autoEscolaService.ListarAlunosAsync(perfil.Id);
        return Ok(alunos);
    }

    [HttpPost("vincular-aluno")]
    [Authorize(Roles = "AutoEscola")]
    public async Task<IActionResult> VincularAluno([FromBody] VincularRequestDto dto)
    {
        var perfil = await _autoEscolaService.GetPerfilAsync(GetUserId());
        await _autoEscolaService.VincularAlunoAsync(perfil.Id, dto.Identificador);
        return Ok(new { message = "Aluno vinculado com sucesso!" });
    }

    [HttpPost("vincular-instrutor")]
    [Authorize(Roles = "AutoEscola")]
    public async Task<IActionResult> VincularInstrutor([FromBody] VincularRequestDto dto)
    {
        var perfil = await _autoEscolaService.GetPerfilAsync(GetUserId());
        await _autoEscolaService.VincularInstrutorAsync(perfil.Id, dto.Identificador);
        return Ok(new { message = "Instrutor vinculado com sucesso!" });
    }

    [HttpDelete("desvincular-instrutor/{id}")]
    [Authorize(Roles = "AutoEscola")]
    public async Task<IActionResult> DesvincularInstrutor(int id)
    {
        var perfil = await _autoEscolaService.GetPerfilAsync(GetUserId());
        await _autoEscolaService.DesvincularInstrutorAsync(perfil.Id, id);
        return Ok(new { message = "Instrutor desvinculado com sucesso!" });
    }

    // --- NOVAS ROTAS PARA O ALUNO ---

    [HttpGet("lista")]
    [Authorize(Roles = "Aluno")]
    public async Task<IActionResult> ListarEscolasParaAluno()
    {
        var escolas = await _autoEscolaService.ListarTodasEscolasAsync();
        return Ok(escolas);
    }

    [HttpPost("selecionar/{id}")]
    [Authorize(Roles = "Aluno")]
    public async Task<IActionResult> SelecionarEscola(int id)
    {
        await _autoEscolaService.SelecionarEscolaPeloAlunoAsync(GetUserId(), id);
        return Ok(new { message = "Auto escola selecionada com sucesso!" });
    }

    [HttpGet("instrutor/{id}")]
    [Authorize(Roles = "AutoEscola")]
    public async Task<IActionResult> ObterPerfilInstrutor(int id)
    {
        var perfilAutoEscola = await _autoEscolaService.GetPerfilAsync(GetUserId());
        var instrutor = await _autoEscolaService.BuscarPerfilInstrutorAsync(perfilAutoEscola.Id, id);
        return Ok(instrutor);
    }

    [HttpGet("aluno/{id}")]
    [Authorize(Roles = "AutoEscola")]
    public async Task<IActionResult> ObterProgressoAluno(int id)
    {
        var perfilAutoEscola = await _autoEscolaService.GetPerfilAsync(GetUserId());
        var progresso = await _autoEscolaService.BuscarProgressoAlunoAsync(perfilAutoEscola.Id, id);
        return Ok(progresso);
    }
}
