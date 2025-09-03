using Microsoft.AspNetCore.Mvc;
using JEGASolutions.API.Data;
using JEGASolutions.API.Models;
using JEGASolutions.API.Services;
using JEGASolutions.API.Utils;
using Microsoft.EntityFrameworkCore;

namespace JEGASolutions.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IEmailService _emailService;
    private readonly ILogger<UsersController> _logger;

    public UsersController(ApplicationDbContext context, IEmailService emailService, ILogger<UsersController> logger)
    {
        _context = context;
        _emailService = emailService;
        _logger = logger;
    }

    [HttpGet("tenant/{tenantId}")]
    public async Task<IActionResult> GetUsersByTenant(int tenantId)
    {
        try
        {
            var users = await _context.Users
                .Where(u => u.TenantId == tenantId)
                .Select(u => new
                {
                    u.Id,
                    u.Email,
                    u.FullName,
                    u.Role,
                    u.CreatedAt,
                    u.LastLoginAt
                })
                .ToListAsync();

            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving users for tenant {TenantId}", tenantId);
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        try
        {
            var user = await _context.Users
                .Include(u => u.Tenant)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var result = new
            {
                user.Id,
                user.Email,
                user.FullName,
                user.Role,
                user.CreatedAt,
                user.LastLoginAt,
                Tenant = new
                {
                    user.Tenant.Id,
                    user.Tenant.Name,
                    user.Tenant.Subdomain,
                    user.Tenant.Status
                }
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user {UserId}", id);
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
    {
        try
        {
            // Check if tenant exists
            var tenant = await _context.Tenants.FindAsync(request.TenantId);
            if (tenant == null)
            {
                return BadRequest(new { message = "Tenant not found" });
            }

            // Check if user already exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email && u.TenantId == request.TenantId);

            if (existingUser != null)
            {
                return BadRequest(new { message = "User already exists in this tenant" });
            }

            var temporaryPassword = PasswordGenerator.GenerateTemporaryPassword();
            var user = new User
            {
                TenantId = request.TenantId,
                Email = request.Email,
                FullName = request.FullName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(temporaryPassword),
                Role = request.Role ?? "USER"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Send credentials email
            await _emailService.SendTenantCredentialsAsync(tenant, user, temporaryPassword);

            var result = new
            {
                user.Id,
                user.Email,
                user.FullName,
                user.Role,
                user.CreatedAt,
                Message = "User created successfully. Credentials email sent."
            };

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user");
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest request)
    {
        try
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            user.FullName = request.FullName ?? user.FullName;
            user.Role = request.Role ?? user.Role;

            // Update password if provided
            if (!string.IsNullOrEmpty(request.NewPassword))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            }

            await _context.SaveChangesAsync();

            var result = new
            {
                user.Id,
                user.Email,
                user.FullName,
                user.Role,
                user.CreatedAt,
                user.LastLoginAt
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user {UserId}", id);
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        try
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user {UserId}", id);
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    [HttpPost("{id}/reset-password")]
    public async Task<IActionResult> ResetPassword(int id)
    {
        try
        {
            var user = await _context.Users
                .Include(u => u.Tenant)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var temporaryPassword = PasswordGenerator.GenerateTemporaryPassword();
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(temporaryPassword);

            await _context.SaveChangesAsync();

            // Send new credentials email
            await _emailService.SendTenantCredentialsAsync(user.Tenant, user, temporaryPassword);

            return Ok(new { message = "Password reset successfully. New credentials sent via email." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resetting password for user {UserId}", id);
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }
}

public class CreateUserRequest
{
    public int TenantId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Role { get; set; }
}

public class UpdateUserRequest
{
    public string? FullName { get; set; }
    public string? Role { get; set; }
    public string? NewPassword { get; set; }
}
