# History Feature Specification

> **Document ID**: features/history
> **Phase**: 4 — Feature Specifications
> **Status**: Approved

---

## Overview

The History feature provides undo/redo for all image processing operations, giving users confidence to experiment without fear of losing their original.

---

## Functional Requirements

| Requirement                         | FR     | Priority |
| ----------------------------------- | ------ | -------- |
| Undo last operation                 | FR-250 | MVP      |
| Redo undone operation               | FR-251 | MVP      |
| History panel (sidebar)             | FR-252 | MVP      |
| Keyboard shortcuts (Ctrl+Z, Ctrl+Y) | FR-253 | MVP      |
| Step-to-step visual history         | FR-254 | MVP      |
| Restore original                    | FR-255 | MVP      |
| Max 50 history steps                | FR-256 | MVP      |
| History cleared on new image        | FR-257 | MVP      |

---

## State Model

```typescript
interface HistoryState {
  past: HistoryEntry[]; // Operations that can be undone
  present: ImageFile; // Current image state
  future: HistoryEntry[]; // Operations that can be redone
}

interface HistoryEntry {
  id: string;
  operationLabel: string; // e.g., "Compress (WebP, Q85)"
  thumbnailUrl: string; // 100px thumbnail for visual history
  timestamp: number;
  snapshot: ImageFile; // Full image state at this step
}
```

---

## Undo/Redo Implementation

```typescript
// undoOperation: move present → future, past.pop() → present
function undo(state: HistoryState): HistoryState {
  if (state.past.length === 0) return state;

  const [previous, ...newPast] = [...state.past].reverse();

  return {
    past: newPast.reverse(),
    present: previous.snapshot,
    future: [{ snapshot: state.present, ...currentMeta }, ...state.future],
  };
}

// redoOperation: future[0] → present, present → past
function redo(state: HistoryState): HistoryState {
  if (state.future.length === 0) return state;
  const [next, ...newFuture] = state.future;

  return {
    past: [...state.past, { snapshot: state.present, ...currentMeta }],
    present: next.snapshot,
    future: newFuture,
  };
}
```

---

## History Panel UI

```
┌─────────────────────┐
│ History             │
├─────────────────────┤
│ ● Original          │ ← Can jump to original
│ ○ Resize → 1080px  │
│ ○ Compress Q=85    │ ← Current (present)
│                     │
│ [Restore Original]  │
└─────────────────────┘
```

Users can click any history step to jump to that state (auto-discards future).

---

## Memory Considerations

Each `HistoryEntry` stores a full `ImageFile` including its `buffer`. For a 5MP JPEG at Q=85, each step is ~200KB. With 50 steps maximum:

- Max memory for history: ~10MB per image
- History is cleared when the user navigates away from the editor

---

_Document Owner: Product Team | Approved: 2026-07-27_
