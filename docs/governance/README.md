# Governance Documents

> **Location**: `docs/governance/`
> **Purpose**: Implementation-phase governance — the rules and living documents that manage the codebase during and after development.

---

## Contents

| Document                                                  | Purpose                                           | Update Frequency     |
| --------------------------------------------------------- | ------------------------------------------------- | -------------------- |
| [AGENT_CONTEXT.md](./AGENT_CONTEXT.md) 🔑                 | Mandatory first-read for every AI coding session  | Per-module           |
| [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) 🔑 | Living tracker — what's built, what's in progress | Every session        |
| [MODULE_0_BOOTSTRAP.md](./MODULE_0_BOOTSTRAP.md)          | Scaffolding guide before any feature code         | Once                 |
| [PUBLIC_API.md](./PUBLIC_API.md)                          | Pre-defined public TypeScript API contracts       | Per-major-version    |
| [DEPENDENCY_RULES.md](./DEPENDENCY_RULES.md)              | Package import rules, enforced by ESLint          | When adding packages |

---

## Usage Protocol

### Starting an Implementation Session

1. Read `AGENT_CONTEXT.md` — understand current state and invariants
2. Read `IMPLEMENTATION_STATUS.md` — know what module is active and what's done
3. Mark your task as `[/]` In Progress in `IMPLEMENTATION_STATUS.md`
4. Write code according to `PUBLIC_API.md` contracts and `DEPENDENCY_RULES.md`
5. When done, mark task as `[x]` Complete and run `pnpm docs:index`

### After Adding Any `.md` File

```bash
pnpm docs:index
```

This regenerates the statistics block in `DOCUMENT_INDEX.md` automatically.

### Changing a Public API

1. Update `PUBLIC_API.md` first (design the change before implementing it)
2. File a PR with reasoning — breaking changes require an ADR
3. Update all dependent packages simultaneously (not incrementally)

---

## Governance Principles

1. **Status before code** — Always know what module is active before writing
2. **Contracts before implementation** — Public API is defined before the code that implements it
3. **Index stays accurate** — Run `pnpm docs:index` after every structural change
4. **Invariants are non-negotiable** — See AGENT_CONTEXT.md I-01 through I-10
5. **Dependency DAG is enforced** — Not aspirational. Violations break CI.

---

_Governance docs created: 2026-07-27 | Design Freeze: 2026-07-27_
