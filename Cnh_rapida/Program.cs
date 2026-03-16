using Cnh_rapida.Data;
using Cnh_rapida.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Cnh_rapida.Services;
using Microsoft.AspNetCore.Identity.UI.Services;
using Cnh_rapida.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services
    .AddIdentityApiEndpoints<Usuario>(options =>
    {
        options.SignIn.RequireConfirmedAccount = false;
        options.Password.RequireDigit = false;
        options.Password.RequiredLength = 6;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

// 🔥 IMPEDIR HTML NAS ROTAS /api
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Events.OnRedirectToLogin = context =>
    {
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        }
        context.Response.Redirect(context.RedirectUri);
        return Task.CompletedTask;
    };

    options.Events.OnRedirectToAccessDenied = context =>
    {
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        }
        context.Response.Redirect(context.RedirectUri);
        return Task.CompletedTask;
    };
});

builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();
builder.Services.AddTransient<IEmailSender, EmailSender>();
builder.Services.AddScoped<IAutoEscolaRobustaService, AutoEscolaRobustaService>();

// ✅ JWT Bearer — para aceitar tokens gerados pelo /api/auth/google
var jwtKey = builder.Configuration["Jwt:Key"] ?? "CNHRapida_SuperSecret_JWT_Key_2024_MinLength32Chars!";
// ✅ Configuração de Autenticação Híbrida (Identity Bearer + JWT do Google)
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = "Bearer";
    options.DefaultAuthenticateScheme = "Bearer";
    options.DefaultChallengeScheme = "Bearer";
})
.AddPolicyScheme("Bearer", "Identity ou JwtBearer", options =>
{
    options.ForwardDefaultSelector = context =>
    {
        string auth = context.Request.Headers["Authorization"];
        if (string.IsNullOrEmpty(auth)) return IdentityConstants.BearerScheme;

        // Se o token contiver pontos, assume que é um JWT (Google Login)
        // Se for um token opaco simples, assume que é do Identity
        if (auth.StartsWith("Bearer ") && auth.Contains("."))
        {
            return "JwtBearer";
        }
        return IdentityConstants.BearerScheme;
    };
})
.AddJwtBearer("JwtBearer", options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "cnhrapida",
        ValidAudience = "cnhrapida",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        RoleClaimType = System.Security.Claims.ClaimTypes.Role // Garantir que mapeia os Roles corretamente
    };
});

// ✅ Autorização: Usar a política padrão para exigir autenticação
builder.Services.AddAuthorization();

// ✅ CORS para React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// ✅ CORS para React
app.UseCors("AllowFrontend");

// 🔥 Middleware de Erros Global
app.UseMiddleware<ExceptionMiddleware>();

// 🔥 Limpar logs de DbContext para evitar spam no console
var loggerFactory = app.Services.GetRequiredService<ILoggerFactory>();
var logger = loggerFactory.CreateLogger("DbSeeder");

// 🔥 Semear banco (Síncrono para garantir que os dados existam antes do login)
try 
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = services.GetRequiredService<UserManager<Usuario>>();
        var dbContext = services.GetRequiredService<ApplicationDbContext>();

        logger.LogInformation("Applying database migrations...");
        await dbContext.Database.MigrateAsync();
        logger.LogInformation("Database migrations applied successfully. Seeding data...");

        string[] roles = { "Admin", "Aluno", "Instrutor" };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));
        }

        // Aluno de Teste
        var studentEmail = "aluno@cnhrapida.com.br";
        var studentUser = await userManager.FindByEmailAsync(studentEmail);
        if (studentUser == null)
        {
            studentUser = new Usuario { UserName = studentEmail, Email = studentEmail, NomeCompleto = "Aluno Teste", EmailConfirmed = true };
            var result = await userManager.CreateAsync(studentUser, "Aluno@123");
            if (result.Succeeded) await userManager.AddToRoleAsync(studentUser, "Aluno");
        }

        if (studentUser != null && !await dbContext.AlunoCnhStatus.AnyAsync(s => s.UsuarioId == studentUser.Id))
        {
            dbContext.AlunoCnhStatus.Add(new AlunoCnhStatus
            {
                UsuarioId = studentUser.Id,
                ProcessoIniciadoDetran = true,
                ExameMedicoRealizado = false,
                UltimaAtualizacao = DateTime.UtcNow
            });
        }

        // Admin
        var adminEmail = "admin@cnhrapida.com.br";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new Usuario { UserName = adminEmail, Email = adminEmail, NomeCompleto = "Administrador Sistema", EmailConfirmed = true };
            var result = await userManager.CreateAsync(adminUser, "Admin@123");
        }

        if (adminUser != null)
        {
            // Garantir que é Admin e remover outros roles se existirem
            var currentRoles = await userManager.GetRolesAsync(adminUser);
            if (!currentRoles.Contains("Admin"))
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
            
            // Se ele tiver outros roles por engano (ex: Instrutor), removemos
            foreach (var r in currentRoles.Where(r => r != "Admin"))
            {
                await userManager.RemoveFromRoleAsync(adminUser, r);
            }
        }

        // Instrutores e Perfis
        var instrutorEmails = new[] { "instrutor@cnhrapida.com.br", "kaikysantosdasilva38@gmail.com" };
        foreach (var email in instrutorEmails)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null && email == "instrutor@cnhrapida.com.br")
            {
                user = new Usuario { UserName = email, Email = email, NomeCompleto = "Carlos Silva", EmailConfirmed = true };
                await userManager.CreateAsync(user, "Instrutor@123");
            }

            if (user != null)
            {
                if (!await userManager.IsInRoleAsync(user, "Instrutor"))
                    await userManager.AddToRoleAsync(user, "Instrutor");

                if (!await dbContext.PerfisInstrutor.AnyAsync(p => p.UsuarioId == user.Id))
                {
                    dbContext.PerfisInstrutor.Add(new PerfilInstrutor
                    {
                        UsuarioId = user.Id,
                        Cnh = "12345678901",
                        Categoria = "AB",
                        RegistroDetran = "DET" + new Random().Next(1000, 9999),
                        DataValidadeCnh = DateTime.UtcNow.AddYears(5),
                        Ativo = true
                    });
                }
            }
        }
        await dbContext.SaveChangesAsync();
        logger.LogInformation("Database seeding completed successfully.");
    }
}
catch (Exception ex)
{
    logger.LogError(ex, "An error occurred while seeding the database. The app will continue starting, but database operations might fail.");
}

if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// app.UseHttpsRedirection();
app.UseStaticFiles();

// ✅ Routing
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// 🔥 Identity Minimal API
app.MapIdentityApi<Usuario>();

// 🔥 Habilitar Atributos de Rota [ApiController]
app.MapControllers();

// ✅ Endpoint de saúde para verificar se as mudanças foram aplicadas
app.MapGet("/api/health", () => Results.Ok(new { status = "Online", version = "1.0.1", timestamp = DateTime.UtcNow }));

// MVC + Areas continuam funcionando
app.MapAreaControllerRoute(
    name: "aluno",
    areaName: "Aluno",
    pattern: "Aluno/{controller=Aluno}/{action=Etapas}/{id?}");

app.MapAreaControllerRoute(
    name: "admin",
    areaName: "Admin",
    pattern: "Admin/{controller=Admin}/{action=ValidarExames}/{id?}");

app.MapControllerRoute(
    name: "areas",
    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapRazorPages();

app.Run();