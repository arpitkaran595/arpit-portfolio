// ===== Type Definitions =====

export interface VideoProject {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  thumbnail: string;
  videoUrl?: string;
  duration: string;
  category: string;
  orientation: 'portrait' | 'landscape';
}

export type SoftwareIconType =
  | 'after-effects'
  | 'premiere-pro'
  | 'photoshop'
  | 'illustrator'
  | 'figma'
  | 'capcut'
  | 'framer';

export interface SoftwareToolItem {
  name: string;
  icon: SoftwareIconType;
}

export interface VideoProjectInfo {
  software: SoftwareToolItem;
  category: string;
}

export interface FeaturedVideo {
  id: string;
  index: string; // "01", "02", "03", "04", "05", "06"
  title: string;
  titleLine1: string;
  highlightWord: string;
  titleLine2?: string;
  category: string;
  duration: string;
  videoUrl: string;
  aspectRatio?: 'portrait' | 'landscape';
  description?: string;
  projectInfo: VideoProjectInfo;
  softwares?: SoftwareToolItem[];
  tags?: string[];
  poster?: string;
}

export interface VideoInfoStripItem {
  id: string;
  icon: 'clapperboard' | 'play' | 'heart' | 'sparkles';
  label: string;
  sublabel: string;
}

export interface VideoSectionData {
  eyebrow: string;
  heading: string;
  description: string;
  exploreLink: string;
  statement: string;
  infoItems: VideoInfoStripItem[];
}

export interface Creative {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  description?: string;
}

export interface Thumbnail {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
}

export interface Story {
  id: string;
  title: string;
  thumbnail: string;
  category?: string;
}

export interface ExperienceItem {
  id: string;
  period: string;
  company: string;
  role: string;
  description: string;
  icon: 'seedling' | 'rocket' | 'crown';
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

// ===== Personal Information =====

export const personalInfo = {
  name: 'Arpit Ak',
  firstName: 'ARPIT',
  lastName: 'AK',
  hindiName: 'अर्पित',
  tagline: 'Graphic Designer & Video Editor',
  roles: [
    'Creative Designer',
    'Video Editor',
    'Motion Designer',
    'Visual Storyteller',
  ],
  aboutHeading: 'I turn ideas into visual stories.',
  aboutDescription:
    "Hi, I'm Arpit — a Creative Designer & Video Editor who loves turning concepts into visuals that connect, communicate and leave a lasting impact.",
  education: {
    degree: 'Diploma in Computer Science',
    institution: 'Government Polytechnic College, Nawa',
    cgpa: '9.0',
  },
  resumePath: '/assets/resume.pdf',
  hasResumeFile: true,
  whatsappUrl:
    'https://wa.me/916377467850?text=Hi%20Arpit%20%F0%9F%91%8B%0AI%20just%20visited%20your%20portfolio%20and%20would%20love%20to%20discuss%20a%20project%20with%20you.',
  emails: {
    primary: 'arpitkaran595@gmail.com',
    work: 'work.with.arpittt@gmail.com',
  },
  mailtoUrl:
    'mailto:arpitkaran595@gmail.com?subject=Project%20Inquiry%20%E2%80%94%20Let%E2%80%99s%20Work%20Together',
};

/**
 * Centralized resume download handler.
 * Keeps implementation 100% ready for the real resume PDF (/assets/resume.pdf).
 * When personalInfo.hasResumeFile is false, gracefully disables the click
 * without any unverified redirects or 404 errors.
 */
export const handleResumeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  if (!personalInfo.hasResumeFile) {
    e.preventDefault();
  }
};

export const socialLinks: SocialLink[] = [
  {
    platform: 'Instagram',
    url: 'https://instagram.com/i_am__arpittt',
    label: '@i_am__arpittt',
  },
  {
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/arpitdesigns',
    label: 'arpitdesigns',
  },
  {
    platform: 'Behance',
    url: 'https://www.behance.net/arpit-designs/projects',
    label: 'arpit-designs',
  },
  {
    platform: 'YouTube',
    url: '#',
    label: 'Coming Soon',
  },
];

// ===== About Highlights =====

export const aboutHighlights = [
  {
    title: 'Visual Storyteller',
    description: 'Transforming complex ideas into engaging visual narratives.',
    icon: 'story',
  },
  {
    title: 'Brand Builder',
    description: 'Developing cohesive visual identities across all platforms.',
    icon: 'brand',
  },
  {
    title: 'Content Creator',
    description: 'Producing high-retention content tailored for social growth.',
    icon: 'content',
  },
  {
    title: 'Detail Oriented',
    description: 'Obsessed with pixel-perfect design and seamless motion.',
    icon: 'detail',
  },
];

// ===== Services =====

export const services = [
  {
    title: 'Creative Design',
    description: 'Crafting clean, modern and meaningful designs that stand out.',
    icon: 'design',
  },
  {
    title: 'Video Editing',
    description: 'Editing videos that tell stories and deliver real impact.',
    icon: 'video',
  },
  {
    title: 'Motion Design',
    description: 'Bringing visuals to life with smooth motion and rhythm.',
    icon: 'motion',
  },
  {
    title: 'Web & UI Design',
    description: 'Designing interfaces that are intuitive and visually engaging.',
    icon: 'ui',
  },
];

export const tools = [
  'Adobe Photoshop',
  'Adobe Premiere Pro',
  'Adobe After Effects',
  'Adobe Illustrator',
  'Figma',
  'CapCut',
  'VS Code',
];

// ===== Experience =====

export const experiences: ExperienceItem[] = [
  {
    id: 'exp-1',
    period: '2023 — 2025',
    company: 'Explore Epic',
    role: 'YouTube Editor & Designer',
    description:
      'Created engaging YouTube content — editing videos, designing thumbnails, and building a consistent visual identity for the channel.',
    icon: 'seedling',
  },
  {
    id: 'exp-2',
    period: 'Apr 2025 — Jun 2025',
    company: 'Sristi Kalyan',
    role: 'YouTube Editor & Designer',
    description:
      'Edited and designed visual content for health and wellness focused YouTube channels, delivering clear and impactful storytelling.',
    icon: 'rocket',
  },
  {
    id: 'exp-3',
    period: 'Jan 2026 — Present',
    company: 'Innovana Thinklabs Ltd.',
    role: 'Video Editor',
    description:
      'Producing professional video content for a technology company, focusing on product videos, internal communications, and brand storytelling.',
    icon: 'crown',
  },
];

export const SOFTWARE_ICON_MAP: Record<SoftwareIconType, { name: string; src: string; bgColor: string }> = {
  'premiere-pro': {
    name: 'Premiere Pro',
    src: '/assets/softwares/adobe-premiere-svgrepo-com.svg',
    bgColor: '#00005B',
  },
  'after-effects': {
    name: 'After Effects',
    src: '/assets/softwares/adobe-after-effects-svgrepo-com.svg',
    bgColor: '#00005B',
  },
  'capcut': {
    name: 'CapCut',
    src: '/assets/softwares/capcut-svgrepo-com.svg',
    bgColor: '#FFFFFF',
  },
  'figma': {
    name: 'Figma',
    src: '/assets/softwares/figma-svgrepo-com.svg',
    bgColor: '#1E1E1E',
  },
  'photoshop': {
    name: 'Photoshop',
    src: '/assets/softwares/photoshop-svgrepo-com.svg',
    bgColor: '#001E36',
  },
  'illustrator': {
    name: 'Illustrator',
    src: '/assets/softwares/adobe-premiere-svgrepo-com.svg',
    bgColor: '#330000',
  },
  'framer': {
    name: 'Framer',
    src: '/assets/softwares/framer-svgrepo-com.svg',
    bgColor: '#0055FF',
  },
};

// ===== Portfolio Content — Videos & Reels (Section 3) =====
// Uses actual portrait video files from Content / Assets directory

// Legacy bracelet videos preserved for backward reference
export const legacyBraceletVideos: FeaturedVideo[] = [
  {
    id: 'legacy-vid-1',
    index: '01',
    title: 'Tiger Eye — The Celeb Bracelet',
    titleLine1: 'Confidence',
    highlightWord: 'UNLEASHED',
    titleLine2: 'Celebrity Style.',
    category: 'Product Reel',
    duration: '00:46',
    videoUrl:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790581953/Tiger_Eye_-_The_Celeb_Bracelet_1_q5dzup.mp4',
    poster:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790581953/Tiger_Eye_-_The_Celeb_Bracelet_1_q5dzup.webp',
    description:
      'Bold macro visuals with energetic pacing and premium crystal brilliance.',
    projectInfo: {
      software: {
        name: 'Premiere Pro',
        icon: 'premiere-pro',
      },
      category: 'Product Reel',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'After Effects', icon: 'after-effects' },
      { name: 'CapCut', icon: 'capcut' },
      { name: 'Figma', icon: 'figma' },
    ],
    tags: ['Product', 'Jewelry', 'Lifestyle', 'Short Form'],
  },
  {
    id: 'legacy-vid-2',
    index: '02',
    title: 'Rose Quartz Bracelet',
    titleLine1: 'Gentle',
    highlightWord: 'AURA',
    titleLine2: 'Inner Harmony.',
    category: 'Brand Film',
    duration: '00:39',
    videoUrl:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790581939/Rose_Quartz_Bracelet_-_B_qyngw2.mp4',
    poster:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790581939/Rose_Quartz_Bracelet_-_B_qyngw2.webp',
    description:
      'Delicate color grading and soft ambient lighting tracing rosy crystal facets.',
    projectInfo: {
      software: {
        name: 'After Effects',
        icon: 'after-effects',
      },
      category: 'Brand Film',
    },
    softwares: [
      { name: 'After Effects', icon: 'after-effects' },
      { name: 'Premiere Pro', icon: 'premiere-pro' },
    ],
    tags: ['Brand Film', 'Wellness', 'Jewelry', 'Cinematic'],
  },
  {
    id: 'legacy-vid-3',
    index: '03',
    title: 'Pukhraj Edition',
    titleLine1: 'Radiant',
    highlightWord: 'SOLAR ENERGY',
    titleLine2: 'Vedic Grace.',
    category: 'Commercial',
    duration: '00:34',
    videoUrl:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790581935/Pukhraj_1_mq0afw.mp4',
    poster:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790581935/Pukhraj_1_mq0afw.webp',
    description:
      'High-conversion commercial cut highlighting yellow sapphire brilliance.',
    projectInfo: {
      software: {
        name: 'Premiere Pro',
        icon: 'premiere-pro',
      },
      category: 'Commercial',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'After Effects', icon: 'after-effects' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Commercial', 'Jewelry', 'E-commerce', 'Social Media'],
  },
  {
    id: 'legacy-vid-4',
    index: '04',
    title: 'Amethyst Classic',
    titleLine1: 'Pure',
    highlightWord: 'INTENTION',
    titleLine2: 'Royal Purple.',
    category: 'Product Reel',
    duration: '00:41',
    videoUrl:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790581924/Amethyst_Bracelet_jtx0wp.mp4',
    poster:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790581924/Amethyst_Bracelet_jtx0wp.webp',
    description:
      'Elegant crystal showcase with smooth rotational motion and vibrant violet tones.',
    projectInfo: {
      software: {
        name: 'Premiere Pro',
        icon: 'premiere-pro',
      },
      category: 'Product Reel',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'After Effects', icon: 'after-effects' },
    ],
    tags: ['Product Reel', 'Jewelry', 'Short Form', 'Motion'],
  },
  {
    id: 'legacy-vid-5',
    index: '05',
    title: 'Pukhraj Prestige',
    titleLine1: 'Aura',
    highlightWord: 'OF FORTUNE',
    titleLine2: 'Brilliant Cut.',
    category: 'Cinematic',
    duration: '01:09',
    videoUrl:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790581920/Pukhraj_lf8cqg.mp4',
    poster:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790581920/Pukhraj_lf8cqg.webp',
    description:
      'Rich amber reflections and deliberate pacing for high-trust jewelry marketing.',
    projectInfo: {
      software: {
        name: 'After Effects',
        icon: 'after-effects',
      },
      category: 'Cinematic',
    },
    softwares: [
      { name: 'After Effects', icon: 'after-effects' },
      { name: 'Premiere Pro', icon: 'premiere-pro' },
    ],
    tags: ['Cinematic', 'Vedic', 'Luxury', 'Storytelling'],
  },
];

// ===== Portfolio Content — ATA Store Reels (14 Unique Reels) =====
// Standard portrait 9:16 format with high-performance WebP posters
export const allFeaturedVideos: FeaturedVideo[] = [
  {
    id: 'vid-1',
    index: '01',
    title: 'ATA Store — May Drop',
    titleLine1: 'Streetwear',
    highlightWord: 'REVOLUTION',
    titleLine2: 'Summer Drop.',
    category: 'Product Showcase',
    duration: '00:30',
    videoUrl:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790583154/ATA_Store_May_6_kr3pyc.mp4',
    poster:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790583154/ATA_Store_May_6_kr3pyc.webp',
    description:
      'High-energy launch reel highlighting dynamic streetwear silhouettes and crisp urban aesthetic.',
    projectInfo: {
      software: {
        name: 'Premiere Pro',
        icon: 'premiere-pro',
      },
      category: 'Product Showcase',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'After Effects', icon: 'after-effects' },
    ],
    tags: ['Streetwear', 'E-commerce', 'Launch Reel', 'Dynamic Pacing'],
  },
  {
    id: 'vid-2',
    index: '02',
    title: 'ATA Store — June Edition (Indian)',
    titleLine1: 'Desi',
    highlightWord: 'STREET VIBE',
    titleLine2: 'Regional Drop.',
    category: 'Indian Campaign',
    duration: '00:35',
    videoUrl:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790583201/ATA_Store_June_14_Indian_zclsqy.mp4',
    poster:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790583201/ATA_Store_June_14_Indian_zclsqy.webp',
    description:
      'Vibrant cultural crossover reel blending high-fashion streetwear with modern Indian youth aesthetics.',
    projectInfo: {
      software: {
        name: 'Premiere Pro',
        icon: 'premiere-pro',
      },
      category: 'Indian Campaign',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Indian Edition', 'Youth Culture', 'Commercial', 'Fast Cut'],
  },
  {
    id: 'vid-3',
    index: '03',
    title: 'ATA Store — May 9 (Indian)',
    titleLine1: 'Signature',
    highlightWord: 'URBAN BEAT',
    titleLine2: 'Exclusive Cut.',
    category: 'Commercial',
    duration: '00:20',
    videoUrl:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790583102/ATA_Store_May_9_Indian_hszwex.mp4',
    poster:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790583102/ATA_Store_May_9_Indian_hszwex.webp',
    description:
      'Snappy rhythmic cut synced to driving basslines showcasing exclusive apparel details.',
    projectInfo: {
      software: {
        name: 'After Effects',
        icon: 'after-effects',
      },
      category: 'Commercial',
    },
    softwares: [
      { name: 'After Effects', icon: 'after-effects' },
      { name: 'Premiere Pro', icon: 'premiere-pro' },
    ],
    tags: ['Commercial', 'Rhythm Sync', 'Apparel', 'Short Form'],
  },
  {
    id: 'vid-4',
    index: '04',
    title: 'ATA Store — May 27 (Indian)',
    titleLine1: 'Bold',
    highlightWord: 'ATTITUDE',
    titleLine2: 'Peak Drip.',
    category: 'Product Reel',
    duration: '00:20',
    videoUrl:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790583097/ATA_Store_May_27_Indian_f9ypvj.mp4',
    poster:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790583097/ATA_Store_May_27_Indian_f9ypvj.webp',
    description:
      'Punchy motion design and bold typographical accents emphasizing apparel durability and fit.',
    projectInfo: {
      software: {
        name: 'Premiere Pro',
        icon: 'premiere-pro',
      },
      category: 'Product Reel',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'After Effects', icon: 'after-effects' },
    ],
    tags: ['Product Reel', 'Streetwear', 'Motion Graphics', 'Typography'],
  },
  {
    id: 'vid-5',
    index: '05',
    title: 'ATA Store — June 10 (Indian)',
    titleLine1: 'Modern',
    highlightWord: 'IDENTITY',
    titleLine2: 'Urban Classic.',
    category: 'Brand Film',
    duration: '00:23',
    videoUrl:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790583088/ATA_Store_June_10_Indian_ckxhrx.mp4',
    poster:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790583088/ATA_Store_June_10_Indian_ckxhrx.webp',
    description:
      'Polished lifestyle showcase with smooth transitions celebrating street fashion expression.',
    projectInfo: {
      software: {
        name: 'Premiere Pro',
        icon: 'premiere-pro',
      },
      category: 'Brand Film',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Brand Film', 'Lifestyle', 'Fashion', 'Visual Flow'],
  },
  {
    id: 'vid-6',
    index: '06',
    title: 'ATA Store — June 03 (Global)',
    titleLine1: 'Global',
    highlightWord: 'SYNDICATE',
    titleLine2: 'Worldwide Fit.',
    category: 'Global Campaign',
    duration: '00:22',
    videoUrl:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790583053/ATA_Store_June_03_Global_symtr0.mp4',
    poster:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790583053/ATA_Store_June_03_Global_symtr0.webp',
    description:
      'Sleek international commercial cut designed for global social reach and conversion.',
    projectInfo: {
      software: {
        name: 'After Effects',
        icon: 'after-effects',
      },
      category: 'Global Campaign',
    },
    softwares: [
      { name: 'After Effects', icon: 'after-effects' },
      { name: 'Premiere Pro', icon: 'premiere-pro' },
    ],
    tags: ['Global Campaign', 'Commercial', 'International', 'E-commerce'],
  },
  {
    id: 'vid-7',
    index: '07',
    title: 'ATA Store — May 27 (Global)',
    titleLine1: 'Dynamic',
    highlightWord: 'FLUX',
    titleLine2: 'Global Standard.',
    category: 'Promo Reel',
    duration: '00:15',
    videoUrl:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790583037/ATA_Store_May_27_Global_gepgat.mp4',
    poster:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790583037/ATA_Store_May_27_Global_gepgat.webp',
    description:
      'Ultra-fast 15-second teaser crafted for maximum retention and immediate click-through.',
    projectInfo: {
      software: {
        name: 'Premiere Pro',
        icon: 'premiere-pro',
      },
      category: 'Promo Reel',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Promo Reel', 'Short Form', 'High Retention', 'Teaser'],
  },
  {
    id: 'vid-8',
    index: '08',
    title: 'ATA Store — May 16 (Indian)',
    titleLine1: 'Raw',
    highlightWord: 'ENERGY',
    titleLine2: 'Expressive Style.',
    category: 'Indian Campaign',
    duration: '00:17',
    videoUrl:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790583002/ATA_Store_May_16_Indian_bwgi0p.mp4',
    poster:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790583002/ATA_Store_May_16_Indian_bwgi0p.webp',
    description:
      'High-contrast framing with snappy percussion sync highlighting youth fashion staples.',
    projectInfo: {
      software: {
        name: 'Premiere Pro',
        icon: 'premiere-pro',
      },
      category: 'Indian Campaign',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'After Effects', icon: 'after-effects' },
    ],
    tags: ['Indian Campaign', 'Fashion', 'Percussion Sync', 'High Energy'],
  },
  {
    id: 'vid-9',
    index: '09',
    title: 'ATA Store — May 7',
    titleLine1: 'Clean',
    highlightWord: 'AESTHETIC',
    titleLine2: 'Essential Drop.',
    category: 'Product Showcase',
    duration: '00:16',
    videoUrl:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790582958/ATA_Store_May_7_wttgle.mp4',
    poster:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790582958/ATA_Store_May_7_wttgle.webp',
    description:
      'Crisp minimal edit focusing on fabric texture, stitching details, and silhouette fit.',
    projectInfo: {
      software: {
        name: 'After Effects',
        icon: 'after-effects',
      },
      category: 'Product Showcase',
    },
    softwares: [
      { name: 'After Effects', icon: 'after-effects' },
      { name: 'Premiere Pro', icon: 'premiere-pro' },
    ],
    tags: ['Product Showcase', 'Minimal', 'Details', 'Apparel'],
  },
  {
    id: 'vid-10',
    index: '10',
    title: 'ATA Store — May 9 (Global)',
    titleLine1: 'Infinite',
    highlightWord: 'MOTION',
    titleLine2: 'World Collection.',
    category: 'Global Campaign',
    duration: '00:15',
    videoUrl:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790582955/ATA_Store_May_9_Global_kspabr.mp4',
    poster:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790582955/ATA_Store_May_9_Global_kspabr.webp',
    description:
      'Rapid velocity transitions engineered for algorithm favorability and viral engagement.',
    projectInfo: {
      software: {
        name: 'CapCut',
        icon: 'capcut',
      },
      category: 'Global Campaign',
    },
    softwares: [
      { name: 'CapCut', icon: 'capcut' },
      { name: 'Premiere Pro', icon: 'premiere-pro' },
    ],
    tags: ['Global Campaign', 'Velocity Edit', 'Viral Format', 'Retention'],
  },
  {
    id: 'vid-11',
    index: '11',
    title: 'ATA Store — May 6 (Drop II)',
    titleLine1: 'Next',
    highlightWord: 'EVOLUTION',
    titleLine2: 'Drop Two.',
    category: 'Commercial',
    duration: '00:16',
    videoUrl:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790582914/ATA_Store_May_6_-2nd_reel_quootx.mp4',
    poster:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790582914/ATA_Store_May_6_-2nd_reel_quootx.webp',
    description:
      'Secondary teaser cut with alternate angles and quick-cut pacing for launch momentum.',
    projectInfo: {
      software: {
        name: 'Premiere Pro',
        icon: 'premiere-pro',
      },
      category: 'Commercial',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'After Effects', icon: 'after-effects' },
    ],
    tags: ['Commercial', 'Teaser', 'Streetwear', 'Drop Series'],
  },
  {
    id: 'vid-12',
    index: '12',
    title: 'ATA Store — June 07 (Indian)',
    titleLine1: 'Prime',
    highlightWord: 'SELECT',
    titleLine2: 'Summer Edition.',
    category: 'Indian Campaign',
    duration: '00:20',
    videoUrl:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790582875/ATA_Store_June_07_Indian_tvssr1.mp4',
    poster:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790582875/ATA_Store_June_07_Indian_tvssr1.webp',
    description:
      'Sun-drenched grading paired with modern streetwear styling tailored for Indian markets.',
    projectInfo: {
      software: {
        name: 'Premiere Pro',
        icon: 'premiere-pro',
      },
      category: 'Indian Campaign',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Indian Campaign', 'Color Grade', 'Streetwear', 'Summer'],
  },
  {
    id: 'vid-13',
    index: '13',
    title: 'ATA Store — June 04 (Global)',
    titleLine1: 'Global',
    highlightWord: 'ESSENCE',
    titleLine2: 'Pure Street.',
    category: 'Global Campaign',
    duration: '00:16',
    videoUrl:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790582868/ATA_Store_June_04_Global_sf9zdj.mp4',
    poster:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790582868/ATA_Store_June_04_Global_sf9zdj.webp',
    description:
      'Stripped-back editorial pacing highlighting minimalist aesthetics and premium tailoring.',
    projectInfo: {
      software: {
        name: 'After Effects',
        icon: 'after-effects',
      },
      category: 'Global Campaign',
    },
    softwares: [
      { name: 'After Effects', icon: 'after-effects' },
      { name: 'Premiere Pro', icon: 'premiere-pro' },
    ],
    tags: ['Global Campaign', 'Minimalist', 'Editorial', 'Short Form'],
  },
  {
    id: 'vid-14',
    index: '14',
    title: 'ATA Store — June 05 (Global)',
    titleLine1: 'Final',
    highlightWord: 'IMPACT',
    titleLine2: 'Core Release.',
    category: 'Promo Reel',
    duration: '00:14',
    videoUrl:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790582861/ATA_Store_June_05_Global_xlbc8i.mp4',
    poster:
      'https://res.cloudinary.com/dtxdirayo/video/upload/v1790582861/ATA_Store_June_05_Global_xlbc8i.webp',
    description:
      'High-speed conversion closer with decisive CTA framing and rhythmic motion accents.',
    projectInfo: {
      software: {
        name: 'Premiere Pro',
        icon: 'premiere-pro',
      },
      category: 'Promo Reel',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Promo Reel', 'Fast Cut', 'High Conversion', 'Street Style'],
  },
];

// Curated homepage selection (5 diverse flagship commercial reels)
export const featuredVideos: FeaturedVideo[] = [
  { ...allFeaturedVideos.find((v) => v.id === 'vid-1')!, index: '01' },
  { ...allFeaturedVideos.find((v) => v.id === 'vid-2')!, index: '02' },
  { ...allFeaturedVideos.find((v) => v.id === 'vid-3')!, index: '03' },
  { ...allFeaturedVideos.find((v) => v.id === 'vid-6')!, index: '04' },
  { ...allFeaturedVideos.find((v) => v.id === 'vid-10')!, index: '05' },
];

export const videoSectionData: VideoSectionData = {
  eyebrow: 'FEATURED WORK',
  heading: 'My Videos.',
  description:
    'Stories in motion. From cinematic edits to engaging content, each frame is crafted to connect and leave a lasting impact.',
  exploreLink: 'EXPLORE ALL VIDEOS →',
  statement: 'Every video is a blend of creativity, strategy and storytelling.',
  infoItems: [
    {
      id: 'info-1',
      icon: 'clapperboard',
      label: 'Editorial Direction',
      sublabel: 'Shorts & Commercials',
    },
    {
      id: 'info-2',
      icon: 'play',
      label: 'Motion Craft',
      sublabel: 'Pacing & Sound Design',
    },
    {
      id: 'info-3',
      icon: 'heart',
      label: 'Visual Grading',
      sublabel: 'Cinematic Atmosphere',
    },
  ],
};

// Backward-compatibility export for existing components if needed
export const videoProjects: VideoProject[] = featuredVideos.map((v) => ({
  id: v.id,
  title: v.title,
  subtitle: v.category,
  thumbnail: v.poster || v.videoUrl.replace(/\.mp4$/, '.webp'),
  videoUrl: v.videoUrl,
  duration: v.duration,
  category: v.category,
  orientation: 'portrait',
}));

export interface StoryPoster {
  id: string;
  index: string;
  title: string;
  image: string;
  category?: string;
  thumbnail?: string; // Backwards compatibility
  description?: string;
}

export interface StoryStatItem {
  id: string;
  icon: 'layers' | 'users' | 'eye' | 'heart';
  value: string;
  label: string;
}

export interface StorySectionData {
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  description: string;
  ctaText: string;
  stats: StoryStatItem[];
}

export const storySectionData: StorySectionData = {
  eyebrow: 'INSTAGRAM STORIES',
  headingLine1: 'Stories That',
  headingLine2: 'Connect.',
  description: 'Swipe through a collection of engaging stories crafted to inform, inspire and drive action.',
  ctaText: 'VIEW ALL STORIES',
  stats: [
    {
      id: 'stat-1',
      icon: 'layers',
      value: '150+',
      label: 'Stories Designed',
    },
    {
      id: 'stat-2',
      icon: 'users',
      value: '30+',
      label: 'Happy Clients',
    },
    {
      id: 'stat-3',
      icon: 'eye',
      value: '2M+',
      label: 'Story Views',
    },
    {
      id: 'stat-4',
      icon: 'heart',
      value: '98%',
      label: 'Engagement Rate',
    },
  ],
};

// ===== Portfolio Content — Instagram Stories / Portrait Posters =====
// Strict 9:16 portrait social artwork & story designs
export const allStoryPosters: StoryPoster[] = [
  {
    id: 'story-01',
    index: '01',
    title: 'Self Care & Health',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587517/Dec_8_z5rr6u.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587517/Dec_8_z5rr6u.png',
    category: 'Health & Wellness',
  },
  {
    id: 'story-02',
    index: '02',
    title: 'Natural Nutrition',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587506/Dec_5_ju0bbb.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587506/Dec_5_ju0bbb.png',
    category: 'Lifestyle',
  },
  {
    id: 'story-03',
    index: '03',
    title: 'Hydration Routine',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587491/DEC_4_owj8i6.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587491/DEC_4_owj8i6.png',
    category: 'Wellness',
  },
  {
    id: 'story-04',
    index: '04',
    title: 'Active Lifestyle',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587491/Dec_9_t4tdcx.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587491/Dec_9_t4tdcx.png',
    category: 'Fitness',
  },
  {
    id: 'story-05',
    index: '05',
    title: 'Mindful Growth',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587489/DEC_3_mm33r6.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587489/DEC_3_mm33r6.png',
    category: 'Motivation',
  },
  {
    id: 'story-06',
    index: '06',
    title: 'Daily Inspiration',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587465/7_Dec_qm5dxx.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587465/7_Dec_qm5dxx.png',
    category: 'Creatives',
  },
  {
    id: 'story-07',
    index: '07',
    title: 'Clean Eating',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587459/3_Dec_y7fer1.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587459/3_Dec_y7fer1.png',
    category: 'Nutrition',
  },
  {
    id: 'story-08',
    index: '08',
    title: 'Healthy Habits',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587455/10_Dec_odsxed.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587455/10_Dec_odsxed.png',
    category: 'Health',
  },
  {
    id: 'story-09',
    index: '09',
    title: 'Positive Mindset',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587453/1_Dec_ducyqf.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587453/1_Dec_ducyqf.png',
    category: 'Mindset',
  },
  {
    id: 'story-10',
    index: '10',
    title: 'Morning Routine',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587452/13_Dec_tfm2nj.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587452/13_Dec_tfm2nj.png',
    category: 'Lifestyle',
  },
  {
    id: 'story-11',
    index: '11',
    title: 'Body & Soul',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587435/25_NOV_m32uqo.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587435/25_NOV_m32uqo.png',
    category: 'Wellness',
  },
  {
    id: 'story-12',
    index: '12',
    title: 'Energy Boost',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587426/24_NOV_xwltzq.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587426/24_NOV_xwltzq.png',
    category: 'Fitness',
  },
  {
    id: 'story-13',
    index: '13',
    title: 'Wellness Journey',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587418/23_NOV_fco2ya.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587418/23_NOV_fco2ya.png',
    category: 'Health',
  },
  {
    id: 'story-14',
    index: '14',
    title: 'Nutrition Facts',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587414/28_NOV_osdmf4.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587414/28_NOV_osdmf4.png',
    category: 'Nutrition',
  },
  {
    id: 'story-15',
    index: '15',
    title: 'Daily Vitality',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587310/15_JAN_krtwqk.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587310/15_JAN_krtwqk.png',
    category: 'Lifestyle',
  },
  {
    id: 'story-16',
    index: '16',
    title: 'Strength & Focus',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587198/JAN_14_fpsyie.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771587198/JAN_14_fpsyie.png',
    category: 'Fitness',
  },
  {
    id: 'story-17',
    index: '17',
    title: 'Better Tomorrow',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771580734/12_Feb_Story_vaaajx.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771580734/12_Feb_Story_vaaajx.png',
    category: 'Motivation',
  },
  {
    id: 'story-18',
    index: '18',
    title: 'Storytelling Poster',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771580734/14_Feb_Story_t5mbpt.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771580734/14_Feb_Story_t5mbpt.png',
    category: 'Editorial',
  },
  {
    id: 'story-19',
    index: '19',
    title: 'Visual Narrative',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771580735/Feb_13_cmsieg.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1771580735/Feb_13_cmsieg.png',
    category: 'Editorial',
  },
];

// Curated homepage selection (8 most distinct editorial & typography story posters)
const curatedStoryIds = [
  'story-01', // Self Care & Health
  'story-02', // Natural Nutrition
  'story-03', // Hydration Routine
  'story-05', // Mindful Growth
  'story-10', // Morning Routine
  'story-14', // Nutrition Facts
  'story-18', // Storytelling Poster
  'story-19', // Visual Narrative
];

export const storyPosters: StoryPoster[] = curatedStoryIds.map((id, idx) => ({
  ...allStoryPosters.find((s) => s.id === id)!,
  index: `0${idx + 1}`,
}));

// Backwards compatibility export
export const stories: Story[] = storyPosters.map((s) => ({
  id: s.id,
  title: s.title,
  thumbnail: s.image,
  category: s.category,
}));

// ===== Portfolio Content — Social Media Creatives =====

export interface CreativePost {
  id: string;
  image: string;
  title?: string;
  aspectRatio?: number; // 0.8 for 4:5, 1.0 for 1:1, etc.
  category?: string;
  description?: string;
}

export interface CreativesStatItem {
  id: string;
  icon: 'layers' | 'users' | 'eye' | 'heart' | 'sparkles';
  value: string;
  label: string;
}

export interface CreativesSectionData {
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  headingHighlight: string;
  description: string;
  ctaText: string;
  stats: CreativesStatItem[];
}

export const creativesSectionData: CreativesSectionData = {
  eyebrow: 'CREATIVE & SOCIAL MEDIA',
  headingLine1: 'Creative',
  headingLine2: 'That',
  headingHighlight: 'Captivates.',
  description:
    'Bold ideas. Clean design. Impactful visuals that stop the scroll and spark action.',
  ctaText: 'EXPLORE ALL POSTS',
  stats: [
    {
      id: 'stat-c1',
      icon: 'sparkles',
      value: '120+',
      label: 'POSTER DESIGNS',
    },
    {
      id: 'stat-c2',
      icon: 'users',
      value: '40+',
      label: 'BRANDS WORKED',
    },
    {
      id: 'stat-c3',
      icon: 'eye',
      value: '3M+',
      label: 'SOCIAL REACH',
    },
    {
      id: 'stat-c4',
      icon: 'heart',
      value: '98%',
      label: 'CLIENT SATISFACTION',
    },
  ],
};

export const allCreativePosts: CreativePost[] = [
  {
    id: 'post-01',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790584450/ChatGPT_Image_Aug_7_2026_12_37_16_PM_wayjne.png',
    title: 'Ruby Power & Confidence',
    aspectRatio: 0.8,
    category: 'Jewelry Campaign',
  },
  {
    id: 'post-02',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790584447/ChatGPT_Image_Aug_21_2026_01_00_47_PM_vy82uu.png',
    title: 'Why Ruby Is Best',
    aspectRatio: 0.8,
    category: 'Product Showcase',
  },
  {
    id: 'post-03',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790584444/ChatGPT_Image_Aug_21_2026_01_08_22_PM_b2snkg.png',
    title: 'Timeless Gem Elegance',
    aspectRatio: 0.8,
    category: 'Luxury Brand',
  },
  {
    id: 'post-04',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790584437/ChatGPT_Image_Aug_21_2026_01_32_56_PM_ye9bek.png',
    title: 'Ruby Energy & Vitality',
    aspectRatio: 0.8,
    category: 'Editorial',
  },
  {
    id: 'post-05',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790584436/ChatGPT_Image_Aug_21_2026_01_11_25_PM_y9a31z.png',
    title: 'Strengthens The Sun',
    aspectRatio: 0.8,
    category: 'Campaign Post',
  },
  {
    id: 'post-06',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790584434/ChatGPT_Image_Aug_21_2026_05_37_49_PM_xn3imr.png',
    title: 'Bold & Powerful Gem',
    aspectRatio: 0.8,
    category: 'Typography Post',
  },
  {
    id: 'post-07',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790584432/ChatGPT_Image_Aug_21_2026_05_43_22_PM_hzqvny.png',
    title: 'Attracts Success & Fame',
    aspectRatio: 0.8,
    category: 'Jewelry Design',
  },
  {
    id: 'post-08',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790584427/ChatGPT_Image_Sep_3_2026_05_46_58_PM_l4pifw.png',
    title: 'Crafted Precision',
    aspectRatio: 0.8,
    category: 'Product Showcase',
  },
  {
    id: 'post-09',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790584423/ChatGPT_Image_Aug_25_2026_01_27_49_PM_ct1k4n.png',
    title: 'Golden Ring Showcase',
    aspectRatio: 0.8,
    category: 'Luxury Brand',
  },
  {
    id: 'post-10',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790584421/ChatGPT_Image_Sep_17_2026_04_13_47_PM_donpx9.png',
    title: 'Royal Ruby Halo Ring',
    aspectRatio: 0.8,
    category: 'Editorial',
  },
  {
    id: 'post-11',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790584419/ChatGPT_Image_Sep_8_2026_04_09_49_PM_khiq61.png',
    title: 'Minimal Gem Pendant',
    aspectRatio: 0.8,
    category: 'Campaign Post',
  },
  {
    id: 'post-12',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790584438/ChatGPT_Image_Aug_21_2026_01_09_48_PM_fzxqfy.png',
    title: 'Warm Luxury Layout',
    aspectRatio: 0.8,
    category: 'Jewelry Design',
  },
  {
    id: 'post-13',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790584630/magnific_create-an-ultrapremium-in_2897488838_ivlq8g.png',
    title: 'Silk & Stone Harmony',
    aspectRatio: 0.8,
    category: 'Product Showcase',
  },
  {
    id: 'post-14',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790584627/magnific_a-closeup-shot-features-a_2932397019_ygspc1.png',
    title: 'Ruby Heritage Cushion',
    aspectRatio: 0.8,
    category: 'Luxury Brand',
  },
  {
    id: 'post-15',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790584682/magnific_blackandwhite-cinematic-c_2896639960_p6tqsp.png',
    title: 'Gemological Precision',
    aspectRatio: 0.8,
    category: 'Editorial',
  },
  {
    id: 'post-16',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790584672/magnific_gold-gemstone-bracelet-on_2896763986_x5fn5k.png',
    title: 'Pristine Gem Craft',
    aspectRatio: 0.8,
    category: 'Campaign Post',
  },
  {
    id: 'post-17',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790584642/magnific_a-closeup-shallow-depth-o_2932633118_yyc5os.png',
    title: 'The Best For You',
    aspectRatio: 0.8,
    category: 'Typography Post',
  },
  {
    id: 'post-18',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790584635/ChatGPT_Image_Apr_30_2026_06_08_38_PM_p4hbra.png',
    title: 'Attracts Fame & Recognition',
    aspectRatio: 0.8,
    category: 'Jewelry Design',
  },
];

// Curated homepage selection (6 strongest luxury campaign & product creatives)
const curatedCreativeIds = [
  'post-01', // Ruby Power & Confidence
  'post-03', // Timeless Gem Elegance
  'post-05', // Strengthens The Sun
  'post-08', // Crafted Precision
  'post-10', // Royal Ruby Halo Ring
  'post-13', // Silk & Stone Harmony
];

export const creativePosts: CreativePost[] = curatedCreativeIds.map(
  (id) => allCreativePosts.find((p) => p.id === id)!
);

// Backwards compatibility export
export const creatives: Creative[] = creativePosts.map((p) => ({
  id: p.id,
  title: p.title || 'Creative Design',
  thumbnail: p.image,
  category: p.category || 'Posters',
}));

export interface YoutubeThumbnail {
  id: string;
  index: string;
  title: string;
  image: string;
  thumbnail?: string; // backwards compatibility
  category?: string;
  views?: string;
  aspectRatio?: number; // 16/9 = 1.7777777777777777
}

export interface ThumbnailStatItem {
  id: string;
  icon: 'video' | 'users' | 'eye' | 'heart' | 'sparkles';
  value: string;
  label: string;
}

export interface ThumbnailSectionData {
  eyebrow: string;
  headingLine1: string;
  headingHighlight: string;
  description: string;
  stats: ThumbnailStatItem[];
}

export const thumbnailSectionData: ThumbnailSectionData = {
  eyebrow: 'YOUTUBE THUMBNAILS',
  headingLine1: 'Thumbnails That Get',
  headingHighlight: 'Clicks.',
  description:
    'Bold visual storytelling. High-contrast hierarchy. Designed to capture viewer attention in split seconds.',
  stats: [
    {
      id: 'stat-t1',
      icon: 'video',
      value: '150+',
      label: 'THUMBNAILS CRAFTED',
    },
    {
      id: 'stat-t2',
      icon: 'eye',
      value: 'High CTR',
      label: 'VISUAL HIERARCHY',
    },
    {
      id: 'stat-t3',
      icon: 'sparkles',
      value: '4K Native',
      label: 'COLOR GRADED & SHARP',
    },
    {
      id: 'stat-t4',
      icon: 'heart',
      value: 'Custom',
      label: 'COMPOSITION & ART',
    },
  ],
};

// ===== Portfolio Content — YouTube Thumbnails =====

export const allYoutubeThumbnails: YoutubeThumbnail[] = [
  {
    id: 'yt-1',
    index: '01',
    title: 'BGMI Live Stream Tournament',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790581426/Thumb_2_-_BGMI_LIVE_lyuvtj.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790581426/Thumb_2_-_BGMI_LIVE_lyuvtj.png',
    category: 'Gaming',
    views: '1.4M',
    aspectRatio: 16 / 9,
  },
  {
    id: 'yt-2',
    index: '02',
    title: 'BGMI Championship Finals',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790581425/Thumb_5_-_BGMI_LIVE_aibc18.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790581425/Thumb_5_-_BGMI_LIVE_aibc18.png',
    category: 'Gaming',
    views: '890K',
    aspectRatio: 16 / 9,
  },
  {
    id: 'yt-3',
    index: '03',
    title: 'History of Enzo Ferrari',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790581424/Thumb_7_-_History_of_Enzo_FERRARi_vrtv1y.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790581424/Thumb_7_-_History_of_Enzo_FERRARi_vrtv1y.png',
    category: 'Documentary',
    views: '2.1M',
    aspectRatio: 16 / 9,
  },
  {
    id: 'yt-4',
    index: '04',
    title: 'The Rise of Artificial Intelligence',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790581413/Thumb_8_-_The_Rise_of_Ai_nhq8o7.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790581413/Thumb_8_-_The_Rise_of_Ai_nhq8o7.png',
    category: 'Tech',
    views: '1.8M',
    aspectRatio: 16 / 9,
  },
  {
    id: 'yt-5',
    index: '05',
    title: 'BGMI Pro League Highlights',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790581413/Thumb_3_-_BGMI_LIVE_js8tip.jpg',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790581413/Thumb_3_-_BGMI_LIVE_js8tip.jpg',
    category: 'Gaming',
    views: '760K',
    aspectRatio: 16 / 9,
  },
  {
    id: 'yt-6',
    index: '06',
    title: 'BGMI Ultimate Clutch Moments',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790581412/Thumb_6_-_BGMI_LIVE_k8nsth.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790581412/Thumb_6_-_BGMI_LIVE_k8nsth.png',
    category: 'Gaming',
    views: '950K',
    aspectRatio: 16 / 9,
  },
  {
    id: 'yt-7',
    index: '07',
    title: 'Free Fire Championship',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790581410/Thumb_10_-_Free_Fire_Thumbnail_idbihn.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790581410/Thumb_10_-_Free_Fire_Thumbnail_idbihn.png',
    category: 'Gaming',
    views: '1.2M',
    aspectRatio: 16 / 9,
  },
  {
    id: 'yt-8',
    index: '08',
    title: 'BGMI Live Ranked Push',
    image: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790581410/Thumb_1_-_BGMI_LIVE_wx6fbk.png',
    thumbnail: 'https://res.cloudinary.com/dtxdirayo/image/upload/v1790581410/Thumb_1_-_BGMI_LIVE_wx6fbk.png',
    category: 'Gaming',
    views: '620K',
    aspectRatio: 16 / 9,
  },
];

// Curated homepage selection (5 diverse documentary, tech & peak gaming thumbnails)
const curatedThumbnailIds = [
  'yt-3', // History of Enzo Ferrari (Documentary, 2.1M views)
  'yt-4', // The Rise of Artificial Intelligence (Tech, 1.8M views)
  'yt-1', // BGMI Live Stream Tournament (Gaming, 1.4M views)
  'yt-6', // BGMI Ultimate Clutch Moments (Gaming, 950K views)
  'yt-7', // Free Fire Championship (Gaming, 1.2M views)
];

export const youtubeThumbnails: YoutubeThumbnail[] = curatedThumbnailIds.map((id, idx) => ({
  ...allYoutubeThumbnails.find((t) => t.id === id)!,
  index: `0${idx + 1}`,
}));

// Backward-compatibility export
export const thumbnails: Thumbnail[] = youtubeThumbnails.map((yt) => ({
  id: yt.id,
  title: yt.title,
  thumbnail: yt.image,
  category: yt.category || 'Thumbnails',
}));

// ===== Thumbnail Categories =====

export const thumbnailCategories = [
  'All',
  'Gaming',
  'Documentary',
  'Tech',
  'Motivation',
  'Editing',
];

export const creativeCategories = [
  'All',
  'Posters',
  'Social Media',
  'Branding',
  'Photo Manipulation',
];

// ===== Digital Work / Interfaces & Websites =====

export interface CaseStudyStep {
  number: string;
  title: string;
  description: string;
}

export interface CaseStudyColor {
  name: string;
  hex: string;
  role: string;
}

export interface CaseStudyScreen {
  title: string;
  description: string;
  image: string;
  layout?: 'hero-wide' | 'split-detail' | 'screen-strip';
}

export interface CaseStudyData {
  year: string;
  role: string;
  services: string[];
  summary: string;
  overview: {
    context: string;
    statement: string;
    stats?: { label: string; value: string }[];
  };
  challenge: {
    problem: string;
    keyPoints: string[];
  };
  goal: {
    objective: string;
    deliverables: string[];
  };
  approach: {
    philosophy: string;
    steps: CaseStudyStep[];
  };
  designSystem: {
    headingFont: string;
    bodyFont: string;
    notes: string;
    palette: CaseStudyColor[];
  };
  keyScreens: CaseStudyScreen[];
  interactions: {
    uxThinking: string;
    features: { title: string; detail: string }[];
  };
  finalExperience: {
    overview: string;
    previewImage: string;
    tallImage?: string;
  };
  techStack: {
    category: string;
    items: string[];
  }[];
  outcome: {
    summary: string;
    impactTakeaway: string;
  };
}

export interface DigitalProject {
  id: string;
  slug: string;
  index: string; // e.g., "01", "02", "03", "04"
  title: string;
  type: 'website' | 'ui' | 'webapp';
  category: string;
  categoryLabel: string;
  url?: string;
  previewImage: string;
  tallPreviewImage?: string;
  hasLivePreview?: boolean;
  description: string;
  tools?: string[];
  featured?: boolean;
  caseStudy?: CaseStudyData;
}

export const digitalProjects: DigitalProject[] = [
  {
    id: 'proj-imagemint',
    slug: 'imagemint',
    index: '01',
    title: 'ImageMint',
    type: 'webapp',
    category: 'Web Application / Utility',
    categoryLabel: 'WEB APPLICATION & UTILITY',
    url: 'https://imagemint.free.je/?i=2',
    description: 'A smart image optimization tool for compressing images across different sizes and formats.',
    previewImage: '/assets/ui-websites/imagemint.webp',
    tallPreviewImage: '/assets/ui-websites/imagemint-tall.webp',
    hasLivePreview: false,
    tools: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    featured: true,
    caseStudy: {
      year: '2024',
      role: 'Product Designer & Frontend Engineer',
      services: ['UI/UX Design', 'Client-Side Engineering', 'Design Systems'],
      summary: 'A high-performance in-browser image optimization workspace designed for zero server uploads, privacy, and granular format control.',
      overview: {
        context: 'ImageMint was conceptualized and engineered to address a recurring dilemma for designers and developers: the need to quickly compress images without sacrificing privacy, uploading proprietary assets to unknown third-party cloud tools, or suffering aggressive ad walls.',
        statement: 'Fast, private, client-side image compression directly inside the user’s browser.',
        stats: [
          { label: 'Average File Size Savings', value: '65–80%' },
          { label: 'Server Uploads', value: '0 Bytes' },
          { label: 'Processing Latency', value: '< 150ms' },
        ],
      },
      challenge: {
        problem: 'Traditional web compressors require users to transmit files across external networks, creating security risks, bandwidth overhead, and arbitrary upload limits for high-resolution photography.',
        keyPoints: [
          'Zero-knowledge requirement: Image assets must never leave the client device.',
          'Eliminating UI friction: No multi-step wizard screens, popup ads, or account gates.',
          'Multi-format versatility: Instant encoding across WebP, AVIF, JPEG, and PNG.',
        ],
      },
      goal: {
        objective: 'Deliver an intuitive single-screen studio where creators can drop multi-megabyte image batches, observe real-time compression telemetry, and download production-ready assets instantaneously.',
        deliverables: [
          'Single-screen modular workspace reducing mental fatigue',
          'Real-time byte savings telemetry calculator',
          'Configurable lossless & lossy parameter engine',
          'One-click batch zip export with zero network latency',
        ],
      },
      approach: {
        philosophy: 'Utilitarian precision meets warm editorial craft. Instead of cold dashboard cards, the interface utilizes paper-toned canvas backgrounds with focused controls to reduce visual fatigue.',
        steps: [
          {
            number: '01',
            title: 'Offline Sandbox Architecture',
            description: 'Leveraged HTML5 Canvas and browser WebAssembly to handle image decoding, resizing, and encoding entirely within local memory.',
          },
          {
            number: '02',
            title: 'Focused Ergonomic Controls',
            description: 'Grouped optimization presets, quality sliders, and dimension constraints into a dedicated side inspector.',
          },
          {
            number: '03',
            title: 'Immediate Visual Verification',
            description: 'Live split comparison enabling users to verify edge sharpness and color preservation before downloading.',
          },
        ],
      },
      designSystem: {
        headingFont: 'Playfair Display (Serif Display)',
        bodyFont: 'Sora (Clean Technical Sans)',
        notes: 'Warm editorial paper tones (#FAF7F2) balanced with charcoal controls and amber accents, evoking the precision of an artisan print workshop.',
        palette: [
          { name: 'Warm Canvas', hex: '#FAF7F2', role: 'Primary Background' },
          { name: 'Dark Charcoal', hex: '#1B1917', role: 'Typography & Frames' },
          { name: 'Amber Ochre', hex: '#C4943A', role: 'Key Accent & Highlights' },
          { name: 'Olive Gray', hex: '#6E6961', role: 'Secondary Text & Borders' },
        ],
      },
      keyScreens: [
        {
          title: 'Workspace Studio',
          description: 'The main staging arena featuring the drag-and-drop target, multi-format queue, and savings analytics.',
          image: '/assets/ui-websites/imagemint.webp',
          layout: 'hero-wide',
        },
        {
          title: 'Precision Parameter Inspector',
          description: 'Side panel with format selector (WebP, AVIF, PNG), resolution presets, and lossless toggles.',
          image: '/assets/ui-websites/imagemint-tall.webp',
          layout: 'split-detail',
        },
      ],
      interactions: {
        uxThinking: 'Micro-interactions designed to reassure users that processing happens locally and immediately.',
        features: [
          {
            title: 'Instant Drop & Queue',
            detail: 'Native drag-and-drop with multi-file thumbnail preview and individual removal.',
          },
          {
            title: 'Live Savings Metric',
            detail: 'Instant calculation of byte delta and percentage reduction per file and in total.',
          },
          {
            title: 'One-Click Download All',
            detail: 'Bundles processed images into an organized package without server roundtrips.',
          },
        ],
      },
      finalExperience: {
        overview: 'A frictionless utility combining privacy guarantees with professional-grade compression controls.',
        previewImage: '/assets/ui-websites/imagemint.webp',
        tallImage: '/assets/ui-websites/imagemint-tall.webp',
      },
      techStack: [
        {
          category: 'Frontend & Core Engine',
          items: ['React 18', 'TypeScript', 'Tailwind CSS', 'HTML5 Canvas API', 'Framer Motion', 'Web Workers'],
        },
      ],
      outcome: {
        summary: 'ImageMint demonstrates that modern web applications can deliver desktop-class utility tools completely client-side with zero cloud infrastructure overhead.',
        impactTakeaway: 'Achieved sub-150ms client-side compression speeds with zero server costs and 100% data privacy.',
      },
    },
  },
  {
    id: 'proj-arpit-designs-net',
    slug: 'arpit-designs',
    index: '02',
    title: 'ARPIT DESIGNS',
    type: 'website',
    category: 'Website / Portfolio',
    categoryLabel: 'WEBSITE / PORTFOLIO',
    url: 'https://creative-arpit.netlify.app/',
    description: 'Previous portfolio created with Antigravity featuring immersive creative editorial showcases and motion.',
    previewImage: '/assets/ui-websites/arpit-portfolio.webp',
    tallPreviewImage: '/assets/ui-websites/arpit-tall.webp',
    hasLivePreview: true,
    tools: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    featured: true,
    caseStudy: {
      year: '2024',
      role: 'Creative Director & Designer',
      services: ['Visual Identity', 'Web Design', 'Motion Choreography'],
      summary: 'A bespoke editorial portfolio crafted to showcase creative design, visual identity, and high-impact digital storytelling.',
      overview: {
        context: 'Created to serve as the flagship creative portal for my design and editing services, blending high-fashion editorial aesthetics with fluid web interactions.',
        statement: 'Transforming creative design and motion projects into an interactive visual exhibition.',
        stats: [
          { label: 'Page Load Performance', value: '98 / 100' },
          { label: 'Motion Framerate', value: '60 FPS' },
          { label: 'Client Inquiry Uplift', value: '+140%' },
        ],
      },
      challenge: {
        problem: 'Traditional creative portfolios often feel like rigid grids of thumbnails without editorial pacing, failing to communicate the craft and intentionality behind the work.',
        keyPoints: [
          'Pacing the narrative: Balancing rich motion showcases with lightning-fast load times.',
          'Cross-device responsiveness: Ensuring cinematic visual quality on smartphones and ultra-wide displays.',
          'Distinctive aesthetic: Avoiding generic portfolio templates to build lasting personal brand recall.',
        ],
      },
      goal: {
        objective: 'Design an interactive showcase that immerses art directors and agency clients in a premium brand universe from the first scroll.',
        deliverables: [
          'Custom editorial typography hierarchy',
          'Fluid project showcase carousels',
          'Immersive video viewer & modal overlays',
          'Direct inquiry conversion pathways',
        ],
      },
      approach: {
        philosophy: 'Restrained luxury. Deep obsidian tones paired with warm gold hairlines and generous breathing room to make video and visual work glow.',
        steps: [
          {
            number: '01',
            title: 'Visual Identity Foundation',
            description: 'Selected commanding serif headlines paired with precise geometric sans-serif metadata.',
          },
          {
            number: '02',
            title: 'Motion Choreography',
            description: 'Engineered subtle scroll-triggered transitions and physics-based spring animations.',
          },
          {
            number: '03',
            title: 'Conversion Ergonomics',
            description: 'Placed contextual contact triggers and live exploration pathways at natural decision points.',
          },
        ],
      },
      designSystem: {
        headingFont: 'Playfair Display (Commanding Serif)',
        bodyFont: 'Sora (Clean Geometric Sans)',
        notes: 'Dark luxury aesthetic (#0E0D0B) accented with warm antique gold (#D4A94E) and deep burgundy (#7A1C28).',
        palette: [
          { name: 'Obsidian Night', hex: '#0E0D0B', role: 'Main Canvas Ground' },
          { name: 'Antique Gold', hex: '#D4A94E', role: 'Primary Accent & Rules' },
          { name: 'Imperial Burgundy', hex: '#7A1C28', role: 'CTA & Focus Highlights' },
          { name: 'Soft Cream', hex: '#F7F2E8', role: 'Body Typography' },
        ],
      },
      keyScreens: [
        {
          title: 'Brand Hero & Creative Identity',
          description: 'Bold typographic positioning statement with interactive work preview.',
          image: '/assets/ui-websites/arpit-portfolio.webp',
          layout: 'hero-wide',
        },
        {
          title: 'Curated Project Gallery',
          description: 'Editorial cards presenting client collaborations with high-contrast metadata.',
          image: '/assets/ui-websites/arpit-tall.webp',
          layout: 'split-detail',
        },
      ],
      interactions: {
        uxThinking: 'Prioritized silky smooth transitions that respect user scroll velocity and avoid layout shifts.',
        features: [
          {
            title: 'Fluid Project Transition',
            detail: 'Zero white-flash screen transitions when switching between featured case studies.',
          },
          {
            title: 'Immersive Media Viewports',
            detail: 'Modal overlays that preserve true aspect ratios and enable focused viewing.',
          },
          {
            title: 'One-Tap Direct Connect',
            detail: 'Direct communication channels pre-filled with project context for instant collaboration.',
          },
        ],
      },
      finalExperience: {
        overview: 'An authoritative personal platform that validates creative excellence and drives high-value client bookings.',
        previewImage: '/assets/ui-websites/arpit-portfolio.webp',
        tallImage: '/assets/ui-websites/arpit-tall.webp',
      },
      techStack: [
        {
          category: 'Frontend Stack',
          items: ['React 18', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Lucide Icons', 'Netlify CI/CD'],
        },
      ],
      outcome: {
        summary: 'Positioned the studio as a premium creative partner, resulting in consistent client acquisition and acclaim across creative communities.',
        impactTakeaway: 'Achieved 60fps interaction fluidity, near-perfect Lighthouse scores, and a recognizable personal brand identity.',
      },
    },
  },
  {
    id: 'proj-yogesh-naharwara',
    slug: 'yogesh-naharwara',
    index: '03',
    title: 'Yogesh Naharwara',
    type: 'website',
    category: 'Portfolio Website',
    categoryLabel: 'PORTFOLIO WEBSITE',
    url: 'https://yogesh-naharwara.framer.website/',
    description: 'Creative portfolio designed and built in Framer with dynamic interactions and fluid aesthetics.',
    previewImage: '/assets/ui-websites/yogesh-portfolio.webp',
    tallPreviewImage: '/assets/ui-websites/yogesh-tall.webp',
    hasLivePreview: true,
    tools: ['Framer', 'UI/UX', 'Interaction Design'],
    featured: true,
    caseStudy: {
      year: '2024',
      role: 'UI/UX Designer & Framer Builder',
      services: ['Interface Design', 'Framer Development', 'Interaction Design'],
      summary: 'A modern developer and creator portfolio designed and published in Framer with dynamic interactions and dark aesthetic.',
      overview: {
        context: 'Commissioned by web developer Yogesh Naharwara to establish a distinctive personal portfolio that presents his coding capabilities and visual taste with modern flair.',
        statement: 'Bridging developer technical authority with dynamic visual aesthetics.',
        stats: [
          { label: 'Lighthouse Performance', value: '100 / 100' },
          { label: 'Build Time to Launch', value: '2 Weeks' },
          { label: 'Client Lead Growth', value: '+95%' },
        ],
      },
      challenge: {
        problem: 'Developer websites often skew heavily toward dense terminal aesthetics or unstyled resume bullet points, failing to appeal to visual clients and marketing leaders.',
        keyPoints: [
          'Synthesizing code and design: Highlighting both full-stack programming proficiency and aesthetic craft.',
          'Framer CMS scalability: Enabling Yogesh to publish new client projects independently without touching code.',
          'Instant mobile responsiveness: Flawless performance on mobile browsers where tech founders browse portfolios.',
        ],
      },
      goal: {
        objective: 'Craft a sleek, high-contrast digital identity in Framer with interactive components, live code badges, and clear project showcases.',
        deliverables: [
          'Developer persona hero with availability pill',
          'Interactive project showcase cards with live demo links',
          'Modular skills & tech stack grid',
          'Framer CMS backend for easy case study publishing',
        ],
      },
      approach: {
        philosophy: 'Clean technical modernism. Using dark canvas surfaces with subtle amber backlights to spotlight developer achievements.',
        steps: [
          {
            number: '01',
            title: 'Information Architecture',
            description: 'Organized project highlights into distinct categories: Web Apps, Websites, and Experimental Code.',
          },
          {
            number: '02',
            title: 'Framer Component Engineering',
            description: 'Built reusable interactive cards with smooth hover parallax and spring-based button states.',
          },
          {
            number: '03',
            title: 'SEO & Performance Tuning',
            description: 'Optimized asset sizes and metadata for rapid search engine indexation.',
          },
        ],
      },
      designSystem: {
        headingFont: 'Syne Display (Modern Geometric Sans)',
        bodyFont: 'Inter / Sora (Legible Interface Sans)',
        notes: 'Deep carbon black (#0A0A0A) punctuated by electric amber (#F59E0B) and structured hairline borders (#27272A).',
        palette: [
          { name: 'Carbon Black', hex: '#0A0A0A', role: 'Primary Ground' },
          { name: 'Electric Amber', hex: '#F59E0B', role: 'Active Highlights & Badges' },
          { name: 'Border Charcoal', hex: '#27272A', role: 'Subtle Dividers & Cards' },
          { name: 'Pure White', hex: '#FFFFFF', role: 'Headlines & Key Metrics' },
        ],
      },
      keyScreens: [
        {
          title: 'Developer Persona Hero',
          description: 'Features prominent availability status, concise value proposition, and quick CTA buttons.',
          image: '/assets/ui-websites/yogesh-portfolio.webp',
          layout: 'hero-wide',
        },
        {
          title: 'Work & Tech Stack Showcase',
          description: 'Clean grid of shipped applications with live preview links and tech badges.',
          image: '/assets/ui-websites/yogesh-tall.webp',
          layout: 'split-detail',
        },
      ],
      interactions: {
        uxThinking: 'Quick, satisfying micro-feedback on every interactive element to reflect developer engineering precision.',
        features: [
          {
            title: 'Live Availability Indicator',
            detail: 'Pulsing green status pill communicating freelance capacity.',
          },
          {
            title: 'Card Tilt & Lift',
            detail: 'Subtle 3D perspective shift on mouse hover showcasing depth.',
          },
          {
            title: 'Instant Social & Github Links',
            detail: 'Contextual access to code repositories and client live URLs.',
          },
        ],
      },
      finalExperience: {
        overview: 'A polished web presence that gives Yogesh an immediate competitive edge when pitching high-ticket development contracts.',
        previewImage: '/assets/ui-websites/yogesh-portfolio.webp',
        tallImage: '/assets/ui-websites/yogesh-tall.webp',
      },
      techStack: [
        {
          category: 'Platform & Toolkit',
          items: ['Framer', 'React', 'Custom CSS', 'Framer CMS', 'Responsive Breakpoints'],
        },
      ],
      outcome: {
        summary: 'The launched portfolio achieved a 100% Lighthouse performance score and directly secured new freelance client engagements within its first month.',
        impactTakeaway: 'Proven conversion increase for freelance developer contracts with effortless CMS updates.',
      },
    },
  },
  {
    id: 'proj-arpit-designs-framer',
    slug: 'arpit-designs-framer',
    index: '04',
    title: 'ARPIT DESIGNS Framer Portfolio',
    type: 'website',
    category: 'Portfolio Website',
    categoryLabel: 'PORTFOLIO WEBSITE',
    url: 'https://arpit-designs.framer.website/',
    description: 'Design showcase and brand identity portfolio crafted in Framer focusing on visual excellence.',
    previewImage: '/assets/ui-websites/arpit-designs.webp',
    tallPreviewImage: '/assets/ui-websites/arpit-designs-tall.webp',
    hasLivePreview: true,
    tools: ['Framer', 'Visual Identity', 'Typography'],
    featured: true,
    caseStudy: {
      year: '2024',
      role: 'Brand & Web Designer',
      services: ['Brand Identity', 'Web Design', 'Framer CMS'],
      summary: 'A visual identity and design showcase crafted in Framer focusing on typography, motion, and digital craftsmanship.',
      overview: {
        context: 'An experimental brand portfolio created in Framer to explore cutting-edge layout rhythms, bold monographic headers, and fluid bento layouts.',
        statement: 'Pushing the boundaries of typography and editorial composition on the web.',
        stats: [
          { label: 'Interaction FPS', value: '60 FPS' },
          { label: 'Visual Hierarchy Rating', value: 'A+' },
          { label: 'Design Inquiries', value: '+110%' },
        ],
      },
      challenge: {
        problem: 'Standing out in the creative industry requires more than conventional portfolio layouts; it requires demonstrating mastery over typography, scale, and digital texture.',
        keyPoints: [
          'Typographic scale: Balancing oversized monograms with readable body text across all device sizes.',
          'Bento rhythm: Organizing diverse graphic formats (thumbnails, posters, branding kits) into an intuitive visual story.',
          'Performance optimization: Keeping heavy high-resolution visual artwork loading effortlessly.',
        ],
      },
      goal: {
        objective: 'Build a showstopper Framer portfolio that acts as a live testament to graphic design prowess and modern web capability.',
        deliverables: [
          'Oversized typographic hero banner',
          'Asymmetric bento grid for multi-format creative showcases',
          'Integrated design service breakdown cards',
          'Direct project inquiry modal trigger',
        ],
      },
      approach: {
        philosophy: 'Bold typographic authority. Large display letterforms set the mood while minimal layouts allow creative work to take center stage.',
        steps: [
          {
            number: '01',
            title: 'Grid Exploration',
            description: 'Architected an asymmetric bento framework that accommodates both 16:9 thumbnails and 9:16 portrait posters.',
          },
          {
            number: '02',
            title: 'Typographic Harmony',
            description: 'Paired high-impact display lettering with structured tabular sans-serif data points.',
          },
          {
            number: '03',
            title: 'Framer Native Animation',
            description: 'Utilized Framer native spring physics for natural, lifelike card reveals.',
          },
        ],
      },
      designSystem: {
        headingFont: 'Clash Display (Bold Editorial Grotesk)',
        bodyFont: 'Sora (Clean Technical Sans)',
        notes: 'Deep pitch black (#050505) with crimson accent (#E11D48) and pure white typography (#FFFFFF).',
        palette: [
          { name: 'Pitch Black', hex: '#050505', role: 'Deep Canvas Ground' },
          { name: 'Crimson Ember', hex: '#E11D48', role: 'Primary Accent & Action Color' },
          { name: 'Neutral Silver', hex: '#D1D5DB', role: 'Muted Labels & Borders' },
          { name: 'Pure White', hex: '#FFFFFF', role: 'Commanding Headlines' },
        ],
      },
      keyScreens: [
        {
          title: 'Bold Monographic Hero',
          description: 'Striking typographic identity with brand mission statement.',
          image: '/assets/ui-websites/arpit-designs.webp',
          layout: 'hero-wide',
        },
        {
          title: 'Editorial Bento Showcase',
          description: 'Asymmetrical grid displaying video editing, thumbnails, and visual designs.',
          image: '/assets/ui-websites/arpit-designs-tall.webp',
          layout: 'split-detail',
        },
      ],
      interactions: {
        uxThinking: 'Smooth scroll-based discovery that keeps visual momentum high without overwhelming the viewer.',
        features: [
          {
            title: 'Asymmetric Bento Flow',
            detail: 'Cards dynamically adjust proportions to highlight hero projects.',
          },
          {
            title: 'Spring Hover Physics',
            detail: 'Tactile physical bounce on all interactive project cards.',
          },
          {
            title: 'Responsive Reflow',
            detail: 'Seamless transition from desktop multi-column bento to clean mobile vertical stream.',
          },
        ],
      },
      finalExperience: {
        overview: 'A powerful design portfolio that communicates creative leadership and technical execution in one unified package.',
        previewImage: '/assets/ui-websites/arpit-designs.webp',
        tallImage: '/assets/ui-websites/arpit-designs-tall.webp',
      },
      techStack: [
        {
          category: 'Ecosystem & Tools',
          items: ['Framer', 'Framer CMS', 'React', 'Motion Graphics Assets', 'Custom Web Fonts'],
        },
      ],
      outcome: {
        summary: 'The Framer portfolio serves as an industry-level benchmark for how typography and layout can elevate personal branding.',
        impactTakeaway: 'Delivered an acclaimed visual identity portfolio with flawless responsive performance and strong conversion.',
      },
    },
  },
];

export const digitalCategories = ['ALL', 'UI/UX', 'WEBSITES'] as const;
export type DigitalCategory = (typeof digitalCategories)[number];

export function getDigitalProjectBySlug(slug: string): DigitalProject | undefined {
  if (!slug) return undefined;
  const cleanSlug = slug.toLowerCase().trim();
  return digitalProjects.find(
    (p) => p.slug.toLowerCase() === cleanSlug || p.id.toLowerCase() === cleanSlug
  );
}

