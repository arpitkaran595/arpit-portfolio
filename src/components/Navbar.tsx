import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  isLoaded: boolean;
  navRef?: React.RefObject<HTMLElement>;
}

export default function Navbar({ isLoaded, navRef }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const sections = ['home', 'work', 'about', 'experience', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      return;
    }

    const target = document.getElementById(sectionId);
    if (target) {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(target, { offset: -75, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { name: 'HOME', id: 'home' },
    { name: 'WORK', id: 'work' },
    { name: 'ABOUT', id: 'about' },
    { name: 'EXPERTISE', id: 'experience' },
    { name: 'CONTACT', id: 'contact' },
  ];

  return (
    <>
      <nav 
        ref={navRef as React.RefObject<HTMLElement>}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-cream-100/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
        }`}
        style={!isLoaded ? { opacity: 0 } : undefined}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <div 
            className="cursor-pointer flex items-center"
            onClick={() => scrollToSection('home')}
          >
            <span className="font-sora font-semibold tracking-[0.2em] text-charcoal-800 text-lg">ARPIT</span>
            <span className="font-sora font-semibold tracking-[0.2em] text-gold-400 text-lg ml-2">AK</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="relative font-sora text-[0.75rem] font-medium tracking-[0.15em] uppercase text-charcoal-800 hover:text-gold-400 transition-colors"
              >
                {link.name}
                {activeSection === link.id && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-400" />
                )}
              </button>
            ))}
          </div>

          {/* Let's Talk Button */}
          <div className="hidden md:block">
            <button 
              onClick={() => scrollToSection('contact')}
              className="group border border-charcoal-800 rounded-full px-6 py-2.5 text-[0.75rem] tracking-[0.1em] font-medium text-charcoal-800 hover:bg-charcoal-800 hover:text-cream-50 transition-colors flex items-center gap-2"
            >
              LET'S TALK
              <span className="text-lg leading-none group-hover:rotate-45 transition-transform duration-300">↗</span>
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button 
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 z-[60]"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="block w-6 h-0.5 bg-charcoal-800"></span>
            <span className="block w-6 h-0.5 bg-charcoal-800"></span>
            <span className="block w-6 h-0.5 bg-charcoal-800"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-cream-100 flex flex-col justify-center items-center">
          <button 
            className="absolute top-6 right-6 text-charcoal-800 p-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div className="flex flex-col space-y-8 text-center">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="font-playfair text-4xl text-charcoal-800 hover:text-gold-400 transition-colors"
              >
                {link.name}
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('contact')}
              className="mt-8 border border-charcoal-800 rounded-full px-8 py-3 text-sm tracking-[0.1em] font-medium text-charcoal-800 hover:bg-charcoal-800 hover:text-cream-50 transition-colors"
            >
              LET'S TALK ↗
            </button>
          </div>
        </div>
      )}
    </>
  );
}
