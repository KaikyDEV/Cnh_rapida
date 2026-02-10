using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cnh_rapida.Data.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarCamposAlunoCnhStatusDois : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "PrimeiroAcesso",
                table: "AlunoCnhStatus",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PrimeiroAcesso",
                table: "AlunoCnhStatus");
        }
    }
}
