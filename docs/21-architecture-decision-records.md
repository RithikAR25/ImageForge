# Architecture Decision Records — Index

> **Document ID**: 21
> **Phase**: 2 — Architecture
> **Status**: Active (living document)
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document serves as the index and overview for all Architecture Decision Records (ADRs) in the ImageForge project. ADRs are stored in the [`adr/`](./adr/) folder, with one file per decision.

## What is an ADR?

An Architecture Decision Record documents a significant architectural decision — its context, the options considered, the decision made, and the consequences. ADRs are immutable historical records: once an ADR is accepted, it is never edited. If a decision changes, a new ADR is written that supersedes the old one.

## ADR Status Values

| Status         | Meaning                                 |
| -------------- | --------------------------------------- |
| **Proposed**   | Under discussion, not yet decided       |
| **Accepted**   | Decision made and in effect             |
| **Deprecated** | No longer relevant but kept for history |
| **Superseded** | Replaced by a newer ADR                 |

---

## ADR Registry

| ADR      | Title                                        | Status   | Date       | Link                                           |
| -------- | -------------------------------------------- | -------- | ---------- | ---------------------------------------------- |
| ADR-0001 | Turborepo Monorepo                           | Accepted | 2026-07-27 | [ADR-0001](./adr/ADR-0001-monorepo.md)         |
| ADR-0002 | React Native Web for Cross-Platform          | Accepted | 2026-07-27 | [ADR-0002](./adr/ADR-0002-react-native-web.md) |
| ADR-0003 | Zustand for State Management                 | Accepted | 2026-07-27 | [ADR-0003](./adr/ADR-0003-state-management.md) |
| ADR-0004 | libvips/WASM as Image Processing Engine      | Accepted | 2026-07-27 | [ADR-0004](./adr/ADR-0004-image-library.md)    |
| ADR-0005 | Web Worker Pool for Batch Processing         | Accepted | 2026-07-27 | [ADR-0005](./adr/ADR-0005-batch-engine.md)     |
| ADR-0006 | Sandboxed Plugin System                      | Accepted | 2026-07-27 | [ADR-0006](./adr/ADR-0006-plugin-system.md)    |
| ADR-0007 | Lazy WASM Loading with Service Worker Cache  | Accepted | 2026-07-27 | [ADR-0007](./adr/ADR-0007-wasm-strategy.md)    |
| ADR-0008 | Service Worker (Workbox) for Offline         | Accepted | 2026-07-27 | [ADR-0008](./adr/ADR-0008-offline-first.md)    |
| ADR-0009 | Expo Managed Workflow                        | Accepted | 2026-07-27 | [ADR-0009](./adr/ADR-0009-expo-vs-bare.md)     |
| ADR-0010 | Platform-Specific Storage (IndexedDB/SQLite) | Accepted | 2026-07-27 | [ADR-0010](./adr/ADR-0010-storage.md)          |

---

## How to Create a New ADR

1. Copy the ADR template from `adr/ADR-TEMPLATE.md`
2. Name it `ADR-NNNN-short-title.md` where NNNN is the next sequential number
3. Fill in all sections
4. Submit as a PR with status `Proposed`
5. After discussion and approval, update status to `Accepted`
6. Add to this index

---

## ADR Template

```markdown
# ADR-NNNN: [Short Title]

**Date**: YYYY-MM-DD  
**Status**: Proposed | Accepted | Deprecated | Superseded by ADR-NNNN  
**Deciders**: [Names or roles]

## Context

[What is the issue or problem that prompted this decision?]

## Decision Drivers

- [Factor 1]
- [Factor 2]

## Considered Options

- Option A
- Option B
- Option C

## Decision Outcome

Chosen option: **Option X**, because [reason].

### Consequences

**Good**:

- [Positive consequence]

**Bad**:

- [Negative consequence / trade-off]

## Pros and Cons of the Options

### Option A

**Pros**: ...
**Cons**: ...

### Option B

**Pros**: ...
**Cons**: ...

## References

- [Links to relevant docs, issues, RFCs]
```

---

_Document Owner: Architecture Team | Review Cycle: Per-decision | Last Updated: 2026-07-27_
