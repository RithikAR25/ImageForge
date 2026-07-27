# QR Code Feature Specification

> **Document ID**: features/qr
> **Phase**: 4 — Feature Specifications
> **Status**: Phase 3

---

## Overview

QR Code tools — generate QR codes from text/URLs, and decode QR codes from images.

---

## Functional Requirements

| Requirement                  | FR     | Priority |
| ---------------------------- | ------ | -------- |
| Generate QR from URL/text    | FR-490 | P3       |
| Decode QR code from image    | FR-491 | P3       |
| QR size and error correction | FR-492 | P3       |
| QR with logo overlay         | FR-493 | P3       |
| Download QR as PNG/SVG       | FR-494 | P3       |

---

## Implementation

**Generation**: `qrcode` npm package (pure JS, 12KB gzipped)

```typescript
import QRCode from 'qrcode';

interface QrGenerateConfig {
  content: string; // URL or text
  size: number; // Pixels (64–2048)
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  foregroundColor: string;
  backgroundColor: string;
  logoImageId?: string; // Overlay a logo in center
}

async function generateQr(config: QrGenerateConfig): Promise<ArrayBuffer> {
  const dataUrl = await QRCode.toDataURL(config.content, {
    width: config.size,
    errorCorrectionLevel: config.errorCorrection,
    color: {
      dark: config.foregroundColor,
      light: config.backgroundColor,
    },
  });
  return dataUrlToArrayBuffer(dataUrl);
}
```

**Decoding**: `jsQR` library (pure JS, detects QR from camera or image)

```typescript
import jsQR from 'jsqr';

async function decodeQr(imageBuffer: ArrayBuffer): Promise<string | null> {
  const imageData = bufferToImageData(imageBuffer);
  const result = jsQR(imageData.data, imageData.width, imageData.height);
  return result?.data ?? null;
}
```

---

_Document Owner: Product Team | Status: Phase 3 | Approved: 2026-07-27_
