using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cnh_rapida.Data.Migrations
{
    /// <inheritdoc />
    public partial class FKInstrutor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AlunoCnhStatusId1",
                table: "AulasPraticas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InstrutorPerfilId",
                table: "AulasPraticas",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AulasPraticas_AlunoCnhStatusId1",
                table: "AulasPraticas",
                column: "AlunoCnhStatusId1");

            migrationBuilder.CreateIndex(
                name: "IX_AulasPraticas_InstrutorPerfilId",
                table: "AulasPraticas",
                column: "InstrutorPerfilId");

            migrationBuilder.AddForeignKey(
                name: "FK_AulasPraticas_AlunoCnhStatus_AlunoCnhStatusId1",
                table: "AulasPraticas",
                column: "AlunoCnhStatusId1",
                principalTable: "AlunoCnhStatus",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AulasPraticas_PerfisInstrutor_InstrutorPerfilId",
                table: "AulasPraticas",
                column: "InstrutorPerfilId",
                principalTable: "PerfisInstrutor",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AulasPraticas_AlunoCnhStatus_AlunoCnhStatusId1",
                table: "AulasPraticas");

            migrationBuilder.DropForeignKey(
                name: "FK_AulasPraticas_PerfisInstrutor_InstrutorPerfilId",
                table: "AulasPraticas");

            migrationBuilder.DropIndex(
                name: "IX_AulasPraticas_AlunoCnhStatusId1",
                table: "AulasPraticas");

            migrationBuilder.DropIndex(
                name: "IX_AulasPraticas_InstrutorPerfilId",
                table: "AulasPraticas");

            migrationBuilder.DropColumn(
                name: "AlunoCnhStatusId1",
                table: "AulasPraticas");

            migrationBuilder.DropColumn(
                name: "InstrutorPerfilId",
                table: "AulasPraticas");
        }
    }
}
