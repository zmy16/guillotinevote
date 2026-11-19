---
inclusion: always
---

# Product

GuillotineVote is a horror-themed reverse-voting party game. Players take turns executing the option they like least, with a verdict, until one option survives. It runs in the browser on one shared device. Hackathon category: Costume Contest.

## Language

All user-facing text is English. Use the medieval-courtroom vocabulary below and keep the strings in the components that already own them. Do not invent new terms.

| Term | Meaning |
|---|---|
| The court, a docket | A game and its title, players, and options |
| Prisoner, the accused | A living option |
| The Chopping Block | The guillotine stage |
| Verdict | The reason for an execution: Too Expensive, Too Far, Boring, Not Today, or Other |
| Drop the Blade | Execute the selected option |
| Royal Pardon | One use per game. Spares the selected option instead of executing it |
| The Graveyard | The record of executions and pardons |
| Sole Survivor, the decree | The winner and the winner screen |
| Open the court, Leave the court | Start a game, abandon a game |
| Match history | Finished and abandoned trials stored on the device |

## Scope

- 2 to 8 players and 3 to 12 options.
- Client-side only. No accounts, backend, database, paid API, analytics, or cross-device play.
- Only a trial left through "Leave the court" is stored, and it is resumed from Match history. Do not auto-save every move.
- A finished game can be shared as a link that packs the whole result into the URL. Warn players that the link contains names and history. Shared result pages are not indexed by search engines.
- The sample round uses fictional players. Leaving a sample round midway does not store it. Whether a finished sample round should be recorded in Match history is still undecided.

## Non-goals

Accounts, backend services, real-time multiplayer, AI or LLM features, native apps, bot players, and any medical, legal, or financial recommendation. If a request implies one of these, ask before building it.
