import React, { useState, useEffect, useRef } from 'react';

interface VideoCustomControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  containerRef?: React.RefObject<HTMLElement>;
  isPlaying: boolean;
  onTogglePlay: (e?: React.MouseEvent) => void;
  isMuted: boolean;
  onToggleMute: (e?: React.MouseEvent) => void;
  onToggleFullscreen?: (e?: React.MouseEvent) => void;
  orientation?: 'portrait' | 'landscape';
  className?: string;
}

export const VideoCustomControls: React.FC<VideoCustomControlsProps> = ({
  videoRef,
  containerRef,
  isPlaying,
  onTogglePlay,
  isMuted,
  onToggleMute,
  onToggleFullscreen,
  orientation = 'portrait',
  className = '',
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Sync fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        Boolean(
          document.fullscreenElement ||
            (document as any).webkitFullscreenElement ||
            (document as any).mozFullScreenElement ||
            (document as any).msFullscreenElement
        )
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Update progress in real time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      if (!isScrubbing && video.duration) {
        setProgress(video.currentTime / video.duration);
      }
    };

    video.addEventListener('timeupdate', updateTime);
    return () => {
      video.removeEventListener('timeupdate', updateTime);
    };
  }, [videoRef, isScrubbing]);

  // Handle Timeline Seeking / Scrubbing
  const seekToPosition = (clientX: number) => {
    const bar = progressBarRef.current;
    const video = videoRef.current;
    if (!bar || !video || !video.duration) return;

    const rect = bar.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const newProgress = clickX / rect.width;
    setProgress(newProgress);
    video.currentTime = newProgress * video.duration;
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
    }
  };

  // Toggle Fullscreen on the container/card element
  const handleToggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFullscreen) {
      onToggleFullscreen(e);
      return;
    }
    const targetElement =
      containerRef?.current || videoRef.current?.parentElement || videoRef.current;
    if (!targetElement) return;

    if (!isFullscreen) {
      if (targetElement.requestFullscreen) {
        targetElement.requestFullscreen();
      } else if ((targetElement as any).webkitRequestFullscreen) {
        (targetElement as any).webkitRequestFullscreen();
      } else if ((targetElement as any).msRequestFullscreen) {
        (targetElement as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  const isLandscape = orientation === 'landscape';

  return (
    <div
      className={`flex items-center justify-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-black/45 hover:bg-black/65 backdrop-blur-md rounded-full border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-[width,padding,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isLandscape ? 'w-[220px] sm:w-[260px]' : 'w-auto'
      } ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 1. Play / Pause Button */}
      <button
        onClick={onTogglePlay}
        type="button"
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 hover:bg-white/30 active:scale-95 text-white flex items-center justify-center transition-all flex-shrink-0"
      >
        {isPlaying ? (
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 fill-current translate-x-0.5" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* 2. LANDSCAPE PLAYBACK PROGRESS TIMELINE */}
      {isLandscape && (
        <div
          ref={progressBarRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="flex-1 h-5 flex items-center cursor-pointer px-1 group/timeline flex-shrink min-w-[50px]"
        >
          <div className="relative w-full h-[3px] group-hover/timeline:h-[4px] bg-white/25 rounded-full overflow-hidden transition-all">
            {/* Active Progress Fill */}
            <div
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#C4943A] to-[#E5C89C] rounded-full transition-[width] duration-75"
              style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
            />
          </div>
        </div>
      )}

      {/* 3. Mute / Unmute Button */}
      <button
        onClick={onToggleMute}
        type="button"
        aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 hover:bg-white/30 active:scale-95 text-white flex items-center justify-center transition-all flex-shrink-0"
      >
        {isMuted ? (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>

      {/* 4. Fullscreen Button */}
      <button
        onClick={handleToggleFullscreen}
        type="button"
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 hover:bg-white/30 active:scale-95 text-white flex items-center justify-center transition-all flex-shrink-0"
      >
        {isFullscreen ? (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default VideoCustomControls;
