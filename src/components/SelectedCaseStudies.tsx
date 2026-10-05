import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { digitalProjects, DigitalProject } from '../data/portfolio';

// Select the 2 flagship distinct client & product projects with dedicated case studies:
// 1. ImageMint (Web Application / Utility & Product Design)
// 2. Yogesh Naharwara (Client Interface & Framer Development)
const selectedSlugs = ['imagemint', 'yogesh-naharwara'];

interface SelectedProjectItem {
  project: DigitalProject;
  indexFormatted: string;
  discipline: string;
  shortDescription: string;
  tags: string[];
}

const selectedCaseStudies: SelectedProjectItem[] = selectedSlugs
  .map((slug, idx) => {
    const proj = digitalProjects.find((p) => p.slug === slug);
    if (!proj) return null;

    // Use authentic existing descriptions from caseStudy data
    const shortDesc =
      proj.caseStudy?.summary ||
      proj.description ||
      'A closer look at the ideas, decisions and design behind the work.';

    const discipline =
      proj.slug === 'imagemint'
        ? 'Product Design & Web Utility'
        : 'Interface Design & Framer Development';

    const tags = proj.caseStudy?.services || (proj.tools ? proj.tools.slice(0, 3) : []);

    return {
      project: proj,
      indexFormatted: `0${idx + 1}`,
      discipline,
      shortDescription: shortDesc,
      tags,
    };
  })
  .filter((item): item is SelectedProjectItem => item !== null);

export default function SelectedCaseStudies() {
  const shouldReduceMotion = useReducedMotion();

  // Lightweight reveal animation (pure opacity & subtle transform)
  const fadeUpVariant = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
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
      id="case-studies"
      aria-label="Selected Case Studies"
      className="relative w-full bg-[#FAF3E8] pt-20 sm:pt-24 lg:pt-28 xl:pt-32 pb-24 sm:pb-28 lg:pb-32 overflow-hidden select-none scroll-mt-24"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. BACKGROUND ATMOSPHERE (Consistent warm paper & light glow)
          ───────────────────────────────────────────────────────────── */}
      {/* Soft ambient golden warmth in center-right */}
      <div
        className="absolute top-[20%] right-[-8%] w-[520px] lg:w-[680px] h-[520px] lg:h-[680px] rounded-full pointer-events-none opacity-25"
        style={{
          background:
            'radial-gradient(circle, rgba(246, 215, 178, 0.45) 0%, rgba(250, 243, 232, 0.06) 55%, transparent 75%)',
          filter: 'blur(65px)',
        }}
      />

      {/* Soft ambient warmth in lower-left */}
      <div
        className="absolute bottom-[10%] left-[-6%] w-[460px] lg:w-[580px] h-[460px] lg:h-[580px] rounded-full pointer-events-none opacity-20"
        style={{
          background:
            'radial-gradient(circle, rgba(246, 215, 178, 0.38) 0%, rgba(250, 243, 232, 0.05) 50%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />


      {/* ─────────────────────────────────────────────────────────────
          2. MAIN EDITORIAL CONTENT
          ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-16">
        
        {/* ═══════════════════════════════════════════════════════════
            SECTION HEADER
            ═══════════════════════════════════════════════════════════ */}
        <div className="flex flex-col items-start mb-14 sm:mb-18 lg:mb-20">
          {/* Eyebrow & Gold Accent */}
          <motion.div
            custom={0}
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="flex items-center gap-3 mb-4 sm:mb-5"
          >
            <span className="font-sora text-[10.5px] sm:text-[11.5px] uppercase tracking-[0.24em] font-semibold text-[#B8860B]">
              CURATED PROOF
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
            className="font-playfair text-[clamp(2.4rem,5.2vw,4.2rem)] font-bold text-[#1A1A1A] leading-[1.02] tracking-tight"
          >
            SELECTED<br />
            CASE STUDIES<span className="text-[#C4943A]">.</span>
          </motion.h2>

          {/* Supporting line */}
          <motion.p
            custom={0.16}
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="font-sora text-[14px] sm:text-[15px] lg:text-[15.5px] text-[#554A3E] mt-3.5 max-w-[540px] leading-relaxed"
          >
            A closer look at the ideas, decisions and design behind the work.
          </motion.p>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            EDITORIAL CASE STUDY ROWS
            Each row presents:
            - Left: Number, Title, Discipline, Summary, Tags, View CTA
            - Right: Large Project Visual Preview
            ═══════════════════════════════════════════════════════════ */}
        <div className="flex flex-col divide-y divide-[#E3D6C5]">
          {selectedCaseStudies.map((item, index) => {
            const { project, indexFormatted, discipline, shortDescription, tags } = item;

            return (
              <motion.article
                key={project.id}
                custom={0.12 + index * 0.08}
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="group relative py-12 sm:py-16 lg:py-20 first:pt-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 sm:gap-10 lg:gap-14 xl:gap-20">
                  
                  {/* ─────────────────────────────────────────────────
                      LEFT COLUMN: Project Information & Narrative
                      ───────────────────────────────────────────────── */}
                  <div className="w-full lg:w-[44%] xl:w-[42%] flex flex-col items-start order-2 lg:order-1">
                    
                    {/* Numbering & Category */}
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <span className="font-sora text-[12px] sm:text-[13px] font-bold text-[#B8860B] tracking-[0.16em]">
                        {indexFormatted}
                      </span>
                      <span className="text-[#C4943A]/60 text-[11px] select-none">—</span>
                      <span className="font-sora text-[11px] sm:text-[11.5px] uppercase tracking-[0.18em] font-semibold text-[#8C7E70]">
                        {discipline}
                      </span>
                    </div>

                    {/* Project Title */}
                    <h3 className="font-playfair text-[clamp(1.85rem,3.2vw,2.65rem)] font-bold text-[#1A1A1A] leading-[1.08] tracking-tight mb-3 group-hover:text-[#B8860B] transition-colors duration-300">
                      <Link
                        to={`/work/${project.slug}`}
                        className="hover:underline decoration-[#C4943A]/40 decoration-1 underline-offset-4"
                      >
                        {project.title}
                      </Link>
                    </h3>

                    {/* Project One-Sentence Description */}
                    <p className="font-sora text-[13.5px] sm:text-[14px] lg:text-[14.5px] text-[#554A3E] leading-[1.7] max-w-[460px] mb-5 sm:mb-6">
                      {shortDescription}
                    </p>

                    {/* Services / Tags Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-7 sm:mb-8">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-md bg-[#FAF0E4] border border-[#E5C89C]/40 text-[#6B5D4E] font-sora text-[10.5px] font-medium tracking-wide uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Clear CTA to Case Study Page */}
                    <Link
                      to={`/work/${project.slug}`}
                      className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-full bg-[#1A1A1A] hover:bg-[#B8860B] text-[#FAF3E8] text-[11.5px] sm:text-[12px] font-sora font-semibold tracking-[0.14em] uppercase transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <span>VIEW CASE STUDY</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#E5C89C] transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>

                  {/* ─────────────────────────────────────────────────
                      RIGHT COLUMN: Large Visual Preview
                      ───────────────────────────────────────────────── */}
                  <div className="w-full lg:w-[56%] xl:w-[58%] order-1 lg:order-2">
                    <Link
                      to={`/work/${project.slug}`}
                      className="group/img block relative w-full aspect-[16/10] overflow-hidden rounded-xl bg-[#FAF0E4] border border-[#E3D6C5]/90 shadow-[0_4px_24px_-6px_rgba(45,38,30,0.07)] hover:shadow-[0_14px_40px_-8px_rgba(45,38,30,0.14)] transition-all duration-500 cursor-pointer"
                      title={`Open ${project.title} Case Study`}
                    >
                      <img
                        src={project.previewImage}
                        alt={`${project.title} Preview`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top transform group-hover/img:scale-[1.02] transition-transform duration-700 ease-out"
                      />

                      {/* Subtle hover gradient depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      {/* Floating Case Study explore badge */}
                      <div className="absolute bottom-3.5 right-3.5 sm:bottom-4 sm:right-4 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/92 backdrop-blur-md border border-white/70 text-[10.5px] sm:text-[11px] font-sora font-semibold tracking-wider text-[#1A1A1A] uppercase shadow-xs flex items-center gap-1.5 transform group-hover/img:translate-y-[-2px] transition-transform duration-300">
                        <span>CASE STUDY</span>
                        <ArrowUpRight className="w-3 h-3 text-[#B8860B]" />
                      </div>
                    </Link>
                  </div>

                </div>
              </motion.article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
