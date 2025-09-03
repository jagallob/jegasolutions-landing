// Sistema de carga dinámica de módulos SaaS
class ModuleLoader {
  constructor() {
    this.loadedModules = new Map();
    this.moduleConfigs = new Map();
  }

  // Cargar módulo dinámicamente
  async loadModule(moduleName, tenantConfig) {
    try {
      // Verificar si ya está cargado
      if (this.loadedModules.has(moduleName)) {
        return this.loadedModules.get(moduleName);
      }

      // Determinar la URL del módulo basada en el tenant
      const moduleUrl = this.getModuleUrl(moduleName, tenantConfig);

      // Cargar el módulo dinámicamente
      const module = await this.loadDynamicModule(moduleUrl, tenantConfig);

      // Aplicar configuración del tenant
      const configuredModule = this.applyTenantConfig(module, tenantConfig);

      // Cachear el módulo
      this.loadedModules.set(moduleName, configuredModule);

      return configuredModule;
    } catch (error) {
      console.error(`Error loading module ${moduleName}:`, error);
      throw error;
    }
  }

  // Obtener URL del módulo basada en configuración del tenant
  getModuleUrl(moduleName, tenantConfig) {
    const baseUrl =
      import.meta.env.VITE_MODULES_BASE_URL || "http://localhost:3000";

    // Si el tenant tiene un módulo personalizado, usar esa URL
    if (tenantConfig.customModules && tenantConfig.customModules[moduleName]) {
      return tenantConfig.customModules[moduleName];
    }

    // URL estándar del módulo
    return `${baseUrl}/${moduleName}/index.js`;
  }

  // Cargar módulo dinámicamente
  async loadDynamicModule(moduleUrl, tenantConfig) {
    // Crear script tag dinámicamente
    const script = document.createElement("script");
    script.type = "module";
    script.src = moduleUrl;

    return new Promise((resolve, reject) => {
      script.onload = () => {
        // El módulo se carga y expone su API globalmente
        const moduleName = moduleUrl.split("/").slice(-2, -1)[0];
        const moduleAPI = window[`${moduleName}Module`];

        if (moduleAPI) {
          resolve(moduleAPI);
        } else {
          reject(new Error(`Module ${moduleName} not found`));
        }
      };

      script.onerror = () => {
        reject(new Error(`Failed to load module from ${moduleUrl}`));
      };

      document.head.appendChild(script);
    });
  }

  // Aplicar configuración del tenant al módulo
  applyTenantConfig(module, tenantConfig) {
    return {
      ...module,
      // Aplicar tema del tenant
      theme: tenantConfig.theme || "default",
      // Aplicar configuración específica
      config: {
        ...module.defaultConfig,
        ...tenantConfig.moduleConfigs,
      },
      // Aplicar personalizaciones
      customizations: tenantConfig.customizations || {},
    };
  }

  // Cargar configuración del tenant
  async loadTenantConfig(tenantId) {
    try {
      const response = await fetch(`/api/tenants/${tenantId}/config`);
      const config = await response.json();

      this.moduleConfigs.set(tenantId, config);
      return config;
    } catch (error) {
      console.error("Error loading tenant config:", error);
      return this.getDefaultTenantConfig();
    }
  }

  // Configuración por defecto
  getDefaultTenantConfig() {
    return {
      theme: "default",
      customizations: {},
      moduleConfigs: {},
      customModules: {},
    };
  }

  // Limpiar módulos cargados
  clearLoadedModules() {
    this.loadedModules.clear();
  }
}

// Instancia singleton
const moduleLoader = new ModuleLoader();

export default moduleLoader;


