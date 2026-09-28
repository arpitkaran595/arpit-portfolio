import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop handles scroll restoration across routes and smooth hash anchors.
 * - On normal route changes (e.g. / -> /work/imagemint), resets scroll to (0, 0).
 * - On hash navigation (e.g. /#digital-work), smoothly scrolls to the target section.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
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
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(0, { immediate: true });
      }
    }
  }, [pathname, hash]);

  return null;
}
