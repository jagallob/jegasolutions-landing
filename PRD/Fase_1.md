# 🚀 PRD FASE 1: Integración de Pagos Wompi

**Duración estimada**: 1-2 semanas  
**Prioridad**: CRÍTICA - Base de todo el sistema

---

## 1. Objetivo Específico

Implementar la capacidad de recibir pagos vía Wompi en la landing de JEGASolutions y validar las transacciones mediante webhooks. Al final de esta fase, los usuarios podrán pagar módulos y el sistema registrará correctamente todas las transacciones.

---

## 2. Pre-requisitos Técnicos

### Cuentas y Configuración

1. **Cuenta Wompi**:

   - Registrarse en https://comercios.wompi.co
   - Obtener claves de sandbox: `pub_test_xxxxx` y `prv_test_xxxxx`
   - Configurar webhook URL en dashboard de Wompi

2. **Variables de Entorno**:

```bash
# Frontend (.env.local en Vercel)
VITE_WOMPI_PUBLIC_KEY=pub_test_xxxxx
VITE_API_BASE_URL=https://tu-api.render.com

# Backend (.env en Render)
WOMPI_PRIVATE_KEY=prv_test_xxxxx
WOMPI_SANDBOX_URL=https://sandbox.wompi.co/v1
DATABASE_URL=postgresql://user:pass@host:port/db
```

---

## 3. Implementación Frontend

### 3.1 Instalación de Dependencias

```json
// package.json - agregar si no existe
{
  "dependencies": {
    "react": "^18.0.0",
    "react-router-dom": "^6.0.0"
  }
}
```

### 3.2 Script de Wompi en HTML

```html
<!-- public/index.html -->
<script src="https://checkout.wompi.co/widget.js"></script>
```

### 3.3 Componente de Pago Mejorado

```jsx
// src/components/PricingCalculator.jsx
import React, { useState } from "react";

const PricingCalculator = () => {
  const [loading, setLoading] = useState(false);

  const modules = [
    {
      id: "gestor_horas_extra",
      name: "GestorHorasExtra",
      description: "Gestión completa de horas extra y nómina",
      price: 89900, // Precio en pesos colombianos
      features: [
        "Registro de horas extra",
        "Cálculos automáticos de nómina",
        "Reportes gerenciales",
        "Dashboard en tiempo real",
      ],
    },
    {
      id: "report_builder",
      name: "ReportBuilderProject",
      description: "Consolidación de informes con IA",
      price: 129900,
      features: [
        "Generación automática de informes",
        "Análisis con IA",
        "Narrativas ejecutivas",
        "Exportación múltiple",
      ],
    },
  ];

  const handlePayment = async (module) => {
    setLoading(true);

    try {
      // Generar referencia única
      const reference = `MODULE-${module.id}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Configurar Wompi Checkout
      const checkout = new window.WompiCheckout({
        currency: "COP",
        amountInCents: module.price * 100,
        reference: reference,
        publicKey: import.meta.env.VITE_WOMPI_PUBLIC_KEY,
        redirectUrl: `${window.location.origin}/payment-success?ref=${reference}`,
        taxInCents: {
          vat: Math.round(module.price * 100 * 0.19), // IVA 19%
          consumption: 0,
          devolutionBase: 0,
        },
        customerData: {
          email: "cliente@ejemplo.com", // En fase 3 vendrá del formulario
          fullName: "Cliente Ejemplo",
          phoneNumber: "3001234567",
        },
        shippingAddress: {
          addressLine1: "Medellín, Antioquia",
          country: "CO",
          region: "Antioquia",
          city: "Medellín",
          postalCode: "050001",
        },
        customData: {
          module_id: module.id,
          module_name: module.name,
        },
      });

      // Abrir modal de pago
      checkout.open(function (result) {
        if (result.transaction && result.transaction.status === "APPROVED") {
          window.location.href = `/payment-success?ref=${reference}`;
        } else {
          window.location.href = `/payment-failure?ref=${reference}`;
        }
        setLoading(false);
      });
    } catch (error) {
      console.error("Error iniciando pago:", error);
      alert("Error al procesar el pago. Intenta nuevamente.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Módulos SaaS Disponibles
        </h2>
        <p className="text-lg text-gray-600">
          Selecciona el módulo que necesita tu empresa
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {modules.map((module) => (
          <div
            key={module.id}
            className="bg-white rounded-lg shadow-lg p-8 border border-gray-200"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {module.name}
              </h3>
              <p className="text-gray-600 mb-4">{module.description}</p>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                ${module.price.toLocaleString("es-CO")}
              </div>
              <p className="text-sm text-gray-500">COP / mes</p>
            </div>

            <ul className="mb-8 space-y-2">
              {module.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePayment(module)}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? "Procesando..." : "Comprar Ahora"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingCalculator;
```

### 3.4 Páginas de Confirmación

```jsx
// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("ref");
  const [paymentStatus, setPaymentStatus] = useState("verificando");

  useEffect(() => {
    // Opcional: verificar estado del pago con el backend
    if (reference) {
      fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/payments/status/${reference}`
      )
        .then((res) => res.json())
        .then((data) => {
          setPaymentStatus(data.status);
        })
        .catch((err) => {
          console.error("Error verificando pago:", err);
          setPaymentStatus("error");
        });
    }
  }, [reference]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Pago Exitoso!
          </h1>
          <p className="text-gray-600">
            Tu transacción ha sido procesada correctamente.
          </p>
        </div>

        {reference && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Referencia:</p>
            <p className="font-mono text-sm font-medium">{reference}</p>
            <p className="text-sm text-gray-500 mt-2">
              Estado: {paymentStatus}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-gray-700">
            Recibirás un correo con las instrucciones de acceso a tu módulo en
            los próximos minutos.
          </p>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
```

```jsx
// src/pages/PaymentFailure.jsx
import React from "react";
import { useSearchParams } from "react-router-dom";

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("ref");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pago No Procesado
          </h1>
          <p className="text-gray-600">Hubo un problema con tu transacción.</p>
        </div>

        {reference && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Referencia:</p>
            <p className="font-mono text-sm font-medium">{reference}</p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-gray-700">
            Puedes intentar nuevamente o contactar a nuestro soporte si el
            problema persiste.
          </p>

          <div className="flex space-x-4">
            <button
              onClick={() => (window.location.href = "/")}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Volver al Inicio
            </button>
            <button
              onClick={() => (window.location.href = "/#modulos")}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
```

### 3.5 Configuración de Rutas

```jsx
// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
```

---

## 4. Implementación Backend

### 4.1 Modelo de Base de Datos

```sql
-- Crear tabla payments
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    reference VARCHAR(255) UNIQUE NOT NULL,
    wompi_transaction_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'PENDING',
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'COP',
    module_id VARCHAR(100),
    module_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    payment_method VARCHAR(100),
    payment_method_type VARCHAR(100),
    wompi_status VARCHAR(50),
    wompi_status_message TEXT,
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    raw_webhook_data JSONB
);

-- Índices para optimizar consultas
CREATE INDEX idx_payments_reference ON payments(reference);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);
```

### 4.2 Modelo de Datos (C#)

```csharp
// Models/Payment.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JegaSolutions.Api.Models
{
    public class Payment
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Reference { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? WompiTransactionId { get; set; }

        [MaxLength(50)]
        public string Status { get; set; } = "PENDING";

        [Column(TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; }

        [MaxLength(3)]
        public string Currency { get; set; } = "COP";

        [MaxLength(100)]
        public string? ModuleId { get; set; }

        [MaxLength(255)]
        public string? ModuleName { get; set; }

        [MaxLength(255)]
        public string? CustomerEmail { get; set; }

        [MaxLength(255)]
        public string? CustomerName { get; set; }

        [MaxLength(50)]
        public string? CustomerPhone { get; set; }

        [MaxLength(100)]
        public string? PaymentMethod { get; set; }

        [MaxLength(100)]
        public string? PaymentMethodType { get; set; }

        [MaxLength(50)]
        public string? WompiStatus { get; set; }

        public string? WompiStatusMessage { get; set; }

        public DateTime? ProcessedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "jsonb")]
        public string? RawWebhookData { get; set; }
    }
}
```

### 4.3 Servicio de Wompi

```csharp
// Services/WompiService.cs
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using JegaSolutions.Api.Models;

namespace JegaSolutions.Api.Services
{
    public class WompiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<WompiService> _logger;

        public WompiService(HttpClient httpClient, IConfiguration configuration, ILogger<WompiService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
        }

        public bool ValidateWebhookSignature(string payload, string signature)
        {
            try
            {
                var privateKey = _configuration["WOMPI_PRIVATE_KEY"];
                if (string.IsNullOrEmpty(privateKey))
                {
                    _logger.LogError("WOMPI_PRIVATE_KEY no configurado");
                    return false;
                }

                // Calcular hash esperado
                var dataToHash = $"{payload}{privateKey}";
                using var sha256 = SHA256.Create();
                var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(dataToHash));
                var expectedSignature = Convert.ToHexString(hashBytes).ToLower();

                // Comparar con signature recibido
                var receivedSignature = signature.Replace("sha256=", "").ToLower();

                return expectedSignature == receivedSignature;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validando firma de webhook");
                return false;
            }
        }

        public async Task<WompiTransactionResponse?> GetTransactionStatus(string transactionId)
        {
            try
            {
                var url = $"{_configuration["WOMPI_SANDBOX_URL"]}/transactions/{transactionId}";
                var response = await _httpClient.GetAsync(url);

                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    return JsonSerializer.Deserialize<WompiTransactionResponse>(json);
                }

                _logger.LogWarning($"Error consultando transacción {transactionId}: {response.StatusCode}");
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error consultando transacción {transactionId}");
                return null;
            }
        }
    }

    // DTOs para respuesta de Wompi
    public class WompiTransactionResponse
    {
        public WompiTransactionData Data { get; set; } = new();
    }

    public class WompiTransactionData
    {
        public string Id { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Reference { get; set; } = string.Empty;
        public decimal Amount_in_cents { get; set; }
        public string Currency { get; set; } = string.Empty;
        public WompiPaymentMethod Payment_method { get; set; } = new();
    }

    public class WompiPaymentMethod
    {
        public string Type { get; set; } = string.Empty;
        public string Extra { get; set; } = string.Empty;
    }
}
```

### 4.4 Controlador de Webhook

```csharp
// Controllers/PaymentsController.cs
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using JegaSolutions.Api.Services;
using JegaSolutions.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace JegaSolutions.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly WompiService _wompiService;
        private readonly ILogger<PaymentsController> _logger;

        public PaymentsController(AppDbContext context, WompiService wompiService, ILogger<PaymentsController> logger)
        {
            _context = context;
            _wompiService = wompiService;
            _logger = logger;
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> Webhook()
        {
            try
            {
                // Leer payload del request
                string payload;
                using (var reader = new StreamReader(Request.Body, System.Text.Encoding.UTF8))
                {
                    payload = await reader.ReadToEndAsync();
                }

                _logger.LogInformation($"Webhook recibido: {payload}");

                // Obtener signature del header
                var signature = Request.Headers["X-Integrity"].FirstOrDefault();
                if (string.IsNullOrEmpty(signature))
                {
                    _logger.LogWarning("Webhook sin signature");
                    return BadRequest("Signature requerido");
                }

                // Validar signature
                if (!_wompiService.ValidateWebhookSignature(payload, signature))
                {
                    _logger.LogWarning($"Signature inválido: {signature}");
                    return Unauthorized("Signature inválido");
                }

                // Parsear payload
                var webhookData = JsonSerializer.Deserialize<JsonElement>(payload);
                var eventType = webhookData.GetProperty("event").GetString();

                _logger.LogInformation($"Evento procesando: {eventType}");

                // Procesar solo eventos de transacción
                if (eventType == "transaction.updated")
                {
                    var transactionData = webhookData.GetProperty("data").GetProperty("transaction");
                    var reference = transactionData.GetProperty("reference").GetString();
                    var transactionId = transactionData.GetProperty("id").GetString();
                    var status = transactionData.GetProperty("status").GetString();

                    await ProcessTransaction(reference, transactionId, status, payload);
                }

                return Ok(new { received = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error procesando webhook");
                return StatusCode(500, "Error interno del servidor");
            }
        }

        private async Task ProcessTransaction(string? reference, string? transactionId, string? status, string rawData)
        {
            if (string.IsNullOrEmpty(reference))
            {
                _logger.LogWarning("Reference vacío en webhook");
                return;
            }

            try
            {
                // Buscar el pago en BD
                var payment = await _context.Payments
                    .FirstOrDefaultAsync(p => p.Reference == reference);

                if (payment == null)
                {
                    _logger.LogWarning($"Pago no encontrado para referencia: {reference}");
                    return;
                }

                // Evitar procesamiento duplicado
                if (payment.ProcessedAt != null)
                {
                    _logger.LogInformation($"Pago {reference} ya procesado anteriormente");
                    return;
                }

                // Confirmar estado con API de Wompi
                var transactionResponse = await _wompiService.GetTransactionStatus(transactionId!);
                if (transactionResponse?.Data != null)
                {
                    // Actualizar datos del pago
                    payment.WompiTransactionId = transactionId;
                    payment.WompiStatus = transactionResponse.Data.Status;
                    payment.PaymentMethod = transactionResponse.Data.Payment_method.Type;
                    payment.UpdatedAt = DateTime.UtcNow;
                    payment.RawWebhookData = rawData;

                    // Determinar estado final
                    switch (transactionResponse.Data.Status.ToUpper())
                    {
                        case "APPROVED":
                            payment.Status = "COMPLETED";
                            payment.ProcessedAt = DateTime.UtcNow;
                            _logger.LogInformation($"Pago {reference} APROBADO");

                            // TODO: En Fase 2 - Crear tenant aquí
                            break;

                        case "DECLINED":
                        case "ERROR":
                            payment.Status = "FAILED";
                            payment.ProcessedAt = DateTime.UtcNow;
                            _logger.LogInformation($"Pago {reference} RECHAZADO: {transactionResponse.Data.Status}");
                            break;

                        default:
                            payment.Status = "PENDING";
                            _logger.LogInformation($"Pago {reference} en estado: {transactionResponse.Data.Status}");
                            break;
                    }

                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"Pago {reference} actualizado exitosamente");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error procesando transacción {reference}");
            }
        }

        [HttpGet("status/{reference}")]
        public async Task<IActionResult> GetPaymentStatus(string reference)
        {
            try
            {
                var payment = await _context.Payments
                    .FirstOrDefaultAsync(p => p.Reference == reference);

                if (payment == null)
                {
                    return NotFound(new { message = "Pago no encontrado" });
                }

                return Ok(new
                {
                    reference = payment.Reference,
                    status = payment.Status,
                    amount = payment.Amount,
                    module = payment.ModuleName,
                    processedAt = payment.ProcessedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error consultando estado del pago {reference}");
                return StatusCode(500, "Error interno del servidor");
            }
        }
    }
}
```

### 4.5 Configuración de Startup

```csharp
// Program.cs
using Microsoft.EntityFrameworkCore;
using JegaSolutions.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Configurar servicios
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHttpClient<WompiService>();
builder.Services.AddScoped<WompiService>();

// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "https://jegasolutions-landing.vercel.app",
            "https://jegasolutions.co"
        )
        .AllowAnyMethod()
        .AllowAnyHeader();
    });
});

var app = builder.Build();

// Pipeline de middleware
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseRouting();
app.MapControllers();

app.Run();
```

---

## 5. Configuración de Despliegue

### 5.1 Variables de Entorno en Vercel

```bash
# Dashboard de Vercel -> Settings -> Environment Variables
VITE_WOMPI_PUBLIC_KEY=pub_test_xxxxx
VITE_API_BASE_URL=https://tu-api.render.com
```

### 5.2 Variables de Entorno en Render

```bash
# Dashboard de Render -> Environment Variables
WOMPI_PRIVATE_KEY=prv_test_xxxxx
WOMPI_SANDBOX_URL=https://sandbox.wompi.co/v1
DATABASE_URL=postgresql://user:pass@host:port/db
ASPNETCORE_ENVIRONMENT=Development
```

### 5.3 Configuración de Webhook en Wompi

1. Ir al dashboard de Wompi
2. Configurar URL de webhook: `https://tu-api.render.com/api/payments/webhook`
3. Seleccionar eventos: `transaction.updated`

---

## 6. Testing

### 6.1 Datos de Prueba en Sandbox

```javascript
// Tarjetas de prueba de Wompi
const testCards = {
  success: {
    number: "4242424242424242",
    cvc: "123",
    exp_month: "12",
    exp_year: "2030",
  },
  declined: {
    number: "4000000000000002",
    cvc: "123",
    exp_month: "12",
    exp_year: "2030",
  },
};
```

### 6.2 Script de Test del Webhook

```

```
