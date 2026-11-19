# GuillotineVote Tech Stack

## Product Shape

A client-side web application for group reverse-voting. No application server or database is planned for the MVP. Players use one shared device; completed results can be shared by URL.

## Core Stack

- **Framework:** React
- **Build tool:** Vite
- **Language:** JavaScript with ES Modules
- **Markup and styling:** JSX, HTML, CSS
- **Component foundation:** shadcn/ui, customized to fit the courtroom/horror visual direction
- **Motion:** GSAP for the guillotine sequence and selected state transitions; CSS for simple decorative effects
- **Iconography:** Lucide icons through the shadcn/ui ecosystem
- **Audio:** Web Audio API for synthesized execution sounds, behind an explicit sound control
- **State:** React state for the active session; URL-encoded state for shared completed results
- **Testing:** Vitest for unit tests and fast-check for property-based testing of the pure game engine
- **Source control:** Git and a public GitHub repository
- **License:** MIT, subject to the project owner's final approval
- **Hosting:** Static hosting provider to be selected later; deployment must stay publicly accessible and free through the judging period

## UI Libraries Under Consideration

The provided links are component catalogs and tools, not a requirement to install every library. Use the smallest compatible set that meets a real UI need:

- **shadcn/ui:** primary source for accessible base components and project-owned component code
- **React Bits:** optional source for a small number of distinctive visual effects if they fit the design and accessibility needs
- **GSAP:** use for intentional, timeline-based motion; do not animate every element
- **21st.dev, Magic UI, Flowbite:** references or optional component sources only; do not combine overlapping component systems by default
- **Lenis:** defer unless the final page has a demonstrated scroll-smoothing need
- **needmcp.com:** MCP discovery resource, not an application runtime dependency

## Architecture Boundaries

- Keep game rules and state transitions in a pure engine module, separate from React rendering and browser APIs.
- Keep preset data separate from game rules.
- UI components render engine state and dispatch explicit actions; they must not duplicate business rules.
- Keep the MVP browser-only. No accounts, backend database, paid AI API, or cross-device multiplayer.
- Encode shareable result data safely with URL APIs. Validate decoded input and handle malformed or oversized URLs.
- Persist only an abandoned session, in the Match history entry in `localStorage`. Validate it on load with `restoreGame` before resuming.

## Quality and Accessibility

- Respect `prefers-reduced-motion`; provide controls for sound and avoid relying on animation or audio to communicate game state.
- Maintain readable contrast, keyboard access, visible focus states, and semantic controls.
- Use deterministic seeded randomness where reproducible bot or idle-execution behavior is required.
- Keep dependencies limited to the stack above and add packages only for a concrete need.

## Decisions Still Open

- Hosting provider: Vercel, GitHub Pages, or another static host.
- Exact UI primitives and whether any React Bits component is needed.
- Whether solo-play bots belong in the MVP.
- Whether to auto-save every move; currently excluded. Only abandoned sessions are stored.

## Local Commands (Planned)

Exact scripts will be finalized with the application scaffold. Expected commands:

```sh
npm run dev
npm run build
npm test
```
