import { useState, useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { Mail, Phone, MapPin, Copy, Check } from 'lucide-react';

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

const inputVariants: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 10, delay: 0.3 } }
};

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = (text: string) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      text: 'vishalswasthi@gmail.com',
      onClick: () => handleCopy('vishalswasthi@gmail.com'),
      ariaLabel: 'Copy email address',
    },
    {
      icon: Phone,
      text: '+91-8310790047',
      onClick: () => handleCopy('+91-8310790047'),
      ariaLabel: 'Copy phone number',
    },
    {
      icon: MapPin,
      text: 'Mangaluru, Karnataka, India',
      onClick: () => {},
      ariaLabel: 'Location',
    },
  ];

  return (
    <section id="contact" className="min-h-screen flex items-center justify-center pt-24 pb-12 bg-gray-950 text-white overflow-hidden">
      <motion.div
        ref={ref}
        className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } }
        }}
      >
        {/* Title and wavy lines */}
        <motion.div
          className="flex flex-col items-center mb-12 sm:mb-16"
          variants={textVariants}
        >
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              className="h-1 w-8 bg-gradient-to-r from-transparent to-blue-400 rounded-full"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <motion.div
              className="h-2 w-2 bg-blue-400 rounded-full"
              animate={isInView ? { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="h-1 w-16 bg-gradient-to-r from-blue-400 via-cyan-500 to-sky-500 rounded-full"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.5, delay: 0.7 }}
            />
            <motion.div
              className="h-2 w-2 bg-cyan-500 rounded-full"
              animate={isInView ? { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
              className="h-1 w-8 bg-gradient-to-r from-sky-500 to-transparent rounded-full"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
            />
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-500 text-center">
            Get in Touch
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-gray-400 text-center">
            I'm always open to new opportunities and collaborations. Feel free to reach out to me!
          </p>
        </motion.div>

        {/* Contact form and info container */}
        <div className="flex flex-col lg:flex-row gap-12 bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-xl shadow-gray-900/50">
          {/* Contact form */}
          <motion.div
            className="flex-1"
            variants={textVariants}
          >
            <h3 className="text-2xl font-semibold mb-6 text-gray-200">Send Me a Message</h3>
            <form className="space-y-6">
              <motion.div variants={inputVariants}>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors duration-300 text-gray-100"
                />
              </motion.div>
              <motion.div variants={inputVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors duration-300 text-gray-100"
                />
              </motion.div>
              <motion.div variants={inputVariants}>
                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors duration-300 text-gray-100"
                />
              </motion.div>
              <motion.div variants={inputVariants}>
                <a
                  href="mailto:vishalswasthi@gmail.com?subject=Portfolio Inquiry from [Your Name]&body=Hi Vishal,%0A%0AI saw your portfolio and wanted to get in touch. My name is [Your Name] and my message is...%0A%0A---%0A%0A(Please replace the bracketed text with your information and write your message above.)"
                  className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 bg-blue-600 rounded-full font-semibold text-white transition-all duration-300 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  <Mail size={20} />
                  Send Message
                </a>
              </motion.div>
            </form>
          </motion.div>

          {/* Contact info side panel */}
          <motion.div
            className="flex-1 lg:flex-none lg:w-96 p-8 bg-gray-900 rounded-2xl border border-gray-800"
            variants={textVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-gray-200">Contact Details</h3>
            <ul className="space-y-6">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={item.text}
                    className="flex items-center gap-4 group cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={item.onClick}
                  >
                    <div className="p-3 rounded-full bg-gray-800 text-blue-400 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110">
                      <Icon size={24} />
                    </div>
                    <div>
                      <span className="block text-gray-300 group-hover:text-white transition-colors duration-300">{item.text}</span>
                    </div>
                    {item.text !== 'Mangaluru, Karnataka, India' && (
                      <motion.div
                        className="ml-auto text-gray-400 group-hover:text-blue-400 transition-colors duration-300"
                        animate={copied ? { scale: 1.2 } : { scale: 1 }}
                      >
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                      </motion.div>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
