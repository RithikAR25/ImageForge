# Feature Template

> **Document ID**: ai/FEATURE_TEMPLATE
> **Phase**: AI Development
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This is the canonical template for writing a new feature specification document in `docs/features/`. Use this template whenever documenting a new ImageForge feature.

---

## Template

````markdown
# [Feature Name] Feature Specification

> **Document ID**: features/[feature-slug]
> **Phase**: 4 — Feature Specifications
> **Status**: [MVP | Phase 2 | Phase 3 | Planning]

---

## Overview

One paragraph describing what this feature does, who it's for, and why it exists.

---

## Functional Requirements

| Requirement               | FR     | Priority |
| ------------------------- | ------ | -------- |
| [Requirement description] | FR-XXX | [MVP     | P2  | P3] |

---

## Use Cases

| Scenario   | User                  | Goal   |
| ---------- | --------------------- | ------ |
| [Scenario] | [Alex / Sam / Jordan] | [Goal] |

---

## Technical Implementation

Describe the technical approach — which WASM operations, which algorithms,
which platform-specific considerations.

```typescript
// Example: Config interface
interface [Feature]Config {
  readonly setting1: number;    // Description (min-max)
  readonly setting2: 'option-a' | 'option-b';
}
```
````

---

## UI Layout

```
ASCII art or description of the UI layout.
```

---

## Config Schema

```typescript
interface [Feature]Config {
  readonly fieldName: type; // Description (range/options)
}
```

---

## Platform Notes

| Platform | Note                             |
| -------- | -------------------------------- |
| Web      | [Any web-specific behaviour]     |
| iOS      | [Any iOS-specific behaviour]     |
| Android  | [Any Android-specific behaviour] |

---

## Performance Targets

| Scenario                            | Target |
| ----------------------------------- | ------ |
| [e.g., 5MP image, default settings] | ≤ Xms  |

---

## Error States

| Error   | Cause            | User Message            |
| ------- | ---------------- | ----------------------- |
| [Error] | [When it occurs] | [Message shown to user] |

---

## Dependencies

| Dependency   | Purpose     |
| ------------ | ----------- |
| libvips.wasm | [Operation] |

---

## Related Documents

| Document                         | Relationship |
| -------------------------------- | ------------ |
| [linked-doc.md](./linked-doc.md) | Description  |

---

_Document Owner: Product Team | Status: [Status] | Approved: [Date]_

```

---

## Checklist for Feature Docs

Before marking a feature spec as approved:

- [ ] Overview clearly explains the feature and its users
- [ ] All functional requirements have FR numbers (use next available in sequence)
- [ ] Priority assigned to every FR (MVP / P2 / P3)
- [ ] Config interface defined and readonly
- [ ] Performance target given for the primary use case
- [ ] At least one error state documented
- [ ] Platform-specific notes filled out (even if "Same as web")
- [ ] Related documents linked

---

*Document Owner: Architecture Team | Approved: 2026-07-27*
```
