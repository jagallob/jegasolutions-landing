using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using JEGASolutions.API.Data;
using JEGASolutions.API.Models;
using JEGASolutions.API.Utils;
using Microsoft.EntityFrameworkCore;

namespace JEGASolutions.API.Services;

public class WompiService : IWompiService
{
    private readonly HttpClient _httpClient;
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService;
    private readonly ILogger<WompiService> _logger;
    private readonly string _privateKey;
    private readonly string _publicKey;

    public WompiService(HttpClient httpClient, ApplicationDbContext context, IConfiguration configuration, IEmailService emailService, ILogger<WompiService> logger)
    {
        _httpClient = httpClient;
        _context = context;
        _configuration = configuration;
        _emailService = emailService;
        _logger = logger;
        _privateKey = _configuration["Wompi:PrivateKey"] ?? throw new ArgumentNullException("Wompi:PrivateKey");
        _publicKey = _configuration["Wompi:PublicKey"] ?? throw new ArgumentNullException("Wompi:PublicKey");
        
        _httpClient.BaseAddress = new Uri(_configuration["Wompi:BaseUrl"] ?? "https://production.wompi.co/v1/");
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_privateKey}");
    }

    public async Task<bool> ValidateWebhookSignature(string payload, string signature)
    {
        try
        {
            var expectedSignature = ComputeSignature(payload, _privateKey);
            return signature.Equals(expectedSignature, StringComparison.OrdinalIgnoreCase);
        }
        catch
        {
            return false;
        }
    }

    public async Task<WompiTransactionResponse?> GetTransactionStatus(string transactionId)
    {
        try
        {
            var response = await _httpClient.GetAsync($"transactions/{transactionId}");
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<WompiApiResponse<WompiTransactionResponse>>(content);
                return result?.Data;
            }
            
            return null;
        }
        catch
        {
            return null;
        }
    }

    public async Task<bool> ProcessPaymentWebhook(WompiWebhookPayload payload)
    {
        try
        {
            var payment = await _context.Payments
                .FirstOrDefaultAsync(p => p.Reference == payload.Data.Reference);

            if (payment == null)
            {
                // Create new payment record if not exists
                payment = new Payment
                {
                    Reference = payload.Data.Reference,
                    Amount = payload.Data.AmountInCents / 100m,
                    CustomerEmail = payload.Data.Customer.Email,
                    CustomerName = payload.Data.Customer.FullName,
                    WompiTransactionId = payload.Data.Id,
                    Status = MapWompiStatus(payload.Data.Status),
                    CreatedAt = payload.Data.CreatedAt,
                    UpdatedAt = DateTime.UtcNow
                };
                
                _context.Payments.Add(payment);
            }
            else
            {
                // Update existing payment
                payment.Status = MapWompiStatus(payload.Data.Status);
                payment.WompiTransactionId = payload.Data.Id;
                payment.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            // If payment is approved, trigger tenant creation
            if (payment.Status == "APPROVED")
            {
                await CreateTenantFromPayment(payment);
                
                // Send payment confirmation email
                await _emailService.SendPaymentConfirmationAsync(payment);
            }

            return true;
        }
        catch (Exception ex)
        {
            // Log error
            Console.WriteLine($"Error processing webhook: {ex.Message}");
            return false;
        }
    }

    private async Task CreateTenantFromPayment(Payment payment)
    {
        try
        {
            _logger.LogInformation("Creating tenant for payment {Reference}", payment.Reference);

            // Extract module information from reference
            var referenceParts = payment.Reference.Split('-');
            if (referenceParts.Length < 3) 
            {
                _logger.LogWarning("Invalid payment reference format: {Reference}", payment.Reference);
                return;
            }

            var modules = referenceParts.Skip(1).TakeWhile(p => p != "saas" && p != "onpremise").ToList();
            var deploymentType = referenceParts.FirstOrDefault(p => p == "saas" || p == "onpremise") ?? "saas";

            // Generate subdomain
            var subdomain = PasswordGenerator.GenerateSubdomain(payment.CustomerName ?? payment.CustomerEmail ?? "cliente");

            // Check if subdomain already exists
            var existingTenant = await _context.Tenants.FirstOrDefaultAsync(t => t.Subdomain == subdomain);
            if (existingTenant != null)
            {
                // Generate a new subdomain if it exists
                subdomain = PasswordGenerator.GenerateSubdomain($"{subdomain}-{DateTime.UtcNow.Ticks}");
            }

            // Create tenant
            var tenant = new Tenant
            {
                Name = payment.CustomerName ?? "Cliente",
                Subdomain = subdomain,
                OwnerEmail = payment.CustomerEmail ?? "",
                Status = "ACTIVE"
            };

            _context.Tenants.Add(tenant);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Created tenant {TenantId} with subdomain {Subdomain}", tenant.Id, tenant.Subdomain);

            // Add modules to tenant
            foreach (var module in modules)
            {
                var tenantModule = new TenantModule
                {
                    TenantId = tenant.Id,
                    ModuleName = module,
                    Status = "ACTIVE"
                };
                _context.TenantModules.Add(tenantModule);
            }

            await _context.SaveChangesAsync();

            // Create admin user for the tenant
            var temporaryPassword = PasswordGenerator.GenerateTemporaryPassword();
            var adminUser = new User
            {
                TenantId = tenant.Id,
                Email = tenant.OwnerEmail,
                FullName = tenant.Name,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(temporaryPassword),
                Role = "ADMIN"
            };

            _context.Users.Add(adminUser);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Created admin user {UserId} for tenant {TenantId}", adminUser.Id, tenant.Id);

            // Send welcome email with credentials
            var emailSent = await _emailService.SendWelcomeEmailAsync(tenant, temporaryPassword);
            if (emailSent)
            {
                _logger.LogInformation("Welcome email sent to {Email}", tenant.OwnerEmail);
            }
            else
            {
                _logger.LogWarning("Failed to send welcome email to {Email}", tenant.OwnerEmail);
            }

            // TODO: Configure subdomain in DNS (this would be done via external service)
            _logger.LogInformation("Tenant setup completed for {Subdomain}.jegasolutions.co", subdomain);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating tenant for payment {Reference}", payment.Reference);
            throw;
        }
    }

    private string GenerateSubdomain(string baseName)
    {
        var cleanName = baseName.ToLower()
            .Replace(" ", "-")
            .Replace("@", "-")
            .Replace(".", "-");
        
        var randomSuffix = new Random().Next(1000, 9999);
        return $"{cleanName}-{randomSuffix}";
    }

    private string MapWompiStatus(string wompiStatus)
    {
        return wompiStatus.ToUpper() switch
        {
            "APPROVED" => "APPROVED",
            "DECLINED" => "DECLINED",
            "VOIDED" => "CANCELLED",
            "PENDING" => "PENDING",
            _ => "FAILED"
        };
    }

    private string ComputeSignature(string payload, string privateKey)
    {
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(privateKey));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
        return Convert.ToHexString(hash).ToLower();
    }
}

public class WompiApiResponse<T>
{
    public T? Data { get; set; }
    public bool Success { get; set; }
    public string? Error { get; set; }
}
