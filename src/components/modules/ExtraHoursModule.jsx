import React from "react";
import { Clock, CheckCircle, TrendingUp, Shield, FileText } from "lucide-react";

const ExtraHoursModule = () => {
  const features = [
    "Registro automático por empleados",
    "Cálculo categorizado (diurna/nocturna/festiva)",
    "Sistema de aprobación por managers",
    "Reportes y exportación a Excel",
    "Cumplimiento normativo 100%",
    "Integración con sistemas de nómina",
    "Notificaciones automáticas",
    "Auditoría completa de cambios",
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "Eficiencia",
      description: "Reduce tiempo de procesamiento en un 80%",
    },
    {
      icon: Shield,
      title: "Cumplimiento",
      description: "Garantiza conformidad con normativas laborales",
    },
    {
      icon: FileText,
      title: "Reportes",
      description: "Genera informes detallados automáticamente",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
      <div className="w-16 h-16 bg-gradient-to-br from-jega-blue-500 to-jega-blue-600 rounded-2xl flex items-center justify-center mb-6">
        <Clock className="w-8 h-8 text-white" />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Gestión de Horas Extra
      </h3>
      <p className="text-gray-600 mb-6">
        Automatiza el registro, cálculo y aprobación de horas extra con
        cumplimiento normativo garantizado. Sistema inteligente que se adapta a
        las políticas de tu empresa.
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
          <h4 className="font-semibold text-gray-900 mb-3">Beneficios Clave</h4>
          <div className="space-y-3">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-jega-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-4 h-4 text-jega-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-sm text-gray-900">
                    {benefit.title}
                  </div>
                  <div className="text-xs text-gray-600">
                    {benefit.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900">
            Precio desde
          </span>
          <span className="text-lg font-bold text-blue-600">$89/mes</span>
        </div>
        <div className="text-xs text-blue-700 mt-1">
          Incluye hasta 200 empleados • Soporte técnico • Actualizaciones
        </div>
      </div>
    </div>
  );
};

export default ExtraHoursModule;


