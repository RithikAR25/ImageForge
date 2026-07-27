# Component Architecture

> **Document ID**: 24
> **Phase**: 2 — Architecture
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document defines the component architecture for the ImageForge UI layer — the structure, patterns, and relationships between UI components across Web and Mobile.

---

## Component Design Principles

1. **Atomic Design**: Primitives → Components → Feature components → Screens
2. **Single responsibility**: Each component does one thing well
3. **Prop-driven**: Components accept data as props; no direct store access (except container components)
4. **Accessible by default**: Every component ships with correct `accessibilityRole`, `accessibilityLabel`
5. **Platform-adaptive**: Use `.web.tsx` / `.native.tsx` only when necessary; prefer `Platform.select`

---

## Component Layers

```
Layer 4: Screens (assembled pages)
    HomeScreen, CompressScreen, BatchScreen, SettingsScreen
         ↑ compose
Layer 3: Feature Components (domain-specific organisms)
    ImageThumbnail, QueueItem, BeforeAfterSlider, DropZone, PipelineBuilder
         ↑ compose
Layer 2: Components (molecules)
    Slider, ProgressBar, Modal, Toast, Card, TagList, DropdownMenu
         ↑ compose
Layer 1: Primitives (atoms)
    Button, Text, Icon, Input, Badge, Spinner, Divider
```

---

## Container vs. Presentational Components

### Presentational (Pure)

- Receive all data via props
- Emit events via callbacks
- No direct store access
- Easily testable and reusable

```typescript
// Presentational: no store access
interface QueueItemProps {
  job: BatchJob;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}

function QueueItem({ job, onRemove, onRetry }: QueueItemProps) {
  return (/* JSX */);
}
```

### Container Components (Smart)

- Access stores and hooks
- Derive data and callbacks
- Pass to presentational children

```typescript
// Container: accesses store
function QueueItemContainer({ jobId }: { jobId: string }) {
  const job = useQueueStore(s => s.jobs.get(jobId));
  const { removeJob, retryJob } = useQueueStore();

  if (!job) return null;
  return (
    <QueueItem
      job={job}
      onRemove={removeJob}
      onRetry={retryJob}
    />
  );
}
```

---

## Screen Layout Pattern

Every screen follows this structure:

```typescript
function CompressScreen() {
  return (
    <ScreenContainer>        {/* Safe area, keyboard, scroll */}
      <ScreenHeader          {/* Back button, title, actions */}
        title="Compress"
        rightAction={<HelpButton />}
      />
      <ScreenContent>        {/* Scrollable main content */}
        <ImagePreviewPanel />
        <CompressControls />
      </ScreenContent>
      <ScreenFooter>         {/* CTA buttons */}
        <ExportButton />
      </ScreenFooter>
    </ScreenContainer>
  );
}
```

---

## Component Prop Patterns

### Controlled vs. Uncontrolled

Always prefer **controlled** components with explicit `value` + `onChange`:

```typescript
// ✅ Controlled (preferred)
<Slider
  value={quality}
  onChange={setQuality}
  min={1} max={100}
/>

// ❌ Uncontrolled (avoid)
<Slider defaultValue={85} />
```

### Event Naming

```typescript
onPress; // Tap/click (React Native convention)
onChange; // Value changes
onSubmit; // Form submission
onDismiss; // Modal/toast close
onComplete; // Async operation finish
onError; // Async operation failure
```

---

## Platform-Specific Component Handling

```typescript
// Light platform difference: use Platform.select
const containerStyle = Platform.select({
  web: styles.webContainer,
  default: styles.mobileContainer,
});

// Heavy platform difference: use platform files
// DropZone.web.tsx   — HTML drag-and-drop
// DropZone.native.tsx — Gallery picker button

// Import (bundler resolves automatically)
import { DropZone } from '@imageforge/ui/feature/DropZone';
```

---

## Component Testing Requirement

Every component must have:

1. **Unit test**: Renders without crash, key props affect output
2. **Accessibility test**: axe-core scan passes
3. **Storybook story** (Phase 8): Interactive documentation

---

## Related Documents

| Document                                             | Relationship               |
| ---------------------------------------------------- | -------------------------- |
| [51-component-library.md](./51-component-library.md) | Component inventory        |
| [50-design-system.md](./50-design-system.md)         | Design tokens used         |
| [56-accessibility.md](./56-accessibility.md)         | Accessibility requirements |
| [22-high-level-design.md](./22-high-level-design.md) | System overview            |

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
