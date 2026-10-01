import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  User,
  Mail,
  LayoutGrid,
  ChevronDown,
  PenLine,
  ShieldCheck,
  CheckCircle,
  Check,
} from 'lucide-react';
import { personalInfo, socialLinks } from '../data/portfolio';

gsap.registerPlugin(ScrollTrigger);

const PROJECT_TYPES = [
  'Project Type / Service',
  'Video Editing',
  'YouTube Thumbnail Design',
  'Motion Graphics',
  'Social Media Creatives',
  'Brand Identity',
  'Other',
];

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const arrowWrapRef = useRef<HTMLDivElement>(null);
  const quoteCardRef = useRef<HTMLDivElement>(null);
  const quoteMarkRef = useRef<HTMLSpanElement>(null);
  const quoteTextRef = useRef<HTMLParagraphElement>(null);
  const quoteDividerRef = useRef<HTMLDivElement>(null);
  const signatureWrapRef = useRef<HTMLDivElement>(null);
  const cloudLeftRef = useRef<HTMLDivElement>(null);
  const cloudRightRef = useRef<HTMLDivElement>(null);
  const cloudHorizonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: '',
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectProjectType = (type: string) => {
    if (type === 'Project Type / Service') {
      setFormData((prev) => ({ ...prev, projectType: '' }));
    } else {
      setFormData((prev) => ({ ...prev, projectType: type }));
    }
    setIsDropdownOpen(false);
  };

  const handleDropdownKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isDropdownOpen) {
        setIsDropdownOpen(true);
        const currentIndex = PROJECT_TYPES.indexOf(
          formData.projectType || 'Project Type / Service'
        );
        setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
      } else if (e.key === 'ArrowDown') {
        setFocusedIndex((prev) => (prev < PROJECT_TYPES.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp' && isDropdownOpen) {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : PROJECT_TYPES.length - 1));
    } else if ((e.key === 'Enter' || e.key === ' ') && isDropdownOpen) {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < PROJECT_TYPES.length) {
        handleSelectProjectType(PROJECT_TYPES[focusedIndex]);
      }
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Left column elements entrance
      const leftElements = leftColRef.current?.querySelectorAll('.reveal-item');
      if (leftElements && leftElements.length > 0) {
        gsap.fromTo(
          leftElements,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            },
          }
        );
      }

      // 2. Right form card entrance
      if (rightColRef.current) {
        gsap.fromTo(
          rightColRef.current,
          { opacity: 0, y: 26, scale: 0.985 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            delay: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            },
          }
        );
      }

      // 3. Hand-drawn arrow gentle entrance and subtle floating loop
      if (arrowWrapRef.current) {
        gsap.fromTo(
          arrowWrapRef.current,
          { opacity: 0, scale: 0.88 },
          {
            opacity: 0.85,
            scale: 1,
            duration: 0.7,
            delay: 0.35,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            },
            onComplete: () => {
              gsap.to(arrowWrapRef.current, {
                y: -4,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
              });
            },
          }
        );
      }

      // 4. Lower editorial signature lockup entrance and subtle scroll parallax
      if (quoteCardRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        });

        // Quote mark fades in
        if (quoteMarkRef.current) {
          tl.fromTo(
            quoteMarkRef.current,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.75, ease: 'power2.out' },
            0
          );
        }

        // Quote rises by around 12px
        if (quoteTextRef.current) {
          tl.fromTo(
            quoteTextRef.current,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' },
            0.1
          );
        }

        // Divider draws vertically
        if (quoteDividerRef.current) {
          tl.fromTo(
            quoteDividerRef.current,
            { opacity: 0, scaleY: 0, transformOrigin: 'center' },
            { opacity: 1, scaleY: 1, duration: 0.7, ease: 'power2.out' },
            0.2
          );
        }

        // Signature softly fades and rises
        if (signatureWrapRef.current) {
          tl.fromTo(
            signatureWrapRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
            0.25
          );
        }

        // Subtle scroll parallax
        gsap.to(quoteCardRef.current, {
          y: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      // 5. Barely noticeable, calm cloud drift
      if (cloudLeftRef.current) {
        gsap.to(cloudLeftRef.current, {
          x: 10,
          y: -5,
          duration: 14,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      if (cloudRightRef.current) {
        gsap.to(cloudRightRef.current, {
          x: -12,
          y: -6,
          duration: 16,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      if (cloudHorizonRef.current) {
        gsap.to(cloudHorizonRef.current, {
          yPercent: -4,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const service = formData.projectType || 'General Collaboration';
    const subject = encodeURIComponent(`Project Inquiry: ${service} — ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nProject Type: ${service}\n\nProject Details:\n${formData.message}`
    );
    setIsSubmitted(true);
    setTimeout(() => {
      window.location.href = `mailto:${personalInfo.emails.primary}?subject=${subject}&body=${body}`;
    }, 400);
  };

  const handleStartProjectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const input = document.getElementById('contact-name-input');
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const instagramLink =
    socialLinks.find((l) => l.platform === 'Instagram')?.url ||
    'https://instagram.com/i_am__arpittt';

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#FAF4EC] pt-20 sm:pt-24 lg:pt-20 pb-10 sm:pb-14 lg:pb-12 scroll-mt-16 flex flex-col justify-between"
      style={{
        background:
          'linear-gradient(180deg, #FAF4EB 0%, #FAF3EA 35%, #F8EFE3 70%, #F5E9D8 100%)',
      }}
    >
      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* LAYER 0: PAPER TEXTURE & NOISE GRAIN OVERLAYS */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: 'url(/assets/paper-texture.webp)',
          backgroundRepeat: 'repeat',
          backgroundSize: '400px 400px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-15 mix-blend-overlay"
        style={{
          backgroundImage: 'url(/assets/noise-grain.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* LAYER 1: AMBIENT SUNRISE PEACH-GOLDEN ATMOSPHERIC LIGHTING */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[650px] h-[550px] pointer-events-none z-[2] rounded-full blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, rgba(252, 222, 185, 0.45) 0%, rgba(246, 215, 178, 0.20) 55%, transparent 75%)',
        }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[580px] pointer-events-none z-[2] rounded-full blur-[130px]"
        style={{
          background:
            'radial-gradient(circle, rgba(248, 212, 165, 0.45) 0%, rgba(250, 225, 195, 0.18) 55%, transparent 75%)',
        }}
      />

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* LAYER 2: CLOUDSCAPE ATMOSPHERE (HORIZON + CORNER PLUMES) */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 2.1 Distant Cloud Horizon */}
      <div
        ref={cloudHorizonRef}
        className="absolute bottom-0 inset-x-0 w-full pointer-events-none z-[2] select-none flex justify-center overflow-hidden"
      >
        <img
          src="/assets/cloud-horizon.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full min-w-[1300px] max-w-[2400px] h-auto object-cover object-bottom opacity-90"
          draggable={false}
        />
      </div>

      {/* 2.2 Soft Atmospheric Mist */}
      <div className="absolute bottom-0 inset-x-0 h-[460px] pointer-events-none z-[3] overflow-hidden select-none">
        <img
          src="/assets/atmospheric-mist.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-bottom opacity-20 mix-blend-screen"
          draggable={false}
        />
      </div>

      {/* 2.3 Distant Birds Flock Silhouette in lower-left sky */}
      <div
        className="absolute bottom-[170px] sm:bottom-[190px] lg:bottom-[210px] left-[15%] sm:left-[17%] lg:left-[19%] pointer-events-none z-[3] select-none opacity-40"
        aria-hidden="true"
      >
        <svg width="46" height="24" viewBox="0 0 46 24" fill="none">
          <path
            d="M2 10C3.5 7.5 5 7 6.5 9C8 7 9.5 7.5 11 10"
            stroke="#655B4E"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <path
            d="M14 6C15.2 4 16.5 3.5 17.8 5C19 3.5 20.3 4 21.5 6"
            stroke="#655B4E"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M26 13C27 11.2 28.2 10.8 29.3 12.2C30.4 10.8 31.5 11.2 32.5 13"
            stroke="#655B4E"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <path
            d="M36 8C37 6.5 38 6.2 39 7.4C40 6.2 41 6.5 42 8"
            stroke="#655B4E"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 2.4 Lower-Left Cloud Plume (Assets 02 - hero-clouds-left.png) */}
      <div
        ref={cloudLeftRef}
        className="absolute -bottom-6 sm:-bottom-10 lg:-bottom-12 -left-8 sm:-left-10 lg:-left-14 w-[42vw] min-w-[320px] max-w-[580px] pointer-events-none z-[4] select-none"
      >
        <img
          src="/assets/cloud-left.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-contain opacity-95 filter drop-shadow-[0_15px_35px_rgba(230,195,150,0.25)]"
          draggable={false}
        />
      </div>

      {/* 2.5 Lower-Right Cloud Plume (Assets 02 - hero-clouds-Right.png) */}
      <div
        ref={cloudRightRef}
        className="absolute -bottom-6 sm:-bottom-10 lg:-bottom-12 -right-8 sm:-right-10 lg:-right-14 w-[44vw] min-w-[340px] max-w-[620px] pointer-events-none z-[4] select-none"
      >
        <img
          src="/assets/cloud-right.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-contain opacity-95 filter drop-shadow-[0_15px_35px_rgba(230,195,150,0.25)]"
          draggable={false}
        />
      </div>

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* LAYER 5: MAIN SECTION CONTENT (EDITORIAL GRID) */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <div className="max-w-[1340px] w-full mx-auto px-6 sm:px-8 md:px-10 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-start">
          
          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* LEFT SIDE: EDITORIAL HEADLINE, COPY, CTA, ARROW & CONTACT CARDS */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <div
            ref={leftColRef}
            className="lg:col-span-7 xl:col-span-7 flex flex-col pt-1 lg:pt-2"
          >
            {/* Gold Eyebrow & Thin Line */}
            <div className="reveal-item flex flex-col items-start mb-4 sm:mb-5">
              <span className="font-sora text-[11px] sm:text-[11.5px] uppercase tracking-[0.22em] font-semibold text-[#A3772C]">
                LET'S WORK TOGETHER
              </span>
              <div className="w-8 h-[1.6px] bg-[#A3772C] mt-2.5" />
            </div>

            {/* Large Editorial Headline */}
            <h2 className="reveal-item font-playfair text-[clamp(2.8rem,5.3vw,4.45rem)] font-bold text-[#141414] leading-[1.06] tracking-[-0.015em]">
              <span className="block">Let’s Create</span>
              <span className="block">Something</span>
              <span className="block text-[#A3772C]">Worth Seeing.</span>
            </h2>

            {/* Supporting Copy */}
            <p className="reveal-item font-sora text-[13.5px] sm:text-[14.5px] text-[#5A544A] leading-[1.68] mt-5 max-w-[430px]">
              Have a project in mind? I'd love to hear about it.
              <br className="hidden sm:inline" /> Let's bring your ideas to life with creativity and purpose.
            </p>

            {/* CTA Button + Hand-drawn Scribble Arrow */}
            <div className="reveal-item relative flex items-center mt-7 sm:mt-8 gap-4">
              <button
                type="button"
                onClick={handleStartProjectClick}
                className="bg-[#171717] hover:bg-[#262626] active:scale-[0.98] text-[#D8B062] px-7 py-3.5 rounded-full font-sora text-xs sm:text-[12.5px] font-semibold tracking-[0.14em] flex items-center gap-3 transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_22px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 group shrink-0 cursor-pointer"
              >
                <span>START A PROJECT</span>
                <span className="text-base leading-none group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300">
                  ↗
                </span>
              </button>

              {/* Hand-drawn Arrow Asset (Asset 08 Hand-drawn Arrow 1 Scribble.png) */}
              {/* Perfectly matched to reference: scaleX(-1) rotate(-30deg) pointing directly left to button */}
              <div
                ref={arrowWrapRef}
                className="relative hidden sm:flex items-center pointer-events-none select-none -ml-1 sm:ml-2"
                aria-hidden="true"
              >
                <img
                  src="/assets/arrow-scribble-1.png"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-24 sm:w-28 h-auto object-contain"
                  style={{
                    transform: 'scaleX(-1) rotate(-30deg)',
                    filter: 'sepia(0.35) saturate(0.85) opacity(0.8)',
                  }}
                  draggable={false}
                />
              </div>
            </div>

            {/* 3 Compact Contact Method Cards */}
            <div className="reveal-item mt-10 sm:mt-11 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-2.5 sm:gap-3 w-full max-w-[680px]">
              
              {/* Card 1: WhatsApp */}
              <a
                href={personalInfo.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-[16px] px-3 py-3 xl:px-3.5 xl:py-3.5 bg-[#FFFDF9]/88 backdrop-blur-sm border border-[#E9DFCE]/85 flex items-center justify-between gap-2 shadow-[0_4px_14px_-4px_rgba(100,70,30,0.04)] hover:border-[#C4943A]/60 hover:shadow-[0_8px_20px_-4px_rgba(100,70,30,0.1)] hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[10px] border border-[#D4AF67]/70 bg-[#FFFDF8] flex items-center justify-center text-[#A3772C] group-hover:border-[#C4943A] group-hover:bg-[#FAF3E8] shrink-0 transition-colors duration-300">
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="font-sora text-[11px] lg:text-[11.5px] font-bold text-[#1F1F1F]">
                      WhatsApp
                    </div>
                    <div className="font-sora text-[9px] xl:text-[9.5px] 2xl:text-[10px] text-[#7A7265] whitespace-nowrap">
                      Chat on WhatsApp
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="w-[1px] h-3 bg-[#E5DACE]/80" />
                  <span className="text-[11px] text-[#8A8275] group-hover:text-[#A3772C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200">
                    ↗
                  </span>
                </div>
              </a>

              {/* Card 2: Email */}
              <a
                href={`mailto:${personalInfo.emails.primary}`}
                className="rounded-[16px] px-3 py-3 xl:px-3.5 xl:py-3.5 bg-[#FFFDF9]/88 backdrop-blur-sm border border-[#E9DFCE]/85 flex items-center justify-between gap-2 shadow-[0_4px_14px_-4px_rgba(100,70,30,0.04)] hover:border-[#C4943A]/60 hover:shadow-[0_8px_20px_-4px_rgba(100,70,30,0.1)] hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[10px] border border-[#D4AF67]/70 bg-[#FFFDF8] flex items-center justify-center text-[#A3772C] group-hover:border-[#C4943A] group-hover:bg-[#FAF3E8] shrink-0 transition-colors duration-300">
                    <Mail className="w-3.5 h-3.5 stroke-[1.8]" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-sora text-[11px] lg:text-[11.5px] font-bold text-[#1F1F1F]">
                      Email
                    </div>
                    <div
                      className="font-sora text-[9px] xl:text-[9.5px] 2xl:text-[10px] text-[#7A7265] whitespace-nowrap"
                      title={personalInfo.emails.primary}
                    >
                      {personalInfo.emails.primary}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="w-[1px] h-3 bg-[#E5DACE]/80" />
                  <span className="text-[11px] text-[#8A8275] group-hover:text-[#A3772C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200">
                    ↗
                  </span>
                </div>
              </a>

              {/* Card 3: Instagram */}
              <a
                href={instagramLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-[16px] px-3 py-3 xl:px-3.5 xl:py-3.5 bg-[#FFFDF9]/88 backdrop-blur-sm border border-[#E9DFCE]/85 flex items-center justify-between gap-2 shadow-[0_4px_14px_-4px_rgba(100,70,30,0.04)] hover:border-[#C4943A]/60 hover:shadow-[0_8px_20px_-4px_rgba(100,70,30,0.1)] hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[10px] border border-[#D4AF67]/70 bg-[#FFFDF8] flex items-center justify-center text-[#A3772C] group-hover:border-[#C4943A] group-hover:bg-[#FAF3E8] shrink-0 transition-colors duration-300">
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="font-sora text-[11px] lg:text-[11.5px] font-bold text-[#1F1F1F]">
                      Instagram
                    </div>
                    <div className="font-sora text-[9px] xl:text-[9.5px] 2xl:text-[10px] text-[#7A7265] whitespace-nowrap">
                      @i_am__arpittt
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="w-[1px] h-3 bg-[#E5DACE]/80" />
                  <span className="text-[11px] text-[#8A8275] group-hover:text-[#A3772C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200">
                    ↗
                  </span>
                </div>
              </a>

            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* RIGHT SIDE: REFINED WARM CREAM/PAPER FORM CARD */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 xl:col-span-5 relative z-20">
            <div
              ref={rightColRef}
              className="relative w-full rounded-[26px] sm:rounded-[30px] p-6 sm:p-7 lg:p-8 border border-[#E7DCCE]/85 bg-[#FFFDF9]/94 backdrop-blur-md shadow-[0_25px_60px_-18px_rgba(120,85,40,0.08),0_2px_6px_rgba(0,0,0,0.02)] transition-shadow duration-300"
            >
              {/* Form Header */}
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#B38032] shrink-0 inline-block" />
                <h3 className="font-playfair text-[22px] sm:text-[25px] font-bold text-[#1F1F1F] leading-tight">
                  Send Me a Message
                </h3>
              </div>
              <p className="font-sora text-xs sm:text-[12.5px] text-[#6E6659] font-normal mb-5 sm:mb-6">
                Fill in the details and I'll get back to you soon.
              </p>

              {/* Form Element */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                
                {/* Row 1: Two Columns (Name & Email) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3.5">
                  {/* Name Input */}
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8275] pointer-events-none">
                      <User className="w-4 h-4 stroke-[1.8]" />
                    </span>
                    <input
                      id="contact-name-input"
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#FAF5ED]/85 border border-[#DFD3BD]/75 rounded-xl pl-10 pr-4 py-3 text-[13px] font-sora text-charcoal-800 placeholder:text-[#8C8275]/70 focus:bg-white focus:border-[#A3772C] focus:ring-2 focus:ring-[#A3772C]/15 focus:outline-none transition-all duration-200"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8275] pointer-events-none">
                      <Mail className="w-4 h-4 stroke-[1.8]" />
                    </span>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#FAF5ED]/85 border border-[#DFD3BD]/75 rounded-xl pl-10 pr-4 py-3 text-[13px] font-sora text-charcoal-800 placeholder:text-[#8C8275]/70 focus:bg-white focus:border-[#A3772C] focus:ring-2 focus:ring-[#A3772C]/15 focus:outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Row 2: Custom Project Type / Service Dropdown */}
                <div className={`relative ${isDropdownOpen ? 'z-40' : 'z-10'}`} ref={dropdownRef}>
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8275] pointer-events-none z-10">
                    <LayoutGrid className="w-4 h-4 stroke-[1.8]" />
                  </span>
                  
                  <button
                    type="button"
                    id="project-type-dropdown-trigger"
                    aria-haspopup="listbox"
                    aria-expanded={isDropdownOpen}
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    onKeyDown={handleDropdownKeyDown}
                    className={`w-full rounded-xl pl-10 pr-10 py-3 text-[13px] font-sora text-left flex items-center justify-between transition-all duration-200 cursor-pointer border ${
                      isDropdownOpen
                        ? 'bg-[#FFFFFF] border-[#A3772C] ring-2 ring-[#A3772C]/15 shadow-[0_2px_8px_rgba(163,119,44,0.08)]'
                        : 'bg-[#FAF5ED]/85 border-[#DFD3BD]/75 hover:border-[#C8B89E] hover:bg-[#FDF9F2]'
                    }`}
                  >
                    <span className={formData.projectType ? 'text-[#1F1F1F] font-medium' : 'text-[#8C8275]/80 font-normal'}>
                      {formData.projectType || 'Project Type / Service'}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 stroke-[2] transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180 text-[#A3772C]' : 'text-[#8C8275]'
                      }`}
                    />
                  </button>

                  {/* Custom Dropdown Menu Panel (Completely 100% Opaque Warm Cream, High Elevation) */}
                  <div
                    role="listbox"
                    aria-label="Project Type or Service"
                    style={{
                      backgroundColor: '#FCF5EB',
                      border: '1px solid rgba(164, 119, 44, 0.22)',
                      boxShadow: '0 20px 48px rgba(50, 35, 15, 0.16), 0 4px 14px rgba(50, 35, 15, 0.08)',
                    }}
                    className={`absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-[16px] p-2 transition-all duration-200 ease-out origin-top overflow-hidden bg-[#FCF5EB] ${
                      isDropdownOpen
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 scale-[0.98] -translate-y-1 pointer-events-none'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      {PROJECT_TYPES.map((type, idx) => {
                        const isDefaultOption = type === 'Project Type / Service';
                        const isSelected = isDefaultOption
                          ? formData.projectType === ''
                          : formData.projectType === type;
                        const isFocused = focusedIndex === idx;

                        return (
                          <button
                            key={type}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => handleSelectProjectType(type)}
                            onMouseEnter={() => setFocusedIndex(idx)}
                            className={`w-full px-3.5 py-2.5 rounded-xl text-left font-sora text-[12.5px] sm:text-[13px] transition-colors duration-150 flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-[#EFE2CF] text-[#141414] font-semibold'
                                : isFocused
                                ? 'bg-[#F5EAD9] text-[#141414]'
                                : 'text-[#2D261E] hover:bg-[#F5EAD9] hover:text-[#141414]'
                            }`}
                          >
                            <span className={isDefaultOption ? 'italic text-[#6B5F50]' : ''}>
                              {type}
                            </span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-[#A3772C] stroke-[2.5]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Row 3: Message Textarea */}
                <div className="relative z-0">
                  <span className="absolute left-3.5 top-3.5 text-[#8C8275] pointer-events-none">
                    <PenLine className="w-4 h-4 stroke-[1.8]" />
                  </span>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Tell me about your project..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#FAF5ED]/85 border border-[#DFD3BD]/75 rounded-xl pl-10 pr-4 py-3 text-[13px] font-sora text-charcoal-800 placeholder:text-[#8C8275]/70 focus:bg-white focus:border-[#A3772C] focus:ring-2 focus:ring-[#A3772C]/15 focus:outline-none transition-all duration-200 resize-none min-h-[110px]"
                  />
                </div>

                {/* Submit Button: Warm Gold */}
                <button
                  type="submit"
                  className="w-full bg-[#A2762C] hover:bg-[#8F6623] active:scale-[0.99] text-white py-3.5 sm:py-4 rounded-xl font-sora text-xs sm:text-[12.5px] tracking-[0.15em] font-semibold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(158,116,44,0.25)] hover:shadow-[0_6px_22px_rgba(158,116,44,0.35)] transition-all duration-300 group mt-1 cursor-pointer"
                >
                  <span>SEND MESSAGE</span>
                  <span className="text-base leading-none group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300">
                    ↗
                  </span>
                </button>

                {/* Submission Success Toast Feedback */}
                {isSubmitted && (
                  <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[#FAF3E8] border border-[#A3772C]/40 text-[#A3772C] text-xs font-sora animate-fade-in">
                    <CheckCircle className="w-4 h-4" />
                    <span>Your inquiry has been prepared in your email client!</span>
                  </div>
                )}

                {/* Privacy Assurance Statement */}
                <div className="flex items-center justify-center gap-1.5 mt-1.5 text-[#7A7265] text-xs font-sora">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A2762C]" />
                  <span>Your information is safe with me.</span>
                </div>

              </form>
            </div>
          </div>

        </div>

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* LOWER CENTER: FLOATING EDITORIAL SIGNATURE LOCKUP */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        <div className="mt-14 sm:mt-18 lg:mt-22 mb-4 sm:mb-6 flex justify-center relative z-10 px-4">
          <div
            ref={quoteCardRef}
            className="relative w-full max-w-[860px] flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-7 lg:gap-9 px-4 sm:px-6 py-2"
          >
            {/* Localized subtle warm elliptical atmospheric glow behind the composition for contrast protection */}
            <div
              className="absolute inset-x-[-8%] sm:inset-x-[-15%] -inset-y-8 sm:-inset-y-12 pointer-events-none -z-10 select-none"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(255, 248, 237, 0.82) 0%, rgba(255, 248, 237, 0.45) 38%, rgba(255, 248, 237, 0.0) 72%)',
              }}
              aria-hidden="true"
            />

            {/* LEFT & CENTER: Gold Quotation Mark + Dark Editorial Quote */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 lg:gap-5 flex-1 text-center sm:text-left justify-center sm:justify-start">
              {/* Large subtle gold quotation mark */}
              <span
                ref={quoteMarkRef}
                className="font-playfair text-[38px] sm:text-[46px] lg:text-[52px] text-[#A3772C] font-bold leading-none select-none shrink-0 sm:-mt-2 drop-shadow-[0_1px_1px_rgba(163,119,44,0.15)]"
                aria-hidden="true"
              >
                “
              </span>

              {/* The quote in dark charcoal serif */}
              <p
                ref={quoteTextRef}
                className="font-playfair italic text-[16px] sm:text-[19px] lg:text-[22px] font-medium text-[#1A1A1A] leading-[1.35] tracking-[-0.01em]"
              >
                Good design is not just what it looks like,
                <br className="hidden sm:inline" /> it’s how it works.
              </p>
            </div>

            {/* DIVIDER: Subtle vertical line on desktop/tablet, horizontal on mobile */}
            <div
              ref={quoteDividerRef}
              className="hidden sm:block w-[1px] h-[48px] lg:h-[54px] bg-gradient-to-b from-transparent via-[#A3772C]/40 to-transparent shrink-0"
              aria-hidden="true"
            />
            <div
              className="sm:hidden w-12 h-[1px] bg-gradient-to-r from-transparent via-[#A3772C]/40 to-transparent my-0.5"
              aria-hidden="true"
            />

            {/* RIGHT: Real existing Arpit signature asset + High-contrast CREATIVE DESIGNER */}
            <div
              ref={signatureWrapRef}
              className="flex flex-col items-center sm:items-start shrink-0 select-none"
            >
              <img
                src="/assets/arpit-ak-sign.webp"
                alt="Arpit AK"
                loading="lazy"
                decoding="async"
                className="h-9 sm:h-10 lg:h-11 w-auto object-contain select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                draggable={false}
              />
              <span className="font-sora text-[10px] sm:text-[10.5px] lg:text-[11px] font-semibold text-[#1A1A1A] uppercase tracking-[0.18em] mt-1 text-center sm:text-left">
                CREATIVE DESIGNER
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
