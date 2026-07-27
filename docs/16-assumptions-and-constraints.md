# Assumptions and Constraints

> **Document ID**: 16
> **Phase**: 1 — Product Planning
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document formally records all assumptions made during the design of ImageForge, along with all project constraints that limit architectural and product decisions. Documenting assumptions explicitly prevents them from becoming hidden technical debt.

## Scope

All assumptions and constraints influencing architecture, product design, and operational decisions.

---

## Assumptions

### Technology Assumptions

| ID             | Assumption                                                             | Confidence | Revisit Trigger               | Impact if Wrong                     |
| -------------- | ---------------------------------------------------------------------- | ---------- | ----------------------------- | ----------------------------------- |
| **A-TECH-001** | libvips WASM achieves ≥ 50% of native processing speed                 | High       | Benchmark < 30% of native     | Server-side processing required     |
| **A-TECH-002** | WASM SIMD is supported by ≥ 90% of target browsers                     | High       | Can-I-Use data drops          | Disable SIMD, accept 3–5× slowdown  |
| **A-TECH-003** | SharedArrayBuffer available with COOP/COEP headers                     | High       | Browser security changes      | Remove parallel WASM processing     |
| **A-TECH-004** | React Native Web supports all needed UI primitives                     | Medium     | Incompatible primitive found  | Custom Web component needed         |
| **A-TECH-005** | Expo Config Plugins can inject all required native code                | Medium     | Plugin limitation encountered | Bare workflow migration             |
| **A-TECH-006** | React Native New Architecture stable for Expo SDK 51+                  | High       | Known breaking bugs           | Pin to legacy architecture          |
| **A-TECH-007** | Turborepo handles monorepo at 10+ packages without degrading DX        | High       | Build times > 60s uncached    | Consider Nx migration               |
| **A-TECH-008** | TanStack Query v5 integrates cleanly with Zustand stores               | High       | Integration conflicts         | Custom async state layer            |
| **A-TECH-009** | React Native Skia provides sufficient canvas API for all drawing needs | Medium     | Missing Skia API for feature  | Custom native canvas module         |
| **A-TECH-010** | Tesseract.js achieves ≥ 80% OCR accuracy on typical images             | Medium     | Accuracy below threshold      | Switch to ML Kit Web (if available) |

### Platform Assumptions

| ID             | Assumption                                                          | Confidence | Revisit Trigger                  | Impact if Wrong                   |
| -------------- | ------------------------------------------------------------------- | ---------- | -------------------------------- | --------------------------------- |
| **A-PLAT-001** | HEIC decoding via libheif WASM is viable in-browser                 | Medium     | Performance unacceptable         | HEIC input dropped for Web        |
| **A-PLAT-002** | iOS 15+ provides sufficient background task time for large batches  | Medium     | iOS terminates background tasks  | Foreground-only processing on iOS |
| **A-PLAT-003** | Android 8+ (API 26) covers ≥ 95% of active Android devices          | High       | Analytics show lower coverage    | Raise minimum SDK                 |
| **A-PLAT-004** | Safari 15.4+ PWA features sufficient for core offline functionality | High       | Safari PWA regression            | Advise Safari users to use Chrome |
| **A-PLAT-005** | Expo EAS Build produces App Store and Play Store compliant binaries | High       | Store rejection for binary issue | Custom native build scripts       |

### Product Assumptions

| ID             | Assumption                                                                | Confidence | Revisit Trigger                    | Impact if Wrong                    |
| -------------- | ------------------------------------------------------------------------- | ---------- | ---------------------------------- | ---------------------------------- |
| **A-PROD-001** | Users accept a 3-second WASM initialization delay on first visit          | Medium     | Bounce rate > 60%                  | Lighter initial processing engine  |
| **A-PROD-002** | Users prefer privacy-first over cloud-speed convenience                   | High       | User research says opposite        | Opt-in server processing path      |
| **A-PROD-003** | The open-source model attracts enough contributors to sustain development | Medium     | Zero external PRs in 3 months      | Paid contractor model for features |
| **A-PROD-004** | GitHub Stars are a valid proxy for developer mindshare                    | High       | Stars don't correlate with users   | Track actual usage metrics instead |
| **A-PROD-005** | The web demo is the primary acquisition channel                           | Medium     | Most downloads come from stores    | Invest more in app store SEO       |
| **A-PROD-006** | Users do not need cloud storage for the MVP to be useful                  | High       | User requests override local limit | Accelerate cloud sync development  |

### Architecture Assumptions

| ID             | Assumption                                                               | Confidence | Revisit Trigger                   | Impact if Wrong                    |
| -------------- | ------------------------------------------------------------------------ | ---------- | --------------------------------- | ---------------------------------- |
| **A-ARCH-001** | Feature-first package organization scales to 30+ features                | High       | Package dependency hell           | Migrate to domain-first            |
| **A-ARCH-002** | Zustand stores don't cause performance issues at scale                   | High       | >500ms state updates              | Add store selectors, memoization   |
| **A-ARCH-003** | IndexedDB is sufficient for all Web storage needs                        | High       | Quota exceeded errors             | Add quota management, LRU eviction |
| **A-ARCH-004** | Web Worker pool of 4 workers is optimal for most hardware                | Medium     | Benchmarks show different optimum | Make configurable, auto-detect     |
| **A-ARCH-005** | The platform abstraction layer handles 95% of cross-platform differences | Medium     | >20% code is platform-specific    | Revisit shared code strategy       |

### Legal Assumptions

| ID              | Assumption                                                          | Confidence | Revisit Trigger                | Impact if Wrong               |
| --------------- | ------------------------------------------------------------------- | ---------- | ------------------------------ | ----------------------------- |
| **A-LEGAL-001** | FFmpeg LGPL is compatible with MIT via dynamic WASM loading         | Medium     | Legal review says otherwise    | Isolate FFmpeg in LGPL module |
| **A-LEGAL-002** | Processing images locally means no GDPR data processing obligations | High       | Regulatory ruling changes      | Full GDPR compliance audit    |
| **A-LEGAL-003** | MIT License is compatible with all chosen dependency licenses       | Medium     | License checker finds conflict | Replace or isolate dependency |

---

## Constraints

### Technical Constraints

| ID             | Constraint                                           | Source                           | Impact                                |
| -------------- | ---------------------------------------------------- | -------------------------------- | ------------------------------------- |
| **C-TECH-001** | Must use React Native and React Native Web           | Project mandate                  | Technology stack fixed                |
| **C-TECH-002** | Must use TypeScript (strict mode)                    | Project mandate                  | No JavaScript allowed                 |
| **C-TECH-003** | Must use Expo Managed Workflow for mobile            | Architecture decision (ADR-0009) | Limited to Expo SDK + Config Plugins  |
| **C-TECH-004** | All processing must be client-side by default        | Privacy principle                | No server-side image APIs             |
| **C-TECH-005** | WASM binaries must be served with COOP/COEP headers  | SharedArrayBuffer requirement    | Vercel `vercel.json` headers required |
| **C-TECH-006** | Bundle size targets: JS ≤ 500KB, total initial ≤ 5MB | NFR-P-007                        | Code splitting mandatory              |
| **C-TECH-007** | No GPL-licensed code in the main bundle              | Legal constraint                 | GPL code in separate optional modules |

### Platform Constraints

| ID             | Constraint                                            | Source                      | Impact                                      |
| -------------- | ----------------------------------------------------- | --------------------------- | ------------------------------------------- |
| **C-PLAT-001** | Web: No camera access via standard browser APIs       | Browser security model      | Camera import Web-only via file picker      |
| **C-PLAT-002** | Web: Drag & Drop only on pointer devices              | HTML5 D&D API               | D&D not available on touch Web              |
| **C-PLAT-003** | iOS: Background processing severely limited by OS     | iOS App lifecycle           | Large batches must run in foreground on iOS |
| **C-PLAT-004** | Android: Must request runtime permissions for storage | Android 6+ permission model | Permission flow required                    |
| **C-PLAT-005** | App Store: No dynamic code loading allowed            | Apple App Store Guidelines  | No OTA code that runs native code           |
| **C-PLAT-006** | Browser: WASM module size limit ~4GB                  | WASM specification          | Enforces modular WASM architecture          |

### Business Constraints

| ID            | Constraint                                                | Source            | Impact                                  |
| ------------- | --------------------------------------------------------- | ----------------- | --------------------------------------- |
| **C-BIZ-001** | MIT License (no monetization of core)                     | Project vision    | No feature paywalls                     |
| **C-BIZ-002** | Zero server infrastructure costs for core features        | Financial         | All core processing must be client-side |
| **C-BIZ-003** | Vercel free tier for web hosting                          | Financial         | WASM bundle CDN strategy required       |
| **C-BIZ-004** | GitHub Actions free tier for CI/CD                        | Financial         | Build minutes must be managed           |
| **C-BIZ-005** | No user data collection without explicit consent          | Privacy principle | Analytics must be opt-in                |
| **C-BIZ-006** | All dependencies must have non-GPL-contaminating licenses | Legal             | License audit on every dependency add   |

### Resource Constraints

| ID            | Constraint                                       | Source              | Impact                                     |
| ------------- | ------------------------------------------------ | ------------------- | ------------------------------------------ |
| **C-RES-001** | Initial team: 1–3 developers                     | Project scale       | MVP scope must be achievable by small team |
| **C-RES-002** | No paid QA team                                  | Open-source model   | Automated testing must cover QA gaps       |
| **C-RES-003** | Documentation must be maintainable by developers | Resource constraint | Docs co-located with code, no separate CMS |

---

## Constraint Impact Matrix

| Constraint                     | Architecture                            | Features                                | Timeline                         | Quality |
| ------------------------------ | --------------------------------------- | --------------------------------------- | -------------------------------- | ------- |
| Client-side only (C-TECH-004)  | High — WASM architecture required       | Medium — server-heavy features excluded | Medium — WASM integration effort | Low     |
| MIT License (C-BIZ-001)        | Low                                     | Low                                     | Low                              | Low     |
| Expo Managed (C-TECH-003)      | Medium                                  | Medium — some native features limited   | Low                              | Low     |
| No iOS background (C-PLAT-003) | High — affects batch design             | High — iOS batch UX different           | Medium                           | Low     |
| Bundle size (C-TECH-006)       | High — code splitting mandatory         | Low                                     | Medium                           | Low     |
| Small team (C-RES-001)         | Medium — architecture must be learnable | High — MVP scope critical               | High                             | Medium  |

---

_Document Owner: Architecture Team | Review Cycle: Quarterly | Approved: 2026-07-27_
