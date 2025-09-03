# 📄 PRD Consolidado - Plataforma JEGASolutions Multi-Tenant con Pagos Wompi

## 1. Objetivo General

Transformar la landing page estática de JEGASolutions en una **plataforma SaaS multi-tenant** que permita:

- Venta de módulos especializados (GestorHorasExtra y ReportBuilderProject)
- Pagos seguros vía Wompi
- Creación automática de tenants con subdominios propios
- Acceso dual: login global desde la landing y acceso directo al tenant
- Sistema de comunicación con clientes (noticias y promociones)

---

## 2. Alcance del Proyecto

### Repositorio Base

- **Landing actual**: https://github.com/jagallob/jegasolutions-landing
- **Dominio objetivo**: `jegasolutions.co` (con wildcard `*.jegasolutions.co`)

### Módulos SaaS a Comercializar

1. **GestorHorasExtra**: Gestión de horas extra (colaboradores, managers, nómina)
2. **ReportBuilderProject**: Consolidación de informes con IA y generación de narrativas ejecutivas

### Arquitectura Técnica

- **Frontend**: React + Vercel (landing y tenants)
- **Backend**: ASP.NET Core + Render (API, webhooks, multi-tenancy)
- **Base de Datos**: PostgreSQL (Render)
- **Pagos**: Wompi (Colombia - tarjetas, PSE, efectivo)
- **DNS**: Wildcard subdominios para multi-tenancy

---

## 3. Fases de Implementación

### 🚀 **FASE 1: Fundación de Pagos (Semana 1-2)**

#### Objetivo

Establecer la capacidad básica de recibir pagos y validarlos correctamente.

#### Entregables

1. **Frontend (Landing)**

   - Sección mejorada de módulos y precios con botones de pago
   - Integración de Wompi Checkout Widget
   - Páginas de confirmación: `/payment-success`, `/payment-failure`

2. **Backend (API)**
   - Endpoint `/api/payments/webhook`
   - Validación de firma `X-Integrity` de Wompi
   - Consulta a API de Wompi para confirmar estados
   - Tabla `payments` en BD para registro de transacciones

#### Criterios de Aceptación

- ✅ Usuario puede pagar un módulo desde la landing
- ✅ Webhook recibe notificaciones de Wompi correctamente
- ✅ Pagos se registran en BD con estados: PENDING, APPROVED, DECLINED
- ✅ Validación de firma funciona en sandbox y producción

#### Código Ejemplo (Frontend)

```jsx
// components/PricingCalculator.jsx
const handlePayWompi = (moduleId, price) => {
  const checkout = new window.WompiCheckoutWidget({
    publicKey: import.meta.env.VITE_WOMPI_PUBLIC_KEY,
    currency: "COP",
    amountInCents: price * 100,
    reference: `MODULE-${moduleId}-${Date.now()}`,
    redirectUrl: `${window.location.origin}/payment-success`,
  });
  checkout.open();
};
```

---

### 🏗️ **FASE 2: Multi-Tenancy Core (Semana 3-4)**

#### Objetivo

Implementar la creación automática de tenants y subdominios tras pagos exitosos.

#### Entregables

1. **Backend**

   - Tabla `tenants`: id, name, subdomain, owner_email, created_at, status
   - Tabla `tenant_modules`: tenant_id, module_name, purchased_at, status
   - Servicio de creación automática de tenants
   - Sistema de envío de correos con credenciales

2. **Frontend**
   - Configuración de wildcard domain en Vercel
   - Detección de tenant por hostname
   - Dashboard básico por tenant

#### Criterios de Aceptación

- ✅ Al confirmar pago, se crea tenant automáticamente
- ✅ Subdominio `clienteX.jegasolutions.co` es accesible
- ✅ Cliente recibe correo con credenciales de acceso
- ✅ Cada tenant tiene su propia BD isolada (schema o filtros por tenant_id)

#### Estructura de BD

```sql
-- Tabla tenants
CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(50) UNIQUE NOT NULL,
    owner_email VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla tenant_modules
CREATE TABLE tenant_modules (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    module_name VARCHAR(100) NOT NULL,
    purchased_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE'
);
```

---

### 🔐 **FASE 3: Sistema de Autenticación Dual (Semana 5-6)**

#### Objetivo

Implementar login global en la landing y autenticación directa en tenants.

#### Entregables

1. **Landing (Login Global)**

   - Página `/login` con formulario de autenticación
   - Se puede acceder al login desde un botón agregado al Header( Similar a como lo tiene la página de Vercel)
   - Lógica para identificar tenant del usuario
   - Redirección automática al tenant correspondiente

2. **Tenant (Login Directo)**

   - Sistema de autenticación por tenant
   - Middleware de autorización basado en JWT
   - Tabla `users` con relación a tenants

3. **Backend**
   - Endpoint `/api/auth/login` (global)
   - Endpoint `/api/auth/tenant-login` (por tenant)
   - Sistema JWT con claims de tenant_id

#### Criterios de Aceptación

- ✅ Login global identifica y redirige al tenant correcto
- ✅ Login directo en tenant funciona independientemente
- ✅ JWT incluye información de tenant y permisos
- ✅ Middleware valida acceso por tenant en todas las rutas

#### Flujo de Login Global

```jsx
// pages/Login.jsx
const handleGlobalLogin = async (email, password) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const { token, tenant } = await response.json();

  // Redirigir al tenant
  window.location.href = `https://${tenant.subdomain}.jegasolutions.co/dashboard`;
};
```

---

### 📦 **FASE 4: Integración de Módulos SaaS (Semana 7-9)**

#### Objetivo

Montar y configurar los módulos GestorHorasExtra y ReportBuilderProject dentro de cada tenant.

#### Entregables

1. **Dashboard de Tenant**

   - Página inicial que lista módulos adquiridos
   - Cards con acceso a cada módulo
   - Navegación interna entre módulos

2. **Integración de Módulos**

   - GestorHorasExtra en ruta `/gestor-horas-extra`
   - ReportBuilderProject en ruta `/report-builder`
   - Cada módulo respeta el tenant_id del usuario

3. **Middleware de Módulos**
   - Verificación de que el tenant tiene acceso al módulo
   - Filtrado de datos por tenant_id en cada módulo

#### Criterios de Aceptación

- ✅ Dashboard muestra solo módulos comprados por el tenant
- ✅ Cada módulo funciona correctamente dentro del tenant
- ✅ Datos están completamente aislados entre tenants
- ✅ Navegación entre módulos es fluida

#### Dashboard Structure

```jsx
// components/TenantDashboard.jsx
const TenantDashboard = ({ userModules }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {userModules.includes("GestorHorasExtra") && (
        <ModuleCard
          title="Gestor Horas Extra"
          description="Gestión completa de horas extra y nómina"
          href="/gestor-horas-extra"
          icon="⏰"
        />
      )}
      {userModules.includes("ReportBuilderProject") && (
        <ModuleCard
          title="Report Builder Project"
          description="Consolidación de informes con IA"
          href="/report-builder"
          icon="📊"
        />
      )}
    </div>
  );
};
```

---

### 📢 **FASE 5: Hub de Comunicación (Semana 10-11)**

#### Objetivo

Convertir la landing en un centro de comunicación con noticias, promociones y actualizaciones.

#### Entregables

1. **Sistema de Noticias**

   - CMS básico para publicar noticias
   - Sección de noticias en la landing
   - Banner de promociones

2. **Mejoras UX**
   - Notificaciones de nuevos módulos disponibles
   - Sistema de feedback de usuarios
   - Analytics de uso de módulos

#### Criterios de Aceptación

- ✅ Usuarios ven noticias al usar login global
- ✅ Sistema de promociones funcional
- ✅ Métricas básicas de engagement

---

## 4. Arquitectura de Seguridad

### Variables de Entorno

```bash
# Frontend (Vercel)
VITE_WOMPI_PUBLIC_KEY=pub_test_xxxxx
VITE_API_BASE_URL=https://api.jegasolutions.co

# Backend (Render)
WOMPI_PRIVATE_KEY=prv_test_xxxxx
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your_super_secret_key
SMTP_CONFIG=smtp_settings_for_emails
```

### Consideraciones PCI Compliance

- ❌ **NO almacenar** datos de tarjetas
- ✅ **SÍ validar** todas las firmas de webhooks
- ✅ **SÍ usar** HTTPS en todas las comunicaciones
- ✅ **SÍ implementar** rate limiting en endpoints críticos

---

## 5. Plan de Testing

### Testing por Fase

1. **Fase 1**: Test de pagos en sandbox de Wompi
2. **Fase 2**: Test de creación de tenants y correos
3. **Fase 3**: Test de login dual y JWT
4. **Fase 4**: Test de aislamiento de datos entre tenants
5. **Fase 5**: Test de carga y performance

### Métricas de Éxito

- **Conversión de pagos**: >95% de webhooks procesados correctamente
- **Tiempo de creación de tenant**: <30 segundos
- **Disponibilidad**: >99% uptime
- **Performance**: <2s tiempo de carga de dashboard

---

## 6. Roadmap Futuro (Post-Lanzamiento)

### Corto Plazo (3-6 meses)

- Integración con PayU como segunda pasarela
- Facturación electrónica (Colombia)
- Panel de administración de tenants

### Mediano Plazo (6-12 meses)

- Nuevos módulos SaaS especializados
- Stripe para mercado internacional
- Personalización de branding por tenant

### Largo Plazo (1+ años)

- Marketplace de módulos de terceros
- API pública para integraciones
- Mobile apps para módulos principales

---

## 7. Consideraciones de Migración

### Dominio

- **Desarrollo**: `*.jegasolutions-landing.vercel.app`
- **Producción**: `*.jegasolutions.co`
- **Migración**: Configurar DNS y certificados SSL

### Base de Datos

- Backup automático diario
- Estrategia de rollback por fase
- Migración gradual de datos existentes

---

## 8. Recursos y Documentación

- [Wompi API Documentation](https://docs.wompi.co/)
- [Vercel Wildcard Domains](https://vercel.com/docs/projects/domains/wildcard-domains)
- [PostgreSQL Multi-Tenancy Patterns](https://www.postgresql.org/docs/current/ddl-schemas.html)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)

---

## 9. Contacto del Proyecto

- **PM**: Jaime Gallo
- **Repositorio**: https://github.com/jagallob/jegasolutions-landing
- **Dominio objetivo**: jegasolutions.co
