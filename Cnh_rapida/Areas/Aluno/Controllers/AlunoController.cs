using Cnh_rapida.Data;
using Cnh_rapida.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[Area("Aluno")]
[Authorize(Roles = "Aluno")]
public class AlunoController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<Usuario> _userManager;

    public AlunoController(ApplicationDbContext context, UserManager<Usuario> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<IActionResult> Etapas()
    {
        var user = await _userManager.GetUserAsync(User);

        var status = await _context.AlunoCnhStatus
            .Where(x => x.UsuarioId == user.Id)
            .OrderByDescending(x => x.UltimaAtualizacao)
            .FirstOrDefaultAsync();

        if (status == null)
            return NotFound();

        return View(status);
    }

    [HttpGet]
    [AllowAnonymous]
    public IActionResult ConfirmarExameMedico()
    {
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ConfirmarExameMedico(
IFormFile exameMedico,
IFormFile psicotecnico)
    {
        if (exameMedico == null || psicotecnico == null)
        {
            TempData["Erro"] = "Envie todos os arquivos.";
            return RedirectToAction(nameof(ConfirmarExameMedico));
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var status = await _context.AlunoCnhStatus
            .FirstOrDefaultAsync(x => x.UsuarioId == userId);

        if (status == null)
            return NotFound();

        var pasta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "exames", userId);

        if (!Directory.Exists(pasta))
            Directory.CreateDirectory(pasta);

        string nomeExame = $"medico_{DateTime.Now.Ticks}{Path.GetExtension(exameMedico.FileName)}";
        string nomePsico = $"psico_{DateTime.Now.Ticks}{Path.GetExtension(psicotecnico.FileName)}";

        var caminhoMedico = Path.Combine(pasta, nomeExame);
        var caminhoPsico = Path.Combine(pasta, nomePsico);

        using (var stream = new FileStream(caminhoMedico, FileMode.Create))
            await exameMedico.CopyToAsync(stream);

        using (var stream = new FileStream(caminhoPsico, FileMode.Create))
            await psicotecnico.CopyToAsync(stream);

        status.CaminhoExameMedico = $"/uploads/exames/{userId}/{nomeExame}";
        status.CaminhoPsicotecnico = $"/uploads/exames/{userId}/{nomePsico}";
        status.ExamesEnviados = true;
        status.DataEnvioExames = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        TempData["Sucesso"] = "Exames enviados com sucesso! Aguarde validação.";

        return RedirectToAction("Index");
    }


    public IActionResult ConfirmarExameTeorico()
    {
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ConfirmarExameTeorico(IFormFile comprovante)
    {
        if (comprovante == null)
        {
            TempData["Erro"] = "Envie o comprovante da prova.";
            return RedirectToAction(nameof(ConfirmarExameTeorico));
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var status = await _context.AlunoCnhStatus
            .FirstOrDefaultAsync(x => x.UsuarioId == userId);

        if (status == null)
            return NotFound();

        var pasta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "exame-teorico", userId);

        if (!Directory.Exists(pasta))
            Directory.CreateDirectory(pasta);

        var nomeArquivo = $"teorico_{DateTime.Now.Ticks}{Path.GetExtension(comprovante.FileName)}";
        var caminho = Path.Combine(pasta, nomeArquivo);

        using (var stream = new FileStream(caminho, FileMode.Create))
            await comprovante.CopyToAsync(stream);

        status.CaminhoExameTeorico = $"/uploads/exame-teorico/{userId}/{nomeArquivo}";
        status.ExameTeoricoRealizado = true;
        status.DataEnvioExameTeorico = DateTime.UtcNow;
        status.UltimaAtualizacao = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        TempData["Sucesso"] = "Comprovante enviado! Aguarde validação.";

        return RedirectToAction(nameof(Etapas));
    }

    public IActionResult IniciarAulasPraticas()
    {
        return RedirectToAction(nameof(AgendarAula));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ConfirmarContaGov()
    {
        var user = await _userManager.GetUserAsync(User);

        var status = await _context.AlunoCnhStatus
            .Where(x => x.UsuarioId == user.Id)
            .OrderByDescending(x => x.UltimaAtualizacao)
            .FirstOrDefaultAsync();

        if (status == null)
            return NotFound();

        status.PossuiContaGov = true;
        status.PrimeiroAcesso = false;
        status.UltimaAtualizacao = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return RedirectToAction(nameof(Etapas));

    }

    [HttpGet]
    public async Task<IActionResult> AgendarAula()
    {
        var user = await _userManager.GetUserAsync(User);

        var status = await _context.AlunoCnhStatus
            .FirstOrDefaultAsync(x => x.UsuarioId == user.Id);

        if (status == null || !status.ExameTeoricoAprovado)
            return RedirectToAction(nameof(Etapas));

        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> AgendarAula(DateTime data, int horas)
    {
        if (horas < 2)
        {
            TempData["Erro"] = "O mínimo permitido é 2 horas por aula.";
            return RedirectToAction(nameof(AgendarAula));
        }

        var user = await _userManager.GetUserAsync(User);

        var status = await _context.AlunoCnhStatus
            .FirstOrDefaultAsync(x => x.UsuarioId == user.Id);

        if (status == null)
            return NotFound();

        var aula = new AulaPratica
        {
            AlunoCnhStatusId = status.Id,
            Data = data,
            QuantidadeHoras = horas
        };

        _context.AulasPraticas.Add(aula);
        await _context.SaveChangesAsync();

        TempData["Sucesso"] = "Aula solicitada! Aguarde confirmação da autoescola.";

        return RedirectToAction(nameof(MinhasAulas));
    }

    [HttpGet]
    public async Task<IActionResult> MinhasAulas()
    {
        var user = await _userManager.GetUserAsync(User);

        var status = await _context.AlunoCnhStatus
            .FirstOrDefaultAsync(x => x.UsuarioId == user.Id);

        if (status == null)
            return RedirectToAction(nameof(Etapas));

        var aulas = await _context.AulasPraticas
            .Where(x => x.AlunoCnhStatusId == status.Id)
            .OrderByDescending(x => x.Data)
            .ToListAsync();

        return View(aulas);
    }

}

