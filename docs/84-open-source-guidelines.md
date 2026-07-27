# Open Source Guidelines

> **Document ID**: 84
> **Phase**: 5 — Technical Specifications
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

This document establishes the standards for maintaining ImageForge as a healthy, welcoming open-source project — covering license compliance, community management, governance, and sustainability.

---

## License

ImageForge is licensed under the **MIT License**:

- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ No warranty or liability

All contributed code must be compatible with MIT (i.e., no GPL-licensed code in the main application bundle).

**Exception**: WASM modules (pngquant — GPLv3) are acceptable because they are loaded at runtime, not bundled into the application, and are subject to the GPLv3 "binary distribution" exception. Legal review required before commercialization.

---

## Contributor License Agreement (CLA)

All contributors must sign the CLA before their first PR is merged:

> "I confirm that I have the right to submit this contribution, and that I agree to the Contributor License Agreement of the ImageForge project."

CLA is managed via [CLA Assistant](https://cla-assistant.io/) — a GitHub bot that automatically requests signing.

---

## Governance Model

ImageForge follows the **Benevolent Dictator For Now (BDFN)** model:

| Role                 | Responsibility                                                 |
| -------------------- | -------------------------------------------------------------- |
| **Core Maintainer**  | Architecture decisions, final PR approval, releases            |
| **Committer**        | Regular contributors with merge rights on non-architecture PRs |
| **Contributor**      | Anyone who submits a PR                                        |
| **Community Member** | Issues, discussions, feature requests                          |

Promotion path: Contributor → Committer (after 10+ merged PRs and demonstrated quality).

---

## Dependency Policy

1. **Prefer fewer dependencies**: Evaluate if the feature is achievable without a new package
2. **License check**: All new dependencies must be MIT, Apache-2.0, BSD, ISC, or similar
3. **Size check**: Large dependencies (>100KB gzipped) require Architecture Team approval
4. **Maintenance check**: Prefer packages with active maintenance (commit within 6 months)
5. **Security check**: `npm audit` must pass before any dependency is added

---

## Issue Triage Process

New issues are triaged within **48 hours**:

1. Label applied (`bug`, `feature`, `question`, etc.)
2. Priority label applied (`P0` through `P3`)
3. Response posted (even if just "Thank you, we'll investigate")
4. Milestone assigned for tracked issues

Stale issues (no activity for 60 days) are labeled `stale` and closed after 14 days unless updated.

---

## Security Disclosure Policy

All security vulnerabilities are handled via private disclosure:

1. Reporter emails security@imageforge.dev
2. Core team confirms within 48h
3. Fix developed privately
4. Fix released + CVE published (if applicable)
5. Public disclosure after fix is available

See [SECURITY.md](../../SECURITY.md) for the full policy.

---

## Recognition

Contributors are recognized via:

- Listed in `CONTRIBUTORS.md`
- Thanked in release notes for significant contributions
- `@mention` in the GitHub release for their contribution

---

_Document Owner: Engineering Team | Review Cycle: Annually | Approved: 2026-07-27_
