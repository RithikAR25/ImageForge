# iOS Release Guide

> **Document ID**: deployment/ios-release
> **Phase**: 9 — Deployment
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

Step-by-step guide for building and releasing the ImageForge iOS app to the App Store using Expo EAS Build.

---

## Prerequisites

- Apple Developer Program membership ($99/year)
- App Store Connect app record created (Bundle ID: `com.imageforge.app`)
- EAS CLI installed: `npm install -g eas-cli`
- Logged in: `eas login`

---

## EAS Build Configuration

```json
// eas.json
{
  "cli": { "version": ">= 7.0.0" },
  "build": {
    "development": {
      "distribution": "internal",
      "ios": { "simulator": false }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "buildConfiguration": "Release"
      }
    },
    "production": {
      "ios": {
        "buildConfiguration": "Release",
        "autoIncrement": "buildNumber"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "developer@imageforge.dev",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCDE12345"
      }
    }
  }
}
```

---

## Build & Submit

```bash
# 1. Build production iOS (runs on EAS cloud)
eas build --platform ios --profile production

# 2. Submit to App Store (uses TestFlight automatically)
eas submit --platform ios --profile production

# Or: build + submit in one step
eas build --platform ios --profile production --auto-submit
```

---

## App Store Checklist

### Before Submission

- [ ] Version and build number updated in `app.json`
- [ ] `pnpm changeset version` run
- [ ] CHANGELOG.md updated
- [ ] All TestFlight tests passed (internal + external)
- [ ] Screenshots captured at required sizes (6.5", 5.5", iPad)
- [ ] App description updated (if changed)
- [ ] Age rating reviewed (12+)
- [ ] Privacy policy URL is live

### App Store Connect Settings

- [ ] What's New in This Version filled out
- [ ] Release type: Manual or Automatic (recommend Manual for v1.0)
- [ ] App Review Notes: "No login required. All processing is on-device."
- [ ] Export Compliance: HTTPS only, no encryption (answer: No)

---

## Certificates and Signing

EAS handles all signing automatically. Certificates are stored in EAS servers. To rotate:

```bash
eas credentials
# Interactive menu to manage certificates, provisioning profiles
```

---

## TestFlight Distribution

```bash
# Internal testers (team) — available immediately after build
eas build --platform ios --profile preview

# External testers — requires Apple review (1-3 days)
# Submit to TestFlight external group via App Store Connect
```

---

_Document Owner: Engineering Team | Approved: 2026-07-27_
