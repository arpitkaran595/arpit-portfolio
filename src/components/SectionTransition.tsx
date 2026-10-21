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
    // 1. CASE STUDIES → VIDEOS: Monograph Ivory into Cinematic Midnight Ink
    // ═══════════════════════════════════════════
    case 'about-to-videos':
      return (
        <div
          className={`relative w-full h-0 pointer-events-none z-[12] flex items-center justify-center ${className}`}
          style={{ overflowX: 'clip', overflowY: 'visible' }}
        >
          {/* 1. Underlying ambient golden-amber cone glow */}
          <div
            className="absolute -top-36 h-72 inset-x-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 60%, rgba(212, 169, 78, 0.12) 0%, rgba(13, 14, 17, 0.4) 60%, transparent 80%)',
            }}
          />

          {/* 2. Fade to black bridge (#FAF6F0 -> #0D0E11) */}
          <div
            className="absolute -top-28 h-56 inset-x-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, #FAF6F0 0%, rgba(250, 246, 240, 0.6) 20%, rgba(20, 21, 26, 0.75) 60%, #0D0E11 100%)',
            }}
          />

          {/* 3. Whisper-soft atmospheric mist */}
          <div className="absolute -top-32 h-64 inset-x-0 w-full overflow-hidden flex justify-center pointer-events-none opacity-20">
            <img
              src="/assets/atmospheric-mist.webp"
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center min-w-full"
              style={{
                filter: 'contrast(1.05) brightness(0.9)',
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
    // 2. VIDEOS → STORIES: Midnight Ink into Gallery Salon Wall (#0D0E11 -> #F6F2EB)
    // ═══════════════════════════════════════════
    case 'videos-to-stories':
      return (
        <div
          className={`relative w-full h-0 pointer-events-none z-[12] flex items-center justify-center ${className}`}
          style={{ overflowX: 'clip', overflowY: 'visible' }}
        >
          {/* Seamless fade up into gallery linen */}
          <div
            className="absolute -top-24 h-48 inset-x-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, #0D0E11 0%, rgba(13, 14, 17, 0.6) 30%, rgba(246, 242, 235, 0.7) 70%, #F6F2EB 100%)',
            }}
          />
        </div>
      );

    // ═══════════════════════════════════════════
    // 3. STORIES → CREATIVES: Gallery Wall into Botanical Sage Studio (#F6F2EB -> #ECEFEA)
    // ═══════════════════════════════════════════
    case 'stories-to-creatives':
      return (
        <div
          className={`relative w-full h-0 pointer-events-none z-[12] flex items-center justify-center ${className}`}
          style={{ overflowX: 'clip', overflowY: 'visible' }}
        >
          <div
            className="absolute -top-20 h-40 inset-x-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, #F6F2EB 0%, rgba(246, 242, 235, 0.5) 40%, rgba(236, 239, 234, 0.6) 70%, #ECEFEA 100%)',
            }}
          />
        </div>
      );

    // ═══════════════════════════════════════════
    // 4. CREATIVES → THUMBNAILS: Sage Studio into Dark Umber Stage (#ECEFEA -> #161514)
    // ═══════════════════════════════════════════
    case 'creatives-to-thumbnails':
      return (
        <div
          className={`relative w-full h-0 pointer-events-none z-[12] flex items-center justify-center ${className}`}
          style={{ overflowX: 'clip', overflowY: 'visible' }}
        >
          {/* Ambient warm amber glow */}
          <div
            className="absolute -top-40 h-80 inset-x-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(212, 169, 78, 0.10) 0%, rgba(22, 21, 20, 0.4) 60%, transparent 80%)',
            }}
          />
          {/* Smooth fade into dark room */}
          <div
            className="absolute -top-28 h-56 inset-x-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, #ECEFEA 0%, rgba(236, 239, 234, 0.5) 25%, rgba(22, 21, 20, 0.75) 65%, #161514 100%)',
            }}
          />
        </div>
      );

    // ═══════════════════════════════════════════
    // 5. THUMBNAILS → DIGITAL WORK: Dark Umber into Architectural Studio White (#161514 -> #F8F7F4)
    // ═══════════════════════════════════════════
    case 'thumbnails-to-digital':
    case 'thumbnails-to-experience':
      return (
        <div
          className={`relative w-full h-0 pointer-events-none z-[12] flex items-center justify-center ${className}`}
          style={{ overflowX: 'clip', overflowY: 'visible' }}
        >
          {/* Transition into modern studio white */}
          <div
            className="absolute -top-28 h-56 inset-x-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, #161514 0%, rgba(22, 21, 20, 0.6) 25%, rgba(248, 247, 244, 0.6) 70%, #F8F7F4 100%)',
            }}
          />
        </div>
      );

    // ═══════════════════════════════════════════
    // 6. DIGITAL WORK → EXPERIENCE: Modern Studio White into Summit Cloudscape (#F8F7F4 -> #FBF5EB)
    // ═══════════════════════════════════════════
    case 'digital-to-experience':
      return (
        <div
          className={`relative w-full h-0 pointer-events-none z-[12] flex items-center justify-center ${className}`}
          style={{ overflowX: 'clip', overflowY: 'visible' }}
        >
          {/* Warm ambient golden dawn glow */}
          <div
            className="absolute -top-44 sm:-top-52 md:-top-60 h-[380px] sm:h-[460px] md:h-[540px] inset-x-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(246, 215, 178, 0.16) 0%, rgba(251, 245, 235, 0.05) 55%, transparent 80%)',
            }}
          />

          {/* Soft atmospheric mist */}
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
    // 7. EXPERIENCE → CONTACT: Multi-Layered Atmospheric Dissolve
    // ═══════════════════════════════════════════
    case 'experience-to-contact':
      return (
        <div
          className={`relative w-full h-0 pointer-events-none z-[2] flex items-center justify-center ${className}`}
          style={{ overflowX: 'clip', overflowY: 'visible' }}
        >
          {/* Ambient warm golden glow */}
          <div
            className="absolute -top-44 sm:-top-52 md:-top-60 h-[380px] sm:h-[460px] md:h-[540px] inset-x-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(246, 215, 178, 0.14) 0%, rgba(246, 239, 233, 0.04) 55%, transparent 80%)',
            }}
          />

          {/* Soft atmospheric mist */}
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
    // 8. CONTACT → FOOTER: Final Visual Descent into Horizon
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
                'linear-gradient(to bottom, transparent 0%, rgba(246, 239, 233, 0.4) 60%, #F6EFE9 100%)',
            }}
          />
        </div>
      );

    default:
      return null;
  }
}
