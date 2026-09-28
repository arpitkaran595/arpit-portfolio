import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const akRef = useRef<HTMLSpanElement>(null);
  const sparkleRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: onComplete
    });

    const chars = textRef.current?.querySelectorAll('.char');

    if (chars && chars.length > 0) {
      tl.fromTo(chars, 
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power3.out' }
      )
      .fromTo(akRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.7)' },
        "-=0.15"
      )
      .fromTo(sparkleRef.current,
        { opacity: 0, scale: 0, rotate: -45 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.3, ease: 'back.out(1.7)' },
        "-=0.15"
      )
      // Sparkle infinite rotation (separate from timeline so onComplete fires)
      gsap.to(sparkleRef.current,
        { rotate: 90, duration: 1.5, ease: 'none', repeat: -1 }
      );

      tl.to(containerRef.current, 
        { yPercent: -100, duration: 0.6, ease: 'power3.inOut' },
        "+=0.2"
      );
    }

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FDF8F3]"
    >
      <div className="relative flex items-center text-charcoal-800 font-bebas text-7xl md:text-9xl tracking-wider">
        <div ref={textRef} className="flex">
          <span className="char inline-block">A</span>
          <span className="char inline-block">R</span>
          <span className="char inline-block">P</span>
          <span className="char inline-block">I</span>
          <span className="char inline-block">T</span>
        </div>
        <span ref={akRef} className="text-gold-400 ml-4 md:ml-6 inline-block text-[#C4943A]">AK</span>
        
        <svg 
          ref={sparkleRef}
          className="absolute -top-4 -right-8 w-6 h-6 md:w-8 md:h-8 text-[#C4943A]" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
        </svg>
      </div>
    </div>
  );
}
