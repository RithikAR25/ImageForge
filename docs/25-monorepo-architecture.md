# Monorepo Architecture

> **Document ID**: 25
> **Phase**: 2 — Architecture
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document defines the monorepo structure, workspace configuration, build pipeline, and developer workflow for the ImageForge project using Turborepo and pnpm Workspaces.

---

## Repository Structure

```
ImageForge/
├── apps/
│   ├── web/                    ← React Native Web (Vite + RNW)
│   │   ├── src/
│   │   ├── public/
│   │   ├── vite.config.ts
│   │   ├── index.html
│   │   └── package.json
│   │
│   ├── mobile/                 ← Expo React Native
│   │   ├── src/
│   │   ├── app/                ← Expo Router pages
│   │   ├── app.json
│   │   ├── expo-plugins/
│   │   └── package.json
│   │
│   └── docs/                   ← Documentation site (future Docusaurus)
│       └── package.json
│
├── packages/
│   ├── image-core/             ← Image processing business logic
│   │   ├── src/
│   │   │   ├── compress/
│   │   │   ├── resize/
│   │   │   ├── crop/
│   │   │   ├── rotate/
│   │   │   ├── convert/
│   │   │   ├── pipeline/
│   │   │   ├── batch/
│   │   │   └── engines/
│   │   │       ├── wasm/       ← WASM engine (.web.ts)
│   │   │       └── native/     ← Native engine (.native.ts)
│   │   ├── tsconfig.json
│   │   └── package.json        → "@imageforge/image-core"
│   │
│   ├── ui/                     ← Shared UI components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── screens/
│   │   │   └── navigation/
│   │   ├── tsconfig.json
│   │   └── package.json        → "@imageforge/ui"
│   │
│   ├── hooks/                  ← Shared React hooks
│   │   ├── src/
│   │   ├── tsconfig.json
│   │   └── package.json        → "@imageforge/hooks"
│   │
│   ├── shared/                 ← Utilities, constants, i18n
│   │   ├── src/
│   │   ├── tsconfig.json
│   │   └── package.json        → "@imageforge/shared"
│   │
│   └── types/                  ← TypeScript type definitions
│       ├── src/
│       ├── tsconfig.json
│       └── package.json        → "@imageforge/types"
│
├── server/                     ← Optional backend (Phase 3+)
│   └── package.json
│
├── tools/                      ← Build scripts, CI tools
│   ├── eslint-config/
│   ├── typescript-config/
│   └── scripts/
│
├── examples/                   ← Code examples using @imageforge/* packages
│
├── docs/                       ← This documentation set
│
├── .github/                    ← GitHub community files
│
├── turbo.json                  ← Turborepo configuration
├── package.json                ← Root workspace package.json
├── pnpm.lock
├── .npmrc
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

---

## Turborepo Configuration

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**", "build/**"]
    },
    "lint": {
      "outputs": []
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "cache": false
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### Pipeline Execution Order

```
packages/types:build
        ↓
packages/shared:build
        ↓
packages/image-core:build
packages/hooks:build
        ↓
packages/ui:build
        ↓
apps/web:build
apps/mobile:build
```

Turborepo respects `^build` (build dependencies first) and runs parallel tasks where the dependency graph allows.

---

## Workspace Package.json

```json
// Root package.json
{
  "name": "imageforge",
  "private": true,
  "workspaces": ["apps/*", "packages/*", "server", "tools/*"],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "clean": "turbo run clean && rm -rf node_modules",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "turbo run build --filter=@imageforge/* && changeset publish"
  },
  "devDependencies": {
    "turbo": "^1.13.0",
    "@changesets/cli": "^2.27.0",
    "prettier": "^3.2.0"
  }
}
```

---

## Shared Configuration Packages

### tools/typescript-config

```json
// base.json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-native",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### tools/eslint-config

Shared ESLint configuration extending:

- `@typescript-eslint/recommended-strict`
- `plugin:react/recommended`
- `plugin:react-hooks/recommended`
- Custom ImageForge rules (no-platform-in-shared, etc.)

---

## Developer Workflow

### Initial Setup

```bash
git clone https://github.com/imageforge/imageforge.git
cd imageforge
pnpm install          # Install all workspace dependencies
```

### Development

```bash
# Web development
pnpm --filter apps/web dev

# Mobile development
pnpm --filter apps/mobile start

# Both (Turborepo)
pnpm dev
```

### Running Tests

```bash
# All packages
pnpm test

# Specific package
pnpm --filter @imageforge/image-core test

# With coverage
pnpm --filter @imageforge/image-core test --coverage
```

### Adding a Dependency

```bash
# To a specific workspace
pnpm --filter @imageforge/image-core add sharp-types

# Dev dependency
pnpm --filter apps/web add -D vite-plugin-something
```

---

## Package Versioning

Using **Changesets** for version management:

1. Developer makes a change
2. Runs `pnpm changeset` and describes the change
3. CI validates changeset exists on PR
4. On merge to main, changeset is consumed
5. `pnpm version-packages` bumps versions
6. `pnpm release` publishes to npm

---

## Remote Caching

Turborepo Remote Cache (Vercel) is configured for CI:

- Enables sharing build cache across all GitHub Actions runners
- Reduces CI time by ~80% for unchanged packages
- Free for open-source projects

```yaml
# GitHub Actions
- name: Build
  run: turbo run build
  env:
    TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
    TURBO_TEAM: ${{ vars.TURBO_TEAM }}
```

---

## Related Documents

| Document                                                                   | Relationship          |
| -------------------------------------------------------------------------- | --------------------- |
| [20-system-architecture-document.md](./20-system-architecture-document.md) | Architecture overview |
| [26-package-architecture.md](./26-package-architecture.md)                 | Package internals     |
| [70-folder-structure.md](./70-folder-structure.md)                         | Detailed folder tree  |
| [79-build-system.md](./79-build-system.md)                                 | Build system details  |
| [80-ci-cd.md](./80-ci-cd.md)                                               | CI/CD pipeline        |

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
