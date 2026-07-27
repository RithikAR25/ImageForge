# State Management

> **Document ID**: 35
> **Phase**: 2 — Architecture
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document defines the complete state management architecture for ImageForge — the Zustand store design, TanStack Query integration, state ownership boundaries, and patterns for developers to follow.

---

## State Categories

| Category                   | Technology                     | Why                          |
| -------------------------- | ------------------------------ | ---------------------------- |
| **Synchronous UI state**   | Zustand                        | Simple, fast, no async       |
| **Async processing state** | TanStack Query                 | Built-in loading/error/retry |
| **Persistent settings**    | Zustand + persist middleware   | localStorage/AsyncStorage    |
| **Navigation state**       | Expo Router / React Navigation | Built-in per framework       |
| **Form state**             | React Hook Form (local)        | Not global                   |
| **Server state** (future)  | TanStack Query                 | Caching, refetch             |

---

## Zustand Store Architecture

### Store Design Principles

1. **Domain partitioning**: One store per domain concept
2. **No store-to-store dependencies**: Stores are independent
3. **Selectors over raw state**: Always use selectors to read store values
4. **Actions over direct `set`**: Expose named actions, not raw `set(state => ...)` in components
5. **Immutability**: State updates are pure (produce new references)

---

## Store Definitions

### imageStore — Image Registry

```typescript
// packages/shared/src/stores/imageStore.ts
interface ImageStore {
  // State
  images: Map<string, ImageFile>; // All loaded images
  activeImageId: string | null; // Currently focused image
  selectedImageIds: Set<string>; // Batch selection

  // Actions
  addImages: (images: ImageFile[]) => void;
  removeImage: (id: string) => void;
  setActiveImage: (id: string | null) => void;
  toggleImageSelection: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  clearAll: () => void;
}
```

### queueStore — Batch Processing Queue

```typescript
// packages/shared/src/stores/queueStore.ts
interface QueueStore {
  // State
  jobs: Map<string, BatchJob>; // All batch jobs
  pipeline: ProcessingOperation[]; // Shared pipeline
  activeJobId: string | null;
  status: 'idle' | 'running' | 'paused' | 'completed';

  // Actions
  addJob: (imageIds: string[]) => string; // Returns jobId
  removeJob: (jobId: string) => void;
  setPipeline: (ops: ProcessingOperation[]) => void;
  addOperation: (op: ProcessingOperation) => void;
  removeOperation: (opId: string) => void;
  reorderOperation: (from: number, to: number) => void;
  startQueue: () => void;
  pauseQueue: () => void;
  resumeQueue: () => void;
  cancelQueue: () => void;
  updateJobStatus: (jobId: string, status: JobStatus) => void;
  retryJob: (jobId: string) => void;
  retryAllFailed: () => void;
}
```

### historyStore — Undo/Redo

```typescript
// packages/shared/src/stores/historyStore.ts
interface HistoryStore {
  // State
  past: HistoryEntry[]; // Applied operations (undo stack)
  future: HistoryEntry[]; // Undone operations (redo stack)

  // Actions
  push: (entry: HistoryEntry) => void; // Record an operation
  undo: () => HistoryEntry | undefined;
  redo: () => HistoryEntry | undefined;
  clear: () => void;

  // Selectors
  canUndo: boolean;
  canRedo: boolean;
}

interface HistoryEntry {
  operation: ProcessingOperation;
  snapshot: ImageFile; // Image state BEFORE operation
  timestamp: number;
}
```

### settingsStore — User Preferences

```typescript
// packages/shared/src/stores/settingsStore.ts
interface SettingsStore {
  // State
  defaultOutputFormat: 'jpeg' | 'png' | 'webp';
  defaultJpegQuality: number; // 1-100
  defaultWebpQuality: number; // 1-100
  defaultPngCompressionLevel: number; // 0-9
  theme: 'system' | 'light' | 'dark';
  autoRotateByExif: boolean;
  stripMetadataOnExport: boolean;
  analyticsOptIn: boolean;

  // Actions
  updateSettings: (partial: Partial<SettingsStore>) => void;
  resetToDefaults: () => void;
}
```

### uiStore — Interface State

```typescript
// packages/shared/src/stores/uiStore.ts
interface UIStore {
  // State
  activeTool: ToolType | null;
  isPanelOpen: Record<string, boolean>;
  isModalOpen: Record<string, boolean>;
  isLoading: boolean;
  toasts: Toast[];

  // Actions
  setActiveTool: (tool: ToolType | null) => void;
  togglePanel: (panelId: string) => void;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
}
```

---

## TanStack Query Integration

TanStack Query handles all **asynchronous processing operations**:

```typescript
// packages/hooks/src/useImageProcessor.ts

// Process a single image
function useCompressImage() {
  return useMutation({
    mutationFn: async ({ image, config }: CompressParams) => {
      const pipeline = new ImagePipeline(engine, [{ type: 'compress', config }]);
      return pipeline.execute(image);
    },
    onSuccess: (result) => {
      // Store result in imageStore
      useImageStore.getState().updateImage(result.output);
      useHistoryStore.getState().push({
        operation: { type: 'compress', config },
        snapshot: originalImage,
        timestamp: Date.now(),
      });
    },
    onError: (error) => {
      useUIStore.getState().addToast({
        type: 'error',
        message: formatProcessingError(error),
      });
    },
  });
}
```

---

## Settings Persistence

```typescript
// Zustand persist middleware
const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      // ... store implementation
    }),
    {
      name: 'imageforge-settings',
      storage: createJSONStorage(() => (Platform.OS === 'web' ? localStorage : AsyncStorage)),
    },
  ),
);
```

---

## Anti-Patterns to Avoid

❌ **Never** put derived state in Zustand — compute it in selectors

```typescript
// Bad:
completedJobCount: number; // derived from jobs map

// Good: compute in component
const completedCount = useQueueStore(
  (state) => Array.from(state.jobs.values()).filter((j) => j.status === 'completed').length,
);
```

❌ **Never** call Zustand `set` directly from components

```typescript
// Bad:
useImageStore.setState({ activeImageId: id });

// Good:
useImageStore.getState().setActiveImage(id);
```

❌ **Never** put processing results (large ArrayBuffers) in Zustand — they cause expensive re-renders

```typescript
// Bad:
results: Map<string, ArrayBuffer>; // In Zustand store

// Good:
// Store results as Blob URLs in a Map in a React ref
// Store only metadata (size, format) in Zustand
```

---

## Related Documents

| Document                                                             | Relationship           |
| -------------------------------------------------------------------- | ---------------------- |
| [ADR-0003](./adr/ADR-0003-state-management.md)                       | Decision rationale     |
| [34-caching-strategy.md](./34-caching-strategy.md)                   | TanStack Query caching |
| [29-image-processing-pipeline.md](./29-image-processing-pipeline.md) | Pipeline integration   |

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
