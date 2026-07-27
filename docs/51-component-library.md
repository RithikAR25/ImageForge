# Component Library

> **Document ID**: 51
> **Phase**: 3 — UI/UX Design
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Design Team

---

## Purpose

This document defines the shared component library for ImageForge — the building blocks used across all screens on Web, Android, and iOS.

---

## Component Hierarchy

```
packages/ui/
├── primitives/          ← Atoms (basic elements)
│   ├── Button/
│   ├── Text/
│   ├── Icon/
│   ├── Badge/
│   ├── Spinner/
│   ├── Divider/
│   └── Input/
│
├── components/          ← Molecules (composed from primitives)
│   ├── Card/
│   ├── Toast/
│   ├── Modal/
│   ├── Slider/
│   ├── ProgressBar/
│   ├── Tooltip/
│   ├── TagList/
│   ├── Checkbox/
│   └── DropdownMenu/
│
├── feature/             ← Organisms (domain-specific)
│   ├── ImageThumbnail/
│   ├── QueueItem/
│   ├── BeforeAfterSlider/
│   ├── DropZone/
│   ├── PipelineBuilder/
│   ├── HistoryPanel/
│   ├── MetadataPanel/
│   └── ExportModal/
│
└── screens/             ← Pages (assembled from components)
    ├── HomeScreen/
    ├── CompressScreen/
    ├── ResizeScreen/
    ├── CropScreen/
    ├── BatchScreen/
    └── SettingsScreen/
```

---

## Primitive Components

### Button

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  accessibilityLabel?: string;
}
```

Visual variants:

- **primary**: Filled brand-color background — main CTAs
- **secondary**: Subtle background — secondary actions
- **ghost**: No background, text only — tertiary actions
- **danger**: Red — destructive actions (delete, clear)
- **outline**: Border + text — alternative to secondary

### Slider

```typescript
interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  label?: string;
  showValue?: boolean;
  formatValue?: (v: number) => string;
  disabled?: boolean;
  accessibilityLabel: string;
}
```

Custom implementation using `react-native-gesture-handler` + Reanimated for smooth 60fps on all platforms.

### BeforeAfterSlider

Domain-specific organism for the before/after preview:

```typescript
interface BeforeAfterSliderProps {
  beforeImage: ImageSource;
  afterImage: ImageSource;
  initialPosition?: number; // 0-1, default 0.5
}
```

Drag the divider to reveal before/after. Uses Skia Canvas for pixel-perfect rendering.

---

## DropZone (Web Only)

```typescript
// packages/ui/src/components/DropZone/DropZone.web.tsx
interface DropZoneProps {
  onFilesDropped: (files: File[]) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  children?: React.ReactNode;
}
```

Handles: drag over, drag leave, drop events. Shows visual feedback (border highlight) on drag over.

Mobile equivalent: `DropZone.native.tsx` renders a gallery import button with the same API.

---

## QueueItem Component

```typescript
interface QueueItemProps {
  job: BatchJob;
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
}
```

Displays: thumbnail, filename, status badge, progress bar, error message, action buttons.

Status badge colors:

- **pending** → gray
- **processing** → blue (animated pulse)
- **completed** → green
- **failed** → red (with retry button)
- **cancelled** → gray (strikethrough)

---

## Toast System

```typescript
interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  action?: { label: string; onClick: () => void };
  duration?: number; // ms, default 5000, 0 = persistent
  persistent?: boolean;
}
```

Toasts appear at the top-right (web) or bottom (mobile) of the screen. Auto-dismiss with duration countdown.

---

## Accessibility Requirements

All components must:

- Have `accessibilityLabel` on all interactive elements
- Support keyboard navigation (focus, Enter, Space, Escape)
- Have visible focus indicators
- Meet 4.5:1 contrast ratio for text
- Have `accessibilityRole` set appropriately
- Have `accessibilityState` for loading, disabled, selected states

---

## Component Documentation Standard

Every component must have:

```typescript
/**
 * Button — Primary interactive element
 *
 * @example
 * <Button variant="primary" size="md" onPress={() => console.log('pressed')}>
 *   Compress Image
 * </Button>
 *
 * @accessibility Role: button. Supports keyboard activation (Enter/Space).
 */
```

---

## Related Documents

| Document                                     | Relationship               |
| -------------------------------------------- | -------------------------- |
| [50-design-system.md](./50-design-system.md) | Design tokens used         |
| [56-accessibility.md](./56-accessibility.md) | Accessibility requirements |
| [53-screen-flow.md](./53-screen-flow.md)     | Components used per screen |

---

_Document Owner: Design Team | Approved: 2026-07-27_
