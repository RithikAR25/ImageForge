# Design Tokens Reference

> **Document ID**: 59
> **Phase**: 3 — UI/UX Design
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Design Team

---

## Purpose

This document is the complete reference for all design tokens in ImageForge. It is the single source of truth that bridges design and code.

---

## Color Tokens

### Brand Colors

| Token                 | Light Value | Dark Value | Usage                          |
| --------------------- | ----------- | ---------- | ------------------------------ |
| `brand.primary`       | `#6C63FF`   | `#8B85FF`  | CTAs, links, focus rings       |
| `brand.primaryHover`  | `#5B53EE`   | `#9D98FF`  | Hover state of primary         |
| `brand.primaryActive` | `#4A43DD`   | `#7B75EE`  | Active/pressed state           |
| `brand.secondary`     | `#FF6584`   | `#FF8099`  | Badges, alerts, accents        |
| `brand.tertiary`      | `#43E7D8`   | `#5DE9D9`  | Success, processing indicators |

### Background Colors

| Token                 | Light     | Dark      | Usage               |
| --------------------- | --------- | --------- | ------------------- |
| `background.default`  | `#FFFFFF` | `#0A0A0F` | Page background     |
| `background.subtle`   | `#F8F9FA` | `#12121A` | Section backgrounds |
| `background.muted`    | `#F1F3F5` | `#1A1A26` | Card backgrounds    |
| `background.emphasis` | `#E9ECEF` | `#22222F` | Selected states     |

### Text Colors

| Token            | Light     | Dark      | Contrast (Light) |
| ---------------- | --------- | --------- | ---------------- |
| `text.primary`   | `#0D0D0F` | `#F2F2F7` | 18.1:1           |
| `text.secondary` | `#4A4A5A` | `#A0A0B8` | 7.2:1            |
| `text.tertiary`  | `#8C8CA1` | `#6B6B84` | 4.6:1            |
| `text.accent`    | `#6C63FF` | `#8B85FF` | 4.6:1            |
| `text.inverse`   | `#FFFFFF` | `#0A0A0F` | On brand colors  |

---

## Typography Tokens

| Token        | Font           | Size | Line Height | Weight |
| ------------ | -------------- | ---- | ----------- | ------ |
| `display.xl` | Inter          | 48px | 56px        | 700    |
| `display.lg` | Inter          | 36px | 44px        | 700    |
| `heading.h1` | Inter          | 28px | 36px        | 700    |
| `heading.h2` | Inter          | 22px | 30px        | 600    |
| `heading.h3` | Inter          | 18px | 26px        | 600    |
| `heading.h4` | Inter          | 16px | 24px        | 600    |
| `body.lg`    | Inter          | 16px | 24px        | 400    |
| `body.md`    | Inter          | 14px | 22px        | 400    |
| `body.sm`    | Inter          | 12px | 18px        | 400    |
| `label.lg`   | Inter          | 14px | 20px        | 500    |
| `label.md`   | Inter          | 12px | 16px        | 500    |
| `code.md`    | JetBrains Mono | 13px | 20px        | 400    |

---

## Spacing Tokens (8pt Grid)

| Token          | Value (px) | Usage            |
| -------------- | ---------- | ---------------- |
| `spacing.px`   | 1          | Hairline borders |
| `spacing[0.5]` | 4          | Icon gap         |
| `spacing[1]`   | 8          | Tight spacing    |
| `spacing[1.5]` | 12         | Form element gap |
| `spacing[2]`   | 16         | Standard padding |
| `spacing[2.5]` | 20         | Medium gap       |
| `spacing[3]`   | 24         | Section padding  |
| `spacing[4]`   | 32         | Large gap        |
| `spacing[5]`   | 40         | Extra large      |
| `spacing[6]`   | 48         | Hero padding     |
| `spacing[8]`   | 64         | Page section     |
| `spacing[10]`  | 80         | Hero height      |
| `spacing[12]`  | 96         | Illustration     |
| `spacing[16]`  | 128        | Full-bleed       |

---

## Border Radius Tokens

| Token          | Value  | Usage                  |
| -------------- | ------ | ---------------------- |
| `radii.none`   | 0      | No rounding            |
| `radii.sm`     | 4px    | Badges, chips          |
| `radii.md`     | 8px    | Buttons, inputs, cards |
| `radii.lg`     | 12px   | Larger cards           |
| `radii.xl`     | 16px   | Panels                 |
| `radii['2xl']` | 24px   | Modals                 |
| `radii.full`   | 9999px | Pills, avatars         |

---

## Animation Duration Tokens

| Token                        | Value | Usage                |
| ---------------------------- | ----- | -------------------- |
| `animation.duration.instant` | 0ms   | No animation         |
| `animation.duration.fast`    | 100ms | Micro-interactions   |
| `animation.duration.normal`  | 200ms | Standard transitions |
| `animation.duration.slow`    | 350ms | Modals, panels       |
| `animation.duration.slower`  | 500ms | Page transitions     |

---

## Z-Index Scale

| Token             | Value | Usage               |
| ----------------- | ----- | ------------------- |
| `zIndex.base`     | 0     | Normal content      |
| `zIndex.raised`   | 10    | Cards, hover states |
| `zIndex.dropdown` | 100   | Dropdown menus      |
| `zIndex.sticky`   | 200   | Sticky headers      |
| `zIndex.modal`    | 300   | Modal overlays      |
| `zIndex.toast`    | 400   | Toast notifications |
| `zIndex.tooltip`  | 500   | Tooltips            |

---

_Document Owner: Design Team | Review Cycle: Per-major-version | Approved: 2026-07-27_
