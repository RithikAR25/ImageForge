# Batch Processing Feature Specification

> **Document ID**: features/batch-processing
> **Phase**: 4 — Feature Specifications
> **Status**: Approved

---

## Overview

Batch Processing is one of ImageForge's most powerful features — allowing users to apply a pipeline of operations to hundreds of images simultaneously with pause, resume, retry, and progress tracking.

---

## Functional Requirements

| Requirement                                       | FR     | Priority |
| ------------------------------------------------- | ------ | -------- |
| Batch 2–500 images                                | FR-200 | MVP      |
| Pipeline builder (multi-step)                     | FR-201 | MVP      |
| Pause / Resume                                    | FR-202 | MVP      |
| Cancel                                            | FR-203 | MVP      |
| Per-image retry                                   | FR-204 | MVP      |
| Concurrent processing (4 workers)                 | FR-205 | MVP      |
| Overall progress indicator                        | FR-206 | MVP      |
| Per-image status (pending/processing/done/failed) | FR-207 | MVP      |
| Export all as ZIP                                 | FR-208 | MVP      |
| Custom filename template                          | FR-209 | P2       |
| Batch presets (save/load pipelines)               | FR-210 | P2       |
| Resume after app restart                          | FR-211 | P2       |

---

## Pipeline Builder UI

Users compose a pipeline by adding steps:

```
[+] Add Step
  ┌─────────────────────────────────┐
  │ Step 1: Resize                  │
  │  Width: 1080   Mode: Fit        │ [↑] [↓] [🗑]
  ├─────────────────────────────────┤
  │ Step 2: Compress                │
  │  Codec: WebP   Quality: 82     │ [↑] [↓] [🗑]
  └─────────────────────────────────┘
[+] Add Step

[ Start Processing — 200 images ]
```

Steps can be reordered via drag handles. Each step shows a summary of its current configuration.

---

## Processing Flow

```
Queue created (pending jobs)
    ↓
User clicks Start
    ↓
BatchOrchestrator runs with semaphore (concurrency = 4)
    ↓ For each job simultaneously:
        Pipeline executes all steps
        Job status → processing → completed/failed
    ↓
All jobs complete
    ↓
"Download All as ZIP" available
```

---

## Queue Persistence

Queue state is persisted in IndexedDB every time a job status changes:

- **On crash/reload**: Queue shows last known state
- **Resume**: Jobs that were `processing` at crash are reset to `pending` and retried
- **Completed jobs**: Results held in `cacheDirectory` until user downloads

---

## Filename Template (Phase 2)

```
Template: {name}-{width}x{height}-compressed.{ext}
Example:  photo-1080x810-compressed.webp

Variables:
  {name}     Original filename without extension
  {ext}      Output format extension
  {index}    Zero-padded sequential number (001, 002, ...)
  {width}    Output width in pixels
  {height}   Output height in pixels
  {date}     Current date (YYYYMMDD)
  {quality}  Compression quality value
```

---

## Performance Target

| Scenario                      | Target |
| ----------------------------- | ------ |
| 50 × 5MP JPEG, compress Q=85  | ≤ 30s  |
| 200 × 5MP JPEG, compress Q=85 | ≤ 120s |
| 500 × 5MP JPEG, compress Q=85 | ≤ 300s |

---

_Document Owner: Product Team | Approved: 2026-07-27_
