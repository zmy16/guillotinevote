import { describe, it, expect } from 'vitest';
import { createGame, selectOption, selectVerdict, executeSelected, useRoyalPardon, encodeShareState, decodeShareState } from '../src/engine.js';

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
