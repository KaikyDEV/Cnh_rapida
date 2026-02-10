using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cnh_rapida.Data.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarCamposAlunoCnhStatusTres : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CaminhoExameMedico",
                table: "AlunoCnhStatus",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CaminhoPsicotecnico",
                table: "AlunoCnhStatus",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DataEnvioExames",
                table: "AlunoCnhStatus",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ExameMedicoAprovado",
                table: "AlunoCnhStatus",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ExamesEnviados",
                table: "AlunoCnhStatus",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CaminhoExameMedico",
                table: "AlunoCnhStatus");

            migrationBuilder.DropColumn(
                name: "CaminhoPsicotecnico",
                table: "AlunoCnhStatus");

            migrationBuilder.DropColumn(
                name: "DataEnvioExames",
                table: "AlunoCnhStatus");

            migrationBuilder.DropColumn(
                name: "ExameMedicoAprovado",
                table: "AlunoCnhStatus");

            migrationBuilder.DropColumn(
                name: "ExamesEnviados",
                table: "AlunoCnhStatus");
        }
    }
}
