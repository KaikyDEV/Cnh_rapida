using Microsoft.AspNetCore.Identity.UI.Services;
using System.Net;
using System.Net.Mail;

namespace Cnh_rapida.Services;

public class EmailSender : IEmailSender
{
    private readonly IConfiguration _configuration;

    public EmailSender(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        var smtpHost = _configuration["Smtp:Host"];
        var smtpPort = int.Parse(_configuration["Smtp:Port"] ?? "587");
        var smtpEmail = _configuration["Smtp:Email"];
        var smtpPass = _configuration["Smtp:Password"];
        var displayName = _configuration["Smtp:DisplayName"] ?? "CNH Rápida";
        var useSsl = bool.Parse(_configuration["Smtp:UseSsl"] ?? "true");

        if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpEmail) || string.IsNullOrEmpty(smtpPass))
        {
            throw new Exception("Smtp settings are missing or incomplete.");
        }

        using var client = new SmtpClient(smtpHost, smtpPort)
        {
            Credentials = new NetworkCredential(smtpEmail, smtpPass),
            EnableSsl = useSsl
        };

        var message = new MailMessage
        {
            From = new MailAddress(smtpEmail, displayName),
            Subject = subject,
            Body = htmlMessage,
            IsBodyHtml = true
        };

        message.To.Add(email);

        await client.SendMailAsync(message);
    }
}
