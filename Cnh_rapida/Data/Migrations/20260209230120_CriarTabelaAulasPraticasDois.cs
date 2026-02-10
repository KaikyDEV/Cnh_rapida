using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cnh_rapida.Data.Migrations
{
    /// <inheritdoc />
    public partial class CriarTabelaAulasPraticasDois : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Aprovada",
                table: "AulasPraticas",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Aprovada",
                table: "AulasPraticas");
        }
    }
}
