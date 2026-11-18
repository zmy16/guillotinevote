import { useRef, useState } from 'react';
import { ArrowLeft, Crown, Hourglass, Play, Skull, Trash2, Users } from 'lucide-react';
import { BrandChip } from './Brand.jsx';
import { ConfirmDialog } from './ConfirmDialog.jsx';
import { readHistory, deleteSession, clearHistory } from '../history.js';
import { restoreGame } from '../engine.js';

const FAQ_ITEMS = [
  {
    q: 'What is GuillotineVote, in one line?',
    a: 'A pass-the-phone party game that decides group choices by elimination. Instead of voting for the option you want, you execute the one you least want, one turn at a time, until a single survivor is crowned.'
  },
  {
    q: 'Why vote for what you hate instead of what you love?',
    a: 'Normal polls reward the loudest campaigner and end in ties nobody accepts. Taking turns to remove the worst option forces a real decision: every surviving option has already survived everyone\u2019s disapproval, so the winner is the least objectionable choice, and there is always exactly one.'
  },
  {
    q: 'How many players and options do I need?',
    a: 'Two to eight players, and three to twelve options. Everyone shares one device and hands it along after each execution, so nobody sees the next player\u2019s verdict being typed.'
  },
  {
    q: 'What is a Royal Pardon?',
    a: 'One rescue per game. When an option you still want falls under the blade, the court can pardon it: the execution is reversed, that option returns to the block, and the pardon is spent. Use it early and you protect a weak candidate; save it and you may never need it.'
  },
  {
    q: 'Can two options tie?',
    a: 'No. The game stops the moment one option is left alive, so there is no draw to argue about. Every execution is logged in the Graveyard with who dropped the blade, which round, and why.'
  },
  {
    q: 'What happens on each turn?',
    a: 'The current player picks one living option, chooses a verdict such as Too Expensive, Too Far, Boring, or Not Today, or writes their own, then drops the blade. That option leaves the block and joins the Graveyard.'
  },
  {
    q: 'Do we need accounts or a server?',
    a: 'No. Everything runs in the browser and nothing is uploaded. Close the tab mid-game and the trial is gone. Leave through the Leave the court button and it waits in Match history, where you can resume it. The winner screen gives you a share link that packs the whole result into the URL.'
  },
  {
    q: 'Does it work on a phone?',
    a: 'It is built for a phone first: one column, thumb-sized buttons, and a layout that survives a small screen. Pass the device around the table; no app install needed.'
  }
];

function BackButton({ onBack }) {
  return (
    <button type="button" className="back-link" onClick={onBack}>
      <ArrowLeft aria-hidden="true" size={15} strokeWidth={2.2} />
      Back to the court
    </button>
  );
}

function pluralize(count, noun) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

function formatTimestamp(at) {
  return new Date(at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

function HistoryItem({ item, onResume, onDelete }) {
  const isUnfinished = item.status === 'unfinished';
  const restored = isUnfinished ? restoreGame(item.snapshot) : null;
  const totalOptions = item.executions + item.survivors;
  const StatusIcon = isUnfinished ? Hourglass : Crown;
  return (
    <li className="history-item" data-status={isUnfinished ? 'unfinished' : 'finished'}>
      <div className="history-main">
        <div className="history-top">
          <span className="history-badge">
            <StatusIcon size={13} aria-hidden="true" />
            {isUnfinished ? 'Unfinished' : 'Finished'}
          </span>
          <time className="history-date" dateTime={new Date(item.at).toISOString()}>
            {formatTimestamp(item.at)}
          </time>
        </div>
        <h3 className="history-title">{item.title}</h3>
        <p className="history-result">
          {isUnfinished ? (
            `${item.survivors} of ${totalOptions} options still standing`
          ) : (
            <>
              Sole survivor <strong className="history-winner">{item.winner}</strong>
            </>
          )}
        </p>
        <ul className="history-stats" aria-label="Trial details">
          <li className="history-stat">
            <Users size={14} aria-hidden="true" />
            {pluralize(item.players, 'player')}
          </li>
          <li className="history-stat">
            <Skull size={14} aria-hidden="true" />
            {pluralize(item.executions, 'execution')}
          </li>
        </ul>
      </div>
      <div className="history-actions">
        {restored && restored.ok && (
          <button type="button" className="button button-ghost history-resume" onClick={() => onResume(item.at, restored.state)}>
            <Play size={16} aria-hidden="true" />
            Resume trial
          </button>
        )}
        <button type="button" className="history-delete" onClick={() => onDelete(item)} aria-label={`Delete ${item.title}`} title="Delete this trial">
          <Trash2 size={18} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}

function deletionDialogProps(pendingDeletion) {
  if (pendingDeletion.scope === 'all') {
    return {
      title: 'Delete all history?',
      body: 'Every recorded trial, including unfinished ones you could still resume, is erased from this device. This cannot be undone.',
      confirmLabel: 'Delete all'
    };
  }
  const { item } = pendingDeletion;
  return {
    title: 'Delete this trial?',
    body:
      item.status === 'unfinished'
        ? `${item.title} is unfinished. Deleting it means it can no longer be resumed.`
        : `${item.title} is removed from this device. This cannot be undone.`,
    confirmLabel: 'Delete trial'
  };
}

export function HistoryPage({ onBack, onResume }) {
  const [history, setHistory] = useState(readHistory);
  const [pendingDeletion, setPendingDeletion] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const headingRef = useRef(null);

  function handleConfirmDeletion() {
    if (pendingDeletion.scope === 'all') {
      clearHistory();
      setStatusMessage('All trials deleted.');
    } else {
      deleteSession(pendingDeletion.item.at);
      setStatusMessage(`${pendingDeletion.item.title} deleted.`);
    }
    setHistory(readHistory());
    setPendingDeletion(null);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  return (
    <div className="page">
      <div className="page-top">
        <BackButton onBack={onBack} />
        <BrandChip />
      </div>
      <p className="visually-hidden" role="status">
        {statusMessage}
      </p>
      <div className="history-head">
        <h1 ref={headingRef} tabIndex={-1}>
          Match history
        </h1>
        {history.length > 0 && (
          <button type="button" className="button button-danger-ghost history-clear" onClick={() => setPendingDeletion({ scope: 'all' })}>
            <Trash2 size={16} aria-hidden="true" />
            Delete all
          </button>
        )}
      </div>
      <p className="section-sub" style={{ marginTop: 'var(--space-2)' }}>
        {history.length > 0
          ? `Your last ${history.length} ${history.length === 1 ? 'trial' : 'trials'}, finished or abandoned. Stored on this device only.`
          : 'Finished and abandoned trials land here. Stored on this device only.'}
      </p>
      <section className="section" aria-labelledby="history-heading" style={{ marginTop: 'var(--space-5)' }}>
        <h2 className="visually-hidden" id="history-heading">
          Recorded trials
        </h2>
        {history.length > 0 ? (
          <ol className="history-list">
            {history.map((item) => (
              <HistoryItem
                key={`${item.at}-${item.title}`}
                item={item}
                onResume={onResume}
                onDelete={(target) => setPendingDeletion({ scope: 'one', item: target })}
              />
            ))}
          </ol>
        ) : (
          <p className="history-empty">No trials recorded yet. Run one to start the record.</p>
        )}
      </section>
      {pendingDeletion && (
        <ConfirmDialog
          {...deletionDialogProps(pendingDeletion)}
          cancelLabel="Keep it"
          onConfirm={handleConfirmDeletion}
          onCancel={() => setPendingDeletion(null)}
        />
      )}
    </div>
  );
}
export function FaqPage({ onBack }) {
  return (
    <div className="page">
      <div className="page-top">
        <BackButton onBack={onBack} />
        <BrandChip />
      </div>
      <h1>Questions from the gallery</h1>
      <p className="section-sub" style={{ marginTop: 'var(--space-2)' }}>
        Everything the first-time judge usually asks before the blade drops.
      </p>
      <section className="section" aria-labelledby="faq-heading" style={{ marginTop: 'var(--space-5)' }}>
        <h2 className="visually-hidden" id="faq-heading">
          FAQ
        </h2>
        <div className="faq-list">
          {FAQ_ITEMS.map((item) => (
            <details className="faq-item" key={item.q}>
              <summary className="faq-question">
                <span>{item.q}</span>
                <span className="faq-marker" aria-hidden="true" />
              </summary>
              <p className="faq-answer">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
