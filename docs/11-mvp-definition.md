# MVP Definition

> **Document ID**: 11
> **Phase**: 1 — Product Planning
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Product Team

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Scope](#2-scope)
3. [MVP Philosophy](#3-mvp-philosophy)
4. [MVP Feature Set](#4-mvp-feature-set)
5. [MVP Exclusions (Explicitly)](#5-mvp-exclusions-explicitly)
6. [MVP Success Criteria](#6-mvp-success-criteria)
7. [MVP Exit Criteria](#7-mvp-exit-criteria)
8. [MVP Quality Bar](#8-mvp-quality-bar)
9. [MVP Infrastructure Checklist](#9-mvp-infrastructure-checklist)
10. [MVP Launch Checklist](#10-mvp-launch-checklist)
11. [Assumptions](#11-assumptions)
12. [Related Documents](#12-related-documents)

---

## 1. Purpose

This document defines the Minimum Viable Product (MVP) for ImageForge — the smallest set of features that delivers genuine value, validates the product concept, and establishes the technical foundation for all future development.

The MVP definition is the arbiter for "is this in MVP?" disputes. If a feature is not listed in Section 4, it is not in the MVP.

---

## 2. Scope

This document covers the MVP release of ImageForge — the first public version deployed to Vercel (Web) and submitted to the Google Play Store and Apple App Store.

---

## 3. MVP Philosophy

### Why Have an MVP?

Without an explicit MVP definition:

- Development expands indefinitely ("just one more feature")
- No clear milestone for the first release
- Technical debt accumulates while chasing feature completeness
- User feedback cannot be gathered until the product is "perfect"

### ImageForge MVP Principles

1. **The core value proposition must be fully delivered**: Compress, Resize, Crop, Convert — these four operations must be excellent. The MVP is not "all features at 50%" — it's "core features at 100%."

2. **The architectural foundation must be rock-solid**: Even if the MVP has fewer features, the monorepo, package architecture, WASM pipeline, and state management must be production-grade. Future features are built on this foundation.

3. **The Live Demo must be compelling**: The first GitHub visitor's experience must be impressive enough to earn a star. A broken or underwhelming web demo defeats the project's primary goal.

4. **Quality over quantity**: Zero crashes, zero data loss, >80% test coverage. A polished MVP outperforms a feature-rich buggy release.

---

## 4. MVP Feature Set

### 4.1 Core Processing Features (ALL PLATFORMS)

| Feature                  | Detail                                                 | Quality Bar                          |
| ------------------------ | ------------------------------------------------------ | ------------------------------------ |
| **Import: File Picker**  | Multi-select, supports JPEG/PNG/WebP/GIF/BMP/TIFF/HEIC | All formats open correctly           |
| **Import: Drag & Drop**  | Web only, folder support                               | Recursive folder traversal           |
| **Import: Clipboard**    | Web only, Ctrl+V                                       | PNG and JPEG from clipboard          |
| **Import: Gallery**      | Mobile only, multi-select                              | Expo ImagePicker integration         |
| **Import: Camera**       | Mobile only                                            | Front and rear camera                |
| **Duplicate Detection**  | SHA-256 hash comparison                                | < 200ms per image                    |
| **Thumbnail Generation** | Display within 500ms                                   | Correct for all formats              |
| **Metadata Preview**     | Dimensions, file size, format on import                | EXIF parser safe with malformed data |

| Processing Feature    | Options                                                              | Quality Bar                               |
| --------------------- | -------------------------------------------------------------------- | ----------------------------------------- |
| **Compression**       | Quality slider, target file size, presets (WhatsApp/Email/Web/Print) | ±10% of target size                       |
| **Resize**            | Pixels, %, Fit/Fill, social presets, wallpaper presets               | Exact pixel dimensions                    |
| **Crop**              | Free, fixed ratio, circle, custom dimensions                         | Pixel-perfect output                      |
| **Rotate**            | 90°/180°/270°, custom angle, EXIF auto-rotate                        | Correct orientation                       |
| **Flip**              | Horizontal, vertical                                                 |                                           |
| **Format Conversion** | JPEG, PNG, WebP, GIF, BMP (core 5)                                   | Lossless round-trips for lossless formats |

### 4.2 Batch Processing

| Feature                     | Detail                                           |
| --------------------------- | ------------------------------------------------ |
| **Queue management**        | Add, remove, reorder images                      |
| **Pipeline builder**        | Ordered operations (compress → resize → convert) |
| **Pause / Resume / Cancel** | Full queue control                               |
| **Retry failed items**      | Per-item and "retry all failed"                  |
| **Progress display**        | Per-item and aggregate                           |
| **Queue persistence**       | Survives page refresh (IndexedDB/SQLite)         |
| **Output organization**     | Flat, by original name, by date                  |

### 4.3 History & UX

| Feature                  | Detail                                           |
| ------------------------ | ------------------------------------------------ |
| **Undo / Redo**          | Unlimited within session, Ctrl+Z/Y, visual panel |
| **Before/After Preview** | Split slider for compression/enhancement         |
| **Settings**             | Default format/quality, theme, auto-rotate       |
| **Dark/Light Theme**     | System-respecting, manual override               |

### 4.4 Export

| Feature               | Detail                    |
| --------------------- | ------------------------- |
| **Single download**   | Web: direct file download |
| **Batch download**    | Web: ZIP archive          |
| **Save to Photos**    | Mobile                    |
| **Share sheet**       | Mobile (native OS share)  |
| **Copy to Clipboard** | Web (PNG output)          |

### 4.5 Platform & Infrastructure

| Area                | Requirement                                                  |
| ------------------- | ------------------------------------------------------------ |
| **Web: PWA**        | Service Worker, installable, offline support                 |
| **Web: WASM**       | libvips + mozjpeg + pngquant + libwebp loaded and functional |
| **Mobile: Android** | Expo managed, EAS Build, minimum API 26                      |
| **Mobile: iOS**     | Expo managed, EAS Build, minimum iOS 15                      |
| **Monorepo**        | Turborepo, all packages present and functional               |
| **CI/CD**           | GitHub Actions: lint, type-check, test, build                |
| **Deployment**      | Vercel auto-deploy on main branch merge                      |

---

## 5. MVP Exclusions (Explicitly)

The following features are explicitly **not in MVP** regardless of how simple they may seem:

| Feature                                      | Reason for Exclusion                 |
| -------------------------------------------- | ------------------------------------ |
| Image Enhancement (brightness/contrast/etc.) | P2; requires Skia shader integration |
| Filters & LUTs                               | P2; GPU shader work                  |
| Background Removal                           | P3; requires WASM ML model           |
| Watermark                                    | P2                                   |
| Drawing Tools                                | P2                                   |
| Blur Effects                                 | P2                                   |
| GIF Creation                                 | P3                                   |
| PDF Tools                                    | P3                                   |
| OCR                                          | P3                                   |
| Face Detection                               | P3                                   |
| Collage Builder                              | P2                                   |
| QR Code                                      | P2                                   |
| Metadata editing                             | P2 (view only in MVP)                |
| AVIF/TIFF/ICO output                         | P2                                   |
| Plugin System                                | P2 (API design only)                 |
| Project Workspace (named projects)           | P2                                   |
| Analytics                                    | P2 (architecture only)               |
| CLI Tool                                     | P3                                   |
| AI Features                                  | Future                               |

---

## 6. MVP Success Criteria

After MVP launch, these metrics define "MVP was successful":

### Product Metrics (Day 30 Post-Launch)

| Metric                     | Target                     |
| -------------------------- | -------------------------- |
| Web demo working           | 100% (live URL accessible) |
| Android app on Play Store  | ✅ Published               |
| iOS app on App Store       | ✅ Published               |
| GitHub Stars (30 days)     | 100+                       |
| Web monthly visitors       | 500+                       |
| Zero P0 bugs in production | 0 data loss, 0 crashes     |

### Technical Metrics

| Metric                         | Target |
| ------------------------------ | ------ |
| Lighthouse Performance score   | ≥ 85   |
| Lighthouse Accessibility score | ≥ 90   |
| Unit test coverage             | ≥ 80%  |
| TypeScript errors              | 0      |
| Open critical bugs             | 0      |

---

## 7. MVP Exit Criteria

The MVP is **complete** when all of the following are true:

### Feature Completeness

- [ ] All P0 features from Section 4 are implemented
- [ ] All features work on Web, Android, and iOS
- [ ] Feature availability matrix is verified

### Quality Gates

- [ ] Unit test coverage ≥ 80%
- [ ] Integration tests pass for all P0 user flows
- [ ] E2E tests pass for: compress, resize, crop, convert, batch
- [ ] Zero TypeScript compilation errors under strict mode
- [ ] ESLint: zero errors, zero warnings in CI
- [ ] Lighthouse Performance ≥ 85 (Web)
- [ ] Lighthouse Accessibility ≥ 90 (Web)
- [ ] WCAG 2.1 AA audit: zero critical violations

### Performance Gates

- [ ] Single compression (5MP JPEG at 85%): ≤ 500ms (Web)
- [ ] WASM initialization (warm): ≤ 500ms
- [ ] Batch of 10 images: ≤ 8 seconds (Web)
- [ ] Mobile cold start: ≤ 3 seconds

### Infrastructure Gates

- [ ] CI/CD pipeline runs on every PR
- [ ] Vercel deployment auto-deploys on merge to main
- [ ] Android EAS Build succeeds
- [ ] iOS EAS Build succeeds
- [ ] Service Worker installed and offline functionality verified

### Documentation Gates

- [ ] All 164 documentation files complete
- [ ] README.md with live demo link
- [ ] CONTRIBUTING.md
- [ ] All GitHub community files present
- [ ] JSDoc on all public package functions

### Security Gates

- [ ] `npm audit`: zero high/critical vulnerabilities
- [ ] CSP headers verified in production
- [ ] No image data transmitted in automated tests (network interceptor)
- [ ] Dependency license audit passed

---

## 8. MVP Quality Bar

### "Definition of Done" for Every MVP Feature

A feature is only "done" when:

1. ✅ It works on all three platforms (Web, Android, iOS)
2. ✅ It has unit tests with ≥ 80% line coverage
3. ✅ It has at least one integration test
4. ✅ It handles all documented edge cases (corrupted file, unsupported format, empty input)
5. ✅ It is keyboard accessible (Web)
6. ✅ It has appropriate ARIA labels
7. ✅ The feature module doc is written
8. ✅ It passes the performance gate (if applicable)
9. ✅ A PR review has been completed by at least one maintainer

---

## 9. MVP Infrastructure Checklist

### Repository

- [ ] Turborepo monorepo configured
- [ ] All package workspaces defined (`apps/web`, `apps/mobile`, `packages/*`)
- [ ] TypeScript strict mode configured in all packages
- [ ] ESLint + Prettier configured
- [ ] Vitest configured for unit tests
- [ ] Playwright configured for E2E tests

### CI/CD (GitHub Actions)

- [ ] `ci.yml`: lint + typecheck + unit tests on every PR
- [ ] `e2e.yml`: E2E tests on every PR (Web)
- [ ] `deploy-web.yml`: Vercel deployment on merge to main
- [ ] `build-android.yml`: EAS Build on release branch
- [ ] `build-ios.yml`: EAS Build on release branch
- [ ] `lighthouse.yml`: Lighthouse CI on every PR

### Deployment

- [ ] Vercel project configured with correct headers (COOP/COEP)
- [ ] Custom domain configured (if applicable)
- [ ] GitHub Pages configured for docs site
- [ ] Environment variables documented in `.env.example`

---

## 10. MVP Launch Checklist

Before tagging `v1.0.0`:

### Code

- [ ] All exit criteria in Section 7 met
- [ ] `CHANGELOG.md` updated
- [ ] `package.json` versions set to `1.0.0`

### GitHub Repository

- [ ] README.md with live demo badge, screenshots, GIF demos
- [ ] Repository description set
- [ ] Topics/tags set (react-native, typescript, image-processing, pwa, expo, webassembly)
- [ ] License: MIT
- [ ] All community files present (`.github/`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`)
- [ ] GitHub Discussions enabled
- [ ] Issue templates configured

### Stores

- [ ] Android: Play Store listing with screenshots and description
- [ ] iOS: App Store listing with screenshots and description
- [ ] Both apps pass store review

### Community

- [ ] Announce on relevant communities: Expo Discord, React Native Community, GitHub Blog, Dev.to, Hacker News
- [ ] Social media announcement post prepared
- [ ] Demo video recorded and published

---

## 11. Assumptions

| ID        | Assumption                                                            |
| --------- | --------------------------------------------------------------------- |
| A-MVP-001 | MVP takes approximately 3 months for a team of 2–3 engineers          |
| A-MVP-002 | WASM bundles can be served within Vercel's free tier bandwidth limits |
| A-MVP-003 | App Store and Play Store review processes complete within 2 weeks     |
| A-MVP-004 | HEIC decoding via WASM is sufficient quality for MVP                  |

---

## 12. Related Documents

| Document                                                       | Relationship               |
| -------------------------------------------------------------- | -------------------------- |
| [04-scope.md](./04-scope.md)                                   | Scope definition (in/out)  |
| [10-feature-prioritization.md](./10-feature-prioritization.md) | MoSCoW prioritization      |
| [12-roadmap.md](./12-roadmap.md)                               | What comes after MVP       |
| [quality/release-checklist.md](./quality/release-checklist.md) | Detailed release checklist |
| [80-ci-cd.md](./80-ci-cd.md)                                   | CI/CD configuration        |

---

_Document Owner: Product Team | Review Cycle: Milestone | Approved: 2026-07-27_
