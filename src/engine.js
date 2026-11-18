export function createGame(setup) {
  const errors = validateSetup(setup);
  if (errors.length > 0) {
    return { ok: false, errors };
  }
  const options = setup.options.map((label, index) => ({
    id: `opt-${index}`,
    label,
    status: 'alive'
  }));
  return {
    ok: true,
    state: {
      title: setup.title,
      players: setup.players,
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
  const players = (setup.players || []).map((name) => (typeof name === 'string' ? name.trim() : ''));
  const options = (setup.options || []).map((label) => (typeof label === 'string' ? label.trim() : ''));
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

export function useRoyalPardon(state) {
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

export function decodeShareState(encoded) {
  if (typeof encoded !== 'string' || encoded.length === 0 || encoded.length > MAX_SHARE_LENGTH) {
    return { ok: false, error: 'Share data is missing or too large.' };
  }
  let json;
  try {
    const binary = atob(encoded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    json = new TextDecoder().decode(bytes);
  } catch {
    return { ok: false, error: 'Share data is malformed.' };
  }
  let payload;
  try {
    payload = JSON.parse(json);
  } catch {
    return { ok: false, error: 'Share data is malformed.' };
  }
  if (!payload || payload.v !== SHARE_VERSION) {
    return { ok: false, error: 'Unsupported share data version.' };
  }
  if (!Array.isArray(payload.p) || payload.p.length < MIN_PLAYERS || payload.p.length > MAX_PLAYERS) {
    return { ok: false, error: 'Share data has invalid players.' };
  }
  if (typeof payload.w !== 'string' || payload.w.length === 0) {
    return { ok: false, error: 'Share data has no winner.' };
  }
  if (!Array.isArray(payload.g) || payload.g.length < MIN_OPTIONS - 1 || payload.g.length > MAX_OPTIONS - 1) {
    return { ok: false, error: 'Share data has an invalid graveyard.' };
  }
  const graveyard = [];
  for (const entry of payload.g) {
    if (!Array.isArray(entry) || entry.length !== 7) {
      return { ok: false, error: 'Share data has a malformed graveyard entry.' };
    }
    const [isPardon, optionId, optionLabel, player, round, verdictKind, verdictText] = entry;
    if (typeof optionId !== 'string' || optionId.length === 0) {
      return { ok: false, error: 'Share data has a malformed graveyard entry.' };
    }
    if (typeof optionLabel !== 'string' || optionLabel.length === 0) {
      return { ok: false, error: 'Share data has a malformed graveyard entry.' };
    }
    if (typeof player !== 'string' || player.length === 0) {
      return { ok: false, error: 'Share data has a malformed graveyard entry.' };
    }
    if (!Number.isInteger(round) || round < 1) {
      return { ok: false, error: 'Share data has a malformed graveyard entry.' };
    }
    let verdict = null;
    if (isPardon === 0) {
      if (PRESET_VERDICTS.includes(verdictKind)) {
        verdict = { kind: verdictKind };
      } else if (verdictKind === 'other') {
        if (typeof verdictText !== 'string' || verdictText.length === 0 || verdictText.length > MAX_VERDICT_LENGTH) {
          return { ok: false, error: 'Share data has an invalid verdict.' };
        }
        verdict = { kind: 'other', text: verdictText };
      } else {
        return { ok: false, error: 'Share data has an invalid verdict.' };
      }
    }
    graveyard.push({
      kind: isPardon === 1 ? 'pardon' : 'execution',
      optionId,
      optionLabel,
      player,
      round,
      verdict
    });
  }
  const executions = graveyard.filter((record) => record.kind === 'execution').length;
  if (executions !== payload.g.length - graveyard.filter((record) => record.kind === 'pardon').length) {
    return { ok: false, error: 'Share data is inconsistent.' };
  }
  return {
    ok: true,
    result: {
      title: typeof payload.t === 'string' ? payload.t : '',
      players: payload.p,
      winner: payload.w,
      graveyard
    }
  };
}

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
export const MAX_SHARE_LENGTH = 4000;
export const SHARE_VERSION = 1;
const RESTORE_ERROR = 'This trial can no longer be resumed.';
