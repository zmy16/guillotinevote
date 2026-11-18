import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BrandChip } from './Brand.jsx';
import { ConfirmDialog } from './ConfirmDialog.jsx';
import { DEFAULT_PLAYERS } from '../presets.js';
import { MIN_PLAYERS, MAX_PLAYERS, MIN_OPTIONS, MAX_OPTIONS } from '../engine.js';

function removalDialogProps({ kind, label }) {
  if (kind === 'player') {
    return { title: 'Strike a name from the roll', body: `Remove ${label} from the court?` };
  }
  return { title: 'Drop a charge from the docket', body: `Remove “${label}” from the trial?` };
}

export function Setup({ initialTitle = '', initialOptions = [], onBack, onStarted }) {
  const [title, setTitle] = useState(initialTitle);
  const [playerInputs, setPlayerInputs] = useState(DEFAULT_PLAYERS);
  const [optionInputs, setOptionInputs] = useState(() =>
    initialOptions.length > 0 ? [...initialOptions] : ['', '', '']
  );
  const [attempted, setAttempted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [summary, setSummary] = useState([]);
  const [pendingRemoval, setPendingRemoval] = useState(null);

  const draft = useMemo(
    () => ({
      title: title.trim() || 'Untitled Court',
      players: playerInputs.map((name) => name.trim()),
      options: optionInputs.map((label) => label.trim())
    }),
    [title, playerInputs, optionInputs]
  );

  function addPlayer() {
    setPlayerInputs((current) => [...current, '']);
  }

  function addOption() {
    setOptionInputs((current) => [...current, '']);
  }

  function removePlayer(index) {
    setPlayerInputs((current) => current.filter((_, i) => i !== index));
  }

  function removeOption(index) {
    setOptionInputs((current) => current.filter((_, i) => i !== index));
  }

  function requestRemoval(kind, index, label) {
    if (label.trim().length === 0) {
      if (kind === 'player') {
        removePlayer(index);
      } else {
        removeOption(index);
      }
      return;
    }
    setPendingRemoval({ kind, index, label: label.trim() });
  }

  function confirmRemoval() {
    if (!pendingRemoval) {
      return;
    }
    if (pendingRemoval.kind === 'player') {
      removePlayer(pendingRemoval.index);
    } else {
      removeOption(pendingRemoval.index);
    }
    setPendingRemoval(null);
  }

  function validateLocal(draftState) {
    const errors = {};
    const summaryList = [];
    const players = draftState.players;
    const options = draftState.options;
    if (players.length < MIN_PLAYERS || players.length > MAX_PLAYERS) {
      errors.players = `You need between ${MIN_PLAYERS} and ${MAX_PLAYERS} players.`;
      summaryList.push(errors.players);
    }
    players.forEach((name, index) => {
      if (name.length === 0) {
        errors[`player-${index}`] = 'Player name cannot be blank.';
        summaryList.push(`Player ${index + 1}: name cannot be blank.`);
      }
    });
    if (options.length < MIN_OPTIONS || options.length > MAX_OPTIONS) {
      errors.options = `You need between ${MIN_OPTIONS} and ${MAX_OPTIONS} options.`;
      summaryList.push(errors.options);
    }
    options.forEach((label, index) => {
      if (label.length === 0) {
        errors[`option-${index}`] = 'Option cannot be blank.';
        summaryList.push(`Option ${index + 1}: cannot be blank.`);
      }
    });
    const seen = new Set();
    options.forEach((label, index) => {
      const key = label.toLowerCase();
      if (key.length > 0 && seen.has(key)) {
        errors[`option-${index}`] = 'Duplicate option.';
        summaryList.push(`Option ${index + 1}: "${label}" is already on the docket.`);
      }
      seen.add(key);
    });
    return { errors, summaryList };
  }

  function handleSubmit(event) {
    event.preventDefault();
    setAttempted(true);
    const { errors, summaryList } = validateLocal(draft);
    setFieldErrors(errors);
    setSummary(summaryList);
    if (summaryList.length > 0) {
      return;
    }
    onStarted(draft);
  }

  return (
    <div className="page">
      <div className="page-top">
        <button type="button" className="back-link" onClick={onBack}>
          <ArrowLeft aria-hidden="true" size={15} strokeWidth={2.2} />
          Back to the court
        </button>
        <BrandChip />
      </div>
      <h1>Write the docket</h1>
      <p className="section-sub" style={{ marginTop: 'var(--space-2)' }}>
        {attempted && summary.length > 0 ? 'Fix the errors below to open the court.' : 'A title, the players, and the accused options.'}
      </p>

      {attempted && summary.length > 0 && (
        <div className="error-summary" role="alert">
          <strong>We could not open the court yet.</strong>
          <ul>
            {summary.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <form className="form" onSubmit={handleSubmit} noValidate>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Game title</legend>
          <div className="field">
            <label className="visually-hidden" htmlFor="game-title">
              Game title
            </label>
            <input
              id="game-title"
              className="input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Dinner Dilemma (optional)"
              maxLength={60}
            />
            <span className="field-hint">Optional. Defaults to “Untitled Court”.</span>
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Players ({MIN_PLAYERS}-{MAX_PLAYERS})</legend>
          <div className="field-grid">
            {playerInputs.map((name, index) => (
            <div className="field" key={`player-row-${index}`}>
              <label className="field-label" htmlFor={`player-${index}`}>
                Player {index + 1}
              </label>
              <div className="field-input-wrap">
                <input
                  id={`player-${index}`}
                  className="input"
                  value={name}
                  onChange={(event) =>
                    setPlayerInputs((current) =>
                      current.map((value, i) => (i === index ? event.target.value : value))
                    )
                  }
                  aria-invalid={attempted && fieldErrors[`player-${index}`] ? 'true' : undefined}
                  placeholder={`Player ${index + 1}`}
                  maxLength={24}
                />
                {playerInputs.length > MIN_PLAYERS && (
                  <button
                    type="button"
                    className="field-clear"
                    onClick={() => requestRemoval('player', index, playerInputs[index] || '')}
                    aria-label={`Remove player ${index + 1}`}
                  >
                    ×
                  </button>
                )}
              </div>
              {attempted && fieldErrors[`player-${index}`] && (
                <span className="field-error" id={`player-error-${index}`}>
                  {fieldErrors[`player-${index}`]}
                </span>
              )}
            </div>
          ))}
          </div>
          <button
            type="button"
            className="button button-ghost"
            onClick={addPlayer}
            disabled={playerInputs.length >= MAX_PLAYERS}
          >
            Add player
          </button>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Options on trial ({MIN_OPTIONS}-{MAX_OPTIONS})</legend>
          <div className="field-grid">
            {optionInputs.map((label, index) => (
            <div className="field" key={`option-row-${index}`}>
              <label className="field-label" htmlFor={`option-${index}`}>
                Option {index + 1}
              </label>
              <div className="field-input-wrap">
                <input
                  id={`option-${index}`}
                  className="input"
                  value={label}
                  onChange={(event) =>
                    setOptionInputs((current) =>
                      current.map((value, i) => (i === index ? event.target.value : value))
                    )
                  }
                  aria-invalid={attempted && fieldErrors[`option-${index}`] ? 'true' : undefined}
                  placeholder="The accused"
                  maxLength={40}
                />
                {optionInputs.length > MIN_OPTIONS && (
                  <button
                    type="button"
                    className="field-clear"
                    onClick={() => requestRemoval('option', index, optionInputs[index] || '')}
                    aria-label={`Remove option ${index + 1}`}
                  >
                    ×
                  </button>
                )}
              </div>
              {attempted && fieldErrors[`option-${index}`] && (
                <span className="field-error" id={`option-error-${index}`}>
                  {fieldErrors[`option-${index}`]}
                </span>
              )}
            </div>
          ))}
          </div>
          <button
            type="button"
            className="button button-ghost"
            onClick={addOption}
            disabled={optionInputs.length >= MAX_OPTIONS}
          >
            Add option
          </button>
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="button button-primary">
            Open the court
          </button>
          <button type="button" className="button button-ghost" onClick={onBack}>
            Cancel
          </button>
        </div>
      </form>

      {pendingRemoval && (
        <ConfirmDialog
          {...removalDialogProps(pendingRemoval)}
          cancelLabel="Keep it"
          confirmLabel="Remove"
          onConfirm={confirmRemoval}
          onCancel={() => setPendingRemoval(null)}
        />
      )}
    </div>
  );
}
