// src/components/Navbar.tsx
import { useState, useEffect, type JSX } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useTheme } from '../ThemeProvider';
import {
  DownloadIcon,
  GitHubIcon,
  LinkedInIcon,
  EmailIcon,
  SunIcon,
  MoonIcon,
  MenuIcon,
  CloseIcon,
} from '../Icons';

interface SocialLink {
  platform: string;
  icon: () => JSX.Element;
  href: string;
}

const socialLinks: SocialLink[] = [
  { platform: "github", icon: GitHubIcon, href: "https://github.com/Vishal-bhandary" },
  { platform: "linkedin", icon: LinkedInIcon, href: "https://www.linkedin.com/in/vishal-aryav-bhandary/" },
  { platform: "email", icon: EmailIcon, href: "mailto:vishalswasthi@gmail.com" },
];

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navbarVariants: Variants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const menuVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  const staggerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const linkVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const ResumeButton = () => (
    <motion.a
      href="/Vishal Aryav Bhandary.pdf"
      download
      className="group hidden md:flex items-center gap-2 px-4 py-2 text-sm rounded-full font-semibold transition-all duration-300 relative overflow-hidden text-gray-800 dark:text-white dark:bg-gray-800 border-2 dark:border-gray-700 hover:dark:border-white/50"
      initial={{ scale: 1 }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      }}
      whileTap={{ scale: 0.95 }}
    >
      <DownloadIcon />
      <span className="relative z-10">Resume</span>
    </motion.a>
  );

  return (
    <>
      <AnimatePresence>
        {isScrolled && (
          <motion.nav
            className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/60 dark:bg-black/80 shadow-lg py-4 px-6 md:px-12 lg:px-24"
            variants={navbarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="flex justify-between items-center max-w-7xl mx-auto">
              {/* Logo/Brand */}
              <motion.a
                href="#"
                className="text-lg md:text-xl font-bold tracking-wider relative group"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-white dark:text-gray-100">Vishal</span>
                <span className="text-gray-400 dark:text-gray-500 group-hover:dark:text-white transition-colors duration-300">.dev</span>
                <motion.div
                  className="absolute -bottom-1 left-0 w-full h-[2px] bg-white dark:bg-gray-300"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isScrolled ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>

              {/* Desktop Links */}
              <motion.div
                className="hidden lg:flex items-center space-x-8"
                variants={staggerVariants}
                initial="hidden"
                animate="visible"
              >
                {navLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    className="relative text-white dark:text-gray-300 hover:dark:text-white transition-colors duration-300 text-sm font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-white after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
                    variants={linkVariants}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </motion.div>

              {/* Actions - Resume & Theme Toggle */}
              <div className="flex items-center gap-4">
                <ResumeButton />
                <motion.button
                  onClick={toggleTheme}
                  className="p-2 rounded-full border border-gray-700 text-white hover:text-gray-800 hover:bg-white dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 transition-colors duration-300"
                  whileHover={{ rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Toggle theme"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={theme}
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-white"
                  aria-label="Open mobile menu"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isMobileMenuOpen ? "close" : "menu"}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 lg:hidden"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <motion.ul
              className="space-y-6 text-2xl font-bold"
              variants={staggerVariants}
              initial="hidden"
              animate="visible"
            >
              {navLinks.map((link) => (
                <motion.li key={link.name} variants={linkVariants}>
                  <a href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="block text-white hover:text-gray-400 transition-colors duration-200">
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              className="flex flex-col items-center space-y-4 pt-8"
              variants={staggerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.a
                href="/Vishal Aryav Bhandary.pdf"
                download
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 border-2 border-white text-white hover:bg-white hover:text-black"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <DownloadIcon />
                Download Resume
              </motion.a>

              <div className="flex gap-4">
                {socialLinks.map(({ platform, icon: IconComponent, href }) => (
                  <motion.a
                    key={platform}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}