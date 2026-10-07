import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { storyPosters, allStoryPosters, StoryPoster } from '../data/portfolio';
import { viewerSlideVariants } from '../utils/viewerTransitions';

export interface StoryViewerItem {
  id: string;
  title?: string;
  thumbnail: string;
  category?: string;
  description?: string;
  isArchive?: boolean;
}

interface StoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
  item: StoryViewerItem | null;
  onExitComplete?: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ isOpen, onClose, item, onExitComplete }) => {
  const storyList = useMemo(() => {
    if (!item) return storyPosters;
    if (item.isArchive) return allStoryPosters;
    const exists = storyPosters.some(
      (s) => s.id === item.id || s.image === item.thumbnail || s.title === item.title
    );
    return exists ? storyPosters : allStoryPosters;
  }, [item]);

  const totalStories = storyList.length;

  // Resolve initial story index matching clicked item
  const initialIndex = useMemo(() => {
    if (!item) return 0;
    const foundIdx = storyList.findIndex(
      (s) => s.id === item.id || s.image === item.thumbnail || s.title === item.title
    );
    return foundIdx >= 0 ? foundIdx : 0;
  }, [item, storyList]);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const isTransitioningRef = useRef(false);

  // Sync index when viewer opens or item changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setDirection(0);
      isTransitioningRef.current = false;
    }
  }, [isOpen, initialIndex]);

  // Preload adjacent images so next/prev transitions have zero decode latency
  useEffect(() => {
    if (!isOpen || totalStories <= 1) return;
    const nextItem = storyList[(currentIndex + 1) % totalStories];
    const prevItem = storyList[(currentIndex - 1 + totalStories) % totalStories];
    if (nextItem?.image) {
      const img = new Image();
      img.src = nextItem.image;
    }
    if (prevItem?.image) {
      const img = new Image();
      img.src = prevItem.image;
    }
  }, [isOpen, currentIndex, totalStories, storyList]);

  // Derived current, previous, and next stories
  const activeStory: StoryPoster = storyList[currentIndex] || storyList[0];
  const prevIndex = (currentIndex - 1 + totalStories) % totalStories;
  const nextIndex = (currentIndex + 1) % totalStories;
  const prevStory = storyList[prevIndex];
  const nextStory = storyList[nextIndex];

  // Navigation callbacks
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

  // Body scroll & Lenis locking for the full lifetime of the modal (including exit transitions)
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    if ((window as any).lenis) {
      (window as any).lenis.stop();
    }

    return () => {
      document.body.style.overflow = '';
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
    };
  }, []);

  // Keyboard navigation & wheel listeners while actively open
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

    const lastWheelTime = { current: 0 };
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTime.current < 350) return;
      if (Math.abs(e.deltaY) > 25 || Math.abs(e.deltaX) > 25) {
        if (e.deltaY > 25 || e.deltaX > 25) {
          handleNext();
          lastWheelTime.current = now;
        } else if (e.deltaY < -25 || e.deltaX < -25) {
          handlePrevious();
          lastWheelTime.current = now;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen, onClose, handlePrevious, handleNext]);

  // Touch swipe support for mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
    setTouchStartX(null);
  };

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {isOpen && item && (
        <>
          {/* 1. Backdrop (Unified Dark Gallery Backdrop with Subtle Blur) */}
          <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] bg-black/75 viewer-backdrop backdrop-blur-md"
        onClick={onClose}
      />

      {/* 2. Modal Shell Container (Aligned with Video Viewer) */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className="w-full max-w-[1300px] xl:max-w-[1340px] max-h-[94vh] h-[92vh] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-[0_32px_90px_-20px_rgba(0,0,0,0.65)] pointer-events-auto border border-white/10 relative"
        >
          {/* ═══════════════════════════════════════════════════════════ */}
          {/* LEFT: MAIN STORY VIEWPORT WITH AMBIENT BACKDROP */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="w-full md:w-[60%] lg:w-[63%] bg-[#080808] relative flex items-center justify-center overflow-hidden min-h-[46vh] md:min-h-full select-none"
          >
            {/* A. Ambient Blurred Backdrop */}
            <img
              src={activeStory.image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover scale-125 filter blur-3xl opacity-30 pointer-events-none select-none transition-opacity duration-300"
            />

            {/* B. Dark Vignette Overlay */}
            <div className="absolute inset-0 bg-black/45 pointer-events-none" />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 60%, rgba(0,0,0,0.92) 100%)',
              }}
            />

            {/* C. Top-Left Brand Logo & Dynamic Indicator */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 select-none pointer-events-none px-2.5 py-1 sm:px-0 sm:py-0 rounded-lg bg-black/45 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none border border-white/10 sm:border-transparent">
              <div className="font-playfair text-xs sm:text-[13px] font-bold tracking-[0.16em] text-white/90 uppercase drop-shadow-md">
                ARPIT <span className="text-[#C4943A]">AK</span>
              </div>
              <div className="font-sora text-[10.5px] sm:text-xs font-semibold text-white/60 tracking-widest mt-0.5 drop-shadow-sm">
                {String(currentIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(totalStories).padStart(2, '0')}
              </div>
            </div>

            {/* D. PREVIOUS STORY PREVIEW (Desktop Left Side - Clickable, No Separate Arrow) */}
            <div className="hidden xl:flex flex-col items-center absolute left-5 2xl:left-8 top-1/2 -translate-y-1/2 z-30 select-none group/prev pointer-events-auto">
              <span className="text-[8.5px] font-sora font-semibold tracking-[0.22em] text-white/45 uppercase mb-2 flex items-center gap-1 group-hover/prev:text-[#C4943A] transition-colors">
                <span>←</span> PREV
              </span>
              <div
                onClick={handlePrevious}
                data-testid="story-prev-card"
                className="relative w-16 2xl:w-20 aspect-[9/16] rounded-xl overflow-hidden border border-white/15 bg-black/50 shadow-xl opacity-40 group-hover/prev:opacity-100 filter blur-[0.4px] group-hover/prev:blur-none transition-all duration-300 group-hover/prev:scale-105 group-hover/prev:-translate-x-1 group-hover/prev:border-[#C4943A]/60 cursor-pointer flex items-center justify-center"
              >
                <img
                  src={prevStory.image}
                  alt={prevStory.title}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              </div>
              <div
                onClick={handlePrevious}
                className="text-center mt-1.5 max-w-[85px] cursor-pointer"
              >
                <div className="text-[10px] font-sora font-medium text-white/50 line-clamp-1 group-hover/prev:text-white leading-tight">
                  {prevStory.title}
                </div>
              </div>
            </div>

            {/* E. FOREGROUND SHARP 9:16 STORY ARTWORK (Dominant focus) */}
            <div className="relative z-10 flex items-center justify-center p-3 sm:p-6 pointer-events-none">
              <div className="relative max-h-[70vh] md:max-h-[78vh] h-[70vh] md:h-[78vh] max-w-full aspect-[9/16] rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)] drop-shadow-2xl border border-white/10 bg-[#0C0C0E] overflow-hidden pointer-events-auto">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={activeStory.id}
                    custom={direction}
                    variants={viewerSlideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 w-full h-full flex items-center justify-center"
                  >
                    <img
                      src={activeStory.image}
                      alt={activeStory.title}
                      className="w-full h-full object-contain select-none"
                      loading="eager"
                      decoding="sync"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* F. NEXT STORY PREVIEW (Desktop Right Side - Clickable, No Separate Arrow) */}
            <div className="hidden xl:flex flex-col items-center absolute right-5 2xl:right-8 top-1/2 -translate-y-1/2 z-30 select-none group/next pointer-events-auto">
              <span className="text-[8.5px] font-sora font-semibold tracking-[0.22em] text-white/45 uppercase mb-2 flex items-center gap-1 group-hover/next:text-[#C4943A] transition-colors">
                NEXT <span>→</span>
              </span>
              <div
                onClick={handleNext}
                data-testid="story-next-card"
                className="relative w-16 2xl:w-20 aspect-[9/16] rounded-xl overflow-hidden border border-white/15 bg-black/50 shadow-xl opacity-40 group-hover/next:opacity-100 filter blur-[0.4px] group-hover/next:blur-none transition-all duration-300 group-hover/next:scale-105 group-hover/next:translate-x-1 group-hover/next:border-[#C4943A]/60 cursor-pointer flex items-center justify-center"
              >
                <img
                  src={nextStory.image}
                  alt={nextStory.title}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              </div>
              <div
                onClick={handleNext}
                className="text-center mt-1.5 max-w-[85px] cursor-pointer"
              >
                <div className="text-[10px] font-sora font-medium text-white/50 line-clamp-1 group-hover/next:text-white leading-tight">
                  {nextStory.title}
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* RIGHT: EDITORIAL INFORMATION PANEL */}
          {/* Signature warm-white → pale blue atmospheric gradient */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div
            className="w-full md:w-[40%] lg:w-[37%] p-6 sm:p-8 xl:p-10 relative flex flex-col overflow-y-auto z-10 select-none text-[#1A1A1A]"
            style={{
              background:
                'radial-gradient(ellipse at 100% 100%, rgba(216, 241, 253, 0.45) 0%, rgba(240, 248, 254, 0.22) 50%, transparent 80%), linear-gradient(155deg, #FDFBF8 0%, #FAF6F0 45%, #EFF5FA 85%, #E2EFF8 100%)',
            }}
          >
            {/* 1. TOP HEADER ROW: Eyebrow on left & CLOSE on right */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <span className="text-[10px] sm:text-[11px] font-sora font-bold tracking-[0.22em] uppercase text-[#B8860B]">
                STORY
              </span>

              {/* Close Button with Text + Circle Icon */}
              <button
                onClick={onClose}
                type="button"
                aria-label="Close viewer"
                className="group inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full hover:bg-black/5 active:scale-95 transition-all cursor-pointer text-[#1A1A1A]"
              >
                <span className="text-[10.5px] font-sora font-semibold tracking-[0.18em] uppercase text-charcoal-500 group-hover:text-charcoal-900 transition-colors">
                  CLOSE
                </span>
                <div className="w-7 h-7 rounded-full bg-[#1A1A1A]/5 group-hover:bg-[#1A1A1A]/10 flex items-center justify-center text-[#1A1A1A] transition-colors">
                  <X size={15} />
                </div>
              </button>
            </div>

            {/* 2. STORY TITLE & CATEGORY */}
            <div className="mb-4">
              <h2 className="font-playfair text-2xl sm:text-3xl xl:text-[2.25rem] text-[#1A1A1A] font-bold tracking-tight leading-[1.12] mb-1.5">
                {activeStory.title}
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-500 font-sora font-medium">
                {activeStory.category || 'Visual Story & Portrait Art'}
              </p>
            </div>

            {/* 3. SUBTLE GOLD ACCENT DIVIDER */}
            <div className="w-12 h-[1.5px] bg-[#C4943A]/50 mb-4 sm:mb-5" />

            {/* 4. STORY DESCRIPTION / EDITORIAL DETAILS */}
            <p className="text-xs sm:text-[13px] text-charcoal-600 font-sora leading-relaxed mb-6 sm:mb-7">
              {activeStory.description ||
                'Full-bleed 9:16 vertical storytelling artwork designed with editorial typography, striking character lighting, and high-conversion visual hierarchy.'}
            </p>

            {/* 5. STORY FORMAT BADGES */}
            <div className="mb-6 sm:mb-7">
              <span className="text-[10px] tracking-[0.20em] uppercase font-sora font-bold text-charcoal-400 mb-2.5 block">
                FORMAT & DETAILS
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 sm:px-3.5 py-1 rounded-full bg-[#EFE9DF]/80 border border-[#E5D7C3]/70 text-[10px] sm:text-[10.5px] font-sora font-medium text-charcoal-700 tracking-wide">
                  9:16 VERTICAL
                </span>
                {activeStory.category && (
                  <span className="px-3 sm:px-3.5 py-1 rounded-full bg-[#EFE9DF]/80 border border-[#E5D7C3]/70 text-[10px] sm:text-[10.5px] font-sora font-medium text-charcoal-700 tracking-wide">
                    {activeStory.category}
                  </span>
                )}
                <span className="px-3 sm:px-3.5 py-1 rounded-full bg-white/70 border border-[#E5D7C3]/70 text-[10px] sm:text-[10.5px] font-sora font-semibold text-charcoal-600 tracking-widest">
                  {String(currentIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(totalStories).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* 6. NEXT STORY SECTION (Bottom of Right Panel) */}
            {nextStory && (
              <div className="mt-auto pt-4 border-t border-charcoal-900/10 select-none">
                <span className="text-[10px] tracking-[0.20em] uppercase font-sora font-bold text-charcoal-400 mb-2.5 block">
                  NEXT STORY
                </span>
                <div
                  onClick={handleNext}
                  className="group/upnext flex items-center gap-3.5 p-2 sm:p-2.5 rounded-2xl hover:bg-white/70 active:scale-[0.99] transition-all cursor-pointer border border-transparent hover:border-black/5"
                >
                  <div className="w-11 h-15 rounded-lg overflow-hidden bg-black/20 shrink-0 border border-black/5 shadow-xs aspect-[9/16]">
                    <img
                      src={nextStory.image}
                      alt={nextStory.title}
                      className="w-full h-full object-cover group-hover/upnext:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-[13px] font-sora font-semibold text-[#1A1A1A] line-clamp-1 group-hover/upnext:text-[#C4943A] transition-colors">
                      {nextStory.title}
                    </h4>
                    <p className="text-[10.5px] sm:text-[11px] font-sora text-charcoal-500 line-clamp-1">
                      {nextStory.category || '9:16 Story Artwork'}
                    </p>
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/5 group-hover/upnext:bg-[#C4943A] group-hover/upnext:text-white flex items-center justify-center text-charcoal-600 transition-colors shrink-0">
                    <ChevronRight size={15} />
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Navigation Thumbnail Row (md:hidden) */}
            <div className="md:hidden flex items-center justify-center gap-6 pt-4 mt-2 border-t border-charcoal-900/10">
              <div
                onClick={handlePrevious}
                data-testid="story-prev-card-mobile"
                className="flex items-center gap-2 cursor-pointer group/prevmob opacity-70 hover:opacity-100 active:scale-95 transition-all"
              >
                <div className="w-8 h-12 rounded border border-black/10 overflow-hidden bg-black/20 shadow-xs aspect-[9/16]">
                  <img src={prevStory.image} alt="Previous" className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-sora font-semibold tracking-wider text-charcoal-700 uppercase">
                  Prev
                </span>
              </div>

              <div className="h-4 w-[1px] bg-charcoal-900/20" />

              <div
                onClick={handleNext}
                data-testid="story-next-card-mobile"
                className="flex items-center gap-2 cursor-pointer group/nextmob opacity-70 hover:opacity-100 active:scale-95 transition-all"
              >
                <span className="text-[10px] font-sora font-semibold tracking-wider text-charcoal-700 uppercase">
                  Next
                </span>
                <div className="w-8 h-12 rounded border border-black/10 overflow-hidden bg-black/20 shadow-xs aspect-[9/16]">
                  <img src={nextStory.image} alt="Next" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )}
</AnimatePresence>
  );
};

export default StoryViewer;
