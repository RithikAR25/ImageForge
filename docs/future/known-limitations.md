# Known Limitations

> **Document ID**: future/known-limitations
> **Phase**: 10 — Future
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

This document honestly documents the known limitations of ImageForge — technical constraints, platform gaps, and planned improvements. This is shared with users and contributors for transparency.

---

## Web Application Limitations

### WASM Memory

- **Limit**: Files larger than 100MB cannot be processed
- **Root cause**: WebAssembly's linear memory model; `SharedArrayBuffer` limited to ~2GB per context
- **Mitigation**: Clear error message; recommend splitting large files
- **Future**: Streaming WASM processing (experimental)

### Safari

- **Limit**: WebP creation not available in Safari < 14
- **Limit**: AVIF import/export requires Safari 16+
- **Limit**: No PWA push notifications on iOS
- **Root cause**: Safari's historically slow web standards adoption
- **Mitigation**: Format fallback; show warning when unavailable

### HEIC Export (Web)

- **Limit**: Cannot export HEIC/HEIF on Web
- **Root cause**: No browser API for HEIC encoding; libheif WASM encoder has patent concerns
- **Mitigation**: Export as JPEG instead; document clearly

### Offline Storage Quota

- **Limit**: IndexedDB storage limited by browser (typically 60% of free disk space, min 400MB)
- **Root cause**: Browser storage quotas
- **Mitigation**: Show storage usage in Settings; auto-cleanup old thumbnails

---

## Mobile Limitations

### Background Processing

- **Limit**: iOS suspends apps after ~30 seconds in background
- **Root cause**: iOS background execution policy
- **Mitigation**: Pause queue on background; resume on foreground; show last known progress

### HEIC Export on Android

- **Limit**: HEIC export not available on Android
- **Root cause**: Android HEIC encoder support inconsistent across OEMs
- **Mitigation**: Export as JPEG

### Camera Resolution

- **Limit**: Camera capture limited by device hardware
- **Root cause**: Device hardware
- **Mitigation**: Not applicable

---

## Processing Limitations

### Lossless JPEG Rotation

- **Limit**: Only 90°, 180°, 270° are lossless; arbitrary angles require re-encoding
- **Root cause**: DCT block structure of JPEG
- **Mitigation**: UI warns when arbitrary angle selected

### RAW Format Support

- **Limit**: RAW formats (DNG, CR2, ARW, NEF) not supported in MVP
- **Root cause**: Enormous complexity of raw development pipeline; patent issues with some codecs
- **Future**: Phase 3 via dcraw/LibRaw WASM

### Animated WebP Export

- **Limit**: No animated WebP creation in MVP
- **Future**: Phase 3 with ffmpeg.wasm

---

## Planned Fixes (Next Versions)

| Limitation                  | Fix                           | Target Version |
| --------------------------- | ----------------------------- | -------------- |
| 100MB file size limit       | Streaming WASM processing     | v2.x           |
| No RAW support              | LibRaw WASM integration       | v3.0           |
| No animated WebP export     | ffmpeg.wasm                   | v3.0           |
| Background processing (iOS) | WorkManager / BackgroundFetch | v1.1           |

---

_Document Owner: Engineering Team | Review Cycle: Per-release | Approved: 2026-07-27_
