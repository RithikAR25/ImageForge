# Mobile Device Benchmarks

> **Document ID**: benchmarks/mobile-comparison
> **Phase**: Benchmarks
> **Status**: Baseline Established
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

Cross-device mobile performance benchmarks for native image processing.

---

## Test Conditions

- **Test operation**: Compress 5MP JPEG at Q=85 (JPEG), Resize 5MP → 1080px (Lanczos3)
- **All devices**: Release build, fresh reboot, Wi-Fi off

---

## iOS Devices

| Device             | Chip    | Compress (Q85) | Resize (Lanczos3) | Thumbnail Gen |
| ------------------ | ------- | -------------- | ----------------- | ------------- |
| iPhone 15 Pro      | A17 Pro | 95ms           | 110ms             | 35ms          |
| iPhone 14 Pro      | A16     | 110ms          | 130ms             | 40ms          |
| iPhone 13          | A15     | 130ms          | 155ms             | 50ms          |
| iPhone 12          | A14     | 160ms          | 180ms             | 60ms          |
| iPhone XR          | A12     | 240ms          | 280ms             | 85ms          |
| iPad Pro M2        | M2      | 75ms           | 90ms              | 25ms          |
| iPad Air (5th gen) | M1      | 85ms           | 100ms             | 30ms          |
| iPad (9th gen)     | A13     | 180ms          | 210ms             | 65ms          |

**All devices meet the < 300ms target for single image compression.**

---

## Android Devices

| Device               | Chip               | Compress (Q85) | Resize (Lanczos3) | Thumbnail Gen |
| -------------------- | ------------------ | -------------- | ----------------- | ------------- |
| Samsung S24 Ultra    | Snapdragon 8 Gen 3 | 105ms          | 125ms             | 38ms          |
| Samsung S23          | Snapdragon 8 Gen 2 | 120ms          | 145ms             | 45ms          |
| Google Pixel 8       | Google Tensor G3   | 135ms          | 160ms             | 52ms          |
| OnePlus 12           | Snapdragon 8 Gen 3 | 108ms          | 128ms             | 40ms          |
| Samsung A54          | Exynos 1380        | 220ms          | 265ms             | 80ms          |
| Xiaomi Redmi Note 12 | Snapdragon 685     | 310ms          | 365ms             | 110ms         |

**Redmi Note 12 is the slowest tested device — marginally exceeds 300ms target at 310ms.**

---

## Batch Throughput (50 images, Q=85, 4 threads)

| Platform          | Time  | Images/sec |
| ----------------- | ----- | ---------- |
| iPad Pro M2       | 5.2s  | 9.6/s      |
| iPhone 15 Pro     | 6.8s  | 7.4/s      |
| Samsung S24 Ultra | 7.1s  | 7.0/s      |
| iPhone 12         | 12.4s | 4.0/s      |
| Samsung A54       | 18.2s | 2.7/s      |

---

## Startup Time

| Platform          | Cold Start | Warm Start |
| ----------------- | ---------- | ---------- |
| iPhone 15 Pro     | 1.1s       | 0.3s       |
| iPhone 12         | 1.6s       | 0.5s       |
| Samsung S24 Ultra | 1.4s       | 0.4s       |
| Samsung A54       | 2.2s       | 0.7s       |

**All devices meet the ≤ 3s cold start target.**

---

_Document Owner: Engineering Team | Established: 2026-07-27_
