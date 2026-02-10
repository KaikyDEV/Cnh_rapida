using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cnh_rapida.Data.Migrations
{
    /// <inheritdoc />
    public partial class CriarTabelaAulasPraticas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AulasPraticas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AlunoCnhStatusId = table.Column<int>(type: "int", nullable: false),
                    Data = table.Column<DateTime>(type: "datetime2", nullable: false),
                    QuantidadeHoras = table.Column<int>(type: "int", nullable: false),
                    Confirmada = table.Column<bool>(type: "bit", nullable: false),
                    Realizada = table.Column<bool>(type: "bit", nullable: false),
                    Observacao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CriadoEm = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AulasPraticas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AulasPraticas_AlunoCnhStatus_AlunoCnhStatusId",
                        column: x => x.AlunoCnhStatusId,
                        principalTable: "AlunoCnhStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AulasPraticas_AlunoCnhStatusId",
                table: "AulasPraticas",
                column: "AlunoCnhStatusId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AulasPraticas");
        }
    }
}
