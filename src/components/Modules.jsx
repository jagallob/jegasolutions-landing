import { motion } from "framer-motion";
import {
  Clock,
  Brain,
  Zap,
  Shield,
  BarChart,
  CircleCheckBig,
  Star,
  Calendar,
} from "lucide-react";

const ExtraHoursModule = () => {
  const features = [
    "Registro automático por empleados",
    "Cálculo categorizado (diurna/nocturna/festiva)",
    "Sistema de aprobación por managers",
    "Reportes y exportación a Excel",
  ];
  const benefits = [
    {
      icon: BarChart,
      title: "Eficiencia",
      description: "Reduce tiempo de procesamiento en un 80%",
    },
    {
      icon: Shield,
      title: "Cumplimiento",
      description: "Garantiza conformidad con normativas laborales",
    },
    {
      icon: Zap,
      title: "Automatización",
      description: "Elimina errores manuales y agiliza pagos",
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
        cumplimiento normativo garantizado.
      </p>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">
            Características Principales
          </h4>
          <ul className="space-y-2">
            {features.map((f, i) => (
              <li key={i} className="flex items-center text-sm text-gray-600">
                <CircleCheckBig className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Beneficios Clave</h4>
          <div className="space-y-3">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-jega-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <b.icon className="w-4 h-4 text-jega-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-sm text-gray-900">
                    {b.title}
                  </div>
                  <div className="text-xs text-gray-600">{b.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AIReportsModule = () => {
  const features = [
    "Narrativas automáticas con Claude AI",
    "Análisis semántico de datos",
    "Consolidación de informes",
    "Exportación PDF/Word",
  ];
  const benefits = [
    {
      icon: Brain,
      title: "Generación Inteligente",
      description: "Crea narrativas profesionales automáticamente",
    },
    {
      icon: BarChart,
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
        usando Claude AI.
      </p>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">
            Características Principales
          </h4>
          <ul className="space-y-2">
            {features.map((f, i) => (
              <li key={i} className="flex items-center text-sm text-gray-600">
                <CircleCheckBig className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">
            Capacidades de IA
          </h4>
          <div className="space-y-3">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <b.icon className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-sm text-gray-900">
                    {b.title}
                  </div>
                  <div className="text-xs text-gray-600">{b.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const UpcomingModules = () => {
  const modules = [
    { icon: Zap, title: "Gestión de Nómina", status: "Q1 2025" },
    { icon: Shield, title: "Control de Asistencia", status: "Q2 2025" },
    { icon: BarChart, title: "Business Intelligence", status: "Q3 2025" },
  ];
  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Star className="w-6 h-6 text-jega-gold-500" />
          <h3 className="text-3xl font-bold text-gray-900">Próximos Módulos</h3>
          <Star className="w-6 h-6 text-jega-gold-500" />
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Continuamos expandiendo la suite con nuevas funcionalidades.
        </p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {modules.map((mod, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-jega-gold-50 to-yellow-100 rounded-2xl p-6 border border-jega-gold-200 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-jega-gold-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <mod.icon className="w-6 h-6 text-jega-gold-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              {mod.title}
            </h4>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{mod.status}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Modules = () => (
  <section className="section-padding bg-gray-50">
    <div className="container-max">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Suite Digital <span className="gradient-text">Modular</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Módulos especializados que se integran perfectamente para crear una
          solución completa adaptada a tu empresa.
        </p>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-8 mb-20">
        <ExtraHoursModule />
        <AIReportsModule />
      </div>
      <UpcomingModules />
    </div>
  </section>
);

export default Modules;
