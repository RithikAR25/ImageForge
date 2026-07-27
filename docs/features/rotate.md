# Rotate Feature Specification

> **Document ID**: features/rotate
> **Phase**: 4 — Feature Specifications
> **Status**: Approved

---

## Overview

The Rotate feature provides lossless rotation with EXIF auto-rotation support. Flip operations are specified separately in [flip.md](./flip.md).

---

## Functional Requirements

| Requirement                     | FR     | Priority |
| ------------------------------- | ------ | -------- |
| Rotate 90° clockwise            | FR-110 | MVP      |
| Rotate 90° counter-clockwise    | FR-111 | MVP      |
| Rotate 180°                     | FR-112 | MVP      |
| Free rotation (arbitrary angle) | FR-113 | P2       |
| Auto-rotate by EXIF orientation | FR-116 | MVP      |
| Lossless JPEG rotation          | FR-117 | MVP      |

---

## Lossless JPEG Rotation

JPEG images rotated in 90° increments can be done **losslessly** (no re-encoding) using `jpegtran`-style block rotation. The image is restructured at the DCT block level.

Only 90°, 180°, 270° rotations are lossless. Arbitrary angles require re-encoding.

```typescript
interface RotateConfig {
  angle: 90 | 180 | 270; // MVP: orthogonal only
  lossless: boolean; // JPEG lossless rotation (true by default for JPEG)
  expand: boolean; // Expand canvas for non-rectangular rotations
}
```

---

## EXIF Auto-Rotation

Many cameras write photos with orientation in EXIF metadata but leave the pixel data unrotated. The setting `autoRotateByExif` (default: ON) fixes this on import:

```typescript
function applyExifOrientation(image: ImageFile): ProcessingOperation | null {
  const exifOrientation = image.exif?.orientation;

  const rotationMap: Record<number, RotateConfig | null> = {
    1: null, // Normal — no rotation needed
    3: { angle: 180 },
    6: { angle: 90 },
    8: { angle: 270 },
  };

  const rotation = rotationMap[exifOrientation ?? 1];
  return rotation ? { type: 'rotate', config: rotation } : null;
}
```

---

Both operations are lossless at the DCT level for JPEG, or trivial pixel reordering for PNG/WebP. See [flip.md](./flip.md) for full specification.

---

_Document Owner: Product Team | Approved: 2026-07-27_
