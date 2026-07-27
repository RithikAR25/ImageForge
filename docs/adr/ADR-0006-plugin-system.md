# ADR-0006: Sandboxed Plugin System Architecture

**Date**: 2026-07-27  
**Status**: Accepted  
**Deciders**: Architecture Team

---

## Context

ImageForge's plugin system (Phase 2) must allow third-party developers to add custom image processing operations without compromising the security or stability of the host application. The architecture must balance extensibility with safety.

---

## Decision Outcome

**Chosen: Sandboxed iframe (Web) / Isolated Worker (Mobile) execution model**

Plugins are loaded in isolated execution contexts with a defined, limited message-passing API. They cannot access the host application's DOM, state stores, or file system directly.

---

## Plugin Communication Protocol

```
Host App ←→ postMessage API ←→ Plugin Sandbox

Plugin receives:
- Image ArrayBuffer (copy, not reference)
- Config parameters

Plugin returns:
- Processed image ArrayBuffer
- Error (if failed)
```

Plugin sandboxes:

- **Web**: Sandboxed `<iframe>` with `sandbox="allow-scripts"` (no same-origin, no storage access)
- **Mobile**: Isolated JSI context with restricted API surface

---

## Plugin Manifest

```json
{
  "id": "community.sharp-effects",
  "name": "Sharp Effects Pack",
  "version": "1.0.0",
  "description": "10 professional effects",
  "permissions": ["process-image"],
  "entryPoint": "https://plugins.example.com/sharp-effects/index.js",
  "checksum": "sha256:abc123..."
}
```

Plugins must declare required permissions. Undeclared API access is blocked.

---

## Consequences

**Good**: Security isolation prevents malicious plugins from stealing images or accessing the file system.

**Bad**: Sandboxed execution adds ~5–10ms overhead per plugin invocation; plugins cannot access advanced Web APIs.

---

## References

- [31-plugin-system.md](../31-plugin-system.md)
