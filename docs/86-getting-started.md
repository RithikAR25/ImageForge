# Getting Started Guide

> **Document ID**: 86
> **Phase**: 5 — Implementation Guides
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

This guide enables a new developer to set up the ImageForge development environment and make their first code change within 30 minutes.

---

## Prerequisites

| Tool                 | Version   | Install                              |
| -------------------- | --------- | ------------------------------------ |
| Node.js              | 20.x LTS  | https://nodejs.org                   |
| pnpm                 | 4.x       | `npm install -g pnpm`                |
| Git                  | 2.40+     | https://git-scm.com                  |
| **For mobile only**: |           |                                      |
| Xcode                | 15+       | Mac App Store                        |
| Android Studio       | Hedgehog+ | https://developer.android.com/studio |
| Expo CLI             | Latest    | Auto-installed via pnpm              |

---

## 1. Clone the Repository

```bash
git clone https://github.com/imageforge/imageforge.git
cd imageforge
```

---

## 2. Install Dependencies

```bash
pnpm install
```

This installs all workspace dependencies across all packages in one command. Turborepo handles the build ordering.

---

## 3. Start the Web App

```bash
pnpm --filter apps/web dev
```

Open **http://localhost:5173** in your browser.

The app is hot-module-reload enabled — edits to source files reflect instantly.

---

## 4. Start the Mobile App (Optional)

```bash
pnpm --filter apps/mobile start
```

Then press:

- `i` to open iOS simulator
- `a` to open Android emulator
- `w` to open web browser

Or install **Expo Go** on your physical device and scan the QR code.

---

## 5. Run the Tests

```bash
# All packages
pnpm test

# Watch mode (for development)
pnpm --filter @imageforge/image-core test --watch

# With coverage
pnpm test --coverage
```

---

## 6. Run the Linter

```bash
pnpm lint
```

---

## 7. TypeScript Type Check

```bash
pnpm typecheck
```

---

## 8. Build All Packages

```bash
pnpm build
```

Turborepo builds packages in dependency order.

---

## Environment Variables

Copy the example file:

```bash
cp .env.example .env.local
```

The `.env.example` contains:

```
# Optional: Turbo remote cache
TURBO_TOKEN=
TURBO_TEAM=

# Optional: Error reporting (only used if user opts in)
SENTRY_DSN=

# Optional: Vercel deployment
VERCEL_TOKEN=
```

No environment variables are required for local development. The app works fully without any.

---

## Common Workflows

### Add a new processing operation

1. Create `packages/image-core/src/myfeature/`
2. Implement the operation in `MyFeature.ts`
3. Add config type to `packages/types/src/`
4. Register in `packages/image-core/src/pipeline/operationRegistry.ts`
5. Add web engine support in `packages/image-core/src/engines/wasm/`
6. Add native engine support in `packages/image-core/src/engines/native/`
7. Add UI in `packages/ui/src/feature/MyFeatureControls/`
8. Add to the relevant screen
9. Write unit tests
10. Submit PR

See [how-to-add-feature.md](./development/how-to-add-feature.md) for the detailed guide.

---

### Run Specific Package Commands

```bash
# Test only image-core
pnpm --filter @imageforge/image-core test

# Build only the web app
pnpm --filter apps/web build

# Type check only types package
pnpm --filter @imageforge/types typecheck
```

---

## Troubleshooting

### pnpm install fails

```bash
# Clear cache and retry
pnpm store prune
pnpm install
```

### Port 5173 in use

```bash
pnpm --filter apps/web dev --port 3000
```

### Metro bundler issues (mobile)

```bash
pnpm --filter apps/mobile start --clear
```

### WASM not loading

The web app requires COOP/COEP headers for WASM SharedArrayBuffer support. The Vite dev server is pre-configured for this. If you see a console error about SharedArrayBuffer, check `vite.config.ts` has the correct headers plugin.

---

## Related Documents

| Document                                                                 | Relationship         |
| ------------------------------------------------------------------------ | -------------------- |
| [development/how-to-add-feature.md](./development/how-to-add-feature.md) | Adding features      |
| [87-testing-guide.md](./87-testing-guide.md)                             | Testing patterns     |
| [CONTRIBUTING.md](../CONTRIBUTING.md)                                    | Contribution process |
| [25-monorepo-architecture.md](./25-monorepo-architecture.md)             | Repo structure       |

---

_Document Owner: Engineering Team | Review Cycle: Per-release | Approved: 2026-07-27_
