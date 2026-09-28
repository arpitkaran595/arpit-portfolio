import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalInfo, socialLinks, handleResumeClick } from '../data/portfolio';

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
    const idleTweens: gsap.core.Tween[] = [];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 82%',
          once: true, // Trigger ONCE when entering viewport
        },
        onComplete: () => {
          // Subtle continuous idle motion after entrance completes
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
          // Note: ARPIT AK typography remains strictly STATIC
        },
      });

      // Pause idle tweens when footer is out of view, resume when in view
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onLeave: () => idleTweens.forEach((t) => t.pause()),
        onEnterBack: () => idleTweens.forEach((t) => t.play()),
        onEnter: () => idleTweens.forEach((t) => t.play()),
        onLeaveBack: () => idleTweens.forEach((t) => t.pause()),
      });

      // 0.00–0.25s: Upper footer atmosphere begins appearing
      // 0.15–0.55s: Brand block fades upward
      tl.fromTo(
        '.footer-brand',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        0.15
      );

      // 0.25–0.70s: Navigation columns stagger in
      tl.fromTo(
        '.footer-nav-col',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out' },
        0.25
      );

      // 0.45–0.80s: Social icons appear subtly
      tl.fromTo(
        '.footer-social',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out' },
        0.45
      );

      // 0.55–0.90s: Copyright fades in
      tl.fromTo(
        '.footer-copyright',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
        0.55
      );

      // 0.60–1.10s: Blue atmospheric sky gradually becomes visible
      if (skyRef.current) {
        tl.fromTo(
          skyRef.current,
          { opacity: 0.35 },
          { opacity: 1, duration: 0.5, ease: 'power2.out' },
          0.60
        );
      }

      // 0.75–1.30s: Background grass/hill settles into place
      if (bgHillRef.current) {
        tl.fromTo(
          bgHillRef.current,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
          0.75
        );
      }

      // 0.90–1.45s: Huge ARPIT AK rises subtly into position
      if (nameLockupRef.current) {
        tl.fromTo(
          nameLockupRef.current,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
          0.90
        );
      }

      // 1.10–1.65s: Foreground grass layer gently rises into final position
      if (fgHillRef.current) {
        tl.fromTo(
          fgHillRef.current,
          { opacity: 0.6, y: 28 },
          { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
          1.10
        );
      }
    }, footerRef);

    return () => {
      idleTweens.forEach((t) => t.kill());
      ctx.revert();
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. Fluid Lerped Cursor Masking for ARPIT AK → अर्पित
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

        // Soft radial feathered reveal for Hindi layer
        const hindiMask = `radial-gradient(circle ${r}px at ${x}px ${y}px, black 0%, black 45%, rgba(0, 0, 0, 0.7) 70%, transparent 100%)`;
        hindiTextRef.current.style.maskImage = hindiMask;
        hindiTextRef.current.style.webkitMaskImage = hindiMask;
        hindiTextRef.current.style.maskRepeat = 'no-repeat';
        hindiTextRef.current.style.webkitMaskRepeat = 'no-repeat';

        // Inverse soft radial mask for English layer (smoothly punches out where Hindi shows)
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

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
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
    if (!textStageRef.current) return;
    const rect = textStageRef.current.getBoundingClientRect();
    mousePos.current.targetX = e.clientX - rect.left;
    mousePos.current.targetY = e.clientY - rect.top;
    isHovering.current = true;
    startAnimation();
  };

  const handlePointerLeave = () => {
    maskRadius.current.target = 0;
    isHovering.current = false;
    startAnimation();
  };

  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  // Social URLs from portfolio data
  const igUrl =
    socialLinks.find((l) => l.platform === 'Instagram')?.url ||
    'https://instagram.com/i_am__arpittt';
  const linkedinUrl =
    socialLinks.find((l) => l.platform === 'LinkedIn')?.url ||
    'https://www.linkedin.com/in/arpitdesigns';
  const behanceUrl =
    socialLinks.find((l) => l.platform === 'Behance')?.url ||
    'https://www.behance.net/arpit-designs/projects';
  const youtubeUrl =
    socialLinks.find((l) => l.platform === 'YouTube')?.url || '#';
  const whatsappUrl = personalInfo.whatsappUrl;

  return (
    <footer
      ref={footerRef}
      id="footer"
      className="relative w-full min-h-screen min-h-[100svh] overflow-hidden flex flex-col justify-between text-[#1A1A1A] select-none"
      style={{
        background:
          'linear-gradient(180deg, #FDF8F3 0%, #FAF4EC 16%, #FAF2EA 24%, #F2F1EC 32%, #E3EDF4 40%, #BFDEEE 48%, #79C3EC 58%, #52B4E6 70%, #82D8F6 84%, #D8F1FD 94%, #F0F8FE 100%)',
      }}
    >
      {/* Soft atmospheric transition mist bridging Upper Information and Sky */}
      <div
        className="absolute top-[26%] sm:top-[28%] inset-x-0 h-44 sm:h-56 z-[2] pointer-events-none overflow-hidden select-none"
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
          src="/assets/cloud-horizon.png"
          alt=""
          className="w-full h-full object-cover object-center max-w-[2400px] mx-auto opacity-[0.14] filter blur-[6px]"
          draggable={false}
        />
      </div>

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* ZONE A: UPPER INFORMATION ZONE (~35-40% of viewport)                  */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-8 sm:pt-14 md:pt-20 lg:pt-16 pb-2 z-10 flex flex-col justify-between">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-12 pb-4 sm:pb-6">
          
          {/* BRAND COLUMN (LEFT - 5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-3.5 footer-brand">
            <div className="flex items-center gap-3">
              <span className="font-sora font-extrabold text-2xl sm:text-[26px] tracking-tight text-[#1A1A1A]">
                ARPIT AK
              </span>
            </div>

            <p className="font-sora text-sm text-[#555] font-normal leading-relaxed max-w-sm">
              Graphic Designer & Video Editor specializing in visual storytelling
              through motion, brand identity, and high-impact digital experiences.
            </p>

            {/* Social Icons row */}
            <div className="flex items-center gap-3 pt-1">
              {/* Instagram */}
              <a
                href={igUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
                className="footer-social w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#DCD3C7] hover:border-[#1A1A1A] flex items-center justify-center text-[#555] hover:text-[#1A1A1A] hover:bg-black/[0.03] transition-all duration-200"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="footer-social w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#DCD3C7] hover:border-[#1A1A1A] flex items-center justify-center text-[#555] hover:text-[#1A1A1A] hover:bg-black/[0.03] transition-all duration-200"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* Behance */}
              <a
                href={behanceUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Behance Portfolio"
                className="footer-social w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#DCD3C7] hover:border-[#1A1A1A] flex items-center justify-center text-[#555] hover:text-[#1A1A1A] hover:bg-black/[0.03] transition-all duration-200"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M6.938 4.5c-3.832 0-6.938 3.105-6.938 6.938 0 3.832 3.106 6.937 6.938 6.937 1.944 0 3.702-.8 4.966-2.09l-1.89-1.636c-.79.79-1.848 1.282-3.076 1.282-2.316 0-4.205-1.844-4.288-4.145h9.349c.046-.441.077-.893.077-1.348 0-3.308-2.348-5.938-5.138-5.938zm-2.482 4.673c.123-1.611 1.488-2.229 2.502-2.229 1.11 0 2.378.718 2.518 2.229h-5.02zm13.544-2.173h5.992v1.444h-5.992v-1.444zm-1.843 3.827c1.365 0 2.482-.676 2.482-2.04 0-1.258-.99-1.868-2.247-1.868h-4.392v10.081h4.746c1.624 0 2.624-.954 2.624-2.285 0-1.439-1.071-2.138-2.213-2.368 1.042-.23 1.843-.88 1.843-1.52zm-3.018-2.584h2.247c.691 0 1.182.35 1.182.956 0 .584-.491.936-1.182.936h-2.247v-1.892zm2.464 6.787h-2.464v-2.072h2.464c.83 0 1.346.402 1.346 1.036 0 .634-.516 1.036-1.346 1.036z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Channel"
                className="footer-social w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#DCD3C7] hover:border-[#1A1A1A] flex items-center justify-center text-[#555] hover:text-[#1A1A1A] hover:bg-black/[0.03] transition-all duration-200"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="footer-social w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#DCD3C7] hover:border-[#1A1A1A] flex items-center justify-center text-[#555] hover:text-[#1A1A1A] hover:bg-black/[0.03] transition-all duration-200"
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-none stroke-current"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* 4 NAVIGATION COLUMNS (RIGHT - 7 cols) Matching Reference Structure */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-7">
            {/* Column 1: WORK */}
            <div className="flex flex-col gap-3 footer-nav-col">
              <h4 className="font-sora font-semibold text-xs tracking-[0.14em] uppercase text-[#1A1A1A]">
                Work
              </h4>
              <nav className="flex flex-col gap-2 font-sora text-sm text-[#555]">
                <a
                  href="#work"
                  className="hover:text-[#1A1A1A] transition-colors duration-150 w-fit"
                >
                  Videos
                </a>
                <a
                  href="#stories"
                  className="hover:text-[#1A1A1A] transition-colors duration-150 w-fit"
                >
                  Stories
                </a>
                <a
                  href="#creatives"
                  className="hover:text-[#1A1A1A] transition-colors duration-150 w-fit"
                >
                  Creatives
                </a>
                <a
                  href="#thumbnails"
                  className="hover:text-[#1A1A1A] transition-colors duration-150 w-fit"
                >
                  Thumbnails
                </a>
              </nav>
            </div>

            {/* Column 2: ABOUT */}
            <div className="flex flex-col gap-3 footer-nav-col">
              <h4 className="font-sora font-semibold text-xs tracking-[0.14em] uppercase text-[#1A1A1A]">
                About
              </h4>
              <nav className="flex flex-col gap-2 font-sora text-sm text-[#555]">
                <a
                  href="#about"
                  className="hover:text-[#1A1A1A] transition-colors duration-150 w-fit"
                >
                  About Me
                </a>
                <a
                  href="#experience"
                  className="hover:text-[#1A1A1A] transition-colors duration-150 w-fit"
                >
                  Experience
                </a>
                <a
                  href="#home"
                  className="hover:text-[#1A1A1A] transition-colors duration-150 w-fit"
                >
                  Philosophy
                </a>
                {personalInfo.hasResumeFile ? (
                  <a
                    href={personalInfo.resumePath}
                    download="Arpit_AK_Resume.pdf"
                    className="hover:text-[#1A1A1A] transition-colors duration-150 w-fit"
                  >
                    Resume
                  </a>
                ) : (
                  <span className="text-[#888] cursor-default w-fit flex items-center gap-1.5 select-none" title="Resume coming soon">
                    Resume
                    <span className="text-[10px] text-[#A3772C] font-semibold bg-[#A3772C]/10 px-1 rounded">Soon</span>
                  </span>
                )}
              </nav>
            </div>

            {/* Column 3: EXPERTISE */}
            <div className="flex flex-col gap-3 footer-nav-col">
              <h4 className="font-sora font-semibold text-xs tracking-[0.14em] uppercase text-[#1A1A1A]">
                Expertise
              </h4>
              <nav className="flex flex-col gap-2 font-sora text-sm text-[#555]">
                <span className="cursor-default">Storytelling</span>
                <span className="cursor-default">Motion Design</span>
                <span className="cursor-default">Visual Identity</span>
                <span className="cursor-default">Video Editing</span>
              </nav>
            </div>

            {/* Column 4: CONNECT */}
            <div className="flex flex-col gap-3 footer-nav-col">
              <h4 className="font-sora font-semibold text-xs tracking-[0.14em] uppercase text-[#1A1A1A]">
                Connect
              </h4>
              <nav className="flex flex-col gap-2 font-sora text-sm text-[#555]">
                <a
                  href="#contact"
                  className="hover:text-[#1A1A1A] transition-colors duration-150 w-fit"
                >
                  Contact Form
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#1A1A1A] transition-colors duration-150 w-fit"
                >
                  Let&apos;s Talk
                </a>
                <a
                  href={personalInfo.mailtoUrl}
                  className="hover:text-[#1A1A1A] transition-colors duration-150 w-fit"
                >
                  Email Me
                </a>
              </nav>
            </div>
          </div>

        </div>

        {/* Centered Copyright bridging upper information and landscape */}
        <div className="w-full flex justify-center items-center pt-2 pb-2 sm:pb-3 footer-copyright select-none">
          <p className="font-sora text-xs sm:text-[13px] text-[#4A4A4A]/80 tracking-wide font-medium">
            &copy; 2026 Arpit Ak. All rights reserved.
          </p>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* ZONE B: PHYSICAL 5-LAYER LANDSCAPE SECTION (HERO VISUAL ~55-60%)      */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <div
        ref={landscapeRef}
        className="relative w-full overflow-hidden select-none flex-1 min-h-[380px] sm:min-h-[480px] md:min-h-[540px] lg:min-h-[580px]"
      >
        {/* LAYER 1: ATMOSPHERIC SKY DEPTH (Starts completely transparent at top to eliminate any edge) */}
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
            src="/assets/cloud-horizon.png"
            alt=""
            className="w-full h-full object-cover object-center max-w-[2400px] scale-105"
            draggable={false}
          />
        </div>

        {/* LAYER 3: DISTANT BACKGROUND HILLS (Extends behind text, softer, naturally framed) */}
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
            src="/assets/footer-bg-hill.png"
            alt=""
            className="w-full h-auto object-cover object-bottom"
            draggable={false}
          />
        </div>

        {/* LAYER 4: HUGE ARPIT AK TYPOGRAPHY + INTERACTIVE HINDI MORPH (z-[3]) */}
        <div
          ref={nameLockupRef}
          className="absolute z-[3] left-1/2 -translate-x-1/2 flex items-center justify-center cursor-default select-none pointer-events-auto"
          style={{
            bottom: 'clamp(105px, 14vw, 180px)',
          }}
        >
          <div
            ref={textStageRef}
            onPointerEnter={handlePointerEnter}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className="relative inline-block select-none cursor-default py-2 touch-none whitespace-nowrap"
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
            width: 'clamp(560px, 110vw, 2600px)',
          }}
        >
          <img
            src="/assets/footer-fg-hill.png"
            alt=""
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
      </div>
    </footer>
  );
};

export default Footer;

