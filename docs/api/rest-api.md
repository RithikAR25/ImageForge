# REST API Reference

> **Document ID**: api/rest-api
> **Phase**: API Documentation
> **Status**: Phase 3 (Planned)
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Overview

The ImageForge REST API will be introduced in Phase 3 for the CLI tool, enterprise integrations, and webhook-driven automation. The web and mobile apps will remain fully client-side.

> **Note**: This API does NOT receive or process image files. The API is for configuration, authentication, and orchestration only. Image processing remains client-side.

---

## Base URL

```
https://api.imageforge.app/v1
```

All API responses are JSON. All requests require authentication (see below).

---

## Authentication

```
Authorization: Bearer <api_key>
```

API keys are generated in the user dashboard (Phase 3+). Free tier: 1 key, rate limited. Pro tier: multiple keys.

---

## Endpoints

### Health Check

```http
GET /v1/health
```

Response:

```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2026-07-27T09:00:00Z"
}
```

### Pipeline Presets

```http
GET /v1/presets
POST /v1/presets
PUT /v1/presets/{id}
DELETE /v1/presets/{id}
```

Store named pipeline presets for CLI and team sharing:

```json
// POST /v1/presets
{
  "name": "social-media-optimized",
  "pipeline": [
    { "type": "resize", "config": { "width": 1080, "mode": "fit" } },
    { "type": "compress", "config": { "codec": "webp", "quality": 82 } }
  ]
}

// Response
{
  "id": "preset_abc123",
  "name": "social-media-optimized",
  "createdAt": "2026-07-27T09:00:00Z"
}
```

### Webhook Configuration (Enterprise)

```http
GET /v1/webhooks
POST /v1/webhooks
DELETE /v1/webhooks/{id}
```

Webhooks notify external systems when processing completes (CLI batch jobs).

---

## Rate Limits

| Tier       | Requests/min | Preset Storage |
| ---------- | ------------ | -------------- |
| Free       | 60           | 5 presets      |
| Pro        | 600          | Unlimited      |
| Enterprise | Custom       | Unlimited      |

---

## Error Format

All errors follow RFC 7807 (Problem Details):

```json
{
  "type": "https://api.imageforge.app/errors/not-found",
  "title": "Preset not found",
  "status": 404,
  "detail": "No preset with ID preset_xyz was found.",
  "instance": "/v1/presets/preset_xyz"
}
```

---

_Document Owner: Architecture Team | Status: Phase 3 | Last Updated: 2026-07-27_
