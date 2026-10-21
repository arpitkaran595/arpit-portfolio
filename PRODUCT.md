# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are creative directors, agency founders, marketing leads, content creators/YouTubers, and prospective clients seeking high-tier creative design, video editing, motion graphics, and digital product execution. They evaluate creative taste, technical execution, pacing, brand identity, and communication quality to decide whether to commission or hire Arpit.

## Product Purpose

A living, interactive personal creative portfolio that showcases Arpit Ak's multi-disciplinary creative craft (Graphic Design, Video Editing, Motion Design, Editorial Posters, Social Creatives, YouTube Thumbnails, and Digital Websites/UI). The portfolio provides an immersive, atmospheric showcase while driving qualified client inquiries through direct contact channels (WhatsApp, Email, Project Inquiry Form).

## Positioning

"I Make Pixels Behave (Mostly)" — positioned as an art-directed, highly personal showcase rather than a sterile corporate agency template. Combines high-retention video editing and motion design sensibilities with tactile typography, warm atmosphere, and interactive performance.

## Operating Context

- Deployed globally via GitHub Pages at `https://arpitkaran595.github.io/arpit-portfolio/`.
- Single-page application architecture with deep case study views (`#/work/:slug`) and overlay viewers (Reels, Story, Carousel, Thumbnail, Digital Projects, and Live Website modal).
- Synchronized GSAP ScrollTrigger and Lenis smooth scrolling for cinematic scroll-driven storytelling.

## Capabilities and Constraints

- **Stack**: React 18, TypeScript, Tailwind CSS v3, GSAP 3.12 (ScrollTrigger), Lenis 1.1, Framer Motion 11, Lucide React, Vite 5.
- **Media Pipeline**: Heavy visual assets (local WebP posters, WebM/MP4 videos, cloud layers, noise/paper textures) require eager above-the-fold prioritization and lazy-loaded below-the-fold media.
- **Responsive Affordance**: Specific mobile adaptations for character layer positioning, marquee text scaling, cloud placement, touch-friendly modals, and footer responsive typography.
- **Smooth Scroll Synchronization**: Lenis drives smooth scroll strictly synchronized with GSAP's ticker; manual scroll position persistence across navigation to/from case study pages.

## Brand Commitments

- **Identity**: Arpit Ak (अर्पित). Creative Designer & Video Editor.
- **Palette**: Multi-chapter art-directed palette featuring warm ivory & studio linen (`#FAF3E8`, `#FAF7F2`, `#F4F1EA`), deep inky espresso (`#141312`, `#0D0E11`, `#161514`), muted botanical sage (`#ECEFEA`, `#3E4A3D`), warm terracotta & clay (`#BD5D38`, `#F6EFE9`), and restrained antique gold (`#D4A94E`, `#C4943A`).
- **Texture & Atmosphere**: Multi-layered cloud horizons, ambient warm mist, subtle paper texture, and micro noise grain overlays.
- **Voice**: Confident, witty, authentic, craft-focused ("turning concepts into visuals that connect, communicate and leave a lasting impact").
- **Direct Contacts**: WhatsApp (`+91 6377467850`), Email (`arpitkaran595@gmail.com`, `work.with.arpittt@gmail.com`), Resume download (`/assets/resume.pdf`).

## Evidence on Hand

- Hero interactive parallax stage with layered clouds, mist, character art, marquee, and dual CTAs.
- Curated Video editing reel & longform video projects (`featuredVideos` with software tooling and metadata).
- High-impact Story Posters (`storyPosters` with typography and layout details).
- Multi-brand Social Media Creatives (`creativePosts`).
- High-CTR YouTube Thumbnails categorized by niche (Gaming, Tech, Finance, Lifestyle, Documentary).
- Digital Work & UI/UX case studies (`digitalProjects`) with live site preview modal.
- Experience roadmap tracking freelance and agency milestones.
- Contact form and direct communication channels.

## Product Principles

1. **Craft Over Cliché**: Reject generic AI/SaaS design tropes (no neon purple glassmorphism, no generic feature cards, no robotic corporate copy). Let the real visual assets and editorial taste define every viewport.
2. **Unified Motion Architecture**: All scroll animations, entrances, and interactive hovers share a single RAF cycle (GSAP + Lenis), avoiding layout jank, jitter, or conflicting transforms.
3. **Immersive Viewing Modes**: When a visitor inspects work (video reels, story posters, thumbnails, digital sites), the chrome steps back to spotlight the creative artifact in a dedicated, distraction-free modal/viewer.
4. **Platform & Device Dignity**: Mobile viewports are intentionally composed—character anchoring, CTA touch targets, and typography clamp formulas are tuned specifically for small screens rather than merely scaled down.

## Accessibility & Inclusion

- Respect `prefers-reduced-motion` by disabling marquee movement and dampening GSAP scroll transforms.
- High-contrast typography on warm cream foundations (`#1A1A1A` charcoal on `#FAF3E8` cream).
- Full keyboard and screen-reader accessibility for modals, media viewers, and interactive controls with accessible `aria-label` attributes and focus trapping.
