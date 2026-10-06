import React, { useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalInfo, socialLinks } from '../data/portfolio';

gsap.registerPlugin(ScrollTrigger);

// Restrained layered text depth style applied identically to both English & Hindi layers
const typographicDepthStyle: React.CSSProperties = {
  textShadow:
    '0 2px 5px rgba(0, 0, 0, 0.08), 0 10px 28px rgba(14, 45, 28, 0.22), 0 24px 56px rgba(9, 32, 20, 0.16)',
};

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const landscapeRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const mistRef = useRef<HTMLDivElement>(null);
  const bgHillRef = useRef<HTMLDivElement>(null);
  const fgHillRef = useRef<HTMLDivElement>(null);
  const nameLockupRef = useRef<HTMLDivElement>(null);
  const textStageRef = useRef<HTMLDivElement>(null);
  const englishTextRef = useRef<HTMLDivElement>(null);
  const hindiTextRef = useRef<HTMLDivElement>(null);

  // Interactive Cursor-following Mask state
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const maskRadius = useRef({ current: 0, target: 0 });
  const isHovering = useRef(false);
  const rafId = useRef<number | null>(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. GSAP ScrollTrigger Entrance (Plays ONCE) + Subtle Idle Motion
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const idleTweens: gsap.core.Tween[] = [];

      const footerTrigger = ScrollTrigger.create({
        trigger: footerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => idleTweens.forEach((t) => t.play()),
        onLeave: () => idleTweens.forEach((t) => t.pause()),
        onEnterBack: () => idleTweens.forEach((t) => t.play()),
        onLeaveBack: () => idleTweens.forEach((t) => t.pause()),
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 82%',
          once: true,
        },
        onComplete: () => {
          if (prefersReduced) return;

          // Subtle continuous idle motion for landscape elements
          if (mistRef.current) {
            idleTweens.push(
              gsap.to(mistRef.current, {
                x: '+=10',
                duration: 16,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
              })
            );
          }

          if (bgHillRef.current) {
            idleTweens.push(
              gsap.to(bgHillRef.current, {
                y: '+=2.2',
                duration: 8.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
              })
            );
          }

          if (fgHillRef.current) {
            idleTweens.push(
              gsap.to(fgHillRef.current, {
                y: '+=1.4',
                duration: 10.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
              })
            );
          }

          if (skyRef.current) {
            idleTweens.push(
              gsap.to(skyRef.current, {
                opacity: 0.94,
                duration: 12,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
              })
            );
          }

          if (footerTrigger && !footerTrigger.isActive) {
            idleTweens.forEach((t) => t.pause());
          }
        },
      });

      if (!prefersReduced) {
        // 0.05–0.45s: Eyebrow and Main Editorial CTA Headline fade in
        tl.fromTo(
          '.footer-cta-eyebrow, .footer-cta-headline',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out' },
          0.05
        );

        // 0.20–0.60s: Personal brand sign-off fades in
        tl.fromTo(
          '.footer-cta-brand',
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          0.2
        );

        // 0.35–0.75s: CTA Button settles into place
        tl.fromTo(
          '.footer-cta-btn',
          { opacity: 0, scale: 0.96, y: 12 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          0.35
        );

        // 0.45–0.85s: Navigation & social links appear
        tl.fromTo(
          '.footer-nav-links',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
          0.45
        );

        // 0.55–1.05s: Landscape sky reveals
        if (skyRef.current) {
          tl.fromTo(
            skyRef.current,
            { opacity: 0.35 },
            { opacity: 1, duration: 0.5, ease: 'power2.out' },
            0.55
          );
        }

        // 0.70–1.25s: Background hill settles
        if (bgHillRef.current) {
          tl.fromTo(
            bgHillRef.current,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
            0.7
          );
        }

        // 0.85–1.40s: Huge ARPIT AK name rises in landscape
        if (nameLockupRef.current) {
          tl.fromTo(
            nameLockupRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
            0.85
          );
        }

        // 1.05–1.60s: Foreground hill rises into final framing
        if (fgHillRef.current) {
          tl.fromTo(
            fgHillRef.current,
            { opacity: 0.6, y: 26 },
            { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
            1.05
          );
        }
      } else {
        // Immediate display for reduced motion
        gsap.set(
          ['.footer-cta-eyebrow', '.footer-cta-headline', '.footer-cta-brand', '.footer-cta-btn', '.footer-nav-links'],
          { opacity: 1, y: 0, scale: 1 }
        );
        if (skyRef.current) gsap.set(skyRef.current, { opacity: 1 });
        if (bgHillRef.current) gsap.set(bgHillRef.current, { opacity: 1, y: 0 });
        if (nameLockupRef.current) gsap.set(nameLockupRef.current, { opacity: 1, y: 0 });
        if (fgHillRef.current) gsap.set(fgHillRef.current, { opacity: 1, y: 0 });
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. Fluid Lerped Cursor Masking for ARPIT AK → अर्पित in Landscape
  // ─────────────────────────────────────────────────────────────────────────────
  const updateMask = useCallback(() => {
    mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.16;
    mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.16;
    maskRadius.current.current += (maskRadius.current.target - maskRadius.current.current) * 0.14;

    const r = maskRadius.current.current;
    const x = mousePos.current.x;
    const y = mousePos.current.y;

    if (hindiTextRef.current && englishTextRef.current) {
      if (r > 0.5) {
        hindiTextRef.current.style.opacity = '1';

        const hindiMask = `radial-gradient(circle ${r}px at ${x}px ${y}px, black 0%, black 45%, rgba(0, 0, 0, 0.7) 70%, transparent 100%)`;
        hindiTextRef.current.style.maskImage = hindiMask;
        hindiTextRef.current.style.webkitMaskImage = hindiMask;
        hindiTextRef.current.style.maskRepeat = 'no-repeat';
        hindiTextRef.current.style.webkitMaskRepeat = 'no-repeat';

        const englishMask = `radial-gradient(circle ${r}px at ${x}px ${y}px, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.3) 65%, black 100%)`;
        englishTextRef.current.style.maskImage = englishMask;
        englishTextRef.current.style.webkitMaskImage = englishMask;
        englishTextRef.current.style.maskRepeat = 'no-repeat';
        englishTextRef.current.style.webkitMaskRepeat = 'no-repeat';
      } else {
        hindiTextRef.current.style.opacity = '0';
        hindiTextRef.current.style.maskImage = 'none';
        hindiTextRef.current.style.webkitMaskImage = 'none';

        englishTextRef.current.style.maskImage = 'none';
        englishTextRef.current.style.webkitMaskImage = 'none';
      }
    }

    if (isHovering.current || r > 0.5) {
      rafId.current = requestAnimationFrame(updateMask);
    } else {
      rafId.current = null;
    }
  }, []);

  const startAnimation = useCallback(() => {
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(updateMask);
    }
  }, [updateMask]);

  const touchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTouchRevealedRef = useRef(false);
  const lastTouchTimeRef = useRef(0);

  const triggerTouchReveal = useCallback((clientX?: number, clientY?: number) => {
    const now = performance.now();
    if (now - lastTouchTimeRef.current < 250) return;
    lastTouchTimeRef.current = now;

    if (!textStageRef.current) return;
    const rect = textStageRef.current.getBoundingClientRect();
    const relX = clientX !== undefined ? clientX - rect.left : rect.width / 2;
    const relY = clientY !== undefined ? clientY - rect.top : rect.height / 2;

    mousePos.current.x = relX;
    mousePos.current.y = relY;
    mousePos.current.targetX = relX;
    mousePos.current.targetY = relY;

    if (isTouchRevealedRef.current) {
      maskRadius.current.target = 0;
      isHovering.current = false;
      isTouchRevealedRef.current = false;
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    } else {
      const revealRadius = Math.max(rect.width, rect.height) * 0.85;
      maskRadius.current.target = Math.max(140, revealRadius);
      isHovering.current = true;
      isTouchRevealedRef.current = true;

      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = setTimeout(() => {
        maskRadius.current.target = 0;
        isHovering.current = false;
        isTouchRevealedRef.current = false;
        startAnimation();
      }, 3500);
    }

    startAnimation();
  }, [startAnimation]);

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    if (isTouchRevealedRef.current) return;
    if (!textStageRef.current) return;
    const rect = textStageRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    mousePos.current.x = relX;
    mousePos.current.y = relY;
    mousePos.current.targetX = relX;
    mousePos.current.targetY = relY;

    const baseRadius = Math.min(160, Math.max(110, window.innerWidth * 0.11));
    maskRadius.current.target = baseRadius;
    isHovering.current = true;
    startAnimation();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    if (isTouchRevealedRef.current) return;
    if (!textStageRef.current) return;
    const rect = textStageRef.current.getBoundingClientRect();
    mousePos.current.targetX = e.clientX - rect.left;
    mousePos.current.targetY = e.clientY - rect.top;
    isHovering.current = true;
    startAnimation();
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    if (isTouchRevealedRef.current) return;
    maskRadius.current.target = 0;
    isHovering.current = false;
    startAnimation();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') {
      triggerTouchReveal(e.clientX, e.clientY);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      triggerTouchReveal(e.clientX, e.clientY);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerTouchReveal();
    }
  };

  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  // Smooth scroll handler to Contact section
  const handleScrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/#contact');
      return;
    }
    const target = document.getElementById('contact');
    if (target) {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(target, { offset: -75, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Smooth scroll handler to internal sections
  const handleScrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      return;
    }
    const target = document.getElementById(sectionId);
    if (target) {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(target, { offset: -75, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Real existing social links from portfolio data
  const igUrl =
    socialLinks.find((l) => l.platform === 'Instagram')?.url ||
    'https://instagram.com/i_am__arpittt';
  const linkedinUrl =
    socialLinks.find((l) => l.platform === 'LinkedIn')?.url ||
    'https://www.linkedin.com/in/arpitdesigns';

  return (
    <footer
      ref={footerRef}
      id="footer"
      className="relative w-full min-h-screen min-h-[100svh] overflow-hidden flex flex-col justify-between text-[#1A1A1A] select-none"
      style={{
        background:
          'linear-gradient(180deg, #FDF8F3 0%, #FAF4EC 12%, #FAF2EA 20%, #F0F2EB 28%, #D8ECF7 38%, #79C3EC 52%, #52B4E6 68%, #82D8F6 82%, #D8F1FD 94%, #F0F8FE 100%)',
      }}
    >
      {/* Soft atmospheric horizon glow bridging the upper CTA zone and open sky */}
      <div
        className="absolute top-[32%] sm:top-[34%] inset-x-0 h-44 sm:h-56 z-[2] pointer-events-none overflow-hidden select-none"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0%, black 35%, black 65%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, black 35%, black 65%, transparent 100%)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(210, 238, 252, 0.35) 0%, rgba(230, 245, 253, 0.12) 50%, transparent 100%)',
            filter: 'blur(16px)',
          }}
        />
        <img
          src="/assets/cloud-horizon.webp"
          alt=""
          className="w-full h-full object-cover object-center max-w-[2400px] mx-auto opacity-[0.14] filter blur-[6px]"
          draggable={false}
        />
      </div>

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* ZONE A: THE FINAL SCENE (EDITORIAL CLOSING INVITATION)                */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <div className="relative w-full max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 pt-14 sm:pt-18 md:pt-22 pb-8 sm:pb-10 z-10 flex flex-col items-center text-center">

        {/* 1. Small Gold Eyebrow */}
        <div className="footer-cta-eyebrow flex items-center justify-center gap-3 mb-4 sm:mb-5">
          <div className="w-6 sm:w-10 h-[1.5px] bg-[#C4943A]/50" />
          <span className="font-sora text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-semibold text-[#B8860B]">
            THE FINAL SCENE
          </span>
          <div className="w-6 sm:w-10 h-[1.5px] bg-[#C4943A]/50" />
        </div>

        {/* 2. Dominant Editorial Headline */}
        <h2 className="footer-cta-headline font-playfair font-bold text-[clamp(2.3rem,5.6vw,4.4rem)] text-[#1A1A1A] leading-[1.04] tracking-tight max-w-[680px] mb-5 sm:mb-7">
          LET’S MAKE<br />
          SOMETHING<br />
          WORTH SEEING<span className="text-[#C4943A]">.</span>
        </h2>

        {/* 3. Personal Sign-off */}
        <div className="footer-cta-brand flex flex-col items-center mb-6 sm:mb-8">
          <span className="font-playfair font-bold text-[clamp(1.35rem,2.4vw,1.85rem)] text-[#1A1A1A] tracking-[-0.01em]">
            ARPIT AK
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-sora text-[10.5px] sm:text-[11.5px] uppercase tracking-[0.22em] font-semibold text-[#7D7060]">
              GRAPHIC DESIGNER
            </span>
            <span className="text-[#C4943A]/60 text-[9px] select-none">•</span>
            <span className="font-sora text-[10.5px] sm:text-[11.5px] uppercase tracking-[0.22em] font-semibold text-[#7D7060]">
              VISUAL STORYTELLER
            </span>
          </div>
        </div>

        {/* 4. Primary CTA Button: Smoothly navigates to Contact */}
        <div className="footer-cta-btn mb-8 sm:mb-10">
          <a
            href="#contact"
            onClick={handleScrollToContact}
            className="group inline-flex items-center gap-3 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#1A1A1A] hover:bg-[#B8860B] text-[#FAF3E8] text-[11.5px] sm:text-[12px] font-sora font-semibold tracking-[0.16em] uppercase transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>LET’S WORK TOGETHER</span>
            <span className="text-[#E5C89C] transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>

        {/* 5. Delicate Editorial Hairline Divider */}
        <div className="w-full max-w-lg h-[1px] bg-[#D8C7B2]/50 mb-6 sm:mb-7" />

        {/* 6. Curated Secondary Navigation & Social Links */}
        <nav
          aria-label="Footer Navigation"
          className="footer-nav-links flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-7 gap-y-2.5 font-sora text-[10.5px] sm:text-[11.5px] uppercase tracking-[0.18em] font-semibold text-[#554C40]"
        >
          <a
            href="#work"
            onClick={(e) => handleScrollToSection(e, 'work')}
            className="hover:text-[#B8860B] transition-colors duration-200"
          >
            WORK
          </a>
          <a
            href="#about"
            onClick={(e) => handleScrollToSection(e, 'about')}
            className="hover:text-[#B8860B] transition-colors duration-200"
          >
            ABOUT
          </a>
          <a
            href="#case-studies"
            onClick={(e) => handleScrollToSection(e, 'case-studies')}
            className="hover:text-[#B8860B] transition-colors duration-200"
          >
            CASE STUDIES
          </a>
          <span className="text-[#C4943A]/40 hidden sm:inline select-none">|</span>
          <a
            href={igUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#B8860B] transition-colors duration-200"
          >
            INSTAGRAM
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#B8860B] transition-colors duration-200"
          >
            LINKEDIN
          </a>
          <a
            href={personalInfo.mailtoUrl}
            className="hover:text-[#B8860B] transition-colors duration-200"
          >
            EMAIL
          </a>
        </nav>

      </div>

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* ZONE B: PHYSICAL 5-LAYER LANDSCAPE SECTION (HERO VISUAL ~55-60%)      */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <div
        ref={landscapeRef}
        className="relative w-full overflow-hidden select-none flex-1 min-h-[380px] sm:min-h-[480px] md:min-h-[540px] lg:min-h-[580px] flex flex-col justify-end"
      >
        {/* LAYER 1: ATMOSPHERIC SKY DEPTH */}
        <div
          ref={skyRef}
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(189, 225, 244, 0.15) 12%, rgba(121, 195, 236, 0.4) 32%, rgba(82, 180, 230, 0.5) 60%, rgba(130, 216, 246, 0.3) 85%, transparent 100%)',
          }}
        />

        {/* LAYER 2: VERY SUBTLE ATMOSPHERIC MIST / HORIZON CLOUD */}
        <div
          ref={mistRef}
          className="absolute top-0 inset-x-0 h-[65%] z-[1] flex justify-center pointer-events-none overflow-hidden opacity-20"
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)',
          }}
        >
          <img
            src="/assets/cloud-horizon.webp"
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center max-w-[2400px] scale-105"
            draggable={false}
          />
        </div>

        {/* LAYER 3: DISTANT BACKGROUND HILLS (Extends behind text) */}
        <div
          ref={bgHillRef}
          className="absolute z-[2] pointer-events-none select-none left-1/2 -translate-x-1/2 flex flex-col items-center"
          style={{
            bottom: 'clamp(50px, 6.5vw, 115px)',
            width: 'clamp(850px, 120vw, 2600px)',
            filter: 'blur(0.5px) brightness(0.96)',
            opacity: 0.92,
          }}
        >
          <img
            src="/assets/footer-bg-hill.webp"
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-cover object-bottom"
            draggable={false}
          />
        </div>

        {/* LAYER 4: HUGE ARPIT AK TYPOGRAPHY + INTERACTIVE HINDI MORPH (z-[3]) */}
        <div
          ref={nameLockupRef}
          className="footer-name-lockup absolute z-[3] left-1/2 -translate-x-1/2 flex items-center justify-center cursor-default select-none pointer-events-auto"
        >
          <div
            ref={textStageRef}
            role="button"
            tabIndex={0}
            aria-label="Toggle bilingual name reveal"
            onPointerEnter={handlePointerEnter}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onPointerDown={handlePointerDown}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className="relative inline-block select-none cursor-pointer sm:cursor-default py-2 touch-none whitespace-nowrap focus:outline-none"
          >
            {/* Physical Terrain Contact / Grounding Shadow at Letter Base */}
            <div
              className="absolute -bottom-3 inset-x-[-5%] h-14 pointer-events-none z-0"
              style={{
                background:
                  'radial-gradient(ellipse 85% 55% at 50% 80%, rgba(12, 42, 22, 0.42) 0%, rgba(18, 54, 30, 0.2) 50%, transparent 80%)',
                filter: 'blur(8px)',
              }}
            />

            {/* 4A. Phantom Sizing Anchor — Locks container dimensions to exact typography footprint */}
            <div
              aria-hidden="true"
              className="invisible pointer-events-none font-sora font-extrabold uppercase tracking-tight leading-none text-center select-none whitespace-nowrap"
              style={{
                fontSize: 'clamp(2.5rem, 14vw, 15rem)',
              }}
            >
              ARPIT AK
            </div>

            {/* 4B. Default English Layer: ARPIT AK (Mask punches hole under cursor) */}
            <div
              ref={englishTextRef}
              className="absolute inset-0 flex items-center justify-center font-sora font-extrabold uppercase tracking-tight leading-none text-white text-center select-none pointer-events-none whitespace-nowrap"
              style={{
                fontSize: 'clamp(2.5rem, 14vw, 15rem)',
                ...typographicDepthStyle,
                willChange: 'mask-image, -webkit-mask-image',
              }}
            >
              ARPIT AK
            </div>

            {/* 4C. Hindi Layer: अर्पित (Identical geometry, revealed only under cursor mask) */}
            <div
              ref={hindiTextRef}
              className="absolute inset-0 flex items-center justify-center font-sora font-extrabold tracking-[0.22em] leading-none text-white text-center select-none pointer-events-none whitespace-nowrap"
              style={{
                fontSize: 'clamp(2.5rem, 14vw, 15rem)',
                paddingLeft: '0.22em',
                opacity: 0,
                ...typographicDepthStyle,
                willChange: 'mask-image, -webkit-mask-image',
              }}
            >
              {personalInfo.hindiName || 'अर्पित'}
            </div>
          </div>
        </div>

        {/* LAYER 5: FOREGROUND ROLLING LUSH HILL (z-[4] - Natural 20-30% overlap over typography) */}
        <div
          ref={fgHillRef}
          className="absolute z-[4] bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none"
          style={{
            width: 'clamp(540px, 110vw, 2600px)',
          }}
        >
          <img
            src="/assets/footer-fg-hill.webp"
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-cover object-bottom"
            draggable={false}
          />
        </div>

        {/* Underlying Solid Green Horizon Baseline to prevent subpixel seams on high DPI displays */}
        <div
          className="absolute bottom-0 inset-x-0 h-4 z-[2] pointer-events-none"
          style={{
            background: '#1b5a2b',
          }}
        />

        {/* Copyright / Closing Baseline Details */}
        <div className="relative w-full z-[10] py-2 sm:py-2.5 bg-[#14421e] text-center select-none">
          <p className="font-sora text-[10px] sm:text-[10.5px] text-[#A5C7AD]/90 tracking-[0.18em] uppercase font-medium">
            &copy; 2026 ARPIT AK • ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
