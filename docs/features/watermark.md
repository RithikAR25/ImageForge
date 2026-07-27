# Watermark Feature Specification

> **Document ID**: features/watermark
> **Phase**: 4 — Feature Specifications
> **Status**: Phase 2

---

## Overview

The Watermark feature enables users to overlay text or image watermarks on photos — useful for photographers protecting their work, brands adding logos, or creators adding attribution.

---

## Functional Requirements

| Requirement             | FR     | Priority |
| ----------------------- | ------ | -------- |
| Text watermark          | FR-350 | P2       |
| Image/logo watermark    | FR-351 | P2       |
| Position (9-point grid) | FR-352 | P2       |
| Opacity control         | FR-353 | P2       |
| Size control            | FR-354 | P2       |
| Rotation                | FR-355 | P2       |
| Tiled watermark         | FR-356 | P2       |
| Font selection          | FR-357 | P2       |
| Font color              | FR-358 | P2       |
| Batch watermark         | FR-359 | P2       |
| Save watermark preset   | FR-360 | P2       |

---

## Position Grid

```
┌───┬───┬───┐
│ ↖ │ ↑ │ ↗ │
├───┼───┼───┤
│ ← │ ● │ → │  ← 9-point position grid
├───┼───┼───┤
│ ↙ │ ↓ │ ↘ │
└───┴───┴───┘
```

Default: bottom-right (↘). Custom offset (x, y) for fine-tuning.

---

## Config Schema

```typescript
type WatermarkConfig =
  | {
      type: 'text';
      text: string;
      font: string; // Google Font or system font
      fontSize: number; // In points
      color: string; // Hex
      opacity: number; // 0-100
      position: WatermarkPosition;
      offsetX?: number;
      offsetY?: number;
      rotation?: number; // Degrees
      tiled?: boolean;
    }
  | {
      type: 'image';
      imageId: string; // ID of watermark image loaded into app
      width?: number; // Px or % of image width
      opacity: number;
      position: WatermarkPosition;
      offsetX?: number;
      offsetY?: number;
      rotation?: number;
      tiled?: boolean;
    };

type WatermarkPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';
```

---

## Implementation

Text watermarks use libvips `composite` + `text` operations:

```typescript
async function applyWatermark(
  imageBuffer: ArrayBuffer,
  config: WatermarkConfig,
): Promise<ArrayBuffer> {
  const image = vips.Image.newFromBuffer(imageBuffer);

  let overlay: VipsImage;
  if (config.type === 'text') {
    overlay = vips.Image.text(config.text, {
      font: `${config.font} ${config.fontSize}`,
      rgba: true,
    });
    overlay = overlay.multiply([1, 1, 1, config.opacity / 100]);
  } else {
    const logoBuffer = await getImageBuffer(config.imageId);
    overlay = vips.Image.newFromBuffer(logoBuffer);
  }

  const { x, y } = calculatePosition(
    config.position,
    image.width,
    image.height,
    overlay.width,
    overlay.height,
  );

  return image.composite([overlay], ['over'], { x: [x], y: [y] }).writeToBuffer('.jpg');
}
```

---

_Document Owner: Product Team | Status: Phase 2 | Approved: 2026-07-27_
