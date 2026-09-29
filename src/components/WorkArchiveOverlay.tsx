import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';
import {
  featuredVideos,
  youtubeThumbnails,
  creativePosts,
  storyPosters,
  FeaturedVideo,
  YoutubeThumbnail,
  CreativePost,
  StoryPoster,
} from '../data/portfolio';
import { useArchive, ArchiveCategory } from '../context/ArchiveContext';
import MediaViewer from './MediaViewer';

// Unified media item interface for MediaViewer
interface ActiveMediaItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  thumbnail: string;
  videoUrl?: string;
  duration?: string;
  category?: string;
  type?: 'video' | 'post' | 'story' | 'thumbnail' | 'creative';
  aspectRatio?: number;
}

const CATEGORIES: ArchiveCategory[] = [
  'ALL',
  'VIDEOS',
  'THUMBNAILS',
  'SOCIAL MEDIA',
  'STORIES',
];

// Clean duration formatter: "00:52" -> "0:52", "01:00" -> "1:00"
function formatDuration(duration?: string): string {
  if (!duration) return '';
  return duration.replace(/^00:0?/, '0:').replace(/^0?(\d+):/, '$1:');
}

export const WorkArchiveOverlay: React.FC = () => {
  const { isOpen, activeCategory, closeArchive, setActiveCategory } = useArchive();
  const [selectedMedia, setSelectedMedia] = useState<ActiveMediaItem | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);

  // Close only on Escape key (or explicit CLOSE button)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedMedia) {
          // If MediaViewer is open, close MediaViewer first
          setSelectedMedia(null);
        } else if (isOpen) {
          closeArchive();
        }
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedMedia, closeArchive]);

  // Reset scroll position on category switch
  useEffect(() => {
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollTop = 0;
    }
  }, [activeCategory]);

  // Keep body locked while archive overlay is active
  useEffect(() => {
    if (isOpen && !selectedMedia) {
      document.body.style.overflow = 'hidden';
      if ((window as any).lenis) {
        (window as any).lenis.stop();
      }
    }
  }, [isOpen, selectedMedia]);

  // Prepare ALL items dynamically by interleaving existing assets
  const allItems = useMemo(() => {
    const items: Array<{
      type: 'video' | 'thumbnail' | 'creative' | 'story';
      data: FeaturedVideo | YoutubeThumbnail | CreativePost | StoryPoster;
      id: string;
      title: string;
      category: string;
      image: string;
      aspectRatioClass: string;
      duration?: string;
      videoUrl?: string;
      views?: string;
    }> = [];

    // Dynamically derive max length from actual datasets
    const maxLen = Math.max(
      featuredVideos.length,
      youtubeThumbnails.length,
      creativePosts.length,
      storyPosters.length
    );

    for (let i = 0; i < maxLen; i++) {
      if (featuredVideos[i]) {
        const v = featuredVideos[i];
        items.push({
          type: 'video',
          data: v,
          id: v.id,
          title: v.title,
          category: v.category,
          image: v.poster || v.videoUrl.replace(/\.mp4$/, '.webp'),
          aspectRatioClass: 'aspect-[9/16]',
          duration: v.duration,
          videoUrl: v.videoUrl,
        });
      }
      if (youtubeThumbnails[i]) {
        const t = youtubeThumbnails[i];
        items.push({
          type: 'thumbnail',
          data: t,
          id: t.id,
          title: t.title,
          category: t.category || 'YouTube',
          image: t.image,
          aspectRatioClass: 'aspect-[16/9]',
          views: t.views,
        });
      }
      if (creativePosts[i]) {
        const c = creativePosts[i];
        items.push({
          type: 'creative',
          data: c,
          id: c.id,
          title: c.title || 'Creative Design',
          category: c.category || 'Social',
          image: c.image,
          aspectRatioClass: c.aspectRatio === 1 ? 'aspect-[1/1]' : 'aspect-[4/5]',
        });
      }
      if (storyPosters[i]) {
        const s = storyPosters[i];
        items.push({
          type: 'story',
          data: s,
          id: s.id,
          title: s.title,
          category: s.category || 'Story',
          image: s.image,
          aspectRatioClass: 'aspect-[9/16]',
        });
      }
    }

    return items;
  }, []);

  // Handlers to open existing MediaViewer with real media
  const handleVideoClick = useCallback((video: FeaturedVideo) => {
    setSelectedMedia({
      id: video.id,
      title: video.title,
      subtitle: video.projectInfo?.category || video.category,
      description: video.description || `${video.title} — Produced & Edited by Arpit AK`,
      thumbnail: video.poster || video.videoUrl.replace(/\.mp4$/, '.webp'),
      videoUrl: video.videoUrl,
      duration: video.duration,
      category: 'Video Project',
      type: 'video',
    });
  }, []);

  const handleThumbnailClick = useCallback((thumb: YoutubeThumbnail) => {
    setSelectedMedia({
      id: thumb.id,
      title: thumb.title,
      subtitle: thumb.category || 'YouTube Thumbnail',
      description: `YouTube Thumbnail Artwork • High-CTR Visual Hierarchy • ${thumb.views ? `${thumb.views} Views` : '4K Sharp'}`,
      thumbnail: thumb.image,
      category: 'YouTube Thumbnail',
      type: 'thumbnail',
    });
  }, []);

  const handleCreativeClick = useCallback((post: CreativePost) => {
    setSelectedMedia({
      id: post.id,
      title: post.title || 'Creative Poster',
      subtitle: post.category || 'Social Media',
      description: post.description || 'Social Media & Brand Artwork designed for high engagement and brand retention.',
      thumbnail: post.image,
      category: 'Creative Design',
      type: 'post',
      aspectRatio: post.aspectRatio,
    });
  }, []);

  const handleStoryClick = useCallback((story: StoryPoster) => {
    setSelectedMedia({
      id: story.id,
      title: story.title,
      subtitle: story.category || 'Instagram Story',
      description: '9:16 Portrait Instagram Story Artwork designed for mobile storytelling.',
      thumbnail: story.image,
      category: 'Story Artwork',
      type: 'story',
    });
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Work Archive"
          className="fixed inset-0 z-[80] flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 select-none"
        >
          {/* 
            Subtle Dark Translucent Backdrop
            IMPORTANT: Clicking backdrop DOES NOT close the overlay.
            Only the explicit CLOSE button and Escape key close it.
          */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-[8px] -z-10"
          />

          {/* Main Archive Panel (92-95vw, 92-94vh, Warm Cream, Paper Texture, Soft Rounded Corners) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[1520px] h-[92vh] sm:h-[94vh] max-h-[1040px] bg-[#FAF3E8] border border-[#E5D7C3]/90 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.25rem] shadow-[0_30px_90px_-20px_rgba(20,15,10,0.45),0_12px_35px_-10px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden relative"
          >
            {/* Subtle Paper Texture & Noise Overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-multiply z-0"
              style={{
                backgroundImage: `url('/assets/paper-texture.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay z-0"
              style={{
                backgroundImage: `url('/assets/noise-grain.png')`,
                backgroundSize: '200px 200px',
              }}
            />

            {/* ═══════════════════════════════════════════════════════════════
                1. HEADER (ARPIT AK | SELECTED WORK & TITLE | CLOSE ×)
            ═══════════════════════════════════════════════════════════════ */}
            <header className="relative z-10 w-full px-4 sm:px-8 md:px-12 pt-4 sm:pt-6 md:pt-7 pb-3 sm:pb-4 border-b border-[#E8DFC8]/60 bg-[#FAF3E8] flex items-start justify-between">
              {/* Top-Left: ARPIT AK */}
              <div className="flex-1 flex items-center pt-1">
                <span className="font-sora font-semibold tracking-[0.20em] sm:tracking-[0.24em] text-[11px] sm:text-[13px] text-[#1A1A1A] select-none whitespace-nowrap">
                  ARPIT <span className="text-[#C4943A]">AK</span>
                </span>
              </div>

              {/* Top-Center: Eyebrow + Editorial Heading */}
              <div className="flex flex-col items-center text-center px-1">
                <span className="text-[9.5px] sm:text-[11px] font-sora font-semibold tracking-[0.26em] uppercase text-[#7A7265] mb-0.5 sm:mb-1">
                  SELECTED WORK
                </span>
                <h1 className="font-playfair text-xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-bold text-[#1A1A1A] tracking-[-0.015em] leading-tight">
                  <span>Everything I've </span>
                  <span className="font-playfair font-normal italic text-[#C4943A]">made.</span>
                </h1>
              </div>

              {/* Top-Right: CLOSE × */}
              <div className="flex-1 flex justify-end items-center pt-1">
                <button
                  type="button"
                  onClick={closeArchive}
                  aria-label="Close Work Archive"
                  className="group inline-flex items-center gap-1 sm:gap-2 text-[11px] sm:text-xs font-sora font-semibold tracking-[0.18em] sm:tracking-[0.2em] uppercase text-[#1A1A1A] hover:text-[#C4943A] transition-colors cursor-pointer py-1 px-1 sm:px-2 rounded-lg"
                >
                  <span>CLOSE</span>
                  <X className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#1A1A1A] group-hover:text-[#C4943A] group-hover:rotate-90 transition-all duration-300 stroke-[2.2]" />
                </button>
              </div>
            </header>

            {/* ═══════════════════════════════════════════════════════════════
                2. CATEGORY SELECTOR (STICKY NEAR TOP WHILE GALLERY SCROLLS)
            ═══════════════════════════════════════════════════════════════ */}
            <nav
              role="tablist"
              aria-label="Content categories"
              className="sticky top-0 z-20 w-full px-4 sm:px-8 md:px-12 py-2 sm:py-2.5 border-b border-[#E8DFC8]/70 bg-[#FAF3E8]/95 backdrop-blur-md flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar scroll-smooth"
            >
              <div className="flex items-center gap-5 sm:gap-8 md:gap-12 shrink-0 mx-auto md:mx-0">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveCategory(cat)}
                      className={`relative font-sora text-[11px] sm:text-[12px] md:text-xs tracking-[0.18em] uppercase py-2 transition-colors cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'text-[#1A1A1A] font-bold'
                          : 'text-[#7A7265] hover:text-[#1A1A1A] font-medium'
                      }`}
                    >
                      <span>{cat}</span>

                      {/* Active Indicator: Thin Gold Underline + Centered Gold Dot (Matching Reference) */}
                      {isActive && (
                        <motion.div
                          layoutId="active-category-indicator"
                          className="absolute bottom-0 inset-x-0 flex flex-col items-center pointer-events-none"
                          transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                        >
                          <div className="w-full h-[2px] bg-[#C4943A]" />
                          <div className="w-1.5 h-1.5 rounded-full bg-[#C4943A] translate-y-[3px]" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* ═══════════════════════════════════════════════════════════════
                3. GALLERY CONTENT AREA (Protected from Lenis with data-lenis-prevent)
                   Complete archive browsing with smooth internal scrolling
            ═══════════════════════════════════════════════════════════════ */}
            <div
              ref={contentAreaRef}
              data-lenis-prevent
              className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 lg:p-10 relative z-10 overscroll-contain"
            >
              <AnimatePresence mode="wait">
                {/* ─────────────────────────────────────────────────────────────
                    CATEGORY: VIDEOS (All videos in responsive scrollable grid)
                ───────────────────────────────────────────────────────────── */}
                {activeCategory === 'VIDEOS' && (
                  <motion.div
                    key="cat-videos"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35 }}
                    className="w-full"
                  >
                    <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-3.5 md:gap-4">
                      {featuredVideos.map((video) => (
                        <div
                          key={video.id}
                          onClick={() => handleVideoClick(video)}
                          className="group relative aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden bg-[#111] border border-[#E5D7C3]/40 hover:border-[#C4943A]/80 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.18)] hover:shadow-[0_14px_30px_-6px_rgba(196,148,58,0.25)] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-end"
                        >
                          {/* Lightweight WebP Poster Representation (zero active <video> tags) */}
                          <img
                            src={video.poster || video.videoUrl.replace(/\.mp4$/, '.webp')}
                            alt={video.title}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />

                          {/* Subtle Ambient Gradient Vignette */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none transition-opacity group-hover:from-black/90" />

                          {/* Center Play Icon on Hover */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="w-10 h-10 rounded-full bg-[#FAF3E8]/90 text-[#1A1A1A] flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                              <Play className="w-4 h-4 translate-x-0.5 fill-current text-[#C4943A]" />
                            </div>
                          </div>

                          {/* Card Details: Bottom Duration Badge & Title */}
                          <div className="relative z-10 p-2.5 flex items-end justify-between gap-1">
                            <span className="text-[10.5px] font-sora font-medium text-white/90 line-clamp-1 group-hover:text-white leading-tight">
                              {video.title}
                            </span>

                            {/* Duration Pill (Matching Reference) */}
                            <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[9.5px] font-sora font-semibold text-white/95 shrink-0 tracking-wider">
                              {formatDuration(video.duration)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    CATEGORY: THUMBNAILS (Preserving 16:9)
                ───────────────────────────────────────────────────────────── */}
                {activeCategory === 'THUMBNAILS' && (
                  <motion.div
                    key="cat-thumbnails"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35 }}
                    className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
                  >
                    {youtubeThumbnails.map((thumb) => (
                      <div
                        key={thumb.id}
                        onClick={() => handleThumbnailClick(thumb)}
                        className="group relative aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden bg-[#111] border border-[#E5D7C3]/50 hover:border-[#C4943A] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-end"
                      >
                        <img
                          src={thumb.image}
                          alt={thumb.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                        <div className="relative z-10 p-3 sm:p-4 flex items-end justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-sora font-semibold tracking-wider text-[#C4943A] uppercase block">
                              {thumb.category || 'YouTube'}
                            </span>
                            <h3 className="text-xs sm:text-sm font-playfair font-bold text-white line-clamp-1 mt-0.5">
                              {thumb.title}
                            </h3>
                          </div>
                          {thumb.views && (
                            <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-sora font-semibold text-white/90 shrink-0">
                              {thumb.views}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    CATEGORY: SOCIAL MEDIA (Preserving 4:5 & 1:1)
                ───────────────────────────────────────────────────────────── */}
                {activeCategory === 'SOCIAL MEDIA' && (
                  <motion.div
                    key="cat-social"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35 }}
                    className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5"
                  >
                    {creativePosts.map((post) => {
                      const isSquare = post.aspectRatio === 1;
                      return (
                        <div
                          key={post.id}
                          onClick={() => handleCreativeClick(post)}
                          className={`group relative ${
                            isSquare ? 'aspect-[1/1]' : 'aspect-[4/5]'
                          } rounded-xl sm:rounded-2xl overflow-hidden bg-[#111] border border-[#E5D7C3]/50 hover:border-[#C4943A] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-end`}
                        >
                          <img
                            src={post.image}
                            alt={post.title || 'Creative Post'}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="relative z-10 p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-[9.5px] font-sora font-semibold tracking-wider text-[#C4943A] uppercase block">
                              {post.category || 'Creative'}
                            </span>
                            <h4 className="text-[11px] font-sora font-medium text-white line-clamp-1">
                              {post.title}
                            </h4>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    CATEGORY: STORIES (Preserving 9:16 portrait)
                ───────────────────────────────────────────────────────────── */}
                {activeCategory === 'STORIES' && (
                  <motion.div
                    key="cat-stories"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35 }}
                    className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5"
                  >
                    {storyPosters.map((story) => (
                      <div
                        key={story.id}
                        onClick={() => handleStoryClick(story)}
                        className="group relative aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden bg-[#111] border border-[#E5D7C3]/50 hover:border-[#C4943A] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-end"
                      >
                        <img
                          src={story.image}
                          alt={story.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                        <div className="relative z-10 p-2.5">
                          <span className="text-[9.5px] font-sora font-semibold tracking-wider text-[#C4943A] uppercase block">
                            {story.category || 'Story'}
                          </span>
                          <h4 className="text-[11px] font-sora font-medium text-white line-clamp-1">
                            {story.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    CATEGORY: ALL (Mixed natural aspect ratios, posters & lazy loading)
                ───────────────────────────────────────────────────────────── */}
                {activeCategory === 'ALL' && (
                  <motion.div
                    key="cat-all"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35 }}
                    className="w-full columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-3 sm:gap-4 space-y-3 sm:space-y-4"
                  >
                    {allItems.map((item) => (
                      <div
                        key={`${item.type}-${item.id}`}
                        onClick={() => {
                          if (item.type === 'video') handleVideoClick(item.data as FeaturedVideo);
                          else if (item.type === 'thumbnail') handleThumbnailClick(item.data as YoutubeThumbnail);
                          else if (item.type === 'creative') handleCreativeClick(item.data as CreativePost);
                          else if (item.type === 'story') handleStoryClick(item.data as StoryPoster);
                        }}
                        className={`group relative ${item.aspectRatioClass} break-inside-avoid rounded-xl sm:rounded-2xl overflow-hidden bg-[#111] border border-[#E5D7C3]/50 hover:border-[#C4943A] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-end`}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                        {/* Minimal Discreet Category Tag */}
                        <div className="absolute top-2 left-2 z-10">
                          <span className="px-1.5 py-0.5 rounded bg-black/65 backdrop-blur-xs text-[8.5px] font-sora font-semibold tracking-wider text-[#FAF0E4] uppercase">
                            {item.type}
                          </span>
                        </div>

                        {item.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="w-9 h-9 rounded-full bg-[#FAF3E8]/90 text-[#1A1A1A] flex items-center justify-center shadow-lg">
                              <Play className="w-3.5 h-3.5 translate-x-0.5 fill-current text-[#C4943A]" />
                            </div>
                          </div>
                        )}

                        <div className="relative z-10 p-2.5 flex items-end justify-between gap-1">
                          <span className="text-[10px] sm:text-[11px] font-sora font-medium text-white/95 line-clamp-1 leading-tight">
                            {item.title}
                          </span>
                          {item.duration && (
                            <span className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] font-sora font-semibold text-white/90 shrink-0">
                              {formatDuration(item.duration)}
                            </span>
                          )}
                          {item.views && (
                            <span className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] font-sora font-semibold text-white/90 shrink-0">
                              {item.views}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Lightbox Modal (Reusing existing MediaViewer component) */}
      <MediaViewer
        isOpen={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
        item={selectedMedia}
      />
    </>
  );
};

export default WorkArchiveOverlay;
