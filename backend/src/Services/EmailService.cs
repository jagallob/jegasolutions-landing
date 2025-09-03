using System.Net;
using System.Net.Mail;
using JEGASolutions.API.Models;

namespace JEGASolutions.API.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<bool> SendWelcomeEmailAsync(Tenant tenant, string temporaryPassword)
    {
        try
        {
            var template = CreateWelcomeEmailTemplate(tenant, temporaryPassword);
            return await SendEmailAsync(tenant.OwnerEmail, template);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending welcome email to {Email}", tenant.OwnerEmail);
            return false;
        }
    }

    public async Task<bool> SendPaymentConfirmationAsync(Payment payment)
    {
        try
        {
            var template = CreatePaymentConfirmationTemplate(payment);
            return await SendEmailAsync(payment.CustomerEmail, template);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending payment confirmation to {Email}", payment.CustomerEmail);
            return false;
        }
    }

    public async Task<bool> SendTenantCredentialsAsync(Tenant tenant, User user, string temporaryPassword)
    {
        try
        {
            var template = CreateTenantCredentialsTemplate(tenant, user, temporaryPassword);
            return await SendEmailAsync(user.Email, template);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending tenant credentials to {Email}", user.Email);
            return false;
        }
    }

    private async Task<bool> SendEmailAsync(string toEmail, EmailTemplate template)
    {
        try
        {
            var smtpHost = _configuration["Email:SmtpHost"];
            var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
            var smtpUsername = _configuration["Email:SmtpUsername"];
            var smtpPassword = _configuration["Email:SmtpPassword"];
            var fromEmail = _configuration["Email:FromEmail"];
            var fromName = _configuration["Email:FromName"];

            if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpUsername) || string.IsNullOrEmpty(smtpPassword))
            {
                _logger.LogWarning("Email configuration is incomplete. Skipping email send.");
                return false;
            }

            using var client = new SmtpClient(smtpHost, smtpPort);
            client.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
            client.EnableSsl = true;

            using var message = new MailMessage();
            message.From = new MailAddress(fromEmail, fromName);
            message.To.Add(toEmail);
            message.Subject = template.Subject;
            message.Body = template.HtmlBody;
            message.IsBodyHtml = true;

            await client.SendMailAsync(message);
            _logger.LogInformation("Email sent successfully to {Email}", toEmail);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", toEmail);
            return false;
        }
    }

    private EmailTemplate CreateWelcomeEmailTemplate(Tenant tenant, string temporaryPassword)
    {
        var subdomain = tenant.Subdomain;
        var tenantUrl = $"https://{subdomain}.jegasolutions.co";

        return new EmailTemplate
        {
            Subject = "¡Bienvenido a JEGASolutions! Tu cuenta está lista",
            HtmlBody = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8'>
                    <title>Bienvenido a JEGASolutions</title>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                        .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                        .credentials {{ background: #e8f4fd; border: 1px solid #bee5eb; padding: 20px; border-radius: 8px; margin: 20px 0; }}
                        .button {{ display: inline-block; background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                        .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 14px; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h1>¡Bienvenido a JEGASolutions!</h1>
                            <p>Tu plataforma SaaS está lista para usar</p>
                        </div>
                        <div class='content'>
                            <h2>Hola {tenant.Name},</h2>
                            <p>¡Excelente noticia! Tu pago ha sido procesado exitosamente y tu cuenta JEGASolutions está lista.</p>
                            
                            <div class='credentials'>
                                <h3>🔑 Tus Credenciales de Acceso</h3>
                                <p><strong>URL de tu plataforma:</strong> <a href='{tenantUrl}'>{tenantUrl}</a></p>
                                <p><strong>Email:</strong> {tenant.OwnerEmail}</p>
                                <p><strong>Contraseña temporal:</strong> <code>{temporaryPassword}</code></p>
                            </div>

                            <h3>📋 Próximos Pasos</h3>
                            <ol>
                                <li>Haz clic en el botón de abajo para acceder a tu plataforma</li>
                                <li>Cambia tu contraseña temporal por una segura</li>
                                <li>Explora los módulos que has adquirido</li>
                                <li>Configura tu equipo y comienza a trabajar</li>
                            </ol>

                            <div style='text-align: center;'>
                                <a href='{tenantUrl}' class='button'>Acceder a Mi Plataforma</a>
                            </div>

                            <h3>🛠️ Módulos Disponibles</h3>
                            <p>Según tu compra, tienes acceso a los siguientes módulos:</p>
                            <ul>
                                {string.Join("", tenant.Modules.Select(m => $"<li>✅ {GetModuleDisplayName(m.ModuleName)}</li>"))}
                            </ul>

                            <h3>💬 ¿Necesitas Ayuda?</h3>
                            <p>Nuestro equipo de soporte está aquí para ayudarte:</p>
                            <ul>
                                <li>📧 Email: soporte@jegasolutions.co</li>
                                <li>📞 Teléfono: +57 (1) 234-5678</li>
                                <li>💬 Chat en vivo: Disponible en tu plataforma</li>
                            </ul>
                        </div>
                        <div class='footer'>
                            <p>© 2024 JEGASolutions. Todos los derechos reservados.</p>
                            <p>Este es un email automático, por favor no respondas a este mensaje.</p>
                        </div>
                    </div>
                </body>
                </html>",
            TextBody = $@"
                ¡Bienvenido a JEGASolutions!
                
                Hola {tenant.Name},
                
                Tu pago ha sido procesado exitosamente y tu cuenta está lista.
                
                CREDENCIALES DE ACCESO:
                URL: {tenantUrl}
                Email: {tenant.OwnerEmail}
                Contraseña temporal: {temporaryPassword}
                
                Próximos pasos:
                1. Accede a tu plataforma usando las credenciales de arriba
                2. Cambia tu contraseña temporal
                3. Explora los módulos adquiridos
                4. Configura tu equipo
                
                Módulos disponibles:
                {string.Join("\n", tenant.Modules.Select(m => $"• {GetModuleDisplayName(m.ModuleName)}"))}
                
                Soporte: soporte@jegasolutions.co
                
                © 2024 JEGASolutions
            "
        };
    }

    private EmailTemplate CreatePaymentConfirmationTemplate(Payment payment)
    {
        return new EmailTemplate
        {
            Subject = "Confirmación de Pago - JEGASolutions",
            HtmlBody = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8'>
                    <title>Confirmación de Pago</title>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px; }}
                        .content {{ background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h1>✅ Pago Confirmado</h1>
                        </div>
                        <div class='content'>
                            <h2>Hola {payment.CustomerName},</h2>
                            <p>Hemos recibido tu pago exitosamente.</p>
                            <p><strong>Referencia:</strong> {payment.Reference}</p>
                            <p><strong>Monto:</strong> ${payment.Amount:N0} COP</p>
                            <p><strong>Fecha:</strong> {payment.CreatedAt:dd/MM/yyyy HH:mm}</p>
                            <p>Tu cuenta se está configurando y recibirás las credenciales de acceso en los próximos minutos.</p>
                        </div>
                    </div>
                </body>
                </html>",
            TextBody = $@"
                Confirmación de Pago - JEGASolutions
                
                Hola {payment.CustomerName},
                
                Hemos recibido tu pago exitosamente.
                
                Referencia: {payment.Reference}
                Monto: ${payment.Amount:N0} COP
                Fecha: {payment.CreatedAt:dd/MM/yyyy HH:mm}
                
                Tu cuenta se está configurando y recibirás las credenciales de acceso en los próximos minutos.
                
                © 2024 JEGASolutions
            "
        };
    }

    private EmailTemplate CreateTenantCredentialsTemplate(Tenant tenant, User user, string temporaryPassword)
    {
        var subdomain = tenant.Subdomain;
        var tenantUrl = $"https://{subdomain}.jegasolutions.co";

        return new EmailTemplate
        {
            Subject = "Credenciales de Acceso - JEGASolutions",
            HtmlBody = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8'>
                    <title>Credenciales de Acceso</title>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background: #007bff; color: white; padding: 20px; text-align: center; border-radius: 8px; }}
                        .content {{ background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px; }}
                        .credentials {{ background: #e8f4fd; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h1>🔑 Credenciales de Acceso</h1>
                        </div>
                        <div class='content'>
                            <h2>Hola {user.FullName},</h2>
                            <p>Has sido agregado como usuario en la plataforma JEGASolutions de {tenant.Name}.</p>
                            
                            <div class='credentials'>
                                <h3>Datos de Acceso</h3>
                                <p><strong>URL:</strong> <a href='{tenantUrl}'>{tenantUrl}</a></p>
                                <p><strong>Email:</strong> {user.Email}</p>
                                <p><strong>Contraseña temporal:</strong> <code>{temporaryPassword}</code></p>
                            </div>
                            
                            <p><strong>Importante:</strong> Cambia tu contraseña temporal en tu primer acceso por seguridad.</p>
                        </div>
                    </div>
                </body>
                </html>",
            TextBody = $@"
                Credenciales de Acceso - JEGASolutions
                
                Hola {user.FullName},
                
                Has sido agregado como usuario en la plataforma JEGASolutions de {tenant.Name}.
                
                DATOS DE ACCESO:
                URL: {tenantUrl}
                Email: {user.Email}
                Contraseña temporal: {temporaryPassword}
                
                Importante: Cambia tu contraseña temporal en tu primer acceso.
                
                © 2024 JEGASolutions
            "
        };
    }

    private string GetModuleDisplayName(string moduleName)
    {
        return moduleName switch
        {
            "extraHours" => "Gestión de Horas Extra",
            "reports" => "Reportes con IA",
            "GestorHorasExtra" => "Gestión de Horas Extra",
            "ReportBuilderProject" => "Reportes con IA",
            _ => moduleName
        };
    }
}
