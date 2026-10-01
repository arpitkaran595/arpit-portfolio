import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop handles scroll restoration across routes and smooth hash anchors.
 * - On navigating from '/' to '/work/:slug', saves the homepage scroll position.
 * - On entering '/work/:slug', resets scroll to (0, 0).
 * - On returning to '/' without a hash, restores the saved homepage scroll position.
 * - On hash navigation (e.g. /#digital-work), smoothly scrolls to the target section.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const prevPathRef = useRef<string>(pathname);

  useEffect(() => {
    const isNavigatingToCaseStudy = pathname.startsWith('/work/');
    const isNavigatingBackToHome = prevPathRef.current.startsWith('/work/') && pathname === '/';

    // If leaving home to view a case study, save current scroll position
    if (prevPathRef.current === '/' && isNavigatingToCaseStudy) {
      sessionStorage.setItem('home_scroll_pos', window.scrollY.toString());
    }

    if (hash) {
      const targetId = hash.replace('#', '');
      const timer = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          if ((window as any).lenis) {
            (window as any).lenis.scrollTo(element, { offset: -70, duration: 1.0 });
          } else {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
      prevPathRef.current = pathname;
      return () => clearTimeout(timer);
    }

    if (isNavigatingBackToHome) {
      const savedScroll = sessionStorage.getItem('home_scroll_pos');
      if (savedScroll) {
        const top = parseInt(savedScroll, 10);
        const timer = setTimeout(() => {
          if ((window as any).lenis) {
            (window as any).lenis.scrollTo(top, { immediate: true });
          } else {
            window.scrollTo({ top, left: 0, behavior: 'instant' });
          }
        }, 60);
        prevPathRef.current = pathname;
        return () => clearTimeout(timer);
      }
    }

    // Default for fresh route entries
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    }

    prevPathRef.current = pathname;
  }, [pathname, hash]);

  return null;
}
