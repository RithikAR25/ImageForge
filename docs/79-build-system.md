# Build System

> **Document ID**: 79
> **Phase**: 5 — Technical Specifications
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document describes the complete build system for the ImageForge monorepo — Turborepo orchestration, Vite web bundler, Metro mobile bundler, and Expo build pipeline.

---

## Turborepo Pipeline

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalEnv": ["NODE_ENV", "EXPO_PUBLIC_*"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", "build/**"],
      "cache": true
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "cache": true
    },
    "lint": {
      "cache": true
    },
    "test": {
      "dependsOn": ["^build"],
      "cache": true,
      "outputs": ["coverage/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### Build Order (Dependency-Driven)

```
@imageforge/types     → builds first (no dependencies)
    ↓
@imageforge/shared    → depends on types
    ↓
@imageforge/image-core → depends on types + shared
    ↓
@imageforge/hooks     → depends on image-core + shared
    ↓
@imageforge/ui        → depends on hooks + shared + types
    ↓
apps/web              → depends on ui + hooks
apps/mobile           → depends on ui + hooks
```

---

## Web Bundler (Vite)

```typescript
// apps/web/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm}'],
        runtimeCaching: [
          {
            urlPattern: /\/wasm\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'wasm-cache',
              expiration: { maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ],
      },
    }),
  ],

  // Resolve platform files (.web.ts > .ts)
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js'],
  },

  // Required for SharedArrayBuffer (WASM multi-threading)
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },

  // Treat WASM as assets (loaded via fetch, not bundled)
  assetsInclude: ['**/*.wasm'],

  build: {
    target: 'es2022', // Modern JS — no legacy polyfills
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for caching
          'react-vendor': ['react', 'react-dom'],
          'rn-web-vendor': ['react-native-web'],
          'state-vendor': ['zustand', '@tanstack/react-query'],
        },
      },
    },
  },
});
```

---

## Mobile Bundler (Metro + Expo)

Metro configuration:

```javascript
// apps/mobile/metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Resolve shared packages from monorepo
config.watchFolders = [path.resolve(__dirname, '../../packages')];

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../../node_modules'),
];

// Platform extension resolution order
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
```

---

## Package Build (tsup)

All packages use `tsup` for fast, zero-config TypeScript compilation:

```typescript
// packages/image-core/tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true, // Generate .d.ts files
  clean: true, // Clean dist/ before build
  sourcemap: true,
  external: [
    // Don't bundle peer deps
    'react',
    'react-native',
    '@imageforge/types',
    '@imageforge/shared',
  ],
  splitting: true, // Code splitting for ESM
  treeshake: true,
});
```

---

## Remote Cache (Vercel / Turborepo Cloud)

CI uses Turborepo remote cache to avoid re-building unchanged packages:

```yaml
# GitHub Actions — enable remote cache
- name: Build with Turbo
  run: pnpm build
  env:
    TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
    TURBO_TEAM: ${{ vars.TURBO_TEAM }}
```

Local developers can also use the cache: `turbo login && turbo link`.

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
