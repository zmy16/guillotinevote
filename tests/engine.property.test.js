import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  createGame,
  selectOption,
  selectVerdict,
  executeSelected,
  useRoyalPardon,
  encodeShareState,
  decodeShareState,
  MAX_OPTIONS,
  MIN_OPTIONS
} from '../src/engine.js';

const NAME_CHARS = fc.constantFrom(...'abcdefghij ABCDEFGHIJ.,!?éñ漢-'.split(''));

const playerNameArb = fc
  .array(NAME_CHARS, { minLength: 1, maxLength: 12 })
  .map((chars) => chars.join('').trim())
  .filter((name) => name.length > 0);

const optionLabelArb = fc
  .array(NAME_CHARS, { minLength: 1, maxLength: 14 })
  .map((chars) => chars.join('').trim())
  .filter((label) => label.length > 0);

const uniqueOptionsArb = (min, max) =>
  fc
    .uniqueArray(optionLabelArb, { minLength: min, maxLength: max, selector: (label) => label.toLowerCase() })
    .filter((labels) => labels.length >= min);

const validSetupArb = fc
  .tuple(
    playerNameArb,
    uniqueOptionsArb(MIN_OPTIONS, MAX_OPTIONS),
    fc.integer({ min: 1, max: 100 })
  )
  .map(([firstPlayer, labels]) => ({
    title: 'Test Game',
    players: [firstPlayer, ...Array.from({ length: 1 }, (_, i) => `Player ${i + 2}`)],
    options: labels
  }))
  .filter((setup) => setup.players.length >= 2);

const presetVerdictKinds = ['too_expensive', 'too_far', 'boring', 'not_today'];

function playToCompletion(setup) {
  let result = createGame(setup);
  if (!result.ok) {
    return null;
  }
  let state = result.state;
  const guard = 200;
  let steps = 0;
  while (!state.finished && steps < guard) {
    const alive = state.options.filter((option) => option.status === 'alive');
    const target = alive[steps % alive.length];
    state = selectOption(state, target.id).state;
    const kind = presetVerdictKinds[steps % presetVerdictKinds.length];
    state = selectVerdict(state, { kind }).state;
    state = executeSelected(state).state;
    steps += 1;
  }
  return steps < guard ? state : null;
}

function playToCompletionWithPardon(setup, pardonTurn) {
  let result = createGame(setup);
  if (!result.ok) {
    return null;
  }
  let state = result.state;
  const guard = 200;
  let steps = 0;
  let pardonUsed = false;
  while (!state.finished && steps < guard) {
    const alive = state.options.filter((option) => option.status === 'alive');
    const target = alive[steps % alive.length];
    state = selectOption(state, target.id).state;
    const kind = presetVerdictKinds[steps % presetVerdictKinds.length];
    state = selectVerdict(state, { kind }).state;
    if (!pardonUsed && steps === pardonTurn) {
      const aliveBefore = state.options.filter((option) => option.status === 'alive').length;
      const pardonResult = useRoyalPardon(state);
      if (!pardonResult.ok) {
        return null;
      }
      state = pardonResult.state;
      const aliveAfter = state.options.filter((option) => option.status === 'alive').length;
      const pardonedOptionStillAlive = state.options.some(
        (option) => option.id === target.id && option.status === 'alive'
      );
      if (aliveBefore !== aliveAfter || !pardonedOptionStillAlive) {
        return null;
      }
      const secondPardon = useRoyalPardon(selectOption(state, target.id).state);
      if (secondPardon.ok) {
        return null;
      }
      pardonUsed = true;
    } else {
      state = executeSelected(state).state;
    }
    steps += 1;
  }
  if (steps >= guard) {
    return null;
  }
  return { state, pardonUsed };
}

describe('engine invariants', () => {
  it('produces exactly one survivor after N-1 executions', () => {
    const prop = fc.property(validSetupArb, (setup) => {
      const finalState = playToCompletion(setup);
      if (!finalState) {
        return false;
      }
      const alive = finalState.options.filter((option) => option.status === 'alive');
      const executions = finalState.graveyard.filter((record) => record.kind === 'execution');
      return alive.length === 1 && executions.length === setup.options.length - 1 && finalState.winner === alive[0].label;
    });
    fc.assert(prop);
  });

  it('a pardon preserves the alive count and cannot be used twice', () => {
    const prop = fc.property(validSetupArb, fc.integer({ min: 0, max: 2 }), (setup, pardonTurn) => {
      const played = playToCompletionWithPardon(setup, pardonTurn);
      if (!played) {
        return false;
      }
      const { state, pardonUsed } = played;
      const pardons = state.graveyard.filter((record) => record.kind === 'pardon');
      const executions = state.graveyard.filter((record) => record.kind === 'execution');
      const expectedPardons = pardonUsed ? 1 : 0;
      if (pardons.length !== expectedPardons) {
        return false;
      }
      if (executions.length !== setup.options.length - 1) {
        return false;
      }
      if (state.options.filter((option) => option.status === 'alive').length !== 1) {
        return false;
      }
      return !useRoyalPardon(state).ok;
    });
    fc.assert(prop);
  });

  it('share state round-trips exactly', () => {
    const prop = fc.property(validSetupArb, (setup) => {
      const finalState = playToCompletion(setup);
      if (!finalState) {
        return false;
      }
      const encoded = encodeShareState(finalState);
      const decoded = decodeShareState(encoded);
      if (!decoded.ok) {
        return false;
      }
      const original = {
        title: finalState.title,
        players: finalState.players,
        winner: finalState.winner,
        graveyard: finalState.graveyard
      };
      return JSON.stringify(decoded.result) === JSON.stringify(original);
    });
    fc.assert(prop);
  });

  it('rejects malformed share payloads without throwing', () => {
    const malformed = [
      '',
      '!!!not-base64!!!',
      Buffer.from('{"v":99}').toString('base64'),
      Buffer.from('not json').toString('base64'),
      Buffer.from(JSON.stringify({ v: 1, p: [], w: '', g: [] })).toString('base64')
    ];
    for (const payload of malformed) {
      const decoded = decodeShareState(payload);
      expect(decoded.ok).toBe(false);
      expect(typeof decoded.error).toBe('string');
    }
  });

  it('rejects invalid game setup', () => {
    expect(createGame({ title: 'x', players: ['solo'], options: ['a', 'b', 'c'] }).ok).toBe(false);
    expect(createGame({ title: 'x', players: ['a', 'b'], options: ['a', 'a', 'b'] }).ok).toBe(false);
    expect(createGame({ title: 'x', players: ['a', 'b'], options: ['a', '', 'b'] }).ok).toBe(false);
  });
});
