# Threat Model

> **Document ID**: 46
> **Phase**: 2 — Architecture
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team / Security

---

## Purpose

This document provides a comprehensive threat model for ImageForge using the STRIDE framework, identifying potential threats, their likelihood and impact, and the mitigations implemented.

---

## Scope

- ImageForge Web Application (primary surface)
- ImageForge Mobile Applications (secondary)
- Plugin System (Phase 2)

---

## STRIDE Threat Analysis

### S — Spoofing

| Threat                               | Target        | Likelihood | Severity | Mitigation                            |
| ------------------------------------ | ------------- | ---------- | -------- | ------------------------------------- |
| Malicious file disguised as image    | Image import  | Medium     | High     | Magic byte validation; WASM sandbox   |
| Fake plugin mimicking trusted plugin | Plugin system | Low        | High     | Manifest checksum; registry signature |

### T — Tampering

| Threat                                 | Target            | Likelihood | Severity | Mitigation                                 |
| -------------------------------------- | ----------------- | ---------- | -------- | ------------------------------------------ |
| WASM binary tampering (CDN compromise) | Processing engine | Very Low   | Critical | Subresource Integrity (SRI) on WASM loads  |
| Dependency confusion attack            | npm packages      | Low        | Critical | `.npmrc` with scoped registry; `npm audit` |
| Supply chain attack                    | node_modules      | Low        | Critical | `pnpm.lock`; Dependabot; `npm audit`       |

### R — Repudiation

| Threat                        | Target            | Likelihood | Severity | Mitigation                                 |
| ----------------------------- | ----------------- | ---------- | -------- | ------------------------------------------ |
| User denies performing export | No server records | N/A        | Low      | Client-side only; no audit trail by design |

### I — Information Disclosure

| Threat                             | Target           | Likelihood | Severity | Mitigation                                                  |
| ---------------------------------- | ---------------- | ---------- | -------- | ----------------------------------------------------------- |
| Image data sent to server          | User privacy     | Low        | Critical | No network calls for image data; verified by CSP + E2E test |
| EXIF GPS data leaked via error log | User privacy     | Low        | High     | No PII in logs (logging strategy)                           |
| Plugin accessing host image data   | Plugin isolation | Medium     | High     | postMessage copy; iframe sandbox                            |
| Image metadata in URL/history      | User privacy     | Low        | Medium   | No image data in URLs; Blob URLs revoked                    |

### D — Denial of Service

| Threat                       | Target        | Likelihood | Severity | Mitigation                                       |
| ---------------------------- | ------------- | ---------- | -------- | ------------------------------------------------ |
| 100MB image causing OOM      | Processing    | Medium     | Medium   | File size limit (100MB); memory guard            |
| 10,000 files dropped at once | Import system | Low        | Medium   | Max batch size limit (configurable, default 500) |
| WASM infinite loop           | Processing    | Very Low   | Medium   | AbortSignal timeout (30s per operation)          |

### E — Elevation of Privilege

| Threat                        | Target        | Likelihood | Severity | Mitigation                                                |
| ----------------------------- | ------------- | ---------- | -------- | --------------------------------------------------------- |
| XSS via malicious SVG         | Web app       | Medium     | High     | SVG sanitization (DOMPurify); `script-src 'self'` CSP     |
| Plugin escaping sandbox       | Plugin system | Low        | Critical | `sandbox="allow-scripts"` (no same-origin); CSP on iframe |
| WASM escaping browser sandbox | Processing    | Very Low   | Critical | Browser WASM sandbox is the mitigation                    |
| Path traversal via filename   | Export        | Low        | Medium   | Sanitize filename before download                         |

---

## Attack Trees

### Tree 1: Image Data Exfiltration

```
Goal: Steal user's private image
├── Vector A: XSS injection → read ArrayBuffer
│   └── Mitigated by: CSP blocks inline scripts
├── Vector B: Malicious plugin reads host image
│   └── Mitigated by: Plugin receives buffer COPY via postMessage
│                      Plugin iframe has no access to host memory
├── Vector C: Man-in-the-middle (steal in transit)
│   └── Mitigated by: HTTPS only; no image data ever sent to network
└── Vector D: Read IndexedDB from another origin
    └── Mitigated by: Same-origin policy; IndexedDB is origin-scoped
```

### Tree 2: Malicious File Exploit

```
Goal: Execute code via crafted image file
├── Vector A: Malformed JPEG triggers parser exploit
│   └── Mitigated by: libvips/mozjpeg run in WASM sandbox
│                      WASM cannot access OS directly
├── Vector B: SVG with embedded script
│   └── Mitigated by: DOMPurify sanitization before render
│                      SVG never rendered as trusted HTML
└── Vector C: EXIF with overflow data
    └── Mitigated by: Try-catch on EXIF parser; errors ignored
```

---

## Security Controls Summary

| Control                  | Mechanism                  | Verified By                  |
| ------------------------ | -------------------------- | ---------------------------- |
| No image data to servers | Architecture (no backend)  | E2E test: zero network calls |
| Magic byte validation    | `validateFileMagicBytes()` | Unit tests                   |
| SVG sanitization         | DOMPurify                  | Unit tests                   |
| Content Security Policy  | Vercel headers             | Lighthouse + CSP validator   |
| Plugin sandbox           | `<iframe sandbox>`         | Manual security review       |
| Dependency audit         | `npm audit` in CI          | CI gate                      |
| HTTPS enforcement        | HSTS header                | HSTS preload list            |

---

## Related Documents

| Document                                                     | Relationship                     |
| ------------------------------------------------------------ | -------------------------------- |
| [37-security-architecture.md](./37-security-architecture.md) | Security controls implementation |
| [security/privacy.md](./security/privacy.md)                 | Privacy policy details           |
| [31-plugin-system.md](./31-plugin-system.md)                 | Plugin threat surface            |

---

_Document Owner: Architecture Team | Review Cycle: Quarterly | Approved: 2026-07-27_
