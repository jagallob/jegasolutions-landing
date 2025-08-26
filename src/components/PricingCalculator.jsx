import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Zap, Database, CircleCheckBig } from "lucide-react";

const PricingCalculator = () => {
  const [deployment, setDeployment] = useState("saas");
  const [companySize, setCompanySize] = useState("pyme");
  const [modules, setModules] = useState({
    extraHours: true,
    reports: false,
    payroll: false,
    attendance: false,
  });

  const calculatePrice = () => {
    const basePrices = {
      saas: { pyme: 89, mediana: 299, grande: 799 },
      onpremise: { pyme: 8000, mediana: 15000, grande: 25000 },
    };
    let price = basePrices[deployment][companySize];

    if (modules.reports) price *= 1.4;
    if (modules.payroll) price *= 1.3;
    if (modules.attendance) price *= 1.2;

    return deployment === "saas"
      ? `$${Math.round(price)}/mes`
      : `$${Math.round(price).toLocaleString("es-CO")}`;
  };

  const handleModuleChange = (e) => {
    const { name, checked } = e.target;
    setModules((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Calcula tu <span className="gradient-text">Inversión</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Obtén una cotización personalizada en tiempo real.
          </p>
        </motion.div>
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-6xl mx-auto border border-gray-100">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Deployment Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Tipo de Despliegue
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDeployment("saas")}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      deployment === "saas"
                        ? "border-jega-blue-600 bg-jega-blue-50"
                        : "border-gray-200 hover:border-jega-blue-300"
                    }`}
                  >
                    <div className="text-center">
                      <Zap className="w-6 h-6 mx-auto mb-2 text-jega-blue-600" />
                      <div className="font-semibold">SaaS (Nube)</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setDeployment("onpremise")}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      deployment === "onpremise"
                        ? "border-jega-blue-600 bg-jega-blue-50"
                        : "border-gray-200 hover:border-jega-blue-300"
                    }`}
                  >
                    <div className="text-center">
                      <Database className="w-6 h-6 mx-auto mb-2 text-jega-blue-600" />
                      <div className="font-semibold">On-Premise</div>
                    </div>
                  </button>
                </div>
              </div>
              {/* Company Size */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Tamaño de Empresa
                </label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-jega-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                >
                  <option value="pyme">PYME (1-200 empleados)</option>
                  <option value="mediana">Mediana (201-1000 empleados)</option>
                  <option value="grande">Grande (1000+ empleados)</option>
                </select>
              </div>
              {/* Modules */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Módulos Adicionales
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={modules.extraHours}
                      disabled
                      className="rounded border-gray-300 text-jega-blue-600 focus:ring-jega-blue-500"
                    />
                    <span className="ml-3 text-sm font-medium">
                      Gestión de Horas Extra (Incluido)
                    </span>
                  </label>
                  <label className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="reports"
                      checked={modules.reports}
                      onChange={handleModuleChange}
                      className="rounded border-gray-300 text-jega-blue-600 focus:ring-jega-blue-500"
                    />
                    <span className="ml-3 text-sm font-medium">
                      Reportes con IA (+40%)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-jega-blue-50 via-jega-indigo-50 to-jega-blue-100 p-8 rounded-2xl border border-jega-blue-200">
              <div className="text-center">
                <div className="text-4xl font-bold text-jega-blue-900 mb-2">
                  {calculatePrice()}
                </div>
                <div className="text-sm text-gray-600 mb-6">
                  {deployment === "saas"
                    ? "Facturación mensual"
                    : "Pago único + mantenimiento anual"}
                </div>
                <div className="space-y-3 text-left text-sm mb-8">
                  <div className="flex items-center">
                    <CircleCheckBig className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Hosting y mantenimiento incluido</span>
                  </div>
                  <div className="flex items-center">
                    <CircleCheckBig className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Soporte técnico 24/7</span>
                  </div>
                  <div className="flex items-center">
                    <CircleCheckBig className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Actualizaciones automáticas</span>
                  </div>
                  <div className="flex items-center">
                    <CircleCheckBig className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Backup diario y seguridad</span>
                  </div>
                </div>
                <button className="w-full bg-jega-gold-400 hover:bg-jega-gold-500 text-gray-900 font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  Solicitar Cotización
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingCalculator;
