using Cnh_rapida.Data;
using Cnh_rapida.DTOs;
using Cnh_rapida.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Google.Apis.Auth;

namespace Cnh_rapida.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<Usuario> _userManager;
    private readonly SignInManager<Usuario> _signInManager;
    private readonly ApplicationDbContext _context;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;

    private readonly ILogger<AuthController> _logger;

    public AuthController(
        UserManager<Usuario> userManager,
        SignInManager<Usuario> signInManager,
        ApplicationDbContext context,
        RoleManager<IdentityRole> roleManager,
        IConfiguration configuration,
        ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _context = context;
        _roleManager = roleManager;
        _configuration = configuration;
        _logger = logger;
    }

    private string GenerateJwtToken(Usuario user, string role)
    {
        var jwtKey = _configuration["Jwt:Key"] ?? "CNHRapida_SuperSecret_JWT_Key_2024_MinLength32Chars!";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email ?? ""),
            new Claim(ClaimTypes.Name, user.UserName ?? ""),
            new Claim(ClaimTypes.Role, role),
        };

        var token = new JwtSecurityToken(
            issuer: "cnhrapida",
            audience: "cnhrapida",
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    // Tipos de conta permitidos no registro público
    private static readonly string[] TiposContaPermitidos = { "Aluno", "Instrutor", "AutoEscola" };

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegistroUsuarioDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        // 🔒 Bloquear registro como Admin ou tipo inválido
        if (string.IsNullOrWhiteSpace(dto.TipoConta) || !TiposContaPermitidos.Contains(dto.TipoConta))
            return BadRequest(new { message = $"Tipo de conta inválido. Valores permitidos: {string.Join(", ", TiposContaPermitidos)}" });

        var user = new Usuario
        {
            UserName = dto.Email,
            Email = dto.Email,
            NomeCompleto = dto.NomeCompleto,
            PhoneNumber = dto.PhoneNumber,
            Estado = dto.Estado,
            DataNascimento = dto.DataNascimento,
            CPF = dto.CPF,
            DataCriacao = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, dto.Senha);
        if (!result.Succeeded) return BadRequest(result.Errors);

        // Verificar se os papéis existem, senão cria
        string[] roles = { "Aluno", "Instrutor", "Admin", "AutoEscola" };
        foreach (var role in roles)
        {
            if (!await _roleManager.RoleExistsAsync(role))
            {
                await _roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // Adicionar ao papel correspondente
        string roleName = dto.TipoConta == "Instrutor" ? "Instrutor" : (dto.TipoConta == "AutoEscola" ? "AutoEscola" : "Aluno");
        await _userManager.AddToRoleAsync(user, roleName);

        // Criar perfil específico
        if (dto.TipoConta == "Instrutor")
        {
            var perfil = new PerfilInstrutor
            {
                UsuarioId = user.Id,
                Cnh = "",
                Categoria = "B",
                RegistroDetran = "",
                DataValidadeCnh = DateTime.UtcNow.AddYears(1),
                Ativo = false
            };
            _context.PerfisInstrutor.Add(perfil);
        }
        else if (dto.TipoConta == "AutoEscola")
        {
            var autoEscola = new AutoEscola
            {
                UsuarioId = user.Id,
                NomeFantasia = dto.NomeFantasia ?? "",
                RazaoSocial = dto.RazaoSocial ?? "",
                CNPJ = dto.CNPJ ?? "",
                Estado = dto.Estado,
                Ativo = false
            };
            _context.AutoEscolas.Add(autoEscola);
        }
        else // Aluno
        {
            var status = new AlunoCnhStatus
            {
                UsuarioId = user.Id,
                UltimaAtualizacao = DateTime.UtcNow
            };
            _context.AlunoCnhStatus.Add(status);
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Usuário registrado com sucesso" });
    }

    [Authorize(AuthenticationSchemes = "Bearer")]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var requestId = Guid.NewGuid().ToString().Substring(0, 8);
        _logger.LogInformation("[{Id}] Starting Me endpoint", requestId);
        
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            _logger.LogInformation("[{Id}] UserId from claims: {UserId}", requestId, userId);

            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogWarning("[{Id}] No UserId found in claims", requestId);
                return Unauthorized(new { message = "Token inválido ou expirado" });
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                _logger.LogWarning("[{Id}] User not found in database for ID: {UserId}", requestId, userId);
                return NotFound(new { message = "Usuário não encontrado" });
            }

            _logger.LogInformation("[{Id}] User found: {Email}. Fetching roles...", requestId, user.Email);
            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.Contains("Admin") ? "Admin" : (roles.FirstOrDefault() ?? "Aluno");
            _logger.LogInformation("[{Id}] User role: {Role}", requestId, role);

            // Buscar flags de aprovação e IDs específicos
            bool documentosAprovados = false;
            int? perfilId = null;

            _logger.LogInformation("[{Id}] Fetching profile data for role: {Role}", requestId, role);

            if (role == "Aluno")
            {
                var status = await _context.AlunoCnhStatus
                    .Where(s => s.UsuarioId == userId)
                    .Select(s => new { s.Id, s.DocumentosAprovados })
                    .FirstOrDefaultAsync();
                
                if (status != null)
                {
                    documentosAprovados = status.DocumentosAprovados;
                    perfilId = status.Id;
                }
            }
            else if (role == "Instrutor")
            {
                var perfil = await _context.PerfisInstrutor
                    .Where(p => p.UsuarioId == userId)
                    .Select(p => new { p.Id, p.DocumentosAprovados })
                    .FirstOrDefaultAsync();

                if (perfil != null)
                {
                    documentosAprovados = perfil.DocumentosAprovados;
                    perfilId = perfil.Id;
                }
            }
            else if (role == "AutoEscola")
            {
                var ae = await _context.AutoEscolas
                    .Where(a => a.UsuarioId == userId)
                    .Select(a => new { a.Id, a.DocumentosAprovados })
                    .FirstOrDefaultAsync();

                if (ae != null)
                {
                    documentosAprovados = ae.DocumentosAprovados;
                    perfilId = ae.Id;
                }
            }

            _logger.LogInformation("[{Id}] Profile data fetched. Preparing response.", requestId);

            return Ok(new
            {
                user.Id,
                user.NomeCompleto,
                user.Email,
                role,
                user.CPF,
                user.DataNascimento,
                user.Estado,
                documentosAprovados = documentosAprovados,
                perfilIncompleto = role == "Admin" ? false : (string.IsNullOrEmpty(user.CPF) || !user.DataNascimento.HasValue),
                perfilId = perfilId,
                autoEscolaId = user.AutoEscolaId
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[{Id}] Exception in Me endpoint: {Message}", requestId, ex.Message);
            return StatusCode(500, new { 
                message = "Erro interno ao processar informações do perfil", 
                details = ex.Message,
                requestId = requestId
            });
        }
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto dto)
    {
        try
        {
            var idToken = dto.IdToken;
            var clientId = _configuration["Google:ClientId"];
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { clientId }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
            if (payload == null) return BadRequest(new { message = "Token inválido" });

            var user = await _userManager.FindByEmailAsync(payload.Email);

            if (user == null)
            {
                user = new Usuario
                {
                    UserName = payload.Email,
                    Email = payload.Email,
                    NomeCompleto = payload.Name,
                    EmailConfirmed = true,
                    DataCriacao = DateTime.UtcNow
                };

                var createResult = await _userManager.CreateAsync(user);
                if (!createResult.Succeeded) return BadRequest(createResult.Errors);

                // Em novos logins Google, nós NÃO atribuímos uma role imediatamente,
                // e nós NÃO criamos o AlunoCnhStatus. Nós deixamos isso para o momento 
                // do "completar-perfil", onde o usuário escolhe Aluno, Instrutor ou AutoEscola.
            }

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.Contains("Admin") ? "Admin" : (roles.FirstOrDefault() ?? "Pendente");
            var jwtToken = GenerateJwtToken(user, role);

            var perfilIncompleto = role == "Admin" ? false : (string.IsNullOrEmpty(user.CPF) || !user.DataNascimento.HasValue || string.IsNullOrEmpty(user.NomeCompleto) || role == "Pendente");

            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                nomeCompleto = user.NomeCompleto,
                role,
                token = jwtToken,
                documentosAprovados = false,
                perfilIncompleto = perfilIncompleto
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Erro ao validar login Google: " + ex.Message });
        }
    }

    [Authorize(AuthenticationSchemes = "Bearer")]
    [HttpPost("completar-perfil")]
    public async Task<IActionResult> CompletarPerfil([FromBody] CompletarPerfilDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = await _userManager.FindByIdAsync(userId!);

        if (user == null) return NotFound(new { message = "Usuário não encontrado" });

        // Atualizar dados do usuário
        user.NomeCompleto = dto.NomeCompleto;
        user.CPF = dto.CPF;
        user.DataNascimento = dto.DataNascimento;
        user.Estado = dto.Estado;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded) return BadRequest(result.Errors);

        // Remover roles antigas e aplicar a nova do TipoConta
        var currentRoles = await _userManager.GetRolesAsync(user);
        if (currentRoles.Any()) await _userManager.RemoveFromRolesAsync(user, currentRoles);
        await _userManager.AddToRoleAsync(user, dto.TipoConta);

        // Criar o registro específico com base na role escolhida
        if (dto.TipoConta == "Aluno" && !await _context.AlunoCnhStatus.AnyAsync(s => s.UsuarioId == user.Id))
        {
            var status = new AlunoCnhStatus
            {
                UsuarioId = user.Id,
                UltimaAtualizacao = DateTime.UtcNow
            };
            _context.AlunoCnhStatus.Add(status);
        }
        else if (dto.TipoConta == "Instrutor" && !await _context.PerfisInstrutor.AnyAsync(p => p.UsuarioId == user.Id))
        {
            var perfil = new PerfilInstrutor
            {
                UsuarioId = user.Id,
                Cnh = "PENDENTE",
                Categoria = "B",
                RegistroDetran = "PENDENTE",
                DataValidadeCnh = DateTime.UtcNow.AddYears(1),
                Ativo = false
            };
            _context.PerfisInstrutor.Add(perfil);
        }
        else if (dto.TipoConta == "AutoEscola" && !await _context.AutoEscolas.AnyAsync(a => a.UsuarioId == user.Id))
        {
            if (string.IsNullOrEmpty(dto.NomeFantasia) || string.IsNullOrEmpty(dto.RazaoSocial) || string.IsNullOrEmpty(dto.CNPJ))
                return BadRequest(new { message = "Nome Fantasia, Razão Social e CNPJ são obrigatórios para Auto Escola." });

            var autoEscola = new AutoEscola
            {
                UsuarioId = user.Id,
                NomeFantasia = dto.NomeFantasia,
                RazaoSocial = dto.RazaoSocial,
                CNPJ = dto.CNPJ,
                DataCriacao = DateTime.UtcNow
            };
            _context.AutoEscolas.Add(autoEscola);
        }

        await _context.SaveChangesAsync();

        // Gerar um NOVO token que inclui o role atualizado
        var newToken = GenerateJwtToken(user, dto.TipoConta);

        return Ok(new { 
            message = "Perfil atualizado com sucesso", 
            token = newToken, 
            role = dto.TipoConta 
        });
    }
}

