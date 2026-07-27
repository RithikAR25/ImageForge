# Flip Feature Specification

> **Document ID**: features/flip
> **Phase**: 4 — Feature Specifications
> **Status**: Approved

---

## Overview

The Flip feature provides horizontal and vertical mirroring of images — a simple but frequently needed operation for correcting selfies, creating mirror effects, or adjusting image orientation.

---

## Functional Requirements

| Requirement                         | FR     | Priority |
| ----------------------------------- | ------ | -------- |
| Flip horizontal (mirror left-right) | FR-130 | MVP      |
| Flip vertical (mirror top-bottom)   | FR-131 | MVP      |
| Lossless flip for JPEG              | FR-132 | MVP      |
| Live preview toggle                 | FR-133 | MVP      |

---

## Use Cases

| Flip       | Common Use Case                                     |
| ---------- | --------------------------------------------------- |
| Horizontal | Fix mirrored selfie camera capture; create symmetry |
| Vertical   | Correct upside-down scans; create reflection effect |
| Both       | Equivalent to 180° rotation                         |

---

## Technical Implementation

JPEG flip is lossless using DCT block manipulation (same as lossless rotation):

- Flip Horizontal: Reverse the order of DCT blocks per row
- Flip Vertical: Reverse the order of rows of DCT blocks

For PNG/WebP: direct pixel row/column reversal via libvips.

```typescript
interface FlipConfig {
  direction: 'horizontal' | 'vertical' | 'both';
}
```

---

## UI Layout

```
┌──────────────────────────────┐
│  Flip Image                  │
├───────────────────┬──────────┤
│                   │          │
│  Image Preview    │ [⇐⇒]    │
│  (live flip)      │ Horizontal│
│                   │          │
│                   │ [⇑⇓]    │
│                   │ Vertical  │
└───────────────────┴──────────┘
```

Both buttons act as toggles — press once to flip, press again to un-flip.

---

_Document Owner: Product Team | Approved: 2026-07-27_
