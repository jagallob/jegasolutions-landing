# JEGASolutions API Backend

Backend API para la plataforma SaaS multi-tenant de JEGASolutions.

## 🚀 Características

- **ASP.NET Core 8.0** - Framework web moderno
- **PostgreSQL** - Base de datos robusta
- **Entity Framework Core** - ORM para acceso a datos
- **JWT Authentication** - Autenticación segura
- **Wompi Integration** - Procesamiento de pagos
- **Multi-tenancy** - Soporte para múltiples clientes
- **Webhooks** - Notificaciones en tiempo real

## 📦 Instalación

### Prerrequisitos

- .NET 8.0 SDK
- PostgreSQL 12+
- Visual Studio Code o Visual Studio

### Configuración

1. **Clonar y configurar**

   ```bash
   cd backend
   dotnet restore
   ```

2. **Configurar base de datos**

   ```bash
   # Crear base de datos PostgreSQL
   createdb jegasolutions_dev

   # Aplicar migraciones
   dotnet ef database update
   ```

3. **Configurar variables de entorno**

   ```bash
   # Copiar archivo de configuración
   cp appsettings.Development.json appsettings.Local.json

   # Editar con tus credenciales
   # - ConnectionStrings
   # - Wompi keys
   # - JWT secret
   ```

4. **Ejecutar aplicación**
   ```bash
   dotnet run
   ```

## 🔧 Configuración

### Variables de Entorno

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=jegasolutions;Username=postgres;Password=password"
  },
  "Wompi": {
    "BaseUrl": "https://production.wompi.co/v1/",
    "PublicKey": "pub_test_your_public_key_here",
    "PrivateKey": "prv_test_your_private_key_here"
  },
  "JWT": {
    "SecretKey": "your_super_secret_jwt_key_here",
    "Issuer": "JEGASolutions",
    "Audience": "JEGASolutions.Users",
    "ExpirationMinutes": 60
  }
}
```

### Wompi Configuration

1. Obtener credenciales de Wompi
2. Configurar webhook URL: `https://api.jegasolutions.co/api/payments/webhook`
3. Configurar eventos: `transaction.updated`

## 📚 API Endpoints

### Payments

- `POST /api/payments/webhook` - Webhook de Wompi
- `GET /api/payments/status/{reference}` - Estado de pago
- `GET /api/payments/customer/{email}` - Pagos por cliente

### Tenants

- `GET /api/tenants` - Listar tenants
- `POST /api/tenants` - Crear tenant
- `GET /api/tenants/{id}` - Obtener tenant
- `PUT /api/tenants/{id}` - Actualizar tenant

### Authentication

- `POST /api/auth/login` - Login global
- `POST /api/auth/tenant-login` - Login por tenant
- `POST /api/auth/refresh` - Renovar token

## 🏗️ Arquitectura

```
src/
├── Controllers/          # Controladores API
├── Models/              # Modelos de datos
├── Services/            # Lógica de negocio
├── Data/               # Contexto de base de datos
└── Utils/              # Utilidades
```

## 🔒 Seguridad

- Validación de firmas de webhook
- JWT con claims de tenant
- CORS configurado
- Rate limiting (pendiente)
- HTTPS obligatorio en producción

## 🚀 Deployment

### Render.com

1. Conectar repositorio
2. Configurar variables de entorno
3. Build command: `dotnet publish -c Release -o ./publish`
4. Start command: `dotnet ./publish/JEGASolutions.API.dll`

### Docker

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY ./publish .
ENTRYPOINT ["dotnet", "JEGASolutions.API.dll"]
```

## 📊 Base de Datos

### Tablas Principales

- `Payments` - Transacciones de pago
- `Tenants` - Organizaciones cliente
- `TenantModules` - Módulos por tenant
- `Users` - Usuarios del sistema

### Migraciones

```bash
# Crear migración
dotnet ef migrations add InitialCreate

# Aplicar migración
dotnet ef database update

# Revertir migración
dotnet ef database update PreviousMigration
```

## 🧪 Testing

```bash
# Ejecutar tests
dotnet test

# Coverage
dotnet test --collect:"XPlat Code Coverage"
```

## 📝 Logs

Los logs se escriben en:

- Console (desarrollo)
- Archivos (producción)
- Structured logging con Serilog (pendiente)

## 🔄 Webhooks

### Wompi Events

- `transaction.updated` - Cambio de estado de transacción
- `transaction.approved` - Pago aprobado
- `transaction.declined` - Pago rechazado

### Procesamiento

1. Validar firma X-Integrity
2. Consultar estado en API de Wompi
3. Actualizar registro local
4. Crear tenant si pago aprobado
5. Enviar email con credenciales

## 📞 Soporte

- **Email**: soporte@jegasolutions.co
- **Documentación**: [API Docs](https://api.jegasolutions.co/swagger)
- **Issues**: GitHub Issues
