# GuillotineVote Implementation Plan

This plan turns `PRD.md`, `TECH_STACK.md`, and `DESIGN.md` into ordered, shippable work. Each phase ends with something runnable and verifiable. Do not start a later phase before the earlier one is done and checked.

Ground rules carried over from `AGENTS.md`:

- Smallest change that fully solves the task. No speculative code, no scaffold "for later".
- Pure game rules live in `src/engine.js` (or `src/engine.js` re-exported through a hook). React components render state and dispatch actions; they never contain game rules.
- New non-trivial logic ships with a test. Run `npm test` and `npm run build` after each change.
- No comments in code. Self-documenting names only.
- Document only Kiro usage that actually happened.

Open decisions in `PRD.md` section 14 (refresh persistence, share-URL max size, name/verdict length caps, confirm-before-copy) must be settled before the phase that needs them. Settle each with the project owner, then record the decision at the top of the relevant phase.

---

## Phase 0 — Kiro project setup (half day)

Goal: repository scaffold that Kiro can steer, and the `/.kiro` evidence folder the submission requires.

Tasks:

1. Scaffold the app with Vite + React + JavaScript (ESM). Add the scripts `dev`, `build`, `test`.
2. Install only what the stack names: `vitest`, `fast-check`, `gsap`, `lucide-react`, and shadcn/ui plus its Tailwind prerequisites. No other runtime dependency.
3. Self-host fonts from `DESIGN.md` via `@fontsource-variable/inter` and the Cinzel package. Do not hotlink Google Fonts.
4. Create the `/.kiro` folder with steering files:
   - `/.kiro/steering/product.md`: English-only UI, medieval-courtroom vocabulary (The Accused, Drop the Blade, Royal Pardon, The Graveyard, Sole Survivor).
   - `/.kiro/steering/tech.md`: React + Vite, pure engine module, no backend, accessibility contract from `DESIGN.md` section 10.
   - `/.kiro/steering/horror-ux.md`: color tokens, contrast, reduced motion, sound control from `DESIGN.md`.
5. Create the `/.kiro/specs/guillotine-engine/` spec trio (`requirements.md` in EARS form, `design.md` with the state schema, `tasks.md`). Derive the requirements from `PRD.md` section 8.
6. Add the MIT `LICENSE` file. Make sure `.gitignore` does **not** exclude `/.kiro`.

Definition of done: `npm run dev` serves the default Vite page, `npm test` runs an empty Vitest suite without error, and `/.kiro` is committed.

Kiro evidence to record: which steering files shaped later code, which spec files were consumed.

---

## Phase 1 — Pure game engine + property tests (2–3 days)

Goal: the whole game is a pure, DOM-free module that passes property-based tests. This is the highest-risk logic, so it comes first.

Tasks:

1. Define the state shape in `src/engine.js` (or `src/engine/`): `title`, `players[]`, `options[]` (`{id, label, status: 'alive' | 'executed' | 'pardoned'}`), `currentPlayerIndex`, `round`, `pardonAvailable`, `graveyard[]` (executions and pardons in order), `winner` (null until done).
2. Implement pure functions with explicit named actions:
   - `createGame(setup)` with validation from `PRD.md` 8.1 and 8.2 (2–8 players, 3–12 unique non-blank options).
   - `selectOption(state, optionId)` and `selectVerdict(state, verdict)` (preset or `{kind:'other', text}` after trim and length cap).
   - `executeSelected(state)` → returns new state with one graveyard record and the turn advanced exactly once (`PRD.md` 8.4, 8.5).
   - `grantRoyalPardon(state)` → preserves the selected option, consumes the pardon, creates no execution record, advances the turn exactly once (`PRD.md` 8.6).
   - `applyIdleExecution(state, rng)` — only if the owner confirms the idle-executioner timer is in scope. Use a seeded RNG so it is reproducible (`TECH_STACK.md`).
   - `encodeShareState(result)` and `decodeShareState(payload)` for the URL round-trip.
3. Reject invalid actions without mutating state (`PRD.md` 8.7): executing after completion, second pardon, pardon after completion, selecting a dead option.
4. Write Vitest + fast-check property tests in `tests/engine.property.test.js`:
   - Single-survivor invariant: for any starting option count N (3 ≤ N ≤ 12), after N−1 legal executions exactly one option is alive and the graveyard has exactly N−1 execution records.
   - Pardon invariant: alive count unchanged across a pardoned turn; a second `grantRoyalPardon` is rejected; the pardon does not create an execution record.
   - Share round-trip invariant: `decodeShareState(encodeShareState(result))` deep-equals the original winner and history, including names with spaces, punctuation, and non-ASCII (`PRD.md` 8.9).
   - Malformed/oversized share payload is rejected without throwing (`PRD.md` 8.10).
5. Decide and record the caps for name length, option label length, verdict text length, and share-URL size before writing the share encoder.

Definition of done: `npm test` green, all four invariants covered, engine imports no DOM or React.

Kiro evidence to record: the EARS requirements that drove the engine, any bug PBT found and fixed.

---

## Phase 2 — Setup and landing (2 days)

Goal: a player can go from landing to a valid game in under a minute.

Tasks:

1. Build the landing section from `DESIGN.md` section 6 (`TurnIndicator` comes later; skip it here): hero, one-line rules, four 1-click presets (Dinner Dilemma, Friday Movie Night, Team Hangout Spot, Campus Project Topic) from `src/presets.js`.
2. Build the setup form: editable preset options, custom title, 2–8 player names, 3–12 unique options. Validate on submit and on blur with accessible error text tied to each field (`PRD.md` 8.2).
3. Wire "Start game" to `createGame` and route to the stage view.
4. Add the sample-round entry point that mounts the game with a fixed fictional setup and a "Restart sample"/"Exit sample" control. The sample must not touch real game state (`PRD.md` 6.4, 8.11). The cleanest isolation is a separate route/param that mounts the same components over a sample reducer instance.
5. Reuse shadcn/ui primitives styled with the `DESIGN.md` tokens. No new UI library.

Definition of done: a preset game and a custom game both start with valid state; invalid input is rejected with clear feedback; the sample round is isolated and restartable. Keyboard-only run-through recorded.

---

## Phase 3 — Stage: turn, execution, pardon (3 days)

Goal: the core loop is playable end to end on one shared device.

Tasks:

1. Build `TurnIndicator`, `PrisonerCard` grid, `VerdictChip` row, `DropTheBladeButton`, and `RoyalPardonButton` from `DESIGN.md` section 6.
2. Two-step selection: pick one living prisoner, then a verdict, then the CTA enables. The `Other` verdict opens the short text field with the agreed cap.
3. On execute, dispatch `executeSelected`, run the blade animation from `DESIGN.md` section 8 (GSAP, reduced-motion aware), then move the option to the graveyard.
4. On pardon, dispatch `grantRoyalPardon`, run the shield animation, keep the option alive, advance the turn, and record the pardon in the graveyard.
5. Add the polite live region that announces turn changes, executions, and pardons (`DESIGN.md` section 10).
6. Add keyboard support: cards and chips are reachable and activatable; the CTA stays disabled until both selections exist.
7. When one option remains, transition to the winner view.

Definition of done: `PRD.md` acceptance criteria 3–8 pass by hand on desktop and mobile Safari/Chrome; the sample round and a real preset game both complete; reduced-motion and sound-off runs are understandable.

Kiro evidence to record: any hook run here (for example a test-on-save hook for `engine.js`, if actually configured and verified).

---

## Phase 4 — Graveyard and winner decree (2 days)

Goal: completed games are readable and shareable without a backend.

Tasks:

1. Build `HeadstoneCard` and the pardon entry layout. Render executions and pardons distinctly (`DESIGN.md` section 6).
2. Build `WinnerDecree` with crown, survivor name, and the concise match history.
3. Add the share action: `encodeShareState` → URL, copy to clipboard, with the pre-copy warning that names and history become visible to anyone with the link (`PRD.md` 6.5, 8.9).
4. Build the read-only result view that mounts from a share URL: decode, validate, and render. Malformed or oversized payloads render a useful invalid-link state without crashing (`PRD.md` 8.10).
5. Decide whether copy requires all players to confirm; implement whatever the owner decides (`PRD.md` open decisions).

Definition of done: a finished game produces a working share URL; opening it in a fresh tab shows the same winner and graveyard; a corrupted URL shows the invalid state. Round-trip covered by the Phase 1 PBT.

---

## Phase 5 — Audio, polish, accessibility pass (2 days)

Goal: the horror theme lands without hurting usability.

Tasks:

1. Implement the Web Audio synth sounds from `DESIGN.md` section 9 behind the mute toggle; persist the choice in `localStorage`; default muted; never autoplay.
2. Add the optional decorative texture (sparkle pattern, candle glow) without reducing contrast.
3. Run an accessibility pass: contrast check against `DESIGN.md` section 10, visible focus on every control, keyboard-only full game, screen-reader run of one turn, `prefers-reduced-motion` run.
4. Verify no state signal relies on color alone and no motion is required to read the game.

Definition of done: `PRD.md` acceptance criteria 12–14 pass. Note anything intentionally deferred.

---

## Phase 6 — Deployment and submission (1–2 days)

Goal: a public, free URL that survives the judging period, plus the Devpost package.

Tasks:

1. Pick the static host (Vercel or GitHub Pages per `TECH_STACK.md`). Deploy the production build. Confirm the URL is free and publicly reachable (`PRD.md` section 10).
2. Confirm the repo is public on GitHub, MIT `LICENSE` is visible, and `/.kiro` is committed and not ignored (`PRD.md` section 12).
3. Write the Devpost copy using the elevator pitch and category description that lead with "Costume Contest". Name the category in the submission.
4. Record the demo video under three minutes following the storyboard in `PRD-source.md` section 6 (adjust to whatever was actually built — do not demo features that were cut). English captions. No third-party trademarks.
5. Write the testing instructions for judges, including the sample-round path and the share-URL behavior.
6. Write the development write-up describing only Kiro work that actually happened (steering, specs, hooks, PBT).

Definition of done: judging URL live, repo public with license and `/.kiro`, Devpost submitted, video published, write-up honest about Kiro usage.

---

## Deferred / out of scope

Not built unless the owner explicitly reopens them (`PRD.md` section 4):

- Accounts, backend, database, cross-device multiplayer.
- Paid AI/LLM APIs.
- Bot players.
- Saving an unfinished game across refresh.
- Analytics or third-party tracking.

## Risk checkpoints

| Risk | Where it is caught |
|---|---|
| Engine rules drift from PRD | Phase 1 PBT plus `PRD.md` section 8 criteria |
| Share URL exposes more than intended | Phase 1 encoder caps, Phase 4 pre-copy warning |
| Horror visuals hurt readability | Phase 5 accessibility pass |
| Scope creep past the hackathon window | Deferred list above; each phase has a definition of done |
| Overstated Kiro usage | Phase 0 evidence notes; Phase 6 write-up review |
