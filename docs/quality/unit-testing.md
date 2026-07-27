# Unit Testing Guide

> **Document ID**: quality/unit-testing
> **Phase**: 8 — Quality
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

This document defines the unit testing strategy — framework, patterns, mocking approach, and coverage requirements.

---

## Framework

- **Runner**: Vitest 1.x (Vite-native, Jest-compatible API)
- **React testing**: `@testing-library/react-native`
- **Mocking**: `vitest` built-in (`vi.fn()`, `vi.mock()`, `vi.spyOn()`)
- **Coverage**: `@vitest/coverage-v8`

---

## Test File Conventions

```
# Co-located with source file
packages/image-core/src/compress/
├── Compress.ts
├── Compress.test.ts       ← Unit tests
└── Compress.integration.ts ← Integration tests (optional)
```

---

## Test Patterns

### Processing Operation Tests

```typescript
// packages/image-core/src/compress/Compress.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCompressOperation, validateCompressConfig } from './Compress';
import { ProcessingError } from '../errors/ProcessingError';
import { MockProcessingEngine, loadTestImage } from '../../test-utils';

describe('createCompressOperation', () => {
  it('creates operation with valid config', () => {
    const op = createCompressOperation({ codec: 'jpeg', quality: 85 });
    expect(op.type).toBe('compress');
    expect(op.config.codec).toBe('jpeg');
    expect(op.config.quality).toBe(85);
  });

  it('throws ProcessingError for quality below 1', () => {
    expect(() => createCompressOperation({ codec: 'jpeg', quality: 0 })).toThrow(ProcessingError);
  });

  it('throws ProcessingError for quality above 100', () => {
    expect(() => createCompressOperation({ codec: 'jpeg', quality: 101 })).toThrow(ProcessingError);
  });
});

describe('compression pipeline execution', () => {
  let engine: MockProcessingEngine;

  beforeEach(() => {
    engine = new MockProcessingEngine();
  });

  it('should produce output smaller than input for JPEG Q=85', async () => {
    const image = await loadTestImage('5mp.jpg');
    const op = createCompressOperation({ codec: 'jpeg', quality: 85 });

    const result = await engine.applyOperation(image, op);

    expect(result.output.fileSize).toBeLessThan(image.fileSize);
  });

  it('should respect AbortSignal', async () => {
    const controller = new AbortController();
    controller.abort();

    const image = await loadTestImage('5mp.jpg');
    const op = createCompressOperation({ codec: 'jpeg', quality: 85 });

    await expect(engine.applyOperation(image, op, controller.signal)).rejects.toMatchObject({
      code: 'ABORTED',
    });
  });
});
```

### Zustand Store Tests

```typescript
// packages/shared/src/stores/imageStore.test.ts

import { renderHook, act } from '@testing-library/react-native';
import { useImageStore } from './imageStore';

describe('imageStore', () => {
  it('adds image correctly', () => {
    const { result } = renderHook(() => useImageStore());

    act(() => {
      result.current.addImage(mockImageFile({ id: 'img-1' }));
    });

    expect(result.current.images).toHaveLength(1);
    expect(result.current.images[0].id).toBe('img-1');
  });

  it('removes image by id', () => {
    const { result } = renderHook(() => useImageStore());

    act(() => {
      result.current.addImage(mockImageFile({ id: 'img-1' }));
      result.current.removeImage('img-1');
    });

    expect(result.current.images).toHaveLength(0);
  });
});
```

---

## Coverage Requirements

| Package                  | Minimum Coverage      |
| ------------------------ | --------------------- |
| `@imageforge/types`      | N/A (no runtime code) |
| `@imageforge/shared`     | 80%                   |
| `@imageforge/image-core` | 85%                   |
| `@imageforge/hooks`      | 75%                   |
| `@imageforge/ui`         | 70%                   |

Coverage is enforced in CI via:

```typescript
// vitest.config.ts
coverage: {
  thresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
},
```

---

## Mock Utilities

```typescript
// packages/test-utils/src/index.ts

export function mockImageFile(overrides?: Partial<ImageFile>): ImageFile {
  return {
    id: 'test-img-1' as ImageId,
    uri: '',
    buffer: new ArrayBuffer(1024 * 100), // 100KB placeholder
    name: 'test.jpg',
    mimeType: 'image/jpeg',
    width: 2500,
    height: 2000,
    fileSize: 1024 * 100,
    colorSpace: 'sRGB',
    exif: null,
    importedAt: new Date('2026-01-01'),
    isDuplicate: false,
    ...overrides,
  };
}

export class MockProcessingEngine implements ProcessingEngine {
  isReady() {
    return true;
  }
  async initialize() {}

  async applyOperation(image, op, signal) {
    signal?.throwIfAborted();
    // Return smaller fake output
    return {
      input: image,
      output: { ...image, fileSize: Math.floor(image.fileSize * 0.7) },
      metadata: { duration: 100, engine: 'mock' },
    };
  }
}
```

---

_Document Owner: Engineering Team | Approved: 2026-07-27_
