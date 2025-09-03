// Exportaciones centralizadas de módulos
export { default as GestorHorasExtra } from "./GestorHorasExtra";
export { default as ReportBuilderProject } from "./ReportBuilderProject";
// Aliases to support existing references in the app
export { default as AIReportsModule } from "./ReportBuilderProject";
export { default as ExtraHoursModule } from "./GestorHorasExtra";

// Configuración de módulos disponibles
export const MODULE_CONFIG = {
  GestorHorasExtra: {
    name: "Gestor de Horas Extra",
    description: "Sistema para gestionar horas extra de empleados",
    icon: "⏰",
    styleType: "antd",
    version: "1.0.0",
    dependencies: ["antd"],
    features: [
      "Registro de horas extra",
      "Aprobación de solicitudes",
      "Reportes de horas",
      "Integración con nómina",
    ],
  },
  ReportBuilderProject: {
    name: "Constructor de Reportes",
    description: "Herramienta para crear reportes personalizados",
    icon: "📊",
    styleType: "tailwind",
    version: "1.0.0",
    dependencies: ["tailwindcss"],
    features: [
      "Constructor visual de reportes",
      "Múltiples formatos de exportación",
      "Plantillas personalizables",
      "Integración con datos",
    ],
  },
};

// Función para obtener configuración de módulo
export const getModuleConfig = (moduleName) => {
  return MODULE_CONFIG[moduleName] || null;
};

// Función para listar módulos disponibles
export const getAvailableModules = () => {
  return Object.keys(MODULE_CONFIG);
};
