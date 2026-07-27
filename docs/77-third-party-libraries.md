# Third-Party Libraries Reference

> **Document ID**: 77
> **Phase**: 5 — Technical Specifications
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document provides the definitive list of all approved third-party libraries with their purpose, version constraints, and rationale.

---

## Core Framework

| Library            | Version | Purpose          | License    | Rationale             |
| ------------------ | ------- | ---------------- | ---------- | --------------------- |
| `react`            | ^18.x   | UI framework     | MIT        | Industry standard     |
| `react-native`     | ^0.74   | Mobile framework | MIT        | Cross-platform mobile |
| `react-native-web` | ^0.19   | Web rendering    | MIT        | Bridges RN ↔ Web      |
| `expo`             | ~51.x   | RN SDK           | MIT        | Managed workflow      |
| `expo-router`      | ~3.x    | Navigation       | MIT        | File-based routing    |
| `typescript`       | ^5.x    | Type safety      | Apache-2.0 | Language              |

---

## State Management

| Library                 | Version | Purpose           | License |
| ----------------------- | ------- | ----------------- | ------- |
| `zustand`               | ^4.x    | Global state      | MIT     |
| `immer`                 | ^10.x   | Immutable updates | MIT     |
| `@tanstack/react-query` | ^5.x    | Async state       | MIT     |
| `zod`                   | ^3.x    | Schema validation | MIT     |

---

## UI & Animation

| Library                        | Version | Purpose            | License |
| ------------------------------ | ------- | ------------------ | ------- |
| `react-native-reanimated`      | ^3.x    | 60fps animations   | MIT     |
| `react-native-gesture-handler` | ^2.x    | Touch gestures     | MIT     |
| `@shopify/react-native-skia`   | ^1.x    | Canvas/2D graphics | MIT     |
| `@shopify/flash-list`          | ^1.x    | Performant lists   | MIT     |
| `react-native-svg`             | ^15.x   | SVG rendering      | MIT     |

---

## Image Processing (WASM)

| Library              | Version | Purpose         | License  |
| -------------------- | ------- | --------------- | -------- |
| libvips (WASM build) | 8.15+   | Core processing | LGPL-2.1 |
| mozjpeg (WASM)       | 4.1+    | JPEG encoding   | BSD/MPL  |
| pngquant (WASM)      | 2.18+   | PNG lossless    | GPLv3    |
| libwebp (WASM)       | 1.3+    | WebP codec      | BSD      |
| libavif (WASM)       | 1.0+    | AVIF codec      | BSD      |
| `ffmpeg.wasm`        | ^0.12   | Video/GIF       | LGPL     |

---

## Storage

| Library             | Version | Purpose        | Platform | License    |
| ------------------- | ------- | -------------- | -------- | ---------- |
| `dexie`             | ^3.x    | IndexedDB ORM  | Web      | Apache-2.0 |
| `expo-sqlite`       | ~14.x   | SQLite         | Mobile   | MIT        |
| `expo-file-system`  | ~17.x   | File ops       | Mobile   | MIT        |
| `expo-secure-store` | ~13.x   | Secure storage | Mobile   | MIT        |

---

## Build & Tooling

| Library           | Version | Purpose         | License    |
| ----------------- | ------- | --------------- | ---------- |
| `turbo`           | ^1.13   | Monorepo builds | MIT        |
| `vite`            | ^5.x    | Web bundler     | MIT        |
| `vite-plugin-pwa` | ^0.19   | Service Worker  | MIT        |
| `vitest`          | ^1.x    | Unit testing    | MIT        |
| `playwright`      | ^1.x    | E2E testing     | Apache-2.0 |
| `eslint`          | ^8.x    | Linting         | MIT        |
| `prettier`        | ^3.x    | Formatting      | MIT        |
| `@changesets/cli` | ^2.x    | Versioning      | MIT        |

---

## Security & Utility

| Library     | Version | Purpose          | License    |
| ----------- | ------- | ---------------- | ---------- |
| `dompurify` | ^3.x    | SVG sanitization | Apache-2.0 |
| `jszip`     | ^3.x    | ZIP creation     | MIT        |
| `fflate`    | ^0.8    | Fast ZIP         | MIT        |
| `workbox-*` | ^7.x    | Service Worker   | MIT        |

---

## Adding New Libraries — Checklist

Before adding a new dependency:

- [ ] Is the feature achievable without it? (prefer native APIs)
- [ ] What is the license? GPL in main code is not allowed
- [ ] What is the bundle size impact? (use bundlephobia.com)
- [ ] Is it actively maintained? (last commit < 6 months ago)
- [ ] Does it have TypeScript types?
- [ ] Document in this file and the relevant ADR

---

_Document Owner: Architecture Team | Review Cycle: Monthly | Approved: 2026-07-27_
