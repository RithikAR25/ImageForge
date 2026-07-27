# Feature Flag Strategy

> **Document ID**: 49c
> **Phase**: 2 — Architecture
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document defines the feature flag (feature toggle) strategy for ImageForge — how experimental features are enabled/disabled without code deployments.

---

## Why Feature Flags?

1. **Dark launches**: Deploy code for a new feature before making it user-visible
2. **A/B testing**: Test two implementations with different user groups
3. **Progressive rollouts**: Enable for 10% → 50% → 100% of users
4. **Kill switch**: Instantly disable a broken feature without redeployment
5. **Beta programs**: Give early access to power users

---

## Flag Types

| Type            | Storage               | Who Sets It | Example                 |
| --------------- | --------------------- | ----------- | ----------------------- |
| **Static**      | Compile-time constant | Developer   | `ENABLE_AVIF_EXPORT`    |
| **Runtime**     | localStorage + remote | App         | `ENABLE_AI_ENHANCEMENT` |
| **User opt-in** | Settings store        | User        | `ENABLE_BETA_FEATURES`  |
| **Env-based**   | `.env` file           | DevOps      | `ENABLE_ANALYTICS`      |

---

## Flag Definitions

```typescript
// packages/shared/src/flags/flags.ts

interface FeatureFlags {
  // MVP (always on in production)
  ENABLE_COMPRESS: boolean;
  ENABLE_RESIZE: boolean;
  ENABLE_CROP: boolean;
  ENABLE_ROTATE: boolean;
  ENABLE_CONVERT: boolean;
  ENABLE_BATCH: boolean;

  // Phase 2 (off by default until released)
  ENABLE_ENHANCE: boolean;
  ENABLE_FILTERS: boolean;
  ENABLE_WATERMARK: boolean;
  ENABLE_BLUR: boolean;
  ENABLE_DRAWING: boolean;
  ENABLE_PLUGIN_SYSTEM: boolean;

  // Phase 3 (experimental)
  ENABLE_GIF_CREATOR: boolean;
  ENABLE_PDF_TOOLS: boolean;
  ENABLE_OCR: boolean;
  ENABLE_BG_REMOVAL: boolean;
  ENABLE_AI_SUPER_RESOLUTION: boolean;

  // Beta (user opt-in)
  ENABLE_AVIF_EXPORT: boolean;
  ENABLE_HEIC_EXPORT: boolean;
  ENABLE_COLLABORATIVE: boolean;
}
```

---

## Flag Resolution

```typescript
// packages/shared/src/flags/useFeatureFlag.ts

function useFeatureFlag(flag: keyof FeatureFlags): boolean {
  // Priority order (highest wins):
  // 1. URL query param override (?flag_ENABLE_X=true) — dev only
  // 2. User settings (beta opt-in)
  // 3. Remote flags (if configured)
  // 4. Default values (from flags.ts)

  const devOverride = getUrlFlag(flag); // ?flag_X=true
  if (devOverride !== null && __DEV__) return devOverride;

  const userOptIn = getUserOptIn(flag); // Settings store
  if (userOptIn !== null) return userOptIn;

  const remote = getRemoteFlag(flag); // Remote config (future)
  if (remote !== null) return remote;

  return DEFAULT_FLAGS[flag];
}
```

---

## Beta Opt-In

Users can access beta features via Settings → Experimental:

```
⚗️ Experimental Features
────────────────────────
[•] AVIF Export
    Export images in AVIF format (better compression than WebP)
    Status: Beta — may have issues on older browsers

[ ] AI-powered Super Resolution
    Upscale images 2x-4x using AI (requires GPU)
    Status: Beta — may be slow on older devices
```

---

## Current Default States

| Flag                 | Default        | Available Since |
| -------------------- | -------------- | --------------- |
| ENABLE_COMPRESS      | `true`         | v1.0            |
| ENABLE_RESIZE        | `true`         | v1.0            |
| ENABLE_CROP          | `true`         | v1.0            |
| ENABLE_ROTATE        | `true`         | v1.0            |
| ENABLE_CONVERT       | `true`         | v1.0            |
| ENABLE_BATCH         | `true`         | v1.0            |
| ENABLE_AVIF_EXPORT   | `false` (beta) | v1.1            |
| ENABLE_ENHANCE       | `false`        | v2.0            |
| ENABLE_PLUGIN_SYSTEM | `false`        | v2.0            |
| ENABLE_GIF_CREATOR   | `false`        | v3.0            |

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
