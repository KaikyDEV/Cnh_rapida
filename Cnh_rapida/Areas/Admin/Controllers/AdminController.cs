using Cnh_rapida.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cnh_rapida.Areas.Admin.Controllers;

[Area("Admin")]
[Authorize(Roles = "Admin")]
public class AdminController : Controller
{
    private readonly ApplicationDbContext _context;

    public AdminController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> ValidarExameTeorico()
    {
        var pendentes = await _context.AlunoCnhStatus
            .Include(x => x.Usuario)
            .Where(x =>
                x.ExameTeoricoRealizado &&
                !x.ExameTeoricoAprovado)
            .OrderBy(x => x.DataEnvioExameTeorico)
            .ToListAsync();

        return View(pendentes);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> AprovarExameTeorico(int id)
    {
        var status = await _context.AlunoCnhStatus.FindAsync(id);

        if (status == null)
            return NotFound();

        status.ExameTeoricoAprovado = true;
        status.UltimaAtualizacao = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        TempData["Sucesso"] = "Exame teórico aprovado com sucesso!";

        return RedirectToAction(nameof(ValidarExameTeorico));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ReprovarExameTeorico(int id)
    {
        var status = await _context.AlunoCnhStatus.FindAsync(id);

        if (status == null)
            return NotFound();

        status.ExameTeoricoRealizado = false;
        status.CaminhoExameTeorico = null;
        status.DataEnvioExameTeorico = null;
        status.UltimaAtualizacao = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        TempData["Erro"] = "Exame teórico reprovado. O aluno deverá reenviar o comprovante.";

        return RedirectToAction(nameof(ValidarExameTeorico));
    }


    // 📋 Lista exames pendentes de validação
    public async Task<IActionResult> ValidarExames()
    {
        var pendentes = await _context.AlunoCnhStatus
            .Include(x => x.Usuario)
            .Where(x => x.ExamesEnviados && !x.ExameMedicoAprovado)
            .OrderBy(x => x.DataEnvioExames)
            .ToListAsync();

        return View(pendentes);
    }

    //
    [HttpPost]
    public async Task<IActionResult> AprovarExames(int id)
    {
        try
        {
            Console.WriteLine("🔥 ENTROU — ID = " + id);

            var status = await _context.AlunoCnhStatus.FindAsync(id);

            if (status == null)
            {
                Console.WriteLine("❌ STATUS NULL");
                return BadRequest("Status não encontrado");
            }

            status.ExameMedicoAprovado = true;
            status.ExameMedicoRealizado = true;
            status.UltimaAtualizacao = DateTime.Now;

            await _context.SaveChangesAsync();

            Console.WriteLine("✅ SALVO COM SUCESSO");

            return RedirectToAction("ValidarExames", "Admin", new { area = "Admin" });
        }
        catch (Exception ex)
        {
            Console.WriteLine("💥 ERRO: " + ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, ex.Message);
        }
    }

    // ❌ Rejeitar exames
    [HttpPost]
    public async Task<IActionResult> RejeitarExames(int id)
    {
        var status = await _context.AlunoCnhStatus.FindAsync(id);
        if (status == null)
            return NotFound();

        status.ExamesEnviados = false;
        status.ExameMedicoAprovado = false;
        status.ExameMedicoRealizado = false;
        status.CaminhoExameMedico = null;
        status.CaminhoPsicotecnico = null;
        status.UltimaAtualizacao = DateTime.Now;

        await _context.SaveChangesAsync();

        return RedirectToAction("ValidarExames", "Admin", new { area = "Admin" });
 
   }

    public async Task<IActionResult> HistoricoExames(
    string busca,
    string status,
    DateTime? dataInicio,
    DateTime? dataFim)
    {
        var query = _context.AlunoCnhStatus
            .Include(x => x.Usuario)
            .AsQueryable();

        // 🔎 Filtro por nome
        if (!string.IsNullOrEmpty(busca))
            query = query.Where(x => x.Usuario.NomeCompleto.Contains(busca));

        // 🏷️ Filtro por status
        if (!string.IsNullOrEmpty(status))
        {
            if (status == "pendente")
                query = query.Where(x => x.ExamesEnviados && !x.ExameMedicoAprovado);

            if (status == "aprovado")
                query = query.Where(x => x.ExameMedicoAprovado);

            if (status == "rejeitado")
                query = query.Where(x => !x.ExamesEnviados && !x.ExameMedicoAprovado);
        }

        // 📅 Filtro por data
        if (dataInicio.HasValue)
            query = query.Where(x => x.DataEnvioExames >= dataInicio);

        if (dataFim.HasValue)
            query = query.Where(x => x.DataEnvioExames <= dataFim);

        var resultado = await query
            .OrderByDescending(x => x.UltimaAtualizacao)
            .ToListAsync();

        return View(resultado);
    }

    public async Task<IActionResult> HistoricoExameTeorico(
    string busca,
    string status,
    DateTime? dataInicio,
    DateTime? dataFim)
    {
        var query = _context.AlunoCnhStatus
            .Include(x => x.Usuario)
            .AsQueryable();

        // 🔎 Filtro por nome
        if (!string.IsNullOrEmpty(busca))
            query = query.Where(x => x.Usuario.NomeCompleto.Contains(busca));

        // 🏷️ Filtro por status
        if (!string.IsNullOrEmpty(status))
        {
            if (status == "pendente")
                query = query.Where(x => x.ExameTeoricoRealizado && !x.ExameTeoricoAprovado);

            if (status == "aprovado")
                query = query.Where(x => x.ExameTeoricoAprovado);

            if (status == "rejeitado")
                query = query.Where(x => !x.ExameTeoricoRealizado && x.CaminhoExameTeorico == null);
        }

        // 📅 Filtro por data
        if (dataInicio.HasValue)
            query = query.Where(x => x.DataEnvioExameTeorico >= dataInicio);

        if (dataFim.HasValue)
            query = query.Where(x => x.DataEnvioExameTeorico <= dataFim);

        var resultado = await query
            .OrderByDescending(x => x.UltimaAtualizacao)
            .ToListAsync();

        return View(resultado);
    }
}