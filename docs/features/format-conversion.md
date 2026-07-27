# Format Conversion Feature Specification

> **Document ID**: features/format-conversion
> **Phase**: 4 — Feature Specifications
> **Status**: Approved

---

## Overview

The Format Conversion feature allows users to convert images between supported formats while controlling quality and output settings.

---

## Supported Conversion Matrix

| From ↓ / To → | JPEG             | PNG | WebP | AVIF | GIF | BMP |
| ------------- | ---------------- | --- | ---- | ---- | --- | --- |
| JPEG          | —                | ✅  | ✅   | P2   | ❌  | ✅  |
| PNG           | ✅               | —   | ✅   | P2   | ❌  | ✅  |
| WebP          | ✅               | ✅  | —    | P2   | ❌  | ✅  |
| HEIC          | ✅               | ✅  | ✅   | P2   | ❌  | ✅  |
| GIF           | ✅ (first frame) | ✅  | ✅   | ❌   | —   | ❌  |
| BMP           | ✅               | ✅  | ✅   | ❌   | ❌  | —   |

---

## Functional Requirements

| Requirement                        | FR     | Priority |
| ---------------------------------- | ------ | -------- |
| Convert to JPEG                    | FR-120 | MVP      |
| Convert to PNG                     | FR-121 | MVP      |
| Convert to WebP                    | FR-122 | MVP      |
| Batch conversion                   | FR-123 | MVP      |
| Preserve transparency → PNG        | FR-124 | MVP      |
| HEIC to JPEG (common use case)     | FR-125 | MVP      |
| Auto-detect best format suggestion | FR-126 | P2       |
| AVIF output                        | FR-127 | P2       |

---

## Transparency Handling

When converting a format with transparency (PNG, WebP with alpha) to a format without (JPEG, BMP):

- Default: white background fill
- Option: user-specified background color
- JPEG cannot store transparency — must flatten

```typescript
interface ConvertConfig {
  targetFormat: 'jpeg' | 'png' | 'webp' | 'bmp';
  quality?: number; // For lossy formats
  backgroundColor?: string; // For transparency flatten (default: '#FFFFFF')
}
```

---

## Format Selection UX

Show format comparison to help users choose:

| Format | File Size | Quality  | Transparency | Browser Support |
| ------ | --------- | -------- | ------------ | --------------- |
| JPEG   | Small     | Lossy    | ❌           | Universal       |
| PNG    | Large     | Lossless | ✅           | Universal       |
| WebP   | Smallest  | Good     | ✅           | 95%+            |
| AVIF   | Smallest  | Best     | ✅           | 80%+            |

---

_Document Owner: Product Team | Approved: 2026-07-27_
