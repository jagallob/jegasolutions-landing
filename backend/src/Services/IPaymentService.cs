using JEGASolutions.API.Models;

namespace JEGASolutions.API.Services;

public interface IPaymentService
{
    Task<Payment> CreatePaymentAsync(CreatePaymentRequest request);
    Task<Payment?> GetPaymentByReferenceAsync(string reference);
    Task<bool> UpdatePaymentStatusAsync(string reference, string status);
    Task<IEnumerable<Payment>> GetPaymentsByCustomerAsync(string customerEmail);
}
