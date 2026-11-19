# Tasks: guillotine engine

All tasks are done. Each one points to the test that proves it. Run them with `npm test`.

- [x] 1. Validate setup: player and option counts, blank names, duplicate options. (`engine.property.test.js`: rejects invalid game setup)
- [x] 2. Store trimmed names when creating a game. (`integration.test.js`: createGame)
- [x] 3. Select a living option and a verdict. Record preset and `other` verdicts. (`integration.test.js`: completes a preset game)
- [x] 4. Execute the selection: one Graveyard record, one turn advance, round counting, finish at one survivor. (`engine.property.test.js`: exactly one survivor after N-1 executions)
- [x] 5. Royal Pardon: keep the option alive, spend the pardon once, refuse a dead option. (`engine.property.test.js`: a pardon preserves the alive count; `integration.test.js`: grantRoyalPardon)
- [x] 6. Reject every action on a finished game without changing the state. (`engine.property.test.js`)
- [x] 7. Encode and decode the share link, including multibyte names. (`engine.property.test.js`: share state round-trips exactly; `integration.test.js`: longest allowed multibyte names)
- [x] 8. Reject malformed or hostile share data without throwing. (`engine.property.test.js`; `integration.test.js`: decodeShareState hardening)
- [x] 9. Restore an unfinished trial from a stored snapshot, and reject inconsistent snapshots. (`integration.test.js`: restoreGame)
- [x] 10. Store and read the match history, dropping invalid entries. (`history.test.js`)
