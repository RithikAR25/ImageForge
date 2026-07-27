# Resize Feature Specification

> **Document ID**: features/resize
> **Phase**: 4 — Feature Specifications
> **Status**: Approved

---

## Overview

The Resize feature allows users to change the dimensions of images using high-quality resampling algorithms, with social media presets and batch support.

---

## Functional Requirements

| Requirement            | FR     | Priority |
| ---------------------- | ------ | -------- |
| Resize by pixels (W/H) | FR-070 | MVP      |
| Resize by percentage   | FR-071 | MVP      |
| Maintain aspect ratio  | FR-072 | MVP      |
| Unlock aspect ratio    | FR-073 | MVP      |
| Fit mode               | FR-074 | MVP      |
| Fill mode              | FR-075 | MVP      |
| Social media presets   | FR-076 | MVP      |
| Wallpaper presets      | FR-077 | MVP      |
| Lanczos3 resampling    | FR-078 | MVP      |

---

## Social Media Presets

| Platform  | Name        | Width | Height |
| --------- | ----------- | ----- | ------ |
| Instagram | Post        | 1080  | 1080   |
| Instagram | Story       | 1080  | 1920   |
| Instagram | Landscape   | 1080  | 566    |
| Twitter/X | Post        | 1200  | 675    |
| Twitter/X | Header      | 1500  | 500    |
| Facebook  | Cover       | 820   | 312    |
| Facebook  | Post        | 1200  | 630    |
| YouTube   | Thumbnail   | 1280  | 720    |
| YouTube   | Channel Art | 2560  | 1440   |
| TikTok    | Video Cover | 1080  | 1920   |
| LinkedIn  | Post        | 1200  | 627    |
| LinkedIn  | Cover       | 1584  | 396    |
| Pinterest | Pin         | 1000  | 1500   |

---

## Wallpaper Presets

| Name            | Width | Height |
| --------------- | ----- | ------ |
| HD              | 1920  | 1080   |
| QHD             | 2560  | 1440   |
| 4K              | 3840  | 2160   |
| iPhone 15       | 1179  | 2556   |
| iPhone 15 Plus  | 1290  | 2796   |
| iPad Pro 12.9"  | 2048  | 2732   |
| MacBook Pro 16" | 3456  | 2234   |

---

## Resize Modes

| Mode        | Behavior                                                               |
| ----------- | ---------------------------------------------------------------------- |
| **Fit**     | Image fits within bounds; may have empty space (background color fill) |
| **Fill**    | Image fills bounds; may crop edges                                     |
| **Stretch** | Image stretched to exact dimensions (distorts)                         |
| **Cover**   | Same as Fill                                                           |
| **Contain** | Same as Fit                                                            |

---

## Resampling Algorithms

| Algorithm | Use Case                           | Quality |
| --------- | ---------------------------------- | ------- |
| Lanczos3  | High quality downscale (default)   | ★★★★★   |
| Bicubic   | Balanced quality/speed             | ★★★★☆   |
| Bilinear  | Fast, acceptable for small changes | ★★★☆☆   |
| Nearest   | Pixel art, no aliasing             | ★★☆☆☆   |

Default: **Lanczos3** for downscaling, **Bicubic** for upscaling.

---

## Performance Target

| Input      | Operation | Target  |
| ---------- | --------- | ------- |
| 12MP → 50% | Downscale | ≤ 800ms |
| 1MP → 200% | Upscale   | ≤ 500ms |

---

_Document Owner: Architecture & Product | Approved: 2026-07-27_
