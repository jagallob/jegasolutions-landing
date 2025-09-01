import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Header from "./Header";
import Hero from "./Hero";
import ModulesSection from "./modules/ModulesSection";
import Consulting from "./Consulting";
import PricingCalculator from "./PricingCalculator";
import Contact from "./Contact";
import Footer from "./Footer";

const sections = [
  { id: "hero", component: Hero, name: "Inicio" },
  { id: "modules", component: ModulesSection, name: "Módulos" },
  { id: "consulting", component: Consulting, name: "Consultoría" },
  { id: "pricing", component: PricingCalculator, name: "Precios" },
  { id: "contact", component: Contact, name: "Contacto" },
  { id: "footer", component: Footer, name: "Final" },
];

const JEGASolutionsLanding = () => {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);

  // Set body background and prevent vertical scroll
  useEffect(() => {
    // Set body background to transparent or same as sections
    document.body.style.background = "#f9fafb"; // gray-50 to match most sections
    document.documentElement.style.background = "#f9fafb";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.height = "100vh";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.background = "";
      document.documentElement.style.background = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.height = "";
      document.body.style.overflow = "";
    };
  }, []);

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
    <div className="h-screen w-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-800 overflow-hidden m-0 p-0">
      {/* Header Component */}
      <Header activeSection={activeSection} scrollToSection={scrollToSection} />

      <div
        ref={containerRef}
        className="flex h-full w-full overflow-x-scroll snap-x snap-mandatory"
      >
        {sections.map((Section, index) => (
          <div
            key={Section.id}
            ref={(el) => (sectionRefs.current[index] = el)}
            className="w-full h-screen min-h-screen flex-shrink-0 snap-start overflow-hidden"
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
