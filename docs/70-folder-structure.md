# Folder Structure

> **Document ID**: 70
> **Phase**: 5 — Implementation Guides
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document provides the complete, definitive folder structure for the ImageForge monorepo — every directory and key file documented with its purpose.

---

## Root Level

```
ImageForge/
│
├── apps/                     ← Runnable applications
├── packages/                 ← Shared libraries
├── server/                   ← Optional backend (Phase 3+)
├── tools/                    ← Build tools & shared configs
├── examples/                 ← Integration examples
├── docs/                     ← This documentation set
├── benchmarks/               ← Performance benchmarks
│
├── .github/                  ← GitHub configuration
│   ├── workflows/            ← GitHub Actions CI/CD
│   │   ├── ci.yml
│   │   ├── deploy-web.yml
│   │   ├── build-android.yml
│   │   ├── build-ios.yml
│   │   └── release.yml
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── performance_issue.md
│   └── pull_request_template.md
│
├── turbo.json                ← Turborepo task pipeline
├── package.json              ← Root workspace config
├── pnpm.lock
├── pnpm-workspace.yaml
├── .npmrc
├── .nvmrc                    ← Node.js version pin
├── .prettierrc.json
├── .gitignore
├── .env.example              ← Environment variable template
├── LICENSE                   ← MIT License
├── README.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
└── CHANGELOG.md
```

---

## apps/web

```
apps/web/
├── src/
│   ├── main.tsx              ← Vite entry point
│   ├── App.tsx               ← Root component + providers
│   ├── providers/
│   │   ├── ThemeProvider.tsx
│   │   ├── QueryProvider.tsx
│   │   └── ServiceWorkerProvider.tsx
│   ├── web-only/             ← Web-specific features
│   │   ├── DropZoneHandler.tsx
│   │   ├── ClipboardHandler.tsx
│   │   └── FileSystemAccessAPI.ts
│   └── sw.ts                 ← Service Worker (Workbox)
│
├── public/
│   ├── icons/                ← PWA icons (192, 512, maskable)
│   ├── wasm/                 ← WASM binaries served as static assets
│   └── manifest.webmanifest
│
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## apps/mobile

```
apps/mobile/
├── app/                      ← Expo Router file-based pages
│   ├── _layout.tsx           ← Root layout
│   ├── (tabs)/
│   │   ├── _layout.tsx       ← Tab layout
│   │   ├── index.tsx         ← Home tab
│   │   ├── edit.tsx          ← Edit tab
│   │   ├── batch.tsx         ← Batch tab
│   │   └── settings.tsx      ← Settings tab
│   ├── edit/
│   │   └── [imageId]/
│   │       ├── compress.tsx
│   │       ├── resize.tsx
│   │       ├── crop.tsx
│   │       ├── rotate.tsx
│   │       └── convert.tsx
│   └── _modals/
│       ├── export.tsx
│       └── history.tsx
│
├── src/
│   ├── mobile-only/          ← Mobile-specific features
│   │   ├── CameraModule.ts
│   │   ├── GalleryModule.ts
│   │   └── ShareModule.ts
│   └── native-modules/       ← Native module wrappers
│       ├── ImageProcessingModule.ts
│       └── FileSystemModule.ts
│
├── expo-plugins/             ← Custom Expo Config Plugins
│   ├── withLibvips.js
│   └── withCustomPermissions.js
│
├── app.json                  ← Expo config
├── eas.json                  ← EAS Build config
├── tsconfig.json
└── package.json
```

---

## packages/image-core

```
packages/image-core/
├── src/
│   ├── index.ts              ← Public API exports
│   │
│   ├── compress/
│   │   ├── index.ts
│   │   ├── Compress.ts       ← Business logic
│   │   ├── CompressConfig.ts ← Config types & validation
│   │   ├── presets.ts        ← WhatsApp/Email/Web presets
│   │   └── compress.test.ts
│   │
│   ├── resize/
│   │   ├── index.ts
│   │   ├── Resize.ts
│   │   ├── ResizeConfig.ts
│   │   ├── presets.ts        ← Social media, wallpaper presets
│   │   └── resize.test.ts
│   │
│   ├── crop/
│   │   ├── index.ts
│   │   ├── Crop.ts
│   │   ├── CropConfig.ts
│   │   └── crop.test.ts
│   │
│   ├── rotate/
│   │   ├── index.ts
│   │   └── rotate.test.ts
│   │
│   ├── convert/
│   │   ├── index.ts
│   │   └── convert.test.ts
│   │
│   ├── pipeline/
│   │   ├── index.ts
│   │   ├── ImagePipeline.ts  ← Orchestrator
│   │   └── pipeline.test.ts
│   │
│   ├── batch/
│   │   ├── index.ts
│   │   ├── BatchOrchestrator.ts
│   │   └── batch.test.ts
│   │
│   ├── engines/
│   │   ├── ProcessingEngine.ts     ← Interface
│   │   ├── engine.web.ts           ← WASM engine
│   │   ├── engine.native.ts        ← Native engine
│   │   ├── wasm/
│   │   │   ├── WasmWorkerPool.ts
│   │   │   ├── wasm.worker.ts      ← Web Worker
│   │   │   └── modules/            ← WASM module loaders
│   │   └── native/
│   │       └── NativeEngineAdapter.ts
│   │
│   ├── storage/
│   │   ├── StorageAdapter.ts       ← Interface
│   │   ├── storage.web.ts          ← IndexedDB
│   │   └── storage.native.ts       ← SQLite
│   │
│   ├── import/
│   │   ├── FileImporter.ts
│   │   ├── ExifParser.ts
│   │   ├── ThumbnailGenerator.ts
│   │   ├── DuplicateDetector.ts
│   │   └── import.test.ts
│   │
│   └── export/
│       ├── Exporter.ts
│       ├── ZipBuilder.web.ts
│       └── export.test.ts
│
├── tsconfig.json
└── package.json
```

---

## packages/ui

```
packages/ui/
├── src/
│   ├── index.ts              ← Public component exports
│   │
│   ├── tokens/               ← Design tokens
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── animations.ts
│   │
│   ├── theme/
│   │   ├── ThemeProvider.tsx
│   │   ├── useTheme.ts
│   │   └── themes.ts         ← Light/dark theme objects
│   │
│   ├── primitives/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.stories.ts
│   │   │   └── Button.test.tsx
│   │   ├── Text/
│   │   ├── Input/
│   │   ├── Icon/
│   │   ├── Spinner/
│   │   └── ...
│   │
│   ├── components/
│   │   ├── Slider/
│   │   ├── ProgressBar/
│   │   ├── Toast/
│   │   ├── Modal/
│   │   └── ...
│   │
│   ├── feature/
│   │   ├── ImageThumbnail/
│   │   ├── QueueItem/
│   │   ├── BeforeAfterSlider/
│   │   ├── DropZone/
│   │   │   ├── DropZone.web.tsx
│   │   │   └── DropZone.native.tsx
│   │   └── ...
│   │
│   └── screens/
│       ├── HomeScreen/
│       ├── CompressScreen/
│       ├── BatchScreen/
│       └── ...
│
├── tsconfig.json
└── package.json
```

---

## docs/ (This Documentation Set)

```
docs/
├── README.md                 ← Navigation hub
├── DOCUMENT_INDEX.md         ← Complete index of all docs
├── GLOSSARY.md
├── DECISION_LOG.md
├── CHANGELOG.md
│
├── adr/                      ← ADR-0001 through ADR-0010
│
├── features/                 ← 24 feature module specifications
│   ├── import.md             compress.md   resize.md
│   ├── crop.md               rotate.md     flip.md
│   ├── format-conversion.md  batch-processing.md  history.md
│   ├── settings.md           metadata.md   enhancement.md
│   ├── filters.md            watermark.md  blur.md  drawing.md
│   ├── background-removal.md gif.md  pdf.md  ocr.md
│   └── qr.md  icon-generator.md  duplicate-finder.md  ai-enhancement.md
│
├── api/                      ← API references
│   ├── rest-api.md  worker-api.md  plugin-api.md  sdk-api.md
│
├── development/              ← Developer how-to guides
│   ├── environment-setup.md
│   ├── how-to-add-feature.md
│   ├── how-to-add-screen.md
│   └── how-to-add-package.md
│
├── performance/
│   ├── memory-management.md  web-performance.md  mobile-performance.md
│
├── security/
│   ├── privacy.md  permissions.md  metadata-cleaning.md
│   └── secure-file-handling.md
│
├── quality/
│   ├── testing-plan.md  unit-testing.md  e2e-testing.md
│   └── release-checklist.md
│
├── deployment/
│   ├── web-deployment.md  ios-release.md  android-release.md
│   └── github-actions.md  monitoring.md
│
├── future/
│   ├── ai-roadmap.md  desktop-roadmap.md  plugin-roadmap.md
│   └── future-enhancements.md  known-limitations.md
│
├── benchmarks/
│   ├── benchmark-plan.md  compression.md  resize.md
│   └── memory-usage.md  browser-comparison.md  mobile-comparison.md
│
└── ai/                       ← AI assistant documentation
    ├── SYSTEM_PROMPT.md      ← Paste into any AI coding session
    ├── IMPLEMENTATION_GUIDELINES.md
    ├── CODING_STANDARDS.md
    ├── REVIEW_PROCESS.md
    ├── MODULE_TEMPLATE.md
    └── FEATURE_TEMPLATE.md
```

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
