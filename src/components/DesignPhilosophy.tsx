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
      className="relative w-full bg-[#141312] text-[#FAF7F2] pt-28 sm:pt-32 lg:pt-36 pb-28 sm:pb-32 lg:pb-36 overflow-hidden select-none scroll-mt-24"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. TOP & BOTTOM ATMOSPHERIC TRANSITION FEATHERING
          ───────────────────────────────────────────────────────────── */}
      {/* Top feathering from About (warm cream) into dark chamber */}
      <div
        className="absolute top-0 inset-x-0 h-28 sm:h-36 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, #FAF3E8 0%, rgba(20, 19, 18, 0.75) 60%, transparent 100%)',
        }}
      />

      {/* Ambient warm amber/terracotta chamber glow in upper-left */}
      <div
        className="absolute top-1/4 left-[-10%] w-[540px] lg:w-[680px] h-[540px] lg:h-[680px] rounded-full pointer-events-none opacity-20"
        style={{
          background:
            'radial-gradient(circle, rgba(212, 115, 67, 0.4) 0%, rgba(184, 134, 11, 0.12) 45%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Ambient warm amber glow in lower-right */}
      <div
        className="absolute bottom-1/4 right-[-8%] w-[480px] lg:w-[600px] h-[480px] lg:h-[600px] rounded-full pointer-events-none opacity-15"
        style={{
          background:
            'radial-gradient(circle, rgba(184, 134, 11, 0.35) 0%, rgba(20, 19, 18, 0.10) 50%, transparent 70%)',
          filter: 'blur(75px)',
        }}
      />

      {/* Bottom feathering from dark chamber into Case Studies (warm monograph) */}
      <div
        className="absolute bottom-0 inset-x-0 h-28 sm:h-36 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to top, #FAF6F0 0%, rgba(20, 19, 18, 0.75) 60%, transparent 100%)',
        }}
      />

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN EDITORIAL COMPOSITION
          ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-16 xl:gap-20">
          
          {/* ═══════════════════════════════════════════════════════════
              LEFT COLUMN: Editorial Headline & Manifesto
              ═══════════════════════════════════════════════════════════ */}
          <div className="w-full lg:w-[42%] xl:w-[38%] shrink-0 flex flex-col items-start">
            {/* Section Headline */}
            <motion.h2
              custom={0.04}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="font-playfair text-[clamp(2.85rem,6vw,5rem)] font-bold text-[#FAF7F2] leading-[0.94] tracking-tight mb-8 sm:mb-10"
            >
              HOW<br />
              I THINK<span className="text-[#D4A94E]">.</span>
            </motion.h2>

            {/* Core Visual Statement Quote */}
            <motion.div
              custom={0.12}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="relative pl-5 sm:pl-6 border-l-2 border-[#D4A94E] max-w-[440px]"
            >
              <blockquote className="font-playfair italic text-[clamp(1.22rem,1.9vw,1.55rem)] text-[#C7BEB2] leading-[1.45] font-normal">
                &ldquo;I don't just make things look good.
                <span className="block mt-2.5 font-semibold text-[#FAF7F2] not-italic">
                  I make them feel impossible to ignore.&rdquo;
                </span>
              </blockquote>
            </motion.div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              RIGHT COLUMN: Four Editorial Principles
              ═══════════════════════════════════════════════════════════ */}
          <div className="w-full lg:w-[58%] xl:w-[62%] flex-1 pt-2 lg:pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-9 sm:gap-y-12 sm:gap-x-10 lg:gap-x-12 xl:gap-x-14">
              {principles.map((principle, index) => (
                <motion.div
                  key={principle.number}
                  custom={0.14 + index * 0.08}
                  variants={fadeUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                  className="group relative flex flex-col pt-6 sm:pt-7 pb-2 border-t border-[#2C2824]"
                >
                  {/* Subtle gold indicator on hover */}
                  <div className="absolute top-0 left-0 w-8 h-[2px] bg-transparent group-hover:bg-[#D4A94E] transition-colors duration-300" />

                  {/* Header: Clean Number & Title */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-sora text-xs font-bold text-[#D4A94E] tracking-[0.2em]">
                      {principle.number}
                    </span>
                    <span className="text-[#D4A94E]/40 text-xs select-none">—</span>
                    <h3 className="font-sora text-[15px] sm:text-[16px] font-bold uppercase tracking-[0.1em] text-[#FAF7F2] group-hover:text-[#D4A94E] transition-colors duration-300">
                      {principle.title}
                    </h3>
                  </div>

                  {/* Principle Description */}
                  <p className="font-sora text-[13.5px] sm:text-[14px] leading-[1.7] text-[#A89F94]">
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
