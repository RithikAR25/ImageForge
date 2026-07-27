# API Versioning Strategy

> **Document ID**: 47
> **Phase**: 2 — Architecture
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document defines the versioning strategy for ImageForge's published npm packages and any future HTTP APIs, ensuring backward compatibility and clear communication of breaking changes.

---

## Package Versioning (npm)

ImageForge follows **Semantic Versioning 2.0.0** (semver):

```
MAJOR.MINOR.PATCH

MAJOR: Breaking change to public API
MINOR: New backward-compatible functionality
PATCH: Backward-compatible bug fix
```

### Examples

| Change                                     | Version Bump      |
| ------------------------------------------ | ----------------- |
| Remove `ProcessingEngine.applyOperation()` | 1.x.x → **2**.0.0 |
| Rename `CompressConfig.quality` field      | 1.x.x → **2**.0.0 |
| Add `ImagePipeline.executeParallel()`      | 1.0.x → 1.**1**.0 |
| Add optional `timeout` param               | 1.0.x → 1.**1**.0 |
| Fix off-by-one in resize dimensions        | 1.0.0 → 1.0.**1** |

---

## Stability Tiers

| Tier             | Mark                      | Guarantee                          | Example                      |
| ---------------- | ------------------------- | ---------------------------------- | ---------------------------- |
| **Stable**       | (none)                    | Full semver; breaking = major bump | `ImagePipeline`, `ImageFile` |
| **Experimental** | `@experimental` in JSDoc  | May change without major bump      | `createAiEnhanceOperation`   |
| **Internal**     | No export from `index.ts` | No stability guarantee             | `WasmWorkerPool` internals   |

```typescript
/**
 * @experimental — API may change in minor versions
 * @since 1.1.0
 */
export function createAiEnhanceOperation(config: AiConfig): ProcessingOperation;
```

---

## Changeset Workflow

Every PR that changes a package must include a changeset:

```bash
# Run the changeset CLI
pnpm changeset

# Select affected packages
# Select bump type: major / minor / patch
# Write a human-readable summary of the change
```

Generated changeset file (committed to repo):

```markdown
---
'@imageforge/image-core': minor
---

Add `createEnhanceOperation` factory function for brightness/contrast/saturation adjustments.
```

On release:

1. `pnpm version-packages` — bumps package.json versions, updates CHANGELOG.md
2. `pnpm release` — builds and publishes to npm

---

## Deprecation Process

Before removing an API:

1. **Mark deprecated** in JSDoc (at least one major version):

```typescript
/**
 * @deprecated Use `createCompressOperation()` instead. Will be removed in v2.0.0.
 */
export function compress(buffer: ArrayBuffer, quality: number): Promise<ArrayBuffer>;
```

2. **Log warning** at runtime:

```typescript
console.warn('[ImageForge] compress() is deprecated. Use createCompressOperation() instead.');
```

3. **Document migration path** in CHANGELOG.md and the relevant ADR

4. **Remove in next major version**

---

## Future HTTP API Versioning (Phase 3+)

If a server component is introduced (CLI, cloud processing), REST API versioning will use:

- **URL path versioning**: `/api/v1/compress`
- Breaking changes introduce `/api/v2/...`
- `/api/v1/...` maintained for minimum 12 months after `/api/v2/...` launch

---

## Related Documents

| Document                                     | Relationship       |
| -------------------------------------------- | ------------------ |
| [75-api-contracts.md](./75-api-contracts.md) | Stable API surface |
| [82-versioning.md](./82-versioning.md)       | Release versioning |
| [docs/CHANGELOG.md](../docs/CHANGELOG.md)    | Version history    |

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
