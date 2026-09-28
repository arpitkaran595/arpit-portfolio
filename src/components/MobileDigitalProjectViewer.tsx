import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Play,
  Maximize2,
  Minimize2,
  RefreshCw,
  Monitor,
  Tablet,
  Smartphone,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { DigitalProject, digitalProjects } from '../data/portfolio';

export interface MobileDigitalProjectViewerProps {
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
  projects?: DigitalProject[];
}

export const MobileDigitalProjectViewer: React.FC<MobileDigitalProjectViewerProps> = ({
  isOpen,
  onClose,
  initialIndex = 0,
  projects = digitalProjects,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const totalProjects = projects.length;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Live preview overlay states
  const [isLivePreviewOpen, setIsLivePreviewOpen] = useState(false);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  // Sync index when initialIndex changes or viewer opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.max(0, Math.min(initialIndex, totalProjects - 1)));
    }
  }, [isOpen, initialIndex, totalProjects]);

  const currentProject = projects[currentIndex] || projects[0];

  // Previous and Next project wrapping
  const prevIndex = (currentIndex - 1 + totalProjects) % totalProjects;
  const nextIndex = (currentIndex + 1) % totalProjects;
  const prevProject = projects[prevIndex];
  const nextProject = projects[nextIndex];

  // Navigation handlers
  // In vertical carousel: NEXT advances forward (top card / up swipe), PREVIOUS moves backward (bottom card / down swipe)
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalProjects);
  }, [totalProjects]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalProjects) % totalProjects);
  }, [totalProjects]);

  // Scroll locking for mobile background
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if ((window as any).lenis) {
      (window as any).lenis.stop();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLivePreviewOpen) {
          setIsLivePreviewOpen(false);
        } else if (isFullscreen) {
          exitFullscreen();
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isLivePreviewOpen, isFullscreen, onClose, handleNext, handlePrevious]);

  // Fullscreen support
  const enterFullscreen = useCallback(async () => {
    try {
      const root = containerRef.current || document.documentElement;
      if (root.requestFullscreen) {
        await root.requestFullscreen();
      } else if ((root as any).webkitRequestFullscreen) {
        await (root as any).webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } catch {
      // Fullscreen not supported or blocked
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      }
      setIsFullscreen(false);
    } catch {
      // Exit fullscreen safe fallback
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement || (document as any).webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Touch gesture support:
  // Swipe UP -> Next project
  // Swipe DOWN -> Previous project
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchDeltaY, setTouchDeltaY] = useState<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isLivePreviewOpen) return;
    setTouchStartY(e.touches[0].clientY);
    setTouchDeltaY(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null || isLivePreviewOpen) return;
    const currentY = e.touches[0].clientY;
    setTouchDeltaY(currentY - touchStartY);
  };

  const handleTouchEnd = () => {
    if (touchStartY === null || isLivePreviewOpen) return;
    if (touchDeltaY < -45) {
      // Swiped UP -> Move to NEXT project
      handleNext();
    } else if (touchDeltaY > 45) {
      // Swiped DOWN -> Move to PREVIOUS project
      handlePrevious();
    }
    setTouchStartY(null);
    setTouchDeltaY(0);
  };

  // Open external project
  const handleOpenExternalProject = useCallback(() => {
    if (currentProject?.url) {
      window.open(currentProject.url, '_blank', 'noopener,noreferrer');
    }
  }, [currentProject]);

  // Open live preview modal
  const handleOpenLivePreview = useCallback(() => {
    setIsIframeLoading(true);
    setIframeKey((prev) => prev + 1);
    setIsLivePreviewOpen(true);
  }, []);

  // Format counter (e.g. 01 / 04)
  const formattedCurrent = String(currentIndex + 1).padStart(2, '0');
  const formattedTotal = String(totalProjects).padStart(2, '0');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        key="mobile-digital-project-viewer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="fixed inset-0 z-[100000] bg-[#0A0908] text-white flex flex-col justify-between overflow-hidden select-none"
        style={{
          paddingTop: 'max(env(safe-area-inset-top), 12px)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 14px)',
        }}
      >
        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* SUBTLE AMBIENT BACKGROUND GLOW */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[450px] h-[340px] sm:h-[450px] rounded-full blur-[100px] opacity-25 transition-all duration-700 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(196,148,58,0.45) 0%, rgba(122,28,40,0.2) 60%, transparent 100%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.035] mix-blend-screen pointer-events-none"
            style={{ backgroundImage: 'url(/assets/noise-grain.png)' }}
          />
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* 1. TOP HEADER (STICKY / FIXED) */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <header className="relative z-40 w-full px-4 sm:px-5 py-2.5 flex items-center justify-between backdrop-blur-md bg-[#0A0908]/75 border-b border-white/[0.06]">
          {/* Left: ARPIT AK | UI/UX PROJECT */}
          <div className="flex items-center gap-2.5">
            <span className="font-sora font-extrabold text-[12.5px] sm:text-[13.5px] tracking-[0.16em] text-white uppercase">
              ARPIT AK
            </span>
            <div className="h-3 w-[1px] bg-white/20" />
            <span className="font-sora font-semibold text-[10px] sm:text-[11px] tracking-[0.2em] text-[#C4943A] uppercase">
              UI/UX PROJECT
            </span>
          </div>

          {/* Right: Counter (01 / 04) + Close (×) Button */}
          <div className="flex items-center gap-3">
            <div className="font-sora text-[11px] sm:text-[12px] tracking-[0.2em] font-medium">
              <span className="text-[#C4943A] font-bold">{formattedCurrent}</span>
              <span className="text-white/35 mx-1">/</span>
              <span className="text-white/45">{formattedTotal}</span>
            </div>

            <button
              onClick={onClose}
              aria-label="Close project viewer"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 border border-white/10 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          </div>
        </header>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* SCROLLABLE MAIN CONTENT (FOR ULTRA-SHORT DEVICES) */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <div className="relative z-30 flex-1 flex flex-col justify-between overflow-y-auto overflow-x-hidden min-h-0 px-4 py-2">
          {/* ───────────────────────────────────────────────────────────────── */}
          {/* 2. VERTICAL 3-CARD CAROUSEL (CENTER VISUAL ELEMENT) */}
          {/* ───────────────────────────────────────────────────────────────── */}
          <div className="relative w-full flex flex-col items-center justify-center my-auto pt-6 pb-6">
            {/* NEXT PILL BUTTON (TOP CHEVRON) */}
            <button
              onClick={handleNext}
              aria-label="Next project"
              className="relative z-40 mb-2 px-3 py-1 rounded-full bg-[#181614]/90 hover:bg-[#23201C] border border-[#C4943A]/40 text-[#C4943A] text-[9.5px] font-sora font-semibold tracking-[0.2em] uppercase flex items-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span>NEXT</span>
              <ChevronUp className="w-3 h-3 text-[#C4943A]" />
            </button>

            {/* STACK CAROUSEL ANCHOR CONTAINER */}
            <div className="relative w-full max-w-[340px] aspect-[16/10] flex items-center justify-center">
              {/* TOP CARD: NEXT PROJECT (Scaled down, Dimmed, Depth blur) */}
              {totalProjects > 1 && nextProject && (
                <div
                  onClick={handleNext}
                  className="absolute w-[86%] aspect-[16/10] rounded-xl overflow-hidden bg-[#161412] border border-white/10 shadow-lg cursor-pointer transition-all duration-500 ease-out"
                  style={{
                    top: '-42%',
                    transform: 'scale(0.85)',
                    opacity: 0.42,
                    filter: 'brightness(0.65) blur(0.5px)',
                    zIndex: 10,
                  }}
                  title={`View next: ${nextProject.title}`}
                >
                  <img
                    src={nextProject.previewImage}
                    alt={nextProject.title}
                    className="w-full h-full object-cover object-top select-none pointer-events-none"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              )}

              {/* CENTER CARD: CURRENT PROJECT (Sharp, Prominent, Gold Border) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProject.id}
                  initial={{ opacity: 0.7, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.7, scale: 0.95 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-20 w-full h-full rounded-2xl overflow-hidden bg-[#161412] border border-[#C4943A]/60 shadow-[0_16px_48px_rgba(0,0,0,0.85),0_0_24px_rgba(196,148,58,0.22)] flex items-center justify-center group"
                >
                  <img
                    src={currentProject.previewImage}
                    alt={currentProject.title}
                    className="w-full h-full object-cover object-top select-none"
                    draggable={false}
                  />

                  {/* Gradient shadow overlay for high-end look */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                  {/* FLANKING CHEVRON BUTTONS (< and >) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevious();
                    }}
                    aria-label="Previous project"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 hover:border-[#C4943A]/60 text-white/90 flex items-center justify-center active:scale-90 transition-all shadow-lg z-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    aria-label="Next project"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 hover:border-[#C4943A]/60 text-white/90 flex items-center justify-center active:scale-90 transition-all shadow-lg z-30 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>

                  {/* CURRENT PILL BADGE AT BOTTOM RIM */}
                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-30 px-3 py-0.5 rounded-full bg-[#12110F]/95 border border-[#C4943A]/70 text-[#C4943A] font-sora text-[8.5px] font-bold tracking-[0.22em] uppercase shadow-lg pointer-events-none">
                    CURRENT
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* BOTTOM CARD: PREVIOUS PROJECT (Scaled down, Dimmed, Depth blur) */}
              {totalProjects > 1 && prevProject && (
                <div
                  onClick={handlePrevious}
                  className="absolute w-[86%] aspect-[16/10] rounded-xl overflow-hidden bg-[#161412] border border-white/10 shadow-lg cursor-pointer transition-all duration-500 ease-out"
                  style={{
                    bottom: '-42%',
                    transform: 'scale(0.85)',
                    opacity: 0.42,
                    filter: 'brightness(0.65) blur(0.5px)',
                    zIndex: 10,
                  }}
                  title={`View previous: ${prevProject.title}`}
                >
                  <img
                    src={prevProject.previewImage}
                    alt={prevProject.title}
                    className="w-full h-full object-cover object-top select-none pointer-events-none"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              )}
            </div>

            {/* PREVIOUS PILL BUTTON (BOTTOM CHEVRON) */}
            <button
              onClick={handlePrevious}
              aria-label="Previous project"
              className="relative z-40 mt-2 px-3 py-1 rounded-full bg-[#181614]/90 hover:bg-[#23201C] border border-[#C4943A]/40 text-[#C4943A] text-[9.5px] font-sora font-semibold tracking-[0.2em] uppercase flex items-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span>PREVIOUS</span>
              <ChevronDown className="w-3 h-3 text-[#C4943A]" />
            </button>
          </div>

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* 3. PROJECT EDITORIAL INFORMATION (BELOW CAROUSEL) */}
          {/* ───────────────────────────────────────────────────────────────── */}
          <div className="w-full max-w-[420px] mx-auto flex flex-col items-start px-2 mt-1 mb-2">
            {/* Project Category Tag (e.g. ■ WEB APPLICATION ↗) */}
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-sora font-semibold tracking-[0.2em] text-[#C4943A] uppercase">
              <span className="w-1.5 h-1.5 rounded-[2px] bg-[#C4943A]" />
              <span>{currentProject.categoryLabel || currentProject.category}</span>
              <span className="text-[#C4943A]/80 font-normal">↗</span>
            </div>

            {/* Project Title (Large Commanding Playfair Serif) */}
            <h2 className="font-playfair text-[25px] sm:text-[29px] font-bold text-[#FAF6F0] tracking-tight leading-tight mt-1 mb-1.5">
              {currentProject.title}
            </h2>

            {/* Project Description (1-2 lines) */}
            <p className="font-sora text-[12px] sm:text-[13px] text-[#A69E90] font-normal leading-relaxed line-clamp-2">
              {currentProject.description}
            </p>

            {/* Technology / Role Pills with gold dots */}
            {currentProject.tools && currentProject.tools.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2.5">
                {currentProject.tools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 sm:py-1 rounded-full bg-white/[0.05] border border-white/10 text-white/80 font-sora text-[10.5px] sm:text-[11px] font-medium flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#C4943A]" />
                    <span>{tool}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* 4. ACTION BUTTONS (BOTTOM OF VIEWER) */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <footer className="relative z-40 w-full px-3.5 sm:px-5 pt-2 pb-1 bg-[#0A0908]/90 backdrop-blur-md border-t border-white/[0.06]">
          <div className="w-full max-w-[420px] mx-auto flex items-center gap-2 sm:gap-2.5">
            {/* Primary CTA: CASE STUDY (Navigates to dedicated page) */}
            <button
              onClick={() => {
                onClose();
                navigate(`/work/${currentProject.slug}`);
              }}
              aria-label="View dedicated case study"
              className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-[#C4943A] via-[#D4A94E] to-[#B8860B] hover:brightness-105 active:scale-[0.98] text-[#14120E] font-sora font-bold text-[11px] sm:text-[11.5px] tracking-[0.12em] uppercase flex items-center justify-center gap-1.5 shadow-lg shadow-[#C4943A]/20 transition-all cursor-pointer"
            >
              <span>CASE STUDY</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#14120E]" />
            </button>

            {/* Secondary CTA: LIVE PREVIEW or OPEN PROJECT */}
            {currentProject.hasLivePreview ? (
              <button
                onClick={handleOpenLivePreview}
                aria-label="Open interactive live preview"
                className="flex-1 py-3 px-3 rounded-xl bg-[#181614] hover:bg-[#221F1B] active:scale-[0.98] border border-white/15 hover:border-white/25 text-white font-sora font-semibold text-[11px] sm:text-[11.5px] tracking-[0.12em] uppercase flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Play className="w-3 h-3 text-[#C4943A] fill-[#C4943A]" />
                <span>LIVE PREVIEW</span>
              </button>
            ) : (
              <button
                onClick={handleOpenExternalProject}
                aria-label="Open project in new tab"
                className="flex-1 py-3 px-3 rounded-xl bg-[#181614] hover:bg-[#221F1B] active:scale-[0.98] border border-white/15 hover:border-white/25 text-white font-sora font-semibold text-[11px] sm:text-[11.5px] tracking-[0.12em] uppercase flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <span>OPEN SITE</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#C4943A]" />
              </button>
            )}

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              className="w-11 h-11 rounded-xl bg-[#181614] hover:bg-[#221F1B] active:scale-95 border border-white/15 text-white/80 hover:text-white flex items-center justify-center transition-all flex-shrink-0 cursor-pointer shadow-md"
              title="Toggle fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-[#C4943A]" />
              ) : (
                <Maximize2 className="w-4 h-4 text-white/80" />
              )}
            </button>
          </div>
        </footer>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* 5. INTERACTIVE LIVE PREVIEW SYSTEM OVERLAY */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {isLivePreviewOpen && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[100010] bg-[#0A0908] flex flex-col"
              style={{
                paddingTop: 'max(env(safe-area-inset-top), 8px)',
                paddingBottom: 'max(env(safe-area-inset-bottom), 10px)',
              }}
            >
              {/* Live Preview Top Bar */}
              <div className="w-full px-3.5 py-2.5 bg-[#12100E] border-b border-white/10 flex items-center justify-between gap-2 z-20 flex-shrink-0">
                {/* Project title / mode info */}
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                  <span className="font-sora font-bold text-[12px] text-white truncate">
                    {currentProject.title}
                  </span>
                </div>

                {/* Viewport switcher: Desktop / Tablet / Mobile (available on live sites) */}
                {currentProject.hasLivePreview && (
                  <div className="hidden xs:flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10">
                    <button
                      onClick={() => setPreviewViewport('desktop')}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        previewViewport === 'desktop'
                          ? 'bg-[#C4943A] text-black font-bold'
                          : 'text-white/60 hover:text-white'
                      }`}
                      title="Desktop view"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPreviewViewport('tablet')}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        previewViewport === 'tablet'
                          ? 'bg-[#C4943A] text-black font-bold'
                          : 'text-white/60 hover:text-white'
                      }`}
                      title="Tablet view"
                    >
                      <Tablet className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPreviewViewport('mobile')}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        previewViewport === 'mobile'
                          ? 'bg-[#C4943A] text-black font-bold'
                          : 'text-white/60 hover:text-white'
                      }`}
                      title="Mobile view"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Actions: Reload + Open Tab + Close */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {currentProject.hasLivePreview && (
                    <button
                      onClick={() => {
                        setIsIframeLoading(true);
                        setIframeKey((prev) => prev + 1);
                      }}
                      className="p-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-white/80 transition-all cursor-pointer"
                      title="Reload iframe"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={handleOpenExternalProject}
                    className="p-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-white/80 transition-all cursor-pointer"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setIsLivePreviewOpen(false)}
                    className="p-1.5 rounded-lg bg-white/[0.12] hover:bg-white/[0.2] text-white transition-all cursor-pointer ml-1"
                    title="Close live preview"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Live Preview Container */}
              <div className="flex-1 w-full bg-[#0E0D0B] relative flex items-center justify-center overflow-hidden p-2 sm:p-4">
                {currentProject.hasLivePreview ? (
                  /* GENUINE LIVE EMBEDDING */
                  <div
                    className="w-full h-full flex items-center justify-center transition-all duration-300"
                    style={{
                      maxWidth:
                        previewViewport === 'mobile'
                          ? '390px'
                          : previewViewport === 'tablet'
                          ? '768px'
                          : '100%',
                    }}
                  >
                    <div className="relative w-full h-full rounded-xl overflow-hidden bg-white shadow-2xl border border-white/10">
                      {isIframeLoading && (
                        <div className="absolute inset-0 bg-[#0E0D0B] flex flex-col items-center justify-center z-10 gap-3">
                          <div className="w-8 h-8 rounded-full border-2 border-[#C4943A]/30 border-t-[#C4943A] animate-spin" />
                          <span className="font-sora text-[11px] text-[#C4943A] tracking-[0.16em] uppercase">
                            Loading Live Website...
                          </span>
                        </div>
                      )}
                      <iframe
                        key={iframeKey}
                        src={currentProject.url}
                        className="w-full h-full border-none"
                        title={currentProject.title}
                        onLoad={() => setIsIframeLoading(false)}
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      />
                    </div>
                  </div>
                ) : (
                  /* GRACEFUL FALLBACK (E.G. ImageMint with X-Frame-Options restriction) */
                  <div className="w-full max-w-[440px] h-full max-h-[620px] rounded-2xl bg-[#14120F] border border-white/10 p-5 flex flex-col items-center justify-between text-center shadow-2xl relative overflow-hidden">
                    {/* Background Preview Blur */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                      <img
                        src={currentProject.tallPreviewImage || currentProject.previewImage}
                        alt=""
                        className="w-full h-full object-cover filter blur-sm"
                      />
                    </div>

                    <div className="relative z-10 w-full flex flex-col items-center mt-2">
                      <div className="w-12 h-12 rounded-full bg-[#C4943A]/15 border border-[#C4943A]/40 flex items-center justify-center mb-3">
                        <AlertCircle className="w-6 h-6 text-[#C4943A]" />
                      </div>
                      <span className="text-[10px] font-sora font-bold tracking-[0.2em] text-[#C4943A] uppercase mb-1">
                        EMBEDDED PREVIEW RESTRICTED
                      </span>
                      <h3 className="font-playfair text-[22px] font-bold text-white mb-2">
                        {currentProject.title}
                      </h3>
                      <p className="font-sora text-[12px] text-[#A69E90] leading-relaxed max-w-[320px]">
                        This web application enforces strict browser security policies (X-Frame-Options / CSP)
                        that prevent embedded iframe viewing.
                      </p>
                    </div>

                    {/* Screenshot card display */}
                    <div className="relative z-10 w-full max-w-[320px] aspect-[16/10] rounded-xl overflow-hidden border border-white/15 shadow-xl my-4">
                      <img
                        src={currentProject.previewImage}
                        alt={currentProject.title}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    {/* CTA Actions */}
                    <div className="relative z-10 w-full flex flex-col gap-2">
                      <button
                        onClick={handleOpenExternalProject}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C4943A] to-[#B8860B] hover:brightness-105 active:scale-[0.98] text-[#14120E] font-sora font-bold text-[11.5px] tracking-[0.14em] uppercase flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                      >
                        <span>OPEN LIVE WEB APPLICATION</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#14120E]" />
                      </button>

                      <button
                        onClick={() => setIsLivePreviewOpen(false)}
                        className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] active:scale-[0.98] text-white/70 hover:text-white font-sora text-[11px] tracking-[0.1em] uppercase transition-all cursor-pointer"
                      >
                        BACK TO SHOWCASE
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileDigitalProjectViewer;
