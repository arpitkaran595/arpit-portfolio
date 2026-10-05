import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, Link2, Monitor, Play, Sparkles, ArrowRight } from 'lucide-react';
import { digitalProjects, digitalCategories, DigitalCategory, DigitalProject } from '../data/portfolio';
import LiveWebsiteModal from './LiveWebsiteModal';
import MobileDigitalProjectViewer from './MobileDigitalProjectViewer';

// ─────────────────────────────────────────────────────────────────────────────
// MACBOOK SCREEN PREVIEW COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface MacbookScreenProps {
  project: DigitalProject;
  transitionPhase: 'idle' | 'fade-out' | 'black-hold' | 'fade-in';
  onOpenLive: () => void;
}

function MacbookScreen({ project, transitionPhase, onOpenLive }: MacbookScreenProps) {
  const cutoutRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [scale, setScale] = useState(0.5);
  const [stageHeight, setStageHeight] = useState(1200);
  const [cutoutHeight, setCutoutHeight] = useState(400);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  // References for continuous 60fps auto-scroll engine
  const offsetRef = useRef(0);
  const phaseRef = useRef<'top-pause' | 'scrolling-down' | 'bottom-pause' | 'scrolling-up'>('top-pause');
  const pauseTimerRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const maxScrollRef = useRef(0);
  const isPausedRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check user preference for reduced motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      prefersReducedMotionRef.current = mediaQuery.matches;
      const handler = (e: MediaQueryListEvent) => {
        prefersReducedMotionRef.current = e.matches;
      };
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  // Update scale factor (based on 1440px desktop base width) & cutout dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (cutoutRef.current) {
        const width = cutoutRef.current.clientWidth;
        const height = cutoutRef.current.clientHeight;
        setCutoutHeight(height);
        const calculatedScale = width / 1440;
        setScale(calculatedScale);
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    if (cutoutRef.current) {
      resizeObserver.observe(cutoutRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Recalculate maxScroll whenever stageHeight or cutoutHeight changes
  useEffect(() => {
    const max = Math.max(0, stageHeight - cutoutHeight);
    maxScrollRef.current = max;
  }, [stageHeight, cutoutHeight]);

  // Recalculate height for cached images immediately
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && cutoutRef.current) {
      const renderedH = imgRef.current.clientHeight;
      if (renderedH > 0) {
        setStageHeight(renderedH);
        maxScrollRef.current = Math.max(0, renderedH - cutoutRef.current.clientHeight);
      }
    }
  }, [project.id, scale]);

  // Reset scroll & states when project changes
  useEffect(() => {
    offsetRef.current = 0;
    if (stageRef.current) {
      stageRef.current.style.transform = 'translate3d(0, 0px, 0)';
    }
    phaseRef.current = 'top-pause';
    pauseTimerRef.current = 0;
    lastTimeRef.current = performance.now();
    setIsIframeLoaded(false);
    setIsUserInteracting(false);
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, [project.id]);

  // Update isPaused ref
  useEffect(() => {
    isPausedRef.current =
      isHovered ||
      isUserInteracting ||
      prefersReducedMotionRef.current ||
      transitionPhase !== 'idle';
  }, [isHovered, isUserInteracting, transitionPhase]);

  // Smooth 60fps auto-scroll engine (Calibrated ~115px/s for ~13-14s complete review cycle)
  useEffect(() => {
    let animationFrameId: number;
    let isIntersecting = false;
    const speed = 115; // Smooth editorial presentation speed

    const tick = (now: number) => {
      if (!isIntersecting) return;

      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      const maxScroll = maxScrollRef.current;

      if (!isPausedRef.current && maxScroll > 10) {
        let currentOffset = offsetRef.current;
        const currentPhase = phaseRef.current;

        if (currentPhase === 'top-pause') {
          pauseTimerRef.current += dt;
          if (pauseTimerRef.current >= 1.6) {
            phaseRef.current = 'scrolling-down';
            pauseTimerRef.current = 0;
          }
        } else if (currentPhase === 'scrolling-down') {
          currentOffset += speed * dt;
          if (currentOffset >= maxScroll) {
            currentOffset = maxScroll;
            phaseRef.current = 'bottom-pause';
            pauseTimerRef.current = 0;
          }
          offsetRef.current = currentOffset;
          if (stageRef.current) {
            stageRef.current.style.transform = `translate3d(0, ${-currentOffset}px, 0)`;
          }
        } else if (currentPhase === 'bottom-pause') {
          pauseTimerRef.current += dt;
          if (pauseTimerRef.current >= 1.6) {
            phaseRef.current = 'scrolling-up';
            pauseTimerRef.current = 0;
          }
        } else if (currentPhase === 'scrolling-up') {
          currentOffset -= speed * dt;
          if (currentOffset <= 0) {
            currentOffset = 0;
            phaseRef.current = 'top-pause';
            pauseTimerRef.current = 0;
          }
          offsetRef.current = currentOffset;
          if (stageRef.current) {
            stageRef.current.style.transform = `translate3d(0, ${-currentOffset}px, 0)`;
          }
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isIntersecting = Boolean(entry && entry.isIntersecting);
        if (isIntersecting) {
          lastTimeRef.current = performance.now();
          cancelAnimationFrame(animationFrameId);
          animationFrameId = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(animationFrameId);
        }
      },
      { rootMargin: '200px' }
    );

    if (cutoutRef.current) {
      observer.observe(cutoutRef.current);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  // Handle Wheel Scroll inside the MacBook Screen
  const handleWheel = (e: React.WheelEvent) => {
    const maxScroll = maxScrollRef.current;
    if (maxScroll <= 0) return;

    e.preventDefault();
    e.stopPropagation();

    setIsUserInteracting(true);

    const delta = e.deltaY;
    const newOffset = Math.max(0, Math.min(maxScroll, offsetRef.current + delta));
    offsetRef.current = newOffset;
    if (stageRef.current) {
      stageRef.current.style.transform = `translate3d(0, ${-newOffset}px, 0)`;
    }

    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 3500);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 3500);
  };

  const handleImageLoad = () => {
    if (imgRef.current && cutoutRef.current) {
      const renderedH = imgRef.current.clientHeight;
      setStageHeight(renderedH);
      maxScrollRef.current = Math.max(0, renderedH - cutoutRef.current.clientHeight);
    }
  };

  const isUiType = project.type === 'ui';

  return (
    <div
      ref={cutoutRef}
      onWheel={handleWheel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onOpenLive}
      className="absolute overflow-hidden bg-[#0A0A0C] flex items-center justify-center cursor-pointer select-none z-20 group"
      style={{
        left: '13.80%',
        top: '4.49%',
        width: '72.40%',
        height: '68.94%',
        borderRadius: '12px 12px 0 0',
      }}
      title={
        project.hasLivePreview
          ? 'Click to explore interactive website'
          : 'Click to open web application'
      }
    >
      {/* ── Screen-Only Blackout Transition Overlay ── */}
      <div
        className={`absolute inset-0 bg-[#080808] z-30 pointer-events-none transition-opacity duration-200 ${
          transitionPhase === 'fade-out' || transitionPhase === 'black-hold'
            ? 'opacity-100'
            : 'opacity-0'
        }`}
      />

      {/* ── Screen Content Layer (Pristine zero white-flash architecture) ── */}
      <div
        className={`w-full h-full relative transition-opacity duration-300 ${
          transitionPhase === 'fade-in' || transitionPhase === 'idle'
            ? 'opacity-100'
            : 'opacity-0'
        }`}
      >
        {/* CASE 1: Static UI Project */}
        {isUiType ? (
          <div className="w-full h-full flex items-center justify-center p-4 bg-[#12100E]">
            <img
              src={project.previewImage}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
              draggable={false}
            />
          </div>
        ) : (
          /* CASE 2: Websites & Webapps with Pre-loaded Tall Screenshot & Optional Live Iframe */
          <div
            ref={stageRef}
            className="w-full absolute top-0 left-0 will-change-transform bg-[#0A0A0C]"
            style={{
              transform: 'translate3d(0, 0px, 0)',
            }}
          >
            {/* Pristine 1440-wide Tall Screenshot (Always visible underneath iframe) */}
            <img
              ref={imgRef}
              src={project.tallPreviewImage || project.previewImage}
              alt={project.title}
              loading="lazy"
              decoding="async"
              onLoad={handleImageLoad}
              className="w-full h-auto block select-none"
              draggable={false}
            />

            {/* Live Interactive Iframe Layer (Only mounted if project supports it) */}
            {project.hasLivePreview && project.url && (
              <div
                className={`absolute top-0 left-0 w-[1440px] h-[3200px] transition-opacity duration-500 pointer-events-none ${
                  isIframeLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: '0 0',
                }}
              >
                <iframe
                  ref={iframeRef}
                  src={project.url}
                  title={project.title}
                  onLoad={() => setIsIframeLoaded(true)}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
                  className="w-full h-full border-0 bg-transparent"
                  tabIndex={-1}
                />
              </div>
            )}
          </div>
        )}

        {/* ── Minimal Editorial Interaction Affordance (Hover / Focus) ── */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
          <div className="px-4 py-2 rounded-full bg-[#181513]/90 text-[#FBF7F0] text-[11px] sm:text-[12px] font-sora font-semibold tracking-wide shadow-2xl backdrop-blur-md border border-[#D4A94E]/30 flex items-center gap-2 transform group-hover:scale-105 transition-transform duration-300">
            {project.hasLivePreview ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-[#D4A94E]" />
                <span>EXPLORE INTERACTIVE ↗</span>
              </>
            ) : (
              <>
                <ExternalLink className="w-3.5 h-3.5 text-[#D4A94E]" />
                <span>OPEN LIVE APP ↗</span>
              </>
            )}
          </div>
        </div>

        {/* ── Status Indicator in Bottom Right during Manual Wheel / Pause ── */}
        {(isHovered || isUserInteracting) && (
          <div className="absolute bottom-2.5 right-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-sm text-cream-200 text-[10px] font-sora font-medium pointer-events-none border border-white/10 flex items-center gap-1.5 animate-fadeIn">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A94E] animate-pulse" />
            <span>{isUserInteracting ? 'Manual Scroll' : 'Paused • Scroll to Explore'}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DIGITAL WORK SECTION COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function DigitalWorkSection() {
  const [selectedCategory, setSelectedCategory] = useState<DigitalCategory>('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [navDirection, setNavDirection] = useState<1 | -1>(1);
  const [screenTransitionPhase, setScreenTransitionPhase] = useState<
    'idle' | 'fade-out' | 'black-hold' | 'fade-in'
  >('idle');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileViewerOpen, setIsMobileViewerOpen] = useState(false);
  const [mobileViewerIndex, setMobileViewerIndex] = useState(0);

  // Detect mobile viewport (< 768px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter projects based on active category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'ALL') return digitalProjects;
    if (selectedCategory === 'UI/UX')
      return digitalProjects.filter((p) => p.type === 'ui' || p.type === 'webapp');
    if (selectedCategory === 'WEBSITES')
      return digitalProjects.filter((p) => p.type === 'website');
    return digitalProjects;
  }, [selectedCategory]);

  // Keep index within bounds if filtered projects change
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  const totalProjects = filteredProjects.length;
  const currentProject = filteredProjects[currentIndex] || digitalProjects[0];

  // Calculate previous and next project indices (wrapping around)
  const prevIndex = (currentIndex - 1 + totalProjects) % totalProjects;
  const nextIndex = (currentIndex + 1) % totalProjects;

  const prevProject = filteredProjects[prevIndex];
  const nextProject = filteredProjects[nextIndex];

  // Screen-only transition orchestrator (Stationary MacBook, cross-fades content only)
  const navigateToProject = useCallback(
    (targetIndex: number, direction: 1 | -1 = 1) => {
      if (screenTransitionPhase !== 'idle' || targetIndex === currentIndex) return;

      setNavDirection(direction);

      // 1. Fade screen out to black (180ms)
      setScreenTransitionPhase('fade-out');

      setTimeout(() => {
        // 2. Black hold: switch project index behind dark screen (100ms)
        setCurrentIndex(targetIndex);
        setScreenTransitionPhase('black-hold');

        setTimeout(() => {
          // 3. Fade in new project (280ms)
          setScreenTransitionPhase('fade-in');

          setTimeout(() => {
            // 4. Return to idle
            setScreenTransitionPhase('idle');
          }, 290);
        }, 100);
      }, 180);
    },
    [currentIndex, screenTransitionPhase]
  );

  const handlePrev = useCallback(() => {
    navigateToProject(prevIndex, -1);
  }, [navigateToProject, prevIndex]);

  const handleNext = useCallback(() => {
    navigateToProject(nextIndex, 1);
  }, [navigateToProject, nextIndex]);

  // Universal action handler:
  // On mobile (< 768px): Launches the mobile-only cinematic case-study viewer.
  // On desktop / tablet (>= 768px):
  //   - For ImageMint (hasLivePreview: false) -> opens external URL directly in new tab.
  //   - For genuine live projects -> opens full-screen interactive modal.
  const handleOpenProjectAction = useCallback(() => {
    if (!currentProject) return;

    if (isMobile) {
      setMobileViewerIndex(currentIndex);
      setIsMobileViewerOpen(true);
      return;
    }

    if (!currentProject.hasLivePreview && currentProject.url) {
      window.open(currentProject.url, '_blank', 'noopener,noreferrer');
    } else {
      setIsModalOpen(true);
    }
  }, [currentProject, isMobile, currentIndex]);

  // Keyboard navigation support (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen || isMobileViewerOpen) return;
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, isModalOpen, isMobileViewerOpen]);

  // Dynamic Formatted counter (e.g. 01 / 04)
  const formattedCurrent = String(currentIndex + 1).padStart(2, '0');
  const formattedTotal = String(totalProjects).padStart(2, '0');

  return (
    <section
      id="digital-work"
      className="relative w-full overflow-hidden bg-[#FBF7F0] text-charcoal-900 pt-24 sm:pt-28 lg:pt-32 pb-20 sm:pb-24 lg:pb-28 scroll-mt-24 select-none"
      style={{
        backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(246, 215, 178, 0.28) 0%, rgba(251, 247, 240, 0.98) 65%)`,
      }}
    >
      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* BACKGROUND TEXTURE & AMBIENT GLOW */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-multiply"
        style={{ backgroundImage: 'url(/assets/noise-grain.png)' }}
      />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url(/assets/paper-texture.webp)' }}
      />


      <div className="relative w-full max-w-[1720px] mx-auto px-3 sm:px-6 md:px-8 lg:px-10 flex flex-col items-center">
        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* 1. SECTION HEADER */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col items-center text-center max-w-[800px] mb-8 sm:mb-11 relative z-10">
          {/* Eyebrow with flanking gold hairline dividers */}
          <div className="flex items-center justify-center gap-3.5 mb-3.5">
            <div className="h-[1px] w-8 sm:w-14 bg-[#B8860B]/40" />
            <span className="text-[11px] sm:text-[12px] font-sora font-semibold tracking-[0.25em] text-[#9A7209] uppercase">
              DIGITAL WORK
            </span>
            <div className="h-[1px] w-8 sm:w-14 bg-[#B8860B]/40" />
          </div>

          {/* Main Display Heading */}
          <h2 className="font-playfair text-[clamp(2.4rem,4.5vw,4.4rem)] font-bold leading-[1.08] text-charcoal-900 tracking-tight mb-3">
            Interfaces & <span className="text-[#7A1C28] italic font-playfair font-normal">Websites.</span>
          </h2>

          {/* Subtitle */}
          <p className="font-sora text-[14px] sm:text-[15.5px] text-charcoal-500 font-normal leading-relaxed max-w-[560px]">
            Digital experiences, interfaces and websites I’ve designed and built.
          </p>

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* 2. CATEGORY FILTERS (ALL | UI/UX | WEBSITES) */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <div className="flex items-center justify-center gap-5 sm:gap-7 mt-6 sm:mt-8">
            {digitalCategories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative py-1 px-2 text-[12px] sm:text-[13px] font-sora tracking-[0.16em] uppercase transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'text-charcoal-900 font-bold'
                      : 'text-charcoal-400 hover:text-charcoal-700 font-medium'
                  }`}
                >
                  <span>{cat}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryDot"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#7A1C28] shadow-sm shadow-[#7A1C28]/40"
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* 3. MAIN SHOWCASE STAGE */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        <div className="relative w-full flex items-center justify-center mt-2 sm:mt-4 mb-4">
          {/* MOBILE / TABLET NAV BUTTON: PREVIOUS (< lg) */}
          <button
            onClick={handlePrev}
            aria-label="Previous project"
            className="lg:hidden absolute left-1 sm:left-3 top-[39%] -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-cream-50/95 hover:bg-white text-charcoal-800 border border-[#D4A94E]/50 hover:border-[#7A1C28] shadow-md flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-charcoal-700" />
          </button>

          {/* MOBILE / TABLET NAV BUTTON: NEXT (< lg) */}
          <button
            onClick={handleNext}
            aria-label="Next project"
            className="lg:hidden absolute right-1 sm:right-3 top-[39%] -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-cream-50/95 hover:bg-white text-charcoal-800 border border-[#D4A94E]/50 hover:border-[#7A1C28] shadow-md flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 text-charcoal-700" />
          </button>

          {/* Central Fixed MacBook Container & Fluid Flanking Previews */}
          {/* Sized fluidly so on 1024-1280px it never crowds viewport edges */}
          <div className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[500px] xl:max-w-[620px] 2xl:max-w-[760px] aspect-[1536/1024] flex items-center justify-center z-20">
            {/* 1. DESKTOP LEFT GROUP: Outer Arrow (<) + Previous Project Preview Card */}
            {totalProjects > 1 && prevProject && (
              <div className="hidden lg:flex absolute right-[calc(100%+0.65rem)] lg:right-[calc(100%+0.85rem)] xl:right-[calc(100%+1.35rem)] 2xl:right-[calc(100%+1.85rem)] top-[39%] -translate-y-1/2 items-center gap-2 lg:gap-2.5 xl:gap-3.5 z-20">
                {/* External Circular Previous Arrow Button (<) */}
                <button
                  onClick={handlePrev}
                  aria-label="Previous project"
                  className="w-9 h-9 lg:w-9 lg:h-9 xl:w-10 xl:h-10 2xl:w-11 2xl:h-11 rounded-full bg-cream-50/95 hover:bg-white text-charcoal-800 border border-[#D4A94E]/45 hover:border-[#7A1C28] shadow-md hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer flex-shrink-0"
                >
                  <ChevronLeft className="w-4 h-4 lg:w-4.5 lg:h-4.5 xl:w-5 xl:h-5 group-hover:-translate-x-0.5 transition-transform duration-200 text-charcoal-700 group-hover:text-[#7A1C28]" />
                </button>

                {/* Previous Project Editorial Card with AnimatePresence */}
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={prevProject.id}
                    initial={{ opacity: 0, x: navDirection === 1 ? -12 : 12, scale: 0.96 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: 1,
                      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                    }}
                    exit={{
                      opacity: 0,
                      x: navDirection === 1 ? 12 : -12,
                      scale: 0.96,
                      transition: { duration: 0.18 },
                    }}
                    onClick={handlePrev}
                    className="flex flex-col items-start cursor-pointer group transition-all duration-300 hover:scale-[1.025]"
                    style={{ perspective: '1100px' }}
                    title={`View previous: ${prevProject.title}`}
                  >
                    {/* Card Surface: Substantial, rounded, preserved vibrant artwork */}
                    <div
                      className="w-[145px] lg:w-[155px] xl:w-[195px] 2xl:w-[245px] aspect-[16/10] rounded-[13px] xl:rounded-[16px] overflow-hidden bg-[#1E1B18] border border-[#D4A94E]/35 group-hover:border-[#7A1C28]/60 shadow-lg shadow-black/10 group-hover:shadow-2xl transition-all duration-300 relative"
                      style={{
                        transform: 'rotateY(6deg)',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <img
                        src={prevProject.previewImage}
                        alt={prevProject.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top filter brightness-[0.98] group-hover:brightness-100 transition-all duration-300 select-none"
                        draggable={false}
                      />
                      {/* Subtle soft scrim preserving artwork vibrancy */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity duration-300" />
                      {/* Refined Index Tag */}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#FAF4EC]/90 text-[#7A1C28] text-[9px] font-sora font-semibold backdrop-blur-sm border border-[#B8860B]/30 shadow-sm">
                        {prevProject.index}
                      </span>
                    </div>

                    {/* Editorial Details below card: Left Aligned */}
                    <div className="mt-2 text-left w-full pl-0.5 max-w-[145px] lg:max-w-[155px] xl:max-w-[195px] 2xl:max-w-[245px]">
                      <h4 className="font-playfair text-[12.5px] lg:text-[13px] xl:text-[15px] font-bold text-charcoal-900 group-hover:text-[#7A1C28] transition-colors leading-tight truncate">
                        {prevProject.title}
                      </h4>
                      <span className="text-[8.5px] lg:text-[9px] xl:text-[10px] font-sora font-semibold text-charcoal-400 uppercase tracking-[0.16em] block mt-0.5 truncate">
                        {prevProject.categoryLabel}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* 2. STATIONARY HERO CENTER MACBOOK (Hardware remains visually stable) */}
            {/* Multi-layered Natural Grounding Shadow System */}
            {/* Layer 1: Tight dark contact shadow under base edge */}
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[76%] h-[5px] sm:h-[7px] rounded-full bg-[#18130E]/45 pointer-events-none select-none z-[10]"
              style={{ filter: 'blur(3px)' }}
            />
            {/* Layer 2: Soft diffused mid-ground radial shadow */}
            <div
              className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 w-[86%] sm:w-[88%] h-7 sm:h-10 md:h-12 rounded-[100%] pointer-events-none select-none z-[9]"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(35, 27, 20, 0.26) 0%, rgba(35, 27, 20, 0.08) 50%, transparent 74%)',
                filter: 'blur(7px)',
              }}
            />
            {/* Layer 3: Warm ambient floor reflection falloff */}
            <div
              className="absolute -bottom-5 sm:-bottom-7 left-1/2 -translate-x-1/2 w-[94%] sm:w-[96%] h-12 sm:h-16 md:h-20 rounded-[100%] pointer-events-none select-none z-[8]"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(40, 30, 20, 0.12) 0%, rgba(40, 30, 20, 0.03) 55%, transparent 80%)',
                filter: 'blur(14px)',
              }}
            />

            {/* Dynamic Interactive MacBook Screen (Only screen changes) */}
            <MacbookScreen
              project={currentProject}
              transitionPhase={screenTransitionPhase}
              onOpenLive={handleOpenProjectAction}
            />

            {/* Physical MacBook Frame Image (Stationary Asset) */}
            <img
              src="/assets/macbook.webp"
              alt="MacBook Pro"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain pointer-events-none relative z-30 drop-shadow-[0_20px_40px_rgba(0,0,0,0.16)]"
              draggable={false}
            />

            {/* 3. DESKTOP RIGHT GROUP: Next Project Preview Card + Outer Arrow (>) */}
            {totalProjects > 1 && nextProject && (
              <div className="hidden lg:flex absolute left-[calc(100%+0.65rem)] lg:left-[calc(100%+0.85rem)] xl:left-[calc(100%+1.35rem)] 2xl:left-[calc(100%+1.85rem)] top-[39%] -translate-y-1/2 items-center gap-2 lg:gap-2.5 xl:gap-3.5 z-20">
                {/* Next Project Editorial Card with AnimatePresence */}
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={nextProject.id}
                    initial={{ opacity: 0, x: navDirection === 1 ? 12 : -12, scale: 0.96 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: 1,
                      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                    }}
                    exit={{
                      opacity: 0,
                      x: navDirection === 1 ? -12 : 12,
                      scale: 0.96,
                      transition: { duration: 0.18 },
                    }}
                    onClick={handleNext}
                    className="flex flex-col items-end cursor-pointer group transition-all duration-300 hover:scale-[1.025]"
                    style={{ perspective: '1100px' }}
                    title={`View next: ${nextProject.title}`}
                  >
                    {/* Card Surface: Substantial, rounded, preserved vibrant artwork */}
                    <div
                      className="w-[145px] lg:w-[155px] xl:w-[195px] 2xl:w-[245px] aspect-[16/10] rounded-[13px] xl:rounded-[16px] overflow-hidden bg-[#1E1B18] border border-[#D4A94E]/35 group-hover:border-[#7A1C28]/60 shadow-lg shadow-black/10 group-hover:shadow-2xl transition-all duration-300 relative"
                      style={{
                        transform: 'rotateY(-6deg)',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <img
                        src={nextProject.previewImage}
                        alt={nextProject.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top filter brightness-[0.98] group-hover:brightness-100 transition-all duration-300 select-none"
                        draggable={false}
                      />
                      {/* Subtle soft scrim preserving artwork vibrancy */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity duration-300" />
                      {/* Refined Index Tag */}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#FAF4EC]/90 text-[#7A1C28] text-[9px] font-sora font-semibold backdrop-blur-sm border border-[#B8860B]/30 shadow-sm">
                        {nextProject.index}
                      </span>
                    </div>

                    {/* Editorial Details below card: Right Aligned */}
                    <div className="mt-2 text-right w-full pr-0.5 max-w-[145px] lg:max-w-[155px] xl:max-w-[195px] 2xl:max-w-[245px]">
                      <h4 className="font-playfair text-[12.5px] lg:text-[13px] xl:text-[15px] font-bold text-charcoal-900 group-hover:text-[#7A1C28] transition-colors leading-tight truncate">
                        {nextProject.title}
                      </h4>
                      <span className="text-[8.5px] lg:text-[9px] xl:text-[10px] font-sora font-semibold text-charcoal-400 uppercase tracking-[0.16em] block mt-0.5 truncate">
                        {nextProject.categoryLabel}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* External Circular Next Arrow Button (>) */}
                <button
                  onClick={handleNext}
                  aria-label="Next project"
                  className="w-9 h-9 lg:w-9 lg:h-9 xl:w-10 xl:h-10 2xl:w-11 2xl:h-11 rounded-full bg-cream-50/95 hover:bg-white text-charcoal-800 border border-[#D4A94E]/45 hover:border-[#7A1C28] shadow-md hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer flex-shrink-0"
                >
                  <ChevronRight className="w-4 h-4 lg:w-4.5 lg:h-4.5 xl:w-5 xl:h-5 group-hover:translate-x-0.5 transition-transform duration-200 text-charcoal-700 group-hover:text-[#7A1C28]" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* COMPACT RESPONSIVE PREVIEW STRIP (TABLET & MOBILE < 1024px) */}
        {/* Ensures visitors never lose gallery context on small screens */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {totalProjects > 1 && (
          <div className="lg:hidden w-full max-w-[500px] px-2 flex items-center justify-center gap-2 sm:gap-2.5 mb-5 mt-1 z-20">
            {filteredProjects.map((p, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    if (isActive && isMobile) {
                      setMobileViewerIndex(idx);
                      setIsMobileViewerOpen(true);
                    } else {
                      navigateToProject(idx, idx > currentIndex ? 1 : -1);
                    }
                  }}
                  className={`flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-lg transition-all duration-300 text-left cursor-pointer ${
                    isActive
                      ? 'bg-white/95 border border-[#7A1C28]/45 shadow-md shadow-[#7A1C28]/10 ring-1 ring-[#7A1C28]/20'
                      : 'bg-cream-50/70 border border-[#D4A94E]/30 hover:border-[#7A1C28]/35 opacity-75 hover:opacity-100'
                  }`}
                  aria-label={`View project ${p.index}: ${p.title}`}
                >
                  <div className="w-8 h-5 sm:w-10 sm:h-6 rounded overflow-hidden flex-shrink-0 bg-[#1E1B18] border border-black/10">
                    <img
                      src={p.previewImage}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top select-none"
                      draggable={false}
                    />
                  </div>
                  <div className="pr-1 hidden sm:block">
                    <span
                      className={`text-[8.5px] font-sora block leading-tight ${
                        isActive ? 'text-[#7A1C28] font-bold' : 'text-charcoal-400 font-medium'
                      }`}
                    >
                      {p.index}
                    </span>
                    <span className="text-[10.5px] font-playfair font-bold text-charcoal-900 truncate block max-w-[80px]">
                      {p.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* 4. CURRENT PROJECT METADATA & ACTIONS (Below MacBook) */}
        {/* Symmetric Staggered Editorial Typography Exchange */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        <div className="relative min-h-[180px] w-full flex justify-center z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProject.id}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center text-center mt-1"
            >
              {/* Line 1: Dynamic Counter & Minimal Editorial Segmented Scrubber */}
              <motion.div
                variants={{
                  initial: { opacity: 0, y: 8 },
                  animate: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.36,
                      delay: 0.07,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                  exit: {
                    opacity: 0,
                    y: -6,
                    transition: { duration: 0.16, ease: 'easeIn' },
                  },
                }}
                className="flex flex-col items-center mb-1"
              >
                {/* Numeric Counter (e.g. 01 / 04) */}
                <div className="text-[11.5px] sm:text-[12.5px] font-sora font-semibold tracking-[0.24em] text-[#9A7209]">
                  {formattedCurrent} / {formattedTotal}
                </div>

                {/* Minimal Editorial Segmented Progress Line */}
                <div className="flex items-center justify-center gap-1.5 mt-1.5 mb-1">
                  {filteredProjects.map((p, idx) => {
                    const isActive = idx === currentIndex;
                    return (
                      <button
                        key={p.id}
                        onClick={() => navigateToProject(idx, idx > currentIndex ? 1 : -1)}
                        aria-label={`Jump to project ${p.index}`}
                        className="group py-1 px-0.5 cursor-pointer"
                      >
                        <div
                          className={`h-[2px] rounded-full transition-all duration-300 ${
                            isActive
                              ? 'w-7 sm:w-8 bg-[#7A1C28]'
                              : 'w-3.5 sm:w-4 bg-[#D4A94E]/40 group-hover:bg-[#7A1C28]/60'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Line 2: Category Eyebrow & Index */}
              <motion.div
                variants={{
                  initial: { opacity: 0, y: 8 },
                  animate: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.36, delay: 0.1, ease: [0.22, 1, 0.36, 1] },
                  },
                  exit: { opacity: 0, y: -4, transition: { duration: 0.14 } },
                }}
                className="flex items-center justify-center gap-2 text-[10.5px] sm:text-[11.5px] font-sora font-semibold tracking-[0.22em] text-[#7A1C28] uppercase mt-2 mb-1"
              >
                <span className="w-1.5 h-1.5 rounded-[2px] bg-[#7A1C28]" />
                <span>{currentProject.categoryLabel}</span>
              </motion.div>

              {/* Line 3: Project Title (Display Serif) */}
              <motion.h3
                variants={{
                  initial: { opacity: 0, y: 12 },
                  animate: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, delay: 0.14, ease: [0.22, 1, 0.36, 1] },
                  },
                  exit: { opacity: 0, y: -8, transition: { duration: 0.16, ease: 'easeIn' } },
                }}
                className="font-playfair text-[32px] sm:text-[40px] md:text-[48px] lg:text-[54px] font-bold text-charcoal-900 tracking-tight leading-[1.08] mb-3"
              >
                {currentProject.title}
              </motion.h3>

              {/* Line 4: Short One-Line Project Summary */}
              <motion.p
                variants={{
                  initial: { opacity: 0, y: 8 },
                  animate: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.36, delay: 0.18, ease: [0.22, 1, 0.36, 1] },
                  },
                  exit: { opacity: 0, y: -6, transition: { duration: 0.14 } },
                }}
                className="font-sora text-[14px] sm:text-[15.5px] text-charcoal-600 max-w-[620px] mx-auto leading-relaxed mb-6 font-normal"
              >
                {currentProject.caseStudy?.summary || currentProject.description}
              </motion.p>

              {/* Line 5: Editorial Metadata Matrix (Year, Role, Services, Core Tech) */}
              {currentProject.caseStudy && (
                <motion.div
                  variants={{
                    initial: { opacity: 0, y: 8 },
                    animate: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.38, delay: 0.22, ease: [0.22, 1, 0.36, 1] },
                    },
                    exit: { opacity: 0, y: -6, transition: { duration: 0.14 } },
                  }}
                  className="w-full max-w-[780px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-white/70 border border-[#D4A94E]/30 mb-8 text-left shadow-2xs"
                >
                  <div>
                    <span className="block text-[9.5px] sm:text-[10px] font-sora font-bold tracking-[0.18em] text-[#9A7209] uppercase mb-1">
                      YEAR
                    </span>
                    <span className="block font-sora text-[12.5px] sm:text-[13px] font-semibold text-charcoal-800">
                      {currentProject.caseStudy.year}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9.5px] sm:text-[10px] font-sora font-bold tracking-[0.18em] text-[#9A7209] uppercase mb-1">
                      ROLE
                    </span>
                    <span className="block font-sora text-[12.5px] sm:text-[13px] font-semibold text-charcoal-800 leading-snug">
                      {currentProject.caseStudy.role}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9.5px] sm:text-[10px] font-sora font-bold tracking-[0.18em] text-[#9A7209] uppercase mb-1">
                      SERVICES
                    </span>
                    <span className="block font-sora text-[12.5px] sm:text-[13px] font-semibold text-charcoal-800 leading-snug truncate">
                      {currentProject.caseStudy.services[0]}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9.5px] sm:text-[10px] font-sora font-bold tracking-[0.18em] text-[#9A7209] uppercase mb-1">
                      CORE TECH
                    </span>
                    <span className="block font-sora text-[12.5px] sm:text-[13px] font-semibold text-charcoal-800 leading-snug truncate">
                      {currentProject.tools?.[0] || 'Web'}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Line 6: Action Buttons (Interactive Live Preview / Open External / Scroll to Case Study) */}
              <motion.div
                variants={{
                  initial: { opacity: 0, y: 8 },
                  animate: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.38,
                      delay: 0.25,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                  exit: {
                    opacity: 0,
                    y: -6,
                    transition: { duration: 0.16, delay: 0.08, ease: 'easeIn' },
                  },
                }}
                className="flex flex-wrap items-center justify-center gap-3"
              >
                {/* Primary Action Button:
                    - If project hasLivePreview: Launches Live Website Preview in MacBook environment
                    - If project blocks embedding: Direct launch CTA without false claims
                */}
                {/* 1. Primary CTA: VIEW CASE STUDY (Navigates to dedicated /work/:slug page) */}
                <Link
                  to={`/work/${currentProject.slug}`}
                  className="px-6 sm:px-8 py-3 rounded-full bg-[#7A1C28] hover:bg-[#63141F] text-white text-[12px] sm:text-[13px] font-sora font-semibold tracking-[0.12em] uppercase transition-all duration-300 shadow-md shadow-[#7A1C28]/25 hover:shadow-xl hover:shadow-[#7A1C28]/35 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
                >
                  <span>VIEW CASE STUDY</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E5C89C]" />
                </Link>

                {/* 2. Interactive Live Preview (if supported) / Open Application */}
                {currentProject.hasLivePreview ? (
                  <button
                    onClick={handleOpenProjectAction}
                    className="px-5 py-3 rounded-full bg-cream-50/90 hover:bg-cream-100 text-charcoal-800 hover:text-[#7A1C28] border border-[#D4A94E]/50 hover:border-[#7A1C28] text-[11.5px] sm:text-[12.5px] font-sora font-semibold tracking-wider uppercase transition-all duration-300 shadow-2xs hover:shadow-xs flex items-center gap-2 cursor-pointer"
                    title="Explore live website in interactive MacBook preview"
                  >
                    <Play className="w-3.5 h-3.5 text-[#9A7209] fill-[#9A7209]" />
                    <span>EXPLORE LIVE PREVIEW</span>
                  </button>
                ) : (
                  currentProject.url && (
                    <a
                      href={currentProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 rounded-full bg-cream-50/90 hover:bg-cream-100 text-charcoal-700 hover:text-[#7A1C28] border border-[#D4A94E]/50 hover:border-[#7A1C28] text-[11.5px] sm:text-[12.5px] font-sora font-semibold tracking-wider uppercase transition-all duration-300 shadow-2xs hover:shadow-xs flex items-center gap-2 cursor-pointer"
                      title="Open external live application in new tab"
                    >
                      <span>OPEN WEB APP</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#9A7209]" />
                    </a>
                  )
                )}

                {/* 3. Direct Link External Button if project has live preview */}
                {currentProject.hasLivePreview && currentProject.url && (
                  <a
                    href={currentProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-full bg-white/70 hover:bg-white text-charcoal-700 hover:text-charcoal-900 border border-[#D4A94E]/40 text-[11.5px] sm:text-[12.5px] font-sora font-medium tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Open external live site in new tab"
                  >
                    <span>OPEN PROJECT</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#9A7209]" />
                  </a>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* 5. DISCOVERY FOOTER & FAST ARCHIVE INDICATOR                     */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        <div className="w-full max-w-[860px] mx-auto mt-10 sm:mt-14 pt-8 border-t border-[#D4A94E]/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#7A1C28] animate-pulse" />
            <span className="text-[11px] sm:text-[11.5px] font-sora font-semibold tracking-[0.16em] text-[#9A7209] uppercase">
              DOCUMENTARY ARCHIVE • 4 DEDICATED CASE STUDIES
            </span>
          </div>
          <Link
            to={`/work/${currentProject.slug}`}
            className="inline-flex items-center gap-2 text-[11.5px] sm:text-[12px] font-sora font-bold tracking-[0.12em] text-charcoal-800 hover:text-[#7A1C28] uppercase transition-colors group cursor-pointer"
          >
            <span>READ {currentProject.title} CASE STUDY</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#7A1C28] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* 6. FULL-SCREEN INTERACTIVE LIVE VIEWER MODAL (DESKTOP / TABLET) */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <LiveWebsiteModal
          project={currentProject}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* 7. MOBILE FULL-SCREEN CINEMATIC PROJECT VIEWER (< 768px) */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <MobileDigitalProjectViewer
        isOpen={isMobileViewerOpen}
        onClose={() => setIsMobileViewerOpen(false)}
        initialIndex={mobileViewerIndex}
        projects={filteredProjects}
      />
    </section>
  );
}
