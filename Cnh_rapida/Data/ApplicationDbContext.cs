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
    public DbSet<PerfilInstrutor> PerfisInstrutor { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AlunoCnhStatus>()
            .HasKey(a => a.Id);

        builder.Entity<AlunoCnhStatus>()
            .HasOne(a => a.Usuario)
            .WithOne(u => u.AlunoCnhStatus)
            .HasForeignKey<AlunoCnhStatus>(a => a.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<PerfilInstrutor>()
            .HasOne(p => p.Usuario)
            .WithOne()
            .HasForeignKey<PerfilInstrutor>(p => p.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        // RELAÇÃO ENTRE AULA PRÁTICA E INSTRUTOR (SEM CASCADE)
        builder.Entity<AulaPratica>()
            .HasOne(a => a.Instrutor)
            .WithMany()
            .HasForeignKey(a => a.InstrutorPerfilId)
            .OnDelete(DeleteBehavior.NoAction);

        // RELAÇÃO ENTRE AULA PRÁTICA E STATUS DO ALUNO
        builder.Entity<AulaPratica>()
            .HasOne(a => a.AlunoStatus)
            .WithMany()
            .HasForeignKey(a => a.AlunoCnhStatusId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}