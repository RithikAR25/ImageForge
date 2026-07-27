# Environment Setup Guide

> **Document ID**: development/environment-setup
> **Phase**: Development Guides
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

Complete environment setup guide for new contributors to the ImageForge monorepo.

---

## Prerequisites

| Tool    | Version  | Install                                                |
| ------- | -------- | ------------------------------------------------------ |
| Node.js | 20.x LTS | [nodejs.org](https://nodejs.org) or `nvm install 20`   |
| pnpm    | 9.x      | `npm install -g pnpm`                                  |
| Git     | 2.40+    | OS package manager                                     |
| VS Code | Latest   | [code.visualstudio.com](https://code.visualstudio.com) |

**Mobile Development (optional)**:

| Tool                     | Platform         | Install                                                       |
| ------------------------ | ---------------- | ------------------------------------------------------------- |
| Xcode 15+                | macOS / iOS only | Mac App Store                                                 |
| Android Studio Hedgehog+ | Android          | [developer.android.com](https://developer.android.com/studio) |
| EAS CLI                  | iOS + Android    | `npm install -g eas-cli`                                      |

---

## Repository Setup

```bash
# 1. Clone the repository
git clone https://github.com/imageforge/imageforge.git
cd imageforge

# 2. Install all dependencies
pnpm install

# 3. Build all packages in dependency order
pnpm build

# 4. Verify setup
pnpm typecheck
pnpm lint
pnpm test
```

All three commands should complete with zero errors.

---

## Running the Web App

```bash
# Start development server (http://localhost:5173)
pnpm --filter ./apps/web dev

# Or from the apps/web directory
cd apps/web
pnpm dev
```

The development server includes:

- Hot module replacement (HMR)
- TypeScript error overlay
- WASM served from local filesystem

---

## Running the Mobile App

```bash
# Start Expo dev server
pnpm --filter ./apps/mobile start

# Or:
cd apps/mobile
pnpm expo start

# Then press:
# i → iOS simulator
# a → Android emulator
# s → Expo Go on physical device
```

For physical device testing with Expo Go:

1. Install Expo Go from App Store / Play Store
2. Scan QR code shown in terminal

---

## VS Code Recommended Extensions

Install these when prompted or manually:

```json
// .vscode/extensions.json (already in repo)
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "orta.vscode-jest",
    "mxsdev.typescript-explorer",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

---

## Environment Variables

```bash
# apps/web/.env.local (copy from .env.example)
VITE_APP_VERSION=dev
VITE_ENABLE_ANALYTICS=false
VITE_WASM_BASE_URL=/wasm
```

```bash
# apps/mobile/.env.local
EXPO_PUBLIC_APP_VERSION=dev
EXPO_PUBLIC_API_URL=http://localhost:3000
```

---

## Common Issues

### "SharedArrayBuffer is not defined"

COOP/COEP headers not set. In dev, Vite sets these automatically. If missing:

```bash
# apps/web/vite.config.ts — verify these are present in server.headers
'Cross-Origin-Opener-Policy': 'same-origin',
'Cross-Origin-Embedder-Policy': 'require-corp',
```

### "Module not found: @imageforge/types"

Packages not built yet. Run: `pnpm build` from repo root.

### Expo Metro bundler crash

Metro cache corrupted. Fix: `cd apps/mobile && pnpm expo start --clear`

### pnpm store issues

```bash
pnpm store prune   # Clear unused cached packages
pnpm install       # Reinstall
```

---

_Document Owner: Engineering Team | Approved: 2026-07-27_
