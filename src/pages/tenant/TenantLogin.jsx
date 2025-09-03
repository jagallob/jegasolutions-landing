import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { useTenantDetection } from "../../hooks/tenant/useTenantDetection";
import { useAuth } from "../../hooks/useAuth";

const TenantLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { tenant } = useTenantDetection();
  const { tenantLogin, isLoading } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (!tenant?.subdomain) {
      setError("No se pudo detectar el tenant");
      return;
    }

    const result = await tenantLogin(
      formData.email,
      formData.password,
      tenant.subdomain
    );

    if (result.success) {
      onLogin?.();
    } else {
      setError(result.error || "Error de autenticación");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-jega-blue-50 to-jega-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-jega-blue-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">J</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h1>
          {tenant && (
            <p className="text-sm text-gray-600 mt-2">
              {tenant.subdomain}.jegasolutions.co
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center"
          >
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-sm text-red-700">{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jega-blue-500 focus:border-jega-blue-500 transition-colors"
              placeholder="tu@empresa.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jega-blue-500 focus:border-jega-blue-500 transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-jega-blue-600 to-jega-indigo-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Iniciando sesión...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5 mr-2" />
                Iniciar Sesión
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            ¿Problemas para acceder?{" "}
            <a
              href="mailto:soporte@jegasolutions.co"
              className="text-jega-blue-600 hover:text-jega-blue-700 font-medium"
            >
              Contactar soporte
            </a>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2 font-medium">
            Credenciales de demo:
          </p>
          <p className="text-xs text-gray-500">Email: admin@miempresa.com</p>
          <p className="text-xs text-gray-500">
            Contraseña: cualquier contraseña
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TenantLogin;
