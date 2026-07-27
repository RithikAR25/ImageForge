# GitHub Strategy

> **Document ID**: 83
> **Phase**: 5 — Technical Specifications
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

This document defines the GitHub repository strategy — branching, PR process, labels, milestones, and community management for the open-source ImageForge project.

---

## Branch Strategy

```
main              ← Always deployable; protected
  └── develop     ← Integration branch (optional, for large features)
  └── feature/*   ← New features
  └── fix/*       ← Bug fixes
  └── docs/*      ← Documentation
  └── perf/*      ← Performance improvements
  └── release/*   ← Release preparation
```

### Branch Protection Rules (main)

- ✅ Require pull request before merging
- ✅ Require status checks to pass (CI)
- ✅ Require 1 approving review
- ✅ Dismiss stale reviews on new commits
- ✅ Require signed commits (recommended)
- ❌ No direct pushes (even admins)

---

## Pull Request Process

### PR Template

```markdown
## What does this PR do?

Brief description of the change.

## Related Issue

Fixes #123

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation
- [ ] Performance improvement

## Testing

- [ ] Unit tests added/updated
- [ ] E2E tests added/updated (if UI change)
- [ ] Tested on Web
- [ ] Tested on Mobile

## Changeset

- [ ] `pnpm changeset` run (for package changes)

## Screenshots (if UI change)

(Add before/after screenshots here)
```

---

## Labels

### Type Labels

| Label           | Color  | Usage               |
| --------------- | ------ | ------------------- |
| `bug`           | Red    | Something is broken |
| `feature`       | Blue   | New functionality   |
| `performance`   | Orange | Speed improvements  |
| `security`      | Purple | Security issues     |
| `documentation` | Green  | Docs only           |
| `refactor`      | Gray   | Code quality        |

### Status Labels

| Label              | Usage                         |
| ------------------ | ----------------------------- |
| `good first issue` | Suitable for new contributors |
| `help wanted`      | Core team needs assistance    |
| `blocked`          | Waiting on something          |
| `needs review`     | Ready for review              |
| `wip`              | Work in progress              |

### Priority Labels

| Label           | Usage                    |
| --------------- | ------------------------ |
| `P0 - Critical` | Production broken        |
| `P1 - High`     | Important, affects users |
| `P2 - Medium`   | Planned for next release |
| `P3 - Low`      | Nice to have             |

---

## Milestones

| Milestone    | Description                                     |
| ------------ | ----------------------------------------------- |
| `v1.0.0 MVP` | Core compression, resize, crop, convert, batch  |
| `v1.1.0`     | AVIF support, adaptive compression, performance |
| `v2.0.0`     | Enhance, filters, watermark, plugin system      |
| `v3.0.0`     | GIF, PDF, OCR, AI features                      |

---

## Issue Templates

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what went wrong.

**Steps to Reproduce**

1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Environment**

- OS: [e.g., macOS 14.4]
- Browser: [e.g., Chrome 124]
- ImageForge version: [e.g., 1.0.0]

**Console errors**
(Paste any errors from browser console)
```

---

## Community Guidelines

1. **Be welcoming**: Beginner questions are always welcome
2. **Respond in 48h**: Maintainers respond to issues/PRs within 2 business days
3. **English first**: All issues and PRs in English for global contributors
4. **No duplicate issues**: Search before filing new issues
5. **Celebrate contributions**: Thank contributors in PR merges

---

## Release Process

1. Create `release/v1.x.0` branch
2. Run `pnpm version-packages` (consumes changesets)
3. Update CHANGELOG.md
4. Open PR from release branch → main
5. Merge (squash commit)
6. `git tag v1.x.0 && git push --tags`
7. Create GitHub Release with notes
8. CI auto-deploys web; EAS builds mobile

---

_Document Owner: Engineering Team | Approved: 2026-07-27_
