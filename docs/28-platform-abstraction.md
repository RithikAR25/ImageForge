# Platform Abstraction Layer

> **Document ID**: 28
> **Phase**: 2 — Architecture
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document defines the Platform Abstraction Layer (PAL) — the set of interfaces, adapters, and conventions that allow shared business logic to run identically on Web, Android, and iOS despite underlying platform differences.

---

## Core Abstraction Points

| Domain           | Interface          | Web Impl                 | Mobile Impl                       |
| ---------------- | ------------------ | ------------------------ | --------------------------------- |
| Image processing | `ProcessingEngine` | WASM engine              | Native modules                    |
| Storage          | `StorageAdapter`   | IndexedDB                | SQLite                            |
| File import      | `FileImporter`     | File API / Drop          | expo-image-picker                 |
| File export      | `FileExporter`     | Download / Share         | expo-media-library                |
| Network          | `NetworkMonitor`   | `navigator.onLine`       | `@react-native-community/netinfo` |
| Clipboard        | `ClipboardAdapter` | Clipboard API            | expo-clipboard                    |
| Share            | `ShareAdapter`     | Web Share API            | expo-sharing                      |
| Haptics          | `HapticsAdapter`   | (no-op)                  | expo-haptics                      |
| Secure store     | `SecureStorage`    | localStorage (encrypted) | expo-secure-store                 |

---

## Adapter Pattern Implementation

```typescript
// 1. Define interface (packages/types)
interface FileExporter {
  exportSingle(image: ImageFile, name: string): Promise<void>;
  exportBatch(images: ImageFile[], archiveName: string): Promise<void>;
}

// 2. Web implementation (packages/image-core/src/export/exporter.web.ts)
class WebFileExporter implements FileExporter {
  async exportSingle(image: ImageFile, name: string): Promise<void> {
    const blob = new Blob([image.buffer], { type: image.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  async exportBatch(images: ImageFile[], archiveName: string): Promise<void> {
    const zip = await buildZip(images);
    await this.exportSingle({ buffer: zip, mimeType: 'application/zip' } as any, archiveName);
  }
}

// 3. Mobile implementation (packages/image-core/src/export/exporter.native.ts)
class NativeFileExporter implements FileExporter {
  async exportSingle(image: ImageFile, name: string): Promise<void> {
    const uri = await FileSystem.writeAsStringAsync(
      FileSystem.cacheDirectory + name,
      arrayBufferToBase64(image.buffer),
      { encoding: 'base64' },
    );
    await MediaLibrary.saveToLibraryAsync(uri);
  }

  async exportBatch(images: ImageFile[], archiveName: string): Promise<void> {
    // Save each to camera roll
    await Promise.all(
      images.map((img, i) =>
        this.exportSingle(img, `${archiveName}-${i + 1}.${mimeToExt(img.mimeType)}`),
      ),
    );
  }
}

// 4. Export unified name (bundler picks the right one)
// packages/image-core/src/export/exporter.web.ts → export const fileExporter = new WebFileExporter()
// packages/image-core/src/export/exporter.native.ts → export const fileExporter = new NativeFileExporter()
```

---

## Platform Detection

In shared code, platform detection should be done through capability detection, not `Platform.OS`:

```typescript
// ✅ Capability-based (preferred in packages/)
const canSaveToPhotos = 'saveToLibrary' in fileExporter;

// ✅ Platform.OS is fine in packages/ui (React Native package)
const style = Platform.select({ web: webStyle, default: nativeStyle });

// ❌ Avoid in packages/shared, packages/image-core
import { Platform } from 'react-native'; // Couples shared pkg to React Native
```

---

## Native Module Bridge

For mobile-specific native capabilities beyond Expo SDK:

```typescript
// packages/image-core/src/engines/native/NativeEngineAdapter.ts
import { NativeModules } from 'react-native';

const { ImageProcessingModule } = NativeModules;

class NativeEngineAdapter implements ProcessingEngine {
  async applyOperation(input: ImageFile, op: ProcessingOperation): Promise<ImageFile> {
    // Call native module via JSI (New Architecture)
    const result = await ImageProcessingModule.process({
      uri: input.uri,
      operation: op.type,
      config: op.config,
    });

    return {
      ...input,
      uri: result.uri,
      fileSize: result.fileSize,
      width: result.width,
      height: result.height,
    };
  }
}
```

---

## File Extension Resolution

Metro (mobile) and Vite (web) resolve platform files automatically:

```
Priority order (Mobile — Metro):
  Component.ios.tsx
  Component.android.tsx
  Component.native.tsx
  Component.tsx

Priority order (Web — Vite with alias):
  Component.web.tsx
  Component.tsx
```

Vite alias configuration:

```typescript
// apps/web/vite.config.ts
export default defineConfig({
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js'],
  },
});
```

---

## Related Documents

| Document                                                   | Relationship     |
| ---------------------------------------------------------- | ---------------- |
| [27-shared-code-strategy.md](./27-shared-code-strategy.md) | Sharing strategy |
| [33-storage-architecture.md](./33-storage-architecture.md) | Storage adapter  |
| [49-native-bridge-design.md](./49-native-bridge-design.md) | Native bridge    |
| [49b-wasm-architecture.md](./49b-wasm-architecture.md)     | Web engine       |

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
