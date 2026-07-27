# Icon Generator Feature Specification

> **Document ID**: features/icon-generator
> **Phase**: 4 — Feature Specifications
> **Status**: Phase 3

---

## Overview

The Icon Generator feature exports images in all required sizes and formats for iOS App Store icons, Android Play Store icons, Favicon sets, and PWA icons — from a single source image.

---

## Functional Requirements

| Requirement                 | FR     | Priority |
| --------------------------- | ------ | -------- |
| iOS icon set generation     | FR-500 | P3       |
| Android icon set generation | FR-501 | P3       |
| Favicon set (web)           | FR-502 | P3       |
| PWA icon set                | FR-503 | P3       |
| macOS icon set (.icns)      | FR-504 | P3       |
| Windows icon (.ico)         | FR-505 | P3       |
| Download as ZIP             | FR-506 | P3       |
| Preview all sizes           | FR-507 | P3       |

---

## iOS Icon Sizes

| Size      | Filename      | Usage       |
| --------- | ------------- | ----------- |
| 1024×1024 | icon-1024.png | App Store   |
| 180×180   | icon-180.png  | iPhone (3x) |
| 120×120   | icon-120.png  | iPhone (2x) |
| 167×167   | icon-167.png  | iPad Pro    |
| 152×152   | icon-152.png  | iPad (2x)   |

## Android Icon Sizes

| Density | Size    | Folder         |
| ------- | ------- | -------------- |
| xxxhdpi | 192×192 | mipmap-xxxhdpi |
| xxhdpi  | 144×144 | mipmap-xxhdpi  |
| xhdpi   | 96×96   | mipmap-xhdpi   |
| hdpi    | 72×72   | mipmap-hdpi    |
| mdpi    | 48×48   | mipmap-mdpi    |

## Favicon Sizes

| Size    | Filename             | Usage      |
| ------- | -------------------- | ---------- |
| 32×32   | favicon-32.png       | Browsers   |
| 16×16   | favicon-16.png       | Legacy     |
| 180×180 | apple-touch-icon.png | iOS Safari |
| 192×192 | pwa-192.png          | PWA        |
| 512×512 | pwa-512.png          | PWA splash |

---

## Implementation

```typescript
interface IconGeneratorConfig {
  preset: 'ios' | 'android' | 'favicon' | 'pwa' | 'all';
  cornerRadius?: number; // iOS-style rounded corners (0 = square)
  padding?: number; // Background padding percentage
  backgroundColor?: string; // For icons that need background
}

async function generateIconSet(
  sourceImage: ImageFile,
  config: IconGeneratorConfig,
): Promise<{ name: string; buffer: ArrayBuffer }[]> {
  const sizes = getIconSizes(config.preset);

  return Promise.all(
    sizes.map(async ({ width, height, filename }) => {
      const resized = await resizeImage(sourceImage, { width, height, mode: 'fill' });

      let processed = resized;
      if (config.cornerRadius) {
        processed = await applyRoundedCorners(resized, config.cornerRadius);
      }

      return { name: filename, buffer: processed.buffer };
    }),
  );
}
```

Output is a ZIP file with the correct folder structure for each platform.

---

_Document Owner: Product Team | Status: Phase 3 | Approved: 2026-07-27_
