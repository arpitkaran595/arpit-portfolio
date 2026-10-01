import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { creativePosts, CreativePost } from '../data/portfolio';

export interface SocialPostViewerItem {
  id: string;
  title?: string;
  thumbnail: string;
  category?: string;
  description?: string;
  aspectRatio?: number;
}

interface SocialPostViewerProps {
  isOpen: boolean;
  onClose: () => void;
  item: SocialPostViewerItem | null;
}

const SocialPostViewer: React.FC<SocialPostViewerProps> = ({ isOpen, onClose, item }) => {
  const totalPosts = creativePosts.length;

  // Resolve initial post index matching clicked item
  const initialIndex = useMemo(() => {
    if (!item) return 0;
    const foundIdx = creativePosts.findIndex(
      (p) => p.id === item.id || p.image === item.thumbnail || p.title === item.title
    );
    return foundIdx >= 0 ? foundIdx : 0;
  }, [item]);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Sync index when viewer opens or item changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Derived current, previous, and next posts
  const activePost: CreativePost = creativePosts[currentIndex] || creativePosts[0];
  const prevIndex = (currentIndex - 1 + totalPosts) % totalPosts;
  const nextIndex = (currentIndex + 1) % totalPosts;
  const prevPost = creativePosts[prevIndex];
  const nextPost = creativePosts[nextIndex];

  // Navigation callbacks
  const handlePrevious = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + totalPosts) % totalPosts);
  }, [totalPosts]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % totalPosts);
  }, [totalPosts]);

  // Keyboard navigation & scroll locking
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

  // Map of measured image dimensions (e.g. { 'post-01': 0.8003 })
  const [measuredRatios, setMeasuredRatios] = useState<Record<string, number>>({});

  const handleImageLoad = useCallback((postId: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      const computedRatio = img.naturalWidth / img.naturalHeight;
      setMeasuredRatios((prev) => {
        if (prev[postId] && Math.abs(prev[postId] - computedRatio) < 0.001) return prev;
        return { ...prev, [postId]: computedRatio };
      });
    }
  }, []);

  // Helper to determine aspect ratio for any post:
  // 1. Measured natural ratio from real image dimensions
  // 2. Real aspectRatio property from dataset
  // 3. Fallback to 0.8 (standard 4:5 social media portrait)
  const getPostRatio = useCallback(
    (post: CreativePost | null | undefined): number => {
      if (!post) return 0.8;
      if (measuredRatios[post.id]) {
        return measuredRatios[post.id];
      }
      if (typeof post.aspectRatio === 'number' && post.aspectRatio > 0) {
        return post.aspectRatio;
      }
      return 0.8;
    },
    [measuredRatios]
  );

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

  if (!isOpen || !item) return null;

  const activeRatio = getPostRatio(activePost);
  const isSquare = Math.abs(activeRatio - 1) < 0.05;
  const is4x5 = Math.abs(activeRatio - 0.8) < 0.05;
  const prevRatio = getPostRatio(prevPost);
  const nextRatio = getPostRatio(nextPost);

  return (
    <AnimatePresence>
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
          {/* LEFT: MAIN ARTWORK VIEWPORT WITH AMBIENT BACKDROP */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="w-full md:w-[60%] lg:w-[63%] bg-[#080808] relative flex items-center justify-center overflow-hidden min-h-[46vh] md:min-h-full select-none"
          >
            {/* A. Ambient Blurred Backdrop */}
            <img
              src={activePost.image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover scale-125 filter blur-3xl opacity-25 pointer-events-none select-none transition-opacity duration-300"
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
                {String(currentIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(totalPosts).padStart(2, '0')}
              </div>
            </div>

            {/* D. PREVIOUS POST PREVIEW (Desktop Left Side - Clickable, No Separate Arrow) */}
            <div className="hidden xl:flex flex-col items-center absolute left-5 2xl:left-8 top-1/2 -translate-y-1/2 z-30 select-none group/prev pointer-events-auto">
              <span className="text-[8.5px] font-sora font-semibold tracking-[0.22em] text-white/45 uppercase mb-2 flex items-center gap-1 group-hover/prev:text-[#C4943A] transition-colors">
                <span>←</span> PREV
              </span>
              <div
                onClick={handlePrevious}
                data-testid="post-prev-card"
                style={{ aspectRatio: `${prevRatio}` }}
                className="relative w-16 2xl:w-20 rounded-xl overflow-hidden border border-white/15 bg-black/50 shadow-xl opacity-40 group-hover/prev:opacity-100 filter blur-[0.4px] group-hover/prev:blur-none transition-all duration-300 group-hover/prev:scale-105 group-hover/prev:-translate-x-1 group-hover/prev:border-[#C4943A]/60 cursor-pointer flex items-center justify-center"
              >
                <img
                  src={prevPost.image}
                  alt={prevPost.title || 'Previous post'}
                  onLoad={(e) => handleImageLoad(prevPost.id, e)}
                  className="w-full h-full object-contain select-none pointer-events-none"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              </div>
              <div
                onClick={handlePrevious}
                className="text-center mt-1.5 max-w-[85px] cursor-pointer"
              >
                <div className="text-[10px] font-sora font-medium text-white/50 line-clamp-1 group-hover/prev:text-white leading-tight">
                  {prevPost.title || 'Previous'}
                </div>
              </div>
            </div>

            {/* E. FOREGROUND SHARP POST ARTWORK (Adaptive Natural Aspect Ratio + Smooth Morphing) */}
            <div className="relative z-10 flex items-center justify-center p-3 sm:p-6 pointer-events-none">
              <motion.div
                layout
                transition={{
                  layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                }}
                style={{
                  aspectRatio: `${activeRatio}`,
                  maxHeight: isSquare ? 'min(64vh, 580px)' : 'min(72vh, 660px)',
                  maxWidth: isSquare ? 'min(64vh, 580px)' : `min(calc(72vh * ${activeRatio}), ${Math.round(660 * activeRatio)}px)`,
                }}
                className="relative z-20 w-full h-auto flex items-center justify-center rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)] border border-white/10 bg-[#121214] pointer-events-auto"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activePost.id}
                    src={activePost.image}
                    alt={activePost.title || 'Social media post'}
                    onLoad={(e) => handleImageLoad(activePost.id, e)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="w-full h-full object-contain select-none"
                    loading="eager"
                    decoding="async"
                  />
                </AnimatePresence>
              </motion.div>
            </div>

            {/* F. NEXT POST PREVIEW (Desktop Right Side - Clickable, No Separate Arrow) */}
            <div className="hidden xl:flex flex-col items-center absolute right-5 2xl:right-8 top-1/2 -translate-y-1/2 z-30 select-none group/next pointer-events-auto">
              <span className="text-[8.5px] font-sora font-semibold tracking-[0.22em] text-white/45 uppercase mb-2 flex items-center gap-1 group-hover/next:text-[#C4943A] transition-colors">
                NEXT <span>→</span>
              </span>
              <div
                onClick={handleNext}
                data-testid="post-next-card"
                style={{ aspectRatio: `${nextRatio}` }}
                className="relative w-16 2xl:w-20 rounded-xl overflow-hidden border border-white/15 bg-black/50 shadow-xl opacity-40 group-hover/next:opacity-100 filter blur-[0.4px] group-hover/next:blur-none transition-all duration-300 group-hover/next:scale-105 group-hover/next:translate-x-1 group-hover/next:border-[#C4943A]/60 cursor-pointer flex items-center justify-center"
              >
                <img
                  src={nextPost.image}
                  alt={nextPost.title || 'Next post'}
                  onLoad={(e) => handleImageLoad(nextPost.id, e)}
                  className="w-full h-full object-contain select-none pointer-events-none"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              </div>
              <div
                onClick={handleNext}
                className="text-center mt-1.5 max-w-[85px] cursor-pointer"
              >
                <div className="text-[10px] font-sora font-medium text-white/50 line-clamp-1 group-hover/next:text-white leading-tight">
                  {nextPost.title || 'Next'}
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
                SOCIAL MEDIA
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

            {/* 2. POST TITLE & CATEGORY */}
            <div className="mb-4">
              <h2 className="font-playfair text-2xl sm:text-3xl xl:text-[2.25rem] text-[#1A1A1A] font-bold tracking-tight leading-[1.12] mb-1.5">
                {activePost.title}
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-500 font-sora font-medium">
                {activePost.category || 'Creative Campaign & Social Poster'}
              </p>
            </div>

            {/* 3. SUBTLE GOLD ACCENT DIVIDER */}
            <div className="w-12 h-[1.5px] bg-[#C4943A]/50 mb-4 sm:mb-5" />

            {/* 4. POST DESCRIPTION / EDITORIAL DETAILS */}
            <p className="text-xs sm:text-[13px] text-charcoal-600 font-sora leading-relaxed mb-6 sm:mb-7">
              {activePost.description ||
                'Tailored social media campaign artwork blending deliberate typography hierarchy, refined product photography, and high-retention aesthetic direction.'}
            </p>

            {/* 5. FORMAT & DETAILS BADGES */}
            <div className="mb-6 sm:mb-7">
              <span className="text-[10px] tracking-[0.20em] uppercase font-sora font-bold text-charcoal-400 mb-2.5 block">
                FORMAT & DETAILS
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 sm:px-3.5 py-1 rounded-full bg-[#EFE9DF]/80 border border-[#E5D7C3]/70 text-[10px] sm:text-[10.5px] font-sora font-medium text-charcoal-700 tracking-wide uppercase">
                  {isSquare ? '1:1 SQUARE' : is4x5 ? '4:5 POST' : `${activeRatio.toFixed(2)} RATIO`}
                </span>
                {activePost.category && (
                  <span className="px-3 sm:px-3.5 py-1 rounded-full bg-[#EFE9DF]/80 border border-[#E5D7C3]/70 text-[10px] sm:text-[10.5px] font-sora font-medium text-charcoal-700 tracking-wide">
                    {activePost.category}
                  </span>
                )}
                <span className="px-3 sm:px-3.5 py-1 rounded-full bg-white/70 border border-[#E5D7C3]/70 text-[10px] sm:text-[10.5px] font-sora font-semibold text-charcoal-600 tracking-widest">
                  {String(currentIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(totalPosts).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* 6. NEXT POST SECTION (Bottom of Right Panel) */}
            {nextPost && (
              <div className="mt-auto pt-4 border-t border-charcoal-900/10 select-none">
                <span className="text-[10px] tracking-[0.20em] uppercase font-sora font-bold text-charcoal-400 mb-2.5 block">
                  NEXT POST
                </span>
                <div
                  onClick={handleNext}
                  className="group/upnext flex items-center gap-3.5 p-2 sm:p-2.5 rounded-2xl hover:bg-white/70 active:scale-[0.99] transition-all cursor-pointer border border-transparent hover:border-black/5"
                >
                  <div
                    style={{ aspectRatio: `${nextRatio}` }}
                    className="w-12 rounded-lg overflow-hidden bg-black/20 shrink-0 border border-black/5 shadow-xs flex items-center justify-center"
                  >
                    <img
                      src={nextPost.image}
                      alt={nextPost.title || 'Next post'}
                      onLoad={(e) => handleImageLoad(nextPost.id, e)}
                      className="w-full h-full object-contain group-hover/upnext:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-[13px] font-sora font-semibold text-[#1A1A1A] line-clamp-1 group-hover/upnext:text-[#C4943A] transition-colors">
                      {nextPost.title || 'Next'}
                    </h4>
                    <p className="text-[10.5px] sm:text-[11px] font-sora text-charcoal-500 line-clamp-1">
                      {nextPost.category || 'Social Media'}
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
                data-testid="post-prev-card-mobile"
                className="flex items-center gap-2 cursor-pointer group/prevmob opacity-70 hover:opacity-100 active:scale-95 transition-all"
              >
                <div
                  style={{ aspectRatio: `${prevRatio}` }}
                  className="w-9 rounded border border-black/10 overflow-hidden bg-black/20 shadow-xs flex items-center justify-center"
                >
                  <img src={prevPost.image} alt="Previous" className="w-full h-full object-contain" />
                </div>
                <span className="text-[10px] font-sora font-semibold tracking-wider text-charcoal-700 uppercase">
                  Prev
                </span>
              </div>

              <div className="h-4 w-[1px] bg-charcoal-900/20" />

              <div
                onClick={handleNext}
                data-testid="post-next-card-mobile"
                className="flex items-center gap-2 cursor-pointer group/nextmob opacity-70 hover:opacity-100 active:scale-95 transition-all"
              >
                <span className="text-[10px] font-sora font-semibold tracking-wider text-charcoal-700 uppercase">
                  Next
                </span>
                <div
                  style={{ aspectRatio: `${nextRatio}` }}
                  className="w-9 rounded border border-black/10 overflow-hidden bg-black/20 shadow-xs flex items-center justify-center"
                >
                  <img src={nextPost.image} alt="Next" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SocialPostViewer;

