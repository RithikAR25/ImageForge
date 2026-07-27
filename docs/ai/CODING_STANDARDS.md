# AI Coding Standards

> **Document ID**: ai/CODING_STANDARDS
> **Phase**: AI Development
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

Quick-reference coding standards for AI assistants generating code for ImageForge. These are the most critical rules to follow.

---

## TypeScript Checklist

```typescript
// ✅ DO: Strict types
function compress(image: ImageFile, config: CompressConfig): Promise<ImageFile>

// ✅ DO: Discriminated unions for operations
type Op = { type: 'compress'; config: CompressConfig }
        | { type: 'resize'; config: ResizeConfig }

// ✅ DO: Readonly domain objects
interface ImageFile { readonly id: string; readonly buffer: ArrayBuffer }

// ✅ DO: unknown in catch
catch (err: unknown) { if (err instanceof Error) ... }

// ❌ DON'T: any
function process(image: any): any

// ❌ DON'T: non-null assertion without check
const result = maybeNull!.value

// ❌ DON'T: type alias for object shapes
type ImageFile = { id: string }  // use interface instead
```

---

## React Native Checklist

```typescript
// ✅ DO: StyleSheet.create
const styles = StyleSheet.create({ container: { flex: 1 } })

// ✅ DO: Design tokens
const { colors } = useTheme()
<View style={{ backgroundColor: colors.background.default }} />

// ✅ DO: accessibilityLabel on all interactive elements
<Pressable accessibilityLabel="Compress image" accessibilityRole="button" />

// ❌ DON'T: inline styles
<View style={{ flex: 1, backgroundColor: '#fff' }} />

// ❌ DON'T: raw hex colors
<View style={{ color: '#6C63FF' }} />
```

---

## Package Boundary Checklist

```typescript
// packages/image-core, packages/shared, packages/types:

// ✅ DO: Pure TypeScript, no React
import { ImageFile } from '@imageforge/types';

// ❌ DON'T: React Native imports
import { Platform } from 'react-native';

// ❌ DON'T: Browser APIs
(window.localStorage, document.createElement);

// ❌ DON'T: Node APIs
(fs.readFileSync, path.join);
```

---

## Error Handling Checklist

```typescript
// ✅ DO: Typed errors
throw new ProcessingError('ENCODE_FAILED', 'JPEG encoding failed', originalError)

// ✅ DO: Log before throwing
logger.error('Compress failed', err, { fileSize: image.fileSize })
throw new ProcessingError(...)

// ✅ DO: AbortSignal in all async operations
async function op(image: ImageFile, signal?: AbortSignal): Promise<ImageFile> {
  signal?.throwIfAborted()
  ...
}

// ❌ DON'T: Silent catch
} catch { }

// ❌ DON'T: Generic Error
throw new Error('Something went wrong')
```

---

## Test Checklist (Vitest)

```typescript
// ✅ DO: Descriptive test names
it('should achieve ±10% of target file size for JPEG adaptive compression');

// ✅ DO: Test error cases
it('should throw ProcessingError for invalid quality (< 1 or > 100)');

// ✅ DO: Test abort
it('should throw ABORTED error when signal is already aborted');

// ❌ DON'T: Only test the happy path
it('should compress'); // too vague, no edge cases
```

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
