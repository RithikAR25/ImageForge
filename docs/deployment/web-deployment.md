# Web Deployment Guide

> **Document ID**: deployment/web-deployment
> **Phase**: 9 — Deployment
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

Step-by-step guide for deploying the ImageForge web application to Vercel production.

---

## Infrastructure

| Component       | Provider            | URL                    |
| --------------- | ------------------- | ---------------------- |
| Web Hosting     | Vercel              | imageforge.app         |
| WASM CDN        | Vercel Edge Network | (same domain)          |
| Domain DNS      | Cloudflare          | (nameservers → Vercel) |
| Analytics       | None (privacy)      | —                      |
| Error Reporting | Optional (Sentry)   | —                      |

---

## Vercel Configuration

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(self), microphone=(), geolocation=()" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' blob: data:; connect-src 'self'; object-src 'none'; frame-src 'none';"
        }
      ]
    },
    {
      "source": "/wasm/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=2592000, immutable" },
        { "key": "Cross-Origin-Resource-Policy", "value": "same-origin" }
      ]
    },
    {
      "source": "/(.*).js",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ],
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

> **Critical**: The `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` headers are **required** for `SharedArrayBuffer` (WASM threading). These are set via Vite dev server and must be replicated in `vercel.json` for production.

---

## Deployment Steps

### Automatic (on main branch push)

CI/CD handles deployment automatically:

```
Push to main
    ↓ GitHub Actions
    → pnpm build (Turbo)
    → Vercel CLI deploys (via VERCEL_TOKEN)
    → Production URL updated
    → Smoke test runs (Playwright)
```

### Manual (emergency)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (from apps/web directory)
cd apps/web
vercel --prod
```

---

## Environment Variables

| Variable                | Description                | Set In              |
| ----------------------- | -------------------------- | ------------------- |
| `VITE_APP_VERSION`      | App version string         | Vercel env          |
| `VITE_SENTRY_DSN`       | Error reporting (optional) | Vercel env (secret) |
| `VITE_ENABLE_ANALYTICS` | Analytics flag             | Vercel env          |
| `VITE_WASM_BASE_URL`    | WASM CDN base URL          | Vercel env          |

---

## Rollback

```bash
# List recent deployments
vercel ls --prod

# Instant rollback to previous deployment
vercel rollback [deployment-url]
```

---

## Post-Deploy Verification

Automated smoke tests run via GitHub Actions after every deploy:

```yaml
- name: Smoke Test Production
  run: npx playwright test --project=production-smoke
  env:
    TEST_BASE_URL: https://imageforge.app
```

Checks:

- Homepage loads
- Import works (drag & drop)
- Compression completes
- Download works
- PWA installable

---

_Document Owner: Engineering Team | Approved: 2026-07-27_
