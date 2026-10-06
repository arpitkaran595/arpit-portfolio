import React, { useState, useCallback, useRef, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SectionTransition from '../components/SectionTransition';
import About from '../components/About';
import DesignPhilosophy from '../components/DesignPhilosophy';
import SelectedCaseStudies from '../components/SelectedCaseStudies';
import VideoSection from '../components/VideoSection';
import StoriesSection from '../components/StoriesSection';
import CreativesSection from '../components/CreativesSection';
import ThumbnailsSection from '../components/ThumbnailsSection';
import DigitalWorkSection from '../components/DigitalWorkSection';
import Experience from '../components/Experience';
import PersonalBrandMoment from '../components/PersonalBrandMoment';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import WorkArchiveOverlay from '../components/WorkArchiveOverlay';

export default function HomePage() {
  const [isHeroReady, setIsHeroReady] = useState(() => {
    if (sessionStorage.getItem('came_from_case_study') === 'true') {
      return true;
    }

    const navEntries =
      typeof performance !== 'undefined' && performance.getEntriesByType
        ? performance.getEntriesByType('navigation')
        : [];
    const isReload =
      navEntries.length > 0 &&
      (navEntries[0] as PerformanceNavigationTiming).type === 'reload';
    if (isReload) {
      sessionStorage.removeItem('portfolio_intro_shown');
      return false;
    }

    return Boolean(sessionStorage.getItem('portfolio_intro_shown'));
  });

  const [showIntro, setShowIntro] = useState(() => {
    if (sessionStorage.getItem('came_from_case_study') === 'true') {
      return false;
    }

    const navEntries =
      typeof performance !== 'undefined' && performance.getEntriesByType
        ? performance.getEntriesByType('navigation')
        : [];
    const isReload =
      navEntries.length > 0 &&
      (navEntries[0] as PerformanceNavigationTiming).type === 'reload';
    if (isReload) {
      return true;
    }

    return !sessionStorage.getItem('portfolio_intro_shown');
  });
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.title = 'ARPIT AK — Creative Designer, Video Editor & Frontend Developer';
  }, []);

  // Persist homepage scroll position cleanly so returning from Case Studies restores exact view
  useEffect(() => {
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (sessionStorage.getItem('is_restoring_scroll') === 'true') {
          return;
        }
        if (window.scrollY > 0) {
          sessionStorage.setItem('home_scroll_pos', window.scrollY.toString());
        }
      }, 150);
    };

    // Before navigating away to a case study, capture the exact current scroll position
    const handleDocumentClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest('a');
      if (link && link.getAttribute('href')?.includes('/work/')) {
        if (window.scrollY > 0) {
          sessionStorage.setItem('home_scroll_pos', window.scrollY.toString());
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('click', handleDocumentClick, { capture: true });

    return () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      if (sessionStorage.getItem('is_restoring_scroll') !== 'true' && window.scrollY > 0) {
        sessionStorage.setItem('home_scroll_pos', window.scrollY.toString());
      }
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', handleDocumentClick, { capture: true });
    };
  }, []);

  const handleRevealStart = useCallback(() => {
    setIsHeroReady(true);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setIsHeroReady(true);
    setShowIntro(false);
    sessionStorage.setItem('portfolio_intro_shown', 'true');
  }, []);

  return (
    <>
      {showIntro && (
        <LoadingScreen
          onComplete={handleLoadingComplete}
          onRevealStart={handleRevealStart}
        />
      )}
      <Navbar isLoaded={isHeroReady} navRef={navRef} />

      <main className="relative w-full overflow-x-clip">
        <Hero isLoaded={isHeroReady} navRef={navRef} />
        <About />
        <DesignPhilosophy />
        <SelectedCaseStudies />
        <SectionTransition variant="about-to-videos" />

        <VideoSection />
        <SectionTransition variant="videos-to-stories" />

        <StoriesSection />
        <SectionTransition variant="stories-to-creatives" />

        <CreativesSection />
        <SectionTransition variant="creatives-to-thumbnails" />

        <ThumbnailsSection />
        <SectionTransition variant="thumbnails-to-digital" />

        <DigitalWorkSection />
        <SectionTransition variant="digital-to-experience" />

        <Experience />
        <SectionTransition variant="experience-to-contact" />

        <PersonalBrandMoment />

        <Contact />
        <SectionTransition variant="contact-to-footer" />
      </main>

      <Footer />
      <WorkArchiveOverlay />
    </>
  );
}
