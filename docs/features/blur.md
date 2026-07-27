# Blur Feature Specification

> **Document ID**: features/blur
> **Phase**: 4 — Feature Specifications
> **Status**: Phase 2

---

## Overview

The Blur feature provides multiple blur types for creative effects, privacy protection, and depth-of-field simulation.

---

## Functional Requirements

| Requirement                          | FR     | Priority |
| ------------------------------------ | ------ | -------- |
| Gaussian blur (full image)           | FR-370 | P2       |
| Selective area blur (draw region)    | FR-371 | P2       |
| Face blur / pixelate (privacy)       | FR-372 | P2       |
| Background blur (keep subject sharp) | FR-373 | P3       |
| Radial/tilt-shift blur               | FR-374 | P2       |
| Motion blur                          | FR-375 | P2       |

---

## Blur Types

| Type                | Algorithm               | Use Case               |
| ------------------- | ----------------------- | ---------------------- |
| Gaussian            | libvips `gaussblur`     | Soft, uniform blur     |
| Box                 | libvips `boxblur`       | Fast, uniform blur     |
| Pixelate            | Block-average downscale | Privacy (faces)        |
| Motion              | Directional linear blur | Creative motion effect |
| Radial (tilt-shift) | Depth-gradient gaussian | Miniature/bokeh effect |

---

## Config Schema

```typescript
type BlurConfig =
  | { type: 'gaussian'; radius: number; region?: BlurRegion }
  | { type: 'pixelate'; blockSize: number; region?: BlurRegion }
  | { type: 'motion'; angle: number; distance: number }
  | { type: 'radial'; centerX: number; centerY: number; maxRadius: number };

interface BlurRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  shape: 'rectangle' | 'ellipse';
}
```

---

## Privacy Blur (Face Pixelation)

For Phase 3, face detection (MediaPipe Face Detector) auto-detects faces and offers one-click pixelation:

```
1. Run face detection (ONNX model, ~2MB)
2. Get bounding boxes of all detected faces
3. For each face: apply pixelate blur (blockSize=15)
4. User can adjust block size
5. Export
```

This is 100% on-device — face coordinates never leave the browser.

---

_Document Owner: Product Team | Status: Phase 2 | Approved: 2026-07-27_
