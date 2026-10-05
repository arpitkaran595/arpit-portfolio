import React from 'react';

export type TransitionVariant =
  | 'hero-to-about'
  | 'about-to-videos'
  | 'videos-to-stories'
  | 'stories-to-creatives'
  | 'creatives-to-thumbnails'
  | 'thumbnails-to-digital'
  | 'digital-to-experience'
  | 'thumbnails-to-experience'
  | 'experience-to-contact'
  | 'contact-to-footer';

interface SectionTransitionProps {
  variant: TransitionVariant;
  className?: string;
}

export default function SectionTransition({
  variant,
  className = '',
}: SectionTransitionProps) {
  switch (variant) {
    case 'hero-to-about':
      return null;

    // ═══════════════════════════════════════════
    // 2. ABOUT → VIDEOS: Dedicated Overlapping Atmospheric Transition Zone
    // ═══════════════════════════════════════════
    // 2. SELECTED CASE STUDIES → VIDEOS: Subtle Warm Bridge
    // ═══════════════════════════════════════════
    case 'about-to-videos':
      return (
        <div
          className={`relative w-full h-0 pointer-events-none z-[12] flex items-center justify-center ${className}`}
          style={{ overflowX: 'clip', overflowY: 'visible' }}
        >
          {/* 1. Underlying ambient warm golden-peach glow */}
          <div
            className="absolute -top-36 h-72 inset-x-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(246, 215, 178, 0.12) 0%, rgba(250, 243, 232, 0.03) 55%, transparent 75%)',
            }}
          />

          {/* 2. Seamless continuous bridge */}
          <div
            className="absolute -top-24 h-48 inset-x-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, transparent 0%, rgba(250, 243, 232, 0.5) 30%, #FAF3E8 50%, rgba(250, 243, 232, 0.7) 70%, transparent 100%)',
            }}
          />

          {/* 3. Whisper-soft atmospheric mist */}
          <div className="absolute -top-32 h-64 inset-x-0 w-full overflow-hidden flex justify-center pointer-events-none">
            <img
              src="/assets/atmospheric-mist.webp"
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center opacity-10 min-w-full"
              style={{
                filter: 'contrast(1.01) saturate(1.01)',
                maskImage:
                  'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 25%, black 50%, rgba(0,0,0,0.3) 75%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 25%, black 50%, rgba(0,0,0,0.3) 75%, transparent 100%)',
              }}
              draggable={false}
            />
          </div>
        </div>
      );

    // ═══════════════════════════════════════════
    // 3. VIDEOS → STORIES: Clean Editorial Warm Transition
    // ═══════════════════════════════════════════
    case 'videos-to-stories':
      return (
        <div
          className={`relative w-full h-0 pointer-events-none z-[12] flex items-center justify-center ${className}`}
          style={{ overflowX: 'clip', overflowY: 'visible' }}
        >
          {/* Ambient warm golden-peach radial warmth */}
          <div
            className="absolute -top-36 sm:-top-40 md:-top-48 lg:-top-52 h-72 sm:h-80 md:h-96 lg:h-[420px] inset-x-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(246, 215, 178, 0.08) 0%, rgba(250, 243, 232, 0.02) 55%, transparent 80%)',
            }}
          />
        </div>
      );

    // ═══════════════════════════════════════════
    // 4. STORIES → CREATIVES: Clean Editorial Warm Transition
    // ═══════════════════════════════════════════
    case 'stories-to-creatives':
      return (
        <div
          className={`relative w-full h-0 pointer-events-none z-[12] flex items-center justify-center ${className}`}
          style={{ overflowX: 'clip', overflowY: 'visible' }}
        >
          {/* Ambient warm golden-peach radial warmth */}
          <div
            className="absolute -top-36 sm:-top-40 md:-top-48 lg:-top-52 h-72 sm:h-80 md:h-96 lg:h-[420px] inset-x-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(246, 215, 178, 0.08) 0%, rgba(250, 243, 232, 0.02) 55%, transparent 80%)',
            }}
          />
        </div>
      );

    // ═══════════════════════════════════════════
    // 5. CREATIVES → THUMBNAILS: Clean Editorial Warm Transition
    // ═══════════════════════════════════════════
    case 'creatives-to-thumbnails':
      return (
        <div
          className={`relative w-full h-0 pointer-events-none z-[12] flex items-center justify-center ${className}`}
          style={{ overflowX: 'clip', overflowY: 'visible' }}
        >
          {/* Ambient warm golden-peach / sand radial glow */}
          <div
            className="absolute -top-48 sm:-top-56 md:-top-64 h-[420px] sm:h-[500px] md:h-[600px] inset-x-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(246, 215, 178, 0.08) 0%, rgba(250, 243, 232, 0.02) 55%, transparent 80%)',
            }}
          />
        </div>
      );

    // ═══════════════════════════════════════════
    // 6. THUMBNAILS → DIGITAL WORK: Clean Editorial Warm Transition
    // ═══════════════════════════════════════════
    case 'thumbnails-to-digital':
    case 'thumbnails-to-experience':
      return (
        <div
          className={`relative w-full h-0 pointer-events-none z-[12] flex items-center justify-center ${className}`}
          style={{ overflowX: 'clip', overflowY: 'visible' }}
        >
          {/* Ambient warm golden-peach / sand radial glow */}
          <div
            className="absolute -top-48 sm:-top-56 md:-top-64 h-[420px] sm:h-[500px] md:h-[600px] inset-x-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(246, 215, 178, 0.09) 0%, rgba(250, 243, 232, 0.02) 55%, transparent 80%)',
            }}
          />
        </div>
      );

    // ═══════════════════════════════════════════
    // 6.5. DIGITAL WORK → EXPERIENCE: Atmospheric Dissolve Bridge
    // ═══════════════════════════════════════════
    case 'digital-to-experience':
      return (
        <div
          className={`relative w-full h-0 pointer-events-none z-[12] flex items-center justify-center ${className}`}
          style={{ overflowX: 'clip', overflowY: 'visible' }}
        >
          {/* 1. Warm ambient golden-peach glow */}
          <div
            className="absolute -top-44 sm:-top-52 md:-top-60 h-[380px] sm:h-[460px] md:h-[540px] inset-x-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(246, 215, 178, 0.14) 0%, rgba(250, 243, 232, 0.04) 55%, transparent 80%)',
            }}
          />

          {/* 2. Soft atmospheric mist */}
          <div className="absolute -top-44 sm:-top-52 md:-top-60 h-[380px] sm:h-[460px] md:h-[540px] inset-x-0 w-full overflow-hidden flex justify-center pointer-events-none">
            <img
              src="/assets/atmospheric-mist.webp"
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center opacity-25 min-w-full"
              style={{
                filter: 'contrast(1.01) saturate(1.02)',
                maskImage:
                  'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.30) 20%, black 50%, rgba(0,0,0,0.30) 80%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.30) 20%, black 50%, rgba(0,0,0,0.30) 80%, transparent 100%)',
              }}
              draggable={false}
            />
          </div>
        </div>
      );

    // ═══════════════════════════════════════════
    // 7. EXPERIENCE → CONTACT: Seamless Multi-Layered Atmospheric Dissolve
    // ═══════════════════════════════════════════
    case 'experience-to-contact':
      return (
        <div
          className={`relative w-full h-0 pointer-events-none z-[2] flex items-center justify-center ${className}`}
          style={{ overflowX: 'clip', overflowY: 'visible' }}
        >
          {/* 1. Broad ambient warm golden-peach radial glow */}
          <div
            className="absolute -top-44 sm:-top-52 md:-top-60 h-[380px] sm:h-[460px] md:h-[540px] inset-x-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(246, 215, 178, 0.14) 0%, rgba(253, 248, 243, 0.04) 55%, transparent 80%)',
            }}
          />

          {/* 2. Soft atmospheric mist */}
          <div className="absolute -top-44 sm:-top-52 md:-top-60 h-[380px] sm:h-[460px] md:h-[540px] inset-x-0 w-full overflow-hidden flex justify-center pointer-events-none">
            <img
              src="/assets/atmospheric-mist.webp"
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center opacity-10 min-w-full"
              style={{
                filter: 'contrast(1.01) saturate(1.02)',
                maskImage:
                  'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.30) 20%, black 50%, rgba(0,0,0,0.30) 80%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.30) 20%, black 50%, rgba(0,0,0,0.30) 80%, transparent 100%)',
              }}
              draggable={false}
            />
          </div>
        </div>
      );

    // ═══════════════════════════════════════════
    // 8. CONTACT → FOOTER: Final Visual Descent
    // ═══════════════════════════════════════════
    case 'contact-to-footer':
      return (
        <div
          className={`relative w-full h-0 pointer-events-none z-[5] flex items-center justify-center ${className}`}
          style={{ overflowX: 'clip', overflowY: 'visible' }}
        >
          <div
            className="absolute -top-16 h-32 inset-x-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, transparent 0%, rgba(253, 248, 243, 0.35) 60%, #FDF8F3 100%)',
            }}
          />
        </div>
      );

    default:
      return null;
  }
}
