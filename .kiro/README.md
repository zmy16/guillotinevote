# Kiro development evidence

This folder holds the Kiro artifacts for GuillotineVote (Kiroween 2026, Costume Contest). It lists only what actually exists in this repository and what was actually done. Nothing here is planned work.

## What is in this folder

| Path | What it is |
|---|---|
| `steering/product.md` | Product vocabulary, scope, and non-goals. Loaded by Kiro on every request. |
| `steering/tech.md` | Stack, architecture boundaries, code rules, and commands. Loaded on every request. |
| `steering/horror-ux.md` | Color meaning, motion, sound, accessibility, and the per-page night scenes. Loaded on every request. |
| `specs/guillotine-engine/requirements.md` | Requirements for the pure game engine, in EARS form. |
| `specs/guillotine-engine/design.md` | State schema, function contracts, share-link format, and restore rules. |
| `specs/guillotine-engine/tasks.md` | Tasks with the tests that prove each one. |

## How Kiro was used

- **Agent-driven implementation.** The work recorded in the git history was done in sessions with the Kiro agent: the stage layout rework (guided by `STAGE_LAYOUT_PLAN.md`), resumable trials, Match history cards with delete, blade sound timing, the responsive pass for phones, the code audit, the logo and SEO work, the per-page backdrop scenes, and the README. Every step ended with a build, the test suite, and a browser check.
- **Project rules as steering.** `AGENTS.md` at the repository root is the working contract the agent followed: smallest change that solves the task, no comments in code, a pure `src/engine.js`, tests for new logic, and no new dependency without a stated need. The files in `steering/` restate those rules for Kiro's steering feature.
- **Spec documents.** `PRD.md`, `TECH_STACK.md`, `DESIGN.md`, `IMPLEMENTATION_PLAN.md`, and `STAGE_LAYOUT_PLAN.md` at the repository root drove the work. `specs/guillotine-engine/` turns the engine part into the requirements, design, and tasks format.
- **Property-based testing.** `tests/engine.property.test.js` uses fast-check for game invariants: exactly one survivor after N-1 executions, a pardon keeps the living count and cannot be used twice, the share state round-trips exactly, and malformed share payloads are rejected without throwing. The other test files cover the integration flow, share-link hardening, snapshot restore, and match history validation.

## Honest notes

- The steering files and the engine spec in this folder were written on 2026-11-19, after most of the code existed. They were derived from `PRD.md`, `TECH_STACK.md`, `DESIGN.md`, and `AGENTS.md` and checked against the code and the tests. They record the rules and the engine contract. They did not drive the first version of the engine.
- No agent hooks were created or run.
- No MCP server or Kiro power is part of the product or its build.
