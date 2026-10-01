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
import { ChevronLeft, ChevronRight, Layers, Users, Eye, Heart } from 'lucide-react';
import { storyPosters, storySectionData, StoryPoster } from '../data/portfolio';
import { useArchive } from '../context/ArchiveContext';
import { getOptimizedImageUrl } from '../utils/imageOptimization';
import MediaViewer from './MediaViewer';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// MATHEMATICAL WRAPPING & 3D FAN POSITIONS
// ─────────────────────────────────────────────────────────────────────────────

// Continuous wrapped circular offset on a circle of length N (range: [-N/2, N/2])
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

function calculateFanTransform(
  u: number,
  screenWidth: number
): Transform3D {
  const absU = Math.abs(u);

  // Precision responsive horizontal spacing to guarantee zero overlap with left text
  let stepX = 135;
  let stepY = 12;

  if (screenWidth < 640) {
    stepX = 80;
    stepY = 6;
  } else if (screenWidth < 768) {
    stepX = 95;
    stepY = 8;
  } else if (screenWidth < 1024) {
    stepX = 110;
    stepY = 10;
  } else if (screenWidth < 1280) {
    stepX = 88;
    stepY = 10;
  } else if (screenWidth < 1536) {
    stepX = 112;
    stepY = 12;
  } else {
    stepX = 135;
    stepY = 14;
  }

  // 1. Horizontal position
  let x = 0;
  if (absU <= 1) {
    x = u * stepX;
  } else if (absU <= 2) {
    x = Math.sign(u) * (stepX + (absU - 1) * (stepX * 0.84));
  } else {
    x = Math.sign(u) * (stepX * 1.84 + (absU - 2) * (stepX * 0.70));
  }

  // 2. Vertical parabolic position (side cards sit 10-24px lower)
  const y = (absU * absU * 0.5 + absU * 0.5) * stepY;

  // 3. TranslateZ depth (Guarantees active card is always physically in front in 3D space)
  const z = -Math.pow(absU, 1.15) * 55;

  // 4. Scale (Hero = 1.0, Inner = ~0.88, Outer = ~0.74)
  let scale = 1;
  if (screenWidth < 640) {
    scale = absU <= 1 ? 1 - absU * 0.16 : Math.max(0.55, 0.84 - (absU - 1) * 0.15);
  } else {
    if (absU <= 1) {
      scale = 1 - absU * 0.12; // 1.0 -> 0.88
    } else if (absU <= 2) {
      scale = 0.88 - (absU - 1) * 0.14; // 0.88 -> 0.74
    } else {
      scale = Math.max(0.5, 0.74 - (absU - 2) * 0.15);
    }
  }

  // 5. RotateY (3D Fan: Left cards tilt +8°/+14° toward center; Right cards tilt -8°/-14°)
  let rotateY = 0;
  if (screenWidth < 640) {
    rotateY = absU <= 1 ? -u * 6 : Math.sign(-u) * 6;
  } else {
    if (absU <= 1) {
      rotateY = -u * 8.0; // 0° -> ±8°
    } else if (absU <= 2) {
      rotateY = Math.sign(-u) * (8.0 + (absU - 1) * 6.0); // ±8° -> ±14°
    } else {
      rotateY = Math.sign(-u) * 14.0;
    }
  }

  // 6. Opacity (Hero = 1.0, Inner = ~0.78, Outer = ~0.52, beyond 2.5 = 0)
  let opacity = 1;
  if (screenWidth < 640) {
    if (absU <= 1) {
      opacity = 1 - absU * 0.55;
    } else {
      opacity = 0;
    }
  } else {
    if (absU <= 1) {
      opacity = 1 - absU * 0.22; // 1.0 -> 0.78
    } else if (absU <= 2) {
      opacity = 0.78 - (absU - 1) * 0.26; // 0.78 -> 0.52
    } else if (absU <= 2.6) {
      opacity = Math.max(0, 0.52 - (absU - 2) * (0.52 / 0.6));
    } else {
      opacity = 0;
    }
  }

  // 7. Z-Index (Explicit visual stacking hierarchy: Active center is highest, side cards lower)
  const zIndex = Math.round(100 - absU * 25);

  // 8. Shadow depth
  let shadow =
    '0 24px 50px -10px rgba(45, 38, 30, 0.24), 0 8px 18px -4px rgba(45, 38, 30, 0.12)';
  if (absU > 0.5 && absU <= 1.5) {
    shadow = '0 14px 30px -6px rgba(45, 38, 30, 0.16)';
  } else if (absU > 1.5) {
    shadow = '0 8px 20px -4px rgba(45, 38, 30, 0.10)';
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
// STORY CARD COMPONENT (Rendered within continuous 3D coordinate space)
// ─────────────────────────────────────────────────────────────────────────────
interface StoryCardProps {
  story: StoryPoster;
  index: number;
  progress: MotionValue<number>;
  totalCount: number;
  screenWidth: number;
  onCardClick: (index: number) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({
  story,
  index,
  progress,
  totalCount,
  screenWidth,
  onCardClick,
}) => {
  // Transform continuous progress value into card coordinates
  const x = useTransform(progress, (p) => {
    const u = getWrappedOffset(index, p, totalCount);
    return calculateFanTransform(u, screenWidth).x;
  });

  const y = useTransform(progress, (p) => {
    const u = getWrappedOffset(index, p, totalCount);
    return calculateFanTransform(u, screenWidth).y;
  });

  const z = useTransform(progress, (p) => {
    const u = getWrappedOffset(index, p, totalCount);
    return calculateFanTransform(u, screenWidth).z;
  });

  const scale = useTransform(progress, (p) => {
    const u = getWrappedOffset(index, p, totalCount);
    return calculateFanTransform(u, screenWidth).scale;
  });

  const rotateY = useTransform(progress, (p) => {
    const u = getWrappedOffset(index, p, totalCount);
    return calculateFanTransform(u, screenWidth).rotateY;
  });

  const opacity = useTransform(progress, (p) => {
    const u = getWrappedOffset(index, p, totalCount);
    return calculateFanTransform(u, screenWidth).opacity;
  });

  const zIndex = useTransform(progress, (p) => {
    const u = getWrappedOffset(index, p, totalCount);
    return calculateFanTransform(u, screenWidth).zIndex;
  });

  const boxShadow = useTransform(progress, (p) => {
    const u = getWrappedOffset(index, p, totalCount);
    return calculateFanTransform(u, screenWidth).shadow;
  });

  const pointerEvents = useTransform(progress, (p) => {
    const u = getWrappedOffset(index, p, totalCount);
    const absU = Math.abs(u);
    return absU <= (screenWidth < 640 ? 0.8 : 1.6) ? 'auto' : 'none';
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
      onClick={() => onCardClick(index)}
      className="absolute aspect-[9/16] w-[190px] sm:w-[215px] md:w-[230px] lg:w-[245px] xl:w-[275px] 2xl:w-[295px] rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[#FAF3E8] border border-white/60 ring-1 ring-black/[0.06] cursor-pointer will-change-transform select-none transition-shadow duration-300"
    >
      {/* Strict 9:16 Artwork Asset Container */}
      <div className="relative w-full h-full overflow-hidden rounded-[20px] sm:rounded-[24px]">
        <img
          src={getOptimizedImageUrl(story.image, 600)}
          alt={story.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover pointer-events-none select-none"
          draggable={false}
        />

        {/* Delicate Glass Highlight / Gloss Border */}
        <div
          className="absolute inset-0 rounded-[20px] sm:rounded-[24px] pointer-events-none ring-1 ring-inset ring-white/25"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.02) 40%, transparent 100%)',
          }}
        />
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STATS ICON HELPER
// ─────────────────────────────────────────────────────────────────────────────
const StatIcon: React.FC<{ icon: string }> = ({ icon }) => {
  const iconClasses = 'w-4 h-4 sm:w-[18px] sm:h-[18px] text-gold-400 stroke-[1.8]';
  switch (icon) {
    case 'layers':
      return <Layers className={iconClasses} />;
    case 'users':
      return <Users className={iconClasses} />;
    case 'eye':
      return <Eye className={iconClasses} />;
    case 'heart':
      return <Heart className={iconClasses} />;
    default:
      return <Layers className={iconClasses} />;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN STORIES SECTION COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const StoriesSection: React.FC = () => {
  const { openArchive } = useArchive();
  const sectionRef = useRef<HTMLElement>(null);
  const carouselAreaRef = useRef<HTMLDivElement>(null);
  const [selectedStory, setSelectedStory] = useState<StoryPoster | null>(null);

  const totalStories = storyPosters.length;

  // Motion value representing continuous carousel progress
  const progress = useMotionValue(0);
  const isAnimatingRef = useRef(false);

  // Responsive screen width state
  const [screenWidth, setScreenWidth] = useState(1440);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Entrance scroll animation using GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.story-fade-el',
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ───────────────────────────────────────────────────────────────────────────
  // NAVIGATION CONTROLS (Continuous, zero-teleport wrapping)
  // ───────────────────────────────────────────────────────────────────────────
  const navigateTo = useCallback(
    (newTarget: number) => {
      const currentP = progress.get();
      // Calculate shortest circular path from currentP to newTarget
      const diff = newTarget - currentP;
      const wrappedDiff =
        ((((diff + totalStories / 2) % totalStories) + totalStories) % totalStories) -
        totalStories / 2;
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
    [progress, totalStories]
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
    (cardIndex: number) => {
      const currentP = progress.get();
      const offset = getWrappedOffset(cardIndex, currentP, totalStories);
      if (Math.abs(offset) > 0.3) {
        // If clicking a side card, smoothly navigate to make it active
        navigateTo(currentP + offset);
      } else {
        // Active card clicked: open full-screen story viewer
        const normalizedIndex = ((((cardIndex % totalStories) + totalStories) % totalStories));
        setSelectedStory(storyPosters[normalizedIndex] || storyPosters[0]);
      }
    },
    [navigateTo, progress, totalStories]
  );

  // ───────────────────────────────────────────────────────────────────────────
  // PHYSICAL DRAG / SWIPE TRACKING
  // ───────────────────────────────────────────────────────────────────────────
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartTimeRef = useRef(0);
  const dragStartProgressRef = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Prevent starting drag if user clicked directly on navigation buttons
    if ((e.target as HTMLElement).closest('button')) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    dragStartXRef.current = e.clientX;
    dragStartTimeRef.current = performance.now();
    dragStartProgressRef.current = progress.get();
    isDraggingRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const deltaX = e.clientX - dragStartXRef.current;

    // Only engage drag if moved beyond threshold
    if (!isDraggingRef.current) {
      if (Math.abs(deltaX) > 6) {
        isDraggingRef.current = true;
        progress.stop();
        if (e.currentTarget.setPointerCapture) {
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            // Ignore capture errors
          }
        }
      } else {
        return;
      }
    }

    // Drag sensitivity: responsive according to screen width
    const sensitivity = screenWidth < 640 ? 170 : screenWidth < 1024 ? 220 : 280;
    const newProgress = dragStartProgressRef.current - deltaX / sensitivity;

    progress.set(newProgress);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.currentTarget.releasePointerCapture) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }

    if (!isDraggingRef.current) {
      // User tapped without dragging; let card onClick handle opening
      return;
    }
    isDraggingRef.current = false;

    const deltaX = e.clientX - dragStartXRef.current;
    const duration = performance.now() - dragStartTimeRef.current;
    const velocity = deltaX / (duration || 1); // px per ms

    const currentP = progress.get();
    let target = Math.round(currentP);

    // If fast flick or substantial drag, advance/retreat with momentum
    if (Math.abs(velocity) > 0.45 || Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        target = Math.ceil(dragStartProgressRef.current + 0.1);
        if (target <= currentP) target = Math.round(currentP + 0.5);
      } else {
        target = Math.floor(dragStartProgressRef.current - 0.1);
        if (target >= currentP) target = Math.round(currentP - 0.5);
      }
    }

    navigateTo(target);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const inView =
        rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25;

      if (!inView) return;

      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <section
      id="stories"
      ref={sectionRef}
      className="relative w-full min-h-[100svh] lg:h-[100svh] pt-20 sm:pt-24 lg:pt-16 pb-8 sm:pb-10 lg:pb-10 overflow-hidden bg-[#FAF3E8] z-[10] select-none flex flex-col justify-between"
      style={{
        background:
          'linear-gradient(to bottom, #FAF3E8 0%, #FAF3E8 15%, #FAF5EE 45%, #FAF3E8 80%, #FAF3E8 100%)',
      }}
    >
      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 1. ATMOSPHERIC BACKGROUND LAYERS */}
      {/* ───────────────────────────────────────────────────────────────────── */}

      {/* Warm Peach / Golden Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 58% 45%, rgba(246, 215, 178, 0.16) 0%, rgba(250, 243, 232, 0.05) 55%, transparent 75%)',
        }}
      />

      {/* Atmospheric Mist Drift with Soft Bottom Fade */}
      <div
        className="absolute inset-0 flex justify-center pointer-events-none overflow-hidden opacity-15"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 65%, transparent 95%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 65%, transparent 95%)',
        }}
      >
        <img
          src="/assets/atmospheric-mist.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Bottom Left Atmospheric Cloud Formation with Soft Alpha Dissolve */}
      <div
        className="absolute -bottom-6 -left-16 sm:-bottom-8 sm:-left-24 w-[380px] sm:w-[480px] lg:w-[580px] pointer-events-none select-none opacity-35 z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 45%, rgba(0,0,0,0.5) 75%, transparent 92%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 45%, rgba(0,0,0,0.5) 75%, transparent 92%)',
        }}
      >
        <img
          src="/assets/cloud-left.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-contain mix-blend-multiply"
          draggable={false}
        />
      </div>

      {/* Bottom Right Atmospheric Cloud Formation with Soft Alpha Dissolve */}
      <div
        className="absolute -bottom-6 -right-16 sm:-bottom-8 sm:-right-24 w-[380px] sm:w-[480px] lg:w-[580px] pointer-events-none select-none opacity-35 z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 45%, rgba(0,0,0,0.5) 75%, transparent 92%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 45%, rgba(0,0,0,0.5) 75%, transparent 92%)',
        }}
      >
        <img
          src="/assets/cloud-right.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-contain mix-blend-multiply"
          draggable={false}
        />
      </div>

      {/* Bottom Atmospheric Soft Canvas Dissolve (Feathers clouds & background seamlessly into Section 5) */}
      <div
        className="absolute bottom-0 inset-x-0 h-36 sm:h-48 md:h-60 pointer-events-none z-[5]"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(250, 243, 232, 0.3) 30%, rgba(250, 243, 232, 0.8) 70%, #FAF3E8 100%)',
        }}
      />

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 2. MAIN HORIZONTAL VIEWPORT CONTENT */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <div className="max-w-[1480px] w-full mx-auto px-6 sm:px-8 lg:px-12 flex-1 flex flex-col justify-between relative z-10">
        {/* Horizontal Editorial Grid: Left Copy (~31%) + Right 3D Carousel (~69%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center w-full my-auto flex-1">
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* LEFT: EDITORIAL COPY ZONE */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col justify-center select-text z-20 story-fade-el lg:-mt-12 xl:-mt-14">
            {/* Eyebrow */}
            <span className="text-gold-400 text-xs sm:text-[13px] tracking-[0.22em] font-sora font-semibold uppercase mb-2 block">
              {storySectionData.eyebrow}
            </span>

            {/* Small Gold Divider Line */}
            <div className="w-10 sm:w-12 h-[2px] bg-gold-400 mb-4 sm:mb-5 rounded-full" />

            {/* Editorial Serif Heading */}
            <h2 className="font-playfair text-[clamp(2.2rem,3.4vw,3.6rem)] text-charcoal-800 leading-[1.02] tracking-tight mb-3.5 sm:mb-4.5 font-bold">
              {storySectionData.headingLine1}
              <br />
              <span className="text-gold-400 font-playfair font-bold">
                {storySectionData.headingLine2}
              </span>
            </h2>

            {/* Description Body Paragraph */}
            <p className="text-charcoal-400 font-sora text-xs sm:text-sm leading-relaxed max-w-[320px] mb-5 sm:mb-7 text-balance">
              {storySectionData.description}
            </p>

            {/* Editorial CTA */}
            <button
              type="button"
              onClick={() => openArchive('STORIES')}
              className="inline-flex items-center gap-2.5 text-xs sm:text-[13px] font-sora font-semibold tracking-[0.16em] uppercase text-charcoal-800 hover:text-gold-400 group transition-colors relative pb-1 self-start border-b border-charcoal-800/80 hover:border-gold-400 cursor-pointer"
            >
              <span>{storySectionData.ctaText}</span>
              <span className="transform transition-transform duration-300 group-hover:translate-x-1.5 text-gold-400 text-sm font-bold">
                →
              </span>
            </button>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* RIGHT: 3D PORTRAIT POSTER CAROUSEL AREA */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div
            ref={carouselAreaRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="lg:col-span-8 xl:col-span-8 relative flex items-center justify-center min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] xl:min-h-[490px] select-none touch-pan-y cursor-grab active:cursor-grabbing story-fade-el"
            style={{
              perspective: 1400,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* 3D Stack of 9:16 Portrait Posters */}
            <div
              className="relative w-full h-full flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {storyPosters.map((story, i) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  index={i}
                  progress={progress}
                  totalCount={totalStories}
                  screenWidth={screenWidth}
                  onCardClick={handleCardClick}
                />
              ))}
            </div>

            {/* Navigation Buttons: Previous & Next */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none px-0 sm:px-1 lg:-mx-2 z-50">
              {/* Previous Button */}
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous Story"
                className="pointer-events-auto w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-[#E5D7C3] hover:border-gold-400 shadow-[0_4px_14px_rgba(45,38,30,0.08)] hover:shadow-[0_6px_18px_rgba(196,148,58,0.22)] flex items-center justify-center text-charcoal-700 hover:text-gold-500 transition-all duration-300 active:scale-90 group cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 transform transition-transform group-hover:-translate-x-0.5" />
              </button>

              {/* Next Button */}
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next Story"
                className="pointer-events-auto w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-[#E5D7C3] hover:border-gold-400 shadow-[0_4px_14px_rgba(45,38,30,0.08)] hover:shadow-[0_6px_18px_rgba(196,148,58,0.22)] flex items-center justify-center text-charcoal-700 hover:text-gold-500 transition-all duration-300 active:scale-90 group cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 transform transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 3. FULL-SCREEN STORY VIEWER MODAL */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <MediaViewer
        isOpen={!!selectedStory}
        onClose={() => setSelectedStory(null)}
        item={
          selectedStory
            ? {
                id: selectedStory.id,
                title: selectedStory.title,
                thumbnail: selectedStory.image,
                category: selectedStory.category || 'Instagram Story',
                type: 'story',
              }
            : null
        }
      />
    </section>
  );
};

export default StoriesSection;

