# Data Flow Diagrams

> **Document ID**: 45
> **Phase**: 2 — Architecture
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document provides data flow diagrams (DFDs) showing how data moves through ImageForge — from the user's file system to the processed output, across all system components.

---

## Level 0 — Context Diagram

```mermaid
graph LR
    U([User]) -->|Import image files| IF[ImageForge]
    IF -->|Processed images| U
    IF -->|Thumbnails + Queue state| DB[(LocalStorage / IndexedDB)]
    DB -->|Restored state| IF
    IF -->|WASM bundles| CDN[(Vercel CDN)]
    CDN -->|Cached WASM| SW[(Service Worker Cache)]
    SW -->|Serve cached assets| IF
```

---

## Level 1 — Major Processes

```mermaid
graph TB
    U([User])
    U -->|Drop / Select files| P1[1. Import & Validate]
    P1 -->|ImageFile objects| P2[2. Process Image]
    P2 -->|Processed ImageFile| P3[3. Export]
    P3 -->|Download / Share| U

    P1 -->|Thumbnail| D1[(Thumbnail Cache)]
    D1 -->|Restore thumbnails| P2

    P2 -->|Queue state| D2[(Queue Persistence)]
    D2 -->|Resume on reload| P2

    P2 -->|Settings read| D3[(Settings Store)]
    U -->|Settings change| D3
```

---

## Level 2 — Image Processing Pipeline (Detailed)

```mermaid
graph TB
    A[ArrayBuffer — raw image] --> B[Decode / Validate]
    B --> C{Operation Type}

    C -->|compress| D1[Codec Dispatch]
    D1 -->|jpeg| E1[mozjpeg.wasm encode]
    D1 -->|webp| E2[libwebp.wasm encode]
    D1 -->|png| E3[pngquant.wasm encode]
    D1 -->|avif| E4[libavif.wasm encode]

    C -->|resize| D2[libvips.wasm resize]
    C -->|crop| D3[libvips.wasm crop]
    C -->|rotate| D4[libvips.wasm rotate]
    C -->|convert| D5[libvips.wasm convert]

    E1 --> F[Output ArrayBuffer]
    E2 --> F
    E3 --> F
    E4 --> F
    D2 --> F
    D3 --> F
    D4 --> F
    D5 --> F

    F --> G{More operations?}
    G -->|Yes| C
    G -->|No| H[ProcessingResult]

    H --> I[Blob URL]
    H --> J[IndexedDB / Download]
```

---

## Level 2 — State Data Flow

```mermaid
graph LR
    subgraph "Zustand Stores"
        IS[imageStore]
        QS[queueStore]
        HS[historyStore]
        SS[settingsStore]
        US[uiStore]
    end

    subgraph "Mutations (TanStack)"
        CM[compressMutation]
        RM[resizeMutation]
        BM[batchMutation]
    end

    UI[React Components] -->|dispatch actions| IS
    UI --> QS
    UI --> SS

    IS -->|reactive| UI
    QS -->|reactive| UI
    US -->|reactive| UI

    UI -->|mutate()| CM
    UI -->|mutate()| RM
    UI -->|mutate()| BM

    CM -->|onSuccess → push history| HS
    RM -->|onSuccess → push history| HS
    CM -->|onSuccess → update image| IS
    RM -->|onSuccess → update image| IS

    SS -->|persist| LS[(localStorage)]
    LS -->|hydrate| SS
```

---

## Data Transformation Pipeline

```
User File (File API / Gallery)
  └→ ArrayBuffer (file.arrayBuffer())
       └→ MagicBytes check (first 16 bytes)
            └→ ExifParser (metadata extraction)
                 └→ ThumbnailGenerator (→ IndexedDB)
                      └→ ImageFile {id, buffer, meta}
                           └→ ProcessingEngine input
                                └→ Encoded ArrayBuffer
                                     └→ Blob (URL.createObjectURL)
                                          └→ <img src={blobUrl} />
                                               └→ User clicks Download
                                                    └→ <a download> click
                                                         └→ File saved to disk
```

---

## Data That Never Leaves the Device

- Original image `ArrayBuffer`
- Processing intermediate results
- EXIF data (GPS coordinates, etc.)
- Thumbnails
- Queue state

The only data that leaves the device:

- WASM module fetches (from Vercel CDN — anonymous, no image data)
- Optional: anonymous error reports (if user opted in — no image data included)

---

## Related Documents

| Document                                                     | Relationship          |
| ------------------------------------------------------------ | --------------------- |
| [43-sequence-diagrams.md](./43-sequence-diagrams.md)         | Sequence-level detail |
| [44-event-flow.md](./44-event-flow.md)                       | Event propagation     |
| [37-security-architecture.md](./37-security-architecture.md) | Privacy guarantees    |

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
