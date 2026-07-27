# Filters Feature Specification

> **Document ID**: features/filters
> **Phase**: 4 — Feature Specifications
> **Status**: Phase 2

---

## Overview

The Filters feature provides a curated collection of photographic filters — instant visual transformations applied in real-time using LUT (Look-Up Table) technology for consistent, high-quality results.

---

## Functional Requirements

| Requirement             | FR     | Priority |
| ----------------------- | ------ | -------- |
| Apply LUT-based filter  | FR-320 | P2       |
| Filter intensity slider | FR-321 | P2       |
| Filter preview grid     | FR-322 | P2       |
| Before/after toggle     | FR-323 | P2       |
| Favorite filters        | FR-324 | P2       |
| Custom LUT import       | FR-325 | P3       |

---

## Filter Library (Phase 2 — 20 Filters)

### Vintage Series

| Filter     | Description                                   |
| ---------- | --------------------------------------------- |
| Kodachrome | Warm, slightly desaturated; classic film look |
| Polaroid   | Faded, low contrast, warm highlights          |
| Film Noir  | High contrast monochrome                      |
| Lomography | Vignette + color cross-processing             |
| 1970s Fade | Warm orange tones, lifted blacks              |

### Modern Series

| Filter      | Description                           |
| ----------- | ------------------------------------- |
| Matte       | Lifted blacks, desaturated, cinematic |
| Cool Fade   | Desaturated cool tones, light leak    |
| Golden Hour | Warm orange-gold tones                |
| Cyberpunk   | Teal/magenta split tone               |
| Noir        | Dark, moody, blue shadows             |

### Portrait Series

| Filter     | Description                           |
| ---------- | ------------------------------------- |
| Soft Light | Gentle glow, slight skin smoothing    |
| Fade       | High-key, airy, fashion-style         |
| Warm Skin  | Orange/red boost for warm skin tones  |
| Studio     | Neutral, clean, slight contrast boost |

### Nature Series

| Filter    | Description                |
| --------- | -------------------------- |
| Vivid     | Saturated, punchy colors   |
| Forest    | Cool greens, deep shadows  |
| Beach     | Warm, turquoise highlights |
| Sunset    | Orange-pink gradient       |
| Overcast  | Muted, grey, flat          |
| Moonlight | Cool blue, high contrast   |

---

## LUT Implementation

```typescript
interface FilterConfig {
  filterId: string; // e.g., 'kodachrome'
  intensity: number; // 0-100 (100 = full filter strength)
}

// LUT is a 64x64x64 3D color table stored as a .cube file
// Applied via: libvips hald-clut operation

async function applyFilter(buffer: ArrayBuffer, config: FilterConfig): Promise<ArrayBuffer> {
  const lut = await loadLut(config.filterId); // Lazy-load .cube file
  const image = vips.Image.newFromBuffer(buffer);
  const lutImage = vips.Image.newFromBuffer(lut);

  // Interpolate at intensity
  const filtered = image.histLookup(lutImage);
  const blended = image
    .linear([1 - config.intensity / 100], [0])
    .add(filtered.linear([config.intensity / 100], [0]));

  return blended.writeToBuffer('.jpg');
}
```

---

## Filter Preview Grid

```
┌─────┬─────┬─────┬─────┐
│ Ori │Koda │Pola │Noir │  ← Thumbnail grid
│ginal│chrome│roid │     │
├─────┼─────┼─────┼─────┤
│Matte│Vivid│Warm │Gold │
│     │     │Skin │Hour │
└─────┴─────┴─────┴─────┘
        ━━━━●━━━━
         Intensity: 80
```

---

_Document Owner: Product Team | Status: Phase 2 | Approved: 2026-07-27_
