/**
 * Unified Transition System for Full-Screen Content Viewers
 * Provides one consistent, high-performance animation language across all viewers:
 * - 320ms duration
 * - Cubic-bezier [0.22, 1, 0.36, 1] easing
 * - Direction-aware translate3d(x) + smooth opacity
 * - Zero filter/blur or layout animations during slide
 * - Outgoing and incoming layers overlap seamlessly without blank frames
 */

export const VIEWER_TRANSITION_DURATION = 0.32;
export const VIEWER_TRANSITION_EASE = [0.22, 1, 0.36, 1] as const;

export const viewerSlideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : direction < 0 ? '-100%' : '0%',
    opacity: 0,
  }),
  center: {
    x: '0%',
    opacity: 1,
    transition: {
      x: { duration: VIEWER_TRANSITION_DURATION, ease: VIEWER_TRANSITION_EASE },
      opacity: { duration: 0.26, ease: 'easeOut' },
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : direction < 0 ? '100%' : '0%',
    opacity: 0,
    transition: {
      x: { duration: VIEWER_TRANSITION_DURATION, ease: VIEWER_TRANSITION_EASE },
      opacity: { duration: 0.22, ease: 'easeIn' },
    },
  }),
};
