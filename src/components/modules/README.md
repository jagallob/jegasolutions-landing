# 🧩 Módulos de JEGASolutions

Esta carpeta contiene todos los componentes relacionados con los módulos de la suite JEGASolutions, organizados de manera modular y reutilizable.

## 📁 Estructura de Archivos

```
modules/
├── index.js                 # Exportaciones centralizadas
├── ModuleCard.jsx          # Componente genérico para tarjetas de módulos
├── ExtraHoursModule.jsx    # Módulo de Gestión de Horas Extra
├── AIReportsModule.jsx     # Módulo de Reportes con IA
├── UpcomingModules.jsx     # Componente para módulos futuros
├── ModulesSection.jsx      # Sección principal que integra todos los módulos
└── README.md               # Esta documentación
```

## 🚀 Componentes Disponibles

### ModuleCard.jsx

Componente genérico y reutilizable para mostrar información de módulos. Soporta tanto módulos activos como futuros.

**Props:**

- `module`: Objeto con información del módulo
- `index`: Índice para animaciones
- `isUpcoming`: Boolean para módulos futuros

### ExtraHoursModule.jsx

Módulo especializado para la gestión de horas extra, con características específicas y beneficios detallados.

**Características:**

- Gestión automática de horas extra
- Cálculo por categorías (diurna/nocturna/festiva)
- Sistema de aprobación
- Cumplimiento normativo

### AIReportsModule.jsx

Módulo de reportes inteligentes usando Claude AI para análisis automático y generación de narrativas.

**Características:**

- Generación automática con IA
- Análisis semántico
- Exportación múltiple
- Insights inteligentes

### UpcomingModules.jsx

Componente que muestra los módulos en desarrollo con fechas estimadas y prioridades.

**Características:**

- Roadmap visual
- Indicadores de prioridad
- Fechas estimadas
- CTA para desarrollo personalizado

### ModulesSection.jsx

Componente principal que integra todos los módulos en una sección completa.

## 🎯 Uso

### Importación Individual

```jsx
import { ExtraHoursModule, AIReportsModule } from "./modules";
```

### Importación de la Sección Completa

```jsx
import { ModulesSection } from "./modules";
```

### Uso en Componentes

```jsx
// Módulo individual
<ExtraHoursModule />

// Sección completa
<ModulesSection />
```

## 🔧 Personalización

### Agregar Nuevos Módulos

1. Crear nuevo componente en la carpeta `modules/`
2. Exportar en `index.js`
3. Integrar en `ModulesSection.jsx`

### Modificar Módulos Existentes

Cada módulo es independiente y puede ser modificado sin afectar a los demás.

### Estilos y Temas

Los módulos usan las clases de Tailwind CSS definidas en el sistema de diseño de JEGASolutions.

## 📱 Responsive Design

Todos los módulos están optimizados para:

- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

## 🎨 Animaciones

Los módulos incluyen animaciones con Framer Motion:

- Fade-in al hacer scroll
- Hover effects
- Transiciones suaves
- Delays escalonados

## 🔄 Mantenimiento

### Agregar Características

1. Modificar el componente específico
2. Actualizar la documentación
3. Probar en diferentes dispositivos

### Debugging

- Cada módulo puede ser probado independientemente
- Usar React DevTools para inspeccionar props
- Verificar animaciones en diferentes velocidades

---

**Nota**: Esta estructura modular facilita el mantenimiento y la escalabilidad del proyecto, permitiendo agregar nuevos módulos sin afectar la funcionalidad existente.

