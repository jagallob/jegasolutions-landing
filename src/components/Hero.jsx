import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Hero = ({ onContactClick, onDemoClick }) => {
  return (
    <section className="h-screen bg-gray-50 flex items-center justify-center text-gray-900 relative overflow-hidden">
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6 md:px-8 lg:px-4">
        {/* Logo con mejor espaciado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-12 mb-8"
        >
          <img
            src="/logo5.png"
            alt="JEGASolutions Logo"
            className="mx-auto h-32 w-auto md:h-40 lg:h-48 -ml-1 md:-ml-2"
          />
        </motion.div>

        {/* Descripción principal */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed"
        >
          Suite digital modular para la transformación de procesos
          administrativos. Automatiza, optimiza y digitaliza con herramientas
          inteligentes que{" "}
          <span className="text-jega-blue-800 font-semibold">
            revolucionan la gestión empresarial
          </span>
          .
        </motion.p>

        {/* Botones de acción */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12"
        >
          <button
            onClick={onDemoClick}
            className="btn-primary text-lg px-8 py-4 lg:px-10 lg:py-5 group"
          >
            <span className="flex items-center justify-center">
              Solicita Demo Gratuita
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <button
            onClick={onContactClick}
            className="btn-outline text-lg px-8 py-4 lg:px-10 lg:py-5 group"
          >
            <span className="flex items-center justify-center">
              Contáctanos
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </motion.div>

        {/* Sección de aplicabilidad */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="pt-8 border-t border-gray-200"
        >
          <p className="text-gray-600 text-sm mb-6">
            Una solución que se adapta a tu industria:
          </p>
          <div className="flex flex-wrap justify-center gap-6 lg:gap-8 text-gray-700 text-sm">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-jega-gold-400 rounded-full mr-2"></div>
              Sector Industrial
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-jega-gold-400 rounded-full mr-2"></div>
              Logística y Transporte
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-jega-gold-400 rounded-full mr-2"></div>
              Retail y Comercio
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-jega-gold-400 rounded-full mr-2"></div>
              Servicios Profesionales
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-jega-gold-400 rounded-full mr-2"></div>
              Hotelería y Turismo
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-jega-gold-400 rounded-full mr-2"></div>
              Tecnología y Software
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-jega-gold-400 rounded-full mr-2"></div>
              Construcción e Inmobiliaria
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-jega-gold-400 rounded-full mr-2"></div>
              Restaurantes y Alimentación
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
