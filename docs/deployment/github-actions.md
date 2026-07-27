# GitHub Actions CI/CD

> **Document ID**: deployment/github-actions
> **Phase**: 9 — Deployment
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

This document describes all GitHub Actions workflows powering the ImageForge CI/CD pipeline.

---

## Workflow Overview

```
.github/workflows/
├── ci.yml              ← Runs on every PR (lint, typecheck, test)
├── e2e.yml             ← E2E tests on merge to main
├── deploy-web.yml      ← Deploy web app to Vercel on main push
├── release.yml         ← Publish packages + create GitHub Release
├── benchmarks.yml      ← Weekly performance benchmarks
└── security.yml        ← Weekly npm audit + CodeQL scan
```

---

## `ci.yml` — Pull Request Checks

```yaml
name: CI

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  ci:
    name: Lint + Typecheck + Test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build packages
        run: pnpm build
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ vars.TURBO_TEAM }}

      - name: Lint
        run: pnpm lint

      - name: Typecheck
        run: pnpm typecheck

      - name: Unit Tests
        run: pnpm test --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

      - name: Check bundle size
        run: npx bundlesize --config .bundlersizerc
```

---

## `deploy-web.yml` — Production Deployment

```yaml
name: Deploy Web

on:
  push:
    branches: [main]

jobs:
  deploy:
    name: Deploy to Vercel Production
    runs-on: ubuntu-latest
    environment: production

    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter ./apps/web build
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}

      - name: Deploy to Vercel
        run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Run smoke tests
        run: npx playwright test --project=production-smoke
        env:
          TEST_BASE_URL: https://imageforge.app
```

---

## `release.yml` — Package Release

```yaml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    name: Release packages
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Create Release PR or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm release
          title: 'chore: version packages'
          commit: 'chore: version packages'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## Required GitHub Secrets

| Secret              | Description                  |
| ------------------- | ---------------------------- |
| `TURBO_TOKEN`       | Turborepo remote cache token |
| `VERCEL_TOKEN`      | Vercel deployment token      |
| `VERCEL_ORG_ID`     | Vercel organization ID       |
| `VERCEL_PROJECT_ID` | Vercel project ID            |
| `NPM_TOKEN`         | npm publish token            |
| `CODECOV_TOKEN`     | Codecov coverage upload      |

---

_Document Owner: Engineering Team | Approved: 2026-07-27_
