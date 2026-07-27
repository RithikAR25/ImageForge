# Deployment Guide

> **Document ID**: 81
> **Phase**: 6 — DevOps & Infrastructure
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: DevOps Team

---

## Purpose

This document defines the deployment procedures for ImageForge across all three platforms: Web (Vercel), Android (Play Store), and iOS (App Store).

---

## Web Deployment (Vercel)

### Automatic Deployment

Every merge to `main` triggers an automatic deployment to Vercel production.

```
main branch merge
    ↓
GitHub Actions: deploy-web.yml
    ↓
Vercel Build (turbo run build --filter=apps/web)
    ↓
Vercel Edge Network: https://imageforge.app
```

No manual steps required for web deployment in normal operation.

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to preview
cd apps/web
vercel

# Deploy to production
vercel --prod
```

### Vercel Environment Variables

Set in Vercel Dashboard → Project → Settings → Environment Variables:

| Variable           | Value                    | Required |
| ------------------ | ------------------------ | -------- |
| `VITE_APP_VERSION` | `$VERCEL_GIT_COMMIT_SHA` | No       |
| `SENTRY_DSN`       | From Sentry dashboard    | No       |
| `TURBO_TOKEN`      | From Vercel Remote Cache | No       |

---

## Android Deployment (EAS Build)

### Prerequisites

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login
```

### Build Commands

```bash
cd apps/mobile

# Development build (internal testing)
eas build --platform android --profile development

# Production build (Play Store)
eas build --platform android --profile production

# Preview build (APK for testing)
eas build --platform android --profile preview
```

### eas.json Profiles

```json
// apps/mobile/eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "android": {
        "buildType": "aab",
        "gradleCommand": ":app:bundleRelease"
      }
    }
  }
}
```

### Play Store Submission

```bash
# Submit to Google Play (requires Google Service Account)
eas submit --platform android --latest

# Or specify a build
eas submit --platform android --id <build-id>
```

---

## iOS Deployment (EAS Build)

### Build Commands

```bash
cd apps/mobile

# Development build
eas build --platform ios --profile development

# Production build (App Store)
eas build --platform ios --profile production
```

### App Store Submission

```bash
# Submit to App Store Connect
eas submit --platform ios --latest
```

### Required Credentials

- Apple Developer Account ($99/year)
- Provisioning Profile (managed by EAS)
- Distribution Certificate (managed by EAS)

EAS handles provisioning and signing automatically using `EAS_APPLE_TEAM_ID` and `EAS_APPLE_APP_SPECIFIC_PASSWORD`.

---

## Release Checklist

### Web Release

- [ ] CI all green on `main`
- [ ] Lighthouse Performance ≥ 85
- [ ] No console errors in production build
- [ ] WASM loads and processes correctly
- [ ] Service Worker registers and caches assets

### Mobile Release

- [ ] EAS build succeeds
- [ ] Tested on iOS 15 device
- [ ] Tested on Android 9 device
- [ ] All permissions explained in-app
- [ ] App Store screenshots up to date
- [ ] Play Store listing up to date
- [ ] Version number bumped in `package.json` + `app.json`

### Version Tagging

```bash
# After all checks pass
git tag v1.0.0
git push origin v1.0.0

# This triggers the release workflow
```

---

## Rollback Procedures

### Web Rollback

```bash
# List recent deployments
vercel ls

# Rollback to a specific deployment
vercel rollback [deployment-url]
```

### Mobile Rollback

- Android: Use Play Store "Release management" to halt a release
- iOS: Use App Store Connect "Manage Releases" to pause rollout
- For critical issues: EAS Update to push a JS-only fix without store review

---

## Related Documents

| Document                                       | Relationship        |
| ---------------------------------------------- | ------------------- |
| [80-ci-cd.md](./80-ci-cd.md)                   | CI/CD workflows     |
| [ADR-0009](./adr/ADR-0009-expo-vs-bare.md)     | EAS / Expo decision |
| [11-mvp-definition.md](./11-mvp-definition.md) | Launch checklist    |

---

_Document Owner: DevOps Team | Approved: 2026-07-27_
