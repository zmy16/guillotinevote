import { Copy, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { VERDICT_LABELS } from '../engine.js';
import {
  CrownArt,
  GhostArt,
  GraveyardArt,
  TombstoneArt,
  ShieldArt,
  SkullArt,
  GuillotineArt,
  CandleArt,
  BatArt,
  VERDICT_ICONS
} from './Icons.jsx';

function VerdictTag({ verdict }) {
  if (!verdict) {
    return null;
  }
  const label = verdict.kind === 'other' ? verdict.text : VERDICT_LABELS[verdict.kind];
  const VerdictIcon = VERDICT_ICONS[verdict.kind] || BatArt;
  return (
    <span className="headstone-verdict">
      <VerdictIcon className="headstone-verdict-icon" aria-hidden="true" />
      {label}
    </span>
  );
}

export function Graveyard({ graveyard }) {
  if (graveyard.length === 0) {
    return null;
  }
  return (
    <section className="section" aria-labelledby="graveyard-heading">
      <h2 className="section-heading graveyard-heading" id="graveyard-heading">
        <GraveyardArt className="graveyard-heading-icon" aria-hidden="true" />
        The Graveyard
      </h2>
      <p className="section-sub">Every option that has faced the blade, and the one that was spared.</p>
      <div className="graveyard">
        {graveyard.map((record, index) =>
          record.kind === 'pardon' ? (
            <article key={`${record.optionId}-pardon-${index}`} className="pardon-entry">
              <ShieldArt className="pardon-entry-icon" aria-hidden="true" />
              <div>
                <h3 className="pardon-entry-name">{record.optionLabel}</h3>
                <p className="pardon-entry-meta">
                  Pardoned by {record.player} · Round {record.round}. Spared the blade.
                </p>
              </div>
            </article>
          ) : (
            <article key={`${record.optionId}-execution-${index}`} className="headstone">
              <TombstoneArt className="headstone-art" aria-hidden="true" />
              <h3 className="headstone-name">{record.optionLabel}</h3>
              <p className="headstone-meta">
                Executed by {record.player} · Round {record.round}
              </p>
              <VerdictTag verdict={record.verdict} />
            </article>
          )
        )}
      </div>
    </section>
  );
}

export function WinnerDecree({ state, players, shareUrl, copied, onCopy }) {
  const survivors = state.options.filter((option) => option.status === 'alive');
  const winnerLabel = state.winner || (survivors[0] ? survivors[0].label : '');
  const playerList = players || [];
  const executions = state.graveyard.filter((record) => record.kind === 'execution').length;
  const pardons = state.graveyard.filter((record) => record.kind === 'pardon').length;
  return (
    <section className="section" aria-labelledby="decree-heading">
      <h2 className="visually-hidden" id="decree-heading">
        The decree
      </h2>
      <div className="decree">
        <div className="decree-rays" aria-hidden="true" />
        <CrownArt className="decree-crown" aria-hidden="true" />
        <div className="decree-label">Sole Survivor</div>
        <div className="decree-winner">{winnerLabel}</div>
        <p className="decree-meta">
          <span className="decree-chip">
            <SkullArt className="decree-chip-icon" aria-hidden="true" />
            {executions} executions
          </span>
          <span className="decree-chip">
            <ShieldCheck className="decree-chip-icon" aria-hidden="true" />
            {pardons} pardons
          </span>
          {playerList.length > 0 && <span className="decree-players">{playerList.join(' · ')}</span>}
        </p>

        <div className="decree-actions">
          {onCopy && (
            <button type="button" className="button button-primary" onClick={onCopy}>
              {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
              {copied ? 'Copied' : 'Copy share link'}
            </button>
          )}
        </div>
        {onCopy && (
          <p className="share-warning">
            <AlertTriangle size={14} aria-hidden="true" />
            The share link contains player names and the match history. Anyone with the link can read it. Only share
            with your group.
          </p>
        )}
        {shareUrl && (
          <p className="share-url">
            <GhostArt className="share-url-icon" aria-hidden="true" />
            {shareUrl}
          </p>
        )}
      </div>
    </section>
  );
}

export function ResultView({ result }) {
  return (
    <div className="page result-frame">
      <div className="brand">
        <GuillotineArt className="brand-mark" aria-hidden="true" />
        Shared Verdict
      </div>
      <h1 className="result-title">{result.title || 'A completed court'}</h1>
      <p className="result-players">
        <CandleArt className="result-players-icon" aria-hidden="true" />
        {result.players.length} players · {result.graveyard.length} entries in the graveyard
      </p>
      <WinnerDecree
        state={{
          options: [{ label: result.winner, status: 'alive' }],
          winner: result.winner,
          graveyard: result.graveyard,
          round: Math.max(1, ...result.graveyard.map((record) => record.round))
        }}
        players={result.players}
      />
      <Graveyard graveyard={result.graveyard} />
      <p className="share-warning" style={{ marginTop: 'var(--space-6)' }}>
        This is a read-only view of a completed match. Player names and history were shared by the group.
      </p>
    </div>
  );
}

export function InvalidShare({ reason }) {
  return (
    <div className="page result-frame">
      <SkullArt className="invalid-mark" aria-hidden="true" />
      <h1 className="result-title">This link is cursed</h1>
      <p className="section-sub">
        {reason || 'The share link could not be read. It may be malformed or from an unsupported version.'}
      </p>
      <a className="button button-ghost" href={import.meta.env.BASE_URL}>
        Return to the court
      </a>
    </div>
  );
}
