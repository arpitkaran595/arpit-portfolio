import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { youtubeThumbnails, YoutubeThumbnail } from '../data/portfolio';
import { MediaViewerItem } from './MediaViewer';
import { viewerSlideVariants } from '../utils/viewerTransitions';

interface ThumbnailViewerProps {
  isOpen: boolean;
  onClose: () => void;
  item: MediaViewerItem | null;
}

export const ThumbnailViewer: React.FC<ThumbnailViewerProps> = ({ isOpen, onClose, item }) => {
  const totalThumbnails = youtubeThumbnails.length;

  // Find index of current thumbnail from dataset
  const initialIndex = useMemo(() => {
    if (!item) return 0;
    const found = youtubeThumbnails.findIndex((t) => t.id === item.id);
    return found !== -1 ? found : 0;
  }, [item]);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const isTransitioningRef = useRef(false);

  // Sync index whenever item changes
  useEffect(() => {
    if (isOpen && item) {
      const found = youtubeThumbnails.findIndex((t) => t.id === item.id);
      if (found !== -1) {
        setCurrentIndex(found);
        setDirection(0);
        isTransitioningRef.current = false;
      }
    }
  }, [isOpen, item]);

  // Preload adjacent images so next/prev transitions have zero decode latency
  useEffect(() => {
    if (!isOpen || totalThumbnails <= 1) return;
    const nextItem = youtubeThumbnails[(currentIndex + 1) % totalThumbnails];
    const prevItem = youtubeThumbnails[(currentIndex - 1 + totalThumbnails) % totalThumbnails];
    if (nextItem?.image) {
      const img = new Image();
      img.src = nextItem.image;
    }
    if (prevItem?.image) {
      const img = new Image();
      img.src = prevItem.image;
    }
  }, [isOpen, currentIndex, totalThumbnails]);

  // Derived active, previous, next thumbnails
  const activeThumbnail: YoutubeThumbnail = youtubeThumbnails[currentIndex] || youtubeThumbnails[0];

  // Navigation handlers with debounce lock
  const handlePrevious = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalThumbnails) % totalThumbnails);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 340);
  }, [totalThumbnails]);

  const handleNext = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalThumbnails);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 340);
  }, [totalThumbnails]);

  // Keyboard navigation & scroll lock & wheel navigation
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

    document.body.style.overflow = 'hidden';
    if ((window as any).lenis) {
      (window as any).lenis.stop();
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      document.body.style.overflow = '';
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
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
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
    setTouchStartX(null);
  };

  if (!isOpen || !item) return null;

  return (
    <AnimatePresence>
      {/* 1. Backdrop (Unified Dark Gallery Backdrop with Ambient Blur) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="fixed inset-0 z-[100] bg-black/85 viewer-backdrop backdrop-blur-md"
        onClick={onClose}
      />

      {/* 2. Ambient Blurred Background Layer (Derived from current active thumbnail) */}
      <div className="fixed inset-0 z-[101] pointer-events-none overflow-hidden select-none">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`ambient-${activeThumbnail.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center scale-115 filter blur-3xl opacity-25"
              style={{
                backgroundImage: `url(${activeThumbnail.image})`,
              }}
            />
            {/* Deep Vignette & Dark Overlay to eliminate bright distraction and keep background subtle */}
            <div className="absolute inset-0 bg-black/55" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.78) 65%, rgba(0,0,0,0.96) 100%)',
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. Full-Screen Interactive Stage */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="fixed inset-0 z-[102] flex flex-col justify-between p-3 sm:p-6 md:p-8 pointer-events-none select-none overflow-hidden"
      >
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* A. TOP BAR: IDENTITY (LEFT) + CLOSE BUTTON (RIGHT)         */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="w-full flex items-center justify-between pointer-events-auto z-20">
          {/* Top-Left Brand Logo & Dynamic Indicator */}
          <div className="px-2.5 py-1 sm:px-0 sm:py-0 rounded-lg bg-black/45 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none border border-white/10 sm:border-transparent">
            <div className="font-playfair text-xs sm:text-[13px] font-bold tracking-[0.16em] text-white/90 uppercase drop-shadow-md">
              ARPIT <span className="text-[#C4943A]">AK</span>
            </div>
            <div className="font-sora text-[10px] sm:text-[11px] font-semibold text-white/60 tracking-widest mt-0.5 drop-shadow-sm">
              16:9 THUMBNAIL&nbsp;•&nbsp;
              <span className="text-white/85">
                {String(currentIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(totalThumbnails).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Top-Right Close Button */}
          <button
            onClick={onClose}
            type="button"
            aria-label="Close thumbnail viewer"
            data-testid="thumbnail-close-btn"
            className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 backdrop-blur-md text-white/80 hover:text-white transition-all duration-200 cursor-pointer shadow-lg"
          >
            <span className="text-[11px] sm:text-xs font-sora font-medium tracking-wider uppercase">
              CLOSE
            </span>
            <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
              <X className="w-3.2 sm:w-3.5 h-3.2 sm:h-3.5 text-white" />
            </div>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* B. CENTER HERO: 16:9 ARTWORK WITH FLANKING NAVIGATION      */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="relative w-full flex-1 flex items-center justify-center min-h-0 my-auto pointer-events-auto">
          {/* Previous Button (Desktop Left Flank) */}
          <div className="hidden sm:flex absolute left-2 md:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30">
            <button
              onClick={handlePrevious}
              type="button"
              aria-label="Previous thumbnail"
              data-testid="thumbnail-prev-btn"
              className="group relative w-11 h-11 md:w-12 md:h-12 rounded-full bg-black/60 hover:bg-black/85 active:scale-90 border border-white/20 hover:border-[#C4943A]/70 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.5)] flex items-center justify-center text-white/80 hover:text-[#C4943A] transition-all duration-300 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 md:w-5.5 md:h-5.5 transform transition-transform group-hover:-translate-x-0.5" />
            </button>
          </div>

          {/* Main 16:9 Artwork Container */}
          <div className="relative w-full max-w-[1140px] px-2 sm:px-12 md:px-16 lg:px-20 flex items-center justify-center">
            {/* 16:9 Aspect Frame */}
            <div className="relative w-full aspect-[16/9] max-h-[60vh] sm:max-h-[66vh] md:max-h-[70vh] rounded-xl sm:rounded-2xl overflow-hidden border border-white/15 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] bg-[#0C0D0E] flex items-center justify-center">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={activeThumbnail.id}
                  custom={direction}
                  variants={viewerSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 w-full h-full flex items-center justify-center"
                >
                  <img
                    src={activeThumbnail.image}
                    alt={activeThumbnail.title}
                    className="w-full h-full object-contain select-none"
                    draggable={false}
                    loading="eager"
                    decoding="sync"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Delicate Gloss Border */}
              <div
                className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none ring-1 ring-inset ring-white/20 z-10"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.01) 40%, transparent 100%)',
                }}
              />
            </div>
          </div>

          {/* Next Button (Desktop Right Flank) */}
          <div className="hidden sm:flex absolute right-2 md:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30">
            <button
              onClick={handleNext}
              type="button"
              aria-label="Next thumbnail"
              data-testid="thumbnail-next-btn"
              className="group relative w-11 h-11 md:w-12 md:h-12 rounded-full bg-black/60 hover:bg-black/85 active:scale-90 border border-white/20 hover:border-[#C4943A]/70 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.5)] flex items-center justify-center text-white/80 hover:text-[#C4943A] transition-all duration-300 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 md:w-5.5 md:h-5.5 transform transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* C. BOTTOM AREA: COMPACT EDITORIAL PILL + MOBILE NAV CONTROLS */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="w-full flex flex-col items-center justify-center pointer-events-auto z-20 pb-1 sm:pb-2">
          {/* 1. COMPACT EDITORIAL INFORMATION PILL */}
          <motion.div
            layout
            key={`pill-${activeThumbnail.id}`}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 sm:gap-3 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-[0_12px_32px_-6px_rgba(0,0,0,0.45)] border border-[#E5D7C3]/80 backdrop-blur-md max-w-[94vw] sm:max-w-[85vw] md:max-w-[760px] overflow-hidden whitespace-nowrap select-none"
            style={{
              background:
                'radial-gradient(ellipse at 100% 100%, rgba(216, 241, 253, 0.50) 0%, rgba(240, 248, 254, 0.25) 50%, transparent 80%), linear-gradient(155deg, #FDFBF8 0%, #FAF6F0 50%, #EFF5FA 100%)',
            }}
          >
            {/* Title */}
            <h3 className="font-playfair font-bold text-[13px] sm:text-[14.5px] text-[#1A1A1A] tracking-[-0.01em] truncate max-w-[180px] sm:max-w-[320px]">
              {activeThumbnail.title}
            </h3>

            {/* Accent Dot */}
            <span className="text-[#C4943A] text-xs font-bold shrink-0">•</span>

            {/* Category */}
            <span className="font-sora font-semibold text-[10px] sm:text-[11px] text-[#C4943A] uppercase tracking-wider shrink-0">
              {activeThumbnail.category || 'YouTube'}
            </span>

            {/* Accent Dot */}
            <span className="hidden xs:inline text-[#C4943A] text-xs font-bold shrink-0">•</span>

            {/* 16:9 Format Indicator */}
            <span className="hidden xs:inline font-sora font-medium text-[9.5px] sm:text-[10.5px] text-charcoal-500 uppercase tracking-wide shrink-0">
              16:9 THUMBNAIL
            </span>

            {/* Views badge if present */}
            {activeThumbnail.views && (
              <>
                <span className="hidden md:inline text-[#C4943A] text-xs font-bold shrink-0">•</span>
                <span className="hidden md:inline font-sora font-semibold text-[10px] text-charcoal-600 shrink-0">
                  {activeThumbnail.views} Views
                </span>
              </>
            )}

            {/* Accent Dot */}
            <span className="text-[#C4943A] text-xs font-bold shrink-0">•</span>

            {/* Dynamic Counter */}
            <span className="font-sora font-bold text-[10.5px] sm:text-[11.5px] text-[#1A1A1A] tracking-widest shrink-0">
              {String(currentIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(totalThumbnails).padStart(2, '0')}
            </span>
          </motion.div>

          {/* 2. MOBILE DIRECTIONAL CONTROLS (Only visible on mobile screens) */}
          <div className="flex sm:hidden items-center justify-center gap-4 mt-3">
            <button
              onClick={handlePrevious}
              type="button"
              aria-label="Previous thumbnail"
              data-testid="thumbnail-prev-mobile"
              className="w-10 h-10 rounded-full bg-black/60 active:scale-90 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/85 transition-transform"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-sora font-medium tracking-widest text-white/60 uppercase">
              SWIPE OR TAP
            </span>
            <button
              onClick={handleNext}
              type="button"
              aria-label="Next thumbnail"
              data-testid="thumbnail-next-mobile"
              className="w-10 h-10 rounded-full bg-black/60 active:scale-90 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/85 transition-transform"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default ThumbnailViewer;
