# Product Requirements Document (PRD)

> **Document ID**: 03
> **Phase**: 1 — Product Planning
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Product Team

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Scope](#2-scope)
3. [Product Overview](#3-product-overview)
4. [User Personas](#4-user-personas)
5. [Feature Catalog](#5-feature-catalog)
6. [Feature Availability Matrix](#6-feature-availability-matrix)
7. [User Experience Requirements](#7-user-experience-requirements)
8. [Platform Requirements](#8-platform-requirements)
9. [Integration Requirements](#9-integration-requirements)
10. [Acceptance Criteria](#10-acceptance-criteria)
11. [Assumptions](#11-assumptions)
12. [Open Questions](#12-open-questions)
13. [Related Documents](#13-related-documents)

---

## 1. Purpose

This Product Requirements Document (PRD) defines what ImageForge must do from the user's perspective. It translates the business objectives from the [BRD](./02-business-requirements-document.md) into specific, testable product requirements organized by feature area.

---

## 2. Scope

This PRD covers the complete feature set of ImageForge across all target platforms (Web, Android, iOS). It defines acceptance criteria at the feature level. Detailed UX specifications are in the [UI/UX documents](./50-design-system.md). Detailed technical specifications are in the [architecture documents](./20-system-architecture-document.md).

---

## 3. Product Overview

ImageForge is an image processing platform with the following core attributes:

```
What it is:   A comprehensive image processing platform
Who it's for: End users (casual to professional) and developers
How it works: Client-side WASM on Web; native processing on mobile
Where it runs: Browser (Web), Android, iOS
Key value:    Privacy-first, offline-capable, cross-platform
```

### Product Modes

**Tool Mode** — Single image processing
: The user selects one image, applies operations, downloads the result.

**Batch Mode** — Multiple image processing
: The user queues multiple images with a shared pipeline of operations.

**Project Mode** — Non-destructive editing workspace
: The user works on a named project with full undo/redo history, saved sessions.

---

## 4. User Personas

> Full persona specifications: [07-user-personas.md](./07-user-personas.md)

| Persona                     | Description                                  | Primary Use Cases                        |
| --------------------------- | -------------------------------------------- | ---------------------------------------- |
| **Alex** (Casual User)      | Non-technical, compresses photos for sharing | Compress, Resize, Convert                |
| **Sam** (Designer)          | Uses daily for image optimization workflows  | Batch, Resize, Format Convert, Watermark |
| **Morgan** (Developer)      | Evaluates as SDK/library, inspects code      | All features, API docs, packages         |
| **Jordan** (Photographer)   | Processes large RAW exports                  | Batch, Filters, Enhancement, Metadata    |
| **Casey** (Content Creator) | Creates thumbnails, collages, watermarks     | Collage, Watermark, Resize, GIF          |

---

## 5. Feature Catalog

Each feature is assigned:

- **ID**: Unique feature identifier
- **Name**: Feature name
- **Priority**: P0 (MVP critical), P1 (MVP important), P2 (Post-MVP near), P3 (Post-MVP far)
- **Platforms**: Platforms where the feature is available

---

### 5.1 Import Module

**Feature ID**: F-001 | **Priority**: P0 | **Platforms**: Web, Android, iOS

The entry point for all image processing workflows. Must support multiple input methods per platform.

**Web Requirements**:

- PR-001: User can upload images via file picker (multi-select)
- PR-002: User can drag & drop files and folders onto the upload zone
- PR-003: User can paste images from clipboard (Ctrl+V / Cmd+V)
- PR-004: User can import from URLs
- PR-005: Folder upload preserves directory structure for batch mode
- PR-006: Duplicate detection alerts user before adding duplicate images

**Mobile (Android/iOS) Requirements**:

- PR-007: User can import from device photo gallery
- PR-008: User can capture a new photo with the device camera
- PR-009: User can import from the device file system
- PR-010: User can receive shared images from other apps (Share extension)

**All Platforms**:

- PR-011: Supported import formats: JPEG, PNG, WebP, AVIF, HEIC, GIF, TIFF, BMP, SVG
- PR-012: Thumbnail is generated immediately upon import for preview
- PR-013: Metadata preview (EXIF, dimensions, file size) displayed on import
- PR-014: Maximum batch size: 500 images per session
- PR-015: Maximum single file size: 100MB

---

### 5.2 Compression Module

**Feature ID**: F-002 | **Priority**: P0 | **Platforms**: Web, Android, iOS

**Requirements**:

- PR-020: User can select lossy compression (JPEG via mozjpeg, WebP lossy)
- PR-021: User can select lossless compression (PNG via pngquant, WebP lossless)
- PR-022: User can set target quality percentage (1–100)
- PR-023: User can set target file size (in KB or MB) — adaptive compression finds optimal quality
- PR-024: Real-time preview shows before/after split view
- PR-025: File size reduction percentage shown in real-time
- PR-026: Compression presets: WhatsApp (< 200KB), Email (< 500KB), Web (< 100KB), Custom
- PR-027: Batch compression applies same settings to all queued images
- PR-028: Queue processing shows per-image progress and aggregate progress

---

### 5.3 Resize Module

**Feature ID**: F-003 | **Priority**: P0 | **Platforms**: Web, Android, iOS

**Requirements**:

- PR-030: User can resize by specifying width and/or height in pixels
- PR-031: User can resize by percentage (10%–500%)
- PR-032: Aspect ratio lock maintains proportions by default; user can unlock
- PR-033: Fit mode: image fits within specified dimensions, may letterbox
- PR-034: Fill mode: image fills specified dimensions, may crop
- PR-035: Crop-to-fit mode: automatically crops to exact dimensions
- PR-036: Social media presets: Instagram (1:1, 4:5, 16:9), Twitter, Facebook, YouTube, TikTok
- PR-037: Wallpaper presets: common screen resolutions (1920×1080, 2560×1440, 3840×2160, etc.)
- PR-038: Batch resize applies same dimensions to all images

---

### 5.4 Crop Module

**Feature ID**: F-004 | **Priority**: P0 | **Platforms**: Web, Android, iOS

**Requirements**:

- PR-040: User can crop freely by dragging handles on a canvas overlay
- PR-041: User can constrain to fixed aspect ratios (1:1, 4:3, 16:9, 9:16, etc.)
- PR-042: User can specify exact crop dimensions
- PR-043: Circle crop produces circular output with transparent background (PNG)
- PR-044: Smart crop detects the most visually significant region automatically
- PR-045: Face-aware crop detects faces and centers crop around them
- PR-046: Crop preview shows result before applying

---

### 5.5 Rotate & Flip Module

**Feature ID**: F-005 | **Priority**: P0 | **Platforms**: Web, Android, iOS

**Requirements**:

- PR-050: User can rotate 90°, 180°, 270° clockwise
- PR-051: User can rotate to a custom angle (-180° to 180°) with fill/crop behavior
- PR-052: User can flip horizontally
- PR-053: User can flip vertically
- PR-054: Auto EXIF rotation corrects orientation from camera metadata

---

### 5.6 Format Conversion Module

**Feature ID**: F-006 | **Priority**: P0 | **Platforms**: Web, Android, iOS

**Requirements**:

- PR-060: Convert between: JPEG, PNG, WebP, AVIF, HEIC, GIF, TIFF, BMP, ICO
- PR-061: PDF output from single or multiple images
- PR-062: ZIP export bundles converted batch results
- PR-063: Conversion options preserved per format (quality, lossless flag, etc.)
- PR-064: Batch conversion applies same target format to all images

---

### 5.7 Metadata Module

**Feature ID**: F-007 | **Priority**: P1 | **Platforms**: Web, Android, iOS

**Requirements**:

- PR-070: View all EXIF/IPTC/XMP metadata fields
- PR-071: Edit writable EXIF fields (title, description, author, copyright)
- PR-072: Remove GPS coordinates with one tap ("Remove Location")
- PR-073: Strip all metadata while preserving image data ("Privacy Mode")
- PR-074: Display metadata as formatted table and raw view
- PR-075: Batch metadata operations (strip, edit) apply to all queued images

---

### 5.8 Image Enhancement Module

**Feature ID**: F-008 | **Priority**: P1 | **Platforms**: Web, Android, iOS

**Requirements**:

- PR-080: Adjust brightness (−100 to +100)
- PR-081: Adjust contrast (−100 to +100)
- PR-082: Adjust exposure (−5 to +5 EV)
- PR-083: Adjust saturation (−100 to +100, 0 = grayscale)
- PR-084: Adjust hue rotation (0°–360°)
- PR-085: Adjust gamma (0.1–10.0)
- PR-086: White balance correction (temperature: 2000K–10000K, tint)
- PR-087: Curves editor with RGB and individual channel control
- PR-088: Levels editor with input/output level controls per channel
- PR-089: Histogram display (live update as adjustments applied)
- PR-090: Auto Enhance button applies AI-based optimal adjustments
- PR-091: All adjustments previewed in real-time via Skia shaders

---

### 5.9 Filters Module

**Feature ID**: F-009 | **Priority**: P1 | **Platforms**: Web, Android, iOS

**Requirements**:

- PR-100: Built-in filter presets: Vintage, Noir, HDR, Film, Cinema, Matte
- PR-101: Filters applied via LUT (Look-Up Table) for performance
- PR-102: Custom LUT import (`.cube` format)
- PR-103: Filter intensity slider (0–100%)
- PR-104: Real-time preview using Skia GPU shaders

---

### 5.10 Background Module

**Feature ID**: F-010 | **Priority**: P1 | **Platforms**: Web, Android, iOS

**Requirements**:

- PR-110: Remove background using on-device WASM ML model (U2Net/RMBG)
- PR-111: Replace removed background with solid color
- PR-112: Replace removed background with custom image
- PR-113: Apply Gaussian blur to background (portrait mode effect)
- PR-114: Output transparent background as PNG

---

### 5.11 Watermark Module

**Feature ID**: F-011 | **Priority**: P1 | **Platforms**: Web, Android, iOS

**Requirements**:

- PR-120: Add text watermark (font, size, color, opacity, position)
- PR-121: Add logo/image watermark (scale, opacity, position)
- PR-122: Generate and embed QR code as watermark
- PR-123: Watermark position: 9 anchor points + custom coordinate
- PR-124: Batch watermark applies same watermark to all images

---

### 5.12 Drawing Module

**Feature ID**: F-012 | **Priority**: P1 | **Platforms**: Web, Android, iOS

**Requirements**:

- PR-130: Freehand brush (size, color, opacity, hardness)
- PR-131: Shapes: rectangle, circle, line, arrow
- PR-132: Text annotation (font, size, color, position)
- PR-133: Emoji and sticker overlay
- PR-134: Undo/redo (unlimited steps within session)
- PR-135: Eraser tool
- PR-136: Drawing layers (separate from base image)

---

### 5.13 Blur Module

**Feature ID**: F-013 | **Priority**: P1 | **Platforms**: Web, Android, iOS

**Requirements**:

- PR-140: Gaussian blur (radius 0–100)
- PR-141: Motion blur (angle, distance)
- PR-142: Pixelate / mosaic effect (block size)
- PR-143: Selective blur with mask (brush-paint area to blur)
- PR-144: Face blur: auto-detect faces and apply blur
- PR-145: Background blur (requires background removal)

---

### 5.14 Batch Processing Module

**Feature ID**: F-014 | **Priority**: P0 | **Platforms**: Web, Android, iOS

**Requirements**:

- PR-150: Add multiple images to a processing queue
- PR-151: Apply a shared pipeline of operations to all queued images
- PR-152: Pipeline operations can be reordered by drag
- PR-153: Processing is pauseable, resumable, and cancellable
- PR-154: Failed items show error state with retry option
- PR-155: Per-image progress shown alongside aggregate progress
- PR-156: Queue survives page refresh (persisted to IndexedDB/SQLite)
- PR-157: Output folder organization (flat, by original name, by date)

---

### 5.15 GIF Module

**Feature ID**: F-015 | **Priority**: P1 | **Platforms**: Web, Android, iOS

**Requirements**:

- PR-160: Create GIF from multiple images (animation)
- PR-161: Extract frames from video file and create GIF
- PR-162: Control frame duration per frame or globally
- PR-163: Control GIF dimensions and quality
- PR-164: Loop settings (infinite, N times, no loop)
- PR-165: Frame preview strip with reordering

---

### 5.16 PDF Module

**Feature ID**: F-016 | **Priority**: P1 | **Platforms**: Web, Android, iOS

**Requirements**:

- PR-170: Create PDF from one or more images
- PR-171: Page size options: A4, A3, Letter, Custom, Fit to image
- PR-172: Merge multiple PDFs
- PR-173: Split a PDF into individual pages
- PR-174: Extract images from PDF pages

---

### 5.17 Collage Module

**Feature ID**: F-017 | **Priority**: P2 | **Platforms**: Web, Android, iOS

**Requirements**:

- PR-180: Grid layout collage (2×1, 2×2, 3×3, etc.)
- PR-181: Free-form layout (drag images to any position)
- PR-182: Pre-built collage templates
- PR-183: Background color/image for the collage canvas
- PR-184: Individual image adjustments within collage

---

### 5.18 OCR Module

**Feature ID**: F-018 | **Priority**: P2 | **Platforms**: Web, Android, iOS

**Requirements**:

- PR-190: Extract text from image (Tesseract.js on Web, ML Kit on mobile)
- PR-191: Multi-language support (100+ languages via Tesseract)
- PR-192: Copy extracted text to clipboard
- PR-193: Export extracted text as .txt file
- PR-194: Highlight recognized text regions on the image

---

### 5.19 QR Code Module

**Feature ID**: F-019 | **Priority**: P1 | **Platforms**: Web, Android, iOS

**Requirements**:

- PR-200: Generate QR code from URL, text, or contact data
- PR-201: Scan QR code from image (upload or camera)
- PR-202: Embed QR code into an image
- PR-203: Extract QR code data and display decoded value
- PR-204: QR code styling (color, corner style)

---

### 5.20 Face Detection Module

**Feature ID**: F-020 | **Priority**: P2 | **Platforms**: Web, Android, iOS

**Requirements**:

- PR-210: Detect faces in image and indicate count
- PR-211: Display bounding boxes around detected faces
- PR-212: Apply blur to detected faces (privacy protection)
- PR-213: Crop to detected faces
- PR-214: Face-aware crop integration with Crop module

---

### 5.21 Icon Generator Module

**Feature ID**: F-021 | **Priority**: P2 | **Platforms**: Web, Android, iOS

**Requirements**:

- PR-220: Generate app icon sets for iOS (all required sizes)
- PR-221: Generate app icon sets for Android (all required sizes)
- PR-222: Generate favicon sets for web (16, 32, 64, 128, 256px + SVG)
- PR-223: Background color fill option for transparent source images
- PR-224: Export as ZIP containing all sizes

---

### 5.22 Additional Modules (P2/P3)

| Feature              | ID    | Priority | Description                                         |
| -------------------- | ----- | -------- | --------------------------------------------------- |
| Sprite Sheet Builder | F-022 | P3       | Combine images into a sprite sheet with JSON map    |
| Contact Sheet        | F-023 | P3       | Generate thumbnail grid for image review            |
| Duplicate Finder     | F-024 | P2       | Detect and remove duplicate images using pHash      |
| Image Comparison     | F-025 | P2       | Before/after slider comparison of two images        |
| Project Workspace    | F-026 | P1       | Named projects with saved processing sessions       |
| History              | F-027 | P0       | Undo/redo with visual history panel                 |
| Settings             | F-028 | P0       | App preferences, defaults, privacy settings         |
| Export/Share         | F-029 | P0       | Download, share, copy result to clipboard           |
| Pipeline Automation  | F-030 | P3       | Saved pipeline templates for repeated workflows     |
| Security Controls    | F-031 | P1       | Privacy mode, metadata stripping, temp file cleanup |
| Analytics (Opt-in)   | F-032 | P2       | Anonymous usage analytics (opt-in only)             |
| AI Enhancement       | F-033 | Future   | Super resolution, denoise, AI restoration           |

---

## 6. Feature Availability Matrix

| Feature            | Web | Android | iOS | Notes                              |
| ------------------ | --- | ------- | --- | ---------------------------------- |
| Import from File   | ✅  | ✅      | ✅  |                                    |
| Import from Camera | ❌  | ✅      | ✅  | No camera API in standard browsers |
| Drag & Drop Import | ✅  | ❌      | ❌  | Touch doesn't support D&D          |
| Clipboard Paste    | ✅  | ❌      | ❌  | Mobile clipboard limited           |
| Compression        | ✅  | ✅      | ✅  |                                    |
| Resize             | ✅  | ✅      | ✅  |                                    |
| Crop               | ✅  | ✅      | ✅  |                                    |
| Rotate/Flip        | ✅  | ✅      | ✅  |                                    |
| Format Conversion  | ✅  | ✅      | ✅  | HEIC output limited on Web         |
| Metadata           | ✅  | ✅      | ✅  |                                    |
| Enhancement        | ✅  | ✅      | ✅  |                                    |
| Filters            | ✅  | ✅      | ✅  |                                    |
| Background Removal | ✅  | ✅      | ✅  |                                    |
| Watermark          | ✅  | ✅      | ✅  |                                    |
| Drawing            | ✅  | ✅      | ✅  |                                    |
| Blur               | ✅  | ✅      | ✅  |                                    |
| Batch Processing   | ✅  | ✅      | ✅  |                                    |
| GIF Creation       | ✅  | ✅      | ✅  |                                    |
| PDF Tools          | ✅  | ✅      | ✅  |                                    |
| Collage            | ✅  | ✅      | ✅  |                                    |
| OCR                | ✅  | ✅      | ✅  |                                    |
| QR Code            | ✅  | ✅      | ✅  |                                    |
| QR Scan (Camera)   | ❌  | ✅      | ✅  |                                    |
| Face Detection     | ✅  | ✅      | ✅  |                                    |
| Icon Generator     | ✅  | ✅      | ✅  |                                    |
| AI Enhancement     | ❌  | ❌      | ❌  | Future roadmap                     |

---

## 7. User Experience Requirements

### 7.1 Performance UX Requirements

- UXR-001: Common operations (compress, resize, rotate) must produce results with visible progress in < 200ms
- UXR-002: WASM module must be loaded and ready within 3 seconds on first visit (broadband)
- UXR-003: UI must never freeze during image processing (processing always in background thread)
- UXR-004: Thumbnail generation must complete within 500ms per image during import

### 7.2 Usability Requirements

- UXR-010: A first-time user must be able to compress an image within 60 seconds with zero instructions
- UXR-011: Error messages must be human-readable and actionable (not raw error codes)
- UXR-012: Destructive operations must have confirmation dialogs
- UXR-013: All operations must be undoable within a session

### 7.3 Accessibility Requirements

- UXR-020: All interactive elements must have appropriate ARIA labels
- UXR-021: Keyboard navigation must work for all primary workflows
- UXR-022: Color contrast ratio must meet WCAG 2.1 AA (4.5:1 for text, 3:1 for UI elements)
- UXR-023: Screen reader compatibility required on all platforms

---

## 8. Platform Requirements

### 8.1 Web

- WebR-001: Must function as a Progressive Web App (PWA) with offline support
- WebR-002: Must be installable from browser (Add to Home Screen)
- WebR-003: Must work without HTTPS on localhost (development)
- WebR-004: Service Worker must cache WASM modules for offline use
- WebR-005: Must handle CORS/COOP/COEP headers correctly for SharedArrayBuffer

### 8.2 Android

- AndroidR-001: Minimum SDK: Android 8.0 (API Level 26)
- AndroidR-002: Must handle system-level file permissions (READ_EXTERNAL_STORAGE)
- AndroidR-003: Must support foreground service for background batch processing
- AndroidR-004: Must handle app being backgrounded during processing
- AndroidR-005: Adaptive icons required

### 8.3 iOS

- iOSR-001: Minimum deployment target: iOS 15.0
- iOSR-002: Must request photo library permissions using Info.plist descriptions
- iOSR-003: Must handle background app refresh limitations
- iOSR-004: iPad layout must be responsive to both orientations

---

## 9. Integration Requirements

### 9.1 External Share Integration

- IR-001 (Web): Copy result to clipboard
- IR-002 (Web): Direct download to file system
- IR-003 (Mobile): Share via native OS share sheet
- IR-004 (Mobile): Save to photo library
- IR-005 (Mobile): Save to Files / Documents

### 9.2 Future Integrations (Post-MVP)

- Google Drive export (Phase 3)
- Dropbox export (Phase 3)
- iCloud Drive integration (Phase 4, iOS)

---

## 10. Acceptance Criteria

### Global Acceptance Criteria

These criteria apply to **every feature**:

- AC-001: Feature works on all declared platforms
- AC-002: Feature has unit tests with > 80% coverage
- AC-003: Feature handles edge cases gracefully (corrupted file, unsupported format, zero-byte file)
- AC-004: Feature is accessible (keyboard navigable, screen reader compatible)
- AC-005: Feature works offline
- AC-006: Feature produces correct output verified against reference implementations
- AC-007: Feature documentation is written in the feature module doc

---

## 11. Assumptions

| ID        | Assumption                                                      |
| --------- | --------------------------------------------------------------- |
| A-PRD-001 | Users accept WASM initial load time (< 3s) as one-time cost     |
| A-PRD-002 | HEIC reading is possible on all platforms via WASM decoder      |
| A-PRD-003 | Face detection accuracy sufficient without server-side models   |
| A-PRD-004 | Background removal quality is acceptable with WASM-only models  |
| A-PRD-005 | OCR accuracy on Tesseract.js is sufficient for common use cases |

---

## 12. Open Questions

| ID     | Question                                                            | Owner        | Due     |
| ------ | ------------------------------------------------------------------- | ------------ | ------- |
| OQ-001 | Should HEIC output be supported on Web (WASM encoder)?              | Architecture | Phase 2 |
| OQ-002 | What is the max batch size before memory issues on 1GB RAM devices? | Performance  | Phase 1 |
| OQ-003 | Should GIF creation support video longer than 30s?                  | Product      | Phase 2 |
| OQ-004 | Is Tesseract.js accuracy sufficient, or do we need ML Kit on Web?   | Engineering  | Phase 2 |
| OQ-005 | Should automation/pipeline be in MVP or post-MVP?                   | Product      | Phase 1 |

---

## 13. Related Documents

| Document                                                                       | Relationship                    |
| ------------------------------------------------------------------------------ | ------------------------------- |
| [02-business-requirements-document.md](./02-business-requirements-document.md) | Source of business requirements |
| [05-functional-requirements.md](./05-functional-requirements.md)               | Detailed FR catalog             |
| [07-user-personas.md](./07-user-personas.md)                                   | Full persona specifications     |
| [08-user-stories.md](./08-user-stories.md)                                     | User story backlog              |
| [10-feature-prioritization.md](./10-feature-prioritization.md)                 | MoSCoW prioritization           |
| [11-mvp-definition.md](./11-mvp-definition.md)                                 | MVP scope                       |
| [features/](./features/)                                                       | Individual feature module specs |

---

_Document Owner: Product Team | Review Cycle: Per-sprint | Approved: 2026-07-27_
