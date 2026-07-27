# User Flow

> **Document ID**: 54
> **Phase**: 3 — UI/UX Design
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Design Team

---

## Purpose

This document maps the key user journeys through ImageForge — the paths users take to accomplish their goals, including happy paths, edge cases, and recovery flows.

---

## User Flow 1: Quick Compress (Casual User — Alex)

**Goal**: Compress a photo for WhatsApp quickly.
**Time budget**: < 60 seconds.

```
1. Open imageforge.app (or app)
2. Drop photo onto DropZone (or tap "Import")
3. Photo appears as thumbnail
4. Tap thumbnail → CompressScreen
5. Tap "WhatsApp" preset
   → Quality auto-sets to adaptive (≤200KB target)
   → Before/After preview shows size reduction
6. Tap "Download" (web) / "Save to Photos" (mobile)
7. Done ✓ — total time: ~15 seconds
```

---

## User Flow 2: Batch Resize for Social Media (Power User — Sam)

**Goal**: Resize 200 product images to Instagram square format.

```
1. Open app
2. Drop 200 images onto DropZone
   → Thumbnails appear in gallery (virtualized)
3. Click "Batch Process"
   → Redirected to BatchScreen
4. Click "Add Step" → Resize
   → Select "Instagram Post (1080×1080)"
   → Mode: Fill
   → Algorithm: Lanczos3
5. Click "Add Step" → Compress
   → Codec: WebP, Quality: 82
6. Click "Start" (200 jobs queued)
   → Progress bar shows overall progress
   → Individual job items show status (processing/complete/failed)
7. All 200 complete → Click "Download All as ZIP"
8. Done ✓
```

---

## User Flow 3: Multi-Operation Edit (Professional — Jordan)

**Goal**: Crop, enhance, watermark, and export to Print quality.

```
1. Import DSLR RAW-derived JPEG (24MP)
2. → Crop Screen: Select 4:3 ratio, position carefully
3. → Compress Screen: Select Print preset (PNG lossless)
4. → Preview shows full-resolution before/after
5. Undo crop (Ctrl+Z) → Adjust → Redo
6. Add to pipeline: Resize → 6000px wide
7. Export → Download
8. Done ✓
```

---

## User Flow 4: First-Time User (Onboarding)

```
1. Visit imageforge.app
2. See Hero section with "Try it now" CTA
3. First interaction triggers micro-onboarding:
   → Tooltip: "Drop images here or click to browse"
4. User drops first image
   → Guided prompt: "Great! Now choose a preset below ↓"
5. User selects WhatsApp preset
   → "Preview shows your compressed image"
6. User downloads
   → "Want to process multiple images? Try Batch →"
7. Onboarding complete — no sign-up required
```

---

## User Flow 5: Resume Interrupted Batch (Reliability)

```
1. User starts batch of 500 images
2. Browser tab accidentally closed at 200/500
3. User reopens imageforge.app
4. App shows: "Resume previous session? (200 remaining)"
   [Resume] [Start Fresh]
5. User clicks Resume
6. Batch continues from job 201
7. Completes remaining 300 jobs
```

---

## User Flow 6: Format Conversion

```
1. Import HEIC photos from iPhone (drag from Finder)
2. App detects HEIC format automatically
3. BatchScreen: Pipeline = [Convert to JPEG]
4. Start → All converted
5. Download ZIP of converted JPEGs
```

---

## Error Recovery Flows

### Invalid File Dropped

```
User drops .pdf file
  → Magic byte check fails
    → Toast: "PDF files are not supported. Try: JPEG, PNG, WebP, HEIC..."
    → File not added to gallery
```

### Processing Fails (Single Image)

```
Image processing fails (corrupted file)
  → Error shown in QueueItem (red badge + message)
  → [Retry] button shown
  → User clicks Retry → Processing re-attempted
  → If retry fails: "This image appears corrupted. Try a different file."
```

### WASM Not Loaded Yet

```
User clicks Compress before WASM initialized
  → "Processing engine loading..." spinner
  → After WASM ready: automatically processes queued operation
```

---

## Related Documents

| Document                                      | Relationship               |
| --------------------------------------------- | -------------------------- |
| [07-user-personas.md](../07-user-personas.md) | Alex, Sam, Jordan personas |
| [08-user-stories.md](../08-user-stories.md)   | User stories per flow      |
| [53-screen-flow.md](./53-screen-flow.md)      | Screen transitions         |
| [52-navigation.md](./52-navigation.md)        | Navigation structure       |

---

_Document Owner: Design Team | Approved: 2026-07-27_
