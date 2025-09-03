using JEGASolutions.API.Models;

namespace JEGASolutions.API.Services;

public interface IAuthService
{
    Task<AuthResult> LoginAsync(string email, string password);
    Task<AuthResult> TenantLoginAsync(string email, string password, string subdomain);
    Task<AuthResult> RefreshTokenAsync(string refreshToken);
    Task<bool> LogoutAsync(string token);
    Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
    Task<bool> ResetPasswordAsync(string email);
    Task<User?> GetUserByEmailAsync(string email);
    Task<User?> GetUserBySubdomainAsync(string email, string subdomain);
}

public class AuthResult
{
    public bool Success { get; set; }
    public string? Token { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public UserInfo? User { get; set; }
    public string? ErrorMessage { get; set; }
}

public class UserInfo
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int? TenantId { get; set; }
    public string? TenantName { get; set; }
    public string? TenantSubdomain { get; set; }
    public List<string> Permissions { get; set; } = new();
}
