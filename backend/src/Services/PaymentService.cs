using JEGASolutions.API.Data;
using JEGASolutions.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JEGASolutions.API.Services;

public class PaymentService : IPaymentService
{
    private readonly ApplicationDbContext _context;

    public PaymentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Payment> CreatePaymentAsync(CreatePaymentRequest request)
    {
        var payment = new Payment
        {
            Reference = request.Reference,
            Amount = request.Amount,
            CustomerEmail = request.CustomerEmail,
            CustomerName = request.CustomerName,
            Status = "PENDING",
            CreatedAt = DateTime.UtcNow,
            Metadata = request.Metadata
        };

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        return payment;
    }

    public async Task<Payment?> GetPaymentByReferenceAsync(string reference)
    {
        return await _context.Payments
            .FirstOrDefaultAsync(p => p.Reference == reference);
    }

    public async Task<bool> UpdatePaymentStatusAsync(string reference, string status)
    {
        var payment = await _context.Payments
            .FirstOrDefaultAsync(p => p.Reference == reference);

        if (payment == null)
            return false;

        payment.Status = status;
        payment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Payment>> GetPaymentsByCustomerAsync(string customerEmail)
    {
        return await _context.Payments
            .Where(p => p.CustomerEmail == customerEmail)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }
}

public class CreatePaymentRequest
{
    public string Reference { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? CustomerEmail { get; set; }
    public string? CustomerName { get; set; }
    public string? Metadata { get; set; }
}
