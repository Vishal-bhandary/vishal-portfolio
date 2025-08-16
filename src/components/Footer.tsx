import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

const socialLinks = [
  { platform: "github", icon: Github, href: "https://github.com/Vishal-bhandary" },
  { platform: "linkedin", icon: Linkedin, href: "https://www.linkedin.com/in/vishal-aryav-bhandary/" },
  { platform: "email", icon: Mail, href: "mailto:vishalswasthi@gmail.com" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-gray-950 text-gray-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
      <div className="container mx-auto flex flex-col items-center text-center">
        {/* Social Links */}
        <motion.div
          className="flex gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
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
              <IconComponent size={24} />
            </motion.a>
          ))}
        </motion.div>

        {/* Copyright and Credits */}
        <motion.div
          className="mt-6 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <p>
            &copy; {new Date().getFullYear()} Vishal Aryav Bhandary. All Rights Reserved.
          </p>
          <p className="mt-2">
            Designed and built with ❤️
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
