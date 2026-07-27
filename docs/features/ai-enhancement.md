# AI Enhancement Feature Specification

> **Document ID**: features/ai-enhancement
> **Phase**: 4 — Feature Specifications
> **Status**: Phase 3

---

## Overview

The AI Enhancement feature uses on-device machine learning to intelligently improve photo quality — super resolution upscaling, low-light enhancement, and smart color correction.

---

## Functional Requirements

| Requirement                 | FR     | Priority |
| --------------------------- | ------ | -------- |
| AI Super Resolution 2x      | FR-480 | P3       |
| AI Super Resolution 4x      | FR-481 | P3       |
| Low-light photo enhancement | FR-482 | P3       |
| JPEG artifact removal       | FR-483 | P3       |
| Auto color correction       | FR-484 | P3       |
| Before/after comparison     | FR-485 | P3       |

---

## Models

| Feature             | Model                   | Size  | Inference         |
| ------------------- | ----------------------- | ----- | ----------------- |
| Super Resolution 2x | ESRGAN-lite (ONNX INT8) | ~5MB  | ONNX Runtime WASM |
| Super Resolution 4x | ESRGAN (ONNX INT8)      | ~16MB | ONNX Runtime WASM |
| Low-light           | Zero-DCE (ONNX)         | ~2MB  | ONNX Runtime WASM |
| Artifact removal    | ARCNN (ONNX)            | ~3MB  | ONNX Runtime WASM |

All models are accelerated with WebGPU when available, falling back to WASM CPU mode.

---

## Super Resolution Pipeline

```
Input: 500×400 JPEG (degraded, low-res)
    ↓
Tile into 128×128 patches (with 16px overlap)
    ↓
Run ESRGAN on each patch (ONNX Runtime)
    ↓
Stitch patches back (blend at seams)
    ↓
Output: 1000×800 JPEG (2x) or 2000×1600 (4x)
```

Tiling approach allows processing large images that would not fit entirely in WASM memory.

---

## Performance Targets

| Feature                | 500×400 image | 1024×768 image |
| ---------------------- | ------------- | -------------- |
| Super Res 2x (GPU)     | ≤ 5s          | ≤ 15s          |
| Super Res 2x (CPU)     | ≤ 20s         | ≤ 60s          |
| Low-light (GPU)        | ≤ 3s          | ≤ 10s          |
| Artifact removal (GPU) | ≤ 2s          | ≤ 8s           |

Performance warning shown for large images: "This may take up to 60 seconds on your device."

---

## User Consent

AI models are not loaded until the user explicitly enables the feature:

```
┌────────────────────────────────────────┐
│ 🤖 AI Super Resolution                 │
│                                        │
│ This feature downloads a 5MB AI model. │
│ It runs entirely on your device —      │
│ no images are uploaded.                │
│                                        │
│ [Enable & Download Model] [Cancel]     │
└────────────────────────────────────────┘
```

---

_Document Owner: Product Team | Status: Phase 3 | Approved: 2026-07-27_
