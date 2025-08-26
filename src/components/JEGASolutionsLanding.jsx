import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Hero from "./Hero";
import Modules from "./Modules";
import Consulting from "./Consulting";
import PricingCalculator from "./PricingCalculator";
import Contact from "./Contact";
import Footer from "./Footer";

const sections = [
  { id: "hero", component: Hero, name: "Inicio" },
  { id: "modules", component: Modules, name: "Módulos" },
  { id: "consulting", component: Consulting, name: "Consultoría" },
  { id: "pricing", component: PricingCalculator, name: "Precios" },
  { id: "contact", component: Contact, name: "Contacto" },
  { id: "footer", component: Footer, name: "Final" },
];

const JEGASolutionsLanding = () => {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);

  const scrollToSection = (index) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  const nextSection = () => {
    const nextIndex = (activeSection + 1) % sections.length;
    scrollToSection(nextIndex);
  };

  const prevSection = () => {
    const prevIndex = (activeSection - 1 + sections.length) % sections.length;
    scrollToSection(prevIndex);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex(
              (ref) => ref === entry.target
            );
            if (index !== -1) {
              setActiveSection(index);
            }
          }
        });
      },
      { threshold: 0.6, root: containerRef.current }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-900 overflow-hidden">
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-50"
      >
        <div className="container-max">
          <div className="flex justify-between items-center py-4">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => scrollToSection(0)}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-jega-gold-400 to-jega-gold-500 rounded-xl flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="JEGASolutions Logo"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="text-xl font-bold text-gray-900">
                JEGASolutions
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <button
                onClick={() => scrollToSection(1)}
                className={`text-gray-700 hover:text-jega-blue-600 transition-colors font-medium ${
                  activeSection === 1 ? "text-jega-blue-600" : ""
                }`}
              >
                Módulos
              </button>
              <button
                onClick={() => scrollToSection(2)}
                className={`text-gray-700 hover:text-jega-blue-600 transition-colors font-medium ${
                  activeSection === 2 ? "text-jega-blue-600" : ""
                }`}
              >
                Consultoría
              </button>
              <button
                onClick={() => scrollToSection(4)}
                className={`text-gray-700 hover:text-jega-blue-600 transition-colors font-medium ${
                  activeSection === 4 ? "text-jega-blue-600" : ""
                }`}
              >
                Contacto
              </button>
            </div>
            <button onClick={() => scrollToSection(3)} className="btn-outline">
              Ver Precios
            </button>
          </div>
        </div>
      </motion.nav>

      <div
        ref={containerRef}
        className="flex h-full w-full overflow-x-scroll snap-x snap-mandatory"
      >
        {sections.map((Section, index) => (
          <div
            key={Section.id}
            ref={(el) => (sectionRefs.current[index] = el)}
            className="w-full h-full flex-shrink-0 snap-start"
          >
            <Section.component
              onContactClick={() => scrollToSection(4)}
              onDemoClick={() => scrollToSection(3)}
              onScrollToTop={() => scrollToSection(0)}
            />
          </div>
        ))}
      </div>

      {activeSection > 0 && (
        <motion.button
          onClick={prevSection}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 bg-white/80 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </motion.button>
      )}
      {activeSection < sections.length - 1 && (
        <motion.button
          onClick={nextSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 bg-white/80 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </motion.button>
      )}

      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 space-y-2 hidden md:block">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === index
                ? "bg-jega-blue-600 scale-125"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Ir a la sección ${section.name}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default JEGASolutionsLanding;
