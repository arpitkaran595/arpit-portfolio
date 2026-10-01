import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// SVG coordinate system definition (Single Source of Truth)
const SVG_VIEWBOX_WIDTH = 1200;
const SVG_VIEWBOX_HEIGHT = 650;

// Ascending organic Bézier career path through the clouds
const PATH_D =
  'M 115,485 C 190,510 270,465 365,415 C 470,355 575,330 685,275 C 795,220 885,180 970,140 C 1025,115 1068,102 1110,95';

// Real Professional Work Experience Data
// Precise mathematical anchors along PATH_D (0 to 1)
interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  date: string;
  responsibilities: string[];
  icon: 'explore' | 'youtube' | 'video';
  progress: number;
  defaultPos: {
    xPercent: number;
    yPercent: number;
  };
  contourStyle: string; // Organic cloud droplet contour
}

const experiences: ExperienceItem[] = [
  {
    id: 'exp-explore-epic',
    company: 'Explore Epic',
    role: 'YouTube Editor & Designer',
    date: '2023 — 2025',
    responsibilities: [
      'Edited videos focused on narrative pacing and retention.',
      'Created visually striking thumbnails to improve click-through performance.',
    ],
    icon: 'explore',
    progress: 0.26, // Exact position along the SVG path
    defaultPos: {
      xPercent: 31.4176,
      yPercent: 62.8132,
    },
    contourStyle: '48% 52% 54% 46% / 52% 48% 52% 48%',
  },
  {
    id: 'exp-sristi-kalyan',
    company: 'Sristi Kalyan',
    role: 'YouTube Editor & Designer',
    date: 'Apr 2025 — Jun 2025',
    responsibilities: [
      'Edited YouTube videos for high retention and engagement.',
      'Designed professional, high-CTR thumbnails.',
    ],
    icon: 'youtube',
    progress: 0.57, // Exact position along the SVG path
    defaultPos: {
      xPercent: 56.9917,
      yPercent: 42.3919,
    },
    contourStyle: '52% 48% 46% 54% / 46% 54% 46% 54%',
  },
  {
    id: 'exp-innovana',
    company: 'Innovana Thinklabs Ltd.',
    role: 'Video Editor',
    date: 'Jan 2026 — Present',
    responsibilities: [
      'Edited and enhanced videos using AI tools to improve quality, speed, and visual impact.',
      'Delivered engaging social media content while maintaining brand consistency and deadlines.',
    ],
    icon: 'video',
    progress: 0.85, // Exact position along the SVG path
    defaultPos: {
      xPercent: 79.7470,
      yPercent: 22.4793,
    },
    contourStyle: '46% 54% 52% 48% / 54% 46% 54% 46%',
  },
];

const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const arrowMarkerRef = useRef<SVGPathElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const experienceNodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const mobileNodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const foregroundCloudLeftRef = useRef<HTMLDivElement>(null);
  const cloudRightRef = useRef<HTMLDivElement>(null);
  const sparkleRef = useRef<HTMLDivElement>(null);

  // Exact path-derived coordinates for each experience node
  const [anchors, setAnchors] = useState<{ xPercent: number; yPercent: number }[]>(() =>
    experiences.map((e) => e.defaultPos)
  );

  // 1. Calculate Exact Path Anchors mathematically using getPointAtLength
  useEffect(() => {
    const updateAnchors = () => {
      if (pathRef.current) {
        const totalLen = pathRef.current.getTotalLength();
        if (totalLen > 0) {
          const calculated = experiences.map((e) => {
            const pt = pathRef.current!.getPointAtLength(e.progress * totalLen);
            return {
              xPercent: (pt.x / SVG_VIEWBOX_WIDTH) * 100,
              yPercent: (pt.y / SVG_VIEWBOX_HEIGHT) * 100,
            };
          });
          setAnchors(calculated);
        }
      }
    };

    updateAnchors();
    window.addEventListener('resize', updateAnchors);
    return () => window.removeEventListener('resize', updateAnchors);
  }, []);

  // 2. Master GSAP Scroll-Triggered Animation & Subtle Environmental Movement
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Clearly Visible Foreground Left Cloud: Slow, organic drift wrapping mountain base (24s)
      if (foregroundCloudLeftRef.current) {
        gsap.to(foregroundCloudLeftRef.current, {
          x: 16,
          y: 4,
          duration: 24,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // 2. Mid-Right Distant Cloud Drift
      if (cloudRightRef.current) {
        gsap.to(cloudRightRef.current, {
          x: -18,
          y: 6,
          duration: 26,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // 4. Subtle Celestial Sparkle Constellation
      if (sparkleRef.current) {
        gsap.to(sparkleRef.current, {
          opacity: 0.75,
          duration: 4.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // 5. Left Editorial Intro Reveal
      if (introRef.current) {
        gsap.fromTo(
          introRef.current.children,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              once: true,
            },
          }
        );
      }

      // 6. Continuous Synchronized Timeline Drawing Animation (3.6s, ONE-TIME)
      if (pathRef.current) {
        const pathLength = pathRef.current.getTotalLength();

        // Initial state: hide timeline path and experience elements
        gsap.set(pathRef.current, {
          strokeDasharray: '6 6',
          strokeDashoffset: pathLength,
          opacity: 0.85,
        });

        if (arrowMarkerRef.current) {
          gsap.set(arrowMarkerRef.current, { opacity: 0 });
        }

        experienceNodesRef.current.forEach((node) => {
          if (node) {
            const droplet = node.querySelector('.glass-droplet');
            const icon = node.querySelector('.droplet-icon');
            const connector = node.querySelector('.exp-connector');
            const card = node.querySelector('.exp-card');
            gsap.set(droplet, { opacity: 0, scale: 0.85 });
            gsap.set(icon, { opacity: 0, scale: 0.8 });
            gsap.set([connector, card], { opacity: 0, y: 10, scale: 0.96 });
          }
        });

        const totalDuration = 3.6;
        const mainTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'bottom 85%',
            scrub: 1,
          },
        });

        // ONE SINGLE continuous stroke-draw animation (Static SVG path drawn forward)
        mainTl.to(
          pathRef.current,
          {
            strokeDashoffset: 0,
            duration: totalDuration,
            ease: 'power1.inOut',
          },
          0
        );

        // Sequence milestone reveals synchronized to the exact progress of the path
        experiences.forEach((e, idx) => {
          const node = experienceNodesRef.current[idx];
          if (node) {
            const droplet = node.querySelector('.glass-droplet');
            const icon = node.querySelector('.droplet-icon');
            const connector = node.querySelector('.exp-connector');
            const card = node.querySelector('.exp-card');
            const arrivalTime = totalDuration * e.progress;

            // 1. Glass cloud droplet softly materializes as the path line arrives at its exact center
            mainTl.to(
              droplet,
              {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: 'power2.out',
              },
              arrivalTime
            );

            // 2. Central gold icon fades & scales into visibility
            mainTl.to(
              icon,
              {
                opacity: 1,
                scale: 1,
                duration: 0.45,
                ease: 'power2.out',
              },
              arrivalTime + 0.05
            );

            // 3. Connector trail & card reveal smoothly
            mainTl.to(
              [connector, card],
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.55,
                ease: 'power2.out',
              },
              arrivalTime + 0.1
            );
          }
        });

        // Terminal arrowhead appears when path reaches the end
        if (arrowMarkerRef.current) {
          mainTl.to(
            arrowMarkerRef.current,
            {
              opacity: 1,
              duration: 0.35,
              ease: 'power2.out',
            },
            totalDuration - 0.15
          );
        }
      }

      // Mobile Vertical Timeline Progressive Reveal
      if (mobileNodesRef.current.length > 0) {
        const mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        });

        mobileNodesRef.current.forEach((node, idx) => {
          if (node) {
            mobileTl.fromTo(
              node,
              { opacity: 0, y: 20, scale: 0.95 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.55,
                ease: 'power2.out',
              },
              idx * 0.22
            );
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Professional minimal gold line-art icons for real work experiences
  const renderIcon = (type: ExperienceItem['icon']) => {
    switch (type) {
      case 'video':
        // Video camera / editing icon for Innovana Thinklabs
        return (
          <svg
            className="w-5 h-5 md:w-5.5 md:h-5.5 text-gold-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z" />
            <rect x="3" y="6" width="12" height="12" rx="2" />
          </svg>
        );
      case 'youtube':
        // YouTube / play screen icon for Sristi Kalyan
        return (
          <svg
            className="w-5 h-5 md:w-5.5 md:h-5.5 text-gold-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none" />
          </svg>
        );
      case 'explore':
        // Creative film roll / editing icon for Explore Epic
        return (
          <svg
            className="w-5 h-5 md:w-5.5 md:h-5.5 text-gold-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
            <line x1="7" y1="2" x2="7" y2="22" />
            <line x1="17" y1="2" x2="17" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="2" y1="7" x2="7" y2="7" />
            <line x1="2" y1="17" x2="7" y2="17" />
            <line x1="17" y1="17" x2="22" y2="17" />
            <line x1="17" y1="7" x2="22" y2="7" />
          </svg>
        );
    }
  };

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative w-full overflow-hidden min-h-screen lg:h-screen lg:min-h-[850px] lg:max-h-[1050px] xl:min-h-[900px] flex flex-col justify-between pt-32 sm:pt-36 lg:pt-16 xl:pt-20 pb-10 lg:pb-8 scroll-mt-24 bg-cream-100"
    >
      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* LAYER 0 & 1: FULL-BLEED PRIMARY ATMOSPHERIC CLOUDSCAPE BACKGROUND (z-0 / z-1) */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-[1] select-none overflow-hidden">
        <img
          src="/assets/experience-cloudscape.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-[78%_bottom] md:object-[75%_bottom] xl:object-[72%_bottom] scale-[1.14] opacity-[0.95]"
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 12%, black 60%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.45) 80%, rgba(0,0,0,0.12) 90%, transparent 96%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 12%, black 60%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.45) 80%, rgba(0,0,0,0.12) 90%, transparent 96%)',
          }}
          draggable={false}
        />
      </div>

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* LAYER 2: ATMOSPHERIC GRADIENTS & SUNRISE GLOW (z-2) */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* Top atmospheric bridge extending seamlessly from Section 6 */}
      <div
        className="absolute top-0 inset-x-0 h-44 pointer-events-none z-[2]"
        style={{
          background:
            'linear-gradient(to bottom, #FAF3E8 0%, rgba(250, 243, 232, 0.85) 45%, transparent 100%)',
        }}
      />

      {/* Primary Warm Sunrise Glow matching Mountain Sun Flare (Lower-Left) */}
      <div
        className="absolute bottom-0 left-[6%] w-[850px] h-[700px] pointer-events-none z-[2]"
        style={{
          background:
            'radial-gradient(circle at 25% 75%, rgba(255, 218, 148, 0.45) 0%, rgba(246, 215, 178, 0.22) 45%, transparent 70%)',
        }}
      />

      {/* Subtle Central Warm Peach Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[850px] pointer-events-none z-[2]"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(246, 215, 178, 0.22) 0%, rgba(250, 245, 238, 0.06) 60%, transparent 85%)',
        }}
      />

      {/* Layer 2.3: Mid-Right Distant Cloud Drift ("cloud-right.png") */}
      <div
        ref={cloudRightRef}
        className="absolute bottom-[8%] right-[-6%] w-[36vw] min-w-[380px] max-w-[580px] h-auto pointer-events-none z-[2] select-none"
      >
        <img
          src="/assets/cloud-right.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-contain object-bottom-right opacity-40 blur-[2px]"
          style={{
            maskImage:
              'radial-gradient(ellipse 80% 70% at 65% 65%, black 30%, rgba(0,0,0,0.5) 60%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 70% at 65% 65%, black 30%, rgba(0,0,0,0.5) 60%, transparent 100%)',
          }}
          draggable={false}
        />
      </div>

      {/* Layer 2.4: Subtle Atmospheric Sparkle Particles ("Asset 07 Sparkle Set.png") */}
      <div
        ref={sparkleRef}
        className="absolute top-[16%] right-[20%] w-28 h-28 pointer-events-none z-[2] select-none opacity-45"
      >
        <img
          src="/assets/sparkle-set.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(246,215,178,0.6)]"
          draggable={false}
        />
      </div>

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* LAYER 2.5: SUPPORTING LEFT CLOUD ("Asset 02 - hero-clouds-left.png") */}
      {/* Positioned BEHIND the mountain/person at z-[2] to preserve person & peak silhouette */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <div
        ref={foregroundCloudLeftRef}
        className="absolute bottom-0 left-[-2%] w-[26vw] min-w-[260px] max-w-[390px] h-auto pointer-events-none z-[2] select-none"
      >
        <img
          src="/assets/cloud-left.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-contain object-bottom-left opacity-[0.82] filter blur-[0.6px]"
          style={{
            maskImage:
              'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 4%, black 18%, black 100%)',
            WebkitMaskImage:
              'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 4%, black 18%, black 100%)',
          }}
          draggable={false}
        />
      </div>

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* LAYER 3: MOUNTAIN + PERSON FOREGROUND (z-3) */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 w-[33vw] min-w-[360px] max-w-[520px] xl:max-w-[560px] h-auto pointer-events-none z-[3] select-none">
        <img
          src="/assets/experience-mountain-person.webp"
          alt="Arpit standing on the mountain peak looking towards the career journey"
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-contain object-bottom-left"
          style={{
            maskImage:
              'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 3%, black 8%, black 82%, rgba(0,0,0,0.7) 94%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 3%, black 8%, black 82%, rgba(0,0,0,0.7) 94%, transparent 100%)',
          }}
          draggable={false}
        />
      </div>

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* MAIN VIEWPORT CONTAINER */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-full max-w-[1680px] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 flex flex-col justify-between flex-1 z-[4]">
        
        {/* Top/Middle Area: Left Editorial Intro + Central Career Timeline */}
        <div className="relative w-full flex-1 flex flex-col lg:block pt-2 lg:pt-4">
          
          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* LAYER 7: LEFT EDITORIAL INTRO COLUMN (z-[7]) */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <div
            ref={introRef}
            className="lg:absolute lg:left-0 lg:top-[12%] xl:top-[14%] w-full lg:w-[320px] xl:w-[360px] z-[7] flex flex-col items-start"
          >
            {/* Eyebrow & Underline */}
            <div className="flex flex-col items-start">
              <span className="text-gold-400 text-[11px] md:text-[12px] font-sora uppercase tracking-[0.18em] font-semibold">
                EXPERIENCE
              </span>
              <div className="w-9 h-[1.5px] bg-gold-400 mt-2 mb-4" />
            </div>

            {/* Main Heading */}
            <h2 className="font-playfair text-[clamp(2.5rem,4.1vw,4.2rem)] font-bold leading-[1.08] text-charcoal-800 tracking-tight">
              My Journey,<br />
              <span className="text-gold-400 font-bold">So Far.</span>
            </h2>

            {/* Supporting Description */}
            <p className="text-charcoal-500 text-[14px] md:text-[14.5px] font-sora leading-relaxed mt-4 max-w-[310px]">
              Every project, client and opportunity has shaped the way I create and deliver.
            </p>

            {/* Editorial CTA */}
            <a
              href="#contact"
              className="inline-flex items-center gap-3.5 mt-6 sm:mt-7 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gold-400 text-white flex items-center justify-center shadow-md shadow-gold-400/25 group-hover:bg-gold-500 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-gold-400/35 transition-all duration-300">
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[12px] font-sora font-semibold text-charcoal-800 leading-tight">
                  Let's Create
                </span>
                <span className="text-[12px] font-sora font-semibold text-charcoal-800 leading-tight">
                  What's Next
                </span>
              </div>
            </a>
          </div>

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* DESKTOP HERO CAREER TIMELINE (HIDDEN ON MOBILE/TABLET < 1024px) */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <div className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none">
            
            {/* LAYER 4: SVG Ascending Organic Dashed Path (z-[4]) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-[4]"
              viewBox={`0 0 ${SVG_VIEWBOX_WIDTH} ${SVG_VIEWBOX_HEIGHT}`}
              preserveAspectRatio="none"
            >
              <defs>
                <marker
                  id="career-arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path
                    ref={arrowMarkerRef}
                    d="M 1 1 L 9 5 L 1 9"
                    fill="none"
                    stroke="#C4943A"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </marker>
              </defs>

              {/* ONE SINGLE Continuous Static Organic Bézier Career Path */}
              <path
                ref={pathRef}
                d={PATH_D}
                fill="none"
                stroke="#C4943A"
                strokeWidth="1.6"
                strokeDasharray="6 6"
                markerEnd="url(#career-arrow)"
              />
            </svg>

            {/* Desktop Experience Nodes & Cards Container (Anchored Mathematically to Path Center - z-[5] & z-[6]) */}
            <div className="absolute inset-0 w-full h-full pointer-events-auto z-[5]">
              {experiences.map((e, index) => {
                const pos = anchors[index] || e.defaultPos;
                return (
                  <div
                    key={e.id}
                    ref={(el) => (experienceNodesRef.current[index] = el)}
                    className="experience-node absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-default pointer-events-none"
                    style={{
                      left: `${pos.xPercent}%`,
                      top: `${pos.yPercent}%`,
                    }}
                  >
                    {/* ───────────────────────────────────────────────────────── */}
                    {/* 1. "GLASS CLOUD DROPLET" (CENTERED DEAD-ON THE PATH STROKE - z-[25]) */}
                    {/* ───────────────────────────────────────────────────────── */}
                    <div
                      className="glass-droplet w-[58px] h-[58px] xl:w-[64px] xl:h-[64px] flex items-center justify-center group-hover:scale-105 transition-all duration-300 relative z-[25] pointer-events-auto overflow-hidden"
                      style={{
                        borderRadius: e.contourStyle,
                        background:
                          'radial-gradient(135% 135% at 30% 25%, rgba(255, 255, 255, 0.90) 0%, rgba(255, 252, 246, 0.68) 45%, rgba(248, 239, 224, 0.45) 80%, rgba(238, 223, 200, 0.32) 100%)',
                        backdropFilter: 'blur(14px)',
                        WebkitBackdropFilter: 'blur(14px)',
                        border: '1.2px solid rgba(220, 190, 145, 0.85)',
                        boxShadow:
                          '0 12px 26px -4px rgba(45,38,30,0.12), 0 3px 8px rgba(196,148,58,0.18), inset 1.5px 1.5px 3px rgba(255,255,255,0.95), inset -1.5px -1.5px 2px rgba(215,190,150,0.3)',
                      }}
                    >
                      {/* Top-Left Specular Glass Reflection */}
                      <div
                        className="absolute inset-0 rounded-[inherit] pointer-events-none"
                        style={{
                          background:
                            'radial-gradient(ellipse 65% 42% at 32% 22%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)',
                        }}
                      />

                      {/* Micro-Condensation Droplets Overlay */}
                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none opacity-35 mix-blend-overlay"
                        viewBox="0 0 64 64"
                      >
                        <circle cx="17" cy="16" r="1.3" fill="#FFFFFF" opacity="0.9" />
                        <circle cx="45" cy="21" r="1.1" fill="#FFFFFF" opacity="0.85" />
                        <circle cx="23" cy="47" r="1.4" fill="#FFFFFF" opacity="0.8" />
                        <circle cx="47" cy="43" r="0.9" fill="#FFFFFF" opacity="0.75" />
                        <ellipse cx="14" cy="34" rx="1.1" ry="1.5" fill="#FFFFFF" opacity="0.7" transform="rotate(-15 14 34)" />
                      </svg>

                      {/* Delicate Gold Line-Art Icon in Center */}
                      <div className="droplet-icon relative z-10 filter drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                        {renderIcon(e.icon)}
                      </div>
                    </div>

                    {/* ───────────────────────────────────────────────────────── */}
                    {/* 2. CONNECTOR & TRANSLUCENT EXPERIENCE CARD (Hangs Directly Below Milestone Node) */}
                    {/* ───────────────────────────────────────────────────────── */}
                    <div className="absolute top-[29px] xl:top-[32px] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto pt-1">
                      {/* Vertical Connector Line & Solid Gold Dot */}
                      <div className="exp-connector flex flex-col items-center">
                        <div className="w-[1.5px] h-3 bg-gradient-to-b from-gold-400 to-gold-400/50" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-400 shadow-sm shadow-gold-400/40 relative z-[30] -mb-1" />
                      </div>

                      {/* Translucent Editorial Paper-Glass Experience Card (z-[20]) */}
                      <div
                        className="exp-card mt-1.5 w-[235px] xl:w-[275px] rounded-[20px] p-3.5 xl:p-4.5 text-left group-hover:-translate-y-1 transition-all duration-300 relative z-[20] overflow-hidden"
                        style={{
                          background:
                            'linear-gradient(175deg, rgba(255, 253, 249, 0.94) 0%, rgba(255, 250, 242, 0.88) 60%, rgba(250, 242, 230, 0.82) 100%)',
                          backdropFilter: 'blur(16px)',
                          WebkitBackdropFilter: 'blur(16px)',
                          border: '1px solid rgba(225, 198, 158, 0.75)',
                          boxShadow:
                            '0 14px 32px -6px rgba(45,38,30,0.08), 0 3px 12px rgba(246,215,178,0.22), inset 1px 1px 2px rgba(255,255,255,0.9), inset -1px -1px 2px rgba(215,190,150,0.2)',
                        }}
                      >
                        {/* Header: Date Tag */}
                        <div className="mb-1.5">
                          <span className="font-sora text-[9.5px] xl:text-[10px] font-bold text-gold-600 uppercase tracking-widest bg-gold-400/12 px-2.5 py-0.5 rounded-full border border-gold-400/30 inline-block">
                            {e.date}
                          </span>
                        </div>

                        {/* Company Name */}
                        <h3 className="font-playfair text-[15px] xl:text-[16.5px] font-bold text-charcoal-800 leading-tight">
                          {e.company}
                        </h3>

                        {/* Role */}
                        <p className="font-sora text-[11px] xl:text-[12px] font-medium text-charcoal-500 mt-0.5 mb-2">
                          {e.role}
                        </p>

                        {/* Gold Horizontal Accent Line */}
                        <div className="w-6 h-[1.2px] bg-gold-400/80 rounded-full mb-2" />

                        {/* Responsibilities Bullets */}
                        <ul className="space-y-1.5">
                          {e.responsibilities.map((resp, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 flex-shrink-0" />
                              <span className="font-sora text-[10px] xl:text-[11px] text-charcoal-600 leading-[1.45]">
                                {resp}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* MOBILE & TABLET VERTICAL CAREER TIMELINE (< 1024px) */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <div className="lg:hidden w-full mt-10 relative flex flex-col gap-6 z-[5]">
            {/* Vertical Connecting Dashed Line */}
            <div className="absolute left-[28px] top-6 bottom-6 w-[2px] border-l-2 border-dashed border-gold-400/60 pointer-events-none" />

            {[...experiences].reverse().map((e, idx) => (
              <div
                key={e.id}
                ref={(el) => (mobileNodesRef.current[idx] = el)}
                className="mobile-exp-item flex items-start gap-4 sm:gap-5 relative"
              >
                {/* Glass Cloud Droplet Badge */}
                <div
                  className="w-[56px] h-[56px] flex-shrink-0 flex items-center justify-center relative z-10 overflow-hidden"
                  style={{
                    borderRadius: e.contourStyle,
                    background:
                      'radial-gradient(135% 135% at 30% 25%, rgba(255, 255, 255, 0.88) 0%, rgba(255, 252, 246, 0.65) 45%, rgba(248, 239, 224, 0.42) 80%, rgba(238, 223, 200, 0.30) 100%)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    border: '1.2px solid rgba(220, 190, 145, 0.85)',
                    boxShadow:
                      '0 8px 20px -3px rgba(196,148,58,0.18), inset 1.5px 1.5px 3px rgba(255,255,255,0.95)',
                  }}
                >
                  <div className="relative z-10">{renderIcon(e.icon)}</div>
                </div>

                {/* Card */}
                <div
                  className="flex-1 rounded-[20px] p-4 sm:p-5"
                  style={{
                    background:
                      'linear-gradient(175deg, rgba(255, 253, 249, 0.94) 0%, rgba(255, 250, 242, 0.88) 100%)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(225, 198, 158, 0.75)',
                    boxShadow: '0 4px 18px -2px rgba(45,38,30,0.06)',
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                    <h3 className="font-playfair text-[16.5px] sm:text-[17.5px] font-bold text-charcoal-800">
                      {e.company}
                    </h3>
                    <span className="font-sora text-[10px] font-bold text-gold-600 uppercase tracking-widest bg-gold-400/12 px-2 py-0.5 rounded-full border border-gold-400/30 w-fit">
                      {e.date}
                    </span>
                  </div>

                  <p className="font-sora text-[12px] font-medium text-charcoal-500 mb-2">
                    {e.role}
                  </p>

                  <div className="w-6 h-[1.2px] bg-gold-400/80 rounded-full mb-2.5" />

                  <ul className="space-y-1.5">
                    {e.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 flex-shrink-0" />
                        <span className="font-sora text-[11.5px] sm:text-[12px] text-charcoal-600 leading-relaxed">
                          {resp}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Experience;
