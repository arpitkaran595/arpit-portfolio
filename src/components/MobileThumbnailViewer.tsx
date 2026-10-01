import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { youtubeThumbnails, YoutubeThumbnail } from '../data/portfolio';
import { viewerSlideVariants } from '../utils/viewerTransitions';

export interface MobileThumbnailViewerItem {
  id: string;
  title?: string;
  thumbnail: string;
  category?: string;
  description?: string;
  aspectRatio?: number;
  type?: string;
}

export interface MobileThumbnailViewerProps {
  isOpen: boolean;
  onClose: () => void;
  item: MobileThumbnailViewerItem | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// CIRCULAR WRAPPING LOGIC FOR VERTICAL CAROUSEL
// ─────────────────────────────────────────────────────────────────────────────
function getWrappedOffset(index: number, current: number, total: number): number {
  return ((((index - current + total / 2) % total) + total) % total) - total / 2;
}

// ─────────────────────────────────────────────────────────────────────────────
// THUMBNAIL THEME & AMBIENT GLOW
// ─────────────────────────────────────────────────────────────────────────────
interface ThumbnailTheme {
  glow: string;
  ambient: string;
}

function getThumbnailTheme(item: YoutubeThumbnail): ThumbnailTheme {
  const title = (item.title || '').toLowerCase();
  const cat = (item.category || '').toLowerCase();
  const id = (item.id || '').toLowerCase();

  if (title.includes('comeback') || id === 'yt-1') {
    return {
      glow: 'rgba(225, 45, 45, 0.32)',
      ambient: 'rgba(196, 148, 58, 0.20)',
    };
  }
  if (title.includes('edit') || cat.includes('editing') || id === 'yt-2') {
    return {
      glow: 'rgba(45, 140, 220, 0.30)',
      ambient: 'rgba(196, 148, 58, 0.18)',
    };
  }
  if (title.includes('ai') || cat.includes('tech') || id === 'yt-3') {
    return {
      glow: 'rgba(150, 60, 220, 0.30)',
      ambient: 'rgba(70, 110, 230, 0.18)',
    };
  }
  if (title.includes('viral') || cat.includes('growth') || id === 'yt-4') {
    return {
      glow: 'rgba(230, 160, 40, 0.30)',
      ambient: 'rgba(215, 75, 45, 0.18)',
    };
  }
  if (title.includes('focus') || cat.includes('self-help') || id === 'yt-5') {
    return {
      glow: 'rgba(50, 160, 100, 0.30)',
      ambient: 'rgba(196, 148, 58, 0.18)',
    };
  }
  if (cat.includes('finance') || title.includes('millionaire') || id === 'yt-7') {
    return {
      glow: 'rgba(196, 148, 58, 0.32)',
      ambient: 'rgba(235, 180, 85, 0.20)',
    };
  }
  return {
    glow: 'rgba(196, 148, 58, 0.28)',
    ambient: 'rgba(215, 85, 45, 0.18)',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// EDITORIAL METADATA HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function getThumbnailDescription(item: YoutubeThumbnail): string {
  const title = (item.title || '').toLowerCase();
  const cat = (item.category || '').toLowerCase();

  if (title.includes('comeback') || item.id === 'yt-1') {
    return 'A motivational YouTube thumbnail designed to capture resilience, discipline and personal growth.';
  }
  if (title.includes('edit') || cat.includes('editing')) {
    return 'High-retention editing tutorial thumbnail highlighting workflow speed and creative mastery.';
  }
  if (title.includes('ai') || cat.includes('tech')) {
    return 'Futuristic high-contrast tech thumbnail engineered for peak click-through rate and curiosity.';
  }
  if (title.includes('viral') || cat.includes('growth')) {
    return 'Strategic YouTube growth thumbnail blending visual curiosity hooks with high contrast.';
  }
  if (title.includes('focus') || cat.includes('self-help')) {
    return 'Focused productivity composition designed to inspire discipline and cognitive clarity.';
  }
  if (title.includes('monetize') || title.includes('skills') || cat.includes('business')) {
    return 'Authority-driven business thumbnail designed to spotlight high-value skills and monetization.';
  }
  if (title.includes('millionaire') || cat.includes('finance')) {
    return 'High-impact financial storytelling thumbnail with bold typography and psychological contrast.';
  }
  if (title.includes('discipline') || cat.includes('productivity')) {
    return 'Action-oriented thumbnail engineered with strong focal clarity and motivational pacing.';
  }
  return `A high-CTR YouTube thumbnail crafted for ${item.category || 'content creation'} with bold visual hierarchy.`;
}

function getThumbnailTags(item: YoutubeThumbnail): string[] {
  const cat = item.category || 'Motivation';
  return ['YouTube', cat, 'Thumbnail Design'];
}

export const MobileThumbnailViewer: React.FC<MobileThumbnailViewerProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Playlist fallback from existing dataset
  const playlist = useMemo<YoutubeThumbnail[]>(() => {
    if (!item) return youtubeThumbnails;
    const exists = youtubeThumbnails.some(
      (t) => t.id === item.id || t.image === item.thumbnail || t.title === item.title
    );
    if (exists) return youtubeThumbnails;

    const customThumb: YoutubeThumbnail = {
      id: item.id || 'custom-yt',
      index: '01',
      title: item.title || 'YouTube Thumbnail',
      image: item.thumbnail,
      category: item.category || 'Motivation',
      aspectRatio: item.aspectRatio || 16 / 9,
    };
    return [customThumb, ...youtubeThumbnails];
  }, [item]);

  const totalThumbnails = playlist.length;

  // Initial index matching clicked item
  const initialIndex = useMemo(() => {
    if (!item) return 0;
    const foundIdx = playlist.findIndex(
      (t) => t.id === item.id || t.image === item.thumbnail || t.title === item.title
    );
    return foundIdx >= 0 ? foundIdx : 0;
  }, [item, playlist]);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const isTransitioningRef = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync index on open
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setDirection(0);
      isTransitioningRef.current = false;
      setIsFullscreen(false);
    }
  }, [isOpen, initialIndex]);

  // Preload adjacent images so next/prev transitions have zero decode latency
  useEffect(() => {
    if (!isOpen || totalThumbnails <= 1) return;
    const nextItem = playlist[(currentIndex + 1) % totalThumbnails];
    const prevItem = playlist[(currentIndex - 1 + totalThumbnails) % totalThumbnails];
    if (nextItem?.image) {
      const img = new Image();
      img.src = nextItem.image;
    }
    if (prevItem?.image) {
      const img = new Image();
      img.src = prevItem.image;
    }
  }, [isOpen, currentIndex, totalThumbnails, playlist]);

  // Derived active thumbnail and theme
  const activeThumbnail = playlist[currentIndex] || playlist[0];
  const activeTheme = useMemo(() => getThumbnailTheme(activeThumbnail), [activeThumbnail]);

  // Navigation handlers with debounce lock
  const handleNext = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalThumbnails);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 340);
  }, [totalThumbnails]);

  const handlePrevious = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalThumbnails) % totalThumbnails);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 340);
  }, [totalThumbnails]);

  // Fullscreen toggle logic
  const enterFullscreen = useCallback(async () => {
    setIsFullscreen(true);
    try {
      const root = containerRef.current || document.documentElement;
      if (root.requestFullscreen) {
        await root.requestFullscreen();
      } else if ((root as any).webkitRequestFullscreen) {
        await (root as any).webkitRequestFullscreen();
      }
    } catch {
      // Fullscreen API blocked or unsupported
    }

    try {
      if (screen.orientation && (screen.orientation as any).lock) {
        await (screen.orientation as any).lock('landscape');
      }
    } catch {
      // Orientation lock not supported or denied
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    setIsFullscreen(false);
    try {
      if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      }
    } catch {
      // Exit fullscreen safe fallback
    }

    try {
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    } catch {
      // Unlock safe fallback
    }
  }, []);

  // Listen to browser fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Keyboard navigation & scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          exitFullscreen();
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevious();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if ((window as any).lenis) {
      (window as any).lenis.stop();
    }
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isFullscreen, onClose, handleNext, handlePrevious, exitFullscreen]);

  // Touch swipe support: Swipe LEFT = Next, Swipe RIGHT = Previous (horizontal model)
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX !== null) {
      setTouchDeltaX(e.touches[0].clientX - touchStartX);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;
    if (touchDeltaX < -40) {
      // Swiped LEFT -> Move to NEXT
      handleNext();
    } else if (touchDeltaX > 40) {
      // Swiped RIGHT -> Move to PREVIOUS
      handlePrevious();
    }
    setTouchStartX(null);
    setTouchDeltaX(0);
  };

  // Card transform logic for vertical 3-card stack
  // Next is above (y < 0), Previous is below (y > 0)
  const getCardTransform = (offset: number) => {
    if (offset === 0) {
      // Current Center Card
      return {
        y: '0%',
        scale: 1,
        opacity: 1,
        filter: 'none',
        zIndex: 20,
        pointerEvents: 'auto' as const,
        shadow: '0 20px 50px rgba(0,0,0,0.85), 0 0 28px rgba(196,148,58,0.35)',
      };
    }
    if (offset === 1) {
      // Next Card (Positioned Above Current)
      return {
        y: '-58%',
        scale: 0.85,
        opacity: 0.45,
        filter: 'brightness(0.65) blur(0.5px)',
        zIndex: 10,
        pointerEvents: 'auto' as const,
        shadow: '0 10px 30px rgba(0,0,0,0.6)',
      };
    }
    if (offset === -1) {
      // Previous Card (Positioned Below Current)
      return {
        y: '58%',
        scale: 0.85,
        opacity: 0.45,
        filter: 'brightness(0.65) blur(0.5px)',
        zIndex: 10,
        pointerEvents: 'auto' as const,
        shadow: '0 10px 30px rgba(0,0,0,0.6)',
      };
    }
    // Cards outside immediate 3
    const isAbove = offset > 0;
    return {
      y: isAbove ? '-120%' : '120%',
      scale: 0.7,
      opacity: 0,
      filter: 'brightness(0.4) blur(2px)',
      zIndex: 0,
      pointerEvents: 'none' as const,
      shadow: 'none',
    };
  };

  if (!isOpen || !item) return null;

  const titleText = activeThumbnail.title || 'YouTube Thumbnail';
  const descriptionText = getThumbnailDescription(activeThumbnail);
  const tags = getThumbnailTags(activeThumbnail);

  return (
    <AnimatePresence>
      <div
        ref={containerRef}
        id="mobile-thumbnail-viewer-modal"
        role="dialog"
        aria-label="Mobile Thumbnail Viewer"
        className="fixed inset-0 z-[100000] bg-[#0A0908] flex flex-col justify-between overflow-hidden select-none"
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px), 10px)',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 10px)',
        }}
      >
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 1. DYNAMIC AMBIENT BACKDROP EFFECT                                  */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <motion.img
            key={activeThumbnail.image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.22 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            src={activeThumbnail.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-150 filter blur-[80px] pointer-events-none"
          />

          <div
            className="absolute inset-0 transition-all duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 42%, ${activeTheme.glow} 0%, ${activeTheme.ambient} 38%, transparent 72%)`,
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0908]/90 via-transparent via-50% to-[#0A0908]/95 pointer-events-none" />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 2. TOP HEADER ZONE                                                  */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <header className="relative z-50 w-full px-4 sm:px-6 pt-1 pb-1 flex items-center justify-between shrink-0">
          {/* Left: ARPIT AK Branding & THUMBNAIL Section Tag */}
          <div className="flex flex-col items-start pl-1">
            <div className="text-[12px] font-sora font-extrabold tracking-[0.22em] text-[#FAF3E8] uppercase drop-shadow-md">
              ARPIT <span className="text-[#C4943A]">AK</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-3.5 h-[1px] bg-[#C4943A]" />
              <span className="text-[8.5px] font-sora font-semibold tracking-[0.25em] text-[#C4943A] uppercase">
                THUMBNAIL
              </span>
            </div>
          </div>

          {/* Right: Progress Counter & Circular Close Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-[#C4943A] font-sora font-bold text-xs tracking-wider drop-shadow-sm">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-white/40 font-sora text-xs font-normal tracking-wider">
                / {String(totalThumbnails).padStart(2, '0')}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              type="button"
              aria-label="Close Thumbnail Viewer"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white/85 hover:text-white active:scale-90 transition-all shadow-lg cursor-pointer pointer-events-auto"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 3. HORIZONTAL THUMBNAIL STAGE ZONE                                  */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <main
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative z-30 w-full flex-1 min-h-[260px] flex flex-col items-center justify-center my-auto overflow-visible touch-none px-4"
        >
          {/* 16:9 Landscape Card Slide Stage */}
          <div className="relative w-[clamp(280px,86vw,370px)] h-[clamp(158px,48.5vw,208px)] flex items-center justify-center overflow-hidden rounded-[16px] sm:rounded-[18px]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={activeThumbnail.id}
                custom={direction}
                variants={viewerSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-auto"
              >
                {/* The 16:9 Landscape Card */}
                <div
                  style={{
                    boxShadow: '0 20px 50px rgba(0,0,0,0.85), 0 0 28px rgba(196,148,58,0.35)',
                  }}
                  className="relative w-full h-full aspect-[16/9] rounded-[16px] sm:rounded-[18px] overflow-hidden bg-[#141210] flex items-center justify-center border border-[#C4943A] ring-1 ring-[#C4943A]/40"
                >
                  <img
                    src={activeThumbnail.image}
                    alt={activeThumbnail.title}
                    loading="eager"
                    decoding="sync"
                    className="w-full h-full object-contain select-none pointer-events-none"
                  />

                  {/* Subtle Sheen Gradient on Center Card */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10 pointer-events-none" />

                  {/* Gold CURRENT Pill Badge */}
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 z-30 px-3 py-0.5 rounded-full bg-[#1A1612] border border-[#C4943A] text-[9px] font-sora font-bold tracking-wider text-[#C4943A] uppercase shadow-md select-none">
                    CURRENT
                  </div>

                  {/* Full-Screen Button on Current Thumbnail */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      enterFullscreen();
                    }}
                    type="button"
                    aria-label="Enter Fullscreen"
                    className="absolute bottom-2.5 right-2.5 z-30 w-8 h-8 rounded-full bg-black/75 backdrop-blur-md border border-white/25 hover:border-[#C4943A] text-white/90 hover:text-white flex items-center justify-center shadow-lg active:scale-90 transition-all cursor-pointer pointer-events-auto"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Left & Right Circular Navigation Chevron Buttons (Horizontal Model) */}
          <div className="absolute inset-x-2 sm:inset-x-4 inset-y-0 flex items-center justify-between pointer-events-none z-50">
            {/* Previous Button (Left) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              type="button"
              aria-label="Previous Thumbnail"
              className="w-10 h-10 rounded-full bg-black/65 backdrop-blur-md border border-white/25 flex items-center justify-center text-white/90 hover:text-white active:scale-85 transition-all shadow-[0_6px_20px_rgba(0,0,0,0.7)] cursor-pointer pointer-events-auto"
            >
              <ChevronLeft className="w-5 h-5 -ml-0.5" />
            </button>

            {/* Next Button (Right) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              type="button"
              aria-label="Next Thumbnail"
              className="w-10 h-10 rounded-full bg-black/65 backdrop-blur-md border border-white/25 flex items-center justify-center text-white/90 hover:text-white active:scale-85 transition-all shadow-[0_6px_20px_rgba(0,0,0,0.7)] cursor-pointer pointer-events-auto"
            >
              <ChevronRight className="w-5 h-5 -mr-0.5" />
            </button>
          </div>
        </main>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 4. CURRENT THUMBNAIL INFORMATION BLOCK                              */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative z-40 w-full px-4 pt-1 pb-1 flex flex-col items-center shrink-0">
          {/* Eyebrow in Warm Gold */}
          <span className="text-[#C4943A] font-sora text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase drop-shadow-sm">
            YOUTUBE THUMBNAIL
          </span>

          {/* Main Title in Serif */}
          <h2 className="font-playfair text-[22px] sm:text-[25px] font-normal text-white text-center tracking-tight leading-tight mt-0.5 px-2 drop-shadow-md">
            {titleText}
          </h2>

          {/* Concise 1-2 Line Description */}
          <p className="text-[#FAF3E8]/70 font-sora text-[11px] sm:text-[11.5px] leading-relaxed max-w-[340px] text-center mx-auto mt-1 px-3 select-none">
            {descriptionText}
          </p>

          {/* Metadata Pill Tags with Gold Dots */}
          <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.07] border border-white/10 text-[10.5px] text-white/80 font-sora font-medium select-none shadow-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C4943A] shrink-0 shadow-[0_0_6px_rgba(196,148,58,0.8)]" />
                <span>{tag}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 5. FULL-SCREEN THUMBNAIL MODE OVERLAY (SECTIONS 8, 9, 10)            */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="fixed inset-0 z-[100002] bg-black flex items-center justify-center overflow-hidden touch-none"
            >
              {/* Exit Fullscreen Floating Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  exitFullscreen();
                }}
                type="button"
                aria-label="Exit Fullscreen"
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white/90 hover:text-white flex items-center justify-center active:scale-90 transition-all shadow-xl cursor-pointer pointer-events-auto"
                style={{
                  top: 'max(env(safe-area-inset-top, 0px), 16px)',
                  right: 'max(env(safe-area-inset-right, 0px), 16px)',
                }}
              >
                <Minimize2 className="w-5 h-5" />
              </button>

              {/* Fullscreen Artwork with Contain (Never Cropped or Stretched) */}
              <motion.img
                key={activeThumbnail.image}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                src={activeThumbnail.image}
                alt={activeThumbnail.title}
                className="w-full h-full object-contain select-none pointer-events-none p-2"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};

export default MobileThumbnailViewer;
