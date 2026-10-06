import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ArchiveProvider } from './context/ArchiveContext';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import CaseStudyPage from './pages/CaseStudyPage';

gsap.registerPlugin(ScrollTrigger);

function App() {
  // Initialize Lenis smooth scrolling synchronized with GSAP
  useEffect(() => {
    const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !isTouch,
      syncTouch: false,
    });

    (window as any).lenis = lenis;

    // Synchronize Lenis scroll updates directly with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis strictly through GSAP ticker for a single unified RAF cycle
    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      (window as any).lenis = undefined;
      lenis.destroy();
    };
  }, []);

  return (
    <HashRouter>
      <ArchiveProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work/:slug" element={<CaseStudyPage />} />
          <Route path="/work" element={<Navigate to="/#digital-work" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ArchiveProvider>
    </HashRouter>
  );
}

export default App;
