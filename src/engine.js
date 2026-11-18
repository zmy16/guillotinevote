export const PRESET_VERDICTS = ['too_expensive', 'too_far', 'boring', 'not_today'];

export const VERDICT_LABELS = {
  too_expensive: 'Too Expensive',
  too_far: 'Too Far',
  boring: 'Boring',
  not_today: 'Not Today'
};

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 8;
export const MIN_OPTIONS = 3;
export const MAX_OPTIONS = 12;
export const MAX_VERDICT_LENGTH = 40;
const MAX_SHARE_LENGTH = 8000;
const SHARE_VERSION = 1;
const RESTORE_ERROR = 'This trial can no longer be resumed.';

function trimmedNames(values) {
  return (values || []).map((value) => (typeof value === 'string' ? value.trim() : ''));
}

export function createGame(setup) {
  const errors = validateSetup(setup);
  if (errors.length > 0) {
    return { ok: false, errors };
  }
  const options = trimmedNames(setup.options).map((label, index) => ({
    id: `opt-${index}`,
    label,
    status: 'alive'
  }));
  return {
    ok: true,
    state: {
      title: setup.title,
      players: trimmedNames(setup.players),
      options,
      currentPlayerIndex: 0,
      round: 1,
      pardonAvailable: true,
      graveyard: [],
      selection: null,
      verdict: null,
      winner: null,
      finished: false
    }
  };
}

export function restoreGame(snapshot) {
  if (!isRestorableSnapshot(snapshot)) {
    return { ok: false, error: RESTORE_ERROR };
  }
  return {
    ok: true,
    state: {
      title: snapshot.title,
      players: [...snapshot.players],
      options: snapshot.options.map(({ id, label, status }) => ({ id, label, status })),
      currentPlayerIndex: snapshot.currentPlayerIndex,
      round: snapshot.round,
      pardonAvailable: snapshot.pardonAvailable,
      graveyard: snapshot.graveyard.map(restoreRecord),
      selection: null,
      verdict: null,
      winner: null,
      finished: false
    }
  };
}

function restoreRecord(record) {
  const { kind, optionId, optionLabel, player, round } = record;
  const restored = { kind, optionId, optionLabel, player, round };
  return kind === 'execution' ? { ...restored, verdict: normalizeVerdict(record.verdict) } : restored;
}

function isNonBlankString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isRestorableOption(option) {
  return (
    Boolean(option) &&
    isNonBlankString(option.id) &&
    isNonBlankString(option.label) &&
    (option.status === 'alive' || option.status === 'executed')
  );
}

function isRestorableRecord(record, index, players, options) {
  if (!record || typeof record !== 'object') {
    return false;
  }
  const option = options.find((candidate) => candidate.id === record.optionId);
  const isExecution = record.kind === 'execution';
  return (
    Boolean(option) &&
    (isExecution || record.kind === 'pardon') &&
    record.optionLabel === option.label &&
    record.player === players[index % players.length] &&
    record.round === Math.floor(index / players.length) + 1 &&
    (!isExecution || normalizeVerdict(record.verdict) !== null)
  );
}

function areExecutionsConsistent(options, graveyard) {
  const executedIds = options.filter((option) => option.status === 'executed').map((option) => option.id);
  const executionIds = graveyard.filter((record) => record.kind === 'execution').map((record) => record.optionId);
  return (
    executedIds.length === executionIds.length &&
    new Set(executionIds).size === executionIds.length &&
    executionIds.every((id) => executedIds.includes(id))
  );
}

function isRestorableSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object' || typeof snapshot.title !== 'string') {
    return false;
  }
  const { players, options, graveyard } = snapshot;
  if (!Array.isArray(players) || players.length < MIN_PLAYERS || players.length > MAX_PLAYERS) {
    return false;
  }
  if (!players.every(isNonBlankString)) {
    return false;
  }
  if (!Array.isArray(options) || options.length < MIN_OPTIONS || options.length > MAX_OPTIONS) {
    return false;
  }
  if (!options.every(isRestorableOption)) {
    return false;
  }
  if (new Set(options.map((option) => option.id)).size !== options.length) {
    return false;
  }
  if (new Set(options.map((option) => option.label.toLowerCase())).size !== options.length) {
    return false;
  }
  if (options.filter((option) => option.status === 'alive').length < 2) {
    return false;
  }
  if (!Array.isArray(graveyard)) {
    return false;
  }
  if (!graveyard.every((record, index) => isRestorableRecord(record, index, players, options))) {
    return false;
  }
  const pardonCount = graveyard.filter((record) => record.kind === 'pardon').length;
  return (
    snapshot.currentPlayerIndex === graveyard.length % players.length &&
    snapshot.round === Math.floor(graveyard.length / players.length) + 1 &&
    snapshot.pardonAvailable === (pardonCount === 0) &&
    pardonCount <= 1 &&
    areExecutionsConsistent(options, graveyard)
  );
}

function validateSetup(setup) {
  const errors = [];
  const players = trimmedNames(setup.players);
  const options = trimmedNames(setup.options);
  if (players.length < MIN_PLAYERS || players.length > MAX_PLAYERS) {
    errors.push(`Players must be between ${MIN_PLAYERS} and ${MAX_PLAYERS}.`);
  }
  if (players.some((name) => name.length === 0)) {
    errors.push('Player names cannot be blank.');
  }
  if (options.length < MIN_OPTIONS || options.length > MAX_OPTIONS) {
    errors.push(`Options must be between ${MIN_OPTIONS} and ${MAX_OPTIONS}.`);
  }
  if (options.some((label) => label.length === 0)) {
    errors.push('Options cannot be blank.');
  }
  if (new Set(options.map((label) => label.toLowerCase())).size !== options.length) {
    errors.push('Options must be unique.');
  }
  return errors;
}

export function selectOption(state, optionId) {
  if (state.finished) {
    return reject(state, 'The game is already complete.');
  }
  const option = state.options.find((candidate) => candidate.id === optionId);
  if (!option) {
    return reject(state, 'Unknown option.');
  }
  if (option.status !== 'alive') {
    return reject(state, 'Only a living option can be selected.');
  }
  return accept(state, { selection: optionId });
}

export function selectVerdict(state, verdict) {
  if (state.finished) {
    return reject(state, 'The game is already complete.');
  }
  if (!state.selection) {
    return reject(state, 'Select an option before choosing a verdict.');
  }
  const normalized = normalizeVerdict(verdict);
  if (!normalized) {
    return reject(state, 'A verdict is required.');
  }
  return accept(state, { verdict: normalized });
}

function normalizeVerdict(verdict) {
  if (!verdict || typeof verdict !== 'object') {
    return null;
  }
  if (PRESET_VERDICTS.includes(verdict.kind)) {
    return { kind: verdict.kind };
  }
  if (verdict.kind === 'other') {
    const text = typeof verdict.text === 'string' ? verdict.text.trim() : '';
    if (text.length === 0 || text.length > MAX_VERDICT_LENGTH) {
      return null;
    }
    return { kind: 'other', text };
  }
  return null;
}

export function executeSelected(state) {
  if (state.finished) {
    return reject(state, 'The game is already complete.');
  }
  if (!state.selection || !state.verdict) {
    return reject(state, 'Select an option and a verdict before executing.');
  }
  const option = state.options.find((candidate) => candidate.id === state.selection);
  if (!option || option.status !== 'alive') {
    return reject(state, 'Only a living option can be executed.');
  }
  const options = state.options.map((candidate) =>
    candidate.id === option.id ? { ...candidate, status: 'executed' } : candidate
  );
  const record = {
    kind: 'execution',
    optionId: option.id,
    optionLabel: option.label,
    player: state.players[state.currentPlayerIndex],
    round: state.round,
    verdict: state.verdict
  };
  return advance(state, { options, graveyard: [...state.graveyard, record] }, option.id);
}

export function grantRoyalPardon(state) {
  if (state.finished) {
    return reject(state, 'The game is already complete.');
  }
  if (!state.pardonAvailable) {
    return reject(state, 'The Royal Pardon has already been used.');
  }
  if (!state.selection) {
    return reject(state, 'Select an option before using the Royal Pardon.');
  }
  const option = state.options.find((candidate) => candidate.id === state.selection);
  if (!option || option.status !== 'alive') {
    return reject(state, 'Only a living option can be pardoned.');
  }
  const record = {
    kind: 'pardon',
    optionId: option.id,
    optionLabel: option.label,
    player: state.players[state.currentPlayerIndex],
    round: state.round
  };
  return advance(state, { pardonAvailable: false, graveyard: [...state.graveyard, record] }, option.id);
}

function advance(state, overrides, actedOptionId) {
  const options = overrides.options || state.options;
  const alive = options.filter((candidate) => candidate.status === 'alive');
  const finished = alive.length === 1;
  const winner = finished ? alive[0].label : null;
  const nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
  const round = nextIndex === 0 ? state.round + 1 : state.round;
  return {
    ok: true,
    state: {
      ...state,
      ...overrides,
      options,
      currentPlayerIndex: nextIndex,
      round,
      selection: null,
      verdict: null,
      winner,
      finished
    },
    actedOptionId
  };
}

function accept(state, overrides) {
  return { ok: true, state: { ...state, ...overrides } };
}

function reject(state, error) {
  return { ok: false, error, state };
}

export function encodeShareState(state) {
  const payload = {
    v: SHARE_VERSION,
    t: state.title,
    p: state.players,
    w: state.winner,
    g: state.graveyard.map((record) => [
      record.kind === 'pardon' ? 1 : 0,
      record.optionId,
      record.optionLabel,
      record.player,
      record.round,
      record.verdict ? record.verdict.kind : '',
      record.verdict && record.verdict.text ? record.verdict.text : ''
    ])
  };
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

const MALFORMED_ENTRY = 'Share data has a malformed graveyard entry.';
const INVALID_VERDICT = 'Share data has an invalid verdict.';

function parseSharePayload(encoded) {
  try {
    const binary = atob(encoded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

function decodeShareVerdict(kind, text) {
  if (PRESET_VERDICTS.includes(kind)) {
    return { kind };
  }
  if (kind === 'other' && typeof text === 'string' && text.length > 0 && text.length <= MAX_VERDICT_LENGTH) {
    return { kind: 'other', text };
  }
  return null;
}

function decodeShareEntry(entry) {
  if (!Array.isArray(entry) || entry.length !== 7) {
    return { error: MALFORMED_ENTRY };
  }
  const [pardonFlag, optionId, optionLabel, player, round, verdictKind, verdictText] = entry;
  if (pardonFlag !== 0 && pardonFlag !== 1) {
    return { error: MALFORMED_ENTRY };
  }
  if (![optionId, optionLabel, player].every(isNonBlankString) || !Number.isInteger(round) || round < 1) {
    return { error: MALFORMED_ENTRY };
  }
  const isPardon = pardonFlag === 1;
  const verdict = isPardon ? null : decodeShareVerdict(verdictKind, verdictText);
  if (!isPardon && !verdict) {
    return { error: INVALID_VERDICT };
  }
  return { record: { kind: isPardon ? 'pardon' : 'execution', optionId, optionLabel, player, round, verdict } };
}

function decodeShareGraveyard(entries) {
  const graveyard = [];
  for (const entry of entries) {
    const decoded = decodeShareEntry(entry);
    if (decoded.error) {
      return decoded;
    }
    graveyard.push(decoded.record);
  }
  const executions = graveyard.filter((record) => record.kind === 'execution');
  const executedIds = new Set(executions.map((record) => record.optionId));
  if (graveyard.length - executions.length > 1 || executedIds.size !== executions.length) {
    return { error: 'Share data is inconsistent.' };
  }
  return { graveyard };
}

export function decodeShareState(encoded) {
  if (typeof encoded !== 'string' || encoded.length === 0 || encoded.length > MAX_SHARE_LENGTH) {
    return { ok: false, error: 'Share data is missing or too large.' };
  }
  const payload = parseSharePayload(encoded);
  if (!payload || typeof payload !== 'object') {
    return { ok: false, error: 'Share data is malformed.' };
  }
  if (payload.v !== SHARE_VERSION) {
    return { ok: false, error: 'Unsupported share data version.' };
  }
  const { p: players, w: winner, g: entries } = payload;
  if (!Array.isArray(players) || players.length < MIN_PLAYERS || players.length > MAX_PLAYERS || !players.every(isNonBlankString)) {
    return { ok: false, error: 'Share data has invalid players.' };
  }
  if (!isNonBlankString(winner)) {
    return { ok: false, error: 'Share data has no winner.' };
  }
  if (!Array.isArray(entries) || entries.length < MIN_OPTIONS - 1 || entries.length > MAX_OPTIONS - 1) {
    return { ok: false, error: 'Share data has an invalid graveyard.' };
  }
  const decoded = decodeShareGraveyard(entries);
  if (decoded.error) {
    return { ok: false, error: decoded.error };
  }
  const winnerWasExecuted = decoded.graveyard.some((record) => record.kind === 'execution' && record.optionLabel === winner);
  if (winnerWasExecuted) {
    return { ok: false, error: 'Share data is inconsistent.' };
  }
  return {
    ok: true,
    result: {
      title: typeof payload.t === 'string' ? payload.t : '',
      players,
      winner,
      graveyard: decoded.graveyard
    }
  };
}