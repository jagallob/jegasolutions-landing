using Microsoft.AspNetCore.Mvc;
using JEGASolutions.API.Services;
using JEGASolutions.API.Models;

namespace JEGASolutions.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;
    private readonly IWompiService _wompiService;

    public PaymentsController(IPaymentService paymentService, IWompiService wompiService)
    {
        _paymentService = paymentService;
        _wompiService = wompiService;
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> Webhook([FromBody] WompiWebhookPayload payload)
    {
        try
        {
            // Get the signature from headers
            var signature = Request.Headers["X-Integrity"].FirstOrDefault();
            if (string.IsNullOrEmpty(signature))
            {
                return BadRequest("Missing X-Integrity header");
            }

            // Get the raw body for signature validation
            Request.Body.Position = 0;
            using var reader = new StreamReader(Request.Body);
            var rawBody = await reader.ReadToEndAsync();

            // Validate signature
            var isValidSignature = await _wompiService.ValidateWebhookSignature(rawBody, signature);
            if (!isValidSignature)
            {
                return Unauthorized("Invalid signature");
            }

            // Process the webhook
            var success = await _wompiService.ProcessPaymentWebhook(payload);
            
            if (success)
            {
                return Ok(new { message = "Webhook processed successfully" });
            }
            else
            {
                return StatusCode(500, new { message = "Error processing webhook" });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    [HttpGet("status/{reference}")]
    public async Task<IActionResult> GetPaymentStatus(string reference)
    {
        try
        {
            var payment = await _paymentService.GetPaymentByReferenceAsync(reference);
            
            if (payment == null)
            {
                return NotFound(new { message = "Payment not found" });
            }

            return Ok(new
            {
                reference = payment.Reference,
                status = payment.Status,
                amount = payment.Amount,
                customerEmail = payment.CustomerEmail,
                createdAt = payment.CreatedAt,
                updatedAt = payment.UpdatedAt
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    [HttpGet("customer/{email}")]
    public async Task<IActionResult> GetCustomerPayments(string email)
    {
        try
        {
            var payments = await _paymentService.GetPaymentsByCustomerAsync(email);
            
            var result = payments.Select(p => new
            {
                reference = p.Reference,
                status = p.Status,
                amount = p.Amount,
                createdAt = p.CreatedAt,
                updatedAt = p.UpdatedAt
            });

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }
}
