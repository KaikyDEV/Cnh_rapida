using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cnh_rapida.Data.Migrations
{
    /// <inheritdoc />
    public partial class NovosCamposAlunoCnhStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CaminhoExameTeorico",
                table: "AlunoCnhStatus",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DataEnvioExameTeorico",
                table: "AlunoCnhStatus",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ExameTeoricoAprovado",
                table: "AlunoCnhStatus",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CaminhoExameTeorico",
                table: "AlunoCnhStatus");

            migrationBuilder.DropColumn(
                name: "DataEnvioExameTeorico",
                table: "AlunoCnhStatus");

            migrationBuilder.DropColumn(
                name: "ExameTeoricoAprovado",
                table: "AlunoCnhStatus");
        }
    }
}
