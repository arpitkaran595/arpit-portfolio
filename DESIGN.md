---
name: Arpit AK Portfolio Design System — Impeccable 2.0
description: Expressive editorial portfolio meets modern independent creative studio with dynamic dark and light chapters.
colors:
  ink:
    950: "#0D0E11"
    900: "#141312"
    850: "#161514"
    800: "#1F1D1B"
  terracotta:
    600: "#A64F2E"
    500: "#BD5D38"
    400: "#C05C36"
    100: "#F6EFE9"
  sage:
    900: "#1C241F"
    700: "#3E4A3D"
    500: "#5D6E5C"
    200: "#D9DFD6"
    100: "#ECEFEA"
  ivory:
    50: "#FEFCF9"
    100: "#FAF7F2"
    200: "#FAF3E8"
    300: "#F6F2EB"
    400: "#F4F1EA"
  gold:
    accent: "#D4A94E"
    antique: "#C4943A"
    deep: "#B8860B"
typography:
  display:
    fontFamily: "Bebas Neue, Impact, sans-serif"
    fontSize: "clamp(4.8rem, 9.5vw, 9.8rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.03em"
  heading:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(2.5rem, 5vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 600
    letterSpacing: "0.15em"
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1.15rem"
  xl: "1.5rem"
  full: "9999px"
---

# Design System: Impeccable 2.0

<!-- impeccable:design-schema 1 -->

## Architectural Vision & Philosophy

**Impeccable 2.0** transforms the portfolio from a continuous, monotone sheet of beige parchment into a deliberate, multi-chapter sensory journey: **an expressive editorial monograph meeting a modern independent creative studio.**

Rather than treating the website as a single uninterrupted surface with repeated UI elements, each section is art-directed as a dedicated chapter with its own atmospheric temperature, elevation, and contrast level—while remaining unified through tactile material textures (paper fibers, subtle noise grain), cloud horizons, and signature typography.

---

## 1. Dynamic Section Rhythm & Contrast Architecture

The portfolio weaves high-contrast dark media chambers with light tactile studio spaces to eliminate visual fatigue and give each creative medium its ideal viewing condition:

| Section | Art-Directed Chapter Persona | Background Color | Text Hierarchy | Role & Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **01. Hero** | Warm Ivory & Dawn Atmosphere | `#FAF3E8` (warm ivory) | `#141312` & `#BD5D38` | Atmospheric entrance with floating clouds, character art, and clear primary/secondary CTAs. |
| **02. About** | Studio Linen & Botanical Sage | `#F4F1EA` (studio linen) | `#1A1918` & `#3E4A3D` | Intimate editorial biography with crafted software and discipline cards. |
| **03. Design Philosophy** | **Deep Inky Espresso Chamber** | `#141312` (inky espresso) | `#FAF7F2` & `#BD5D38` | High-contrast philosophical pause; manifesto quote and core creative tenets on dark parchment. |
| **04. Case Studies** | Warm Monograph Gallery | `#FAF6F0` (warm monograph) | `#141312` & `#BD5D38` | Curated editorial deep-dives with structured problem-action-impact narratives. |
| **05. Video Section** | **Cinematic Midnight Ink Studio** | `#0D0E11` (midnight ink) | `#FAF7F2` & `#FAF7F2` | Immersive dark theatre optimized for moving images, video reels, and client cuts. |
| **06. Stories Section** | Art Gallery Salon Wall | `#F6F2EB` (warm linen) | `#141312` & `#BD5D38` | Museum wall presentation honoring 9:16 vertical stories and typographic posters. |
| **07. Social Creatives** | **Muted Botanical Sage Studio** | `#ECEFEA` (botanical sage) | `#1C241F` & `#3E4A3D` | Organic design board showcasing brand campaigns and visual identity assets. |
| **08. Thumbnails** | **Deep Dark Umber Stage** | `#161514` (dark umber) | `#FAF7F2` & `#D4A94E` | High-contrast YouTube staging room; lets saturated 16:9 thumbnails pop with maximum CTR contrast. |
| **09. Digital Work** | Architectural Studio White | `#F8F7F4` (studio white) | `#141312` & `#BD5D38` | Clean, technical gallery for web products, interactive systems, and UI experiments. |
| **10. Experience** | Cloud Summit Dawn | `#FBF5EB` (dawn summit) | `#141312` & `#BD5D38` | Elevation above the clouds; career milestones and production impact timeline. |
| **11. Personal Brand Moment**| **Velvet Noir Monolith** | `#0F0E10` (velvet noir) | `#FAF7F2` & `#D4A94E` | Monolithic signature moment; personal reflection and luminous gold emblem. |
| **12. Contact Hub** | Warm Terracotta & Sand Studio | `#F6EFE9` (terracotta sand) | `#141312` & `#BD5D38` | Warm, inviting collaborative workshop with direct WhatsApp and inquiry channels. |
| **13. Footer** | Open Horizon Sky & Midnight | `#ECE0D0` to `#79C3EC` | `#141312` & `#BD5D38` | Expansive horizon descent celebrating the collaborative horizon. |

---

## 2. Color System & Design Tokens

### Core Color Families

- **Ink & Midnight (`ink`)**:
  - `ink-950` (`#0D0E11`): Video theatre background, deep dark acrylic masks.
  - `ink-900` (`#141312`): Design philosophy chamber, primary CTA buttons, dominant headlines.
  - `ink-850` (`#161514`): Thumbnails stage background, dark statistics cards.
  - `ink-800` (`#1F1D1B`): Secondary dark panels, hover states on dark stages.

- **Warm Terracotta & Clay (`terracotta`)**:
  - `terracotta-600` (`#A64F2E`): Deep terracotta hover states.
  - `terracotta-500` (`#BD5D38`): Primary accent, headline highlights ("Worth Seeing"), primary submit buttons.
  - `terracotta-400` (`#C05C36`): Vibrant accent highlights and active indicators.
  - `terracotta-100` (`#F6EFE9`): Warm sand studio background for Contact.

- **Botanical Sage & Olive (`sage`)**:
  - `sage-900` (`#1C241F`): High-contrast dark botanical text.
  - `sage-700` (`#3E4A3D`): Secondary botanical text and badge outlines.
  - `sage-500` (`#5D6E5C`): Muted badges and active filter indicators.
  - `sage-200` (`#D9DFD6`): Sage card borders and hairline dividers.
  - `sage-100` (`#ECEFEA`): Creatives section studio board background.

- **Ivory & Studio Linen (`ivory`)**:
  - `ivory-50` (`#FEFCF9`): Crisp elevated paper cards, modal backdrops.
  - `ivory-100` (`#FAF7F2`): Light Bone typography on dark sections (`#0D0E11`, `#141312`, `#161514`).
  - `ivory-200` (`#FAF3E8`): Hero foundation background.
  - `ivory-300` (`#F6F2EB`): Stories salon wall background.
  - `ivory-400` (`#F4F1EA`): About section linen background.

- **Restrained Antique Gold (`gold`)**:
  - `gold-accent` (`#D4A94E`): Refined metallic highlights, signature icons, active state pills.
  - `gold-antique` (`#C4943A`): Secondary accents, badges, and card borders.
  - `gold-deep` (`#B8860B`): Warm gold accents and brand sign-off elements.

---

## 3. Typographic Hierarchy

Typography is structured into three authoritative voices that convey craftsmanship and precision:

1. **Display Voice (`Bebas Neue`)**:
   - Condensed monumental impact sans.
   - Purpose: Hero background marquee, footer colossal brand lockup, index counters ("01", "02", "03").
   - Metrics: Line height `1.0`, uppercase, slight positive tracking (`0.02em` - `0.03em`).

2. **Editorial Heading Voice (`Playfair Display`)**:
   - Refined high-contrast serif with editorial gravitas.
   - Purpose: Primary section headlines, manifesto quotes, key story titles.
   - Metrics: Line height `1.04` - `1.12`, tight letter spacing (`-0.015em`), elegant italic phrasing.

3. **Interface & Narrative Voice (`Sora`)**:
   - Clean, geometric sans-serif engineered for digital readability.
   - Purpose: Body descriptions, metadata chips, technical specs, form controls.
   - Metrics: Line height `1.6` - `1.7`, balanced tabular numbers, legible small-print metrics.

---

## 4. Section Transitions & Depth Layering

To prevent jarring visual cuts between dark and light sections, transitions are handled with dedicated atmospheric bridges:

1. **About (`#F4F1EA`) → Design Philosophy (`#141312`)**:
   - Top feathering mask inside Design Philosophy softly dissolves linen into inky espresso.
2. **Selected Case Studies (`#FAF6F0`) → Video Section (`#0D0E11`)**:
   - `SectionTransition` (variant: `about-to-videos`) renders a 56px gradient fade from `#FAF6F0` into `#0D0E11` with an ambient glow.
3. **Video Section (`#0D0E11`) → Stories Section (`#F6F2EB`)**:
   - `SectionTransition` (variant: `videos-to-stories`) smoothly emerges from dark ink into museum linen with soft mist.
4. **Stories (`#F6F2EB`) → Creatives (`#ECEFEA`)**:
   - `SectionTransition` (variant: `stories-to-creatives`) blends warm linen into muted botanical sage.
5. **Creatives (`#ECEFEA`) → Thumbnails (`#161514`)**:
   - `SectionTransition` (variant: `creatives-to-thumbnails`) transitions sage into dark umber with warm amber backlighting.
6. **Thumbnails (`#161514`) → Digital Work (`#F8F7F4`)**:
   - `SectionTransition` (variant: `thumbnails-to-digital`) bridges dark umber into crisp studio white.
7. **Experience (`#FBF5EB`) → Personal Brand Moment (`#0F0E10`) → Contact (`#F6EFE9`)**:
   - Top and bottom gradient masks softly envelop the central noir signature monolith.
8. **Contact (`#F6EFE9`) → Footer (`#ECE0D0` to sky)**:
   - Smooth continuous gradient seam connecting sand studio into the open horizon sky.

---

## 5. Elimination of AI-Generated Design Tropes

Impeccable 2.0 strictly eliminates generic generative-AI tropes in favor of hand-crafted editorial design:

- ❌ **No Monotone 10,000px Sheets**: Replaced uniform beige background with 13 art-directed chapters and high-contrast dark/light pacing.
- ❌ **No Eyebrow Pollution**: Removed decorative eyebrow labels and repetitive horizontal line dividers (`THE FINAL SCENE`, `DESIGN PHILOSOPHY`, `CURATED WORK`, `DIGITAL WORK`, etc.) that added noise without meaning.
- ❌ **No Unweighted Button Pairs**: Hero CTAs now feature a clear primary action (deep ink `#141312` with gold borders) and secondary action (warm ivory `#FEFCF9`), creating clear visual hierarchy.
- ❌ **No Neon/Cyber Gradients**: Strict adherence to physical, organic material pigments (terracotta, ink, botanical sage, linen, antique gold).
- ❌ **No Low-Contrast Dark Modals**: All media viewers and live website frames feature dark, distraction-free matte backdrops with high-contrast controls.
- ❌ **No Arbitrary Bouncing**: Replaced continuous bouncing animations with subtle, calm physics-based floating loops and scroll-scrubbed parallax.

---

## 6. Functional & Production Integrity

- **Media Functionality**: YouTube embeds, vertical video reels, interactive 3D carousel orbits, and fullscreen modals operate seamlessly.
- **Form & Contact Routing**: Direct WhatsApp integration opens pre-formatted inquiries without exposing private phone numbers in visible DOM text.
- **Scroll Orchestration**: Lenis smooth scroll and GSAP ScrollTrigger share a single RAF cycle via `gsap.ticker` with zero layout thrashing or stutter.
- **Accessibility**: All interactive elements maintain WCAG AA contrast (minimum 4.5:1 for body copy, 3:1 for large display titles) and respect `prefers-reduced-motion`.
