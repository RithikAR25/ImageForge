# OCR Feature Specification

> **Document ID**: features/ocr
> **Phase**: 4 — Feature Specifications
> **Status**: Phase 3

---

## Overview

The OCR (Optical Character Recognition) feature extracts text from images using on-device AI — useful for digitizing documents, extracting data from screenshots, or making image text searchable.

---

## Functional Requirements

| Requirement                | FR     | Priority |
| -------------------------- | ------ | -------- |
| Extract text from image    | FR-470 | P3       |
| Copy extracted text        | FR-471 | P3       |
| Download text as .txt      | FR-472 | P3       |
| Multi-language detection   | FR-473 | P3       |
| Bounding box visualization | FR-474 | P3       |
| Document layout analysis   | FR-475 | P3       |
| Batch OCR                  | FR-476 | P3       |

---

## Implementation: Tesseract.js

```typescript
import Tesseract from 'tesseract.js';

interface OcrConfig {
  language: string; // 'eng', 'deu', 'fra', 'spa', etc. (Tesseract lang code)
  pageSegMode: number; // PSM mode: 1=auto, 3=fully auto, 6=single block
}

interface OcrResult {
  text: string;
  confidence: number; // 0-100
  words: Array<{
    text: string;
    confidence: number;
    bbox: { x: number; y: number; width: number; height: number };
  }>;
}

async function performOcr(
  imageBuffer: ArrayBuffer,
  config: OcrConfig,
  signal?: AbortSignal,
): Promise<OcrResult> {
  const worker = await Tesseract.createWorker(config.language, 1, {
    workerPath: '/tesseract/worker.min.js',
    langPath: '/tesseract/lang-data',
    corePath: '/tesseract/tesseract-core.wasm',
  });

  signal?.addEventListener('abort', () => worker.terminate());

  const blob = new Blob([imageBuffer]);
  const { data } = await worker.recognize(blob, {
    tessedit_pageseg_mode: config.pageSegMode,
  });

  await worker.terminate();

  return {
    text: data.text,
    confidence: data.confidence,
    words: data.words.map((w) => ({
      text: w.text,
      confidence: w.confidence,
      bbox: w.bbox,
    })),
  };
}
```

---

## Supported Languages (Phase 3)

English, French, German, Spanish, Portuguese, Italian, Dutch, Russian, Chinese (Simplified), Japanese, Korean, Arabic, Hindi

Additional languages downloadable on-demand (~5–15MB per language pack, cached in Service Worker).

---

## Bounding Box Visualization

When OCR completes, word bounding boxes are drawn on a Skia canvas overlay:

```
┌─────────────────────────────┐
│  INVOICE                    │  ← Highlighted word
│  Date: [2026-01-15]         │
│  Amount: [$250.00]          │
└─────────────────────────────┘

Extracted text:
┌─────────────────────────────┐
│ INVOICE                     │
│ Date: 2026-01-15            │
│ Amount: $250.00             │
│                             │
│ [Copy Text] [Download .txt] │
└─────────────────────────────┘
```

---

_Document Owner: Product Team | Status: Phase 3 | Approved: 2026-07-27_
