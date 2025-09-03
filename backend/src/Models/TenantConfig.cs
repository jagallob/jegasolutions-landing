using System.ComponentModel.DataAnnotations;

namespace JEGASolutions.API.Models;

public class TenantConfig
{
    public int Id { get; set; }
    public int TenantId { get; set; }
    
    [Required]
    public string Theme { get; set; } = "default";
    
    public string? LogoUrl { get; set; }
    public string? PrimaryColor { get; set; }
    public string? SecondaryColor { get; set; }
    public string? AccentColor { get; set; }
    
    // Configuración de módulos
    public string? ModuleConfigs { get; set; } // JSON string
    
    // Módulos personalizados
    public string? CustomModules { get; set; } // JSON string
    
    // Personalizaciones adicionales
    public string? Customizations { get; set; } // JSON string
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation property
    public Tenant Tenant { get; set; } = null!;
}


