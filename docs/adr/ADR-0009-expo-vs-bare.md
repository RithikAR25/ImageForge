# ADR-0009: Expo Managed Workflow vs. Bare React Native

**Date**: 2026-07-27  
**Status**: Accepted  
**Deciders**: Architecture Team

---

## Context

The ImageForge mobile application (Android + iOS) is built with React Native. We need to decide whether to use Expo's Managed Workflow, Expo's Bare Workflow, or plain (non-Expo) React Native.

This is a foundational decision that affects: native module integration, CI/CD, OTA updates, and the contributor onboarding experience.

---

## Decision Drivers

- OTA (Over-the-Air) updates for JS bundle without app store re-review
- Simplified CI/CD (EAS Build for both Android and iOS)
- Native module requirements (custom libvips integration, camera, file system)
- Open-source contributor accessibility (new contributors must set up quickly)
- Long-term maintainability

---

## Considered Options

### Option A: Expo Managed Workflow (Chosen)

Expo manages native code. Custom native modules integrated via Config Plugins.

### Option B: Expo Bare Workflow

Expo tools (EAS Build, OTA) but direct access to `android/` and `ios/` native directories.

### Option C: Plain React Native (no Expo)

Standard React Native without any Expo tooling.

---

## Decision Outcome

**Chosen option: Option A — Expo Managed Workflow with Config Plugins**

---

## Pros and Cons

### Option A: Expo Managed (Chosen)

**Pros**:

- No `android/` or `ios/` directories in the repo — massive reduction in complexity
- OTA updates via EAS Update (JS-only changes deployed without app store review)
- EAS Build handles all native compilation
- Config Plugins allow injecting native code without ejecting
- Fastest contributor onboarding: `npx expo start` and it works
- Expo SDK provides well-tested implementations of camera, file system, etc.

**Cons**:

- Cannot use arbitrary native modules (must have Expo module or Config Plugin)
- Some cutting-edge React Native features arrive in Expo SDK later
- Less control over native build configuration

**Acceptable because**: All required native capabilities (image processing, camera, file system, share) have either Expo SDK equivalents or Config Plugin solutions.

### Option B: Expo Bare Workflow

**Pros**: Full native control + EAS tools
**Cons**:

- `android/` and `ios/` directories in repo add massive complexity
- Native code conflicts are a contributor experience killer
- Must manually manage Android/iOS build configs

**Not chosen because**: The Config Plugin approach of Managed Workflow solves all our native requirements without the native directory overhead.

### Option C: Plain React Native

**Pros**: Maximum control
**Cons**:

- No EAS Build (must configure custom CI)
- No OTA updates (must use third-party like CodePush)
- All native setup (Xcode, Android Studio, provisioning profiles) must be done by each contributor
- Worst contributor experience
- Loses Expo's tested implementations

---

## Config Plugin Strategy for Custom Native Modules

For custom native code not available in Expo SDK:

1. **Check Expo SDK first**: Most common needs (camera, file system, secure storage) are covered
2. **Check community Expo modules**: Many community packages are Expo-compatible
3. **Write a Config Plugin**: For custom native code, write a Config Plugin that modifies the native project during `expo prebuild`
4. **Eject contingency**: If a Config Plugin cannot satisfy the requirement, evaluate bare workflow migration (documented procedure exists)

---

## Consequences

**Good**:

- New contributors run `pnpm install && npx expo start` and have a working app in < 5 minutes
- OTA updates dramatically reduce app store review wait times for JS-only fixes
- EAS Build handles complex iOS provisioning and Android signing

**Bad**:

- Config Plugin development requires native code knowledge
- Some Expo SDK APIs are slower to adopt new native features vs. community packages
- Expo's managed environment has periodic breaking changes on major SDK upgrades

---

## References

- [Expo Managed Workflow Docs](https://docs.expo.dev/workflow/managed-vs-bare/)
- [Expo Config Plugins](https://docs.expo.dev/config-plugins/introduction/)
- [DL-005 in Decision Log](../DECISION_LOG.md)
