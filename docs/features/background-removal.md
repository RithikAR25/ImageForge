# Background Removal Feature Specification

> **Document ID**: features/background-removal
> **Phase**: 4 — Feature Specifications
> **Status**: Phase 3 (AI)

---

## Overview

The Background Removal feature uses on-device AI to automatically remove image backgrounds — outputting a PNG with transparency. No image upload required.

---

## Functional Requirements

| Requirement                  | FR     | Priority |
| ---------------------------- | ------ | -------- |
| Automatic background removal | FR-400 | P3       |
| Manual edge refinement brush | FR-401 | P3       |
| Background color fill        | FR-402 | P3       |
| Background image replacement | FR-403 | P3       |
| Output as PNG with alpha     | FR-404 | P3       |
| Batch background removal     | FR-405 | P3       |

---

## AI Model

- **Model**: U2-Net (lightweight variant) — ONNX format
- **Model size**: ~4MB (quantized INT8)
- **Input**: RGB image, resized to 320×320 for inference
- **Output**: Grayscale saliency mask (0=background, 1=foreground)
- **Execution**: ONNX Runtime WASM (Web) / Core ML (iOS) / TFLite (Android)

```typescript
interface BackgroundRemovalConfig {
  refineEdges: boolean; // Post-process edge smoothing
  backgroundColor?: string; // Fill background with color (null = transparent)
  backgroundImageId?: string; // Replace with another image
}
```

---

## Processing Pipeline

```
Original Image
    ↓ Resize to 320×320 (for model input)
    ↓ ONNX inference → saliency mask (320×320)
    ↓ Upscale mask to original resolution (bilinear)
    ↓ Optional: edge refinement (guided filter)
    ↓ Apply mask as alpha channel
    ↓ Output PNG with transparency
```

---

## Edge Refinement

After the initial mask is generated, a guided filter pass improves edge quality around hair and fine details:

```typescript
async function refineEdges(
  originalBuffer: ArrayBuffer,
  mask: Float32Array,
  maskSize: { width: number; height: number },
): Promise<Float32Array> {
  // Guided filter uses original image as guidance to sharpen mask edges
  return guidedFilter(originalBuffer, mask, maskSize, (radius = 5), (epsilon = 0.01));
}
```

---

## Performance Targets

| Device                | Target Time |
| --------------------- | ----------- |
| Desktop (Chrome, GPU) | ≤ 3s        |
| Desktop (Chrome, CPU) | ≤ 8s        |
| iPhone 14 (Core ML)   | ≤ 1.5s      |
| Android (TFLite GPU)  | ≤ 2.5s      |

Model is cached in Service Worker after first download — zero load time on subsequent uses.

---

_Document Owner: Product Team | Status: Phase 3 | Approved: 2026-07-27_
