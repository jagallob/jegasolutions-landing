using System.ComponentModel.DataAnnotations;

namespace JEGASolutions.API.Models;

public class Tenant
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string Subdomain { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(255)]
    public string OwnerEmail { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "ACTIVE";
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    public virtual ICollection<TenantModule> Modules { get; set; } = new List<TenantModule>();
    public virtual ICollection<User> Users { get; set; } = new List<User>();
}

public class TenantModule
{
    public int Id { get; set; }
    
    public int TenantId { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string ModuleName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "ACTIVE";
    
    public DateTime PurchasedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? ExpiresAt { get; set; }
    
    // Navigation properties
    public virtual Tenant Tenant { get; set; } = null!;
}

public class User
{
    public int Id { get; set; }
    
    public int TenantId { get; set; }
    
    [Required]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(255)]
    public string FullName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(255)]
    public string PasswordHash { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string Role { get; set; } = "USER";
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? LastLoginAt { get; set; }
    
    // Navigation properties
    public virtual Tenant Tenant { get; set; } = null!;
}

public enum TenantStatus
{
    ACTIVE,
    SUSPENDED,
    CANCELLED
}

public enum ModuleStatus
{
    ACTIVE,
    SUSPENDED,
    EXPIRED
}

public enum UserRole
{
    ADMIN,
    USER,
    VIEWER
}
