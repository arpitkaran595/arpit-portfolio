import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalInfo, handleResumeClick } from '../data/portfolio';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  isLoaded: boolean;
  navRef?: React.RefObject<HTMLElement>;
}

export default function Hero({ isLoaded, navRef }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────────────
  // OUTER SHELLS (Controlled strictly by ScrollTrigger scrub parallax)
  // ─────────────────────────────────────────────
  const skyShellRef = useRef<HTMLDivElement>(null);
  const marqueeShellRef = useRef<HTMLDivElement>(null);
  const mistBackShellRef = useRef<HTMLDivElement>(null);
  const horizonCloudShellRef = useRef<HTMLDivElement>(null);
  const cloudLeftBackShellRef = useRef<HTMLDivElement>(null);
  const cloudRightBackShellRef = useRef<HTMLDivElement>(null);
  const characterShellRef = useRef<HTMLDivElement>(null);
  const mistFrontShellRef = useRef<HTMLDivElement>(null);
  const cloudLeftFrontShellRef = useRef<HTMLDivElement>(null);
  const cloudRightFrontShellRef = useRef<HTMLDivElement>(null);
  const centerCloudShellRef = useRef<HTMLDivElement>(null);
  const identityShellRef = useRef<HTMLDivElement>(null);
  const uiShellRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorShellRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────────────
  // MOUSE 3D DEPTH WRAPPERS (Controlled strictly by smooth lerped mouse micro-parallax)
  // ─────────────────────────────────────────────
  const skyDepthRef = useRef<HTMLDivElement>(null);
  const lightGlowDepthRef = useRef<HTMLDivElement>(null);
  const marqueeDepthRef = useRef<HTMLDivElement>(null);
  const mistBackDepthRef = useRef<HTMLDivElement>(null);
  const horizonCloudDepthRef = useRef<HTMLDivElement>(null);
  const cloudLeftBackDepthRef = useRef<HTMLDivElement>(null);
  const cloudRightBackDepthRef = useRef<HTMLDivElement>(null);
  const characterDepthRef = useRef<HTMLDivElement>(null);
  const mistFrontDepthRef = useRef<HTMLDivElement>(null);
  const cloudLeftFrontDepthRef = useRef<HTMLDivElement>(null);
  const cloudRightFrontDepthRef = useRef<HTMLDivElement>(null);
  const centerCloudDepthRef = useRef<HTMLDivElement>(null);
  const uiDepthRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────────────
  // INNER ELEMENTS (Controlled strictly by one-time GSAP entrance timeline)
  // ─────────────────────────────────────────────
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const mistBackInnerRef = useRef<HTMLImageElement>(null);
  const horizonCloudInnerRef = useRef<HTMLImageElement>(null);
  const cloudLeftBackInnerRef = useRef<HTMLImageElement>(null);
  const cloudRightBackInnerRef = useRef<HTMLImageElement>(null);
  const characterInnerRef = useRef<HTMLImageElement>(null);
  const mistFrontInnerRef = useRef<HTMLImageElement>(null);
  const cloudLeftFrontInnerRef = useRef<HTMLImageElement>(null);
  const cloudRightFrontInnerRef = useRef<HTMLImageElement>(null);
  const centerCloudInnerRef = useRef<HTMLImageElement>(null);
  const identityInnerRef = useRef<HTMLDivElement>(null);
  const btnLeftRef = useRef<HTMLAnchorElement>(null);
  const btnRightRef = useRef<any>(null);
  const scrollIndicatorInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // ─────────────────────────────────────────────
      // ONE-TIME MASTER CINEMATIC ENTRANCE TIMELINE
      // Targets ONLY the INNER elements to completely prevent transform conflicts with ScrollTrigger / Mouse
      // ─────────────────────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // PHASE 01 — NAVBAR (Soft entry from top)
      if (navRef?.current) {
        tl.fromTo(
          navRef.current,
          { opacity: 0, y: -25 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
          0
        );
      }

      // PHASE 02 — BACKGROUND TYPOGRAPHY (Appears softly in background at 0.05s)
      if (!prefersReduced) {
        tl.fromTo(
          marqueeInnerRef.current,
          { opacity: 0, filter: 'blur(8px)', y: 15 },
          {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
          },
          0.05
        );
      } else {
        tl.fromTo(
          marqueeInnerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.35 },
          0.05
        );
      }

      // PHASE 03 — ATMOSPHERIC MIST (Begins at 0.10s)
      if (!prefersReduced) {
        tl.fromTo(
          mistBackInnerRef.current,
          { opacity: 0, x: -20, scale: 1.02, filter: 'blur(4px)' },
          { opacity: 0.75, x: 0, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
          0.10
        );
      } else {
        tl.fromTo(
          mistBackInnerRef.current,
          { opacity: 0 },
          { opacity: 0.75, duration: 0.35 },
          0.10
        );
      }

      // PHASE 04 — CLOUD ENVIRONMENT BUILDS UP (0.12s - 0.28s)
      // Horizon cloud bed
      tl.fromTo(
        horizonCloudInnerRef.current,
        { opacity: 0, y: 20, scale: 0.98 },
        { opacity: 0.75, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
        0.12
      );

      if (!prefersReduced) {
        // Mid-ground overlapping depth clouds
        tl.fromTo(
          cloudLeftBackInnerRef.current,
          { opacity: 0, filter: 'blur(6px)', scale: 0.97, x: -20 },
          { opacity: 0.7, filter: 'blur(1.8px)', scale: 1, x: 0, duration: 0.8, ease: 'power3.out' },
          0.18
        ).fromTo(
          cloudRightBackInnerRef.current,
          { opacity: 0, filter: 'blur(6px)', scale: 0.97, x: 20 },
          { opacity: 0.7, filter: 'blur(1.8px)', scale: 1, x: 0, duration: 0.8, ease: 'power3.out' },
          0.22
        );

        // Foreground left & right side clouds
        tl.fromTo(
          cloudLeftFrontInnerRef.current,
          { opacity: 0, filter: 'blur(6px)', scale: 0.97, x: -25, y: 15 },
          { opacity: 1, filter: 'blur(0px)', scale: 1, x: 0, y: 0, duration: 0.85, ease: 'power3.out' },
          0.20
        ).fromTo(
          cloudRightFrontInnerRef.current,
          { opacity: 0, filter: 'blur(6px)', scale: 0.97, x: 25, y: 15 },
          { opacity: 1, filter: 'blur(0px)', scale: 1, x: 0, y: 0, duration: 0.85, ease: 'power3.out' },
          0.25
        );

        // PHASE 05 — CENTER Whole cloud.png COMPLETES CLOUD ENVIRONMENT (0.28s)
        tl.fromTo(
          centerCloudInnerRef.current,
          { opacity: 0, filter: 'blur(6px)', scale: 0.97, y: 25 },
          { opacity: 1, filter: 'blur(0px)', scale: 1, y: 0, duration: 0.85, ease: 'power3.out' },
          0.28
        );
      } else {
        tl.fromTo(
          [
            cloudLeftBackInnerRef.current,
            cloudRightBackInnerRef.current,
            cloudLeftFrontInnerRef.current,
            cloudRightFrontInnerRef.current,
            centerCloudInnerRef.current,
          ],
          { opacity: 0 },
          { opacity: 1, duration: 0.4, stagger: 0.06 },
          0.15
        );
      }

      // PHASE 06 — CHARACTER EMERGES FROM CLOUDS (0.30s — fast & confident)
      if (!prefersReduced) {
        tl.fromTo(
          characterInnerRef.current,
          { opacity: 0, y: 70, scale: 0.96, filter: 'blur(4px)' },
          { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.95, ease: 'expo.out' },
          0.30
        ).fromTo(
          mistFrontInnerRef.current,
          { opacity: 0, y: 15 },
          { opacity: 0.75, y: 0, duration: 0.8, ease: 'power3.out' },
          0.40
        );
      } else {
        tl.fromTo(
          characterInnerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.45 },
          0.25
        ).fromTo(
          mistFrontInnerRef.current,
          { opacity: 0 },
          { opacity: 0.75, duration: 0.35 },
          0.30
        );
      }

      // PHASE 07 — IDENTITY LABEL (0.50s)
      tl.fromTo(
        identityInnerRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
        0.50
      );

      // PHASE 08 — HIRE ME CTA (0.60s)
      tl.fromTo(
        btnLeftRef.current,
        { opacity: 0, y: 14, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' },
        0.60
      );

      // PHASE 09 — DOWNLOAD RESUME CTA (0.68s)
      tl.fromTo(
        btnRightRef.current,
        { opacity: 0, y: 14, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' },
        0.68
      );

      // PHASE 10 — SCROLL INDICATOR (0.78s)
      tl.fromTo(
        scrollIndicatorInnerRef.current,
        { opacity: 0, y: 8 },
        { opacity: 0.9, y: 0, duration: 0.5, ease: 'power3.out' },
        0.78
      );

      // ─────────────────────────────────────────────
      // RESTING MICRO-ANIMATIONS (Subconscious Atmosphere)
      // Start smoothly once entrance sequence is settled (delay: 1.2s)
      // ─────────────────────────────────────────────
      if (!prefersReduced) {
        const idleTweens: gsap.core.Tween[] = [];

        idleTweens.push(
          gsap.to(horizonCloudInnerRef.current, {
            y: -4,
            scale: 1.01,
            duration: 9,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            delay: 1.2,
          }),
          gsap.to(cloudLeftBackInnerRef.current, {
            y: -7,
            x: -4,
            duration: 8.5,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            delay: 1.2,
          }),
          gsap.to(cloudRightBackInnerRef.current, {
            y: -6,
            x: 4,
            duration: 9.2,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            delay: 1.2,
          }),
          gsap.to(centerCloudInnerRef.current, {
            y: -5,
            scale: 1.012,
            duration: 8.0,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            delay: 1.2,
          }),
          gsap.to(cloudLeftFrontInnerRef.current, {
            y: -5,
            x: -3,
            duration: 6.8,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            delay: 1.2,
          }),
          gsap.to(cloudRightFrontInnerRef.current, {
            y: -5,
            x: 3,
            duration: 7.6,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            delay: 1.2,
          }),
          gsap.to([mistBackInnerRef.current, mistFrontInnerRef.current], {
            y: -4,
            scale: 1.02,
            duration: 8.5,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            delay: 1.2,
          }),
          gsap.to('.hero-scroll-dot', {
            y: 5,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
          })
        );

        // Pause idle resting animations when Hero is offscreen, resume when visible
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: () => idleTweens.forEach((t) => t.play()),
          onLeave: () => idleTweens.forEach((t) => t.pause()),
          onEnterBack: () => idleTweens.forEach((t) => t.play()),
          onLeaveBack: () => idleTweens.forEach((t) => t.pause()),
        });
      }

      // ─────────────────────────────────────────────
      // CONTINUOUS SCROLL-LINKED PARALLAX (Layered 3D Depth ~1.5x-2x Enhanced)
      // Controls STRICTLY the OUTER SHELLS — Zero conflict with entrance animation or mouse parallax
      // ─────────────────────────────────────────────
      if (!prefersReduced) {
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth < 1024 && !isMobile;
        const factor = isMobile ? 0.52 : isTablet ? 0.72 : 1.0;

        const scrollConfig = {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        };

        // LAYER 1 — Background sky / warm lighting glow (very slow movement)
        if (skyShellRef.current) {
          gsap.to(skyShellRef.current, {
            y: -30 * factor,
            ease: 'none',
            scrollTrigger: { ...scrollConfig },
          });
        }

        // LAYER 2 — Atmospheric mist (back)
        if (mistBackShellRef.current) {
          gsap.to(mistBackShellRef.current, {
            y: -60 * factor,
            ...(!isMobile ? { filter: 'blur(5px)' } : {}),
            opacity: 0.15,
            ease: 'none',
            scrollTrigger: { ...scrollConfig },
          });
        }

        // LAYER 3 — Large background typography (moves independently behind character)
        if (marqueeShellRef.current) {
          gsap.to(marqueeShellRef.current, {
            y: -120 * factor,
            x: -20 * factor,
            ease: 'none',
            scrollTrigger: { ...scrollConfig },
          });
        }

        // LAYER 4A — Distant horizon cloud bed
        if (horizonCloudShellRef.current) {
          gsap.to(horizonCloudShellRef.current, {
            y: -70 * factor,
            ...(!isMobile ? { filter: 'blur(5px)' } : {}),
            opacity: 0.25,
            ease: 'none',
            scrollTrigger: { ...scrollConfig },
          });
        }

        // LAYER 4B — Mid-ground side cloud formations (upward and subtle lateral drift with soft blur)
        if (cloudLeftBackShellRef.current) {
          gsap.to(cloudLeftBackShellRef.current, {
            y: -100 * factor,
            x: -15 * factor,
            ...(!isMobile ? { filter: 'blur(5px)' } : {}),
            opacity: 0.35,
            ease: 'none',
            scrollTrigger: { ...scrollConfig },
          });
        }
        if (cloudRightBackShellRef.current) {
          gsap.to(cloudRightBackShellRef.current, {
            y: -100 * factor,
            x: 15 * factor,
            ...(!isMobile ? { filter: 'blur(5px)' } : {}),
            opacity: 0.35,
            ease: 'none',
            scrollTrigger: { ...scrollConfig },
          });
        }

        // LAYER 5 — Main Character PNG (anchored focal point, melts gently into cloud atmosphere on scroll)
        if (characterShellRef.current) {
          gsap.to(characterShellRef.current, {
            y: -100 * factor,
            scale: 0.98,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: heroRef.current,
              start: '15% top',
              end: 'bottom top',
              scrub: 0.8,
            },
          });
        }

        // LAYER 6 — Foreground Left & Right Cloud Formations (move upward & outward with cinematic blur)
        if (cloudLeftFrontShellRef.current) {
          gsap.to(cloudLeftFrontShellRef.current, {
            y: -130 * factor,
            x: -20 * factor,
            scale: 1.02,
            ...(!isMobile ? { filter: 'blur(6px)' } : {}),
            opacity: 0.35,
            ease: 'none',
            scrollTrigger: { ...scrollConfig },
          });
        }
        if (cloudRightFrontShellRef.current) {
          gsap.to(cloudRightFrontShellRef.current, {
            y: -130 * factor,
            x: 20 * factor,
            scale: 1.02,
            ...(!isMobile ? { filter: 'blur(6px)' } : {}),
            opacity: 0.35,
            ease: 'none',
            scrollTrigger: { ...scrollConfig },
          });
        }

        // LAYER 7 — Center "Whole cloud.png" (moves upward with subtle depth blur & opacity falloff)
        if (centerCloudShellRef.current) {
          gsap.to(centerCloudShellRef.current, {
            y: -140 * factor,
            scale: 1.03,
            ...(!isMobile ? { filter: 'blur(8px)' } : {}),
            opacity: 0.3,
            ease: 'none',
            scrollTrigger: { ...scrollConfig },
          });
        }

        // LAYER 8 — Foreground mist wrap (moves upward and fades out)
        if (mistFrontShellRef.current) {
          gsap.to(mistFrontShellRef.current, {
            y: -190 * factor,
            ...(!isMobile ? { filter: 'blur(8px)' } : {}),
            opacity: 0,
            ease: 'none',
            scrollTrigger: { ...scrollConfig },
          });
        }

        // LAYER 9 — UI Elements / CTAs (smooth exit)
        if (uiShellRef.current) {
          gsap.to(uiShellRef.current, {
            y: -65 * factor,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: '60% top',
              scrub: 0.8,
            },
          });
        }

        if (identityShellRef.current) {
          gsap.to(identityShellRef.current, {
            y: -35 * factor,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: '50% top',
              scrub: 0.8,
            },
          });
        }

        if (scrollIndicatorShellRef.current) {
          gsap.to(scrollIndicatorShellRef.current, {
            opacity: 0,
            y: -15 * factor,
            ease: 'none',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: '20% top',
              scrub: 0.8,
            },
          });
        }
      }

      // ─────────────────────────────────────────────
      // MOUSE-BASED MICRO 3D DEPTH SYSTEM (Subtle, Eased & Inertial)
      // Controls the dedicated MOUSE DEPTH WRAPPERS without interfering with ScrollTrigger
      // ─────────────────────────────────────────────
      if (!prefersReduced) {
        const skyX = skyDepthRef.current ? gsap.quickTo(skyDepthRef.current, 'x', { duration: 1.4, ease: 'power2.out' }) : null;
        const skyY = skyDepthRef.current ? gsap.quickTo(skyDepthRef.current, 'y', { duration: 1.4, ease: 'power2.out' }) : null;

        const lightX = lightGlowDepthRef.current ? gsap.quickTo(lightGlowDepthRef.current, 'x', { duration: 1.6, ease: 'power2.out' }) : null;
        const lightY = lightGlowDepthRef.current ? gsap.quickTo(lightGlowDepthRef.current, 'y', { duration: 1.6, ease: 'power2.out' }) : null;

        const marqueeX = marqueeDepthRef.current ? gsap.quickTo(marqueeDepthRef.current, 'x', { duration: 1.2, ease: 'power2.out' }) : null;
        const marqueeY = marqueeDepthRef.current ? gsap.quickTo(marqueeDepthRef.current, 'y', { duration: 1.2, ease: 'power2.out' }) : null;

        const mistBackX = mistBackDepthRef.current ? gsap.quickTo(mistBackDepthRef.current, 'x', { duration: 1.3, ease: 'power2.out' }) : null;
        const mistBackY = mistBackDepthRef.current ? gsap.quickTo(mistBackDepthRef.current, 'y', { duration: 1.3, ease: 'power2.out' }) : null;

        const horizonX = horizonCloudDepthRef.current ? gsap.quickTo(horizonCloudDepthRef.current, 'x', { duration: 1.2, ease: 'power2.out' }) : null;
        const horizonY = horizonCloudDepthRef.current ? gsap.quickTo(horizonCloudDepthRef.current, 'y', { duration: 1.2, ease: 'power2.out' }) : null;

        const cloudLeftBackX = cloudLeftBackDepthRef.current ? gsap.quickTo(cloudLeftBackDepthRef.current, 'x', { duration: 1.1, ease: 'power2.out' }) : null;
        const cloudLeftBackY = cloudLeftBackDepthRef.current ? gsap.quickTo(cloudLeftBackDepthRef.current, 'y', { duration: 1.1, ease: 'power2.out' }) : null;
        const cloudRightBackX = cloudRightBackDepthRef.current ? gsap.quickTo(cloudRightBackDepthRef.current, 'x', { duration: 1.1, ease: 'power2.out' }) : null;
        const cloudRightBackY = cloudRightBackDepthRef.current ? gsap.quickTo(cloudRightBackDepthRef.current, 'y', { duration: 1.1, ease: 'power2.out' }) : null;

        const characterX = characterDepthRef.current ? gsap.quickTo(characterDepthRef.current, 'x', { duration: 1.0, ease: 'power2.out' }) : null;
        const characterY = characterDepthRef.current ? gsap.quickTo(characterDepthRef.current, 'y', { duration: 1.0, ease: 'power2.out' }) : null;

        const cloudLeftFrontX = cloudLeftFrontDepthRef.current ? gsap.quickTo(cloudLeftFrontDepthRef.current, 'x', { duration: 0.95, ease: 'power2.out' }) : null;
        const cloudLeftFrontY = cloudLeftFrontDepthRef.current ? gsap.quickTo(cloudLeftFrontDepthRef.current, 'y', { duration: 0.95, ease: 'power2.out' }) : null;
        const cloudRightFrontX = cloudRightFrontDepthRef.current ? gsap.quickTo(cloudRightFrontDepthRef.current, 'x', { duration: 0.95, ease: 'power2.out' }) : null;
        const cloudRightFrontY = cloudRightFrontDepthRef.current ? gsap.quickTo(cloudRightFrontDepthRef.current, 'y', { duration: 0.95, ease: 'power2.out' }) : null;

        const uiX = uiDepthRef.current ? gsap.quickTo(uiDepthRef.current, 'x', { duration: 1.0, ease: 'power2.out' }) : null;
        const uiY = uiDepthRef.current ? gsap.quickTo(uiDepthRef.current, 'y', { duration: 1.0, ease: 'power2.out' }) : null;

        const centerCloudX = centerCloudDepthRef.current ? gsap.quickTo(centerCloudDepthRef.current, 'x', { duration: 0.9, ease: 'power2.out' }) : null;
        const centerCloudY = centerCloudDepthRef.current ? gsap.quickTo(centerCloudDepthRef.current, 'y', { duration: 0.9, ease: 'power2.out' }) : null;

        const mistFrontX = mistFrontDepthRef.current ? gsap.quickTo(mistFrontDepthRef.current, 'x', { duration: 0.9, ease: 'power2.out' }) : null;
        const mistFrontY = mistFrontDepthRef.current ? gsap.quickTo(mistFrontDepthRef.current, 'y', { duration: 0.9, ease: 'power2.out' }) : null;

        const handleMouseMove = (e: MouseEvent) => {
          const nx = (e.clientX / window.innerWidth - 0.5) * 2;
          const ny = (e.clientY / window.innerHeight - 0.5) * 2;

          // 1. Sky: 3px / 2px
          skyX?.(nx * 3);
          skyY?.(ny * 2);

          // 1B. Light Glow: 12px / 9px
          lightX?.(nx * 12);
          lightY?.(ny * 9);

          // 2. Mist Back: 7px / 5px
          mistBackX?.(nx * 7);
          mistBackY?.(ny * 5);

          // 3. Marquee: 11px / 8px
          marqueeX?.(nx * 11);
          marqueeY?.(ny * 8);

          // 4. Distant Horizon Clouds: 15px / 10px
          horizonX?.(nx * 15);
          horizonY?.(ny * 10);

          // 5. Midground Side Clouds: 18px / 12px
          cloudLeftBackX?.(nx * 18);
          cloudLeftBackY?.(ny * 12);
          cloudRightBackX?.(nx * 18);
          cloudRightBackY?.(ny * 12);

          // 6. Character: 10px / 7px (independent opposite shift on X for true 3D spatial separation)
          characterX?.(nx * -10);
          characterY?.(ny * -7);

          // 7. Buttons: 16px / 12px
          uiX?.(nx * 16);
          uiY?.(ny * 12);

          // 8. Foreground Side Clouds: 22px / 16px
          cloudLeftFrontX?.(nx * 22);
          cloudLeftFrontY?.(ny * 16);
          cloudRightFrontX?.(nx * 22);
          cloudRightFrontY?.(ny * 16);

          // 9. Whole cloud.png (Foreground): 28px / 20px (strongest foreground depth)
          centerCloudX?.(nx * 28);
          centerCloudY?.(ny * 20);

          // 10. Foreground Mist: 32px / 22px
          mistFrontX?.(nx * 32);
          mistFrontY?.(ny * 22);
        };

        const handleMouseLeave = () => {
          skyX?.(0); skyY?.(0);
          lightX?.(0); lightY?.(0);
          mistBackX?.(0); mistBackY?.(0);
          marqueeX?.(0); marqueeY?.(0);
          horizonX?.(0); horizonY?.(0);
          cloudLeftBackX?.(0); cloudLeftBackY?.(0);
          cloudRightBackX?.(0); cloudRightBackY?.(0);
          characterX?.(0); characterY?.(0);
          uiX?.(0); uiY?.(0);
          cloudLeftFrontX?.(0); cloudLeftFrontY?.(0);
          cloudRightFrontX?.(0); cloudRightFrontY?.(0);
          centerCloudX?.(0); centerCloudY?.(0);
          mistFrontX?.(0); mistFrontY?.(0);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseleave', handleMouseLeave);
        };
      }
    }, heroRef);

    return () => ctx.revert();
  }, [isLoaded, navRef]);

  // Single continuous horizontal marquee ribbon unit with explicit gap
  const RibbonSentence = () => (
    <span className="inline-flex items-center gap-6 md:gap-10 pr-6 md:pr-10 shrink-0">
      <span className="hero-bullet" />
      <span className="hero-text-solid">ARPIT AK</span>
      <span className="hero-bullet" />
      <span className="hero-text-outlined">CREATIVE DESIGNER</span>
      <span className="hero-bullet" />
      <span className="hero-text-outlined">VIDEO EDITOR</span>
      <span className="hero-bullet" />
      <span className="hero-text-outlined">MOTION DESIGNER</span>
      <span className="hero-bullet" />
      <span className="hero-text-outlined">VISUAL STORYTELLER</span>
    </span>
  );

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative w-full h-[100svh] min-h-[100svh] max-h-[100svh] bg-[#FAF3E8] overflow-hidden select-none box-border"
    >
      {/* ═══════════════════════════════════════════
          LAYER 01 — ATMOSPHERIC WARM SKY LIGHTING & MOUSE-REACTIVE LIGHT GLOW
          Seamless warm ivory sky with golden-peach and lilac-lavender depth
      ═══════════════════════════════════════════ */}
      <div
        ref={skyShellRef}
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 45%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.25) 78%, rgba(0,0,0,0.04) 90%, transparent 98%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 45%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.25) 78%, rgba(0,0,0,0.04) 90%, transparent 98%)',
        }}
      >
        <div ref={skyDepthRef} className="w-full h-full will-change-transform">
          <div
            className="absolute bottom-0 left-0 w-[65vw] h-[70vh] opacity-60 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 15% 85%, rgba(246, 215, 178, 0.6) 0%, rgba(246, 215, 178, 0.2) 50%, transparent 75%)',
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-[65vw] h-[70vh] opacity-55 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 85% 85%, rgba(226, 212, 238, 0.55) 0%, rgba(226, 212, 238, 0.18) 50%, transparent 75%)',
            }}
          />
          <div
            className="absolute bottom-0 inset-x-0 h-[45vh] opacity-45 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 95%, rgba(253, 246, 236, 0.8) 0%, transparent 70%)',
            }}
          />
          {/* Subtle mouse-reactive sunbeam light shift */}
          <div
            ref={lightGlowDepthRef}
            className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[70vw] h-[55vh] opacity-35 pointer-events-none will-change-transform"
            style={{
              background: 'radial-gradient(ellipse at 50% 30%, rgba(246, 215, 178, 0.45) 0%, rgba(253, 246, 236, 0.2) 50%, transparent 75%)',
            }}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          LAYER 04 — SINGLE-LINE BACKGROUND TYPOGRAPHY
          Outer shell for ScrollTrigger parallax; Mouse depth wrapper; Inner for marquee
          Robust 2-group w-max track translating to -50% with zero overlap or letter collisions
      ═══════════════════════════════════════════ */}
      <div
        ref={marqueeShellRef}
        className="absolute inset-x-0 z-[10] overflow-hidden pointer-events-none"
        style={{ top: '46%', transform: 'translateY(-50%)' }}
      >
        <div ref={marqueeDepthRef} className="w-full will-change-transform">
          <div ref={marqueeInnerRef} className="w-full opacity-0">
            <div className="flex w-max animate-marquee-left hero-marquee-text italic">
              <div className="flex shrink-0 items-center">
                <RibbonSentence />
                <RibbonSentence />
              </div>
              <div className="flex shrink-0 items-center" aria-hidden="true">
                <RibbonSentence />
                <RibbonSentence />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          LAYER 05A — DISTANT CLOUD HORIZON (BACK CLOUD BED)
      ═══════════════════════════════════════════ */}
      <div ref={horizonCloudShellRef} className="absolute bottom-0 left-0 w-full z-[12] pointer-events-none">
        <div ref={horizonCloudDepthRef} className="w-full will-change-transform">
          <img
            ref={horizonCloudInnerRef}
            src="/assets/cloud-horizon.webp"
            alt=""
            loading="eager"
            decoding="async"
            className="w-full opacity-0 object-cover object-bottom"
            style={{
              height: '52vh',
              filter: 'blur(2px) contrast(1.04) saturate(1.03)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 10%, black 28%, black 42%, rgba(0,0,0,0.7) 56%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.06) 84%, transparent 95%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 10%, black 28%, black 42%, rgba(0,0,0,0.7) 56%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.06) 84%, transparent 95%)',
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          LAYER 05B — ATMOSPHERIC MIST (BACK)
      ═══════════════════════════════════════════ */}
      <div ref={mistBackShellRef} className="absolute bottom-0 left-0 w-full z-[14] pointer-events-none">
        <div ref={mistBackDepthRef} className="w-full will-change-transform">
          <img
            ref={mistBackInnerRef}
            src="/assets/atmospheric-mist.webp"
            alt=""
            loading="eager"
            decoding="async"
            className="w-full opacity-0 object-cover object-bottom"
            style={{
              height: '75vh',
              filter: 'contrast(1.03) saturate(1.04)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 15%, black 32%, black 46%, rgba(0,0,0,0.65) 58%, rgba(0,0,0,0.25) 72%, rgba(0,0,0,0.05) 86%, transparent 96%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 15%, black 32%, black 46%, rgba(0,0,0,0.65) 58%, rgba(0,0,0,0.25) 72%, rgba(0,0,0,0.05) 86%, transparent 96%)',
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          LAYER 05C — MID-GROUND CLOUD MASSES (LEFT & RIGHT OVERLAP)
      ═══════════════════════════════════════════ */}
      <div ref={cloudLeftBackShellRef} className="absolute bottom-[0%] left-[-8%] z-[16] pointer-events-none origin-bottom-left">
        <div ref={cloudLeftBackDepthRef} className="will-change-transform">
          <img
            ref={cloudLeftBackInnerRef}
            src="/assets/cloud-left.webp"
            alt=""
            loading="eager"
            decoding="async"
            className="opacity-0"
            style={{
              width: 'clamp(520px, 68vw, 1100px)',
              maxWidth: '74vw',
              filter: 'blur(1.8px) contrast(1.04) saturate(1.04)',
              maskImage: 'linear-gradient(to bottom, black 0%, black 35%, rgba(0,0,0,0.8) 48%, rgba(0,0,0,0.45) 62%, rgba(0,0,0,0.18) 76%, rgba(0,0,0,0.04) 88%, transparent 96%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 35%, rgba(0,0,0,0.8) 48%, rgba(0,0,0,0.45) 62%, rgba(0,0,0,0.18) 76%, rgba(0,0,0,0.04) 88%, transparent 96%)',
            }}
            draggable={false}
          />
        </div>
      </div>
      <div ref={cloudRightBackShellRef} className="absolute bottom-[0%] right-[-8%] z-[16] pointer-events-none origin-bottom-right">
        <div ref={cloudRightBackDepthRef} className="will-change-transform">
          <img
            ref={cloudRightBackInnerRef}
            src="/assets/cloud-right.webp"
            alt=""
            loading="eager"
            decoding="async"
            className="opacity-0"
            style={{
              width: 'clamp(520px, 68vw, 1100px)',
              maxWidth: '74vw',
              filter: 'blur(1.8px) contrast(1.04) saturate(1.04)',
              maskImage: 'linear-gradient(to bottom, black 0%, black 35%, rgba(0,0,0,0.8) 48%, rgba(0,0,0,0.45) 62%, rgba(0,0,0,0.18) 76%, rgba(0,0,0,0.04) 88%, transparent 96%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 35%, rgba(0,0,0,0.8) 48%, rgba(0,0,0,0.45) 62%, rgba(0,0,0,0.18) 76%, rgba(0,0,0,0.04) 88%, transparent 96%)',
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          LAYER 06B — FOREGROUND SIDE CLOUD BASE (MIDGROUND DEPTH)
          Placed at z-[18] (behind character & buttons, framing outer landscape)
      ═══════════════════════════════════════════ */}
      <div ref={cloudLeftFrontShellRef} className="absolute bottom-[-4%] left-[-4%] z-[18] pointer-events-none origin-bottom-left">
        <div ref={cloudLeftFrontDepthRef} className="will-change-transform">
          <img
            ref={cloudLeftFrontInnerRef}
            src="/assets/cloud-left.webp"
            alt=""
            loading="eager"
            decoding="async"
            className="opacity-0"
            style={{
              width: 'clamp(540px, 68vw, 1120px)',
              maxWidth: '74vw',
              filter: 'contrast(1.08) brightness(0.98) saturate(1.06)',
              maskImage: 'linear-gradient(to bottom, black 0%, black 35%, rgba(0,0,0,0.8) 48%, rgba(0,0,0,0.45) 62%, rgba(0,0,0,0.18) 76%, rgba(0,0,0,0.04) 88%, transparent 96%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 35%, rgba(0,0,0,0.8) 48%, rgba(0,0,0,0.45) 62%, rgba(0,0,0,0.18) 76%, rgba(0,0,0,0.04) 88%, transparent 96%)',
            }}
            draggable={false}
          />
        </div>
      </div>
      <div ref={cloudRightFrontShellRef} className="absolute bottom-[-4%] right-[-4%] z-[18] pointer-events-none origin-bottom-right">
        <div ref={cloudRightFrontDepthRef} className="will-change-transform">
          <img
            ref={cloudRightFrontInnerRef}
            src="/assets/cloud-right.webp"
            alt=""
            loading="eager"
            decoding="async"
            className="opacity-0"
            style={{
              width: 'clamp(540px, 68vw, 1120px)',
              maxWidth: '74vw',
              filter: 'contrast(1.08) brightness(0.98) saturate(1.06)',
              maskImage: 'linear-gradient(to bottom, black 0%, black 35%, rgba(0,0,0,0.8) 48%, rgba(0,0,0,0.45) 62%, rgba(0,0,0,0.18) 76%, rgba(0,0,0,0.04) 88%, transparent 96%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 35%, rgba(0,0,0,0.8) 48%, rgba(0,0,0,0.45) 62%, rgba(0,0,0,0.18) 76%, rgba(0,0,0,0.04) 88%, transparent 96%)',
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          LAYER 07 — CHARACTER (PRIMARY DOMINANT FOCAL POINT)
          Outer shell for ScrollTrigger parallax; Depth wrapper for independent mouse separation;
          Inner element for smooth cloud emergence.
          Includes soft organic bottom dissolve and rich warm ambient occlusion shadow.
      ═══════════════════════════════════════════ */}
      <div
        ref={characterShellRef}
        className="absolute left-1/2 z-[20] pointer-events-none flex justify-center"
        style={{
          bottom: '-15%',
          transform: 'translateX(-50%)',
          width: 'clamp(580px, 90vw, 1220px)',
          height: 'clamp(740px, 108vh, 1200px)',
        }}
      >
        <div ref={characterDepthRef} className="w-full h-full will-change-transform flex justify-center">
          <img
            ref={characterInnerRef}
            src="/assets/character-cutout.webp"
            alt="Arpit AK"
            loading="eager"
            decoding="async"
            className="w-full h-full object-contain object-bottom opacity-0"
            style={{
              maskImage: 'linear-gradient(to bottom, black 0%, black 36%, rgba(0,0,0,0.85) 46%, rgba(0,0,0,0.45) 58%, rgba(0,0,0,0.12) 68%, transparent 78%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 36%, rgba(0,0,0,0.85) 46%, rgba(0,0,0,0.45) 58%, rgba(0,0,0,0.12) 68%, transparent 78%)',
              filter: 'drop-shadow(0 22px 38px rgba(45, 30, 20, 0.16)) drop-shadow(0 6px 16px rgba(246, 215, 178, 0.28))',
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          LAYER 08 — FOREGROUND ATMOSPHERIC MIST WRAP
      ═══════════════════════════════════════════ */}
      <div
        ref={mistFrontShellRef}
        className="absolute bottom-0 inset-x-0 z-[23] pointer-events-none flex justify-center items-end"
        style={{ height: '38%' }}
      >
        <div ref={mistFrontDepthRef} className="w-full h-full will-change-transform">
          <img
            ref={mistFrontInnerRef}
            src="/assets/atmospheric-mist.webp"
            alt=""
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover object-bottom opacity-0"
            style={{
              filter: 'contrast(1.03) saturate(1.04)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 18%, black 32%, black 46%, rgba(0,0,0,0.65) 58%, rgba(0,0,0,0.25) 72%, rgba(0,0,0,0.05) 86%, transparent 96%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 18%, black 32%, black 46%, rgba(0,0,0,0.65) 58%, rgba(0,0,0,0.25) 72%, rgba(0,0,0,0.05) 86%, transparent 96%)',
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          LAYER 09 — CTA BUTTONS (ABOVE BACKGROUND CLOUDS, JUST BEHIND FOREGROUND WHOLE CLOUD)
          Placed at z-[26] (above character lower body & background clouds, behind Whole cloud.png)
          Positioned flanking character's lower torso / upper leg region (~20-25% viewport width from edges)
      ═══════════════════════════════════════════ */}
      <div
        ref={uiShellRef}
        className="absolute inset-x-0 z-[26] pointer-events-none flex justify-center"
        style={{ bottom: 'clamp(255px, 35.5vh, 320px)' }}
      >
        <div ref={uiDepthRef} className="w-full max-w-[1040px] px-6 md:px-8 will-change-transform">
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
            {/* HIRE ME */}
            <a
              ref={btnLeftRef}
              href={personalInfo.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta-card opacity-0 pointer-events-auto group"
            >
              <div className="w-11 h-11 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.125-.397-.18-1.229-.453-2.339-1.45-1.09-1.004-1.814-2.228-2.025-2.587-.208-.358-.223-.55-.114-.735.093-.158.201-.274.301-.392.1-.118.132-.198.2-.332.066-.134.033-.25-.015-.348-.05-.097-.42-1.011-.576-1.385-.15-.362-.303-.313-.418-.318l-.358-.005c-.122 0-.323.045-.492.23-.17.184-.645.631-.645 1.542 0 .911.66 1.792.752 1.916.09.124 1.306 1.993 3.163 2.795.441.19.785.304 1.054.389.443.14.846.12 1.164.073.359-.053 1.099-.45 1.253-.884.155-.434.155-.806.109-.884-.047-.078-.17-.124-.366-.222z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0 pr-1 flex flex-col justify-center">
                <div className="font-sora font-bold text-charcoal-800 text-sm tracking-wide leading-tight">
                  HIRE ME
                </div>
                <div className="font-sora text-charcoal-500 text-xs mt-0.5 leading-tight truncate">
                  Let&apos;s work together
                </div>
              </div>
              <span className="text-charcoal-600 text-lg leading-none shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                ↗
              </span>
            </a>

            {/* RESUME CTA */}
            {personalInfo.hasResumeFile ? (
              <a
                ref={btnRightRef}
                href={personalInfo.resumePath}
                download="Arpit_AK_Resume.pdf"
                className="hero-cta-card opacity-0 pointer-events-auto group"
              >
                <div className="w-11 h-11 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0 pr-1 flex flex-col justify-center">
                  <div className="font-sora font-bold text-charcoal-800 text-sm tracking-wide leading-tight">
                    DOWNLOAD RESUME
                  </div>
                  <div className="font-sora text-charcoal-500 text-xs mt-0.5 leading-tight truncate">
                    Get my CV / Resume
                  </div>
                </div>
                <span className="text-charcoal-600 text-lg leading-none shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                  ↗
                </span>
              </a>
            ) : (
              <div
                ref={btnRightRef}
                className="hero-cta-card opacity-0 pointer-events-auto cursor-default select-none border border-[#E9DFCE]/80 bg-[#FFFDF9]/85"
                title="Resume coming soon"
              >
                <div className="w-11 h-11 rounded-full bg-[#3A3530] flex items-center justify-center text-white/80 shrink-0">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0 pr-1 flex flex-col justify-center">
                  <div className="font-sora font-bold text-charcoal-700 text-sm tracking-wide leading-tight flex items-center gap-1.5">
                    RESUME
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-[#A3772C] bg-[#A3772C]/10 px-1.5 py-0.5 rounded-full">
                      Soon
                    </span>
                  </div>
                  <div className="font-sora text-charcoal-400 text-xs mt-0.5 leading-tight truncate">
                    Resume coming soon
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          LAYER 10 — FULL-BLEED FOREGROUND WHOLE CLOUD (Whole cloud.png)
          LAYERED IN FRONT OF CTA BUTTONS (z-[30])
          Full-bleed horizontal overscan (130vw) spanning edge-to-edge beyond the viewport
          Naturally overlaps the bottom 10-15% of CTA buttons, establishing genuine environmental depth
      ═══════════════════════════════════════════ */}
      <div
        ref={centerCloudShellRef}
        className="absolute left-1/2 z-[30] pointer-events-none flex justify-center items-end"
        style={{
          bottom: '-6%',
          transform: 'translateX(-50%)',
          width: 'clamp(1400px, 130vw, 2200px)',
        }}
      >
        <div ref={centerCloudDepthRef} className="w-full will-change-transform flex justify-center">
          <img
            ref={centerCloudInnerRef}
            src="/assets/Whole cloud.webp"
            alt=""
            loading="eager"
            decoding="async"
            className="w-full h-auto object-contain object-bottom opacity-0"
            style={{
              filter: 'contrast(1.09) brightness(0.98) saturate(1.06)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 4%, black 16%, black 36%, rgba(0,0,0,0.85) 48%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.25) 72%, rgba(0,0,0,0.06) 84%, transparent 96%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 4%, black 16%, black 36%, rgba(0,0,0,0.85) 48%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.25) 72%, rgba(0,0,0,0.06) 84%, transparent 96%)',
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          LAYER 11 — CINEMATIC TONAL COLOR GRADE & VIGNETTE
          Luminous warm center with subtle tonal depth in outer cloud regions
      ═══════════════════════════════════════════ */}
      <div
        className="absolute inset-0 z-[32] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(255, 252, 248, 0) 50%, rgba(246, 215, 178, 0.07) 78%, rgba(215, 198, 230, 0.12) 100%)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 40%, rgba(0,0,0,0.6) 58%, rgba(0,0,0,0.2) 76%, rgba(0,0,0,0.03) 88%, transparent 96%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 40%, rgba(0,0,0,0.6) 58%, rgba(0,0,0,0.2) 76%, rgba(0,0,0,0.03) 88%, transparent 96%)',
        }}
      />

      {/* ═══════════════════════════════════════════
          LAYER 12 — IDENTITY LABEL
          Top-left: role text with gold accent line
      ═══════════════════════════════════════════ */}
      <div
        ref={identityShellRef}
        className="absolute z-[35] pointer-events-none"
        style={{ top: 'clamp(90px, 15vh, 140px)', left: 'clamp(24px, 4.5vw, 72px)' }}
      >
        <div ref={identityInnerRef} className="flex items-stretch gap-3 opacity-0">
          <div className="w-[2.5px] bg-gold-400 self-stretch rounded-full" />
          <div className="flex flex-col justify-between py-0.5">
            <span className="font-sora text-xs md:text-sm font-normal text-charcoal-700 leading-tight">
              Creative Designer
            </span>
            <span className="font-sora text-xs md:text-sm font-normal text-charcoal-700 leading-tight mt-1">
              Video Editor
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          LAYER 13 — SCROLL INDICATOR
      ═══════════════════════════════════════════ */}
      <div
        ref={scrollIndicatorShellRef}
        className="absolute bottom-2.5 md:bottom-4 left-1/2 -translate-x-1/2 z-[36] pointer-events-none"
      >
        <div ref={scrollIndicatorInnerRef} className="flex flex-col items-center gap-1.5 opacity-0">
          <div className="w-4 h-7 border-[1.5px] border-charcoal-800/80 rounded-full flex justify-center pt-1.5">
            <div className="hero-scroll-dot w-1 h-1.5 bg-charcoal-800 rounded-full" />
          </div>
          <span className="font-sora text-[0.55rem] tracking-[0.25em] text-charcoal-700 uppercase font-medium">
            Scroll Down
          </span>
          <div className="w-[1px] h-3.5 bg-charcoal-800/25" />
        </div>
      </div>
    </section>
  );
}
