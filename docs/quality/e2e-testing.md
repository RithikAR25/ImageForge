# E2E Testing Guide

> **Document ID**: quality/e2e-testing
> **Phase**: 8 — Quality
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

This document defines the E2E testing strategy for ImageForge using Playwright — covering test structure, fixtures, CI integration, and critical test scenarios.

---

## Technology

- **Framework**: Playwright 1.x
- **Languages**: TypeScript
- **Browsers**: Chromium, Firefox, WebKit (Safari)
- **Reports**: HTML report + trace viewer for failures

---

## Test Structure

```
apps/web/e2e/
├── fixtures/
│   ├── test-images/          # Sample JPEG, PNG, WebP, HEIC, GIF
│   └── setup.ts              # Playwright fixtures
├── tests/
│   ├── core/
│   │   ├── import.spec.ts    # File import flows
│   │   ├── compress.spec.ts  # Compression
│   │   ├── resize.spec.ts    # Resize
│   │   ├── crop.spec.ts      # Crop
│   │   ├── export.spec.ts    # Download/export
│   │   └── undo.spec.ts      # History/undo
│   ├── batch/
│   │   ├── queue.spec.ts     # Batch queue
│   │   └── zip-export.spec.ts # ZIP download
│   ├── settings/
│   │   └── settings.spec.ts
│   └── smoke/
│       └── smoke.spec.ts     # Critical path smoke test
├── playwright.config.ts
└── tsconfig.json
```

---

## Core Test Scenarios

### Import Tests

```typescript
// e2e/tests/core/import.spec.ts

test('should import JPEG via file picker', async ({ page, testImagePath }) => {
  await page.goto('/');

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(testImagePath('5mp.jpg'));

  await expect(page.locator('[data-testid="thumbnail-list"]')).toBeVisible();
  await expect(page.locator('[data-testid="thumbnail-item"]')).toHaveCount(1);
});

test('should reject PDF with error toast', async ({ page }) => {
  await page.goto('/');

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('fixtures/test-files/document.pdf');

  await expect(page.locator('[data-testid="toast-error"]')).toBeVisible();
  await expect(page.locator('[data-testid="thumbnail-item"]')).toHaveCount(0);
});

test('should import image via clipboard paste', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.clipboard.writeText('')); // Clear

  // Simulate clipboard paste event with image data
  await page.dispatchEvent('body', 'paste', { clipboardData: ... });

  await expect(page.locator('[data-testid="thumbnail-item"]')).toHaveCount(1);
});
```

### Compress Test

```typescript
test('should compress 5MP JPEG and produce smaller file', async ({ page }) => {
  await importTestImage(page, '5mp.jpg');
  await page.locator('[data-testid="thumbnail-item"]').click();

  // Apply compress with Q=85
  await page.locator('[data-testid="quality-slider"]').fill('85');
  await page.locator('[data-testid="apply-compress-btn"]').click();

  // Wait for processing
  await expect(page.locator('[data-testid="processing-spinner"]')).not.toBeVisible({
    timeout: 10000,
  });

  // Output size should be shown and < input
  const outputSize = await page.locator('[data-testid="output-file-size"]').textContent();
  expect(parseFileSize(outputSize)).toBeLessThan(3.8 * 1024 * 1024); // < 3.8MB original
});
```

### Privacy Test — Critical

```typescript
test('CRITICAL: no image data sent to network', async ({ page }) => {
  const networkRequests: string[] = [];

  page.on('request', (req) => {
    // Capture all non-WASM, non-asset requests
    if (!req.url().includes('.wasm') && !req.url().includes('/assets/')) {
      networkRequests.push(req.url());
    }
  });

  await page.goto('/');
  await importTestImage(page, '5mp.jpg');
  await compressImage(page);
  await downloadImage(page);

  // No image data should have been sent anywhere
  const imageRequests = networkRequests.filter(
    (url) => !url.includes('fonts.googleapis.com') && !url.includes('imageforge.app/assets'),
  );

  expect(imageRequests).toHaveLength(0);
});
```

---

## CI Configuration

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: pnpm install
      - run: pnpm build --filter=@imageforge/web
      - run: npx playwright install --with-deps
      - run: pnpm e2e
        env:
          CI: true
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

_Document Owner: Engineering Team | Approved: 2026-07-27_
