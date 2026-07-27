# ImageForge

<div align="center">
  <img src="docs/assets/logo.svg" alt="ImageForge Logo" width="80" height="80" />
  <h3>Professional Image Processing for Everyone</h3>
  <p>Open-source • Privacy-first • Cross-platform • Offline-capable</p>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-imageforge.app-6C63FF?style=for-the-badge)](https://imageforge.app)
[![GitHub Stars](https://img.shields.io/github/stars/imageforge/imageforge?style=for-the-badge&color=6C63FF)](https://github.com/imageforge/imageforge/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-6C63FF?style=for-the-badge)](LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/imageforge/imageforge/ci.yml?style=for-the-badge&label=CI)](https://github.com/imageforge/imageforge/actions)

[**→ Try the Live Demo**](https://imageforge.app) | [**→ Documentation**](docs/README.md) | [**→ Contributing**](CONTRIBUTING.md)
</div>

---

## What is ImageForge?

ImageForge is a **production-grade, open-source image processing platform** that runs entirely in your browser — no uploads, no servers, no privacy compromises.

**🔒 Your images never leave your device.**

Built with React Native + React Native Web, ImageForge delivers the same professional experience on Web, Android, and iOS from a shared TypeScript codebase.

---

## Features

| ✅ Available (MVP)               | 🔜 Coming (Phase 2+)               |
| -------------------------------- | ---------------------------------- |
| Compress (JPEG, PNG, WebP)       | Advanced Filters & LUTs            |
| Resize with social media presets | Image Enhancement (curves, levels) |
| Crop (free, ratio, circle)       | Watermark & Logo overlay           |
| Rotate & Flip                    | Background Removal (AI)            |
| Format Conversion                | GIF Creation                       |
| Batch Processing (500+ images)   | OCR Text Extraction                |
| Undo / Redo History              | PDF Tools                          |
| Dark / Light Theme               | AI Super Resolution                |
| Offline / PWA                    | Plugin System                      |
| HEIC Import                      | Collage Builder                    |

---

## Why ImageForge?

|                         | ImageForge | Squoosh   | iLoveIMG     |
| ----------------------- | ---------- | --------- | ------------ |
| **Privacy (no upload)** | ✅         | ✅        | ❌ Server    |
| **Batch Processing**    | ✅         | ❌        | ✅           |
| **Mobile App**          | ✅         | ❌        | ✅ (limited) |
| **Offline Support**     | ✅         | ✅        | ❌           |
| **Open Source**         | ✅ MIT     | ✅ Apache | ❌           |
| **Pipeline Builder**    | ✅         | ❌        | ❌           |
| **TypeScript SDK**      | ✅         | ❌        | ❌           |

---

## Quick Start

### Web Demo

Visit **[imageforge.app](https://imageforge.app)** — no installation required.

### Install as PWA

In Chrome/Edge: Address bar → Install → "Install ImageForge"

### Mobile Apps

- [Google Play Store](#) _(coming)_
- [Apple App Store](#) _(coming)_

### Use as a Library

```bash
npm install @imageforge/image-core
```

```typescript
import {
  ImagePipeline,
  createCompressOperation,
  createResizeOperation,
} from '@imageforge/image-core';

const pipeline = new ImagePipeline(engine, [
  createCompressOperation({ codec: 'webp', quality: 80 }),
  createResizeOperation({ width: 1080, mode: 'fit', algorithm: 'lanczos3' }),
]);

const result = await pipeline.execute(imageFile);
```

---

## Architecture

ImageForge is a **Turborepo monorepo** with feature-first package structure:

```
ImageForge/
├── apps/
│   ├── web/      ← React Native Web + Vite + WASM
│   └── mobile/   ← Expo + React Native
└── packages/
    ├── image-core/  ← Processing engine (WASM/Native)
    ├── ui/          ← Shared React Native components
    ├── hooks/       ← Shared React hooks
    ├── shared/      ← Utilities, i18n, constants
    └── types/       ← TypeScript definitions
```

**Stack**: React Native · React Native Web · Expo · TypeScript · Zustand · TanStack Query · Skia · libvips WASM · Turborepo · Vite

📖 [**Read the Architecture Documentation →**](docs/20-system-architecture-document.md)

---

## Documentation

The [docs/](docs/) folder contains 140+ professional documentation files:

- [📋 Product Overview](docs/01-project-overview.md)
- [🏗️ System Architecture](docs/20-system-architecture-document.md)
- [📖 ADRs (Why we chose X)](docs/adr/)
- [🚀 Getting Started Guide](docs/71-getting-started.md)
- [🤝 Contributing Guide](CONTRIBUTING.md)

---

## Contributing

Contributions are warmly welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

- 🐛 **Report bugs**: [Open an issue](https://github.com/imageforge/imageforge/issues/new?template=bug_report.md)
- 💡 **Request features**: [GitHub Discussions](https://github.com/imageforge/imageforge/discussions)
- 🔒 **Security issues**: security@imageforge.dev

### Development Setup

```bash
git clone https://github.com/imageforge/imageforge.git
cd imageforge
pnpm install
pnpm --filter apps/web dev  # → http://localhost:5173
```

---

## License

MIT License — see [LICENSE](LICENSE)

---

<div align="center">
  <sub>Built with ❤️ by the ImageForge community | © 2026 ImageForge Contributors</sub>
</div>
