# ImageForge Documentation

> **The Ultimate Open-Source Cross-Platform Image Processing Platform**
>
> Built with React Native · React Native Web · TypeScript · Expo

---

## Quick Navigation

| I want to...                        | Go to                                                       |
| ----------------------------------- | ----------------------------------------------------------- |
| Understand the project vision       | [Project Overview](./01-project-overview.md)                |
| Understand the product requirements | [PRD](./03-product-requirements-document.md)                |
| Understand the system architecture  | [System Architecture](./20-system-architecture-document.md) |
| Understand a specific feature       | [Feature Modules](./features/)                              |
| Set up a development environment    | [Getting Started](./development/getting-started.md)         |
| Add a new feature                   | [How to Add a Feature](./development/how-to-add-feature.md) |
| Understand the design system        | [Design System](./50-design-system.md)                      |
| Understand security decisions       | [Security Architecture](./37-security-architecture.md)      |
| Review the roadmap                  | [Roadmap](./12-roadmap.md)                                  |
| Find all documents                  | [Document Index](./DOCUMENT_INDEX.md)                       |

---

## What is ImageForge?

ImageForge is an enterprise-grade, open-source image processing platform designed to run natively on **Web**, **Android**, and **iOS** from a single shared TypeScript codebase.

### Core Principles

| Principle             | Description                                                         |
| --------------------- | ------------------------------------------------------------------- |
| **Cross-Platform**    | Web, Android, iOS from one codebase                                 |
| **Privacy-First**     | All processing happens on-device; no images leave the user's device |
| **Offline-First**     | Full functionality without a network connection                     |
| **Performance-First** | WASM-powered processing on Web; native codecs on mobile             |
| **Open-Source**       | MIT licensed, community-driven development                          |

### Platform Summary

```
Web     → React Native Web + PWA + WebAssembly (Vercel)
Android → Expo + React Native + Native Modules (Kotlin)
iOS     → Expo + React Native + Native Modules (Swift)
```

---

## Documentation Structure

```
docs/
├── README.md                          ← You are here
├── DOCUMENT_INDEX.md                  ← Full index of all documents
├── GLOSSARY.md                        ← Canonical term definitions
├── DECISION_LOG.md                    ← Major architectural decisions log
├── CHANGELOG.md                       ← Documentation changelog
│
├── 01-project-overview.md             ← Phase 1: Product Planning
├── 02-business-requirements-document.md
├── ...
│
├── 20-system-architecture-document.md ← Phase 2: Architecture
├── ...
│
├── adr/                               ← Architecture Decision Records
│   ├── ADR-0001-monorepo.md
│   └── ...
│
├── 50-design-system.md                ← Phase 3: UI/UX
├── ...
│
├── features/                          ← Phase 4: Feature Modules
│   ├── compress.md
│   ├── resize.md
│   └── ...
│
├── 70-folder-structure.md             ← Phase 5: Technical Specs
├── ...
│
├── performance/                       ← Phase 6: Performance
├── security/                          ← Phase 7: Security
├── quality/                           ← Phase 8: Quality
├── deployment/                        ← Phase 9: Deployment
├── future/                            ← Phase 10: Future
├── api/                               ← API Documentation
├── development/                       ← Development Guides
├── benchmarks/                        ← Benchmark Results
└── ai/                                ← AI Development Guidelines
```

---

## Key Architecture Decisions at a Glance

| Decision                | Choice                     | Rationale                                      |
| ----------------------- | -------------------------- | ---------------------------------------------- |
| Monorepo tool           | Turborepo                  | Best RN + Web support, incremental builds      |
| State management        | Zustand                    | Simplicity, small bundle, excellent TypeScript |
| Web image processing    | WebAssembly (libvips)      | Privacy-first, offline-capable                 |
| Native image processing | libvips native + FFmpeg    | Maximum performance                            |
| Async state             | TanStack Query             | Powerful cache, background sync                |
| Animations              | React Native Reanimated v3 | JS thread-free animations                      |
| Navigation              | React Navigation v7        | Best cross-platform navigation                 |
| Rendering (Canvas)      | React Native Skia          | Unified canvas API web + native                |

> For the full decision record, see [Architecture Decision Records](./adr/) and [Decision Log](./DECISION_LOG.md).

---

## Live Demo

🔗 **[Try ImageForge in your browser →](https://imageforge.vercel.app)**

No installation required. Upload images and process them entirely in your browser using WebAssembly.

---

## Repository Links

| Resource           | Link                                       |
| ------------------ | ------------------------------------------ |
| GitHub Repository  | `https://github.com/imageforge/imageforge` |
| Live Demo          | `https://imageforge.vercel.app`            |
| Documentation Site | `https://imageforge.github.io`             |
| NPM Packages       | `@imageforge/*`                            |

---

## For New Contributors

1. Read [Project Overview](./01-project-overview.md) — understand what we're building
2. Read [System Architecture](./20-system-architecture-document.md) — understand how it works
3. Follow [Environment Setup](./development/environment-setup.md) — get your machine ready
4. Read [Coding Standards](./72-coding-standards.md) — know our conventions
5. Read [How to Add a Feature](./development/how-to-add-feature.md) — start contributing

---

## Document Health

| Phase                     | Documents | Status      |
| ------------------------- | --------- | ----------- |
| Phase 0: Navigation Hub   | 5         | ✅ Complete |
| Phase 1: Product Planning | 16        | ✅ Complete |
| Phase 2: Architecture     | 21 + ADRs | ✅ Complete |
| Phase 3: UI/UX            | 10        | ✅ Complete |
| Phase 4: Feature Modules  | 34        | ✅ Complete |
| Phase 5: Technical Specs  | 16        | ✅ Complete |
| Phase 6: Performance      | 7         | ✅ Complete |
| Phase 7: Security         | 5         | ✅ Complete |
| Phase 8: Quality          | 7         | ✅ Complete |
| Phase 9: Deployment       | 7         | ✅ Complete |
| Phase 10: Future          | 6         | ✅ Complete |
| API Documentation         | 6         | ✅ Complete |
| Development Guides        | 9         | ✅ Complete |
| Benchmarks                | 9         | ✅ Complete |
| AI Development            | 6         | ✅ Complete |

---

_Last updated: 2026-07-27 | Version: 1.0.0 | See [CHANGELOG.md](./CHANGELOG.md)_
