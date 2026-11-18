import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BrandChip } from './HalloweenBackdrop.jsx';
import { DEFAULT_PLAYERS } from '../presets.js';

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
  const confirmDialog = useRef(null);

  useEffect(() => {
    const dialog = confirmDialog.current;
    if (!dialog) {
      return;
    }
    if (pendingRemoval && !dialog.open) {
      dialog.showModal();
    }
    if (!pendingRemoval && dialog.open) {
      dialog.close();
    }
  }, [pendingRemoval]);

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

  function handleBack() {
    onBack();
  }

  function validateLocal(draftState) {
    const errors = {};
    const summaryList = [];
    const players = draftState.players;
    const options = draftState.options;
    if (players.length < 2 || players.length > 8) {
      errors.players = 'You need between 2 and 8 players.';
      summaryList.push(errors.players);
    }
    players.forEach((name, index) => {
      if (name.length === 0) {
        errors[`player-${index}`] = 'Player name cannot be blank.';
        summaryList.push(`Player ${index + 1}: name cannot be blank.`);
      }
    });
    if (options.length < 3 || options.length > 12) {
      errors.options = 'You need between 3 and 12 options.';
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
        <button type="button" className="back-link" onClick={handleBack}>
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
            <label className="sr-only" htmlFor="game-title">
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
          <legend className="fieldset-legend">Players (2-8)</legend>
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
                {playerInputs.length > 2 && (
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
            disabled={playerInputs.length >= 8}
          >
            Add player
          </button>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Options on trial (3-12)</legend>
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
                {optionInputs.length > 3 && (
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
            disabled={optionInputs.length >= 12}
          >
            Add option
          </button>
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="button button-primary">
            Open the court
          </button>
          <button type="button" className="button button-ghost" onClick={handleBack}>
            Cancel
          </button>
        </div>
      </form>

      <dialog
        className="confirm-dialog"
        ref={confirmDialog}
        onClose={() => setPendingRemoval(null)}
        aria-labelledby="confirm-dialog-title"
      >
        <h2 className="confirm-dialog-title" id="confirm-dialog-title">
          {pendingRemoval && pendingRemoval.kind === 'player' ? 'Strike a name from the roll' : 'Drop a charge from the docket'}
        </h2>
        <p className="confirm-dialog-body">
          {pendingRemoval
            ? pendingRemoval.kind === 'player'
              ? `Remove ${pendingRemoval.label} from the court?`
              : `Remove “${pendingRemoval.label}” from the trial?`
            : ''}
        </p>
        <div className="confirm-dialog-actions">
          <button type="button" className="button button-ghost" onClick={() => setPendingRemoval(null)}>
            Keep it
          </button>
          <button type="button" className="button button-danger-ghost" onClick={confirmRemoval}>
            Remove
          </button>
        </div>
      </dialog>
    </div>
  );
}
