# Native Bridge Design

> **Document ID**: 49
> **Phase**: 2 — Architecture
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document defines the native bridge design for the ImageForge mobile application — how React Native JavaScript code communicates with native iOS and Android modules for image processing.

---

## Architecture: New Architecture (Fabric + JSI)

ImageForge targets React Native's **New Architecture** (Fabric renderer + JSI bridge):

| Component      | Old Architecture       | New Architecture      |
| -------------- | ---------------------- | --------------------- |
| Renderer       | Paper (legacy)         | Fabric                |
| Bridge         | Async JSON bridge      | JSI (C++ direct call) |
| Native Modules | Bridge-based           | Turbo Modules         |
| Performance    | Serialization overhead | Near-native speed     |

---

## JSI Native Module: ImageProcessingModule

```typescript
// Native module interface (TypeScript side)
interface NativeImageProcessingModule {
  compress(
    uri: string,
    config: { codec: string; quality: number },
  ): Promise<{ uri: string; fileSize: number; width: number; height: number }>;

  resize(
    uri: string,
    config: { width: number; height: number; mode: string },
  ): Promise<{ uri: string; width: number; height: number }>;

  crop(
    uri: string,
    config: { x: number; y: number; width: number; height: number },
  ): Promise<{ uri: string; width: number; height: number }>;

  generateThumbnail(uri: string, maxSize: number): Promise<{ uri: string }>;
}
```

### iOS Implementation (Swift)

```swift
@objc(ImageProcessingModule)
class ImageProcessingModule: NSObject {
  @objc func compress(
    _ uri: String,
    config: NSDictionary,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    guard let image = UIImage(contentsOfFile: uri.replacingOccurrences(of: "file://", with: "")) else {
      reject("LOAD_FAILED", "Could not load image", nil)
      return
    }

    let quality = config["quality"] as? CGFloat ?? 0.85
    let codec = config["codec"] as? String ?? "jpeg"

    DispatchQueue.global(qos: .userInitiated).async {
      let data: Data?
      if codec == "jpeg" {
        data = image.jpegData(compressionQuality: quality / 100)
      } else {
        data = image.pngData()
      }

      guard let data = data else {
        reject("ENCODE_FAILED", "Encoding failed", nil)
        return
      }

      let outputPath = NSTemporaryDirectory() + UUID().uuidString + ".\(codec)"
      try? data.write(to: URL(fileURLWithPath: outputPath))

      resolve([
        "uri": "file://" + outputPath,
        "fileSize": data.count,
        "width": image.size.width * image.scale,
        "height": image.size.height * image.scale,
      ])
    }
  }
}
```

### Android Implementation (Kotlin)

```kotlin
class ImageProcessingModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "ImageProcessingModule"

    @ReactMethod
    fun compress(uri: String, config: ReadableMap, promise: Promise) {
        val quality = config.getInt("quality")
        val codec = config.getString("codec") ?: "jpeg"

        Thread {
            try {
                val bitmap = BitmapFactory.decodeFile(Uri.parse(uri).path)
                val outputFile = File(reactApplicationContext.cacheDir, "${UUID.randomUUID()}.$codec")
                val format = if (codec == "jpeg") Bitmap.CompressFormat.JPEG
                             else Bitmap.CompressFormat.PNG

                FileOutputStream(outputFile).use { out ->
                    bitmap.compress(format, quality, out)
                }

                promise.resolve(WritableNativeMap().apply {
                    putString("uri", "file://${outputFile.absolutePath}")
                    putInt("fileSize", outputFile.length().toInt())
                    putInt("width", bitmap.width)
                    putInt("height", bitmap.height)
                })
            } catch (e: Exception) {
                promise.reject("ENCODE_FAILED", e.message)
            }
        }.start()
    }
}
```

---

## Expo Config Plugin

To include the native module in Expo Managed Workflow:

```javascript
// expo-plugins/withImageProcessing.js
const { withAndroidManifest, withXcodeProject } = require('@expo/config-plugins');

function withImageProcessingAndroid(config) {
  return withAndroidManifest(config, async (config) => {
    // Add any required permissions
    return config;
  });
}

function withImageProcessingIOS(config) {
  return withXcodeProject(config, async (config) => {
    // Link the native module
    return config;
  });
}

module.exports = (config) => {
  config = withImageProcessingAndroid(config);
  config = withImageProcessingIOS(config);
  return config;
};
```

---

## Data Flow: JS → Native → JS

```
JS: NativeImageProcessingModule.compress(uri, config)
  ↓ JSI call (no serialization overhead)
Native Thread (async)
  ↓ Load image from file URI
  ↓ Run platform codec (libjpeg-turbo / ImageIO)
  ↓ Write to temp file
  ↓ Return result object
  ↑ JSI callback to JS
JS: { uri: 'file://...', fileSize: 182000 }
```

---

## Related Documents

| Document                                                             | Relationship               |
| -------------------------------------------------------------------- | -------------------------- |
| [28-platform-abstraction.md](./28-platform-abstraction.md)           | Adapter pattern            |
| [ADR-0009](./adr/ADR-0009-expo-vs-bare.md)                           | Expo decision              |
| [29-image-processing-pipeline.md](./29-image-processing-pipeline.md) | Pipeline using this bridge |

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
