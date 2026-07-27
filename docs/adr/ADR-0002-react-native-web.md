# ADR-0002: React Native Web for Cross-Platform Web Support

**Date**: 2026-07-27  
**Status**: Accepted  
**Deciders**: Architecture Team

---

## Context

ImageForge must deliver a first-class web experience ("Live Demo") while sharing as much code as possible with the Android and iOS mobile applications. We needed to decide the web technology strategy.

The fundamental tension: React Native is the chosen mobile framework (for its excellent cross-platform support, TypeScript integration, and ecosystem). The question is whether the web app should be a separate React web project, or whether React Native Web can bridge the gap.

---

## Decision Drivers

- Code sharing between mobile and web is a primary architectural goal (>75% target)
- The web app must feel native and professional (not a "ported" app)
- Web processing performance is critical (WASM-based)
- SEO is secondary (image processing tool, not content site)
- Drag & Drop and Clipboard APIs are web-specific — must be accommodated
- The web app must pass Lighthouse PWA requirements

---

## Considered Options

### Option A: React Native Web (Chosen)

Use `react-native-web` to render React Native components on the DOM. Same component code works on Web and Mobile.

### Option B: Next.js (Separate Web App)

Separate Next.js application for Web. Share only business logic (processing pipeline) as npm packages with the mobile app.

### Option C: Expo Router + Expo Web

Use Expo Router's built-in web support (which also uses React Native Web under the hood, but managed by Expo).

### Option D: Vanilla React (Create React App / Vite)

Separate React app with custom component library that parallels the React Native components.

---

## Decision Outcome

**Chosen option: Option A — React Native Web with Vite**

Combined with **Option C** (Expo Router for navigation) as a complement — Expo Router provides file-based routing that works on both Web and Mobile.

The hybrid: `apps/web` uses Vite as the web bundler, RNW as the rendering layer, and Expo Router for routing.

---

## Pros and Cons of the Options

### Option A: React Native Web (Chosen)

**Pros**:

- Components written once render on Web, Android, iOS
- `StyleSheet.create` works identically on all platforms
- State management (Zustand) fully shared
- Business logic fully shared
- Animations (Reanimated) have Web support
- Skia has a Web (CanvasKit) implementation

**Cons**:

- `StyleSheet.create` is less expressive than CSS
- Some RNW components have Web-specific limitations (Modal, FlatList perf)
- React Native Web has slower feature velocity than React Native itself
- Bundle size includes RNW runtime overhead (~50KB gzipped)

### Option B: Next.js

**Pros**:

- Best-in-class React web framework (SSR, ISR, App Router)
- Excellent SEO support
- Large ecosystem

**Cons**:

- Zero component sharing with React Native (different component APIs)
- Requires maintaining parallel component libraries
- SEO is not a priority for an image processing tool
- Results in ~40% shared code instead of >75%
- Significant development effort duplication

### Option C: Expo Router

**Pros**:

- Seamless navigation sharing between mobile and web
- Managed by Expo (same team)
- File-based routing familiar to Next.js developers

**Cons**:

- Less control over web bundling than Vite
- Expo Router web support is newer and occasionally lags
- Not as battle-tested for complex web SPAs

**Note**: Expo Router is used for **routing** within Option A, not as the bundler.

### Option D: Vanilla React

**Pros**: Full CSS control, best web performance
**Cons**: Near-zero code sharing with mobile; essentially building two separate apps

---

## Consequences

**Good**:

- Single codebase for all three platforms
- UI changes benefit all platforms simultaneously
- Shared design tokens, animations, and state
- Engineers can work across platforms without context switching

**Bad**:

- Some web-specific CSS patterns not expressible in `StyleSheet`
- Platform-specific components (`.web.ts`) still needed for some UI
- RNW's `FlatList` performance is not as good as `@shopify/flash-list` on Web — use `RecyclerListView` or custom virtualization
- Initial setup and Metro/Vite configuration requires careful alignment

---

## Migration Path (If Wrong)

If React Native Web proves insufficient for the web app's quality requirements, the migration path is:

1. Extract all business logic into `@imageforge/*` packages (already done by design)
2. Build a new `apps/web-next` using Next.js that imports from `@imageforge/*`
3. The investment in shared packages is preserved

---

## References

- [React Native Web Documentation](https://necolas.github.io/react-native-web/)
- [DL-002 in Decision Log](../DECISION_LOG.md)
- [27-shared-code-strategy.md](../27-shared-code-strategy.md)
- [28-platform-abstraction.md](../28-platform-abstraction.md)
