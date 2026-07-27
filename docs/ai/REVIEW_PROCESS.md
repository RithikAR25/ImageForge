# AI Review Process

> **Document ID**: ai/REVIEW_PROCESS
> **Phase**: AI Development
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document defines the review process for AI-generated code contributions to the ImageForge codebase — quality gates, review checklist, and escalation paths.

---

## Why an AI-Specific Review Process?

AI-generated code has specific failure modes that differ from human-written code:

1. **Plausible-sounding but incorrect logic** — especially for complex algorithms
2. **Hallucinated API calls** — using APIs that don't exist or have different signatures
3. **Missing edge cases** — AI tends to implement happy paths and miss error handling
4. **Style inconsistencies** — code that works but doesn't follow project conventions
5. **Copyright issues** — training data may include GPL-licensed code patterns

---

## AI Code Review Checklist

Reviewers must verify all items before approving AI-generated code:

### Correctness

- [ ] Output matches the specification (compare to relevant feature doc)
- [ ] All error paths are handled (no silent failures)
- [ ] Edge cases covered (empty input, max size, invalid config, abort signal)
- [ ] Async operations have proper await/cancel handling
- [ ] No hallucinated API calls (verify each external API against its documentation)

### Type Safety

- [ ] No `any` types (must be `unknown` with type guards)
- [ ] Return types explicit on all exported functions
- [ ] Readonly on domain object properties
- [ ] Discriminated unions used for operation types

### Security

- [ ] No image data sent to any network endpoint
- [ ] User input sanitized before use in filename/path
- [ ] EXIF/metadata not logged
- [ ] No `eval()`, `Function()`, or dynamic code execution

### Performance

- [ ] Processing operations NOT on the main JS thread
- [ ] Large arrays/buffers use typed arrays (`Uint8Array`, `Float32Array`)
- [ ] No synchronous operations that block for > 16ms
- [ ] Memory allocated is properly freed (Blob URLs revoked, Workers terminated)

### Testing

- [ ] Unit tests cover: happy path, error cases, boundary values, abort signal
- [ ] Tests actually run and pass (`pnpm test`)
- [ ] No tests that mock the thing being tested (anti-pattern)

### Documentation

- [ ] JSDoc present on all exports
- [ ] `@example` shows realistic usage
- [ ] `@throws` documents all error types

---

## Escalation

If AI-generated code passes the checklist but the reviewer is uncertain:

1. **Request algorithm explanation**: Ask the AI to explain its approach in plain English
2. **Verify against spec**: Cross-reference with `docs/features/[feature].md`
3. **Run benchmarks**: For performance-critical code, run the benchmark suite
4. **Architecture review**: Tag `@architecture-team` for review of structural changes

---

## Prohibited AI Usage

Do NOT use AI to generate:

- [ ] Cryptographic implementations (use audited libraries)
- [ ] Security-critical validation logic (use Zod schemas, audit manually)
- [ ] License headers (must be human-authored)
- [ ] Commit messages (misleads git blame)

---

## Tooling

Recommended AI tools for ImageForge development:

- **Gemini Code Assist**: Primary (context-aware of full codebase)
- **GitHub Copilot**: For autocomplete during active development
- **Claude**: For complex refactoring and documentation generation

All AI sessions should start with providing `docs/ai/SYSTEM_PROMPT.md` as context.

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
