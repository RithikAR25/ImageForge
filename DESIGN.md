---
name: Emerald & Amber Executive
colors:
  surface: '#0c1324'
  surface-dim: '#0c1324'
  surface-bright: '#33394c'
  surface-container-lowest: '#070d1f'
  surface-container-low: '#151b2d'
  surface-container: '#191f31'
  surface-container-high: '#23293c'
  surface-container-highest: '#2e3447'
  on-surface: '#dce1fb'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#dce1fb'
  inverse-on-surface: '#2a3043'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#c1c7cd'
  on-secondary: '#2b3136'
  secondary-container: '#434a4f'
  on-secondary-container: '#b3b9bf'
  tertiary: '#ffb871'
  on-tertiary: '#4a2800'
  tertiary-container: '#e88d1e'
  on-tertiary-container: '#562f00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#dde3e9'
  secondary-fixed-dim: '#c1c7cd'
  on-secondary-fixed: '#161c21'
  on-secondary-fixed-variant: '#41484c'
  tertiary-fixed: '#ffdcbe'
  tertiary-fixed-dim: '#ffb871'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#6a3c00'
  background: '#0c1324'
  on-background: '#dce1fb'
  surface-variant: '#2e3447'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin: 32px
---

## Brand & Style

The brand identity of this design system is rooted in executive precision and high-performance utility. It targets a professional audience that values clarity, efficiency, and a premium aesthetic. By stripping away standard blues in favor of a stark foundation punctuated by vibrant Emerald Green and strategic Amber accents, the UI evokes a sense of calculated growth and technical mastery.

The visual style is a fusion of **Minimalism** and **High-Contrast Modernism**. It utilizes a deep slate-to-black background to create an expansive sense of depth, allowing white typography and high-energy accents to serve as functional beacons. The aesthetic avoids unnecessary ornamentation, focusing instead on structural integrity, sharp execution, and a "dark mode first" philosophy that reduces eye strain while maintaining a commanding presence.

## Colors

The palette is strictly curated to eliminate all blue-spectrum hues, replacing them with a sophisticated array of slates, emeralds, and a warm amber highlight.

- **Primary Emerald (#10b981):** Used exclusively for primary actions, success states, and key data points. It provides the "pop" of color against the dark canvas.
- **Bright White / Silver (#F0F6FC):** This serves as the secondary accent and the primary color for high-importance text and iconography. It ensures maximum legibility and a crisp, silver-like finish.
- **Tertiary Amber (#F39628):** Used as a secondary high-contrast color for warnings, active secondary states, and specific data highlights to provide warmth and distinction.
- **Deep Slate & Black:** The neutral foundation consists of `#020617` for backgrounds and `#0F172A` for containers. These tones are carefully balanced to remain neutral-gray rather than blue-gray.
- **Interactive States:** Hover and active states for emerald elements shift toward deeper, more saturated greens to maintain the high-contrast hierarchy.

## Typography

The typography system leverages **Hanken Grotesk** for headings and labels to provide a sharp, contemporary, and geometric feel that aligns with the professional-premium tone. **Inter** is utilized for body copy due to its exceptional legibility in dark environments and its neutral, systematic character.

Headlines use tight letter-spacing and heavy weights to command attention, while labels are often set in uppercase with slight tracking to improve scannability. For mobile, headline sizes are aggressively scaled down to ensure that high-contrast text does not overwhelm the smaller viewport, maintaining a balanced "information-dense" layout.

## Layout & Spacing

This design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The layout philosophy is built on a 8px base unit, ensuring all components and margins are multiples of this rhythm to create a sense of mathematical order.

Spacious margins (32px) and generous gutters (24px) are used to provide breathing room, preventing the high-contrast elements from feeling cluttered. On mobile, margins reduce to 16px to maximize the available screen real estate. Content should reflow logically, with containers expanding to fill column spans (typically 6 or 12 columns for primary content).

## Elevation & Depth

In this monochrome environment, depth is established through **Tonal Layering** and **Low-Contrast Outlines** rather than traditional shadows.

1.  **Base Surface:** The darkest value (`#020617`) represents the furthest backplane.
2.  **Raised Containers:** Elements like cards and sidebars use a slightly lighter slate (`#0F172A`).
3.  **Borders:** Subtle, 1px solid outlines in `#334155` define the boundaries of interactive areas without adding visual bulk.
4.  **Overlays:** High-elevation components (modals, menus) use a `#1E293B` surface with a very subtle, diffused neutral-black shadow (0px 8px 24px rgba(0,0,0,0.5)) to separate them from the primary interface.

## Shapes

The shape language is **Soft (Level 1)**, utilizing a base corner radius of 4px (0.25rem). This choice reinforces the "professional and technical" aspect of the brand—rounded enough to feel modern and accessible, but sharp enough to appear precise and engineered.

- **Buttons & Inputs:** 4px radius.
- **Cards & Containers:** 8px (0.5rem) radius.
- **Large Sections/Modals:** 12px (0.75rem) radius.

## Components

- **Buttons:** Primary buttons are solid Emerald Green (`#10b981`) with Black text for maximum contrast. Secondary buttons use a Silver outline with White text. Tertiary actions utilize Amber (`#f39628`) to signal specific alerts or high-priority secondary tasks.
- **Inputs:** Input fields are dark containers (`#0F172A`) with a 1px Slate border. Upon focus, the border transitions to Emerald Green.
- **Chips:** Chips utilize a dark-gray background with Emerald Green or Amber text for "active" states and White text for "inactive" states.
- **Lists:** List items are separated by subtle 1px dividers (`#334155`). Hover states trigger a subtle shift to a lighter background tone (`#1E293B`).
- **Cards:** Cards should not have shadows. Instead, they use a background color one step lighter than the page surface and a 1px border to define their edges.
- **Data Visualization:** Any charts or graphs must use a palette of Emerald, Amber, Silver, and varied shades of Slate to maintain the monochrome-high-contrast theme.
