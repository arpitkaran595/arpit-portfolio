import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Lenis from 'lenis';

import { ArchiveProvider } from './context/ArchiveContext';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import CaseStudyPage from './pages/CaseStudyPage';

function App() {
  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
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
