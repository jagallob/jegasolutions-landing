import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

const Hero = ({ onContactClick, onDemoClick }) => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-jega-blue-900 via-jega-blue-800 to-jega-indigo-800 flex items-center justify-center text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-jega-gold-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-jega-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-jega-indigo-800/20 rounded-full blur-2xl animate-float"></div>
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-jega-gold-400 to-jega-gold-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <img
              src="/logo.png"
              alt="JEGASolutions Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-jega-gold-200 bg-clip-text text-transparent">
            JEGASolutions
          </h1>
          <p className="text-2xl md:text-3xl text-jega-gold-300 mb-8 font-medium">
            Soluciones que nacen del corazón
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Suite digital modular para la transformación de procesos
          administrativos. Automatiza, optimiza y digitaliza con herramientas
          inteligentes que{" "}
          <span className="text-jega-gold-300 font-semibold">
            revolucionan la gestión empresarial
          </span>
          .
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
        >
          <button
            onClick={onDemoClick}
            className="btn-primary text-lg px-10 py-5 group"
          >
            <span className="flex items-center justify-center">
              Solicita Demo Gratuita
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <button
            onClick={onContactClick}
            className="btn-secondary text-lg px-10 py-5 group"
          >
            <span className="flex items-center justify-center">
              Contáctanos
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 pt-8 border-t border-white/20"
        >
          <p className="text-blue-200 text-sm mb-4">
            Confían en nosotros empresas de:
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-blue-300 text-sm">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-jega-gold-400 rounded-full mr-2"></div>
              Sector Industrial
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-jega-gold-400 rounded-full mr-2"></div>
              Logística
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-jega-gold-400 rounded-full mr-2"></div>
              Hotelería
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-jega-gold-400 rounded-full mr-2"></div>
              Sector Público
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
