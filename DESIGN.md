# GuillotineVote Design System

This document is the visual and interaction contract for GuillotineVote. `PRD.md` defines what the product does; this file defines how it looks and feels. Follow this before writing UI code. Any visual decision not covered here should be resolved toward "haunted royal court": dark purple stage, candle-gold accents, restrained blood-red for execution only.

Category: **Costume Contest (Kiroween 2026)**. The horror theme is functional, not decoration. Every spooky element must help the player read state.

## 1. Design Direction

Theme: a **medieval execution court at midnight**, staged like a horror arcade. Think royal decree meets haunted graveyard, rendered with the friendly-but-spooky Halloween illustration style in the reference boards (purple night, pumpkin orange, friendly ghosts, candle glow) rather than gore or photorealism.

Three pillars:

1. **Readable first.** The guillotine, prisoners, graveyard, pardon, and decree are all state indicators. If a player cannot tell whose turn it is without animation or sound, the design has failed.
2. **One accent per meaning.** Purple is the stage. Gold is for interactive/primary actions and the Royal Pardon. Blood-red appears only for execution. Green appears only for the survivor.
3. **Playful horror, not torture.** Friendly ghosts, candle glow, and pumpkin-orange warmth. No realistic blood, no screaming faces, no gore. Safe for a public judge link.

Mood references from the supplied boards:

- Board 1 (purple Halloween app): deep purple night background, orange category cards, cream friendly ghost, subtle sparkles, light outer canvas. Use for the landing/preset selection mood.
- Board 2 (dark horror reader): near-black background, single orange accent, soft 3D Halloween hero, glowing primary button. Use for the chopping-block and result screens.
- Board 3 (purple shopping app): violet hero, glowing pumpkin, dark cards with gold CTAs, fence silhouette. Use for graveyard headstones and the winner decree.

## 2. Color Tokens

Define these once as CSS custom properties and reuse everywhere. Do not invent new colors per component.

### Surfaces (purple night)

| Token | Value | Use |
|---|---|---|
| `--bg-void` | `#0d0817` | Page background, deepest layer |
| `--bg-court` | `#151026` | Main stage sections |
| `--bg-card` | `#1e1735` | Prisoner cards, headstones, panels |
| `--bg-card-hover` | `#271d45` | Hover and focus surfaces |
| `--border-ghost` | `rgba(196, 181, 253, 0.16)` | Hairline dividers, card borders |

### Primary (royal purple)

| Token | Value | Use |
|---|---|---|
| `--purple-300` | `#c4b5fd` | Muted text on dark, sparkle accents |
| `--purple-500` | `#8b5cf6` | Primary interactive elements, focus rings |
| `--purple-600` | `#7c3aed` | Primary button fill |
| `--purple-700` | `#6d28d9` | Primary button hover |
| `--purple-glow` | `rgba(139, 92, 246, 0.35)` | Glow around active player and selected card |

Purple is the brand. It carries the "royal court" feeling and the default interactive state.

### Accent (candle gold / pumpkin)

| Token | Value | Use |
|---|---|---|
| `--gold-300` | `#fde68a` | Candle highlights, star sparkles |
| `--gold-500` | `#f59e0b` | Primary CTA (Drop the Blade, Start, Copy Link), Royal Pardon shield, stars/ratings-like emphasis |
| `--gold-600` | `#d97706` | Gold hover, headstone engraving |
| `--orange-500` | `#f97316` | Warm pumpkin accent for hero art and illustration fills |

Gold is the action color. When a button must be pressed to advance the game, it is gold. The Royal Pardon shield is gold with a purple gem to tie it to the court.

### Execution (blood red, used sparingly)

| Token | Value | Use |
|---|---|---|
| `--blood-500` | `#dc2626` | Drop the Blade icon/blade edge, "Executed" verdict tag, danger emphasis |
| `--blood-700` | `#991b1b` | Blood hover/pressed |

Red never fills a large surface. It marks execution intent and executed state only.

### Survivor and state

| Token | Value | Use |
|---|---|---|
| `--survivor` | `#22c55e` | Winner decree accent only |
| `--text-primary` | `#f5f3ff` | Body and heading text on dark |
| `--text-muted` | `#a78bfa` | Secondary text, labels |
| `--text-disabled` | `#6b7280` | Disabled options |

Never encode state with color alone. Pair each color with an icon, label, or position so color-blind and reduced-vision players can still read the game.

## 3. Typography

Stack: a display serif for headings and decrees, a text serif for UI.

- Display (headings, winner decree, headstone names): `"Cinzel", "Playfair Display", Georgia, serif`. Cinzel carries the royal-court tone; fall back to Playfair if Cinzel is unavailable via `@fontsource` or Google Fonts self-hosting.
- UI (body, buttons, labels, verdict chips): `"Spectral", Georgia, "Times New Roman", serif`. Self-hosted via `@fontsource/spectral` (weights 400 and 600) so the app makes no runtime Google Fonts request.
- Headstone dates/round numbers may use `"JetBrains Mono"` for an engraved feel, but do not introduce a fourth family.

Scale (desktop, scale down ~0.9 on mobile):

| Role | Size / line-height | Weight |
|---|---|---|
| Display hero | 56 / 1.05 | 700 |
| Section heading | 32 / 1.2 | 600 |
| Card title | 20 / 1.3 | 600 |
| Body | 16 / 1.5 | 400 |
| Label / verdict | 14 / 1.4 | 500, uppercase, letter-spacing 0.08em |

Minimum body size is 16px on mobile. Verdict chips may be 14px but must stay tappable (see Touch targets).

## 4. Shape, Elevation, and Texture

- Radius scale: `--radius-sm: 8px`, `--radius-md: 14px`, `--radius-lg: 22px`, `--radius-pill: 999px`. Cards use `md`, hero panels use `lg`, chips use `pill`.
- Borders: 1px `--border-ghost` on cards. No hard drop shadows; use soft glows instead (`box-shadow: 0 0 32px var(--purple-glow)` on the active card, `0 0 24px rgba(245, 158, 11, 0.35)` on the gold CTA).
- Texture: optional star-sparkle SVG pattern at 6-8% opacity over `--bg-court`. A single bat or crescent-moon silhouette may sit in the landing header. Do not tile busy patterns behind text.
- Candle glow: gold radial gradient (`radial-gradient(circle at 50% 0%, rgba(245,158,11,0.18), transparent 60%)`) behind the guillotine hero and the winner decree. This is decorative and must not reduce text contrast.
- The guillotine itself is a clean SVG silhouette (purple-300 line work, gold-500 blade edge). Prisoner cards sit "beneath the blade" as a layout cue, not a literal 3D render.

## 5. Iconography and Illustration

Use two layers of artwork:

1. **UI icons:** Lucide via shadcn/ui, stroke `1.75`, currentColor. Use for verdict chips, sound toggle, copy, share, close, and keyboard hints. Never mix in a second outline icon set.
2. **Halloween illustrations (the "costume"):** friendly flat or soft-3D SVG/PNG for hero moments. Use a consistent art direction: cream ghosts, pumpkin orange, candle gold, purple night. Do not mix photoreal, pixel, and flat art in one screen.

Suggested sources for illustrations (all free for commercial use unless noted; confirm license before shipping):

- **Lucide (`lucide-react`):** Skull, Ghost, Swords, Shield, Crown, Volume2, VolumeX, Copy, Share2, Timer, ArrowRight. Already in the stack via shadcn/ui. Default choice for functional icons.
- **SVG Repo (`svgrepo.com`):** large free SVG library with Halloween/graveyard/coffin/pumpkin sets; most items are CC0/MIT-style, but each icon page shows its license. Good for decorative graveyard, coffin, and candle silhouettes.
- **Iconify (`@iconify/react`):** icon component fed from open sets such as `game-icons` and `mdi`. Used icons are bundled in `src/iconData.js` and registered with `addIcon`, so nothing is fetched from the Iconify API at runtime. To add an icon, copy its data from `@iconify-json/<set>/icons.json` (a devDependency) into `iconData.js`. The `game-icons` set has a coffin, tombstone, guillotine-adjacent, and skull icon useful for headstones.
- **Figma Community (free files):** search "Halloween 3D icons" or "Spooky illustration pack". Many creators publish free packs under CC BY or a custom free license. Export the specific ghosts/pumpkins/candles you need to SVG or PNG and commit them under `src/assets/`.
- **DrawKit / Freepik free tier:** usable if the specific asset's license says "free for commercial use with attribution". Prefer assets that do not require attribution to keep the repo clean; if you must use one, add a `CREDITS.md` entry.
- **Self-drawn SVG:** for the guillotine blade, the Royal Pardon shield, and headstones, an in-repo SVG is preferred. These are the product's signature marks and should not depend on a third party's art style.

Never hotlink third-party image URLs. Download the asset into `src/assets/`, name it semantically (`ghost-pardon.svg`, `headstone-plain.svg`, `blade-guillotine.svg`), and record its license in `CREDITS.md`. Do not commit assets whose license is unclear.

## 6. Component Recipes

These recipes are the shared vocabulary. Build them once in `src/components/` and reuse; do not restyle per screen.

### PrisonerCard (living option)

- Surface `--bg-card`, radius `md`, border `--border-ghost`.
- Content: illustration (or Lucide `Ghost`), option name (Card title), verdict tag once executed.
- States:
  - Idle: base surface, no glow.
  - Selected: `--purple-500` border, `--purple-glow` box-shadow, small gold crown badge top-right, `aria-pressed="true"`.
  - Disabled (already dead): opacity 0.45, `--text-disabled`, cursor not-allowed, `aria-disabled="true"`.
  - Focus-visible: 2px `--gold-500` outline offset 2px.

### VerdictChip

- Pill shape, `--bg-card` fill, `--border-ghost` border, label text `--text-primary`.
- Selected: gold-500 border, gold-300 text, small check icon.
- `Other` chip expands to a short text input with a 40-character counter (documented max in `PRD.md` open decisions; enforce the value defined in code).
- Hit area at least 44x44px.

### DropTheBladeButton (primary CTA)

- Full-width on mobile, large on desktop.
- Gold-500 fill, `--bg-void` text, radius `pill`.
- Leading icon: Lucide `Swords` or a small blade SVG in `--blood-500`.
- Hover: `--gold-600`. Active: scale 0.98. Disabled: `--text-disabled` on `--bg-card`.
- Disabled until a living option and a verdict are chosen.

### RoyalPardonButton

- Gold shield illustration or Lucide `Shield` with a purple gem, on `--bg-card`.
- Single-use: after use, replace with a broken-shield state and text "Pardon used", `aria-disabled="true"`.
- Available state uses a gold-500 pulse once per turn (suppressed under `prefers-reduced-motion`).

### HeadstoneCard (graveyard entry)

- `--bg-card` surface, engraved-style top arch (SVG shape in `--bg-card-hover`).
- Fields: option name (Display serif), "Executed by {player} · Round {n}", verdict tag.
- Pardon entries use a distinct layout: `Shield` icon, gold-300 accent, text "Pardoned by {player} · Round {n}". Never render a pardon as a headstone.

### WinnerDecree

- Full-width panel on `--bg-court` with gold radial glow.
- Crown icon (Lucide `Crown`) in gold-500, survivor name in Display serif with `--survivor` underline.
- Below: short match history list, then `Copy share link` gold CTA and a privacy warning line about exposed names.

### TurnIndicator

- Sticky at the top of the stage. Shows "Round {n} · {player}'s turn", player name in `--gold-300`.
- Includes the sound toggle (Lucide `Volume2`/`VolumeX`) and, if implemented, the idle-execution timer.

## 7. Layout and Spacing

- 8px base grid. Spacing tokens: `--space-1: 4px` through `--space-8: 64px`, doubling.
- Page uses a single scrolling column. Sections in order per `PRD.md`: landing/presets, chopping block, graveyard, winner decree.
- Max content width: 720px for forms and stage, 1040px for the landing hero. Center with `--space-6` side padding on mobile.
- Section spacing: `--space-8` between major sections on desktop, `--space-6` on mobile.
- Sticky elements (TurnIndicator) reserve their own space so they do not overlap content.

## 8. Motion

Use GSAP for the guillotine sequence and selected-state transitions; CSS for decorative effects. Follow `prefers-reduced-motion` (`PRD.md` acceptance criteria 13).

- Blade drop: 320ms, `power3.in`, translate only, no scale. Under reduced motion: instant opacity swap with the headstone appearing in the graveyard.
- Execution shake: 240ms, ±4px translate, three cycles. Suppressed under reduced motion.
- Pardon shield: 400ms scale 0.9 to 1 with a gold glow flash, then settle. Suppressed under reduced motion.
- Winner reveal: 600ms fade and 12px rise, crown icon pops from 0.8 to 1. Suppressed under reduced motion.
- Hover states: 160ms ease-out on background and border color only.
- Do not animate text content, verdict chips while focused, or any element the player is reading. Motion is never required to understand state.

## 9. Sound

Web Audio synthesized sounds, opt-in via a visible mute toggle that persists the choice in `localStorage` (`PRD.md` acceptance criteria 14).

- Blade: short filtered noise burst with a low thud, ~250ms.
- Pardon: two-note bell, gold-feeling, ~500ms.
- Winner: three-note ascending motif, ~700ms.
- Idle-execution auto-drop (if implemented): reuse the blade sound.
- Default state: muted. First user gesture may enable audio only after the player has explicitly unmuted. Never autoplay.

## 10. Accessibility Contract

These are not optional (`AGENTS.md`, `PRD.md`).

- Keyboard: every interactive element reachable by Tab, activated by Enter/Space, with a visible `:focus-visible` ring in `--gold-500`.
- Selecting a prisoner and a verdict are two explicit steps; the CTA stays disabled until both are chosen and announces this via `aria-disabled` plus helper text.
- Live region (`aria-live="polite"`) announces turn changes, execution results, and pardon outcomes so screen-reader players can follow the game without seeing the screen.
- Color is never the only signal: pair red/gold/green with icon, label, or position.
- Contrast: body text at least 4.5:1 against `--bg-court`; large display text at least 3:1. Verify gold-500 text only on `--bg-void`, not on `--bg-card`, where it fails contrast.
- Reduced motion removes shake, blade animation, pulses, and parallax. State changes remain visible via layout and text.
- Sound has a persistent visible mute control; the game is fully playable muted.

## 11. Asset and Licensing Rules

- All shipped assets live in `src/assets/` with semantic filenames.
- Record source and license for every third-party asset in `CREDITS.md` at the repo root. No entry, no ship.
- Prefer CC0 or MIT-licensed art. Avoid assets that require attribution unless the license is explicit and recorded.
- Never commit fonts or illustrations whose license prohibits redistribution. Self-host fonts via `@fontsource` packages (MIT-licensed font files).
- Do not use trademarked characters, logos, or franchise art in illustrations or the demo video (`PRD.md` section 12).

## 12. Design System File Layout

Keep this minimal; do not scaffold files the app does not yet need.

- `src/index.css`: CSS custom properties from Section 2, font faces, base reset, focus ring.
- `src/components/ui/`: shadcn/ui primitives customized with these tokens.
- `src/components/game/`: PrisonerCard, VerdictChip, DropTheBladeButton, RoyalPardonButton, HeadstoneCard, WinnerDecree, TurnIndicator.
- `src/assets/`: Halloween illustrations and SVG marks, with `CREDITS.md` at repo root.
