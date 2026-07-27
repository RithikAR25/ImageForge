# AI System Prompt

> **Document ID**: ai/SYSTEM_PROMPT
> **Phase**: AI Development
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This is the system prompt / context document for AI coding assistants working on ImageForge. Paste or reference this when starting a new AI coding session.

---

## Project Identity

You are working on **ImageForge** — an open-source, privacy-first, cross-platform image processing application.

**Stack**: React Native + React Native Web + TypeScript + Expo + Turborepo + Vite
**Target platforms**: Web (Vite + RNW), iOS (Expo), Android (Expo)
**Architecture**: Feature-first monorepo with shared packages

---

## Core Constraint (CRITICAL)

**Images NEVER leave the user's device.**

- No network requests for image data
- No server-side processing
- All processing happens via WASM (Web) or Native modules (Mobile)
- This is a non-negotiable privacy guarantee

---

## Package Structure

```
packages/types          → TypeScript interfaces (zero runtime)
packages/shared         → Stores, utilities, constants
packages/image-core     → Processing engine + business logic
packages/hooks          → React hooks
packages/ui             → React Native components + screens
apps/web                → Vite + RNW web app
apps/mobile             → Expo mobile app
```

---

## Key Architectural Patterns

1. **Adapter pattern** for platform differences:
   - `storage.web.ts` ↔ `storage.native.ts` (same export name, different impl)
   - `engine.web.ts` ↔ `engine.native.ts`

2. **Unidirectional data flow**:
   - Zustand stores for global state
   - TanStack Query for async/mutation state
   - No component-to-component direct communication

3. **Processing pipeline**:
   - `ImagePipeline.execute(image, operations[])`
   - Dispatches to `WasmWorkerPool` (web) or native bridge (mobile)
   - Returns `ProcessingResult`

4. **Error handling**:
   - Always use `ProcessingError | ImportError | StorageError` (never raw `Error`)
   - Always log before throwing
   - Always check `AbortSignal`

---

## Design System

- Color tokens: `colors.brand.primary`, `colors.background.default`, `colors.text.primary`, etc.
- Typography: Inter font, tokens in `packages/ui/src/tokens/typography.ts`
- Spacing: 8pt grid (`spacing[1]` = 8px, `spacing[2]` = 16px, etc.)
- Always use `useTheme()` — never hardcode colors or spacing values

---

## Code Quality Gates

Every PR must pass:

- `pnpm lint` (ESLint)
- `pnpm typecheck` (TypeScript strict)
- `pnpm test --coverage` (≥ 80% coverage)
- Playwright E2E tests
- Lighthouse ≥ 85 performance

---

## Documentation Required

All new code must include:

- JSDoc on exported functions (with `@example`, `@throws`)
- Unit tests at `[file].test.ts` (happy path + error cases + abort)
- Feature spec update in `docs/features/[feature].md` if adding a feature

---

## Anti-Patterns to Avoid

- ❌ `any` type
- ❌ Inline styles (use `StyleSheet.create`)
- ❌ Raw hex colors (use design tokens)
- ❌ Silent catch blocks
- ❌ Network requests for image data (ever)
- ❌ `console.log` (use `createLogger('context')`)
- ❌ React Native imports in `packages/image-core` or `packages/shared`
- ❌ Missing `accessibilityLabel` on interactive elements

---

## Key Documents to Read

For complex tasks, read these first:

- [22-high-level-design.md](../22-high-level-design.md) — System overview
- [29-image-processing-pipeline.md](../29-image-processing-pipeline.md) — Processing architecture
- [35-state-management.md](../35-state-management.md) — Store patterns
- [39-error-handling-strategy.md](../39-error-handling-strategy.md) — Error patterns

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
