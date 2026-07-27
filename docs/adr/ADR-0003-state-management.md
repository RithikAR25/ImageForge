# ADR-0003: Zustand for State Management

**Date**: 2026-07-27  
**Status**: Accepted  
**Deciders**: Architecture Team

---

## Context

ImageForge requires a client-side state management solution that handles:

1. **UI state**: Current image, active tool, panel visibility
2. **Processing state**: Queue items, processing progress, results
3. **Settings**: User preferences, defaults
4. **History**: Undo/redo stack

Additionally, we need to manage **async state** (image processing operations that are in-flight). This is kept separate from synchronous state.

The state management solution must work on both Web and Mobile (React Native) from the same code.

---

## Decision Drivers

- Must work identically in React Native and React Native Web
- Minimal boilerplate — ImageForge contributors should spend time on features, not state wiring
- TypeScript-first with excellent inference
- Small bundle size (web performance budget)
- Supports store partitioning by domain (image store, queue store, settings store)
- Devtools support for debugging
- No Context re-render performance issues at scale

---

## Considered Options

### Option A: Zustand (Chosen)

Lightweight state management library with a simple hook-based API.

### Option B: Redux Toolkit (RTK)

The modern, opinionated Redux approach with createSlice, createAsyncThunk.

### Option C: Jotai

Atomic state management library. Granular atom-based model.

### Option D: MobX

Observable-based reactive state management.

### Option E: React Context + useReducer

Standard React pattern using Context API for global state.

---

## Decision Outcome

**Chosen option: Option A — Zustand**

Zustand + TanStack Query (for async state) provides the ideal combination:

- Zustand: synchronous global state (UI state, settings, history)
- TanStack Query: asynchronous state (processing operations, their status, results)

---

## Pros and Cons of the Options

### Option A: Zustand (Chosen)

**Pros**:

- Tiny bundle (~1KB gzipped)
- No Provider required (uses module-level store)
- Excellent TypeScript inference out of the box
- Simple API: `create`, `set`, `get`, `subscribe`
- React Native compatible (same as browser)
- Supports multiple stores (good for domain separation)
- Devtools integration available via middleware
- Supports persistence middleware (easy LocalStorage sync)

**Cons**:

- Less opinionated than RTK — team must define patterns
- No built-in async handling (solved by TanStack Query)
- Smaller ecosystem than Redux

### Option B: Redux Toolkit

**Pros**:

- Industry standard, massive ecosystem
- Built-in async with `createAsyncThunk`
- Redux DevTools (excellent debugging)
- Opinionated — less decision fatigue

**Cons**:

- Significant boilerplate even with RTK
- ~13KB gzipped (larger than Zustand)
- Selector patterns (reselect) add complexity
- Context-based — can have re-render performance issues
- More concepts to learn (reducers, actions, slices, thunks, selectors)
- Overkill for this application's state complexity

### Option C: Jotai

**Pros**:

- Atomic model — only re-render components that use changed atom
- Very similar to Recoil (if team has that background)
- Small bundle

**Cons**:

- Atom dependency management can become complex
- Less clear "where is the state for X" compared to Zustand stores
- Slightly less ergonomic for stores with multiple related fields

### Option D: MobX

**Pros**: Reactive — automatic dependency tracking, less manual subscription
**Cons**: Class-based patterns conflict with functional React; decorators; larger bundle; React Native Web compatibility concerns

### Option E: React Context

**Pros**: Zero dependencies, built into React
**Cons**:

- Re-renders entire subtree on any state change
- No devtools
- Patterns must be implemented manually
- Performance problems at scale (image gallery with 500 items)

---

## Store Architecture

ImageForge's Zustand stores are domain-partitioned:

```typescript
// packages/shared/src/stores/
useImageStore      → selected images, active image, thumbnails
useQueueStore      → batch queue items, pipeline config
useHistoryStore    → undo/redo stack
useSettingsStore   → user preferences, defaults
useUIStore         → panel visibility, active tool, modal state
```

Each store is in the `packages/shared` package, shared between Web and Mobile.

---

## Consequences

**Good**:

- Minimal boilerplate enables faster feature development
- Domain partitioning means changes to queue logic don't affect image display
- TypeScript inference is excellent — no manual typing of action payloads
- `persist` middleware easily syncs settings to localStorage / AsyncStorage

**Bad**:

- Developers must define their own patterns for complex state interactions
- No built-in time-travel debugging (must add devtools middleware manually)
- For truly complex interactions between stores, custom subscription logic needed

---

## References

- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [DL-003 in Decision Log](../DECISION_LOG.md)
- [35-state-management.md](../35-state-management.md)
