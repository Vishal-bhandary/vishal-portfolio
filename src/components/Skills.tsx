import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { Globe, Code, BarChart, HardHat } from 'lucide-react';

// Define the skill data and their proficiency levels
const skillCategories = [
  {
    name: "Technical Skills",
    key: "technical",
    icon: Code,
    skills: [
      { name: "Python", proficiency: 90 },
      { name: "SQL", proficiency: 85 },
      { name: "JavaScript", proficiency: 75 },
      { name: "React", proficiency: 70 },
      { name: "Django", proficiency: 65 },
      { name: "Git/GitHub", proficiency: 80 },
    ],
  },
  {
    name: "ML & Data Science",
    key: "ml",
    icon: BarChart,
    skills: [
      { name: "TensorFlow", proficiency: 80 },
      { name: "PyTorch", proficiency: 75 },
      { name: "Scikit-learn", proficiency: 85 },
      { name: "Data Engineering", proficiency: 70 },
      { name: "Spark & Hive", proficiency: 60 },
      { name: "Pandas", proficiency: 90 },
    ],
  },
  {
    name: "Soft Skills",
    key: "soft",
    icon: HardHat,
    skills: [
      { name: "Problem Solving", proficiency: 95 },
      { name: "Teamwork", proficiency: 90 },
      { name: "Leadership", proficiency: 85 },
      { name: "Communication", proficiency: 85 },
      { name: "Project Management", proficiency: 80 },
    ],
  },
];

// Define language proficiency
const languageSkills = [
  { name: "English", proficiency: 95 },
  { name: "Hindi", proficiency: 80 },
  { name: "Kannada", proficiency: 85 },
  { name: "Tulu", proficiency: 90 },
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

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="min-h-screen pt-24 pb-12 bg-gray-950 text-white overflow-hidden">
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
              className="h-1 w-8 bg-gradient-to-r from-transparent to-yellow-400 rounded-full"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <motion.div
              className="h-2 w-2 bg-yellow-400 rounded-full"
              animate={isInView ? { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="h-1 w-16 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.5, delay: 0.7 }}
            />
            <motion.div
              className="h-2 w-2 bg-red-500 rounded-full"
              animate={isInView ? { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
              className="h-1 w-8 bg-gradient-to-r from-red-500 to-transparent rounded-full"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
            />
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 text-center">
            Skills & Proficiency
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-gray-400 text-center">
            This section highlights my core skills and language abilities.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {skillCategories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.key}
                className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl shadow-gray-900/50"
                variants={textVariants}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-full bg-gray-700 text-yellow-400">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-200">{category.name}</h3>
                </div>
                <motion.div
                  className="space-y-6"
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  variants={staggerContainer}
                >
                  {category.skills.map((skill) => (
                    <motion.div key={skill.name} variants={textVariants}>
                      <div className="flex justify-between items-center text-sm font-medium text-gray-300 mb-1">
                        <span>{skill.name}</span>
                        <span>{skill.proficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-red-500"
                          initial={{ width: 0, opacity: 0 }}
                          animate={isInView ? { width: `${skill.proficiency}%`, opacity: 1 } : { width: 0, opacity: 0 }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Languages Section */}
        <motion.div
          className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl shadow-gray-900/50"
          variants={textVariants}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-full bg-gray-700 text-yellow-400">
              <Globe size={24} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-200">Languages</h3>
          </div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {languageSkills.map((lang) => (
              <motion.div key={lang.name} variants={textVariants}>
                <div className="flex justify-between items-center text-sm font-medium text-gray-300 mb-1">
                  <span>{lang.name}</span>
                  <span>{lang.proficiency}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-red-500"
                    initial={{ width: 0, opacity: 0 }}
                    animate={isInView ? { width: `${lang.proficiency}%`, opacity: 1 } : { width: 0, opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
