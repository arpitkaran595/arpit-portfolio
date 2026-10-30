import React from 'react';
import { motion } from 'framer-motion';

interface Principle {
  number: string;
  fraction: string;
  title: string;
  description: string;
}

const principles: Principle[] = [
  {
    number: '01',
    fraction: '1/4',
    title: 'Clarity First',
    description:
      'If the viewer has to guess, the design failed. Every element has one job — communicate before it decorates.',
  },
  {
    number: '02',
    fraction: '2/4',
    title: 'Retention-Driven',
    description:
      'Pacing, contrast, and visual rhythm that hold attention. Designed for scroll-stopping first impressions.',
  },
  {
    number: '03',
    fraction: '3/4',
    title: 'Precision in Detail',
    description:
      'Micro-interactions, spatial hierarchy, typography scales. The small decisions create the premium feel.',
  },
  {
    number: '04',
    fraction: '4/4',
    title: 'Form Serves Story',
    description:
      'Visuals are not wallpaper. Every animation, cut, layout choice serves the underlying message.',
  },
];

export default function DesignPhilosophy() {
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 22 },
    visible: (customDelay: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: customDelay,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section
      id="philosophy"
      aria-label="Design Philosophy"
      className="relative w-full bg-[#FAF3E8] pt-24 sm:pt-28 lg:pt-32 pb-24 sm:pb-28 lg:pb-32 overflow-hidden select-none scroll-mt-24"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. BACKGROUND ATMOSPHERE (Warm ambient golden warmth)
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
              className="font-playfair text-[clamp(2.85rem,6vw,5rem)] font-bold text-[#1A1A1A] leading-[0.94] tracking-tight mb-8 sm:mb-10"
            >
              HOW<br />
              I THINK<span className="text-[#C4943A]">.</span>
            </motion.h2>

            {/* Core Visual Statement Quote */}
            <motion.div
              custom={0.12}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="relative pl-5 sm:pl-6 border-l-2 border-[#C4943A] max-w-[440px]"
            >
              <blockquote className="font-playfair italic text-[clamp(1.22rem,1.9vw,1.55rem)] text-[#4A4036] leading-[1.45] font-normal">
                &ldquo;I don't just make things look good.
                <span className="block mt-2.5 font-semibold text-[#1A1A1A] not-italic">
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
                  className="group relative flex flex-col pt-6 sm:pt-7 pb-2 border-t border-[#E3D6C5]"
                >
                  {/* Subtle gold indicator on hover */}
                  <div className="absolute top-0 left-0 w-8 h-[2px] bg-transparent group-hover:bg-[#C4943A] transition-colors duration-300" />

                  {/* Header: Clean Number & Title */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-sora text-xs font-bold text-[#B8860B] tracking-[0.2em]">
                      {principle.number}
                    </span>
                    <span className="text-[#C4943A]/40 text-xs select-none">—</span>
                    <h3 className="font-sora text-[15px] sm:text-[16px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] group-hover:text-[#B8860B] transition-colors duration-300">
                      {principle.title}
                    </h3>
                  </div>

                  {/* Principle Description */}
                  <p className="font-sora text-[13.5px] sm:text-[14px] leading-[1.7] text-[#554A3E]">
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
