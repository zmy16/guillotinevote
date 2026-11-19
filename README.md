# GuillotineVote

**Vote for what you hate, not what you love.**

GuillotineVote is a horror-themed reverse-voting party game for groups that cannot agree. Instead of voting for a favorite, players take turns executing the option they like least, with a verdict, until a single survivor remains.

It runs entirely in the browser on one shared device. No account, no backend, no database.

Hackathon category: **Costume Contest** (Kiroween 2026).

## How to play

1. Pick a ready-made docket (dinner, movie night, team hangout, campus project) or write your own: a title, 2 to 8 players, and 3 to 12 options.
2. Players pass the device around. On your turn, choose one living option and give a verdict: Too Expensive, Too Far, Boring, Not Today, or your own words.
3. Drop the blade. The option goes to the Graveyard with who executed it, in which round, and why.
4. Each game has one Royal Pardon that spares a chosen option instead of executing it.
5. When one option is left, it receives the decree. There are no ties.

## Features

- Animated guillotine stage built with GSAP, with synthesized blade sounds (muted by default).
- Graveyard of headstones that records every execution and pardon.
- Match history stored on your device. Leave a trial midway and resume it later.
- Share link for a finished game. The result is packed into the URL, so nothing is uploaded.
- Mobile-first layout, keyboard access, visible focus, screen-reader announcements, and `prefers-reduced-motion` support.
- No third-party requests at runtime: fonts and icons are bundled with the app.

## Tech stack

- React 18 and Vite 6
- GSAP for animation
- Iconify (bundled icon data) and Lucide for icons
- Cinzel and Spectral fonts via Fontsource
- Vitest and fast-check for tests

The game rules live in a pure module, `src/engine.js`. React components render state and dispatch actions only.

## Getting started

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the address Vite prints (by default `http://localhost:5173`). To pick a port:

```bash
npm run dev -- --port 4173
```

### Other commands

| Command | What it does |
|---|---|
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the unit and property-based tests once |
| `npm run test:watch` | Run tests in watch mode |

## Configuration

Set `SITE_URL` to the public address of your deployment before building. It fills the canonical URL, Open Graph image, structured data, `robots.txt` sitemap line, and `sitemap.xml`.

```bash
SITE_URL=https://your-domain.example npm run build
```

You can also put `SITE_URL=...` in a `.env.production` file. Without it, tags that need an absolute address are left out, and link previews on social networks will not show the image.

## Project structure

```text
src/
  engine.js          Pure game rules, share-link encoding, snapshot restore
  history.js         Match history in localStorage
  sound.js           Web Audio blade and fanfare sounds
  iconData.js        Bundled icon data
  components/        Stage, Setup, Result, history and FAQ pages, backdrop
  styles/            CSS by area
tests/               Vitest unit and property-based tests
public/              Logo, favicon set, OG image, web manifest
```

`node tests/make-icons.mjs` regenerates the PNG icons, `favicon.ico`, and `og-image.jpg` from `public/logo.svg`. It needs the app running at `http://localhost:4173` (or pass another URL as the first argument) and a Playwright browser installed.

## Privacy

- Nothing leaves your device. There is no server.
- Match history and the sound setting are saved in `localStorage` on your device only.
- A share link contains player names and the match history. Anyone with the link can read it, so share it only with your group. Shared result pages ask search engines not to index them.

## Credits

- [React](https://react.dev/), [Vite](https://vite.dev/), [GSAP](https://gsap.com/), [Lucide](https://lucide.dev/)
- Icons from [game-icons.net](https://game-icons.net/) (CC BY 3.0, by Lorc, Delapouite and other contributors) and [Material Design Icons](https://pictogrammers.com/library/mdi/) (Apache 2.0), through [Iconify](https://iconify.design/)
- Fonts: [Cinzel](https://fonts.google.com/specimen/Cinzel) and [Spectral](https://fonts.google.com/specimen/Spectral), both under the SIL Open Font License
