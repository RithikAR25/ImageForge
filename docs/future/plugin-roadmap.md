# Plugin Roadmap

> **Document ID**: future/plugin-roadmap
> **Phase**: 10 — Future
> **Status**: Planning
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

Detailed roadmap for the ImageForge Plugin System — marketplace, API evolution, and community ecosystem plans.

---

## Phase 2: Plugin Alpha (Core Infrastructure)

**Goal**: Deliver a working sandboxed plugin API for early adopters.

| Milestone                             | Description                       | Target |
| ------------------------------------- | --------------------------------- | ------ |
| Plugin sandbox                        | iframe + postMessage isolation    | v1.1.0 |
| Plugin manifest format                | JSON schema + validation          | v1.1.0 |
| Plugin loader                         | Dynamic loading from URL          | v1.1.0 |
| Plugin SDK (`@imageforge/plugin-sdk`) | TypeScript SDK, npm publish       | v1.1.0 |
| Config UI auto-generation             | Schema → controls rendering       | v1.1.0 |
| Developer portal                      | Docs site for plugin authors      | v1.2.0 |
| Registry (basic)                      | Manual review, URL-based registry | v1.2.0 |

---

## Phase 2.5: Plugin Marketplace

| Milestone            | Description                      | Target |
| -------------------- | -------------------------------- | ------ |
| Marketplace UI       | Browse, install, rate plugins    | v1.5.0 |
| Plugin sandboxing v2 | CSP enforcement, fetch whitelist | v1.5.0 |
| Featured plugins     | Curated by ImageForge team       | v1.5.0 |
| Plugin analytics     | Install counts (anonymous)       | v1.5.0 |

**First-Party Plugins Shipped With Marketplace**:

| Plugin                        | Category | Description                   |
| ----------------------------- | -------- | ----------------------------- |
| `imageforge.vintage`          | Effects  | Film emulation filters        |
| `imageforge.social-optimizer` | Export   | Platform-specific sizing      |
| `imageforge.watermark-pro`    | Effects  | Advanced watermark templates  |
| `imageforge.face-blur`        | Privacy  | Auto face detection + blur    |
| `imageforge.color-analyzer`   | Analysis | Palette extraction, histogram |

---

## Phase 3: Plugin Ecosystem Maturity

| Feature                        | Description                             |
| ------------------------------ | --------------------------------------- |
| Plugin monetization            | Paid plugins via Stripe (revenue share) |
| Plugin versioning              | Auto-update mechanism                   |
| Plugin localization            | i18n support in plugin config UI        |
| Custom export destinations     | Plugin type for export adapters         |
| Plugin-to-plugin communication | Approved message protocol               |

---

## Plugin API Evolution (Versioned)

| Plugin API Version | Features                                  | Compatibility               |
| ------------------ | ----------------------------------------- | --------------------------- |
| v1 (Phase 2)       | Process operations, config schema         | SDK 1.x                     |
| v2 (Phase 3)       | + Export destinations, custom UI panels   | SDK 2.x, backward-compat v1 |
| v3 (Phase 4)       | + AI model integration, batch event hooks | SDK 3.x                     |

Breaking changes to the Plugin API require a minimum **6-month deprecation period** and migration tooling.

---

## Security Roadmap for Plugins

| Phase     | Security Feature                         |
| --------- | ---------------------------------------- |
| Phase 2   | iframe sandbox, postMessage only         |
| Phase 2.5 | CSP per-plugin, fetch domain whitelist   |
| Phase 3   | WASM-only plugins (no DOM access at all) |
| Phase 4   | Hardware attestation for signed plugins  |

---

_Document Owner: Architecture Team | Status: Planning | Last Updated: 2026-07-27_
