import React from "react";
import { ThemeProvider } from "../../styles/themeProvider";
import { useAuth } from "../../hooks/useAuth";

const ModuleContainer = ({ moduleName, children, moduleProps = {} }) => {
  const { user } = useAuth();

  // Configuración específica del módulo
  const moduleConfig = {
    theme: user?.tenantConfig?.theme || "default",
    primaryColor: user?.tenantConfig?.primaryColor || "#1890ff",
    secondaryColor: user?.tenantConfig?.secondaryColor || "#52c41a",
    accentColor: user?.tenantConfig?.accentColor || "#faad14",
    logoUrl: user?.tenantConfig?.logoUrl,
    moduleConfigs: user?.tenantConfig?.moduleConfigs || {},
    customizations: user?.tenantConfig?.customizations || {},
  };

  // Determinar el tipo de estilos del módulo
  const getModuleStyleType = (moduleName) => {
    const styleMap = {
      GestorHorasExtra: "antd",
      ReportBuilderProject: "tailwind",
    };
    return styleMap[moduleName] || "tailwind";
  };

  const styleType = getModuleStyleType(moduleName);

  return (
    <div
      className={`module-container module-${moduleName.toLowerCase()} module-${styleType}`}
    >
      <ThemeProvider tenantConfig={moduleConfig}>
        <div className={`module-content ${styleType}-module`}>{children}</div>
      </ThemeProvider>
    </div>
  );
};

export default ModuleContainer;


