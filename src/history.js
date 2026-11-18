const STORAGE_KEY = 'guillotinevote.history';
const MAX_ENTRIES = 8;

function isHistoryEntry(item) {
  return (
    Boolean(item) &&
    typeof item === 'object' &&
    (item.status === 'finished' || item.status === 'unfinished') &&
    typeof item.title === 'string' &&
    (item.status === 'unfinished' || typeof item.winner === 'string') &&
    [item.players, item.executions, item.survivors].every(Number.isInteger) &&
    Number.isFinite(new Date(item.at).getTime())
  );
}

export function readHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isHistoryEntry) : [];
  } catch {
    return [];
  }
}

function writeHistory(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    return;
  }
}

function snapshotOf(state) {
  const { title, players, options, currentPlayerIndex, round, pardonAvailable, graveyard } = state;
  return { title, players, options, currentPlayerIndex, round, pardonAvailable, graveyard };
}

export function recordSession(state, replacedEntryAt) {
  if (!state) {
    return;
  }
  const finished = Boolean(state.finished && state.winner);
  const entry = {
    status: finished ? 'finished' : 'unfinished',
    title: state.title || 'Untitled Court',
    winner: finished ? state.winner : null,
    players: state.players.length,
    rounds: state.round,
    executions: state.graveyard.filter((record) => record.kind === 'execution').length,
    survivors: state.options.filter((option) => option.status === 'alive').length,
    snapshot: finished ? undefined : snapshotOf(state),
    at: Date.now()
  };
  const rest = readHistory().filter(
    (item) =>
      item.at !== replacedEntryAt &&
      !(item.title === entry.title && item.winner === entry.winner && entry.at - item.at < 60000)
  );
  writeHistory([entry, ...rest].slice(0, MAX_ENTRIES));
}

export function deleteSession(at) {
  writeHistory(readHistory().filter((item) => item.at !== at));
}

export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
}
