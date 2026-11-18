import { beforeEach, describe, expect, it } from 'vitest';
import { createGame, selectOption, selectVerdict, executeSelected } from '../src/engine.js';
import { readHistory, recordSession, deleteSession, clearHistory } from '../src/history.js';

const STORAGE_KEY = 'guillotinevote.history';

function installLocalStorage() {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key)
  };
}

function stateWithOneExecution() {
  let state = createGame({ title: 'History Test', players: ['A', 'B'], options: ['One', 'Two', 'Three'] }).state;
  state = selectOption(state, 'opt-0').state;
  state = selectVerdict(state, { kind: 'boring' }).state;
  return executeSelected(state).state;
}

describe('history', () => {
  beforeEach(installLocalStorage);

  it('records an unfinished trial with a snapshot and reads it back', () => {
    recordSession(stateWithOneExecution());
    const [entry] = readHistory();
    expect(entry.status).toBe('unfinished');
    expect(entry.executions).toBe(1);
    expect(entry.snapshot.graveyard).toHaveLength(1);
  });

  it('drops stored entries that are not valid history records', () => {
    const valid = { status: 'finished', title: 'Ok', winner: 'One', players: 2, executions: 2, survivors: 1, at: 1700000000000 };
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([null, 'text', 7, {}, { ...valid, at: 'yesterday' }, { ...valid, status: 'weird' }, { ...valid, winner: null }, valid])
    );
    expect(readHistory()).toEqual([valid]);
  });

  it('returns an empty list for corrupted storage', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    expect(readHistory()).toEqual([]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: 'an array' }));
    expect(readHistory()).toEqual([]);
  });

  it('deletes one entry and clears all', () => {
    recordSession(stateWithOneExecution());
    const [entry] = readHistory();
    deleteSession(entry.at);
    expect(readHistory()).toEqual([]);
    recordSession(stateWithOneExecution());
    clearHistory();
    expect(readHistory()).toEqual([]);
  });
});