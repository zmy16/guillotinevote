# Stage layout + blade rig rework

Status: planned, not implemented.

Scope: `src/components/Stage.jsx`, `src/components/Prisoner.jsx` (`GuillotineRig`), `src/styles/stage.css`.
Out of scope: sound, copy, engine rules, history.

---

## Problem

The blade is the product's one dramatic moment. Today the player never sees it work.

`src/styles/stage.css:1` makes `.stage` a single flex column. Vertical order:

```
[ turn indicator ]
[ rig / guillotine ]     ~400 px, middle of the page
[ prisoner grid ]        ~2 rows of cards
[ verdict section ]      4 chips + hint
[ action row ]           "Drop the Blade"  <-- bottom of the page
```

Total stack is roughly 1000-1100 px on a 900 px viewport. Three consequences:

1. **Trigger and actor are on different screens.** The button that drops the blade sits at the bottom; the blade sits ~400 px above it. When clicked, `src/components/Stage.jsx:67` runs `window.scrollTo({ top: 0 })` and the page jumps. The fall happens off-screen or mid-jump. Nobody sees it in real time.
2. **The blade hits nothing.** The rig drops onto a plain wooden bar (`rect x="72" y="140"` in `GuillotineRig`), not onto a person. Blood then appears in empty air, which reads as a mystery rather than a consequence.
3. **The rig does not look built.** Posts are single `<path>` strokes with `stroke-linecap: round` plus a few tick marks; the crossbeam is one thick line. It reads as stacked blocks, not carpentry.

---

## Part 1 — Layout: give the blade its own stage

### Desktop (>= 960 px): two columns

```
+--------------------+-------------------------+
|                    |  turn indicator         |
|    GUILLOTINE      |  prisoner grid          |
|    sticky,         |  verdict section        |
|    full height     |  [ Drop the Blade ]     |
+--------------------+-------------------------+
```

- Rig moves out of `.blade-frame` into its own column, `position: sticky; top: 0`, full viewport height, rig width ~440 px.
- All controls stay in the right column, in a scrollable region if the player list is long.
- Click happens in the right column, blade falls in the left. Both on one screen. No scroll, no jump.

### Mobile (< 960 px): one column, rig first

```
[ turn indicator ]
[ GUILLOTINE ]           stage at the top
[ verdict + Drop Blade ] action directly under the blade
[ prisoner grid ]
```

The action row moves above the grid on narrow screens so the button and the blade stay adjacent, even when the page scrolls.

### Code changes

- `src/styles/stage.css:1` — `.stage` becomes `grid-template-columns: minmax(0, 420px) minmax(0, 1fr)` at >= 960 px, single column below.
- New `.stage-rig` wrapper: `position: sticky; top: var(--space-4); align-self: start;`.
- `.action-row` inside the right column: `position: sticky; bottom: 0` with a background so it stays reachable.
- `.guillotine-rig` width: `min(100%, 300px)` -> `min(100%, 440px)` on desktop.
- Mobile: reorder via `order` so verdict + action come before `.prisoner-grid`.
- Remove `window.scrollTo` in `src/components/Stage.jsx:67`. Nothing needs to move any more. Verify no other caller depends on that scroll.

### Risk to check first

`src/usePageEnter.js` animates every direct `.page > *` child with `opacity` and `y` transforms and calls `scope.revert()` on cleanup. A `position: sticky` child inside an element that carries a transform will not stick. Read the mount path and confirm the sticky column is not inside a transformed node, or animate only opacity for that subtree.

---

## Part 2 — The blade must hit something

Replace the plain wooden bar with a **lunette**: two wooden jaws with a half-circle notch facing each other, the prisoner's neck between them. That is what the machine actually chops.

- Blade travel ends at the notch, not through the plank (`y: 63` today stops the edge inside the wood).
- Blood originates from the notch and spills down the front of the block, not from empty air above it.
- Two small jaw halves that snap shut before the fall (`x` toward the centre, 0.12 s) sell the restraint and explain why the victim cannot move.

Deliberately not adding a body, a head, or a figure. The horror stays implied; the mechanism does the talking.

---

## Part 3 — Rebuild the rig as carpentry

Current defects, all in `GuillotineRig`:

| Part | Today | Should be |
| --- | --- | --- |
| Post | one 9 px stroke, `linecap: round` | tapered profile: wide capital, slim shaft, flared foot, carved moulding rings |
| Foot | two short ticks | stepped stone plinth with a shadow gap |
| Crossbeam | 11 px stroke + one highlight | real beam: top face, front face, end grain at both tips, iron bolt through each end |
| Blade | flat triangle, gold-amber gradient | dark iron body, bright honed bevel along the cutting edge, leather-wrapped shank at the top, two iron pins |
| Wood colour | light purple `#a78bfa -> #4a3579` | charred oak: `#6b4b32 -> #2a1d14`, lit from upper left |
| Palette | purple-dominant | keep purple in the *light*, let the wood be wood |

Keep every existing animation hook: `.rig-blade`, `.rig-shadow`, `.rig-flash`, `.rig-sparks`, `.rig-dust`, `.rig-debris`, `.rig-drops`, `.rig-rope`, `.rig-speed`, `.rig-edge-glow`. The timeline in `Stage.jsx` must not need rewriting for the redraw.

Add only: the two lunette jaws (`.rig-jaw`) and one `ref`-free handle on them, animated from the existing timeline.

---

## Part 4 — Execution plays in place

Today `App.jsx` commits the state immediately, so the board already shows the next player's turn and the victim's card is already gone while the blade is still falling. Fix the order:

1. Click `Drop the Blade`.
2. Jaws snap shut (0.12 s).
3. Blade hoists, holds, falls, lands (existing timeline, ~1.2 s to impact).
4. Blood, dust, sparks, frame shake (existing timeline).
5. **Only now** does state commit: the executed card animates out downward, the survivor count decrements, the turn indicator swaps.
6. Blade winches back up.

This means deferring `executeSelected` by the impact duration. Concretely: `handleExecute` in `src/App.jsx:155` computes the new state, hands it to `Stage` for playback, and commits on a callback. Guard against double submissions while playback is running.

Alternative, smaller: keep the immediate commit and only hide the turn-indicator swap until the blade lands (a CSS delay, no state plumbing). Worse, because the victim's card still disappears first. Take the full deferral.

---

## Order of work

1. Layout (Part 1) — the blade becomes visible. Verify at 1440, 960, 768, 360.
2. Lunette (Part 2) — the blade hits something.
3. Rig redraw (Part 3) — the machine looks built.
4. Deferred commit (Part 4) — the moment reads in real time.

Each step is verified alone: `npm run build`, `npx vitest run`, then frame capture with Playwright, then review the frames.

---

## Open questions

- Desktop two-column: should the rig column carry the turn indicator too, or stay pure stage?
- Should the executed card visibly *fall into* the Graveyard, or simply cut away?
- Keep the `Drop the Blade` label on the button, or rename once the blade is on screen permanently?

## Known unknowns

- Sticky inside `usePageEnter`'s transformed subtree — untested, may need exemption.
- Rig at 440 px on a 360 px viewport: must clamp, verify no horizontal overflow.
- Deferred commit interacts with `announce()` timing for screen readers; the aria-live message should not fire before the blade lands.
