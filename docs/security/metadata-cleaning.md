# Metadata Cleaning

> **Document ID**: security/metadata-cleaning
> **Phase**: 7 — Security
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

This document covers the technical implementation of metadata cleaning — removing EXIF, IPTC, XMP and other embedded metadata from image files before export.

---

## Why Metadata Cleaning Matters

Images can contain hidden data that users may not want to share:

| Metadata Type      | Sensitive Data                              |
| ------------------ | ------------------------------------------- |
| EXIF GPS           | Precise location where photo was taken      |
| EXIF DateTime      | Exact timestamp (reveals schedule/routines) |
| Camera Model       | Device identification                       |
| EXIF Serial Number | Unique device identifier                    |
| IPTC Creator       | Author's real name                          |
| XMP History        | Software and edit history                   |
| Thumbnail          | May contain original even after crop        |

---

## Strip Levels

| Strip Level | What's Removed                          | Use Case                           |
| ----------- | --------------------------------------- | ---------------------------------- |
| `none`      | Nothing                                 | Professional archival              |
| `gps-only`  | GPS and location data only              | Share photo but keep tech metadata |
| `personal`  | GPS + name + serial + email             | Default for sharing                |
| `all`       | Everything (EXIF, IPTC, XMP, thumbnail) | Maximum privacy                    |

---

## Implementation (libvips)

```typescript
// packages/image-core/src/metadata/stripMetadata.ts

interface MetadataStripConfig {
  level: 'none' | 'gps-only' | 'personal' | 'all';
}

const GPS_FIELDS = [
  'exif-GPSInfo',
  'exif-GPSLatitude',
  'exif-GPSLongitude',
  'exif-GPSAltitude',
  'exif-GPSLatitudeRef',
  'exif-GPSLongitudeRef',
  'exif-GPSImgDirection',
  'exif-GPSSpeed',
  'exif-GPSTrack',
];

const PERSONAL_FIELDS = [
  ...GPS_FIELDS,
  'exif-MakerNote',
  'exif-SerialNumber',
  'exif-BodySerialNumber',
  'exif-LensSerialNumber',
  'iptc-Creator',
  'iptc-CreatorContactInfo',
  'xmp-Creator',
  'xmp-rights',
];

export async function stripMetadata(
  buffer: ArrayBuffer,
  config: MetadataStripConfig,
): Promise<ArrayBuffer> {
  if (config.level === 'none') return buffer;

  const image = vips.Image.newFromBuffer(buffer);

  if (config.level === 'all') {
    // libvips strip flag removes all metadata
    return image.jpegsave_buffer({ strip: true });
  }

  const fieldsToRemove = config.level === 'gps-only' ? GPS_FIELDS : PERSONAL_FIELDS;

  for (const field of fieldsToRemove) {
    if (image.getFields().includes(field)) {
      image.remove(field);
    }
  }

  // Always regenerate thumbnail to avoid stale embedded thumbnail
  // (old thumbnail may show pre-crop version)
  return image.jpegsave_buffer({ optimize_coding: true });
}
```

---

## Embedded Thumbnail Attack

JPEG files contain a small embedded thumbnail in the EXIF block. If a user crops their image to remove something sensitive, the original may still be visible in the embedded thumbnail.

**Mitigation**: When any processing operation modifies the image content (crop, rotate, etc.), the embedded EXIF thumbnail is always regenerated via libvips or stripped entirely.

---

## Default Behavior

```typescript
// Default: strip GPS only (protects most users without losing copyright info)
const defaultStripLevel: MetadataStripConfig['level'] = 'gps-only';

// User-configurable in Settings → Processing → "Strip metadata on export"
// Options: none / gps-only / personal / all
```

---

_Document Owner: Engineering Team | Approved: 2026-07-27_
