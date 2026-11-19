---
inclusion: always
---

# Tech

## Stack

React 18, Vite 6, GSAP and ScrollTrigger, Iconify with bundled icon data, Lucide, Fontsource (Cinzel and Spectral), Vitest, and fast-check. Plain JavaScript with JSX. No TypeScript, no state library, no router.

## Architecture boundaries

- `src/engine.js` holds all game rules. It is pure and has no DOM access. React components render state and dispatch named actions. They never contain game rules.
- `src/App.jsx` owns the current page and the game state. The page is mirrored in the URL hash (`#/setup`, `#/history`, `#/faq`) so a refresh stays on the page. Other pages return to the landing page on refresh.
- `src/history.js` is the only code that touches the match history in `localStorage`. It must validate everything it reads.
- Anything read from the URL (`?r=` share data) or from `localStorage` is untrusted. Validate it before use. Never use `eval` or `dangerouslySetInnerHTML`.

## Code rules

- No comments in code. Use clear names and structure instead.
- Smallest change that fully solves the task. No speculative code, no scaffold for later, no abstraction with one implementation.
- No new dependency without a stated, concrete need. Prefer deleting code and dependencies.
- No magic numbers or strings. Use the limits exported by the engine.
- New non-trivial logic ships with a test.

## No third-party requests at runtime

Fonts and icons are bundled. The app must not call Google Fonts, the Iconify API, analytics, or any other host. To add an icon, copy its data from the matching `@iconify-json/<set>` package into `src/iconData.js`.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build into `dist/` |
| `npm test` | All tests once |

Run the build and the tests after every change. Set `SITE_URL` when building for production so the canonical URL, Open Graph image, sitemap, and structured data are absolute.
