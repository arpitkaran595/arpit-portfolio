import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';
import SocialPostViewer from './SocialPostViewer';
import MobileSocialPostViewer from './MobileSocialPostViewer';
import StoryViewer from './StoryViewer';
import MobileStoryViewer from './MobileStoryViewer';
import ThumbnailViewer from './ThumbnailViewer';
import MobileThumbnailViewer from './MobileThumbnailViewer';
import MobileReelsViewer from './MobileReelsViewer';
import { viewerSlideVariants } from '../utils/viewerTransitions';
import {
  featuredVideos,
  allFeaturedVideos,
  FeaturedVideo,
  storyPosters,
  allStoryPosters,
  creativePosts,
  allCreativePosts,
  youtubeThumbnails,
  allYoutubeThumbnails,
  SOFTWARE_ICON_MAP,
  SoftwareToolItem,
} from '../data/portfolio';

export interface MediaViewerItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  thumbnail: string;
  videoUrl?: string;
  duration?: string;
  category?: string;
  type?: 'video' | 'post' | 'story' | 'thumbnail' | 'creative';
  aspectRatio?: number;
  orientation?: 'portrait' | 'landscape';
  isArchive?: boolean;
}

interface MediaViewerProps {
  isOpen: boolean;
  onClose: () => void;
  item: MediaViewerItem | null;
  layoutId?: string;
  onActiveVideoChange?: (video: FeaturedVideo) => void;
  onExitComplete?: () => void;
}

// Clean duration formatter: "00:52" -> "0:52", "01:00" -> "1:00"
function formatDuration(duration?: string): string {
  if (!duration) return '';
  return duration.replace(/^00:0?/, '0:').replace(/^0?(\d+):/, '$1:');
}

// Seconds formatter: 3 -> "0:03", 28 -> "0:28"
function formatSeconds(secs: number): string {
  if (isNaN(secs) || secs < 0) return '0:00';
  const mins = Math.floor(secs / 60);
  const remainder = Math.floor(secs % 60);
  return `${mins}:${remainder.toString().padStart(2, '0')}`;
}

function parseDurationToSeconds(dur?: string): number {
  if (!dur) return 0;
  const parts = dur.split(':').map(Number);
  if (parts.length === 2) return (parts[0] || 0) * 60 + (parts[1] || 0);
  if (parts.length === 3) return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
  return 0;
}

const VideoViewer: React.FC<MediaViewerProps> = ({
  isOpen,
  onClose,
  item,
  layoutId,
  onActiveVideoChange,
  onExitComplete,
}) => {
  const videoList = useMemo(() => {
    if (!item) return featuredVideos;
    if (item.isArchive) return allFeaturedVideos;
    const existsInCurated = featuredVideos.some(
      (v) => v.id === item.id || v.videoUrl === item.videoUrl || v.title === item.title
    );
    return existsInCurated ? featuredVideos : allFeaturedVideos;
  }, [item]);

  const totalVideos = videoList.length;

  // Find initial video index matching the opened item
  const initialIndex = useMemo(() => {
    if (!item) return 0;
    const foundIdx = videoList.findIndex(
      (v) => v.id === item.id || v.videoUrl === item.videoUrl || v.title === item.title
    );
    return foundIdx >= 0 ? foundIdx : 0;
  }, [item, videoList]);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const isTransitioningRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);

  const mainVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameCallbackIdRef = useRef<number | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const viewerContainerRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync index whenever item changes upon opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setDirection(0);
      isTransitioningRef.current = false;
      setIsPlaying(true);
      setProgress(0);
      setCurrentTime(0);
    }
  }, [isOpen, initialIndex]);

  // Preload adjacent video posters for zero-delay slide entry
  useEffect(() => {
    if (!isOpen || totalVideos <= 1) return;
    const nextItem = videoList[(currentIndex + 1) % totalVideos];
    const prevItem = videoList[(currentIndex - 1 + totalVideos) % totalVideos];
    if (nextItem?.poster) {
      const img = new Image();
      img.src = nextItem.poster;
    }
    if (prevItem?.poster) {
      const img = new Image();
      img.src = prevItem.poster;
    }
  }, [isOpen, currentIndex, totalVideos, videoList]);

  const isVideoMode = Boolean(
    item?.videoUrl ||
    item?.type === 'video' ||
    (!item?.type && item?.id && (featuredVideos.some((v) => v.id === item.id) || allFeaturedVideos.some((v) => v.id === item.id)))
  );
  const activeVideo: FeaturedVideo | undefined = isVideoMode
    ? videoList[currentIndex]
    : undefined;

  // Derive previous and next video objects
  const prevIndex = (currentIndex - 1 + totalVideos) % totalVideos;
  const nextIndex = (currentIndex + 1) % totalVideos;
  const prevVideo = videoList[prevIndex];
  const nextVideo = videoList[nextIndex];

  // Derive active content metadata
  const activeTitle = activeVideo?.title || item?.title || '';
  const activeSubtitle = activeVideo?.category || item?.subtitle || item?.category || '';
  const activeDescription =
    activeVideo?.description ||
    item?.description ||
    'Crafted with deliberate pacing, refined typography, and engaging storytelling.';
  const activeVideoUrl = activeVideo?.videoUrl || item?.videoUrl;
  const activePoster =
    activeVideo?.poster ||
    (activeVideo?.videoUrl ? activeVideo.videoUrl.replace(/\.mp4$/, '.webp') : item?.thumbnail || '');

  // Derived softwares
  const activeSoftwares: SoftwareToolItem[] = useMemo(() => {
    if (activeVideo?.softwares && activeVideo.softwares.length > 0) {
      return activeVideo.softwares;
    }
    if (activeVideo?.projectInfo?.software) {
      return [activeVideo.projectInfo.software];
    }
    return [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'After Effects', icon: 'after-effects' },
    ];
  }, [activeVideo]);

  // Derived tags
  const activeTags: string[] = useMemo(() => {
    if (activeVideo?.tags && activeVideo.tags.length > 0) {
      return activeVideo.tags;
    }
    const cat = activeVideo?.category || item?.category || 'Reel';
    return [cat, 'Social Media', 'Short Form', 'Editorial'];
  }, [activeVideo, item]);

  // Sync active video back to parent if requested
  useEffect(() => {
    if (isOpen && activeVideo && onActiveVideoChange) {
      onActiveVideoChange(activeVideo);
    }
  }, [isOpen, activeVideo, onActiveVideoChange]);

  // Body scroll & Lenis locking for the full lifetime of the modal (including exit transitions)
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    if ((window as any).lenis) {
      (window as any).lenis.stop();
    }

    return () => {
      document.body.style.overflow = '';
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
    };
  }, []);

  // Pause active video playback immediately when closing begins to prevent trailing audio
  useEffect(() => {
    if (!isOpen) {
      if (mainVideoRef.current) {
        try {
          mainVideoRef.current.pause();
        } catch {}
      }
      setIsPlaying(false);
    }
  }, [isOpen]);

  // Clean up media resources upon unmount
  useEffect(() => {
    return () => {
      if (mainVideoRef.current) {
        try {
          mainVideoRef.current.pause();
        } catch {}
      }
    };
  }, []);

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Live Canvas Sampling for Ambient Blurred Backdrop
  // Uses the single active video's rendered frame buffer with ZERO duplicate video decoders or network streams
  useEffect(() => {
    const video = mainVideoRef.current;
    const canvas = canvasRef.current;
    if (!isOpen || !isVideoMode || !video || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    // 36x64 downsampled resolution matches portrait 9:16 aspect ratio while using negligible GPU memory (~9KB)
    canvas.width = 36;
    canvas.height = 64;

    let isDisposed = false;
    let lastDrawTime = 0;

    const renderFrame = (nowTime: number) => {
      if (isDisposed) return;

      // Throttle rendering to ~18-20fps since high-blur ambient aura does not require 60fps
      if (nowTime - lastDrawTime >= 50) {
        if (video.readyState >= 2 && !video.paused && !video.ended) {
          try {
            ctx.drawImage(video, 0, 0, 36, 64);
          } catch {
            // Gracefully ignore any cross-origin or decode errors
          }
        }
        lastDrawTime = nowTime;
      }

      // Continue frame presentation callback only while video is actively playing
      if (!video.paused && !video.ended && !isDisposed) {
        if ('requestVideoFrameCallback' in video) {
          frameCallbackIdRef.current = (video as any).requestVideoFrameCallback(
            (now: number) => renderFrame(now)
          );
        } else {
          animFrameIdRef.current = requestAnimationFrame((now: number) => renderFrame(now));
        }
      }
    };

    const startRendering = () => {
      if (isDisposed) return;
      if ('requestVideoFrameCallback' in video) {
        frameCallbackIdRef.current = (video as any).requestVideoFrameCallback(
          (now: number) => renderFrame(now)
        );
      } else {
        animFrameIdRef.current = requestAnimationFrame((now: number) => renderFrame(now));
      }
    };

    const stopRendering = () => {
      if (frameCallbackIdRef.current !== null && 'cancelVideoFrameCallback' in video) {
        (video as any).cancelVideoFrameCallback(frameCallbackIdRef.current);
        frameCallbackIdRef.current = null;
      }
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };

    // Draw immediate single frame on seek or loaded data
    const drawImmediate = () => {
      if (isDisposed || video.readyState < 2) return;
      try {
        ctx.drawImage(video, 0, 0, 36, 64);
      } catch {}
    };

    video.addEventListener('play', startRendering);
    video.addEventListener('pause', stopRendering);
    video.addEventListener('ended', stopRendering);
    video.addEventListener('seeked', drawImmediate);
    video.addEventListener('loadeddata', drawImmediate);

    // Initial kickstart if already playing
    if (!video.paused) {
      startRendering();
    }

    return () => {
      isDisposed = true;
      stopRendering();
      video.removeEventListener('play', startRendering);
      video.removeEventListener('pause', stopRendering);
      video.removeEventListener('ended', stopRendering);
      video.removeEventListener('seeked', drawImmediate);
      video.removeEventListener('loadeddata', drawImmediate);
    };
  }, [isOpen, isVideoMode, activeVideoUrl]);

  // Video Time Update Listener (Single Stream)
  useEffect(() => {
    const main = mainVideoRef.current;
    if (!main) return;

    const handleTimeUpdate = () => {
      if (!isScrubbing && main.duration) {
        setCurrentTime(main.currentTime);
        setProgress(main.currentTime / main.duration);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(main.duration || 0);
      if (isPlaying && isOpen) {
        main.play().catch(() => {});
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    main.addEventListener('timeupdate', handleTimeUpdate);
    main.addEventListener('loadedmetadata', handleLoadedMetadata);
    main.addEventListener('ended', handleEnded);

    return () => {
      main.removeEventListener('timeupdate', handleTimeUpdate);
      main.removeEventListener('loadedmetadata', handleLoadedMetadata);
      main.removeEventListener('ended', handleEnded);
    };
  }, [isScrubbing, isPlaying, isOpen]);

  // Controls Auto-hide on inactivity
  const resetControlsTimer = useCallback(() => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying && !isScrubbing) {
      controlsTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 2500);
    }
  }, [isPlaying, isScrubbing]);

  const handleMouseMove = () => {
    resetControlsTimer();
  };

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const main = mainVideoRef.current;
    if (!main) return;

    if (main.paused) {
      main.play().catch(() => {});
      setIsPlaying(true);
    } else {
      main.pause();
      setIsPlaying(false);
    }
    resetControlsTimer();
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const main = mainVideoRef.current;
    if (!main) return;
    const nextMuted = !isMuted;
    main.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const elem = viewerContainerRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  };

  const toggleSpeed = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const main = mainVideoRef.current;
    if (!main) return;
    const speeds = [1, 1.25, 1.5, 2];
    const nextSpeed = speeds[(speeds.indexOf(playbackRate) + 1) % speeds.length];
    main.playbackRate = nextSpeed;
    setPlaybackRate(nextSpeed);
  };

  // Timeline scrub handling
  const seekToPosition = (clientX: number) => {
    const bar = progressBarRef.current;
    const main = mainVideoRef.current;
    if (!bar || !main || !main.duration) return;

    const rect = bar.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const newProgress = clickX / rect.width;
    setProgress(newProgress);
    const targetTime = newProgress * main.duration;
    setCurrentTime(targetTime);
    main.currentTime = targetTime;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsScrubbing(true);
    seekToPosition(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isScrubbing) {
      e.stopPropagation();
      seekToPosition(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isScrubbing) {
      e.stopPropagation();
      setIsScrubbing(false);
      resetControlsTimer();
    }
  };

  // Previous & Next navigation with debounce lock
  const handlePrevious = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    if (mainVideoRef.current) {
      try {
        mainVideoRef.current.pause();
        mainVideoRef.current.muted = true;
      } catch {}
    }
    setDirection(-1);
    setCurrentIndex(prevIndex);
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(true);
    resetControlsTimer();
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 340);
  }, [prevIndex, resetControlsTimer]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    if (mainVideoRef.current) {
      try {
        mainVideoRef.current.pause();
        mainVideoRef.current.muted = true;
      } catch {}
    }
    setDirection(1);
    setCurrentIndex(nextIndex);
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(true);
    resetControlsTimer();
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 340);
  }, [nextIndex, resetControlsTimer]);

  // Keyboard navigation shortcuts active only while open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      } else if (e.key === 'ArrowLeft' && isVideoMode) {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight' && isVideoMode) {
        e.preventDefault();
        handleNext();
      } else if (e.key === ' ' && isVideoMode) {
        e.preventDefault();
        const main = mainVideoRef.current;
        if (!main) return;
        if (main.paused) {
          main.play().catch(() => {});
          setIsPlaying(true);
        } else {
          main.pause();
          setIsPlaying(false);
        }
        resetControlsTimer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isVideoMode, handlePrevious, handleNext, resetControlsTimer]);

  const effectiveDuration = duration || parseDurationToSeconds(activeVideo?.duration);

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {isOpen && item && (
        <>
          {/* 1. Backdrop (Maintains exact darkness, blur treatment & positioning) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/75 viewer-backdrop backdrop-blur-md"
            onClick={onClose}
          />

          {/* 2. Modal Shell Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 pointer-events-none">
            <motion.div
              ref={viewerContainerRef}
              layoutId={layoutId}
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="w-full max-w-[1340px] max-h-[94vh] h-[92vh] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-[0_32px_90px_-20px_rgba(0,0,0,0.65)] pointer-events-auto border border-white/10 relative"
            >
              {/* ═══════════════════════════════════════════════════════════ */}
              {/* LEFT: MAIN VIDEO VIEWPORT WITH BLURRED AMBIENT BACKDROP */}
              {/* ═══════════════════════════════════════════════════════════ */}
              <div
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setControlsVisible(true)}
                className="w-full md:w-[60%] lg:w-[63%] bg-[#080808] relative flex items-center justify-center overflow-hidden min-h-[46vh] md:min-h-full"
              >
                {isVideoMode && activeVideoUrl ? (
                  <>
                    {/* A. BLURRED AMBIENT BACKDROP (Zero Duplicate Decoders, Zero Extra Network Streams) */}
                    {/* 1. Fast instant blurred poster layer (0ms latency on open and between video switches) */}
                    {activePoster && (
                      <img
                        src={activePoster}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover scale-125 filter blur-3xl opacity-35 pointer-events-none select-none transition-opacity duration-300"
                      />
                    )}

                    {/* 2. Live downsampled canvas sampled directly from the single foreground video element */}
                    <canvas
                      ref={canvasRef}
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover scale-125 filter blur-3xl opacity-40 pointer-events-none select-none"
                    />

                    {/* B. DARK VIGNETTE OVERLAY */}
                    <div className="absolute inset-0 bg-black/45 pointer-events-none" />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 60%, rgba(0,0,0,0.92) 100%)',
                      }}
                    />

                    {/* C. FOREGROUND SHARP PORTRAIT VIDEO (Strict 9:16, no crop, no stretch) */}
                    <div className="relative z-10 flex items-center justify-center p-3 sm:p-6 pointer-events-none">
                      <div className="relative max-h-[70vh] md:max-h-[78vh] h-[70vh] md:h-[78vh] max-w-full aspect-[9/16] rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)] drop-shadow-2xl border border-white/10 bg-[#0C0C0E] overflow-hidden pointer-events-auto">
                        <AnimatePresence initial={false} custom={direction}>
                          <motion.div
                            key={activeVideo?.id || `fg-${activeVideoUrl}`}
                            custom={direction}
                            variants={viewerSlideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="absolute inset-0 w-full h-full flex items-center justify-center"
                          >
                            <video
                              ref={mainVideoRef}
                              src={activeVideoUrl}
                              poster={activePoster}
                              playsInline
                              autoPlay
                              loop
                              muted={isMuted}
                              onClick={togglePlay}
                              className="w-full h-full object-contain select-none cursor-pointer"
                            />
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* D. TOP-LEFT LOGO & DYNAMIC POSITION INDICATOR (01 / 32) */}
                    <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 select-none pointer-events-none">
                      <div className="font-playfair text-xs sm:text-[13px] font-bold tracking-[0.16em] text-white/90 uppercase drop-shadow-md">
                        ARPIT <span className="text-[#C4943A]">AK</span>
                      </div>
                      <div className="font-sora text-[10.5px] sm:text-xs font-semibold text-white/60 tracking-widest mt-0.5 drop-shadow-sm">
                        {String(currentIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;
                        {String(totalVideos).padStart(2, '0')}
                      </div>
                    </div>

                    {/* E. PREVIOUS VIDEO PREVIEW (DESKTOP LEFT SIDE) */}
                    <div className="hidden xl:flex flex-col items-center absolute left-5 2xl:left-8 top-1/2 -translate-y-1/2 z-30 select-none group/prev pointer-events-auto">
                      <span className="text-[9px] font-sora font-semibold tracking-[0.24em] text-white/45 uppercase mb-2 group-hover/prev:text-[#C4943A] transition-colors flex items-center gap-1">
                        <span>←</span> PREVIOUS
                      </span>

                      <div
                        onClick={handlePrevious}
                        data-testid="viewer-prev-btn"
                        className="relative w-20 2xl:w-22 aspect-[9/16] rounded-xl overflow-hidden border border-white/15 bg-black/40 shadow-xl group-hover/prev:border-[#C4943A]/60 transition-all duration-300 group-hover/prev:scale-105 cursor-pointer"
                      >
                        <img
                          src={prevVideo.poster || prevVideo.videoUrl.replace(/\.mp4$/, '.webp')}
                          alt={prevVideo.title}
                          className="w-full h-full object-cover opacity-65 group-hover/prev:opacity-95 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20" />
                      </div>

                      <div
                        onClick={handlePrevious}
                        className="text-center mt-2 max-w-[95px] cursor-pointer"
                      >
                        <div className="text-[10.5px] font-sora font-medium text-white/80 line-clamp-1 group-hover/prev:text-white leading-tight">
                          {prevVideo.title}
                        </div>
                        <div className="text-[9.5px] font-sora font-semibold text-white/45 mt-0.5">
                          {formatDuration(prevVideo.duration)}
                        </div>
                      </div>
                    </div>

                    {/* F. NEXT VIDEO PREVIEW (DESKTOP RIGHT SIDE) */}
                    <div className="hidden xl:flex flex-col items-center absolute right-5 2xl:right-8 top-1/2 -translate-y-1/2 z-30 select-none group/next pointer-events-auto">
                      <span className="text-[9px] font-sora font-semibold tracking-[0.24em] text-white/45 uppercase mb-2 group-hover/next:text-[#C4943A] transition-colors flex items-center gap-1">
                        NEXT <span>→</span>
                      </span>

                      <div
                        onClick={handleNext}
                        data-testid="viewer-next-btn"
                        className="relative w-20 2xl:w-22 aspect-[9/16] rounded-xl overflow-hidden border border-white/15 bg-black/40 shadow-xl group-hover/next:border-[#C4943A]/60 transition-all duration-300 group-hover/next:scale-105 cursor-pointer"
                      >
                        <img
                          src={nextVideo.poster || nextVideo.videoUrl.replace(/\.mp4$/, '.webp')}
                          alt={nextVideo.title}
                          className="w-full h-full object-cover opacity-65 group-hover/next:opacity-95 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20" />
                      </div>

                      <div
                        onClick={handleNext}
                        className="text-center mt-2 max-w-[95px] cursor-pointer"
                      >
                        <div className="text-[10.5px] font-sora font-medium text-white/80 line-clamp-1 group-hover/next:text-white leading-tight">
                          {nextVideo.title}
                        </div>
                        <div className="text-[9.5px] font-sora font-semibold text-white/45 mt-0.5">
                          {formatDuration(nextVideo.duration)}
                        </div>
                      </div>
                    </div>

                    {/* G. ELEGANT PILL VIDEO CONTROLS BAR */}
                    <div
                      style={{
                        opacity: controlsVisible ? 1 : 0,
                        transform: controlsVisible
                          ? 'translateX(-50%) translateY(0)'
                          : 'translateX(-50%) translateY(8px)',
                        pointerEvents: controlsVisible ? 'auto' : 'none',
                        transition:
                          'opacity 260ms cubic-bezier(0.22, 1, 0.36, 1), transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
                      }}
                      className="absolute bottom-3 sm:bottom-5 left-1/2 z-30 flex items-center gap-2 sm:gap-3 px-3 sm:px-4.5 py-1.5 sm:py-2 bg-black/65 hover:bg-black/80 backdrop-blur-md rounded-full border border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.5)] select-none max-w-[92%] sm:max-w-[420px] w-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Play / Pause */}
                      <button
                        onClick={togglePlay}
                        type="button"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 hover:bg-white/30 active:scale-95 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
                      >
                        {isPlaying ? (
                          <Pause size={14} className="fill-current" />
                        ) : (
                          <Play size={14} className="fill-current translate-x-0.5" />
                        )}
                      </button>

                      {/* Time Readout: 0:03 / 0:28 */}
                      <span className="text-[10.5px] sm:text-[11.5px] font-sora font-medium text-white/90 tabular-nums shrink-0 select-none">
                        {formatSeconds(currentTime)}&nbsp;/&nbsp;{formatSeconds(effectiveDuration)}
                      </span>

                      {/* Timeline Scrubber Bar */}
                      <div
                        ref={progressBarRef}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        className="flex-1 h-5 flex items-center cursor-pointer px-1 min-w-[65px] sm:min-w-[100px] group/timeline"
                      >
                        <div className="relative w-full h-[3px] group-hover/timeline:h-[4.5px] bg-white/25 rounded-full overflow-hidden transition-all">
                          <div
                            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#C4943A] to-[#E5C89C] rounded-full transition-[width] duration-75"
                            style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
                          />
                        </div>
                      </div>

                      {/* Mute / Unmute */}
                      <button
                        onClick={toggleMute}
                        type="button"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 hover:bg-white/30 active:scale-95 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
                      >
                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </button>

                      {/* Fullscreen Toggle */}
                      <button
                        onClick={toggleFullscreen}
                        type="button"
                        aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 hover:bg-white/30 active:scale-95 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
                      >
                        {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                      </button>

                      {/* More / Playback Rate */}
                      <button
                        onClick={toggleSpeed}
                        type="button"
                        title={`Speed: ${playbackRate}x`}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 hover:bg-white/30 active:scale-95 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
                      >
                        <MoreVertical size={14} />
                      </button>
                    </div>

                    {/* H. COMPACT MOBILE/TABLET SIDE ARROWS (Visible below XL) */}
                    <div className="xl:hidden absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none z-30">
                      <button
                        type="button"
                        onClick={handlePrevious}
                        aria-label="Previous video mobile"
                        className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg pointer-events-auto active:scale-95 transition-all cursor-pointer"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        aria-label="Next video mobile"
                        className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg pointer-events-auto active:scale-95 transition-all cursor-pointer"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </>
                ) : (
                  /* Non-video fallback artwork view (Thumbnails / Creatives) */
                  <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
                    {/* Top-left Brand & Type Indicator */}
                    <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 select-none pointer-events-none">
                      <div className="font-playfair text-xs sm:text-[13px] font-bold tracking-[0.16em] text-white/90 uppercase drop-shadow-md">
                        ARPIT <span className="text-[#C4943A]">AK</span>
                      </div>
                      <div className="font-sora text-[10px] sm:text-[10.5px] font-semibold text-white/50 tracking-widest mt-0.5 drop-shadow-sm uppercase">
                        16:9 THUMBNAIL
                      </div>
                    </div>

                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-contain max-h-[78vh] aspect-[16/9] rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)] border border-white/10"
                    />
                  </div>
                )}
              </div>

              {/* ═══════════════════════════════════════════════════════════ */}
              {/* RIGHT: EDITORIAL INFORMATION PANEL */}
              {/* Subtle warm-white → pale blue atmospheric gradient */}
              {/* ═══════════════════════════════════════════════════════════ */}
              <div
                className="w-full md:w-[40%] lg:w-[37%] p-6 sm:p-8 xl:p-10 relative flex flex-col overflow-y-auto z-10 select-none text-[#1A1A1A]"
                style={{
                  background:
                    'radial-gradient(ellipse at 100% 100%, rgba(216, 241, 253, 0.45) 0%, rgba(240, 248, 254, 0.22) 50%, transparent 80%), linear-gradient(155deg, #FDFBF8 0%, #FAF6F0 45%, #EFF5FA 85%, #E2EFF8 100%)',
                }}
              >
                {/* 1. TOP HEADER ROW: Eyebrow on left & CLOSE on right */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <span className="text-[10px] sm:text-[11px] font-sora font-bold tracking-[0.22em] uppercase text-[#B8860B]">
                    {isVideoMode ? 'VIDEO PROJECT' : (item.category?.toUpperCase() || 'THUMBNAIL')}
                  </span>

                  {/* Close Button with Text + Circle Icon */}
                  <button
                    onClick={onClose}
                    type="button"
                    aria-label="Close viewer"
                    className="group inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full hover:bg-black/5 active:scale-95 transition-all cursor-pointer text-[#1A1A1A]"
                  >
                    <span className="text-[10.5px] font-sora font-semibold tracking-[0.18em] uppercase text-charcoal-500 group-hover:text-charcoal-900 transition-colors">
                      CLOSE
                    </span>
                    <div className="w-7 h-7 rounded-full bg-[#1A1A1A]/5 group-hover:bg-[#1A1A1A]/10 flex items-center justify-center text-[#1A1A1A] transition-colors">
                      <X size={15} />
                    </div>
                  </button>
                </div>

                {/* 2. PROJECT TITLE & CATEGORY */}
                <div className="mb-4">
                  <h2 className="font-playfair text-2xl sm:text-3xl xl:text-[2.25rem] text-[#1A1A1A] font-bold tracking-tight leading-[1.12] mb-1.5">
                    {activeTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal-500 font-sora font-medium">
                    {activeSubtitle}
                  </p>
                </div>

                {/* 3. SUBTLE GOLD ACCENT DIVIDER */}
                <div className="w-12 h-[1.5px] bg-[#C4943A]/50 mb-4 sm:mb-5" />

                {/* 4. SHORT DESCRIPTION */}
                <p className="text-xs sm:text-[13px] text-charcoal-600 font-sora leading-relaxed mb-6 sm:mb-7">
                  {activeDescription}
                </p>

                {/* 5. SOFTWARE USED SECTION (Video Mode Only) */}
                {isVideoMode ? (
                  <>
                    <div className="mb-6 sm:mb-7">
                      <span className="text-[10px] tracking-[0.20em] uppercase font-sora font-bold text-charcoal-400 mb-3 block">
                        SOFTWARE USED
                      </span>
                      <div className="flex items-center gap-2.5 sm:gap-3.5 flex-wrap">
                        {activeSoftwares.map((tool, idx) => {
                          const iconInfo = SOFTWARE_ICON_MAP[tool.icon] || {
                            name: tool.name,
                            src: '/assets/softwares/adobe-premiere-svgrepo-com.svg',
                            bgColor: '#000',
                          };
                          return (
                            <div
                              key={idx}
                              className="flex flex-col items-center gap-1.5 group/soft select-none"
                            >
                              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-white/90 hover:bg-white border border-[#E2E8F0]/90 shadow-[0_4px_14px_rgba(0,0,0,0.05)] flex items-center justify-center p-2.5 transition-all duration-200 group-hover/soft:-translate-y-0.5 group-hover/soft:shadow-md">
                                <img
                                  src={iconInfo.src}
                                  alt={tool.name}
                                  className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                                />
                              </div>
                              <span className="text-[9.5px] sm:text-[10px] font-sora font-medium text-charcoal-600 text-center max-w-[68px] line-clamp-1 leading-none">
                                {tool.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 6. TAGS SECTION */}
                    <div className="mb-6 sm:mb-7">
                      <span className="text-[10px] tracking-[0.20em] uppercase font-sora font-bold text-charcoal-400 mb-2.5 block">
                        TAGS
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {activeTags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 sm:px-3.5 py-1 rounded-full bg-[#EFE9DF]/80 border border-[#E5D7C3]/70 text-[10px] sm:text-[10.5px] font-sora font-medium text-charcoal-700 tracking-wide"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="mb-6 sm:mb-7 space-y-4">
                    <div>
                      <span className="text-[10px] tracking-[0.20em] uppercase font-sora font-bold text-charcoal-400 mb-2.5 block">
                        FORMAT SPECIFICATION
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 rounded-full bg-[#EFE9DF]/80 border border-[#E5D7C3]/70 text-[10px] sm:text-[10.5px] font-sora font-medium text-charcoal-700 tracking-wide">
                          16:9 LANDSCAPE
                        </span>
                        <span className="px-3 py-1 rounded-full bg-[#EFE9DF]/80 border border-[#E5D7C3]/70 text-[10px] sm:text-[10.5px] font-sora font-medium text-charcoal-700 tracking-wide">
                          ULTRA HD
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. UP NEXT SECTION (Bottom of Right Panel) */}
                {isVideoMode && nextVideo && (
                  <div className="mt-auto pt-4 border-t border-charcoal-900/10 select-none">
                    <span className="text-[10px] tracking-[0.20em] uppercase font-sora font-bold text-charcoal-400 mb-2.5 block">
                      UP NEXT
                    </span>
                    <div
                      onClick={handleNext}
                      className="group/upnext flex items-center gap-3.5 p-2 sm:p-2.5 rounded-2xl hover:bg-white/70 active:scale-[0.99] transition-all cursor-pointer border border-transparent hover:border-black/5"
                    >
                      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-black/20 shrink-0 border border-black/5 shadow-xs">
                        <img
                          src={nextVideo.poster || nextVideo.videoUrl.replace(/\.mp4$/, '.webp')}
                          alt={nextVideo.title}
                          className="w-full h-full object-cover group-hover/upnext:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-[13px] font-sora font-semibold text-[#1A1A1A] line-clamp-1 group-hover/upnext:text-[#C4943A] transition-colors">
                          {nextVideo.title}
                        </h4>
                        <p className="text-[10.5px] sm:text-[11px] font-sora text-charcoal-500 line-clamp-1">
                          {nextVideo.category}
                        </p>
                        <span className="text-[9.5px] sm:text-[10px] font-sora font-medium text-charcoal-400">
                          {formatDuration(nextVideo.duration)}
                        </span>
                      </div>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/5 group-hover/upnext:bg-[#C4943A] group-hover/upnext:text-white flex items-center justify-center text-charcoal-600 transition-colors shrink-0">
                        <ChevronRight size={15} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// Top-Level MediaViewer Dispatcher
// Automatically selects the appropriate visual presentation variant
const MediaViewer: React.FC<MediaViewerProps> = ({
  isOpen,
  onClose,
  item,
  layoutId,
  onActiveVideoChange,
}) => {
  const [windowWidth, setWindowWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200));

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Retain active item during exit transition so child viewers can complete animations
  const [cachedItem, setCachedItem] = useState<MediaViewerItem | null>(item);
  const [isClosing, setIsClosing] = useState(false);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // Synchronously adjust state during render when isOpen or item props change
  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true);
    setIsClosing(false);
    setCachedItem(item);
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
    setIsClosing(true);
  } else if (isOpen && item && item !== cachedItem) {
    setCachedItem(item);
  }

  // Safety fallback timer: if onExitComplete is delayed or skipped (e.g. reduced motion),
  // ensure the modal unmounts cleanly and never remains stuck
  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        setIsClosing(false);
        setCachedItem(null);
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [isClosing]);

  // Clean up and ensure scroll restoration on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
    };
  }, []);

  const handleExitComplete = useCallback(() => {
    if (!isOpen) {
      setIsClosing(false);
      setCachedItem(null);
    }
  }, [isOpen]);

  const activeItem = isOpen ? item : cachedItem;

  // Unmount completely if there is no active item or when both open and closing states are done
  if (!activeItem || (!isOpen && !isClosing)) return null;

  const isMobile = windowWidth < 768;

  let content: React.ReactNode = null;

  // 1. Detect Thumbnail Artwork (Strict 16:9 Landscape Artwork with Centered Layout & Bottom Pill)
  const isThumbnail = Boolean(
    activeItem.type === 'thumbnail' ||
    (activeItem.id && activeItem.id.startsWith('yt-')) ||
    youtubeThumbnails.some((t) => t.id === activeItem.id) ||
    allYoutubeThumbnails.some((t) => t.id === activeItem.id)
  );

  if (isThumbnail) {
    content = isMobile ? (
      <MobileThumbnailViewer isOpen={isOpen} onClose={onClose} item={activeItem} />
    ) : (
      <ThumbnailViewer isOpen={isOpen} onClose={onClose} item={activeItem} />
    );
  } else {
    // 2. Detect Story Artwork (Strict 9:16 Portrait)
    const isStory = Boolean(
      activeItem.type === 'story' ||
      (activeItem.id && activeItem.id.startsWith('story-')) ||
      storyPosters.some((s) => s.id === activeItem.id) ||
      allStoryPosters.some((s) => s.id === activeItem.id)
    );

    if (isStory) {
      // On Mobile (< 768px): Render the redesigned 3-card 3D MobileStoryViewer!
      // On Tablet & Desktop (>= 768px): Render the approved existing StoryViewer (100% Unmodified)!
      content = isMobile ? (
        <MobileStoryViewer
          isOpen={isOpen}
          onClose={onClose}
          item={activeItem}
          onExitComplete={handleExitComplete}
        />
      ) : (
        <StoryViewer
          isOpen={isOpen}
          onClose={onClose}
          item={activeItem}
          onExitComplete={handleExitComplete}
        />
      );
    } else {
      // 3. Detect Social Media Post (4:5 / 1:1)
      const isSocialPost = Boolean(
        activeItem.type === 'post' ||
        activeItem.type === 'creative' ||
        (activeItem.id && activeItem.id.startsWith('post-')) ||
        creativePosts.some((c) => c.id === activeItem.id) ||
        allCreativePosts.some((c) => c.id === activeItem.id)
      );

      if (isSocialPost) {
        content = isMobile ? (
          <MobileSocialPostViewer isOpen={isOpen} onClose={onClose} item={activeItem} />
        ) : (
          <SocialPostViewer isOpen={isOpen} onClose={onClose} item={activeItem} />
        );
      } else {
        // 4. Video Viewer:
        // On Mobile (< 768px): Render the brand new full-screen MobileReelsViewer!
        // On Tablet & Desktop (>= 768px): Render the approved existing VideoViewer (100% Unmodified)!
        content = isMobile ? (
          <MobileReelsViewer
            isOpen={isOpen}
            onClose={onClose}
            item={activeItem}
            onActiveVideoChange={onActiveVideoChange}
            onExitComplete={handleExitComplete}
          />
        ) : (
          <VideoViewer
            isOpen={isOpen}
            onClose={onClose}
            item={activeItem}
            layoutId={layoutId}
            onActiveVideoChange={onActiveVideoChange}
            onExitComplete={handleExitComplete}
          />
        );
      }
    }
  }

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
};

export default MediaViewer;

