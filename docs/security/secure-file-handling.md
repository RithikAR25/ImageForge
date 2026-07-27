# Secure File Handling

> **Document ID**: security/secure-file-handling
> **Phase**: 7 — Security
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

This document defines secure file handling practices for ImageForge — how image files are read, stored temporarily, and cleaned up to prevent data leaks and exploits.

---

## File Ingestion Security

### Magic Byte Validation

Never trust file extensions or MIME types from the OS. Always validate file content:

```typescript
// packages/image-core/src/import/validateFileMagicBytes.ts

const MAGIC_SIGNATURES: Record<string, Uint8Array> = {
  'image/jpeg': new Uint8Array([0xff, 0xd8, 0xff]),
  'image/png': new Uint8Array([0x89, 0x50, 0x4e, 0x47]),
  'image/webp': new Uint8Array([0x52, 0x49, 0x46, 0x46]), // RIFF....WEBP
  'image/gif': new Uint8Array([0x47, 0x49, 0x46, 0x38]),
  'image/bmp': new Uint8Array([0x42, 0x4d]),
};

export async function validateFileMagicBytes(file: File): Promise<string | null> {
  const header = await file.slice(0, 16).arrayBuffer();
  const bytes = new Uint8Array(header);

  for (const [mimeType, signature] of Object.entries(MAGIC_SIGNATURES)) {
    if (signature.every((byte, i) => bytes[i] === byte)) {
      return mimeType;
    }
  }

  // HEIC: check for 'ftyp' box at offset 4
  if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
    return 'image/heic';
  }

  return null; // Unknown/unsupported format
}
```

### SVG Sanitization

SVG files can contain embedded scripts. Always sanitize before rendering:

```typescript
import DOMPurify from 'dompurify';

export function sanitizeSvg(svgContent: string): string {
  return DOMPurify.sanitize(svgContent, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['use'],
    FORBID_TAGS: ['script', 'foreignObject'],
    FORBID_ATTR: ['onload', 'onerror', 'onclick', 'onmouseover'],
  });
}
```

### Filename Sanitization

Filenames from user files are never used directly in any system operations:

```typescript
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[/\\:*?"<>|]/g, '_') // Remove path traversal chars
    .replace(/\.{2,}/g, '_') // No .. sequences
    .replace(/^\./, '_') // No leading dot
    .slice(0, 255); // Max filename length
}
```

---

## Temporary File Storage

### Web

Processed images exist as `ArrayBuffer` in memory or `Blob URL`. There is no persistent temp file:

```
Processing result → ArrayBuffer (memory) → URL.createObjectURL(blob)
    ↓ User clicks Download
    → <a download> triggered
    → URL.revokeObjectURL() called immediately after
```

### Mobile (expo-file-system)

Mobile stores processed files in `cacheDirectory` — cleared by OS under storage pressure:

```typescript
const TEMP_DIR = `${FileSystem.cacheDirectory}imageforge_temp/`;

async function writeTempFile(buffer: Uint8Array, filename: string): Promise<string> {
  const sanitized = sanitizeFilename(filename);
  const path = `${TEMP_DIR}${Date.now()}_${sanitized}`;

  await FileSystem.writeAsStringAsync(path, Buffer.from(buffer).toString('base64'), {
    encoding: FileSystem.EncodingType.Base64,
  });

  return path;
}

// Always clean up temp files after export
async function cleanupTempFile(path: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(path, { idempotent: true });
  } catch (err) {
    logger.warn('Failed to clean up temp file', err, { path });
  }
}
```

---

## EXIF Data Handling

EXIF data can contain sensitive GPS coordinates. Handling:

1. EXIF is parsed and stored only in memory (`ImageFile.exif`)
2. EXIF is never written to IndexedDB or any persistent store
3. On export, EXIF is **stripped by default** unless user explicitly keeps it
4. GPS coordinates are never logged, even in debug mode

```typescript
// logger.ts — scrub EXIF from log payloads
function scrubSensitiveData(data: unknown): unknown {
  if (typeof data === 'object' && data !== null && 'exif' in data) {
    const { exif, ...safe } = data as any;
    return safe; // Drop EXIF from logs
  }
  return data;
}
```

---

## Related Documents

| Document                                                      | Relationship      |
| ------------------------------------------------------------- | ----------------- |
| [46-threat-model.md](../46-threat-model.md)                   | Threat analysis   |
| [37-security-architecture.md](../37-security-architecture.md) | Security controls |
| [security/privacy.md](./privacy.md)                           | Privacy policy    |

---

_Document Owner: Engineering Team | Approved: 2026-07-27_
