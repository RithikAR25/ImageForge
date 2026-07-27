# Future: AI Roadmap

> **Document ID**: future/ai-roadmap
> **Phase**: 10 — Future
> **Status**: Planning
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document outlines the planned AI-powered features for ImageForge — Phase 3 and beyond — and the technical approach to integrating AI models into the client-side processing architecture.

---

## AI Feature Roadmap

| Feature                        | Phase | Model Approach             | Status   |
| ------------------------------ | ----- | -------------------------- | -------- |
| Background Removal             | 3     | ONNX Runtime WASM (U2-Net) | Planned  |
| AI Super Resolution (2×/4×)    | 3     | ONNX Runtime WASM (ESRGAN) | Planned  |
| Face Detection (blur/pixelate) | 3     | MediaPipe WASM             | Planned  |
| Smart Crop (saliency)          | 3     | ONNX Runtime WASM          | Planned  |
| Photo Enhancement (auto)       | 3     | Lightweight CNN            | Planned  |
| OCR (text extraction)          | 3     | Tesseract.js / ONNX        | Planned  |
| Object Removal (inpainting)    | 4     | ONNX Runtime               | Research |
| Style Transfer                 | 4     | ONNX Runtime               | Research |
| Image Generation (txt2img)     | 5     | WebGPU + SD                | Research |

---

## Technical Architecture

### Client-Side AI Principles

1. **Privacy first**: Models run entirely in the browser/device — no image uploads
2. **WebGPU preferred**: Hardware-accelerated inference when available
3. **ONNX fallback**: CPU-mode ONNX Runtime when WebGPU unavailable
4. **Lazy loading**: AI models are NOT included in the initial bundle
5. **User consent**: AI features require explicit first-use confirmation

### ONNX Runtime WASM Integration

```typescript
// packages/image-core/src/engines/ai/OnnxEngine.ts

class OnnxAiEngine {
  private session: ort.InferenceSession | null = null;

  async loadModel(modelName: AiModelName): Promise<void> {
    const modelUrl = `/models/${modelName}.onnx`;
    const cachedModel = await getCachedModel(modelName);

    const modelData = cachedModel ?? (await fetch(modelUrl).then((r) => r.arrayBuffer()));
    if (!cachedModel) await cacheModel(modelName, modelData);

    this.session = await ort.InferenceSession.create(modelData, {
      executionProviders: ['webgpu', 'wasm'], // Prefer GPU
    });
  }

  async removeBackground(image: ImageFile): Promise<ImageFile> {
    if (!this.session) throw new Error('Model not loaded');

    const tensor = imageToOnnxTensor(image.buffer, 320, 320);
    const result = await this.session.run({ input: tensor });
    const mask = result.output.data as Float32Array;

    return applyAlphaMask(image, mask);
  }
}
```

### WebGPU Compute (Phase 4+)

```typescript
// packages/image-core/src/engines/gpu/WebGpuEngine.ts

async function inferWithWebGpu(
  imageBuffer: ArrayBuffer,
  shader: string
): Promise<ArrayBuffer> {
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();

  // Create input/output GPU buffers
  const inputBuffer = device.createBuffer({ ... });
  const outputBuffer = device.createBuffer({ ... });

  // Run compute shader
  const pipeline = device.createComputePipeline({ ... });
  // ... (dispatch)

  // Read results back to CPU
  return await readBuffer(device, outputBuffer);
}
```

---

## Model Size Budget

| Feature            | Model                   | Size  | Load Time (3G) |
| ------------------ | ----------------------- | ----- | -------------- |
| Background Removal | U2-Net (quantized)      | ~15MB | ~4s            |
| Super Resolution   | ESRGAN-lite (quantized) | ~5MB  | ~1.5s          |
| OCR                | Tesseract.js            | ~10MB | ~3s            |
| Smart Crop         | Saliency-lite           | ~3MB  | ~1s            |

All models are cached in Service Worker after first use (zero load time on subsequent uses).

---

## Mobile AI (Phase 3+)

| Platform | Framework       | Models                          |
| -------- | --------------- | ------------------------------- |
| iOS      | Core ML         | mlmodel files (Apple optimized) |
| Android  | TensorFlow Lite | tflite files (MediaPipe)        |

Native AI inference on mobile is significantly faster and more energy-efficient than WASM-based inference.

---

_Document Owner: Architecture Team | Status: Planning | Last Updated: 2026-07-27_
