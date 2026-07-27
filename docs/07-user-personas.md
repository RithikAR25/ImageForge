# User Personas

> **Document ID**: 07
> **Phase**: 1 — Product Planning
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Product Team

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Scope](#2-scope)
3. [Persona Methodology](#3-persona-methodology)
4. [Persona 1: Alex — The Casual User](#4-persona-1-alex--the-casual-user)
5. [Persona 2: Sam — The Designer](#5-persona-2-sam--the-designer)
6. [Persona 3: Morgan — The Developer](#6-persona-3-morgan--the-developer)
7. [Persona 4: Jordan — The Photographer](#7-persona-4-jordan--the-photographer)
8. [Persona 5: Casey — The Content Creator](#8-persona-5-casey--the-content-creator)
9. [Persona Summary Matrix](#9-persona-summary-matrix)
10. [Anti-Personas](#10-anti-personas)
11. [Assumptions](#11-assumptions)
12. [Related Documents](#12-related-documents)

---

## 1. Purpose

User personas provide a shared understanding of who ImageForge's users are, what they need, and what frustrates them. Personas guide product decisions, feature prioritization, and UX design. Every major design or product decision should be evaluated against these personas with the question: "How does this serve Alex/Sam/Morgan/Jordan/Casey?"

---

## 2. Scope

Five primary personas are defined covering the full spectrum of ImageForge's intended user base. An additional section covers anti-personas — users who are not the target audience — to prevent scope creep driven by edge-case users.

---

## 3. Persona Methodology

Personas are constructed from:

- Analysis of comparable tool usage patterns (Squoosh, iLoveIMG, Snapseed)
- Developer survey data on React Native adoption
- Open-source project contributor demographics
- Image processing tool usage analytics

Each persona includes: demographics, technical proficiency, goals, frustrations, typical workflow, and key requirements.

---

## 4. Persona 1: Alex — The Casual User

```
┌─────────────────────────────────────────────────────────────────┐
│  ALEX                                                           │
│  "I just need to make my photos smaller so I can send them."    │
├─────────────────────────────────────────────────────────────────┤
│  Age: 28 | Location: Urban | Platform: Web (primary), Mobile    │
│  Tech Level: Low                                                │
│  Discovery: Google search "compress image online"               │
└─────────────────────────────────────────────────────────────────┘
```

### Profile

Alex is a marketing coordinator who frequently needs to process photos for work and personal use but has no formal technical training. Alex uses whatever free tool comes up first in search results, completing tasks by trial and error rather than reading documentation.

**Occupation**: Marketing Coordinator  
**Daily Tools**: Google Docs, Canva, Slack, WhatsApp  
**Device**: Laptop (Chrome), iPhone 14  
**Image Volume**: 5–20 images per week

### Goals

1. Compress photos to send via WhatsApp without quality looking terrible
2. Resize images to specific dimensions for presentations or social media posts
3. Convert HEIC photos (from iPhone) to JPEG for sharing with Android users
4. Do all of this without signing up for an account

### Frustrations

- "I just want to compress the photo. Why do I have to create an account?"
- "The site uploaded my personal photos to their server and I don't know what they do with them"
- "The download button is hidden behind an advertisement"
- "I don't know what 'quality percentage' means — I just want it to look good and be small"

### Typical Workflow

```
1. Google "compress image free"
2. Click first non-sponsored result
3. Upload image by clicking button
4. Press download
5. If result is bad, try a different website
```

### Key Needs from ImageForge

- ✅ Zero friction import (large upload button, no signup)
- ✅ Sensible defaults (85% quality is always the right starting point for Alex)
- ✅ Real-time size reduction preview ("this will go from 4.2MB to 320KB")
- ✅ Clear presets: WhatsApp, Email, Web
- ✅ Single-click download
- ✅ No ads, no account, no data collection

### How Alex Finds ImageForge

Primarily through Google search. The Live Demo must rank well for "compress image online", "resize photo online", "convert HEIC to JPEG". SEO and demo quality are critical for Alex.

---

## 5. Persona 2: Sam — The Designer

```
┌─────────────────────────────────────────────────────────────────┐
│  SAM                                                            │
│  "I need a tool I can trust to batch process 200 images the     │
│  right way without babysitting it."                             │
├─────────────────────────────────────────────────────────────────┤
│  Age: 32 | Location: Remote | Platform: Web + Mobile           │
│  Tech Level: Medium-High                                        │
│  Discovery: GitHub, Designer communities (Dribbble, Figma)      │
└─────────────────────────────────────────────────────────────────┘
```

### Profile

Sam is a product designer at a SaaS company, regularly responsible for exporting and optimizing assets for web and mobile delivery. Sam values professional tools, consistency, and efficiency. Batch processing is critical — Sam often needs to apply the same operation to 50–200 images at once.

**Occupation**: Senior Product Designer  
**Daily Tools**: Figma, Sketch, Chrome DevTools, ImageOptim  
**Device**: MacBook Pro, iPad  
**Image Volume**: 50–500 images per week (peak project weeks)

### Goals

1. Batch optimize all design exports (PNG → WebP, quality tuned per format)
2. Batch resize images to multiple sizes for responsive design assets
3. Add consistent watermarks or logos to client deliverables
4. Strip all EXIF metadata from exported assets before delivery
5. Maintain a repeatable pipeline for consistent results across projects

### Frustrations

- "ImageOptim doesn't do batch resize. I need two tools for one workflow."
- "Web-based tools are too slow for 200 images — they upload everything to a server."
- "The batch tools I've tried don't show me what failed — they just silently skip errors."
- "I want to save a compression profile and reuse it next week."

### Typical Workflow

```
1. Export 150 assets from Figma
2. Open ImageForge
3. Drag entire export folder into the batch queue
4. Configure pipeline: [Resize to 2× sizes] → [Convert to WebP] → [Quality 80%]
5. Run batch, monitor progress
6. Download ZIP, verify a few outputs
7. Save pipeline for reuse
```

### Key Needs from ImageForge

- ✅ Reliable batch processing (500 images, never loses progress)
- ✅ Pipeline builder (ordered operations on all images)
- ✅ Format conversion in batch (PNG→WebP)
- ✅ Metadata stripping for clean exports
- ✅ Detailed error reporting (which file failed and why)
- ✅ Saved pipeline presets
- ✅ ZIP download for batch output

### How Sam Finds ImageForge

Through designer communities and GitHub. The open-source nature and PWA capability are selling points. Sam will evaluate the quality of the batch output before committing.

---

## 6. Persona 3: Morgan — The Developer

```
┌─────────────────────────────────────────────────────────────────┐
│  MORGAN                                                         │
│  "I want to understand how they built this. Can I use their     │
│  image processing package in my own project?"                   │
├─────────────────────────────────────────────────────────────────┤
│  Age: 27 | Location: Global | Platform: All + Code             │
│  Tech Level: High                                               │
│  Discovery: GitHub trending, Twitter/X, Dev.to                 │
└─────────────────────────────────────────────────────────────────┘
```

### Profile

Morgan is a full-stack developer who works on side projects and contributes to open source. Morgan arrived at ImageForge via GitHub trending or a developer blog post. Morgan is as interested in the code architecture as in the product itself — and may want to use `@imageforge/image-core` as a library in their own projects.

**Occupation**: Full-Stack Developer  
**Daily Tools**: VS Code, GitHub, npm, Expo  
**Device**: Desktop Linux, Android phone  
**Image Volume**: Low personal use, evaluating for integration

### Goals

1. Understand how React Native Web + Expo can build a real production app
2. Learn how libvips WASM is integrated in a browser
3. Use `@imageforge/image-core` as a dependency in their own React project
4. Contribute a feature (new filter, bug fix) to the open-source project
5. Reference ImageForge architecture patterns for their own team's RN project

### Frustrations

- "Most 'reference architectures' on GitHub are toy examples with 5 components."
- "No ADRs — I can't understand why they made these decisions."
- "The codebase has no tests. I can't trust it for production."
- "Contributing guidelines are non-existent. I don't know where to start."

### Typical Workflow

```
1. See ImageForge on GitHub trending
2. Read README, check star count
3. Look at folder structure
4. Read architecture docs and ADRs
5. Clone the repo, run it locally
6. Look at how libvips WASM is integrated
7. Install @imageforge/image-core in their own project
8. Open a PR to fix a bug or add a feature
```

### Key Needs from ImageForge

- ✅ Excellent README with architecture diagram
- ✅ Comprehensive documentation (this doc set)
- ✅ ADRs explaining every major decision
- ✅ Clean, idiomatic TypeScript code
- ✅ Published npm packages with stable APIs
- ✅ Contributing guide and issue templates
- ✅ >80% test coverage
- ✅ CI/CD pipeline visibly green

### How Morgan Finds ImageForge

GitHub trending, Hacker News, Twitter/X developer community, Dev.to articles. The quality of the GitHub repository page is the primary factor — Morgan evaluates in the first 60 seconds of viewing the repo.

---

## 7. Persona 4: Jordan — The Photographer

```
┌─────────────────────────────────────────────────────────────────┐
│  JORDAN                                                         │
│  "I shoot 800 photos per event. I need to deliver web-ready     │
│  versions to clients the same evening."                         │
├─────────────────────────────────────────────────────────────────┤
│  Age: 36 | Location: Suburban | Platform: Mobile + Web         │
│  Tech Level: Medium                                             │
│  Discovery: Photography communities, YouTube tutorials          │
└─────────────────────────────────────────────────────────────────┘
```

### Profile

Jordan is a semi-professional event photographer who sells prints and delivers digital galleries. Jordan processes large batches of JPEG/RAW images and needs professional-grade tools that work reliably. Privacy is important — client photos must never go to third-party servers.

**Occupation**: Freelance Photographer  
**Daily Tools**: Lightroom Classic, Google Photos, Dropbox  
**Device**: Windows laptop, iPhone 15 Pro  
**Image Volume**: 500–1000 images per event (1–3 events/month)

### Goals

1. Batch compress 800 event photos to web-delivery quality (< 800KB each)
2. Add studio watermark to all delivered images
3. Export multiple sizes (web preview + print resolution) in one operation
4. Strip GPS metadata from client photos before delivery
5. Apply consistent color grading / filter to an entire shoot

### Frustrations

- "Server-based tools upload my clients' photos. That's a GDPR issue."
- "Lightroom is overkill for just compressing and watermarking."
- "I need both desktop and mobile access — sometimes I deliver from my phone."
- "Batch watermarking doesn't let me position the logo exactly where I want."

### Typical Workflow

```
1. Export shoot from Lightroom as JPEG at full resolution
2. Open ImageForge
3. Import entire export folder (800 photos)
4. Pipeline: [Compress 85% JPEG] → [Strip GPS] → [Watermark bottom-right]
5. Run batch overnight on laptop
6. Download ZIP containing all processed photos
7. Upload to client delivery gallery
```

### Key Needs from ImageForge

- ✅ Large batch support (800+ images)
- ✅ Background processing (can close screen)
- ✅ Metadata stripping (GPS removal)
- ✅ Watermark with precise positioning
- ✅ Privacy-first (no server upload)
- ✅ Filters/LUTs for consistent color grading
- ✅ Queue persistence (surviving page refreshes)

---

## 8. Persona 5: Casey — The Content Creator

```
┌─────────────────────────────────────────────────────────────────┐
│  CASEY                                                          │
│  "I post daily. I need thumbnails, GIFs, and collages fast.    │
│  Speed and look matter more than anything else."                │
├─────────────────────────────────────────────────────────────────┤
│  Age: 22 | Location: Urban | Platform: Mobile (primary)        │
│  Tech Level: Low-Medium                                         │
│  Discovery: TikTok, YouTube, Instagram                         │
└─────────────────────────────────────────────────────────────────┘
```

### Profile

Casey is a social media content creator with 50K+ followers who posts daily across Instagram, TikTok, and YouTube. Casey needs tools that produce visually compelling results quickly, with platform-specific presets. The mobile experience is the primary interface.

**Occupation**: Content Creator (full-time)  
**Daily Tools**: CapCut, Canva, Instagram, TikTok  
**Device**: iPhone 15, iPad (editing)  
**Image Volume**: 10–30 images per day

### Goals

1. Create Instagram-ready thumbnails with text and filters
2. Create GIF animations from image sequences for stories
3. Resize images to exact platform specifications (no guessing)
4. Create photo collages for grid aesthetic
5. Add QR code overlays linking to products

### Frustrations

- "Platform presets in most tools are outdated — Instagram changed their sizes."
- "Making GIFs from photos requires three different apps."
- "I need my watermark to look premium, not pixelated."
- "Collage tools are either too rigid (grids only) or too complex (free-form)."

### Typical Workflow

```
1. Take photos with iPhone camera
2. Open ImageForge mobile app
3. Select 6 photos for Instagram carousel
4. Apply consistent filter
5. Add watermark/username
6. Export each at 1080×1080
7. Optionally create a GIF teaser
```

### Key Needs from ImageForge

- ✅ Instagram/TikTok/YouTube resize presets (up to date)
- ✅ GIF creation from images
- ✅ Collage builder with templates
- ✅ Filter system with presets
- ✅ Watermark with logo support
- ✅ Smooth mobile UX (gesture-driven)
- ✅ Fast processing (≤ 2 seconds per image)

---

## 9. Persona Summary Matrix

|                      | Alex     | Sam             | Morgan     | Jordan          | Casey        |
| -------------------- | -------- | --------------- | ---------- | --------------- | ------------ |
| **Primary Platform** | Web      | Web             | All        | Web + Mobile    | Mobile       |
| **Tech Level**       | Low      | Medium-High     | High       | Medium          | Low-Medium   |
| **Volume**           | Low      | High            | Low        | Very High       | Medium       |
| **Batch Mode**       | Never    | Always          | Evaluating | Always          | Sometimes    |
| **Privacy Concern**  | Low      | Medium          | High       | High            | Low          |
| **Key Feature**      | Compress | Batch           | SDK/Docs   | Batch+Watermark | GIF+Collage  |
| **Discover via**     | Google   | GitHub/Designer | GitHub/Dev | Photography     | Social Media |
| **Churn Trigger**    | Slow UI  | Failed batch    | No tests   | Server upload   | Ugly output  |

---

## 10. Anti-Personas

Anti-personas describe users who are **not** the target audience. Designing for anti-personas wastes resources and creates scope creep.

### Video Editor Viktor

Viktor primarily edits video content and wants a timeline editor, color grading suite, and audio mixing. ImageForge is an image tool. Viktor should be directed to DaVinci Resolve or CapCut.

**Not designing for**: Timeline editing, video export, audio sync.

### Enterprise IT Administrator Edgar

Edgar needs centralized deployment, LDAP integration, audit logs, and compliance reporting for a 500-person company. These are Phase 7+ enterprise features.

**Not designing for (MVP)**: Multi-user management, SSO, audit logging.

### Print Production Professional Paula

Paula needs CMYK color profiles, print-ready PDF generation with bleed marks, and integration with professional print workflows. These require a different stack and are out of scope.

**Not designing for**: CMYK support, print profiles, press-ready PDF.

---

## 11. Assumptions

| ID      | Assumption                                                                                                  |
| ------- | ----------------------------------------------------------------------------------------------------------- |
| A-P-001 | Alex represents the majority of web demo users (casual, high-churn)                                         |
| A-P-002 | Sam and Jordan represent the highest engagement users (batch power users)                                   |
| A-P-003 | Morgan is the primary evaluator of open-source quality — their satisfaction determines GitHub star velocity |
| A-P-004 | Casey represents mobile-primary users who need a compelling mobile UX                                       |
| A-P-005 | These five personas cover 90%+ of the target user base                                                      |

---

## 12. Related Documents

| Document                                                                     | Relationship                                 |
| ---------------------------------------------------------------------------- | -------------------------------------------- |
| [08-user-stories.md](./08-user-stories.md)                                   | User stories derived from these personas     |
| [09-use-cases.md](./09-use-cases.md)                                         | Use cases from persona workflows             |
| [10-feature-prioritization.md](./10-feature-prioritization.md)               | Priority decisions informed by persona needs |
| [03-product-requirements-document.md](./03-product-requirements-document.md) | PRD informed by these personas               |

---

_Document Owner: Product Team | Review Cycle: Quarterly | Approved: 2026-07-27_
