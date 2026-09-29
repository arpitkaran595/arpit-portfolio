import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, RefreshCw, Monitor, Sparkles } from 'lucide-react';
import { DigitalProject } from '../data/portfolio';

interface LiveWebsiteModalProps {
  project: DigitalProject | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveWebsiteModal({
  project,
  isOpen,
  onClose,
}: LiveWebsiteModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const hasLivePreview = project?.hasLivePreview ?? false;

  // Reset states when project changes or modal opens
  useEffect(() => {
    if (isOpen && project) {
      setIsLoading(hasLivePreview);
      setHasError(false);
      setIframeKey((prev) => prev + 1);

      // Lock body scroll
      document.body.style.overflow = 'hidden';
      if ((window as any).lenis) {
        (window as any).lenis.stop();
      }
    } else {
      document.body.style.overflow = '';
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
    }

    return () => {
      document.body.style.overflow = '';
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
    };
  }, [isOpen, project, hasLivePreview]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Timeout fallback in case iframe hangs on network request
  useEffect(() => {
    if (!isOpen || !hasLivePreview || !project?.url) return;

    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isOpen, project, isLoading, hasLivePreview]);

  if (!isOpen || !project) return null;

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleReload = () => {
    setIsLoading(true);
    setHasError(false);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#1A1412]/85 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-[1320px] max-h-[96vh] mx-4 sm:mx-8 flex flex-col items-center bg-[#FAF6F0] rounded-[28px] border border-[#D4A94E]/40 shadow-2xl shadow-black/50 overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(246, 215, 178, 0.25) 0%, rgba(250, 246, 240, 0.95) 70%)`,
          }}
        >
          {/* Subtle noise overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
            style={{ backgroundImage: 'url(/assets/noise-grain.png)' }}
          />

          {/* Top Bar / Header */}
          <div className="w-full px-6 sm:px-8 py-4 border-b border-[#D4A94E]/25 flex items-center justify-between relative z-10 bg-[#FAF6F0]/90 backdrop-blur-sm">
            {/* Project Title & Category */}
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-[#7A1C28]/10 border border-[#7A1C28]/25 flex items-center justify-center text-[#7A1C28]">
                <Monitor className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-playfair font-bold text-[18px] sm:text-[20px] text-charcoal-900 leading-tight">
                    {project.title}
                  </h3>
                  <span className="text-[10px] font-sora font-semibold px-2 py-0.5 rounded-full bg-[#D4A94E]/15 text-[#9A7209] border border-[#D4A94E]/30 uppercase tracking-wider">
                    {project.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] sm:text-[12px] font-sora text-charcoal-500 truncate max-w-[280px] sm:max-w-[450px]">
                  {project.categoryLabel}
                </p>
              </div>
            </div>

            {/* Actions: Direct Link, Reload, Close */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#7A1C28] hover:bg-[#63141F] text-white border border-[#7A1C28]/40 text-[12px] font-sora font-medium transition-all shadow-sm"
                  title="Open live site in new tab"
                >
                  <span>Launch Live</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {hasLivePreview && project.url && (
                <button
                  onClick={handleReload}
                  className="p-2 rounded-full bg-cream-50 hover:bg-cream-200 text-charcoal-700 border border-[#D4A94E]/30 transition-all cursor-pointer"
                  title="Reload Live View"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              )}

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-[#7A1C28]/10 hover:bg-[#7A1C28] text-[#7A1C28] hover:text-white border border-[#7A1C28]/30 transition-all ml-1 cursor-pointer"
                title="Close (ESC)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Modal Body: Scaled-up MacBook Frame containing Live Screen */}
          <div className="w-full flex-1 p-4 sm:p-6 md:p-8 flex items-center justify-center overflow-y-auto relative z-10">
            <div className="relative w-full max-w-[1060px] aspect-[1536/1024] flex items-center justify-center select-none">
              {/* Screen Display Container behind the MacBook Frame Cutout */}
              <div
                className="absolute overflow-hidden bg-black flex items-center justify-center"
                style={{
                  left: '13.80%',
                  top: '4.49%',
                  width: '72.40%',
                  height: '68.94%',
                  borderRadius: '12px 12px 0 0',
                }}
              >
                {/* 1. Loading State (for live iframe) */}
                {hasLivePreview && isLoading && (
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0E0E10] text-cream-100 gap-3">
                    <div className="w-9 h-9 rounded-full border-2 border-[#D4A94E]/30 border-t-[#D4A94E] animate-spin" />
                    <p className="font-sora text-[12px] text-cream-300 tracking-wider">
                      Connecting live interface...
                    </p>
                  </div>
                )}

                {/* 2. CASE: Live Iframe Embeddable */}
                {hasLivePreview && project.url && !hasError ? (
                  <iframe
                    key={iframeKey}
                    ref={iframeRef}
                    src={project.url}
                    title={project.title}
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
                    className="w-full h-full border-0 bg-white"
                  />
                ) : (
                  /* 3. CASE: High-Res Interactive Scrollable View (Webapp or Restricted Preview) */
                  <div className="w-full h-full overflow-y-auto relative bg-[#12100E] scrollbar-thin scrollbar-thumb-[#D4A94E]/40">
                    <img
                      src={project.tallPreviewImage || project.previewImage}
                      alt={project.title}
                      className="w-full h-auto block select-none"
                    />

                    {/* Subtle floating launch CTA at bottom of preview */}
                    {project.url && (
                      <div className="sticky bottom-4 inset-x-0 flex justify-center pointer-events-none mt-4">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pointer-events-auto px-5 py-2.5 rounded-full bg-[#7A1C28] hover:bg-[#63141F] text-white text-[12px] font-sora font-semibold shadow-2xl flex items-center gap-2 transform hover:scale-105 transition-transform border border-white/20"
                        >
                          <span>Open Active Web App</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Hardware MacBook PNG Overlay Frame */}
              <img
                src="/assets/macbook.png"
                alt="MacBook Frame"
                className="w-full h-full object-contain pointer-events-none relative z-20 drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
                draggable={false}
              />
            </div>
          </div>

          {/* Bottom Bar Details & Context */}
          <div className="w-full px-6 sm:px-8 py-3.5 border-t border-[#D4A94E]/25 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left relative z-10 bg-[#FAF6F0]/90">
            <div className="flex items-center gap-2 text-[12px] font-sora text-charcoal-600">
              <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>{project.description}</span>
            </div>

            {project.tools && project.tools.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                {project.tools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-sora px-2.5 py-0.5 rounded-full bg-[#E5C89C]/20 text-charcoal-700 border border-[#D4A94E]/30"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
