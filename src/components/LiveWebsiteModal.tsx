import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, RefreshCw, Monitor, Tablet, Smartphone, Sparkles } from 'lucide-react';
import { DigitalProject } from '../data/portfolio';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

interface DeviceConfig {
  name: string;
  frameSrc: string;
  frameAlt: string;
  aspectClass: string;
  maxWidthClass: string;
  cutoutStyle: React.CSSProperties;
  virtualWidth: number;
  virtualHeight: number;
}

const DEVICE_CONFIGS: Record<DeviceMode, DeviceConfig> = {
  desktop: {
    name: 'MacBook / Desktop',
    frameSrc: '/assets/macbook.webp',
    frameAlt: 'MacBook Pro Frame',
    aspectClass: 'aspect-[1536/1024]',
    maxWidthClass: 'max-w-[1060px]',
    cutoutStyle: {
      left: '13.80%',
      top: '4.49%',
      width: '72.40%',
      height: '68.94%',
      borderRadius: '8px 8px 0 0',
    },
    virtualWidth: 1280,
    virtualHeight: 800,
  },
  tablet: {
    name: 'Tablet Device',
    frameSrc: '',
    frameAlt: 'iPad Frame',
    aspectClass: 'aspect-[1090/900]',
    maxWidthClass: 'max-w-[780px]',
    cutoutStyle: {
      left: '14px',
      top: '14px',
      right: '14px',
      bottom: '14px',
      width: 'calc(100% - 28px)',
      height: 'calc(100% - 28px)',
      borderRadius: '16px',
    },
    virtualWidth: 1024,
    virtualHeight: 768,
  },
  mobile: {
    name: 'Mobile Device',
    frameSrc: '',
    frameAlt: 'iPhone Frame',
    aspectClass: 'aspect-[427/858]',
    maxWidthClass: 'max-w-[320px]',
    cutoutStyle: {
      left: '12px',
      top: '12px',
      right: '12px',
      bottom: '12px',
      width: 'calc(100% - 24px)',
      height: 'calc(100% - 24px)',
      borderRadius: '32px',
    },
    virtualWidth: 390,
    virtualHeight: 844,
  },
};

const FALLBACK_CUTOUT_STYLES: Record<DeviceMode, React.CSSProperties> = {
  desktop: {
    left: '10px',
    top: '10px',
    right: '10px',
    bottom: '10px',
    width: 'calc(100% - 20px)',
    height: 'calc(100% - 20px)',
    borderRadius: '10px 10px 0 0',
  },
  tablet: {
    left: '14px',
    top: '14px',
    right: '14px',
    bottom: '14px',
    width: 'calc(100% - 28px)',
    height: 'calc(100% - 28px)',
    borderRadius: '16px',
  },
  mobile: {
    left: '12px',
    top: '12px',
    right: '12px',
    bottom: '12px',
    width: 'calc(100% - 24px)',
    height: 'calc(100% - 24px)',
    borderRadius: '32px',
  },
};

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
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [frameImageErrors, setFrameImageErrors] = useState<Record<string, boolean>>({});
  const [scale, setScale] = useState(1);
  const [offsets, setOffsets] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const screenCutoutRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const currentConfig = DEVICE_CONFIGS[deviceMode];
  const hasLivePreview = project?.hasLivePreview ?? false;

  // Auto-select mobile frame on physical mobile screen width on open
  useEffect(() => {
    if (isOpen) {
      if (window.innerWidth < 640) {
        setDeviceMode('mobile');
      } else {
        setDeviceMode('desktop');
      }
    }
  }, [isOpen]);

  // Compute visual scale & precision centering for target logical viewport
  const updateScale = useCallback(() => {
    if (screenCutoutRef.current) {
      const cutoutWidth = screenCutoutRef.current.clientWidth;
      const cutoutHeight = screenCutoutRef.current.clientHeight;
      const config = DEVICE_CONFIGS[deviceMode];

      if (cutoutWidth > 0 && config.virtualWidth > 0) {
        const newScale = cutoutWidth / config.virtualWidth;
        setScale((prev) => (Math.abs(prev - newScale) > 0.001 ? newScale : prev));

        const scaledHeight = config.virtualHeight * newScale;
        const scaledWidth = config.virtualWidth * newScale;
        const offsetY = Math.max(0, (cutoutHeight - scaledHeight) / 2);
        const offsetX = Math.max(0, (cutoutWidth - scaledWidth) / 2);

        setOffsets((prev) =>
          Math.abs(prev.x - offsetX) > 0.5 || Math.abs(prev.y - offsetY) > 0.5
            ? { x: offsetX, y: offsetY }
            : prev
        );
      }
    }
  }, [deviceMode]);

  // Responsive scale synchronization without continuous polling or RAF loops
  useEffect(() => {
    if (!isOpen) return;

    updateScale();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && screenCutoutRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateScale();
      });
      resizeObserver.observe(screenCutoutRef.current);
    }

    // Settle calculation after Framer Motion modal scale entrance (450ms)
    const animTimer = setTimeout(updateScale, 450);

    // Debounced window resize listener (fires only on true window resize)
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateScale, 60);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(animTimer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [isOpen, updateScale]);

  // Re-measure scale whenever device mode changes
  useEffect(() => {
    if (!isOpen) return;
    updateScale();
    const timer = setTimeout(updateScale, 50);
    return () => clearTimeout(timer);
  }, [deviceMode, isOpen, updateScale]);

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

  const handleFrameImageError = (mode: DeviceMode) => {
    setFrameImageErrors((prev) => ({ ...prev, [mode]: true }));
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
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} Interactive Preview`}
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-[1320px] max-h-[96vh] mx-3 sm:mx-8 flex flex-col items-center bg-[#FAF6F0] rounded-[24px] sm:rounded-[28px] border border-[#D4A94E]/40 shadow-2xl shadow-black/50 overflow-hidden"
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
          <div className="w-full px-4 sm:px-8 py-3.5 sm:py-4 border-b border-[#D4A94E]/25 flex items-center justify-between relative z-10 bg-[#FAF6F0]/90 backdrop-blur-sm gap-2">
            {/* Project Title & Category */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#7A1C28]/10 border border-[#7A1C28]/25 flex items-center justify-center text-[#7A1C28] shrink-0">
                <Monitor className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-playfair font-bold text-[16px] sm:text-[20px] text-charcoal-900 leading-tight truncate">
                    {project.title}
                  </h3>
                  <span className="hidden xs:inline text-[9px] sm:text-[10px] font-sora font-semibold px-2 py-0.5 rounded-full bg-[#D4A94E]/15 text-[#9A7209] border border-[#D4A94E]/30 uppercase tracking-wider shrink-0">
                    {project.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[12px] font-sora text-charcoal-500 truncate max-w-[160px] xs:max-w-[220px] sm:max-w-[350px]">
                  {project.categoryLabel}
                </p>
              </div>
            </div>

            {/* Device Switcher (Desktop / Tablet / Mobile) */}
            <div className="flex items-center gap-1 bg-cream-100/70 p-1 rounded-full border border-[#D4A94E]/25 shrink-0">
              <button
                type="button"
                onClick={() => setDeviceMode('desktop')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-sora font-semibold transition-all cursor-pointer ${
                  deviceMode === 'desktop'
                    ? 'bg-[#7A1C28] text-white shadow-sm'
                    : 'text-charcoal-700 hover:text-charcoal-900 hover:bg-cream-100/60'
                }`}
                title="Desktop / MacBook View (1280x800)"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Desktop / MacBook</span>
                <span className="hidden md:inline lg:hidden">Desktop</span>
              </button>

              <button
                type="button"
                onClick={() => setDeviceMode('tablet')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-sora font-semibold transition-all cursor-pointer ${
                  deviceMode === 'tablet'
                    ? 'bg-[#7A1C28] text-white shadow-sm'
                    : 'text-charcoal-700 hover:text-charcoal-900 hover:bg-cream-100/60'
                }`}
                title="Tablet View (1024x768)"
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Tablet</span>
              </button>

              <button
                type="button"
                onClick={() => setDeviceMode('mobile')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-sora font-semibold transition-all cursor-pointer ${
                  deviceMode === 'mobile'
                    ? 'bg-[#7A1C28] text-white shadow-sm'
                    : 'text-charcoal-700 hover:text-charcoal-900 hover:bg-cream-100/60'
                }`}
                title="Mobile View (390x844)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Mobile</span>
              </button>
            </div>

            {/* Actions: Direct Link, Reload, Close */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-[#7A1C28] hover:bg-[#63141F] text-white border border-[#7A1C28]/40 text-[11px] sm:text-[12px] font-sora font-medium transition-all shadow-sm"
                  title="Open live site in new tab"
                >
                  <span className="hidden sm:inline">Launch Live</span>
                  <span className="sm:hidden">Live</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {hasLivePreview && project.url && (
                <button
                  onClick={handleReload}
                  className="p-1.5 sm:p-2 rounded-full bg-cream-50 hover:bg-cream-200 text-charcoal-700 border border-[#D4A94E]/30 transition-all cursor-pointer"
                  title="Reload Live View"
                >
                  <RefreshCw className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              )}

              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-full bg-[#7A1C28]/10 hover:bg-[#7A1C28] text-[#7A1C28] hover:text-white border border-[#7A1C28]/30 transition-all cursor-pointer"
                title="Close (ESC)"
              >
                <X className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Main Modal Body: Scaled Mockup Device Frame containing Live Screen */}
          <div className="w-full flex-1 p-3 sm:p-6 md:p-8 flex items-center justify-center overflow-y-auto relative z-10 min-h-0">
            <div
              className={`relative ${
                deviceMode === 'mobile'
                  ? 'w-[min(82vw,320px,33.5vh)] aspect-[427/858]'
                  : deviceMode === 'tablet'
                  ? 'w-full max-w-[740px] aspect-[1090/900] max-h-[66vh]'
                  : 'w-full max-w-[1060px] aspect-[1536/1024] max-h-[66vh]'
              } flex items-center justify-center select-none transition-all duration-300 mx-auto shrink-0`}
            >
              {/* Screen Display Container behind the Mockup Frame Cutout */}
              <div
                ref={screenCutoutRef}
                className="absolute overflow-hidden bg-black flex items-center justify-center"
                style={{
                  ...(currentConfig.frameSrc && !frameImageErrors[deviceMode]
                    ? currentConfig.cutoutStyle
                    : FALLBACK_CUTOUT_STYLES[deviceMode]),
                  overflow: 'hidden',
                }}
              >
                {/* 1. Loading State (for live iframe) */}
                {hasLivePreview && isLoading && (
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0E0E10] text-cream-100 gap-3">
                    <div className="w-9 h-9 rounded-full border-2 border-[#D4A94E]/30 border-t-[#D4A94E] animate-spin" />
                    <p className="font-sora text-[11px] sm:text-[12px] text-cream-300 tracking-wider">
                      Connecting live interface ({currentConfig.name})...
                    </p>
                  </div>
                )}

                {/* 2. CASE: Live Iframe Embeddable with Responsive Logical Viewport */}
                {hasLivePreview && project.url && !hasError ? (
                  <div
                    ref={viewportRef}
                    className="absolute origin-top-left pointer-events-auto rounded-[inherit] overflow-hidden"
                    style={{
                      width: `${currentConfig.virtualWidth}px`,
                      height: `${currentConfig.virtualHeight}px`,
                      transform: `scale(${scale})`,
                      transformOrigin: '0 0',
                      left: `${offsets.x}px`,
                      top: `${offsets.y}px`,
                      borderRadius: 'inherit',
                      overflow: 'hidden',
                    }}
                  >
                    <iframe
                      key={`${iframeKey}-${deviceMode}`}
                      ref={iframeRef}
                      src={project.url}
                      title={`${project.title} - ${currentConfig.name}`}
                      onLoad={handleIframeLoad}
                      onError={handleIframeError}
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
                      className="w-full h-full border-0 bg-white rounded-[inherit] overflow-hidden"
                    />
                  </div>
                ) : (
                  /* 3. CASE: High-Res Interactive Scrollable View (Webapp or Restricted Preview) */
                  <div className="w-full h-full overflow-y-auto relative bg-[#12100E] scrollbar-thin scrollbar-thumb-[#D4A94E]/40 rounded-[inherit]">
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
                          className="pointer-events-auto px-4 py-2 rounded-full bg-[#7A1C28] hover:bg-[#63141F] text-white text-[11px] font-sora font-semibold shadow-2xl flex items-center gap-1.5 transform hover:scale-105 transition-transform border border-white/20"
                        >
                          <span>Open Active Web App</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Hardware Frame: PNG Overlay if provided (MacBook Pro) */}
              {currentConfig.frameSrc && !frameImageErrors[deviceMode] && (
                <img
                  src={currentConfig.frameSrc}
                  alt={currentConfig.frameAlt}
                  onError={() => handleFrameImageError(deviceMode)}
                  className="w-full h-full object-contain pointer-events-none relative z-20 drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
                  draggable={false}
                />
              )}

              {/* High-Fidelity Hardware CSS Frame if frameSrc is empty or asset failed */}
              {(!currentConfig.frameSrc || frameImageErrors[deviceMode]) && (
                <div
                  className="absolute inset-0 pointer-events-none z-20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65)]"
                  style={{
                    borderRadius: deviceMode === 'mobile' ? '44px' : deviceMode === 'tablet' ? '24px' : '16px',
                    border: deviceMode === 'mobile' ? '12px solid #1C1C1E' : deviceMode === 'tablet' ? '14px solid #1C1C1E' : '10px solid #1C1C1E',
                    boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.12), 0 20px 40px rgba(0,0,0,0.4)',
                  }}
                >
                  {/* Dynamic Island and Home Indicator for mobile */}
                  {deviceMode === 'mobile' && (
                    <>
                      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-30 flex items-center justify-end pr-2 gap-1 border border-white/10 shadow-sm">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-[#222]" />
                      </div>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/40 rounded-full z-30 pointer-events-none" />
                    </>
                  )}
                  {/* Front camera for tablet */}
                  {deviceMode === 'tablet' && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#0a0a0a] rounded-full z-30 border border-[#333]" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Bar Details & Context */}
          <div className="w-full px-5 sm:px-8 py-3 border-t border-[#D4A94E]/25 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left relative z-10 bg-[#FAF6F0]/90">
            <div className="flex items-center gap-2 text-[11px] sm:text-[12px] font-sora text-charcoal-600 min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
              <span className="truncate max-w-[340px] sm:max-w-none">
                {project.description} — <span className="text-[#7A1C28] font-semibold">{currentConfig.name}</span> preview ({currentConfig.virtualWidth}×{currentConfig.virtualHeight})
              </span>
            </div>

            {project.tools && project.tools.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap justify-center shrink-0">
                {project.tools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="text-[9.5px] sm:text-[10px] font-sora px-2.5 py-0.5 rounded-full bg-[#E5C89C]/20 text-charcoal-700 border border-[#D4A94E]/30"
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
