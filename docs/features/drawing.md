# Drawing Feature Specification

> **Document ID**: features/drawing
> **Phase**: 4 — Feature Specifications
> **Status**: Phase 2

---

## Overview

The Drawing feature provides a freehand annotation layer — draw arrows, shapes, text annotations, and freehand strokes directly on images.

---

## Functional Requirements

| Requirement                | FR     | Priority |
| -------------------------- | ------ | -------- |
| Freehand pen/brush         | FR-380 | P2       |
| Arrow annotations          | FR-381 | P2       |
| Rectangle / ellipse shapes | FR-382 | P2       |
| Text annotations           | FR-383 | P2       |
| Color picker               | FR-384 | P2       |
| Stroke width control       | FR-385 | P2       |
| Undo/redo strokes          | FR-386 | P2       |
| Eraser                     | FR-387 | P2       |
| Opacity control            | FR-388 | P2       |

---

## Architecture

Drawing is rendered on a **Skia canvas layer** overlaid on the image — the annotation layer is composited onto the image only on export (non-destructive editing):

```
Image layer (bottom)    ← Original / processed image
    +
Drawing layer (top)     ← Skia Canvas with strokes
    ↓ on export
Composited JPEG/PNG     ← Flattened result
```

```typescript
interface DrawingConfig {
  strokes: DrawStroke[];
}

interface DrawStroke {
  type: 'pen' | 'arrow' | 'rectangle' | 'ellipse' | 'text';
  points: { x: number; y: number }[];
  color: string;
  width: number;
  opacity: number;
  text?: string; // For text annotations
  fontSize?: number;
  fillColor?: string; // For shapes
}
```

---

## Canvas Implementation

```typescript
// packages/ui/src/feature/DrawingCanvas/DrawingCanvas.tsx
import { Canvas, Path, useCanvasRef } from '@shopify/react-native-skia';

function DrawingCanvas({ strokes, onStrokeAdd }: DrawingCanvasProps) {
  const canvasRef = useCanvasRef();
  const currentPath = useSharedValue<SkPath | null>(null);

  const gesture = Gesture.Pan()
    .onStart((e) => {
      currentPath.value = Skia.Path.Make();
      currentPath.value.moveTo(e.x, e.y);
    })
    .onUpdate((e) => {
      currentPath.value?.lineTo(e.x, e.y);
    })
    .onEnd(() => {
      if (currentPath.value) {
        runOnJS(onStrokeAdd)(serializePath(currentPath.value));
      }
    });

  return (
    <GestureDetector gesture={gesture}>
      <Canvas ref={canvasRef} style={StyleSheet.absoluteFill}>
        {strokes.map((stroke, i) => (
          <Path key={i} path={deserializePath(stroke.points)}
            color={stroke.color} style="stroke" strokeWidth={stroke.width} />
        ))}
      </Canvas>
    </GestureDetector>
  );
}
```

---

_Document Owner: Product Team | Status: Phase 2 | Approved: 2026-07-27_
