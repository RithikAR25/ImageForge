# Contributing to ImageForge

Thank you for your interest in contributing to ImageForge! This document provides everything you need to make your first contribution.

## Code of Conduct

By participating, you agree to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to Contribute

- 🐛 **Bug fixes** — Find and fix bugs
- ✨ **Features** — Implement new processing features
- 📚 **Documentation** — Improve or extend documentation
- 🧪 **Tests** — Add missing tests
- 🎨 **Design** — Improve UI/UX
- 🌍 **Translations** — Help translate to other languages

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/imageforge.git
   cd imageforge
   ```
3. **Install** dependencies:
   ```bash
   pnpm install
   ```
4. **Start** the web app:
   ```bash
   pnpm --filter apps/web dev
   ```

See [docs/71-getting-started.md](docs/71-getting-started.md) for the full setup guide.

## Branch Naming

```
feature/my-new-feature
fix/123-bug-description
docs/update-readme
perf/compress-speed
test/add-batch-tests
refactor/storage-adapter
```

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(compress): add AVIF format support
fix(batch): fix queue corruption on concurrent retry
docs(readme): add architecture diagram
perf(wasm): enable SIMD for 3x speedup
test(resize): add edge case tests for zero dimensions
```

## Pull Request Process

1. Create a branch from `main`
2. Make your changes with tests
3. Run `pnpm changeset` to document your changes
4. Ensure all CI checks pass:
   ```bash
   pnpm lint && pnpm typecheck && pnpm test
   ```
5. Open a PR with a clear description
6. Link related issues: `Fixes #123`
7. Request review from a maintainer

## Code Standards

- **TypeScript**: strict mode, no `any`, full JSDoc on public APIs
- **Components**: `StyleSheet.create`, design tokens, accessibility labels
- **Tests**: ≥ 80% coverage, descriptive names, test behavior not implementation
- **Commits**: Conventional Commits format

## Adding a New Feature

See [docs/72-adding-a-feature.md](docs/72-adding-a-feature.md) for the complete guide.

Short version:

1. Create `packages/image-core/src/[feature]/`
2. Implement WASM and native adapters
3. Add UI controls in `packages/ui/src/feature/`
4. Write tests
5. Write feature docs in `docs/features/[feature].md`
6. Submit PR

## Reporting Issues

- **Bugs**: Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
- **Features**: Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)
- **Security**: Email security@imageforge.dev (do NOT open a public issue)

## Questions

- [GitHub Discussions](https://github.com/imageforge/imageforge/discussions) for design questions
- [Discord](https://discord.gg/imageforge) for real-time chat
- [Docs](docs/README.md) for comprehensive documentation

Thank you for helping make ImageForge better! 🎉
