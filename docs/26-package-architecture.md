# Package Architecture

> **Document ID**: 26
> **Phase**: 2 — Architecture
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document details the internal architecture of each package in the ImageForge monorepo — exports, dependencies, design patterns, and conventions.

---

## Package Dependency Graph

```mermaid
graph TB
    W[apps/web]
    M[apps/mobile]
    UI[@imageforge/ui]
    IC[@imageforge/image-core]
    HK[@imageforge/hooks]
    SH[@imageforge/shared]
    TY[@imageforge/types]

    W --> UI
    W --> HK
    M --> UI
    M --> HK

    UI --> SH
    UI --> TY
    HK --> IC
    HK --> SH
    HK --> TY
    IC --> SH
    IC --> TY
    SH --> TY
```

**Rule**: Dependencies always flow downward. No package can import from an `apps/` package.

---

## @imageforge/types

**Purpose**: Single source of truth for all TypeScript interfaces. Zero runtime code.

**Exports**:

```typescript
// All domain types
export type { ImageFile, BatchJob, BatchQueue, Pipeline, ProcessingResult };
// All operation types
export type { ProcessingOperation, CompressConfig, ResizeConfig, CropConfig };
// Error types
export type { ProcessingErrorCode, ImportErrorCode, StorageErrorCode };
// Utility types
export type { ColorSpace, ExifData, StorageUsage };
```

**Dependencies**: none

**Pattern**: Interface-only. No classes, no functions, no runtime code.

---

## @imageforge/shared

**Purpose**: Utilities, constants, i18n strings, Zustand stores, validation schemas.

**Key Exports**:

```typescript
export { createLogger } from './logger/Logger';
export { useImageStore, useQueueStore, useSettingsStore } from './stores';
export { validateFileMagicBytes } from './validators/filetype';
export { formatFileSize, formatDuration } from './utils/format';
export { COMPRESS_PRESETS, RESIZE_PRESETS } from './constants/presets';
export { strings } from './i18n';
```

**Dependencies**: `@imageforge/types`

**Pattern**: Pure functions. Stores (Zustand). No React imports.

---

## @imageforge/image-core

**Purpose**: All image processing business logic. Platform-agnostic orchestration + platform-specific engines.

**Key Exports**:

```typescript
export { ImagePipeline } from './pipeline/ImagePipeline';
export { BatchOrchestrator } from './batch/BatchOrchestrator';
export { createCompressOperation } from './compress';
export { createResizeOperation } from './resize';
export { createCropOperation } from './crop';
export { createRotateOperation } from './rotate';
export { createConvertOperation } from './convert';
export type { ProcessingEngine } from './engines/ProcessingEngine';
// Storage adapter (platform file resolves the implementation)
export { storageAdapter } from './storage/storage';
// Engine (platform file resolves the implementation)
export { processingEngine } from './engines/engine';
```

**Dependencies**: `@imageforge/types`, `@imageforge/shared`

**Pattern**: Feature modules with adapter pattern for platform-specific code.

---

## @imageforge/hooks

**Purpose**: Custom React hooks that compose image-core + stores + TanStack Query.

**Key Exports**:

```typescript
export { useImageProcessor } from './useImageProcessor';
export { useBatchQueue } from './useBatchQueue';
export { useImageHistory } from './useImageHistory';
export { useStorage } from './useStorage';
export { useFeatureFlag } from './useFeatureFlag';
export { useNetworkStatus } from './useNetworkStatus';
export { useTheme } from './useTheme';
```

**Dependencies**: `@imageforge/image-core`, `@imageforge/shared`, `@imageforge/types`, React, TanStack Query

**Pattern**: Hooks composition. Each hook has a single responsibility.

---

## @imageforge/ui

**Purpose**: Cross-platform React Native components, screens, navigation, design tokens, and theme.

**Key Exports**:

```typescript
// Primitives
export { Button, Text, Icon, Input, Spinner } from './primitives';
// Components
export { Slider, ProgressBar, Toast, Modal, DropZone } from './components';
// Feature components
export { ImageThumbnail, QueueItem, BeforeAfterSlider } from './feature';
// Screens
export { HomeScreen, CompressScreen, ResizeScreen, BatchScreen } from './screens';
// Navigation
export { RootNavigator, TabNavigator } from './navigation';
// Theme
export { ThemeProvider, useTheme } from './theme';
// Tokens
export { colors, typography, spacing, animations } from './tokens';
```

**Dependencies**: `@imageforge/hooks`, `@imageforge/shared`, `@imageforge/types`, React Native, Expo, Reanimated, Skia

**Pattern**: Atomic design (primitives → components → feature → screens).

---

## Conventions Across All Packages

### Barrel Exports

Every folder with multiple files has an `index.ts`:

```typescript
// packages/image-core/src/compress/index.ts
export { createCompressOperation } from './Compress';
export type { CompressConfig } from './CompressConfig';
```

### File Naming

| Type            | Convention       | Example                 |
| --------------- | ---------------- | ----------------------- |
| Implementation  | PascalCase       | `ImagePipeline.ts`      |
| Types           | PascalCase       | `CompressConfig.ts`     |
| Utilities       | camelCase        | `formatFileSize.ts`     |
| Tests           | Same + `.test`   | `ImagePipeline.test.ts` |
| Platform web    | Same + `.web`    | `storage.web.ts`        |
| Platform native | Same + `.native` | `storage.native.ts`     |

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
