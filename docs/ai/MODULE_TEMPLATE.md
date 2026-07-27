# Module Template

> **Document ID**: ai/MODULE_TEMPLATE
> **Phase**: AI Development
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This is the canonical template for creating a new processing module in `@imageforge/image-core`. Copy and adapt this template when adding any new operation type.

---

## File Structure to Create

```
packages/image-core/src/[operation-name]/
├── index.ts                  # Barrel exports
├── [OperationName].ts        # Public factory function
├── [OperationName].test.ts   # Unit tests
├── types.ts                  # Config + result types (if not in @imageforge/types)
└── handlers/
    ├── [operationName].web.ts    # WASM implementation
    └── [operationName].native.ts # Native bridge implementation
```

---

## Template: `MyOperation.ts`

```typescript
import { createLogger } from '@imageforge/shared';
import type { MyOperationConfig, ProcessingOperation } from '@imageforge/types';
import { ProcessingError } from '../errors/ProcessingError';

const logger = createLogger('image-core.my-operation');

/**
 * Creates a my-operation processing operation.
 *
 * @param config - Configuration for the operation
 * @returns A ProcessingOperation ready to add to a pipeline
 * @throws {ProcessingError} INVALID_INPUT if config values are out of range
 *
 * @example
 * const op = createMyOperation({ intensity: 75, mode: 'quality' });
 * const pipeline = new ImagePipeline(engine, [op]);
 */
export function createMyOperation(config: MyOperationConfig): ProcessingOperation {
  validateMyOperationConfig(config);
  logger.debug('Creating my-operation', { config });
  return { type: 'my-operation', config };
}

function validateMyOperationConfig(config: MyOperationConfig): void {
  if (config.intensity < 0 || config.intensity > 100) {
    throw new ProcessingError(
      'INVALID_INPUT',
      `Intensity must be between 0 and 100, got ${config.intensity}`,
    );
  }
  // Add more validation rules here
}
```

---

## Template: `MyOperation.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createMyOperation } from './MyOperation';
import { ProcessingError } from '../errors/ProcessingError';
import { MockProcessingEngine, mockImageFile } from '../../test-utils';

describe('createMyOperation', () => {
  it('creates operation with valid config', () => {
    const op = createMyOperation({ intensity: 75, mode: 'quality' });
    expect(op.type).toBe('my-operation');
    expect(op.config.intensity).toBe(75);
  });

  it('throws ProcessingError for negative intensity', () => {
    expect(() => createMyOperation({ intensity: -1, mode: 'quality' })).toThrow(ProcessingError);
  });

  it('throws ProcessingError for intensity > 100', () => {
    expect(() => createMyOperation({ intensity: 101, mode: 'quality' })).toThrow(ProcessingError);
  });
});

describe('my-operation execution', () => {
  let engine: MockProcessingEngine;

  beforeEach(() => {
    engine = new MockProcessingEngine();
  });

  it('processes image successfully', async () => {
    const image = mockImageFile();
    const op = createMyOperation({ intensity: 75, mode: 'quality' });
    const result = await engine.applyOperation(image, op);
    expect(result.output).toBeDefined();
  });

  it('respects AbortSignal cancellation', async () => {
    const controller = new AbortController();
    controller.abort();

    const image = mockImageFile();
    const op = createMyOperation({ intensity: 75, mode: 'quality' });

    await expect(engine.applyOperation(image, op, controller.signal)).rejects.toMatchObject({
      code: 'ABORTED',
    });
  });
});
```

---

## Template: `handlers/myOperation.web.ts`

```typescript
import { getVipsModule } from '../../wasm/VipsModule';
import { ProcessingError } from '../../errors/ProcessingError';
import { createLogger } from '@imageforge/shared';
import type { MyOperationConfig } from '@imageforge/types';

const logger = createLogger('image-core.my-operation.wasm');

export async function applyMyOperation(
  buffer: ArrayBuffer,
  config: MyOperationConfig,
  signal?: AbortSignal,
): Promise<ArrayBuffer> {
  signal?.throwIfAborted();

  logger.debug('Applying my-operation', { intensity: config.intensity });

  try {
    const vips = await getVipsModule();
    signal?.throwIfAborted();

    const image = vips.Image.newFromBuffer(buffer);

    // === YOUR LIBVIPS OPERATIONS HERE ===
    const processed = image; // Replace with actual operation
    // =====================================

    const output = processed.writeToBuffer('.jpg');
    image.delete();
    processed.delete();

    return output;
  } catch (err: unknown) {
    if (err instanceof ProcessingError) throw err;
    logger.error('my-operation WASM failed', err);
    throw new ProcessingError('PROCESSING_FAILED', 'My operation failed', err);
  }
}
```

---

## Template: `index.ts`

```typescript
export { createMyOperation } from './MyOperation';
export type { MyOperationConfig } from './types';
```

---

## Registration Step

After creating the module files, register the handler in the pipeline registry:

```typescript
// packages/image-core/src/pipeline/operationRegistry.ts
import { applyMyOperation } from '../my-operation/handlers/myOperation.web';

export const operationRegistry = {
  // ... existing operations
  'my-operation': applyMyOperation,
};
```

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
