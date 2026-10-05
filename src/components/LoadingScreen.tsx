import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
  onRevealStart?: () => void;
}

export default function LoadingScreen({ onComplete, onRevealStart }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const paperPanelRef = useRef<HTMLDivElement>(null);
  const identityRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const mistEdgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Accessibility: Reduced motion skips animated transitions
    if (prefersReduced) {
      if (identityRef.current) {
        gsap.set(identityRef.current, { opacity: 1, y: 0, scale: 1 });
      }
      if (lineRef.current) {
        gsap.set(lineRef.current, { strokeDashoffset: 0 });
      }
      const reducedTimer = setTimeout(() => {
        onRevealStart?.();
        onComplete();
      }, 350);
      return () => clearTimeout(reducedTimer);
    }

    // Safety fallback: Never trap the user if any animation fails
    const safetyTimer = setTimeout(() => {
      onRevealStart?.();
      onComplete();
    }, 2000);

    // Prepare gold line stroke dasharray
    if (lineRef.current) {
      const length = lineRef.current.getTotalLength?.() || 110;
      gsap.set(lineRef.current, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
    }

    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(safetyTimer);
        onComplete();
      },
    });

    // STEP 2 — Small Editorial Identity (Restrained, calm fade & upward lift)
    if (identityRef.current) {
      tl.fromTo(
        identityRef.current,
        { opacity: 0, y: 10, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.38, ease: 'power2.out' },
        0.08
      );
    }

    // STEP 3 — Hand-drawn Gold Line (Drawn left to right beneath identity)
    if (lineRef.current) {
      tl.to(
        lineRef.current,
        { strokeDashoffset: 0, duration: 0.32, ease: 'power2.inOut' },
        0.32
      );
    }

    // STEP 4 — Subtle Paper / Cloud Reveal Hint (Feathered mist seam appears)
    if (mistEdgeRef.current) {
      tl.fromTo(
        mistEdgeRef.current,
        { opacity: 0, y: 6 },
        { opacity: 0.65, y: 0, duration: 0.2, ease: 'power2.out' },
        0.5
      );
    }

    // STEP 5 — Paper Reveal (Pulling paper panel away with gentle diagonal angle)
    // Synchronize Hero entrance right as paper begins revealing
    tl.call(() => {
      onRevealStart?.();
    }, [], 0.6);

    if (paperPanelRef.current) {
      tl.to(
        paperPanelRef.current,
        {
          yPercent: -108,
          rotate: -0.85,
          duration: 0.62,
          ease: 'power3.inOut',
        },
        0.6
      );
    }

    if (identityRef.current) {
      tl.to(
        identityRef.current,
        {
          opacity: 0,
          y: -16,
          duration: 0.3,
          ease: 'power2.in',
        },
        0.6
      );
    }

    return () => {
      clearTimeout(safetyTimer);
      tl.kill();
    };
  }, [onComplete, onRevealStart]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] overflow-hidden pointer-events-auto select-none bg-transparent"
      aria-label="Loading portfolio"
      role="status"
    >
      <div
        ref={paperPanelRef}
        className="absolute inset-0 w-full h-full bg-[#FAF3E8] will-change-transform flex flex-col justify-between origin-top-left"
        style={{
          boxShadow: '0 25px 50px -12px rgba(45, 30, 20, 0.12)',
        }}
      >
        {/* Paper texture overlay (reusing existing asset) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-multiply bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/paper-texture.webp')" }}
        />

        {/* Subtle noise grain (reusing existing asset) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay"
          style={{
            backgroundImage: "url('/assets/noise-grain.png')",
            backgroundSize: '200px 200px',
          }}
        />

        {/* Subtle warm paper depth gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 48%, rgba(254, 252, 249, 0.95) 0%, rgba(250, 243, 232, 0.95) 60%, rgba(245, 230, 208, 0.35) 100%)',
          }}
        />

        {/* Top spacing for editorial balance */}
        <div className="w-full h-12 shrink-0 pointer-events-none" />

        {/* Centered Editorial Identity */}
        <div
          ref={identityRef}
          className="relative z-10 flex flex-col items-center justify-center text-center px-6 opacity-0"
        >
          <h1 className="font-sora font-semibold text-charcoal-900 text-xl sm:text-2xl md:text-3xl tracking-[0.26em] uppercase leading-none flex items-center justify-center">
            <span>ARPIT</span>
            <span className="text-[#C4943A] ml-2 sm:ml-3">AK</span>
          </h1>

          <p className="font-sora text-[0.65rem] sm:text-xs font-medium tracking-[0.36em] text-charcoal-500 uppercase mt-2.5 sm:mt-3 leading-none">
            GRAPHIC DESIGNER
          </p>

          {/* Hand-drawn thin gold line */}
          <svg
            className="w-20 sm:w-28 h-[3px] mt-3 sm:mt-3.5 overflow-visible"
            viewBox="0 0 110 3"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              ref={lineRef}
              d="M 1 1.5 C 35 1.2, 75 1.7, 109 1.5"
              stroke="#C4943A"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Bottom Reveal Seam & Subtle Mist Edge */}
        <div className="relative w-full shrink-0 pointer-events-none">
          {/* Subtle organic paper deckled edge */}
          <svg
            className="w-full h-3.5 sm:h-5 text-[#FAF3E8] fill-current block -mb-[1px]"
            viewBox="0 0 1440 24"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,0 L1440,0 L1440,10 Q1380,18 1320,8 Q1260,19 1200,11 Q1140,17 1080,7 Q1020,18 960,10 Q900,19 840,9 Q780,17 720,11 Q660,20 600,10 Q540,18 480,8 Q420,19 360,10 Q300,17 240,9 Q180,20 120,10 Q60,18 0,8 Z" />
          </svg>

          {/* Subtle mist reveal hint (Step 4) */}
          <div
            ref={mistEdgeRef}
            className="absolute -bottom-10 sm:-bottom-14 left-0 w-full h-16 sm:h-24 pointer-events-none opacity-0 overflow-hidden"
          >
            <img
              src="/assets/atmospheric-mist.webp"
              alt=""
              className="w-full h-full object-cover object-top opacity-55 mix-blend-multiply"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
