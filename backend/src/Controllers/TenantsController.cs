using Microsoft.AspNetCore.Mvc;
using JEGASolutions.API.Data;
using JEGASolutions.API.Models;
using JEGASolutions.API.Services;
using JEGASolutions.API.Utils;
using Microsoft.EntityFrameworkCore;

namespace JEGASolutions.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TenantsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IEmailService _emailService;
    private readonly ILogger<TenantsController> _logger;

    public TenantsController(ApplicationDbContext context, IEmailService emailService, ILogger<TenantsController> logger)
    {
        _context = context;
        _emailService = emailService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetTenants()
    {
        try
        {
            var tenants = await _context.Tenants
                .Include(t => t.Modules)
                .Include(t => t.Users)
                .Select(t => new
                {
                    t.Id,
                    t.Name,
                    t.Subdomain,
                    t.OwnerEmail,
                    t.Status,
                    t.CreatedAt,
                    ModuleCount = t.Modules.Count,
                    UserCount = t.Users.Count,
                    Url = $"https://{t.Subdomain}.jegasolutions.co"
                })
                .ToListAsync();

            return Ok(tenants);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tenants");
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTenant(int id)
    {
        try
        {
            var tenant = await _context.Tenants
                .Include(t => t.Modules)
                .Include(t => t.Users)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (tenant == null)
            {
                return NotFound(new { message = "Tenant not found" });
            }

            var result = new
            {
                tenant.Id,
                tenant.Name,
                tenant.Subdomain,
                tenant.OwnerEmail,
                tenant.Status,
                tenant.CreatedAt,
                tenant.UpdatedAt,
                Url = $"https://{tenant.Subdomain}.jegasolutions.co",
                Modules = tenant.Modules.Select(m => new
                {
                    m.Id,
                    m.ModuleName,
                    m.Status,
                    m.PurchasedAt,
                    m.ExpiresAt
                }),
                Users = tenant.Users.Select(u => new
                {
                    u.Id,
                    u.Email,
                    u.FullName,
                    u.Role,
                    u.CreatedAt,
                    u.LastLoginAt
                })
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tenant {TenantId}", id);
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateTenant([FromBody] CreateTenantRequest request)
    {
        try
        {
            // Check if subdomain already exists
            var existingTenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Subdomain == request.Subdomain);

            if (existingTenant != null)
            {
                return BadRequest(new { message = "Subdomain already exists" });
            }

            var tenant = new Tenant
            {
                Name = request.Name,
                Subdomain = request.Subdomain,
                OwnerEmail = request.OwnerEmail,
                Status = "ACTIVE"
            };

            _context.Tenants.Add(tenant);
            await _context.SaveChangesAsync();

            // Add modules if provided
            if (request.Modules?.Any() == true)
            {
                foreach (var moduleName in request.Modules)
                {
                    var tenantModule = new TenantModule
                    {
                        TenantId = tenant.Id,
                        ModuleName = moduleName,
                        Status = "ACTIVE"
                    };
                    _context.TenantModules.Add(tenantModule);
                }
                await _context.SaveChangesAsync();
            }

            // Create admin user
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

            // Send welcome email
            await _emailService.SendWelcomeEmailAsync(tenant, temporaryPassword);

            var result = new
            {
                tenant.Id,
                tenant.Name,
                tenant.Subdomain,
                tenant.OwnerEmail,
                tenant.Status,
                tenant.CreatedAt,
                Url = $"https://{tenant.Subdomain}.jegasolutions.co",
                Message = "Tenant created successfully. Welcome email sent."
            };

            return CreatedAtAction(nameof(GetTenant), new { id = tenant.Id }, result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating tenant");
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTenant(int id, [FromBody] UpdateTenantRequest request)
    {
        try
        {
            var tenant = await _context.Tenants.FindAsync(id);
            if (tenant == null)
            {
                return NotFound(new { message = "Tenant not found" });
            }

            tenant.Name = request.Name ?? tenant.Name;
            tenant.Status = request.Status ?? tenant.Status;
            tenant.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var result = new
            {
                tenant.Id,
                tenant.Name,
                tenant.Subdomain,
                tenant.OwnerEmail,
                tenant.Status,
                tenant.CreatedAt,
                tenant.UpdatedAt,
                Url = $"https://{tenant.Subdomain}.jegasolutions.co"
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating tenant {TenantId}", id);
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTenant(int id)
    {
        try
        {
            var tenant = await _context.Tenants.FindAsync(id);
            if (tenant == null)
            {
                return NotFound(new { message = "Tenant not found" });
            }

            // Soft delete - change status to CANCELLED
            tenant.Status = "CANCELLED";
            tenant.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Tenant cancelled successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting tenant {TenantId}", id);
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }
}

public class CreateTenantRequest
{
    public string Name { get; set; } = string.Empty;
    public string Subdomain { get; set; } = string.Empty;
    public string OwnerEmail { get; set; } = string.Empty;
    public List<string>? Modules { get; set; }
}

public class UpdateTenantRequest
{
    public string? Name { get; set; }
    public string? Status { get; set; }
}
