import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Sparkles, Users, Eye, Heart } from 'lucide-react';
import MediaViewer from './MediaViewer';
import {
  creativePosts,
  creativesSectionData,
  CreativePost,
} from '../data/portfolio';
import { useArchive } from '../context/ArchiveContext';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// STATS ICON HELPER
// ─────────────────────────────────────────────────────────────────────────────
const StatIcon: React.FC<{ icon: string }> = ({ icon }) => {
  const iconClasses = 'w-4 h-4 sm:w-[18px] sm:h-[18px] text-gold-400 stroke-[1.8]';
  switch (icon) {
    case 'sparkles':
      return <Sparkles className={iconClasses} />;
    case 'users':
      return <Users className={iconClasses} />;
    case 'eye':
      return <Eye className={iconClasses} />;
    case 'heart':
      return <Heart className={iconClasses} />;
    default:
      return <Sparkles className={iconClasses} />;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CREATIVE CARD COMPONENT (Pristine artwork presentation with natural aspect ratio)
// ─────────────────────────────────────────────────────────────────────────────
interface CreativeCardProps {
  post: CreativePost;
  onCardClick: (post: CreativePost) => void;
}

const CreativeCard: React.FC<CreativeCardProps> = ({ post, onCardClick }) => {
  // Support custom aspect ratios or default to 4/5 (0.8)
  const ratio = post.aspectRatio || 0.8;

  return (
    <div
      onClick={() => onCardClick(post)}
      style={{
        aspectRatio: `${ratio}`,
      }}
      className="relative h-full shrink-0 rounded-[16px] sm:rounded-[20px] overflow-hidden bg-[#FDF8F3] border border-white/70 ring-1 ring-black/[0.05] shadow-[0_10px_26px_-6px_rgba(45,38,30,0.09),0_2px_6px_rgba(45,38,30,0.04)] hover:shadow-[0_16px_34px_-6px_rgba(45,38,30,0.16)] cursor-pointer select-none group transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.015]"
    >
      {/* Pure High-Fidelity Artwork */}
      <img
        src={post.image}
        alt={post.title || 'Creative Design'}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="w-full h-full object-cover pointer-events-none select-none transition-transform duration-500 group-hover:scale-105"
      />

      {/* Subtle Refined Editorial Glass Sheen */}
      <div
        className="absolute inset-0 rounded-[16px] sm:rounded-[20px] pointer-events-none ring-1 ring-inset ring-white/30"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.02) 40%, transparent 100%)',
        }}
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SECTION COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const CreativesSection: React.FC = () => {
  const { openArchive } = useArchive();
  const sectionRef = useRef<HTMLElement>(null);

  // Row 1 Track Refs & Physics State
  const row1TrackRef = useRef<HTMLDivElement>(null);
  const row1SetRef = useRef<HTMLDivElement>(null);
  const pos1Ref = useRef(0);
  const row1WidthRef = useRef(1600);
  const isDragging1Ref = useRef(false);
  const isHovered1Ref = useRef(false);
  const dragStartX1Ref = useRef(0);
  const dragStartTime1Ref = useRef(0);
  const dragStartPos1Ref = useRef(0);
  const lastPointerX1Ref = useRef(0);
  const pointerVelocity1Ref = useRef(0);
  const inertia1Ref = useRef(0);
  const targetOffset1Ref = useRef<number | null>(null);

  // Row 2 Track Refs & Physics State (Organic Initial Stagger Offset)
  const row2TrackRef = useRef<HTMLDivElement>(null);
  const row2SetRef = useRef<HTMLDivElement>(null);
  const pos2Ref = useRef(-75);
  const row2WidthRef = useRef(1600);
  const isDragging2Ref = useRef(false);
  const isHovered2Ref = useRef(false);
  const dragStartX2Ref = useRef(0);
  const dragStartTime2Ref = useRef(0);
  const dragStartPos2Ref = useRef(-75);
  const lastPointerX2Ref = useRef(0);
  const pointerVelocity2Ref = useRef(0);
  const inertia2Ref = useRef(0);
  const targetOffset2Ref = useRef<number | null>(null);

  // Lightbox selection
  const [selectedPost, setSelectedPost] = useState<CreativePost | null>(null);

  // Split the 18 creative posts into two curated, balanced sequences of 9
  const row1Posts = creativePosts.filter((_, i) => i % 2 === 0);
  const row2Posts = creativePosts.filter((_, i) => i % 2 === 1);

  // Drift Speeds (Row 1 drifting left, Row 2 drifting right)
  const baseSpeed1 = -11.0; // px/sec
  const baseSpeed2 = 9.0; // px/sec

  // Active pagination dot indicator (0 to 4)
  const [activeDot, setActiveDot] = useState(0);

  // Entrance scroll animation using GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.creative-fade-el',
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

  // Measure single loop width for each row accurately
  const measureTracks = useCallback(() => {
    if (row1SetRef.current) {
      const w1 = row1SetRef.current.getBoundingClientRect().width;
      if (w1 > 100) row1WidthRef.current = w1;
    }
    if (row2SetRef.current) {
      const w2 = row2SetRef.current.getBoundingClientRect().width;
      if (w2 > 100) row2WidthRef.current = w2;
    }
  }, []);

  useEffect(() => {
    measureTracks();
    window.addEventListener('resize', measureTracks, { passive: true });
    const timer = setTimeout(measureTracks, 300);
    return () => {
      window.removeEventListener('resize', measureTracks);
      clearTimeout(timer);
    };
  }, [measureTracks]);

  // ───────────────────────────────────────────────────────────────────────────
  // RAF ANIMATION LOOP (Independent physics & continuous modular wrap per row)
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    let dotUpdateThrottle = 0;
    let isVisible = true;

    const loop = (time: number) => {
      if (!isVisible) return;

      const dt = Math.min((time - lastTime) / 1000, 0.05); // cap delta time
      lastTime = time;

      const w1 = row1WidthRef.current;
      const w2 = row2WidthRef.current;

      // ─── ROW 1 INDEPENDENT PHYSICS ───
      if (targetOffset1Ref.current !== null && !isDragging1Ref.current) {
        const diff1 = targetOffset1Ref.current - pos1Ref.current;
        if (Math.abs(diff1) > 0.4) {
          pos1Ref.current += diff1 * (1 - Math.exp(-14 * dt));
        } else {
          pos1Ref.current = targetOffset1Ref.current;
          targetOffset1Ref.current = null;
        }
      } else if (Math.abs(inertia1Ref.current) > 0.5 && !isDragging1Ref.current) {
        pos1Ref.current += inertia1Ref.current * dt;
        inertia1Ref.current *= Math.exp(-4.5 * dt);
      } else if (!isDragging1Ref.current && !isHovered1Ref.current) {
        pos1Ref.current += baseSpeed1 * dt;
      }

      // ─── ROW 2 INDEPENDENT PHYSICS ───
      if (targetOffset2Ref.current !== null && !isDragging2Ref.current) {
        const diff2 = targetOffset2Ref.current - pos2Ref.current;
        if (Math.abs(diff2) > 0.4) {
          pos2Ref.current += diff2 * (1 - Math.exp(-14 * dt));
        } else {
          pos2Ref.current = targetOffset2Ref.current;
          targetOffset2Ref.current = null;
        }
      } else if (Math.abs(inertia2Ref.current) > 0.5 && !isDragging2Ref.current) {
        pos2Ref.current += inertia2Ref.current * dt;
        inertia2Ref.current *= Math.exp(-4.5 * dt);
      } else if (!isDragging2Ref.current && !isHovered2Ref.current) {
        pos2Ref.current += baseSpeed2 * dt;
      }

      // Mathematical Continuous Modular Transforms: always strictly mapped within [-W, 0)
      if (w1 > 100 && row1TrackRef.current) {
        const mod1 = -w1 + (((pos1Ref.current % w1) + w1) % w1);
        row1TrackRef.current.style.transform = `translate3d(${mod1}px, 0, 0)`;
      }

      if (w2 > 100 && row2TrackRef.current) {
        const mod2 = -w2 + (((pos2Ref.current % w2) + w2) % w2);
        row2TrackRef.current.style.transform = `translate3d(${mod2}px, 0, 0)`;
      }

      // Periodically update active pagination dot (throttled to 10Hz, guarded against redundant re-renders)
      dotUpdateThrottle += dt;
      if (dotUpdateThrottle > 0.1) {
        dotUpdateThrottle = 0;
        const normalizedIndex = Math.floor(
          (((-pos1Ref.current / 280) % 5) + 5) % 5
        );
        setActiveDot((prev) => (prev !== normalizedIndex ? normalizedIndex : prev));
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const wasVisible = isVisible;
          isVisible = entry.isIntersecting;
          if (isVisible && !wasVisible) {
            lastTime = performance.now();
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(loop);
          } else if (!isVisible) {
            cancelAnimationFrame(animationFrameId);
          }
        });
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    animationFrameId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [baseSpeed1, baseSpeed2]);

  // ───────────────────────────────────────────────────────────────────────────
  // ROW 1 INDEPENDENT DRAG & TOUCH INTERACTIONS
  // ───────────────────────────────────────────────────────────────────────────
  const handlePointerDownRow1 = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    isDragging1Ref.current = true;
    targetOffset1Ref.current = null;
    inertia1Ref.current = 0;

    dragStartX1Ref.current = e.clientX;
    dragStartTime1Ref.current = performance.now();
    lastPointerX1Ref.current = e.clientX;
    pointerVelocity1Ref.current = 0;
    dragStartPos1Ref.current = pos1Ref.current;

    if (e.currentTarget.setPointerCapture) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    }
  };

  const handlePointerMoveRow1 = (e: React.PointerEvent) => {
    if (!isDragging1Ref.current) return;

    const deltaX = e.clientX - dragStartX1Ref.current;
    const now = performance.now();
    const dtPointer = Math.max((now - dragStartTime1Ref.current) / 1000, 0.001);

    const dxRecent = e.clientX - lastPointerX1Ref.current;
    pointerVelocity1Ref.current = dxRecent / Math.max(dtPointer, 0.016);
    lastPointerX1Ref.current = e.clientX;

    pos1Ref.current = dragStartPos1Ref.current + deltaX;
  };

  const handlePointerUpRow1 = (e: React.PointerEvent) => {
    if (!isDragging1Ref.current) return;
    isDragging1Ref.current = false;

    if (e.currentTarget.releasePointerCapture) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    }

    const deltaX = e.clientX - dragStartX1Ref.current;
    const totalDuration = performance.now() - dragStartTime1Ref.current;

    if (totalDuration < 350 && Math.abs(deltaX) > 15) {
      inertia1Ref.current = Math.sign(deltaX) * Math.min(Math.abs(deltaX * 3.5), 1200);
    } else {
      inertia1Ref.current = Math.sign(pointerVelocity1Ref.current) * Math.min(Math.abs(pointerVelocity1Ref.current * 0.4), 800);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // ROW 2 INDEPENDENT DRAG & TOUCH INTERACTIONS
  // ───────────────────────────────────────────────────────────────────────────
  const handlePointerDownRow2 = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    isDragging2Ref.current = true;
    targetOffset2Ref.current = null;
    inertia2Ref.current = 0;

    dragStartX2Ref.current = e.clientX;
    dragStartTime2Ref.current = performance.now();
    lastPointerX2Ref.current = e.clientX;
    pointerVelocity2Ref.current = 0;
    dragStartPos2Ref.current = pos2Ref.current;

    if (e.currentTarget.setPointerCapture) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    }
  };

  const handlePointerMoveRow2 = (e: React.PointerEvent) => {
    if (!isDragging2Ref.current) return;

    const deltaX = e.clientX - dragStartX2Ref.current;
    const now = performance.now();
    const dtPointer = Math.max((now - dragStartTime2Ref.current) / 1000, 0.001);

    const dxRecent = e.clientX - lastPointerX2Ref.current;
    pointerVelocity2Ref.current = dxRecent / Math.max(dtPointer, 0.016);
    lastPointerX2Ref.current = e.clientX;

    pos2Ref.current = dragStartPos2Ref.current + deltaX;
  };

  const handlePointerUpRow2 = (e: React.PointerEvent) => {
    if (!isDragging2Ref.current) return;
    isDragging2Ref.current = false;

    if (e.currentTarget.releasePointerCapture) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    }

    const deltaX = e.clientX - dragStartX2Ref.current;
    const totalDuration = performance.now() - dragStartTime2Ref.current;

    if (totalDuration < 350 && Math.abs(deltaX) > 15) {
      inertia2Ref.current = Math.sign(deltaX) * Math.min(Math.abs(deltaX * 3.5), 1200);
    } else {
      inertia2Ref.current = Math.sign(pointerVelocity2Ref.current) * Math.min(Math.abs(pointerVelocity2Ref.current * 0.4), 800);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // ARROW NAVIGATION CONTROLS (Steps both rows smoothly)
  // ───────────────────────────────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    const step = 280;
    const current1 = targetOffset1Ref.current !== null ? targetOffset1Ref.current : pos1Ref.current;
    const current2 = targetOffset2Ref.current !== null ? targetOffset2Ref.current : pos2Ref.current;
    targetOffset1Ref.current = current1 - step;
    targetOffset2Ref.current = current2 - step;
    inertia1Ref.current = 0;
    inertia2Ref.current = 0;
  }, []);

  const handlePrev = useCallback(() => {
    const step = 280;
    const current1 = targetOffset1Ref.current !== null ? targetOffset1Ref.current : pos1Ref.current;
    const current2 = targetOffset2Ref.current !== null ? targetOffset2Ref.current : pos2Ref.current;
    targetOffset1Ref.current = current1 + step;
    targetOffset2Ref.current = current2 + step;
    inertia1Ref.current = 0;
    inertia2Ref.current = 0;
  }, []);

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

  // Card click handler (only triggers if not dragging)
  const handleCardClick1 = (post: CreativePost) => {
    const moveDistance = Math.abs(lastPointerX1Ref.current - dragStartX1Ref.current);
    if (moveDistance < 6) {
      setSelectedPost(post);
    }
  };

  const handleCardClick2 = (post: CreativePost) => {
    const moveDistance = Math.abs(lastPointerX2Ref.current - dragStartX2Ref.current);
    if (moveDistance < 6) {
      setSelectedPost(post);
    }
  };

  return (
    <section
      id="creatives"
      ref={sectionRef}
      className="relative w-full min-h-[100svh] lg:h-[100svh] pt-20 sm:pt-24 lg:pt-16 pb-8 sm:pb-10 lg:pb-10 bg-[#FAF3E8] z-[10] select-none flex flex-col justify-between"
      style={{
        background:
          'linear-gradient(to bottom, #FAF3E8 0%, #FAF3E8 15%, #FAF5EE 45%, #FAF3E8 80%, #FAF3E8 100%)',
      }}
    >
      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 1. ATMOSPHERIC BACKGROUND LAYERS */}
      {/* ───────────────────────────────────────────────────────────────────── */}

      {/* Warm Golden-Peach Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 56% 46%, rgba(246, 215, 178, 0.16) 0%, rgba(250, 243, 232, 0.05) 55%, transparent 75%)',
        }}
      />

      {/* Atmospheric Mist Drift with Soft Mask */}
      <div
        className="absolute inset-0 flex justify-center pointer-events-none overflow-hidden opacity-15"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 65%, transparent 95%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 65%, transparent 95%)',
        }}
      >
        <img
          src="/assets/atmospheric-mist.png"
          alt=""
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Bottom Left Atmospheric Cloud Formation */}
      <div
        className="absolute -bottom-6 -left-16 sm:-bottom-8 sm:-left-24 w-[380px] sm:w-[480px] lg:w-[580px] pointer-events-none select-none opacity-35 z-0"
        style={{
          maskImage:
            'linear-gradient(to bottom, black 0%, black 35%, rgba(0,0,0,0.4) 60%, transparent 85%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 0%, black 35%, rgba(0,0,0,0.4) 60%, transparent 85%)',
        }}
      >
        <img
          src="/assets/cloud-left.png"
          alt=""
          className="w-full h-auto object-contain mix-blend-multiply"
          draggable={false}
        />
      </div>

      {/* Bottom Right Atmospheric Cloud Formation */}
      <div
        className="absolute -bottom-6 -right-16 sm:-bottom-8 sm:-right-24 w-[380px] sm:w-[480px] lg:w-[580px] pointer-events-none select-none opacity-35 z-0"
        style={{
          maskImage:
            'linear-gradient(to bottom, black 0%, black 35%, rgba(0,0,0,0.4) 60%, transparent 85%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 0%, black 35%, rgba(0,0,0,0.4) 60%, transparent 85%)',
        }}
      >
        <img
          src="/assets/cloud-right.png"
          alt=""
          className="w-full h-auto object-contain mix-blend-multiply"
          draggable={false}
        />
      </div>

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 2. MAIN HORIZONTAL EDITORIAL VIEWPORT CONTENT */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <div className="max-w-[1480px] w-full mx-auto px-6 sm:px-8 lg:px-12 flex-1 flex flex-col justify-between relative z-10">
        {/* Editorial Layout: Left Copy (~29%) + Right 2-Row Creative Gallery (~71%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center w-full my-auto flex-1">
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* LEFT: EDITORIAL COPY ZONE */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col justify-center select-text z-20 creative-fade-el lg:-mt-10 xl:-mt-12 pr-2 sm:pr-4">
            {/* Eyebrow */}
            <span className="text-gold-400 text-xs sm:text-[13px] tracking-[0.22em] font-sora font-semibold uppercase mb-2 block">
              {creativesSectionData.eyebrow}
            </span>

            {/* Thin Gold Underline Divider */}
            <div className="w-10 sm:w-12 h-[2px] bg-gold-400 mb-4 sm:mb-5 rounded-full" />

            {/* Main Editorial Heading */}
            <h2 className="font-playfair text-[clamp(2.2rem,3.4vw,3.6rem)] text-charcoal-800 leading-[1.02] tracking-tight mb-3.5 sm:mb-4.5 font-bold">
              {creativesSectionData.headingLine1}
              <br />
              {creativesSectionData.headingLine2}
              <br />
              <span className="text-gold-400 font-playfair font-bold">
                {creativesSectionData.headingHighlight}
              </span>
            </h2>

            {/* Supporting Description Body */}
            <p className="text-charcoal-400 font-sora text-xs sm:text-sm leading-relaxed max-w-[320px] mb-5 sm:mb-7 text-balance">
              {creativesSectionData.description}
            </p>

            {/* Editorial Understated CTA */}
            <button
              type="button"
              onClick={() => openArchive('SOCIAL MEDIA')}
              className="inline-flex items-center gap-2.5 text-xs sm:text-[13px] font-sora font-semibold tracking-[0.16em] uppercase text-charcoal-800 hover:text-gold-400 group transition-colors relative pb-1 self-start border-b border-charcoal-800/80 hover:border-gold-400 cursor-pointer"
            >
              <span>{creativesSectionData.ctaText}</span>
              <span className="transform transition-transform duration-300 group-hover:translate-x-1.5 text-gold-400 text-sm font-bold">
                →
              </span>
            </button>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* RIGHT: 2-ROW PINTEREST-INSPIRED HORIZONTAL CREATIVE WALL */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8 xl:col-span-8 relative flex flex-col justify-center min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] xl:min-h-[490px] select-none creative-fade-el overflow-hidden px-1 sm:px-2">
            {/* ─── LEFT ATMOSPHERIC FEATHERING GRADIENT MASK (Above cards, below buttons) ─── */}
            <div
              className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 lg:w-32 pointer-events-none z-30"
              style={{
                background:
                  'linear-gradient(to right, #FAF3E8 0%, rgba(250, 243, 232, 0.90) 30%, rgba(250, 243, 232, 0.40) 70%, transparent 100%)',
              }}
            />

            {/* ─── RIGHT ATMOSPHERIC FEATHERING GRADIENT MASK (Above cards, below buttons) ─── */}
            <div
              className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 lg:w-32 pointer-events-none z-30"
              style={{
                background:
                  'linear-gradient(to left, #FAF3E8 0%, rgba(250, 243, 232, 0.90) 30%, rgba(250, 243, 232, 0.40) 70%, transparent 100%)',
              }}
            />

            {/* Gallery Track Container: Exactly 2 Independently Draggable Horizontal Rows */}
            <div className="w-full flex flex-col gap-3.5 sm:gap-4 lg:gap-4 xl:gap-5 py-2 relative z-10">
              {/* ─── ROW 1 TRACK (Independently Draggable & Continuous Leftward Drift) ─── */}
              <div
                onPointerDown={handlePointerDownRow1}
                onPointerMove={handlePointerMoveRow1}
                onPointerUp={handlePointerUpRow1}
                onPointerCancel={handlePointerUpRow1}
                onMouseEnter={() => {
                  isHovered1Ref.current = true;
                }}
                onMouseLeave={() => {
                  isHovered1Ref.current = false;
                }}
                className="relative w-full h-[155px] sm:h-[180px] md:h-[195px] lg:h-[208px] xl:h-[224px] overflow-visible cursor-grab active:cursor-grabbing touch-pan-y"
              >
                <div
                  ref={row1TrackRef}
                  className="flex items-center gap-3.5 sm:gap-4 lg:gap-4 xl:gap-5 h-full w-max will-change-transform"
                  style={{ transform: 'translate3d(0,0,0)' }}
                >
                  {/* Set 0 (Preceding clone for wrapping) */}
                  <div className="flex items-center gap-3.5 sm:gap-4 lg:gap-4 xl:gap-5 h-full shrink-0">
                    {row1Posts.map((post) => (
                      <CreativeCard key={`r1-s0-${post.id}`} post={post} onCardClick={handleCardClick1} />
                    ))}
                  </div>

                  {/* Set 1 (Main reference set for width measurement) */}
                  <div
                    ref={row1SetRef}
                    className="flex items-center gap-3.5 sm:gap-4 lg:gap-4 xl:gap-5 h-full shrink-0"
                  >
                    {row1Posts.map((post) => (
                      <CreativeCard key={`r1-s1-${post.id}`} post={post} onCardClick={handleCardClick1} />
                    ))}
                  </div>

                  {/* Set 2 (Succeeding clone for wrapping) */}
                  <div className="flex items-center gap-3.5 sm:gap-4 lg:gap-4 xl:gap-5 h-full shrink-0">
                    {row1Posts.map((post) => (
                      <CreativeCard key={`r1-s2-${post.id}`} post={post} onCardClick={handleCardClick1} />
                    ))}
                  </div>

                  {/* Set 3 (Buffer clone for wide monitors) */}
                  <div className="flex items-center gap-3.5 sm:gap-4 lg:gap-4 xl:gap-5 h-full shrink-0">
                    {row1Posts.map((post) => (
                      <CreativeCard key={`r1-s3-${post.id}`} post={post} onCardClick={handleCardClick1} />
                    ))}
                  </div>
                </div>
              </div>

              {/* ─── ROW 2 TRACK (Independently Draggable & Continuous Rightward Drift) ─── */}
              <div
                onPointerDown={handlePointerDownRow2}
                onPointerMove={handlePointerMoveRow2}
                onPointerUp={handlePointerUpRow2}
                onPointerCancel={handlePointerUpRow2}
                onMouseEnter={() => {
                  isHovered2Ref.current = true;
                }}
                onMouseLeave={() => {
                  isHovered2Ref.current = false;
                }}
                className="relative w-full h-[155px] sm:h-[180px] md:h-[195px] lg:h-[208px] xl:h-[224px] overflow-visible cursor-grab active:cursor-grabbing touch-pan-y"
              >
                <div
                  ref={row2TrackRef}
                  className="flex items-center gap-3.5 sm:gap-4 lg:gap-4 xl:gap-5 h-full w-max will-change-transform"
                  style={{ transform: 'translate3d(0,0,0)' }}
                >
                  {/* Set 0 (Preceding clone for wrapping) */}
                  <div className="flex items-center gap-3.5 sm:gap-4 lg:gap-4 xl:gap-5 h-full shrink-0">
                    {row2Posts.map((post) => (
                      <CreativeCard key={`r2-s0-${post.id}`} post={post} onCardClick={handleCardClick2} />
                    ))}
                  </div>

                  {/* Set 1 (Main reference set for width measurement) */}
                  <div
                    ref={row2SetRef}
                    className="flex items-center gap-3.5 sm:gap-4 lg:gap-4 xl:gap-5 h-full shrink-0"
                  >
                    {row2Posts.map((post) => (
                      <CreativeCard key={`r2-s1-${post.id}`} post={post} onCardClick={handleCardClick2} />
                    ))}
                  </div>

                  {/* Set 2 (Succeeding clone for wrapping) */}
                  <div className="flex items-center gap-3.5 sm:gap-4 lg:gap-4 xl:gap-5 h-full shrink-0">
                    {row2Posts.map((post) => (
                      <CreativeCard key={`r2-s2-${post.id}`} post={post} onCardClick={handleCardClick2} />
                    ))}
                  </div>

                  {/* Set 3 (Buffer clone for wide monitors) */}
                  <div className="flex items-center gap-3.5 sm:gap-4 lg:gap-4 xl:gap-5 h-full shrink-0">
                    {row2Posts.map((post) => (
                      <CreativeCard key={`r2-s3-${post.id}`} post={post} onCardClick={handleCardClick2} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons: Layered ABOVE edge masks (z-50) */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none px-0 sm:px-1 lg:-mx-1 z-50">
              {/* Previous Button */}
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous Creative Posts"
                className="pointer-events-auto w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white backdrop-blur-md border border-[#E5D7C3] hover:border-gold-400 shadow-[0_4px_14px_rgba(45,38,30,0.08)] hover:shadow-[0_6px_18px_rgba(196,148,58,0.22)] flex items-center justify-center text-charcoal-700 hover:text-gold-500 transition-all duration-300 active:scale-90 group cursor-pointer"
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
                aria-label="Next Creative Posts"
                className="pointer-events-auto w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white backdrop-blur-md border border-[#E5D7C3] hover:border-gold-400 shadow-[0_4px_14px_rgba(45,38,30,0.08)] hover:shadow-[0_6px_18px_rgba(196,148,58,0.22)] flex items-center justify-center text-charcoal-700 hover:text-gold-500 transition-all duration-300 active:scale-90 group cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 transform transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* 3. BOTTOM CONTROLS & STATISTICS PILL BANNER */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        <div className="w-full flex flex-col items-center mt-2 sm:mt-3 lg:mt-4 mb-1 sm:mb-2 relative z-20 creative-fade-el">
          {/* Subtle Pagination Indicator Dots */}
          <div className="flex items-center gap-2 mb-2">
            {[0, 1, 2, 3, 4].map((dotIndex) => (
              <span
                key={dotIndex}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeDot === dotIndex
                    ? 'w-6 bg-gold-400'
                    : 'w-2 bg-charcoal-800/20 hover:bg-charcoal-800/40'
                }`}
              />
            ))}
          </div>

          {/* Understated Interaction Hint */}
          <span className="text-[10px] sm:text-[11px] font-sora font-medium uppercase tracking-[0.22em] text-charcoal-400">
            DRAG OR USE ARROWS TO EXPLORE
          </span>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 4. MEDIA VIEWER LIGHTBOX MODAL */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <MediaViewer
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        item={
          selectedPost
            ? {
                id: selectedPost.id,
                title: selectedPost.title || 'Creative Post Design',
                thumbnail: selectedPost.image,
                category: selectedPost.category || 'Creative Design',
                description: selectedPost.description,
                type: 'post',
                aspectRatio: selectedPost.aspectRatio,
              }
            : null
        }
      />
    </section>
  );
};

export default CreativesSection;

