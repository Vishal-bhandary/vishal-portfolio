import { useState, useEffect, useRef, type JSX } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { motion, useScroll, useTransform, useSpring, AnimatePresence, type Variants } from 'framer-motion';

// Mock profile image - you can replace this with your actual image
import profilePic from "../assets/profile.jpeg"; // Add your profile picture in src/assets

function extractColorsFromImage(imageSrc: string, callback: (color: string) => void): void {
  const img = new Image();
  img.crossOrigin = "anonymous";

  img.onerror = function () {
    callback("239, 68, 68"); // Red fallback
  };

  img.onload = function () {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        callback("239, 68, 68");
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const colorMap: Record<string, number> = {};
      for (let i = 0; i < data.length; i += 16) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];

        if (alpha > 200) {
          const color = `${Math.floor(r / 32) * 32},${Math.floor(g / 32) * 32},${Math.floor(b / 32) * 32}`;
          colorMap[color] = (colorMap[color] || 0) + 1;
        }
      }

      const sortedColors = Object.entries(colorMap)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([color]) => color);

      let accentColor = "239, 68, 68";
      for (const colorStr of sortedColors) {
        const [r, g, b] = colorStr.split(",").map(Number);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        const saturation = Math.max(r, g, b) - Math.min(r, g, b);

        if (brightness > 80 && brightness < 200 && saturation > 50) {
          accentColor = colorStr;
          break;
        }
      }

      callback(accentColor);
    } catch {
      callback("239, 68, 68");
    }
  };

  img.src = imageSrc;
}

const GitHubIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
  </svg>
);

interface MousePosition {
  x: number;
  y: number;
}

interface SocialLink {
  platform: string;
  icon: () => JSX.Element;
  href: string;
}

export default function InteractiveHero() {
  const [accentColor, setAccentColor] = useState("239, 68, 68");
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const containerRef = useRef<HTMLElement>(null);

  const rotatingTexts = [
    "Innovation Creator",
    "Full Stack Developer",
    "Software Developer",
    "AI/ML Engineer"
  ];

  useEffect(() => {
    extractColorsFromImage(profilePic, (color: string) => {
      setAccentColor(color);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [rotatingTexts.length]);

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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.6, -0.05, 0.01, 0.99],
        type: "spring" as const,
        stiffness: 100
      },
    },
  };

  const socialLinks: SocialLink[] = [
    { platform: "github", icon: GitHubIcon, href: "https://github.com/Vishal-bhandary" },
    { platform: "linkedin", icon: LinkedInIcon, href: "https://www.linkedin.com/in/vishal-aryav-bhandary/" },
    { platform: "email", icon: EmailIcon, href: "mailto:vishalswasthi@gmail.com" },
  ];

  return (
    <section 
      ref={containerRef}
      className="relative overflow-hidden bg-gray-950 text-white py-16 lg:py-24" // Adjusted height and padding
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ 
            background: `radial-gradient(circle, rgba(${accentColor}, 0.4) 0%, transparent 70%)`,
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
            background: `radial-gradient(circle, rgba(${accentColor}, 0.3) 0%, transparent 70%)`,
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
            background: `radial-gradient(circle, rgba(${accentColor}, 0.2) 0%, transparent 70%)`,
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
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(${accentColor}, 0.3) 1px, transparent 0)`,
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
            background: `rgb(${accentColor})`,
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`
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

      <div className="relative z-10 w-full px-6 lg:px-12 min-h-[90vh] grid grid-cols-1 lg:grid-cols-2 place-items-center gap-16"> {/* Adjusted min-h-screen to min-h-[90vh] */}
        {/* Left Content */}
        <motion.div
          className="flex-1 max-w-3xl text-center lg:text-left pt-20 lg:pt-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Name */}
          <motion.div variants={itemVariants} className="mb-6">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                Vishal Aryav
              </motion.span>
              <br />
              <motion.span
                className="bg-gradient-to-r bg-clip-text text-transparent relative"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgb(${accentColor}), rgb(${accentColor
                    .split(",")
                    .map((c, i) => (i === 0 ? Math.min(255, parseInt(c.trim()) + 60) : c))
                    .join(",")}))`,
                }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
              >
                Bhandary
                <motion.div
                  className="absolute -inset-2 rounded-lg opacity-30 blur-xl"
                  style={{ background: `rgb(${accentColor})` }}
                  animate={{ 
                    scale: isHovered ? [1, 1.05, 1] : 1,
                    opacity: isHovered ? [0.3, 0.5, 0.3] : 0.3
                  }}
                  transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
                />
              </motion.span>
            </h1>
          </motion.div>

          {/* Rotating Job Title */}
          <motion.div variants={itemVariants} className="mb-8 h-10 flex items-center justify-center lg:justify-start">
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentTextIndex}
                className="text-xl md:text-2xl font-light"
                style={{ color: `rgba(${accentColor}, 0.9)` }}
                initial={{ opacity: 0, y: 20, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -20, rotateX: 90 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {rotatingTexts[currentTextIndex]}
              </motion.h2>
            </AnimatePresence>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light"
          >
            Passionate about creating{" "}
            <span 
              className="font-semibold"
              style={{ color: `rgb(${accentColor})` }}
            >
              innovative solutions
            </span>{" "}
            that blend cutting-edge technology with exceptional user experiences. 
            Let's build something extraordinary together.
          </motion.p>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 mb-12 justify-center lg:justify-start">
            <motion.a
              href="/Vishal Aryav Bhandary.pdf"
              download
              className="group px-8 py-4 rounded-xl font-semibold transition-all duration-500 shadow-2xl border-2 border-transparent relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, rgb(${accentColor}), rgb(${accentColor
                  .split(",")
                  .map((c, i) => (i === 0 ? Math.min(255, parseInt(c.trim()) + 40) : c))
                  .join(",")}))`,
                color: "white",
              }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: `0 20px 40px rgba(${accentColor}, 0.4)`,
                y: -2
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <DownloadIcon />
                Download Resume
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </motion.a>

            <motion.a
              href="#contact"
              className="px-8 py-4 rounded-xl font-semibold transition-all duration-500 border-2 backdrop-blur-sm relative overflow-hidden group"
              style={{
                borderColor: `rgb(${accentColor})`,
                color: `rgb(${accentColor})`,
                background: `rgba(${accentColor}, 0.05)`
              }}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: `rgba(${accentColor}, 0.1)`,
                y: -2
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Let's Collaborate</span>
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-20"
                style={{ background: `rgb(${accentColor})` }}
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="flex gap-4 justify-center lg:justify-start">
            {socialLinks.map(({ platform, icon: IconComponent, href }) => (
              <motion.a
                key={platform}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-12 h-12 rounded-lg border-2 border-gray-600 flex items-center justify-center text-gray-400 transition-all duration-500 backdrop-blur-sm relative overflow-hidden"
                whileHover={{
                  borderColor: `rgb(${accentColor})`,
                  backgroundColor: `rgba(${accentColor}, 0.1)`,
                  scale: 1.1,
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="text-gray-400 group-hover:text-white z-10 relative"
                  whileHover={{ scale: 1.1 }}
                >
                  <IconComponent />
                </motion.div>
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{ background: `linear-gradient(135deg, rgba(${accentColor}, 0.8), rgba(${accentColor}, 0.4))` }}
                  initial={{ scale: 0, rotate: 180 }}
                  whileHover={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Right - Profile Image */}
        <motion.div
          className="relative max-w-lg lg:justify-self-end mt-16 lg:mt-0"
          initial={{ opacity: 0, scale: 0.8, x: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.3, type: "spring", stiffness: 100 }}
        >
          {/* Rotating Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-[20rem] h-[20rem] md:w-[24rem] md:h-[24rem] rounded-full border border-dashed opacity-20"
              style={{ borderColor: `rgb(${accentColor})` }}
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute w-[18rem] h-[18rem] md:w-[22rem] md:h-[22rem] rounded-full border opacity-10"
              style={{ borderColor: `rgb(${accentColor})` }}
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute w-[16rem] h-[16rem] md:w-[20rem] md:h-[20rem] rounded-full border-2 opacity-30"
              style={{ borderColor: `rgb(${accentColor})` }}
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Profile Image Container */}
          <motion.div
            className="relative z-10 w-[18rem] h-[18rem] md:w-[20rem] md:h-[20rem] lg:w-[24rem] lg:h-[24rem]"
            animate={{ 
              y: [-15, 15, -15],
              rotateY: isHovered ? 5 : 0,
              scale: isHovered ? 1.05 : 1
            }}
            transition={{
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              rotateY: { duration: 0.5 },
              scale: { duration: 0.3 }
            }}
          >
            <div
              className="w-full h-full rounded-3xl p-3 shadow-2xl backdrop-blur-sm border-2 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, rgba(${accentColor}, 0.9), rgba(${accentColor}, 0.6))`,
                borderColor: `rgba(${accentColor}, 0.3)`,
                boxShadow: `0 25px 50px rgba(${accentColor}, 0.3)`
              }}
            >
              <motion.img
                src={profilePic}
                alt="Vishal Aryav Bhandary"
                className="w-full h-full rounded-2xl object-cover border-2 border-white/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Overlay Gradient */}
              <motion.div
                className="absolute inset-3 rounded-2xl"
                style={{
                  background: `linear-gradient(45deg, rgba(${accentColor}, 0.1), transparent, rgba(${accentColor}, 0.1))`
                }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl blur-2xl opacity-40 -z-10"
              style={{ background: `rgb(${accentColor})` }}
              animate={{ 
                scale: isHovered ? [1, 1.1, 1] : 1,
                opacity: isHovered ? [0.4, 0.6, 0.4] : 0.4
              }}
              transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
            />
          </motion.div>

          {/* Floating Elements */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{ 
                background: `rgb(${accentColor})`,
                left: `${20 + i * 20}%`,
                top: `${10 + i * 20}%`
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <motion.div
          className="flex flex-col items-center cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-gray-400 text-sm mb-2">Scroll to explore</span>
          <div 
            className="w-6 h-10 border-2 rounded-full flex justify-center"
            style={{ borderColor: `rgba(${accentColor}, 0.5)` }}
          >
            <motion.div
              className="w-1 h-3 rounded-full mt-2"
              style={{ background: `rgb(${accentColor})` }}
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}