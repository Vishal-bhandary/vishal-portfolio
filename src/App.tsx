import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import TechStack from './components/TechStack';
import Contact from './components/Contact';
import Footer from './components/Footer';

// The main application component that renders all sections of the portfolio
export default function App() {
  return (
    <div className="bg-gray-950 text-gray-300 font-sans leading-relaxed">
      {/* The main navigation bar, which handles its own state */}
      <Navbar />

      <main id="app" className="relative">
        {/* The Hero section, the first section the user sees */}
        <section id="hero">
          <Hero />
        </section>

        {/* The About section with a brief summary */}
        <section id="about" className="pt-24 sm:pt-32">
          <About />
        </section>

        {/* The Experience section */}
        <section id="experience" className="pt-24 sm:pt-32">
          <Experience />
        </section>

        {/* The Projects section */}
        <section id="projects" className="pt-24 sm:pt-32">
          <Projects />
        </section>
        
        {/* The new Tech Stack section */}
        <section id="tech-stack" className="pt-24 sm:pt-32">
          <TechStack />
        </section>

        {/* The Contact section */}
        <section id="contact" className="pt-24 sm:pt-32">
          <Contact />
        </section>
      </main>

      {/* The footer with social links and copyright info */}
      <Footer />
    </div>
  );
}