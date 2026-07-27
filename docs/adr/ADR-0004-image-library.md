# ADR-0004: libvips/WASM as the Web Image Processing Engine

**Date**: 2026-07-27  
**Status**: Accepted  
**Deciders**: Architecture Team

---

## Context

ImageForge's web application must perform professional-grade image processing entirely in the browser without sending images to any server. This requirement — "client-side processing" — eliminates server-side solutions by architectural definition.

The question is: what technology provides professional-grade image processing in the browser?

---

## Decision Drivers

- **Privacy**: No server. Period.
- **Offline**: Must work without internet after initial load.
- **Feature richness**: Lossy compression (JPEG, WebP), lossless (PNG, WebP), format conversion, resize with quality resampling, metadata handling
- **Performance**: P95 < 500ms for a 5MP JPEG compression on a modern laptop
- **Open-source**: MIT or permissive license required
- **Maintainability**: Library must be actively maintained

---

## Considered Options

### Option A: libvips compiled to WebAssembly (Chosen)

libvips is compiled to WASM using Emscripten. Exposes the full libvips API in the browser.

### Option B: Browser Canvas API (2D Context)

Use `HTMLCanvasElement` and its `2d` context for image manipulation.

### Option C: Jimp

Pure JavaScript image processing library.

### Option D: Squoosh Core Library

The core of Google's Squoosh, which wraps multiple WASM codecs.

### Option E: Sharp.js (Node.js / Server)

Sharp is a fast Node.js image processing library based on libvips. Cannot run in browser directly.

---

## Decision Outcome

**Chosen option: Composite WASM approach**:

- **libvips WASM** (via `@sharpcoder/libvips-wasm` or custom build): Resize, crop, rotate, color operations, format decode
- **mozjpeg WASM**: JPEG encoding (better compression than libjpeg)
- **pngquant WASM**: PNG palette-based lossless compression
- **libwebp WASM**: WebP encode/decode
- **libavif WASM**: AVIF encode/decode
- **FFmpeg WASM** (`ffmpeg.wasm`): GIF creation, video-to-GIF (loaded lazily)

Each encoder is a separate WASM module, loaded lazily. This avoids loading the full 7MB FFmpeg bundle on initial page load.

---

## Pros and Cons of the Options

### Option A: libvips WASM (Chosen)

**Pros**:

- Professional-grade library — same used by Ruby on Rails `active_storage`, sharp.js
- Fast: uses SIMD operations where WASM SIMD is available
- Rich API: resize algorithms (Lanczos, bicubic, etc.), color spaces, metadata, pipelines
- Memory efficient: streaming pipeline architecture minimizes peak memory
- Actively maintained by the libvips community

**Cons**:

- WASM binary is ~3.5MB (gzipped) — significant initial download
- Compilation and maintenance of WASM build requires libvips expertise
- Not a standalone npm package; requires custom WASM build or third-party package

### Option B: Browser Canvas API

**Pros**:

- Zero bundle size (built into browser)
- Excellent browser compatibility
- Simple API for common operations

**Cons**:

- **No professional compression** — Canvas `toBlob('image/jpeg', quality)` uses the browser's built-in JPEG encoder which is significantly worse than mozjpeg
- **No AVIF/HEIC encoding** — Canvas can't encode AVIF or HEIC
- **No LUT support** — No GPU shader color grading
- **Poor large image performance** — Canvas operations block the main thread (no Worker ImageBitmap)
- Eliminates 80% of ImageForge's feature set

### Option C: Jimp

**Pros**:

- Pure JavaScript — no WASM compilation needed
- Simple API, easy to maintain

**Cons**:

- **Very slow**: Pure JS image processing is 10–50× slower than WASM for large images
- **Limited codecs**: No AVIF, no WebP encoding, limited HEIC
- **Poor compression quality**: JavaScript JPEG encoder is inferior to mozjpeg
- Unacceptable performance for the target use case

### Option D: Squoosh Core Library

**Pros**:

- Google-maintained, proven in production (Squoosh.app)
- Wraps multiple WASM codecs (mozjpeg, libwebp, etc.)
- Well-tested

**Cons**:

- Not designed as a standalone library for other projects
- API changes without a stable versioned interface
- Does not expose libvips operations (resize, crop, color corrections)
- Would require reimplementing all non-codec operations

### Option E: Sharp.js (Server-Side)

**Pros**: Fast, great API, libvips-based
**Cons**: **Cannot run in browser** — Node.js only. Would require a server, violating privacy principle.

---

## Implementation Architecture

```
Browser Main Thread
    ↓ (postMessage + Transferable ArrayBuffer)
Web Worker
    ↓ (JS call)
libvips WASM module
    ↓ (C API)
libvips processing pipeline
    ↓
Output ArrayBuffer
    ↑ (postMessage + Transferable)
Browser Main Thread → Blob URL → Download
```

The `ArrayBuffer` transfer is zero-copy — ownership is transferred between threads without memcpy.

---

## Consequences

**Good**:

- Professional-grade JPEG/WebP/PNG output quality
- Privacy guaranteed by architecture (no server calls)
- Offline capable after first WASM load
- Same processing algorithms across web and server (CLI tool in Phase 3)

**Bad**:

- Initial WASM load: ~3.5MB (mitigated by Service Worker caching)
- WASM initialization: ~500ms cold, ~50ms warm
- Requires COOP/COEP headers for SharedArrayBuffer support
- libvips WASM requires a custom build or careful dependency management
- WASM SIMD may not be available in all target browsers (graceful fallback)

---

## References

- [libvips Documentation](https://www.libvips.org/)
- [ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)
- [DL-004 in Decision Log](../DECISION_LOG.md)
- [29-image-processing-pipeline.md](../29-image-processing-pipeline.md)
- [49b-wasm-architecture.md](../49b-wasm-architecture.md)
