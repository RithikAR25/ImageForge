# Technical Debt Strategy

> **Document ID**: 15
> **Phase**: 1 — Product Planning
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document defines ImageForge's philosophy and approach to technical debt — how debt is categorized, tolerated, tracked, and remediated. Without an explicit debt strategy, teams either accumulate debt silently or waste time on premature optimization.

## Scope

Technical debt across all codebases in the ImageForge monorepo.

---

## What is Technical Debt?

Technical debt refers to the implied cost of additional rework caused by choosing an easy or limited solution now instead of a better approach that would take longer. Like financial debt, it has interest: the longer it accumulates, the more expensive it becomes to pay back.

---

## Debt Taxonomy

### Type 1: Deliberate Strategic Debt

**Definition**: Knowingly chosen shortcuts with a documented plan to remediate.

**When Acceptable**: MVP delivery pressure, proof-of-concept validation, insufficient information to make the right decision yet.

**Example**: Using `any` in TypeScript temporarily for a complex third-party library integration while waiting for type definitions.

**Rule**: All deliberate debt must be:

1. Documented with a `// TODO(debt): [reason] [ticket]` comment
2. Filed as a GitHub Issue with label `technical-debt`
3. Given a remediation timeline

---

### Type 2: Inadvertent Debt (Design Ignorance)

**Definition**: Debt introduced unintentionally due to lack of knowledge or poor design.

**When it Happens**: Junior contributors, rapid prototyping, insufficient design review.

**Detection**: Code review, linting, architectural reviews.

**Rule**: Must be caught and addressed before merge. The code review process is the primary defense.

---

### Type 3: Bit Rot

**Definition**: Code that was once correct but has become outdated due to changes in dependencies, platform APIs, or surrounding code.

**Example**: A React Navigation v4 pattern that still works in v7 but is no longer idiomatic.

**Rule**: Addressed in dedicated "cleanup sprints" (at the start of each phase). Not blocked on feature work.

---

### Type 4: Environmental Debt

**Definition**: Dependencies on outdated tooling, deprecated APIs, or end-of-life libraries.

**Detection**: Dependabot alerts, `npm audit`, manual dependency review.

**Rule**: Dependency upgrades happen weekly (Dependabot automation). Major version upgrades planned per phase.

---

## Debt Tolerance Policy

| Debt Type              | MVP Tolerance                                           | Post-MVP Tolerance                   | Notes                      |
| ---------------------- | ------------------------------------------------------- | ------------------------------------ | -------------------------- |
| Type 1 (Strategic)     | **Medium** — documented shortcuts allowed for MVP speed | **Low** — remediate within one phase | Must be documented         |
| Type 2 (Inadvertent)   | **Low** — caught in code review                         | **Very Low**                         | Code review is the gate    |
| Type 3 (Bit Rot)       | **Medium**                                              | **Low**                              | Cleanup sprints per phase  |
| Type 4 (Environmental) | **Low**                                                 | **Very Low**                         | Dependabot + weekly review |

---

## Known Planned Debt Items (MVP)

These are deliberate debt items accepted for MVP delivery:

| ID     | Location                   | Debt                                                    | Reason                   | Remediation                                             |
| ------ | -------------------------- | ------------------------------------------------------- | ------------------------ | ------------------------------------------------------- |
| TD-001 | `packages/image-core/wasm` | Mock WASM module in tests (not real libvips)            | WASM in Jest is complex  | Phase 2: WASM testing in Vitest with proper environment |
| TD-002 | `apps/web/src/storage`     | Basic IndexedDB wrapper without proper migration system | MVP scope                | Phase 2: Add Dexie.js with versioned migrations         |
| TD-003 | `packages/image-core`      | No streaming API for large images                       | Time constraint          | Phase 3: Implement streaming with ReadableStream        |
| TD-004 | `apps/mobile`              | Using deprecated Expo APIs in 2 places                  | Waiting for Expo SDK 52  | Upgrade when SDK 52 stable                              |
| TD-005 | All packages               | TypeScript `// @ts-ignore` in 3 edge cases              | Third-party types broken | Fix when library publishes types                        |

---

## Debt Remediation Process

### 1. Discovery

Debt is discovered via:

- Code review flagging (reviewer comments with `[DEBT]` tag)
- Static analysis (ESLint rules detecting anti-patterns)
- Performance profiling (identifying slow paths)
- Dependency audit reports

### 2. Documentation

Every discovered debt item is:

1. Filed as a GitHub Issue with label `technical-debt`
2. Assigned a debt type (1–4)
3. Given a severity (High/Medium/Low)
4. Estimated for remediation effort

### 3. Prioritization

Debt items are prioritized by:

```
Priority = Severity × Frequency of Change × Blast Radius
```

High-severity debt in frequently-changed, widely-imported code is addressed first.

### 4. Remediation

Debt is remediated in:

- **Immediate**: High-severity debt blocking other work
- **Cleanup sprints**: Dedicated sessions at phase start (1–2 days)
- **Opportunistic**: When changing nearby code

---

## Debt Metrics

Track monthly:

| Metric                  | Target              |
| ----------------------- | ------------------- |
| Open debt issues        | < 20 at any time    |
| Debt closed per phase   | ≥ 50% of open items |
| TypeScript `any` count  | Decreasing trend    |
| `// @ts-ignore` count   | 0                   |
| ESLint disable comments | < 5 in codebase     |
| TODO/FIXME comments     | < 20 (tracked)      |

---

_Document Owner: Architecture Team | Review Cycle: Monthly | Approved: 2026-07-27_
