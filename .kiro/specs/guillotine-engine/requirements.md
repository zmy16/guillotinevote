# Requirements: guillotine engine

Scope: the pure rules in `src/engine.js`. Derived from `PRD.md` section 8. Each requirement lists the test that checks it.

## 1. Setup

1.1 WHEN a game is created with fewer than 2 or more than 8 players, THE engine SHALL reject it and report the error.
1.2 WHEN a game is created with fewer than 3 or more than 12 options, THE engine SHALL reject it and report the error.
1.3 WHEN a player name or option label is blank, or two options match when compared without case, THE engine SHALL reject the setup.
1.4 WHEN a game is created, THE engine SHALL store player names and option labels with surrounding spaces removed.

Tests: `engine.property.test.js` "rejects invalid game setup"; `integration.test.js` "stores trimmed player and option names".

## 2. Turns and execution

2.1 THE engine SHALL allow only a living option to be selected.
2.2 WHEN an execution succeeds, THE engine SHALL add exactly one execution record to the Graveyard, mark the option executed, and advance the turn exactly once.
2.3 THE engine SHALL advance turns cyclically and increase the round each time play returns to the first player.
2.4 WHEN exactly one living option remains, THE engine SHALL mark the game finished and set the winner.
2.5 WHEN an execution is attempted without a selected option or without a verdict, THE engine SHALL reject it and leave the state unchanged.

Tests: `engine.property.test.js` "produces exactly one survivor after N-1 executions"; `integration.test.js` "completes a preset game and produces a decodable share URL".

## 3. Verdicts

3.1 THE engine SHALL accept the preset verdicts `too_expensive`, `too_far`, `boring`, and `not_today`.
3.2 WHEN the verdict is `other`, THE engine SHALL require text of 1 to 40 characters after trimming.
3.3 THE engine SHALL record the verdict with the player and the round of each execution.

## 4. Royal Pardon

4.1 WHEN a pardon is granted, THE engine SHALL keep the selected option alive, consume the pardon, add a pardon record to the Graveyard, and advance the turn exactly once.
4.2 IF the pardon was already used, or the game is finished, or the selected option is not alive, THEN THE engine SHALL reject the pardon and leave the state unchanged.

Tests: `engine.property.test.js` "a pardon preserves the alive count and cannot be used twice"; `integration.test.js` "survives a pardon mid-game", "refuses an option that was already executed".

## 5. Finished games

5.1 WHEN the game is finished, THE engine SHALL reject selection, verdicts, execution, and pardon without changing the state.

## 6. Share links

6.1 THE engine SHALL encode a finished game into a URL-safe string and decode it back to the same title, players, winner, and Graveyard, including names with spaces, punctuation, and non-ASCII characters.
6.2 WHEN share data is missing, longer than 8000 characters, not valid base64 or JSON, or has an unsupported version, THE engine SHALL return an error and SHALL NOT throw.
6.3 WHEN share data has players that are not non-blank strings, an entry flag other than 0 or 1, more than one pardon, the same option executed twice, or a winner that was executed, THE engine SHALL reject it.
6.4 THE engine SHALL accept a share link built from the longest allowed names in a multibyte script.

Tests: `engine.property.test.js` "share state round-trips exactly", "rejects malformed share payloads without throwing"; `integration.test.js` "decodeShareState hardening".

## 7. Resuming a trial

7.1 WHEN a stored snapshot is consistent with the rules, THE engine SHALL restore it as an unfinished game with no selection, and the game SHALL be playable to the end.
7.2 WHEN a snapshot has a turn, round, pardon flag, option, or Graveyard that does not match the rules, or has fewer than two living options, THE engine SHALL reject it.

Tests: `integration.test.js` "restoreGame".
