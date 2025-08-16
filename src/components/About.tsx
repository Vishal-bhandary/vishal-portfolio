import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView, type Variants, useAnimationControls } from 'framer-motion';
import ParticleCanvas from '../components/ParticleCanvas';

// Resume summary oriented towards junior project management
const valueOrientedSummary = `
I am an aspiring Junior Project Manager with a strong foundation in strategic execution and cross-functional collaboration. My experience has been shaped by a passion for process efficiency and a commitment to delivering impactful projects. I thrive on coordinating resources, managing timelines, and ensuring clear communication across all stakeholders. My work ethic is defined by a problem-solving mindset and a deep sense of ownership. I've successfully supported full-cycle implementation projects using both Agile and Waterfall methodologies. I am eager to apply my proven ability in risk tracking, reporting, and execution support to my first project management role, where I can help teams achieve their goals and drive tangible results.
`;

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
      staggerChildren: 0.1
    }
  }
};

// Skills list for the scrolling animation
const exploringSkillsList = [
  'Advanced Agile and Scrum methodologies',
  'Project management software (Jira, Asana, Trello)',
  'Risk management and mitigation strategies',
  'Effective stakeholder communication',
  'Prompt Engineering & AI Integration',
  'LLM Workflow Automation',
  'Data Analytics for Project Forecasting',
  'Blockchain and Web3 Project Development',
  'User Experience (UX) Research and Design'
];

// SVG Icons
const GamingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 12h4"></path>
    <path d="M8 10v4"></path>
    <path d="m15 11-1 2"></path>
    <path d="m17 11-1 2"></path>
    <path d="M22 16a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6z"></path>
  </svg>
);

const BookOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const PenToolIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
    <path d="M18 13l-1.5-1.5"></path>
    <path d="m2 22 3-3h3l-3 3"></path>
    <path d="m2 19 3 3"></path>
  </svg>
);

const JournalingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <path d="M14 2v6h6"></path>
    <path d="M16 13H8"></path>
    <path d="M16 17H8"></path>
    <path d="M10 9H8"></path>
  </svg>
);

const TvIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="15" x="2" y="7" rx="2" ry="2"></rect>
    <polyline points="17,2 12,7 7,2"></polyline>
  </svg>
);

const BadmintonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M8 12h8"></path>
    <path d="M12 8v8"></path>
  </svg>
);

const ChessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2l2 2h4l2-2"></path>
    <path d="M9 4v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4"></path>
    <path d="M8 8h8l1 8H7z"></path>
  </svg>
);

const LearningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  </svg>
);

const interests = [
  { text: 'Learning', icon: <LearningIcon /> },
  { text: 'Writing', icon: <PenToolIcon /> },
  { text: 'Poetry', icon: <PenToolIcon /> },
  { text: 'Journaling', icon: <JournalingIcon /> },
  { text: 'PC Gaming', icon: <GamingIcon /> },
  { text: 'Watching Series', icon: <TvIcon /> },
  { text: 'Writing a novel', icon: <PenToolIcon /> },
  { text: 'Reading novels', icon: <BookOpenIcon /> },
  { text: 'Badminton', icon: <BadmintonIcon /> },
  { text: 'Chess', icon: <ChessIcon /> },
];

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const exploringControls = useAnimationControls();
  const exploringItemHeight = 36;
  const totalItems = exploringSkillsList.length;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const totalHeight = exploringItemHeight * totalItems;
    const animation = async () => {
      await exploringControls.start({
        y: -totalHeight,
        transition: {
          duration: 30,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    };
    animation();
  }, [exploringControls, totalItems]);

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

  const handleMouseEnter = useCallback(() => {
    exploringControls.stop();
    setIsHovered(true);
  }, [exploringControls]);

  const handleMouseLeave = useCallback(() => {
    exploringControls.start({
      y: -exploringItemHeight * totalItems,
      transition: {
        duration: 30,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      },
    });
    setIsHovered(false);
  }, [exploringControls, totalItems, exploringItemHeight]);
  
  return (
    <section 
      ref={containerRef}
      id="about" 
      className="relative overflow-hidden bg-gray-950 text-white py-20 px-4 md:px-8 lg:px-16 min-h-screen flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dynamic Background Elements - Similar to Hero */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ 
            background: `radial-gradient(circle, rgba(56, 189, 248, 0.4) 0%, transparent 70%)`,
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
            background: `radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)`,
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
            background: `radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)`,
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
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(56, 189, 248, 0.3) 1px, transparent 0)`,
            backgroundSize: "60px 60px",
          }}
        />
      </motion.div>

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full opacity-30"
          style={{ 
            background: i % 3 === 0 ? '#38bdf8' : i % 3 === 1 ? '#a855f7' : '#22c55e',
            left: `${15 + i * 12}%`,
            top: `${20 + i * 8}%`
          }}
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
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
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            About{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent relative">
              Me
              <motion.div
                className="absolute -inset-2 rounded-lg opacity-30 blur-xl bg-gradient-to-r from-cyan-400 to-purple-600"
                animate={{ 
                  scale: isHovered ? [1, 1.05, 1] : 1,
                  opacity: isHovered ? [0.3, 0.5, 0.3] : 0.3
                }}
                transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
              />
            </span>
          </motion.h2>
          <motion.div 
            className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-purple-600 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </motion.div>
        
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          {/* Text Content */}
          <motion.div className="space-y-6" variants={textVariants}>
            <motion.p 
              className="text-lg lg:text-xl text-gray-300 leading-relaxed text-justify font-light"
              variants={textVariants}
            >
              {valueOrientedSummary.trim()}
            </motion.p>
            
            <motion.div 
              className="flex items-center gap-4 pt-4"
              variants={textVariants}
            >
              <motion.div 
                className="h-px bg-gradient-to-r from-cyan-400 to-transparent flex-1"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1 }}
              />
              <motion.span 
                className="text-cyan-400 font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                Let's Build Something Amazing
              </motion.span>
              <motion.div 
                className="h-px bg-gradient-to-l from-cyan-400 to-transparent flex-1"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1 }}
              />
            </motion.div>
          </motion.div>
          
          {/* Interactive Particle Field */}
          <motion.div 
            variants={cardVariants} 
            className="w-full flex justify-center lg:justify-end"
          >
            <motion.div 
              className="w-[550px] h-[550px] flex justify-center items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <ParticleCanvas />
            </motion.div>
          </motion.div>
        </div>
        
        {/* Cards Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* What I'm Exploring */}
          <motion.div
            className="group relative p-6 rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm shadow-2xl overflow-hidden"
            variants={cardVariants}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl -z-10"
              style={{ background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(59, 130, 246, 0.1))' }}
              animate={{ 
                scale: isHovered ? [1, 1.05, 1] : 1,
                opacity: isHovered ? [0, 0.3, 0] : 0
              }}
              transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
            />
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4 text-center">
                What I'm Exploring
              </h3>
              
              <div className="relative h-64 overflow-hidden rounded-lg">
                <motion.ul
                  className="absolute w-full space-y-3"
                  animate={exploringControls}
                >
                  {[...exploringSkillsList, ...exploringSkillsList].map((skill, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700/30"
                      whileHover={{ 
                        scale: 1.02, 
                        backgroundColor: "rgba(56, 189, 248, 0.1)",
                        borderColor: "rgba(56, 189, 248, 0.3)"
                      }}
                    >
                      <motion.div 
                        className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex-shrink-0"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                      />
                      <span className="text-gray-300 text-sm font-medium">{skill}</span>
                    </motion.li>
                  ))}
                </motion.ul>
                
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-gray-900 to-transparent pointer-events-none"></div>
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none"></div>
              </div>
              
              <div className="text-center mt-4">
                <span className="text-xs text-gray-500 italic">Hover to pause • Always learning</span>
              </div>
            </div>
          </motion.div>
          
          {/* Interests */}
          <motion.div
            className="group relative p-6 rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm shadow-2xl overflow-hidden"
            variants={cardVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl -z-10"
              style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.1))' }}
              animate={{ 
                scale: isHovered ? [1, 1.05, 1] : 1,
                opacity: isHovered ? [0, 0.3, 0] : 0
              }}
              transition={{ duration: 2.5, repeat: isHovered ? Infinity : 0 }}
            />
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4 text-center">
                Interests & Hobbies
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {interests.map((interest, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 cursor-pointer group/item relative overflow-hidden"
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { 
                        opacity: 1, 
                        scale: 1,
                        transition: { 
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 200,
                          damping: 15
                        }
                      }
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      backgroundColor: "rgba(168, 85, 247, 0.1)",
                      borderColor: "rgba(168, 85, 247, 0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Hover glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-500/10 opacity-0 group-hover/item:opacity-100"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    
                    <motion.span 
                      className="text-purple-400 group-hover/item:text-pink-400 transition-colors duration-300 z-10 relative"
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {interest.icon}
                    </motion.span>
                    <span className="text-gray-300 text-sm font-medium group-hover/item:text-white transition-colors duration-300 z-10 relative">
                      {interest.text}
                    </span>
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center mt-4">
                <span className="text-xs text-gray-500 italic">Click to explore • Life beyond code</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom decorative element */}
        <motion.div 
          className="mt-16 flex justify-center"
          variants={textVariants}
        >
          <div className="flex items-center gap-2">
            <motion.div 
              className="h-1 w-8 bg-gradient-to-r from-transparent to-cyan-400 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 2 }}
            />
            <motion.div 
              className="h-2 w-2 bg-cyan-400 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div 
              className="h-1 w-16 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full"
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
};

export default About;