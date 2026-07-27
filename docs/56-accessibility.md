# Accessibility

> **Document ID**: 56
> **Phase**: 3 — UI/UX Design
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Design Team

---

## Purpose

This document defines the accessibility standards, implementation guidelines, and testing requirements for ImageForge. Accessibility is a non-negotiable quality requirement (WCAG 2.1 AA).

---

## Target Standard

**WCAG 2.1 Level AA** across all platforms.

---

## Perceivable

### 1.1.1 Non-text Content

All images, icons, and non-text elements have text alternatives.

```typescript
// Icons must always have accessible labels
<Icon name="compress" accessibilityLabel="Compress image" />

// Decorative images use empty label
<Image accessibilityLabel="" />

// Thumbnails describe content
<Image accessibilityLabel={`Thumbnail of ${filename}`} />
```

### 1.4.3 Contrast Minimum

All text must meet 4.5:1 contrast ratio (3:1 for large text ≥18pt/14pt bold).

Design token compliance:

- `text.primary` on `background.default`: 15.3:1 (dark on white) — PASS
- `text.secondary` on `background.default`: 5.1:1 — PASS
- Brand primary on white: 4.6:1 — PASS

### 1.4.11 Non-text Contrast

UI components (buttons, inputs, focus indicators) meet 3:1 against adjacent colors.

### 1.4.4 Resize Text

Text must reflow at 200% zoom without content cutoff or horizontal scrolling.

### 1.4.5 Images of Text

No text is rendered as an image. All text is live text.

---

## Operable

### 2.1.1 Keyboard

All functionality operable by keyboard. Keyboard shortcuts:

| Action          | Web Shortcut |
| --------------- | ------------ |
| Upload image    | Ctrl+O       |
| Undo            | Ctrl+Z       |
| Redo            | Ctrl+Y       |
| Download/Export | Ctrl+S       |
| Compress        | Ctrl+1       |
| Resize          | Ctrl+2       |
| Crop            | Ctrl+3       |
| Paste image     | Ctrl+V       |

### 2.4.7 Focus Visible

All focused elements have a clear focus ring:

```typescript
// Focus ring style applied to all interactive components
const focusStyle = StyleSheet.create({
  focused: {
    outline: `2px solid ${colors.brand.primary}`,
    outlineOffset: 2,
    // React Native: box shadow simulation
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
    shadowOpacity: 1,
  },
});
```

### 2.4.3 Focus Order

Tab order follows visual reading order (left to right, top to bottom). No focus traps outside modals.

Modals trap focus correctly:

- Focus moves to modal on open
- Tab cycles within modal
- Focus returns to trigger on close

---

## Understandable

### 3.3.1 Error Identification

Errors identified in text, not color alone.

```typescript
// Bad: color only
<TextInput style={{ borderColor: hasError ? 'red' : 'gray' }} />

// Good: color + icon + text
<TextInput style={{ borderColor: hasError ? colors.status.error : colors.border.default }} />
{hasError && (
  <ErrorMessage icon="⚠️" message={errorText} />
)}
```

### 3.3.2 Labels or Instructions

All form inputs have visible labels.

```typescript
<FormField
  label="JPEG Quality"
  description="Higher values = better quality, larger file size"
  htmlFor="quality-input"
>
  <Slider id="quality-input" accessibilityLabel="JPEG Quality" ... />
</FormField>
```

---

## Robust

### 4.1.2 Name, Role, Value

All UI components communicate their accessible name, role, and state.

```typescript
// Slider: role, current value, min, max
<Slider
  accessibilityRole="adjustable"
  accessibilityLabel="Compression quality"
  accessibilityValue={{
    min: 1, max: 100, now: quality,
    text: `${quality}% quality`
  }}
/>

// Toggle: role, state
<Checkbox
  accessibilityRole="checkbox"
  accessibilityLabel="Strip metadata on export"
  accessibilityState={{ checked: stripMetadata }}
/>
```

---

## Mobile Accessibility

### iOS VoiceOver

- All `accessibilityLabel` props set
- `accessibilityHint` for non-obvious actions
- `accessibilityRole` for semantic meaning
- `importantForAccessibility="no"` for decorative elements

### Android TalkBack

- Same props work via React Native's accessibility bridge
- Content descriptions set on all views

### Dynamic Type (iOS) / Font Size (Android)

All font sizes use scalable units that respect system preferences:

```typescript
// React Native: fonts scale with system settings automatically
// unless explicitly disabled (which we never do)
const styles = StyleSheet.create({
  body: { fontSize: 16 }, // Scales with system font size
});
```

---

## Testing Requirements

| Test Type                | Tool                     | Frequency   |
| ------------------------ | ------------------------ | ----------- |
| Automated color contrast | `axe-core` in Playwright | Per PR      |
| Automated ARIA checks    | `axe-core`               | Per PR      |
| Keyboard navigation      | Manual + Playwright      | Per sprint  |
| Screen reader (iOS)      | VoiceOver (manual)       | Per release |
| Screen reader (Android)  | TalkBack (manual)        | Per release |
| Screen reader (Web)      | NVDA + Chrome (manual)   | Per release |
| Zoom / Large text        | Manual                   | Per release |

---

## Related Documents

| Document                                                                 | Relationship                |
| ------------------------------------------------------------------------ | --------------------------- |
| [06-non-functional-requirements.md](./06-non-functional-requirements.md) | NFR-A-001 through A-004     |
| [50-design-system.md](./50-design-system.md)                             | Color contrast tokens       |
| [51-component-library.md](./51-component-library.md)                     | Accessibility per component |

---

_Document Owner: Design Team | Review Cycle: Per-release | Approved: 2026-07-27_
