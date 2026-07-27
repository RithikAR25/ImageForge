# Plugin API Reference

> **Document ID**: api/plugin-api
> **Phase**: API Documentation
> **Status**: Approved (Phase 2)
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Overview

The ImageForge Plugin API allows developers to extend ImageForge with custom processing operations, UI elements, and export destinations.

---

## Installation

```bash
npm install @imageforge/plugin-sdk
```

---

## Quick Start

```typescript
import { createPlugin } from '@imageforge/plugin-sdk';

export const plugin = createPlugin({
  id: 'my-org.my-plugin',
  name: 'My Custom Plugin',
  version: '1.0.0',

  operations: [
    {
      id: 'vintage-warm',
      name: 'Vintage Warm',
      category: 'effects',

      config: {
        intensity: {
          type: 'slider',
          min: 0,
          max: 100,
          default: 75,
          label: 'Intensity',
        },
      },

      async process(buffer, config, signal) {
        // Process image and return ArrayBuffer
        return processedBuffer;
      },
    },
  ],
});
```

---

## `createPlugin(descriptor)`

Creates a plugin definition.

### Parameters

| Field         | Type                       | Required | Description                          |
| ------------- | -------------------------- | -------- | ------------------------------------ |
| `id`          | `string`                   | ✅       | Unique plugin ID (`org.plugin-name`) |
| `name`        | `string`                   | ✅       | Human-readable name                  |
| `version`     | `string`                   | ✅       | SemVer string                        |
| `description` | `string`                   | —        | Plugin description                   |
| `operations`  | `OperationDescriptor[]`    | ✅       | Array of operations                  |
| `onLoad`      | `(api: PluginAPI) => void` | —        | Called when plugin is loaded         |
| `onUnload`    | `() => void`               | —        | Called when plugin is unloaded       |

---

## `OperationDescriptor`

Describes a single processing operation.

| Field      | Type           | Description                                     |
| ---------- | -------------- | ----------------------------------------------- |
| `id`       | `string`       | Unique within the plugin                        |
| `name`     | `string`       | Display name                                    |
| `category` | `string`       | UI grouping ('effects', 'adjust', 'transform')  |
| `config`   | `ConfigSchema` | Declarative config schema for auto-generated UI |
| `process`  | `ProcessFn`    | The actual processing function                  |

### `process(buffer, config, signal)`

```typescript
type ProcessFn = (
  buffer: ArrayBuffer, // Input image (copy — plugin cannot modify original)
  config: Record<string, unknown>, // Values from config schema
  signal?: AbortSignal, // Cancellation support
) => Promise<ArrayBuffer>; // Return processed image
```

---

## Config Schema Types

```typescript
type ConfigField =
  | { type: 'slider'; min: number; max: number; default: number; label: string; step?: number }
  | { type: 'toggle'; default: boolean; label: string }
  | { type: 'select'; options: string[]; default: string; label: string }
  | { type: 'color'; default: string; label: string }
  | { type: 'number'; min?: number; max?: number; default: number; label: string };
```

---

## Security Constraints

Plugins execute in a sandboxed iframe with no access to:

- ❌ Host page DOM
- ❌ localStorage, IndexedDB
- ❌ Arbitrary network requests (CSP enforced)
- ❌ Original image file (receives a copy via `postMessage`)

Plugins CAN access:

- ✅ Canvas API
- ✅ WebAssembly
- ✅ Math, encoding utilities
- ✅ `fetch` to approved domains (declared in manifest)

---

## Publishing a Plugin

1. Create a `plugin.json` manifest (see [31-plugin-system.md](../31-plugin-system.md))
2. Host your plugin JS at a stable URL with CORS headers
3. Submit to the ImageForge Plugin Registry at `registry.imageforge.app`
4. After security review, plugin appears in the marketplace

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
