# Decision Log

> **Purpose**: A chronological record of all major architectural, product, and technical decisions made during the design and development of ImageForge.
>
> **Scope**: Project-wide. Every decision that significantly affects architecture, user experience, or engineering trade-offs must be logged here.
>
> **Note**: For formal Architecture Decision Records with full context and trade-off analysis, see [adr/](./adr/). This log provides a quick-reference timeline.
>
> **References**: [ADR Index](./21-architecture-decision-records.md) · [Assumptions & Constraints](./16-assumptions-and-constraints.md)

---

## Decision Format

Each entry contains:

- **ID**: Unique sequential identifier
- **Date**: Decision date (ISO 8601)
- **Category**: Architecture / Product / Technical / Process
- **Status**: Proposed / Accepted / Superseded / Deprecated
- **Decision**: What was decided
- **Rationale**: Why this decision was made
- **Impact**: What this affects
- **ADR**: Link to full ADR document if one exists

---

## Decision Log

---

### DL-001 — Monorepo Architecture

| Field        | Value                                  |
| ------------ | -------------------------------------- |
| **ID**       | DL-001                                 |
| **Date**     | 2026-07-27                             |
| **Category** | Architecture                           |
| **Status**   | Accepted                               |
| **ADR**      | [ADR-0001](./adr/ADR-0001-monorepo.md) |

**Decision**: Adopt a monorepo structure using **Turborepo** for the ImageForge project.

**Rationale**: A monorepo enables atomic commits across shared packages and apps, simplifies dependency management, and provides a single source of truth for the codebase. Turborepo was chosen over Nx for its simpler configuration and excellent Expo/React Native support. pnpm Workspaces handle package linking.

**Impact**: All apps (`apps/web`, `apps/mobile`) and packages (`packages/image-core`, `packages/ui`, etc.) live in a single repository. CI/CD pipelines are built around Turborepo's task graph.

**Alternatives Considered**: Polyrepo (rejected — synchronization overhead), Nx (rejected — over-engineered for this use case), Lerna (rejected — superseded by Turborepo).

---

### DL-002 — React Native Web for Cross-Platform Web Support

| Field        | Value                                          |
| ------------ | ---------------------------------------------- |
| **ID**       | DL-002                                         |
| **Date**     | 2026-07-27                                     |
| **Category** | Architecture                                   |
| **Status**   | Accepted                                       |
| **ADR**      | [ADR-0002](./adr/ADR-0002-react-native-web.md) |

**Decision**: Use **React Native Web (RNW)** for the web application rather than a separate Next.js or plain React app.

**Rationale**: RNW maximizes code sharing between mobile and web — components, hooks, business logic, and state management are all shared. The trade-off is some web-specific limitations (complex CSS, SEO), but for an image processing tool (not a content site), these are acceptable. The web app is a tool, not a landing page.

**Impact**: `StyleSheet.create` instead of CSS, RNW-compatible component primitives, platform-specific file extensions (`.web.ts`, `.native.ts`) for divergent implementations.

**Alternatives Considered**: Next.js (rejected — poor RN component sharing), separate React app (rejected — code duplication), Expo Router Web (evaluated — integrated into the decision, used for navigation).

---

### DL-003 — Zustand for State Management

| Field        | Value                                          |
| ------------ | ---------------------------------------------- |
| **ID**       | DL-003                                         |
| **Date**     | 2026-07-27                                     |
| **Category** | Technical                                      |
| **Status**   | Accepted                                       |
| **ADR**      | [ADR-0003](./adr/ADR-0003-state-management.md) |

**Decision**: Use **Zustand** for client-side synchronous state management.

**Rationale**: Zustand offers a minimal API, excellent TypeScript support, tiny bundle size (~1KB), and no provider boilerplate. For an image processing app, state is primarily local (current image, processing options, queue status) — Redux's complexity is unwarranted. TanStack Query handles async/server state.

**Impact**: Global state is organized into domain stores (image store, queue store, settings store, history store). Stores are co-located with feature packages.

**Alternatives Considered**: Redux Toolkit (rejected — boilerplate overhead, large bundle), Jotai (evaluated — very similar, Zustand chosen for explicit store style), MobX (rejected — class-based, harder to tree-shake), Context API (rejected — performance concerns at this scale).

---

### DL-004 — WebAssembly for Web Image Processing

| Field        | Value                                       |
| ------------ | ------------------------------------------- |
| **ID**       | DL-004                                      |
| **Date**     | 2026-07-27                                  |
| **Category** | Architecture                                |
| **Status**   | Accepted                                    |
| **ADR**      | [ADR-0004](./adr/ADR-0004-image-library.md) |

**Decision**: Use **libvips compiled to WebAssembly** as the primary image processing engine on Web.

**Rationale**: Client-side WASM processing is the only approach that satisfies all three core principles simultaneously: privacy-first (images never leave the device), offline-first (no server dependency), and high-performance (near-native throughput). Browser Canvas API alone lacks professional-grade operations (curves, LUTs, AVIF encoding). libvips is the gold standard in image processing libraries.

**Impact**: WASM binary (~3–5MB) must be loaded and initialized on startup. Processing runs in a Web Worker pool to avoid blocking the UI thread. Initial load time is a known trade-off.

**Alternatives Considered**: Server-side processing (rejected — violates privacy-first), browser Canvas API only (rejected — insufficient feature set), sharp.js (rejected — Node.js only, not browser-compatible), Jimp (rejected — pure JS, too slow for large images).

---

### DL-005 — Expo Managed Workflow

| Field        | Value                                      |
| ------------ | ------------------------------------------ |
| **ID**       | DL-005                                     |
| **Date**     | 2026-07-27                                 |
| **Category** | Architecture                               |
| **Status**   | Accepted                                   |
| **ADR**      | [ADR-0009](./adr/ADR-0009-expo-vs-bare.md) |

**Decision**: Use **Expo Managed Workflow** for the mobile application.

**Rationale**: Expo Managed provides the fastest path to a working cross-platform native app, with OTA updates, EAS Build, and EAS Submit integrated. For features requiring native modules not in Expo's SDK (e.g., custom libvips integration), Expo's Config Plugins allow native code injection without ejecting.

**Impact**: `apps/mobile` is an Expo managed project. Native modules are integrated via Config Plugins. EAS Build handles CI/CD native builds.

**Alternatives Considered**: Bare React Native (rejected — loses OTA updates and EAS convenience), Expo Go only (rejected — insufficient for custom native modules).

---

### DL-006 — Privacy-First Architecture (Client-Side Processing Default)

| Field        | Value      |
| ------------ | ---------- |
| **ID**       | DL-006     |
| **Date**     | 2026-07-27 |
| **Category** | Product    |
| **Status**   | Accepted   |

**Decision**: All image processing must occur on-device by default. No image data is transmitted to any server without explicit user consent.

**Rationale**: Privacy is a core differentiator for ImageForge. Users processing personal photos, medical images, or proprietary business images should never need to trust a cloud service. This also enables offline functionality as a natural byproduct.

**Impact**: The optional backend is limited to non-image tasks (telemetry opt-in, future account sync). All processing libraries (libvips, FFmpeg, Tesseract, etc.) must have client-side deployable forms.

**Alternatives Considered**: Hybrid (server for heavy tasks) — rejected for MVP; optional server processing — may be introduced in Phase 3 as an opt-in for large batches.

---

### DL-007 — Feature-First Monorepo Package Structure

| Field        | Value        |
| ------------ | ------------ |
| **ID**       | DL-007       |
| **Date**     | 2026-07-27   |
| **Category** | Architecture |
| **Status**   | Accepted     |

**Decision**: Organize shared packages by domain/feature rather than by technical layer.

**Rationale**: Layer-first organization (`models/`, `services/`, `utils/`) causes cross-cutting changes to touch many packages. Feature-first means changes to the Compress feature primarily touch `packages/image-core/compress/`. This improves developer locality, simplifies ownership, and scales with open-source contributors who own individual features.

**Impact**: Package structure: `packages/image-core/` contains processing logic organized by feature. `packages/ui/` contains components organized by feature. Cross-cutting concerns (types, utilities) live in `packages/shared/`.

**Alternatives Considered**: Layer-first (rejected — high coupling across packages), single-package (rejected — no clear boundaries, hard to test), micro-packages per feature (evaluated — too granular for this scale).

---

### DL-008 — TanStack Query for Async Processing State

| Field        | Value      |
| ------------ | ---------- |
| **ID**       | DL-008     |
| **Date**     | 2026-07-27 |
| **Category** | Technical  |
| **Status**   | Accepted   |

**Decision**: Use **TanStack Query** for managing asynchronous image processing operations and their state.

**Rationale**: Image processing operations are inherently async. TanStack Query provides built-in loading/error/success states, background refetching, query invalidation, and mutation patterns. Using it for processing jobs gives consistent patterns for: upload progress, processing progress, result caching, and retry logic.

**Impact**: Processing operations are modeled as TanStack Query mutations. Results are cached by operation + parameters. Queue state bridges Zustand (order/UI) and TanStack Query (execution status).

---

### DL-009 — React Native Skia for Canvas Operations

| Field        | Value      |
| ------------ | ---------- |
| **ID**       | DL-009     |
| **Date**     | 2026-07-27 |
| **Category** | Technical  |
| **Status**   | Accepted   |

**Decision**: Use **React Native Skia** for all canvas-based rendering (filter previews, drawing tools, real-time effects).

**Rationale**: Skia provides a unified canvas API that runs on Android, iOS, and Web (via CanvasKit WASM). It supports GLSL shaders, enabling GPU-accelerated filter previews. Alternative: `react-native-canvas` (Web-only Canvas API wrapper) — rejected due to API differences. React Native SVG alone lacks raster capabilities.

**Impact**: Filter previews render at 60fps using GPU shaders. Drawing tools have consistent behavior across platforms. Bundle size increased by CanvasKit WASM (~3MB) on Web.

---

### DL-010 — No Authentication in MVP

| Field        | Value      |
| ------------ | ---------- |
| **ID**       | DL-010     |
| **Date**     | 2026-07-27 |
| **Category** | Product    |
| **Status**   | Accepted   |

**Decision**: The MVP will not include user authentication or cloud accounts.

**Rationale**: Authentication adds significant complexity (OAuth flows, token management, backend infrastructure, security surface). For an open-source image processing tool, anonymous usage is the primary use case. Adding auth before validating core product-market fit is premature optimization.

**Impact**: No user accounts, no cloud sync in MVP. All data is local. Future enhancement (Phase 3+): optional GitHub OAuth for settings sync, processing history backup.

**Assumptions**: This decision is revisited in Phase 3 based on community feedback.

---

### DL-011 — MIT License

| Field        | Value      |
| ------------ | ---------- |
| **ID**       | DL-011     |
| **Date**     | 2026-07-27 |
| **Category** | Process    |
| **Status**   | Accepted   |

**Decision**: ImageForge is published under the **MIT License**.

**Rationale**: MIT is the most permissive and widely adopted open-source license. It maximizes adoption, commercial use, and contribution. The project's goal is to be a flagship reference implementation, not a monetized product.

**Impact**: All contributions must be compatible with MIT. Dependencies must have compatible licenses (MIT, Apache 2.0, BSD). GPL-licensed dependencies must be reviewed and may require separation into optional modules.

---

### DL-012 — Vercel for Web Deployment

| Field        | Value      |
| ------------ | ---------- |
| **ID**       | DL-012     |
| **Date**     | 2026-07-27 |
| **Category** | Technical  |
| **Status**   | Accepted   |

**Decision**: Deploy the web application to **Vercel**.

**Rationale**: Vercel offers zero-configuration deployment for React/Vite apps, global CDN edge network, automatic preview deployments per PR, and excellent WASM serving support (correct MIME types, COOP/COEP headers required for SharedArrayBuffer). The free tier supports the open-source project.

**Impact**: `apps/web` is configured for Vercel deployment. `vercel.json` sets required security headers for WASM SharedArrayBuffer usage.

**Alternatives Considered**: Netlify (evaluated — similar features, Vercel has better WASM header support), GitHub Pages (rejected — no server-side header configuration), Cloudflare Pages (evaluated — strong alternative, Vercel chosen for ecosystem familiarity).

---

_Document maintained by: Architecture Team | Last updated: 2026-07-27_
