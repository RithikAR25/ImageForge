# Privacy Policy

> **Document ID**: security/privacy
> **Phase**: 7 — Security
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Legal / Engineering

---

## Summary (Plain Language)

ImageForge is a **privacy-first** application:

- 🔒 **Your images stay on your device** — we never upload them to any server
- 📊 **No account required** — no login, no user profiles, no PII collected
- 🍪 **No tracking cookies** — we do not use ad tracking or third-party analytics
- 🗑️ **You control your data** — clear all stored data in Settings → Privacy

---

## What We Store (Locally Only)

All data is stored **on your device only**:

| Data                    | Storage Location            | Purpose                    | User Control            |
| ----------------------- | --------------------------- | -------------------------- | ----------------------- |
| Image thumbnails        | IndexedDB / SQLite          | Faster gallery display     | Delete in Settings      |
| Queue state             | IndexedDB / SQLite          | Resume interrupted batches | Delete in Settings      |
| User settings           | localStorage / AsyncStorage | Remember preferences       | Reset in Settings       |
| Processed image results | Memory only                 | Processing in progress     | Cleared on export/close |

---

## What We DO NOT Collect

- ❌ Original image data
- ❌ Image filenames or paths
- ❌ EXIF data (GPS coordinates, camera model, etc.)
- ❌ Usage analytics (unless you opt in)
- ❌ Personal information
- ❌ Location data
- ❌ IP addresses stored
- ❌ Cookies (beyond session storage)

---

## Optional Analytics

With **explicit user consent** (opt-in in Settings), we may collect:

- Anonymous crash reports (no image data, no PII)
- Anonymous feature usage counts (e.g., "compress was used 5 times today")
- Device/OS version (for compatibility analysis)

All analytics are:

- Aggregated and anonymous
- Sent via HTTPS only
- Free of any image data or user-identifiable information
- Deletable on request (email us)

---

## Third-Party Services

| Service                  | Purpose             | Data Shared                          |
| ------------------------ | ------------------- | ------------------------------------ |
| Vercel (Web hosting)     | CDN and hosting     | IP address (standard web server log) |
| GitHub (Source code)     | Open source hosting | None                                 |
| Expo EAS (Mobile builds) | App compilation     | None (your code only)                |

Vercel's standard server logs (IP, timestamp, user agent) are subject to Vercel's privacy policy. These are not shared with ImageForge developers.

---

## WASM Asset Downloads

When you first use the app, WASM processing modules are downloaded from our CDN. These downloads:

- Contain only binary code (no user data)
- Are anonymous (no cookies, no auth headers)
- Are cached in your browser's Service Worker after first load

---

## Data Deletion

To delete all locally stored ImageForge data:

**Web**: Settings → Privacy → "Clear All Data"
OR
Developer Tools → Application → Storage → Clear Site Data

**Mobile**: App Info → Storage → Clear Data (Android) / Delete App (iOS)

---

## Children's Privacy

ImageForge does not knowingly collect information from children under 13. The app contains no social features, accounts, or communications.

---

## Contact

Privacy questions or data deletion requests:

- Email: privacy@imageforge.dev
- GitHub: github.com/imageforge/imageforge/issues

---

_Last Updated: 2026-07-27 | Effective Date: 2026-07-27_
