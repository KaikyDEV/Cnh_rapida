using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cnh_rapida.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddAutoEscolaProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AutoEscolaId",
                table: "PerfisInstrutor",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AutoEscolaId",
                table: "AspNetUsers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AutoEscolaId",
                table: "AlunoCnhStatus",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AutoEscolas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UsuarioId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    NomeFantasia = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    RazaoSocial = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    CNPJ = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Endereco = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Cidade = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Estado = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Telefone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmailContato = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ativo = table.Column<bool>(type: "bit", nullable: false),
                    DocumentosAprovados = table.Column<bool>(type: "bit", nullable: false),
                    DataCriacao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AutoEscolas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AutoEscolas_AspNetUsers_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PerfisInstrutor_AutoEscolaId",
                table: "PerfisInstrutor",
                column: "AutoEscolaId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_AutoEscolaId",
                table: "AspNetUsers",
                column: "AutoEscolaId");

            migrationBuilder.CreateIndex(
                name: "IX_AlunoCnhStatus_AutoEscolaId",
                table: "AlunoCnhStatus",
                column: "AutoEscolaId");

            migrationBuilder.CreateIndex(
                name: "IX_AutoEscolas_UsuarioId",
                table: "AutoEscolas",
                column: "UsuarioId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AlunoCnhStatus_AutoEscolas_AutoEscolaId",
                table: "AlunoCnhStatus",
                column: "AutoEscolaId",
                principalTable: "AutoEscolas",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_AutoEscolas_AutoEscolaId",
                table: "AspNetUsers",
                column: "AutoEscolaId",
                principalTable: "AutoEscolas",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PerfisInstrutor_AutoEscolas_AutoEscolaId",
                table: "PerfisInstrutor",
                column: "AutoEscolaId",
                principalTable: "AutoEscolas",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AlunoCnhStatus_AutoEscolas_AutoEscolaId",
                table: "AlunoCnhStatus");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_AutoEscolas_AutoEscolaId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_PerfisInstrutor_AutoEscolas_AutoEscolaId",
                table: "PerfisInstrutor");

            migrationBuilder.DropTable(
                name: "AutoEscolas");

            migrationBuilder.DropIndex(
                name: "IX_PerfisInstrutor_AutoEscolaId",
                table: "PerfisInstrutor");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_AutoEscolaId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AlunoCnhStatus_AutoEscolaId",
                table: "AlunoCnhStatus");

            migrationBuilder.DropColumn(
                name: "AutoEscolaId",
                table: "PerfisInstrutor");

            migrationBuilder.DropColumn(
                name: "AutoEscolaId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "AutoEscolaId",
                table: "AlunoCnhStatus");
        }
    }
}
