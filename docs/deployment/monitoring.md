# Monitoring & Observability

> **Document ID**: deployment/monitoring
> **Phase**: 9 — Deployment
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

This document defines the monitoring strategy for ImageForge — what is monitored, how alerts are triggered, and how incidents are investigated.

---

## Monitoring Philosophy

ImageForge is a **client-side** application — there is no server to monitor. Monitoring focuses on:

1. **Web app availability** (is the site up? are assets loading?)
2. **Error rates** (are users encountering errors? optional, with consent)
3. **Performance** (is the app fast enough?)
4. **App store metrics** (crash-free rate, ratings)

---

## Web App Monitoring

### Availability (Vercel)

Vercel provides automatic uptime monitoring:

- CDN health checks every 60s
- Incident alerts via email/Slack
- Status page: status.vercel.com

### Synthetic Monitoring (Playwright Cloud)

Automated end-to-end tests run every 15 minutes in production:

```yaml
# Checks run every 15 minutes:
- Homepage loads within 3s (LCP)
- WASM loads from Service Worker cache (second visit)
- Import a test image (4MB JPEG)
- Compress at Q=85
- Verify output size < input size
- Download works
```

Alerts via email if any check fails 2× in a row.

### Performance Monitoring (Web Vitals)

Web Vitals are measured on real user sessions (only if user opted into analytics):

| Metric                         | Target  | Alert Threshold |
| ------------------------------ | ------- | --------------- |
| LCP (Largest Contentful Paint) | ≤ 2.5s  | > 4s            |
| FID / INP (Interaction)        | ≤ 200ms | > 500ms         |
| CLS (Layout Shift)             | ≤ 0.1   | > 0.25          |
| TTFB (Time to First Byte)      | ≤ 800ms | > 1.5s          |

---

## Error Monitoring (Optional — Sentry)

Sentry is configured but **disabled by default**. Error reporting is only enabled when:

1. User has explicitly opted in to analytics
2. No image data is ever included in error reports

```typescript
// Only init Sentry if user opted in
if (settingsStore.analyticsEnabled) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,

    beforeSend(event) {
      // Strip any potential user data
      delete event.user;
      delete event.request?.headers;
      // Never include image buffer data
      return event;
    },

    // Sample 10% of sessions (not 100%)
    tracesSampleRate: 0.1,
  });
}
```

---

## Mobile App Monitoring

| Metric             | Source              | Target  |
| ------------------ | ------------------- | ------- |
| Crash-free rate    | Expo Diagnostics    | ≥ 99.5% |
| ANR rate (Android) | Google Play Console | ≤ 0.5%  |
| App Store rating   | App Store Connect   | ≥ 4.5   |

### Expo Application Services (EAS)

EAS Update provides OTA update monitoring:

- How many devices received the update
- Update success rate
- Rollback capability for bad updates

---

## Incident Response

| Severity | Definition                           | Response Time | Owner       |
| -------- | ------------------------------------ | ------------- | ----------- |
| P0       | App completely down for all users    | < 30min       | Core team   |
| P1       | Core feature broken (compress/batch) | < 2h          | Core team   |
| P2       | Non-core feature broken              | < 24h         | On-call     |
| P3       | Performance degradation              | < 72h         | Engineering |

Incidents are tracked in GitHub Issues with the `incident` label.

---

_Document Owner: Engineering Team | Approved: 2026-07-27_
