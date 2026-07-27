# Security Architecture

> **Document ID**: 37
> **Phase**: 2 — Architecture
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document defines the security architecture for ImageForge, covering threat modeling, security controls, secure coding practices, and compliance requirements.

---

## Security Principles

1. **Privacy by Design**: No image data leaves the device without explicit user action
2. **Defense in Depth**: Multiple security layers (CSP, input validation, sandboxing)
3. **Least Privilege**: Components access only what they need
4. **Secure Defaults**: Most restrictive settings by default
5. **Zero Trust for Plugins**: All third-party code runs in isolated sandboxes

---

## Threat Model Summary

| Threat                                              | Likelihood | Severity | Control                                   |
| --------------------------------------------------- | ---------- | -------- | ----------------------------------------- |
| Malicious file upload (image with embedded exploit) | Medium     | Critical | Magic byte validation, WASM sandboxing    |
| XSS via malicious SVG                               | High       | High     | SVG sanitization, CSP                     |
| Data exfiltration via plugin                        | Medium     | Critical | Plugin sandbox, no net access             |
| Supply chain attack (compromised npm package)       | Low        | Critical | Dependabot, npm audit, lockfile           |
| WASM escape                                         | Very Low   | Critical | Browser sandboxing, no file system access |
| CSRF                                                | Low        | Medium   | SameSite cookies, no state-changing GETs  |
| Clickjacking                                        | Low        | Low      | X-Frame-Options: SAMEORIGIN               |

---

## Input Validation

### File Type Validation (Magic Bytes)

File extension is never trusted. MIME type is verified by reading the file's magic bytes:

```typescript
// packages/shared/src/validators/filetype.ts

const MAGIC_BYTES: Record<string, number[][]> = {
  'image/jpeg': [[0xff, 0xd8, 0xff]],
  'image/png': [[0x89, 0x50, 0x4e, 0x47]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]],
  'image/gif': [[0x47, 0x49, 0x46, 0x38]],
  'image/bmp': [[0x42, 0x4d]],
  'image/heic': [[0x00, 0x00, 0x00, 0x00, 0x66, 0x74, 0x79, 0x70]],
};

export async function validateFileMagicBytes(file: File): Promise<string | null> {
  const buffer = await file.slice(0, 16).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  for (const [mimeType, signatures] of Object.entries(MAGIC_BYTES)) {
    for (const signature of signatures) {
      if (signature.every((byte, i) => bytes[i] === byte)) {
        return mimeType;
      }
    }
  }

  return null; // Unknown/unsupported
}
```

### SVG Sanitization

SVG files can contain JavaScript and script elements. All SVG content is sanitized before rendering:

```typescript
import DOMPurify from 'dompurify';

export function sanitizeSvg(svgString: string): string {
  return DOMPurify.sanitize(svgString, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: ['script', 'use'],
    FORBID_ATTR: ['onload', 'onerror', 'onclick'],
  });
}
```

### EXIF Data Validation

Malformed EXIF data must not crash the parser:

```typescript
// Use a safe EXIF parser that catches all exceptions
export function safeParseExif(buffer: ArrayBuffer): ExifData | null {
  try {
    return parseExif(buffer);
  } catch {
    // Log warning, return null — never propagate parser errors to user
    console.warn('EXIF parse failed — malformed EXIF data, ignoring');
    return null;
  }
}
```

---

## Content Security Policy

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'wasm-unsafe-eval';
  worker-src 'self' blob:;
  img-src 'self' blob: data:;
  connect-src 'self';
  style-src 'self' 'unsafe-inline';
  font-src 'self' https://fonts.gstatic.com;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
```

**Key Notes**:

- `wasm-unsafe-eval` required for WASM compilation (unavoidable for WASM)
- `worker-src blob:` required for dynamically-created Worker URLs
- `frame-src 'none'` prevents embedding ImageForge in an iframe (clickjacking defense)
- `img-src blob:` allows displaying processed image previews

---

## HTTP Security Headers

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

Note: `Permissions-Policy: camera=()` would block the Web camera import feature if implemented. This needs to be adjusted to `camera=(self)` if camera capture is added to Web.

---

## Plugin Security Model

See [31-plugin-system.md](./31-plugin-system.md) for full plugin security design.

Summary:

- Plugins run in sandboxed `<iframe sandbox="allow-scripts">` on Web
- Plugins cannot access: DOM, localStorage, IndexedDB, network, file system
- Plugin-to-host communication: only via `postMessage` with structured data
- Image data sent to plugin: a **copy** of the buffer, not a reference
- Plugin manifest validated against SHA-256 checksum before load

---

## Dependency Security

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'weekly'
    groups:
      production-dependencies:
        dependency-type: 'production'
      dev-dependencies:
        dependency-type: 'development'
```

CI fails on:

- Any `npm audit` finding with severity `high` or `critical`
- Any dependency without a compatible open-source license

---

## Mobile Security (Expo)

### iOS

- `NSPhotoLibraryUsageDescription` — photo access
- `NSCameraUsageDescription` — camera access
- `NSAppTransportSecurity` — HTTPS only
- Processed images stored in app sandbox only
- No iCloud backup of temporary processing files (`NSURLIsExcludedFromBackupKey`)

### Android

- `READ_MEDIA_IMAGES` — Android 13+ image access
- `READ_EXTERNAL_STORAGE` — Android 12 and below
- All network traffic via HTTPS
- No `android:allowBackup` for processing cache directories

---

## Incident Response

If a security vulnerability is discovered:

1. Report via `security@imageforge.dev` (or GitHub Security Advisory)
2. Triage within 48 hours
3. Patch released within 7 days for critical vulnerabilities
4. CVE filed if warranted
5. Public disclosure after patch (coordinated disclosure)

---

## Related Documents

| Document                                                                 | Relationship            |
| ------------------------------------------------------------------------ | ----------------------- |
| [06-non-functional-requirements.md](./06-non-functional-requirements.md) | NFRs: Security section  |
| [46-threat-model.md](./46-threat-model.md)                               | Full threat model       |
| [31-plugin-system.md](./31-plugin-system.md)                             | Plugin security         |
| [ADR-0006](./adr/ADR-0006-plugin-system.md)                              | Plugin sandbox decision |

---

_Document Owner: Architecture Team | Review Cycle: Quarterly | Approved: 2026-07-27_
