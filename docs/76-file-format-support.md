# File Format Support

> **Document ID**: 76
> **Phase**: 5 — Technical Specifications
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document is the definitive reference for all image formats ImageForge supports — their import/export capability, codec implementation, and platform-specific limitations.

---

## Format Support Matrix

| Format            | Extensions   | Import Web     | Import Mobile | Export Web        | Export Mobile      | Phase   |
| ----------------- | ------------ | -------------- | ------------- | ----------------- | ------------------ | ------- |
| JPEG              | .jpg, .jpeg  | ✅             | ✅            | ✅ (mozjpeg)      | ✅ (libjpeg-turbo) | MVP     |
| PNG               | .png         | ✅             | ✅            | ✅ (pngquant)     | ✅ (libpng)        | MVP     |
| WebP              | .webp        | ✅             | ✅            | ✅ (libwebp)      | ✅                 | MVP     |
| GIF               | .gif         | ✅             | ✅            | ✅ (single frame) | ✅                 | MVP     |
| BMP               | .bmp         | ✅             | ✅            | ✅                | ✅                 | MVP     |
| HEIC/HEIF         | .heic, .heif | ✅ (libheif)   | ✅ (native)   | ❌                | ✅ iOS only        | MVP     |
| AVIF              | .avif        | ✅ (libavif)   | ✅            | ✅                | P2                 | Phase 2 |
| TIFF              | .tif, .tiff  | ✅ (libvips)   | ✅            | ❌                | ❌                 | MVP     |
| SVG               | .svg         | ✅ (rasterize) | ✅            | ❌                | ❌                 | MVP     |
| ICO               | .ico         | ❌             | ❌            | ✅ (Phase 2)      | ❌                 | Phase 2 |
| PDF               | .pdf         | ❌             | ❌            | ✅ (Phase 3)      | ✅ (Phase 3)       | Phase 3 |
| RAW (DNG/CR2/ARW) | various      | ❌             | ❌            | ❌                | ❌                 | Phase 3 |

---

## Codec Implementation Details

### JPEG (mozjpeg)

- **Encoder**: mozjpeg 4.x (Mozilla's optimized libjpeg fork)
- **Advantage**: 20–30% smaller files than standard libjpeg at equal quality
- **Chroma subsampling**: 4:2:0 (default), 4:4:4 (high quality mode)
- **Progressive JPEG**: Supported
- **Lossless rotation**: jpegtran-style DCT block rotation

### PNG (pngquant)

- **Encoder**: pngquant 2.x for palette-based compression
- **For lossless**: also uses deflate level 9 via zlib
- **Transparency**: Fully supported (RGBA)
- **Interlacing**: Adam7 optional

### WebP (libwebp)

- **Encoder**: Google's libwebp 1.x
- **Lossy mode**: Based on VP8 video codec
- **Lossless mode**: Uses LZ77 + Huffman coding
- **Transparency**: Supported in both modes
- **Animation**: Supported (import Phase 2, export Phase 3)

### HEIC/HEIF (libheif)

- **Decoder**: libheif 1.x (WASM on Web, native on iOS/Android)
- **iOS**: Native HEIC decode is very fast via `ImageIO`
- **Web**: libheif WASM required (~800KB)
- **HEIC export**: Not available on Web (browser restriction); iOS native only

---

## Format Selection Guidance

Display this guidance in the UI when users are choosing an output format:

| Goal                | Recommended    | Why                              |
| ------------------- | -------------- | -------------------------------- |
| Smallest lossy file | WebP or AVIF   | Significantly smaller than JPEG  |
| Best JPEG compat    | JPEG (mozjpeg) | Universal browser/device support |
| Transparency needed | PNG or WebP    | JPEG has no transparency         |
| Print / archival    | PNG (lossless) | No quality loss                  |
| Sharing to social   | JPEG or WebP   | Widely supported                 |
| iOS HEIC → share    | JPEG           | HEIC not universally supported   |

---

## File Size Limits

| Limit                | Value             | Reason                   |
| -------------------- | ----------------- | ------------------------ |
| Max import file size | 100MB             | WASM memory constraint   |
| Max image dimensions | 32,767 × 32,767px | libvips limit            |
| Max batch size       | 500 images        | UX / memory              |
| Min dimensions       | 1 × 1px           | Degenerate case handling |

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
