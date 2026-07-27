# Settings Feature Specification

> **Document ID**: features/settings
> **Phase**: 4 — Feature Specifications
> **Status**: Approved

---

## Overview

The Settings feature provides user preferences control — appearance, defaults, privacy, and experimental features.

---

## Settings Sections

### Appearance

| Setting  | Type                       | Default | Description      |
| -------- | -------------------------- | ------- | ---------------- |
| Theme    | Select (Light/Dark/System) | System  | App color scheme |
| Language | Select                     | System  | UI language      |

### Processing Defaults

| Setting                  | Type           | Default       | Description                  |
| ------------------------ | -------------- | ------------- | ---------------------------- |
| Default output format    | Select         | Same as input | JPEG / PNG / WebP / Same     |
| Default JPEG quality     | Slider (1-100) | 85            | Used when no preset selected |
| Default WebP quality     | Slider (1-100) | 80            |                              |
| Auto-rotate by EXIF      | Toggle         | ON            | Fix camera orientation       |
| Strip metadata on export | Toggle         | OFF           | Remove EXIF/GPS on save      |

### Batch

| Setting                       | Type         | Default | Description               |
| ----------------------------- | ------------ | ------- | ------------------------- |
| Max concurrent workers        | Select (1-8) | 4       | Processing parallelism    |
| Auto-export after batch       | Toggle       | OFF     | Auto-download on complete |
| Show notification on complete | Toggle       | ON      | Browser notification      |

### Privacy

| Setting                 | Type   | Default | Description                 |
| ----------------------- | ------ | ------- | --------------------------- |
| Anonymous analytics     | Toggle | OFF     | Help improve ImageForge     |
| Anonymous crash reports | Toggle | OFF     | Report errors               |
| Clear all data          | Button | —       | Wipe IndexedDB + thumbnails |

### Experimental

| Setting               | Type   | Default | Description     |
| --------------------- | ------ | ------- | --------------- |
| AVIF export           | Toggle | OFF     | Beta format     |
| AI Background Removal | Toggle | OFF     | Phase 3 feature |

### About

- ImageForge version
- Open source licenses
- Report a bug (link)
- Privacy Policy

---

## Settings Persistence

```typescript
// settingsStore persists to localStorage (web) / AsyncStorage (mobile)
// via Zustand persist middleware

const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'en',
      defaultJpegQuality: 85,
      stripMetadataOnExport: false,
      analyticsEnabled: false,
      ...
      updateSettings: (updates) => set(updates),
    }),
    {
      name: 'imageforge-settings',
      storage: createJSONStorage(() =>
        Platform.OS === 'web' ? localStorage : AsyncStorage
      ),
    }
  )
);
```

---

## Analytics Consent Gate

Analytics are NEVER enabled without explicit user action:

```typescript
function AnalyticsConsent() {
  const { updateSettings } = useSettingsStore();

  return (
    <View>
      <Text>Help improve ImageForge</Text>
      <Text>Send anonymous usage data (no images, no PII)</Text>
      <Button onPress={() => updateSettings({ analyticsEnabled: true })}>
        Enable
      </Button>
      <Button variant="ghost" onPress={() => {}}>
        No thanks
      </Button>
    </View>
  );
}
```

---

_Document Owner: Product Team | Approved: 2026-07-27_
