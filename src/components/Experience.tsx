import { useState, useEffect, useRef, useMemo, useCallback, type JSX } from 'react';
import { motion, AnimatePresence, useInView, type Variants } from 'framer-motion';
import { Briefcase, GraduationCap, Code, Award } from 'lucide-react';
import * as THREE from 'three';

// --------------------------------------------------------------------------
// ParticleCanvas Component - Optimized with shape transitions
// --------------------------------------------------------------------------

// Reusable configurations for different particle shapes
const SHAPE_CONFIGS = {
  briefcase: {
    numPoints: 4000,
    shapeFn: (count: number, scale: number) => {
      const points = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * scale * 1.5;
        const y = (Math.random() - 0.5) * scale * 0.8;
        const z = (Math.random() - 0.5) * scale * 0.5;
        points[i * 3] = x;
        points[i * 3 + 1] = y;
        points[i * 3 + 2] = z;
      }
      return points;
    },
    color: 0x3b82f6,
  },
  hat: {
    numPoints: 4000,
    shapeFn: (count: number, scale: number) => {
      const points = new Float32Array(count * 3);
      const capScale = scale * 0.7;
      const topHeight = scale * 0.2;
      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * capScale;
        const y = (Math.random() - 0.5) * capScale;
        const z = (Math.random() - 0.5) * 0.05 * scale;
        const pointX = (Math.random() - 0.5) * 0.1 * scale;
        const pointY = (Math.random() - 0.5) * 0.1 * scale;
        const pointZ = topHeight + (Math.random() - 0.5) * 0.05 * scale;
        
        if (Math.random() < 0.9) {
          points[i * 3] = x;
          points[i * 3 + 1] = y;
          points[i * 3 + 2] = z;
        } else {
          points[i * 3] = pointX;
          points[i * 3 + 1] = pointY;
          points[i * 3 + 2] = pointZ;
        }
      }
      return points;
    },
    color: 0x10b981,
  },
  cube: {
    numPoints: 4000,
    shapeFn: (count: number, scale: number) => {
      const points = new Float32Array(count * 3);
      const numPerSide = Math.cbrt(count);
      const spacing = scale / numPerSide;
      let i = 0;
      for (let x = 0; x < numPerSide; x++) {
        for (let y = 0; y < numPerSide; y++) {
          for (let z = 0; z < numPerSide; z++) {
            if (i < count) {
              points[i * 3] = (x - numPerSide / 2) * spacing;
              points[i * 3 + 1] = (y - numPerSide / 2) * spacing;
              points[i * 3 + 2] = (z - numPerSide / 2) * spacing;
              i++;
            }
          }
        }
      }
      return points;
    },
    color: 0x9333ea,
  },
  torus: {
    numPoints: 4000,
    shapeFn: (count: number, scale: number) => {
      const points = new Float32Array(count * 3);
      const majorRadius = scale / 2.5;
      const minorRadius = scale / 6;

      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 2;

        const x = (majorRadius + minorRadius * Math.cos(phi)) * Math.cos(theta);
        const y = (majorRadius + minorRadius * Math.cos(phi)) * Math.sin(theta);
        const z = minorRadius * Math.sin(phi);

        points[i * 3] = x;
        points[i * 3 + 1] = y;
        points[i * 3 + 2] = z;
      }
      return points;
    },
    color: 0xea580c,
  },
  sphere: {
    numPoints: 4000,
    shapeFn: (count: number, scale: number) => {
      const points = new Float32Array(count * 3);
      const radius = scale / 2;
      for (let i = 0; i < count; i++) {
        const r = radius * Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        points[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        points[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        points[i * 3 + 2] = r * Math.cos(phi);
      }
      return points;
    },
    color: 0xffa500,
  },
  pyramid: {
    numPoints: 4000,
    shapeFn: (count: number, scale: number) => {
      const points = new Float32Array(count * 3);
      const baseSize = scale;
      const height = scale * 1.2;
      
      for (let i = 0; i < count; i++) {
        const layer = Math.random();
        const layerHeight = layer * height;
        const layerSize = baseSize * (1 - layer);
        
        const x = (Math.random() - 0.5) * layerSize;
        const z = (Math.random() - 0.5) * layerSize;
        const y = layerHeight - height / 2;
        
        points[i * 3] = x;
        points[i * 3 + 1] = y;
        points[i * 3 + 2] = z;
      }
      return points;
    },
    color: 0xec4899,
  },
  cylinder: {
    numPoints: 4000,
    shapeFn: (count: number, scale: number) => {
      const points = new Float32Array(count * 3);
      const radius = scale / 2;
      const height = scale * 1.5;
      
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const r = radius * Math.sqrt(Math.random());
        const y = (Math.random() - 0.5) * height;
        
        points[i * 3] = r * Math.cos(theta);
        points[i * 3 + 1] = y;
        points[i * 3 + 2] = r * Math.sin(theta);
      }
      return points;
    },
    color: 0x06b6d4,
  },
  helix: {
    numPoints: 4000,
    shapeFn: (count: number, scale: number) => {
      const points = new Float32Array(count * 3);
      const radius = scale / 2;
      const height = scale * 2;
      const turns = 3;
      
      for (let i = 0; i < count; i++) {
        const t = i / count;
        const angle = t * Math.PI * 2 * turns;
        const y = (t - 0.5) * height;
        const r = radius * (0.8 + 0.2 * Math.sin(t * Math.PI * 4));
        
        points[i * 3] = r * Math.cos(angle);
        points[i * 3 + 1] = y;
        points[i * 3 + 2] = r * Math.sin(angle);
      }
      return points;
    },
    color: 0xd946ef,
  },
  star: {
    numPoints: 4000,
    shapeFn: (count: number, scale: number) => {
      const points = new Float32Array(count * 3);
      const radius = scale / 2;
      
      for (let i = 0; i < count; i++) {
        const phi = Math.acos(1 - 2 * Math.random());
        const theta = Math.random() * Math.PI * 2;
        const r = radius * (0.2 + 0.8 * Math.pow(Math.random(), 3));
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        
        // Add star points
        const spikes = 5;
        const spikeIntensity = 0.4;
        const spikeFactor = 1 + spikeIntensity * Math.abs(Math.sin(spikes * phi));
        
        points[i * 3] = x * spikeFactor;
        points[i * 3 + 1] = y * spikeFactor;
        points[i * 3 + 2] = z * spikeFactor;
      }
      return points;
    },
    color: 0xf59e0b,
  }
};

type ShapeType = keyof typeof SHAPE_CONFIGS;

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

const ParticleCanvas = ({ currentShape }: { currentShape: ShapeType }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mousePositionRef = useRef<THREE.Vector3>(new THREE.Vector3(1000, 1000, 0));
  const frameIdRef = useRef<number | null>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  const targetPositionsRef = useRef<Float32Array | null>(null);
  const transitionProgressRef = useRef(1);
  const transitionDurationRef = useRef(100); // Frames for transition
  const previousShapeRef = useRef<ShapeType>(currentShape);

  // Memoize the texture creation
  const circleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.arc(32, 32, 30, 0, 2 * Math.PI);
      ctx.fillStyle = 'white';
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * 2 - 1;
    const y = -(event.clientY - rect.top) / rect.height * 2 + 1;
    mousePositionRef.current.set(x * 3, y * 3, 0);
  }, []);

  const handleMouseLeave = useCallback(() => {
    mousePositionRef.current.set(1000, 1000, 0);
  }, []);

  // Initialize Three.js scene
  const initScene = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 1000);
    camera.position.z = 4;
    cameraRef.current = camera;

    return { renderer, scene, camera };
  }, []);

  // Create particles with morphing capability
  const createParticles = useCallback((shape: ShapeType, isInitial = false) => {
    if (!sceneRef.current) return;

    const config = SHAPE_CONFIGS[shape] || SHAPE_CONFIGS.briefcase;
    const points = config.shapeFn(config.numPoints, 4);
    
    // Initialize velocities for the new shape
    const velocities = new Float32Array(config.numPoints * 3);
    for (let i = 0; i < config.numPoints * 3; i++) {
      velocities[i] = (Math.random() - 0.5) * 0.003;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
    
    // Store target positions for morphing
    targetPositionsRef.current = points;
    
    const material = new THREE.PointsMaterial({
      color: config.color,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      map: circleTexture
    });

    // Remove old particles if they exist
    if (particlesRef.current) {
      sceneRef.current.remove(particlesRef.current);
      particlesRef.current.geometry.dispose();
    }

    const particles = new THREE.Points(geometry, material);
    sceneRef.current.add(particles);
    particlesRef.current = particles;
    
    // Set velocities for new particles
    velocitiesRef.current = velocities;
    
    // If not initial creation, start transition
    if (!isInitial) {
      transitionProgressRef.current = 0;
    }
    
    previousShapeRef.current = shape;
  }, [circleTexture]);

  // Main useEffect for Three.js setup and animation loop
  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize scene if not already done
    if (!sceneRef.current) {
      initScene();
    }
    
    // Create initial particles
    createParticles(currentShape, true);

    // Animation loop
    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !particlesRef.current) return;

      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const mouse = mousePositionRef.current;
      const numPoints = positions.length / 3;
      
      // Handle shape transition
      if (transitionProgressRef.current < 1) {
        transitionProgressRef.current += 1 / transitionDurationRef.current;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const progress = Math.min(transitionProgressRef.current, 1);
        
        if (targetPositionsRef.current) {
          for (let i = 0; i < numPoints; i++) {
            const i3 = i * 3;
            
            // Morph towards target position
            positions[i3] += (targetPositionsRef.current[i3] - positions[i3]) * 0.1;
            positions[i3 + 1] += (targetPositionsRef.current[i3 + 1] - positions[i3 + 1]) * 0.1;
            positions[i3 + 2] += (targetPositionsRef.current[i3 + 2] - positions[i3 + 2]) * 0.1;
          }
        }
      }
      
      // Apply physics and mouse interaction
      if (velocitiesRef.current) {
        for (let i = 0; i < numPoints; i++) {
          const i3 = i * 3;

          positions[i3] += velocitiesRef.current[i3];
          positions[i3 + 1] += velocitiesRef.current[i3 + 1];
          positions[i3 + 2] += velocitiesRef.current[i3 + 2];

          const dx = positions[i3] - mouse.x;
          const dy = positions[i3 + 1] - mouse.y;
          const dz = positions[i3 + 2] - mouse.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const repelRadius = 2.0;
          const repelForce = 0.008;

          if (distance < repelRadius) {
            const repelAmount = (1 - distance / repelRadius) * repelForce;
            positions[i3] += dx * repelAmount;
            positions[i3 + 1] += dy * repelAmount;
            positions[i3 + 2] += dz * repelAmount;
          }

          const bound = 3;
          if (positions[i3] > bound) positions[i3] = -bound;
          if (positions[i3] < -bound) positions[i3] = bound;
          if (positions[i3 + 1] > bound) positions[i3 + 1] = -bound;
          if (positions[i3 + 1] < -bound) positions[i3 + 1] = bound;
          if (positions[i3 + 2] > bound) positions[i3 + 2] = -bound;
          if (positions[i3 + 2] < -bound) positions[i3 + 2] = bound;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      frameIdRef.current = requestAnimationFrame(animate);
    };

    frameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
    };
  }, [initScene, createParticles, currentShape]); // Added currentShape to dependencies

  // Handle shape changes
  useEffect(() => {
    if (currentShape !== previousShapeRef.current) {
      createParticles(currentShape);
    }
  }, [currentShape, createParticles]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="cursor-pointer transition-all duration-300"
          style={{
            filter: `drop-shadow(0 0 15px rgba(59, 130, 246, 0.2))`,
          }}
        />
      </div>
    </div>
  );
};

// --------------------------------------------------------------------------
// Experience Component - Optimized with unique skill shapes
// --------------------------------------------------------------------------

type EducationContent = {
  subTitle: string;
  institution: string;
  location: string;
  duration: string;
  details: string;
};

type WorkExperienceContent = {
  subTitle: string;
  company: string;
  location: string;
  duration: string;
  achievements: string[];
};

type SkillsContent = {
  subTitle: string;
  list: string[];
};

type CertificationsAwardsContent = {
  subTitle: string;
  list: string[];
};

type SectionContent = EducationContent | WorkExperienceContent | SkillsContent | CertificationsAwardsContent;

type SectionData = {
  id: string;
  title: string;
  icon: JSX.Element;
  content: SectionContent[];
  gradient: string;
  shape: ShapeType;
};

const sectionsData: SectionData[] = [
  {
    id: 'internships',
    title: 'Internships',
    icon: <Briefcase className="w-6 h-6" />,
    gradient: 'from-blue-500 to-cyan-500',
    shape: 'briefcase',
    content: [
      {
        subTitle: 'Software Design Intern',
        company: 'Jaidev Hydraulics',
        location: 'N/A',
        duration: 'October 2024 - March 2025',
        achievements: [
          'Built an Inventory Management System for purchase, sales, and reporting.',
          'Collaborated with operations for process optimization and inventory control.',
          'Designed and implemented an integrated Inventory Management System covering purchase, sales, and reporting.',
          'Utilized internal project frameworks to automate order processing and integrate real-time stock updates',
        ],
      },
      {
        subTitle: 'AI/ML Intern',
        company: 'Iris',
        location: 'N/A',
        duration: 'November 2023 - December 2023',
        achievements: [
          'Built a deep learning model using TensorFlow and OpenCV to detect rust in industrial components.',
          'Applied CNN for image classification with data augmentation and noise reduction techniques.',
          'Prepared training datasets, validated model performance, and conducted inference optimization.',
          'Skills used - Python, Image Processing, Analysis, Pandas, Tensorflow, CNN',
        ],
      },
    ],
  },
  {
    id: 'education',
    title: 'Education',
    icon: <GraduationCap className="w-6 h-6" />,
    gradient: 'from-green-500 to-emerald-500',
    shape: 'hat',
    content: [
      {
        subTitle: 'Bachelor of Engineering (BE) in Artificial Intelligence and Machine Learning',
        institution: 'Srinivas Institute Of Technology, Visvesvaraya Technological University',
        location: 'Karnataka, India',
        duration: 'January 2022 - May 2025',
        details: 'CGPA: 8.33',
      },
      {
        subTitle: 'Pre-University',
        institution: 'St Aloysius PU College',
        location: 'Mangaluru, India',
        duration: 'March 2020 - July 2021',
        details: 'Percentage: 85%',
      },
    ],
  },
  {
    id: 'skills',
    title: 'Skills',
    icon: <Code className="w-6 h-6" />,
    gradient: 'from-purple-500 to-pink-500',
    shape: 'cube',
    content: [
      {
        subTitle: 'Technical',
        list: ['Python', 'SQL', 'Spark', 'Hive', 'SAS', 'Git', 'GitHub', 'Excel', 'Power BI', 'Django', 'PostgreSQL', 'REST APIs', 'Celery', 'Pandas', 'Trello'],
      },
      {
        subTitle: 'ML & Data Science',
        list: ['TensorFlow', 'Scikit-learn', 'PyTorch', 'OpenCV', 'CNN', 'Supervised/Unsupervised Learning', 'Feature Engineering'],
      },
      {
        subTitle: 'Big Data',
        list: ['Data Engineering', 'ETL', 'SQL Warehousing', 'Data Visualization'],
      },
      {
        subTitle: 'Soft Skills',
        list: ['Analytical Thinking', 'Problem Solving', 'Teamwork', 'Communication', 'Leadership', 'Ownership'],
      },
    ],
  },
  {
    id: 'certifications',
    title: 'Certifications & Awards',
    icon: <Award className="w-6 h-6" />,
    gradient: 'from-orange-500 to-red-500',
    shape: 'torus',
    content: [
      {
        subTitle: 'Certifications',
        list: ['Accenture Nordics - Software Engineering Job Simulation', 'Accenture North America - Project Management Job Simulation', 'GIT Training', 'PwC Switzerland - Power BI Job Simulation', 'Credily'],
      },
      {
        subTitle: 'Awards/Activities',
        list: ['1st Place, Strategic IT Manager Competition', '1st Place, ASPIRE Case-Study Competition', '1st Place, Fashion Walk', 'Participant, Model United Nations', 'Certificate of Leadership, Student Council Member', 'Certificate of Leadership Skills, Council President', 'IEEE Chair.'],
      },
    ],
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Mapping of skills to unique shapes
const skillShapeMap: Record<string, ShapeType> = {
  // Technical skills
  'Python': 'pyramid',
  'SQL': 'cylinder',
  'Spark': 'star',
  'Hive': 'torus',
  'SAS': 'cube',
  'Git': 'sphere',
  'GitHub': 'briefcase',
  'Excel': 'pyramid',
  'Power BI': 'cylinder',
  'Django': 'star',
  'PostgreSQL': 'torus',
  'REST APIs': 'cube',
  'Celery': 'sphere',
  'Pandas': 'pyramid',
  'Trello': 'cylinder',
  
  // ML & Data Science
  'TensorFlow': 'star',
  'Scikit-learn': 'torus',
  'PyTorch': 'cube',
  'OpenCV': 'sphere',
  'CNN': 'pyramid',
  'Supervised/Unsupervised Learning': 'cylinder',
  'Feature Engineering': 'star',
  
  // Big Data
  'Data Engineering': 'torus',
  'ETL': 'cube',
  'SQL Warehousing': 'sphere',
  'Data Visualization': 'pyramid',
  
  // Soft Skills
  'Analytical Thinking': 'cylinder',
  'Problem Solving': 'star',
  'Teamwork': 'torus',
  'Communication': 'cube',
  'Leadership': 'sphere',
  'Ownership': 'pyramid'
};

const Experience = () => {
  const [activeSection, setActiveSection] = useState<string>('internships');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [hoveredSkillShape, setHoveredSkillShape] = useState<ShapeType | null>(null);

  const currentShape = useMemo(() => {
    if (hoveredSkillShape) return hoveredSkillShape;
    const section = sectionsData.find(sec => sec.id === activeSection);
    return section ? section.shape : 'briefcase';
  }, [activeSection, hoveredSkillShape]);

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

  const renderContent = (content: SectionContent[]) => {
    return (
      <div className="space-y-6">
        {content.map((item, itemIndex) => (
          <motion.div
            key={itemIndex}
            className="group relative p-6 rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: itemIndex * 0.1 + 0.3 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <h4 className="text-xl font-bold text-white flex items-center gap-3 mb-2">
                <motion.div 
                  className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {'subTitle' in item && item.subTitle}
              </h4>
              
              {'company' in item && (
                <p className="text-base font-semibold text-blue-400 mb-2">
                  {item.company}
                </p>
              )}

              <div className="mt-3 text-gray-300 space-y-2">
                {'institution' in item && (
                  <p className="text-sm text-gray-400">
                    <span className="font-medium text-white">{item.institution}</span> • {item.location}
                  </p>
                )}
                {'duration' in item && (
                  <p className="text-sm text-gray-500 italic">
                    {item.duration}
                  </p>
                )}
                {'details' in item && (
                  <p className="text-sm text-gray-300 font-medium">{item.details}</p>
                )}
                {'achievements' in item && (
                  <ul className="list-none mt-3 space-y-2">
                    {item.achievements.map((achievement: string, achievementIndex: number) => (
                      <motion.li
                        key={achievementIndex}
                        className="flex items-start gap-3 text-sm text-gray-300 leading-relaxed"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: achievementIndex * 0.05 + 0.5 }}
                      >
                        <motion.div 
                          className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 mt-2 flex-shrink-0"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 3, repeat: Infinity, delay: achievementIndex * 0.2 }}
                        />
                        <span>{achievement}</span>
                      </motion.li>
                    ))}
                  </ul>
                )}
                {'list' in item && (
                  <div className="mt-4">
                    <h5 className="text-sm font-semibold text-blue-400 mb-3">{item.subTitle}</h5>
                    <div className="flex flex-wrap gap-2">
                      {item.list.map((skill: string, skillIndex: number) => (
                        <motion.span
                          key={skillIndex}
                          className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 text-gray-200 text-xs px-3 py-1.5 rounded-full cursor-pointer border border-gray-600/30 hover:border-blue-400/50 hover:bg-blue-400/10 transition-all duration-300"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: skillIndex * 0.03 + 0.6, type: "spring" }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          onMouseEnter={() => setHoveredSkillShape(skillShapeMap[skill] || 'sphere')}
                          onMouseLeave={() => setHoveredSkillShape(null)}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <section 
      ref={containerRef}
      id="experience" 
      className="relative overflow-hidden bg-gray-950 text-white py-20 px-4 md:px-8 lg:px-16 min-h-screen flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ 
            background: `radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)`,
          }}
          animate={{ 
            x: mousePosition.x * 40,
            y: mousePosition.y * 40,
            scale: isHovered ? 1.2 : 1
          }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ 
            background: `radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)`,
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
            background: `radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)`,
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
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
            backgroundSize: "60px 60px",
          }}
        />
      </motion.div>

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full opacity-30"
          style={{ 
            background: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#9333ea' : '#10b981',
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
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <motion.h2 
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            My{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 bg-clip-text text-transparent relative">
              Experience
              <motion.div
                className="absolute -inset-2 rounded-lg opacity-30 blur-xl bg-gradient-to-r from-blue-400 to-purple-600"
                animate={{ 
                  scale: isHovered ? [1, 1.05, 1] : 1,
                  opacity: isHovered ? [0.3, 0.5, 0.3] : 0.3
                }}
                transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
              />
            </span>
          </motion.h2>
          <motion.div 
            className="h-1 w-32 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Sidebar - Navigation */}
          <motion.div
            className="lg:col-span-4 space-y-4"
            variants={containerVariants}
          >
            <div className="sticky top-24">
              <div className="space-y-3">
                {sectionsData.map((section) => (
                  <motion.button
                    key={section.id}
                    className={`group w-full text-left p-4 rounded-xl transition-all duration-500 cursor-pointer border border-gray-700/50 backdrop-blur-sm relative overflow-hidden ${
                      activeSection === section.id 
                        ? 'bg-gradient-to-br from-gray-800/80 to-gray-700/80 text-white shadow-lg' 
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white hover:border-gray-600/50'
                    }`}
                    onClick={() => setActiveSection(section.id)}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Active indicator */}
                    <motion.div
                      className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${section.gradient}`}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: activeSection === section.id ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Background glow for active */}
                    {activeSection === section.id && (
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-5`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.05 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    
                    <div className="flex items-center gap-4 relative z-10">
                      <motion.div 
                        className={`p-2 rounded-lg ${
                          activeSection === section.id 
                            ? `bg-gradient-to-r ${section.gradient} text-white` 
                            : 'bg-gray-700/50 text-gray-400 group-hover:text-white'
                        }`}
                        whileHover={{ rotate: 5 }}
                      >
                        {section.icon}
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-semibold">{section.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {section.content.length} {section.content.length === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Hover effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                  </motion.button>
                ))}
              </div>

              {/* Particle Canvas */}
              <motion.div 
                className="mt-8 flex justify-center"
                variants={itemVariants}
              >
                <ParticleCanvas currentShape={currentShape} />
              </motion.div>
            </div>
          </motion.div>

          {/* Right Content Panel */}
          <motion.div
            className="lg:col-span-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {activeSection && (
                <motion.div
                  key={activeSection}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="w-full h-full"
                >
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div 
                        className={`p-3 rounded-xl bg-gradient-to-r ${
                          sectionsData.find(sec => sec.id === activeSection)?.gradient || 'from-blue-500 to-purple-500'
                        } text-white`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {sectionsData.find(sec => sec.id === activeSection)?.icon}
                      </motion.div>
                      <h2 className="text-3xl font-bold text-white">
                        {sectionsData.find(sec => sec.id === activeSection)?.title}
                      </h2>
                    </div>
                    <motion.div 
                      className={`h-1 w-24 bg-gradient-to-r ${
                        sectionsData.find(sec => sec.id === activeSection)?.gradient || 'from-blue-500 to-purple-500'
                      } rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: 96 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                  {renderContent(sectionsData.find(sec => sec.id === activeSection)?.content || [])}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom decorative element */}
        <motion.div 
          className="mt-16 flex justify-center"
          variants={itemVariants}
        >
          <div className="flex items-center gap-2">
            <motion.div 
              className="h-1 w-8 bg-gradient-to-r from-transparent to-blue-400 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            />
            <motion.div 
              className="h-2 w-2 bg-blue-400 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div 
              className="h-1 w-16 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 1.7 }}
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
              transition={{ duration: 1, delay: 1.9 }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Experience;