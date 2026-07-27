# ADR-0001: Turborepo Monorepo

**Date**: 2026-07-27  
**Status**: Accepted  
**Deciders**: Architecture Team

---

## Context

ImageForge targets three platforms (Web, Android, iOS) with the explicit goal of maximizing code sharing. The project has multiple distinct units:

- `apps/web` — React Native Web application
- `apps/mobile` — Expo React Native mobile application
- `packages/image-core` — Image processing business logic
- `packages/ui` — Shared UI components
- `packages/shared` — Utilities, constants, types
- `packages/hooks` — Shared React hooks
- `packages/types` — TypeScript type definitions

We needed a repository structure that keeps all these units in sync, enables atomic commits across packages, and provides excellent developer experience.

---

## Decision Drivers

- Shared TypeScript types must be updated atomically across all consumers
- Business logic changes must be immediately testable in all consuming apps
- CI/CD must be efficient (avoid rebuilding unchanged packages)
- External contributors must be able to navigate the codebase easily
- Package publishing (to npm) must be straightforward

---

## Considered Options

### Option A: Turborepo Monorepo (Chosen)

Single git repository containing all apps and packages, managed by Turborepo with pnpm Workspaces.

### Option B: Nx Monorepo

Similar to Turborepo but with Nx as the build orchestrator and its own CLI/workspace management.

### Option C: Lerna Monorepo

Traditional monorepo tool. Industry standard prior to Turborepo's rise.

### Option D: Polyrepo (Separate Repositories)

Each package/app in its own git repository. Cross-repo changes via npm versioning.

---

## Decision Outcome

**Chosen option: Option A — Turborepo with pnpm Workspaces**

Turborepo provides the optimal combination of:

1. Incremental builds with aggressive caching
2. Simple configuration (minimal `turbo.json`)
3. Excellent Expo/React Native compatibility
4. Remote caching for CI (Vercel Remote Cache is free for open-source)
5. Task pipelines (`build → test → lint`) clearly defined

---

## Pros and Cons of the Options

### Option A: Turborepo (Chosen)

**Pros**:

- Fastest build times via incremental computation graph
- Remote caching reduces CI time by 80%+
- Simple config; most options inferred
- Strong community adoption, Vercel backing
- First-class Expo support

**Cons**:

- Less powerful than Nx for code generation
- Newer tool; fewer enterprise case studies than Nx

### Option B: Nx

**Pros**:

- Mature; battle-tested at large enterprises
- Rich code generation plugins
- First-class Angular/React/Next.js support

**Cons**:

- Complex configuration for an open-source project
- Nx plugins add significant overhead/learning curve
- Expo support requires manual configuration
- Overkill for this project size

### Option C: Lerna

**Pros**: Battle-tested, large community
**Cons**: Significantly slower than Turborepo; Lerna development slowed before nrwl acquisition; Turborepo supersedes it for new projects

### Option D: Polyrepo

**Pros**: Maximum team autonomy; simpler individual repos
**Cons**:

- Cross-package type changes require 2+ PRs + version bumps
- Local development requires `pnpm link` or similar — error-prone
- Type inconsistencies accumulate across repos
- Fundamentally incompatible with the code-sharing goal

---

## Consequences

**Good**:

- Atomic commits: change a type in `packages/types` and the consuming `apps/web` in one PR
- Shared ESLint/TypeScript configs reduce duplication
- Turborepo runs `test` for only the packages affected by a change
- Clear, navigable structure for open-source contributors

**Bad**:

- Repository size grows over time (all package history in one repo)
- GitHub Actions must be aware of Turborepo's affected graph
- Large clones for external contributors (mitigated with shallow clone in CI)

---

## References

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [DL-001 in Decision Log](../DECISION_LOG.md)
- [25-monorepo-architecture.md](../25-monorepo-architecture.md)
