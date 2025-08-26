import React from "react";
import { motion } from "framer-motion";
import ExtraHoursModule from "./ExtraHoursModule";
import AIReportsModule from "./AIReportsModule";
import UpcomingModules from "./UpcomingModules";

const ModulesSection = () => {
  return (
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
            solución completa adaptada a las necesidades específicas de tu
            empresa.
          </p>
        </motion.div>

        {/* Current Modules */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <ExtraHoursModule />
          <AIReportsModule />
        </div>

        {/* Upcoming Modules */}
        <UpcomingModules />
      </div>
    </section>
  );
};

export default ModulesSection;


