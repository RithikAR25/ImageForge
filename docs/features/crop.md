# Crop Feature Specification

> **Document ID**: features/crop
> **Phase**: 4 — Feature Specifications
> **Status**: Approved

---

## Overview

The Crop feature provides an interactive image cropping experience with aspect ratio constraints, circle crop, and pixel-exact positioning.

---

## Functional Requirements

| Requirement              | FR     | Priority |
| ------------------------ | ------ | -------- |
| Interactive crop overlay | FR-090 | MVP      |
| Free-form crop           | FR-091 | MVP      |
| Fixed ratio crop         | FR-092 | MVP      |
| Custom aspect ratio      | FR-093 | MVP      |
| Pixel-exact crop         | FR-094 | MVP      |
| Circle crop              | FR-095 | MVP      |
| Smart crop (saliency)    | FR-096 | P2       |
| Face-aware crop          | FR-097 | P2       |

---

## Crop Presets

| Label          | Ratio    | Use Case                 |
| -------------- | -------- | ------------------------ |
| Free           | Any      | General purpose          |
| Square         | 1:1      | Instagram posts          |
| Portrait       | 4:5      | Instagram portrait       |
| Landscape      | 16:9     | YouTube thumbnails       |
| Portrait Story | 9:16     | Instagram/TikTok stories |
| Photo          | 4:3      | Standard photography     |
| Portrait Photo | 3:4      | Portrait photography     |
| Widescreen     | 2:1      | Wide banners             |
| Portrait Wide  | 1:2      | Vertical banners         |
| Circle         | Circular | Profile pictures         |

---

## Crop Canvas Implementation

The crop overlay is rendered using React Native Skia:

```typescript
// CropOverlay renders:
// 1. Darkened mask over non-crop area
// 2. Crop boundary with handles
// 3. Rule-of-thirds grid lines (configurable)
// 4. Dimension readout (W × H px)
```

Gestures:

- **Pan on image**: Moves the crop region
- **Pan on handle**: Resizes the crop region
- **Pinch**: Zooms the image in the crop canvas

---

## Circle Crop Output

Output is always PNG (with alpha channel):

- Pixels within the circle: original image data
- Pixels outside the circle: transparent (alpha = 0)
- Border radius equals width/2 (perfect circle)

---

## Pixel Coordinate Display

During crop, display:

```
X: 250  Y: 150  W: 1080  H: 1080
```

All values update in real-time as the user drags handles.

---

_Document Owner: Architecture & Product | Approved: 2026-07-27_
