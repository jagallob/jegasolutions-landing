using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using JEGASolutions.API.Data;
using JEGASolutions.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace JEGASolutions.API.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;

    public AuthService(ApplicationDbContext context, IConfiguration configuration, ILogger<AuthService> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<AuthResult> LoginAsync(string email, string password)
    {
        try
        {
            var user = await _context.Users
                .Include(u => u.Tenant)
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                return new AuthResult
                {
                    Success = false,
                    ErrorMessage = "Credenciales inválidas"
                };
            }

            if (user.Tenant?.Status != "ACTIVE")
            {
                return new AuthResult
                {
                    Success = false,
                    ErrorMessage = "Tu cuenta está inactiva. Contacta al administrador."
                };
            }

            // Update last login
            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            // Store refresh token (in production, you'd store this in a separate table)
            // For now, we'll include it in the response

            return new AuthResult
            {
                Success = true,
                Token = token,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(GetTokenExpirationMinutes()),
                User = new UserInfo
                {
                    Id = user.Id,
                    Email = user.Email,
                    FullName = user.FullName,
                    Role = user.Role,
                    TenantId = user.TenantId,
                    TenantName = user.Tenant?.Name,
                    TenantSubdomain = user.Tenant?.Subdomain,
                    Permissions = GetUserPermissions(user.Role)
                }
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for email {Email}", email);
            return new AuthResult
            {
                Success = false,
                ErrorMessage = "Error interno del servidor"
            };
        }
    }

    public async Task<AuthResult> TenantLoginAsync(string email, string password, string subdomain)
    {
        try
        {
            var user = await _context.Users
                .Include(u => u.Tenant)
                .FirstOrDefaultAsync(u => u.Email == email && u.Tenant.Subdomain == subdomain);

            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                return new AuthResult
                {
                    Success = false,
                    ErrorMessage = "Credenciales inválidas para este tenant"
                };
            }

            if (user.Tenant?.Status != "ACTIVE")
            {
                return new AuthResult
                {
                    Success = false,
                    ErrorMessage = "El tenant está inactivo"
                };
            }

            // Update last login
            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            return new AuthResult
            {
                Success = true,
                Token = token,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(GetTokenExpirationMinutes()),
                User = new UserInfo
                {
                    Id = user.Id,
                    Email = user.Email,
                    FullName = user.FullName,
                    Role = user.Role,
                    TenantId = user.TenantId,
                    TenantName = user.Tenant?.Name,
                    TenantSubdomain = user.Tenant?.Subdomain,
                    Permissions = GetUserPermissions(user.Role)
                }
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during tenant login for email {Email} and subdomain {Subdomain}", email, subdomain);
            return new AuthResult
            {
                Success = false,
                ErrorMessage = "Error interno del servidor"
            };
        }
    }

    public async Task<AuthResult> RefreshTokenAsync(string refreshToken)
    {
        try
        {
            // In production, validate the refresh token against a stored value
            // For now, we'll generate a new token (simplified implementation)
            
            // TODO: Implement proper refresh token validation
            return new AuthResult
            {
                Success = false,
                ErrorMessage = "Refresh token no implementado completamente"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error refreshing token");
            return new AuthResult
            {
                Success = false,
                ErrorMessage = "Error interno del servidor"
            };
        }
    }

    public async Task<bool> LogoutAsync(string token)
    {
        try
        {
            // In production, you would invalidate the token (add to blacklist)
            // For now, we'll just return true
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout");
            return false;
        }
    }

    public async Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return false;

            if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
                return false;

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await _context.SaveChangesAsync();

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error changing password for user {UserId}", userId);
            return false;
        }
    }

    public async Task<bool> ResetPasswordAsync(string email)
    {
        try
        {
            var user = await _context.Users
                .Include(u => u.Tenant)
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
                return false;

            // Generate new temporary password
            var temporaryPassword = PasswordGenerator.GenerateTemporaryPassword();
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(temporaryPassword);

            await _context.SaveChangesAsync();

            // Send email with new password (if email service is configured)
            // await _emailService.SendPasswordResetAsync(user, temporaryPassword);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resetting password for email {Email}", email);
            return false;
        }
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _context.Users
            .Include(u => u.Tenant)
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetUserBySubdomainAsync(string email, string subdomain)
    {
        return await _context.Users
            .Include(u => u.Tenant)
            .FirstOrDefaultAsync(u => u.Email == email && u.Tenant.Subdomain == subdomain);
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(GetJwtSecretKey()));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, user.FullName),
            new(ClaimTypes.Role, user.Role),
            new("tenant_id", user.TenantId?.ToString() ?? ""),
            new("tenant_name", user.Tenant?.Name ?? ""),
            new("tenant_subdomain", user.Tenant?.Subdomain ?? ""),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Iat, new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
        };

        var token = new JwtSecurityToken(
            issuer: GetJwtIssuer(),
            audience: GetJwtAudience(),
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(GetTokenExpirationMinutes()),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GenerateRefreshToken()
    {
        return Guid.NewGuid().ToString();
    }

    private List<string> GetUserPermissions(string role)
    {
        return role switch
        {
            "ADMIN" => new List<string> { "read", "write", "delete", "manage_users", "manage_settings" },
            "USER" => new List<string> { "read", "write" },
            "VIEWER" => new List<string> { "read" },
            _ => new List<string> { "read" }
        };
    }

    private string GetJwtSecretKey()
    {
        return _configuration["JWT:SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
    }

    private string GetJwtIssuer()
    {
        return _configuration["JWT:Issuer"] ?? "JEGASolutions";
    }

    private string GetJwtAudience()
    {
        return _configuration["JWT:Audience"] ?? "JEGASolutions.Users";
    }

    private int GetTokenExpirationMinutes()
    {
        return int.Parse(_configuration["JWT:ExpirationMinutes"] ?? "60");
    }
}
