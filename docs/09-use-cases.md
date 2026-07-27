# Use Cases

> **Document ID**: 09
> **Phase**: 1 — Product Planning
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Product Team

---

## Purpose

This document defines formal use cases for ImageForge's primary workflows. Use cases describe the interaction between an actor and the system to achieve a goal. They complement user stories by providing a structured, step-by-step view of system behavior including alternative flows and exceptions.

## Scope

Key use cases covering P0 features. Each use case maps to one or more functional requirements and user stories.

---

## Use Case Format

```
UC-XXX: [Name]
Actor: [Primary actor]
Precondition: [System state before the use case begins]
Trigger: [What initiates the use case]
Main Flow: [Happy path]
Alternative Flows: [Variations on the happy path]
Exception Flows: [Error conditions]
Postcondition: [System state after success]
Linked FRs: [FR-XXX]
Linked US: [US-XXX]
```

---

## UC-001: Compress a Single Image (Web)

**Actor**: Alex (Casual User)  
**Precondition**: User is on the ImageForge web app. No images are loaded.  
**Trigger**: User wants to compress a photo for WhatsApp.

### Main Flow

1. User clicks "Upload Image" button
2. System opens native file picker (multi-select enabled)
3. User selects one JPEG file
4. System validates file type and size (MIME type check by magic bytes)
5. System generates and displays a thumbnail within 500ms
6. System displays EXIF metadata (dimensions, original file size, format)
7. System automatically selects the "Compress" operation
8. User selects "WhatsApp" preset
9. System sets quality to produce ≤ 200KB JPEG output
10. System processes image using mozjpeg WASM in a Web Worker
11. System displays before/after split-view with original and compressed images
12. System shows: original size, compressed size, reduction percentage
13. User clicks "Download"
14. Browser downloads the compressed JPEG file
15. System clears the temporary processing buffer

**Postcondition**: User has a compressed JPEG file; no data has been transmitted to any server.

### Alternative Flows

**AF-001: User adjusts quality manually**

- At step 8, user drags the quality slider instead of using a preset
- System updates the before/after preview and file size estimate in real-time
- Continue from step 13

**AF-002: User wants WebP output instead**

- At step 8, user changes output format to WebP
- System re-processes with WebP encoder
- Continue from step 11

**AF-003: User uses drag & drop**

- At step 1, user drags file from desktop onto the drop zone
- Steps 2–3 replaced by drop event handling
- Continue from step 4

### Exception Flows

**EF-001: Unsupported file type**

- At step 4, system detects unsupported MIME type
- System shows error: "Unsupported format. Supported formats: JPEG, PNG, WebP, GIF, BMP, TIFF, HEIC"
- Use case ends; user stays on home screen

**EF-002: File too large**

- At step 4, system detects file > 100MB
- System shows error: "File too large. Maximum file size is 100MB."
- Use case ends

**EF-003: WASM not initialized**

- At step 10, WASM module is still loading
- System shows a loading indicator: "Loading processing engine..."
- Processing begins once WASM is ready
- Continue from step 11

**Linked FRs**: FR-021, FR-028, FR-029, FR-030, FR-050, FR-053, FR-056, FR-057, FR-034  
**Linked US**: US-001, US-010, US-012

---

## UC-002: Batch Process Images (Web)

**Actor**: Sam (Designer)  
**Precondition**: User is on ImageForge web app. Batch mode available.  
**Trigger**: User has 150 PNG exports from Figma to convert to WebP.

### Main Flow

1. User drags the export folder onto the drop zone
2. System enumerates all image files recursively within the folder
3. System displays "152 images found" confirmation
4. System generates thumbnails for all images (progressive, showing as they complete)
5. System enters Batch mode
6. User clicks "Build Pipeline"
7. User adds "Resize: 50%" operation to the pipeline
8. User adds "Convert to WebP (Quality: 80)" operation to the pipeline
9. User reviews the pipeline order
10. User clicks "Process All"
11. System initializes worker pool (4 workers)
12. System begins processing images — each worker picks next image from queue
13. System displays per-image progress and aggregate progress bar
14. User pauses the queue (clicks "Pause")
15. System completes current in-progress items and halts queue
16. User resumes the queue (clicks "Resume")
17. System continues from where it paused
18. All 152 images complete successfully
19. System shows summary: "152 processed, 0 failed"
20. User clicks "Download All as ZIP"
21. System generates ZIP archive with processed images
22. Browser downloads the ZIP file

**Postcondition**: 152 WebP images at 50% size downloaded. Queue state cleared.

### Alternative Flows

**AF-001: Some images fail**

- At step 18, 5 images have error state (corrupted files)
- System shows "147 processed, 5 failed"
- User clicks "Retry Failed"
- System re-queues only the 5 failed items
- System attempts reprocessing
- If still failing, system shows per-item error messages

**AF-002: Page refresh mid-batch**

- Queue state was persisted to IndexedDB after each item
- On reload, system shows "Resume previous session? (83/152 completed)"
- User clicks "Resume"
- Processing continues from item 84

**EF-001: Folder contains no images**

- At step 2, no image files found
- System shows: "No supported image files found in the selected folder"

**Linked FRs**: FR-022, FR-024, FR-300–FR-308, FR-130  
**Linked US**: US-002, US-060, US-061, US-062, US-051

---

## UC-003: Crop Image to Circle (Mobile)

**Actor**: Morgan (Developer demonstrating the app)  
**Precondition**: ImageForge mobile app is open. Image is loaded.  
**Trigger**: User wants to create a circular profile picture.

### Main Flow

1. User taps "Crop" in the operations panel
2. System displays the image with a free-form crop overlay
3. User taps "Circle" in the aspect ratio options
4. System constrains the crop region to a square with a circular preview overlay
5. User drags the crop region to center it on their face
6. User drags corner handles to resize the crop region
7. System updates the circular preview in real-time (using Skia canvas)
8. User taps "Apply"
9. System processes the crop
10. Output is a PNG with transparent pixels outside the circle
11. User taps "Save to Photos"
12. System saves the PNG to the device photo library

**Postcondition**: A circular PNG is saved to the user's photo library.

### Exception Flows

**EF-001: Photo library permission denied**

- At step 11, user has not granted photo library permission
- System shows: "ImageForge needs permission to save to your photo library. [Open Settings]"

**Linked FRs**: FR-095, FR-036  
**Linked US**: US-031

---

## UC-004: Metadata Strip Before Sharing (All Platforms)

**Actor**: Jordan (Photographer)  
**Precondition**: Jordan has imported 800 event photos with GPS metadata.  
**Trigger**: Jordan wants to deliver photos to a client without revealing the event location.

### Main Flow

1. System displays a GPS warning banner for each imported image containing location data
2. Jordan sees "48 images contain GPS data"
3. Jordan clicks "Remove GPS from all"
4. System displays confirmation: "Remove GPS coordinates from 48 images? This cannot be undone."
5. Jordan confirms
6. System strips GPS EXIF fields from all 48 affected images
7. System re-displays thumbnails with "GPS removed" badge
8. Jordan clicks "Export All"
9. System exports all 800 images (652 unchanged, 48 GPS-stripped)

**Postcondition**: All 800 images exported; none contain GPS data.

### Alternative Flows

**AF-001: Strip all metadata**

- At step 3, Jordan selects "Strip All Metadata" (Privacy Mode)
- All EXIF/IPTC/XMP metadata is removed from all images
- Images contain only pixel data

**EF-001: GPS removal fails on corrupted EXIF**

- System marks the specific image as "GPS removal failed" with a warning
- Other images proceed normally
- System shows summary: "GPS removed from 45 images; 3 images had corrupted EXIF and were skipped"

**Linked FRs**: FR-072, FR-073, FR-075  
**Linked US**: US-130

---

## UC-005: Import and Process from Camera (Mobile)

**Actor**: Casey (Content Creator)  
**Precondition**: ImageForge mobile app is installed. Camera permission not yet granted.  
**Trigger**: Casey wants to take a new photo and immediately apply a filter.

### Main Flow

1. Casey taps "Camera" import option
2. System requests camera permission (iOS: NSCameraUsageDescription dialog)
3. Casey grants camera permission
4. System opens the device camera interface
5. Casey takes a photo
6. System closes camera, adds the captured photo to the workspace
7. Casey taps "Filters"
8. Casey selects "Vintage" filter
9. System renders filter preview using GPU shader in real-time
10. Casey drags the intensity slider to 70%
11. Casey taps "Apply"
12. Casey taps "Share"
13. System presents the native iOS share sheet
14. Casey shares to Instagram

**Postcondition**: Photo with Vintage filter shared to Instagram.

### Exception Flows

**EF-001: Camera permission denied**

- At step 3, user denies camera permission
- System shows: "Camera access is required to take photos. [Open Settings] [Cancel]"

**Linked FRs**: FR-026, FR-170, FR-173, FR-037  
**Linked US**: US-080

---

## UC-006: Export as PDF (Web/Mobile)

**Actor**: Sam  
**Precondition**: 10 design screenshots loaded in workspace.  
**Trigger**: Sam wants to create a single PDF for client review.

### Main Flow

1. Sam loads 10 PNG screenshots
2. Sam taps "PDF" in the output options
3. System opens PDF configuration panel
4. Sam selects "A4" page size
5. Sam selects "One image per page"
6. Sam reorders pages by drag
7. Sam taps "Generate PDF"
8. System generates PDF using pdf-lib
9. System shows preview of the PDF
10. Sam clicks "Download PDF"

**Postcondition**: A PDF with 10 pages is downloaded.

**Linked FRs**: FR-220, FR-221  
**Linked US**: US-110

---

_Document Owner: Product Team | Review Cycle: Per-sprint | Approved: 2026-07-27_
