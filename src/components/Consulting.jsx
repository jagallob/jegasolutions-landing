import { motion } from "framer-motion";
import { BarChart, Zap, Shield, Award, ArrowRight } from "lucide-react";

const services = [
  {
    icon: BarChart,
    title: "Diagnóstico",
    description:
      "Análisis profundo de procesos actuales e identificación de oportunidades de mejora.",
    color: "blue",
  },
  {
    icon: Zap,
    title: "Optimización",
    description:
      "Diseño de soluciones personalizadas y eficientes para tu empresa.",
    color: "green",
  },
  {
    icon: Shield,
    title: "Cumplimiento",
    description:
      "Garantía de conformidad con normativas vigentes y mejores prácticas.",
    color: "purple",
  },
  {
    icon: Award,
    title: "Acompañamiento",
    description:
      "Soporte continuo en la implementación y adopción de soluciones.",
    color: "yellow",
  },
];

const testimonials = [
  {
    quote:
      "JEGASolutions transformó completamente nuestros procesos administrativos. La eficiencia aumentó un 40%.",
    author: "María González",
    position: "Directora de Operaciones, Industrias del Valle",
  },
  {
    quote:
      "La consultoría fue clave para entender cómo digitalizar sin perder la esencia de nuestra empresa.",
    author: "Carlos Mendoza",
    position: "Gerente General, Logística Express",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Análisis",
    description: "Evaluación detallada de procesos y necesidades.",
  },
  {
    step: "02",
    title: "Diseño",
    description: "Propuesta de solución personalizada.",
  },
  {
    step: "03",
    title: "Implementación",
    description: "Desarrollo e instalación de la solución.",
  },
  {
    step: "04",
    title: "Soporte",
    description: "Acompañamiento continuo y optimización.",
  },
];

const getIconColor = (color) => {
  const colors = {
    blue: "from-jega-blue-500 to-jega-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    yellow: "from-jega-gold-400 to-jega-gold-500",
  };
  return colors[color] || colors.blue;
};

const Consulting = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Consultoría <span className="gradient-text">Tecnológica</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Acompañamos a tu empresa en su transformación digital con un
              enfoque integral que va más allá del software. Entendemos tu
              negocio y diseñamos soluciones que generan valor real.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3 group"
                >
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${getIconColor(
                      service.color
                    )} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <service.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <button className="btn-outline group">
              <span className="flex items-center">
                Agenda una consulta gratuita
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-6 border-l-4 border-jega-gold-400"
              >
                <p className="text-gray-700 text-md italic mb-4">
                  "{testimonial.quote}"
                </p>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-xs text-gray-600">
                    {testimonial.position}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-12">
            Nuestro Proceso de Consultoría
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-jega-blue-500 to-jega-indigo-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-lg">
                    {item.step}
                  </span>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Consulting;
