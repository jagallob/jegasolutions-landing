import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Clock,
  FileText,
  BarChart3,
  Plus,
} from "lucide-react";
import TenantLogin from "./TenantLogin";
import { useAuth } from "../../hooks/useAuth";
import ModuleDashboard from "../../components/modules/ModuleDashboard";

const TenantDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tenantInfo, setTenantInfo] = useState(null);
  const [userModules, setUserModules] = useState([]);
  const [currentView, setCurrentView] = useState("dashboard"); // 'dashboard' o 'modules'
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  useEffect(() => {
    if (user) {
      // Cargar datos del tenant desde el usuario autenticado
      setTenantInfo({
        name: user.tenantName || "Mi Empresa",
        subdomain: user.tenantSubdomain || "mi-empresa-1234",
        ownerEmail: user.email,
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      });

      // Simular módulos - en producción esto vendría de la API
      setUserModules([
        {
          id: 1,
          name: "GestorHorasExtra",
          displayName: "Gestión de Horas Extra",
          description: "Gestión completa de horas extra y nómina",
          icon: Clock,
          status: "ACTIVE",
          purchasedAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: "ReportBuilderProject",
          displayName: "Reportes con IA",
          description:
            "Consolidación de informes con IA y generación de narrativas",
          icon: FileText,
          status: "ACTIVE",
          purchasedAt: new Date().toISOString(),
        },
      ]);
    }
  }, [user]);

  const sidebarItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "#",
      active: currentView === "dashboard",
      onClick: () => setCurrentView("dashboard"),
    },
    {
      name: "Módulos",
      icon: FileText,
      href: "#",
      active: currentView === "modules",
      onClick: () => setCurrentView("modules"),
    },
    { name: "Usuarios", icon: Users, href: "#" },
    { name: "Configuración", icon: Settings, href: "#" },
  ];

  const handleLogout = async () => {
    await logout();
  };

  // Mostrar loading mientras se verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jega-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Mostrar login si no está autenticado
  if (!isAuthenticated) {
    return <TenantLogin />;
  }

  if (!tenantInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jega-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-jega-blue-600">
              JEGASolutions
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.name}
                onClick={item.onClick || (() => {})}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                  item.active
                    ? "bg-jega-blue-100 text-jega-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-xl font-bold text-jega-blue-600">
              JEGASolutions
            </h1>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.name}
                onClick={item.onClick || (() => {})}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                  item.active
                    ? "bg-jega-blue-100 text-jega-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
              >
                <Bell className="h-6 w-6" />
              </button>
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
              <div className="flex items-center gap-x-2">
                <div className="h-8 w-8 rounded-full bg-jega-blue-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {tenantInfo.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-900">
                    {tenantInfo.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {tenantInfo.ownerEmail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          {currentView === "modules" ? (
            <ModuleDashboard />
          ) : (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">
                  Bienvenido a tu plataforma JEGASolutions
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Users className="h-6 w-6 text-jega-blue-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Usuarios Activos
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            12
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Módulos Activos
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {userModules.length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <BarChart3 className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Reportes Generados
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            47
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Horas Registradas
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            1,234
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modules */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      Módulos Disponibles
                    </h2>
                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-jega-blue-700 bg-jega-blue-100 hover:bg-jega-blue-200 transition-colors">
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar Módulo
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {userModules.map((module) => (
                      <motion.div
                        key={module.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <module.icon className="h-8 w-8 text-jega-blue-600" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-lg font-medium text-gray-900">
                                {module.displayName}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {module.name}
                              </p>
                            </div>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {module.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          {module.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Adquirido:{" "}
                            {new Date(module.purchasedAt).toLocaleDateString()}
                          </span>
                          <button className="text-jega-blue-600 hover:text-jega-blue-700 text-sm font-medium">
                            Acceder →
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TenantDashboard;
