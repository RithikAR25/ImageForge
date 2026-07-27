# Compress Feature Specification

> **Document ID**: features/compress
> **Phase**: 4 — Feature Specifications
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture & Product Team

---

## Overview

The Compress feature allows users to reduce the file size of images using industry-standard, high-quality codecs. It is the most-used feature in ImageForge and must deliver exceptional quality, speed, and clarity.

---

## User Stories

- US-010: Apply WhatsApp preset
- US-011: Set target file size
- US-012: Before/after preview

**Personas**: Alex (casual), Sam (batch), Jordan (professional)

---

## Functional Requirements

| Requirement                        | FR     | Priority |
| ---------------------------------- | ------ | -------- |
| JPEG compression via mozjpeg       | FR-050 | MVP      |
| PNG lossless via pngquant          | FR-051 | MVP      |
| WebP compression via libwebp       | FR-052 | MVP      |
| Quality slider (1–100)             | FR-053 | MVP      |
| Target file size mode              | FR-054 | MVP      |
| Size reduction preview             | FR-055 | MVP      |
| Presets (WhatsApp/Email/Web/Print) | FR-056 | MVP      |
| Before/after split slider          | FR-057 | MVP      |

---

## Technical Implementation

### Web (WASM)

```
mozjpeg.wasm  → JPEG encoding (better quality than libjpeg at same file size)
pngquant.wasm → PNG palette quantization (lossless perceived quality)
libwebp.wasm  → WebP encoding
```

### Mobile (Native)

```
Android: BitmapFactory + Bitmap.compress() + libjpeg-turbo
iOS: UIImage + ImageIO framework + HEIC/JPEG compression
```

### Adaptive Compression (Target Size)

Binary search algorithm:

```typescript
async function adaptiveCompress(
  image: ImageFile,
  targetKb: number,
  codec: 'jpeg' | 'webp',
): Promise<ImageFile> {
  let lo = 1,
    hi = 100,
    result = image;
  const targetBytes = targetKb * 1024;

  for (let i = 0; i < 10; i++) {
    const mid = Math.floor((lo + hi) / 2);
    const compressed = await compress(image, { quality: mid, codec });
    result = compressed;

    if (Math.abs(compressed.fileSize - targetBytes) / targetBytes < 0.1) {
      break; // Within ±10%
    }

    if (compressed.fileSize > targetBytes) hi = mid - 1;
    else lo = mid + 1;
  }

  return result;
}
```

---

## Presets

| Preset   | Codec | Quality  | Target Size |
| -------- | ----- | -------- | ----------- |
| WhatsApp | JPEG  | Adaptive | ≤ 200KB     |
| Email    | JPEG  | 80       | ≤ 500KB     |
| Web      | WebP  | 75       | ≤ 100KB     |
| Print    | PNG   | Lossless | —           |

---

## UI Layout

```
┌──────────────────────────────────────┐
│  Compress Image                      │
├───────────────────┬──────────────────┤
│                   │  Format: JPEG ▼  │
│   Before/After    │  Quality: ━━●━━  │
│   Split Slider    │         85       │
│                   │  ─────────────── │
│                   │  Presets:        │
│                   │  [WhatsApp]      │
│                   │  [Email]         │
│                   │  [Web]           │
│                   │  [Print]         │
│                   │  ─────────────── │
│                   │  OR Target Size: │
│                   │  [    200  ] KB  │
├───────────────────┴──────────────────┤
│  Original: 3.8MB  →  After: 182KB   │
│  ▓▓▓▓▓▓▓▓▓▓░░░░░░  52% smaller     │
├──────────────────────────────────────┤
│           [Download]                 │
└──────────────────────────────────────┘
```

---

## Performance Target

| Input                   | Target Time |
| ----------------------- | ----------- |
| 1MP JPEG at quality 85  | ≤ 100ms     |
| 5MP JPEG at quality 85  | ≤ 500ms     |
| 12MP JPEG at quality 85 | ≤ 1200ms    |

---

## Related Documents

| Document                                                              | Relationship         |
| --------------------------------------------------------------------- | -------------------- |
| [05-functional-requirements.md](../05-functional-requirements.md)     | FRs 050–057          |
| [08-user-stories.md](../08-user-stories.md)                           | US-010–012           |
| [29-image-processing-pipeline.md](../29-image-processing-pipeline.md) | Pipeline integration |
| [49b-wasm-architecture.md](../49b-wasm-architecture.md)               | WASM implementation  |

---

_Document Owner: Architecture & Product | Approved: 2026-07-27_
