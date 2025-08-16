import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import {
  Code,
  Server,
  Cloud,
  Wrench, // Changed from Tool to Wrench, as Tool is not a valid icon in Lucide React
  Database,
  Brain,
  Layers,
  Container,
} from 'lucide-react';

// Define the tech stack data organized by category
const techStackCategories = [
  {
    name: "Languages",
    icon: Code,
    color: "text-blue-400",
    bgColor: "bg-blue-900/50",
    techs: ["Python", "JavaScript", "SQL", "C"],
  },
  {
    name: "Web Development",
    icon: Server,
    color: "text-green-400",
    bgColor: "bg-green-900/50",
    techs: ["React", "Node.js", "Django", "HTML", "CSS"],
  },
  {
    name: "ML & AI",
    icon: Brain,
    color: "text-purple-400",
    bgColor: "bg-purple-900/50",
    techs: ["TensorFlow", "PyTorch", "Scikit-learn", "NumPy", "Pandas"],
  },
  {
    name: "Databases",
    icon: Database,
    color: "text-red-400",
    bgColor: "bg-red-900/50",
    techs: ["MySQL", "SQL Server", "PostgreSQL"],
  },
  {
    name: "Tools & DevOps",
    icon: Wrench, // Changed from Tool to Wrench
    color: "text-yellow-400",
    bgColor: "bg-yellow-900/50",
    techs: ["Git", "Docker", "Jupyter", "VS Code", "GitHub Actions"],
  },
  {
    name: "Cloud",
    icon: Cloud,
    color: "text-cyan-400",
    bgColor: "bg-cyan-900/50",
    techs: ["Azure", "GCP (Basics)"],
  },
  {
    name: "Data & ETL",
    icon: Layers,
    color: "text-indigo-400",
    bgColor: "bg-indigo-900/50",
    techs: ["Spark", "Hive"],
  },
  {
    name: "Containers",
    icon: Container,
    color: "text-pink-400",
    bgColor: "bg-pink-900/50",
    techs: ["Docker", "Kubernetes (basics)"],
  },
];

// Animation variants
const textVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function TechStack() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="tech-stack" className="py-24 bg-gray-950 text-white overflow-hidden">
      <motion.div
        ref={ref}
        className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        {/* Title and wavy lines */}
        <motion.div
          className="flex flex-col items-center mb-12 sm:mb-16"
          variants={textVariants}
        >
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              className="h-1 w-8 bg-gradient-to-r from-transparent to-purple-400 rounded-full"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <motion.div
              className="h-2 w-2 bg-purple-400 rounded-full"
              animate={isInView ? { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="h-1 w-16 bg-gradient-to-r from-purple-400 via-indigo-500 to-pink-500 rounded-full"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.5, delay: 0.7 }}
            />
            <motion.div
              className="h-2 w-2 bg-pink-500 rounded-full"
              animate={isInView ? { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
              className="h-1 w-8 bg-gradient-to-r from-pink-500 to-transparent rounded-full"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
            />
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 text-center">
            My Tech Stack
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-gray-400 text-center">
            A comprehensive list of the technologies and tools I work with.
          </p>
        </motion.div>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {techStackCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={index}
                className={`p-6 rounded-2xl border border-gray-700 shadow-xl ${category.bgColor} transition-all duration-300 hover:scale-105`}
                variants={textVariants}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-2 rounded-full border border-gray-600 ${category.bgColor} ${category.color}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-200">{category.name}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.techs.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="text-sm px-3 py-1 bg-gray-700 rounded-full text-gray-300 font-medium whitespace-nowrap"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
