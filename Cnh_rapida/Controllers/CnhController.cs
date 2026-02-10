using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Cnh_rapida.Models;
using Cnh_rapida.Data;



[Authorize(Roles = "Aluno")]
public class CnhController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<Usuario> _userManager;

    public CnhController(
        ApplicationDbContext context,
        UserManager<Usuario> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<IActionResult> Etapas()
    {
        var user = await _userManager.GetUserAsync(User);

        var status = _context.AlunoCnhStatus
            .FirstOrDefault(x => x.UsuarioId == user!.Id);

        return View(status);
    }
}
