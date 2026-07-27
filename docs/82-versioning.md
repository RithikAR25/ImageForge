# Versioning Strategy

> **Document ID**: 82
> **Phase**: 5 — Technical Specifications
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

This document defines how ImageForge is versioned across npm packages, mobile apps, and the web application — covering the full release lifecycle.

---

## Package Versioning (npm Semantic Versioning)

All `@imageforge/*` packages follow **Semantic Versioning 2.0.0**:

```
MAJOR.MINOR.PATCH
  1.2.3

MAJOR = Breaking API change
MINOR = Backward-compatible new feature
PATCH = Bug fix
```

Package versions are independent — `@imageforge/types@1.2.0` and `@imageforge/ui@2.0.0` can coexist.

---

## App Versioning

### Mobile (`app.json`)

```json
{
  "expo": {
    "version": "1.0.0", // semver displayed to users
    "ios": {
      "buildNumber": "42" // Monotonically increasing; required by Apple
    },
    "android": {
      "versionCode": 42 // Monotonically increasing; required by Google
    }
  }
}
```

`buildNumber` / `versionCode` increment on every build submitted to the stores, even for hotfix builds with the same `version`.

### Web App

Web does not have a traditional "version" shown to users. Instead:

- A `BUILD_ID` (short Git SHA) is embedded in `__APP_VERSION__` at build time
- The CHANGELOG.md tracks user-visible changes
- Users always see the latest deployed version (no version pinning on web)

---

## Release Flow

```
1. Developer merges PRs with Changesets
2. Changesets bot opens "Version PR" automatically
3. Maintainer reviews + merges Version PR
   → Bumps all affected package.json versions
   → Updates CHANGELOG.md
4. Git tag created: git tag v1.x.y
5. GitHub Actions trigger:
   - Publish @imageforge/* to npm
   - Deploy web to Vercel production
   - Trigger EAS build for mobile (on release/* branches)
```

---

## Changeset Workflow

Every PR with code changes must include a changeset:

```bash
# In the PR branch
pnpm changeset

# CLI prompts:
# ? Which packages did you change? (select all affected)
# ? Bump type? major / minor / patch
# ? Summary of changes: Added AVIF export support

# Creates: .changeset/bright-eagle-22.md
```

The CI bot validates that every code-changing PR has a changeset. Documentation-only PRs can skip with a `skip-changeset` label.

---

## CHANGELOG Format

Following [Keep a Changelog](https://keepachangelog.com/):

```markdown
## [1.2.0] - 2026-08-01

### Added

- AVIF export format support (#234)
- Filename template for batch export (#189)

### Fixed

- Queue not resuming after browser refresh (#201)
- HEIC import failing on Samsung devices (#215)

### Changed

- Compress default quality changed from 80 to 85

## [1.1.0] - 2026-07-15

...
```

---

## Pre-release Labels

| Label  | Example         | Usage               |
| ------ | --------------- | ------------------- |
| Alpha  | `1.1.0-alpha.1` | Internal testing    |
| Beta   | `1.1.0-beta.1`  | Public beta program |
| RC     | `1.1.0-rc.1`    | Release candidate   |
| Stable | `1.1.0`         | Production release  |

---

_Document Owner: Engineering Team | Approved: 2026-07-27_
