import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useInView, useMotionValue, useTransform, animate, MotionValue, AnimatePresence } from 'framer-motion';
import {
  featuredVideos,
  videoSectionData,
  FeaturedVideo,
} from '../data/portfolio';
import VideoCustomControls from './VideoCustomControls';
import MediaViewer from './MediaViewer';
import { useArchive } from '../context/ArchiveContext';

gsap.registerPlugin(ScrollTrigger);

// Mathematical modulo for seamless wrap-around
function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

// Continuous wrapped circular offset on a circle of length N (range: [-N/2, N/2])
function getWrappedOffset(index: number, p: number, N = 32): number {
  return ((index - p + N / 2) % N + N) % N - N / 2;
}

// ─────────────────────────────────────────────────────────────────────────────
// CINEMATIC CURVED 3D ORBIT TRANSFORM CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
function getCurvedOrbitTransform(u: number, isPortrait: boolean, isMobile: boolean, isTablet: boolean, windowWidth?: number) {
  const winW = windowWidth ?? (typeof window !== 'undefined' ? window.innerWidth : 1200);
  const stepX = isPortrait
    ? (isMobile ? 110 : isTablet ? 165 : 220)
    : (isMobile ? Math.round(Math.min(160, Math.max(120, winW * 0.36))) : isTablet ? 320 : 420);

  const stepY = isPortrait
    ? (isMobile ? 8 : isTablet ? 12 : 16)
    : (isMobile ? 4 : isTablet ? 6 : 8);

  const stepZ = isPortrait ? (isMobile ? 35 : 65) : (isMobile ? 40 : 70);

  const absU = Math.abs(u);

  // 1. X Position: smoothly spaced along horizontal rail
  const x = u * stepX;

  // 2. Y Position: parabolic curve (cards drop slightly as they move away from center hero)
  const y = (absU * absU * 0.45 + absU * 0.55) * stepY;

  // 3. Z-Depth: cards recede backward into depth along orbital cylinder
  const translateZ = -absU * stepZ;

  // 4. Scale
  let scale = 1;
  if (isPortrait) {
    // Portrait Mode: 5 visible cards scaling
    if (absU <= 1) {
      scale = 1 - absU * 0.14;
    } else if (absU <= 2) {
      scale = 0.86 - (absU - 1) * 0.14;
    } else {
      scale = Math.max(0.5, 0.72 - (absU - 2) * 0.14);
    }
  } else {
    // Landscape Mode: 3 visible cards (Center = 1.0, Side u = ±1 => ~0.82)
    if (absU <= 1) {
      scale = 1 - absU * 0.18;
    } else {
      scale = Math.max(0.55, 0.82 - (absU - 1) * 0.18);
    }
  }

  // 5. RotateY (Yaw): cards angle gently toward center focus
  let rotateY = 0;
  if (isPortrait) {
    if (absU <= 1) {
      rotateY = -u * 10.5;
    } else if (absU <= 2) {
      rotateY = Math.sign(-u) * (10.5 + (absU - 1) * 7.5);
    } else {
      rotateY = Math.sign(-u) * (18 + (absU - 2) * 5);
    }
  } else {
    // Landscape Mode: subtle cinematic 8-degree angle toward center
    if (absU <= 1) {
      rotateY = -u * 8.0;
    } else {
      rotateY = Math.sign(-u) * 8.0;
    }
  }

  // 6. RotateZ (Roll): subtle organic tilt in portrait mode
  const rotateZ = isPortrait ? u * (isMobile ? 1.2 : 1.8) : 0;

  // 7. Opacity
  let opacity = 1;
  if (isPortrait) {
    // Portrait Mode: 5 visible cards
    if (absU <= 1) {
      opacity = 1 - absU * 0.28;
    } else if (absU <= 2) {
      opacity = 0.72 - (absU - 1) * 0.30;
    } else if (absU <= 2.8) {
      opacity = Math.max(0, 0.42 - (absU - 2) * (0.42 / 0.8));
    } else {
      opacity = 0;
    }
    if (isMobile && absU > 1) {
      opacity = opacity * 0.3;
    }
  } else {
    // Landscape Mode: EXACTLY 3 VISIBLE CARDS (Previous [-1], Active [0], Next [+1])
    // Outer cards (|u| > 1.25) smoothly converge to 0 opacity
    if (absU <= 1) {
      opacity = 1 - absU * 0.45; // 1.0 (center) -> 0.55 (side)
    } else if (absU <= 1.30) {
      opacity = Math.max(0, 0.55 - (absU - 1) * (0.55 / 0.30));
    } else {
      opacity = 0;
    }
  }

  // 8. Z-Index: 35 (Center) -> 25 (±1) -> 15 (±2) -> 5 (±3)
  const zIndex = Math.round(35 - absU * 10);

  return {
    x,
    y,
    translateZ,
    scale,
    rotateY,
    rotateZ,
    opacity,
    zIndex,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SOFTWARE BADGE COMPONENT (Software Logo / Icon ONLY, 18-22px)
// ─────────────────────────────────────────────────────────────────────────────
const SoftwareBadge: React.FC<{ icon: string }> = ({ icon }) => {
  switch (icon) {
    case 'after-effects':
      return (
        <div
          title="Adobe After Effects"
          className="w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-[5px] bg-[#171026] border border-[#9999FF]/40 flex items-center justify-center shadow-xs flex-shrink-0 select-none"
        >
          <span className="text-[#9999FF] text-[9.5px] sm:text-[10px] font-sora font-extrabold tracking-tighter leading-none">Ae</span>
        </div>
      );
    case 'premiere-pro':
      return (
        <div
          title="Adobe Premiere Pro"
          className="w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-[5px] bg-[#1A0E2B] border border-[#EA77FF]/40 flex items-center justify-center shadow-xs flex-shrink-0 select-none"
        >
          <span className="text-[#EA77FF] text-[9.5px] sm:text-[10px] font-sora font-extrabold tracking-tighter leading-none">Pr</span>
        </div>
      );
    case 'photoshop':
      return (
        <div
          title="Adobe Photoshop"
          className="w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-[5px] bg-[#0A182E] border border-[#31A8FF]/40 flex items-center justify-center shadow-xs flex-shrink-0 select-none"
        >
          <span className="text-[#31A8FF] text-[9.5px] sm:text-[10px] font-sora font-extrabold tracking-tighter leading-none">Ps</span>
        </div>
      );
    case 'illustrator':
      return (
        <div
          title="Adobe Illustrator"
          className="w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-[5px] bg-[#241708] border border-[#FF9A00]/40 flex items-center justify-center shadow-xs flex-shrink-0 select-none"
        >
          <span className="text-[#FF9A00] text-[9.5px] sm:text-[10px] font-sora font-extrabold tracking-tighter leading-none">Ai</span>
        </div>
      );
    case 'figma':
      return (
        <div
          title="Figma"
          className="w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-[5px] bg-[#1E1E1E] border border-white/20 flex items-center justify-center shadow-xs flex-shrink-0 select-none"
        >
          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none">
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
          title="CapCut"
          className="w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-[5px] bg-black border border-white/25 flex items-center justify-center shadow-xs flex-shrink-0 select-none"
        >
          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="white">
            <path d="M4 6.5C4 5.12 5.12 4 6.5 4h11C18.88 4 20 5.12 20 6.5v11c0 1.38-1.12 2.5-2.5 2.5h-11C5.12 20 4 18.88 4 17.5v-11zm8 2.5l-4 6h8l-4-6z" />
          </svg>
        </div>
      );
    default:
      return (
        <div
          title="Creative Cloud"
          className="w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-[5px] bg-[#222] border border-[#D4C3A3]/40 flex items-center justify-center shadow-xs flex-shrink-0 select-none"
        >
          <span className="text-[#C4943A] text-[9.5px] sm:text-[10px] font-sora font-bold leading-none">CC</span>
        </div>
      );
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PERMANENT ORBITAL VIDEO CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface PermanentOrbitCardProps {
  index: number;
  video: FeaturedVideo;
  position: MotionValue<number>;
  totalVideos: number;
  orientation: 'portrait' | 'landscape';
  activeIndex: number;
  isPlaying: boolean;
  isMuted: boolean;
  onTogglePlay: (e?: React.MouseEvent) => void;
  onToggleMute: (e?: React.MouseEvent) => void;
  onOpenFullscreen: (video: FeaturedVideo) => void;
  onCardClick: (index: number) => void;
  videoRefs: React.MutableRefObject<(HTMLVideoElement | null)[]>;
  isSectionInView: boolean;
  isModalOpen?: boolean;
  windowWidth?: number;
}

const PermanentOrbitCard: React.FC<PermanentOrbitCardProps> = ({
  index,
  video,
  position,
  totalVideos,
  orientation,
  activeIndex,
  isPlaying,
  isMuted,
  onTogglePlay,
  onToggleMute,
  onOpenFullscreen,
  onCardClick,
  videoRefs,
  isSectionInView,
  isModalOpen,
  windowWidth,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentWidth = windowWidth ?? (typeof window !== 'undefined' ? window.innerWidth : 1200);
  const isPortrait = orientation === 'portrait';
  const isMobile = currentWidth < 768;
  const isTablet = currentWidth >= 768 && currentWidth < 1024;

  const isCenter = activeIndex === index;

  // Clear hide timer when active card changes
  useEffect(() => {
    if (!isCenter) {
      setIsHovered(false);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    }
  }, [isCenter]);

  // Robust Hover Handlers with 1-Second Hide Delay
  const handleMouseEnter = () => {
    if (!isCenter) return;
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!isCenter) return;
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setIsHovered(false);
      hideTimerRef.current = null;
    }, 1000);
  };

  // GPU-composited continuous 3D transforms (pure GPU RAF, no CSS transition conflict)
  const transform = useTransform(position, (p) => {
    const u = getWrappedOffset(index, p, totalVideos);
    const t = getCurvedOrbitTransform(u, isPortrait, isMobile, isTablet, currentWidth);
    return `translate3d(calc(-50% + ${t.x}px), calc(-50% + ${t.y}px), ${t.translateZ}px) scale(${t.scale}) rotateY(${t.rotateY}deg) rotateZ(${t.rotateZ}deg)`;
  });

  const opacity = useTransform(position, (p) => {
    const u = getWrappedOffset(index, p, totalVideos);
    return getCurvedOrbitTransform(u, isPortrait, isMobile, isTablet, currentWidth).opacity;
  });

  const zIndex = useTransform(position, (p) => {
    const u = getWrappedOffset(index, p, totalVideos);
    return getCurvedOrbitTransform(u, isPortrait, isMobile, isTablet, currentWidth).zIndex;
  });

  const pointerEvents = useTransform(position, (p) => {
    const u = getWrappedOffset(index, p, totalVideos);
    return Math.abs(u) <= 2.8 ? 'auto' : 'none';
  });

  const wrappedOffset = getWrappedOffset(index, activeIndex, totalVideos);
  const isNearActive = Math.abs(wrappedOffset) <= 2;
  const shouldLoadVideo = isSectionInView && isCenter && !isModalOpen;
  const videoSrc = shouldLoadVideo ? video.videoUrl : undefined;

  return (
    <motion.div
      initial={false}
      style={{
        transform,
        opacity,
        zIndex,
        pointerEvents,
        willChange: 'transform, opacity',
        transformStyle: 'preserve-3d',
      }}
      className={`absolute top-1/2 left-1/2 select-none cursor-pointer ${
        isCenter ? 'hover:scale-[1.01]' : 'hover:brightness-105'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        if (!isCenter) {
          onCardClick(index);
        } else {
          onOpenFullscreen(video);
        }
      }}
    >
      {/* 
        FLUID 700ms PORTRAIT <-> LANDSCAPE SHELL MORPH
        All dimensions, radius, shadows, and borders morph together in 700ms
      */}
      <div
        ref={cardRef}
        onPointerEnter={handleMouseEnter}
        onPointerLeave={handleMouseLeave}
        className={`group relative overflow-hidden rounded-[1.5rem] border bg-[#0F0F0F] transition-[width,height,box-shadow,border-color,border-radius] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          orientation === 'portrait'
            ? 'w-[235px] sm:w-[245px] md:w-[255px] lg:w-[260px] h-[418px] sm:h-[435px] md:h-[453px] lg:h-[462px]'
            : 'w-[clamp(215px,66vw,300px)] sm:w-[440px] md:w-[520px] lg:w-[580px] h-[clamp(121px,37.125vw,169px)] sm:h-[248px] md:h-[292px] lg:h-[326px]'
        } ${
          isCenter
            ? 'border-[#E5D7BE]/50 shadow-[0_25px_60px_-15px_rgba(45,38,30,0.35),0_8px_20px_-5px_rgba(196,148,58,0.2)]'
            : 'border-white/10 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.3)]'
        }`}
      >
        {/* VIDEO RENDERING LAYER */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
          {/* LANDSCAPE MODE AMBIENT GLOW (High-performance CSS ambient light without duplicate hardware decoders) */}
          <div
            className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              orientation === 'landscape' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="w-full h-full scale-125 filter blur-3xl opacity-65"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(196, 148, 58, 0.42) 0%, rgba(30, 41, 59, 0.65) 55%, rgba(0, 0, 0, 0.95) 100%)',
              }}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* INSTANT CRISP POSTER PREVIEW (Guarantees zero black flashes / blank frames) */}
          {video.poster && (
            <img
              src={video.poster}
              alt={video.title}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 w-full h-full pointer-events-none select-none z-10 transition-opacity duration-300 ${
                orientation === 'portrait' ? 'object-cover' : 'object-contain max-w-[90%] max-h-[96%]'
              } ${isCenter && isPlaying && shouldLoadVideo ? 'opacity-0' : 'opacity-100'}`}
            />
          )}

          {/* FOREGROUND VIDEO (Mounted only on active center card to maintain single hardware decoder) */}
          {shouldLoadVideo ? (
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={videoSrc}
              poster={video.poster}
              playsInline
              loop
              muted={isMuted}
              preload="auto"
              className={`relative z-10 w-full h-full transition-[max-width,max-height,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                orientation === 'portrait' ? 'object-cover' : 'object-contain max-w-[90%] max-h-[96%] drop-shadow-2xl'
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

          {/* Scrim for side cards to focus center hero */}
          {!isCenter && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30 z-20 pointer-events-none transition-opacity duration-300" />
          )}

          {/* HOVER-BASED ACTIVE VIDEO CONTROLS (Both Portrait & Landscape, 1s Hide Delay) */}
          {isCenter && (
            <div
              style={{
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.96)',
                pointerEvents: isHovered ? 'auto' : 'none',
                transition: isHovered
                  ? 'opacity 200ms cubic-bezier(0.22, 1, 0.36, 1), transform 200ms cubic-bezier(0.22, 1, 0.36, 1)'
                  : 'opacity 280ms cubic-bezier(0.22, 1, 0.36, 1), transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              className="absolute bottom-3 sm:bottom-4 inset-x-0 flex items-center justify-center z-30"
              onClick={(e) => e.stopPropagation()}
            >
              <VideoCustomControls
                videoRef={{ current: videoRefs.current[index] }}
                containerRef={cardRef}
                isPlaying={isPlaying}
                onTogglePlay={onTogglePlay}
                isMuted={isMuted}
                onToggleMute={onToggleMute}
                onToggleFullscreen={() => onOpenFullscreen(video)}
                orientation={orientation}
                className="opacity-95 hover:opacity-100 transition-opacity duration-200"
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// LIQUID GLASS DYNAMIC VIDEO PROJECT INFO PILL
// ─────────────────────────────────────────────────────────────────────────────
interface LiquidGlassProjectPillProps {
  activeVideo: FeaturedVideo;
  direction: number;
  isPlaying: boolean;
  isSectionInView: boolean;
  onOpenFullscreen?: (video: FeaturedVideo) => void;
}

const LiquidGlassProjectPill: React.FC<LiquidGlassProjectPillProps> = ({
  activeVideo,
  direction,
  isPlaying,
  isSectionInView,
  onOpenFullscreen,
}) => {
  const textVariants = {
    initial: (dir: number) => ({
      opacity: 0,
      y: dir > 0 ? 8 : -8,
    }),
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.30,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      y: dir > 0 ? -8 : 8,
      transition: {
        duration: 0.22,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const iconVariants = {
    initial: { opacity: 0, scale: 0.88 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.26, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      scale: 0.88,
      transition: { duration: 0.20, ease: 'easeIn' },
    },
  };

  return (
    <div className="w-full flex items-center justify-center z-30 mb-2 sm:mb-3 lg:mb-4 px-4 min-h-[58px] h-[58px] sm:h-[62px]">
      <motion.div
        initial={false}
        animate={{
          width: isSectionInView ? 'min(100%, 820px)' : '54px',
          height: isSectionInView ? '58px' : '54px',
          borderRadius: '9999px',
        }}
        transition={{
          duration: 0.70,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          background: 'rgba(255, 255, 255, 0.55)',
          backdropFilter: 'blur(20px) saturate(125%)',
          WebkitBackdropFilter: 'blur(20px) saturate(125%)',
          boxShadow: 'inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.75), 0 10px 30px -8px rgba(45, 38, 30, 0.09)',
        }}
        className="relative overflow-hidden border border-white/60 flex items-center justify-center"
      >
        {/* LIQUID GLASS INTERNAL LIGHT REFLECTION ACCENT */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(115deg, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.05) 45%, rgba(255, 255, 255, 0.18) 100%)',
          }}
        />

        {/* COLLAPSED STATE */}
        <motion.div
          animate={{
            opacity: isSectionInView ? 0 : 1,
            scale: isSectionInView ? 0.4 : 1,
          }}
          transition={{ duration: 0.25 }}
          className={`absolute inset-0 flex items-center justify-center pointer-events-none text-[#C4943A] ${
            isSectionInView ? 'invisible' : 'visible'
          }`}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-[#C4943A]/25 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C4943A]" />
          </div>
        </motion.div>

        {/* EXPANDED 3-ZONE LIQUID GLASS METADATA */}
        <motion.div
          animate={{
            opacity: isSectionInView ? 1 : 0,
            y: isSectionInView ? 0 : 4,
          }}
          transition={{
            duration: 0.35,
            delay: isSectionInView ? 0.30 : 0,
            ease: 'easeOut',
          }}
          className={`relative z-10 w-full px-4 sm:px-8 py-2 flex items-center justify-between gap-3 sm:gap-6 whitespace-nowrap overflow-hidden ${
            isSectionInView ? 'visible' : 'invisible'
          }`}
        >
          {/* ZONE 1: Play Icon + Video Title (Flexible width, primary info) */}
          <div
            onClick={() => onOpenFullscreen?.(activeVideo)}
            className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1 overflow-hidden cursor-pointer hover:opacity-85 transition-opacity"
          >
            <div className="relative w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-[#FAF0E4]/90 border border-[#E5C89C]/50 flex items-center justify-center text-[#C4943A] flex-shrink-0 shadow-inner">
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              {isPlaying && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C4943A] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C4943A]" />
                </span>
              )}
            </div>

            <div className="relative h-6 flex-1 min-w-0 overflow-hidden flex items-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.span
                  key={activeVideo.id}
                  custom={direction}
                  variants={textVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute inset-x-0 font-playfair font-bold text-[14px] sm:text-[16px] text-[#1A1A1A] tracking-[-0.01em] truncate select-none leading-normal"
                >
                  {activeVideo.title}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <div className="w-[1px] h-5 bg-[#D4C3A3]/40 flex-shrink-0" />

          {/* ZONE 2: Software Logo Only (Fixed 38px width, perfectly centered) */}
          <div className="w-9 sm:w-11 h-6 flex items-center justify-center flex-shrink-0">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeVideo.id}
                variants={iconVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex items-center justify-center"
              >
                <SoftwareBadge icon={activeVideo.projectInfo?.software?.icon || 'after-effects'} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="w-[1px] h-5 bg-[#D4C3A3]/40 flex-shrink-0" />

          {/* ZONE 3: Category Tag Capsule (Flex-shrink-0, ALWAYS visible) */}
          <div className="flex-shrink-0 h-6 flex items-center justify-end">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeVideo.id}
                custom={direction}
                variants={textVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex items-center"
              >
                <span className="font-sora text-[10px] sm:text-[11px] font-semibold text-[#9C7026] tracking-[0.08em] uppercase bg-[#FAF0E4]/90 border border-[#E5C89C]/70 px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-full shadow-xs select-none">
                  {activeVideo.projectInfo?.category || activeVideo.category}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN VIDEO SECTION COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const VideoSection: React.FC = () => {
  const { openArchive } = useArchive();
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [activeIndex, setActiveIndex] = useState(0);
  const [navDirection, setNavDirection] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<FeaturedVideo | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Continuous floating position value (e.g. 0, 1, 2, 3... -1, -2...). Never resets.
  const position = useMotionValue(0);

  // Prevent spamming double transitions during active animation
  const isAnimatingRef = useRef(false);
  const hasDraggedRef = useRef(false);

  const handleOpenFullscreen = useCallback((video: FeaturedVideo) => {
    setIsPlaying(false);
    if (videoRefs.current[activeIndex]) {
      videoRefs.current[activeIndex]?.pause();
    }
    setSelectedVideo(video);
  }, [activeIndex]);

  // Section in-view trigger for pill morph animation (triggers at 25-35% in view)
  // rootMargin of 400px ensures poster images start loading before section reaches viewport
  const isSectionInView = useInView(sectionRef, {
    amount: 0.28,
    once: false,
    margin: '400px 0px 0px 0px',
  });

  const totalVideos = featuredVideos.length;

  const [windowWidth, setWindowWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200));

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isPortrait = orientation === 'portrait';
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const stepX = isPortrait
    ? (isMobile ? 110 : isTablet ? 165 : 220)
    : (isMobile ? Math.round(Math.min(160, Math.max(120, windowWidth * 0.36))) : isTablet ? 320 : 420);

  // Scroll reveal animation for section header elements
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.video-header-elem',
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Update activeIndex continuously whenever position changes
  useEffect(() => {
    const unsubscribe = position.on('change', (latest) => {
      const nearest = mod(Math.round(latest), totalVideos);
      setActiveIndex(nearest);
    });
    return () => unsubscribe();
  }, [position, totalVideos]);

  // Manage video playback based on activeIndex and section visibility
  useEffect(() => {
    if (!isSectionInView) {
      videoRefs.current.forEach((videoEl) => videoEl?.pause());
      setIsPlaying(false);
      return;
    }

    videoRefs.current.forEach((videoEl, idx) => {
      if (!videoEl) return;
      if (idx === activeIndex) {
        videoEl.muted = isMuted;
        const p = videoEl.play();
        if (p !== undefined) {
          p.then(() => setIsPlaying(true)).catch(() => {
            videoEl.muted = true;
            setIsMuted(true);
            videoEl.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          });
        }
      } else {
        videoEl.pause();
      }
    });
  }, [activeIndex, orientation, isMuted, isSectionInView]);

  // Handle Play/Pause toggle
  const handleTogglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const mainVid = videoRefs.current[activeIndex];
    if (!mainVid) return;

    if (mainVid.paused) {
      mainVid.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      mainVid.pause();
      setIsPlaying(false);
    }
  };

  // Handle Mute toggle
  const handleToggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const mainVid = videoRefs.current[activeIndex];
    if (!mainVid) return;

    const newMuted = !isMuted;
    mainVid.muted = newMuted;
    setIsMuted(newMuted);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // 1. SEAMLESS CONTINUOUS 3D NAVIGATION ENGINE (520ms, cubic-bezier(0.22,1,0.36,1))
  // ─────────────────────────────────────────────────────────────────────────
  const goNext = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setNavDirection(1);

    const target = Math.round(position.get()) + 1;
    animate(position, target, {
      duration: 0.52,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });
  }, [position]);

  const goPrevious = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setNavDirection(-1);

    const target = Math.round(position.get()) - 1;
    animate(position, target, {
      duration: 0.52,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });
  }, [position]);

  const handleCardClick = useCallback(
    (targetIndex: number, video?: FeaturedVideo) => {
      if (hasDraggedRef.current) return;
      const current = position.get();
      const offset = getWrappedOffset(targetIndex, current, totalVideos);

      if (Math.abs(offset) > 0.3) {
        // Side video card clicked: smoothly rotate to front/center!
        isAnimatingRef.current = true;
        setNavDirection(offset > 0 ? 1 : -1);

        const target = current + offset;
        animate(position, target, {
          duration: 0.52,
          ease: [0.22, 1, 0.36, 1],
          onComplete: () => {
            isAnimatingRef.current = false;
          },
        });
      } else {
        // Active center card clicked: open full-screen MediaViewer!
        const v = video || featuredVideos[targetIndex];
        if (v) handleOpenFullscreen(v);
      }
    },
    [position, totalVideos, handleOpenFullscreen]
  );

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goPrevious();
      } else if (e.key === 'ArrowRight') {
        goNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrevious]);

  // ─────────────────────────────────────────────────────────────────────────
  // 2. ORBITAL POINTER DRAG & SWIPE GESTURE
  // ─────────────────────────────────────────────────────────────────────────
  const pointerState = useRef({
    isDown: false,
    startX: 0,
    startTime: 0,
    startPosition: 0,
    pointerId: -1,
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || isAnimatingRef.current) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-timeline]')) return;

    hasDraggedRef.current = false;
    pointerState.current = {
      isDown: true,
      startX: e.clientX,
      startTime: Date.now(),
      startPosition: position.get(),
      pointerId: e.pointerId,
    };
    setIsDragging(false);
    position.stop();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerState.current.isDown || pointerState.current.pointerId !== e.pointerId) return;
    const deltaX = e.clientX - pointerState.current.startX;
    if (Math.abs(deltaX) > 6) {
      hasDraggedRef.current = true;
      if (!isDragging) setIsDragging(true);
      position.set(pointerState.current.startPosition - deltaX / stepX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!pointerState.current.isDown || pointerState.current.pointerId !== e.pointerId) return;
    pointerState.current.isDown = false;
    const deltaX = e.clientX - pointerState.current.startX;
    const duration = Math.max(1, Date.now() - pointerState.current.startTime);
    const velocityX = (deltaX / duration) * 1000; // px/sec
    const currentP = position.get();

    setIsDragging(false);

    // If it was a simple tap / click without dragging, do NOT snap or trigger animation
    // Allow onClick / handleCardClick to fire smoothly!
    if (!hasDraggedRef.current && Math.abs(deltaX) <= 6) {
      return;
    }

    const threshold = stepX * 0.20;
    const isFastSwipe = Math.abs(velocityX) > 280 && Math.abs(deltaX) > 15;

    let target: number;
    if (deltaX < -threshold || (isFastSwipe && velocityX < 0)) {
      target = Math.floor(currentP) + 1;
      setNavDirection(1);
    } else if (deltaX > threshold || (isFastSwipe && velocityX > 0)) {
      target = Math.ceil(currentP) - 1;
      setNavDirection(-1);
    } else {
      target = Math.round(currentP);
    }

    isAnimatingRef.current = true;
    animate(position, target, {
      duration: 0.52,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });
  };

  const activeVideo = featuredVideos[activeIndex] || featuredVideos[0];

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative w-full h-[100svh] min-h-[760px] max-h-[1080px] pt-12 sm:pt-14 lg:pt-14 pb-8 sm:pb-9 lg:pb-9 overflow-hidden bg-[#FAF3E8] z-[10] select-none flex flex-col justify-between"
    >
      {/* Background Subtle Warm Gradient */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#FAF3E8] via-[#FAF0E4]/30 to-[#FAF3E8]" />

      {/* Main Composition Container */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 relative z-10 flex flex-col justify-between h-full flex-grow">
        
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* 1. TOP ZONE: Editorial Heading (Left) + Mode Toggle (Right) */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="w-full flex items-start justify-between video-header-elem">
          {/* Left Column Editorial Header */}
          <div className="max-w-[360px] sm:max-w-[390px] lg:max-w-[420px] z-30">
            <div className="inline-flex items-center gap-2 mb-1 sm:mb-1.5">
              <span className="text-[#B8860B] text-[0.72rem] sm:text-[0.78rem] font-sora font-semibold tracking-[0.2em] uppercase">
                {videoSectionData.eyebrow}
              </span>
              <span className="w-8 h-[1px] bg-[#C4943A]/60" />
            </div>

            <h2 className="font-playfair text-[clamp(1.85rem,2.8vw,2.75rem)] text-[#1A1A1A] font-bold leading-[1.08] mb-1.5 sm:mb-2">
              {videoSectionData.heading.replace('.', '')}
              <span className="text-[#C4943A]">.</span>
            </h2>

            <p className="text-[#555555] text-xs font-sora leading-relaxed max-w-[360px] mb-2 sm:mb-2.5">
              {videoSectionData.description}
            </p>

            <button
              type="button"
              onClick={() => openArchive('VIDEOS')}
              className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-sora font-semibold tracking-[0.16em] uppercase text-[#1A1A1A] hover:text-[#C4943A] transition-colors group pb-0.5 border-b border-[#1A1A1A]/80 hover:border-[#C4943A] cursor-pointer"
            >
              <span>{videoSectionData.exploreLink}</span>
            </button>
          </div>

          {/* Right Area: Mode Toggle Pill */}
          <div className="flex justify-end z-30 pt-0.5">
            <div className="relative flex items-center p-1 bg-white/60 backdrop-blur-md rounded-full border border-[#D4C3A3]/50 shadow-sm">
              <button
                onClick={() => setOrientation('landscape')}
                className={`relative z-10 px-3.5 sm:px-4.5 py-1 sm:py-1.5 text-[10.5px] sm:text-xs font-sora font-semibold tracking-[0.12em] rounded-full transition-colors duration-300 ${
                  orientation === 'landscape' ? 'text-white' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
                }`}
              >
                LANDSCAPE
              </button>
              <button
                onClick={() => setOrientation('portrait')}
                className={`relative z-10 px-3.5 sm:px-4.5 py-1 sm:py-1.5 text-[10.5px] sm:text-xs font-sora font-semibold tracking-[0.12em] rounded-full transition-colors duration-300 ${
                  orientation === 'portrait' ? 'text-white' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
                }`}
              >
                PORTRAIT
              </button>

              <motion.div
                className="absolute top-1 bottom-1 bg-[#A67C37] rounded-full shadow-md z-0"
                initial={false}
                animate={{
                  left: orientation === 'landscape' ? '4px' : 'calc(50% + 1px)',
                  width: 'calc(50% - 5px)',
                }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* 2. MIDDLE ZONE: 3D CURVED ORBITAL FILM STRIP (.carousel-viewport) */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div
          className={`carousel-viewport relative w-full flex items-center justify-center transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] my-auto ${
            orientation === 'landscape' ? 'overflow-hidden' : ''
          } ${
            orientation === 'portrait'
              ? 'h-[430px] sm:h-[455px] md:h-[475px] lg:h-[485px]'
              : 'h-[330px] sm:h-[455px] md:h-[475px] lg:h-[485px]'
          }`}
          style={{ perspective: '1200px', perspectiveOrigin: 'center center', transformStyle: 'preserve-3d' }}
        >
          {/* DRAGGABLE CARDS STAGE (Layer: z-10 to z-35) */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`video-card-container relative w-full h-full flex items-center justify-center touch-pan-y ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {featuredVideos.map((video, index) => (
              <PermanentOrbitCard
                key={video.id}
                index={index}
                video={video}
                position={position}
                totalVideos={totalVideos}
                orientation={orientation}
                activeIndex={activeIndex}
                isPlaying={isPlaying}
                isMuted={isMuted}
                onTogglePlay={handleTogglePlay}
                onToggleMute={handleToggleMute}
                onOpenFullscreen={handleOpenFullscreen}
                onCardClick={(idx) => handleCardClick(idx, video)}
                videoRefs={videoRefs}
                isSectionInView={isSectionInView}
                isModalOpen={!!selectedVideo}
                windowWidth={windowWidth}
              />
            ))}
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* SOFT SIDE FADE MASKS (Layer: z-40, above cards, below buttons) */}
          {/* Active in landscape mode so side cards dissolve softly near buttons */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div
            className={`absolute left-0 inset-y-0 w-12 sm:w-36 md:w-48 lg:w-60 bg-gradient-to-r from-[#FAF3E8] via-[#FAF3E8]/85 to-transparent pointer-events-none z-40 transition-opacity duration-700 ${
              orientation === 'landscape' ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div
            className={`absolute right-0 inset-y-0 w-12 sm:w-36 md:w-48 lg:w-60 bg-gradient-to-l from-[#FAF3E8] via-[#FAF3E8]/85 to-transparent pointer-events-none z-40 transition-opacity duration-700 ${
              orientation === 'landscape' ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* CIRCULAR NAVIGATION BUTTONS (LEFT & RIGHT) (Layer: z-50, always on top) */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <button
            onClick={goPrevious}
            type="button"
            aria-label="Previous video"
            className={`absolute ${orientation === 'landscape' ? 'left-1 sm:left-4' : 'left-2 sm:left-4'} lg:left-8 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white active:scale-95 backdrop-blur-md border border-[#D4C3A3]/60 shadow-[0_8px_24px_-4px_rgba(45,38,30,0.22)] flex items-center justify-center text-[#1A1A1A] hover:text-[#C4943A] transition-all cursor-pointer pointer-events-auto group`}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goNext}
            type="button"
            aria-label="Next video"
            className={`absolute ${orientation === 'landscape' ? 'right-1 sm:right-4' : 'right-2 sm:right-4'} lg:right-8 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white active:scale-95 backdrop-blur-md border border-[#D4C3A3]/60 shadow-[0_8px_24px_-4px_rgba(45,38,30,0.22)] flex items-center justify-center text-[#1A1A1A] hover:text-[#C4943A] transition-all cursor-pointer pointer-events-auto group`}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* 3. BOTTOM ZONE: LIQUID GLASS DYNAMIC VIDEO PROJECT INFO PILL */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <LiquidGlassProjectPill
          activeVideo={activeVideo}
          direction={navDirection}
          isPlaying={isPlaying}
          isSectionInView={isSectionInView}
          onOpenFullscreen={handleOpenFullscreen}
        />

      </div>

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 4. FULL-SCREEN VIDEO VIEWER MODAL */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <MediaViewer
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        item={
          selectedVideo
            ? {
                id: selectedVideo.id,
                title: selectedVideo.title,
                subtitle: selectedVideo.projectInfo?.category || selectedVideo.category,
                description: selectedVideo.description || `${selectedVideo.title} — Produced & Edited by Arpit AK`,
                thumbnail: selectedVideo.poster || selectedVideo.videoUrl.replace(/\.mp4$/, '.webp'),
                videoUrl: selectedVideo.videoUrl,
                duration: selectedVideo.duration,
                category: 'Video Project',
                type: 'video',
                orientation: orientation,
                aspectRatio: orientation === 'landscape' ? 16 / 9 : 9 / 16,
              }
            : null
        }
        onActiveVideoChange={(vid) => {
          const idx = featuredVideos.findIndex((v) => v.id === vid.id);
          if (idx >= 0) {
            const curr = position.get();
            const diff = getWrappedOffset(idx, curr, totalVideos);
            if (Math.abs(diff) > 0.1) {
              position.set(curr + diff);
            }
          }
        }}
      />
    </section>
  );
};

export default VideoSection;
