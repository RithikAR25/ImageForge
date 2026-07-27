# Android Release Guide

> **Document ID**: deployment/android-release
> **Phase**: 9 — Deployment
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

Step-by-step guide for building and releasing the ImageForge Android app to Google Play using Expo EAS Build.

---

## Prerequisites

- Google Play Developer account ($25 one-time)
- App created in Google Play Console (Package: `com.imageforge.app`)
- EAS CLI installed and logged in
- `google-services.json` configured (if Firebase used — currently N/A)

---

## Build Profiles (eas.json)

```json
{
  "build": {
    "development": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle",
        "autoIncrement": "versionCode"
      }
    }
  }
}
```

**Note**: Always use `app-bundle` (.aab) for Play Store submissions — Google requires AAB format. APK is only for direct/internal distribution.

---

## Build & Submit

```bash
# Build production Android bundle
eas build --platform android --profile production

# Submit to Google Play (Internal Testing track first)
eas submit --platform android --profile production \
  --track internal

# Promote to Production track via Google Play Console
# (manual step — or use --track production directly)
```

---

## Google Play Tracks

| Track          | Audience             | Review Required |
| -------------- | -------------------- | --------------- |
| Internal       | Up to 100 testers    | No              |
| Closed (Alpha) | Invited testers      | No              |
| Open (Beta)    | Any Google account   | No              |
| Production     | All Play Store users | Yes (3-7 days)  |

Recommended release flow: Internal → Closed Beta → Production

---

## Play Store Checklist

### Before Submission

- [ ] `versionCode` incremented in `app.json`
- [ ] CHANGELOG.md updated
- [ ] All internal + beta tests passed
- [ ] Screenshots captured (phone + 7" tablet)
- [ ] Feature graphic created (1024×500px)
- [ ] Full description updated (if changed)
- [ ] Short description ≤ 80 characters
- [ ] Privacy policy URL is live and accessible

### Content Rating

- [ ] Content rating questionnaire completed (IARC system)
- [ ] Expected rating: PEGI 3 / Everyone

### Data Safety

- [ ] Data Safety form completed in Play Console
- Data collected: None (image processing is on-device)
- Data shared: None

---

## Signing

EAS manages the Android keystore automatically. The keystore is stored encrypted in EAS:

```bash
# View current keystore info
eas credentials --platform android

# Download keystore (for backup or migration)
eas credentials --platform android
# → "Download existing keystore"
```

> ⚠️ **Critical**: Back up the keystore. Losing it means you can never update the app on the same package name.

---

_Document Owner: Engineering Team | Approved: 2026-07-27_
