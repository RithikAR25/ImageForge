# Duplicate Finder Feature Specification

> **Document ID**: features/duplicate-finder
> **Phase**: 4 — Feature Specifications
> **Status**: Phase 3

---

## Overview

The Duplicate Finder scans imported images for visual duplicates or near-duplicates using perceptual hashing — helping users clean up their photo library before batch processing.

---

## Functional Requirements

| Requirement                    | FR     | Priority |
| ------------------------------ | ------ | -------- |
| Detect exact duplicates (hash) | FR-510 | P3       |
| Detect near-duplicates (pHash) | FR-511 | P3       |
| Group duplicates visually      | FR-512 | P3       |
| Select which to keep/delete    | FR-513 | P3       |
| Auto-keep highest resolution   | FR-514 | P3       |
| Auto-keep best quality         | FR-515 | P3       |

---

## Detection Algorithm

```typescript
// Step 1: Exact duplicate detection (MD5 of buffer)
async function detectExactDuplicates(images: ImageFile[]): Promise<Map<string, ImageFile[]>> {
  const groups = new Map<string, ImageFile[]>();

  for (const image of images) {
    const hash = await md5(image.buffer);
    const group = groups.get(hash) ?? [];
    group.push(image);
    groups.set(hash, group);
  }

  // Return only groups with 2+ images
  return new Map([...groups].filter(([, g]) => g.length > 1));
}

// Step 2: Near-duplicate detection (pHash + Hamming distance)
async function detectNearDuplicates(
  images: ImageFile[],
  threshold = 10, // Hamming distance threshold
): Promise<Map<string, ImageFile[]>> {
  const hashes: Array<{ id: string; hash: bigint }> = [];

  for (const image of images) {
    const hash = await computePHash(image.buffer); // 64-bit perceptual hash
    hashes.push({ id: image.id, hash });
  }

  const groups = new Map<string, ImageFile[]>();

  for (let i = 0; i < hashes.length; i++) {
    for (let j = i + 1; j < hashes.length; j++) {
      const distance = hammingDistance(hashes[i].hash, hashes[j].hash);
      if (distance <= threshold) {
        const key = hashes[i].id;
        const group = groups.get(key) ?? [images[i]];
        group.push(images[j]);
        groups.set(key, group);
      }
    }
  }

  return groups;
}
```

---

## Perceptual Hash Algorithm (pHash)

1. Resize image to 32×32 grayscale
2. Apply DCT (Discrete Cosine Transform) to get frequency data
3. Compute mean of top-left 8×8 DCT coefficients
4. For each coefficient: 1 if > mean, 0 if ≤ mean
5. Result: 64-bit hash

Images with ≤10 bits different are considered near-duplicates (allows for JPEG compression artifacts, minor crops, small resizes).

---

## UI

```
Found 12 duplicate groups (47 images):

Group 1 (3 images — NEAR DUPLICATE)
┌─────────┬─────────┬─────────┐
│ [img A] │ [img B] │ [img C] │
│  5MB    │  2.1MB  │  480KB  │
│ 3024×4032│1620×2160│ 640×853 │
│         │ [★Keep] │ [Delete]│ [Delete]
└─────────┴─────────┴─────────┘
★ = Auto-selected (highest resolution)

[Keep all ★ selections] [Review manually]
```

---

_Document Owner: Product Team | Status: Phase 3 | Approved: 2026-07-27_
