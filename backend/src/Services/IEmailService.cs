using JEGASolutions.API.Models;

namespace JEGASolutions.API.Services;

public interface IEmailService
{
    Task<bool> SendWelcomeEmailAsync(Tenant tenant, string temporaryPassword);
    Task<bool> SendPaymentConfirmationAsync(Payment payment);
    Task<bool> SendTenantCredentialsAsync(Tenant tenant, User user, string temporaryPassword);
}

public class EmailTemplate
{
    public string Subject { get; set; } = string.Empty;
    public string HtmlBody { get; set; } = string.Empty;
    public string TextBody { get; set; } = string.Empty;
}
