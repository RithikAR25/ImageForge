# Design Token System

> **Document ID**: 51-design-tokens
> **Phase**: 3 — UI/UX
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Design & Architecture Team

---

## Executive Summary

ImageForge uses a **Four-Layer Design Token Architecture** to ensure UI consistency across Web, iOS, and Android platforms. The design language, **"Emerald & Amber Executive"**, is characterized by high-contrast modernism, deep slate backgrounds, and vibrant functional accents.

This token system is platform-agnostic. It is implemented in `@imageforge/types` (contracts) and `@imageforge/ui` (runtime), and applies equally to React Native and React web clients.

---

## The Four-Layer Architecture

We strictly enforce a layered token taxonomy.

| Layer | Name          | Description                                                                           | Example                  |
| ----- | ------------- | ------------------------------------------------------------------------------------- | ------------------------ |
| **1** | **Primitive** | Raw aesthetic values (hex codes, strict numbers). **Never used directly in UI code.** | `emerald.500: '#10b981'` |
| **2** | **Semantic**  | Meaningful aliases mapping to primitives based on intent.                             | `color.primary.main`     |
| **3** | **Component** | Specific overrides for complex components (maps to Semantic).                         | `button.primary.bg`      |
| **4** | **Screen**    | Screen-level layout overrides (maps to Component or Semantic).                        | `editor.sidebar.bg`      |

> [!CAUTION]
> **Never Use Guidance**
>
> - **Never** use hardcoded hex values in component files (e.g., `color: '#10b981'`).
> - **Never** use primitive tokens directly in components (e.g., `backgroundColor: theme.color.emerald[500]`).
> - **Never** hardcode spacing or typography strings (e.g., `padding: 16`, `fontSize: 14`).
> - **Always** map through the Semantic layer (e.g., `theme.color.primary`, `theme.spacing.md`).

---

## 1. Color Tokens

The palette strips away blue-spectrum hues for strict slates, emeralds, and warm amber highlights.

### Layer 1: Primitive Palette (Reference Only)

_These are not exposed to the component layer._

- **Emerald (Brand/Success):** `100: '#6ffbbe'`, `300: '#4edea3'`, `500: '#10b981'`, `700: '#006c49'`, `900: '#003824'`
- **Amber (Warning/Accent):** `100: '#ffdcbe'`, `300: '#ffb871'`, `500: '#e88d1e'`, `700: '#6a3c00'`, `900: '#4a2800'`
- **Slate (Neutral/Background):** `50: '#F0F6FC'`, `200: '#c1c7cd'`, `400: '#86948a'`, `600: '#3c4a42'`, `800: '#151b2d'`, `900: '#0c1324'`, `950: '#070d1f'`
- **Crimson (Error):** `300: '#ffb4ab'`, `500: '#ffdad6'`, `700: '#93000a'`, `900: '#690005'`

### Layer 2: Semantic Tokens (Exposed via `useTheme`)

| Token Category | Token Path                      | Value / Target | Notes                        |
| -------------- | ------------------------------- | -------------- | ---------------------------- |
| **Surface**    | `theme.color.surface.lowest`    | `#070d1f`      | App background               |
|                | `theme.color.surface.low`       | `#151b2d`      | Standard containers          |
|                | `theme.color.surface.default`   | `#191f31`      | Elevated cards               |
|                | `theme.color.surface.high`      | `#23293c`      | Dialogs, Modals              |
|                | `theme.color.surface.highest`   | `#2e3447`      | Tooltips, Popovers           |
|                | `theme.color.surface.on`        | `#dce1fb`      | Text on surface              |
| **Primary**    | `theme.color.primary.main`      | `#4edea3`      | Primary interactive elements |
|                | `theme.color.primary.container` | `#10b981`      | Heavy primary elements       |
|                | `theme.color.primary.on`        | `#003824`      | Text on primary              |
| **Secondary**  | `theme.color.secondary.main`    | `#c1c7cd`      | Secondary actions / silver   |
|                | `theme.color.secondary.on`      | `#2b3136`      | Text on secondary            |
| **Tertiary**   | `theme.color.tertiary.main`     | `#ffb871`      | Warm amber accents           |
|                | `theme.color.tertiary.on`       | `#4a2800`      | Text on tertiary             |
| **Error**      | `theme.color.error.main`        | `#ffb4ab`      | Destructive actions          |
|                | `theme.color.error.on`          | `#690005`      | Text on error                |
| **Outline**    | `theme.color.outline.default`   | `#86948a`      | Form borders                 |
|                | `theme.color.outline.variant`   | `#3c4a42`      | Subtle dividers              |

---

## 2. Typography

We use **Hanken Grotesk** for high-impact display and labels, and **Inter** for readable body text.
_(React Native automatically maps `fontWeight` strings to the loaded font file variations)._

| Semantic Token       | Family         | Size (px) | Weight | Line Height | Tracking |
| -------------------- | -------------- | --------- | ------ | ----------- | -------- |
| `headline.xl`        | Hanken Grotesk | 48        | 700    | 1.1         | -0.02em  |
| `headline.lg`        | Hanken Grotesk | 32        | 600    | 1.2         | -0.01em  |
| `headline.lg.mobile` | Hanken Grotesk | 24        | 600    | 1.2         | 0        |
| `body.md`            | Inter          | 16        | 400    | 1.6         | 0        |
| `label.sm`           | Hanken Grotesk | 12        | 600    | 1.0         | 0.05em   |

---

## 3. Spacing & Layout

Built on an **8px base unit**. The grid is 12-column on desktop and 4-column on mobile.

| Semantic Token         | Value (px) | Usage Example                          |
| ---------------------- | ---------- | -------------------------------------- |
| `theme.spacing.xs`     | 4          | Inner component spacing (icon to text) |
| `theme.spacing.base`   | 8          | Standard gap                           |
| `theme.spacing.sm`     | 12         | Small padding                          |
| `theme.spacing.md`     | 24         | Default padding, Layout gutters        |
| `theme.spacing.lg`     | 48         | Section separation                     |
| `theme.spacing.xl`     | 80         | Major page sections                    |
| `theme.spacing.margin` | 32         | Desktop outer page margin              |

---

## 4. Radii / Shapes

Soft (Level 1) geometry. Sharp enough to feel precise and engineered.

| Semantic Token          | Value (px) | Usage Example              |
| ----------------------- | ---------- | -------------------------- |
| `theme.rounded.sm`      | 2          | Small badges               |
| `theme.rounded.default` | 4          | Buttons, Inputs            |
| `theme.rounded.md`      | 6          | Small cards                |
| `theme.rounded.lg`      | 8          | Standard Cards, Containers |
| `theme.rounded.xl`      | 12         | Modals, Large Sections     |
| `theme.rounded.full`    | 9999       | Circular avatars, pills    |

---

## 5. Elevation & Depth

In a monochrome dark theme, depth is established through **Tonal Layering** and **Low-Contrast Outlines**.

| Elevation Level            | Background Token  | Border Token            | Shadow/Overlay                |
| -------------------------- | ----------------- | ----------------------- | ----------------------------- |
| **Level 0 (Root)**         | `surface.lowest`  | None                    | None                          |
| **Level 1 (Card)**         | `surface.low`     | `outline.variant` (1px) | None                          |
| **Level 2 (Active/Focus)** | `surface.default` | `primary.main` (1px)    | None                          |
| **Level 3 (Dropdown)**     | `surface.high`    | `outline.default` (1px) | None                          |
| **Level 4 (Modal)**        | `surface.highest` | None                    | `rgba(0,0,0,0.5)` drop shadow |

> [!TIP]
> Avoid heavy drop shadows on lower elevations. Tonal layering (background color shifts) provides a cleaner aesthetic on dark modes.

---

## 6. Interaction States

Interactive elements automatically apply these state overlays relative to their base semantic color:

| State        | Visual Shift                         | Example                      |
| ------------ | ------------------------------------ | ---------------------------- |
| **Hover**    | 12% Opacity White Overlay            | Background lightens slightly |
| **Pressed**  | 10% Opacity Black Overlay            | Background darkens slightly  |
| **Focused**  | 2px Solid Ring (`primary.main`)      | Focus ring outside component |
| **Disabled** | 38% Opacity on Content, Base Surface | `surface.low` bg, muted text |

---

## 7. Motion

Micro-animations drive the "high-performance utility" feel. All durations are snappy.

| Token                  | Duration | Easing (Cubic Bezier) | Use Case                          |
| ---------------------- | -------- | --------------------- | --------------------------------- |
| `theme.motion.fast`    | 150ms    | `(0.4, 0.0, 0.2, 1)`  | Hover states, color shifts        |
| `theme.motion.default` | 250ms    | `(0.4, 0.0, 0.2, 1)`  | Drawer slides, modal opens        |
| `theme.motion.slow`    | 350ms    | `(0.0, 0.0, 0.2, 1)`  | Page transitions, complex layouts |

---

_Document Owner: Design Team | Approved: 2026-07-27_
