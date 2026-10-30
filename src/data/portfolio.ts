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
  phone: '+91 6377467850',
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
    period: 'July 2025 — Present',
    company: 'Innovana Thinklabs Ltd.',
    role: 'Video Editor',
    description:
      'Producing professional video content and motion graphics for technology products and corporate communications under strict deadlines. (Internship / Contract: July–Dec 2025 | Full-time: Jan 2026–Present).',
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
  // --- Social Media & Visual Motion (22) ---
  {
    id: 'vid-sm-1',
    index: '01',
    title: 'Kedarnath Rudraksha Avatar',
    titleLine1: 'Sacred',
    highlightWord: 'DEVOTION',
    titleLine2: 'Kedarnath 3D.',
    category: '3D Animation',
    duration: '00:35',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Social%20Media/ATA%20Store%20June%2014%20Indian.mp4?tr=orig-true&updatedAt=1793349452761',
    poster: '/assets/video-posters/vid-sm-1.webp',
    description: 'Stylized 3D character animation of a young Rudraksha avatar bearing a Trishul before the sacred Kedarnath shrine.',
    projectInfo: {
      software: { name: 'After Effects', icon: 'after-effects' },
      category: '3D Character & Motion',
    },
    softwares: [
      { name: 'After Effects', icon: 'after-effects' },
      { name: 'Premiere Pro', icon: 'premiere-pro' },
    ],
    tags: ['3D Character', 'Spiritual Motion', 'Kedarnath', 'CGI'],
  },
  {
    id: 'vid-sm-2',
    index: '02',
    title: 'Shree Yantra on Raw Pyrite Frame',
    titleLine1: 'Sacred',
    highlightWord: 'PYRITE',
    titleLine2: 'Yantra Frame.',
    category: 'Product Showcase',
    duration: '00:30',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Social%20Media/ATA%20Store%20June%2003%20Global.mp4?tr=orig-true&updatedAt=1793349070497',
    poster: '/assets/video-posters/vid-sm-2.webp',
    description: 'Elegant product showcase displaying sacred Shree Yantra framed on genuine raw pyrite with ambient temple lighting.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Product Showcase',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'After Effects', icon: 'after-effects' },
    ],
    tags: ['Shree Yantra', 'Raw Pyrite', 'Product Showcase', 'Vedic'],
  },
  {
    id: 'vid-sm-3',
    index: '03',
    title: 'Benefits of Raw Pyrite Bracelet',
    titleLine1: 'Mineral',
    highlightWord: 'ABUNDANCE',
    titleLine2: 'Pyrite Energy.',
    category: 'Product Showcase',
    duration: '00:28',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Social%20Media/ATA%20Store%20June%2007%20Indian.mp4?tr=orig-true&updatedAt=1793349008833',
    poster: '/assets/video-posters/vid-sm-3.webp',
    description: 'High-conversion unboxing and benefits reel showcasing raw pyrite bracelet in velvet presentation packaging.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'E-Commerce Reel',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Pyrite Bracelet', 'E-Commerce', 'Jewelry', 'Short Form'],
  },
  {
    id: 'vid-sm-4',
    index: '04',
    title: 'Raw Pyrite Bracelet — Daily Wear',
    titleLine1: 'Handcrafted',
    highlightWord: 'PROTECTION',
    titleLine2: 'Natural Stones.',
    category: 'Product Showcase',
    duration: '00:30',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Social%20Media/ATA%20Store%20May%206%20Indian.mp4?tr=orig-true&updatedAt=1793349003731',
    poster: '/assets/video-posters/vid-sm-4.webp',
    description: 'Macro focus on pyrite beads demonstrating natural luster and everyday spiritual protection.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Product Reel',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'After Effects', icon: 'after-effects' },
    ],
    tags: ['Pyrite', 'Protection', 'Jewelry', 'Macro Details'],
  },
  {
    id: 'vid-sm-5',
    index: '05',
    title: 'Myths About Gemstones People Believe',
    titleLine1: 'Truth',
    highlightWord: 'UNVEILED',
    titleLine2: 'Gemstone Facts.',
    category: 'Educational',
    duration: '00:32',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Social%20Media/TL%20Jan%2025.mp4?tr=orig-true&updatedAt=1793349001812',
    poster: '/assets/video-posters/vid-sm-5.webp',
    description: 'Viral informational reel debunking common gemstone myths with captivating visual examples.',
    projectInfo: {
      software: { name: 'CapCut', icon: 'capcut' },
      category: 'Educational Short',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Gemstones', 'Myths Debunked', 'Educational', 'Viral Reel'],
  },
  {
    id: 'vid-sm-6',
    index: '06',
    title: 'Special DOB Astrological Analysis',
    titleLine1: 'Destiny',
    highlightWord: 'NUMBERS',
    titleLine2: 'Birth Energy.',
    category: 'Astrology Social',
    duration: '00:30',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Social%20Media/TL%20March%2029.mp4?tr=orig-true&updatedAt=1793348991500',
    poster: '/assets/video-posters/vid-sm-6.webp',
    description: 'High-retention astrology short decoding personality traits based on date of birth patterns.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Social Media',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Numerology', 'DOB', 'Astrology', 'Retention Hook'],
  },
  {
    id: 'vid-sm-7',
    index: '07',
    title: 'An Aries is NOTHING Without These Traits',
    titleLine1: 'Zodiac',
    highlightWord: 'ARIES FIRE',
    titleLine2: 'Core Identity.',
    category: 'Zodiac Series',
    duration: '00:26',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Social%20Media/TL%20Feb%2012.mp4?tr=orig-true&updatedAt=1793348850820',
    poster: '/assets/video-posters/vid-sm-7.webp',
    description: 'Bold dynamic zodiac profile video highlighting the fiery leadership essence of Aries.',
    projectInfo: {
      software: { name: 'After Effects', icon: 'after-effects' },
      category: 'Zodiac Motion',
    },
    softwares: [
      { name: 'After Effects', icon: 'after-effects' },
      { name: 'Premiere Pro', icon: 'premiere-pro' },
    ],
    tags: ['Aries', 'Zodiac Traits', 'Motion Design', 'Fire Energy'],
  },
  {
    id: 'vid-sm-8',
    index: '08',
    title: 'Someone New or Ex Coming Back?',
    titleLine1: 'Tarot',
    highlightWord: 'REVELATION',
    titleLine2: 'Love Energy.',
    category: 'Tarot Reading',
    duration: '00:25',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Social%20Media/TL%20April%2020.mp4?tr=orig-true',
    poster: '/assets/video-posters/vid-sm-8.webp',
    description: 'Emotive relationship tarot visualizer designed for relationship insights and high organic engagement.',
    projectInfo: {
      software: { name: 'CapCut', icon: 'capcut' },
      category: 'Tarot Social',
    },
    softwares: [
      { name: 'CapCut', icon: 'capcut' },
      { name: 'Premiere Pro', icon: 'premiere-pro' },
    ],
    tags: ['Love Tarot', 'Relationships', 'Emotional Hook', 'Short Form'],
  },
  {
    id: 'vid-sm-9',
    index: '09',
    title: 'Vedic Gemstones Solar Power',
    titleLine1: 'Radiant',
    highlightWord: 'SOLAR GLOW',
    titleLine2: 'Vedic Crystals.',
    category: 'Commercial',
    duration: '00:28',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Social%20Media/TL%20JAN%2023.mp4?tr=orig-true',
    poster: '/assets/video-posters/vid-sm-9.webp',
    description: 'Vibrant gemstone promotional cut highlighting planetary alignment and crystal brilliance.',
    projectInfo: {
      software: { name: 'After Effects', icon: 'after-effects' },
      category: 'Commercial',
    },
    softwares: [
      { name: 'After Effects', icon: 'after-effects' },
      { name: 'Premiere Pro', icon: 'premiere-pro' },
    ],
    tags: ['Planetary Gems', 'Solar Power', 'Commercial', 'Vedic'],
  },
  {
    id: 'vid-sm-10',
    index: '10',
    title: 'Cosmic Union — "Who Will Be The One For You?"',
    titleLine1: 'Celestial',
    highlightWord: 'ALIGNMENT',
    titleLine2: 'Divine Match.',
    category: 'Visual Storytelling',
    duration: '00:22',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Social%20Media/ATA%20April%2013.mp4?tr=orig-true',
    poster: '/assets/video-posters/vid-sm-10.webp',
    description: 'Cosmic visual storytelling artwork capturing the celestial harmony of Lord Shiva and Goddess Parvati.',
    projectInfo: {
      software: { name: 'After Effects', icon: 'after-effects' },
      category: 'Motion Graphics',
    },
    softwares: [
      { name: 'After Effects', icon: 'after-effects' },
      { name: 'Premiere Pro', icon: 'premiere-pro' },
    ],
    tags: ['Shiva Parvati', 'Divine Union', 'Cosmic Art', 'Motion Story'],
  },
  {
    id: 'vid-sm-11',
    index: '11',
    title: 'Do This To Increase Abundance At Home',
    titleLine1: 'Vastu',
    highlightWord: 'ABUNDANCE',
    titleLine2: 'Sacred Ritual.',
    category: 'Spiritual Guidance',
    duration: '00:25',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Social%20Media/ATA%20Feb%2013.mp4?tr=orig-true',
    poster: '/assets/video-posters/vid-sm-11.webp',
    description: 'Spiritual home blessing guide highlighting the use of sacred peacock feathers for wealth and peace.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Vastu & Home',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Vastu Shastra', 'Abundance', 'Peacock Feather', 'Spiritual'],
  },
  {
    id: 'vid-sm-12',
    index: '12',
    title: 'How Is Your Life Partner Going To Be Like?',
    titleLine1: 'Soulmate',
    highlightWord: 'DESTINY',
    titleLine2: 'Life Path.',
    category: 'Astrology Series',
    duration: '00:26',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Social%20Media/TL%20April%2007.mp4?tr=orig-true',
    poster: '/assets/video-posters/vid-sm-12.webp',
    description: 'Scenic mountain path visualizer guiding viewers through life partner prediction cues.',
    projectInfo: {
      software: { name: 'CapCut', icon: 'capcut' },
      category: 'Relationship Astrology',
    },
    softwares: [
      { name: 'CapCut', icon: 'capcut' },
      { name: 'Premiere Pro', icon: 'premiere-pro' },
    ],
    tags: ['Soulmate', 'Life Partner', 'Astrology Reel', 'Pacing'],
  },
  {
    id: 'vid-sm-13',
    index: '13',
    title: 'Holika Dahan Ritual for Prosperity',
    titleLine1: 'Sacred',
    highlightWord: 'FIRE RITUAL',
    titleLine2: 'Negative Clearing.',
    category: 'Cultural Ritual',
    duration: '00:24',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Social%20Media/TL%20Mar%2001.mp4?tr=orig-true',
    poster: '/assets/video-posters/vid-sm-13.webp',
    description: 'Atmospheric evening footage of the holy Holika Dahan bonfire with guidance on removing obstacles.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Cultural Celebration',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'After Effects', icon: 'after-effects' },
    ],
    tags: ['Holika Dahan', 'Sacred Fire', 'Prosperity Ritual', 'Indian Culture'],
  },
  {
    id: 'vid-sm-14',
    index: '14',
    title: 'The Shape of a Gemstone is More Powerful',
    titleLine1: 'Sacred',
    highlightWord: 'GEOMETRY',
    titleLine2: 'Gemstone Cuts.',
    category: 'Educational',
    duration: '00:27',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Social%20Media/ATA%20Store%20May%2024%20Indian.mp4?tr=orig-true',
    poster: '/assets/video-posters/vid-sm-14.webp',
    description: 'Editorial guide examining how geometric facet cuts amplify gemstone electromagnetic energy.',
    projectInfo: {
      software: { name: 'After Effects', icon: 'after-effects' },
      category: 'Crystal Science',
    },
    softwares: [
      { name: 'After Effects', icon: 'after-effects' },
      { name: 'Premiere Pro', icon: 'premiere-pro' },
    ],
    tags: ['Gemstone Cuts', 'Sacred Geometry', 'Energy Flow', 'Educational'],
  },
  {
    id: 'vid-sm-15',
    index: '15',
    title: 'Good Friday Reading for a Spiritual Reset',
    titleLine1: 'Mindful',
    highlightWord: 'RESTORATION',
    titleLine2: 'Tarot Spread.',
    category: 'Tarot Reading',
    duration: '00:28',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Social%20Media/TL%20APRIL%2002.mp4?tr=orig-true',
    poster: '/assets/video-posters/vid-sm-15.webp',
    description: 'Serene four-card tarot spread on velvet exploring self-forgiveness and renewal.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Tarot Series',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'After Effects', icon: 'after-effects' },
    ],
    tags: ['Tarot Spread', 'Spiritual Reset', 'Reflection', 'Mindfulness'],
  },
  {
    id: 'vid-sm-16',
    index: '16',
    title: 'How to Wear the Dhan Yog Bracelet',
    titleLine1: 'Wealth',
    highlightWord: 'DHAN YOG',
    titleLine2: 'Proper Wearing.',
    category: 'Product Tutorial',
    duration: '00:29',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Social%20Media/ATA%20Store%20June%2004%20Global.mp4?tr=orig-true',
    poster: '/assets/video-posters/vid-sm-16.webp',
    description: 'Step-by-step unboxing and wearing instructions for the genuine Dhan Yog prosperity bracelet.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Product Tutorial',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Dhan Yog', 'Wearing Instructions', 'Tutorial', 'Jewelry'],
  },
  {
    id: 'vid-sm-17',
    index: '17',
    title: 'Your Luckiest Month in 2026 As Per DOB',
    titleLine1: 'Astrological',
    highlightWord: 'LUCK CYCLE',
    titleLine2: '2026 Forecast.',
    category: 'Astrology Series',
    duration: '00:25',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Social%20Media/TL%20March%2022.mp4?tr=orig-true',
    poster: '/assets/video-posters/vid-sm-17.webp',
    description: 'Interactive pick-a-card astrological forecast predicting prime fortune windows in 2026.',
    projectInfo: {
      software: { name: 'CapCut', icon: 'capcut' },
      category: 'Astrology Social',
    },
    softwares: [
      { name: 'CapCut', icon: 'capcut' },
      { name: 'Premiere Pro', icon: 'premiere-pro' },
    ],
    tags: ['2026 Forecast', 'Pick A Card', 'Astrology', 'Engagement Hook'],
  },
  {
    id: 'vid-sm-18',
    index: '18',
    title: '5 Yantras That Change Your Home Energy',
    titleLine1: 'Sacred',
    highlightWord: 'YANTRAS',
    titleLine2: 'Vedic Energy.',
    category: 'Spiritual Guidance',
    duration: '00:20',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Social%20Media/ATA%20Store%20May%2027%20Indian.mp4?tr=orig-true',
    poster: '/assets/video-posters/vid-sm-18.webp',
    description: 'Detailed showcase of five sacred copper yantras for harmonizing architectural energy.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Home Vastu',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'After Effects', icon: 'after-effects' },
    ],
    tags: ['Vedic Yantras', 'Home Energy', 'Vastu', 'Spiritual Items'],
  },
  {
    id: 'vid-sm-19',
    index: '19',
    title: 'Body Signals That Reveal Your Energy State',
    titleLine1: 'Holistic',
    highlightWord: 'AWARENESS',
    titleLine2: 'Mind-Body Link.',
    category: 'Wellness Guidance',
    duration: '00:24',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Social%20Media/TL%20Feb%2015%20Old.mp4?tr=orig-true',
    poster: '/assets/video-posters/vid-sm-19.webp',
    description: 'Reflective sunset video on interpreting fatigue, intuition, and nervous system energy signals.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Wellness',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Body Signals', 'Energy State', 'Mindfulness', 'Wellness'],
  },
  {
    id: 'vid-sm-20',
    index: '20',
    title: 'What Does Tiger Eye Stone Symbolize?',
    titleLine1: 'Courage',
    highlightWord: 'TIGER EYE',
    titleLine2: 'Inner Strength.',
    category: 'Gemstone Profile',
    duration: '00:23',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Social%20Media/ATA%20Store%20June%2010%20Global.mp4?tr=orig-true',
    poster: '/assets/video-posters/vid-sm-20.webp',
    description: 'Macro focus revealing chatoyancy bands in golden Tiger Eye stone and its protective symbolism.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Crystal Profile',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Tiger Eye', 'Chatoyancy', 'Courage Stone', 'Crystal Meaning'],
  },
  {
    id: 'vid-sm-21',
    index: '21',
    title: 'Your Birth Month & The Goddess You Are Blessed By',
    titleLine1: 'Divine',
    highlightWord: 'BLESSING',
    titleLine2: 'Goddess Grace.',
    category: 'Spiritual Lore',
    duration: '00:26',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Social%20Media/TL%20March%2007.mp4?tr=orig-true',
    poster: '/assets/video-posters/vid-sm-21.webp',
    description: 'Radiant Goddess Lakshmi temple visualizer connecting birth months to divine protective energies.',
    projectInfo: {
      software: { name: 'After Effects', icon: 'after-effects' },
      category: 'Devotional Motion',
    },
    softwares: [
      { name: 'After Effects', icon: 'after-effects' },
      { name: 'Premiere Pro', icon: 'premiere-pro' },
    ],
    tags: ['Goddess Lakshmi', 'Birth Month', 'Devotional Art', 'Spiritual'],
  },
  {
    id: 'vid-sm-22',
    index: '22',
    title: 'POV: Dating The Zodiac Sign Who Puts You First',
    titleLine1: 'Relatable',
    highlightWord: 'DEVOTION',
    titleLine2: 'Zodiac Dating.',
    category: 'Social Comedy',
    duration: '00:28',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Social%20Media/TL%20April%2005.mp4?tr=orig-true',
    poster: '/assets/video-posters/vid-sm-22.webp',
    description: 'Pop culture celebrity couple cut exploring romantic loyalty across astrological zodiac types.',
    projectInfo: {
      software: { name: 'CapCut', icon: 'capcut' },
      category: 'Social Reel',
    },
    softwares: [
      { name: 'CapCut', icon: 'capcut' },
      { name: 'Premiere Pro', icon: 'premiere-pro' },
    ],
    tags: ['POV Reel', 'Zodiac Dating', 'Pop Culture', 'High Engagement'],
  },

  // --- Talking Head & Studio Dialogue (8) ---
  {
    id: 'vid-th-1',
    index: '23',
    title: 'Podcast Dialogue — "Aajkal Sabse Zyada..."',
    titleLine1: 'Studio',
    highlightWord: 'PODCAST',
    titleLine2: 'Modern Issues.',
    category: 'Podcast Edit',
    duration: '00:45',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Talking%20Head%20Video/ATA_AD_Complicated%20love%20life%20Portrait.mp4?tr=orig-true&updatedAt=1793349606451',
    poster: '/assets/video-posters/vid-th-1.webp',
    description: 'Dynamic multi-camera studio podcast edit with balanced audio, animated captions, and snappy dialogue pacing.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Podcast & Dialogue Edit',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'After Effects', icon: 'after-effects' },
    ],
    tags: ['Podcast', 'Multi-Cam', 'Animated Captions', 'Studio Sound'],
  },
  {
    id: 'vid-th-2',
    index: '24',
    title: 'Mindset & Relationships — "Kabhi Kabhi..."',
    titleLine1: 'Intimate',
    highlightWord: 'DIALOGUE',
    titleLine2: 'Emotional Tone.',
    category: 'Interview Edit',
    duration: '00:40',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Talking%20Head%20Video/ATA_AD_badi%20FIght%20Portrait.mp4?tr=orig-true&updatedAt=1793349531317',
    poster: '/assets/video-posters/vid-th-2.webp',
    description: 'Thoughtful studio conversation edit with warm color balance and natural speech rhythms.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Studio Interview',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Interview', 'Relationship Talk', 'Warm Grade', 'Dialogue Pacing'],
  },
  {
    id: 'vid-th-3',
    index: '25',
    title: 'Midnight Reflections — Solitude & City Lights',
    titleLine1: 'Cinematic',
    highlightWord: 'NIGHT MOOD',
    titleLine2: 'B-Roll Narrative.',
    category: 'Cinematic Short',
    duration: '00:34',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Talking%20Head%20Video/2_Portrait.mp4?tr=orig-true&updatedAt=1793349444010',
    poster: '/assets/video-posters/vid-th-3.webp',
    description: 'Cinematic nocturnal visual cut with shallow depth-of-field bokeh and introspective mood grading.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Cinematic Narrative',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'Photoshop', icon: 'photoshop' },
    ],
    tags: ['Cinematic', 'Bokeh', 'Night Mood', 'Color Grading'],
  },
  {
    id: 'vid-th-4',
    index: '26',
    title: 'Life Perspective — "Aksar Log Kehte Hai..."',
    titleLine1: 'Inspiring',
    highlightWord: 'PERSPECTIVE',
    titleLine2: 'Creator Series.',
    category: 'Talking Head',
    duration: '00:38',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Talking%20Head%20Video/ATA_AD_Financial%20Growth%20Portrait.mp4?tr=orig-true&updatedAt=1793349422890',
    poster: '/assets/video-posters/vid-th-4.webp',
    description: 'Studio creator interview focusing on career perseverance, societal pressure, and self-belief.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Creator Content',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'After Effects', icon: 'after-effects' },
    ],
    tags: ['Talking Head', 'Inspiration', 'Studio Cut', 'Audio Mastering'],
  },
  {
    id: 'vid-th-5',
    index: '27',
    title: 'Creative Journey Studio Dialogue',
    titleLine1: 'Creator',
    highlightWord: 'CONVERSATION',
    titleLine2: 'Studio Space.',
    category: 'Podcast Edit',
    duration: '00:32',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Talking%20Head%20Video/22_Portrait.mp4?tr=orig-true&updatedAt=1793349389987',
    poster: '/assets/video-posters/vid-th-5.webp',
    description: 'Engaging young creator podcast clip tailored for YouTube Shorts retention algorithms.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Studio Podcast',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['YouTube Shorts', 'Retention', 'Creator Journey', 'Studio'],
  },
  {
    id: 'vid-th-6',
    index: '28',
    title: 'Personal Branding Consultation Session',
    titleLine1: 'Executive',
    highlightWord: 'INSIGHT',
    titleLine2: 'Direct-To-Camera.',
    category: 'Direct-to-Camera',
    duration: '00:42',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Talking%20Head%20Video/ATA_AD_Communication%20Gap%20(Female%20Testimonial%20)%20Portrait.mp4?tr=orig-true&updatedAt=1793349184424',
    poster: '/assets/video-posters/vid-th-6.webp',
    description: 'Clean professional direct-to-camera presentation with natural office backdrop and sharp typography.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Corporate Video',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Direct To Camera', 'Executive Talk', 'Clean Grade', 'Consulting'],
  },
  {
    id: 'vid-th-7',
    index: '29',
    title: 'Spiritual Well-Being Garden Discussion',
    titleLine1: 'Peaceful',
    highlightWord: 'HARMONY',
    titleLine2: 'Holistic Talk.',
    category: 'Talking Head',
    duration: '00:36',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Talking%20Head%20Video/2nd%20reel%20updatd%20(shaddi%20video%20changed%20).mp4?tr=orig-true&updatedAt=1793348474651',
    poster: '/assets/video-posters/vid-th-7.webp',
    description: 'Relaxed conversational video framed against lush greenery with warm acoustic background mastering.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Wellness Video',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'After Effects', icon: 'after-effects' },
    ],
    tags: ['Greenery Studio', 'Holistic Talk', 'Acoustic Audio', 'Wellness'],
  },
  {
    id: 'vid-th-8',
    index: '30',
    title: 'Professional Career Guidance — Law & Ethics',
    titleLine1: 'Structured',
    highlightWord: 'ADVICE',
    titleLine2: 'Expert Series.',
    category: 'Expert Series',
    duration: '00:30',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Talking%20Head%20Video/3rd%20.mp4?tr=orig-true&updatedAt=1793348612760',
    poster: '/assets/video-posters/vid-th-8.webp',
    description: 'Authoritative studio interview cut in a library setting with concise subtitle animations.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Educational Short',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Expert Series', 'Library Setting', 'Subtitles', 'Professional'],
  },

  // --- UGC Testimonials & Creator Reviews (15) ---
  {
    id: 'vid-ai-1',
    index: '31',
    title: '"The Hardest Part" — Creator Review',
    titleLine1: 'Honest',
    highlightWord: 'FEEDBACK',
    titleLine2: 'Creator Voice.',
    category: 'UGC Review',
    duration: '00:35',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Ai%20Made%20Character%20Video/Agate%20-%20B%20Tarot%20Life%20Store.mp4?tr=orig-true&updatedAt=1793349613861',
    poster: '/assets/video-posters/vid-ai-1.webp',
    description: 'Engaging user-generated creator review sharing authentic thoughts in a home workspace setting.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'UGC Creator Review',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['UGC Review', 'Home Studio', 'Creator Voice', 'Retention'],
  },
  {
    id: 'vid-ai-2',
    index: '32',
    title: '"2 Saal Mein Mera Business..." — Growth Story',
    titleLine1: 'Real',
    highlightWord: 'EXPERIENCE',
    titleLine2: 'Entrepreneur Path.',
    category: 'Testimonial',
    duration: '00:33',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Ai%20Made%20Character%20Video/7%20Mukhi%20Rudraksh%20Bracelet%20-%20A.mp4?tr=orig-true&updatedAt=1793349613766',
    poster: '/assets/video-posters/vid-ai-2.webp',
    description: 'Inspiring personal growth and business journey narrative cut with relatable conversational tone.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Customer Journey',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Testimonial', 'Business Growth', 'Authentic', 'Story'],
  },
  {
    id: 'vid-ai-3',
    index: '33',
    title: '"Honestly I..." — Spiritual Bracelet Experience',
    titleLine1: 'Mindful',
    highlightWord: 'JOURNEY',
    titleLine2: 'Personal Insight.',
    category: 'UGC Review',
    duration: '00:31',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Ai%20Made%20Character%20Video/Rose%20Quartz%20Bracelet%20with%20Buddha%20-%20C.mp4?tr=orig-true&updatedAt=1793349613745',
    poster: '/assets/video-posters/vid-ai-3.webp',
    description: 'Casual direct-to-camera testimonial sharing daily spiritual practices and peace of mind.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'UGC Content',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Mindfulness', 'UGC', 'Spiritual Review', 'Casual'],
  },
  {
    id: 'vid-ai-4',
    index: '34',
    title: '"Business Chal To..." — Entrepreneur Success Story',
    titleLine1: 'Direct',
    highlightWord: 'SUCCESS',
    titleLine2: 'Work Culture.',
    category: 'Testimonial',
    duration: '00:30',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Ai%20Made%20Character%20Video/Citrine%20-%20B.mp4?tr=orig-true&updatedAt=1793349607579',
    poster: '/assets/video-posters/vid-ai-4.webp',
    description: 'Direct office-setting entrepreneurial perspective discussing business expansion and momentum.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Case Study Video',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Entrepreneur', 'Office Setting', 'Case Study', 'Shorts'],
  },
  {
    id: 'vid-ai-5',
    index: '35',
    title: '"I had Been Single..." — Relationship Journey',
    titleLine1: 'Relatable',
    highlightWord: 'REFLECTION',
    titleLine2: 'Life Stage.',
    category: 'UGC Review',
    duration: '00:34',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Ai%20Made%20Character%20Video/Love%20Attraction%20Bracelet%20(Original%20Rose%20Quartz)%20-B%20Tarot%20Store.mp4?tr=orig-true&updatedAt=1793349598486',
    poster: '/assets/video-posters/vid-ai-5.webp',
    description: 'Candid sofa conversation connecting personal love life reflections with lifestyle intention.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Lifestyle UGC',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['UGC Story', 'Candid', 'Relationship Talk', 'Lifestyle'],
  },
  {
    id: 'vid-ai-6',
    index: '36',
    title: '"This Is Going..." — Product Unboxing at Cafe',
    titleLine1: 'Modern',
    highlightWord: 'CAFE VIBE',
    titleLine2: 'Product Intro.',
    category: 'Product Review',
    duration: '00:29',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Ai%20Made%20Character%20Video/Fire%20Opal%20-%20C%20Tarot%20Life%20Store.mp4?tr=orig-true&updatedAt=1793349554018',
    poster: '/assets/video-posters/vid-ai-6.webp',
    description: 'Energetic coffee shop unboxing reel emphasizing spontaneous product excitement.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Product Unboxing',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Cafe Setting', 'Unboxing', 'Lifestyle Product', 'Reels'],
  },
  {
    id: 'vid-ai-7',
    index: '37',
    title: '"Okay So People..." — Daily Fitness Routine',
    titleLine1: 'Active',
    highlightWord: 'MOMENTUM',
    titleLine2: 'Daily Habits.',
    category: 'Fitness Lifestyle',
    duration: '00:35',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Ai%20Made%20Character%20Video/7%20Chakra%20Bracelet%20-%20A.mp4?tr=orig-true&updatedAt=1793349545929',
    poster: '/assets/video-posters/vid-ai-7.webp',
    description: 'Gym floor mirror video combining fitness discipline with mental clarity rituals.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Fitness Social',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Gym Routine', 'Fitness', 'Mirror Selfie', 'Daily Discipline'],
  },
  {
    id: 'vid-ai-8',
    index: '38',
    title: 'Professional Corporate Experience & Well-Being',
    titleLine1: 'Workplace',
    highlightWord: 'BALANCE',
    titleLine2: 'Executive Life.',
    category: 'Corporate UGC',
    duration: '00:31',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Ai%20Made%20Character%20Video/Agate%20-%20A%20Tarot%20Life%20Store.mp4?tr=orig-true&updatedAt=1793349542991',
    poster: '/assets/video-posters/vid-ai-8.webp',
    description: 'Desk-side executive reflection on stress reduction, focus, and workday balance.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Executive Well-Being',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Corporate', 'Desk Side', 'Stress Relief', 'Focus'],
  },
  {
    id: 'vid-ai-9',
    index: '39',
    title: '"Honestly, Mujhe Kafi Time Se..." — Astrological Journey',
    titleLine1: 'Personal',
    highlightWord: 'JOURNEY',
    titleLine2: 'Hindi Review.',
    category: 'Testimonial',
    duration: '00:36',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Ai%20Made%20Character%20Video/Nepal%20Origin%205%20Mukhi%20Rudraksha%20-%20B.mp4?tr=orig-true&updatedAt=1793349520553',
    poster: '/assets/video-posters/vid-ai-9.webp',
    description: 'Heartfelt Hindi language testimonial detailing long-term positive astrological impact.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Hindi Testimonial',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'Photoshop', icon: 'photoshop' },
    ],
    tags: ['Hindi Testimonial', 'Astrological Journey', 'Studio Mic', 'Real Voice'],
  },
  {
    id: 'vid-ai-10',
    index: '40',
    title: 'Freelance Workflow & Client Journey',
    titleLine1: 'Creative',
    highlightWord: 'WORKFLOW',
    titleLine2: 'Home Office.',
    category: 'Creator Lifestyle',
    duration: '00:33',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Ai%20Made%20Character%20Video/Dhan%20Yog%20Bracelet%20-%20B%20Tarot%20Life%20Store.mp4?tr=orig-true&updatedAt=1793349494317',
    poster: '/assets/video-posters/vid-ai-10.webp',
    description: 'Creative professional sharing daily balance practices with MacBook and crystal tools.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Creator Lifestyle',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Freelance', 'Workflow', 'MacBook', 'Creator Lifestyle'],
  },
  {
    id: 'vid-ai-11',
    index: '41',
    title: '"Kuch Time Se Main..." — Cosmic Vibes Lifestyle',
    titleLine1: 'Youth',
    highlightWord: 'LIFESTYLE',
    titleLine2: 'Vedic Habits.',
    category: 'UGC Review',
    duration: '00:32',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Ai%20Made%20Character%20Video/Amethyst%20bracelet%20-%20C.mp4?tr=orig-true&updatedAt=1793349253246',
    poster: '/assets/video-posters/vid-ai-11.webp',
    description: 'Young creator sharing personal experience with Amethyst crystal bracelets for mental calm.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'UGC Review',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Youth', 'Cosmic Vibes', 'Amethyst', 'Mental Calm'],
  },
  {
    id: 'vid-ai-12',
    index: '42',
    title: 'Sacred Pyramid Placement & Energy Flow',
    titleLine1: 'Vedic',
    highlightWord: 'PYRAMID',
    titleLine2: 'Home Placement.',
    category: 'Spiritual Guide',
    duration: '00:35',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Ai%20Made%20Character%20Video/Love%20Attraction%20Pyramid%20-%20B.mp4?tr=orig-true&updatedAt=1793349558524',
    poster: '/assets/video-posters/vid-ai-12.webp',
    description: 'Spiritual practitioner demonstrating proper rose quartz pyramid orientation for heart harmony.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Spiritual Guide',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'After Effects', icon: 'after-effects' },
    ],
    tags: ['Rose Quartz Pyramid', 'Energy Placement', 'Vedic Guide', 'Harmony'],
  },
  {
    id: 'vid-ai-13',
    index: '43',
    title: '"Working Night Shifts..." — Healthcare Routine',
    titleLine1: 'Frontline',
    highlightWord: 'RESILIENCE',
    titleLine2: 'Night Shifts.',
    category: 'Healthcare UGC',
    duration: '00:30',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Ai%20Made%20Character%20Video/Rose%20Quartz%20Bracelet%20Female%20-%20C.mp4?tr=orig-true&updatedAt=1793349579518',
    poster: '/assets/video-posters/vid-ai-13.webp',
    description: 'Nurse in scrubs discussing emotional grounding and energy protection during demanding hospital night shifts.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Healthcare UGC',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Healthcare', 'Night Shifts', 'Nurse', 'Grounding'],
  },
  {
    id: 'vid-ai-14',
    index: '44',
    title: 'Executive Routine & Energy Protection',
    titleLine1: 'Graceful',
    highlightWord: 'EXCELLENCE',
    titleLine2: 'Daily Focus.',
    category: 'Corporate Well-Being',
    duration: '00:29',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Ai%20Made%20Character%20Video/Fire%20Opal%20-%20B%20Tarot%20Life%20Store.mp4?tr=orig-true&updatedAt=1793349555175',
    poster: '/assets/video-posters/vid-ai-14.webp',
    description: 'Sophisticated interior presentation addressing leadership presence, calm, and gemstone focus.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Corporate Leadership',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'After Effects', icon: 'after-effects' },
    ],
    tags: ['Leadership', 'Corporate', 'Presence', 'Fire Opal'],
  },
  {
    id: 'vid-ai-15',
    index: '45',
    title: '"I Have To..." — Creative Agency Insights',
    titleLine1: 'Strategic',
    highlightWord: 'CREATIVE',
    titleLine2: 'Agency Life.',
    category: 'Creative Industry',
    duration: '00:28',
    videoUrl: 'https://ik.imagekit.io/arpitsContent/Ai%20Made%20Character%20Video/Fire%20Opal%20-%20A.mp4?tr=orig-true&updatedAt=1793349579719',
    poster: '/assets/video-posters/vid-ai-15.webp',
    description: 'Agency director discussing brand communication, emotional resonance, and visual design standards.',
    projectInfo: {
      software: { name: 'Premiere Pro', icon: 'premiere-pro' },
      category: 'Creative Industry',
    },
    softwares: [
      { name: 'Premiere Pro', icon: 'premiere-pro' },
      { name: 'CapCut', icon: 'capcut' },
    ],
    tags: ['Creative Agency', 'Design Direction', 'Interview', 'Brand'],
  },
];

// Curated homepage selection (5 diverse flagship commercial & motion productions)
export const featuredVideos: FeaturedVideo[] = [
  { ...allFeaturedVideos.find((v) => v.id === 'vid-sm-1')!, index: '01' },
  { ...allFeaturedVideos.find((v) => v.id === 'vid-th-1')!, index: '02' },
  { ...allFeaturedVideos.find((v) => v.id === 'vid-sm-2')!, index: '03' },
  { ...allFeaturedVideos.find((v) => v.id === 'vid-th-2')!, index: '04' },
  { ...allFeaturedVideos.find((v) => v.id === 'vid-sm-10')!, index: '05' },
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
    title: 'The Third Party Spread',
    image: 'https://ik.imagekit.io/arpitsContent/Stories%20and%20Thumbnails/March_23%20Story.webp?updatedAt=1793347024389',
    thumbnail: 'https://ik.imagekit.io/arpitsContent/Stories%20and%20Thumbnails/March_23%20Story.webp?updatedAt=1793347024389',
    category: 'Tarot Spread Artwork',
  },
  {
    id: 'story-02',
    index: '02',
    title: "Valentine's Day Predictions",
    image: 'https://ik.imagekit.io/arpitsContent/Stories%20and%20Thumbnails/14%20Feb%20Story.webp?updatedAt=1793347000668',
    thumbnail: 'https://ik.imagekit.io/arpitsContent/Stories%20and%20Thumbnails/14%20Feb%20Story.webp?updatedAt=1793347000668',
    category: 'Holiday Campaign',
  },
  {
    id: 'story-03',
    index: '03',
    title: 'A Hug Full of Love',
    image: 'https://ik.imagekit.io/arpitsContent/Stories%20and%20Thumbnails/12%20Feb%20Story.webp?updatedAt=1793347000313',
    thumbnail: 'https://ik.imagekit.io/arpitsContent/Stories%20and%20Thumbnails/12%20Feb%20Story.webp?updatedAt=1793347000313',
    category: 'Lifestyle Editorial',
  },
  {
    id: 'story-04',
    index: '04',
    title: 'Your Luckiest Month In 2026',
    image: 'https://ik.imagekit.io/arpitsContent/Stories%20and%20Thumbnails/22_March.webp?updatedAt=1793346995507',
    thumbnail: 'https://ik.imagekit.io/arpitsContent/Stories%20and%20Thumbnails/22_March.webp?updatedAt=1793346995507',
    category: 'Astrology Social Story',
  },
  {
    id: 'story-05',
    index: '05',
    title: 'Is Your Connection Healing or Hurting?',
    image: 'https://ik.imagekit.io/arpitsContent/Stories%20and%20Thumbnails/March_22.webp?updatedAt=1793346992655',
    thumbnail: 'https://ik.imagekit.io/arpitsContent/Stories%20and%20Thumbnails/March_22.webp?updatedAt=1793346992655',
    category: 'Relationship Guidance',
  },
];

// Curated homepage selection (All 5 verified story posters)
const curatedStoryIds = [
  'story-01',
  'story-02',
  'story-03',
  'story-04',
  'story-05',
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
    image: '/assets/Post/Post (1).png',
    title: 'Why Ruby Is Best — Royal Gem',
    aspectRatio: 0.8,
    category: 'Jewelry Campaign',
  },
  {
    id: 'post-02',
    image: '/assets/Post/Post (2).png',
    title: 'Ruby Power & Confidence',
    aspectRatio: 0.8,
    category: 'Product Showcase',
  },
  {
    id: 'post-03',
    image: '/assets/Post/Post (3).png',
    title: 'Why Ruby Is Best — Oval Ring',
    aspectRatio: 0.8,
    category: 'Luxury Brand',
  },
  {
    id: 'post-04',
    image: '/assets/Post/Post (4).png',
    title: 'Strengthens The Sun — Cushion Ruby',
    aspectRatio: 0.8,
    category: 'Editorial',
  },
  {
    id: 'post-05',
    image: '/assets/Post/Post (5).png',
    title: 'Ruby Headline & Gold Halo Ring',
    aspectRatio: 0.8,
    category: 'Campaign Post',
  },
  {
    id: 'post-06',
    image: '/assets/Post/Post (6).png',
    title: 'Attracts Success & Fame — Halo Ring',
    aspectRatio: 0.8,
    category: 'Typography Post',
  },
  {
    id: 'post-07',
    image: '/assets/Post/Post (7).png',
    title: 'Sun Power & Leadership — Oval Gem',
    aspectRatio: 0.8,
    category: 'Jewelry Design',
  },
  {
    id: 'post-08',
    image: '/assets/Post/Post (8).png',
    title: 'Ruby Cushion Halo Heritage Setting',
    aspectRatio: 0.8,
    category: 'Product Showcase',
  },
  {
    id: 'post-09',
    image: '/assets/Post/Post (9).png',
    title: 'Vitality & Strength — Ruby Cushion',
    aspectRatio: 0.8,
    category: 'Luxury Brand',
  },
  {
    id: 'post-10',
    image: '/assets/Post/Post (10).png',
    title: 'Warm Luxury Maroon Ruby Layout',
    aspectRatio: 0.8,
    category: 'Editorial',
  },
  {
    id: 'post-11',
    image: '/assets/Post/Post (11).png',
    title: 'Ruby Stone of Power & Confidence',
    aspectRatio: 0.8,
    category: 'Campaign Post',
  },
  {
    id: 'post-12',
    image: '/assets/Post/Post (12).png',
    title: 'Ruby Cushion Minimal Elegance',
    aspectRatio: 0.8,
    category: 'Jewelry Design',
  },
  {
    id: 'post-13',
    image: '/assets/Post/Post (13).png',
    title: 'Wealth Money Maker — Tiger Eye',
    aspectRatio: 0.8,
    category: 'Product Showcase',
  },
  {
    id: 'post-14',
    image: '/assets/Post/Post (14).png',
    title: 'Mayur Peacock Heritage Ring — Red Velvet',
    aspectRatio: 0.8,
    category: 'Luxury Brand',
  },
  {
    id: 'post-15',
    image: '/assets/Post/Post (15).png',
    title: 'Mayur Peacock Ring — Emerald & Gold',
    aspectRatio: 0.8,
    category: 'Luxury Brand',
  },
  {
    id: 'post-16',
    image: '/assets/Post/Post (16).png',
    title: 'Metal Dhan Yog Bracelet — Architectural',
    aspectRatio: 0.8,
    category: 'Campaign Post',
  },
  {
    id: 'post-17',
    image: '/assets/Post/Post (17).png',
    title: 'Metal Dhan Yog Bracelet — Abundance',
    aspectRatio: 0.8,
    category: 'Product Showcase',
  },
  {
    id: 'post-18',
    image: '/assets/Post/Post (18).png',
    title: 'Metal Dhan Yog Bracelet — Silk Drape',
    aspectRatio: 0.8,
    category: 'Editorial',
  },
  {
    id: 'post-19',
    image: '/assets/Post/Post (19).png',
    title: 'Metal Dhan Yog Bracelet — Modern Angle',
    aspectRatio: 0.8,
    category: 'Product Showcase',
  },
  {
    id: 'post-20',
    image: '/assets/Post/Post (20).png',
    title: 'Metal Dhan Yog Bracelet — Dark Velvet',
    aspectRatio: 0.8,
    category: 'Luxury Brand',
  },
  {
    id: 'post-21',
    image: '/assets/Post/Post (21).png',
    title: 'Citrine Bracelet — Stone of Abundance',
    aspectRatio: 0.8,
    category: 'Jewelry Design',
  },
  {
    id: 'post-22',
    image: '/assets/Post/Post (22).png',
    title: 'Citrine Bracelet — Warm Ochre Layout',
    aspectRatio: 0.8,
    category: 'Campaign Post',
  },
  {
    id: 'post-23',
    image: '/assets/Post/Post (23).png',
    title: 'Citrine Bracelet — Positive Energy',
    aspectRatio: 0.8,
    category: 'Product Showcase',
  },
  {
    id: 'post-24',
    image: '/assets/Post/Post (24).png',
    title: 'Citrine Bracelet — Jupiter Stone',
    aspectRatio: 0.8,
    category: 'Editorial',
  },
  {
    id: 'post-25',
    image: '/assets/Post/Post (25).png',
    title: 'Citrine Bracelet — Soft Studio Glow',
    aspectRatio: 0.8,
    category: 'Product Showcase',
  },
  {
    id: 'post-26',
    image: '/assets/Post/Post (26).png',
    title: 'Citrine Bracelet — Warm Sunlight',
    aspectRatio: 0.8,
    category: 'Campaign Post',
  },
  {
    id: 'post-27',
    image: '/assets/Post/Post (27).png',
    title: 'Citrine Bracelet — Golden Facet Beads',
    aspectRatio: 0.8,
    category: 'Luxury Brand',
  },
  {
    id: 'post-28',
    image: '/assets/Post/Post (28).png',
    title: 'Citrine Bracelet — Stone Podium',
    aspectRatio: 0.8,
    category: 'Jewelry Design',
  },
  {
    id: 'post-29',
    image: '/assets/Post/Post (29).png',
    title: 'Citrine Bracelet — Amber Tone Spread',
    aspectRatio: 0.8,
    category: 'Editorial',
  },
  {
    id: 'post-30',
    image: '/assets/Post/Post (30).png',
    title: 'Citrine Bracelet — Minimal Pedestal',
    aspectRatio: 0.8,
    category: 'Product Showcase',
  },
  {
    id: 'post-31',
    image: '/assets/Post/Post (31).png',
    title: 'Citrine Bracelet — Desert Horizon',
    aspectRatio: 0.8,
    category: 'Campaign Post',
  },
  {
    id: 'post-32',
    image: '/assets/Post/Post (32).png',
    title: 'Citrine Bracelet — Hanging Crystal',
    aspectRatio: 0.8,
    category: 'Luxury Brand',
  },
  {
    id: 'post-33',
    image: '/assets/Post/Post (33).png',
    title: 'Citrine Bracelet — Dramatic Shadow',
    aspectRatio: 0.8,
    category: 'Editorial',
  },
  {
    id: 'post-34',
    image: '/assets/Post/Post (34).png',
    title: 'Citrine Bracelet — Dark Studio Podium',
    aspectRatio: 0.8,
    category: 'Jewelry Design',
  },
  {
    id: 'post-35',
    image: '/assets/Post/Post (35).png',
    title: 'Citrine Bracelet — Clean Black Background',
    aspectRatio: 0.8,
    category: 'Product Showcase',
  },
  {
    id: 'post-36',
    image: '/assets/Post/Post (36).png',
    title: 'Every Detail Amethyst — Wrist Style',
    aspectRatio: 0.8,
    category: 'Fashion Editorial',
  },
  {
    id: 'post-37',
    image: '/assets/Post/Post (37).png',
    title: 'Pure Amethyst — Water Reflections',
    aspectRatio: 0.8,
    category: 'Luxury Brand',
  },
  {
    id: 'post-38',
    image: '/assets/Post/Post (38).png',
    title: 'The Power of Amethyst — Deep Water',
    aspectRatio: 0.8,
    category: 'Editorial',
  },
  {
    id: 'post-39',
    image: '/assets/Post/Post (39).png',
    title: 'Rose Quartz Bracelet with Buddha',
    aspectRatio: 0.8,
    category: 'Spiritual Design',
  },
  {
    id: 'post-40',
    image: '/assets/Post/Post (40).png',
    title: 'Money Maker Bracelet — Right Wrist',
    aspectRatio: 0.8,
    category: 'Product Showcase',
  },
  {
    id: 'post-41',
    image: '/assets/Post/Post (41).png',
    title: 'Rose Quartz Bracelet — Vintage Editorial',
    aspectRatio: 0.8,
    category: 'Editorial',
  },
  {
    id: 'post-42',
    image: '/assets/Post/Post (42).png',
    title: 'Rose Quartz Bracelet — Cream Aesthetic',
    aspectRatio: 0.8,
    category: 'Jewelry Design',
  },
  {
    id: 'post-43',
    image: '/assets/Post/Post (43).png',
    title: 'Love Attraction Bracelet Gift Box',
    aspectRatio: 0.8,
    category: 'Luxury Brand',
  },
  {
    id: 'post-44',
    image: '/assets/Post/Post (44).png',
    title: 'Rose Quartz Buddha Bracelet — Warm Red',
    aspectRatio: 0.8,
    category: 'Campaign Post',
  },
  {
    id: 'post-45',
    image: '/assets/Post/Post (45).png',
    title: 'Monster Energy Zero Ultra — Grunge Editorial',
    aspectRatio: 0.8,
    category: 'Urban Streetwear',
  },
  {
    id: 'post-46',
    image: '/assets/Post/Post (46).png',
    title: 'Bracelet Wikipedia — Artisan Editorial',
    aspectRatio: 0.8,
    category: 'Editorial',
  },
  {
    id: 'post-47',
    image: '/assets/Post/Post (47).png',
    title: 'Rose Quartz Buddha — Lifestyle Flat Lay',
    aspectRatio: 0.8,
    category: 'Spiritual Design',
  },
  {
    id: 'post-48',
    image: '/assets/Post/Post (48).png',
    title: 'Monster Energy Zero Ultra — Comic Ink Art',
    aspectRatio: 0.8,
    category: 'Graphic Poster',
  },
];

// Curated homepage selection (6 diverse flagship creative campaigns)
const curatedCreativeIds = [
  'post-01', // Ruby Royal Luxury Campaign (Post 1)
  'post-14', // Mayur Peacock Heritage Ring (Post 14)
  'post-16', // Metal Dhan Yog Bracelet (Post 16)
  'post-22', // Citrine Abundance Bracelet (Post 22)
  'post-38', // The Power of Amethyst (Post 38)
  'post-48', // Monster Energy Zero Ultra (Post 48)
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
    image: '/assets/Thumbnails/1 (1).png',
    thumbnail: '/assets/Thumbnails/1 (1).png',
    category: 'Gaming',
    views: '1.4M',
    aspectRatio: 16 / 9,
  },
  {
    id: 'yt-2',
    index: '02',
    title: "BGMI Update 3.5 — Let's Explore",
    image: '/assets/Thumbnails/1 (1).avif',
    thumbnail: '/assets/Thumbnails/1 (1).avif',
    category: 'Gaming',
    views: '890K',
    aspectRatio: 16 / 9,
  },
  {
    id: 'yt-3',
    index: '03',
    title: 'History of Enzo Ferrari',
    image: '/assets/Thumbnails/1 (3).avif',
    thumbnail: '/assets/Thumbnails/1 (3).avif',
    category: 'Documentary',
    views: '2.1M',
    aspectRatio: 16 / 9,
  },
  {
    id: 'yt-4',
    index: '04',
    title: 'The Rise of Artificial Intelligence',
    image: '/assets/Thumbnails/1 (2).avif',
    thumbnail: '/assets/Thumbnails/1 (2).avif',
    category: 'Tech',
    views: '1.8M',
    aspectRatio: 16 / 9,
  },
  {
    id: 'yt-5',
    index: '05',
    title: 'BGMI Andha Rush Gameplay',
    image: '/assets/Thumbnails/1 (8).avif',
    thumbnail: '/assets/Thumbnails/1 (8).avif',
    category: 'Gaming',
    views: '760K',
    aspectRatio: 16 / 9,
  },
  {
    id: 'yt-6',
    index: '06',
    title: 'BGMI Live — Reddify Is Live',
    image: '/assets/Thumbnails/1 (6).avif',
    thumbnail: '/assets/Thumbnails/1 (6).avif',
    category: 'Gaming',
    views: '950K',
    aspectRatio: 16 / 9,
  },
  {
    id: 'yt-7',
    index: '07',
    title: 'Free Fire 1 vs 1 Guild Test',
    image: '/assets/Thumbnails/1 (4).avif',
    thumbnail: '/assets/Thumbnails/1 (4).avif',
    category: 'Gaming',
    views: '1.2M',
    aspectRatio: 16 / 9,
  },
  {
    id: 'yt-8',
    index: '08',
    title: 'BGMI Best Assault Player',
    image: '/assets/Thumbnails/1 (11).avif',
    thumbnail: '/assets/Thumbnails/1 (11).avif',
    category: 'Gaming',
    views: '620K',
    aspectRatio: 16 / 9,
  },
  {
    id: 'yt-9',
    index: '09',
    title: 'Become a Graphic Designer — Complete Roadmap',
    image: '/assets/Thumbnails/1 (5).avif',
    thumbnail: '/assets/Thumbnails/1 (5).avif',
    category: 'Tutorial',
    views: '1.1M',
    aspectRatio: 16 / 9,
  },
  {
    id: 'yt-10',
    index: '10',
    title: 'My First Montage — Moody Arpit Gaming',
    image: '/assets/Thumbnails/1 (7).avif',
    thumbnail: '/assets/Thumbnails/1 (7).avif',
    category: 'Gaming',
    views: '850K',
    aspectRatio: 16 / 9,
  },
  {
    id: 'yt-11',
    index: '11',
    title: 'YouTube Growth Secret — 100 to 1.5M Views',
    image: '/assets/Thumbnails/1 (9).avif',
    thumbnail: '/assets/Thumbnails/1 (9).avif',
    category: 'Tech',
    views: '1.5M',
    aspectRatio: 16 / 9,
  },
  {
    id: 'yt-12',
    index: '12',
    title: 'Intraday Trading Strategy — Daily Profit',
    image: '/assets/Thumbnails/1 (12).avif',
    thumbnail: '/assets/Thumbnails/1 (12).avif',
    category: 'Finance',
    views: '920K',
    aspectRatio: 16 / 9,
  },
  {
    id: 'yt-13',
    index: '13',
    title: '1v1 M416 Challenge — Arpit Karan',
    image: '/assets/Thumbnails/1 (13).avif',
    thumbnail: '/assets/Thumbnails/1 (13).avif',
    category: 'Gaming',
    views: '680K',
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
    description: 'Client-side image compression tool supporting WebP, AVIF, JPEG, and PNG formats. Features target file size and percentage compression options, live preview, and fast in-browser processing using HTML5 Canvas API without server uploads.',
    previewImage: 'https://ik.imagekit.io/arpitsContent/Ui-UX/imagemint.webp?updatedAt=1793347339567',
    tallPreviewImage: 'https://ik.imagekit.io/arpitsContent/Ui-UX/imagemint-tall.webp?updatedAt=1793347346027',
    hasLivePreview: false,
    tools: ['React', 'TypeScript', 'Tailwind CSS', 'HTML5 Canvas API'],
    featured: true,
    caseStudy: {
      year: '2024',
      role: 'UI/UX Design & Frontend Development',
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
          image: 'https://ik.imagekit.io/arpitsContent/Ui-UX/imagemint.webp?updatedAt=1793347339567',
          layout: 'hero-wide',
        },
        {
          title: 'Precision Parameter Inspector',
          description: 'Side panel with format selector (WebP, AVIF, PNG), resolution presets, and lossless toggles.',
          image: 'https://ik.imagekit.io/arpitsContent/Ui-UX/imagemint-tall.webp?updatedAt=1793347346027',
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
        previewImage: 'https://ik.imagekit.io/arpitsContent/Ui-UX/imagemint.webp?updatedAt=1793347339567',
        tallImage: 'https://ik.imagekit.io/arpitsContent/Ui-UX/imagemint-tall.webp?updatedAt=1793347346027',
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
    id: 'proj-open-compress',
    slug: 'open-compress',
    index: '02',
    title: 'Open Compress',
    type: 'webapp',
    category: 'Desktop Application / Tool',
    categoryLabel: 'DESKTOP APPLICATION & TOOL',
    url: '',
    description:
      'Cross-platform desktop video compression application built with Tauri and FFmpeg. Supports 14 video formats, custom target size in MB, percentage reduction, resolution scaling, video trimming, and hardware-accelerated encoding with real-time progress.',
    previewImage: 'https://ik.imagekit.io/arpitsContent/Ui-UX/open-compress.webp?updatedAt=1793347327171',
    tallPreviewImage: 'https://ik.imagekit.io/arpitsContent/Ui-UX/open-compress-tall.webp?updatedAt=1793347330095',
    hasLivePreview: false,
    tools: ['Tauri', 'Rust', 'React', 'TypeScript', 'Tailwind CSS', 'FFmpeg'],
    featured: true,
    caseStudy: {
      year: '2025',
      role: 'UI/UX Design & Product Development',
      services: ['Desktop Interface Design', 'Systems Architecture', 'Transcoding Engine'],
      summary:
        'A high-performance offline desktop video compression suite built with Tauri and FFmpeg for private, hardware-accelerated media reduction.',
      overview: {
        context:
          'Open Compress was designed and developed to provide creators, videographers, and editors with a private, zero-subscription desktop utility to shrink multi-gigabyte video files without cloud uploads or restrictive file size limits.',
        statement:
          'Private, hardware-accelerated desktop video compression with precision target-size control.',
        stats: [
          { label: 'Supported Video Formats', value: '14 Formats' },
          { label: 'Cloud Upload Overhead', value: '0 Bytes' },
          { label: 'Compression Target Precision', value: 'Exact MB' },
        ],
      },
      challenge: {
        problem:
          'Traditional online compressors enforce strict upload limits, sacrifice confidentiality, and introduce network delays, while standard command-line FFmpeg workflows present an intimidating barrier for visual creators.',
        keyPoints: [
          'Absolute local privacy: High-resolution client video footage never leaves the machine.',
          'Predictable target sizing: Compressing video files to fit precise email or upload caps without trial and error.',
          'Hardware-accelerated performance: Harnessing local GPU encoders for rapid processing without system lag.',
        ],
      },
      goal: {
        objective:
          'Engineer an ergonomic desktop application that combines deep FFmpeg power with an intuitive, modern visual interface for instant batch compression.',
        deliverables: [
          'Compact, low-resource desktop app powered by Tauri v2 and Rust',
          'Dual compression modes: Target File Size (MB) and Percentage Reduction',
          'Interactive video trimmer and multi-format batch queue',
          'Real-time frame-by-frame progress tracking and instant OS file reveal',
        ],
      },
      approach: {
        philosophy:
          'Precision utility wrapped in dark, focused aesthetics. The workspace provides clear visual telemetry, format pills, and slider controls tailored for editing workflows.',
        steps: [
          {
            number: '01',
            title: 'Native Tauri & Rust Architecture',
            description:
              'Leveraged Tauri v2 with asynchronous Rust commands to manage background FFmpeg child processes with minimal memory footprint.',
          },
          {
            number: '02',
            title: 'Dynamic Bitrate Calculation Engine',
            description:
              'Engineered mathematical bitrate algorithms that compute precise video and audio allocations based on video duration to hit target megabyte limits accurately.',
          },
          {
            number: '03',
            title: 'Creator-Centric Queue Controls',
            description:
              'Built an intuitive drag-and-drop batch queue featuring inline trim sliders, resolution downscaling presets, and one-click destination directory reveal.',
          },
        ],
      },
      designSystem: {
        headingFont: 'Playfair Display (Commanding Serif)',
        bodyFont: 'Sora (Clean Technical Sans)',
        notes:
          'Deep graphite surfaces (#0F1117) with refined violet accents (#6366F1) and emerald status badges (#10B981) indicating completed jobs.',
        palette: [
          { name: 'Dark Slate', hex: '#0F1117', role: 'Main Canvas Ground' },
          { name: 'Electric Indigo', hex: '#6366F1', role: 'Active Controls & Progress' },
          { name: 'Emerald Mint', hex: '#10B981', role: 'Success Telemetry' },
          { name: 'Pure White', hex: '#F9FAFB', role: 'Headlines & Metrics' },
        ],
      },
      keyScreens: [
        {
          title: 'Batch Compression Studio',
          description:
            'Main desktop staging area featuring the drag-and-drop queue, format selector, and target size controls.',
          image: 'https://ik.imagekit.io/arpitsContent/Ui-UX/open-compress.webp?updatedAt=1793347327171',
          layout: 'hero-wide',
        },
        {
          title: 'Detailed Video Parameter Inspector',
          description:
            'Per-video configuration panel with custom resolution presets, audio bitrate toggles, and frame-accurate trimming.',
          image: 'https://ik.imagekit.io/arpitsContent/Ui-UX/open-compress-tall.webp?updatedAt=1793347330095',
          layout: 'split-detail',
        },
      ],
      interactions: {
        uxThinking:
          'Focused on immediate clarity during heavy transcoding tasks: smooth progress bars, estimated time remaining, and instant OS folder reveal.',
        features: [
          {
            title: 'Target File Size Slider',
            detail:
              'Set exact desired file size in MB; FFmpeg calculates ideal video and audio bitrates dynamically.',
          },
          {
            title: 'Interactive Video Trimmer',
            detail:
              'Clip start and end timestamps visually to transcode only desired video segments.',
          },
          {
            title: 'One-Click File Reveal',
            detail:
              'Instantly reveals compressed media in Windows Explorer or macOS Finder when processing completes.',
          },
        ],
      },
      finalExperience: {
        overview:
          'An indispensable, privacy-preserving desktop companion that gives video editors complete control over output sizes with desktop-native responsiveness.',
        previewImage: 'https://ik.imagekit.io/arpitsContent/Ui-UX/open-compress.webp?updatedAt=1793347327171',
        tallImage: 'https://ik.imagekit.io/arpitsContent/Ui-UX/open-compress-tall.webp?updatedAt=1793347330095',
      },
      techStack: [
        {
          category: 'Native Application & Frontend',
          items: [
            'Tauri v2',
            'Rust',
            'React 18',
            'TypeScript',
            'Tailwind CSS',
            'Zustand',
            'FFmpeg',
            'HTML5 Video API',
          ],
        },
      ],
      outcome: {
        summary:
          'Open Compress demonstrates that cross-platform desktop applications can provide native desktop performance, instant startup, and tiny resource overhead using Tauri and modern web technologies.',
        impactTakeaway:
          '100% offline privacy, sub-30MB executable footprint, and reliable hardware-accelerated video compression.',
      },
    },
  },
  {
    id: 'proj-arpit-designs-net',
    slug: 'arpit-designs',
    index: '04',
    title: 'ARPIT DESIGNS',
    type: 'website',
    category: 'Website / Portfolio',
    categoryLabel: 'WEBSITE / PORTFOLIO',
    url: 'https://creative-arpit.netlify.app/',
    description: 'Previous portfolio created with Antigravity featuring immersive creative editorial showcases and motion.',
    previewImage: 'https://ik.imagekit.io/arpitsContent/Ui-UX/arpit-portfolio.webp?updatedAt=1793347395411',
    tallPreviewImage: 'https://ik.imagekit.io/arpitsContent/Ui-UX/arpit-tall.webp?updatedAt=1793347440283',
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
          image: 'https://ik.imagekit.io/arpitsContent/Ui-UX/arpit-portfolio.webp?updatedAt=1793347395411',
          layout: 'hero-wide',
        },
        {
          title: 'Curated Project Gallery',
          description: 'Editorial cards presenting client collaborations with high-contrast metadata.',
          image: 'https://ik.imagekit.io/arpitsContent/Ui-UX/arpit-tall.webp?updatedAt=1793347440283',
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
        previewImage: 'https://ik.imagekit.io/arpitsContent/Ui-UX/arpit-portfolio.webp?updatedAt=1793347395411',
        tallImage: 'https://ik.imagekit.io/arpitsContent/Ui-UX/arpit-tall.webp?updatedAt=1793347440283',
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
    description: 'Personal developer portfolio website featuring a dark theme, 3D card tilt effects, custom cursor interactions, responsive layout, and Framer CMS integration for project management.',
    previewImage: 'https://ik.imagekit.io/arpitsContent/Ui-UX/yogesh-portfolio.webp?updatedAt=1793347367563',
    tallPreviewImage: 'https://ik.imagekit.io/arpitsContent/Ui-UX/yogesh-tall.webp?updatedAt=1793347444208',
    hasLivePreview: true,
    tools: ['Framer', 'CMS', 'Interaction Design'],
    featured: true,
    caseStudy: {
      year: '2024',
      role: 'UI/UX Design & Framer Development',
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
          image: 'https://ik.imagekit.io/arpitsContent/Ui-UX/yogesh-portfolio.webp?updatedAt=1793347367563',
          layout: 'hero-wide',
        },
        {
          title: 'Work & Tech Stack Showcase',
          description: 'Clean grid of shipped applications with live preview links and tech badges.',
          image: 'https://ik.imagekit.io/arpitsContent/Ui-UX/yogesh-tall.webp?updatedAt=1793347444208',
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
        previewImage: 'https://ik.imagekit.io/arpitsContent/Ui-UX/yogesh-portfolio.webp?updatedAt=1793347367563',
        tallImage: 'https://ik.imagekit.io/arpitsContent/Ui-UX/yogesh-tall.webp?updatedAt=1793347444208',
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
    index: '05',
    title: 'ARPIT DESIGNS Framer Portfolio',
    type: 'website',
    category: 'Portfolio Website',
    categoryLabel: 'PORTFOLIO WEBSITE',
    url: 'https://arpit-designs.framer.website/',
    description: 'Design showcase and brand identity portfolio crafted in Framer focusing on visual excellence.',
    previewImage: 'https://ik.imagekit.io/arpitsContent/Ui-UX/arpit-designs.webp?updatedAt=1793347398627',
    tallPreviewImage: 'https://ik.imagekit.io/arpitsContent/Ui-UX/arpit-designs-tall.webp?updatedAt=1793347459020',
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
          image: 'https://ik.imagekit.io/arpitsContent/Ui-UX/arpit-designs.webp?updatedAt=1793347398627',
          layout: 'hero-wide',
        },
        {
          title: 'Editorial Bento Showcase',
          description: 'Asymmetrical grid displaying video editing, thumbnails, and visual designs.',
          image: 'https://ik.imagekit.io/arpitsContent/Ui-UX/arpit-designs-tall.webp?updatedAt=1793347459020',
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
        previewImage: 'https://ik.imagekit.io/arpitsContent/Ui-UX/arpit-designs.webp?updatedAt=1793347398627',
        tallImage: 'https://ik.imagekit.io/arpitsContent/Ui-UX/arpit-designs-tall.webp?updatedAt=1793347459020',
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

