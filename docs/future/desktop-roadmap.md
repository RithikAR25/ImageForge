# Desktop & CLI Roadmap

> **Document ID**: future/desktop-roadmap
> **Phase**: 10 — Future
> **Status**: Planning
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document outlines the roadmap for extending ImageForge beyond Web and Mobile to Desktop native apps and a Command-Line Interface (CLI) tool.

---

## Desktop App (Phase 4)

### Technology Options

| Option                     | Pros                                    | Cons                          | Verdict      |
| -------------------------- | --------------------------------------- | ----------------------------- | ------------ |
| Electron                   | Mature, large ecosystem, Web code reuse | Heavy (100MB+), memory-hungry | ❌ Rejected  |
| Tauri                      | Lightweight (5MB), Rust backend, fast   | Rust learning curve           | ✅ Preferred |
| React Native macOS/Windows | Code sharing with mobile                | Less mature, WinUI gaps       | 🟡 Consider  |

**Decision**: Tauri v2 for macOS + Windows desktop app. React Native macOS as a stretch goal.

### Tauri Architecture

```
Tauri Shell (Rust)
  ├── Window management
  ├── File system access (native dialogs)
  ├── System tray
  └── WebView (renders existing React web app)

Benefits:
  - Reuses 100% of web frontend code
  - Native file system access (no 100MB limit)
  - Native drag & drop from Finder/Explorer
  - Smaller bundle than Electron (~8MB vs 100MB+)
```

### Desktop-Only Features

| Feature                                           | Desktop Priority |
| ------------------------------------------------- | ---------------- |
| Drag from Finder/Explorer                         | P1               |
| Native file system access (no size limit)         | P1               |
| System-level keyboard shortcuts                   | P1               |
| Watch folder (auto-process new files)             | P2               |
| Context menu integration ("Open with ImageForge") | P2               |
| Menu bar (macOS)                                  | P2               |

---

## CLI Tool (Phase 4)

### Use Case

DevOps, CI/CD pipelines, and power users who need to batch-process images from scripts:

```bash
# Single image
imageforge compress --input photo.jpg --output photo_compressed.jpg --codec webp --quality 82

# Batch directory
imageforge batch --input ./raw/ --output ./optimized/ --pipeline resize-1080 compress-webp

# Pipeline from config file
imageforge run --config .imageforge.yml --input ./assets/
```

### Config File Format

```yaml
# .imageforge.yml
pipeline:
  - operation: resize
    config:
      width: 1080
      mode: fit
      algorithm: lanczos3
  - operation: compress
    config:
      codec: webp
      quality: 82

output:
  directory: ./dist/images/
  filenameTemplate: '{name}-optimized.{ext}'
  overwrite: false
```

### CLI Technology

- **Runtime**: Node.js 20+ (bundled Bun for performance)
- **Processing**: Uses `@imageforge/image-core` npm package
- **Package**: `npm install -g @imageforge/cli`

### Performance

CLI uses worker threads for batch processing — same concurrency model as the web WASM pool:

```typescript
import { BatchOrchestrator } from '@imageforge/image-core/node';

const orchestrator = new BatchOrchestrator(nodeProcessingEngine, {
  maxConcurrency: os.cpus().length,
});
```

---

## Related Documents

| Document                                | Relationship     |
| --------------------------------------- | ---------------- |
| [future/ai-roadmap.md](./ai-roadmap.md) | AI features      |
| [api/sdk-api.md](../api/sdk-api.md)     | SDK used by CLI  |
| [12-roadmap.md](../12-roadmap.md)       | Overall timeline |

---

_Document Owner: Architecture Team | Status: Planning | Last Updated: 2026-07-27_
