# Module 0 — Bootstrap

> **Document ID**: governance/MODULE_0_BOOTSTRAP
> **Phase**: Pre-Implementation Bootstrap
> **Status**: Ready to Execute
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

Module 0 is the zero-feature-code bootstrap phase. It creates the monorepo scaffolding, tooling config, and empty package shells **before any business logic is written**. It is split into **Module 0A (Infrastructure)** and **Module 0B (Workspace)**.

> **Rule**: No feature code is written until Module 0 is complete and CI is green.

---

## Prerequisites

| Tool    | Version  | Verify                |
| ------- | -------- | --------------------- |
| Node.js | 20.x LTS | `node --version`      |
| pnpm    | 9.x      | `npm install -g pnpm` |
| Git     | 2.40+    | `git --version`       |


---

## Step 0.1 — Root Workspace

Create the root `package.json`:

```json
{
  "name": "imageforge",
  "private": true,
  "version": "0.0.0",
  "packageManager": "pnpm@9.4.0",
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev --parallel",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "clean": "turbo run clean",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "release": "changeset publish",
    "docs:index": "node tools/scripts/update-doc-index.mjs"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.0",
    "prettier": "^3.2.0",
    "turbo": "^2.0.0",
    "typescript": "^5.4.0"
  }
}
```

Create `pnpm-workspace.yaml` in the repo root:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tools/*'
```

---

## Step 0.2 — Turborepo Config

Create `turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "cache": false
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "lint": {
      "cache": false
    },
    "dev": {
      "dependsOn": ["^build"],
      "persistent": true,
      "cache": false
    },
    "clean": {
      "cache": false
    }
  }
}
```

---

## Step 0.3 — TypeScript Base Config

Create `tsconfig.base.json` at repo root:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "incremental": true,
    "jsx": "react-native"
  }
}
```

---

## Step 0.4 — ESLint Config

Create `eslint.config.mjs` at root:

```js
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/node_modules/**', '**/.expo/**'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylisticTypeChecked],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      // Enforce no `any`
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      // Require explicit return types on exported functions
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      // No console.log — use createLogger()
      'no-console': ['error', { allow: [] }],
      // React rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
);
```

---

## Step 0.5 — Prettier Config

Create `.prettierrc.json`:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

---

## Step 0.6 — Module 0B Workspace (Package Shells)

Create the minimal package directories needed for Module 1.

> **Note**: `image-core`, `hooks`, and `ui` packages are explicitly **deferred** until their respective implementation modules.

### `packages/types`

```json
{
  "name": "@imageforge/types",
  "version": "0.0.1",
  "description": "Shared TypeScript type definitions — zero runtime code",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.4.0"
  }
}
```

### `packages/shared`

```json
{
  "name": "@imageforge/shared",
  "version": "0.0.1",
  "description": "Stores, utilities, constants, logger",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src"
  },
  "dependencies": {
    "@imageforge/types": "workspace:*",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.4.0"
  }
}
```

### `apps/web` (Vite)
Created using `pnpm create vite` (React + TS).

### `apps/mobile` (Expo)
Created manually using `npx create-expo-app@latest`. Ensure Turborepo scripts (`build`, `lint`, `typecheck`) are wired up.

---

## Step 0.7 — CI Configuration

Create `.github/workflows/ci.yml` (see `docs/deployment/github-actions.md`).

---

## Step 0.8 — Bootstrap Verification Checklist

All must be green before proceeding to Module 1:

```bash
pnpm install           # ✅ Zero errors
pnpm build             # ✅ All packages build (empty outputs OK)
pnpm typecheck         # ✅ Zero TS errors
pnpm lint              # ✅ Zero lint errors
pnpm format            # ✅ Formatted correctly
pnpm exec turbo run build
pnpm exec turbo run lint
pnpm exec turbo run typecheck
```

- [x] `pnpm install` succeeds with zero warnings
- [x] `packages/types`, `packages/shared`, `apps/web`, `apps/mobile` appear in `turbo ls`
- [x] `turbo run build` succeeds with correct dependency ordering
- [x] TypeScript strict mode enforced in all packages
- [x] ESLint runs on all packages
- [x] Prettier config consistent across repo
- [x] `.github/workflows/ci.yml` runs and passes on empty push
- [x] `IMPLEMENTATION_STATUS.md` updated: Module 0 → `[x] Complete`

---

## Expected File Tree After Module 0B

```
ImageForge/
├── package.json
├── turbo.json
├── tsconfig.base.json
├── eslint.config.mjs
├── .prettierrc.json
├── pnpm-workspace.yaml
├── .nvmrc                (20)
├── .gitignore
├── .env.example
├── LICENSE               (MIT)
├── README.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── CHANGELOG.md
│
├── packages/
│   ├── types/
│   │   ├── src/index.ts  (empty barrel — types added in Module 1)
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── shared/           (same structure)
│
├── apps/
│   ├── web/              (Vite scaffold)
│   └── mobile/           (Expo scaffold)
│
├── tools/
│   └── scripts/
│       └── update-doc-index.mjs   ← Auto document indexer
│
└── .github/
    └── workflows/
        ├── ci.yml
        └── deploy-web.yml
```

---

_Document Owner: Architecture Team | Status: Ready to Execute | 2026-07-27_
