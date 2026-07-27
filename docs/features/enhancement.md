# Enhancement Feature Specification

> **Document ID**: features/enhancement
> **Phase**: 4 — Feature Specifications
> **Status**: Phase 2

---

## Overview

The Enhancement feature provides manual image quality improvements — brightness, contrast, saturation, sharpness, exposure, and highlights/shadows — giving users professional-grade controls.

---

## Functional Requirements

| Requirement                 | FR     | Priority |
| --------------------------- | ------ | -------- |
| Brightness (-100 to +100)   | FR-300 | P2       |
| Contrast (-100 to +100)     | FR-301 | P2       |
| Saturation (-100 to +100)   | FR-302 | P2       |
| Hue rotation (-180 to +180) | FR-303 | P2       |
| Sharpness (0-100)           | FR-304 | P2       |
| Noise reduction (0-100)     | FR-305 | P2       |
| Exposure (-3 to +3 EV)      | FR-306 | P2       |
| Highlights (-100 to +100)   | FR-307 | P2       |
| Shadows (-100 to +100)      | FR-308 | P2       |
| Whites (-100 to +100)       | FR-309 | P2       |
| Blacks (-100 to +100)       | FR-310 | P2       |
| Temperature (-100 to +100)  | FR-311 | P2       |
| Tint (-100 to +100)         | FR-312 | P2       |
| Auto-enhance (one-click)    | FR-313 | P2       |
| Before/after preview        | FR-314 | P2       |
| Reset all to defaults       | FR-315 | P2       |

---

## Implementation Approach

All enhancements are applied via libvips operations on the Web:

| Enhancement         | libvips Operation                                 |
| ------------------- | ------------------------------------------------- |
| Brightness/Contrast | `image.brightness_contrast(brightness, contrast)` |
| Saturation          | `image.hsvq()` or HSL manipulation                |
| Sharpness           | `image.sharpen(sigma, x1, m1, m2)`                |
| Noise reduction     | `image.gaussblur(sigma)`                          |
| Temperature         | Curve adjustment on RGB channels                  |
| Highlights/Shadows  | Tone curve manipulation                           |

---

## Auto-Enhance

Auto-enhance analyzes the image histogram and applies:

1. Exposure correction (if underexposed/overexposed)
2. Contrast normalization (histogram equalization)
3. White balance correction (grey world assumption)

This is a non-destructive one-click improvement — user can fine-tune after.

---

## Config Schema

```typescript
interface EnhanceConfig {
  brightness: number; // -100 to +100, default 0
  contrast: number; // -100 to +100, default 0
  saturation: number; // -100 to +100, default 0
  hue: number; // -180 to +180, default 0
  sharpness: number; // 0-100, default 0
  noiseReduction: number; // 0-100, default 0
  exposure: number; // -3 to +3, default 0
  highlights: number; // -100 to +100, default 0
  shadows: number; // -100 to +100, default 0
  temperature: number; // -100 to +100, default 0
  tint: number; // -100 to +100, default 0
}
```

---

_Document Owner: Product Team | Status: Phase 2 | Approved: 2026-07-27_
