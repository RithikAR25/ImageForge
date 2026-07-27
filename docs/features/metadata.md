# Metadata Feature Specification

> **Document ID**: features/metadata
> **Phase**: 4 — Feature Specifications
> **Status**: Approved

---

## Overview

The Metadata feature allows users to view, edit, and strip EXIF/IPTC/XMP metadata from images — with a privacy-first focus on GPS and personal data removal.

---

## Functional Requirements

| Requirement                                      | FR     | Priority |
| ------------------------------------------------ | ------ | -------- |
| View EXIF metadata                               | FR-140 | MVP      |
| Strip all metadata on export                     | FR-141 | MVP      |
| Strip GPS only                                   | FR-142 | MVP      |
| Preserve copyright fields                        | FR-143 | P2       |
| Edit IPTC fields (title, description, copyright) | FR-144 | P2       |
| Batch metadata strip                             | FR-145 | MVP      |

---

## EXIF Fields Displayed

| Category | Fields                                           |
| -------- | ------------------------------------------------ |
| Camera   | Make, Model, Lens, Software                      |
| Capture  | Date/Time, Exposure, Aperture, ISO, Focal Length |
| Image    | Width, Height, Color Space, Orientation          |
| GPS      | Latitude, Longitude, Altitude ⚠️                 |
| Other    | Copyright, Artist, Description                   |

GPS data is highlighted with a ⚠️ privacy warning in the UI.

---

## Metadata Strip Implementation

```typescript
interface MetadataStripConfig {
  stripAll: boolean; // Remove everything
  stripGpsOnly: boolean; // Remove only GPS fields
  preserveCopyright: boolean; // Keep copyright even when stripping all
}

// Implementation: libvips has built-in metadata strip
async function stripMetadata(
  buffer: ArrayBuffer,
  config: MetadataStripConfig,
): Promise<ArrayBuffer> {
  const image = vips.Image.newFromBuffer(buffer);

  if (config.stripAll) {
    return image.jpegsave({ strip: true }); // strips EXIF, IPTC, XMP
  }

  if (config.stripGpsOnly) {
    image.remove('exif-GPSInfo');
    image.remove('exif-GPSLatitude');
    image.remove('exif-GPSLongitude');
    image.remove('exif-GPSAltitude');
  }

  return image.writeToBuffer('.jpg');
}
```

---

## Privacy Default

The setting "Strip metadata on export" defaults to **OFF** to avoid accidentally removing copyright information from professional photographers' work. Users can enable it in Settings or per-export.

When GPS data is detected, a non-blocking banner appears:

> ⚠️ This image contains GPS location data. [Strip GPS] [Keep]

---

_Document Owner: Product Team | Approved: 2026-07-27_
