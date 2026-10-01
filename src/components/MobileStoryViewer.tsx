import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { storyPosters, StoryPoster } from '../data/portfolio';
import { viewerSlideVariants } from '../utils/viewerTransitions';

export interface StoryViewerItem {
  id: string;
  title?: string;
  thumbnail: string;
  category?: string;
  description?: string;
}

export interface MobileStoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
  item: StoryViewerItem | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// MATHEMATICAL CIRCULAR WRAPPING
// ─────────────────────────────────────────────────────────────────────────────
function getWrappedOffset(index: number, current: number, total: number): number {
  return ((((index - current + total / 2) % total) + total) % total) - total / 2;
}

// ─────────────────────────────────────────────────────────────────────────────
// AMBIENT COLOR PALETTE BY STORY THEME
// ─────────────────────────────────────────────────────────────────────────────
interface StoryTheme {
  glowColor: string;
  spotlight: string;
  accentGold: string;
}

function getStoryTheme(story: StoryPoster): StoryTheme {
  const cat = (story.category || '').toLowerCase();
  const title = (story.title || '').toLowerCase();
  const id = (story.id || '').toLowerCase();

  if (
    title.includes('ruby') ||
    title.includes('gem') ||
    cat.includes('jewelry') ||
    id === 'story-01' ||
    id === 'post-01' ||
    id === 'post-02'
  ) {
    return {
      glowColor: 'rgba(195, 28, 62, 0.32)',
      spotlight: 'rgba(235, 45, 80, 0.18)',
      accentGold: '#C4943A',
    };
  }
  if (cat.includes('wellness') || cat.includes('health') || title.includes('care')) {
    return {
      glowColor: 'rgba(196, 148, 58, 0.28)',
      spotlight: 'rgba(240, 190, 95, 0.16)',
      accentGold: '#C4943A',
    };
  }
  if (cat.includes('fitness') || cat.includes('lifestyle') || title.includes('routine')) {
    return {
      glowColor: 'rgba(215, 115, 45, 0.26)',
      spotlight: 'rgba(245, 145, 70, 0.15)',
      accentGold: '#D49B45',
    };
  }
  if (cat.includes('nutrition') || title.includes('nutrition')) {
    return {
      glowColor: 'rgba(50, 140, 85, 0.25)',
      spotlight: 'rgba(90, 190, 120, 0.14)',
      accentGold: '#C4943A',
    };
  }
  if (cat.includes('mindset') || cat.includes('motivation')) {
    return {
      glowColor: 'rgba(150, 80, 210, 0.24)',
      spotlight: 'rgba(180, 110, 240, 0.14)',
      accentGold: '#C4943A',
    };
  }
  return {
    glowColor: 'rgba(196, 148, 58, 0.28)',
    spotlight: 'rgba(235, 180, 85, 0.16)',
    accentGold: '#C4943A',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY EDITORIAL DESCRIPTION
// ─────────────────────────────────────────────────────────────────────────────
function getStoryDescription(story: StoryPoster): string {
  if (story.description) return story.description;
  const title = (story.title || '').toLowerCase();
  if (title.includes('ruby') || story.id === 'story-01') {
    return 'A premium social media story design for the gemstone collection, highlighting the power of Ruby.';
  }
  if (story.category) {
    return `An editorial vertical story layout created for ${story.category.toLowerCase()}, highlighting elegance and visual impact.`;
  }
  return `A high-retention vertical story design highlighting ${story.title}, crafted for social campaigns.`;
}

export const MobileStoryViewer: React.FC<MobileStoryViewerProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  // Construct playlist fallback
  const playlist = useMemo<StoryPoster[]>(() => {
    if (!item) return storyPosters;
    const exists = storyPosters.some(
      (s) => s.id === item.id || s.image === item.thumbnail || s.title === item.title
    );
    if (exists) return storyPosters;

    // Synthesize custom story poster if not directly in array
    const customStory: StoryPoster = {
      id: item.id || 'custom-story',
      index: '01',
      title: item.title || 'Story Artwork',
      image: item.thumbnail,
      thumbnail: item.thumbnail,
      category: item.category || 'Social Media Story',
      description: item.description,
    };
    return [customStory, ...storyPosters];
  }, [item]);

  const totalStories = playlist.length;

  // Resolve initial index matching the tapped item
  const initialIndex = useMemo(() => {
    if (!item) return 0;
    const foundIdx = playlist.findIndex(
      (s) => s.id === item.id || s.image === item.thumbnail || s.title === item.title
    );
    return foundIdx >= 0 ? foundIdx : 0;
  }, [item, playlist]);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const isTransitioningRef = useRef(false);

  // Sync index on open
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setDirection(0);
      isTransitioningRef.current = false;
    }
  }, [isOpen, initialIndex]);

  // Derived current, previous, next stories
  const activeStory = playlist[currentIndex] || playlist[0];
  const prevIndex = (currentIndex - 1 + totalStories) % totalStories;
  const nextIndex = (currentIndex + 1) % totalStories;
  const prevStory = playlist[prevIndex];
  const nextStory = playlist[nextIndex];

  const activeTheme = useMemo(() => getStoryTheme(activeStory), [activeStory]);

  // Navigation handlers with debounce lock
  const handlePrevious = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalStories) % totalStories);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 340);
  }, [totalStories]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalStories);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 340);
  }, [totalStories]);

  // Keyboard navigation & body scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    document.body.style.overflow = 'hidden';
    if ((window as any).lenis) {
      (window as any).lenis.stop();
    }
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, handlePrevious, handleNext]);

  // Preload nearby story images for instant transitions
  useEffect(() => {
    if (!isOpen) return;
    const urls = [activeStory?.image, prevStory?.image, nextStory?.image].filter(Boolean);
    urls.forEach((url) => {
      const img = new Image();
      img.src = url!;
    });
  }, [isOpen, activeStory, prevStory, nextStory]);

  // Touch Swipe Gesture Handling
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
  };

  // 3D Transform calculations for card positions
  const getCardTransform = (offset: number) => {
    if (offset === 0) {
      // Center Active Card
      return {
        x: '0%',
        y: '0px',
        scale: 1,
        rotateY: 0,
        z: 0,
        opacity: 1,
        filter: 'brightness(1) blur(0px)',
        zIndex: 30,
        pointerEvents: 'auto' as const,
        shadow: '0 24px 60px -10px rgba(0,0,0,0.85), 0 0 35px rgba(196,148,58,0.18)',
      };
    }
    if (offset === -1) {
      // Left Previous Card
      return {
        x: '-56%',
        y: '6px',
        scale: 0.81,
        rotateY: 20,
        z: -70,
        opacity: 0.52,
        filter: 'brightness(0.65) blur(0.5px)',
        zIndex: 10,
        pointerEvents: 'auto' as const,
        shadow: '0 15px 35px -8px rgba(0,0,0,0.7)',
      };
    }
    if (offset === 1) {
      // Right Next Card
      return {
        x: '56%',
        y: '6px',
        scale: 0.81,
        rotateY: -20,
        z: -70,
        opacity: 0.52,
        filter: 'brightness(0.65) blur(0.5px)',
        zIndex: 10,
        pointerEvents: 'auto' as const,
        shadow: '0 15px 35px -8px rgba(0,0,0,0.7)',
      };
    }
    // Cards outside immediate 3 positions
    const isLeft = offset < 0;
    return {
      x: isLeft ? '-120%' : '120%',
      y: '12px',
      scale: 0.65,
      rotateY: isLeft ? 35 : -35,
      z: -140,
      opacity: 0,
      filter: 'brightness(0.4) blur(2px)',
      zIndex: 0,
      pointerEvents: 'none' as const,
      shadow: 'none',
    };
  };

  // Render Title with first part in clean ivory serif and remaining in warm gold italic
  const renderEditorialTitle = (titleText: string) => {
    const parts = titleText.trim().split(' ');
    if (parts.length === 1) {
      return (
        <span className="font-playfair text-[1.45rem] sm:text-[1.7rem] font-bold text-[#FAF3E8]">
          {parts[0]}
        </span>
      );
    }
    const splitPoint = Math.max(1, Math.floor(parts.length / 2));
    const firstPart = parts.slice(0, splitPoint).join(' ');
    const lastPart = parts.slice(splitPoint).join(' ');

    return (
      <h1 className="font-playfair text-[1.45rem] sm:text-[1.7rem] font-bold tracking-tight text-center leading-[1.15] drop-shadow-md">
        <span className="text-[#FAF3E8]">{firstPart} </span>
        <span className="text-[#C4943A] italic font-playfair font-normal">{lastPart}</span>
      </h1>
    );
  };

  // Windowed pagination calculation (max 6 visible dots)
  const paginationDots = useMemo(() => {
    const maxDots = Math.min(6, totalStories);
    let start = Math.max(0, currentIndex - Math.floor(maxDots / 2));
    if (start + maxDots > totalStories) {
      start = Math.max(0, totalStories - maxDots);
    }
    return Array.from({ length: maxDots }, (_, i) => start + i);
  }, [currentIndex, totalStories]);

  if (!isOpen || !item) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="mobile-story-viewer-modal"
        role="dialog"
        aria-label="Story Viewer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100000] bg-[#070707] flex flex-col justify-between overflow-hidden select-none touch-none"
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)',
        }}
      >
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 1. DYNAMIC AMBIENT BACKDROP EFFECT                                  */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* A. Blurred Active Story Image Atmosphere */}
          <motion.img
            key={activeStory.image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.22 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            src={activeStory.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-150 filter blur-[70px] pointer-events-none"
          />

          {/* B. Dynamic Theme Glow Overlay */}
          <div
            className="absolute inset-0 transition-all duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 42%, ${activeTheme.glowColor} 0%, ${activeTheme.spotlight} 38%, transparent 72%)`,
            }}
          />

          {/* C. Deep Black Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent via-50% to-black/90 pointer-events-none" />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 2. TOP HEADER ZONE                                                  */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <header className="relative z-50 w-full px-4 sm:px-6 pt-1 pb-2 flex flex-col items-center">
          {/* Top Row: Branding (Left) & Circular Close Button (Right) */}
          <div className="w-full flex items-center justify-between relative mb-1.5">
            {/* Left: ARPIT AK Branding */}
            <div className="flex items-center gap-1.5 pl-1">
              <span className="text-[11px] font-sora font-extrabold tracking-[0.22em] text-[#FAF3E8]/80 uppercase">
                ARPIT <span className="text-[#C4943A]">AK</span>
              </span>
            </div>

            {/* Right: Elegant Circular Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              type="button"
              aria-label="Close Story Viewer"
              className="w-10 h-10 rounded-full bg-black/45 backdrop-blur-xl border border-white/20 hover:border-[#C4943A]/60 flex items-center justify-center text-white/85 hover:text-white active:scale-90 transition-all shadow-xl cursor-pointer pointer-events-auto"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Center Category Label: "— SOCIAL MEDIA STORY —" */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="w-4 sm:w-5 h-[1px] bg-white/25" />
            <span className="text-white/65 font-sora text-[9.5px] sm:text-[10px] tracking-[0.25em] uppercase font-semibold drop-shadow-sm">
              {activeStory.category || 'SOCIAL MEDIA STORY'}
            </span>
            <span className="w-4 sm:w-5 h-[1px] bg-white/25" />
          </div>

          {/* Main Editorial Title */}
          <div className="max-w-[320px] px-2 mb-1">
            {renderEditorialTitle(activeStory.title)}
          </div>

          {/* Progress Indicator: "03 / 18" */}
          <div className="flex items-center justify-center gap-1">
            <span className="text-[#C4943A] font-sora font-bold text-xs sm:text-[13px] tracking-wider drop-shadow-sm">
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-white/40 font-sora text-[11px] sm:text-xs font-medium">
              / {String(totalStories).padStart(2, '0')}
            </span>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 3. CENTER ARTWORK ZONE WITH SEAMLESS HORIZONTAL SLIDE TRANSITION    */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <main
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative z-30 w-full flex-1 flex flex-col items-center justify-center overflow-hidden my-auto px-4"
        >
          {/* Card Slide Stage */}
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] h-[clamp(300px,47dvh,430px)] flex items-center justify-center overflow-hidden rounded-[1.25rem]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={activeStory.id}
                custom={direction}
                variants={viewerSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-auto"
              >
                {/* The 9:16 Portrait Card */}
                <div className="relative h-full aspect-[9/16] rounded-[1.25rem] overflow-hidden transition-all duration-300 border border-white/25 ring-1 ring-[#C4943A]/30 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
                  <img
                    src={activeStory.image}
                    alt={activeStory.title}
                    loading="eager"
                    decoding="sync"
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />

                  {/* Subtle Sheen Gradient on Center Card */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10 pointer-events-none" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Left & Right Circular Navigation Arrow Buttons */}
          <div className="absolute inset-x-3 sm:inset-x-5 flex items-center justify-between pointer-events-none z-40">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              type="button"
              aria-label="Previous Story"
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl border border-white/25 flex items-center justify-center text-white/90 hover:text-white active:scale-85 transition-all shadow-[0_6px_20px_rgba(0,0,0,0.65)] cursor-pointer pointer-events-auto"
            >
              <ChevronLeft className="w-5 h-5 -ml-0.5" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              type="button"
              aria-label="Next Story"
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl border border-white/25 flex items-center justify-center text-white/90 hover:text-white active:scale-85 transition-all shadow-[0_6px_20px_rgba(0,0,0,0.65)] cursor-pointer pointer-events-auto"
            >
              <ChevronRight className="w-5 h-5 -mr-0.5" />
            </button>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* REFLECTIVE FLOOR STAGE UNDERNEATH CAROUSEL                    */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="w-full max-w-[340px] h-10 -mt-2 mx-auto relative pointer-events-none overflow-hidden">
            {/* Light Pool Glow */}
            <div
              className="absolute inset-x-12 top-0 h-6 rounded-full blur-xl opacity-35 transition-colors duration-500"
              style={{ backgroundColor: activeTheme.glowColor }}
            />
            {/* Specular Floor Reflection */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-40 [mask-image:radial-gradient(ellipse_at_top,white,transparent_75%)]" />
          </div>
        </main>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 4. PAGINATION & BOTTOM EDITORIAL INFORMATION                        */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <footer className="relative z-40 w-full px-4 sm:px-6 pt-1 pb-1 flex flex-col items-center">
          {/* Minimal Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 mb-2.5">
            {paginationDots.map((dotIdx) => {
              const isActive = dotIdx === currentIndex;
              return (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentIndex(dotIdx)}
                  type="button"
                  aria-label={`Go to story ${dotIdx + 1}`}
                  className="p-1 cursor-pointer pointer-events-auto"
                >
                  <motion.div
                    animate={{
                      width: isActive ? 20 : 6,
                      backgroundColor: isActive ? '#C4943A' : 'rgba(255, 255, 255, 0.25)',
                    }}
                    transition={{ duration: 0.25 }}
                    className="h-1.5 rounded-full"
                    style={{
                      boxShadow: isActive ? '0 0 8px rgba(196, 148, 58, 0.7)' : 'none',
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Single-line / Two-line Minimal Description */}
          <p className="text-white/75 font-sora text-[11px] sm:text-xs leading-relaxed max-w-[320px] text-center mx-auto text-balance px-2 drop-shadow-sm select-none">
            {getStoryDescription(activeStory)}
          </p>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileStoryViewer;
