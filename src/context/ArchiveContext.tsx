import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export type ArchiveCategory = 'ALL' | 'VIDEOS' | 'THUMBNAILS' | 'SOCIAL MEDIA' | 'STORIES';

interface ArchiveContextType {
  isOpen: boolean;
  activeCategory: ArchiveCategory;
  openArchive: (category?: ArchiveCategory) => void;
  closeArchive: () => void;
  setActiveCategory: (category: ArchiveCategory) => void;
}

const ArchiveContext = createContext<ArchiveContextType | undefined>(undefined);

export const ArchiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ArchiveCategory>('ALL');
  const triggerElementRef = useRef<HTMLElement | null>(null);

  const openArchive = useCallback((category?: ArchiveCategory) => {
    // Record triggering element to restore focus on close
    triggerElementRef.current = (document.activeElement as HTMLElement) || null;

    if (category) {
      setActiveCategory(category);
    }
    setIsOpen(true);

    // Lock page scroll & pause Lenis
    document.body.style.overflow = 'hidden';
    if ((window as any).lenis) {
      (window as any).lenis.stop();
    }
  }, []);

  const closeArchive = useCallback(() => {
    setIsOpen(false);

    // Restore page scroll & resume Lenis
    document.body.style.overflow = '';
    if ((window as any).lenis) {
      (window as any).lenis.start();
    }

    // Restore focus to trigger element
    if (triggerElementRef.current && typeof triggerElementRef.current.focus === 'function') {
      setTimeout(() => {
        triggerElementRef.current?.focus();
      }, 50);
    }
  }, []);

  return (
    <ArchiveContext.Provider
      value={{
        isOpen,
        activeCategory,
        openArchive,
        closeArchive,
        setActiveCategory,
      }}
    >
      {children}
    </ArchiveContext.Provider>
  );
};

export const useArchive = () => {
  const context = useContext(ArchiveContext);
  if (!context) {
    throw new Error('useArchive must be used within an ArchiveProvider');
  }
  return context;
};
