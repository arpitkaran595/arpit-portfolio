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
      className="relative w-full bg-[#0F0E10] text-[#FAF7F2] py-28 sm:py-32 lg:py-36 xl:py-40 overflow-hidden select-none scroll-mt-24"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. TOP & BOTTOM ATMOSPHERIC TRANSITION FEATHERING
          ───────────────────────────────────────────────────────────── */}
      {/* Top feathering from Experience (dawn clouds) into Velvet Noir */}
      <div
        className="absolute top-0 inset-x-0 h-28 sm:h-36 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, #FBF5EB 0%, rgba(15, 14, 16, 0.75) 60%, transparent 100%)',
        }}
      />

      {/* Central soft golden ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] sm:w-[720px] h-[340px] sm:h-[420px] rounded-full pointer-events-none opacity-15"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(212, 169, 78, 0.45) 0%, rgba(15, 14, 16, 0.05) 60%, transparent 80%)',
          filter: 'blur(75px)',
        }}
      />

      {/* Subtle tactile paper texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: 'url(/assets/paper-texture.webp)',
          backgroundRepeat: 'repeat',
          backgroundSize: '400px 400px',
        }}
      />

      {/* Bottom feathering from Velvet Noir into Contact (warm terracotta sand) */}
      <div
        className="absolute bottom-0 inset-x-0 h-28 sm:h-36 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to top, #F6EFE9 0%, rgba(15, 14, 16, 0.75) 60%, transparent 100%)',
        }}
      />

      {/* ─────────────────────────────────────────────────────────────
          2. EDITORIAL BRAND MOMENT COMPOSITION
          ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-[980px] mx-auto px-5 sm:px-8 text-center flex flex-col items-center">
        
        {/* Core Manifesto Reflection */}
        <motion.h2
          custom={0.06}
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="font-playfair text-[clamp(1.9rem,4vw,3rem)] font-normal italic text-[#FAF7F2] leading-[1.25] tracking-tight max-w-[640px] mb-8 sm:mb-10 lg:mb-12"
        >
          “You saw my work. <br className="hidden xs:inline" />
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
          <div className="w-12 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#D4A94E]/60" />
          <span className="text-[#D4A94E] text-xs select-none">✦</span>
          <div className="w-12 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#D4A94E]/60" />
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
            <h2 className="font-playfair font-bold text-[clamp(3.3rem,8.8vw,6.4rem)] text-[#FAF7F2] leading-[0.94] tracking-[-0.025em] mb-2 sm:mb-3">
              ARPIT AK<span className="text-[#D4A94E]">.</span>
            </h2>
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
              className="h-10 sm:h-12 lg:h-14 w-auto object-contain filter brightness-[1.9] contrast-[1.1] drop-shadow-[0_0_16px_rgba(212,169,78,0.3)]"
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
            <span className="font-sora text-[11px] sm:text-[12px] uppercase tracking-[0.24em] font-semibold text-[#A89F94]">
              GRAPHIC DESIGNER
            </span>
            <span className="text-[#D4A94E]/60 text-[10px] select-none">•</span>
            <span className="font-sora text-[11px] sm:text-[12px] uppercase tracking-[0.24em] font-semibold text-[#A89F94]">
              VISUAL STORYTELLER
            </span>
          </motion.div>

          {/* Closing Philosophy Tagline */}
          <motion.p
            custom={0.50}
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="font-playfair italic text-xs sm:text-sm text-[#D4A94E]/90 tracking-wide max-w-[420px] mx-auto text-balance"
          >
            “Turning ideas into visuals worth remembering.”
          </motion.p>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SEAMLESS SCROLL BRIDGE TO CONTACT
            ═══════════════════════════════════════════════════════════ */}
        <motion.div
          custom={0.58}
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-12 sm:mt-14 lg:mt-16 flex flex-col items-center gap-2"
        >
          <span className="font-sora text-[9.5px] uppercase tracking-[0.28em] font-medium text-[#7A7268]">
            LET’S CONNECT
          </span>
          <span className="text-[#D4A94E] text-xs">↓</span>
        </motion.div>

      </div>
    </section>
  );
}
