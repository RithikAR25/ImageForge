# Sequence Diagrams

> **Document ID**: 43
> **Phase**: 2 — Architecture
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document contains the key sequence diagrams for ImageForge's most important flows — showing the precise order of operations between system components.

---

## 1. Image Import Flow (Web)

```mermaid
sequenceDiagram
    actor User
    participant UI as HomeScreen
    participant DZ as DropZone
    participant IV as InputValidator
    participant TG as ThumbnailGenerator
    participant Store as imageStore
    participant DB as IndexedDB

    User->>DZ: Drop image file
    DZ->>IV: validateFileMagicBytes(file)

    alt Invalid file type
        IV-->>DZ: null
        DZ-->>UI: Show error toast
    else Valid file
        IV-->>DZ: 'image/jpeg'
        DZ->>DZ: file.arrayBuffer()
        DZ->>TG: generateThumbnail(buffer, 300)
        TG-->>DZ: thumbnail Blob
        DZ->>Store: addImages([imageFile])
        Store-->>UI: (reactive update)
        DZ->>DB: saveThumbnail(imageId, thumbnail)
        UI-->>User: Show thumbnail in gallery
    end
```

---

## 2. Single Image Compress Flow (Web)

```mermaid
sequenceDiagram
    actor User
    participant UI as CompressScreen
    participant Hook as useImageProcessor
    participant Pipeline as ImagePipeline
    participant Pool as WasmWorkerPool
    participant Worker as Web Worker
    participant WASM as mozjpeg.wasm

    User->>UI: Drag quality slider to 85
    UI->>Hook: processImage(image, { type: 'compress', config })
    Hook->>Pipeline: execute(image, [compressOp])
    Pipeline->>Pool: dispatch(compressTask)
    Pool->>Worker: postMessage({ op: 'compress', buffer }, [buffer])
    Worker->>WASM: mozjpeg.encode(buffer, 85)
    WASM-->>Worker: encodedBuffer
    Worker-->>Pool: postMessage({ result: encodedBuffer }, [encodedBuffer])
    Pool-->>Pipeline: encodedBuffer
    Pipeline-->>Hook: ProcessingResult
    Hook-->>UI: (reactive update)
    UI-->>User: Show compressed preview + size reduction
```

---

## 3. Batch Processing Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as BatchScreen
    participant Store as queueStore
    participant Orch as BatchOrchestrator
    participant Pool as WasmWorkerPool

    User->>UI: Click "Start Processing"
    UI->>Store: setStatus('running')
    UI->>Orch: run(queue, onJobUpdate)

    loop For each pending job (with semaphore)
        Orch->>Store: updateJob(id, { status: 'processing' })
        Orch->>Pool: dispatch(jobTask)

        alt Success
            Pool-->>Orch: ProcessingResult
            Orch->>Store: updateJob(id, { status: 'completed', result })
        else Failure
            Pool-->>Orch: ProcessingError
            Orch->>Store: updateJob(id, { status: 'failed', error })
        end

        Store-->>UI: (reactive update → renders progress)
    end

    Orch->>Store: setStatus('completed')
    UI-->>User: "All done! 47/50 successful, 3 failed"
```

---

## 4. Service Worker Install Flow

```mermaid
sequenceDiagram
    participant Browser
    participant App as React App
    participant SW as Service Worker
    participant Cache as Cache Storage

    Browser->>App: Load https://imageforge.app
    App->>SW: navigator.serviceWorker.register('/sw.js')
    SW->>Cache: precacheAndRoute (static assets)
    SW-->>App: controlled
    App-->>Browser: App is interactive

    Note over SW,Cache: Background WASM prefetch
    SW->>Cache: fetch /wasm/libvips.wasm
    SW->>Cache: fetch /wasm/canvaskit.wasm

    Note over Browser,App: Next visit
    Browser->>SW: fetch /
    SW->>Cache: CacheFirst match
    Cache-->>SW: HTML (from cache)
    SW-->>Browser: HTML (instant)

    Browser->>SW: fetch /wasm/mozjpeg.wasm
    SW->>Cache: CacheFirst match
    Cache-->>SW: WASM (from cache, ~0ms)
    SW-->>Browser: WASM (instant)
```

---

## 5. Settings Persistence Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as SettingsScreen
    participant Store as settingsStore
    participant Persist as zustand-persist
    participant Storage as localStorage/AsyncStorage

    User->>UI: Toggle "Strip Metadata on Export"
    UI->>Store: updateSettings({ stripMetadataOnExport: true })
    Store->>Persist: onStateChange(newState)
    Persist->>Storage: setItem('imageforge-settings', JSON.stringify(state))

    Note over Browser,Storage: App restart
    Persist->>Storage: getItem('imageforge-settings')
    Storage-->>Persist: JSON string
    Persist-->>Store: Hydrate store with persisted state
    Store-->>UI: Settings restored
```

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
