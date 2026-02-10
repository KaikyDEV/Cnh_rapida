using Cnh_rapida.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Cnh_rapida.Data;

public class ApplicationDbContext : IdentityDbContext<Usuario, IdentityRole, string>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<AlunoCnhStatus> AlunoCnhStatus { get; set; } = null!;
    public DbSet<AulaPratica> AulasPraticas { get; set; }


    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Chave primária
        builder.Entity<AlunoCnhStatus>()
            .HasKey(a => a.Id);

        // Relação 1:1 com Usuario
        builder.Entity<AlunoCnhStatus>()
            .HasOne(a => a.Usuario)
            .WithOne(u => u.AlunoCnhStatus)
            .HasForeignKey<AlunoCnhStatus>(a => a.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}