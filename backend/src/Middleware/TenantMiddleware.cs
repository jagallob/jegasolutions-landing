using System.Security.Claims;
using JEGASolutions.API.Data;
using Microsoft.EntityFrameworkCore;

namespace JEGASolutions.API.Middleware;

public class TenantMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<TenantMiddleware> _logger;

    public TenantMiddleware(RequestDelegate next, ILogger<TenantMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, ApplicationDbContext dbContext)
    {
        // Skip tenant validation for certain paths
        if (ShouldSkipTenantValidation(context.Request.Path))
        {
            await _next(context);
            return;
        }

        // Check if user is authenticated
        if (!context.User.Identity?.IsAuthenticated ?? true)
        {
            await _next(context);
            return;
        }

        try
        {
            var tenantIdClaim = context.User.FindFirst("tenant_id")?.Value;
            var tenantSubdomainClaim = context.User.FindFirst("tenant_subdomain")?.Value;

            if (string.IsNullOrEmpty(tenantIdClaim) || string.IsNullOrEmpty(tenantSubdomainClaim))
            {
                _logger.LogWarning("User authenticated but missing tenant information");
                await _next(context);
                return;
            }

            // Validate tenant exists and is active
            var tenantExists = await dbContext.Tenants
                .AnyAsync(t => t.Id == int.Parse(tenantIdClaim) && t.Subdomain == tenantSubdomainClaim && t.Status == "ACTIVE");

            if (!tenantExists)
            {
                _logger.LogWarning("User authenticated but tenant {TenantId} with subdomain {Subdomain} is not active", tenantIdClaim, tenantSubdomainClaim);
                context.Response.StatusCode = 403;
                await context.Response.WriteAsync("Tenant no activo o no encontrado");
                return;
            }

            // Add tenant information to context
            context.Items["TenantId"] = tenantIdClaim;
            context.Items["TenantSubdomain"] = tenantSubdomainClaim;

            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TenantMiddleware");
            context.Response.StatusCode = 500;
            await context.Response.WriteAsync("Error interno del servidor");
        }
    }

    private static bool ShouldSkipTenantValidation(PathString path)
    {
        var skipPaths = new[]
        {
            "/api/auth/login",
            "/api/auth/tenant-login",
            "/api/auth/refresh",
            "/api/auth/reset-password",
            "/api/payments/webhook",
            "/swagger",
            "/health"
        };

        return skipPaths.Any(skipPath => path.StartsWithSegments(skipPath));
    }
}
