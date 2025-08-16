import { useState, useEffect, useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { Github, ExternalLink, Lightbulb, Target, Zap } from 'lucide-react';

// Define a type for the project categories
type ProjectCategory = "Web Development" | "Data Engineering" | "AI/ML" | "Project Management" | "Working Project";

// Define a type for the filter options, which includes the 'All Projects' string
type FilterCategory = ProjectCategory | "All Projects";

// Animation variants
const textVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: 0.3,
      duration: 0.8,
      type: "spring",
      stiffness: 100,
      damping: 15,
    }
  }
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const floatingTagVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15
    }
  }
};

// Interface for project data
interface Project {
  name: string;
  githubUrl?: string; // Optional field for projects without a GitHub link
  problem: string;
  approach: string;
  impact: string;
  tags: string[];
  // Use the new ProjectCategory type
  category: ProjectCategory[];
  featured?: boolean;
}

// Project data with the new 'ProjectCategory' type
const projects: Project[] = [
  {
    name: "Jaidev Inventory Management System",
    problem: "Outdated, manual processes were causing significant inventory inefficiencies, leading to delays and increased costs for a company.",
    approach: "As the project lead, I managed the entire lifecycle, from gathering requirements to system architecture and deployment. I introduced self-defined milestones and proactive timeline adjustments to mitigate risks and ensure timely delivery.",
    impact: "This end-to-end solution provided a significant boost to operational efficiency and cost management. The streamlined workflows and proactive risk mitigation ensured that key milestones were met, leading to a successful project delivery.",
    tags: ["Project Management", "Resource Planning", "Cost Optimization", "Automation", "Reporting"],
    category: ["Project Management", "Web Development"],
    featured: true
  },
  {
    name: "Personal Portfolio Website",
    githubUrl: "#", // Use a placeholder link since it's not on GitHub yet
    problem: "To create a professional and engaging online presence to showcase my skills, experience, and projects.",
    approach: "Developed a modern, responsive single-page application using React and Tailwind CSS, focusing on clean design, performance optimization, and interactive animations with Framer Motion.",
    impact: "The website serves as a dynamic resume, providing potential employers and collaborators with a comprehensive and interactive view of my technical abilities and professional work.",
    tags: ["React", "Tailwind CSS", "Framer Motion", "Responsive Design", "UI/UX"],
    category: ["Working Project"],
    featured: false
  },
  {
    name: "Data Engineering Ecommerce Analytics",
    githubUrl: "https://github.com/Vishal-bhandary/data-engineering-ecommerce-analytics",
    problem: "Businesses lacked a unified view of their e-commerce data, making it difficult to extract actionable insights for strategic decisions.",
    approach: "I designed and built a comprehensive, end-to-end data engineering pipeline. This system automates the extraction, transformation, and loading of raw data into a structured format, ready for business analysis.",
    impact: "The pipeline delivers reliable, up-to-date dashboards and reports. By providing a clear and accessible view of key metrics, this project empowers stakeholders to make data-driven decisions that directly improve performance and profitability.",
    tags: ["mysql", "sqlalchemy", "ecommerce", "dashboard", "analytics", "power-bi", "pandas", "Data Engineering"],
    category: ["Data Engineering"],
    featured: false
  },
  {
    name: "Newsletter Curator",
    githubUrl: "https://github.com/Vishal-bhandary/newsletter_curator",
    problem: "The manual curation and delivery of newsletters was a time-consuming process, hindering consistent communication and efficient content management.",
    approach: "I developed a Django-powered web application with features for automated subscription management and newsletter delivery. The system uses Celery for scheduled tasks and provides a public archive page for easy access to past content.",
    impact: "This automated solution streamlines the entire newsletter workflow. It ensures consistent, on-time delivery while significantly reducing the manual effort required, allowing for greater focus on content quality.",
    tags: ["postgres", "django", "pandas", "data-engineering", "web-scraping", "celery", "smtp"],
    category: ["Data Engineering"],
    featured: false
  },
  {
    name: "Corrosion Detection Model",
    githubUrl: "https://github.com/Vishal-bhandary/corrosion-detection-model",
    problem: "Manual inspection for metal corrosion is prone to human error and inefficiency, leading to potential safety risks and increased costs.",
    approach: "I engineered an AI-powered system using deep learning. The model, built with PyTorch and OpenCV, is trained on image datasets to accurately identify corrosion. I also implemented data augmentation and noise reduction techniques to enhance its robustness.",
    impact: "This project provides an automated, reliable solution for defect detection in industrial settings. It significantly enhances quality control processes, improves inspection efficiency, and can proactively prevent material failures.",
    tags: ["cnn", "deep-learning", "pytorch", "opencv", "computer-vision", "image-classification", "streamlit", "ai-in-inspection"],
    category: ["AI/ML"],
    featured: false
  },
  {
    name: "SQL Data Warehouse Project",
    githubUrl: "https://github.com/Vishal-bhandary/sql-data-warehouse-project",
    problem: "Organizations struggled with managing large, disparate datasets, which made scalable business intelligence and complex analysis nearly impossible.",
    approach: "I designed and implemented a robust SQL Data Warehouse with a multi-layered architecture (Bronze, Silver, Gold). The solution includes automated ETL processes to support a flexible star schema, ensuring data is clean, consistent, and ready for analysis.",
    impact: "This project provides a single source of truth for all data, enabling seamless and scalable analytics. It serves as a strong foundation for business intelligence and data science initiatives, transforming raw data into a strategic asset.",
    tags: ["sql", "sql-server", "etl", "analytics", "data-warehouse", "data-engineering", "business-intelligence"],
    category: ["Data Engineering"],
    featured: false
  },
  {
    name: "SQL Data Analytics",
    githubUrl: "https://github.com/Vishal-bhandary/sql-data-analytics",
    problem: "Data professionals often spend too much time on foundational queries rather than focusing on deriving deeper insights from their data.",
    approach: "I developed a comprehensive repository of reusable SQL scripts that demonstrate advanced analytical techniques. The scripts cover everything from analyzing data over time to performing cumulative and part-to-whole analysis and data segmentation.",
    impact: "This resource significantly accelerates the data analysis process. It provides a toolkit of proven methods that allow data professionals to quickly and efficiently answer complex business questions, unlocking new insights.",
    tags: ["sql", "sql-server", "etl", "analytics", "data-visualization", "data-warehouse", "business-intelligence"],
    category: ["Data Engineering"],
    featured: false
  },
  {
    name: "Automated Coral Health Assessment System for Reef",
    githubUrl: "https://github.com/Vishal-bhandary/Automated-Coral-Health-Assessment-System-for-Reef",
    problem: "Coral reef health assessment is a labor-intensive and time-consuming process, limiting the scale and frequency of monitoring.",
    approach: "I developed an automated system using a Jupyter Notebook that processes image data to assess coral health. The system employs data analysis techniques to provide a scalable solution for reef monitoring.",
    impact: "This project provides a more efficient and consistent method for monitoring coral reef ecosystems. By automating the assessment, it can aid marine biologists and conservationists in quickly identifying areas of concern and tracking the health of reefs over time.",
    tags: ["Jupyter Notebook", "Data Analysis", "Automation", "Environmental Science"],
    category: ["AI/ML"],
    featured: false
  },
  {
    name: "STOCK-BOT-TRAIL",
    githubUrl: "https://github.com/Vishal-bhandary/STOCK-BOT-TRAIL",
    problem: "Individual investors need a reliable, automated tool to analyze market data and inform trading decisions, but manual research is often overwhelming.",
    approach: "I created a 'Stock Bot' using Python, which is designed to automate the analysis of stock market data. The project leverages data processing and automation to provide insights that can support trading strategies.",
    impact: "The bot provides a valuable resource for automating stock-related tasks, streamlining the research process and offering a structured, data-driven approach to investment decisions.",
    tags: ["Jupyter Notebook", "Automation", "Finance", "Data Analysis"],
    category: ["AI/ML"],
    featured: false
  },
  {
    name: "Local-FCM_Vishal",
    githubUrl: "https://github.com/Vishal-bhandary/Local-FCM_Vishal",
    problem: "The project is a fork to experiment with and customize the functionality of an existing Firebase Cloud Messaging (FCM) project for a specific local use case.",
    approach: "I forked the repository to gain hands-on experience and modify the code locally. This process involved understanding the existing codebase and implementing custom changes to adapt it for a new purpose.",
    impact: "This project demonstrates the ability to adapt and build upon existing solutions. It showcases a strong understanding of version control and the practical application of third-party libraries for customized solutions.",
    tags: ["Python", "Firebase", "Cloud Messaging"],
    category: ["Web Development"],
    featured: false
  },
];

// Define filter categories based on the new 'category' property
const categories: FilterCategory[] = [
  "All Projects",
  "Data Engineering",
  "AI/ML",
  "Web Development",
  "Project Management",
  "Working Project"
];

// A type guard function to check if the category is a valid ProjectCategory
const isProjectCategory = (category: FilterCategory): category is ProjectCategory => {
  return category !== "All Projects";
};

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("All Projects");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Updated filtering logic using the type guard to resolve the TypeScript error
  const filteredProjects = selectedCategory === "All Projects"
    ? projects
    : projects.filter(project => isProjectCategory(selectedCategory) && project.category.includes(selectedCategory));

  const featuredProjects = filteredProjects.filter(p => p.featured);
  const regularProjects = filteredProjects.filter(p => !p.featured);

  return (
    <section 
      ref={containerRef}
      id="projects" 
      className="relative overflow-hidden bg-gray-950 text-white py-20 px-4 md:px-8 lg:px-16 min-h-screen flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ 
            background: `radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, transparent 70%)`,
          }}
          animate={{ 
            x: mousePosition.x * 50,
            y: mousePosition.y * 50,
            scale: isHovered ? 1.2 : 1
          }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ 
            background: `radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)`,
          }}
          animate={{ 
            x: -mousePosition.x * 30,
            y: -mousePosition.y * 30,
            scale: isHovered ? 1.1 : 1
          }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-10 blur-2xl"
          style={{ 
            background: `radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)`,
          }}
          animate={{ 
            x: mousePosition.x * 20,
            y: mousePosition.y * 20,
            rotate: mousePosition.x * 10
          }}
          transition={{ duration: 3, ease: "easeOut" }}
        />
      </div>

      {/* Animated Grid Pattern */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        animate={{
          backgroundPosition: `${mousePosition.x * 10}px ${mousePosition.y * 10}px`
        }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(34, 197, 94, 0.3) 1px, transparent 0)`,
            backgroundSize: "60px 60px",
          }}
        />
      </motion.div>

      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full opacity-30"
          style={{ 
            background: i % 4 === 0 ? '#22c55e' : i % 4 === 1 ? '#3b82f6' : i % 4 === 2 ? '#a855f7' : '#f59e0b',
            left: `${10 + i * 8}%`,
            top: `${15 + (i % 5) * 15}%`
          }}
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3
          }}
        />
      ))}

      <motion.div
        ref={ref}
        className="relative z-10 w-full max-w-7xl mx-auto"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        {/* Header */}
        <motion.div className="text-center mb-16" variants={textVariants}>
          <motion.h2 
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            My{" "}
            <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent relative">
              Projects
              <motion.div
                className="absolute -inset-2 rounded-lg opacity-30 blur-xl bg-gradient-to-r from-green-400 to-purple-600"
                animate={{ 
                  scale: isHovered ? [1, 1.05, 1] : 1,
                  opacity: isHovered ? [0.3, 0.5, 0.3] : 0.3
                }}
                transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
              />
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light mb-8"
            variants={textVariants}
          >
            From concept to completion - explore my journey through innovative solutions 
            that solve real-world problems with cutting-edge technology.
          </motion.p>
          <motion.div 
            className="h-1 w-32 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-12"
          variants={staggerContainer}
        >
          {categories.map((category, index) => (
            <motion.button
              key={index}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 border-2 relative overflow-hidden group ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white border-transparent'
                  : 'border-gray-600 text-gray-300 hover:border-green-400 hover:text-green-400'
              }`}
              variants={floatingTagVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">{category}</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-500/10 opacity-0 group-hover:opacity-100"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </motion.button>
          ))}
        </motion.div>

        {/* Conditional rendering of featured projects at the top */}
        {featuredProjects.length > 0 && (
          <motion.div className="mb-16" variants={textVariants}>
            <motion.h3 
              className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"
              variants={textVariants}
            >
              🌟 Featured Project
            </motion.h3>
            <div className="flex justify-center">
              <div className="w-full lg:w-2/3">
                {featuredProjects.map((project, index) => (
                  <motion.div
                    key={index}
                    className="group relative p-8 rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm shadow-2xl overflow-hidden"
                    variants={cardVariants}
                    whileHover={{ scale: 1.02, y: -10 }}
                    onMouseEnter={() => setHoveredProject(index)}
                    onMouseLeave={() => setHoveredProject(null)}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Featured Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold rounded-full">
                      FEATURED
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl -z-10"
                      style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.1))' }}
                      animate={{ 
                        scale: hoveredProject === index ? [1, 1.05, 1] : 1,
                        opacity: hoveredProject === index ? [0, 0.3, 0] : 0
                      }}
                      transition={{ duration: 2, repeat: hoveredProject === index ? Infinity : 0 }}
                    />
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <h3 className="text-2xl font-bold text-white pr-4 leading-tight group-hover:text-green-400 transition-colors duration-300">
                          {project.name}
                        </h3>
                        {project.githubUrl && ( // Conditionally render GitHub link
                          <motion.a 
                            href={project.githubUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="p-2 rounded-full bg-gray-800/50 border border-gray-600 hover:border-green-400 hover:bg-green-400/10 transition-all duration-300"
                            whileHover={{ scale: 1.1, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Github className="h-5 w-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                          </motion.a>
                        )}
                      </div>
                      
                      <div className="space-y-6 text-gray-300">
                        <div className="group/section">
                          <motion.h4 
                            className="font-semibold text-white mb-2 flex items-center gap-2"
                            whileHover={{ x: 5 }}
                          >
                            <Lightbulb className="h-4 w-4 text-yellow-400" />
                            Problem
                          </motion.h4>
                          <p className="text-gray-400 leading-relaxed">{project.problem}</p>
                        </div>
                        <div className="group/section">
                          <motion.h4 
                            className="font-semibold text-white mb-2 flex items-center gap-2"
                            whileHover={{ x: 5 }}
                          >
                            <Target className="h-4 w-4 text-blue-400" />
                            Approach
                          </motion.h4>
                          <p className="text-gray-400 leading-relaxed">{project.approach}</p>
                        </div>
                        <div className="group/section">
                          <motion.h4 
                            className="font-semibold text-white mb-2 flex items-center gap-2"
                            whileHover={{ x: 5 }}
                          >
                            <Zap className="h-4 w-4 text-green-400" />
                            Impact
                          </motion.h4>
                          <p className="text-gray-400 leading-relaxed">{project.impact}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-6">
                        {project.tags.map((tag, tagIndex) => (
                          <motion.span
                            key={tagIndex}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300 border border-gray-600/50 hover:bg-green-400/10 hover:border-green-400/50 hover:text-green-400 transition-all duration-300 cursor-default"
                            variants={{
                              hidden: { opacity: 0, scale: 0.8 },
                              visible: { 
                                opacity: 1, 
                                scale: 1,
                                transition: { 
                                  delay: tagIndex * 0.05,
                                  type: "spring",
                                  stiffness: 200,
                                  damping: 15
                                }
                              }
                            }}
                            whileHover={{ scale: 1.1, y: -2 }}
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Regular Projects Grid */}
        <motion.div variants={textVariants}>
          <motion.h3 
            className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            variants={textVariants}
          >
            {selectedCategory === "All Projects" ? "🚀 More Projects" : `${selectedCategory} Projects`}
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularProjects.map((project, index) => (
              <motion.div
                key={index}
                className="group relative p-6 rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm shadow-xl overflow-hidden"
                variants={cardVariants}
                whileHover={{ scale: 1.03, y: -5 }}
                onMouseEnter={() => setHoveredProject(index + 100)}
                onMouseLeave={() => setHoveredProject(null)}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <motion.div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 blur-xl -z-10"
                  style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(168, 85, 247, 0.1))' }}
                  animate={{ 
                    scale: hoveredProject === index + 100 ? [1, 1.05, 1] : 1,
                    opacity: hoveredProject === index + 100 ? [0, 0.3, 0] : 0
                  }}
                  transition={{ duration: 2, repeat: hoveredProject === index + 100 ? Infinity : 0 }}
                />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-white pr-4 leading-tight group-hover:text-blue-400 transition-colors duration-300">
                      {project.name}
                    </h3>
                    {project.githubUrl && ( // Conditionally render GitHub link
                      <motion.a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 rounded-full bg-gray-800/50 border border-gray-600 hover:border-blue-400 hover:bg-blue-400/10 transition-all duration-300"
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Github className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                      </motion.a>
                    )}
                  </div>
                  
                  <div className="space-y-3 text-gray-300 mb-4">
                    <div>
                      <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{project.problem}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 4).map((tag, tagIndex) => (
                      <motion.span
                        key={tagIndex}
                        className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300 border border-gray-600/50 hover:bg-blue-400/10 hover:border-blue-400/50 hover:text-blue-400 transition-all duration-300 cursor-default"
                        variants={floatingTagVariants}
                        whileHover={{ scale: 1.05, y: -1 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{project.tags.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* View All Projects Button - visible only when 'All Projects' is selected */}
        {selectedCategory === "All Projects" && (
          <motion.div 
            className="text-center mt-16"
            variants={textVariants}
          >
            <motion.a
              href="https://github.com/Vishal-bhandary"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-500 bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-2xl border-2 border-transparent relative overflow-hidden"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)",
                y: -2
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <ExternalLink className="h-5 w-5" />
                View All Projects on GitHub
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </motion.a>
          </motion.div>
        )}

        {/* Bottom decorative element */}
        <motion.div 
          className="mt-16 flex justify-center"
          variants={textVariants}
        >
          <div className="flex items-center gap-2">
            <motion.div 
              className="h-1 w-8 bg-gradient-to-r from-transparent to-green-400 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 2 }}
            />
            <motion.div 
              className="h-2 w-2 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div 
              className="h-1 w-16 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 2.2 }}
            />
            <motion.div 
              className="h-2 w-2 bg-purple-500 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div 
              className="h-1 w-8 bg-gradient-to-r from-purple-500 to-transparent rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 2.4 }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
