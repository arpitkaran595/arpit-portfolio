import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface PrincipleItem {
  number: string;
  fraction: string;
  title: string;
  description: string;
}

const principles: PrincipleItem[] = [
  {
    number: '01',
    fraction: '01/04',
    title: 'UNDERSTAND',
    description: 'Before designing, I understand the idea, audience and purpose behind it.',
  },
  {
    number: '02',
    fraction: '02/04',
    title: 'SIMPLIFY',
    description: 'I turn complex ideas into clear visual stories that people can understand quickly.',
  },
  {
    number: '03',
    fraction: '03/04',
    title: 'DESIGN',
    description: 'Typography, composition, hierarchy and visual details work together to create the right feeling.',
  },
  {
    number: '04',
    fraction: '04/04',
    title: 'IMPACT',
    description: 'A design should do more than look good. It should be remembered, understood and acted on.',
  },
];

export default function DesignPhilosophy() {
  const shouldReduceMotion = useReducedMotion();

  // Lightweight reveal animations (pure opacity & slight Y translation)
  const fadeUpVariant = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    visible: (customDelay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.65,
        delay: shouldReduceMotion ? 0 : customDelay,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section
      id="philosophy"
      aria-label="Design Philosophy"
      className="relative w-full bg-[#FAF3E8] pt-24 sm:pt-26 lg:pt-28 xl:pt-32 pb-20 sm:pb-24 lg:pb-28 xl:pb-32 overflow-hidden select-none scroll-mt-24"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. BACKGROUND ATMOSPHERE (Ultra-subtle, preserves breathing room)
          ───────────────────────────────────────────────────────────── */}
      {/* Faint ambient golden warmth in upper-right */}
      <div
        className="absolute -top-24 right-[-5%] w-[480px] lg:w-[620px] h-[480px] lg:h-[620px] rounded-full pointer-events-none opacity-30"
        style={{
          background:
            'radial-gradient(circle, rgba(246, 215, 178, 0.45) 0%, rgba(250, 243, 232, 0.08) 50%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Faint ambient warmth in lower-left */}
      <div
        className="absolute -bottom-24 left-[-6%] w-[420px] lg:w-[540px] h-[420px] lg:h-[540px] rounded-full pointer-events-none opacity-25"
        style={{
          background:
            'radial-gradient(circle, rgba(246, 215, 178, 0.38) 0%, rgba(250, 243, 232, 0.05) 50%, transparent 70%)',
          filter: 'blur(55px)',
        }}
      />


      {/* ─────────────────────────────────────────────────────────────
          2. MAIN EDITORIAL COMPOSITION
          ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-16 xl:gap-20">
          
          {/* ═══════════════════════════════════════════════════════════
              LEFT COLUMN: Eyebrow + Headline + Core Manifesto Statement
              ═══════════════════════════════════════════════════════════ */}
          <div className="w-full lg:w-[42%] xl:w-[38%] shrink-0 flex flex-col items-start">
            
            {/* Eyebrow & Gold Accent Rule */}
            <motion.div
              custom={0}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="flex items-center gap-3 mb-4 sm:mb-5"
            >
              <span className="font-sora text-[10.5px] sm:text-[11.5px] uppercase tracking-[0.24em] font-semibold text-[#B8860B]">
                DESIGN PHILOSOPHY
              </span>
              <div className="w-8 sm:w-10 h-[1.5px] bg-[#C4943A]" />
            </motion.div>

            {/* Section Headline */}
            <motion.h2
              custom={0.08}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="font-playfair text-[clamp(2.5rem,5.6vw,4.5rem)] font-bold text-[#1A1A1A] leading-[0.98] tracking-tight mb-6 sm:mb-8"
            >
              HOW<br />
              I THINK<span className="text-[#C4943A]">.</span>
            </motion.h2>

            {/* Core Visual Statement Quote */}
            <motion.div
              custom={0.16}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="relative pl-5 sm:pl-6 border-l-[1.5px] border-[#C4943A]/50 max-w-[440px]"
            >
              <blockquote className="font-playfair italic text-[clamp(1.15rem,1.75vw,1.42rem)] text-[#2A241E] leading-[1.42] font-normal">
                &ldquo;I don't just make things look good.
                <span className="block mt-1.5 font-semibold text-[#1A1A1A] not-italic">
                  I make them feel impossible to ignore.&rdquo;
                </span>
              </blockquote>
              <div className="mt-3.5 flex items-center gap-2.5">
                <span className="w-4 h-[1px] bg-[#C4943A]/50" />
                <span className="font-sora text-[10px] sm:text-[10.5px] uppercase tracking-[0.2em] text-[#8C7E70] font-medium">
                  Core Manifesto
                </span>
              </div>
            </motion.div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              RIGHT COLUMN: Four Editorial Principles
              - Desktop (lg+): Refined 2x2 editorial grid
              - Tablet (sm/md): Balanced 2-column grid
              - Mobile (<sm): Vertical editorial stack
              ═══════════════════════════════════════════════════════════ */}
          <div className="w-full lg:w-[58%] xl:w-[62%] flex-1">
            
            {/* Subtle editorial column header */}
            <motion.div
              custom={0.12}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="hidden sm:flex items-center justify-between pb-3.5 mb-2"
            >
              <span className="font-sora text-[10.5px] uppercase tracking-[0.22em] font-semibold text-[#7E7062]">
                GUIDING PILLARS
              </span>
              <span className="font-sora text-[10px] uppercase tracking-[0.18em] text-[#A69787]">
                01 &mdash; 04 / PROCESS
              </span>
            </motion.div>

            {/* Principles Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-7 sm:gap-y-10 sm:gap-x-10 lg:gap-x-12 xl:gap-x-14">
              {principles.map((principle, index) => (
                <motion.div
                  key={principle.number}
                  custom={0.18 + index * 0.08}
                  variants={fadeUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                  className="group relative flex flex-col pt-5 sm:pt-6 pb-2 border-t border-[#E3D6C5]"
                >
                  {/* Subtle gold indicator on hover */}
                  <div className="absolute top-0 left-0 w-8 h-[1.5px] bg-transparent group-hover:bg-[#C4943A] transition-colors duration-400" />

                  {/* Header: Number & Tiny Section Numbering */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-baseline gap-2">
                      <span className="font-sora text-[12px] sm:text-[12.5px] font-semibold text-[#B8860B] tracking-[0.16em]">
                        {principle.number}
                      </span>
                      <span className="text-[#C4943A]/50 text-[11px] select-none">—</span>
                      <h3 className="font-sora text-[14.5px] sm:text-[15.5px] lg:text-[16px] font-bold uppercase tracking-[0.08em] text-[#1A1A1A] group-hover:text-[#B8860B] transition-colors duration-300">
                        {principle.title}
                      </h3>
                    </div>
                    <span className="font-sora text-[9.5px] uppercase tracking-[0.16em] text-[#A69787]">
                      [{principle.fraction}]
                    </span>
                  </div>

                  {/* Principle Description */}
                  <p className="font-sora text-[13px] sm:text-[13.5px] lg:text-[14px] leading-[1.68] text-[#554A3E]">
                    {principle.description}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
