using Cnh_rapida.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cnh_rapida.Models;

namespace Cnh_rapida.Areas.Admin.Controllers;

[Area("Admin")]
[Route("api/admin")]
[ApiController]
[Authorize(Roles = "Admin")]
public class AdminApiController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminApiController(ApplicationDbContext context)
    {
        _context = context;
    }

    // 📋 Lista exames teóricos pendentes
    [HttpGet("exame-teorico/pendentes")]
    public async Task<ActionResult<IEnumerable<AlunoCnhStatus>>> ValidarExameTeorico()
    {
        var pendentes = await _context.AlunoCnhStatus
            .Include(x => x.Usuario)
            .Where(x => x.ExameTeoricoRealizado && !x.ExameTeoricoAprovado)
            .OrderBy(x => x.DataEnvioExameTeorico)
            .ToListAsync();

        return Ok(pendentes);
    }

    // ✅ Aprovar exame teórico
    [HttpPost("exame-teorico/aprovar/{id}")]
    public async Task<ActionResult> AprovarExameTeorico(int id)
    {
        var status = await _context.AlunoCnhStatus.FindAsync(id);
        if (status == null) return NotFound("Status não encontrado");

        status.ExameTeoricoAprovado = true;
        status.UltimaAtualizacao = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Exame teórico aprovado com sucesso" });
    }

    // ❌ Reprovar exame teórico
    [HttpPost("exame-teorico/reprovar/{id}")]
    public async Task<ActionResult> ReprovarExameTeorico(int id)
    {
        var status = await _context.AlunoCnhStatus.FindAsync(id);
        if (status == null) return NotFound("Status não encontrado");

        status.ExameTeoricoRealizado = false;
        status.CaminhoExameTeorico = null;
        status.DataEnvioExameTeorico = null;
        status.UltimaAtualizacao = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Exame teórico reprovado. O aluno deverá reenviar o comprovante." });
    }

    // 📋 Lista exames médicos pendentes
    [HttpGet("exames/pendentes")]
    public async Task<ActionResult<IEnumerable<AlunoCnhStatus>>> ValidarExames()
    {
        var pendentes = await _context.AlunoCnhStatus
            .Include(x => x.Usuario)
            .Where(x => x.ExamesEnviados && !x.ExameMedicoAprovado)
            .OrderBy(x => x.DataEnvioExames)
            .ToListAsync();

        return Ok(pendentes);
    }

    // ✅ Aprovar exames médicos
    [HttpPost("exames/aprovar/{id}")]
    public async Task<ActionResult> AprovarExames(int id)
    {
        var status = await _context.AlunoCnhStatus.FindAsync(id);
        if (status == null) return NotFound("Status não encontrado");

        status.ExameMedicoAprovado = true;
        status.ExameMedicoRealizado = true;
        status.UltimaAtualizacao = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Exames aprovados com sucesso" });
    }

    // ❌ Rejeitar exames médicos
    [HttpPost("exames/rejeitar/{id}")]
    public async Task<ActionResult> RejeitarExames(int id)
    {
        var status = await _context.AlunoCnhStatus.FindAsync(id);
        if (status == null) return NotFound("Status não encontrado");

        status.ExamesEnviados = false;
        status.ExameMedicoAprovado = false;
        status.ExameMedicoRealizado = false;
        status.CaminhoExameMedico = null;
        status.CaminhoPsicotecnico = null;
        status.UltimaAtualizacao = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Exames rejeitados com sucesso" });
    }

    // 📜 Histórico exames médicos
    [HttpGet("exames/historico")]
    public async Task<ActionResult<IEnumerable<AlunoCnhStatus>>> HistoricoExames(
        string? busca,
        string? status,
        DateTime? dataInicio,
        DateTime? dataFim)
    {
        var query = _context.AlunoCnhStatus
            .Include(x => x.Usuario)
            .AsQueryable();

        if (!string.IsNullOrEmpty(busca))
            query = query.Where(x => x.Usuario.NomeCompleto.Contains(busca));

        if (!string.IsNullOrEmpty(status))
        {
            if (status == "pendente") query = query.Where(x => x.ExamesEnviados && !x.ExameMedicoAprovado);
            if (status == "aprovado") query = query.Where(x => x.ExameMedicoAprovado);
            if (status == "rejeitado") query = query.Where(x => !x.ExamesEnviados && !x.ExameMedicoAprovado);
        }

        if (dataInicio.HasValue) query = query.Where(x => x.DataEnvioExames >= dataInicio);
        if (dataFim.HasValue) query = query.Where(x => x.DataEnvioExames <= dataFim);

        var resultado = await query
            .OrderByDescending(x => x.UltimaAtualizacao)
            .ToListAsync();

        return Ok(resultado);
    }

    // 📜 Histórico exames teóricos
    [HttpGet("exame-teorico/historico")]
    public async Task<ActionResult<IEnumerable<AlunoCnhStatus>>> HistoricoExameTeorico(
        string? busca,
        string? status,
        DateTime? dataInicio,
        DateTime? dataFim)
    {
        var query = _context.AlunoCnhStatus
            .Include(x => x.Usuario)
            .AsQueryable();

        if (!string.IsNullOrEmpty(busca))
            query = query.Where(x => x.Usuario.NomeCompleto.Contains(busca));

        if (!string.IsNullOrEmpty(status))
        {
            if (status == "pendente") query = query.Where(x => x.ExameTeoricoRealizado && !x.ExameTeoricoAprovado);
            if (status == "aprovado") query = query.Where(x => x.ExameTeoricoAprovado);
            if (status == "rejeitado") query = query.Where(x => !x.ExameTeoricoRealizado && x.CaminhoExameTeorico == null);
        }

        if (dataInicio.HasValue) query = query.Where(x => x.DataEnvioExameTeorico >= dataInicio);
        if (dataFim.HasValue) query = query.Where(x => x.DataEnvioExameTeorico <= dataFim);

        var resultado = await query
            .OrderByDescending(x => x.UltimaAtualizacao)
            .ToListAsync();

        return Ok(resultado);
    }
}