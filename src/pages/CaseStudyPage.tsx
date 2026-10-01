import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Play,
  Share2,
  Check,
  Sparkles,
  Layers,
  Monitor,
  AlertCircle,
} from 'lucide-react';
import { getDigitalProjectBySlug, digitalProjects, DigitalProject } from '../data/portfolio';
import DigitalCaseStudy from '../components/DigitalCaseStudy';
import LiveWebsiteModal from '../components/LiveWebsiteModal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const project = getDigitalProjectBySlug(slug || '');

  // Dynamic SEO Document Title & Description
  useEffect(() => {
    if (project) {
      document.title = `${project.title} — UI/UX Case Study | ARPIT AK`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          project.caseStudy?.summary || project.description || 'UI/UX Case Study by Arpit AK'
        );
      }
    } else {
      document.title = 'Case Study Not Found | ARPIT AK';
    }
  }, [project]);

  // Handle Share / Copy Link
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // 404 NOT FOUND STATE
  if (!project) {
    return (
      <div className="min-h-screen bg-[#FBF7F0] text-charcoal-900 flex flex-col justify-between relative selection:bg-[#7A1C28] selection:text-white">
        {/* Grain Textures */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-multiply"
          style={{ backgroundImage: 'url(/assets/noise-grain.png)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: 'url(/assets/paper-texture.webp)' }}
        />

        {/* Top Minimal Bar */}
        <header className="relative z-20 w-full px-6 py-6 border-b border-[#D4A94E]/25 flex items-center justify-between">
          <Link
            to="/#digital-work"
            className="inline-flex items-center gap-2 font-sora text-[11.5px] font-bold tracking-[0.16em] uppercase text-charcoal-700 hover:text-[#7A1C28] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO WORK</span>
          </Link>
          <Link to="/" className="flex items-center">
            <span className="font-sora font-semibold tracking-[0.2em] text-charcoal-800 text-base">ARPIT</span>
            <span className="font-sora font-semibold tracking-[0.2em] text-[#9A7209] text-base ml-1.5">AK</span>
          </Link>
        </header>

        {/* 404 Center Message */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-20 max-w-[620px] mx-auto">
          <div className="w-14 h-14 rounded-full bg-[#7A1C28]/10 border border-[#7A1C28]/30 flex items-center justify-center mb-5">
            <AlertCircle className="w-7 h-7 text-[#7A1C28]" />
          </div>
          <span className="font-sora text-[11px] font-bold tracking-[0.22em] text-[#9A7209] uppercase mb-2">
            ARCHIVE NO. 404
          </span>
          <h1 className="font-playfair text-[36px] sm:text-[44px] font-bold text-charcoal-900 leading-tight mb-4">
            Case Study Not Found
          </h1>
          <p className="font-sora text-[14.5px] text-charcoal-600 leading-relaxed mb-8 max-w-[480px]">
            The requested design documentary “{slug}” could not be located in the archive. Explore our active projects below.
          </p>
          <Link
            to="/#digital-work"
            className="px-8 py-3.5 rounded-full bg-[#7A1C28] hover:bg-[#63141F] text-white text-[12.5px] font-sora font-semibold tracking-[0.14em] uppercase transition-all shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            ← RETURN TO ALL WORK
          </Link>
        </main>

        <Footer />
      </div>
    );
  }

  // Calculate project indices
  const totalProjects = digitalProjects.length;
  const currentIndex = digitalProjects.findIndex((p) => p.id === project.id);
  const prevProject = digitalProjects[(currentIndex - 1 + totalProjects) % totalProjects];
  const nextProject = digitalProjects[(currentIndex + 1) % totalProjects];

  return (
    <div className="min-h-screen bg-[#FBF7F0] text-charcoal-900 relative selection:bg-[#7A1C28] selection:text-white">
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* BACKGROUND TEXTURES & ATMOSPHERIC GLOW                              */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 opacity-[0.035] pointer-events-none mix-blend-multiply z-0"
        style={{ backgroundImage: 'url(/assets/noise-grain.png)' }}
      />
      <div
        className="fixed inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay z-0"
        style={{ backgroundImage: 'url(/assets/paper-texture.webp)' }}
      />

      {/* Top subtle golden atmospheric mist */}
      <div className="absolute top-0 inset-x-0 h-44 pointer-events-none overflow-hidden flex justify-center opacity-30 z-0">
        <img
          src="/assets/atmospheric-mist.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-top"
          draggable={false}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. GLOBAL UNIFIED NAVBAR                                            */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <Navbar isLoaded={true} />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. PROJECT HERO SHOWCASE                                            */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 w-full pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#D4A94E]/25">
        <div className="w-full max-w-[1240px] mx-auto flex flex-col items-center text-center">
          {/* Back Action: Return to homepage #digital-work section with preserved scroll */}
          <div className="w-full flex items-center justify-between mb-8">
            <button
              type="button"
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate('/#digital-work');
                }
              }}
              className="inline-flex items-center gap-2 font-sora text-[11px] sm:text-[12px] font-bold tracking-[0.16em] uppercase text-charcoal-700 hover:text-[#7A1C28] transition-colors group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>BACK TO WORK</span>
            </button>

            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-white/70 border border-[#D4A94E]/35 text-[10px] sm:text-[10.5px] font-sora font-semibold tracking-wider text-[#9A7209] uppercase">
              ARCHIVE NO. {project.index}
            </span>
          </div>

          {/* Eyebrow badge */}
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 border border-[#D4A94E]/40 shadow-xs mb-5">
            <span className="w-2 h-2 rounded-full bg-[#7A1C28] animate-pulse" />
            <span className="text-[10.5px] sm:text-[11.5px] font-sora font-bold tracking-[0.24em] text-[#9A7209] uppercase">
              CASE STUDY DOCUMENTARY • ARCHIVE NO. {project.index} • {project.categoryLabel}
            </span>
          </div>

          {/* Commanding Project Title */}
          <h1 className="font-playfair text-[clamp(2.6rem,5.5vw,5rem)] font-bold text-charcoal-900 leading-[1.08] tracking-tight mb-4 max-w-[960px]">
            {project.title}
          </h1>

          {/* Short Narrative Summary */}
          <p className="font-sora text-[15px] sm:text-[17px] text-charcoal-600 max-w-[740px] leading-relaxed mb-8 font-normal">
            {project.caseStudy?.summary || project.description}
          </p>

          {/* 4-Column Editorial Metadata Matrix */}
          {project.caseStudy && (
            <div className="w-full max-w-[880px] grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-white/80 border border-[#D4A94E]/35 mb-8 text-left shadow-2xs">
              <div>
                <span className="block text-[9.5px] sm:text-[10px] font-sora font-bold tracking-[0.18em] text-[#9A7209] uppercase mb-1">
                  YEAR
                </span>
                <span className="block font-sora text-[13px] sm:text-[14px] font-semibold text-charcoal-800">
                  {project.caseStudy.year}
                </span>
              </div>
              <div>
                <span className="block text-[9.5px] sm:text-[10px] font-sora font-bold tracking-[0.18em] text-[#9A7209] uppercase mb-1">
                  ROLE
                </span>
                <span className="block font-sora text-[13px] sm:text-[14px] font-semibold text-charcoal-800 leading-snug">
                  {project.caseStudy.role}
                </span>
              </div>
              <div>
                <span className="block text-[9.5px] sm:text-[10px] font-sora font-bold tracking-[0.18em] text-[#9A7209] uppercase mb-1">
                  SERVICES
                </span>
                <span className="block font-sora text-[13px] sm:text-[14px] font-semibold text-charcoal-800 leading-snug">
                  {project.caseStudy.services.join(' • ')}
                </span>
              </div>
              <div>
                <span className="block text-[9.5px] sm:text-[10px] font-sora font-bold tracking-[0.18em] text-[#9A7209] uppercase mb-1">
                  CORE TECH
                </span>
                <span className="block font-sora text-[13px] sm:text-[14px] font-semibold text-charcoal-800 leading-snug">
                  {project.tools?.join(' • ') || 'Web'}
                </span>
              </div>
            </div>
          )}

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12 sm:mb-16">
            {/* Primary Action Button: Live Preview if available, else Open Web App */}
            {project.hasLivePreview ? (
              <button
                onClick={() => setIsLiveModalOpen(true)}
                className="px-7 sm:px-9 py-3.5 rounded-full bg-[#7A1C28] hover:bg-[#63141F] text-white text-[12px] sm:text-[13px] font-sora font-semibold tracking-[0.12em] uppercase transition-all duration-300 shadow-md shadow-[#7A1C28]/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-[#E5C89C] fill-[#E5C89C]" />
                <span>LAUNCH INTERACTIVE ENVIRONMENT</span>
              </button>
            ) : project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 sm:px-9 py-3.5 rounded-full bg-[#7A1C28] hover:bg-[#63141F] text-white text-[12px] sm:text-[13px] font-sora font-semibold tracking-[0.12em] uppercase transition-all duration-300 shadow-md shadow-[#7A1C28]/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2.5 cursor-pointer"
              >
                <span>OPEN WEB APPLICATION</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#E5C89C]" />
              </a>
            ) : null}

            {/* Direct Link External Button if project had live preview */}
            {project.hasLivePreview && project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-white hover:bg-cream-50 text-charcoal-700 hover:text-[#7A1C28] border border-[#D4A94E]/50 hover:border-[#7A1C28] text-[12px] sm:text-[13px] font-sora font-semibold tracking-wider uppercase transition-all duration-300 shadow-2xs hover:shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>OPEN IN NEW TAB</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#9A7209]" />
              </a>
            )}

            {/* Share / Copy Link Button */}
            <button
              onClick={handleShare}
              className="px-5 py-3.5 rounded-full bg-white/70 hover:bg-white text-charcoal-700 hover:text-charcoal-900 border border-[#D4A94E]/40 text-[12px] sm:text-[13px] font-sora font-medium tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">LINK COPIED</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#7A1C28]" />
                  <span>SHARE CASE STUDY</span>
                </>
              )}
            </button>
          </div>

          {/* Large Hero Artwork Showcase (Curated Device Canvas) */}
          <div className="w-full max-w-[1100px] relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#181614] border-2 border-[#D4A94E]/30 shadow-2xl">
            {/* Top Browser Bar Emulation */}
            <div className="w-full px-4 py-3 bg-[#110F0D] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56]/80" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/80" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F]/80" />
              </div>
              <div className="px-4 py-1 rounded-md bg-white/[0.06] text-white/50 text-[11px] font-sora tracking-wide max-w-[280px] truncate">
                {project.url || `case-study://${project.slug}`}
              </div>
              <div className="text-[10px] font-sora font-semibold tracking-wider text-[#C4943A] uppercase">
                ARCHIVE VISUAL
              </div>
            </div>

            {/* High-Resolution Hero Image */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-black/30">
              <img
                src={project.tallPreviewImage || project.previewImage}
                alt={project.title}
                className="w-full h-full object-cover object-top"
              />

              {/* Optional overlay banner if project supports live preview */}
              {project.hasLivePreview && (
                <div
                  onClick={() => setIsLiveModalOpen(true)}
                  className="absolute bottom-4 right-4 z-20 px-4 py-2 rounded-xl bg-black/80 hover:bg-black/95 text-white border border-[#D4A94E]/50 text-[11.5px] font-sora font-semibold tracking-wider uppercase flex items-center gap-2 cursor-pointer shadow-xl backdrop-blur-md transition-all hover:scale-105"
                >
                  <Play className="w-3.5 h-3.5 text-[#E5C89C] fill-[#E5C89C]" />
                  <span>LAUNCH INTERACTIVE ENVIRONMENT</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 3. 10-CHAPTER COMPLETE DOCUMENTARY EXPERIENCE                       */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <main className="relative z-10 w-full">
        <DigitalCaseStudy
          project={project}
          prevProject={prevProject}
          nextProject={nextProject}
          onOpenLiveModal={() => setIsLiveModalOpen(true)}
        />
      </main>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 4. INTERACTIVE LIVE WEBSITE PREVIEW MODAL                           */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {isLiveModalOpen && (
        <LiveWebsiteModal
          project={project}
          isOpen={isLiveModalOpen}
          onClose={() => setIsLiveModalOpen(false)}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 5. GLOBAL FOOTER                                                   */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
