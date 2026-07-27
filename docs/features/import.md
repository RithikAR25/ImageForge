# Import Feature Specification

> **Document ID**: features/import
> **Phase**: 4 — Feature Specifications
> **Status**: Approved

---

## Overview

The Import feature is the entry point to ImageForge — how users get images into the system. It supports all practical import methods across Web and Mobile.

---

## Import Methods

### Web

| Method          | Trigger                        | Notes                                                  |
| --------------- | ------------------------------ | ------------------------------------------------------ |
| File dialog     | Click DropZone / Browse button | `<input type="file" multiple accept="image/*">`        |
| Drag & Drop     | Drag files onto DropZone       | Supports folder drop (Chrome/Edge)                     |
| Clipboard paste | Ctrl+V                         | Images from clipboard (screenshots, copy from browser) |
| URL import      | Paste URL                      | Download from URL (Phase 2; CORS aware)                |

### Mobile

| Method          | Trigger                | Notes                            |
| --------------- | ---------------------- | -------------------------------- |
| Gallery picker  | Tap "Import" button    | `expo-image-picker` multi-select |
| Camera capture  | Tap "Camera" button    | Direct capture → import          |
| Files app       | Files button           | `expo-document-picker`           |
| Share Extension | Share from another app | iOS Share Sheet / Android Intent |

---

## Functional Requirements

| Requirement                 | FR     | Priority |
| --------------------------- | ------ | -------- |
| Multi-file import           | FR-001 | MVP      |
| Folder import (web)         | FR-002 | MVP      |
| JPEG import                 | FR-003 | MVP      |
| PNG import                  | FR-004 | MVP      |
| WebP import                 | FR-005 | MVP      |
| HEIC/HEIF import            | FR-006 | MVP      |
| GIF import                  | FR-007 | MVP      |
| Clipboard paste (web)       | FR-008 | MVP      |
| Drag & Drop (web)           | FR-009 | MVP      |
| Gallery picker (mobile)     | FR-010 | MVP      |
| Camera capture (mobile)     | FR-011 | MVP      |
| Magic byte validation       | FR-012 | MVP      |
| Duplicate detection         | FR-013 | MVP      |
| Max file size check (100MB) | FR-014 | MVP      |
| Thumbnail generation        | FR-015 | MVP      |
| EXIF metadata extraction    | FR-016 | MVP      |

---

## Supported File Formats

| Format    | Extension        | Magic Bytes   | Import         | Export       |
| --------- | ---------------- | ------------- | -------------- | ------------ |
| JPEG      | .jpg, .jpeg      | FF D8 FF      | ✅             | ✅           |
| PNG       | .png             | 89 50 4E 47   | ✅             | ✅           |
| WebP      | .webp            | 52 49 46 46   | ✅             | ✅           |
| GIF       | .gif             | 47 49 46 38   | ✅             | ✅ (Phase 3) |
| BMP       | .bmp             | 42 4D         | ✅             | ❌           |
| HEIC/HEIF | .heic, .heif     | ftyp          | ✅             | ❌ (browser) |
| AVIF      | .avif            | ftyp          | ✅             | ✅ (Phase 2) |
| TIFF      | .tif, .tiff      | 49 49 / 4D 4D | ✅             | ❌           |
| SVG       | .svg             | `<svg`        | ✅ (rasterize) | ❌           |
| RAW       | .raw, .dng, .cr2 | various       | ❌ (Phase 3)   | ❌           |

---

## Duplicate Detection

```typescript
// Detect duplicates using perceptual hash (pHash)
async function detectDuplicate(
  newImage: ImageFile,
  existingImages: ImageFile[],
): Promise<string | null> {
  const newHash = await computePHash(newImage.buffer);

  for (const existing of existingImages) {
    const existingHash = await getPHash(existing.id);
    const distance = hammingDistance(newHash, existingHash);

    if (distance < DUPLICATE_THRESHOLD) {
      // threshold = 10
      return existing.id; // Returns ID of duplicate
    }
  }

  return null;
}
```

Duplicate detection uses perceptual hashing (pHash) — similar images have low Hamming distance regardless of format/compression differences.

---

## Import Performance

| Scenario             | Target                           |
| -------------------- | -------------------------------- |
| 1 image (5MP JPEG)   | < 500ms to thumbnail             |
| 50 images (5MP each) | < 5s to all thumbnails           |
| 500 images           | < 30s (background, non-blocking) |

Thumbnails are generated lazily using `requestIdleCallback` on Web.

---

_Document Owner: Product Team | Approved: 2026-07-27_
