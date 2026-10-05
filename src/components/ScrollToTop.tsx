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
    const isReturningToHome =
      pathname === '/' &&
      (prevPathRef.current.startsWith('/work/') ||
        sessionStorage.getItem('came_from_case_study') === 'true');

    if (isReturningToHome) {
      sessionStorage.removeItem('came_from_case_study');
      const savedScroll = sessionStorage.getItem('home_scroll_pos');
      if (savedScroll) {
        const top = parseInt(savedScroll, 10);
        if (top > 0) {
          sessionStorage.setItem('is_restoring_scroll', 'true');

          let rafId: number;
          let attempts = 0;
          const maxAttempts = 150; // ~2.5s maximum wait
          let stableFrames = 0;

          const applyScroll = (targetY: number) => {
            if ((window as any).lenis) {
              (window as any).lenis.scrollTo(targetY, { immediate: true });
            }
            window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
          };

          const ro = new ResizeObserver(() => {
            if (sessionStorage.getItem('is_restoring_scroll') === 'true') {
              const scrollHeight = Math.max(
                document.documentElement.scrollHeight,
                document.body ? document.body.scrollHeight : 0
              );
              const clientHeight = window.innerHeight || document.documentElement.clientHeight;
              const maxScroll = Math.max(0, scrollHeight - clientHeight);
              if (maxScroll >= top) {
                applyScroll(top);
              }
            }
          });

          const cancelRestoration = () => {
            cancelAnimationFrame(rafId);
            ro.disconnect();
            sessionStorage.removeItem('is_restoring_scroll');
            window.removeEventListener('wheel', cancelRestoration);
            window.removeEventListener('touchmove', cancelRestoration);
          };

          const checkAndRestore = () => {
            attempts++;
            const lenis = (window as any).lenis;
            if (lenis?.resize) {
              lenis.resize();
            }

            const scrollHeight = Math.max(
              document.documentElement.scrollHeight,
              document.body ? document.body.scrollHeight : 0
            );
            const clientHeight = window.innerHeight || document.documentElement.clientHeight;
            const maxScroll = Math.max(0, scrollHeight - clientHeight);

            if (maxScroll >= top) {
              applyScroll(top);
              stableFrames++;
              if (stableFrames >= 4 || attempts >= maxAttempts) {
                sessionStorage.removeItem('is_restoring_scroll');
                ro.disconnect();
                return;
              }
            } else if (attempts >= maxAttempts) {
              const fallbackTop = Math.min(top, maxScroll);
              applyScroll(fallbackTop);
              sessionStorage.removeItem('is_restoring_scroll');
              ro.disconnect();
              return;
            }

            rafId = requestAnimationFrame(checkAndRestore);
          };

          window.addEventListener('wheel', cancelRestoration, { passive: true, once: true });
          window.addEventListener('touchmove', cancelRestoration, { passive: true, once: true });

          if (document.body) {
            ro.observe(document.body);
          }
          ro.observe(document.documentElement);

          checkAndRestore();

          prevPathRef.current = pathname;
          return () => {
            cancelAnimationFrame(rafId);
            ro.disconnect();
            window.removeEventListener('wheel', cancelRestoration);
            window.removeEventListener('touchmove', cancelRestoration);
            sessionStorage.removeItem('is_restoring_scroll');
          };
        }
      }
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

    // Default for fresh route entries
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    }

    prevPathRef.current = pathname;
  }, [pathname, hash]);

  return null;
}
