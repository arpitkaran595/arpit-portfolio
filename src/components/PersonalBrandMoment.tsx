import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function PersonalBrandMoment() {
  const shouldReduceMotion = useReducedMotion();

  // Lightweight reveal animation (pure opacity & subtle transform)
  const fadeUpVariant = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20,
      scale: shouldReduceMotion ? 1 : 0.99,
    },
    visible: (customDelay: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.7,
        delay: shouldReduceMotion ? 0 : customDelay,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section
      id="personal-brand"
      aria-label="One Last Thing — Personal Signature"
      className="relative w-full bg-[#FAF3E8] py-20 sm:py-24 lg:py-28 xl:py-32 overflow-hidden select-none scroll-mt-24"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. BACKGROUND ATMOSPHERE (Clean paper with soft ambient warmth)
          ───────────────────────────────────────────────────────────── */}
      {/* Central soft golden-peach ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] sm:w-[720px] h-[340px] sm:h-[420px] rounded-full pointer-events-none opacity-20"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(246, 215, 178, 0.5) 0%, rgba(250, 243, 232, 0.08) 55%, transparent 75%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Subtle tactile paper texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage: 'url(/assets/paper-texture.webp)',
          backgroundRepeat: 'repeat',
          backgroundSize: '400px 400px',
        }}
      />

      {/* ─────────────────────────────────────────────────────────────
          2. EDITORIAL BRAND MOMENT COMPOSITION
          ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-[980px] mx-auto px-5 sm:px-8 text-center flex flex-col items-center">
        
        {/* Eyebrow with flanking gold hairline rules */}
        <motion.div
          custom={0}
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex items-center justify-center gap-3 mb-6 sm:mb-8"
        >
          <div className="w-6 sm:w-10 h-[1.5px] bg-[#C4943A]/50" />
          <span className="font-sora text-[10.5px] sm:text-[11.5px] uppercase tracking-[0.24em] font-semibold text-[#B8860B]">
            ONE LAST THING.
          </span>
          <div className="w-6 sm:w-10 h-[1.5px] bg-[#C4943A]/50" />
        </motion.div>

        {/* Core Manifesto Reflection */}
        <motion.h2
          custom={0.10}
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="font-playfair text-[clamp(1.65rem,3.4vw,2.55rem)] font-normal italic text-[#2D241B] leading-[1.25] tracking-tight max-w-[620px] mb-8 sm:mb-10 lg:mb-12"
        >
          “You saw my work.<br className="hidden xs:inline" />
          Now you know how I think.”
        </motion.h2>

        {/* Small gold diamond separator */}
        <motion.div
          custom={0.18}
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex items-center justify-center gap-3 mb-8 sm:mb-10 lg:mb-12"
        >
          <div className="w-12 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#D6C2A5]/70" />
          <span className="text-[#B8860B] text-xs select-none">✦</span>
          <div className="w-12 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#D6C2A5]/70" />
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            THE PERSONAL SIGNATURE LOCKUP (Focal Point)
            ═══════════════════════════════════════════════════════════ */}
        <div className="flex flex-col items-center">
          {/* Main Name: ARPIT AK */}
          <motion.div
            custom={0.26}
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative"
          >
            <h3 className="font-playfair font-bold text-[clamp(3.3rem,8.8vw,6.4rem)] text-[#1A1A1A] leading-[0.94] tracking-[-0.025em] mb-2 sm:mb-3">
              ARPIT AK<span className="text-[#C4943A]">.</span>
            </h3>
          </motion.div>

          {/* Real Handwritten Signature Asset */}
          <motion.div
            custom={0.34}
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative my-2 sm:my-3 select-none"
          >
            <img
              src="/assets/arpit-ak-sign.webp"
              alt="Arpit AK Signature"
              loading="lazy"
              decoding="async"
              className="h-10 sm:h-12 lg:h-14 w-auto object-contain drop-shadow-[0_2px_6px_rgba(45,30,20,0.06)]"
              draggable={false}
            />
          </motion.div>

          {/* Supporting Discipline Identity */}
          <motion.div
            custom={0.42}
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center mt-3 mb-4"
          >
            <span className="font-sora text-[11px] sm:text-[12px] uppercase tracking-[0.24em] font-semibold text-[#6E6152]">
              GRAPHIC DESIGNER
            </span>
            <span className="text-[#C4943A]/60 text-[10px] select-none">•</span>
            <span className="font-sora text-[11px] sm:text-[12px] uppercase tracking-[0.24em] font-semibold text-[#6E6152]">
              VISUAL STORYTELLER
            </span>
          </motion.div>

          {/* Optional small supporting line */}
          <motion.p
            custom={0.48}
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="font-sora text-[12.5px] sm:text-[13.5px] text-[#827566] italic leading-relaxed max-w-[420px]"
          >
            “Turning ideas into visuals worth remembering.”
          </motion.p>
        </div>

        {/* Delicate continuation cue toward Contact */}
        <motion.div
          custom={0.54}
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-12 sm:mt-14 lg:mt-16"
        >
          <a
            href="#contact"
            onClick={(e) => {
              const target = document.getElementById('contact');
              if (target && (window as any).lenis) {
                e.preventDefault();
                (window as any).lenis.scrollTo(target, { offset: -75, duration: 1.2 });
              }
            }}
            className="inline-flex flex-col items-center gap-1.5 text-[#A3927D] hover:text-[#B8860B] transition-colors duration-300 group cursor-pointer"
            aria-label="Continue to Contact"
          >
            <span className="font-sora text-[9.5px] sm:text-[10px] uppercase tracking-[0.22em] font-semibold">
              LET’S CONNECT
            </span>
            <svg
              className="w-3.5 h-3.5 transform group-hover:translate-y-1 transition-transform duration-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
