using Cnh_rapida.Data;
using Cnh_rapida.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Cnh_rapida.Services;
using Microsoft.AspNetCore.Identity.UI.Services;

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

// 🔥 Semear banco (Síncrono para garantir que os dados existam antes do login)
try 
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = services.GetRequiredService<UserManager<Usuario>>();
        var dbContext = services.GetRequiredService<ApplicationDbContext>();

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
    }
}
catch (Exception ex)
{
    Console.WriteLine("Erro ao semear banco: " + ex.Message);
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

app.UseRouting();

// ✅ CORS
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

// 🔥 Identity Minimal API
app.MapIdentityApi<Usuario>();

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