import React from "react";
import { motion } from "framer-motion";

const Header = ({ activeSection, scrollToSection }) => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 bg-gradient-to-r from-white via-gray-50 to-gray-100 z-50 h-32 shadow-lg"
    >
      <div className="container-max h-full">
        <div className="flex justify-between items-center h-full py-2">
          {/* Izquierda: logo */}
          <div className="flex-1 flex justify-start">
            <div
              className="cursor-pointer h-full flex items-center"
              onClick={() => scrollToSection(0)}
            >
              <img
                src="/logo5.png"
                alt="JEGASolutions logo"
                className="h-20 object-contain drop-shadow-2xl lg:h-24 -ml-16"
              />
            </div>
          </div>

          {/* Centro: Navegación */}
          <div className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => scrollToSection(1)}
              className={`text-lg text-gray-700 hover:text-jega-blue-900 transition-colors font-medium ${
                activeSection === 1 ? "text-jega-gold-500 font-bold" : ""
              }`}
            >
              Módulos
            </button>
            <button
              onClick={() => scrollToSection(2)}
              className={`text-lg text-gray-700 hover:text-jega-blue-900 transition-colors font-medium ${
                activeSection === 2 ? "text-jega-gold-500 font-bold" : ""
              }`}
            >
              Consultoría
            </button>
            <button
              onClick={() => scrollToSection(4)}
              className={`text-lg text-gray-700 hover:text-jega-blue-900 transition-colors font-medium ${
                activeSection === 4 ? "text-jega-gold-500 font-bold" : ""
              }`}
            >
              Contacto
            </button>
          </div>

          {/* Derecha: Botón CTA */}
          <div className="flex-1 flex justify-end mr-16">
            <button
              onClick={() => scrollToSection(3)}
              className="btn-primary px-6 py-2 text-base"
            >
              Ver Precios
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Header;
