import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { createGame, selectOption, selectVerdict, executeSelected, grantRoyalPardon, encodeShareState, decodeShareState } from './engine.js';
import { SAMPLE_SETUP } from './presets.js';
import { recordSession } from './history.js';
import { playSound, isMuted, setMuted } from './sound.js';
import { Landing } from './components/Landing.jsx';
import { Setup } from './components/Setup.jsx';
import { HistoryPage, FaqPage } from './components/InfoPages.jsx';
import { Stage } from './components/Stage.jsx';
import { Graveyard, WinnerDecree, ResultView, InvalidShare } from './components/Result.jsx';
import { HalloweenBackdrop } from './components/HalloweenBackdrop.jsx';
import { BrandChip } from './components/Brand.jsx';
import { ConfirmDialog } from './components/ConfirmDialog.jsx';
import { usePageEnter, usePageExit } from './usePageEnter.js';

const EMPTY_SELECTION = { optionId: null, verdict: null, otherText: '' };

const LEAVE_BODY_SAVED = 'Leaving now closes the docket. The rounds you already played are kept in Match history as an unfinished trial, and you can resume it from there.';
const LEAVE_BODY_NOTHING_SAVED = 'Leaving now closes the docket. Nothing is saved to Match history.';

const VIEW_HASHES = { setup: '#/setup', history: '#/history', faq: '#/faq' };

function readShareResult() {
  const param = new URLSearchParams(window.location.search).get('r');
  return param ? decodeShareState(param) : null;
}

function readInitialView(shareResult) {
  if (shareResult) {
    return 'shared';
  }
  const matchingView = Object.keys(VIEW_HASHES).find((name) => VIEW_HASHES[name] === window.location.hash);
  return matchingView || 'landing';
}

export default function App() {
  const [shareResult] = useState(readShareResult);
  const [view, setView] = useState(() => readInitialView(shareResult));
  const [setupDraft, setSetupDraft] = useState(null);
  const [isSample, setIsSample] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [selections, setSelections] = useState(EMPTY_SELECTION);
  const [announcement, setAnnouncement] = useState('');
  const [muted, setMutedState] = useState(() => isMuted());
  const [copied, setCopied] = useState(false);
  const [leaveDialog, setLeaveDialog] = useState(null);
  const announcementTimer = useRef(null);
  const resumedEntryAt = useRef(null);

  const pageKey = view === 'stage' && gameState && gameState.finished ? 'finished' : view;
  const pageRef = usePageEnter(pageKey);
  const runExit = usePageExit();
  const exit = useCallback((navigate) => runExit(pageRef.current, navigate), [runExit, pageRef]);

  useEffect(() => {
    if (view === 'shared') {
      return;
    }
    const hash = VIEW_HASHES[view] || '';
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`);
    }
  }, [view]);

  useEffect(() => {
    if (view === 'shared') {
      document.querySelector('meta[name="robots"]')?.setAttribute('content', 'noindex, nofollow');
    }
  }, [view]);

  useEffect(() => {
    return () => {
      if (announcementTimer.current) {
        clearTimeout(announcementTimer.current);
      }
    };
  }, []);

  const announce = useCallback((message) => {
    setAnnouncement(message);
    if (announcementTimer.current) {
      clearTimeout(announcementTimer.current);
    }
    announcementTimer.current = setTimeout(() => setAnnouncement(''), 4000);
  }, []);

  const handleToggleMute = useCallback(() => {
    setMutedState((current) => {
      const next = !current;
      setMuted(next);
      return next;
    });
  }, []);

  const startGameFromSetup = useCallback((setup, sample) => {
    const result = createGame(setup);
    if (!result.ok) {
      announce(result.errors.join(' '));
      return;
    }
    playSound('arm');
    setGameState(result.state);
    setIsSample(sample);
    resumedEntryAt.current = null;
    setSelections(EMPTY_SELECTION);
    setCopied(false);
    exit(() => {
      setView('stage');
    });
    announce(sample ? 'Sample round started.' : `The court is open. ${result.state.players[0]} begins.`);
  }, [announce, exit]);

  const handleChoosePreset = useCallback(
    (preset) => {
      setSetupDraft({ title: preset.title, options: preset.options });
      setIsSample(false);
      exit(() => setView('setup'));
    },
    [exit]
  );

  const handleStartCustom = useCallback(() => {
    setSetupDraft({ title: '', options: [] });
    setIsSample(false);
    exit(() => setView('setup'));
  }, [exit]);

  const handleStartSample = useCallback(() => {
    startGameFromSetup(SAMPLE_SETUP, true);
  }, [startGameFromSetup]);

  const handleResumeSession = useCallback((entryAt, restoredState) => {
    playSound('arm');
    setGameState(restoredState);
    setIsSample(false);
    resumedEntryAt.current = entryAt;
    setSelections(EMPTY_SELECTION);
    setCopied(false);
    exit(() => setView('stage'));
    announce(`Trial resumed. ${restoredState.players[restoredState.currentPlayerIndex]} continues.`);
  }, [announce, exit]);

  const handleOpenHistory = useCallback(() => {
    exit(() => setView('history'));
  }, [exit]);
  const handleOpenFaq = useCallback(() => {
    exit(() => setView('faq'));
  }, [exit]);

  const handleBackToLanding = useCallback(() => {
    exit(() => {
      setView('landing');
      setGameState(null);
      setIsSample(false);
      resumedEntryAt.current = null;
      setLeaveDialog(null);
      setSelections(EMPTY_SELECTION);
    });
  }, [exit]);
  const hasTrialProgress = Boolean(gameState) && gameState.graveyard.length > 0;
  const handleAbandonSession = useCallback(() => {
    if (hasTrialProgress && !gameState.finished && !isSample) {
      recordSession(gameState, resumedEntryAt.current);
    }
    handleBackToLanding();
  }, [gameState, hasTrialProgress, isSample, handleBackToLanding]);
  const handleLeaveRequest = useCallback(() => setLeaveDialog('leave'), []);
  const handleLeaveCancel = useCallback(() => setLeaveDialog(null), []);

  const handleSelectOption = useCallback(
    (optionId) => {
      if (!gameState) {
        return;
      }
      const result = selectOption(gameState, optionId);
      if (result.ok) {
        setSelections((current) => ({ ...current, optionId }));
      } else {
        announce(result.error);
      }
    },
    [gameState, announce]
  );

  const handleSelectVerdict = useCallback((kind) => {
    setSelections((current) => ({ ...current, verdict: kind, otherText: kind === 'other' ? current.otherText : '' }));
  }, []);

  const handleChangeOtherVerdict = useCallback((text) => {
    setSelections((current) => ({ ...current, otherText: text }));
  }, []);

  const handleExecute = useCallback(() => {
    if (!gameState) {
      return;
    }
    const withSelection = selectOption(gameState, selections.optionId);
    if (!withSelection.ok) {
      announce(withSelection.error);
      return;
    }
    const verdictPayload =
      selections.verdict === 'other'
        ? { kind: 'other', text: selections.otherText }
        : { kind: selections.verdict };
    const withVerdict = selectVerdict(withSelection.state, verdictPayload);
    if (!withVerdict.ok) {
      announce(withVerdict.error);
      return;
    }
    const executed = executeSelected(withVerdict.state);
    if (!executed.ok) {
      announce(executed.error);
      return;
    }
    const executedRecord = executed.state.graveyard[executed.state.graveyard.length - 1];
    setGameState(executed.state);
    setSelections(EMPTY_SELECTION);
    if (executed.state.finished) {
      recordSession(executed.state, resumedEntryAt.current);
      playSound('winner');
      announce(`${executedRecord.optionLabel} has fallen. ${executed.state.winner} is the sole survivor.`);
    } else {
      announce(
        `${executedRecord.optionLabel} has fallen by ${executedRecord.player}. Now ${executed.state.players[executed.state.currentPlayerIndex]}'s turn.`
      );
    }
  }, [gameState, selections, announce]);

  const handlePardon = useCallback(() => {
    if (!gameState) {
      return;
    }
    const withSelection = selectOption(gameState, selections.optionId);
    if (!withSelection.ok) {
      announce(withSelection.error);
      return;
    }
    const pardoned = grantRoyalPardon(withSelection.state);
    if (!pardoned.ok) {
      announce(pardoned.error);
      return;
    }
    const record = pardoned.state.graveyard[pardoned.state.graveyard.length - 1];
    playSound('pardon');
    setGameState(pardoned.state);
    setSelections(EMPTY_SELECTION);
    announce(
      `${record.optionLabel} is pardoned. The Royal Pardon is spent. Now ${pardoned.state.players[pardoned.state.currentPlayerIndex]}'s turn.`
    );
  }, [gameState, selections, announce]);

  const shareUrl = useMemo(() => {
    if (!gameState || !gameState.finished || typeof window === 'undefined') {
      return '';
    }
    const encoded = encodeShareState(gameState);
    return `${window.location.origin}${window.location.pathname}?r=${encodeURIComponent(encoded)}`;
  }, [gameState]);

  const handleCopy = useCallback(async () => {
    if (!shareUrl) {
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      announce('Share link copied to clipboard.');
    } catch {
      announce('Could not copy the link. Select and copy it manually.');
    }
  }, [shareUrl, announce]);

  if (view === 'shared') {
    if (!shareResult || !shareResult.ok) {
      return (
        <div className="app-shell">
          <InvalidShare reason={shareResult ? shareResult.error : undefined} />
        </div>
      );
    }
    return (
      <div className="app-shell">
        <div ref={pageRef}>
          <ResultView result={shareResult.result} />
        </div>
      </div>
    );
  }

  const backdropVariant = pageKey === 'finished' ? 'finished' : view;
  const backdrop = <HalloweenBackdrop key={backdropVariant} variant={backdropVariant} />;
  const isTrialInProgress = view === 'stage' && Boolean(gameState) && !gameState.finished;
  const leaveDialogBody = hasTrialProgress && !isSample ? LEAVE_BODY_SAVED : LEAVE_BODY_NOTHING_SAVED;
  const brandBar = (
    <div className="brand-bar">
      <BrandChip />
      {isTrialInProgress && (
        <button type="button" className="button button-ghost exit-button" aria-label="Leave the court" onClick={handleLeaveRequest}>
          <ArrowLeft size={16} aria-hidden="true" />
          Leave<span className="exit-button-extra"> the court</span>
        </button>
      )}
    </div>
  );

  if (view === 'history') {
    return (
      <div className="app-shell">
        {backdrop}
        <div ref={pageRef}>
          <HistoryPage onBack={handleBackToLanding} onResume={handleResumeSession} />
        </div>
      </div>
    );
  }
  if (view === 'faq') {
    return (
      <div className="app-shell">
        {backdrop}
        <div ref={pageRef}>
          <FaqPage onBack={handleBackToLanding} />
        </div>
      </div>
    );
  }
  if (view === 'setup') {
    return (
      <div className="app-shell">
        {backdrop}
        <div ref={pageRef}>
        <Setup
          initialTitle={setupDraft ? setupDraft.title : ''}
          initialOptions={setupDraft ? setupDraft.options : []}
          onBack={handleBackToLanding}
          onStarted={(setup) => startGameFromSetup(setup, false)}
        />
        </div>
      </div>
    );
  }

  if (view === 'stage' && gameState) {
    return (
      <div className="app-shell">
        {backdrop}
        <div ref={pageRef}>
        {brandBar}
        {isSample && (
          <div className="page" style={{ paddingBottom: 0 }}>
            <div className="error-summary" style={{ background: 'rgba(139,92,246,0.14)', borderColor: 'var(--purple-500)', color: 'var(--purple-300)' }}>
              Sample round with fictional players. It never touches a real game.
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                <button type="button" className="button button-ghost" onClick={handleStartSample}>
                  Restart sample
                </button>
                <button type="button" className="button button-ghost" onClick={handleBackToLanding}>
                  Exit sample
                </button>
              </div>
            </div>
          </div>
        )}

        {gameState.finished ? (
          <div className="page">
            <WinnerDecree state={gameState} shareUrl={shareUrl} copied={copied} onCopy={handleCopy} />
            <Graveyard graveyard={gameState.graveyard} />
            <div className="share-actions" style={{ marginTop: 'var(--space-6)' }}>
              <button type="button" className="button button-ghost" onClick={handleBackToLanding}>
                Start another court
              </button>
            </div>
          </div>
        ) : (
          <>
            <Stage
              state={gameState}
              selectedOptionId={selections.optionId}
              verdict={selections.verdict}
              otherVerdict={selections.otherText}
              onSelectOption={handleSelectOption}
              onSelectVerdict={handleSelectVerdict}
              onChangeOtherVerdict={handleChangeOtherVerdict}
              onBladeSound={playSound}
              onExecute={handleExecute}
              onPardon={handlePardon}
              muted={muted}
              onToggleMute={handleToggleMute}
              announcement={announcement}
            />
            <div className="page" style={{ paddingTop: 0 }}>
              <Graveyard graveyard={gameState.graveyard} />
              <p className="share-warning" style={{ marginTop: 'var(--space-6)' }}>
                Pass the device to the next player. No account, no backend, no votes to count.
              </p>
            </div>
            {leaveDialog && (
              <ConfirmDialog
                title="Abandon the trial?"
                body={leaveDialogBody}
                cancelLabel="Keep playing"
                confirmLabel="Leave the court"
                onConfirm={handleAbandonSession}
                onCancel={handleLeaveCancel}
              />
            )}
          </>
        )}
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {backdrop}
      <div ref={pageRef}>
        <Landing
          onChoosePreset={handleChoosePreset}
          onStartCustom={handleStartCustom}
          onStartSample={handleStartSample}
          onOpenHistory={handleOpenHistory}
          onOpenFaq={handleOpenFaq}
        />
      </div>
    </div>
  );
}
