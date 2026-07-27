# How to Add a Feature

> **Document ID**: development/how-to-add-feature
> **Phase**: Development Guides
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

Step-by-step guide for adding a new image processing feature to ImageForge.

---

## Overview

Adding a new processing feature involves:

1. Types and config schema
2. Business logic (image-core)
3. WASM/Native adapter
4. UI controls
5. Tests and documentation

---

## Step 1: Define Types

```typescript
// packages/types/src/operations/MyFeatureConfig.ts

export interface MyFeatureConfig {
  /** Intensity 0-100 */
  readonly intensity: number;
  readonly mode: 'fast' | 'quality';
}

// Add to the union in ProcessingOperation
// packages/types/src/ProcessingOperation.ts
type ProcessingOperation =
  | ...existing...
  | { type: 'my-feature'; config: MyFeatureConfig };
```

---

## Step 2: Business Logic

```typescript
// packages/image-core/src/my-feature/MyFeature.ts

import { createLogger } from '@imageforge/shared';
import { MyFeatureConfig, ProcessingOperation } from '@imageforge/types';
import { ProcessingError } from '../errors/ProcessingError';

const logger = createLogger('image-core.my-feature');

export function createMyFeatureOperation(config: MyFeatureConfig): ProcessingOperation {
  validateMyFeatureConfig(config);
  return { type: 'my-feature', config };
}

function validateMyFeatureConfig(config: MyFeatureConfig): void {
  if (config.intensity < 0 || config.intensity > 100) {
    throw new ProcessingError('INVALID_INPUT', `Intensity must be 0-100, got ${config.intensity}`);
  }
}
```

---

## Step 3: WASM Adapter (Web)

```typescript
// packages/image-core/src/engines/wasm/handlers/myFeature.ts

export async function applyMyFeature(
  buffer: ArrayBuffer,
  config: MyFeatureConfig,
  signal?: AbortSignal,
): Promise<ArrayBuffer> {
  signal?.throwIfAborted();

  const module = await getVipsModule(); // Lazy-load libvips WASM

  // Use libvips operations
  const image = module.Image.newFromBuffer(buffer);
  const result = image.linear([config.intensity / 100], [0]); // Example

  return result.writeToBuffer('.jpg');
}
```

---

## Step 4: Native Adapter (Mobile)

```typescript
// packages/image-core/src/engines/native/handlers/myFeature.native.ts

import { NativeModules } from 'react-native';

export async function applyMyFeature(
  uri: string,
  config: MyFeatureConfig,
  signal?: AbortSignal,
): Promise<{ uri: string }> {
  signal?.throwIfAborted();

  return NativeModules.ImageProcessingModule.applyEffect(uri, {
    type: 'my-feature',
    intensity: config.intensity,
    mode: config.mode,
  });
}
```

---

## Step 5: Register in Pipeline Registry

```typescript
// packages/image-core/src/pipeline/operationRegistry.ts

import { applyMyFeature } from '../engines/wasm/handlers/myFeature';

export const operationRegistry: Record<string, OperationHandler> = {
  compress: applyCompress,
  resize: applyResize,
  // ... existing ops
  'my-feature': applyMyFeature, // ← Add here
};
```

---

## Step 6: UI Controls

```typescript
// packages/ui/src/feature/MyFeatureControls/MyFeatureControls.tsx

import { Slider, FormField, Button } from '../../components';
import { useTheme } from '../../theme';
import { createMyFeatureOperation } from '@imageforge/image-core';

interface MyFeatureControlsProps {
  onApply: (operation: ProcessingOperation) => void;
}

export function MyFeatureControls({ onApply }: MyFeatureControlsProps) {
  const [intensity, setIntensity] = useState(75);
  const { colors } = useTheme();

  const handleApply = () => {
    onApply(createMyFeatureOperation({ intensity, mode: 'quality' }));
  };

  return (
    <View>
      <FormField label="Intensity">
        <Slider
          value={intensity}
          min={0} max={100}
          onChange={setIntensity}
          accessibilityLabel="Feature intensity"
        />
      </FormField>
      <Button variant="primary" onPress={handleApply}>
        Apply
      </Button>
    </View>
  );
}
```

---

## Step 7: Write Tests

```typescript
// packages/image-core/src/my-feature/MyFeature.test.ts

describe('MyFeature', () => {
  it('creates valid operation with default config', () => {
    const op = createMyFeatureOperation({ intensity: 75, mode: 'quality' });
    expect(op.type).toBe('my-feature');
    expect(op.config.intensity).toBe(75);
  });

  it('throws for out-of-range intensity', () => {
    expect(() => createMyFeatureOperation({ intensity: 150, mode: 'quality' })).toThrow(
      ProcessingError,
    );
  });
});
```

---

## Step 8: Write Documentation

Create `docs/features/my-feature.md` using the feature spec template:

```
- Overview
- Functional requirements list
- Technical implementation
- UI layout
- Performance targets
```

---

## Step 9: Add Feature Flag

```typescript
// packages/shared/src/flags/flags.ts
ENABLE_MY_FEATURE: process.env.NODE_ENV === 'development', // Off by default
```

---

## Done! PR Checklist

- [ ] Types defined in `packages/types`
- [ ] Business logic in `packages/image-core`
- [ ] WASM handler written
- [ ] Native handler written
- [ ] Registered in `operationRegistry.ts`
- [ ] UI controls in `packages/ui`
- [ ] Unit tests (≥ 80% coverage)
- [ ] Feature flag added
- [ ] Feature doc in `docs/features/`
- [ ] `pnpm changeset` run

---

_Document Owner: Engineering Team | Approved: 2026-07-27_
