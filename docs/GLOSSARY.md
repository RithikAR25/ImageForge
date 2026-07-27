# Glossary

> **Purpose**: Canonical definitions for all terms used across ImageForge documentation.
> **Scope**: Project-wide. All teams and documents must use these definitions consistently.
> **References**: [Project Overview](./01-project-overview.md) · [System Architecture](./20-system-architecture-document.md)

---

## How to Use This Glossary

- Terms appear in **bold** throughout the documentation and link back here.
- When in doubt about a term's meaning, this document is the source of truth.
- To add a term, open a PR modifying this file following the format below.

---

## A

**AVIF**
: AV1 Image File Format. A modern image codec offering superior compression compared to JPEG and WebP. AVIF is supported natively in modern browsers and Android 12+. iOS support arrived with iOS 16. On older platforms, a WASM decoder is used as a fallback. See [Browser Compatibility](./48-browser-compatibility.md).

**Adaptive Compression**
: A compression strategy that analyzes image content and selects optimal compression parameters automatically, balancing quality and file size without manual tuning by the user.

**ADR (Architecture Decision Record)**
: A document that captures a significant architectural decision, its context, the options considered, the decision made, and the rationale. See [adr/](./adr/).

**App Package**
: An application workspace within the monorepo (`apps/web`, `apps/mobile`). App packages are consumers of library packages and never exported.

---

## B

**Background Job**
: A unit of work executed off the main thread, either via a Web Worker (Web) or a native background task (Android/iOS). See [Background Job System](./32-background-job-system.md).

**Batch Processing**
: Applying one or more operations to multiple images in sequence or parallel, managed by the Batch Processing Engine. See [Batch Processing Module](./features/batch-processing.md).

**BRD (Business Requirements Document)**
: A document that captures the business objectives, goals, and high-level requirements from the perspective of stakeholders. See [BRD](./02-business-requirements-document.md).

**Bridge (Native Bridge)**
: The communication layer between React Native JavaScript code and native platform code (Kotlin/Swift). The New Architecture uses JSI (JavaScript Interface) for synchronous, low-overhead communication. See [Native Bridge Design](./49-native-bridge-design.md).

---

## C

**Canvas API**
: The browser API for drawing graphics. On Web, ImageForge uses React Native Skia's Web backend which wraps CanvasKit (a WASM build of Skia). On native, Skia runs natively.

**Client-Side Processing**
: Image processing that occurs entirely within the user's device (browser or mobile) without sending image data to any server. The default and preferred mode of ImageForge. Privacy-first by design.

**Codec**
: A coder-decoder algorithm for encoding and decoding image or video data. Examples: JPEG, PNG, WebP, AVIF, HEIC.

**Collage**
: A composite image created by arranging multiple source images in a grid or free-form layout. See [Collage Module](./features/collage.md).

**Contact Sheet**
: A grid of thumbnails from a collection of images, used for quick visual review. See [Contact Sheet Module](./features/contact-sheet.md).

**Core Package**
: A library package within the monorepo (`packages/image-core`, `packages/ui`, etc.) that is shared across multiple app packages.

---

## D

**Design Token**
: An atomic unit of the design system — a named value for color, spacing, typography, or animation. Tokens are platform-agnostic and compiled into platform-specific formats. See [Design Tokens](./59-design-tokens.md).

**Domain Model**
: The conceptual model of the business domain, including entities, their attributes, and relationships. See [Domain Model](./42-domain-model.md).

**DFD (Data Flow Diagram)**
: A diagram showing how data flows through the system, from inputs to processes to outputs. See [Data Flow Diagrams](./45-data-flow-diagrams.md).

**Duplicate Detection**
: The process of identifying identical or near-identical images in a collection using perceptual hashing. See [Duplicate Finder Module](./features/duplicate-finder.md).

---

## E

**EAS (Expo Application Services)**
: Expo's cloud build and deployment service. Used for building Android APKs/AABs and iOS IPAs in CI/CD. See [CI/CD](./80-ci-cd.md).

**Edge Case**
: An unusual or extreme input condition that may cause unexpected behavior. Feature module documents enumerate edge cases for each feature.

**EXIF (Exchangeable Image File Format)**
: A standard for storing metadata in image files, including camera settings, GPS coordinates, timestamps, and device information. See [Metadata Module](./features/metadata.md).

**Expo**
: A framework and platform for universal React Native applications. ImageForge uses Expo Managed Workflow for the mobile application. See [ADR-0009](./adr/ADR-0009-expo-vs-bare.md).

---

## F

**Feature Flag**
: A configuration switch that enables or disables a feature at runtime without deploying new code. See [Feature Flag Strategy](./49c-feature-flag-strategy.md).

**Feature Module**
: A self-contained unit of functionality within ImageForge, corresponding to a single processing capability (e.g., Compress, Resize, OCR). Each feature module has a dedicated specification document.

**FFmpeg**
: A powerful open-source multimedia framework used for video-to-GIF conversion and other multimedia operations. On Web, compiled to WebAssembly via `ffmpeg.wasm`. See [Third-Party Libraries](./77-third-party-libraries.md).

**FLIP Animation**
: First-Last-Invert-Play. A technique for creating performant layout animations by calculating the transform needed to animate from one position to another. Used with React Native Reanimated.

---

## G

**GIF**
: Graphics Interchange Format. A bitmap image format supporting animation. In ImageForge, GIFs are created from image sequences or video clips. See [GIF Module](./features/gif.md).

**GPU Processing**
: Image processing operations delegated to the device's Graphics Processing Unit for parallel computation. Used for filter effects via Skia shaders.

---

## H

**HEIC / HEIF**
: High Efficiency Image Container / Format. Apple's default image format for iOS cameras. Offers excellent compression. Browser support is limited; ImageForge provides a WASM decoder for Web. See [Browser Compatibility](./48-browser-compatibility.md).

**HLD (High-Level Design)**
: An architectural overview showing major system components and their interactions without implementation details. See [High-Level Design](./22-high-level-design.md).

**Histogram**
: A graphical representation of the distribution of pixel values in an image. Used in the Image Enhancement module for manual level/curve adjustments.

---

## I

**Image Pipeline**
: The ordered sequence of processing operations applied to an image, from input to output. See [Image Processing Pipeline](./29-image-processing-pipeline.md).

**IndexedDB**
: A browser-native transactional database for structured data storage, including binary data (Blobs). Used as the primary client-side persistence layer on Web. See [Storage Architecture](./33-storage-architecture.md).

---

## J

**JSI (JavaScript Interface)**
: React Native's New Architecture mechanism for direct synchronous communication between JavaScript and native code, replacing the asynchronous Bridge. See [Native Bridge Design](./49-native-bridge-design.md).

---

## L

**libvips**
: A fast image processing library with a small memory footprint. The primary processing engine for ImageForge. On Web, compiled to WebAssembly. See [ADR-0004](./adr/ADR-0004-image-library.md).

**LLD (Low-Level Design)**
: A detailed technical design specifying component internals, data structures, algorithms, and interfaces. See [Low-Level Design](./23-low-level-design.md).

**LUT (Look-Up Table)**
: A lookup table mapping input color values to output color values, used for applying color grading filters efficiently. See [Filters Module](./features/filters.md).

**Lossless Compression**
: Image compression that reduces file size without discarding any image data. Produces bit-perfect reconstructions. Formats: PNG (via pngquant palette optimization), WebP lossless.

**Lossy Compression**
: Image compression that reduces file size by selectively discarding image data. Produces visually similar but not bit-perfect output. Formats: JPEG (via mozjpeg), WebP lossy, AVIF.

---

## M

**Managed Workflow (Expo)**
: An Expo project configuration where Expo manages the native code. Upgrades are handled by Expo's SDK. Preferred for maximum DX and OTA update support. See [ADR-0009](./adr/ADR-0009-expo-vs-bare.md).

**Metro**
: The JavaScript bundler for React Native. Used for the mobile build pipeline. See [Build System](./79-build-system.md).

**Monorepo**
: A version-controlled repository containing multiple projects (apps and packages) managed as a single unit. ImageForge uses Turborepo. See [Monorepo Architecture](./25-monorepo-architecture.md).

**mozjpeg**
: Mozilla's fork of the JPEG encoder, offering significantly better compression than the standard libjpeg at equivalent quality. Used for JPEG compression in ImageForge. See [Third-Party Libraries](./77-third-party-libraries.md).

**MVP (Minimum Viable Product)**
: The smallest set of features that delivers core value and validates the product concept. See [MVP Definition](./11-mvp-definition.md).

---

## N

**NFR (Non-Functional Requirement)**
: A requirement specifying quality attributes of the system rather than specific behaviors — performance, security, scalability, accessibility. See [Non-Functional Requirements](./06-non-functional-requirements.md).

**Native Module**
: A Kotlin (Android) or Swift (iOS) module that exposes native device capabilities to React Native JavaScript code via the JSI bridge.

---

## O

**OCR (Optical Character Recognition)**
: The technology for converting images of text into machine-readable text. ImageForge integrates Tesseract.js (Web) and ML Kit (mobile). See [OCR Module](./features/ocr.md).

**Offline-First**
: An architectural principle where the application is designed to function fully without a network connection, syncing when connectivity is available. See [Offline-First Architecture](./38-offline-first-architecture.md).

**OTA (Over-The-Air) Update**
: A mechanism to update the JavaScript bundle of an Expo/React Native app without going through the app store review process. Provided by Expo EAS Update.

---

## P

**Package**
: A library unit within the monorepo (`packages/image-core`, `packages/ui`, etc.) that can be imported by app workspaces or other packages.

**Perceptual Hash (pHash)**
: A hash of an image that is similar for visually similar images, used for duplicate detection. Unlike cryptographic hashes, small changes to the image result in small changes to the pHash.

**Pipeline**
: See _Image Pipeline_.

**Platform Abstraction**
: The pattern of defining a shared interface and providing platform-specific implementations behind it (`.web.ts`, `.native.ts` file extensions). See [Platform Abstraction](./28-platform-abstraction.md).

**pngquant**
: An open-source PNG compressor that reduces PNG file sizes by converting to indexed color (8-bit palette). Used for lossless PNG compression.

**PRD (Product Requirements Document)**
: A document defining the product's features, behavior, and constraints from the user's perspective. See [PRD](./03-product-requirements-document.md).

**PWA (Progressive Web App)**
: A web application that uses modern browser APIs to provide app-like experiences including offline support, push notifications, and home screen installation. ImageForge's web app is a fully compliant PWA.

---

## Q

**Queue**
: An ordered list of image processing jobs waiting to be executed. The Batch Processing Engine manages the queue. See [Batch Processing Module](./features/batch-processing.md).

---

## R

**React Native Web (RNW)**
: A library that renders React Native components to the DOM, enabling code sharing between mobile and web applications. See [ADR-0002](./adr/ADR-0002-react-native-web.md).

**Reanimated**
: React Native Reanimated v3. A library for creating high-performance animations that run on the UI thread (native) or via WASM (Web), bypassing the JavaScript thread.

**RTM (Requirements Traceability Matrix)**
: A matrix mapping business requirements to functional requirements, features, screens, and tests. See [RTM](./13-requirements-traceability-matrix.md).

---

## S

**Service Worker**
: A browser script that runs in the background and can intercept network requests, enabling offline functionality and PWA features. See [Offline-First Architecture](./38-offline-first-architecture.md).

**Skia**
: An open-source 2D graphics library. React Native Skia provides a unified canvas API across iOS, Android, and Web. Used for real-time filter previews and drawing tools.

**Smart Crop**
: An AI-assisted crop that identifies the most visually interesting region of an image (e.g., faces, subjects) and centers the crop around it. See [Crop Module](./features/crop.md).

**Sprite Sheet**
: A single image containing multiple smaller images (sprites) arranged in a grid. Used in game development and UI icon management. See [Sprite Sheet Module](./features/sprite-sheet.md).

**Store (Zustand)**
: A Zustand state management store. ImageForge uses a domain-partitioned store design. See [State Management](./35-state-management.md).

---

## T

**TanStack Query**
: A powerful async state management library for React. Used in ImageForge for managing asynchronous processing operations and their cache. See [State Management](./35-state-management.md).

**Turborepo**
: A high-performance build system for JavaScript/TypeScript monorepos. Provides incremental builds, remote caching, and parallel execution. See [Monorepo Architecture](./25-monorepo-architecture.md).

**TypeScript**
: A typed superset of JavaScript. ImageForge uses strict TypeScript throughout. See [TypeScript Guidelines](./73-typescript-guidelines.md).

---

## V

**Virtualization**
: The technique of rendering only the visible portion of a large list or grid, keeping memory and CPU usage constant regardless of dataset size. See [Virtualization](./performance/virtualization.md).

**Vite**
: A fast web bundler used for the React Native Web application in development and production. See [Build System](./79-build-system.md).

---

## W

**WASM (WebAssembly)**
: A binary instruction format that allows code written in languages like C/C++ (libvips, FFmpeg, mozjpeg) to run in the browser at near-native speed. The key enabler of client-side image processing on Web. See [WASM Architecture](./49b-wasm-architecture.md).

**Web Worker**
: A browser API for running scripts in background threads, preventing heavy computations from blocking the UI. ImageForge runs WASM image processing inside Web Workers. See [Background Job System](./32-background-job-system.md).

**WebP**
: A modern image format developed by Google, offering superior lossless and lossy compression compared to PNG and JPEG. Widely supported across all target platforms.

**Worker Pool**
: A collection of pre-initialized Web Workers that can be assigned tasks from a queue, enabling parallel image processing. See [Batch Processing Engine](./30-batch-processing-engine.md).

---

## Z

**Zustand**
: A small, fast, and scalable state management library for React. The primary client-side state manager in ImageForge. See [ADR-0003](./adr/ADR-0003-state-management.md) and [State Management](./35-state-management.md).

---

_Last updated: 2026-07-27 | Maintained by: Architecture Team_
