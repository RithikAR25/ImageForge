# How to Add a Package

> **Document ID**: development/how-to-add-package
> **Phase**: Development Guides
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

Guide for creating a new shared package in the ImageForge Turborepo monorepo.

---

## When to Create a New Package

Create a new package when:

- A set of functionality has clear, stable boundaries and no circular dependencies with existing packages
- The functionality needs to be shared across 2+ packages/apps
- The functionality has distinct versioning needs (e.g., a plugin SDK)

Do NOT create a new package for:

- A single utility function (add to `@imageforge/shared`)
- A single component (add to `@imageforge/ui`)
- App-specific code (keep in the app)

---

## Step 1: Scaffold the Package

```bash
# From repo root
mkdir -p packages/my-package/src

# Create package.json
cat > packages/my-package/package.json << 'EOF'
{
  "name": "@imageforge/my-package",
  "version": "0.0.1",
  "description": "Description of what this package does",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "lint": "eslint src --ext .ts,.tsx"
  },
  "dependencies": {
    "@imageforge/types": "workspace:*"
  },
  "devDependencies": {
    "tsup": "^8.x",
    "typescript": "^5.x",
    "vitest": "^1.x"
  }
}
EOF
```

---

## Step 2: Create tsconfig.json

```json
// packages/my-package/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["dist", "node_modules"]
}
```

---

## Step 3: Create tsup.config.ts

```typescript
// packages/my-package/tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['@imageforge/types', '@imageforge/shared'],
});
```

---

## Step 4: Create the Entry Point

```typescript
// packages/my-package/src/index.ts
export { myMainFunction } from './myModule';
export type { MyConfig } from './types';
```

---

## Step 5: Add to Turbo Pipeline

Turborepo automatically discovers packages via `package.json` workspaces. No manual registration needed.

Verify it's detected:

```bash
turbo ls
# Should show: @imageforge/my-package
```

---

## Step 6: Install in Consuming Packages

```bash
# Add as workspace dependency
pnpm --filter @imageforge/ui add @imageforge/my-package@workspace:*
```

---

## Step 7: Build and Test

```bash
# Build the new package
pnpm --filter @imageforge/my-package build

# Run tests
pnpm --filter @imageforge/my-package test

# Run from root (builds in order)
pnpm build
```

---

## Step 8: Add a Changeset

```bash
pnpm changeset
# Select @imageforge/my-package
# Bump: minor (new package)
# Summary: Add @imageforge/my-package for [purpose]
```

---

_Document Owner: Engineering Team | Approved: 2026-07-27_
