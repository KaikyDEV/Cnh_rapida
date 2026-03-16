using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace Cnh_rapida.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            context.Response.ContentType = "application/json";

            // Mapear exceções de domínio para códigos HTTP corretos
            var (statusCode, title) = ex switch
            {
                KeyNotFoundException => ((int)HttpStatusCode.NotFound, "Recurso não encontrado."),
                InvalidOperationException => ((int)HttpStatusCode.BadRequest, "Operação inválida."),
                UnauthorizedAccessException => ((int)HttpStatusCode.Forbidden, "Acesso negado."),
                ArgumentException => ((int)HttpStatusCode.BadRequest, "Dados inválidos."),
                _ => ((int)HttpStatusCode.InternalServerError, "Ocorreu um erro interno no servidor.")
            };

            context.Response.StatusCode = statusCode;

            var response = _env.IsDevelopment()
                ? new ProblemDetails
                {
                    Status = statusCode,
                    Title = ex.Message,
                    Detail = ex.StackTrace?.ToString()
                }
                : new ProblemDetails
                {
                    Status = statusCode,
                    Title = title,
                    Detail = statusCode >= 500 ? "Por favor, tente novamente mais tarde." : ex.Message
                };

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            var json = JsonSerializer.Serialize(response, options);

            await context.Response.WriteAsync(json);
        }
    }
}
