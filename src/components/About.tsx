import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalInfo } from '../data/portfolio';

gsap.registerPlugin(ScrollTrigger);

const softwareList = [
  { name: 'Photoshop', icon: '/assets/softwares/photoshop-svgrepo-com.svg' },
  { name: 'Premiere Pro', icon: '/assets/softwares/adobe-premiere-svgrepo-com.svg' },
  { name: 'After Effects', icon: '/assets/softwares/adobe-after-effects-svgrepo-com.svg' },
  { name: 'Figma', icon: '/assets/softwares/figma-svgrepo-com.svg' },
  { name: 'CapCut', icon: '/assets/softwares/capcut-svgrepo-com.svg' },
  { name: 'Framer', icon: '/assets/softwares/framer-svgrepo-com.svg' },
];

const aboutSocialLinks = [
  {
    platform: 'Instagram',
    url: 'https://instagram.com/i_am__arpittt',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/arpitdesigns',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    platform: 'Behance',
    url: 'https://www.behance.net/arpit-designs/projects',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8h5.5a3 3 0 0 1 0 6H3V8z" />
        <path d="M3 14h6a3 3 0 0 1 0 6H3v-6z" />
        <path d="M14 13a4 4 0 1 0 7 2.5" />
        <path d="M14 9h7" />
        <path d="M14 13h7" />
      </svg>
    ),
  },
  {
    platform: 'YouTube',
    url: 'https://www.youtube.com',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  // ─────────────────────────────────────────────
  // 3-TIER WRAPPER REFS
  // 1. Outer Shells (Controlled strictly by ScrollTrigger scrub parallax)
  // ─────────────────────────────────────────────
  const bgAtmosphereShellRef = useRef<HTMLDivElement>(null);
  const watermarkAShellRef = useRef<HTMLDivElement>(null);
  const dotMatrixShellRef = useRef<HTMLDivElement>(null);
  const cloudHorizonShellRef = useRef<HTMLDivElement>(null); // Z-1: Distant Horizon (Asset 03)
  const wholeCloudShellRef = useRef<HTMLDivElement>(null);    // Z-2: Mid-Distance Cloud (Whole cloud)
  const characterShellRef = useRef<HTMLDivElement>(null);     // Z-3: Character (Between cloud layers)
  const mistShellRef = useRef<HTMLDivElement>(null);          // Z-3: Atmospheric Mist
  const cloudRightShellRef = useRef<HTMLDivElement>(null);    // Z-4: Right Foreground Cloud Mass
  const foregroundCloudShellRef = useRef<HTMLDivElement>(null);// Z-4: Front Foreground Clouds (Overlaps lower body)
  const bottomTransitionShellRef = useRef<HTMLDivElement>(null);// Z-12: Dedicated Atmospheric Transition Overlay (Above character & clouds)
  const contentShellRef = useRef<HTMLDivElement>(null);
  const experienceBadgeShellRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────────────
  // 2. Mouse 3D Depth Wrappers (Controlled by smooth lerped mouse micro-parallax)
  // Note: Software panel & Social links are completely static (no mouse or scroll parallax)
  // ─────────────────────────────────────────────
  const bgDepthRef = useRef<HTMLDivElement>(null);
  const watermarkDepthRef = useRef<HTMLDivElement>(null);
  const cloudHorizonDepthRef = useRef<HTMLDivElement>(null);
  const wholeCloudDepthRef = useRef<HTMLDivElement>(null);
  const characterDepthRef = useRef<HTMLDivElement>(null);
  const mistDepthRef = useRef<HTMLDivElement>(null);
  const cloudRightDepthRef = useRef<HTMLDivElement>(null);
  const foregroundCloudDepthRef = useRef<HTMLDivElement>(null);
  const contentDepthRef = useRef<HTMLDivElement>(null);
  const experienceBadgeDepthRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────────────
  // 3. Inner Elements (Controlled by GSAP entrance timeline)
  // ─────────────────────────────────────────────
  const watermarkInnerRef = useRef<HTMLDivElement>(null);
  const dotMatrixInnerRef = useRef<HTMLDivElement>(null);
  const cloudHorizonInnerRef = useRef<HTMLImageElement>(null);
  const wholeCloudInnerRef = useRef<HTMLImageElement>(null);
  const cloudRightInnerRef = useRef<HTMLImageElement>(null);
  const characterInnerRef = useRef<HTMLImageElement>(null);
  const mistInnerRef = useRef<HTMLImageElement>(null);
  const foregroundCloudInnerRef = useRef<HTMLImageElement>(null);
  const eyebrowInnerRef = useRef<HTMLDivElement>(null);
  const headlineInnerRef = useRef<HTMLHeadingElement>(null);
  const bioInnerRef = useRef<HTMLParagraphElement>(null);
  const signatureInnerRef = useRef<HTMLDivElement>(null);
  const servicesRowInnerRef = useRef<HTMLDivElement>(null);
  const softwarePanelInnerRef = useRef<HTMLDivElement>(null);
  const socialLinksCardInnerRef = useRef<HTMLDivElement>(null);
  const experienceBadgeInnerRef = useRef<HTMLDivElement>(null);
  const badgeRotatingTextRef = useRef<SVGGElement>(null);
  const bottomTransitionInnerRef = useRef<HTMLImageElement>(null);

  // Dedicated Mobile Refs (for clean vertical mobile showcase)
  const characterMobileInnerRef = useRef<HTMLImageElement>(null);
  const signatureMobileInnerRef = useRef<HTMLDivElement>(null);
  const experienceBadgeMobileInnerRef = useRef<HTMLDivElement>(null);
  const badgeRotatingTextMobileRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobile = window.innerWidth < 768;

      // ─────────────────────────────────────────────
      // 1. VERY SLOW, ELEGANT ROTATION FOR EXPERIENCE BADGE TEXT
      // ─────────────────────────────────────────────
      if (!prefersReduced) {
        const rotatingTargets = [badgeRotatingTextRef.current, badgeRotatingTextMobileRef.current].filter(Boolean);
        if (rotatingTargets.length > 0) {
          gsap.to(rotatingTargets, {
            rotation: 360,
            transformOrigin: 'center center',
            duration: 40,
            repeat: -1,
            ease: 'none',
          });
        }
      }

      // ─────────────────────────────────────────────
      // 2. MASTER ENTRANCE TIMELINE (STREAMLINED CINEMATIC MOMENTUM)
      // All elements enter with overlapping fluid timing (< 1.2s total)
      // ─────────────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        defaults: { ease: 'power2.out' },
      });

      if (prefersReduced) {
        // Immediate presentation for users with reduced motion preference
        tl.set([
          watermarkInnerRef.current,
          dotMatrixInnerRef.current,
          cloudHorizonInnerRef.current,
          wholeCloudInnerRef.current,
          mistInnerRef.current,
          cloudRightInnerRef.current,
          foregroundCloudInnerRef.current,
          bottomTransitionInnerRef.current,
          eyebrowInnerRef.current,
          headlineInnerRef.current,
          bioInnerRef.current,
          signatureInnerRef.current,
          signatureMobileInnerRef.current,
          softwarePanelInnerRef.current,
          socialLinksCardInnerRef.current,
          experienceBadgeInnerRef.current,
          experienceBadgeMobileInnerRef.current,
          characterInnerRef.current,
          characterMobileInnerRef.current,
        ].filter(Boolean), { opacity: 1, y: 0, scale: 1, filter: 'none', clipPath: 'none' });
        if (servicesRowInnerRef.current) {
          tl.set(servicesRowInnerRef.current.children, { opacity: 1, y: 0 });
        }
      } else {
        // ── 1. BACKGROUND ATMOSPHERE & CLOUD MIST (0.00s - 0.20s) ──
        tl.fromTo(
          watermarkInnerRef.current,
          { opacity: 0, scale: 0.97, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8 },
          0
        );

        tl.fromTo(
          dotMatrixInnerRef.current,
          { opacity: 0, scale: 0.94 },
          { opacity: 0.45, scale: 1, duration: 0.7 },
          0.04
        );

        tl.fromTo(
          cloudHorizonInnerRef.current,
          { opacity: 0, y: 20 },
          { opacity: 0.82, y: 0, duration: 0.8 },
          0.06
        );

        tl.fromTo(
          wholeCloudInnerRef.current,
          { opacity: 0, y: 24 },
          { opacity: 0.85, y: 0, duration: 0.85 },
          0.10
        );

        tl.fromTo(
          mistInnerRef.current,
          { opacity: 0, y: 15 },
          { opacity: 0.35, y: 0, duration: 0.8 },
          0.12
        );

        tl.fromTo(
          cloudRightInnerRef.current,
          { opacity: 0, y: 25 },
          { opacity: 0.92, y: 0, duration: 0.85 },
          0.14
        );

        tl.fromTo(
          foregroundCloudInnerRef.current,
          { opacity: 0, y: 20, filter: 'blur(3px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.85 },
          0.16
        );

        if (bottomTransitionInnerRef.current) {
          tl.fromTo(
            bottomTransitionInnerRef.current,
            { opacity: 0, y: 10 },
            { opacity: 0.65, y: 0, duration: 0.75 },
            0.18
          );
        }

        // ── 2. CHARACTER ENTERS EARLY & FLUIDLY (0.15s) ──
        if (characterInnerRef.current) {
          tl.fromTo(
            characterInnerRef.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' },
            0.15
          );
        }
        if (characterMobileInnerRef.current) {
          tl.fromTo(
            characterMobileInnerRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: -8, duration: 0.85, ease: 'power3.out' },
            0.15
          );
        }

        // ── 3. EDITORIAL CONTENT (0.12s - 0.40s) ──
        tl.fromTo(
          eyebrowInnerRef.current,
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.5 },
          0.12
        );

        if (isMobile) {
          tl.fromTo(
            headlineInnerRef.current,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
            0.18
          );
        } else {
          tl.fromTo(
            headlineInnerRef.current,
            { opacity: 0, y: 16, clipPath: 'inset(0 100% 0 0)' },
            { opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.65, ease: 'power2.out' },
            0.18
          );
        }

        tl.fromTo(
          bioInnerRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.55 },
          0.26
        );

        const sigTargets = [signatureInnerRef.current, signatureMobileInnerRef.current].filter(Boolean);
        if (sigTargets.length > 0) {
          tl.fromTo(
            sigTargets,
            { opacity: 0, scale: 0.96, y: 8 },
            { opacity: 1, scale: 1, y: 0, duration: 0.55 },
            0.34
          );
        }

        // ── 4. SERVICES ROW & SOFTWARE PANEL (0.35s - 0.50s) ──
        if (servicesRowInnerRef.current) {
          tl.fromTo(
            servicesRowInnerRef.current.children,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.45, stagger: 0.05 },
            0.38
          );
        }

        tl.fromTo(
          softwarePanelInnerRef.current,
          { opacity: 0, y: 12, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5 },
          0.44
        );

        tl.fromTo(
          socialLinksCardInnerRef.current,
          { opacity: 0, y: 10, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5 },
          0.48
        );

        const badgeTargets = [experienceBadgeInnerRef.current, experienceBadgeMobileInnerRef.current].filter(Boolean);
        if (badgeTargets.length > 0) {
          tl.fromTo(
            badgeTargets,
            { opacity: 0, scale: 0.88, y: 10 },
            { opacity: 1, scale: 1, y: 0, duration: 0.55 },
            0.52
          );
        }
      }

      // ─────────────────────────────────────────────
      // 3. CONTINUOUS SCROLL-LINKED MULTI-LAYER PARALLAX
      // Note: Software panel & Social links are completely excluded (remain static)
      // ─────────────────────────────────────────────
      if (!prefersReduced) {
        const isMobile = window.innerWidth < 768;
        const factor = isMobile ? 0.35 : 1.0;

        const scrollConfig = {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        };

        // Background Atmosphere & Watermark "A" (Very slow drift)
        if (watermarkAShellRef.current) {
          gsap.to(watermarkAShellRef.current, {
            y: -22 * factor,
            ease: 'none',
            scrollTrigger: scrollConfig,
          });
        }

        if (dotMatrixShellRef.current) {
          gsap.to(dotMatrixShellRef.current, {
            y: -18 * factor,
            ease: 'none',
            scrollTrigger: scrollConfig,
          });
        }

        // Distant Cloud Horizon (Very slow parallax)
        if (cloudHorizonShellRef.current) {
          gsap.to(cloudHorizonShellRef.current, {
            y: -12 * factor,
            ease: 'none',
            scrollTrigger: scrollConfig,
          });
        }

        // Mid-distance Cloud (Slow parallax)
        if (wholeCloudShellRef.current) {
          gsap.to(wholeCloudShellRef.current, {
            y: -18 * factor,
            ease: 'none',
            scrollTrigger: scrollConfig,
          });
        }

        // Mist (Slow drift)
        if (mistShellRef.current) {
          gsap.to(mistShellRef.current, {
            y: -24 * factor,
            ease: 'none',
            scrollTrigger: scrollConfig,
          });
        }

        // Character (Medium drift)
        if (characterShellRef.current) {
          gsap.to(characterShellRef.current, {
            y: -36 * factor,
            ease: 'none',
            scrollTrigger: scrollConfig,
          });
        }

        // Right-side Cloud (Slow drift)
        if (cloudRightShellRef.current) {
          gsap.to(cloudRightShellRef.current, {
            y: -28 * factor,
            x: 8 * factor,
            ease: 'none',
            scrollTrigger: scrollConfig,
          });
        }

        // Foreground Clouds (Slightly faster drift)
        if (foregroundCloudShellRef.current) {
          gsap.to(foregroundCloudShellRef.current, {
            y: -30 * factor,
            ease: 'none',
            scrollTrigger: scrollConfig,
          });
        }

        // Content (Minimal drift on desktop, excluded on mobile to ensure rock-solid touch scrolling)
        if (contentShellRef.current && !isMobile) {
          gsap.to(contentShellRef.current, {
            y: -10 * factor,
            ease: 'none',
            scrollTrigger: scrollConfig,
          });
        }

        // Experience Badge (Subtle floating drift)
        if (experienceBadgeShellRef.current) {
          gsap.to(experienceBadgeShellRef.current, {
            y: -24 * factor,
            x: 6 * factor,
            ease: 'none',
            scrollTrigger: scrollConfig,
          });
        }
      }

      // ─────────────────────────────────────────────
      // 4. MOUSE-BASED MICRO 3D DEPTH INTERACTION
      // Note: Software panel & Social links have ZERO mouse movement (remain static)
      // ─────────────────────────────────────────────
      if (!prefersReduced) {
        const bgX = bgDepthRef.current ? gsap.quickTo(bgDepthRef.current, 'x', { duration: 1.4, ease: 'power2.out' }) : null;
        const bgY = bgDepthRef.current ? gsap.quickTo(bgDepthRef.current, 'y', { duration: 1.4, ease: 'power2.out' }) : null;

        const watermarkX = watermarkDepthRef.current ? gsap.quickTo(watermarkDepthRef.current, 'x', { duration: 1.3, ease: 'power2.out' }) : null;
        const watermarkY = watermarkDepthRef.current ? gsap.quickTo(watermarkDepthRef.current, 'y', { duration: 1.3, ease: 'power2.out' }) : null;

        const horizonX = cloudHorizonDepthRef.current ? gsap.quickTo(cloudHorizonDepthRef.current, 'x', { duration: 1.3, ease: 'power2.out' }) : null;
        const horizonY = cloudHorizonDepthRef.current ? gsap.quickTo(cloudHorizonDepthRef.current, 'y', { duration: 1.3, ease: 'power2.out' }) : null;

        const wholeCloudX = wholeCloudDepthRef.current ? gsap.quickTo(wholeCloudDepthRef.current, 'x', { duration: 1.25, ease: 'power2.out' }) : null;
        const wholeCloudY = wholeCloudDepthRef.current ? gsap.quickTo(wholeCloudDepthRef.current, 'y', { duration: 1.25, ease: 'power2.out' }) : null;

        const characterX = characterDepthRef.current ? gsap.quickTo(characterDepthRef.current, 'x', { duration: 1.1, ease: 'power2.out' }) : null;
        const characterY = characterDepthRef.current ? gsap.quickTo(characterDepthRef.current, 'y', { duration: 1.1, ease: 'power2.out' }) : null;

        const mistX = mistDepthRef.current ? gsap.quickTo(mistDepthRef.current, 'x', { duration: 1.2, ease: 'power2.out' }) : null;
        const mistY = mistDepthRef.current ? gsap.quickTo(mistDepthRef.current, 'y', { duration: 1.2, ease: 'power2.out' }) : null;

        const cloudRightX = cloudRightDepthRef.current ? gsap.quickTo(cloudRightDepthRef.current, 'x', { duration: 1.15, ease: 'power2.out' }) : null;
        const cloudRightY = cloudRightDepthRef.current ? gsap.quickTo(cloudRightDepthRef.current, 'y', { duration: 1.15, ease: 'power2.out' }) : null;

        const cloudsX = foregroundCloudDepthRef.current ? gsap.quickTo(foregroundCloudDepthRef.current, 'x', { duration: 1.0, ease: 'power2.out' }) : null;
        const cloudsY = foregroundCloudDepthRef.current ? gsap.quickTo(foregroundCloudDepthRef.current, 'y', { duration: 1.0, ease: 'power2.out' }) : null;

        const badgeX = experienceBadgeDepthRef.current ? gsap.quickTo(experienceBadgeDepthRef.current, 'x', { duration: 1.1, ease: 'power2.out' }) : null;
        const badgeY = experienceBadgeDepthRef.current ? gsap.quickTo(experienceBadgeDepthRef.current, 'y', { duration: 1.1, ease: 'power2.out' }) : null;

        const handleMouseMove = (e: MouseEvent) => {
          const rect = sectionRef.current?.getBoundingClientRect();
          if (!rect) return;

          if (rect.bottom < 0 || rect.top > window.innerHeight) return;

          const nx = (e.clientX / window.innerWidth - 0.5) * 2;
          const ny = (e.clientY / window.innerHeight - 0.5) * 2;

          bgX?.(nx * 3);
          bgY?.(ny * 2);

          watermarkX?.(nx * 5);
          watermarkY?.(ny * 3.5);

          // Distant clouds move slowest
          horizonX?.(nx * 4);
          horizonY?.(ny * 2.5);

          // Mid-distance clouds
          wholeCloudX?.(nx * 6);
          wholeCloudY?.(ny * 4);

          // Character moves slightly opposite for true optical 3D depth
          characterX?.(nx * -7);
          characterY?.(ny * -4.5);

          mistX?.(nx * 6);
          mistY?.(ny * 4);

          cloudRightX?.(nx * 9);
          cloudRightY?.(ny * 6);

          // Foreground clouds move most
          cloudsX?.(nx * 11);
          cloudsY?.(ny * 7.5);

          badgeX?.(nx * -6);
          badgeY?.(ny * -4);
        };

        const handleMouseLeave = () => {
          bgX?.(0); bgY?.(0);
          watermarkX?.(0); watermarkY?.(0);
          horizonX?.(0); horizonY?.(0);
          wholeCloudX?.(0); wholeCloudY?.(0);
          characterX?.(0); characterY?.(0);
          mistX?.(0); mistY?.(0);
          cloudRightX?.(0); cloudRightY?.(0);
          cloudsX?.(0); cloudsY?.(0);
          badgeX?.(0); badgeY?.(0);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseleave', handleMouseLeave);
        };
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full min-h-screen py-20 pb-16 sm:py-24 sm:pb-20 md:py-16 lg:py-0 lg:h-[100svh] lg:max-h-[1080px] bg-[#FAF3E8] overflow-hidden select-none flex flex-col justify-center box-border"
      style={{
        background: 'linear-gradient(180deg, #FAF3E8 0%, #F8F1E5 50%, #FAF3E8 100%)',
      }}
    >
      {/* ═══════════════════════════════════════════
          Z-0: BACKGROUND / WARM ATMOSPHERIC SKY & AMBIENT GLOWS
      ═══════════════════════════════════════════ */}
      <div ref={bgAtmosphereShellRef} className="hidden md:block absolute inset-0 pointer-events-none z-[0]">
        <div ref={bgDepthRef} className="w-full h-full will-change-transform">
          {/* Warm golden-peach glow behind left editorial content */}
          <div
            className="absolute top-[8%] left-[5%] w-[52vw] h-[55vh] opacity-40 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(246, 215, 178, 0.5) 0%, rgba(246, 215, 178, 0.12) 50%, transparent 75%)',
              filter: 'blur(50px)',
            }}
          />
          {/* Soft lavender/sand glow behind character */}
          <div
            className="absolute top-[10%] right-[6%] w-[50vw] h-[65vh] opacity-35 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(235, 222, 210, 0.65) 0%, rgba(226, 212, 238, 0.2) 50%, transparent 80%)',
              filter: 'blur(60px)',
            }}
          />
        </div>
      </div>

      {/* Subtle Paper Texture & Noise */}
      <div
        className="hidden md:block absolute inset-0 pointer-events-none z-[0] opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: 'url(/assets/paper-texture.webp)',
          backgroundRepeat: 'repeat',
          backgroundSize: '400px 400px',
        }}
      />
      <div
        className="hidden md:block absolute inset-0 pointer-events-none z-[0] opacity-2 mix-blend-overlay"
        style={{
          backgroundImage: 'url(/assets/noise-grain.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Editorial "A" watermark & Dot Matrix */}
      <div
        ref={watermarkAShellRef}
        className="absolute top-[0%] lg:top-[1%] right-[6%] sm:right-[10%] lg:right-[14%] pointer-events-none z-[0] select-none will-change-transform opacity-40 md:opacity-100"
        aria-hidden="true"
      >
        <div ref={watermarkDepthRef} className="will-change-transform">
          <div ref={watermarkInnerRef} className="opacity-0">
            <span
              className="font-playfair text-[clamp(18rem,42vw,56rem)] leading-none text-[#5A4D3E]/[0.04] md:text-[#5A4D3E]/[0.055] font-normal tracking-tighter block"
              style={{
                transform: 'scaleY(1.04)',
                textShadow: '0 2px 10px rgba(0,0,0,0.01)',
              }}
            >
              A
            </span>
          </div>
        </div>
      </div>

      <div
        ref={dotMatrixShellRef}
        className="hidden sm:block absolute top-[18%] right-[2%] md:right-[3%] pointer-events-none z-[0]"
      >
        <div
          ref={dotMatrixInnerRef}
          className="w-[120px] md:w-[150px] h-[220px] md:h-[260px] opacity-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(140, 120, 95, 0.18) 1.5px, transparent 1.5px)',
            backgroundSize: '16px 16px',
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════
          Z-1: DISTANT BACKGROUND CLOUDS (Asset 03 Wide Cloud Horizon.png)
          Deepest cloud layer sitting at the very back behind everything.
          Large scale (160-180vw), positioned with natural cloud feathering.
      ═══════════════════════════════════════════ */}
      <div
        ref={cloudHorizonShellRef}
        className="hidden md:flex absolute left-1/2 -translate-x-1/2 pointer-events-none z-[1] justify-center items-end will-change-transform overflow-visible"
        style={{
          bottom: '-3%',
          width: 'clamp(1800px, 165vw, 3200px)',
          height: 'clamp(500px, 58vh, 840px)',
        }}
      >
        <div ref={cloudHorizonDepthRef} className="w-full h-full will-change-transform flex justify-center items-end">
          <img
            ref={cloudHorizonInnerRef}
            src="/assets/cloud-horizon.webp"
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-bottom opacity-0"
            style={{
              filter: 'contrast(1.02) saturate(1.03)',
              maskImage:
                'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 4%, black 16%, black 60%, rgba(0,0,0,0.85) 72%, rgba(0,0,0,0.55) 82%, rgba(0,0,0,0.25) 90%, rgba(0,0,0,0.06) 95%, transparent 99%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 4%, black 16%, black 60%, rgba(0,0,0,0.85) 72%, rgba(0,0,0,0.55) 82%, rgba(0,0,0,0.25) 90%, rgba(0,0,0,0.06) 95%, transparent 99%)',
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          Z-2: MID-DISTANCE CLOUD LAYER (Whole cloud.png)
          Slightly above distant horizon, behind character, fills lower 40-60% cloud density.
      ═══════════════════════════════════════════ */}
      <div
        ref={wholeCloudShellRef}
        className="hidden md:flex absolute left-1/2 -translate-x-1/2 pointer-events-none z-[2] justify-center items-end will-change-transform overflow-visible"
        style={{
          bottom: '-4%',
          width: 'clamp(1600px, 150vw, 2800px)',
          height: 'clamp(440px, 50vh, 700px)',
        }}
      >
        <div ref={wholeCloudDepthRef} className="w-full h-full will-change-transform flex justify-center items-end">
          <img
            ref={wholeCloudInnerRef}
            src="/assets/Whole cloud.webp"
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-bottom opacity-0"
            style={{
              filter: 'contrast(1.02) saturate(1.04)',
              maskImage:
                'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 4%, black 16%, black 58%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.25) 88%, rgba(0,0,0,0.06) 94%, transparent 98%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 4%, black 16%, black 58%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.25) 88%, rgba(0,0,0,0.06) 94%, transparent 98%)',
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          Z-3: MAIN CHARACTER (Assets 01 - Main Character.png)
          DESKTOP & TABLET: PLACED BETWEEN CLOUD LAYERS ON THE RIGHT
          MOBILE: HIDDEN HERE, DEDICATED MOBILE SHOWCASE IN CONTENT FLOW BELOW
      ═══════════════════════════════════════════ */}
      <div
        ref={characterShellRef}
        className="hidden md:flex absolute right-[-2%] md:right-[-3%] lg:right-[2%] xl:right-[5%] pointer-events-none z-[3] will-change-transform justify-end items-end md:scale-[1.16] lg:scale-100 origin-bottom-right"
        style={{
          bottom: '-2%',
          height: 'clamp(660px, 78vh, 1100px)',
          width: 'clamp(420px, 50vw, 980px)',
        }}
      >
        <div ref={characterDepthRef} className="w-full h-full will-change-transform flex justify-end items-end">
          <img
            ref={characterInnerRef}
            src="/assets/Assets 01 - Main Character.webp"
            alt="Arpit AK"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain object-bottom opacity-0"
            style={{
              maskImage:
                'linear-gradient(to bottom, black 0%, black 44%, rgba(0,0,0,0.8) 54%, rgba(0,0,0,0.2) 64%, transparent 72%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, black 0%, black 44%, rgba(0,0,0,0.8) 54%, rgba(0,0,0,0.2) 64%, transparent 72%)',
              filter: 'drop-shadow(0 20px 35px rgba(45, 30, 20, 0.10))',
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* Atmospheric Mist wrapping character (Z-3) - Desktop & Tablet */}
      <div
        ref={mistShellRef}
        className="hidden md:flex absolute bottom-0 right-0 w-[55vw] pointer-events-none z-[3] will-change-transform justify-center items-end"
        style={{
          height: '46vh',
        }}
      >
        <div ref={mistDepthRef} className="w-full h-full will-change-transform">
          <img
            ref={mistInnerRef}
            src="/assets/atmospheric-mist.webp"
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-bottom opacity-0"
            style={{
              filter: 'contrast(1.02) saturate(1.02)',
              maskImage:
                'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 20%, black 50%, rgba(0,0,0,0.5) 75%, transparent 96%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 20%, black 50%, rgba(0,0,0,0.5) 75%, transparent 96%)',
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          Z-4: FRONT FOREGROUND CLOUDS (About-clouds.png + Assets 02 - hero-clouds-Right.png)
          LAYER 4 — SITS IN FRONT OF THE CHARACTER'S LOWER BODY, NATURALLY CONCEALING THE LOWER BODY IN CLOUD FOAM.
      ═══════════════════════════════════════════ */}
      {/* 1. Large Right-Side Foreground Cloud Mass */}
      <div
        ref={cloudRightShellRef}
        className="hidden md:block absolute bottom-0 right-[-6%] sm:right-[-3%] md:right-[-2%] z-[4] pointer-events-none origin-bottom-right will-change-transform"
      >
        <div ref={cloudRightDepthRef} className="will-change-transform">
          <img
            ref={cloudRightInnerRef}
            src="/assets/cloud-right.webp"
            alt=""
            loading="lazy"
            decoding="async"
            className="opacity-0"
            style={{
              width: 'clamp(720px, 75vw, 1350px)',
              maxWidth: '85vw',
              filter: 'contrast(1.04) saturate(1.04)',
              maskImage:
                'linear-gradient(to bottom, black 0%, black 58%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.25) 88%, rgba(0,0,0,0.06) 94%, transparent 98%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, black 0%, black 58%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.25) 88%, rgba(0,0,0,0.06) 94%, transparent 98%)',
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* 2. Wide Foreground Cloud Floor (Overlaps lower character body) */}
      <div
        ref={foregroundCloudShellRef}
        className="hidden md:flex absolute left-1/2 -translate-x-1/2 pointer-events-none z-[4] justify-center items-end will-change-transform overflow-visible"
        style={{
          bottom: '-4%',
          width: 'clamp(1500px, 135vw, 2500px)',
          height: 'clamp(440px, 50vh, 680px)',
        }}
      >
        <div ref={foregroundCloudDepthRef} className="w-full h-full will-change-transform flex justify-center items-end">
          <img
            ref={foregroundCloudInnerRef}
            src="/assets/about-clouds.webp"
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-bottom opacity-0"
            style={{
              filter: 'contrast(1.03) brightness(1.0) saturate(1.05)',
              maskImage:
                'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 4%, black 16%, black 58%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.25) 88%, rgba(0,0,0,0.06) 94%, transparent 98%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 4%, black 16%, black 58%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.25) 88%, rgba(0,0,0,0.06) 94%, transparent 98%)',
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          Z-12: DEDICATED ATMOSPHERIC TRANSITION OVERLAY / CLOUD MASK (ABOVE CHARACTER & CLOUDS)
          Sits ABOVE character (Z-3) and foreground clouds (Z-4) to completely envelop and conceal
          lower legs/shoes in soft, organic warm atmospheric haze.
          Fades seamlessly into the #FAF3E8 cream background across a large vertical distance.
      ═══════════════════════════════════════════ */}
      <div
        ref={bottomTransitionShellRef}
        className="hidden md:flex absolute bottom-0 inset-x-0 pointer-events-none z-[12] flex-col justify-end items-center overflow-visible"
        style={{
          height: 'clamp(180px, 30vh, 340px)',
        }}
      >
        {/* 1. Multi-stop warm cloud atmospheric gradient fog (Peach / Lavender / Cream) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(246, 215, 178, 0.08) 20%, rgba(235, 222, 210, 0.22) 40%, rgba(246, 230, 214, 0.50) 65%, rgba(250, 243, 232, 0.85) 85%, #FAF3E8 100%)',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 15%, black 45%, black 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 15%, black 45%, black 100%)',
          }}
        />

        {/* 2. Soft atmospheric mist drifting across the lower character & boundary */}
        <div className="absolute inset-x-0 bottom-0 h-[240px] pointer-events-none flex justify-center overflow-visible opacity-35">
          <img
            src="/assets/atmospheric-mist.webp"
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-bottom"
            style={{
              filter: 'contrast(1.01) saturate(1.02)',
              maskImage:
                'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 25%, black 60%, black 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 25%, black 60%, black 100%)',
            }}
            draggable={false}
          />
        </div>

        {/* 3. Authentic feathered About Cloud top.png layer sitting at the transition */}
        <div className="absolute inset-x-0 bottom-0 h-[200px] pointer-events-none flex justify-center overflow-visible">
          <img
            ref={bottomTransitionInnerRef}
            src="/assets/About Cloud top.webp"
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top opacity-0"
            style={{
              filter: 'contrast(1.01) saturate(1.02)',
              maskImage:
                'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.25) 20%, black 60%, rgba(0,0,0,0.7) 85%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.25) 20%, black 60%, rgba(0,0,0,0.7) 85%, transparent 100%)',
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          Z-15: EDITORIAL CONTENT, SIGNATURE, SERVICES, GLASS SOFTWARE PANEL & GLASS SOCIAL BAR (ABOVE ALL CLOUDS)
          Guaranteed stable stacking above all cloud layers, mist, and transition overlays
      ═══════════════════════════════════════════ */}
      <div
        ref={contentShellRef}
        className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full z-[15] flex items-center justify-start pointer-events-auto"
      >
        <div className="w-full md:w-[54%] md:max-w-[420px] lg:w-[50%] lg:max-w-[490px] xl:w-[48%] xl:max-w-[620px] flex flex-col pr-0 md:pr-4 lg:pr-6 mx-auto md:mx-0">
          <div ref={contentDepthRef} className="w-full will-change-transform flex flex-col">
            
            {/* 1. Small Gold Eyebrow */}
            <div ref={eyebrowInnerRef} className="flex flex-col items-start opacity-0 mb-2 sm:mb-2.5">
              <span className="text-[#B8860B] text-[0.74rem] sm:text-[0.76rem] md:text-[0.80rem] font-sora uppercase tracking-[0.24em] font-semibold">
                ABOUT ME
              </span>
              <div className="w-8 h-[1.8px] bg-[#C4943A] mt-1" />
            </div>

            {/* 2. Large Editorial Serif Heading with writing/clip-path reveal */}
            <h2
              ref={headlineInnerRef}
              className="font-playfair text-[clamp(2.15rem,7.5vw,2.75rem)] md:text-[2.2rem] lg:text-[2.65rem] xl:text-[3.4rem] text-[#1A1A1A] font-bold leading-[1.02] md:leading-[1.08] tracking-tight opacity-0 mb-2.5 sm:mb-3 xl:mb-2"
            >
              I turn ideas into<br />
              visual stories<span className="text-[#C4943A]">.</span>
            </h2>

            {/* 3. Short Introduction Paragraph */}
            <p
              ref={bioInnerRef}
              className="text-[#4F473E] text-[0.90rem] sm:text-[0.94rem] md:text-[0.88rem] lg:text-[0.92rem] xl:text-[0.96rem] leading-[1.58] font-sora font-normal max-w-[540px] md:max-w-[400px] lg:max-w-[480px] xl:max-w-[530px] opacity-0 mb-3 sm:mb-3.5 xl:mb-2.5"
            >
              {personalInfo.aboutDescription}
            </p>

            {/* 4. MOBILE-ONLY PORTRAIT, BADGE & SIGNATURE SHOWCASE (Item 4 & 5 on mobile) */}
            <div className="md:hidden w-full relative flex flex-col items-center -mt-3 mb-2 sm:my-3">
              {/* Full-Bleed Cloudscape & Character Container: touches both viewport edges (0px to 100vw) */}
              <div
                className="relative w-[calc(100%+2.5rem)] -mx-5 sm:w-[calc(100%+4rem)] sm:-mx-8 h-[390px] xs:h-[430px] sm:h-[470px] overflow-hidden flex items-end justify-center"
                style={{
                  maskImage:
                    'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 3%, black 12%, black 82%, rgba(0,0,0,0.85) 88%, rgba(0,0,0,0.4) 94%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 3%, black 12%, black 82%, rgba(0,0,0,0.85) 88%, rgba(0,0,0,0.4) 94%, transparent 100%)',
                }}
              >
                
                {/* 1. Ambient Warm Radial Sky Glow */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-80"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 45%, rgba(246, 215, 178, 0.75) 0%, rgba(240, 225, 208, 0.35) 45%, rgba(250, 243, 232, 0.05) 70%, transparent 85%)',
                    filter: 'blur(35px)',
                  }}
                />

                {/* 2. Full-bleed Background Cloud Bank (Rising high behind shoulders & torso) */}
                <img
                  src="/assets/Whole cloud.webp"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-x-0 bottom-4 sm:bottom-6 w-full h-[90%] sm:h-[94%] object-cover object-bottom opacity-85 pointer-events-none select-none"
                  style={{
                    filter: 'contrast(1.02) saturate(1.04)',
                    maskImage:
                      'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 10%, black 28%, black 100%)',
                    WebkitMaskImage:
                      'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 10%, black 28%, black 100%)',
                  }}
                  draggable={false}
                />

                {/* 2b. Left Billowing Cloud Plume (Flanking left side of character) */}
                <img
                  src="/assets/cloud-left.webp"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute -left-6 sm:-left-8 bottom-1 w-[62%] h-[82%] object-contain object-bottom opacity-85 pointer-events-none select-none z-[2]"
                  draggable={false}
                />

                {/* 2c. Right Billowing Cloud Plume (Flanking right side of character) */}
                <img
                  src="/assets/cloud-right.webp"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute -right-6 sm:-right-8 bottom-1 w-[60%] h-[78%] object-contain object-bottom opacity-80 pointer-events-none select-none z-[2]"
                  draggable={false}
                />

                {/* 3. Soft Atmospheric Mist (Depth between background clouds and character) */}
                <img
                  src="/assets/atmospheric-mist.webp"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-x-0 bottom-2 w-full h-[65%] object-cover object-bottom opacity-45 pointer-events-none select-none z-[2]"
                  draggable={false}
                />

                {/* 4. Large Main Character Cutout (Scaled up & moved slightly down, emerging from clouds) */}
                <div className="absolute inset-0 z-[3] flex justify-center pointer-events-none overflow-hidden">
                  <img
                    ref={characterMobileInnerRef}
                    src="/assets/Assets 01 - Main Character.webp"
                    alt="Arpit AK"
                    loading="eager"
                    decoding="async"
                    className="h-[780px] xs:h-[840px] sm:h-[900px] w-auto max-w-none object-contain object-top drop-shadow-[0_20px_38px_rgba(45,30,20,0.18)] opacity-0 select-none"
                    style={{
                      transform: 'translateY(-8px)',
                      maskImage:
                        'linear-gradient(to bottom, black 0%, black 36%, rgba(0,0,0,0.85) 44%, rgba(0,0,0,0.15) 50%, transparent 56%)',
                      WebkitMaskImage:
                        'linear-gradient(to bottom, black 0%, black 36%, rgba(0,0,0,0.85) 44%, rgba(0,0,0,0.15) 50%, transparent 56%)',
                    }}
                    draggable={false}
                  />
                </div>

                {/* 5. Full-bleed Foreground Cloud Foam (Submerges waist and lower body) */}
                <img
                  src="/assets/about-clouds.webp"
                  alt=""
                  loading="eager"
                  decoding="async"
                  className="absolute inset-x-0 -bottom-1 z-[4] w-full h-[62%] sm:h-[65%] object-cover object-bottom opacity-95 pointer-events-none select-none"
                  style={{
                    filter: 'contrast(1.03) saturate(1.04)',
                    maskImage:
                      'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 8%, black 24%, black 85%, rgba(0,0,0,0.8) 95%, transparent 100%)',
                    WebkitMaskImage:
                      'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 8%, black 24%, black 85%, rgba(0,0,0,0.8) 95%, transparent 100%)',
                  }}
                  draggable={false}
                />

                {/* 6. Soft Feathered Cloud Transition (Blends lower clouds seamlessly with no hard line) */}
                <div
                  className="absolute inset-x-0 bottom-0 z-[5] h-[75px] pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to bottom, transparent 0%, rgba(250, 243, 232, 0.3) 30%, rgba(250, 243, 232, 0.8) 70%, transparent 100%)',
                  }}
                />

                {/* 7. Rotating Experience Badge (Upper-Right of Portrait, comfortable breathing room) */}
                <div
                  ref={experienceBadgeMobileInnerRef}
                  className="absolute top-3 right-3 xs:right-6 sm:right-10 z-[10] w-[90px] h-[90px] xs:w-[98px] xs:h-[98px] flex items-center justify-center opacity-0 pointer-events-none select-none"
                >
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 160 160"
                    style={{ overflow: 'visible' }}
                  >
                    <defs>
                      <path
                        id="badgeCirclePathMobile"
                        d="M 80, 80 m -58, 0 a 58,58 0 1,1 116,0 a 58,58 0 1,1 -116,0"
                      />
                    </defs>
                    <g ref={badgeRotatingTextMobileRef}>
                      <text className="font-sora text-[8.5px] uppercase fill-[#6E6458] font-medium tracking-[0.26em]">
                        <textPath href="#badgeCirclePathMobile" startOffset="0%">
                          DESIGNING VISUALS • THAT CONNECT •
                        </textPath>
                      </text>
                    </g>
                  </svg>
                  <div className="flex flex-col items-center justify-center text-center select-none pt-0.5">
                    <span className="font-playfair text-[1.55rem] xs:text-[1.75rem] font-bold leading-none text-[#B8860B]">
                      3+
                    </span>
                    <span className="font-sora text-[0.42rem] xs:text-[0.46rem] uppercase tracking-[0.18em] font-semibold text-[#5A5044] mt-0.5">
                      YEARS
                    </span>
                    <span className="font-sora text-[0.38rem] xs:text-[0.42rem] uppercase tracking-[0.14em] font-medium text-[#7D7366] -mt-0.5">
                      EXPERIENCE
                    </span>
                  </div>
                </div>

              </div>

              {/* 8. Mobile Signature (Smooth backdrop to ensure zero hard cut or visible seam) */}
              <div
                ref={signatureMobileInnerRef}
                className="flex justify-center items-center -mt-3.5 mb-2.5 sm:mb-3 opacity-0 z-[10] relative"
              >
                {/* Soft atmospheric gradient blend behind signature */}
                <div
                  className="absolute -inset-x-10 -top-5 -bottom-3 pointer-events-none opacity-80"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, rgba(250, 243, 232, 0.95) 0%, rgba(250, 243, 232, 0.7) 45%, transparent 75%)',
                    filter: 'blur(10px)',
                  }}
                />
                <img
                  src="/assets/arpit-ak-sign.webp"
                  alt="Arpit AK Signature"
                  className="h-[40px] xs:h-[44px] sm:h-[48px] w-auto object-contain drop-shadow-[0_2px_4px_rgba(45,30,20,0.06)] relative z-[1]"
                  draggable={false}
                />
              </div>
            </div>

            {/* 5. Desktop/Tablet Signature (Directly below paragraph) */}
            <div ref={signatureInnerRef} className="hidden md:flex flex-col items-start opacity-0 mb-2 sm:mb-2.5">
              <img
                src="/assets/arpit-ak-sign.webp"
                alt="Arpit AK Signature"
                className="h-[42px] lg:h-[46px] xl:h-[50px] w-auto object-contain"
                draggable={false}
              />
            </div>

            {/* 6. Services / Expertise Row (4 editorial categories) */}
            <div
              ref={servicesRowInnerRef}
              className="grid grid-cols-2 xl:grid-cols-4 gap-0 py-2 sm:py-2.5 xl:py-2 border-y border-[#E2D5C3]/80 mb-3 sm:mb-3.5 xl:mb-2.5 w-full"
            >
              {/* 1. Creative Design */}
              <div className="flex flex-col pr-3 sm:pr-4 xl:pr-2 border-r border-b xl:border-b-0 border-[#E2D5C3]/70 pb-2.5 xl:pb-0">
                <div className="text-[#B8860B] mb-0.5">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 19 7-7 3 3-7 7-3-3z"/>
                    <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                    <path d="m2 2 7.586 7.586"/>
                    <circle cx="11" cy="11" r="2"/>
                  </svg>
                </div>
                <h3 className="font-sora font-semibold text-[0.76rem] sm:text-[0.78rem] text-[#1A1A1A]">
                  Creative Design
                </h3>
                <p className="text-[#6E6458] text-[0.64rem] sm:text-[0.66rem] leading-snug mt-0.5 font-sora">
                  Crafting clean, modern and meaningful designs that stand out.
                </p>
              </div>

              {/* 2. Video Editing */}
              <div className="flex flex-col pl-3 sm:pl-4 xl:px-2 border-b xl:border-b-0 xl:border-r border-[#E2D5C3]/70 pb-2.5 xl:pb-0">
                <div className="text-[#B8860B] mb-0.5">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2"/>
                    <path d="M7 3v18"/>
                    <path d="M3 7.5h4"/>
                    <path d="M3 12h18"/>
                    <path d="M3 16.5h4"/>
                    <path d="M17 3v18"/>
                    <path d="M17 7.5h4"/>
                    <path d="M17 16.5h4"/>
                  </svg>
                </div>
                <h3 className="font-sora font-semibold text-[0.76rem] sm:text-[0.78rem] text-[#1A1A1A]">
                  Video Editing
                </h3>
                <p className="text-[#6E6458] text-[0.64rem] sm:text-[0.66rem] leading-snug mt-0.5 font-sora">
                  Editing videos that tell stories and deliver real impact.
                </p>
              </div>

              {/* 3. Motion Design */}
              <div className="flex flex-col pr-3 sm:pr-4 xl:px-2 border-r xl:border-r border-[#E2D5C3]/70 pt-2.5 xl:pt-0">
                <div className="text-[#B8860B] mb-0.5">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" fillOpacity="0.2"/>
                  </svg>
                </div>
                <h3 className="font-sora font-semibold text-[0.76rem] sm:text-[0.78rem] text-[#1A1A1A]">
                  Motion Design
                </h3>
                <p className="text-[#6E6458] text-[0.64rem] sm:text-[0.66rem] leading-snug mt-0.5 font-sora">
                  Bringing visuals to life with smooth motion and rhythm.
                </p>
              </div>

              {/* 4. Problem Solver */}
              <div className="flex flex-col pl-3 sm:pl-4 xl:pl-2 pt-2.5 xl:pt-0">
                <div className="text-[#B8860B] mb-0.5">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5 .7 .7 1.3 1.5 1.5 2.5"/>
                    <path d="M9 18h6"/>
                    <path d="M10 22h4"/>
                  </svg>
                </div>
                <h3 className="font-sora font-semibold text-[0.76rem] sm:text-[0.78rem] text-[#1A1A1A]">
                  Problem Solver
                </h3>
                <p className="text-[#6E6458] text-[0.64rem] sm:text-[0.66rem] leading-snug mt-0.5 font-sora">
                  I love solving problems with creativity and smart ideas.
                </p>
              </div>
            </div>

            {/* 7. PREMIUM GLASS-STYLE FLOATING SOFTWARE PANEL (STATIC ABOVE CLOUDS) */}
            <div className="relative w-full max-w-[540px] md:max-w-[420px] lg:max-w-[490px] xl:max-w-[520px]">
              <div
                ref={softwarePanelInnerRef}
                className="rounded-xl py-2 px-2.5 sm:px-4 opacity-0 w-full transition-all duration-300"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.36) 0%, rgba(255, 248, 240, 0.22) 100%)',
                  backdropFilter: 'blur(16px) saturate(115%)',
                  WebkitBackdropFilter: 'blur(16px) saturate(115%)',
                  border: '1px solid rgba(255, 255, 255, 0.60)',
                  boxShadow:
                    '0 8px 24px -4px rgba(140, 115, 85, 0.07), 0 1px 3px 0 rgba(0, 0, 0, 0.02), inset 0 1px 1px 0 rgba(255, 255, 255, 0.85)',
                }}
              >
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#C4943A]/45" />
                  <span className="font-sora text-[0.60rem] uppercase tracking-[0.20em] text-[#7A5E26] font-semibold">
                    SOFTWARE I USE
                  </span>
                  <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#C4943A]/45" />
                </div>

                <div className="grid grid-cols-6 gap-0.5 sm:gap-2 items-center text-center">
                  {softwareList.map((item, index) => (
                    <div
                      key={item.name}
                      className={`relative group flex flex-col items-center justify-center py-0.5 cursor-pointer ${
                        index < softwareList.length - 1 ? 'border-r border-white/40 pr-0.5 sm:pr-1' : ''
                      }`}
                    >
                      {/* Tooltip on Hover with subtle luxury translucent glass style */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 translate-y-1.5 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out z-30">
                        <div
                          className="relative text-[#FFFDFC] text-[0.60rem] font-sora font-medium px-2 py-0.5 rounded-md shadow-lg whitespace-nowrap"
                          style={{
                            background: 'rgba(32, 26, 20, 0.88)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 255, 255, 0.18)',
                          }}
                        >
                          {item.name}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[rgba(32,26,20,0.88)]" />
                        </div>
                      </div>

                      {/* Icon */}
                      <img
                        src={item.icon}
                        alt={item.name}
                        className="w-5 h-5 xs:w-5.5 xs:h-5.5 sm:w-6 sm:h-6 object-contain transition-transform duration-300 group-hover:scale-115 drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 8. CLEARLY VISIBLE EDITORIAL SOCIAL NAVIGATION BAR (FIND ME ONLINE) */}
            <div className="relative mt-2 sm:mt-2.5 w-full max-w-[540px] md:max-w-[420px] lg:max-w-[490px] xl:max-w-[520px]">
              <div
                ref={socialLinksCardInnerRef}
                className="rounded-xl py-2 px-3 sm:px-3.5 opacity-0 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-2 transition-all duration-300"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.42) 0%, rgba(255, 248, 240, 0.28) 100%)',
                  backdropFilter: 'blur(16px) saturate(115%)',
                  WebkitBackdropFilter: 'blur(16px) saturate(115%)',
                  border: '1px solid rgba(255, 255, 255, 0.65)',
                  boxShadow:
                    '0 6px 20px -3px rgba(140, 115, 85, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.02), inset 0 1px 1px 0 rgba(255, 255, 255, 0.85)',
                }}
              >
                {/* Mobile view (< sm): 2-column clean grid */}
                <div className="sm:hidden w-full flex flex-col gap-1.5">
                  <div className="flex items-center justify-center gap-2 mb-0.5">
                    <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#C4943A]/45" />
                    <span className="font-sora text-[0.60rem] uppercase tracking-[0.20em] text-[#7A5E26] font-bold">
                      CONNECT
                    </span>
                    <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#C4943A]/45" />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {aboutSocialLinks.map((social) => (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/40 hover:bg-white/70 border border-white/50 text-[#2B231A] transition-all duration-200 cursor-pointer"
                        title={social.platform}
                      >
                        <span className="inline-flex items-center gap-1.5 min-w-0">
                          <span className="text-[#6E6052] group-hover:text-[#B8860B] transition-colors shrink-0">
                            {social.icon}
                          </span>
                          <span className="font-sora text-[0.68rem] font-medium tracking-tight truncate">
                            {social.platform}
                          </span>
                        </span>
                        <svg
                          className="w-2.5 h-2.5 text-[#9E8E7D] group-hover:text-[#B8860B] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-1"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Tablet & Desktop view (sm+): Approved single-row layout */}
                <div className="hidden sm:flex items-center justify-between gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap w-full">
                  {/* Left: CONNECT Label with Gold Accent */}
                  <div className="flex items-center gap-1.5 shrink-0 pl-0.5">
                    <span className="font-sora text-[0.60rem] sm:text-[0.62rem] uppercase tracking-[0.20em] text-[#7A5E26] font-bold">
                      CONNECT
                    </span>
                    <div className="h-3 w-[1px] bg-[#C4943A]/40 mx-1 hidden sm:block" />
                  </div>

                  {/* Right: 4 Discoverable Social Navigation Items */}
                  <div className="flex items-center justify-end gap-1 sm:gap-1.5 flex-1 flex-wrap sm:flex-nowrap">
                    {aboutSocialLinks.map((social) => (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-md text-[#2B231A] hover:text-[#B8860B] hover:bg-white/55 transition-all duration-250 cursor-pointer"
                        title={social.platform}
                      >
                        <span className="text-[#6E6052] group-hover:text-[#B8860B] transition-colors duration-200 transform group-hover:scale-110">
                          {social.icon}
                        </span>
                        <span className="font-sora text-[0.66rem] sm:text-[0.70rem] font-medium tracking-tight whitespace-nowrap">
                          {social.platform}
                        </span>
                        <svg
                          className="w-2.5 h-2.5 text-[#9E8E7D] group-hover:text-[#B8860B] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          Z-20: SUBTLE EDITORIAL EXPERIENCE BADGE (DESKTOP & TABLET)
          Floats upper-right of character with gentle micro-parallax
      ═══════════════════════════════════════════ */}
      <div
        ref={experienceBadgeShellRef}
        className="hidden md:block absolute top-[5%] md:top-[6%] lg:top-[8%] xl:top-[9.5%] right-[3%] md:right-[3%] lg:right-[5%] xl:right-[7%] z-[20] pointer-events-none will-change-transform"
      >
        <div ref={experienceBadgeDepthRef} className="will-change-transform">
          <div ref={experienceBadgeInnerRef} className="relative w-[110px] h-[110px] sm:w-[125px] sm:h-[125px] lg:w-[135px] lg:h-[135px] xl:w-[145px] xl:h-[145px] flex items-center justify-center opacity-0">
            {/* Rotating Circular Text SVG (Slow 40s subtle rotation) */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 160 160"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <path
                  id="badgeCirclePath"
                  d="M 80, 80 m -58, 0 a 58,58 0 1,1 116,0 a 58,58 0 1,1 -116,0"
                />
              </defs>
              <g ref={badgeRotatingTextRef}>
                <text className="font-sora text-[8.5px] uppercase fill-[#6E6458] font-medium tracking-[0.26em]">
                  <textPath href="#badgeCirclePath" startOffset="0%">
                    DESIGNING VISUALS • THAT CONNECT •
                  </textPath>
                </text>
              </g>
            </svg>

            {/* Static Center: 3+ Years Experience */}
            <div className="flex flex-col items-center justify-center text-center select-none pt-1">
              <span className="font-playfair text-[1.65rem] sm:text-[1.85rem] lg:text-[2.05rem] xl:text-[2.2rem] font-bold leading-none text-[#B8860B]">
                3+
              </span>
              <span className="font-sora text-[0.44rem] sm:text-[0.48rem] lg:text-[0.52rem] xl:text-[0.56rem] uppercase tracking-[0.18em] font-semibold text-[#5A5044] mt-0.5">
                YEARS
              </span>
              <span className="font-sora text-[0.40rem] sm:text-[0.44rem] lg:text-[0.48rem] xl:text-[0.50rem] uppercase tracking-[0.14em] font-medium text-[#7D7366] -mt-0.5">
                EXPERIENCE
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
