import React from 'react';
import { motion } from 'framer-motion';

export default function PersonalBrandMoment() {
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 24 },
    visible: (customDelay: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        delay: customDelay,
        ease: [0.16, 1, 0.3, 1],
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

        {/* Core Manifesto Reflection */}
        <motion.h2
          custom={0.06}
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="font-playfair text-[clamp(1.75rem,3.6vw,2.7rem)] font-normal italic text-[#2D241B] leading-[1.25] tracking-tight max-w-[660px] mb-8 sm:mb-10 lg:mb-12"
        >
          &ldquo;You saw my work. Now you know how I think.&rdquo;
        </motion.h2>

        {/* Sculpted Signature Card Container */}
        <div className="relative flex flex-col items-center">

          {/* Subtle Golden Diamond / Star Accent */}
          <motion.div
            custom={0.20}
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="flex items-center justify-center mb-3 sm:mb-4"
          >
            <span className="text-[#C4943A] text-xs select-none">✦</span>
          </motion.div>

          {/* Monolithic Name Typographic Statement */}
          <motion.div
            custom={0.26}
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative"
          >
            <h2 className="font-playfair font-bold text-[clamp(3.3rem,8.8vw,6.4rem)] text-[#1A1A1A] leading-[0.94] tracking-[-0.025em] mb-2 sm:mb-3">
              ARPIT AK<span className="text-[#C4943A]">.</span>
            </h2>
          </motion.div>

          {/* Handwritten Signature Asset */}
          <motion.div
            custom={0.34}
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative -mt-3 sm:-mt-4 lg:-mt-5 mb-2 select-none pointer-events-none"
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

          {/* Professional Dual Specialization Badges */}
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

          {/* Closing Philosophy Tagline */}
          <motion.p
            custom={0.48}
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="font-playfair italic text-xs sm:text-sm text-[#827566] tracking-wide max-w-[420px] mx-auto text-balance"
          >
            “Turning ideas into visuals worth remembering.”
          </motion.p>
        </div>

        {/* Continuation cue toward Contact */}
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
