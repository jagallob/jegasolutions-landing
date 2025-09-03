// Sistema de temas unificado para Antd + Tailwind
import { ConfigProvider } from "antd";
import { createContext, useContext } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children, tenantConfig }) => {
  // Configuración de Antd basada en el tenant
  const antdTheme = {
    token: {
      colorPrimary: tenantConfig.primaryColor || "#1890ff",
      colorSuccess: tenantConfig.secondaryColor || "#52c41a",
      colorWarning: tenantConfig.accentColor || "#faad14",
      borderRadius: 6,
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    components: {
      Layout: {
        headerBg: tenantConfig.primaryColor || "#1890ff",
        siderBg: "#f0f2f5",
      },
      Menu: {
        itemBg: "transparent",
        itemSelectedBg: tenantConfig.primaryColor || "#1890ff",
      },
    },
  };

  // Variables CSS para Tailwind
  const tailwindVars = {
    "--primary-color": tenantConfig.primaryColor || "#1890ff",
    "--secondary-color": tenantConfig.secondaryColor || "#52c41a",
    "--accent-color": tenantConfig.accentColor || "#faad14",
    "--logo-url": tenantConfig.logoUrl
      ? `url(${tenantConfig.logoUrl})`
      : "none",
  };

  // Aplicar variables CSS al documento
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    Object.entries(tailwindVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }

  const themeValue = {
    tenantConfig,
    antdTheme,
    tailwindVars,
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
};
