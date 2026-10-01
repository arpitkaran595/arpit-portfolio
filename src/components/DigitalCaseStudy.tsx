import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Compass,
  Target,
  Sparkles,
  Layers,
  Palette,
  Cpu,
  Monitor,
  Check,
} from 'lucide-react';
import { DigitalProject } from '../data/portfolio';

interface DigitalCaseStudyProps {
  project: DigitalProject;
  prevProject: DigitalProject;
  nextProject: DigitalProject;
  onSelectProject?: (index: number) => void;
  onOpenLiveModal?: () => void;
}

export default function DigitalCaseStudy({
  project,
  prevProject,
  nextProject,
  onSelectProject,
  onOpenLiveModal,
}: DigitalCaseStudyProps) {
  const caseStudy = project.caseStudy;
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  if (!caseStudy) return null;

  const handleCopyHex = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-24 text-charcoal-900 select-none">
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* TRANSITION DIVIDER: INTERACTIVE HERO -> CASE STUDY DOCUMENTARY   */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="relative w-full flex flex-col items-center justify-center mb-16 sm:mb-24">
        {/* Editorial Divider Hairline with Center Diamond */}
        <div className="relative w-full flex items-center justify-center my-6">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#B8860B]/35 to-transparent" />
          <div className="absolute w-3 h-3 rotate-45 bg-[#FAF4EC] border border-[#B8860B]/60 shadow-sm flex items-center justify-center">
            <div className="w-1 h-1 bg-[#7A1C28]" />
          </div>
        </div>

        {/* Documentary Eyebrow Badge */}
        <div className="flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-[#FAF4EC] border border-[#D4A94E]/40 shadow-xs mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7A1C28] animate-pulse" />
          <span className="text-[10.5px] sm:text-[11.5px] font-sora font-semibold tracking-[0.24em] text-[#9A7209] uppercase">
            CASE STUDY DOCUMENTARY • ARCHIVE NO. {project.index}
          </span>
        </div>

        {/* Narrative Section Subtitle */}
        <p className="font-sora text-[13px] sm:text-[14px] text-charcoal-500 tracking-[0.05em] text-center max-w-[520px]">
          A comprehensive design review examining the context, architecture, systems, and outcomes of{' '}
          <strong className="text-charcoal-900 font-semibold">{project.title}</strong>.
        </p>
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* CHAPTER 01 — THE PROJECT (EXECUTIVE CONTEXT & STATS)              */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="mb-20 sm:mb-28">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[11px] sm:text-[12px] font-sora font-bold tracking-[0.2em] text-[#7A1C28] uppercase">
            01 — THE PROJECT
          </span>
          <div className="h-[1px] flex-1 bg-[#D4A94E]/25" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <h3 className="font-playfair text-[28px] sm:text-[36px] lg:text-[40px] font-bold text-charcoal-900 leading-[1.15] mb-5 tracking-tight">
              {caseStudy.overview.statement}
            </h3>
            <p className="font-sora text-[15px] sm:text-[16px] text-charcoal-600 leading-relaxed font-normal">
              {caseStudy.overview.context}
            </p>
          </div>

          {/* Quick Metrics / Stats Cards */}
          {caseStudy.overview.stats && (
            <div className="lg:col-span-5 flex flex-col gap-3.5 pt-2">
              {caseStudy.overview.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl bg-white/80 border border-[#D4A94E]/30 shadow-xs hover:border-[#7A1C28]/40 transition-all duration-300"
                >
                  <div className="font-playfair text-[26px] sm:text-[32px] font-bold text-[#7A1C28] leading-none mb-1.5">
                    {stat.value}
                  </div>
                  <div className="font-sora text-[11px] sm:text-[12px] font-medium tracking-[0.14em] text-charcoal-500 uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* CHAPTER 02 & 03 — THE CHALLENGE & THE GOAL (COMPARISON SPREAD)     */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="mb-20 sm:mb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* THE CHALLENGE CARD */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF4EC]/90 border border-[#D4A94E]/35 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 text-[#7A1C28]">
                <Target className="w-4 h-4" />
                <span className="text-[11px] sm:text-[12px] font-sora font-bold tracking-[0.2em] uppercase">
                  02 — THE CHALLENGE
                </span>
              </div>
              <h4 className="font-playfair text-[22px] sm:text-[26px] font-bold text-charcoal-900 leading-snug mb-4">
                What problem was this project engineered to solve?
              </h4>
              <p className="font-sora text-[14px] text-charcoal-600 leading-relaxed mb-6 font-normal">
                {caseStudy.challenge.problem}
              </p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-[#D4A94E]/25">
              {caseStudy.challenge.keyPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-[12.5px] sm:text-[13px] font-sora text-charcoal-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7A1C28] mt-2 flex-shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* THE GOAL CARD */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D4A94E]/35 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 text-[#9A7209]">
                <Compass className="w-4 h-4" />
                <span className="text-[11px] sm:text-[12px] font-sora font-bold tracking-[0.2em] uppercase">
                  03 — THE GOAL
                </span>
              </div>
              <h4 className="font-playfair text-[22px] sm:text-[26px] font-bold text-charcoal-900 leading-snug mb-4">
                Strategic objectives & intended user outcomes.
              </h4>
              <p className="font-sora text-[14px] text-charcoal-600 leading-relaxed mb-6 font-normal">
                {caseStudy.goal.objective}
              </p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-[#D4A94E]/25">
              {caseStudy.goal.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-[12.5px] sm:text-[13px] font-sora text-charcoal-700">
                  <CheckCircle2 className="w-4 h-4 text-[#9A7209] mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* CHAPTER 04 — MY APPROACH (EDITORIAL 3-STEP ARCHITECTURE)         */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="mb-20 sm:mb-28">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[11px] sm:text-[12px] font-sora font-bold tracking-[0.2em] text-[#7A1C28] uppercase">
            04 — MY APPROACH
          </span>
          <div className="h-[1px] flex-1 bg-[#D4A94E]/25" />
        </div>

        <div className="max-w-[760px] mb-8">
          <h3 className="font-playfair text-[28px] sm:text-[34px] font-bold text-charcoal-900 leading-tight mb-3">
            Design Direction & Execution Pillars
          </h3>
          <p className="font-sora text-[14.5px] text-charcoal-600 leading-relaxed font-normal">
            {caseStudy.approach.philosophy}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseStudy.approach.steps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-2xl bg-white/70 hover:bg-white border border-[#D4A94E]/30 hover:border-[#7A1C28]/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="font-playfair text-[32px] sm:text-[36px] font-bold text-[#D4A94E] leading-none block mb-3">
                  {step.number}
                </span>
                <h4 className="font-sora text-[15px] font-bold text-charcoal-900 mb-2 leading-snug">
                  {step.title}
                </h4>
              </div>
              <p className="font-sora text-[13px] text-charcoal-600 leading-relaxed font-normal mt-2">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* CHAPTER 05 — DESIGN SYSTEM & TOKENS                              */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="mb-20 sm:mb-28 p-6 sm:p-10 rounded-3xl bg-[#FAF4EC]/80 border border-[#D4A94E]/35 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-[#7A1C28]">
          <Palette className="w-4 h-4" />
          <span className="text-[11px] sm:text-[12px] font-sora font-bold tracking-[0.2em] uppercase">
            05 — DESIGN SYSTEM & TOKENS
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          <div className="lg:col-span-6">
            <h3 className="font-playfair text-[26px] sm:text-[32px] font-bold text-charcoal-900 leading-tight mb-3">
              Typography & Color Tokens
            </h3>
            <p className="font-sora text-[13.5px] sm:text-[14px] text-charcoal-600 leading-relaxed">
              {caseStudy.designSystem.notes}
            </p>
          </div>

          {/* Typography pairing showcase */}
          <div className="lg:col-span-6 p-4 sm:p-5 rounded-2xl bg-white border border-[#D4A94E]/30">
            <div className="text-[10px] font-sora font-bold tracking-[0.18em] text-charcoal-400 uppercase mb-2">
              TYPOGRAPHY PAIRING
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between border-b border-black/[0.06] pb-1.5">
                <span className="font-playfair text-[20px] sm:text-[22px] font-bold text-charcoal-900">
                  {caseStudy.designSystem.headingFont}
                </span>
                <span className="font-sora text-[11px] text-[#7A1C28] font-semibold uppercase tracking-wider">
                  Display Serif
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-sora text-[14px] sm:text-[15px] font-medium text-charcoal-700">
                  {caseStudy.designSystem.bodyFont}
                </span>
                <span className="font-sora text-[11px] text-[#9A7209] font-semibold uppercase tracking-wider">
                  Interface Sans
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Color Palette Swatches */}
        <div>
          <div className="text-[11px] font-sora font-bold tracking-[0.16em] text-charcoal-400 uppercase mb-3">
            CURATED COLOR PALETTE (TAP TO COPY HEX)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {caseStudy.designSystem.palette.map((color, idx) => (
              <button
                key={idx}
                onClick={() => handleCopyHex(color.hex)}
                className="group p-3 sm:p-3.5 rounded-xl bg-white border border-[#D4A94E]/30 hover:border-[#7A1C28]/60 transition-all duration-300 text-left shadow-2xs hover:shadow-xs cursor-pointer flex flex-col justify-between"
              >
                <div
                  className="w-full h-12 sm:h-14 rounded-lg mb-2.5 border border-black/10 transition-transform group-hover:scale-[1.02] flex items-center justify-center"
                  style={{ backgroundColor: color.hex }}
                >
                  {copiedHex === color.hex && (
                    <span className="px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-sora flex items-center gap-1 shadow-sm">
                      <Check className="w-3 h-3 text-emerald-400" /> Copied
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-sora text-[12px] font-bold text-charcoal-900 truncate">
                    {color.name}
                  </div>
                  <div className="font-sora text-[10.5px] font-semibold text-[#9A7209] tracking-wider uppercase">
                    {color.hex}
                  </div>
                  <div className="font-sora text-[10px] text-charcoal-400 truncate mt-0.5">
                    {color.role}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* CHAPTER 06 — KEY SCREENS & CURATED FLOWS (EDITORIAL MOUNTS)       */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="mb-20 sm:mb-28">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[11px] sm:text-[12px] font-sora font-bold tracking-[0.2em] text-[#7A1C28] uppercase">
            06 — KEY SCREENS & CURATED FLOWS
          </span>
          <div className="h-[1px] flex-1 bg-[#D4A94E]/25" />
        </div>

        <div className="max-w-[760px] mb-10">
          <h3 className="font-playfair text-[28px] sm:text-[34px] font-bold text-charcoal-900 leading-tight mb-2">
            Interface Walkthrough & Screen Details
          </h3>
          <p className="font-sora text-[14px] text-charcoal-600 leading-relaxed font-normal">
            Explore key interface components and screen architecture captured directly from production.
          </p>
        </div>

        {/* Gallery Presentations */}
        <div className="space-y-12 sm:space-y-16">
          {caseStudy.keyScreens.map((screen, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-5 lg:p-6 rounded-3xl bg-white/90 border border-[#D4A94E]/35 shadow-md shadow-charcoal-900/[0.04]"
            >
              {/* Browser-style clean titlebar */}
              <div className="flex items-center justify-between px-2 pb-3 mb-3 border-b border-black/[0.06]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E57373]/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFB74D]/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#81C784]/80" />
                  <span className="font-sora text-[11px] font-medium text-charcoal-400 ml-2 tracking-wide truncate max-w-[200px] sm:max-w-none">
                    {project.title} — {screen.title}
                  </span>
                </div>
                <div className="text-[10px] font-sora tracking-[0.16em] text-[#9A7209] font-bold uppercase">
                  SCREEN 0{idx + 1}
                </div>
              </div>

              {/* Framed Screen Image */}
              <div className="relative w-full rounded-2xl overflow-hidden bg-[#161412] border border-black/10 aspect-[16/10] group">
                <img
                  src={screen.image}
                  alt={screen.title}
                  className="w-full h-full object-cover object-top filter brightness-[0.99] group-hover:brightness-100 transition-all duration-500"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Caption and commentary */}
              <div className="px-2 pt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <h4 className="font-playfair text-[18px] sm:text-[20px] font-bold text-charcoal-900">
                  {screen.title}
                </h4>
                <p className="font-sora text-[13px] text-charcoal-600 max-w-[560px] leading-relaxed">
                  {screen.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* CHAPTER 07 — INTERACTION & EXPERIENCE                             */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="mb-20 sm:mb-28">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[11px] sm:text-[12px] font-sora font-bold tracking-[0.2em] text-[#7A1C28] uppercase">
            07 — INTERACTION & EXPERIENCE
          </span>
          <div className="h-[1px] flex-1 bg-[#D4A94E]/25" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <h3 className="font-playfair text-[28px] sm:text-[34px] font-bold text-charcoal-900 leading-tight mb-3">
              Ergonomics & Tactile Feedback
            </h3>
            <p className="font-sora text-[14.5px] text-charcoal-600 leading-relaxed font-normal mb-6">
              {caseStudy.interactions.uxThinking}
            </p>

            {/* Optional Live Website exploration trigger */}
            {project.hasLivePreview && onOpenLiveModal && (
              <button
                onClick={onOpenLiveModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7A1C28] hover:bg-[#63141F] text-white text-[12px] font-sora font-semibold tracking-wider uppercase transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer active:scale-95"
              >
                <span>OPEN LIVE INTERACTIVE PREVIEW</span>
                <Monitor className="w-3.5 h-3.5 text-[#E5C89C]" />
              </button>
            )}
          </div>

          <div className="lg:col-span-7 space-y-3.5">
            {caseStudy.interactions.features.map((feat, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/80 border border-[#D4A94E]/30 hover:border-[#7A1C28]/40 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-1.5 text-charcoal-900">
                  <Sparkles className="w-4 h-4 text-[#9A7209]" />
                  <span className="font-sora text-[14.5px] font-bold">{feat.title}</span>
                </div>
                <p className="font-sora text-[13px] text-charcoal-600 leading-relaxed">
                  {feat.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* CHAPTER 08 — FINAL EXPERIENCE & HIGH-RES FULL-PAGE CAPTURE         */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="mb-20 sm:mb-28">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[11px] sm:text-[12px] font-sora font-bold tracking-[0.2em] text-[#7A1C28] uppercase">
            08 — FINAL EXPERIENCE
          </span>
          <div className="h-[1px] flex-1 bg-[#D4A94E]/25" />
        </div>

        <div className="max-w-[760px] mb-8">
          <h3 className="font-playfair text-[28px] sm:text-[34px] font-bold text-charcoal-900 leading-tight mb-2">
            The Complete Architectural Showcase
          </h3>
          <p className="font-sora text-[14px] text-charcoal-600 leading-relaxed font-normal">
            {caseStudy.finalExperience.overview}
          </p>
        </div>

        {/* High-Resolution Full Page Capture Presentation */}
        <div className="w-full rounded-3xl overflow-hidden bg-white/95 border border-[#D4A94E]/40 shadow-xl shadow-black/[0.06] p-3 sm:p-6 lg:p-8">
          <div className="w-full max-h-[550px] sm:max-h-[680px] overflow-y-auto rounded-2xl border border-black/10 bg-[#161412] scrollbar-thin scrollbar-thumb-[#D4A94E]/50">
            <img
              src={caseStudy.finalExperience.tallImage || caseStudy.finalExperience.previewImage}
              alt={`${project.title} Full Page Capture`}
              className="w-full h-auto object-top select-none"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="mt-3 px-2 flex items-center justify-between text-[11px] font-sora text-charcoal-500">
            <span>Scroll inside frame to explore complete vertical viewport</span>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#7A1C28] hover:text-[#9A7209] flex items-center gap-1 transition-colors"
              >
                <span>Launch Live URL</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* CHAPTER 09 — TECHNOLOGY / TOOLS                                   */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="mb-20 sm:mb-28 p-6 sm:p-8 rounded-3xl bg-[#FAF4EC]/80 border border-[#D4A94E]/35 shadow-xs">
        <div className="flex items-center gap-2 mb-4 text-[#7A1C28]">
          <Cpu className="w-4 h-4" />
          <span className="text-[11px] sm:text-[12px] font-sora font-bold tracking-[0.2em] uppercase">
            09 — TECHNOLOGY & INFRASTRUCTURE
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="max-w-[440px]">
            <h4 className="font-playfair text-[22px] sm:text-[26px] font-bold text-charcoal-900 leading-tight mb-2">
              Engineering Stack
            </h4>
            <p className="font-sora text-[13px] text-charcoal-600 leading-relaxed font-normal">
              Built with industry-standard web toolkits prioritizing rapid rendering, zero bundle bloat, and fluid motion.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 max-w-[560px]">
            {project.tools?.map((tool, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-full bg-white border border-[#D4A94E]/40 text-charcoal-800 font-sora text-[12px] font-semibold tracking-wide flex items-center gap-2 shadow-2xs hover:border-[#7A1C28] transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#7A1C28]" />
                <span>{tool}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* CHAPTER 10 — OUTCOME & VERDICT                                     */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="mb-20 sm:mb-28 p-8 sm:p-12 rounded-3xl bg-white border-2 border-[#D4A94E]/40 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-radial from-[#F6D7B2]/30 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-[840px] mx-auto text-center flex flex-col items-center">
          <span className="text-[11px] sm:text-[12px] font-sora font-bold tracking-[0.24em] text-[#9A7209] uppercase mb-3">
            10 — OUTCOME & CONCLUSION
          </span>
          <h3 className="font-playfair text-[28px] sm:text-[36px] font-bold text-charcoal-900 leading-[1.2] mb-4">
            “{caseStudy.outcome.impactTakeaway}”
          </h3>
          <p className="font-sora text-[14.5px] sm:text-[15.5px] text-charcoal-600 leading-relaxed max-w-[640px] font-normal mb-8">
            {caseStudy.outcome.summary}
          </p>

          {/* Primary Action Button */}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-full bg-[#7A1C28] hover:bg-[#63141F] text-white text-[12.5px] font-sora font-semibold tracking-[0.12em] uppercase transition-all duration-300 shadow-md shadow-[#7A1C28]/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2.5 cursor-pointer"
            >
              <span>EXPLORE LIVE {project.type === 'webapp' ? 'APPLICATION' : 'WEBSITE'}</span>
              <ExternalLink className="w-4 h-4 text-[#E5C89C]" />
            </a>
          )}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* PROJECT NAVIGATION (PREVIOUS / CURRENT / NEXT SPREAD)              */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <nav aria-label="Case Study Project Navigation" className="w-full pt-10 border-t border-[#D4A94E]/30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <span className="text-[11px] font-sora font-bold tracking-[0.2em] text-[#9A7209] uppercase">
            CONTINUE DOCUMENTARY ARCHIVE
          </span>
          <Link
            to="/#digital-work"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/80 hover:bg-white border border-[#D4A94E]/40 text-[#7A1C28] font-sora text-[11px] font-semibold tracking-wider uppercase transition-all shadow-2xs hover:shadow-xs"
          >
            ← BACK TO ALL WORK
          </Link>
          <span className="text-[11px] font-sora font-medium text-charcoal-400">
            PROJECT {project.index} OF 04
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* PREVIOUS PROJECT CARD */}
          <Link
            to={`/work/${prevProject.slug}`}
            className="group p-4 sm:p-5 rounded-2xl bg-[#FAF4EC]/80 hover:bg-white border border-[#D4A94E]/30 hover:border-[#7A1C28]/50 transition-all duration-300 text-left flex items-center gap-4 cursor-pointer shadow-2xs hover:shadow-md"
          >
            <div className="w-16 h-12 rounded-lg overflow-hidden bg-black/10 flex-shrink-0 border border-black/10">
              <img
                src={prevProject.previewImage}
                alt=""
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[10px] font-sora font-bold tracking-[0.16em] text-charcoal-400 uppercase mb-0.5">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                <span>PREVIOUS CASE STUDY</span>
              </div>
              <div className="font-playfair text-[16px] sm:text-[18px] font-bold text-charcoal-900 group-hover:text-[#7A1C28] transition-colors truncate">
                {prevProject.title}
              </div>
              <div className="text-[10.5px] font-sora text-charcoal-500 truncate">
                {prevProject.categoryLabel}
              </div>
            </div>
          </Link>

          {/* NEXT PROJECT CARD */}
          <Link
            to={`/work/${nextProject.slug}`}
            className="group p-4 sm:p-5 rounded-2xl bg-[#FAF4EC]/80 hover:bg-white border border-[#D4A94E]/30 hover:border-[#7A1C28]/50 transition-all duration-300 text-right flex items-center justify-end gap-4 cursor-pointer shadow-2xs hover:shadow-md"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-end gap-1.5 text-[10px] font-sora font-bold tracking-[0.16em] text-charcoal-400 uppercase mb-0.5">
                <span>NEXT CASE STUDY</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="font-playfair text-[16px] sm:text-[18px] font-bold text-charcoal-900 group-hover:text-[#7A1C28] transition-colors truncate">
                {nextProject.title}
              </div>
              <div className="text-[10.5px] font-sora text-charcoal-500 truncate">
                {nextProject.categoryLabel}
              </div>
            </div>
            <div className="w-16 h-12 rounded-lg overflow-hidden bg-black/10 flex-shrink-0 border border-black/10">
              <img
                src={nextProject.previewImage}
                alt=""
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
        </div>
      </nav>
    </div>
  );
}
