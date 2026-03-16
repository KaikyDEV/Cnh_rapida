using Cnh_rapida.Data;
using Cnh_rapida.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Cnh_rapida.Controllers;

[ApiController]
[Route("api/documento")]
public class DocumentoController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public DocumentoController(ApplicationDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    // Constantes de validação de upload
    private static readonly string[] ExtensoesPermitidas = { ".pdf", ".jpg", ".jpeg", ".png" };
    private static readonly string[] TiposDocumentoValidos = { "RG", "CPF", "CNH", "CompResidencia", "ExameMedico", "Psicotecnico", "ExameTeorico", "CNPJ", "AlvaraFuncionamento", "CertificadoDetran" };
    private const long TamanhoMaximoBytes = 5 * 1024 * 1024; // 5 MB

    // 📤 Upload de documento
    [Authorize]
    [HttpPost("upload")]
    public async Task<IActionResult> Upload([FromForm] IFormFile arquivo, [FromForm] string tipoDocumento)
    {
        if (arquivo == null || arquivo.Length == 0)
            return BadRequest(new { message = "Arquivo não fornecido" });

        // 🔒 Validação de tamanho
        if (arquivo.Length > TamanhoMaximoBytes)
            return BadRequest(new { message = "Arquivo muito grande. Máximo permitido: 5 MB." });

        // 🔒 Validação de extensão
        var extensao = Path.GetExtension(arquivo.FileName).ToLowerInvariant();
        if (!ExtensoesPermitidas.Contains(extensao))
            return BadRequest(new { message = $"Tipo de arquivo não permitido. Extensões aceitas: {string.Join(", ", ExtensoesPermitidas)}" });

        // 🔒 Validação do tipo de documento
        if (string.IsNullOrWhiteSpace(tipoDocumento) || !TiposDocumentoValidos.Contains(tipoDocumento))
            return BadRequest(new { message = $"Tipo de documento inválido. Tipos aceitos: {string.Join(", ", TiposDocumentoValidos)}" });

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        // Criar diretório se não existir
        var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads", "documents");
        if (!Directory.Exists(uploadsPath))
            Directory.CreateDirectory(uploadsPath);

        // Nome do arquivo único
        var fileName = $"{userId}_{tipoDocumento}_{DateTime.Now.Ticks}{Path.GetExtension(arquivo.FileName)}";
        var filePath = Path.Combine(uploadsPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await arquivo.CopyToAsync(stream);
        }

        var documento = new DocumentoUsuario
        {
            UsuarioId = userId,
            TipoDocumento = tipoDocumento,
            UrlArquivo = $"/uploads/documents/{fileName}",
            Status = StatusDocumento.Pendente,
            DataUpload = DateTime.UtcNow
        };

        _context.DocumentosUsuario.Add(documento);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Documento enviado com sucesso", url = documento.UrlArquivo });
    }

    // 📋 Meus documentos
    [Authorize]
    [HttpGet("meus")]
    public async Task<IActionResult> MeusDocumentos()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var documentos = await _context.DocumentosUsuario
            .Where(d => d.UsuarioId == userId)
            .OrderByDescending(d => d.DataUpload)
            .ToListAsync();

        return Ok(documentos);
    }

    // 🔍 (Admin) Listar pendentes
    [Authorize(Roles = "Admin")]
    [HttpGet("pendentes")]
    public async Task<IActionResult> ListarPendentes()
    {
        var pendentes = await _context.DocumentosUsuario
            .Include(d => d.Usuario)
            .Where(d => d.Status == StatusDocumento.Pendente)
            .Select(d => new {
                d.Id,
                d.TipoDocumento,
                d.UrlArquivo,
                d.DataUpload,
                UsuarioNome = d.Usuario.NomeCompleto,
                UsuarioEmail = d.Usuario.Email
            })
            .ToListAsync();

        return Ok(pendentes);
    }

    // ✅ (Admin) Aprovar
    [Authorize(Roles = "Admin")]
    [HttpPost("aprovar/{id}")]
    public async Task<IActionResult> Aprovar(int id)
    {
        var doc = await _context.DocumentosUsuario.FindAsync(id);
        if (doc == null) return NotFound();

        doc.Status = StatusDocumento.Aprovado;
        await _context.SaveChangesAsync();

        // Verificar se todos os documentos necessários foram aprovados para liberar o acesso
        await VerificarLiberacaoAcesso(doc.UsuarioId);

        return Ok(new { message = "Documento aprovado" });
    }

    // ❌ (Admin) Rejeitar
    [Authorize(Roles = "Admin")]
    [HttpPost("rejeitar/{id}")]
    public async Task<IActionResult> Rejeitar(int id, [FromBody] string motivo)
    {
        var doc = await _context.DocumentosUsuario.FindAsync(id);
        if (doc == null) return NotFound();

        doc.Status = StatusDocumento.Rejeitado;
        doc.Observacao = motivo;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Documento rejeitado" });
    }

    private async Task VerificarLiberacaoAcesso(string userId)
    {
        // Regra simples: Se tiver pelo menos um documento aprovado (ou podemos ser mais específicos)
        // O usuário quer que libere quando for aprovado.
        
        var alunoStatus = await _context.AlunoCnhStatus.FirstOrDefaultAsync(s => s.UsuarioId == userId);
        if (alunoStatus != null)
        {
            alunoStatus.DocumentosAprovados = true;
            await _context.SaveChangesAsync();
            return;
        }

        var instrutorPerfil = await _context.PerfisInstrutor.FirstOrDefaultAsync(p => p.UsuarioId == userId);
        if (instrutorPerfil != null)
        {
            instrutorPerfil.DocumentosAprovados = true;
            await _context.SaveChangesAsync();
            return;
        }

        var autoEscola = await _context.AutoEscolas.FirstOrDefaultAsync(a => a.UsuarioId == userId);
        if (autoEscola != null)
        {
            autoEscola.DocumentosAprovados = true;
            await _context.SaveChangesAsync();
        }
    }
}
