# Resize Benchmark Results

> **Document ID**: benchmarks/resize
> **Phase**: Benchmarks
> **Status**: Baseline Established
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Test Conditions

- **Input**: 5MP JPEG (2500×2000px), 12MP JPEG (4000×3000px)
- **Platform**: Chrome 124, M2 MacBook Air
- **WASM**: libvips 8.15

---

## Speed by Algorithm

Resizing 5MP → 1080px wide:

| Algorithm          | Time  | Quality (SSIM) | Use Case         |
| ------------------ | ----- | -------------- | ---------------- |
| Nearest Neighbour  | 45ms  | 0.851          | Thumbnail speed  |
| Bilinear           | 180ms | 0.934          | Fast, acceptable |
| Bicubic            | 310ms | 0.956          | Good balance     |
| Lanczos3           | 520ms | 0.971          | Best quality     |
| Mitchell-Netravali | 490ms | 0.968          | Balanced         |
| VSCO               | 620ms | 0.974          | Max quality      |

**Recommended default**: Lanczos3 (best quality/speed balance).

---

## Speed by Target Resolution

Downscaling 12MP → target (Lanczos3):

| Target            | Time (Web) | Time (iOS) |
| ----------------- | ---------- | ---------- |
| 4K (3840px wide)  | 280ms      | 150ms      |
| 1080px wide       | 380ms      | 210ms      |
| 640px wide        | 420ms      | 230ms      |
| Thumbnail (300px) | 280ms      | 140ms      |

---

## Upscaling Results

Upscaling 640×480 → 1280×960:

| Algorithm      | Time    | SSIM  | Visible Artifacts |
| -------------- | ------- | ----- | ----------------- |
| Bilinear       | 85ms    | 0.921 | Slight blur       |
| Bicubic        | 140ms   | 0.942 | Mild ringing      |
| Lanczos3       | 200ms   | 0.954 | Minimal ringing   |
| AI (ESRGAN 2×) | 4,200ms | 0.981 | None              |

For upscaling beyond 2×, AI super-resolution is strongly recommended.

---

## Batch Resize (50 images, 5MP each → 1080px, Lanczos3)

| Workers | Time | Images/sec |
| ------- | ---- | ---------- |
| 1       | 26s  | 1.92/s     |
| 2       | 14s  | 3.57/s     |
| 4       | 8.2s | 6.10/s     |
| 8       | 7.8s | 6.41/s     |

Diminishing returns beyond 4 workers (CPU-bound at WASM level).

---

_Document Owner: Engineering Team | Established: 2026-07-27_
