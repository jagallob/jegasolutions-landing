import React from "react";
import {
  Brain,
  CheckCircle,
  Sparkles,
  BarChart3,
  FileText,
  Zap,
} from "lucide-react";

const AIReportsModule = () => {
  const features = [
    "Narrativas automáticas con Claude AI",
    "Análisis semántico de datos",
    "Consolidación de informes",
    "Exportación PDF/Word",
    "Insights inteligentes",
    "Personalización de plantillas",
    "Sincronización en tiempo real",
    "Historial de versiones",
  ];

  const aiCapabilities = [
    {
      icon: Sparkles,
      title: "Generación Inteligente",
      description: "Crea narrativas profesionales automáticamente",
    },
    {
      icon: BarChart3,
      title: "Análisis Avanzado",
      description: "Identifica patrones y tendencias ocultas",
    },
    {
      icon: Zap,
      title: "Velocidad",
      description: "Reduce tiempo de creación de reportes en 90%",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
        <Brain className="w-8 h-8 text-white" />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-4">Reportes con IA</h3>
      <p className="text-gray-600 mb-6">
        Generación automática de narrativas profesionales y análisis inteligente
        usando Claude AI. Transforma datos complejos en insights accionables de
        forma instantánea.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">
            Características Principales
          </h4>
          <ul className="space-y-2">
            {features.slice(0, 4).map((feature, idx) => (
              <li key={idx} className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">
            Capacidades de IA
          </h4>
          <div className="space-y-3">
            {aiCapabilities.map((capability, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <capability.icon className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-sm text-gray-900">
                    {capability.title}
                  </div>
                  <div className="text-xs text-gray-600">
                    {capability.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-purple-900">Addon</span>
          <span className="text-lg font-bold text-purple-600">+40%</span>
        </div>
        <div className="text-xs text-purple-700 mt-1">
          Requiere módulo base • Incluye Claude AI • Sin límite de reportes
        </div>
      </div>
    </div>
  );
};

export default AIReportsModule;


