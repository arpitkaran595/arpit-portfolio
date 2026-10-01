import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  MotionValue,
} from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Video,
  Eye,
  Heart,
  Sparkles,
  Maximize2,
} from 'lucide-react';
import MediaViewer from './MediaViewer';
import {
  youtubeThumbnails,
  thumbnailSectionData,
  YoutubeThumbnail,
} from '../data/portfolio';
import { useArchive } from '../context/ArchiveContext';
import { getOptimizedImageUrl } from '../utils/imageOptimization';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// MATHEMATICAL WRAPPING & 3D PERSPECTIVE FAN TRANSFORMATIONS (16:9 Landscape)
// ─────────────────────────────────────────────────────────────────────────────

function getWrappedOffset(index: number, p: number, N: number): number {
  return ((((index - p + N / 2) % N) + N) % N) - N / 2;
}

interface Transform3D {
  x: number;
  y: number;
  z: number;
  scale: number;
  rotateY: number;
  opacity: number;
  zIndex: number;
  shadow: string;
}

function calculateThumbnailTransform(
  u: number,
  screenWidth: number
): Transform3D {
  const absU = Math.abs(u);

  // Precision responsive horizontal spacing matching the 16:9 thumbnail proportions
  let stepX = 250;
  let stepY = 8;

  if (screenWidth < 640) {
    stepX = 95;
    stepY = 4;
  } else if (screenWidth < 768) {
    stepX = 135;
    stepY = 5;
  } else if (screenWidth < 1024) {
    stepX = 170;
    stepY = 6;
  } else if (screenWidth < 1280) {
    stepX = 205;
    stepY = 7;
  } else if (screenWidth < 1536) {
    stepX = 230;
    stepY = 8;
  } else {
    stepX = 250;
    stepY = 9;
  }

  // 1. Horizontal position (Center card overlaps inner cards naturally)
  let x = 0;
  if (absU <= 1) {
    x = u * stepX;
  } else if (absU <= 2) {
    x = Math.sign(u) * (stepX + (absU - 1) * (stepX * 0.84));
  } else {
    x = Math.sign(u) * (stepX * 1.84 + (absU - 2) * (stepX * 0.70));
  }

  // 2. Vertical position (Side cards sit with subtle organic parabolic curve)
  const y = (absU * absU * 0.4 + absU * 0.6) * stepY;

  // 3. TranslateZ depth (Center card is foremost in 3D perspective)
  const z = -Math.pow(absU, 1.15) * 55;

  // 4. Scale (Center = 1.0, Inner = ~0.85, Outer = ~0.68)
  let scale = 1;
  if (screenWidth < 640) {
    scale = absU <= 1 ? 1 - absU * 0.18 : Math.max(0.52, 0.82 - (absU - 1) * 0.16);
  } else {
    if (absU <= 1) {
      scale = 1 - absU * 0.15;
    } else if (absU <= 2) {
      scale = 0.85 - (absU - 1) * 0.17;
    } else {
      scale = Math.max(0.46, 0.68 - (absU - 2) * 0.14);
    }
  }

  // 5. RotateY (3D Fan: Left cards tilt toward center, Right cards tilt toward center)
  let rotateY = 0;
  if (screenWidth < 640) {
    rotateY = absU <= 1 ? -u * 5 : Math.sign(-u) * 5;
  } else {
    if (absU <= 1) {
      rotateY = -u * 7.5;
    } else if (absU <= 2) {
      rotateY = Math.sign(-u) * (7.5 + (absU - 1) * 6.0);
    } else {
      rotateY = Math.sign(-u) * 13.5;
    }
  }

  // 6. Opacity (Center = 1.0, Inner = ~0.86, Outer = ~0.58, beyond 2.6 = 0)
  let opacity = 1;
  if (screenWidth < 640) {
    opacity = absU <= 1 ? 1 - absU * 0.5 : 0;
  } else {
    if (absU <= 1) {
      opacity = 1 - absU * 0.14;
    } else if (absU <= 2) {
      opacity = 0.86 - (absU - 1) * 0.28;
    } else if (absU <= 2.6) {
      opacity = Math.max(0, 0.58 - (absU - 2) * (0.58 / 0.6));
    } else {
      opacity = 0;
    }
  }

  // 7. Z-Index (Stacking order: Active center is highest, side cards lower)
  const zIndex = Math.round(100 - absU * 25);

  // 8. Box Shadow Depth
  let shadow =
    '0 24px 50px -10px rgba(45, 38, 30, 0.24), 0 8px 18px -4px rgba(45, 38, 30, 0.12)';
  if (absU > 0.5 && absU <= 1.5) {
    shadow = '0 14px 32px -6px rgba(45, 38, 30, 0.18)';
  } else if (absU > 1.5) {
    shadow = '0 8px 20px -4px rgba(45, 38, 30, 0.12)';
  }

  return {
    x,
    y,
    z,
    scale,
    rotateY,
    opacity,
    zIndex,
    shadow,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// THUMBNAIL CARD COMPONENT (16:9 Landscape Artwork in 3D Space)
// ─────────────────────────────────────────────────────────────────────────────
interface ThumbnailCardProps {
  item: YoutubeThumbnail;
  index: number;
  progress: MotionValue<number>;
  totalCount: number;
  screenWidth: number;
  onCardClick: (index: number, item: YoutubeThumbnail) => void;
}

const ThumbnailCard: React.FC<ThumbnailCardProps> = ({
  item,
  index,
  progress,
  totalCount,
  screenWidth,
  onCardClick,
}) => {
  const x = useTransform(progress, (p) => {
    const u = getWrappedOffset(index, p, totalCount);
    return calculateThumbnailTransform(u, screenWidth).x;
  });

  const y = useTransform(progress, (p) => {
    const u = getWrappedOffset(index, p, totalCount);
    return calculateThumbnailTransform(u, screenWidth).y;
  });

  const z = useTransform(progress, (p) => {
    const u = getWrappedOffset(index, p, totalCount);
    return calculateThumbnailTransform(u, screenWidth).z;
  });

  const scale = useTransform(progress, (p) => {
    const u = getWrappedOffset(index, p, totalCount);
    return calculateThumbnailTransform(u, screenWidth).scale;
  });

  const rotateY = useTransform(progress, (p) => {
    const u = getWrappedOffset(index, p, totalCount);
    return calculateThumbnailTransform(u, screenWidth).rotateY;
  });

  const opacity = useTransform(progress, (p) => {
    const u = getWrappedOffset(index, p, totalCount);
    return calculateThumbnailTransform(u, screenWidth).opacity;
  });

  const zIndex = useTransform(progress, (p) => {
    const u = getWrappedOffset(index, p, totalCount);
    return calculateThumbnailTransform(u, screenWidth).zIndex;
  });

  const boxShadow = useTransform(progress, (p) => {
    const u = getWrappedOffset(index, p, totalCount);
    return calculateThumbnailTransform(u, screenWidth).shadow;
  });

  const pointerEvents = useTransform(progress, (p) => {
    const u = getWrappedOffset(index, p, totalCount);
    const absU = Math.abs(u);
    return absU <= (screenWidth < 640 ? 0.8 : 2.2) ? 'auto' : 'none';
  });

  return (
    <motion.div
      style={{
        x,
        y,
        z,
        scale,
        rotateY,
        opacity,
        zIndex,
        boxShadow,
        pointerEvents: pointerEvents as any,
        transformStyle: 'preserve-3d',
        transformOrigin: 'center bottom',
      }}
      onClick={() => onCardClick(index, item)}
      className="absolute aspect-[16/9] w-[280px] sm:w-[350px] md:w-[420px] lg:w-[480px] xl:w-[540px] 2xl:w-[600px] rounded-[16px] sm:rounded-[20px] lg:rounded-[22px] overflow-hidden bg-[#1A1714] border border-white/70 ring-1 ring-black/[0.08] cursor-pointer will-change-transform select-none transition-shadow duration-300"
    >
      <div className="relative w-full h-full group">
        <img
          src={getOptimizedImageUrl(item.image, 800)}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          draggable={false}
        />

        {/* Ambient Top & Bottom Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

        {/* Category Tag Top-Left */}
        <div className="absolute top-2.5 sm:top-3.5 left-2.5 sm:left-3.5 z-10">
          <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[9px] sm:text-[10px] font-sora font-semibold tracking-wider uppercase text-gold-400 border border-gold-400/30">
            {item.category || 'YouTube'}
          </span>
        </div>

        {/* Lightbox Trigger Top-Right */}
        <div className="absolute top-2.5 sm:top-3.5 right-2.5 sm:right-3.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/30 text-white flex items-center justify-center">
            <Maximize2 className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Title and Index Bottom Overlay */}
        <div className="absolute bottom-2.5 sm:bottom-3.5 left-3 sm:left-4 right-3 sm:right-4 z-10">
          <span className="text-[9px] sm:text-[10px] font-sora tracking-widest text-gold-400 uppercase font-semibold block">
            #{item.index}
          </span>
          <h4 className="font-playfair text-xs sm:text-sm md:text-base text-white font-bold truncate drop-shadow">
            {item.title}
          </h4>
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// THUMBNAILS SECTION MASTER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const ThumbnailsSection: React.FC = () => {
  const { openArchive } = useArchive();
  const sectionRef = useRef<HTMLElement>(null);
  const carouselAreaRef = useRef<HTMLDivElement>(null);
  const totalThumbnails = youtubeThumbnails.length;

  const [selectedThumbnail, setSelectedThumbnail] =
    useState<YoutubeThumbnail | null>(null);
  const [activeDot, setActiveDot] = useState(0);
  const [screenWidth, setScreenWidth] = useState(1440);

  // Framer Motion continuous scroll progress
  const progress = useMotionValue(0);
  const isAnimatingRef = useRef(false);

  // Responsive width tracking
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Entrance GSAP animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (!prefersReduced) {
        gsap.fromTo(
          '.thumb-fade-el',
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            },
          }
        );
      } else {
        gsap.set('.thumb-fade-el', { opacity: 1, y: 0 });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Sync active dot
  useEffect(() => {
    const unsubscribe = progress.on('change', (latest) => {
      const normalized =
        (((Math.round(latest) % totalThumbnails) + totalThumbnails) %
          totalThumbnails);
      setActiveDot(normalized % 5);
    });
    return () => unsubscribe();
  }, [progress, totalThumbnails]);

  // Navigation Controls (Circular, smooth)
  const navigateTo = useCallback(
    (newTarget: number) => {
      const currentP = progress.get();
      const diff = newTarget - currentP;
      const wrappedDiff =
        ((((diff + totalThumbnails / 2) % totalThumbnails) +
          totalThumbnails) %
          totalThumbnails) -
        totalThumbnails / 2;
      const targetP = currentP + wrappedDiff;

      isAnimatingRef.current = true;
      animate(progress, targetP, {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });
    },
    [progress, totalThumbnails]
  );

  const handleNext = useCallback(() => {
    const currentP = progress.get();
    const nearest = Math.round(currentP);
    navigateTo(nearest + 1);
  }, [navigateTo, progress]);

  const handlePrev = useCallback(() => {
    const currentP = progress.get();
    const nearest = Math.round(currentP);
    navigateTo(nearest - 1);
  }, [navigateTo, progress]);

  const handleCardClick = useCallback(
    (cardIndex: number, item: YoutubeThumbnail) => {
      const currentP = progress.get();
      const offset = getWrappedOffset(cardIndex, currentP, totalThumbnails);
      if (Math.abs(offset) > 0.3) {
        navigateTo(currentP + offset);
      } else {
        setSelectedThumbnail(item);
      }
    },
    [navigateTo, progress, totalThumbnails]
  );

  // Drag / Pointer tracking
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartProgressRef = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartProgressRef.current = progress.get();
    progress.stop();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    const stepX = screenWidth < 640 ? 110 : 200;
    const progressDelta = -deltaX / stepX;
    progress.set(dragStartProgressRef.current + progressDelta);
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const currentP = progress.get();
    const nearest = Math.round(currentP);
    animate(progress, nearest, {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  const getStatIcon = (icon: string) => {
    switch (icon) {
      case 'video':
        return <Video className="w-4 h-4 text-gold-500" />;
      case 'eye':
        return <Eye className="w-4 h-4 text-gold-500" />;
      case 'sparkles':
        return <Sparkles className="w-4 h-4 text-gold-500" />;
      default:
        return <Heart className="w-4 h-4 text-gold-500" />;
    }
  };

  return (
    <section
      id="thumbnails"
      ref={sectionRef}
      className="relative w-full min-h-[100svh] lg:h-[100svh] scroll-mt-16 pt-16 sm:pt-20 lg:pt-14 pb-8 sm:pb-10 lg:pb-8 overflow-hidden bg-[#FAF3E8] z-[10] select-none flex flex-col justify-between"
      style={{
        background:
          'linear-gradient(to bottom, #FAF3E8 0%, #FAF5EE 40%, #FAF3E8 80%, #FAF3E8 100%)',
      }}
    >
      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 1. ATMOSPHERIC BACKDROP */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 48%, rgba(246, 215, 178, 0.18) 0%, rgba(250, 243, 232, 0.05) 55%, transparent 75%)',
        }}
      />

      <div
        className="absolute inset-0 flex justify-center pointer-events-none overflow-hidden opacity-15"
        style={{
          maskImage:
            'linear-gradient(to bottom, black 0%, black 65%, transparent 95%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 0%, black 65%, transparent 95%)',
        }}
      >
        <img
          src="/assets/atmospheric-mist.webp"
          alt=""
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Decorative Cloud Accents */}
      <div
        className="absolute -bottom-6 -left-16 sm:-bottom-8 sm:-left-24 w-[380px] sm:w-[480px] lg:w-[580px] pointer-events-none select-none opacity-30 z-0"
        style={{
          maskImage:
            'linear-gradient(to bottom, black 0%, black 35%, rgba(0,0,0,0.4) 60%, transparent 85%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 0%, black 35%, rgba(0,0,0,0.4) 60%, transparent 85%)',
        }}
      >
        <img
          src="/assets/cloud-left.webp"
          alt=""
          className="w-full h-auto object-contain mix-blend-multiply"
          draggable={false}
        />
      </div>

      <div
        className="absolute -bottom-6 -right-16 sm:-bottom-8 sm:-right-24 w-[380px] sm:w-[480px] lg:w-[580px] pointer-events-none select-none opacity-30 z-0"
        style={{
          maskImage:
            'linear-gradient(to bottom, black 0%, black 35%, rgba(0,0,0,0.4) 60%, transparent 85%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 0%, black 35%, rgba(0,0,0,0.4) 60%, transparent 85%)',
        }}
      >
        <img
          src="/assets/cloud-right.webp"
          alt=""
          className="w-full h-auto object-contain mix-blend-multiply"
          draggable={false}
        />
      </div>

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 2. MAIN SECTION CONTENT */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <div className="max-w-[1480px] w-full mx-auto px-4 sm:px-8 lg:px-12 flex-1 flex flex-col justify-between relative z-10">
        {/* EDITORIAL HEADER */}
        <div className="w-full flex flex-col items-center text-center select-text z-20 thumb-fade-el pt-1 sm:pt-2">
          <span className="text-gold-400 text-xs sm:text-[13px] tracking-[0.22em] font-sora font-semibold uppercase block">
            {thumbnailSectionData.eyebrow}
          </span>

          <div className="w-10 sm:w-12 h-[2px] bg-gold-400 mt-2 mb-2 sm:mb-2.5 rounded-full" />

          <h2 className="font-playfair text-[clamp(2.1rem,3.4vw,3.4rem)] text-charcoal-800 leading-[1.05] tracking-tight font-bold">
            {thumbnailSectionData.headingLine1}{' '}
            <span className="text-gold-400 font-playfair font-bold">
              {thumbnailSectionData.headingHighlight}
            </span>
          </h2>

          <p className="text-charcoal-400 font-sora text-xs sm:text-sm leading-relaxed max-w-[500px] mx-auto mt-1.5 text-balance">
            {thumbnailSectionData.description}
          </p>

          <button
            type="button"
            onClick={() => openArchive('THUMBNAILS')}
            className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-sora font-semibold tracking-[0.16em] uppercase text-charcoal-800 hover:text-gold-400 group transition-colors relative pb-0.5 mt-2.5 mx-auto border-b border-charcoal-800/80 hover:border-gold-400 cursor-pointer"
          >
            <span>VIEW ALL THUMBNAILS</span>
            <span className="transform transition-transform duration-300 group-hover:translate-x-1.5 text-gold-400 text-sm font-bold">
              →
            </span>
          </button>
        </div>

        {/* 3D LANDSCAPE CAROUSEL STAGE */}
        <div
          ref={carouselAreaRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative w-full flex-1 flex items-center justify-center min-h-[260px] sm:min-h-[300px] md:min-h-[340px] lg:min-h-[360px] xl:min-h-[380px] my-auto select-none touch-pan-y cursor-grab active:cursor-grabbing thumb-fade-el"
          style={{
            perspective: 1500,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* 3D Stack of 16:9 Landscape Cards */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {youtubeThumbnails.map((item, i) => (
              <ThumbnailCard
                key={item.id}
                item={item}
                index={i}
                progress={progress}
                totalCount={totalThumbnails}
                screenWidth={screenWidth}
                onCardClick={handleCardClick}
              />
            ))}
          </div>

          {/* Previous & Next Navigation Buttons */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none px-1 sm:px-2 md:px-4 lg:px-6 z-50">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous YouTube Thumbnail"
              className="pointer-events-auto w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-[#E5D7C3] hover:border-gold-400 shadow-[0_4px_14px_rgba(45,38,30,0.08)] hover:shadow-[0_6px_18px_rgba(196,148,58,0.22)] flex items-center justify-center text-charcoal-700 hover:text-gold-500 transition-all duration-300 active:scale-90 group cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 transform transition-transform group-hover:-translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next YouTube Thumbnail"
              className="pointer-events-auto w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-[#E5D7C3] hover:border-gold-400 shadow-[0_4px_14px_rgba(45,38,30,0.08)] hover:shadow-[0_6px_18px_rgba(196,148,58,0.22)] flex items-center justify-center text-charcoal-700 hover:text-gold-500 transition-all duration-300 active:scale-90 group cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 transform transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* AUTHENTIC CRAFT STAT STRIP & PAGINATION */}
        <div className="w-full flex flex-col items-center mt-2 sm:mt-3 mb-1 sm:mb-2 relative z-20 thumb-fade-el">
          {/* Pagination Indicator Dots */}
          <div className="flex items-center gap-2 mb-3">
            {[0, 1, 2, 3, 4].map((dotIndex) => (
              <span
                key={dotIndex}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeDot === dotIndex
                    ? 'w-6 bg-gold-400'
                    : 'w-2 bg-charcoal-800/20 hover:bg-charcoal-800/40'
                }`}
              />
            ))}
          </div>

          {/* Genuine Capability Highlights Strip */}
          <div className="w-full max-w-[960px] grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 mb-2">
            {thumbnailSectionData.stats.map((stat) => (
              <div
                key={stat.id}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/75 backdrop-blur-sm border border-[#E5D7C3] shadow-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-gold-400/10 flex items-center justify-center shrink-0">
                  {getStatIcon(stat.icon)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-playfair text-sm sm:text-base font-bold text-charcoal-800 leading-none truncate">
                    {stat.value}
                  </span>
                  <span className="font-sora text-[9px] font-semibold text-charcoal-500 uppercase tracking-wider mt-0.5 truncate">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <span className="text-[10px] font-sora font-medium uppercase tracking-[0.22em] text-charcoal-400">
            DRAG OR USE ARROWS TO EXPLORE • CLICK TO VIEW ARTWORK
          </span>
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      <MediaViewer
        isOpen={!!selectedThumbnail}
        onClose={() => setSelectedThumbnail(null)}
        item={
          selectedThumbnail
            ? {
                id: selectedThumbnail.id,
                title: selectedThumbnail.title,
                thumbnail: selectedThumbnail.image,
                category: selectedThumbnail.category || 'YouTube Thumbnail',
                description: `YouTube Thumbnail Artwork • 16:9 Ultra HD Resolution`,
                type: 'thumbnail',
              }
            : null
        }
      />
    </section>
  );
};

export default ThumbnailsSection;
