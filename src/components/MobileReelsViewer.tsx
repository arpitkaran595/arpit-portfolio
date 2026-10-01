import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  Maximize2,
  Minimize2,
  ChevronDown,
} from 'lucide-react';
import {
  featuredVideos,
  FeaturedVideo,
  SOFTWARE_ICON_MAP,
  SoftwareIconType,
} from '../data/portfolio';
import { MediaViewerItem } from './MediaViewer';

interface MobileReelsViewerProps {
  isOpen: boolean;
  onClose: () => void;
  item: MediaViewerItem | null;
  onActiveVideoChange?: (video: FeaturedVideo) => void;
}

// Compact Software Badge helper
const SoftwareBadge: React.FC<{ iconKey?: string; label?: string }> = ({ iconKey, label }) => {
  const meta = iconKey ? SOFTWARE_ICON_MAP[iconKey as SoftwareIconType] : undefined;

  switch (iconKey) {
    case 'after-effects':
      return (
        <div
          title={label || 'Adobe After Effects'}
          className="w-8 h-8 rounded-lg bg-[#171026] border border-[#9999FF]/40 flex items-center justify-center shadow-md flex-shrink-0 select-none"
        >
          <span className="text-[#9999FF] text-xs font-sora font-extrabold tracking-tighter leading-none">Ae</span>
        </div>
      );
    case 'premiere-pro':
      return (
        <div
          title={label || 'Adobe Premiere Pro'}
          className="w-8 h-8 rounded-lg bg-[#1A0E2B] border border-[#EA77FF]/40 flex items-center justify-center shadow-md flex-shrink-0 select-none"
        >
          <span className="text-[#EA77FF] text-xs font-sora font-extrabold tracking-tighter leading-none">Pr</span>
        </div>
      );
    case 'photoshop':
      return (
        <div
          title={label || 'Adobe Photoshop'}
          className="w-8 h-8 rounded-lg bg-[#001E36] border border-[#31A8FF]/40 flex items-center justify-center shadow-md flex-shrink-0 select-none"
        >
          <span className="text-[#31A8FF] text-xs font-sora font-extrabold tracking-tighter leading-none">Ps</span>
        </div>
      );
    case 'figma':
      return (
        <div
          title={label || 'Figma'}
          className="w-8 h-8 rounded-lg bg-[#1E1E1E] border border-white/20 flex items-center justify-center shadow-md flex-shrink-0 select-none"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M8 2h4v4H8V2z" fill="#F24E1E"/>
            <path d="M12 2h4a4 4 0 0 1 0 8h-4V2z" fill="#FF7262"/>
            <path d="M8 6h4v4H8V6z" fill="#A259FF"/>
            <path d="M8 10h4v4H8v-4z" fill="#1ABCFE"/>
            <path d="M8 14h4a4 4 0 1 1-4 4v-4z" fill="#0ACF83"/>
          </svg>
        </div>
      );
    case 'capcut':
      return (
        <div
          title={label || 'CapCut'}
          className="w-8 h-8 rounded-lg bg-black border border-white/25 flex items-center justify-center shadow-md flex-shrink-0 select-none"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
            <path d="M4 6.5C4 5.12 5.12 4 6.5 4h11C18.88 4 20 5.12 20 6.5v11c0 1.38-1.12 2.5-2.5 2.5h-11C5.12 20 4 18.88 4 17.5v-11zm8 2.5l-4 6h8l-4-6z" />
          </svg>
        </div>
      );
    default:
      return (
        <div
          title={label || 'Creative Cloud'}
          className="w-8 h-8 rounded-lg bg-[#222] border border-[#D4C3A3]/40 flex items-center justify-center shadow-md flex-shrink-0 select-none"
        >
          <span className="text-[#C4943A] text-xs font-sora font-bold leading-none">
            {meta?.name ? meta.name.slice(0, 2).toUpperCase() : 'CC'}
          </span>
        </div>
      );
  }
};

export const MobileReelsViewer: React.FC<MobileReelsViewerProps> = ({
  isOpen,
  onClose,
  item,
  onActiveVideoChange,
}) => {
  // Construct videos playlist starting from featuredVideos
  const playlist = useMemo<FeaturedVideo[]>(() => {
    if (!item) return featuredVideos;
    const exists = featuredVideos.some(
      (v) => v.id === item.id || v.videoUrl === item.videoUrl || v.title === item.title
    );
    if (exists) return featuredVideos;

    // Synthesize item as a FeaturedVideo if not directly present
    const customVideo: FeaturedVideo = {
      id: item.id || 'custom-vid',
      index: '01',
      title: item.title,
      titleLine1: item.title,
      highlightWord: '',
      category: item.category || 'Video Project',
      duration: item.duration || '0:30',
      videoUrl: item.videoUrl || '',
      description: item.description,
      poster: item.thumbnail,
      projectInfo: {
        category: item.category || 'Video Project',
        software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      },
    };
    return [customVideo, ...featuredVideos];
  }, [item]);

  const totalVideos = playlist.length;

  // Determine initial video index matching the opened item
  const initialIndex = useMemo(() => {
    if (!item) return 0;
    const foundIdx = playlist.findIndex(
      (v) => v.id === item.id || v.videoUrl === item.videoUrl || v.title === item.title
    );
    return foundIdx >= 0 ? foundIdx : 0;
  }, [item, playlist]);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubProgress, setScrubProgress] = useState(0);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [playFeedback, setPlayFeedback] = useState<'play' | 'pause' | null>(null);
  const [likes, setLikes] = useState<Record<string, { count: number; isLiked: boolean }>>({});
  const [aspectRatioMap, setAspectRatioMap] = useState<Record<string, 'portrait' | 'landscape'>>({});
  const [doubleTapHeart, setDoubleTapHeart] = useState<{ id: string } | null>(null);

  // User audio preference: null = unselected (attempt unmuted), false = explicitly unmuted, true = explicitly muted
  const userAudioPrefRef = useRef<boolean | null>(null);

  // Dedicated Fullscreen State (Portrait & Landscape)
  const [fullscreenVideo, setFullscreenVideo] = useState<{
    video: FeaturedVideo;
    time: number;
    isLandscape: boolean;
  } | null>(null);
  const [showFullscreenControls, setShowFullscreenControls] = useState(true);
  const fullscreenControlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const fullscreenVideoRef = useRef<HTMLVideoElement | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isWheelingRef = useRef(false);
  const lastTapTimeRef = useRef(0);
  const wasPlayingBeforeScrubRef = useRef(false);

  // Sync index when initialIndex changes on open
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsPlaying(true);
      setProgress(0);
      setScrubProgress(0);
      setIsScrubbing(false);
      setShowSwipeHint(true);
      setFullscreenVideo(null);
      // Attempt unmuted playback when opened if user hasn't explicitly set preference to muted
      if (userAudioPrefRef.current === null) {
        setIsMuted(false);
      }
    }
  }, [isOpen, initialIndex]);

  // Reset seekbar state on reel slide change
  useEffect(() => {
    setProgress(0);
    setScrubProgress(0);
    setIsScrubbing(false);
  }, [currentIndex]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [isOpen]);

  // Scroll to active index instantly on mount
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const targetTop = initialIndex * containerRef.current.clientHeight;
      containerRef.current.scrollTo({ top: targetTop, behavior: 'instant' as ScrollBehavior });
    }
  }, [isOpen, initialIndex]);

  // Programmatic scroll helper for next/prev
  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    if (!containerRef.current) return;
    const clamped = Math.max(0, Math.min(index, totalVideos - 1));
    const targetTop = clamped * containerRef.current.clientHeight;
    containerRef.current.scrollTo({ top: targetTop, behavior });
  }, [totalVideos]);

  // Keyboard navigation support
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (fullscreenVideo) {
        if (e.key === 'Escape') {
          e.preventDefault();
          handleExitFullscreen();
        }
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentIndex < totalVideos - 1) scrollToIndex(currentIndex + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentIndex > 0) scrollToIndex(currentIndex - 1);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, totalVideos, fullscreenVideo, scrollToIndex, onClose]);

  // Handle intersection / scroll snapping
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    if (clientHeight <= 0) return;

    const newIdx = Math.round(scrollTop / clientHeight);
    if (newIdx >= 0 && newIdx < totalVideos && newIdx !== currentIndex) {
      setCurrentIndex(newIdx);
      setIsPlaying(true);
      setProgress(0);
      if (showSwipeHint) setShowSwipeHint(false);

      const activeVid = playlist[newIdx];
      if (activeVid && onActiveVideoChange) {
        onActiveVideoChange(activeVid);
      }
    }
  }, [currentIndex, totalVideos, playlist, onActiveVideoChange, showSwipeHint]);

  // Trackpad / Wheel debounced navigation
  const handleWheel = (e: React.WheelEvent) => {
    if (isWheelingRef.current) return;
    if (Math.abs(e.deltaY) < 28) return;

    isWheelingRef.current = true;
    if (e.deltaY > 0) {
      if (currentIndex < totalVideos - 1) scrollToIndex(currentIndex + 1);
    } else {
      if (currentIndex > 0) scrollToIndex(currentIndex - 1);
    }

    setTimeout(() => {
      isWheelingRef.current = false;
    }, 420);
  };

  // Autoplay current active video & pause others
  useEffect(() => {
    if (!isOpen || fullscreenVideo) return;

    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentIndex) {
        vid.muted = isMuted;
        if (isPlaying) {
          const playPromise = vid.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Autoplay with sound restricted by browser policy -> graceful fallback to muted
              if (!vid.muted) {
                vid.muted = true;
                if (userAudioPrefRef.current !== false) {
                  setIsMuted(true);
                }
                vid.play().catch(() => {});
              }
            });
          }
        } else {
          vid.pause();
        }
      } else {
        vid.pause();
        vid.currentTime = 0;
      }
    });
  }, [currentIndex, isPlaying, isMuted, isOpen, fullscreenVideo]);

  // Detect landscape vs portrait dynamically on metadata load
  const handleVideoMetadata = (id: string, el: HTMLVideoElement) => {
    if (el.videoWidth && el.videoHeight) {
      const isLand = el.videoWidth > el.videoHeight;
      setAspectRatioMap((prev) => ({
        ...prev,
        [id]: isLand ? 'landscape' : 'portrait',
      }));
    }
  };

  // Toggle Play / Pause on video tap & handle Double-Tap to Like
  const handleCardTap = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    const now = Date.now();
    const timeSinceLast = now - lastTapTimeRef.current;
    lastTapTimeRef.current = now;

    const targetVid = playlist[idx];
    if (!targetVid) return;

    if (showSwipeHint) setShowSwipeHint(false);

    // Double tap triggers Like!
    if (timeSinceLast < 300) {
      handleToggleLike(targetVid.id, true);
      setDoubleTapHeart({ id: targetVid.id });
      setTimeout(() => setDoubleTapHeart(null), 700);
      return;
    }

    // Single tap toggles play/pause
    const currentVid = videoRefs.current[idx];
    if (!currentVid) return;

    if (currentVid.paused) {
      currentVid.play().then(() => setIsPlaying(true)).catch(() => {});
      triggerFeedback('play');
    } else {
      currentVid.pause();
      setIsPlaying(false);
      triggerFeedback('pause');
    }
  };

  const triggerFeedback = (type: 'play' | 'pause') => {
    setPlayFeedback(type);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => {
      setPlayFeedback(null);
      feedbackTimerRef.current = null;
    }, 450);
  };

  // Toggle Mute / Unmute
  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    userAudioPrefRef.current = nextMuted;
    setIsMuted(nextMuted);
    const currentVid = videoRefs.current[currentIndex];
    if (currentVid) {
      currentVid.muted = nextMuted;
      if (!nextMuted && currentVid.paused && isPlaying) {
        currentVid.play().catch(() => {});
      }
    }
  };

  // Like interaction
  const handleToggleLike = (id: string, forceLike = false) => {
    setLikes((prev) => {
      const current = prev[id] || { count: 124 + (id.charCodeAt(id.length - 1) % 40), isLiked: false };
      if (forceLike && current.isLiked) return prev;
      const isLiked = forceLike ? true : !current.isLiked;
      const count = isLiked ? current.count + 1 : current.count - 1;
      return { ...prev, [id]: { count, isLiked } };
    });
  };

  // Video progress updater
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (isScrubbing) return;
    const vid = e.currentTarget;
    if (vid && vid.duration > 0) {
      setProgress((vid.currentTime / vid.duration) * 100);
    }
  };

  // Thin Seekbar Handlers (tap to jump & smooth drag scrubbing)
  const calculateSeekRatio = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    const clickX = e.clientX - rect.left;
    return Math.max(0, Math.min(1, clickX / rect.width));
  };

  const handleSeekPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    vidEl: HTMLVideoElement | null
  ) => {
    e.stopPropagation();
    if (!vidEl || !vidEl.duration) return;

    if (showSwipeHint) setShowSwipeHint(false);

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}

    wasPlayingBeforeScrubRef.current = !vidEl.paused;
    vidEl.pause();

    const ratio = calculateSeekRatio(e);
    const newPct = ratio * 100;
    setIsScrubbing(true);
    setScrubProgress(newPct);
    setProgress(newPct);
    vidEl.currentTime = ratio * vidEl.duration;
  };

  const handleSeekPointerMove = (
    e: React.PointerEvent<HTMLDivElement>,
    vidEl: HTMLVideoElement | null
  ) => {
    if (!isScrubbing || !vidEl || !vidEl.duration) return;
    e.stopPropagation();
    const ratio = calculateSeekRatio(e);
    const newPct = ratio * 100;
    setScrubProgress(newPct);
    setProgress(newPct);
    vidEl.currentTime = ratio * vidEl.duration;
  };

  const handleSeekPointerUp = (
    e: React.PointerEvent<HTMLDivElement>,
    vidEl: HTMLVideoElement | null
  ) => {
    if (!isScrubbing) return;
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    setIsScrubbing(false);

    if (vidEl && wasPlayingBeforeScrubRef.current && isPlaying) {
      vidEl.play().catch(() => {});
    }
  };

  const showControlsTemporarily = useCallback(() => {
    setShowFullscreenControls(true);
    if (fullscreenControlsTimerRef.current) clearTimeout(fullscreenControlsTimerRef.current);
    fullscreenControlsTimerRef.current = setTimeout(() => {
      setShowFullscreenControls(false);
    }, 3000);
  }, []);

  // Dedicated Fullscreen Handlers (Portrait & Landscape)
  const handleEnterFullscreen = (
    video: FeaturedVideo,
    activeEl: HTMLVideoElement | null,
    isLandscape: boolean
  ) => {
    const time = activeEl ? activeEl.currentTime : 0;
    if (activeEl) activeEl.pause();
    setFullscreenVideo({ video, time, isLandscape });
    showControlsTemporarily();

    // Programmatic orientation lock when supported
    if (isLandscape && typeof window !== 'undefined' && 'screen' in window && window.screen.orientation) {
      const orientation = window.screen.orientation as any;
      if (typeof orientation.lock === 'function') {
        orientation.lock('landscape').catch(() => {});
      }
    }
  };

  const handleExitFullscreen = () => {
    if (fullscreenVideoRef.current && fullscreenVideo) {
      const exitTime = fullscreenVideoRef.current.currentTime;
      const currentVid = videoRefs.current[currentIndex];
      if (currentVid) {
        currentVid.currentTime = exitTime;
        if (isPlaying) {
          currentVid.play().catch(() => {});
        }
      }
    }

    if (typeof window !== 'undefined' && 'screen' in window && window.screen.orientation) {
      const orientation = window.screen.orientation as any;
      if (typeof orientation.unlock === 'function') {
        try {
          orientation.unlock();
        } catch {}
      }
    }

    setFullscreenVideo(null);
  };

  // Sync fullscreen video time upon mounting
  useEffect(() => {
    if (fullscreenVideo && fullscreenVideoRef.current) {
      fullscreenVideoRef.current.currentTime = fullscreenVideo.time;
      fullscreenVideoRef.current.muted = isMuted;
      fullscreenVideoRef.current.play().catch(() => {});
    }
  }, [fullscreenVideo, isMuted]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] w-screen h-[100dvh] bg-black text-[#FAF3E8] select-none overflow-hidden touch-none"
      style={{
        width: '100vw',
        height: '100dvh',
      }}
    >
      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* 1. TOP HEADER OVERLAY (Fixed at top, notch & safe-area compliant)   */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <header
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 14px)' }}
        className="absolute top-0 inset-x-0 z-50 px-4 pt-3 pb-8 flex items-center justify-between pointer-events-none bg-gradient-to-b from-black/85 via-black/40 to-transparent"
      >
        {/* Left: ARPIT AK Brand Label */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="font-playfair font-bold text-sm tracking-[0.16em] text-[#FAF3E8] drop-shadow-md">
            ARPIT <span className="text-[#C4943A]">AK</span>
          </span>
          <span className="text-[8.5px] font-sora font-bold tracking-[0.2em] px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[#C4943A] uppercase border border-white/10 shadow-xs">
            REELS
          </span>
        </div>

        {/* Center: Animated Project Counter (e.g. 07 / 32) */}
        <div className="pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 shadow-sm text-xs font-sora text-[#FAF3E8]">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentIndex}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="text-[#C4943A] font-semibold"
              >
                {String(currentIndex + 1).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
            <span className="text-white/35 font-light">/</span>
            <span className="text-white/70 font-medium">{String(totalVideos).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Right: Circular Translucent Close Button (Always visible & accessible) */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close reels viewer"
          className="pointer-events-auto w-9.5 h-9.5 rounded-full bg-black/55 hover:bg-black/75 active:scale-90 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 hover:text-white transition-all shadow-md cursor-pointer"
        >
          <X className="w-5 h-5" strokeWidth={2.2} />
        </button>
      </header>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* 2. FULL-BLEED REELS CONTAINER (Native snap scroll: y mandatory)      */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <div
        id="mobile-reels-container"
        ref={containerRef}
        onScroll={handleScroll}
        onWheel={handleWheel}
        className="w-full h-full overflow-y-scroll overflow-x-hidden no-scrollbar touch-pan-y"
        style={{
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorY: 'contain',
          touchAction: 'pan-y',
          width: '100vw',
          height: '100dvh',
        }}
      >
        {playlist.map((video, idx) => {
          const isNearby = Math.abs(idx - currentIndex) <= 1;
          const isCurrent = idx === currentIndex;
          const isLandscape = Boolean(
            video.aspectRatio === 'landscape' ||
            aspectRatioMap[video.id] === 'landscape' ||
            item?.orientation === 'landscape' ||
            (item?.aspectRatio ? item.aspectRatio > 1.2 : false) ||
            (video.videoUrl && video.videoUrl.toLowerCase().includes('landscape'))
          );

          const cardSoftware = video.projectInfo?.software || video.softwares?.[0] || {
            name: 'Premiere Pro',
            icon: 'premiere-pro',
          };

          const cardLikeData = likes[video.id] || {
            count: 124 + (video.id.charCodeAt(video.id.length - 1) % 40),
            isLiked: false,
          };

          const currentDisplayProgress = isCurrent ? (isScrubbing ? scrubProgress : progress) : 0;

          return (
            <div
              key={video.id || idx}
              onClick={(e) => handleCardTap(e, idx)}
              className="w-full h-full flex-shrink-0 relative overflow-hidden bg-black select-none snap-start snap-always cursor-pointer"
              style={{
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                width: '100vw',
                height: '100dvh',
              }}
            >
              {/* VIDEO LAYER (Only mounted if current or adjacent for 60fps performance) */}
              {isNearby ? (
                <>
                  {/* ───────────────────────────────────────────────────────────── */}
                  {/* A. LANDSCAPE HANDLING: AMBIENT BLURRED BACKDROP + 16:9 CARD   */}
                  {/* ───────────────────────────────────────────────────────────── */}
                  {isLandscape ? (
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                      {/* Ambient Blurred Backdrop Layer (Poster Image — single decoder architecture) */}
                      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                        {video.poster ? (
                          <img
                            src={video.poster}
                            alt=""
                            aria-hidden="true"
                            className="w-full h-full object-cover filter blur-3xl scale-135 opacity-45 brightness-75 select-none"
                          />
                        ) : (
                          <div className="w-full h-full bg-black/60" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/75" />
                      </div>

                      {/* Foreground Centered 16:9 Video Card */}
                      <div className="relative z-10 w-full px-3 flex flex-col items-center justify-center">
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.15)] group bg-black">
                          <video
                            ref={(el) => (videoRefs.current[idx] = el)}
                            src={isCurrent ? video.videoUrl : undefined}
                            poster={video.poster}
                            playsInline
                            loop
                            muted={isMuted}
                            preload={isCurrent ? 'auto' : 'none'}
                            onTimeUpdate={isCurrent ? handleTimeUpdate : undefined}
                            onLoadedMetadata={(e) => handleVideoMetadata(video.id, e.currentTarget)}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* ───────────────────────────────────────────────────────────── */
                    /* B. PORTRAIT HANDLING: 100% FULL-BLEED NATIVE REEL (NO CORNERS)*/
                    /* ───────────────────────────────────────────────────────────── */
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
                      {video.poster && (
                        <img
                          src={video.poster}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                          decoding="async"
                          className={`absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-opacity duration-300 ${
                            isCurrent && isPlaying ? 'opacity-0' : 'opacity-100'
                          }`}
                        />
                      )}
                      <video
                        ref={(el) => (videoRefs.current[idx] = el)}
                        src={isCurrent ? video.videoUrl : undefined}
                        poster={video.poster}
                        playsInline
                        loop
                        muted={isMuted}
                        preload={isCurrent ? 'auto' : 'none'}
                        onTimeUpdate={isCurrent ? handleTimeUpdate : undefined}
                        onLoadedMetadata={(e) => handleVideoMetadata(video.id, e.currentTarget)}
                        className="w-full h-full object-cover select-none relative z-10"
                      />
                    </div>
                  )}
                </>
              ) : (
                /* Placeholder for distant slides to conserve memory */
                <div className="w-full h-full bg-[#111] flex items-center justify-center">
                  {video.poster && (
                    <img
                      src={video.poster}
                      alt={video.title}
                      className="w-full h-full object-cover opacity-35 filter blur-sm"
                    />
                  )}
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* DOUBLE TAP POP-UP HEART MICRO-ANIMATION                       */}
              {/* ───────────────────────────────────────────────────────────── */}
              <AnimatePresence>
                {doubleTapHeart && doubleTapHeart.id === video.id && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.4, 1.1], opacity: [0, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.65, ease: 'easeOut' }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none text-[#FF4B6E] drop-shadow-[0_0_20px_rgba(255,75,110,0.8)]"
                  >
                    <Heart className="w-20 h-20 fill-[#FF4B6E]" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ───────────────────────────────────────────────────────────── */}
              {/* LAYER B: ULTRA-SUBTLE LOCALIZED SCRIM (Leaves >90% Video 100% Clear) */}
              {/* ───────────────────────────────────────────────────────────── */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 via-black/15 to-transparent pointer-events-none z-20" />

              {/* ───────────────────────────────────────────────────────────── */}
              {/* LAYER E & D: BOTTOM INFO, SIDE ACTIONS & SEEKBAR LAYER        */}
              {/* ───────────────────────────────────────────────────────────── */}
              <div
                style={{
                  paddingBottom: 'max(calc(env(safe-area-inset-bottom, 0px) + 8px), 14px)',
                }}
                className="absolute bottom-0 inset-x-0 z-30 px-4 sm:px-5 pointer-events-none flex flex-col justify-end"
              >
                {/* 1. METADATA + INTERACTION ROW (Positioned comfortably ABOVE the seekbar) */}
                <div className="flex items-end justify-between gap-3.5 w-full mb-3.5 sm:mb-4.5">
                  {/* LEFT: Category Eyebrow, Editorial Title, Short Description, Software Info */}
                  <div className="flex-1 min-w-0 max-w-[calc(100%-58px)] pointer-events-auto pb-0.5">
                    {/* Category Eyebrow, Duration & Software Information */}
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span
                        style={{
                          textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.7)',
                        }}
                        className="text-[#C4943A] text-[10px] sm:text-[11px] font-sora font-bold tracking-[0.2em] uppercase"
                      >
                        {video.category || video.projectInfo?.category || 'VIDEO PROJECT'}
                      </span>
                      {video.duration && (
                        <>
                          <span className="w-3.5 h-[1px] bg-[#C4943A]/80 flex-shrink-0" />
                          <span
                            style={{
                              textShadow: '0 1px 4px rgba(0,0,0,0.9)',
                            }}
                            className="text-white/90 text-[9.5px] font-sora font-medium flex-shrink-0"
                          >
                            {video.duration}
                          </span>
                        </>
                      )}
                      {cardSoftware.name && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-white/40 flex-shrink-0" />
                          <span
                            style={{
                              textShadow: '0 1px 4px rgba(0,0,0,0.9)',
                            }}
                            className="text-white/80 text-[9.5px] font-sora font-medium flex-shrink-0"
                          >
                            {cardSoftware.name}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Editorial Title (Floating naturally with crisp shadow, never clipped) */}
                    <h2
                      style={{
                        textShadow: '0 2px 8px rgba(0,0,0,0.75), 0 1px 3px rgba(0,0,0,0.95), 0 4px 16px rgba(0,0,0,0.5)',
                        WebkitTextStroke: '0.3px rgba(0,0,0,0.3)',
                      }}
                      className="font-playfair text-[1.3rem] sm:text-[1.5rem] font-bold text-[#FAF3E8] leading-[1.18] mb-1.5 tracking-tight break-words line-clamp-2 select-none"
                    >
                      {video.title}
                    </h2>

                    {/* Concise Description with subtle text shadow */}
                    {video.description && (
                      <p
                        style={{
                          textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.7)',
                          WebkitTextStroke: '0.2px rgba(0,0,0,0.25)',
                        }}
                        className="text-white/95 font-sora text-[11px] sm:text-xs leading-relaxed max-w-[290px] line-clamp-2 text-balance select-none"
                      >
                        {video.description}
                      </p>
                    )}
                  </div>

                  {/* RIGHT: LAYER D - Vertical Interaction Rail */}
                  <div className="flex flex-col items-center gap-3 pointer-events-auto flex-shrink-0 pb-1">
                    {/* Like Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleLike(video.id);
                      }}
                      type="button"
                      aria-label="Like video"
                      className="flex flex-col items-center gap-1 group active:scale-85 transition-transform cursor-pointer"
                    >
                      <motion.div
                        animate={cardLikeData.isLiked ? { scale: [1, 1.35, 0.9, 1.1, 1] } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`w-10.5 h-10.5 rounded-full backdrop-blur-xl border flex items-center justify-center transition-all shadow-md ${
                          cardLikeData.isLiked
                            ? 'bg-[#FF4B6E]/25 border-[#FF4B6E]/50 text-[#FF4B6E] shadow-[0_0_15px_rgba(255,75,110,0.4)]'
                            : 'bg-black/50 border-white/20 text-[#FAF3E8]'
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 transition-transform duration-200 ${
                            cardLikeData.isLiked ? 'fill-[#FF4B6E]' : 'group-hover:scale-110'
                          }`}
                        />
                      </motion.div>
                      <span
                        className={`text-[9.5px] font-sora font-semibold tracking-wide ${
                          cardLikeData.isLiked ? 'text-[#FF4B6E]' : 'text-white/85'
                        }`}
                      >
                        {cardLikeData.count}
                      </span>
                    </button>

                    {/* Dedicated Fullscreen Button (Available on EVERY Reel) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnterFullscreen(video, videoRefs.current[idx], isLandscape);
                      }}
                      type="button"
                      aria-label="Enter fullscreen"
                      className="w-10.5 h-10.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 flex items-center justify-center text-[#FAF3E8] hover:text-[#C4943A] active:scale-85 transition-transform shadow-md cursor-pointer"
                    >
                      <Maximize2 className="w-5 h-5 text-white/90" />
                    </button>

                    {/* Sound Toggle Button */}
                    <button
                      onClick={handleToggleMute}
                      type="button"
                      aria-label={isMuted ? 'Unmute reel' : 'Mute reel'}
                      className="w-10.5 h-10.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 flex items-center justify-center text-[#FAF3E8] active:scale-85 transition-transform shadow-md cursor-pointer"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 text-white/70" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-[#C4943A]" />
                      )}
                    </button>

                    {/* Software Badge */}
                    <div className="flex flex-col items-center gap-0.5">
                      <SoftwareBadge iconKey={cardSoftware.icon} label={cardSoftware.name} />
                      <span className="text-[8.5px] font-sora font-medium text-[#FAF3E8]/70 text-center tracking-tight leading-none max-w-[44px] truncate">
                        {cardSoftware.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. THIN SEEK BAR (The LAST visual element at the bottom of the reel, flush above bottom safe area) */}
                <div
                  onPointerDown={(e) => handleSeekPointerDown(e, videoRefs.current[idx])}
                  onPointerMove={(e) => handleSeekPointerMove(e, videoRefs.current[idx])}
                  onPointerUp={(e) => handleSeekPointerUp(e, videoRefs.current[idx])}
                  onPointerCancel={(e) => handleSeekPointerUp(e, videoRefs.current[idx])}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full py-2 -my-1 flex items-center cursor-pointer pointer-events-auto touch-none group"
                  role="slider"
                  aria-label="Seek video progress"
                  aria-valuenow={Math.round(currentDisplayProgress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  {/* Seekbar Track Background (Subtle background to keep track clearly visible over bright video) */}
                  <div className="relative w-full h-[2.5px] rounded-full bg-white/30 backdrop-blur-sm overflow-visible shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                    {/* Played Progress Bar */}
                    <div
                      style={{ width: `${currentDisplayProgress}%` }}
                      className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#B8860B] via-[#C4943A] to-[#F1D08A] shadow-[0_0_6px_rgba(196,148,58,0.5)]"
                    />
                    {/* Glowing Playhead Thumb */}
                    <div
                      style={{ left: `${currentDisplayProgress}%` }}
                      className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#FAF3E8] border border-[#C4943A] shadow-[0_0_8px_rgba(196,148,58,0.8),0_1px_3px_rgba(0,0,0,0.6)] transition-transform duration-100 ${
                        isScrubbing ? 'scale-125' : 'group-hover:scale-110'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* 3. MOMENTARY PLAY/PAUSE TAP FEEDBACK (Centered glass badge)          */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {playFeedback && (
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.15, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none w-18 h-18 rounded-full bg-black/65 backdrop-blur-xl border border-white/20 flex items-center justify-center text-[#FAF3E8] shadow-2xl"
          >
            {playFeedback === 'play' ? (
              <Play className="w-8 h-8 fill-current ml-0.5 text-[#C4943A]" />
            ) : (
              <Pause className="w-8 h-8 fill-current text-white/90" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* 4. "SWIPE TO EXPLORE" GENTLE HINT (Dismisses on first interaction)   */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showSwipeHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-56 sm:bottom-60 inset-x-0 z-40 flex flex-col items-center justify-center pointer-events-none gap-1"
          >
            <span className="text-[10px] font-sora font-semibold tracking-[0.25em] text-[#FAF3E8]/85 uppercase px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 shadow-sm animate-pulse">
              SWIPE TO EXPLORE
            </span>
            <ChevronDown className="w-4 h-4 text-[#C4943A] animate-bounce" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* 5. DEDICATED FULLSCREEN MODE (Portrait & Landscape, Clean Cinematic) */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {fullscreenVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100000] bg-black flex items-center justify-center overflow-hidden touch-none"
            onClick={showControlsTemporarily}
          >
            {fullscreenVideo.isLandscape ? (
              /* LANDSCAPE: Rotated widescreen display on phones held in portrait, natural on landscape */
              <div
                className={`relative flex items-center justify-center ${
                  typeof window !== 'undefined' && window.innerHeight > window.innerWidth
                    ? 'w-[100dvh] h-[100vw] rotate-90 origin-center'
                    : 'w-full h-full'
                }`}
              >
                <video
                  ref={fullscreenVideoRef}
                  src={fullscreenVideo.video.videoUrl}
                  playsInline
                  loop
                  muted={isMuted}
                  autoPlay
                  className="w-full h-full object-contain select-none"
                />

                {/* Minimal Exit Control */}
                <AnimatePresence>
                  {showFullscreenControls && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExitFullscreen();
                      }}
                      type="button"
                      aria-label="Exit fullscreen"
                      className="absolute top-4 right-4 z-40 w-11 h-11 rounded-full bg-black/65 backdrop-blur-md border border-white/25 flex items-center justify-center text-white/95 active:scale-90 transition-all shadow-2xl cursor-pointer pointer-events-auto"
                    >
                      <Minimize2 className="w-5 h-5 text-white" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* PORTRAIT: Maximum available portrait screen area, no rotation, clean */
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={fullscreenVideoRef}
                  src={fullscreenVideo.video.videoUrl}
                  playsInline
                  loop
                  muted={isMuted}
                  autoPlay
                  className="w-full h-full object-contain select-none"
                />

                {/* Minimal Exit Control */}
                <AnimatePresence>
                  {showFullscreenControls && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExitFullscreen();
                      }}
                      type="button"
                      aria-label="Exit fullscreen"
                      style={{
                        top: 'max(env(safe-area-inset-top, 0px), 16px)',
                        right: 'max(env(safe-area-inset-right, 0px), 16px)',
                      }}
                      className="absolute z-40 w-11 h-11 rounded-full bg-black/65 backdrop-blur-md border border-white/25 flex items-center justify-center text-white/95 active:scale-90 transition-all shadow-2xl cursor-pointer pointer-events-auto"
                    >
                      <Minimize2 className="w-5 h-5 text-white" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileReelsViewer;
