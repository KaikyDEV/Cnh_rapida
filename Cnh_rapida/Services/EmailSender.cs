using Microsoft.AspNetCore.Identity.UI.Services;

namespace Cnh_rapida.Services;

public class EmailSender : IEmailSender
{
    public Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        // 🔕 Não envia nada (por enquanto)
        return Task.CompletedTask;
    }
}
