using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JEGASolutions.API.Data;
using JEGASolutions.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace JEGASolutions.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TenantConfigController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<TenantConfigController> _logger;

    public TenantConfigController(ApplicationDbContext context, ILogger<TenantConfigController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("{tenantId}")]
    public async Task<IActionResult> GetTenantConfig(int tenantId)
    {
        try
        {
            var config = await _context.TenantConfigs
                .FirstOrDefaultAsync(c => c.TenantId == tenantId);

            if (config == null)
            {
                // Crear configuración por defecto
                config = new TenantConfig
                {
                    TenantId = tenantId,
                    Theme = "default",
                    ModuleConfigs = JsonSerializer.Serialize(new { }),
                    CustomModules = JsonSerializer.Serialize(new { }),
                    Customizations = JsonSerializer.Serialize(new { })
                };
                
                _context.TenantConfigs.Add(config);
                await _context.SaveChangesAsync();
            }

            var result = new
            {
                config.Id,
                config.TenantId,
                config.Theme,
                config.LogoUrl,
                config.PrimaryColor,
                config.SecondaryColor,
                config.AccentColor,
                moduleConfigs = JsonSerializer.Deserialize<object>(config.ModuleConfigs ?? "{}"),
                customModules = JsonSerializer.Deserialize<object>(config.CustomModules ?? "{}"),
                customizations = JsonSerializer.Deserialize<object>(config.Customizations ?? "{}")
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting tenant config for tenant {TenantId}", tenantId);
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    [HttpPut("{tenantId}")]
    public async Task<IActionResult> UpdateTenantConfig(int tenantId, [FromBody] UpdateTenantConfigRequest request)
    {
        try
        {
            var config = await _context.TenantConfigs
                .FirstOrDefaultAsync(c => c.TenantId == tenantId);

            if (config == null)
            {
                config = new TenantConfig { TenantId = tenantId };
                _context.TenantConfigs.Add(config);
            }

            // Actualizar propiedades
            if (request.Theme != null) config.Theme = request.Theme;
            if (request.LogoUrl != null) config.LogoUrl = request.LogoUrl;
            if (request.PrimaryColor != null) config.PrimaryColor = request.PrimaryColor;
            if (request.SecondaryColor != null) config.SecondaryColor = request.SecondaryColor;
            if (request.AccentColor != null) config.AccentColor = request.AccentColor;
            if (request.ModuleConfigs != null) config.ModuleConfigs = JsonSerializer.Serialize(request.ModuleConfigs);
            if (request.CustomModules != null) config.CustomModules = JsonSerializer.Serialize(request.CustomModules);
            if (request.Customizations != null) config.Customizations = JsonSerializer.Serialize(request.Customizations);

            config.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var result = new
            {
                config.Id,
                config.TenantId,
                config.Theme,
                config.LogoUrl,
                config.PrimaryColor,
                config.SecondaryColor,
                config.AccentColor,
                moduleConfigs = JsonSerializer.Deserialize<object>(config.ModuleConfigs ?? "{}"),
                customModules = JsonSerializer.Deserialize<object>(config.CustomModules ?? "{}"),
                customizations = JsonSerializer.Deserialize<object>(config.Customizations ?? "{}")
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating tenant config for tenant {TenantId}", tenantId);
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    [HttpPost("{tenantId}/theme")]
    public async Task<IActionResult> UpdateTheme(int tenantId, [FromBody] UpdateThemeRequest request)
    {
        try
        {
            var config = await _context.TenantConfigs
                .FirstOrDefaultAsync(c => c.TenantId == tenantId);

            if (config == null)
            {
                config = new TenantConfig { TenantId = tenantId };
                _context.TenantConfigs.Add(config);
            }

            config.Theme = request.Theme;
            config.PrimaryColor = request.PrimaryColor;
            config.SecondaryColor = request.SecondaryColor;
            config.AccentColor = request.AccentColor;
            config.LogoUrl = request.LogoUrl;
            config.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Tema actualizado exitosamente" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating theme for tenant {TenantId}", tenantId);
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }
}

public class UpdateTenantConfigRequest
{
    public string? Theme { get; set; }
    public string? LogoUrl { get; set; }
    public string? PrimaryColor { get; set; }
    public string? SecondaryColor { get; set; }
    public string? AccentColor { get; set; }
    public object? ModuleConfigs { get; set; }
    public object? CustomModules { get; set; }
    public object? Customizations { get; set; }
}

public class UpdateThemeRequest
{
    public string Theme { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public string? PrimaryColor { get; set; }
    public string? SecondaryColor { get; set; }
    public string? AccentColor { get; set; }
}


