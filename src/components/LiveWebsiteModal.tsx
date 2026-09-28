import React, { useEffect, useState, useRef } from 'react';
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
    name: 'MacBook Pro',
    frameSrc: '/assets/macbook.png',
    frameAlt: 'MacBook Frame',
    aspectClass: 'aspect-[1536/1024]',
    maxWidthClass: 'max-w-[1060px]',
    cutoutStyle: {
      left: '13.80%',
      top: '4.49%',
      width: '72.40%',
      height: '68.94%',
      borderRadius: '12px 12px 0 0',
    },
    virtualWidth: 1280,
    virtualHeight: 800,
  },
  tablet: {
    name: 'iPad Pro',
    frameSrc: '/assets/ipad-mockup.png',
    frameAlt: 'iPad Frame',
    aspectClass: 'aspect-[1090/900]',
    maxWidthClass: 'max-w-[780px]',
    cutoutStyle: {
      left: '3.94%',
      top: '5.33%',
      width: '91.83%',
      height: '89.56%',
      borderRadius: '16px',
    },
    virtualWidth: 1024,
    virtualHeight: 825,
  },
  mobile: {
    name: 'iPhone 15',
    frameSrc: '/assets/iphone-mockup.png',
    frameAlt: 'iPhone Frame',
    aspectClass: 'aspect-[427/858]',
    maxWidthClass: 'max-w-[330px] sm:max-w-[360px]',
    cutoutStyle: {
      left: '7.96%',
      top: '8.97%',
      width: '83.37%',
      height: '87.65%',
      borderRadius: '28px',
    },
    virtualWidth: 390,
    virtualHeight: 825,
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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const screenCutoutRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

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

  // Compute responsive scale for embedded iframe whenever cutout or device changes
  useEffect(() => {
    if (!isOpen) return;

    const updateScale = () => {
      if (screenCutoutRef.current) {
        const width = screenCutoutRef.current.clientWidth;
        const config = DEVICE_CONFIGS[deviceMode];
        if (width > 0 && config.virtualWidth > 0) {
          setScale(width / config.virtualWidth);
        }
      }
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (screenCutoutRef.current) {
      ro.observe(screenCutoutRef.current);
    }
    return () => ro.disconnect();
  }, [isOpen, deviceMode]);

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
          <div className="w-full px-4 sm:px-8 py-3 sm:py-4 border-b border-[#D4A94E]/25 flex flex-wrap items-center justify-between gap-3 relative z-10 bg-[#FAF6F0]/90 backdrop-blur-sm">
            {/* Project Title & Category */}
            <div className="flex items-center gap-3">
              <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-[#7A1C28]/10 border border-[#7A1C28]/25 flex items-center justify-center text-[#7A1C28] shrink-0">
                {deviceMode === 'desktop' ? (
                  <Monitor className="w-4 h-4" />
                ) : deviceMode === 'tablet' ? (
                  <Tablet className="w-4 h-4" />
                ) : (
                  <Smartphone className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-playfair font-bold text-[16px] sm:text-[19px] text-charcoal-900 leading-tight truncate">
                    {project.title}
                  </h3>
                  <span className="text-[9px] sm:text-[10px] font-sora font-semibold px-2 py-0.5 rounded-full bg-[#D4A94E]/15 text-[#9A7209] border border-[#D4A94E]/30 uppercase tracking-wider shrink-0">
                    {project.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] font-sora text-charcoal-500 truncate max-w-[200px] sm:max-w-[320px]">
                  {project.categoryLabel}
                </p>
              </div>
            </div>

            {/* Device Switcher Controls (Desktop / Tablet / Mobile) */}
            <div className="flex items-center p-1 bg-cream-200/90 rounded-full border border-[#D4A94E]/30 shadow-inner order-last sm:order-none mx-auto sm:mx-0">
              <button
                type="button"
                onClick={() => setDeviceMode('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-sora font-semibold transition-all cursor-pointer ${
                  deviceMode === 'desktop'
                    ? 'bg-[#7A1C28] text-white shadow-sm'
                    : 'text-charcoal-700 hover:text-charcoal-900 hover:bg-cream-100/60'
                }`}
                title="Desktop View (MacBook)"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Desktop</span>
              </button>

              <button
                type="button"
                onClick={() => setDeviceMode('tablet')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-sora font-semibold transition-all cursor-pointer ${
                  deviceMode === 'tablet'
                    ? 'bg-[#7A1C28] text-white shadow-sm'
                    : 'text-charcoal-700 hover:text-charcoal-900 hover:bg-cream-100/60'
                }`}
                title="Tablet View (iPad)"
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Tablet</span>
              </button>

              <button
                type="button"
                onClick={() => setDeviceMode('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-sora font-semibold transition-all cursor-pointer ${
                  deviceMode === 'mobile'
                    ? 'bg-[#7A1C28] text-white shadow-sm'
                    : 'text-charcoal-700 hover:text-charcoal-900 hover:bg-cream-100/60'
                }`}
                title="Mobile View (iPhone)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Mobile</span>
              </button>
            </div>

            {/* Actions: Direct Link, Reload, Close */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#7A1C28] hover:bg-[#63141F] text-white border border-[#7A1C28]/40 text-[11px] sm:text-[12px] font-sora font-medium transition-all shadow-sm"
                  title="Open live site in new tab"
                >
                  <span>Launch</span>
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
              className={`relative w-full ${currentConfig.maxWidthClass} ${currentConfig.aspectClass} max-h-[62vh] sm:max-h-[68vh] flex items-center justify-center select-none transition-all duration-300`}
            >
              {/* Screen Display Container behind the Mockup Frame Cutout */}
              <div
                ref={screenCutoutRef}
                className="absolute overflow-hidden bg-black flex items-center justify-center"
                style={currentConfig.cutoutStyle}
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

                {/* 2. CASE: Live Iframe Embeddable with Responsive Virtual Viewport */}
                {hasLivePreview && project.url && !hasError ? (
                  <div
                    className="absolute top-0 left-0 origin-top-left pointer-events-auto"
                    style={{
                      width: `${currentConfig.virtualWidth}px`,
                      height: `${currentConfig.virtualHeight}px`,
                      transform: `scale(${scale})`,
                      transformOrigin: '0 0',
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
                      className="w-full h-full border-0 bg-white"
                    />
                  </div>
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

              {/* Hardware PNG Overlay Frame */}
              <img
                src={currentConfig.frameSrc}
                alt={currentConfig.frameAlt}
                className="w-full h-full object-contain pointer-events-none relative z-20 drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
                draggable={false}
              />
            </div>
          </div>

          {/* Bottom Bar Details & Context */}
          <div className="w-full px-5 sm:px-8 py-3 border-t border-[#D4A94E]/25 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left relative z-10 bg-[#FAF6F0]/90">
            <div className="flex items-center gap-2 text-[11px] sm:text-[12px] font-sora text-charcoal-600">
              <Sparkles className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
              <span className="truncate max-w-[340px] sm:max-w-none">
                {project.description} — <span className="text-[#7A1C28] font-semibold">{currentConfig.name}</span> preview
              </span>
            </div>

            {project.tools && project.tools.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
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
