# Compression Benchmark Results

> **Document ID**: benchmarks/compression
> **Phase**: Benchmarks
> **Status**: Baseline Established
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

Reference compression benchmarks showing expected file size reduction and processing speed for each supported codec.

---

## Test Conditions

- **Test image**: 5MP JPEG (2500×2000px, original size: 3.84MB)
- **Platform**: Chrome 124, M2 MacBook Air, 16GB RAM
- **WASM**: libvips 8.15 + mozjpeg 4.1 + libwebp 1.3.2
- **Workers**: 4

---

## Size Reduction by Codec and Quality

| Codec           | Quality | Output Size | Reduction | SSIM  |
| --------------- | ------- | ----------- | --------- | ----- |
| JPEG (mozjpeg)  | 95      | 2.1MB       | 45%       | 0.998 |
| JPEG (mozjpeg)  | 85      | 890KB       | 77%       | 0.992 |
| JPEG (mozjpeg)  | 75      | 520KB       | 86%       | 0.985 |
| JPEG (mozjpeg)  | 50      | 220KB       | 94%       | 0.961 |
| WebP (lossy)    | 90      | 780KB       | 80%       | 0.995 |
| WebP (lossy)    | 80      | 420KB       | 89%       | 0.988 |
| WebP (lossy)    | 60      | 180KB       | 95%       | 0.972 |
| WebP (lossless) | —       | 6.2MB       | -61%      | 1.000 |
| PNG (pngquant)  | —       | 4.1MB       | +7%       | 1.000 |
| AVIF            | 80      | 310KB       | 92%       | 0.994 |
| AVIF            | 60      | 150KB       | 96%       | 0.980 |

> **SSIM**: Structural Similarity Index (1.0 = identical to original). Values above 0.98 are imperceptible to human eye.

---

## Processing Speed by Codec

Time to compress a single 5MP JPEG:

| Codec          | Quality | Web (WASM) | iOS (native) | Android (native) |
| -------------- | ------- | ---------- | ------------ | ---------------- |
| JPEG (mozjpeg) | 85      | 320ms      | 180ms        | 240ms            |
| WebP (lossy)   | 80      | 680ms      | 410ms        | 520ms            |
| PNG (pngquant) | —       | 1,100ms    | 720ms        | 890ms            |
| AVIF           | 80      | 2,400ms    | 1,200ms      | 1,800ms          |

---

## Adaptive Compression Results (WhatsApp Preset)

Target: ≤ 200KB output

| Input     | Output | Achieved Quality | Time  |
| --------- | ------ | ---------------- | ----- |
| 1MB JPEG  | 194KB  | Q=72             | 280ms |
| 5MB JPEG  | 198KB  | Q=58             | 360ms |
| 12MB JPEG | 196KB  | Q=43             | 450ms |
| 1.5MB PNG | 187KB  | Q=68 (JPEG)      | 310ms |

All adaptive compressions achieved ≤ 200KB target.

---

## Comparison: mozjpeg vs standard libjpeg

At equal SSIM (0.992):

| Encoder          | File Size | Difference      |
| ---------------- | --------- | --------------- |
| Standard libjpeg | 1.14MB    | Baseline        |
| mozjpeg          | 890KB     | **22% smaller** |

mozjpeg's progressive encoding and improved DCT coefficient quantization consistently produces smaller files at equal quality.

---

_Document Owner: Engineering Team | Review Cycle: Per-major-version | Established: 2026-07-27_
