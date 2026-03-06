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


// 🔥 Criar Roles e Admin automaticamente
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = services.GetRequiredService<UserManager<Usuario>>();

    string[] roles = { "Admin", "Aluno", "Instrutor" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }

    string adminEmail = "admin@cnhrapida.com.br";
    string adminPassword = "Admin@123";

    var adminUser = await userManager.FindByEmailAsync(adminEmail);

    if (adminUser == null)
    {
        var novoAdmin = new Usuario
        {
            UserName = adminEmail,
            Email = adminEmail,
            EmailConfirmed = true,
            NomeCompleto = "Administrador do Sistema"
        };

        var resultado = await userManager.CreateAsync(novoAdmin, adminPassword);

        if (resultado.Succeeded)
            await userManager.AddToRoleAsync(novoAdmin, "Admin");
        else
            throw new Exception("Erro ao criar admin: " +
                string.Join(" | ", resultado.Errors.Select(e => e.Description)));
    }

    string instrutorEmail = "instrutor@cnhrapida.com.br";
    string instrutorPassword = "Instrutor@123";

    var instrutorUser = await userManager.FindByEmailAsync(instrutorEmail);

    if (instrutorUser == null)
    {
        var novoInstrutor = new Usuario
        {
            UserName = instrutorEmail,
            Email = instrutorEmail,
            EmailConfirmed = true,
            NomeCompleto = "Carlos Silva"
        };

        var resultado = await userManager.CreateAsync(novoInstrutor, instrutorPassword);

        if (resultado.Succeeded)
            await userManager.AddToRoleAsync(novoInstrutor, "Instrutor");
    }
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

app.UseHttpsRedirection();
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