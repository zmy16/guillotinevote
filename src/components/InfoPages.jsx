import { ArrowLeft } from 'lucide-react';
import { BrandChip } from './HalloweenBackdrop.jsx';
import { readHistory } from '../history.js';

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
    a: 'No. Everything runs in the browser and nothing is uploaded. Close the tab and the trial is gone, which is why the winner screen gives you a share link that packs the whole result into the URL.'
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

export function HistoryPage({ onBack }) {
  const history = readHistory();
  return (
    <div className="page">
      <div className="page-top">
        <BackButton onBack={onBack} />
        <BrandChip />
      </div>
      <h1>Match history</h1>
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
              <li
                className="history-item"
                data-status={item.status === 'unfinished' ? 'unfinished' : 'finished'}
                key={`${item.at}-${item.title}`}
              >
                <span className="history-winner">{item.winner || 'Unfinished trial'}</span>
                <span className="history-detail">
                  {item.title} · {item.players} players · {item.executions} executions
                  {item.status === 'unfinished' ? ` · ${item.survivors} still standing` : ''} ·{' '}
                  {new Date(item.at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="history-empty">No trials recorded yet. Run one to start the record.</p>
        )}
      </section>
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
