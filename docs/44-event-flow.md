# Event Flow

> **Document ID**: 44
> **Phase**: 2 — Architecture
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document documents the event flows within ImageForge — how user actions propagate through the system layers, triggering state updates, side effects, and UI re-renders.

---

## Event Flow Model

ImageForge uses a **unidirectional data flow** model:

```
User Action
    ↓
UI Event Handler (onPress, onChange)
    ↓
Store Action / Mutation (Zustand / TanStack)
    ↓
State Update
    ↓
Reactive UI Re-render
    ↓
User sees updated UI
```

Side effects (processing, storage) happen outside the render cycle via:

- `useMutation` (TanStack Query)
- `useEffect` with store subscriptions
- Direct store action calls in event handlers

---

## Key Event Flows

### 1. Quality Slider Change

```
User drags slider
  → onChange(newValue: number)
    → Local component state: setQuality(newValue)
      → useEffect: debounce(300ms)
        → processImage(image, { quality: newValue })
          → useMutation.mutate(...)
            → ImagePipeline.execute()
              → Worker processes image
                → mutation.onSuccess
                  → previewUrl updated
                    → BeforeAfterSlider re-renders
```

The **debounce** prevents firing a WASM operation on every pixel moved.

---

### 2. File Drop on DropZone

```
User drops files on DropZone
  → onDrop(event: DragEvent)
    → event.dataTransfer.files
      → validateFileMagicBytes(file) × N
        → [Valid files] → ThumbnailGenerator.generate()
          → addImages(imageFiles[]) [imageStore action]
            → imageStore.images updated
              → HomeScreen re-renders (shows thumbnails)
        → [Invalid files] → addToast(error) [uiStore action]
          → uiStore.toasts updated
            → ToastContainer re-renders
```

---

### 3. Batch Start

```
User clicks "Start"
  → onPress()
    → queueStore.startQueue()
      → queueStore.status = 'running'
        → BatchOrchestrator.run(queue)
          → For each job (semaphore-limited):
              → updateJob(id, { status: 'processing' })
                → queueStore update → QueueList re-renders
              → WasmWorkerPool.dispatch(task)
                → Worker completes
                  → updateJob(id, { status: 'completed', result })
                    → queueStore update → QueueItem re-renders
                    → Export result stored in memory
          → All jobs done:
            → queueStore.status = 'completed'
              → UI shows "All done" banner
```

---

### 4. Undo Operation

```
User presses Ctrl+Z / Undo button
  → useImageHistory.undo()
    → historyStore.undo()
      → pops entry from past[]
      → pushes entry to future[]
      → returns entry.snapshot (ImageFile before op)
        → imageStore.updateImage(snapshot)
          → imageStore.activeImageId = snapshot.id
            → CompressScreen preview re-renders with previous image
```

---

### 5. Settings Change

```
User toggles "Strip Metadata on Export"
  → onValueChange(true)
    → settingsStore.updateSettings({ stripMetadataOnExport: true })
      → Zustand persist middleware fires
        → localStorage/AsyncStorage updated
          → (no UI re-render needed — setting applied at export time)
```

---

## Event Bus Anti-Pattern

ImageForge does **NOT** use a custom event bus or `EventEmitter`. All communication is through:

1. Zustand stores (global state)
2. React props (local state)
3. TanStack Query (async operations)
4. React Context (theme, locale)

Custom event buses create invisible coupling and are difficult to debug.

---

## Keyboard Shortcut Event Flow

```
User presses Ctrl+Z
  → window keydown event
    → KeyboardShortcutHandler.onKeyDown(event)
      → matches 'mod+z' pattern
        → calls useImageHistory.undo()
          → (same as undo flow above)
```

Keyboard shortcuts are registered once at the app root level in `apps/web/src/providers/KeyboardShortcutProvider.tsx`.

---

## Related Documents

| Document                                               | Relationship            |
| ------------------------------------------------------ | ----------------------- |
| [43-sequence-diagrams.md](./43-sequence-diagrams.md)   | Detailed sequence flows |
| [45-data-flow-diagrams.md](./45-data-flow-diagrams.md) | Data flow overview      |
| [35-state-management.md](./35-state-management.md)     | Store architecture      |

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
