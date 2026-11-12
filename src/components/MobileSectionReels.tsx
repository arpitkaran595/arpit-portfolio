import React, { useState, useEffect, useRef } from 'react';
import { motion, useTransform, MotionValue, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  ChevronUp,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { FeaturedVideo } from '../data/portfolio';

function getWrappedOffset(index: number, p: number, N: number): number {
  return ((((index - p + N / 2) % N) + N) % N) - N / 2;
}

const MobileSoftwareBadge: React.FC<{ icon: string }> = ({ icon }) => {
  switch (icon) {
    case 'after-effects':
      return (
        <div
          title="Adobe After Effects"
          className="w-8 h-8 rounded-lg bg-[#171026]/90 border border-[#9999FF]/45 flex items-center justify-center shadow-md select-none"
        >
          <span className="text-[#9999FF] text-[10px] font-sora font-extrabold tracking-tighter leading-none">
            Ae
          </span>
        </div>
      );
    case 'premiere-pro':
      return (
        <div
          title="Adobe Premiere Pro"
          className="w-8 h-8 rounded-lg bg-[#1A0E2B]/90 border border-[#EA77FF]/45 flex items-center justify-center shadow-md select-none"
        >
          <span className="text-[#EA77FF] text-[10px] font-sora font-extrabold tracking-tighter leading-none">
            Pr
          </span>
        </div>
      );
    case 'capcut':
      return (
        <div
          title="CapCut"
          className="w-8 h-8 rounded-lg bg-black/90 border border-white/25 flex items-center justify-center shadow-md select-none"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="white">
            <path d="M4 6.5C4 5.12 5.12 4 6.5 4h11C18.88 4 20 5.12 20 6.5v11c0 1.38-1.12 2.5-2.5 2.5h-11C5.12 20 4 18.88 4 17.5v-11zm8 2.5l-4 6h8l-4-6z" />
          </svg>
        </div>
      );
    default:
      return (
        <div
          title="Creative Cloud"
          className="w-8 h-8 rounded-lg bg-[#222]/90 border border-[#D4C3A3]/45 flex items-center justify-center shadow-md select-none"
        >
          <span className="text-[#C4943A] text-[10px] font-sora font-bold leading-none">CC</span>
        </div>
      );
  }
};

interface ReelSlideProps {
  index: number;
  video: FeaturedVideo;
  position: MotionValue<number>;
  totalVideos: number;
  orientation: 'portrait' | 'landscape';
  activeIndex: number;
  isPlaying: boolean;
  isMuted: boolean;
  isSectionInView: boolean;
  isModalOpen: boolean;
  videoRefs: React.MutableRefObject<(HTMLVideoElement | null)[]>;
  isVideoReady: boolean;
  onVideoReady: (videoId: string) => void;
  onTimeUpdate: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  onTogglePlay: (e?: React.MouseEvent) => void;
  onToggleMute: (e?: React.MouseEvent) => void;
  onOpenFullscreen: (video: FeaturedVideo) => void;
  progressPct: number;
  onSeek: (ratio: number) => void;
}

const ReelSlide: React.FC<ReelSlideProps> = ({
  index,
  video,
  position,
  totalVideos,
  orientation,
  activeIndex,
  isPlaying,
  isMuted,
  isSectionInView,
  isModalOpen,
  videoRefs,
  isVideoReady,
  onVideoReady,
  onTimeUpdate,
  onTogglePlay,
  onToggleMute,
  onOpenFullscreen,
  progressPct,
  onSeek,
}) => {
  const isCenter = activeIndex === index;
  const wrappedOffset = getWrappedOffset(index, activeIndex, totalVideos);
  const isNearActive = Math.abs(wrappedOffset) <= 1;
  const shouldLoadVideo = isSectionInView && isCenter && !isModalOpen;

  const y = useTransform(position, (p) => {
    const u = getWrappedOffset(index, p, totalVideos);
    return `${u * 100}%`;
  });

  const scale = useTransform(position, (p) => {
    const absU = Math.abs(getWrappedOffset(index, p, totalVideos));
    return Math.max(0.92, 1 - absU * 0.06);
  });

  const opacity = useTransform(position, (p) => {
    const absU = Math.abs(getWrappedOffset(index, p, totalVideos));
    return absU <= 1.25 ? 1 : 0;
  });

  const zIndex = useTransform(position, (p) => {
    const absU = Math.abs(getWrappedOffset(index, p, totalVideos));
    return Math.round(20 - absU * 10);
  });

  const pointerEvents = useTransform(position, (p) => {
    const absU = Math.abs(getWrappedOffset(index, p, totalVideos));
    return absU < 0.55 ? 'auto' : 'none';
  });

  const handleSeekBar = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(ratio);
  };

  return (
    <motion.div
      style={{
        y,
        scale,
        opacity,
        zIndex,
        pointerEvents: pointerEvents as any,
        willChange: 'transform',
      }}
      data-reel-index={index}
      data-reel-active={isCenter ? 'true' : 'false'}
      className="absolute inset-0 w-full h-full bg-[#0A0A0B] overflow-hidden select-none"
    >
      {/* MEDIA LAYER */}
      <div className="relative w-full h-full flex items-center justify-center bg-black">
        {orientation === 'landscape' && video.poster && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img
              src={video.poster}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover scale-125 filter blur-2xl opacity-45 brightness-75"
              draggable={false}
            />
            <div className="absolute inset-0 bg-black/35" />
          </div>
        )}

        {/* Instant Poster (shown whenever nearby; stays visible until video starts playing) */}
        {isNearActive && video.poster && (
          <img
            src={video.poster}
            alt={video.title}
            loading="eager"
            decoding="async"
            draggable={false}
            className={`absolute inset-0 m-auto w-full h-full pointer-events-none select-none z-10 transition-opacity duration-300 ${
              orientation === 'portrait'
                ? 'object-cover'
                : 'object-contain max-w-[96%] max-h-[82%]'
            } ${shouldLoadVideo && isPlaying && isVideoReady ? 'opacity-0' : 'opacity-100'}`}
          />
        )}

        {/* Single Active Video Decoder */}
        {shouldLoadVideo ? (
          <video
            ref={(el) => {
              videoRefs.current[index] = el;
              if (el && el.readyState >= 3) {
                onVideoReady(video.id);
              }
            }}
            src={video.videoUrl}
            poster={video.poster}
            playsInline
            loop
            muted={isMuted}
            preload="auto"
            onCanPlay={() => onVideoReady(video.id)}
            onPlaying={() => onVideoReady(video.id)}
            onTimeUpdate={onTimeUpdate}
            className={`relative z-10 w-full h-full ${
              orientation === 'portrait'
                ? 'object-cover'
                : 'object-contain max-w-[96%] max-h-[82%] drop-shadow-2xl'
            }`}
          />
        ) : (
          <div
            ref={() => {
              if (videoRefs.current[index]) {
                videoRefs.current[index]?.pause();
                videoRefs.current[index] = null;
              }
            }}
            className="hidden"
          />
        )}

        {/* Loading indicator while active video buffers */}
        {shouldLoadVideo && isPlaying && !isVideoReady && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[#FAF3E8]">
            <Loader2 className="w-4 h-4 text-[#C4943A] animate-spin" />
            <span className="text-[10px] font-sora font-semibold tracking-wider uppercase">
              Loading Reel
            </span>
          </div>
        )}

        {/* Paused indicator when user taps to pause */}
        {isCenter && !isPlaying && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none w-14 h-14 rounded-full bg-black/55 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#FAF3E8] shadow-xl">
            <Play className="w-6 h-6 fill-current ml-0.5 text-[#C4943A]" />
          </div>
        )}
      </div>

      {/* SUBTLE LEGIBILITY SCRIM */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/85 via-black/45 to-transparent pointer-events-none z-20" />
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/55 to-transparent pointer-events-none z-20" />

      {/* BOTTOM METADATA + RIGHT ACTION RAIL */}
      <div className="absolute bottom-0 inset-x-0 z-30 px-3.5 pb-2.5 flex flex-col justify-end pointer-events-none">
        <div className="flex items-end justify-between gap-2.5 mb-2.5">
          {/* Synchronized Video Metadata */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-[#C4943A]/20 border border-[#C4943A]/50 text-[#F1D08A] text-[9px] font-sora font-semibold tracking-[0.14em] uppercase">
                {video.projectInfo?.category || video.category}
              </span>
              {video.duration && (
                <span className="text-white/80 text-[10px] font-sora font-medium">
                  {video.duration}
                </span>
              )}
            </div>

            <h3 className="font-playfair text-[17px] font-bold text-[#FAF3E8] leading-snug line-clamp-1 drop-shadow">
              {video.title}
            </h3>

            {video.description && (
              <p className="text-white/80 font-sora text-[10.5px] leading-snug line-clamp-2 mt-0.5">
                {video.description}
              </p>
            )}
          </div>

          {/* Right Vertical Control Rail (Protected from swipe propagation) */}
          <div
            data-reel-control="true"
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-2 pointer-events-auto shrink-0"
          >
            <button
              type="button"
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              className="w-9 h-9 rounded-full bg-black/55 hover:bg-black/75 active:scale-90 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#FAF3E8] cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={onToggleMute}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              className="w-9 h-9 rounded-full bg-black/55 hover:bg-black/75 active:scale-90 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#FAF3E8] cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white/75" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#C4943A]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onOpenFullscreen(video)}
              aria-label="Open fullscreen reels viewer"
              className="w-9 h-9 rounded-full bg-black/55 hover:bg-black/75 active:scale-90 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#FAF3E8] cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <MobileSoftwareBadge icon={video.projectInfo?.software?.icon || 'after-effects'} />
          </div>
        </div>

        {/* Thin Seekbar (Protected from vertical swipe navigation) */}
        <div
          data-timeline="true"
          data-reel-control="true"
          onPointerDown={(e) => {
            e.stopPropagation();
            handleSeekBar(e);
          }}
          onPointerMove={(e) => {
            if (e.buttons === 1) handleSeekBar(e);
          }}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full py-1.5 cursor-pointer pointer-events-auto touch-none"
          role="slider"
          aria-label="Seek video progress"
          aria-valuenow={Math.round(progressPct)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="relative w-full h-[3px] rounded-full bg-white/25 overflow-hidden">
            <div
              style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
              className="h-full bg-gradient-to-r from-[#B8860B] via-[#C4943A] to-[#F1D08A] rounded-full transition-[width] duration-100"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export interface MobileSectionReelsProps {
  videos: FeaturedVideo[];
  activeIndex: number;
  position: MotionValue<number>;
  orientation: 'portrait' | 'landscape';
  isPlaying: boolean;
  isMuted: boolean;
  isSectionInView: boolean;
  isModalOpen: boolean;
  videoRefs: React.MutableRefObject<(HTMLVideoElement | null)[]>;
  onGoNext: () => void;
  onGoPrevious: () => void;
  onStopAnimation: () => void;
  onSetPosition: (p: number) => void;
  onAnimateToPosition: (target: number, dir?: number) => void;
  onTogglePlay: (e?: React.MouseEvent) => void;
  onToggleMute: (e?: React.MouseEvent) => void;
  onOpenFullscreen: (video: FeaturedVideo) => void;
}

export const MobileSectionReels: React.FC<MobileSectionReelsProps> = ({
  videos,
  activeIndex,
  position,
  orientation,
  isPlaying,
  isMuted,
  isSectionInView,
  isModalOpen,
  videoRefs,
  onGoNext,
  onGoPrevious,
  onStopAnimation,
  onSetPosition,
  onAnimateToPosition,
  onTogglePlay,
  onToggleMute,
  onOpenFullscreen,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [readyVideoId, setReadyVideoId] = useState<string | null>(null);
  const [progressPct, setProgressPct] = useState(0);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  const activeVideo = videos[activeIndex] || videos[0];
  const isVideoReady = Boolean(activeVideo && readyVideoId === activeVideo.id);

  // Reset progress & check readyState on active video switch
  useEffect(() => {
    setProgressPct(0);
    const el = videoRefs.current[activeIndex];
    if (el && el.readyState >= 3 && activeVideo) {
      setReadyVideoId(activeVideo.id);
    } else {
      setReadyVideoId(null);
    }
  }, [activeIndex, activeVideo, videoRefs]);

  // Vertical touch/pointer swipe state
  const dragState = useRef({
    isDown: false,
    startY: 0,
    startTime: 0,
    startPosition: 0,
    hasSwiped: false,
    pointerId: -1,
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, [data-reel-control], [data-timeline], a')) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    onStopAnimation();
    dragState.current = {
      isDown: true,
      startY: e.clientY,
      startTime: Date.now(),
      startPosition: position.get(),
      hasSwiped: false,
      pointerId: e.pointerId,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.isDown || dragState.current.pointerId !== e.pointerId) return;
    const deltaY = e.clientY - dragState.current.startY;
    const stageH = stageRef.current?.clientHeight || 480;

    if (Math.abs(deltaY) > 8) {
      if (!dragState.current.hasSwiped && e.currentTarget.setPointerCapture) {
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // Ignore capture errors
        }
      }
      dragState.current.hasSwiped = true;
      if (showSwipeHint) setShowSwipeHint(false);
      // Swipe UP (deltaY < 0) advances position (+1); Swipe DOWN (deltaY > 0) retreats (-1)
      onSetPosition(dragState.current.startPosition - deltaY / stageH);
    }
  };

  const finishVerticalDrag = (clientY: number) => {
    const deltaY = clientY - dragState.current.startY;
    const duration = Math.max(1, Date.now() - dragState.current.startTime);
    const velocityY = (deltaY / duration) * 1000; // px/sec
    const currentP = position.get();
    const stageH = stageRef.current?.clientHeight || 480;
    const wasSwipe = dragState.current.hasSwiped;

    dragState.current.isDown = false;
    dragState.current.pointerId = -1;

    if (!wasSwipe) {
      // Single tap on video toggles play/pause cleanly
      onTogglePlay();
      return;
    }

    const threshold = stageH * 0.14;
    const isFastFlick = Math.abs(velocityY) > 250 && Math.abs(deltaY) > 16;

    let target: number;
    let dir: number | undefined;
    if (deltaY < -threshold || (isFastFlick && velocityY < 0)) {
      // Swipe UP -> NEXT video
      target = Math.floor(currentP) + 1;
      dir = 1;
    } else if (deltaY > threshold || (isFastFlick && velocityY > 0)) {
      // Swipe DOWN -> PREVIOUS video
      target = Math.ceil(currentP) - 1;
      dir = -1;
    } else {
      target = Math.round(currentP);
    }

    onAnimateToPosition(target, dir);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragState.current.isDown || dragState.current.pointerId !== e.pointerId) return;
    if (e.currentTarget.releasePointerCapture) {
      try {
        if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Ignore
      }
    }
    finishVerticalDrag(e.clientY);
  };

  useEffect(() => {
    const onWindowUp = () => {
      if (!dragState.current.isDown) return;
      dragState.current.isDown = false;
      dragState.current.pointerId = -1;
      onAnimateToPosition(Math.round(position.get()));
    };
    window.addEventListener('pointerup', onWindowUp);
    window.addEventListener('pointercancel', onWindowUp);
    return () => {
      window.removeEventListener('pointerup', onWindowUp);
      window.removeEventListener('pointercancel', onWindowUp);
    };
  }, [position, onAnimateToPosition]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const vid = e.currentTarget;
    if (vid.duration > 0) {
      setProgressPct((vid.currentTime / vid.duration) * 100);
    }
  };

  const handleSeek = (ratio: number) => {
    const vid = videoRefs.current[activeIndex];
    if (!vid || !vid.duration) return;
    vid.currentTime = ratio * vid.duration;
    setProgressPct(ratio * 100);
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center my-2 min-h-0">
      {/* SINGLE VERTICAL INSTAGRAM REELS VIEWPORT */}
      <div
        ref={stageRef}
        data-testid="mobile-reels-stage"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full max-w-[360px] flex-1 min-h-[430px] max-h-[590px] rounded-[24px] overflow-hidden bg-[#0A0A0B] border border-[#E5D7BE]/65 shadow-[0_24px_60px_-15px_rgba(45,38,30,0.35),0_8px_20px_-5px_rgba(196,148,58,0.18)] touch-none select-none cursor-grab active:cursor-grabbing"
      >
        {/* Top Reels Header Bar */}
        <div className="absolute top-3 inset-x-3 z-40 flex items-center justify-between pointer-events-none">
          <div className="px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-[10px] font-sora font-semibold tracking-[0.18em] text-[#FAF3E8] uppercase">
            REEL <span className="text-[#C4943A]">{String(activeIndex + 1).padStart(2, '0')}</span> /{' '}
            {String(videos.length).padStart(2, '0')}
          </div>

          <div
            data-reel-control="true"
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 pointer-events-auto"
          >
            <button
              type="button"
              onClick={() => {
                setShowSwipeHint(false);
                onGoPrevious();
              }}
              aria-label="Previous video"
              className="w-8 h-8 rounded-full bg-black/55 hover:bg-black/75 active:scale-90 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#FAF3E8] cursor-pointer"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSwipeHint(false);
                onGoNext();
              }}
              aria-label="Next video"
              className="w-8 h-8 rounded-full bg-black/55 hover:bg-black/75 active:scale-90 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#FAF3E8] cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vertical Swipe Hint */}
        <AnimatePresence>
          {showSwipeHint && (
            <div className="absolute top-14 inset-x-0 z-30 flex justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-[9px] font-sora font-semibold tracking-[0.16em] text-[#FAF3E8]/90 uppercase whitespace-nowrap"
              >
                Swipe Up for Next Reel ↑
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Vertical Circular Slide Track */}
        {videos.map((video, index) => (
          <ReelSlide
            key={video.id}
            index={index}
            video={video}
            position={position}
            totalVideos={videos.length}
            orientation={orientation}
            activeIndex={activeIndex}
            isPlaying={isPlaying}
            isMuted={isMuted}
            isSectionInView={isSectionInView}
            isModalOpen={isModalOpen}
            videoRefs={videoRefs}
            isVideoReady={isVideoReady}
            onVideoReady={(vidId) => setReadyVideoId(vidId)}
            onTimeUpdate={handleTimeUpdate}
            onTogglePlay={onTogglePlay}
            onToggleMute={onToggleMute}
            onOpenFullscreen={onOpenFullscreen}
            progressPct={progressPct}
            onSeek={handleSeek}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileSectionReels;
