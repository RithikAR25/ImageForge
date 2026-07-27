# Security Permissions

> **Document ID**: security/permissions
> **Phase**: 7 — Security
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

This document defines all permissions required by ImageForge across platforms — what each permission is for, when it is requested, and how to handle denial.

---

## Web Permissions

Web APIs are permission-gated by the browser. ImageForge requests:

| Permission         | API                                | When Requested                   | If Denied                                  |
| ------------------ | ---------------------------------- | -------------------------------- | ------------------------------------------ |
| File System Access | `<input type="file">`              | On "Import" click                | N/A — always available                     |
| Clipboard Read     | `navigator.clipboard.read()`       | On Ctrl+V paste                  | Silent fail — show hint to use file dialog |
| Notifications      | `Notification.requestPermission()` | After batch completes (optional) | Batch still works — no notification        |
| Camera (future)    | `getUserMedia({ video: true })`    | Phase 2 camera import            | Fall back to file picker                   |

**Web does NOT request**:

- ❌ Geolocation
- ❌ Microphone
- ❌ Contacts
- ❌ Bluetooth/NFC

---

## iOS Permissions

Declared in `app.json`:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "ImageForge needs access to your photo library to import images for processing.",
        "NSPhotoLibraryAddUsageDescription": "ImageForge needs permission to save processed images to your photo library.",
        "NSCameraUsageDescription": "ImageForge needs camera access to capture images directly for processing.",
        "NSMicrophoneUsageDescription": "Not used by ImageForge."
      }
    }
  }
}
```

| Permission          | When Requested          | If Denied                                |
| ------------------- | ----------------------- | ---------------------------------------- |
| Photo Library Read  | On "Import from Photos" | Show message + option to use "Files" app |
| Photo Library Write | On "Save to Photos"     | Show message + offer direct download     |
| Camera              | On "Take Photo"         | Show message + offer gallery picker      |

---

## Android Permissions

```json
{
  "expo": {
    "android": {
      "permissions": [
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "CAMERA",
        "READ_MEDIA_IMAGES"
      ]
    }
  }
}
```

| Permission               | API Level    | When Requested  |
| ------------------------ | ------------ | --------------- |
| `READ_MEDIA_IMAGES`      | Android 13+  | On "Import"     |
| `READ_EXTERNAL_STORAGE`  | Android ≤ 12 | On "Import"     |
| `WRITE_EXTERNAL_STORAGE` | Android ≤ 9  | On "Export"     |
| `CAMERA`                 | All          | On "Take Photo" |

---

## Permission Request Pattern

```typescript
// Always explain WHY before requesting
async function requestPhotoLibraryPermission(): Promise<boolean> {
  const { status } = await MediaLibrary.getPermissionsAsync();

  if (status === 'granted') return true;

  if (status === 'undetermined') {
    // Show explanation dialog BEFORE system prompt
    await showPermissionRationale({
      title: 'Access Your Photos',
      message: 'ImageForge needs access to your photos to import images for processing.',
      icon: 'photos',
    });

    const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
    return newStatus === 'granted';
  }

  // status === 'denied' — show settings link
  showPermissionDeniedAlert('photos');
  return false;
}
```

---

## Minimal Permission Philosophy

ImageForge follows the **principle of least privilege**:

1. Never request permissions not strictly needed
2. Request permissions at the point of use (not on launch)
3. Always explain why before the system dialog
4. Always gracefully handle denial with a fallback

---

_Document Owner: Engineering Team | Approved: 2026-07-27_
