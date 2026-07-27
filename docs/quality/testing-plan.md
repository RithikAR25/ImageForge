# Testing Plan

> **Document ID**: quality/testing-plan
> **Phase**: 8 — Quality
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

The overall test strategy for ImageForge — what types of tests exist, what they cover, and how they are executed.

---

## Testing Pyramid

```
         /\
        /E2E\           ← Playwright (~50 tests)
       /──────\
      /Integration\     ← Vitest integration (~200 tests)
     /──────────────\
    /   Unit Tests   \  ← Vitest unit (~800 tests)
   /──────────────────\
```

---

## Test Types

### Unit Tests (Vitest)

**What**: Individual functions, classes, hooks in isolation.
**Where**: `packages/*/src/**/*.test.ts`
**Runs on**: Every PR, every commit in development
**Coverage target**: 80% minimum

Key areas:

- All `createXxxOperation()` factory functions
- Config validation logic
- Zustand store actions
- Utility functions
- Custom hooks (with mock stores)

### Integration Tests (Vitest)

**What**: Multiple modules working together — pipeline with operations, store with hooks.
**Where**: `packages/*/src/**/*.integration.ts`
**Runs on**: Every PR

Key scenarios:

- Full pipeline: import → resize → compress → export
- Batch orchestrator with multiple operations
- Store + hook interactions
- IndexedDB read/write roundtrips (Dexie mock)

### E2E Tests (Playwright)

**What**: Real browser, real user interactions, real WASM processing.
**Where**: `apps/web/e2e/`
**Runs on**: Merge to main + nightly
**Browsers**: Chromium, Firefox, WebKit

Key flows:

- Import → compress → download (critical path)
- Batch of 10 images
- Undo/redo
- Settings persistence
- PWA install
- **Privacy**: zero network requests for image data

### Visual Regression Tests (Phase 2)

**Tool**: Playwright screenshots + pixel diff
**What**: UI components and screen layouts
**Runs on**: Weekly

---

## Test Environment

```
CI environment: ubuntu-latest (GitHub Actions)
Node.js: 20 LTS
Browsers: Playwright-bundled Chromium, Firefox, WebKit
WASM: Loaded from local dist/ (not CDN)
```

---

## Running Tests Locally

```bash
# All tests
pnpm test

# Specific package
pnpm --filter @imageforge/image-core test

# E2E tests (requires built web app)
pnpm build --filter=@imageforge/web
cd apps/web && pnpm e2e

# E2E with UI (watch mode)
cd apps/web && pnpm e2e --ui

# Coverage report
pnpm test --coverage
open coverage/index.html
```

---

## CI Test Matrix

| Test Suite          | Trigger       | Duration | Failure Action      |
| ------------------- | ------------- | -------- | ------------------- |
| Unit + Integration  | Every PR      | ~3 min   | Block merge         |
| E2E (Chromium only) | Every PR      | ~8 min   | Block merge         |
| E2E (all browsers)  | Merge to main | ~20 min  | Alert + rollback    |
| Benchmarks          | Weekly        | ~30 min  | Alert if regression |
| Security audit      | Weekly        | ~2 min   | Alert               |
| Visual regression   | Weekly        | ~15 min  | Alert               |

---

## Flaky Test Policy

A flaky test (fails intermittently) must be:

1. Investigated within 48 hours
2. Fixed or skipped with `test.skip()` + `// FLAKY: [issue link]`
3. Never left failing without a tracking issue

---

_Document Owner: Engineering Team | Approved: 2026-07-27_
