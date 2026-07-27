# Requirements Traceability Matrix (RTM)

> **Document ID**: 13
> **Phase**: 1 — Product Planning
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture & QA Team

---

## Purpose

The Requirements Traceability Matrix maps every business requirement through the chain of implementation and verification, ensuring no requirement is lost, untested, or unimplemented.

## Scope

Core MVP requirements traced from Business Objective → Functional Requirement → Feature → User Story → Screen → Test.

---

## Traceability Chain

```
Business Objective (BRD)
        ↓
Functional Requirement (FR)
        ↓
Feature Module
        ↓
User Story (US)
        ↓
Screen / Component
        ↓
Unit Test
        ↓
Integration Test
        ↓
E2E Test
```

---

## Core Traceability Matrix

| Business Objective | Functional Req         | Feature          | User Story             | Screen                  | Unit Test          | E2E Test               |
| ------------------ | ---------------------- | ---------------- | ---------------------- | ----------------------- | ------------------ | ---------------------- |
| BO-003: Live Demo  | FR-021, FR-022, FR-023 | Import Module    | US-001, US-002, US-003 | HomeScreen, DropZone    | `import.test.ts`   | `compress-flow.e2e.ts` |
| BO-005: Privacy    | FR-003                 | All Features     | All stories            | All screens             | `privacy.test.ts`  | `no-upload.e2e.ts`     |
| BO-001: Platform   | FR-050, FR-051         | Compression      | US-010, US-011, US-012 | CompressScreen          | `compress.test.ts` | `compress-flow.e2e.ts` |
| BO-001: Platform   | FR-070-078             | Resize           | US-020, US-021         | ResizeScreen            | `resize.test.ts`   | `resize-flow.e2e.ts`   |
| BO-001: Platform   | FR-090-097             | Crop             | US-030, US-031         | CropScreen              | `crop.test.ts`     | `crop-flow.e2e.ts`     |
| BO-001: Platform   | FR-110-115             | Rotate/Flip      | US-040, US-041         | RotateScreen            | `rotate.test.ts`   | `rotate-flow.e2e.ts`   |
| BO-001: Platform   | FR-130-136             | Format Convert   | US-050, US-051         | ConvertScreen           | `convert.test.ts`  | `convert-flow.e2e.ts`  |
| BO-003: Batch      | FR-300-308             | Batch Processing | US-060-062             | BatchScreen, QueuePanel | `batch.test.ts`    | `batch-flow.e2e.ts`    |
| BO-001: Offline    | FR-005, FR-006         | PWA/SW           | US-N/A                 | ServiceWorker           | `sw.test.ts`       | `offline.e2e.ts`       |
| BO-005: Privacy    | FR-072, FR-073         | Metadata         | US-130, US-131         | MetadataPanel           | `metadata.test.ts` | `gps-remove.e2e.ts`    |

---

## Coverage Analysis

| Requirement Category | Total FRs   | Covered by Tests | Coverage % |
| -------------------- | ----------- | ---------------- | ---------- |
| Import/Export        | FR-020–038  | 17/19            | 89%        |
| Compression          | FR-050–057  | 8/8              | 100%       |
| Resize               | FR-070–078  | 9/9              | 100%       |
| Crop                 | FR-090–097  | 7/8              | 88%        |
| Rotate/Flip          | FR-110–115  | 6/6              | 100%       |
| Format Conversion    | FR-130–136  | 6/7              | 86%        |
| Batch Processing     | FR-300–308  | 9/9              | 100%       |
| State/History        | FR-350–355  | 4/6              | 67%        |
| Storage              | FR-380–384  | 4/5              | 80%        |
| **Overall MVP**      | **~70 FRs** | **~60**          | **~86%**   |

---

## Feature-to-Screen Mapping

| Feature Module | Primary Screen     | Secondary Screens               |
| -------------- | ------------------ | ------------------------------- |
| Import         | `HomeScreen`       | `BatchScreen`                   |
| Compress       | `CompressScreen`   | `BatchScreen`                   |
| Resize         | `ResizeScreen`     | `BatchScreen`                   |
| Crop           | `CropScreen`       | —                               |
| Rotate         | `EditScreen` (tab) | —                               |
| Flip           | `EditScreen` (tab) | —                               |
| Format Convert | `ConvertScreen`    | `BatchScreen`                   |
| Batch          | `BatchScreen`      | `QueuePanel`, `PipelineBuilder` |
| Metadata       | `MetadataScreen`   | `ImportPreview`                 |
| History        | `HistoryPanel`     | All edit screens                |
| Settings       | `SettingsScreen`   | —                               |
| Export         | `ExportModal`      | `BatchScreen`                   |

---

## Test Coverage by Phase

### MVP Tests Required

| Test File              | Tests | FR Coverage            |
| ---------------------- | ----- | ---------------------- |
| `compress.unit.ts`     | 15    | FR-050–057             |
| `resize.unit.ts`       | 12    | FR-070–078             |
| `crop.unit.ts`         | 10    | FR-090–095             |
| `rotate.unit.ts`       | 8     | FR-110–115             |
| `convert.unit.ts`      | 10    | FR-130–136             |
| `batch.unit.ts`        | 14    | FR-300–308             |
| `import.unit.ts`       | 12    | FR-020–033             |
| `export.unit.ts`       | 8     | FR-034–038             |
| `history.unit.ts`      | 6     | FR-350–353             |
| `storage.unit.ts`      | 8     | FR-380–384             |
| `compress-flow.e2e.ts` | 4     | FR-021, FR-050, FR-057 |
| `batch-flow.e2e.ts`    | 5     | FR-300, FR-303, FR-304 |
| `offline.e2e.ts`       | 3     | FR-002, FR-005         |
| `no-upload.e2e.ts`     | 2     | FR-003                 |

---

_Document Owner: QA Team | Review Cycle: Per-sprint | Approved: 2026-07-27_
