---
inclusion: always
---

# Horror UX

The look is a haunted royal court at midnight: dark purple stage, candle-gold actions, friendly spooky art. No gore, no realistic blood.

## Color meaning

- Purple is the stage and the default interactive state.
- Gold is for actions that move the game forward, and for the Royal Pardon.
- Red appears only for execution. It never fills a large surface.
- Green appears only for the sole survivor.
- Never use color as the only signal. Pair it with an icon, a label, or a position.
- Use the tokens in `src/index.css`. Do not add new colors per component.

## Accessibility contract

- Every control works by keyboard and touch, with a visible focus ring.
- Turn changes, execution results, and pardons are announced in a polite live region.
- Body text keeps at least 4.5:1 contrast. Large text keeps at least 3:1.
- With `prefers-reduced-motion`, remove blade animation, shake, pulses, and parallax. State stays readable through text and layout.
- Sound is off by default, has a visible toggle, and is never needed to understand the game.
- Touch targets are at least 44 px on phones.

## Layout

- Phones come first. One column, thumb-sized buttons, and the guillotine kept in view while the player chooses.
- From 960 px up, the stage is two columns: the guillotine on the left, the controls on the right.
- Test at 320, 390, 768, and 1440 px. No horizontal overflow.

## Backdrop scenes

Each page has its own night scene, chosen by `variant` in `HalloweenBackdrop`: landing (haunted manor), history (crypt), faq (forest), setup (dungeon), stage (blood-moon courtyard), and finished (golden dawn). Scenes share the parallax layer classes so they move with scroll, and all of their motion stops under reduced motion. Backdrop animation is paused while the blade falls.
