# Product Requirements Document: GuillotineVote

## 1. Product Summary

**GuillotineVote** is a horror-themed reverse-voting web app for groups that struggle to agree on one choice. Instead of voting for a favorite, players take turns eliminating the option they least want until one survivor remains.

The game runs on one shared device. Players can pass the device around or use screen sharing. No account, backend, database, paid API, or cross-device multiplayer is required for the MVP.

**Hackathon category:** Costume Contest.

The horror theme is part of the interaction model: options become prisoners, eliminated options become headstones, and the final option receives a survivor's decree.

## 2. Problem

Groups often get stuck when choosing where to eat, what to watch, or what to work on. People say "up to you" but reject suggestions, while ordinary polls can end in a tie.

GuillotineVote changes the question from "What is your favorite?" to "Which option should be eliminated first?" Repeated elimination produces one final choice and records why the others were rejected.

## 3. Goals

- Help a group of at least two people reach one final choice through a clear, entertaining process.
- Make the first game easy to start through presets or a short custom setup.
- Make the game understandable to judges who open the site alone.
- Make the horror theme functional, polished, and accessible.
- Let players share the completed result without requiring a backend.
- Demonstrate real, documented use of Kiro in development.

## 4. Non-Goals

- Accounts, authentication, or user profiles.
- Backend services or a database.
- Real-time play across separate devices.
- Paid AI or LLM APIs.
- Native mobile applications.
- Automated bot players in the MVP.
- Saving an unfinished game on every move. Only a trial left through "Leave the court" is stored, and it is resumed from Match history.
- Providing medical, legal, financial, or other high-stakes recommendations.

## 5. Users and Usage Context

### Primary users

Two to eight friends, classmates, or coworkers choosing among a short list of low-stakes options.

### Primary context

The group gathers around one phone or computer. Each person takes a turn selecting an option to eliminate. The same device is handed to the next player, or shared through a video call.

### Judge context

A judge may inspect the project without another player present. A separate interactive sample round must demonstrate the experience without creating or changing a real user game.

## 6. MVP Scope

### 6.1 Game setup

- Provide four one-click presets:
  - Dinner Dilemma
  - Friday Movie Night
  - Team Hangout Spot
  - Campus Project Topic
- Allow users to edit or replace preset options before starting.
- Allow users to enter a custom game title, two to eight player names, and three to twelve unique options.
- Validate required fields, minimum and maximum counts, and duplicate or blank values before starting.
- Keep setup text and game interface in English for hackathon submission consistency.

### 6.2 Turn-based elimination

- Show the current player's name and the current round.
- Show all living options as selectable prisoners.
- Require the current player to select one living option and one execution verdict before executing it.
- Preset verdicts:
  - Too Expensive
  - Too Far
  - Boring
  - Not Today
- Include an `Other` verdict that opens a short text field. Trim whitespace and enforce a documented maximum length.
- On execution, mark the selected option dead, record the option, player, round, and verdict in the Graveyard, then advance to the next player.
- Turn order continues cyclically through all players until one option remains. Players may receive additional turns in later rounds.
- Show a distinct winner state when exactly one living option remains.

### 6.3 Royal Pardon

- Each game has one Royal Pardon.
- After an option is selected and before execution, any player may use the pardon.
- Using the pardon cancels that execution, keeps the selected option alive, consumes the pardon, and ends the current player's turn. Turn advances to the next player.
- The Graveyard records pardons separately from executed options, so a saved option is not displayed as dead.
- The pardon cannot be used after it has been consumed or after the game is complete.

### 6.4 Sample round

- Provide a separate interactive sample round accessible from the landing page.
- The sample uses clearly labeled fictional players and choices.
- The sample cannot modify a user's custom game or be mistaken for a submitted real result.
- Provide a clear action to exit or restart the sample.

### 6.5 Graveyard and final result

- Display executed options as headstones with their player, round, and verdict.
- Display pardons distinctly from executions.
- On completion, show the surviving option and a concise match history.
- Provide a share action that encodes the completed result in a URL without a backend.
- The shared result includes the winner, executed options, player names, rounds, verdicts, and pardon event if applicable.
- Validate decoded share data and show a useful invalid-link state for malformed or unsupported data.
- Tell players that names and match history become visible to anyone with the shared URL.
- Do not include live session state or secrets in the share URL.

## 7. Core User Flows

### Start from a preset

1. Open the landing page.
2. Choose a preset.
3. Review or edit options and enter player names.
4. Start the game after validation.

### Create a custom game

1. Enter a game title, two to eight player names, and three to twelve options.
2. Correct validation errors if any.
3. Start the game.

### Play a turn

1. Read the current player's name.
2. Select one living option.
3. Select a preset verdict or enter a short `Other` verdict.
4. Execute the option, or use the Royal Pardon before execution.
5. Review the Graveyard and pass the device to the next player.
6. Continue until one survivor remains.

### Inspect the sample

1. Choose `Try a sample round`.
2. Play the isolated example round.
3. Restart or exit without affecting a real game.

### Share the result

1. Finish the game.
2. Review the winner and match history.
3. Choose `Copy share link`.
4. Open the link to view a read-only result page.

## 8. Functional Requirements and Acceptance Criteria

1. The game cannot start with fewer than two players, more than eight players, fewer than three options, or more than twelve options.
2. Blank names and duplicate options are rejected with clear, accessible feedback.
3. Only a living option can be selected for execution.
4. Every successful execution creates exactly one Graveyard record and advances the turn exactly once.
5. Turns advance cyclically and the game ends when exactly one living option remains.
6. A pardon preserves the selected option, consumes the one-use pardon, creates no execution record, and advances the turn exactly once.
7. A second pardon attempt, pardon after game completion, or execution after game completion is rejected without mutating state.
8. Preset and `Other` verdicts are recorded with the correct player and round.
9. A final result URL can be decoded into the same winner and history, including names with spaces, punctuation, or non-ASCII characters.
10. Malformed or oversized share data does not crash the page or execute arbitrary content.
11. The sample round is isolated from real-game state.
12. All core flows work by keyboard and touch; motion and sound are not required to understand game state.
13. When `prefers-reduced-motion` is enabled, non-essential motion is reduced or removed.
14. Sound is opt-in or controlled by a visible mute toggle; the game remains understandable with sound disabled.

## 9. Visual and Interaction Direction

- Category: Costume Contest.
- Use a medieval execution-court / haunted archive direction, with the guillotine, prisoners, verdicts, pardon, graveyard, and survivor decree as one coherent visual language.
- The spooky treatment must support the decision flow rather than obscure it.
- Maintain readable contrast, semantic headings, visible keyboard focus, and clear selected/disabled states.
- Avoid flashing and avoid relying on red/green alone to communicate state.
- Provide reduced-motion behavior and explicit sound control.
- Use animation selectively for the blade, execution transition, pardon, and winner reveal. Keep all state changes clear without animation.

## 10. Product Constraints

- Client-side web app; no backend or database in the MVP.
- Target stack is defined in `TECH_STACK.md`.
- The static app and result links must remain publicly accessible without charge through the Kiroween judging period, ending January 29, 2027.
- The app must be usable on current desktop and mobile browsers.
- Match data may be encoded in a public URL only after the game ends and only after warning players that the link exposes names and history.
- No analytics or third-party tracking is required for the MVP.

## 11. Kiro Development Evidence

The project must be built using Kiro. The public GitHub repository must include a root `/.kiro` directory and must not ignore it.

The development write-up must describe actual work performed, not planned or fabricated usage. Evidence may include:

- Spec-driven development: requirements, design, and implementation tasks.
- Steering documents that shaped product vocabulary, architecture, and accessibility.
- Agent hooks that were run during development, if implemented and verified.
- Property-based testing for game invariants and share-state encoding.
- Other Kiro features, agents, MCP integrations, or powers only when actually used and documented.

Do not claim a tool, hook, test result, discovered bug, or feature that was not actually used, verified, or implemented.

## 12. Hackathon Submission Requirements

- Select and name `Costume Contest` in the submission category and project description.
- Submit a working project built using Kiro.
- Provide a public, working app URL and any testing instructions required by judges.
- Provide a public GitHub repository, not GitLab or Bitbucket.
- Include all source, assets, and run instructions in the repository.
- Include an open-source license file visible on the GitHub repository page.
- Include the root `/.kiro` folder; do not ignore it.
- Provide a public YouTube demonstration video shorter than three minutes.
- The video must show the application functioning on its intended device and must not use unlicensed third-party trademarks or copyrighted material.
- All submission text, video, and testing instructions must be in English or have English translations.
- The app and judging access must remain free and available through the end of the judging period.

## 13. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| A judge opens the app alone and cannot experience a group game | Provide an isolated interactive sample round. |
| Users misunderstand turn order or pardon behavior | Show the active player, selected option, action consequence, and next player clearly. |
| Shared URLs expose player names | Warn before copying and include only completed results. |
| Large or malformed URL data breaks the app | Validate schema, lengths, and supported version; render an error state safely. |
| Horror visuals reduce readability or accessibility | Test contrast, keyboard use, reduced motion, and sound-off behavior. |
| Scope expands beyond the hackathon window | Defer bots, multiplayer, persistence, backends, and nonessential effects. |
| Devpost write-up overstates Kiro use | Document only tools and workflows that were actually used and verified. |

## 14. Open Decisions

- Decided: a trial abandoned through "Leave the court" is stored in Match history with its full board and can be resumed. A tab closed mid-game is still lost.
- Hosting provider; select during deployment planning.
- Maximum length for player names, option labels, and custom verdict text.
- Exact encoding format and maximum size for share URLs.
- Whether all players must explicitly confirm before a result is copied.

## 15. Success Criteria

- A first-time group can start a preset game without instructions.
- A valid game always ends with exactly one survivor.
- The full game can be completed and shared without a backend.
- A judge can understand the mechanic through the isolated sample round.
- Core play remains usable with keyboard, touch, reduced motion, and sound disabled.
- The project passes the Kiroween submission requirements and documents authentic Kiro usage.
