# GIF Creator Feature Specification

> **Document ID**: features/gif
> **Phase**: 4 — Feature Specifications
> **Status**: Phase 3

---

## Overview

The GIF Creator feature allows users to convert a sequence of images into an animated GIF — with control over frame order, timing, quality, and dimensions.

---

## Functional Requirements

| Requirement                           | FR     | Priority |
| ------------------------------------- | ------ | -------- |
| Create GIF from image sequence        | FR-450 | P3       |
| Frame order control (drag to reorder) | FR-451 | P3       |
| Per-frame delay control               | FR-452 | P3       |
| Global FPS setting                    | FR-453 | P3       |
| Resize GIF                            | FR-454 | P3       |
| Loop count (infinite / N times)       | FR-455 | P3       |
| GIF quality / color palette           | FR-456 | P3       |
| Preview before export                 | FR-457 | P3       |
| Video → GIF (Phase 4)                 | FR-458 | P4       |

---

## Implementation

GIF encoding uses `ffmpeg.wasm`:

```typescript
interface GifConfig {
  frames: GifFrame[];
  width?: number;       // Resize output
  height?: number;
  fps: number;          // Default: 15
  loops: number;        // 0 = infinite
  quality: number;      // Palette dithering quality (1-10)
}

interface GifFrame {
  imageId: string;
  delay: number;        // Frame duration in milliseconds
}

async function createGif(config: GifConfig): Promise<ArrayBuffer> {
  const ffmpeg = await getFFmpegInstance();

  // Write each frame to ffmpeg's virtual filesystem
  for (let i = 0; i < config.frames.length; i++) {
    const frame = config.frames[i];
    const imageBuffer = await getImageBuffer(frame.imageId);
    ffmpeg.FS('writeFile', `frame${i:03d}.png`, new Uint8Array(imageBuffer));
  }

  // Build ffmpeg command
  await ffmpeg.run(
    '-framerate', String(config.fps),
    '-i', 'frame%03d.png',
    '-vf', `scale=${config.width ?? -1}:${config.height ?? -1},split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
    '-loop', String(config.loops),
    'output.gif'
  );

  return ffmpeg.FS('readFile', 'output.gif').buffer;
}
```

---

## Frame Sequencer UI

```
┌──────────────────────────────────────┐
│  GIF Creator                         │
├──────────────────────────────────────┤
│  [img1] [img2] [img3] [img4] [+Add] │  ← Reorderable frames
│  ←→drag to reorder                  │
├──────────────────────────────────────┤
│  Selected frame delay: [200] ms      │
│  Apply to all: [ 100 ] ms            │
├──────────────────────────────────────┤
│  FPS: [15]  Width: [480]  Loops: [∞]│
├──────────────────────────────────────┤
│  [▶ Preview]        [↓ Download GIF] │
└──────────────────────────────────────┘
```

---

_Document Owner: Product Team | Status: Phase 3 | Approved: 2026-07-27_
