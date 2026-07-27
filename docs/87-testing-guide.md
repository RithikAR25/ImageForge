# Testing Guide

> **Document ID**: 87
> **Phase**: 5 — Implementation Guides
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

This guide defines the testing strategy, tools, patterns, and examples for the ImageForge project. All developers must follow these patterns to maintain consistent, high-quality tests.

---

## Testing Strategy

| Test Type         | Tool                  | Location              | Coverage Target |
| ----------------- | --------------------- | --------------------- | --------------- |
| Unit tests        | Vitest                | Colocated with source | ≥ 80%           |
| Integration tests | Vitest                | `tests/integration/`  | Key flows       |
| E2E tests         | Playwright            | `tests/e2e/`          | All P0 features |
| Visual regression | (Phase 8)             | Chromatic             | UI components   |
| Accessibility     | axe-core + Playwright | `tests/a11y/`         | All screens     |
| Performance       | Benchmark suite       | `benchmarks/`         | Key operations  |

---

## Unit Tests (Vitest)

### Configuration

```typescript
// vitest.config.ts (root)
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node', // For packages (no DOM)
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 80,
        branches: 70,
        functions: 80,
      },
    },
  },
});
```

### Writing Unit Tests

```typescript
// packages/image-core/src/compress/compress.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCompressOperation } from './Compress';
import { MockProcessingEngine } from '../../test-utils/MockEngine';

describe('Compress Operation', () => {
  let engine: MockProcessingEngine;

  beforeEach(() => {
    engine = new MockProcessingEngine();
  });

  it('should compress JPEG at specified quality', async () => {
    const input = await loadTestImage('5mp-test.jpg');
    const operation = createCompressOperation({ codec: 'jpeg', quality: 85 });

    const result = await engine.applyOperation(input, operation);

    expect(result.fileSize).toBeLessThan(input.fileSize);
    expect(result.mimeType).toBe('image/jpeg');
  });

  it('should throw ProcessingError for invalid quality', () => {
    expect(() => createCompressOperation({ codec: 'jpeg', quality: 0 })).toThrow(ProcessingError);
    expect(() => createCompressOperation({ codec: 'jpeg', quality: 101 })).toThrow(ProcessingError);
  });

  it('should achieve target file size within ±10%', async () => {
    const input = await loadTestImage('5mp-test.jpg');
    const targetKb = 200;
    const operation = createCompressOperation({
      codec: 'jpeg',
      quality: 85,
      targetSizeKb: targetKb,
    });

    const result = await engine.applyOperation(input, operation);
    const resultKb = result.fileSize / 1024;

    expect(resultKb).toBeGreaterThan(targetKb * 0.9);
    expect(resultKb).toBeLessThan(targetKb * 1.1);
  });

  it('should handle aborted operations', async () => {
    const controller = new AbortController();
    const input = await loadTestImage('5mp-test.jpg');

    controller.abort();

    await expect(engine.applyOperation(input, operation, controller.signal)).rejects.toThrow(
      'ABORTED',
    );
  });
});
```

### Test Utilities

```typescript
// packages/image-core/src/test-utils/fixtures.ts

export async function loadTestImage(filename: string): Promise<ImageFile> {
  const buffer = await readFile(`__fixtures__/${filename}`);
  return {
    id: 'test-id',
    buffer: buffer.buffer,
    name: filename,
    mimeType: 'image/jpeg',
    width: 2500,
    height: 2000,
    fileSize: buffer.byteLength,
    exif: null,
    importedAt: new Date(),
    isDuplicate: false,
    uri: '',
    colorSpace: 'sRGB',
  };
}

export class MockProcessingEngine implements ProcessingEngine {
  isReady() {
    return true;
  }
  async initialize() {}
  dispose() {}

  async applyOperation(
    input: ImageFile,
    operation: ProcessingOperation,
    signal?: AbortSignal,
  ): Promise<ImageFile> {
    if (signal?.aborted) throw new ProcessingError('ABORTED', 'Aborted');
    // Return a deterministic mock result
    return { ...input, fileSize: Math.floor(input.fileSize * 0.7) };
  }
}
```

---

## Integration Tests

```typescript
// packages/image-core/tests/integration/pipeline.test.ts

describe('Pipeline Integration', () => {
  it('should apply compress + resize + convert pipeline', async () => {
    const engine = new MockProcessingEngine();
    const pipeline = new ImagePipeline(engine, [
      { type: 'compress', config: { codec: 'jpeg', quality: 85 } },
      { type: 'resize', config: { width: 1080, mode: 'fit', algorithm: 'lanczos3' } },
      { type: 'convert', config: { format: 'webp' } },
    ]);

    const input = await loadTestImage('5mp-test.jpg');
    const result = await pipeline.execute(input);

    expect(result.output.mimeType).toBe('image/webp');
    expect(result.output.width).toBeLessThanOrEqual(1080);
    expect(result.appliedOperations).toHaveLength(3);
  });
});
```

---

## E2E Tests (Playwright)

```typescript
// tests/e2e/compress-flow.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Compress Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForSelector('[data-testid="app-ready"]');
  });

  test('user can compress a JPEG image', async ({ page }) => {
    // Import image via file input
    const fileInput = page.locator('[data-testid="file-input"]');
    await fileInput.setInputFiles('tests/fixtures/test-5mp.jpg');

    // Wait for thumbnail
    await expect(page.locator('[data-testid="image-thumbnail"]')).toBeVisible();

    // Navigate to compress
    await page.click('[data-testid="compress-button"]');

    // Apply WhatsApp preset
    await page.click('[data-testid="preset-whatsapp"]');

    // Verify size reduction shown
    await expect(page.locator('[data-testid="size-reduction"]')).toContainText('%');

    // Download
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="download-button"]'),
    ]);

    expect(download.suggestedFilename()).toContain('.jpg');
  });

  test('no network requests for image data', async ({ page }) => {
    const imageRequests: string[] = [];

    page.on('request', (request) => {
      if (request.resourceType() === 'fetch' || request.resourceType() === 'xhr') {
        imageRequests.push(request.url());
      }
    });

    // Import and compress
    await page.locator('[data-testid="file-input"]').setInputFiles('tests/fixtures/test-5mp.jpg');
    await page.click('[data-testid="compress-button"]');

    // Verify no image was sent to any server
    const imageUploads = imageRequests.filter(
      (url) => !url.includes('localhost') && !url.includes('vitals'),
    );
    expect(imageUploads).toHaveLength(0);
  });
});
```

---

## Test File Naming Conventions

| Type        | Pattern                 | Example                        |
| ----------- | ----------------------- | ------------------------------ |
| Unit test   | `*.test.ts`             | `compress.test.ts`             |
| Integration | `*.integration.test.ts` | `pipeline.integration.test.ts` |
| E2E         | `*.spec.ts`             | `compress-flow.spec.ts`        |
| Benchmark   | `*.bench.ts`            | `compress.bench.ts`            |

---

## Test Fixtures

Test image fixtures live in `packages/image-core/__fixtures__/`:

- `test-1mp.jpg` — 1MP JPEG (1024×1024)
- `test-5mp.jpg` — 5MP JPEG (2500×2000)
- `test-transparent.png` — PNG with alpha channel
- `test-animated.gif` — Multi-frame GIF
- `test-heic.heic` — HEIC image
- `test-corrupted.jpg` — Corrupted JPEG (for error handling tests)

---

## Related Documents

| Document                                                                           | Relationship          |
| ---------------------------------------------------------------------------------- | --------------------- |
| [13-requirements-traceability-matrix.md](./13-requirements-traceability-matrix.md) | Test coverage mapping |
| [11-mvp-definition.md](./11-mvp-definition.md)                                     | MVP quality gates     |
| [80-ci-cd.md](./80-ci-cd.md)                                                       | Test execution in CI  |

---

_Document Owner: Engineering Team | Review Cycle: Per-release | Approved: 2026-07-27_
