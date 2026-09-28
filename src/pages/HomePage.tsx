import React, { useState, useCallback, useRef, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SectionTransition from '../components/SectionTransition';
import About from '../components/About';
import VideoSection from '../components/VideoSection';
import StoriesSection from '../components/StoriesSection';
import CreativesSection from '../components/CreativesSection';
import ThumbnailsSection from '../components/ThumbnailsSection';
import DigitalWorkSection from '../components/DigitalWorkSection';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import WorkArchiveOverlay from '../components/WorkArchiveOverlay';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(() => {
    return Boolean(sessionStorage.getItem('portfolio_intro_shown'));
  });
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.title = 'ARPIT AK — Creative Designer, Video Editor & Frontend Developer';
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setIsLoaded(true);
    sessionStorage.setItem('portfolio_intro_shown', 'true');
  }, []);

  return (
    <>
      {!isLoaded && <LoadingScreen onComplete={handleLoadingComplete} />}
      <Navbar isLoaded={isLoaded} navRef={navRef} />

      <main className="relative w-full overflow-x-clip">
        <Hero isLoaded={isLoaded} navRef={navRef} />
        <About />
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

        <Contact />
        <SectionTransition variant="contact-to-footer" />
      </main>

      <Footer />
      <WorkArchiveOverlay />
    </>
  );
}
