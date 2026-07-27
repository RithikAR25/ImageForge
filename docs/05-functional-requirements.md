# Functional Requirements

> **Document ID**: 05
> **Phase**: 1 — Product Planning
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Product & Architecture Team

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Scope](#2-scope)
3. [Requirement Conventions](#3-requirement-conventions)
4. [System Requirements](#4-system-requirements)
5. [Import & Export Requirements](#5-import--export-requirements)
6. [Image Processing Requirements](#6-image-processing-requirements)
7. [Batch Processing Requirements](#7-batch-processing-requirements)
8. [State & History Requirements](#8-state--history-requirements)
9. [Storage Requirements](#9-storage-requirements)
10. [Platform-Specific Requirements](#10-platform-specific-requirements)
11. [Plugin System Requirements](#11-plugin-system-requirements)
12. [Settings Requirements](#12-settings-requirements)
13. [Related Documents](#13-related-documents)

---

## 1. Purpose

This document provides a complete, uniquely-identified catalog of all functional requirements for ImageForge. Each requirement is atomic, testable, and traceable to business requirements and features.

---

## 2. Scope

All functional requirements across all platforms and all phases. Requirements are marked with their phase: **[MVP]**, **[P2]**, **[P3]**, or **[Future]**.

---

## 3. Requirement Conventions

```
Format:   FR-XXX: [Condition] the system shall [action] [constraint]
ID:       FR-001 through FR-NNN (sequential, never reused)
Priority: MVP / P2 / P3 / Future
Platform: ALL / WEB / MOBILE / ANDROID / iOS
Status:   Draft / Approved / Implemented / Deprecated
```

---

## 4. System Requirements

### FR-001 [MVP] [ALL]

The system shall initialize and be ready for user interaction within 3 seconds on a modern broadband connection (50 Mbps+).

### FR-002 [MVP] [ALL]

The system shall function fully without an active internet connection after initial load/install.

### FR-003 [MVP] [ALL]

The system shall never transmit image data to any external server without explicit, per-operation user consent.

### FR-004 [MVP] [ALL]

The system shall support the TypeScript strict mode compilation without type errors.

### FR-005 [MVP] [WEB]

The system shall register a Service Worker and cache all necessary assets for offline operation.

### FR-006 [MVP] [WEB]

The system shall be installable as a PWA from supported browsers (Chrome, Edge, Safari 15.4+).

### FR-007 [MVP] [ALL]

The system shall display appropriate error messages for all failure states without exposing raw error objects to users.

### FR-008 [MVP] [ALL]

The system shall support Light and Dark themes, respecting system preference by default.

### FR-009 [MVP] [ALL]

The system shall support screen reader accessibility for all primary user flows (WCAG 2.1 AA).

### FR-010 [MVP] [ALL]

The system shall support keyboard navigation for all primary user flows.

---

## 5. Import & Export Requirements

### FR-020 [MVP] [ALL]

The system shall accept images in the following input formats: JPEG, PNG, WebP, GIF, BMP, TIFF, SVG.

### FR-021 [MVP] [WEB]

The system shall accept images via HTML file input with multi-select enabled.

### FR-022 [MVP] [WEB]

The system shall accept images dropped onto a designated drop zone via the HTML5 Drag and Drop API.

### FR-023 [MVP] [WEB]

The system shall accept images pasted from the clipboard using the Clipboard API.

### FR-024 [MVP] [WEB]

The system shall accept folder drops and enumerate all image files within the folder recursively.

### FR-025 [MVP] [MOBILE]

The system shall integrate with the native device photo gallery (expo-image-picker).

### FR-026 [MVP] [MOBILE]

The system shall integrate with the native device camera to capture new photos (expo-camera).

### FR-027 [MVP] [MOBILE]

The system shall register as a share target to receive images shared from other applications.

### FR-028 [MVP] [ALL]

The system shall reject unsupported file types with a clear error message listing supported formats.

### FR-029 [MVP] [ALL]

The system shall reject files exceeding 100MB with an appropriate error message.

### FR-030 [MVP] [ALL]

The system shall generate a thumbnail preview for each imported image within 500ms.

### FR-031 [MVP] [ALL]

The system shall display EXIF metadata (dimensions, file size, format, color space) alongside the thumbnail.

### FR-032 [MVP] [ALL]

The system shall detect duplicate images by comparing file hash (SHA-256) and alert the user before adding duplicates to the queue.

### FR-033 [MVP] [ALL]

The system shall support importing HEIC format images with WASM-based decoding on Web.

### FR-034 [MVP] [WEB]

The system shall allow direct download of single processed images as a file.

### FR-035 [MVP] [WEB]

The system shall generate a ZIP archive for batch download of multiple processed images.

### FR-036 [MVP] [MOBILE]

The system shall save processed images to the device photo library upon user request.

### FR-037 [MVP] [MOBILE]

The system shall offer processed images through the native OS share sheet.

### FR-038 [MVP] [WEB]

The system shall offer copy-to-clipboard for processed images in PNG format.

---

## 6. Image Processing Requirements

### 6.1 Compression

### FR-050 [MVP] [ALL]

The system shall compress JPEG images using the mozjpeg encoder.

### FR-051 [MVP] [ALL]

The system shall compress PNG images using the pngquant encoder.

### FR-052 [MVP] [ALL]

The system shall compress WebP images using the libwebp encoder with configurable quality.

### FR-053 [MVP] [ALL]

The system shall accept a quality parameter (integer 1–100) for lossy compression.

### FR-054 [MVP] [ALL]

The system shall accept a target file size parameter and iterate compression quality to achieve the target size within ±10%.

### FR-055 [MVP] [ALL]

The system shall display the original file size, compressed file size, and reduction percentage before the user confirms export.

### FR-056 [MVP] [ALL]

The system shall provide compression presets: WhatsApp (≤200KB JPEG), Email (≤500KB JPEG), Web (≤100KB WebP), Print (lossless PNG).

### FR-057 [MVP] [ALL]

The system shall display a real-time before/after preview using a split-slider component.

### 6.2 Resize

### FR-070 [MVP] [ALL]

The system shall resize images to specified pixel dimensions (width, height, or both).

### FR-071 [MVP] [ALL]

The system shall resize images to a percentage of their original dimensions (1%–500%).

### FR-072 [MVP] [ALL]

The system shall maintain the original aspect ratio when only one dimension is specified (default behavior).

### FR-073 [MVP] [ALL]

The system shall support unlocked aspect ratio for independent width/height specification.

### FR-074 [MVP] [ALL]

The system shall support Fit mode: image fits within bounds, maintaining aspect ratio (may leave empty space).

### FR-075 [MVP] [ALL]

The system shall support Fill mode: image fills bounds, maintaining aspect ratio (may crop edges).

### FR-076 [MVP] [ALL]

The system shall provide social media presets for resize: Instagram Post (1080×1080), Instagram Story (1080×1920), Twitter Post (1200×675), Facebook Cover (820×312), YouTube Thumbnail (1280×720), TikTok (1080×1920).

### FR-077 [MVP] [ALL]

The system shall provide common wallpaper size presets: HD (1920×1080), QHD (2560×1440), 4K (3840×2160), MacBook Pro (2880×1800), iPhone (1170×2532).

### FR-078 [MVP] [ALL]

The system shall use Lanczos3 resampling as the default high-quality downscale algorithm.

### 6.3 Crop

### FR-090 [MVP] [ALL]

The system shall display an interactive crop overlay on the image canvas allowing drag-to-crop.

### FR-091 [MVP] [ALL]

The system shall support free-form crop (arbitrary aspect ratio).

### FR-092 [MVP] [ALL]

The system shall support fixed-ratio crop with presets: 1:1, 4:3, 3:4, 16:9, 9:16, 2:3, 3:2.

### FR-093 [MVP] [ALL]

The system shall support custom aspect ratio specification (numerator:denominator).

### FR-094 [MVP] [ALL]

The system shall support pixel-exact crop specification (x, y, width, height).

### FR-095 [MVP] [ALL]

The system shall support circle crop, outputting a PNG with transparent background outside the circle.

### FR-096 [P2] [ALL]

The system shall support smart crop that uses a saliency model to detect the most visually important region.

### FR-097 [P2] [ALL]

The system shall support face-aware crop that detects faces and centers the crop region on them.

### 6.4 Rotate & Flip

### FR-110 [MVP] [ALL]

The system shall rotate images by 90°, 180°, and 270° clockwise.

### FR-111 [MVP] [ALL]

The system shall flip images horizontally (left-right mirror).

### FR-112 [MVP] [ALL]

The system shall flip images vertically (top-bottom mirror).

### FR-113 [MVP] [ALL]

The system shall support custom rotation angle from -180° to 180° with 0.1° precision.

### FR-114 [MVP] [ALL]

The system shall apply auto EXIF rotation to correct camera orientation on import (configurable).

### FR-115 [MVP] [ALL]

The system shall expand the canvas to fit rotated content at custom angles, or crop to original bounds (user choice).

### 6.5 Format Conversion

### FR-130 [MVP] [ALL]

The system shall convert images between the following formats: JPEG, PNG, WebP, GIF, BMP.

### FR-131 [P2] [ALL]

The system shall convert images to TIFF and ICO formats.

### FR-132 [P2] [ALL]

The system shall convert images to AVIF format using libavif (WASM on Web, native on mobile).

### FR-133 [P2] [ALL]

The system shall convert images from HEIC format using WASM decoder on Web, native system codec on mobile.

### FR-134 [P1] [ALL]

The system shall convert one or more images to a PDF document.

### FR-135 [MVP] [ALL]

The system shall preserve transparency (alpha channel) when converting to formats that support it (PNG, WebP, AVIF).

### FR-136 [MVP] [ALL]

The system shall offer a background color fill option when converting from transparent to non-transparent formats (JPEG, BMP).

### 6.6 Image Enhancement

### FR-150 [P2] [ALL]

The system shall adjust image brightness by a value in the range -100 to +100.

### FR-151 [P2] [ALL]

The system shall adjust image contrast by a value in the range -100 to +100.

### FR-152 [P2] [ALL]

The system shall adjust exposure by EV in the range -5.0 to +5.0.

### FR-153 [P2] [ALL]

The system shall adjust saturation by a value in the range -100 (grayscale) to +100.

### FR-154 [P2] [ALL]

The system shall adjust hue rotation from 0° to 360°.

### FR-155 [P2] [ALL]

The system shall adjust gamma in the range 0.1 to 10.0.

### FR-156 [P2] [ALL]

The system shall support white balance correction via color temperature (2000K–10000K) and tint sliders.

### FR-157 [P2] [ALL]

The system shall provide a curves editor with control points for RGB combined and individual R, G, B channels.

### FR-158 [P2] [ALL]

The system shall provide a levels editor with input/output sliders for shadows, midtones, and highlights per channel.

### FR-159 [P2] [ALL]

The system shall display a real-time histogram (luminance and RGB channels) that updates as adjustments are applied.

### FR-160 [P2] [ALL]

The system shall provide an "Auto Enhance" function that automatically determines optimal brightness, contrast, and white balance adjustments.

### FR-161 [P2] [ALL]

The system shall render enhancement previews in real-time using GPU-accelerated Skia shaders.

### 6.7 Filters

### FR-170 [P2] [ALL]

The system shall apply LUT-based color grading filters: Vintage, Noir, HDR, Film, Cinema, Matte.

### FR-171 [P2] [ALL]

The system shall support a filter intensity slider (0–100%) that linearly interpolates between original and full filter effect.

### FR-172 [P2] [ALL]

The system shall support importing custom LUT files in `.cube` format (17³ and 33³).

### FR-173 [P2] [ALL]

The system shall preview filters in real-time using Skia GLSL shaders.

### 6.8 Background Removal

### FR-180 [P3] [ALL]

The system shall remove image backgrounds using a WASM-based ML model (RMBG 1.4 or U2Net).

### FR-181 [P3] [ALL]

The system shall output background-removed images as PNG with transparent background.

### FR-182 [P3] [ALL]

The system shall allow replacing the removed background with a solid color.

### FR-183 [P3] [ALL]

The system shall allow replacing the removed background with a user-provided image.

### FR-184 [P3] [ALL]

The system shall allow blurring the original background (portrait mode effect).

### 6.9 Watermark

### FR-190 [P2] [ALL]

The system shall overlay text watermarks with configurable font family, size, color, opacity, and position.

### FR-191 [P2] [ALL]

The system shall overlay image/logo watermarks with configurable scale, opacity, and position.

### FR-192 [P2] [ALL]

The system shall generate and embed QR codes as watermarks.

### FR-193 [P2] [ALL]

The system shall support nine anchor position presets for watermarks (top-left through bottom-right).

### FR-194 [P2] [ALL]

The system shall support custom watermark coordinates (percentage or pixel).

### 6.10 Blur

### FR-200 [P2] [ALL]

The system shall apply Gaussian blur with a configurable radius (0–100px).

### FR-201 [P2] [ALL]

The system shall apply motion blur with configurable angle (0°–360°) and distance.

### FR-202 [P2] [ALL]

The system shall apply pixelate effect with configurable block size (2–100px).

### FR-203 [P2] [ALL]

The system shall apply selective blur to user-painted mask areas.

### FR-204 [P3] [ALL]

The system shall detect faces automatically and apply blur to them.

### 6.11 GIF

### FR-210 [P3] [ALL]

The system shall create GIF animations from a sequence of 2 or more images.

### FR-211 [P3] [ALL]

The system shall extract frames from an uploaded video file and create a GIF.

### FR-212 [P3] [ALL]

The system shall allow setting per-frame duration (10ms–10000ms) and global frame rate.

### FR-213 [P3] [ALL]

The system shall allow configuring GIF output dimensions and quality.

### FR-214 [P3] [ALL]

The system shall allow configuring loop count: 0 (infinite), 1–100, or no loop.

### 6.12 PDF

### FR-220 [P3] [ALL]

The system shall convert one or more images to a PDF document.

### FR-221 [P3] [ALL]

The system shall support PDF page sizes: A4, A3, A5, US Letter, US Legal, and custom dimensions.

### FR-222 [P3] [ALL]

The system shall merge multiple PDF files into a single PDF.

### FR-223 [P3] [ALL]

The system shall split a PDF into individual page PDFs.

### FR-224 [P3] [ALL]

The system shall extract embedded images from PDF pages.

### 6.13 OCR

### FR-230 [P3] [ALL]

The system shall extract text from images using Tesseract.js (Web) and ML Kit (mobile).

### FR-231 [P3] [ALL]

The system shall support OCR in 100+ languages (Tesseract language data).

### FR-232 [P3] [ALL]

The system shall highlight recognized text regions on the source image.

### FR-233 [P3] [ALL]

The system shall provide copy-to-clipboard and download-as-text-file options for OCR output.

### 6.14 QR Code

### FR-240 [P2] [ALL]

The system shall generate QR codes from URL, plain text, or vCard contact data.

### FR-241 [P2] [ALL]

The system shall decode QR codes from uploaded images.

### FR-242 [P2] [MOBILE]

The system shall scan QR codes using the device camera.

### FR-243 [P2] [ALL]

The system shall embed generated QR codes into an image at a configurable position and size.

### 6.15 Face Detection

### FR-250 [P3] [ALL]

The system shall detect human faces in an image and return bounding box coordinates.

### FR-251 [P3] [ALL]

The system shall display the number of faces detected.

### FR-252 [P3] [ALL]

The system shall apply configurable blur to detected face regions for privacy protection.

### FR-253 [P3] [ALL]

The system shall crop the image to the bounding box of one or more detected faces.

### 6.16 Drawing

### FR-260 [P2] [ALL]

The system shall provide a freehand brush tool with configurable size, color, opacity, and hardness.

### FR-261 [P2] [ALL]

The system shall provide shape tools: rectangle, ellipse, line, and arrow.

### FR-262 [P2] [ALL]

The system shall provide a text annotation tool with configurable font, size, and color.

### FR-263 [P2] [ALL]

The system shall provide an eraser tool that restores pixels to the original image.

### FR-264 [P2] [ALL]

The system shall maintain unlimited undo/redo history for drawing operations within a session.

---

## 7. Batch Processing Requirements

### FR-300 [MVP] [ALL]

The system shall accept multiple images into a processing queue simultaneously.

### FR-301 [MVP] [ALL]

The system shall allow users to define a processing pipeline (ordered list of operations) to apply to all queued images.

### FR-302 [MVP] [ALL]

The system shall process queued images sequentially or in parallel (configurable; default: sequential with background workers).

### FR-303 [MVP] [ALL]

The system shall allow pausing, resuming, and cancelling the processing queue at any time.

### FR-304 [MVP] [ALL]

The system shall allow retrying individual failed items without reprocessing successful items.

### FR-305 [MVP] [ALL]

The system shall display per-image progress (%, current operation) and aggregate progress.

### FR-306 [MVP] [ALL]

The system shall persist the queue state to local storage, surviving page refresh or app restart.

### FR-307 [MVP] [ALL]

The system shall support removing individual items from the queue before or during processing.

### FR-308 [MVP] [ALL]

The system shall organize output files by: flat directory, original filename, date/time, or custom naming template.

---

## 8. State & History Requirements

### FR-350 [MVP] [ALL]

The system shall maintain an undo history of all image processing operations within a session.

### FR-351 [MVP] [ALL]

The system shall support unlimited undo steps within available memory.

### FR-352 [MVP] [ALL]

The system shall support redo after undo.

### FR-353 [MVP] [ALL]

The system shall display a visual history panel showing each operation with a thumbnail preview state.

### FR-354 [P2] [ALL]

The system shall support named project workspaces that persist across sessions.

### FR-355 [P2] [ALL]

The system shall auto-save project state at regular intervals (default: every 30 seconds).

---

## 9. Storage Requirements

### FR-380 [MVP] [WEB]

The system shall use IndexedDB to persist queue state, processing results, and project data.

### FR-381 [MVP] [MOBILE]

The system shall use Expo SQLite to persist queue state, processing history, and project data.

### FR-382 [MVP] [ALL]

The system shall automatically clean up temporary files after successful export.

### FR-383 [MVP] [ALL]

The system shall provide a "Clear Cache / Storage" function in settings.

### FR-384 [MVP] [ALL]

The system shall display current storage usage in settings.

---

## 10. Platform-Specific Requirements

### FR-400 [MVP] [WEB]

The system shall set the following HTTP headers for WASM SharedArrayBuffer support:

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

### FR-401 [MVP] [WEB]

The system shall handle WASM module loading failures gracefully with a degraded mode fallback.

### FR-402 [MVP] [ANDROID]

The system shall request `READ_MEDIA_IMAGES` permission on Android 13+ and `READ_EXTERNAL_STORAGE` on Android 12 and below.

### FR-403 [MVP] [ANDROID]

The system shall use a foreground service with notification for batch operations exceeding 30 seconds.

### FR-404 [MVP] [iOS]

The system shall include NSPhotoLibraryUsageDescription in Info.plist for photo library access.

### FR-405 [MVP] [iOS]

The system shall include NSCameraUsageDescription in Info.plist for camera access.

---

## 11. Plugin System Requirements

### FR-420 [P2] [ALL]

The system shall provide a plugin API that allows third parties to register new processing operations.

### FR-421 [P2] [ALL]

The system shall execute plugins in an isolated sandbox (iframe on Web, separate JS context on mobile).

### FR-422 [P2] [ALL]

The system shall validate plugin manifests before loading.

### FR-423 [P2] [ALL]

The system shall provide a plugin registry API for listing, enabling, and disabling plugins.

### FR-424 [P3] [ALL]

The system shall support a community plugin marketplace with install-from-URL capability.

---

## 12. Settings Requirements

### FR-440 [MVP] [ALL]

The system shall provide a settings screen with the following configurable options:

- Default output format (JPEG/PNG/WebP)
- Default JPEG quality (1–100, default: 85)
- Default PNG compression level (0–9, default: 6)
- Default WebP quality (1–100, default: 80)
- Default theme (System / Light / Dark)
- Auto-rotate by EXIF (On/Off, default: On)
- Strip metadata on export (On/Off, default: Off)
- Analytics opt-in (On/Off, default: Off)

### FR-441 [MVP] [ALL]

The system shall persist settings changes immediately and apply them to the current session.

### FR-442 [MVP] [WEB]

The system shall store settings in localStorage with a namespaced key.

### FR-443 [MVP] [MOBILE]

The system shall store settings using Expo SecureStore or AsyncStorage.

---

## 13. Related Documents

| Document                                                                           | Relationship                  |
| ---------------------------------------------------------------------------------- | ----------------------------- |
| [03-product-requirements-document.md](./03-product-requirements-document.md)       | Source PRD                    |
| [06-non-functional-requirements.md](./06-non-functional-requirements.md)           | NFRs (performance, security)  |
| [13-requirements-traceability-matrix.md](./13-requirements-traceability-matrix.md) | RTM tracing FRs to tests      |
| [features/](./features/)                                                           | Feature module specifications |
| [75-api-contracts.md](./75-api-contracts.md)                                       | Internal API contracts        |

---

_Document Owner: Architecture Team | Review Cycle: Per-sprint | Approved: 2026-07-27_
