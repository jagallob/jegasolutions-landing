import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getModuleConfig, getAvailableModules } from "./index";
import ModuleContainer from "./ModuleContainer";
import GestorHorasExtra from "./GestorHorasExtra";
import ReportBuilderProject from "./ReportBuilderProject";
import { Clock, BarChart3, Settings, User } from "lucide-react";

const ModuleDashboard = () => {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState(null);
  const [availableModules, setAvailableModules] = useState([]);

  useEffect(() => {
    // Obtener módulos disponibles para el tenant
    const modules = getAvailableModules();
    setAvailableModules(modules);

    // Si solo hay un módulo, activarlo automáticamente
    if (modules.length === 1) {
      setActiveModule(modules[0]);
    }
  }, [user]);

  const handleModuleSelect = (moduleName) => {
    setActiveModule(moduleName);
  };

  const getModuleIcon = (moduleName) => {
    const config = getModuleConfig(moduleName);
    switch (moduleName) {
      case "GestorHorasExtra":
        return <Clock className="w-6 h-6" />;
      case "ReportBuilderProject":
        return <BarChart3 className="w-6 h-6" />;
      default:
        return <Settings className="w-6 h-6" />;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">
            Inicia sesión para acceder a los módulos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar de Módulos */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Módulos SaaS</h2>
          <p className="text-sm text-gray-600 mt-1">
            Bienvenido, {user.fullName}
          </p>
        </div>

        <nav className="mt-6">
          {availableModules.map((moduleName) => {
            const config = getModuleConfig(moduleName);
            const isActive = activeModule === moduleName;

            return (
              <button
                key={moduleName}
                onClick={() => handleModuleSelect(moduleName)}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {getModuleIcon(moduleName)}
                <div className="ml-3">
                  <div className="font-medium">{config.name}</div>
                  <div className="text-xs text-gray-500">
                    {config.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col">
        {activeModule ? (
          <ModuleContainer moduleName={activeModule}>
            {/* Cargar el módulo específico */}
            {activeModule === "GestorHorasExtra" && <GestorHorasExtra />}
            {activeModule === "ReportBuilderProject" && (
              <ReportBuilderProject />
            )}
          </ModuleContainer>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Settings className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Selecciona un Módulo
              </h3>
              <p className="text-gray-600">
                Elige un módulo del menú lateral para comenzar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleDashboard;
