# Release Checklist

> **Document ID**: quality/release-checklist
> **Phase**: 8 — Quality
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

This checklist must be completed before every public release (web deploy and mobile app submission).

---

## Pre-Release Checklist

### Code Quality

- [ ] All CI checks green (lint, typecheck, unit tests, E2E tests)
- [ ] Test coverage ≥ 80%
- [ ] No `console.log` statements in production code
- [ ] No TypeScript `any` types in production code
- [ ] No `TODO` comments that block release

### Functionality

- [ ] Core compress workflow tested (JPEG, PNG, WebP)
- [ ] Batch processing tested (10+ images)
- [ ] Undo/redo tested
- [ ] Export tested (download, share)
- [ ] Settings persistence tested (close/reopen)
- [ ] HEIC import tested

### Performance

- [ ] Lighthouse Performance ≥ 85
- [ ] Lighthouse Accessibility ≥ 90
- [ ] FCP ≤ 1.5s (measured on slow 3G simulated)
- [ ] Single 5MP JPEG compress < 500ms
- [ ] No memory leaks (batch 50 images, check memory in DevTools)

### Security

- [ ] `npm audit` — zero high/critical vulnerabilities
- [ ] CSP headers verified in production
- [ ] HTTPS enforced
- [ ] No sensitive data in error logs
- [ ] SVG imports sanitized (DOMPurify)

### Accessibility

- [ ] Keyboard navigation tested (Tab, Enter, Escape, arrow keys)
- [ ] axe-core scan — zero violations
- [ ] Color contrast verified (WCAG AA)
- [ ] Reduced-motion mode tested

### Web Specific

- [ ] PWA installable (Lighthouse PWA check)
- [ ] Offline mode tested (DevTools → Network → Offline)
- [ ] Service Worker updated correctly
- [ ] All WASM modules load from cache (second visit)
- [ ] File drag-and-drop working (Chrome, Firefox, Safari)
- [ ] Clipboard paste working

### Mobile Specific (iOS)

- [ ] Tested on iPhone (latest iOS)
- [ ] Tested on iPad (latest iPadOS)
- [ ] Gallery import working
- [ ] Camera capture working
- [ ] Save to Photos working
- [ ] Share sheet working

### Mobile Specific (Android)

- [ ] Tested on Android 9 device
- [ ] Tested on Android 14 (latest)
- [ ] Gallery import working
- [ ] Camera capture working
- [ ] Share intent working

### Documentation

- [ ] CHANGELOG.md updated with release notes
- [ ] Version bumped (`package.json`, `app.json`)
- [ ] Breaking changes documented
- [ ] Migration guide written (if breaking)

### Deployment

- [ ] Git tag created (`git tag v1.x.x`)
- [ ] GitHub Release created with changelog
- [ ] Web deployed to Vercel production
- [ ] iOS build submitted to App Store (if mobile release)
- [ ] Android build submitted to Google Play (if mobile release)

---

## Post-Release Monitoring (24h)

- [ ] No spike in error reports
- [ ] Web analytics: normal bounce rate
- [ ] No user-reported crashes
- [ ] CDN serving WASM correctly

---

_Document Owner: Engineering Team | Review Cycle: Per-release | Approved: 2026-07-27_
