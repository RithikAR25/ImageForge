# PDF Tools Feature Specification

> **Document ID**: features/pdf
> **Phase**: 4 — Feature Specifications
> **Status**: Phase 3

---

## Overview

The PDF Tools feature enables image-to-PDF conversion, multi-image PDF creation, and PDF-to-image extraction — all processed on-device.

---

## Functional Requirements

| Requirement                                         | FR     | Priority |
| --------------------------------------------------- | ------ | -------- |
| Image(s) → PDF                                      | FR-460 | P3       |
| Multi-image → multi-page PDF                        | FR-461 | P3       |
| PDF page size selection (A4, Letter, etc.)          | FR-462 | P3       |
| Image fit mode (fit page, fill page, original size) | FR-463 | P3       |
| Compressed PDF output                               | FR-464 | P3       |
| PDF metadata (title, author)                        | FR-465 | P3       |
| PDF → Images (extract pages)                        | FR-466 | P3       |
| Batch image → PDF                                   | FR-467 | P3       |

---

## PDF Page Sizes

| Name   | Width (mm) | Height (mm) |
| ------ | ---------- | ----------- |
| A4     | 210        | 297         |
| A3     | 297        | 420         |
| Letter | 215.9      | 279.4       |
| Legal  | 215.9      | 355.6       |
| Square | 210        | 210         |

---

## Implementation

PDF generation uses `pdf-lib` (pure JavaScript, no native deps):

```typescript
import { PDFDocument, PageSizes } from 'pdf-lib';

interface PdfConfig {
  pageSize: 'A4' | 'A3' | 'Letter' | 'Legal' | 'Square';
  orientation: 'portrait' | 'landscape';
  imageFit: 'fit' | 'fill' | 'original';
  margin: number; // mm
  quality: number; // JPEG quality for embedded images (1-100)
  metadata?: {
    title?: string;
    author?: string;
  };
}

async function createPdf(images: ImageFile[], config: PdfConfig): Promise<ArrayBuffer> {
  const pdfDoc = await PDFDocument.create();

  if (config.metadata?.title) {
    pdfDoc.setTitle(config.metadata.title);
  }

  const [pageWidth, pageHeight] = PageSizes[config.pageSize];

  for (const image of images) {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Compress image as JPEG for embedding
    const jpegBytes = await compressToJpeg(image.buffer, config.quality);
    const pdfImage = await pdfDoc.embedJpg(jpegBytes);

    const { x, y, width, height } = calculateImageFit(
      pdfImage.width,
      pdfImage.height,
      pageWidth,
      pageHeight,
      config.imageFit,
      config.margin,
    );

    page.drawImage(pdfImage, { x, y, width, height });
  }

  return (await pdfDoc.save()).buffer;
}
```

---

## PDF → Images

PDF page extraction uses `pdfjs-dist` (Mozilla PDF.js):

```typescript
async function extractPdfPages(pdfBuffer: ArrayBuffer): Promise<ImageFile[]> {
  const pdf = await pdfjsLib.getDocument({ data: pdfBuffer }).promise;
  const pages: ImageFile[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 }); // 2x for quality

    const canvas = new OffscreenCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext('2d')!;

    await page.render({ canvasContext: ctx, viewport }).promise;
    const blob = await canvas.convertToBlob({ type: 'image/png' });
    const buffer = await blob.arrayBuffer();

    pages.push(createImageFile(buffer, `page-${i}.png`));
  }

  return pages;
}
```

---

_Document Owner: Product Team | Status: Phase 3 | Approved: 2026-07-27_
