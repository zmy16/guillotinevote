# AGENTS.md

This file is for agents working in this repository. It is authoritative. Follow it before writing code.

## Project

GuillotineVote: a horror-themed, client-side React reverse-voting web app for a group to eliminate options until one survives. Built for the Kiroween 2026 hackathon, Costume Contest category. The product contract is `PRD.md`; the technical stack is `TECH_STACK.md`. Read both before changing behavior.

## How to Work

1. Before changing code, read the task, the code it touches, its callers, and its tests. Know what already works so you do not break it.
2. Change the smallest thing that fully solves the task. No feature beyond what is asked.
3. Run the relevant tests and build after a change. Fix what you broke.
4. One behavior change at a time. Do not bundle an unrelated cleanup into a bug fix.
5. Do not add a dependency without a concrete need stated in the task.
6. If a requirement is ambiguous, ask. Do not guess at product behavior.

## Rules of Writing Code

The codebase follows a deliberately minimal style. These rules are strict.

- **No comments anywhere in code.** Write code that explains itself through names, types, structure, and tests. This applies without exception:
  - Do not add line comments, block comments, JSDoc, `// TODO`, `// FIXME`, or file header comments.
  - Do not add license headers to source files.
  - Do not preserve comments from code you touch or move. Delete them.
  - Do not write comments to justify a workaround. Fix the problem or leave the code plainly wrong rather than annotated.
  - If a change is so unclear it needs a comment, rename or restructure until it does not.
- **Self-documenting names only.** Choose explicit variable, function, component, and test names. Prefer `isPardonAvailable` over a comment explaining state.
- **No speculative code.** Do not add options, flags, interfaces, factories, or configuration that are not used now.
- **No scaffold "for later".** Do not create empty files, stubs, TODO placeholders, or abstractions awaiting a future feature.
- **Deletion beats addition.** Prefer removing code and dependencies over adding them.
- **Boring beats clever.** Choose the readable solution over the clever one when both work.
- **Fewest files possible.** Extend existing modules in the existing structure. Do not create a new file unless the task truly needs one.
- **Smallest diff wins**, once the change is complete and correct.

## YAGNI

Never build it until it is asked for:

- No abstraction with a single implementation.
- No factory for a single product.
- No interface that exists only to be implemented once.
- No configuration for a value that never changes.
- No "for later" branching, plugin systems, or extension points.
- No feature that the PRD marks out of scope. If a request implies one, confirm before building it.

Before writing, stop at the first rung that holds:

1. Does this need to exist?
2. Does the standard library solve it? Use that.
3. Does the platform or browser already provide it? Use that before adding a dependency.
4. Does an installed dependency already cover it? Use it. Do not add a package for something a few lines do.
5. Can it be one line? One line.
6. Only then, the minimum code that works.

## Ponytail (Lazy Senior Developer)

Work like a lazy senior developer: efficient, not careless.

- Be lazy about the solution, never about the change itself. Finish every part of the task, including callers, tests, and fixtures it touches.
- Reuse existing helpers and patterns in this codebase before adding new ones.
- Keep values in the form the platform already gives them. Do not add conversions or wrappers.
- Between two options of equal size, pick the one correct on edge cases.
- Do not cut validation at trust boundaries, error handling that prevents data loss, security, or accessibility. These are never optional.
- Do not simplify away anything the task or PRD explicitly requires.

## Preventing Code Smells

These principles are mandatory when writing or refactoring. Apply them as you write so smells do not appear. Do not run broad refactors outside the current task's scope.

- **Single Responsibility.** A function, component, or module has one job.
- **Don't Repeat Yourself.** Extract repeated logic, but only after it repeats. Do not pre-abstract.
- **Encapsulation.** Keep implementation details inside a module. Do not reach into internal state from outside.
- **Law of Demeter.** Avoid chaining through nested properties to reach a deep object's internals.
- **Small functions and components.** Prefer a function that fits on one screen over one that sprawls.
- **Pure engine, side-effect-free UI logic.** The game engine in `src/engine.js` stays pure and DOM-free. React components render state and dispatch actions; they never contain game rules.
- **Explicit state transitions.** State changes go through named actions, never arbitrary mutation scattered in render code.
- **No dead code.** Delete unused imports, variables, files, and exports. Do not leave them "just in case".
- **No magic numbers or strings.** Use named constants for values with meaning.
- **Consistent naming.** Use the project's existing vocabulary. Medieval-courtroom strings stay in the steering-defined place, not invented ad hoc in components.
- **No premature optimization.** Optimize only with a measured need.

## Testing and Verification

- Run the relevant tests, lint, and build after every change you make. Do not run irrelevant suites just to satisfy the ritual.
- New non-trivial logic (a new rule, a branch, a parser, share-URL encoding) must ship with a test. Trivial changes need none.
- Do not add a new test framework or tool unless the task asks for one.
- Do not fake or soften a test to make it pass. Fix the cause.
- Do not claim verification you did not perform.

## Accessibility and Safety

- Keep keyboard access, visible focus, readable contrast, and reduced-motion behavior.
- Never remove an accessibility feature to make an animation simpler.
- Validate any untrusted input, including share-URL parameters. Never `eval` or `dangerouslySetInnerHTML` share data.
- Do not store secrets or personal data beyond what the PRD permits.

## Deliverables and Reporting

- Code first. After the code, state briefly: what you skipped, and any risk the user must know.
- Report failures plainly. Do not wrap a broken state as "done".
- Do not delete files, keys, or data you did not create without asking.
- Do not push, publish, deploy, or modify hosting configuration without explicit instruction.
