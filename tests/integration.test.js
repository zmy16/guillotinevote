import { describe, it, expect } from 'vitest';
import { createGame, selectOption, selectVerdict, executeSelected, useRoyalPardon, encodeShareState, decodeShareState, restoreGame } from '../src/engine.js';

const verdictCycle = ['too_expensive', 'too_far', 'boring', 'not_today'];

function play(setup, pardonOnTurn = -1) {
  const created = createGame(setup);
  expect(created.ok).toBe(true);
  let state = created.state;
  let turn = 0;
  while (!state.finished && turn < 100) {
    const alive = state.options.filter((option) => option.status === 'alive');
    const target = alive[turn % alive.length];
    state = selectOption(state, target.id).state;
    state = selectVerdict(state, { kind: verdictCycle[turn % verdictCycle.length] }).state;
    if (turn === pardonOnTurn) {
      const before = state.options.filter((option) => option.status === 'alive').length;
      const pardon = useRoyalPardon(state);
      expect(pardon.ok).toBe(true);
      state = pardon.state;
      const after = state.options.filter((option) => option.status === 'alive').length;
      expect(after).toBe(before);
    } else {
      state = executeSelected(state).state;
    }
    turn += 1;
  }
  return state;
}

describe('integration', () => {
  it('completes a preset game and produces a decodable share URL', () => {
    const state = play({
      title: 'Dinner Dilemma',
      players: ['A', 'B', 'C'],
      options: ['Sushi', 'Ramen', 'Burger', 'Nasi Padang', 'Bakso', 'Pizza']
    });
    expect(state.finished).toBe(true);
    expect(state.options.filter((option) => option.status === 'alive').length).toBe(1);

    const encoded = encodeShareState(state);
    const url = `http://localhost/?r=${encodeURIComponent(encoded)}`;
    const param = new URL(url).searchParams.get('r');
    const decoded = decodeShareState(param);
    expect(decoded.ok).toBe(true);
    expect(decoded.result.winner).toBe(state.winner);
    expect(decoded.result.graveyard).toEqual(state.graveyard);
    expect(decoded.result.players).toEqual(['A', 'B', 'C']);
    expect(decoded.result.title).toBe('Dinner Dilemma');
  });

  it('survives a pardon mid-game', () => {
    const state = play(
      { title: 'Pardon Test', players: ['A', 'B'], options: ['One', 'Two', 'Three'] },
      0
    );
    expect(state.finished).toBe(true);
    expect(state.graveyard.filter((record) => record.kind === 'pardon').length).toBe(1);
    expect(state.graveyard.filter((record) => record.kind === 'execution').length).toBe(2);
  });
});

describe('restoreGame', () => {
  function unfinishedState() {
    let state = createGame({
      title: 'Resume Test',
      players: ['A', 'B', 'C'],
      options: ['One', 'Two', 'Three', 'Four', 'Five']
    }).state;
    state = selectOption(state, 'opt-0').state;
    state = selectVerdict(state, { kind: 'boring' }).state;
    state = executeSelected(state).state;
    state = selectOption(state, 'opt-1').state;
    state = useRoyalPardon(state).state;
    return state;
  }

  function snapshotOf(state) {
    return JSON.parse(JSON.stringify(state));
  }

  it('restores an unfinished game and lets it be played to the end', () => {
    const original = unfinishedState();
    const restored = restoreGame(snapshotOf(original));
    expect(restored.ok).toBe(true);
    expect(restored.state.selection).toBeNull();
    expect(restored.state.graveyard).toEqual(original.graveyard);
    expect(restored.state.currentPlayerIndex).toBe(original.currentPlayerIndex);
    expect(restored.state.pardonAvailable).toBe(false);

    let state = restored.state;
    while (!state.finished) {
      const alive = state.options.find((option) => option.status === 'alive');
      state = selectOption(state, alive.id).state;
      state = selectVerdict(state, { kind: 'too_far' }).state;
      state = executeSelected(state).state;
    }
    expect(state.options.filter((option) => option.status === 'alive').length).toBe(1);
  });

  it('rejects a snapshot whose turn does not match its graveyard', () => {
    const tampered = { ...snapshotOf(unfinishedState()), currentPlayerIndex: 0 };
    expect(restoreGame(tampered).ok).toBe(false);
  });

  it('rejects a snapshot with an unknown option, a lost pardon flag, or a finished board', () => {
    const base = snapshotOf(unfinishedState());
    const unknownOption = { ...base, graveyard: base.graveyard.map((record) => ({ ...record, optionId: 'opt-99' })) };
    const pardonRestored = { ...base, pardonAvailable: true };
    const finishedBoard = { ...base, options: base.options.map((option, index) => ({ ...option, status: index === 4 ? 'alive' : 'executed' })) };
    expect(restoreGame(unknownOption).ok).toBe(false);
    expect(restoreGame(pardonRestored).ok).toBe(false);
    expect(restoreGame(finishedBoard).ok).toBe(false);
  });

  it('rejects missing or non-object snapshots', () => {
    expect(restoreGame(undefined).ok).toBe(false);
    expect(restoreGame('nope').ok).toBe(false);
    expect(restoreGame({}).ok).toBe(false);
  });
});