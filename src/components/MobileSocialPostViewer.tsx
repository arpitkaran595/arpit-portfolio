import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { creativePosts, allCreativePosts, CreativePost } from '../data/portfolio';
import { viewerSlideVariants } from '../utils/viewerTransitions';

export interface MobileSocialPostViewerItem {
  id: string;
  title?: string;
  thumbnail: string;
  category?: string;
  description?: string;
  aspectRatio?: number;
  type?: string;
  isArchive?: boolean;
}

export interface MobileSocialPostViewerProps {
  isOpen: boolean;
  onClose: () => void;
  item: MobileSocialPostViewerItem | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// CIRCULAR WRAPPING LOGIC FOR 3D CAROUSEL
// ─────────────────────────────────────────────────────────────────────────────
function getWrappedOffset(index: number, current: number, total: number): number {
  return ((((index - current + total / 2) % total) + total) % total) - total / 2;
}

// ─────────────────────────────────────────────────────────────────────────────
// POST THEME & AMBIENT GLOW
// ─────────────────────────────────────────────────────────────────────────────
interface PostTheme {
  glow: string;
  ambient: string;
}

function getPostTheme(post: CreativePost): PostTheme {
  const title = (post.title || '').toLowerCase();
  const cat = (post.category || '').toLowerCase();
  const id = (post.id || '').toLowerCase();

  if (
    title.includes('ruby') ||
    cat.includes('jewelry') ||
    id === 'post-01' ||
    id === 'post-02' ||
    id === 'post-03'
  ) {
    return {
      glow: 'rgba(195, 28, 62, 0.32)',
      ambient: 'rgba(196, 148, 58, 0.20)',
    };
  }
  if (cat.includes('luxury') || cat.includes('gold')) {
    return {
      glow: 'rgba(196, 148, 58, 0.30)',
      ambient: 'rgba(235, 180, 85, 0.18)',
    };
  }
  if (cat.includes('product') || cat.includes('showcase')) {
    return {
      glow: 'rgba(215, 115, 45, 0.28)',
      ambient: 'rgba(245, 145, 70, 0.16)',
    };
  }
  return {
    glow: 'rgba(196, 148, 58, 0.28)',
    ambient: 'rgba(195, 28, 62, 0.18)',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// EDITORIAL POST METADATA HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function getPostTitle(post: CreativePost): string {
  if (post.id === 'post-03') return 'Ruby';
  return post.title || 'Creative Artwork';
}

function getPostSubtitle(post: CreativePost): string {
  if (post.id === 'post-03') return 'Social Media Creative';
  if (post.category && post.category !== 'Creative Design' && post.category !== 'Posters') {
    return post.category;
  }
  return 'Social Media Creative';
}

function getPostDescription(post: CreativePost): string {
  if (post.description) return post.description;
  const title = (post.title || '').toLowerCase();
  const cat = (post.category || '').toLowerCase();

  if (
    title.includes('ruby') ||
    post.id === 'post-01' ||
    post.id === 'post-02' ||
    post.id === 'post-03'
  ) {
    return 'A premium gemstone campaign designed around luxury, elegance and visual storytelling.';
  }
  if (cat.includes('jewelry') || cat.includes('gem')) {
    return 'A luxury gemstone & jewelry campaign crafted for elegance, prestige and high visual appeal.';
  }
  if (cat.includes('product') || cat.includes('showcase')) {
    return 'Precision product visual composition designed to stop the scroll and highlight craftsmanship.';
  }
  if (cat.includes('brand') || cat.includes('luxury')) {
    return 'Refined luxury brand storytelling combining minimalist aesthetics with editorial sophistication.';
  }
  if (cat.includes('editorial')) {
    return 'High-impact editorial campaign featuring premium art direction and harmonious visual balance.';
  }
  if (cat.includes('typography')) {
    return 'Dynamic typography composition designed for strong visual hierarchy and instant audience engagement.';
  }
  return 'A high-impact social media creative designed for maximum brand recall and visual storytelling.';
}

function getPostTags(post: CreativePost): string[] {
  const cat = (post.category || '').toLowerCase();
  const title = (post.title || '').toLowerCase();

  if (title.includes('ruby') || cat.includes('jewelry') || post.id === 'post-03') {
    return ['Instagram', 'Branding', 'Campaign'];
  }
  if (cat.includes('showcase') || cat.includes('product')) {
    return ['Instagram', 'Showcase', 'Commercial'];
  }
  if (cat.includes('editorial')) {
    return ['Instagram', 'Editorial', 'Art Direction'];
  }
  if (cat.includes('luxury')) {
    return ['Instagram', 'Luxury', 'Visual Identity'];
  }
  if (cat.includes('typography')) {
    return ['Instagram', 'Typography', 'Layout'];
  }
  return ['Instagram', 'Branding', 'Campaign'];
}

export const MobileSocialPostViewer: React.FC<MobileSocialPostViewerProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  // Construct playlist fallback
  const playlist = useMemo<CreativePost[]>(() => {
    if (!item) return creativePosts;
    if (item.isArchive) return allCreativePosts;
    const exists = creativePosts.some(
      (p) => p.id === item.id || p.image === item.thumbnail || p.title === item.title
    );
    if (exists) return creativePosts;

    const inAll = allCreativePosts.find(
      (p) => p.id === item.id || p.image === item.thumbnail || p.title === item.title
    );
    if (inAll) return allCreativePosts;

    const customPost: CreativePost = {
      id: item.id || 'custom-post',
      title: item.title || 'Creative Artwork',
      image: item.thumbnail,
      category: item.category || 'Social Media Creative',
      aspectRatio: item.aspectRatio || 0.8,
      description: item.description,
    };
    return [customPost, ...creativePosts];
  }, [item]);

  const totalPosts = playlist.length;

  // Resolve initial index matching the tapped item
  const initialIndex = useMemo(() => {
    if (!item) return 0;
    const foundIdx = playlist.findIndex(
      (p) => p.id === item.id || p.image === item.thumbnail || p.title === item.title
    );
    return foundIdx >= 0 ? foundIdx : 0;
  }, [item, playlist]);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  // Sync index on open
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setDirection(0);
      isTransitioningRef.current = false;
    }
  }, [isOpen, initialIndex]);

  // Derived current, previous, next posts
  const activePost = playlist[currentIndex] || playlist[0];
  const activeTheme = useMemo(() => getPostTheme(activePost), [activePost]);

  // Transition & Swipe Guards
  const isTransitioningRef = useRef(false);
  const wasSwipingRef = useRef(false);

  // Preload adjacent images so next/prev transitions have zero decode latency
  useEffect(() => {
    if (!isOpen || totalPosts <= 1) return;
    const nextItem = playlist[(currentIndex + 1) % totalPosts];
    const prevItem = playlist[(currentIndex - 1 + totalPosts) % totalPosts];
    if (nextItem?.image) {
      const img = new Image();
      img.src = nextItem.image;
    }
    if (prevItem?.image) {
      const img = new Image();
      img.src = prevItem.image;
    }
  }, [isOpen, currentIndex, totalPosts, playlist]);

  // Navigation handlers with debounce lock
  const handlePrevious = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalPosts) % totalPosts);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 340);
  }, [totalPosts]);

  const handleNext = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalPosts);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 340);
  }, [totalPosts]);

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
  }, [isOpen, onClose, handlePrevious, handleNext]);

  // Touch swipe support (both horizontal and vertical swipe gestures)
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);
  const touchDeltaY = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchDeltaX.current = 0;
    touchDeltaY.current = 0;
    wasSwipingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    touchDeltaX.current = currentX - touchStartX.current;
    touchDeltaY.current = currentY - touchStartY.current;

    if (Math.abs(touchDeltaX.current) > 10 || Math.abs(touchDeltaY.current) > 10) {
      wasSwipingRef.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null) return;
    const dx = touchDeltaX.current;
    const dy = touchDeltaY.current;

    // Both horizontal swipe and vertical flick navigate
    if (dx < -40 || dy < -45) {
      handleNext();
    } else if (dx > 40 || dy > 45) {
      handlePrevious();
    }

    touchStartX.current = null;
    touchStartY.current = null;
    touchDeltaX.current = 0;
    touchDeltaY.current = 0;

    // Keep wasSwipingRef true for 200ms to block synthetic click events on shifted cards
    setTimeout(() => {
      wasSwipingRef.current = false;
    }, 200);
  };

  // Filmstrip auto-scroll centering
  const filmstripContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const el = thumbnailRefs.current[currentIndex];
    const container = filmstripContainerRef.current;
    if (el && container) {
      const containerWidth = container.offsetWidth;
      const elOffsetLeft = el.offsetLeft;
      const elWidth = el.offsetWidth;
      const targetScrollLeft = elOffsetLeft - containerWidth / 2 + elWidth / 2;

      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth',
      });
    }
  }, [currentIndex]);

  // Transform calculation for 3D depth cards
  const getCardTransform = (offset: number) => {
    if (offset === 0) {
      return {
        x: '0%',
        y: '0px',
        scale: 1,
        rotateY: 0,
        z: 0,
        opacity: 1,
        filter: 'none',
        zIndex: 20,
        pointerEvents: 'auto' as const,
        shadow: '0 24px 60px -10px rgba(0,0,0,0.9), 0 0 35px rgba(196,148,58,0.18)',
      };
    }
    if (offset === -1) {
      return {
        x: '-58%',
        y: '4px',
        scale: 0.81,
        rotateY: 22,
        z: -60,
        opacity: 0.45,
        filter: 'brightness(0.65) blur(0.5px)',
        zIndex: 10,
        pointerEvents: 'auto' as const,
        shadow: '0 15px 35px -8px rgba(0,0,0,0.7)',
      };
    }
    if (offset === 1) {
      return {
        x: '58%',
        y: '4px',
        scale: 0.81,
        rotateY: -22,
        z: -60,
        opacity: 0.45,
        filter: 'brightness(0.65) blur(0.5px)',
        zIndex: 10,
        pointerEvents: 'auto' as const,
        shadow: '0 15px 35px -8px rgba(0,0,0,0.7)',
      };
    }
    const isLeft = offset < 0;
    return {
      x: isLeft ? '-120%' : '120%',
      y: '10px',
      scale: 0.65,
      rotateY: isLeft ? 35 : -35,
      z: -120,
      opacity: 0,
      filter: 'brightness(0.4) blur(2px)',
      zIndex: 0,
      pointerEvents: 'none' as const,
      shadow: 'none',
    };
  };

  if (!isOpen || !item) return null;

  const displayTitle = getPostTitle(activePost);
  const subtitle = getPostSubtitle(activePost);
  const description = getPostDescription(activePost);
  const tags = getPostTags(activePost);

  return (
    <AnimatePresence>
      <motion.div
        id="mobile-social-post-viewer-modal"
        role="dialog"
        aria-label="Creative Post Viewer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100000] bg-[#0D0C0B] flex flex-col justify-between overflow-hidden select-none touch-none"
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px), 10px)',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 10px)',
        }}
      >
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 1. DYNAMIC AMBIENT BACKDROP EFFECT                                  */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Blurred Artwork Atmosphere */}
          <motion.img
            key={activePost.image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.22 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            src={activePost.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-150 filter blur-[80px] pointer-events-none"
          />

          {/* Dynamic Theme Glow Overlay */}
          <div
            className="absolute inset-0 transition-all duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 38%, ${activeTheme.glow} 0%, ${activeTheme.ambient} 35%, transparent 70%)`,
            }}
          />

          {/* Deep Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D0C0B]/90 via-transparent via-50% to-[#0D0C0B]/95 pointer-events-none" />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 2. TOP HEADER ZONE                                                  */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <header className="relative z-50 w-full px-4 sm:px-6 pt-1 pb-1 flex flex-col shrink-0">
          {/* Top Row: ARPIT AK Branding (Left) & Circular Close Button (Right) */}
          <div className="w-full flex items-center justify-between relative">
            {/* Left: ARPIT AK Branding & Section Tag */}
            <div className="flex flex-col items-start pl-1">
              <div className="text-[12px] font-sora font-extrabold tracking-[0.22em] text-[#FAF3E8] uppercase drop-shadow-md">
                ARPIT <span className="text-[#C4943A]">AK</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-3.5 h-[1px] bg-[#C4943A]" />
                <span className="text-[8.5px] font-sora font-semibold tracking-[0.25em] text-[#C4943A] uppercase">
                  CREATIVE & SOCIAL MEDIA
                </span>
              </div>
            </div>

            {/* Right: Circular Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              type="button"
              aria-label="Close Creative Viewer"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white/85 hover:text-white active:scale-90 transition-all shadow-lg cursor-pointer pointer-events-auto"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Indicator: "03 / 18" */}
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className="text-[#C4943A] font-sora font-bold text-xs tracking-wider drop-shadow-sm">
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-white/40 font-sora text-xs font-normal tracking-wider">
              / {String(totalPosts).padStart(2, '0')}
            </span>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 3. CENTER ARTWORK ZONE WITH SEAMLESS HORIZONTAL SLIDE TRANSITION    */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <main
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative z-30 w-full flex-1 min-h-[200px] flex flex-col items-center justify-center my-auto px-4"
        >
          {/* Card Slide Stage */}
          <div className="relative w-full max-w-[340px] h-[clamp(210px,36dvh,340px)] flex items-center justify-center overflow-hidden rounded-[18px] sm:rounded-2xl">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={activePost.id}
                custom={direction}
                variants={viewerSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-auto"
              >
                {/* The 4:5 Portrait Artwork Card */}
                <div className="relative h-full aspect-[4/5] rounded-[18px] sm:rounded-2xl overflow-hidden transition-all duration-300 bg-[#121110] flex items-center justify-center border border-white/20 ring-1 ring-[#C4943A]/30 shadow-[0_16px_40px_rgba(0,0,0,0.85)]">
                  <img
                    src={activePost.image}
                    alt={activePost.title}
                    loading="eager"
                    decoding="sync"
                    className="w-full h-full object-contain select-none pointer-events-none"
                  />

                  {/* Subtle Sheen Gradient on Center Card */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10 pointer-events-none" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Left & Right Circular Navigation Chevron Buttons */}
          <div className="absolute inset-x-2 sm:inset-x-4 inset-y-0 flex items-center justify-between pointer-events-none z-50">
            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              type="button"
              aria-label="Previous Post"
              className="w-10 h-10 rounded-full bg-black/65 backdrop-blur-md border border-white/25 flex items-center justify-center text-white/90 hover:text-white active:scale-85 transition-all shadow-[0_6px_20px_rgba(0,0,0,0.7)] cursor-pointer pointer-events-auto"
            >
              <ChevronLeft className="w-5 h-5 -ml-0.5" />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              type="button"
              aria-label="Next Post"
              className="w-10 h-10 rounded-full bg-black/65 backdrop-blur-md border border-white/25 flex items-center justify-center text-white/90 hover:text-white active:scale-85 transition-all shadow-[0_6px_20px_rgba(0,0,0,0.7)] cursor-pointer pointer-events-auto"
            >
              <ChevronRight className="w-5 h-5 -mr-0.5" />
            </button>
          </div>
        </main>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 4. EDITORIAL INFO BLOCK ZONE                                        */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative z-20 w-full px-4 pt-1 pb-1 flex flex-col items-center shrink-0">
          {/* Main Title in Serif */}
          <h2 className="font-playfair text-[24px] sm:text-[27px] font-normal text-white text-center tracking-tight leading-tight px-2 drop-shadow-md">
            {displayTitle}
          </h2>

          {/* Subtitle in Warm Gold */}
          <p className="text-[#C4943A] font-sora text-[11.5px] sm:text-xs font-medium tracking-wide text-center mt-0.5 drop-shadow-sm">
            {subtitle}
          </p>

          {/* Minimal 1-2 Line Editorial Description */}
          <p className="text-[#FAF3E8]/70 font-sora text-[11px] sm:text-[11.5px] leading-relaxed max-w-[320px] text-center mx-auto mt-1.5 px-3 select-none">
            {description}
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
        {/* 5. THUMBNAIL FILMSTRIP REEL ZONE                                    */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <footer className="relative z-40 w-full px-2 pt-1 pb-1 shrink-0 overflow-hidden">
          <div
            ref={filmstripContainerRef}
            className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 px-4 scroll-smooth w-full"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {playlist.map((post, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={post.id}
                  ref={(el) => {
                    thumbnailRefs.current[idx] = el;
                  }}
                  onClick={() => setCurrentIndex(idx)}
                  type="button"
                  aria-label={`View artwork ${idx + 1}: ${post.title}`}
                  className="flex flex-col items-center shrink-0 cursor-pointer group focus:outline-none"
                >
                  {/* Thumbnail Card Box */}
                  <div
                    className={`w-[48px] h-[60px] sm:w-[56px] sm:h-[70px] shrink-0 rounded-xl overflow-hidden transition-all duration-300 relative bg-[#151413] ${
                      isActive
                        ? 'border-2 border-[#C4943A] shadow-[0_0_14px_rgba(196,148,58,0.5)] scale-105'
                        : 'border border-white/15 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={post.image}
                      alt=""
                      aria-hidden="true"
                      className="w-full h-full object-cover block pointer-events-none select-none"
                      loading="lazy"
                    />
                  </div>

                  {/* Index Label */}
                  <span
                    className={`text-[11px] font-sora mt-1 tracking-wider transition-colors ${
                      isActive
                        ? 'text-[#C4943A] font-bold'
                        : 'text-white/40 font-normal group-hover:text-white/70'
                    }`}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileSocialPostViewer;
