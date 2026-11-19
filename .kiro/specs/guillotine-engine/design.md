# Design: guillotine engine

Module: `src/engine.js`. Pure functions, no DOM, no storage. Every action returns a new state and never changes its input.

## Limits

`MIN_PLAYERS` 2, `MAX_PLAYERS` 8, `MIN_OPTIONS` 3, `MAX_OPTIONS` 12, `MAX_VERDICT_LENGTH` 40. Share data longer than 8000 characters is refused. Preset verdicts: `too_expensive`, `too_far`, `boring`, `not_today`.

## State

```text
state = {
  title: string,
  players: string[],
  options: { id: 'opt-N', label: string, status: 'alive' | 'executed' }[],
  currentPlayerIndex: number,
  round: number,
  pardonAvailable: boolean,
  graveyard: record[],
  selection: optionId | null,
  verdict: verdict | null,
  winner: string | null,
  finished: boolean
}

record  = { kind: 'execution' | 'pardon', optionId, optionLabel, player, round, verdict? }
verdict = { kind: preset } | { kind: 'other', text }
```

An execution record carries a verdict. A pardon record does not.

## Actions

| Function | Result |
|---|---|
| `createGame(setup)` | `{ ok: true, state }` or `{ ok: false, errors }` |
| `selectOption(state, optionId)` | `{ ok, state }` or `{ ok: false, error, state }` |
| `selectVerdict(state, verdict)` | same shape |
| `executeSelected(state)` | same shape, plus `actedOptionId` on success |
| `grantRoyalPardon(state)` | same shape, plus `actedOptionId` on success |
| `restoreGame(snapshot)` | `{ ok: true, state }` or `{ ok: false, error }` |
| `encodeShareState(state)` | base64 string |
| `decodeShareState(text)` | `{ ok: true, result }` or `{ ok: false, error }` |

A rejected action returns the unchanged state. After an execution or a pardon, `advance` moves to the next player, raises the round when play wraps to the first player, clears the selection and verdict, and finishes the game when one living option remains.

## Share link

The link carries `?r=<base64 of UTF-8 JSON>`:

```text
{ v: 1, t: title, p: players[], w: winner, g: [[pardonFlag, optionId, optionLabel, player, round, verdictKind, verdictText], ...] }
```

`pardonFlag` is 0 for an execution and 1 for a pardon. Decoding checks the shape of every field, the number of players and entries, at most one pardon, no repeated execution of one option, and that the winner was not executed. The page treats a failed decode as an invalid link and shows an error page. Shared result pages are marked `noindex`.

## Restoring a trial

`restoreGame` rebuilds a state from a stored snapshot (`title`, `players`, `options`, `currentPlayerIndex`, `round`, `pardonAvailable`, `graveyard`). It accepts a snapshot only if every record matches the option it names, the player and round of record N follow from N and the player count, the turn and round follow from the Graveyard length, the pardon flag matches the pardon records, executed options match execution records, and at least two options are alive.

## Match history

`src/history.js` keeps up to 8 entries in `localStorage` under `guillotinevote.history`. An unfinished entry carries a snapshot for `restoreGame`. Reading drops any entry that is not a valid history record, so corrupted storage cannot break the page.
