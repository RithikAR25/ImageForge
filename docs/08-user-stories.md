# User Stories

> **Document ID**: 08
> **Phase**: 1 — Product Planning
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Product Team

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Scope](#2-scope)
3. [Story Format](#3-story-format)
4. [Epic: Image Import](#4-epic-image-import)
5. [Epic: Compression](#5-epic-compression)
6. [Epic: Resize](#6-epic-resize)
7. [Epic: Crop](#7-epic-crop)
8. [Epic: Rotate & Flip](#8-epic-rotate--flip)
9. [Epic: Format Conversion](#9-epic-format-conversion)
10. [Epic: Batch Processing](#10-epic-batch-processing)
11. [Epic: Image Enhancement](#11-epic-image-enhancement)
12. [Epic: Filters](#12-epic-filters)
13. [Epic: Watermark](#13-epic-watermark)
14. [Epic: GIF Creation](#14-epic-gif-creation)
15. [Epic: PDF Tools](#15-epic-pdf-tools)
16. [Epic: OCR](#16-epic-ocr)
17. [Epic: Metadata](#17-epic-metadata)
18. [Epic: History & Undo](#18-epic-history--undo)
19. [Epic: Settings](#19-epic-settings)
20. [Epic: Developer Experience](#20-epic-developer-experience)
21. [Related Documents](#21-related-documents)

---

## 1. Purpose

User stories capture product requirements from the user's perspective using natural language. They serve as the primary input for sprint planning and acceptance test writing. Each story connects to one or more personas and one or more functional requirements.

---

## 2. Scope

This document contains the complete user story backlog for ImageForge across all platforms and phases. Stories are organized by epic (feature area). Each story includes acceptance criteria.

---

## 3. Story Format

```
US-XXX [Priority] [Platform]
As a [persona], I want to [action], so that [benefit].

Acceptance Criteria:
  AC1: [Given] [When] [Then]
  AC2: ...

Linked FRs: FR-XXX, FR-YYY
```

**Priority**: MVP / P2 / P3 / Future  
**Platform**: ALL / WEB / MOBILE

---

## 4. Epic: Image Import

### US-001 [MVP] [WEB]

**As Alex**, I want to click a large upload button to select photos from my computer, so that I can get started without figuring out drag and drop.

**Acceptance Criteria**:

- AC1: Given I'm on the home screen, when I click "Upload Image", then a native file picker opens
- AC2: Given the file picker is open, when I select multiple images, all are added to the workspace
- AC3: Given I select an unsupported file type (.psd), then I see a clear error listing supported formats

_Linked FRs: FR-021, FR-028_

---

### US-002 [MVP] [WEB]

**As Sam**, I want to drag an entire export folder onto the ImageForge drop zone, so that I can import 200 images at once without selecting them one by one.

**Acceptance Criteria**:

- AC1: Given the home screen, when I drag a folder onto the drop zone, then all image files within the folder are enumerated recursively
- AC2: Given folder import, when non-image files are found, they are silently skipped
- AC3: Given folder import, when a thumbnail is shown for each imported image within 500ms

_Linked FRs: FR-022, FR-024, FR-030_

---

### US-003 [MVP] [WEB]

**As Casey**, I want to paste an image directly from my clipboard, so that I can process screenshots without saving them first.

**Acceptance Criteria**:

- AC1: Given focus on the app, when I press Ctrl+V/Cmd+V, then the clipboard image is added to the workspace
- AC2: Given no image is in clipboard, when I paste, then I see a message "No image found in clipboard"
- AC3: Given a PNG in clipboard, the full alpha channel is preserved

_Linked FRs: FR-023_

---

### US-004 [MVP] [MOBILE]

**As Jordan**, I want to import photos directly from my photo library, so that I don't have to transfer files to a computer first.

**Acceptance Criteria**:

- AC1: Given I tap "Import from Gallery", then the native photo picker opens
- AC2: Given multi-select mode, when I select 50 photos, all are added to the queue
- AC3: Given permission denied, then I see an explanation and a "Open Settings" button

_Linked FRs: FR-025_

---

### US-005 [MVP] [ALL]

**As Jordan**, I want the system to detect if I'm importing a duplicate image, so that I don't accidentally process the same photo twice.

**Acceptance Criteria**:

- AC1: Given an image already in the queue, when I import the same file again, then a warning dialog appears with options: "Skip", "Add Anyway", "Replace"
- AC2: Given duplicate detection runs, it completes within 200ms per image

_Linked FRs: FR-032_

---

## 5. Epic: Compression

### US-010 [MVP] [ALL]

**As Alex**, I want to compress my photo using a "WhatsApp" preset so that I don't have to understand quality percentages.

**Acceptance Criteria**:

- AC1: Given I have an image loaded, when I select the "WhatsApp" preset, then quality is automatically set to produce a file ≤ 200KB
- AC2: Given the WhatsApp preset, when I press compress, the output is a JPEG regardless of input format
- AC3: Given compression is complete, I see original size vs compressed size and % reduction

_Linked FRs: FR-056_

---

### US-011 [MVP] [ALL]

**As Sam**, I want to set a target file size of 500KB and have ImageForge automatically find the best quality setting, so that I don't waste time manually adjusting the quality slider.

**Acceptance Criteria**:

- AC1: Given I enter "500KB" as target size, when I press compress, the system iterates to find optimal quality within ±10%
- AC2: Given the system cannot achieve target size without unacceptable quality degradation, it shows a warning
- AC3: The result file size is within ±10% of the target

_Linked FRs: FR-054_

---

### US-012 [MVP] [ALL]

**As Alex**, I want to see a before/after preview before downloading, so that I can make sure the quality is acceptable.

**Acceptance Criteria**:

- AC1: A split-slider component shows the original image on one side and compressed image on the other
- AC2: I can drag the slider left/right to compare
- AC3: The preview updates within 500ms of changing the quality setting

_Linked FRs: FR-057_

---

## 6. Epic: Resize

### US-020 [MVP] [ALL]

**As Casey**, I want to resize my image to an "Instagram Post" preset, so that I don't have to look up the exact pixel dimensions.

**Acceptance Criteria**:

- AC1: Given I select "Instagram Post" preset, the dimensions are set to 1080×1080
- AC2: Given the image is not square, I'm offered "Crop to Fit", "Add Padding", or "Stretch" options
- AC3: The output dimensions match exactly 1080×1080

_Linked FRs: FR-076_

---

### US-021 [MVP] [ALL]

**As Sam**, I want to resize all 200 images to 50% of their original size in batch, so that I can generate web-delivery thumbnails quickly.

**Acceptance Criteria**:

- AC1: Given a batch queue, when I add "Resize 50%" to the pipeline, it applies to every image
- AC2: Each image maintains its individual aspect ratio
- AC3: Batch of 200 images at 50% resize completes within 2 minutes

_Linked FRs: FR-071, FR-302_

---

## 7. Epic: Crop

### US-030 [MVP] [ALL]

**As Casey**, I want to crop an image to a 1:1 ratio with a draggable crop box, so that I can make any image Instagram-ready.

**Acceptance Criteria**:

- AC1: A crop overlay appears with handles at corners and edges
- AC2: When "1:1" is selected, the crop region is constrained to a square
- AC3: I can drag the crop region to reposition it on the image
- AC4: A "Preview" shows the cropped result before I apply

_Linked FRs: FR-091, FR-092_

---

### US-031 [MVP] [ALL]

**As Morgan**, I want to crop to a circle with transparent background, so that I can create profile picture assets.

**Acceptance Criteria**:

- AC1: Selecting "Circle Crop" shows a circular crop overlay
- AC2: Output is a PNG file with transparent pixels outside the circle
- AC3: The circle is constrained to be inscribed within the selected square crop

_Linked FRs: FR-095_

---

## 8. Epic: Rotate & Flip

### US-040 [MVP] [ALL]

**As Jordan**, I want my imported photos to automatically be rotated correctly based on their EXIF orientation data, so that I don't have to manually rotate sideways photos.

**Acceptance Criteria**:

- AC1: When a JPEG with Exif rotation tag is imported, the displayed thumbnail and exported file have the correct orientation
- AC2: Auto-rotation can be disabled in settings

_Linked FRs: FR-114_

---

### US-041 [MVP] [ALL]

**As Alex**, I want to rotate my photo 90 degrees with a single tap, so that I can fix a photo I took sideways.

**Acceptance Criteria**:

- AC1: Tapping the rotate-90° button instantly applies the rotation to the preview
- AC2: Multiple taps are cumulative (tap again for 180°, again for 270°)

_Linked FRs: FR-110_

---

## 9. Epic: Format Conversion

### US-050 [MVP] [ALL]

**As Alex**, I want to convert HEIC photos from my iPhone to JPEG, so that I can share them with Android users and Windows computers.

**Acceptance Criteria**:

- AC1: HEIC files are accepted on import (Web: WASM decoder, Mobile: system codec)
- AC2: I can select JPEG as output format
- AC3: The converted JPEG is visually identical to the original
- AC4: The output file has `.jpg` extension

_Linked FRs: FR-033, FR-130_

---

### US-051 [P2] [ALL]

**As Sam**, I want to batch convert a folder of PNG images to WebP format, so that I can reduce asset sizes for a web project.

**Acceptance Criteria**:

- AC1: In batch mode, I can select "WebP" as the output format for all images
- AC2: Transparency in PNG files is preserved in the WebP output
- AC3: I can configure WebP quality (default: 80)

_Linked FRs: FR-130, FR-135_

---

## 10. Epic: Batch Processing

### US-060 [MVP] [ALL]

**As Sam**, I want to pause the batch queue when I need my computer's resources for something else, then resume it later, so that I can batch process without degrading my work machine's performance.

**Acceptance Criteria**:

- AC1: A "Pause" button is available during active batch processing
- AC2: When paused, the current item completes but no new items start
- AC3: A "Resume" button starts processing from where it left off
- AC4: Pause state persists across page refresh

_Linked FRs: FR-303_

---

### US-061 [MVP] [ALL]

**As Jordan**, I want individual failed items in the batch to be retryable, so that a single corrupt photo doesn't force me to restart the entire 800-photo batch.

**Acceptance Criteria**:

- AC1: Failed items show an error state in the queue with a brief error description
- AC2: A "Retry" button on failed items re-queues only that item
- AC3: A "Retry All Failed" button re-queues all failed items
- AC4: Successful items are not reprocessed on retry

_Linked FRs: FR-304_

---

### US-062 [MVP] [ALL]

**As Sam**, I want the batch queue to survive if I accidentally close the browser tab, so that I don't lose my progress on 200 images.

**Acceptance Criteria**:

- AC1: Queue state (completed, pending, failed items) is persisted to IndexedDB after each item
- AC2: On next page load, the queue is restored with its previous state
- AC3: User is shown a "Resume previous session?" prompt on load if a queue exists

_Linked FRs: FR-306_

---

## 11. Epic: Image Enhancement

### US-070 [P2] [ALL]

**As Jordan**, I want to adjust the brightness and contrast of all 800 event photos consistently, so that my photo gallery has a cohesive look.

**Acceptance Criteria**:

- AC1: Enhancement controls (sliders) are available in the batch pipeline
- AC2: The same enhancement values are applied to all queued images
- AC3: Histogram shows the distribution of adjusted values

_Linked FRs: FR-150, FR-151, FR-159_

---

### US-071 [P2] [ALL]

**As Jordan**, I want to use the "Auto Enhance" feature to automatically adjust exposure and white balance, so that I can deliver client photos faster without manual tuning.

**Acceptance Criteria**:

- AC1: "Auto Enhance" button analyzes the image and applies optimal adjustments automatically
- AC2: The applied values are shown in sliders so I can fine-tune if needed
- AC3: Auto enhance is available in batch mode

_Linked FRs: FR-160_

---

## 12. Epic: Filters

### US-080 [P2] [ALL]

**As Casey**, I want to apply a "Vintage" filter to a series of photos with consistent intensity, so that my Instagram feed has a cohesive aesthetic.

**Acceptance Criteria**:

- AC1: "Vintage" filter is available in the filters panel
- AC2: An intensity slider (0–100%) controls the filter strength
- AC3: Preview updates in real-time as I drag the slider
- AC4: Filter can be added to a batch pipeline

_Linked FRs: FR-170, FR-171_

---

### US-081 [P2] [ALL]

**As Jordan**, I want to import a custom `.cube` LUT file from my existing Lightroom workflow, so that I can apply my professional color grade to batches of photos.

**Acceptance Criteria**:

- AC1: I can upload a `.cube` LUT file (17³ or 33³)
- AC2: The LUT is applied using GPU-accelerated shaders
- AC3: The LUT appears in my filter library for future use

_Linked FRs: FR-172_

---

## 13. Epic: Watermark

### US-090 [P2] [ALL]

**As Jordan**, I want to add my studio logo as a watermark in the bottom-right corner of all 800 photos, so that my delivered work is branded.

**Acceptance Criteria**:

- AC1: I can upload a PNG logo as the watermark image
- AC2: I can position it at the bottom-right anchor point
- AC3: I can adjust opacity (default: 40%)
- AC4: The watermark is applied to all images in the batch pipeline
- AC5: The watermark position adjusts proportionally for images with different aspect ratios

_Linked FRs: FR-191, FR-193, FR-194_

---

## 14. Epic: GIF Creation

### US-100 [P3] [ALL]

**As Casey**, I want to turn 6 portrait photos into a GIF animation for Instagram Stories, so that I can create eye-catching content without a separate tool.

**Acceptance Criteria**:

- AC1: I can select multiple images and arrange them in the GIF frame order
- AC2: I can set a global frame duration (default: 200ms)
- AC3: I can preview the animation before exporting
- AC4: Output is a valid GIF file

_Linked FRs: FR-210, FR-212, FR-214_

---

## 15. Epic: PDF Tools

### US-110 [P3] [ALL]

**As Sam**, I want to combine a set of images into a single PDF document for a client deliverable, so that I can avoid emailing 20 separate files.

**Acceptance Criteria**:

- AC1: I can select multiple images and set their page order
- AC2: I can select page size (A4 default)
- AC3: Output is a valid PDF with one image per page
- AC4: Batch of 20 images produces PDF within 10 seconds

_Linked FRs: FR-220, FR-221_

---

## 16. Epic: OCR

### US-120 [P3] [ALL]

**As Alex**, I want to extract text from a screenshot of a sign, so that I can type the text without typing it manually.

**Acceptance Criteria**:

- AC1: I can load an image and press "Extract Text"
- AC2: The extracted text appears in a text area
- AC3: A "Copy to Clipboard" button copies the text
- AC4: Recognized text regions are highlighted on the image

_Linked FRs: FR-230, FR-233_

---

## 17. Epic: Metadata

### US-130 [P2] [ALL]

**As Jordan**, I want to strip GPS coordinates from all client photos before delivery, so that I don't accidentally reveal shoot locations.

**Acceptance Criteria**:

- AC1: A "Remove GPS" button is clearly visible in the metadata panel
- AC2: The GPS removal applies to all images in batch mode
- AC3: Confirmation that GPS has been removed is shown in the export summary

_Linked FRs: FR-072, FR-075_

---

### US-131 [P2] [ALL]

**As Alex**, I want to see a warning when my photo contains GPS data, so that I'm aware before sharing it with others.

**Acceptance Criteria**:

- AC1: When GPS metadata is detected in an imported image, a warning banner is shown
- AC2: The banner includes a "Remove GPS" action button
- AC3: The warning is dismissible if the user chooses to keep the GPS data

_Linked FRs: FR-072_

---

## 18. Epic: History & Undo

### US-140 [MVP] [ALL]

**As any user**, I want to undo my last operation, so that I can recover from a mistake without starting over.

**Acceptance Criteria**:

- AC1: Pressing Ctrl+Z / Cmd+Z (Web) or the undo button reverts the last operation
- AC2: Multiple undos are supported (unlimited within session)
- AC3: After undoing, Ctrl+Y / Cmd+Y re-applies the operation (redo)

_Linked FRs: FR-350, FR-352_

---

### US-141 [MVP] [ALL]

**As Sam**, I want to see a visual history panel showing each operation I've applied, so that I can jump back to a specific state.

**Acceptance Criteria**:

- AC1: History panel shows a chronological list of operations with icons and labels
- AC2: Each history item shows a small thumbnail of the image at that state
- AC3: Clicking a history item reverts to that state

_Linked FRs: FR-353_

---

## 19. Epic: Settings

### US-150 [MVP] [ALL]

**As Sam**, I want to set WebP as my default output format so that all my exports automatically use WebP without me selecting it each time.

**Acceptance Criteria**:

- AC1: Settings screen has a "Default Output Format" option
- AC2: When WebP is selected, all new processing operations default to WebP
- AC3: The setting persists across sessions

_Linked FRs: FR-440, FR-441_

---

### US-151 [MVP] [ALL]

**As Alex**, I want the app to use dark mode automatically when my system is in dark mode, so that it matches my other apps.

**Acceptance Criteria**:

- AC1: The app defaults to "System" theme
- AC2: When the OS is in dark mode, ImageForge uses dark mode
- AC3: When the OS switches to light mode, ImageForge switches accordingly

_Linked FRs: FR-008_

---

## 20. Epic: Developer Experience

### US-160 [MVP] [ALL]

**As Morgan**, I want to install `@imageforge/image-core` as an npm package in my own project, so that I can use ImageForge's compression algorithms without embedding the full app.

**Acceptance Criteria**:

- AC1: `@imageforge/image-core` is published to npm with proper typing
- AC2: The package includes TypeScript declarations
- AC3: The package can be imported in a standard Node.js project
- AC4: Documentation exists for all public APIs

---

### US-161 [MVP] [ALL]

**As Morgan**, I want to run `pnpm dev` and have the full app working locally within 5 minutes of cloning, so that I can evaluate the code without spending time on configuration.

**Acceptance Criteria**:

- AC1: `git clone` + `pnpm install` + `pnpm dev` produces a running web app
- AC2: No manual configuration of environment variables required for basic functionality
- AC3: Any required environment variables are documented in `.env.example`

---

## 21. Related Documents

| Document                                                                           | Relationship                   |
| ---------------------------------------------------------------------------------- | ------------------------------ |
| [07-user-personas.md](./07-user-personas.md)                                       | Personas referenced in stories |
| [05-functional-requirements.md](./05-functional-requirements.md)                   | FRs linked from stories        |
| [09-use-cases.md](./09-use-cases.md)                                               | Use cases expand key stories   |
| [13-requirements-traceability-matrix.md](./13-requirements-traceability-matrix.md) | Story → test traceability      |

---

_Document Owner: Product Team | Review Cycle: Per-sprint | Approved: 2026-07-27_
