import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import moduleLoader from "../../services/moduleLoader";
import { useAuth } from "../../hooks/useAuth";

const ModuleWrapper = ({ moduleName, moduleProps = {} }) => {
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    loadModule();
  }, [moduleName]);

  const loadModule = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar configuración del tenant
      const tenantConfig = await moduleLoader.loadTenantConfig(user.tenantId);

      // Cargar el módulo
      const loadedModule = await moduleLoader.loadModule(
        moduleName,
        tenantConfig
      );

      setModule(loadedModule);
    } catch (err) {
      console.error(`Error loading module ${moduleName}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-jega-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando {moduleName}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 rounded-lg p-6"
      >
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Error al cargar {moduleName}
            </h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={loadModule}
          className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Reintentar
        </button>
      </motion.div>
    );
  }

  if (!module) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Módulo no disponible</p>
      </div>
    );
  }

  // Renderizar el módulo con sus props
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      {module.Component && (
        <module.Component
          {...moduleProps}
          tenantConfig={module.config}
          theme={module.theme}
          customizations={module.customizations}
        />
      )}
    </motion.div>
  );
};

export default ModuleWrapper;


