# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in ImageForge, please **do not** open a public GitHub issue.

Instead, report it via one of these channels:

- **Email**: security@imageforge.dev
- **GitHub Security Advisory**: [Report a vulnerability](https://github.com/imageforge/imageforge/security/advisories/new)

Please include:

- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested mitigation (if known)

## Response Timeline

| Timeline        | Action                               |
| --------------- | ------------------------------------ |
| Within 48 hours | Acknowledge receipt                  |
| Within 5 days   | Provide initial assessment           |
| Within 7 days   | Critical vulnerabilities patched     |
| Within 30 days  | Non-critical vulnerabilities patched |
| After patch     | Coordinated public disclosure        |

## Scope

**In scope**:

- Security vulnerabilities in ImageForge application code
- Dependencies with known CVEs affecting ImageForge
- CSP bypasses or XSS vulnerabilities
- Plugin sandbox escapes

**Out of scope**:

- Vulnerabilities in browsers that ImageForge cannot control
- Social engineering attacks
- Denial of service via large files (mitigated by 100MB limit)

## Security Model

ImageForge is privacy-first by architecture:

- **No image uploads to servers** — all processing is client-side
- **No user accounts by default** — no PII stored
- **Strict CSP** — XSS mitigation
- **Input validation** — magic byte file type checking
- **Plugin sandboxing** — third-party code in isolated iframes

## Supported Versions

Security patches are provided for the latest major version only.

| Version        | Supported               |
| -------------- | ----------------------- |
| Latest         | ✅                      |
| Previous major | Security-only (90 days) |
| Older          | ❌                      |
