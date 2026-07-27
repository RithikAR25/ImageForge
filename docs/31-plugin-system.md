# Plugin System

> **Document ID**: 31
> **Phase**: 2 — Architecture
> **Status**: Approved (Phase 2 feature)
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document defines the ImageForge plugin system architecture — how third-party developers can extend ImageForge with custom processing operations, UI components, and workflows while maintaining security and stability.

---

## Plugin System Goals

1. **Extensibility**: Anyone can add new processing operations
2. **Safety**: Plugins cannot access user data beyond what they're given
3. **Discoverability**: Plugin registry and marketplace
4. **Stability**: Malicious/buggy plugins cannot crash the host application
5. **Developer Experience**: Simple plugin API, good documentation

---

## Plugin Types

| Type               | Description                             | Example             |
| ------------------ | --------------------------------------- | ------------------- |
| **Process Plugin** | Adds a new image processing operation   | Vintage filter pack |
| **Export Plugin**  | Adds a new export format or destination | Export to S3        |
| **Import Plugin**  | Adds a new import source                | Import from Dropbox |
| **UI Plugin**      | Adds a custom UI panel                  | Color palette tool  |

---

## Plugin Manifest Schema

Every plugin has a `plugin.json`:

```json
{
  "$schema": "https://imageforge.app/schemas/plugin/v1.json",
  "id": "community.vintage-effects",
  "name": "Vintage Effects Pack",
  "version": "1.2.0",
  "description": "10 professional vintage photo effects using LUTs",
  "author": "Jane Smith <jane@example.com>",
  "license": "MIT",
  "repository": "https://github.com/janesmith/imageforge-vintage",
  "type": "process",
  "permissions": ["process-image"],
  "entryPoint": "https://cdn.example.com/vintage-effects/v1.2.0/index.js",
  "checksum": {
    "algorithm": "sha256",
    "value": "a1b2c3d4e5f6..."
  },
  "compatibility": {
    "imageforge": ">=1.0.0"
  }
}
```

---

## Execution Sandbox

### Web: Sandboxed iframe

```html
<!-- Plugin loaded in a sandboxed iframe -->
<iframe
  src="blob:..."
  sandbox="allow-scripts"
  <!-- No: allow-same-origin, allow-storage-access -->
  <!-- No: allow-downloads, allow-forms -->
/>
```

The iframe:

- Has no access to `localStorage`, `IndexedDB`, cookies
- Cannot access parent document's DOM
- Cannot make arbitrary network requests (CSP applied to the iframe)
- Cannot access the file system

### Message Protocol

```typescript
// Host → Plugin
interface HostToPluginMessage {
  type: 'process';
  requestId: string;
  buffer: ArrayBuffer; // Image data (copy, not original)
  config: unknown;
}

// Plugin → Host
interface PluginToHostMessage {
  type: 'result' | 'error' | 'progress';
  requestId: string;
  buffer?: ArrayBuffer; // Processed image (on 'result')
  error?: string; // Error message (on 'error')
  progress?: number; // 0-100 (on 'progress')
}
```

---

## Plugin API (Plugin-Side SDK)

```typescript
// Plugin author writes this code
import { createPlugin } from '@imageforge/plugin-sdk';

export const plugin = createPlugin({
  id: 'community.vintage-effects',

  operations: [
    {
      type: 'process',
      id: 'vintage-warm',
      name: 'Vintage Warm',
      category: 'effects',

      // Declarative config schema
      config: {
        intensity: { type: 'slider', min: 0, max: 100, default: 75, label: 'Intensity' },
        grain: { type: 'toggle', default: false, label: 'Add Grain' },
      },

      // The actual processing function
      async process(buffer: ArrayBuffer, config: Config): Promise<ArrayBuffer> {
        // Process the image using Canvas API or custom JS
        // Cannot access external network (CSP enforced)
        return processedBuffer;
      },
    },
  ],
});
```

---

## Plugin Registry

The official plugin registry at `registry.imageforge.app` provides:

- Plugin discovery and search
- Installation with one click
- Checksum verification
- Community ratings and reviews
- Vulnerability reports

---

## Security Validation

When a plugin is installed:

1. Fetch plugin manifest from registry
2. Verify author signature (GPG or similar)
3. Verify entry point URL matches manifest
4. Verify file checksum
5. Load in sandbox with CSP
6. Run health check (process a 1×1 test pixel)
7. Register operations in ImageForge

---

## Related Documents

| Document                                                     | Relationship            |
| ------------------------------------------------------------ | ----------------------- |
| [ADR-0006](./adr/ADR-0006-plugin-system.md)                  | Plugin sandbox decision |
| [37-security-architecture.md](./37-security-architecture.md) | Security model          |
| [75-api-contracts.md](./75-api-contracts.md)                 | Plugin API types        |

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
