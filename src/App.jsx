import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { createGame, selectOption, selectVerdict, executeSelected, useRoyalPardon, encodeShareState, decodeShareState } from './engine.js';import { SAMPLE_SETUP } from './presets.js';
import { recordSession } from './history.js';
import { playSound, isMuted, setMuted } from './sound.js';
import { Landing } from './components/Landing.jsx';
import { Setup } from './components/Setup.jsx';
import { HistoryPage, FaqPage } from './components/InfoPages.jsx';
import { Stage } from './components/Stage.jsx';
import { Graveyard, WinnerDecree, ResultView, InvalidShare } from './components/Result.jsx';
import { HalloweenBackdrop, GuillotineMark } from './components/HalloweenBackdrop.jsx';
import { LeaveConfirm } from './components/LeaveConfirm.jsx';
import { usePageEnter, usePageExit } from './usePageEnter.js';

function readShareParam() {
  if (typeof window === 'undefined') {
    return null;
  }
  const params = new URLSearchParams(window.location.search);
  return params.get('r');
}

export default function App() {
  const [shareParam] = useState(() => readShareParam());
  const [shareResult, setShareResult] = useState(() => {
    if (!shareParam) {
      return null;
    }
    return decodeShareState(shareParam);
  });

  const [view, setView] = useState(() => (shareParam ? 'shared' : 'landing'));
  const [setupDraft, setSetupDraft] = useState(null);
  const [isSample, setIsSample] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [selections, setSelections] = useState({ optionId: null, verdict: null, otherText: '' });
  const [announcement, setAnnouncement] = useState('');
  const [muted, setMutedState] = useState(() => isMuted());
  const [copied, setCopied] = useState(false);
  const [leaveDialog, setLeaveDialog] = useState(null);
  const announcementTimer = useRef(null);

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

  function resetSelection() {
    setSelections({ optionId: null, verdict: null, otherText: '' });
  }

  function startGameFromSetup(setup, sample) {
    const result = createGame(setup);
    if (!result.ok) {
      announce(result.errors.join(' '));
      return;
    }
    setGameState(result.state);
    setIsSample(sample);
    resetSelection();
    setCopied(false);
    exit(() => {
      setView('stage');
    });
    announce(sample ? 'Sample round started.' : `The court is open. ${result.state.players[0]} begins.`);
  }

  const handleChoosePreset = useCallback(
    (preset) => {
      setSetupDraft({ title: preset.title, options: preset.options });
      setIsSample(false);
      exit(() => setView('setup'));
    },
    []
  );

  const handleStartCustom = useCallback(() => {
    setSetupDraft({ title: '', options: [] });
    setIsSample(false);
    setView('setup');
  }, []);

  const handleStartSample = useCallback(() => {
    startGameFromSetup(SAMPLE_SETUP, true);
  }, []);
  const handleOpenHistory = useCallback(() => {
    exit(() => setView('history'));
  }, []);
  const handleOpenFaq = useCallback(() => {
    exit(() => setView('faq'));
  }, []);

  const handleBackToLanding = useCallback(() => {
    exit(() => {
      setView('landing');
      setGameState(null);
      setIsSample(false);
      resetSelection();
    });
  }, []);
  const handleAbandonSession = useCallback(() => {
    if (gameState && !gameState.finished && !isSample) {
      recordSession(gameState);
    }
    handleBackToLanding();
  }, [gameState, isSample, handleBackToLanding]);
  const handleLeaveRequest = useCallback(() => {
    const hasProgress = Boolean(gameState) && gameState.graveyard.length > 0;
    if (!hasProgress) {
      handleBackToLanding();
      return;
    }
    setLeaveDialog('leave');
  }, [gameState, handleBackToLanding]);
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

  const handleBladeLand = useCallback(() => playSound('blade'), []);

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
    resetSelection();
    if (executed.state.finished) {
      recordSession(executed.state);
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
    const pardoned = useRoyalPardon(withSelection.state);
    if (!pardoned.ok) {
      announce(pardoned.error);
      return;
    }
    const record = pardoned.state.graveyard[pardoned.state.graveyard.length - 1];
    playSound('pardon');
    setGameState(pardoned.state);
    resetSelection();
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

  const pageKey = view === 'stage' && gameState && gameState.finished ? 'finished' : view;
  const pageRef = usePageEnter(pageKey);
  const runExit = usePageExit();
  const exit = useCallback(
    (navigate) => runExit(pageRef.current, navigate),
    [runExit, pageRef]
  );

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

  const backdrop = <HalloweenBackdrop variant={view} />;
  const brandBar = (
    <div className="brand-bar">
      <div className="brand">
        <GuillotineMark className="brand-mark" />
        GuillotineVote
      </div>
    </div>
  );

  if (view === 'history') {
    return (
      <div className="app-shell">
        {backdrop}
        <div ref={pageRef}>
          <HistoryPage onBack={handleBackToLanding} />
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
              onBladeLand={handleBladeLand}
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
            <div className="page" style={{ paddingTop: 0 }}>
              <button type="button" className="button button-ghost exit-button" onClick={handleLeaveRequest}>
                <ArrowLeft size={16} aria-hidden="true" />
                Leave the court
              </button>
            </div>
            {leaveDialog && (
              <LeaveConfirm
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
