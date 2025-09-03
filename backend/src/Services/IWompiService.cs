using JEGASolutions.API.Models;

namespace JEGASolutions.API.Services;

public interface IWompiService
{
    Task<bool> ValidateWebhookSignature(string payload, string signature);
    Task<WompiTransactionResponse?> GetTransactionStatus(string transactionId);
    Task<bool> ProcessPaymentWebhook(WompiWebhookPayload payload);
}

public class WompiWebhookPayload
{
    public string Event { get; set; } = string.Empty;
    public WompiTransactionData Data { get; set; } = new();
    public string Environment { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string SentAt { get; set; } = string.Empty;
}

public class WompiTransactionData
{
    public string Id { get; set; } = string.Empty;
    public string Reference { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int AmountInCents { get; set; }
    public string Currency { get; set; } = string.Empty;
    public WompiCustomerData Customer { get; set; } = new();
    public WompiPaymentMethodData PaymentMethod { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime FinalizedAt { get; set; }
}

public class WompiCustomerData
{
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
}

public class WompiPaymentMethodData
{
    public string Type { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public string Installments { get; set; } = string.Empty;
}

public class WompiTransactionResponse
{
    public string Id { get; set; } = string.Empty;
    public string Reference { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int AmountInCents { get; set; }
    public string Currency { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime FinalizedAt { get; set; }
}
