using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cnh_rapida.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDocumentoUsuarioAndStatusFlags : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AulasPraticas_AlunoCnhStatus_AlunoCnhStatusId1",
                table: "AulasPraticas");

            migrationBuilder.DropIndex(
                name: "IX_AulasPraticas_AlunoCnhStatusId1",
                table: "AulasPraticas");

            migrationBuilder.DropColumn(
                name: "AlunoCnhStatusId1",
                table: "AulasPraticas");

            migrationBuilder.AddColumn<bool>(
                name: "DocumentosAprovados",
                table: "PerfisInstrutor",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "DocumentosAprovados",
                table: "AlunoCnhStatus",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "DocumentosUsuario",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UsuarioId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TipoDocumento = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UrlArquivo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Observacao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DataUpload = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentosUsuario", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DocumentosUsuario_AspNetUsers_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DocumentosUsuario_UsuarioId",
                table: "DocumentosUsuario",
                column: "UsuarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DocumentosUsuario");

            migrationBuilder.DropColumn(
                name: "DocumentosAprovados",
                table: "PerfisInstrutor");

            migrationBuilder.DropColumn(
                name: "DocumentosAprovados",
                table: "AlunoCnhStatus");

            migrationBuilder.AddColumn<int>(
                name: "AlunoCnhStatusId1",
                table: "AulasPraticas",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AulasPraticas_AlunoCnhStatusId1",
                table: "AulasPraticas",
                column: "AlunoCnhStatusId1");

            migrationBuilder.AddForeignKey(
                name: "FK_AulasPraticas_AlunoCnhStatus_AlunoCnhStatusId1",
                table: "AulasPraticas",
                column: "AlunoCnhStatusId1",
                principalTable: "AlunoCnhStatus",
                principalColumn: "Id");
        }
    }
}
