# Contributing Guide

> **Document ID**: 74
> **Phase**: 5 — Implementation Guides / GitHub Community
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Welcome to ImageForge!

Thank you for considering contributing to ImageForge. This guide helps you understand how to contribute effectively, get your changes accepted, and become a valued member of the community.

---

## Code of Conduct

ImageForge follows the [Contributor Covenant 2.1](../CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

---

## How to Contribute

### 1. Find Something to Work On

- **Beginner**: Look for issues labeled `good first issue`
- **Intermediate**: Issues labeled `help wanted`
- **Advanced**: Architecture improvements in the `discussions` tab
- **Bug fixes**: Any open bug reports
- **Documentation**: Always welcome — even typo fixes!

### 2. Set Up Your Environment

See [71-getting-started.md](./71-getting-started.md) for the complete setup guide.

```bash
git clone https://github.com/imageforge/imageforge.git
cd imageforge
pnpm install
pnpm --filter apps/web dev
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

**Branch naming conventions**:

- `feature/` — New features
- `fix/` — Bug fixes
- `docs/` — Documentation changes
- `refactor/` — Code refactoring
- `perf/` — Performance improvements
- `test/` — Test additions

### 4. Make Your Changes

- Follow the code style (ESLint and Prettier are enforced)
- Write tests for new functionality (unit tests required, integration preferred)
- Update documentation if changing behavior
- Keep commits focused and atomic

### 5. Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(compress): add target file size adaptive compression
fix(batch): prevent queue corruption on concurrent retry
docs(api): add JSDoc to ImagePipeline.execute()
perf(wasm): use SIMD for mozjpeg encoding
test(resize): add tests for edge case zero dimensions
refactor(storage): extract adapter interface
```

### 6. Create a Changeset

ImageForge uses Changesets for versioning:

```bash
pnpm changeset
```

Select the packages you changed, the semver bump (major/minor/patch), and describe your change.

### 7. Submit a Pull Request

- Open a PR against the `main` branch
- Fill out the PR template completely
- Link the related issue: `Fixes #123`
- All CI checks must pass
- Request review from a maintainer

---

## Pull Request Requirements

| Requirement             | Check             |
| ----------------------- | ----------------- |
| Tests pass              | CI: Vitest        |
| TypeScript compiles     | CI: tsc           |
| Lint passes             | CI: ESLint        |
| Coverage ≥ 80%          | CI: Coverage gate |
| Changeset present       | CI: Changesets    |
| PR description complete | Manual review     |

---

## Code Standards

### TypeScript

- `strict: true` is enforced
- No `any` — use `unknown` and narrow with type guards
- Prefer `interface` over `type` for object shapes
- All public functions must have JSDoc

### React Native

- Use `StyleSheet.create` — no inline styles
- Use design tokens from `@imageforge/ui/tokens` — no raw hex colors
- Use `accessibilityLabel` on all interactive elements
- Keep component files under 150 lines — extract if larger

### Testing

- Every new function/class needs a unit test
- Test the behavior (what), not the implementation (how)
- Use descriptive test names: `it('should compress JPEG within ±10% of target size')`

---

## Adding a New Processing Feature

1. Read [72-adding-a-feature.md](./72-adding-a-feature.md)
2. Create feature module in `packages/image-core/src/[feature-name]/`
3. Add TypeScript types in `packages/types`
4. Implement WASM adapter (web) and native adapter (mobile)
5. Add UI controls in `packages/ui/src/feature/`
6. Connect to pipeline registry
7. Write tests (≥ 80% coverage)
8. Write feature documentation in `docs/features/[feature].md`
9. Submit PR

---

## Questions?

- **Bugs**: [GitHub Issues](https://github.com/imageforge/imageforge/issues)
- **Features**: [GitHub Discussions](https://github.com/imageforge/imageforge/discussions)
- **Security**: security@imageforge.dev (not public issues)
- **Chat**: ImageForge Discord server

---

_Document Owner: Engineering Team | Review Cycle: Per-release | Approved: 2026-07-27_
