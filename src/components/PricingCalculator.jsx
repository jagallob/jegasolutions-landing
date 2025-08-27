import React, { useState, useEffect } from "react";
import {
  Calculator,
  Users,
  Building2,
  Clock,
  FileText,
  Check,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

const getCompanySizeForEmployees = (count) => {
  if (count <= 10) return "micro";
  if (count <= 50) return "small";
  if (count <= 200) return "medium";
  return "large";
};

const PricingCalculator = () => {
  const [deploymentType, setDeploymentType] = useState("saas");
  const [companySize, setCompanySize] = useState("small");
  const [selectedModules, setSelectedModules] = useState({
    extraHours: false,
    reports: false,
  });
  const [employeeCount, setEmployeeCount] = useState(50);
  const [customEmployeeCount, setCustomEmployeeCount] = useState("");

  useEffect(() => {
    const actualEmployeeCount = customEmployeeCount
      ? parseInt(customEmployeeCount)
      : employeeCount;

    if (actualEmployeeCount > 0 && !isNaN(actualEmployeeCount)) {
      const newSize = getCompanySizeForEmployees(actualEmployeeCount);
      if (newSize !== companySize) {
        setCompanySize(newSize);
      }
    }
  }, [employeeCount, customEmployeeCount, companySize]);

  // Costos de infraestructura mensual (basado en cotización real Render + Vercel)
  const infraCosts = {
    saas: {
      // Costo por empresa: Render Web Service ($25) + PostgreSQL ($7 + $1.50 storage) + Vercel prorrateado ($4)
      micro: 37.5, // Mismo costo base de infraestructura que PYME
      small: 37.5, // $37.50/mes por empresa
      medium: 45.0, // Más recursos para empresas medianas
      large: 65.0, // Recursos premium para grandes empresas
    },
  };

  // Precios base transparentes (ahora incluyen margen sobre infraestructura)
  const basePricing = {
    saas: {
      micro: {
        base: 39,
        perEmployee: 2.0,
        max: 59,
        infraCost: infraCosts.saas.micro,
      },
      small: {
        base: 79,
        perEmployee: 1.5,
        max: 149,
        infraCost: infraCosts.saas.small,
      },
      medium: {
        base: 199,
        perEmployee: 1.0,
        max: 349,
        infraCost: infraCosts.saas.medium,
      },
      large: {
        base: 499,
        perEmployee: 0.8,
        max: 1999,
        infraCost: infraCosts.saas.large,
      },
    },
    onpremise: {
      micro: { license: 5000, maintenance: 0.2, implementation: 2000 },
      small: { license: 8000, maintenance: 0.22, implementation: 3000 },
      medium: { license: 15000, maintenance: 0.23, implementation: 5000 },
      large: { license: 25000, maintenance: 0.25, implementation: 8000 },
    },
  };

  const moduleMultipliers = {
    extraHours: { saas: 1.0, onpremise: 1.0 },
    reports: { saas: 1.3, onpremise: 1.4 }, // Mayor valor por IA
  };

  const companySizes = {
    micro: { label: "Micro (hasta 10 empleados)", range: [1, 10] },
    small: { label: "Pequeña (11-50 empleados)", range: [11, 50] },
    medium: { label: "Mediana (51-200 empleados)", range: [51, 200] },
    large: { label: "Grande (201+ empleados)", range: [201, 5000] },
  };

  // Calcular precio automáticamente
  const calculatePrice = () => {
    const selectedModulesCount =
      Object.values(selectedModules).filter(Boolean).length;
    if (selectedModulesCount === 0) {
      return { monthly: 0, annual: 0, setup: 0, total3Years: 0 };
    }

    const actualEmployeeCount = customEmployeeCount
      ? parseInt(customEmployeeCount) || 0
      : employeeCount;

    if (actualEmployeeCount <= 0) {
      return { monthly: 0, annual: 0, setup: 0, total3Years: 0 };
    }

    const sizeForPricing = getCompanySizeForEmployees(actualEmployeeCount);
    const pricing = basePricing[deploymentType][sizeForPricing];

    // Calcular multiplicador por módulos seleccionados
    let moduleMultiplier = 0;
    if (selectedModules.extraHours)
      moduleMultiplier += moduleMultipliers.extraHours[deploymentType];
    if (selectedModules.reports)
      moduleMultiplier += moduleMultipliers.reports[deploymentType];

    if (deploymentType === "saas") {
      const basePrice = pricing.base * moduleMultiplier;
      const employeePrice =
        actualEmployeeCount * pricing.perEmployee * moduleMultiplier;
      const monthlyPrice = Math.min(
        basePrice + employeePrice,
        pricing.max * moduleMultiplier
      );
      const annualPrice = monthlyPrice * 12 * 0.85; // 15% descuento anual

      return {
        monthly: Math.round(monthlyPrice),
        annual: Math.round(annualPrice),
        setup: 500,
        total3Years: Math.round(annualPrice * 3 + 500),
        infraCost: pricing.infraCost,
        grossMargin:
          monthlyPrice > 0
            ? Math.round(
                ((monthlyPrice - pricing.infraCost) / monthlyPrice) * 100
              )
            : 0,
      };
    } else {
      const licensePrice = pricing.license * moduleMultiplier;
      const maintenanceAnnual = licensePrice * pricing.maintenance;
      const implementation = pricing.implementation;

      return {
        license: Math.round(licensePrice),
        maintenance: Math.round(maintenanceAnnual),
        implementation: Math.round(implementation),
        total3Years: Math.round(
          licensePrice + maintenanceAnnual * 3 + implementation
        ),
      };
    }
  };

  const price = calculatePrice();

  const handleModuleChange = (module) => {
    setSelectedModules((prev) => ({
      ...prev,
      [module]: !prev[module],
    }));
  };

  const handleCompanySizeChange = (size) => {
    const representativeCounts = {
      micro: 10,
      small: 30,
      medium: 100,
      large: 250,
    };
    setEmployeeCount(representativeCounts[size]);
    setCustomEmployeeCount("");
  };

  const handleEmployeeCountChange = (value) => {
    setEmployeeCount(value);
    setCustomEmployeeCount("");
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-12 bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Calcula tu <span className="gradient-text">Inversión</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Obtén una cotización personalizada en tiempo real. Elige entre
          nuestros modelos SaaS o On-Premise según las necesidades de tu
          empresa.
        </p>
      </motion.div>
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-6xl border border-gray-100">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuración */}
          <div className="lg:col-span-2 space-y-8">
            {/* Fila 1: Tipo de Despliegue y Tamaño de Empresa */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-jega-blue-600" />
                  Tipo de Despliegue
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDeploymentType("saas")}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                      deploymentType === "saas"
                        ? "border-jega-blue-600 bg-jega-blue-50 text-jega-blue-700 shadow-lg"
                        : "border-gray-200 hover:border-jega-blue-300 hover:bg-jega-blue-50/50"
                    }`}
                  >
                    <h4 className="font-semibold">SaaS (Nube)</h4>
                    <p className="text-xs text-gray-500 mt-1">Pago mensual</p>
                  </button>
                  <button
                    onClick={() => setDeploymentType("onpremise")}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                      deploymentType === "onpremise"
                        ? "border-jega-blue-600 bg-jega-blue-50 text-jega-blue-700 shadow-lg"
                        : "border-gray-200 hover:border-jega-blue-300 hover:bg-jega-blue-50/50"
                    }`}
                  >
                    <h4 className="font-semibold">On-Premise</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Licencia perpetua
                    </p>
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-jega-blue-600" />
                  Tamaño de Empresa
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(companySizes).map(([size, info]) => (
                    <button
                      key={size}
                      onClick={() => handleCompanySizeChange(size)}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        companySize === size
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-semibold text-sm">
                        {info.label.split(" ")[0]}
                      </div>
                      <div className="text-xs text-gray-500">
                        {info.label.split(" ").slice(1).join(" ")}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Fila 2: Módulos y Número de Empleados */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Módulos Disponibles
                </h3>
                <div className="space-y-3">
                  <div
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedModules.extraHours
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleModuleChange("extraHours")}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedModules.extraHours
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedModules.extraHours && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">
                          Gestión de Horas Extra
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedModules.reports
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleModuleChange("reports")}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedModules.reports
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedModules.reports && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">
                          Reportes con IA
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Número de Empleados
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2">
                    {[50, 100, 200, 500].map((count) => (
                      <button
                        key={count}
                        onClick={() => handleEmployeeCountChange(count)}
                        className={`p-2 rounded-lg border transition-all text-sm ${
                          employeeCount === count && !customEmployeeCount
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="O cantidad personalizada"
                      value={customEmployeeCount}
                      onChange={(e) => setCustomEmployeeCount(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="space-y-6">
            {/* Cotización */}
            <div className="bg-gradient-to-br from-jega-blue-50 via-jega-indigo-50 to-jega-blue-100 p-8 rounded-2xl border border-jega-blue-200">
              <h3 className="text-2xl font-bold mb-4 text-jega-blue-900">
                📋 Cotización Estimada
              </h3>

              {Object.values(selectedModules).some(Boolean) ? (
                <div className="space-y-4">
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-4">
                      {companySizes[companySize].label} (
                      {customEmployeeCount
                        ? parseInt(customEmployeeCount)
                        : employeeCount}
                      )
                    </div>

                    {deploymentType === "saas" ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                          <span className="text-gray-700">Mensual:</span>
                          <span className="font-bold text-3xl text-jega-blue-800">
                            ${price.monthly}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline text-green-700">
                          <span>Anual (15% desc.):</span>
                          <span className="font-semibold text-lg">
                            ${price.annual}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline text-sm text-gray-600">
                          <span>Setup único:</span>
                          <span>${price.setup}</span>
                        </div>
                        <hr className="my-2 border-blue-200" />
                        <div className="flex justify-between items-center font-bold text-lg">
                          <span>Total 3 años:</span>
                          <span className="text-green-800">
                            ${price.total3Years}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                          <span>Licencia:</span>
                          <span className="font-bold text-3xl text-jega-blue-800">
                            ${price.license}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span>Implementación:</span>
                          <span className="font-semibold text-lg">
                            ${price.implementation}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline text-sm text-gray-600">
                          <span>Mantenimiento/año:</span>
                          <span>${price.maintenance}</span>
                        </div>
                        <hr className="my-2 border-blue-200" />
                        <div className="flex justify-between items-center font-bold text-lg">
                          <span>Total 3 años:</span>
                          <span className="text-green-800">
                            ${price.total3Years}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Incluye */}
                  <div className="bg-blue-100/50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      ✅ Incluye
                    </h4>
                    <div className="text-xs text-blue-700 grid grid-cols-2 gap-1">
                      {deploymentType === "saas" ? (
                        <>
                          <span>• Hosting y mantenimiento</span>
                          <span>• Actualizaciones</span>
                          <span>• Soporte técnico</span>
                          <span>• Backups automáticos</span>
                          <span>• SSL y seguridad</span>
                        </>
                      ) : (
                        <>
                          <span>• Licencia perpetua</span>
                          <span>• Instalación Docker</span>
                          <span>• Capacitación inicial</span>
                          <span>• Soporte implementación</span>
                          <span>• Documentación</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-gray-600">
                    Selecciona al menos un módulo para ver la cotización
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;
