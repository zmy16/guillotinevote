import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Volume2, VolumeX, HelpCircle } from 'lucide-react';
import { PRESET_VERDICTS, VERDICT_LABELS, MAX_VERDICT_LENGTH } from '../engine.js';
import { PrisonerGlyph, prisonerHueFor, GuillotineRig, JAW_OPEN_OFFSET } from './Prisoner.jsx';
import {
  CrownArt,
  SwordArt,
  ShieldArt,
  CoinArt,
  MapArt,
  BoredArt,
  SleepArt,
  ExecutionerHood,
  BatArt
} from './Icons.jsx';

const VERDICT_ICONS = {
  too_expensive: CoinArt,
  too_far: MapArt,
  boring: BoredArt,
  not_today: SleepArt
};

const BLADE_LANDED_Y = 71;
const BLADE_BOUNCE_Y = BLADE_LANDED_Y - 6;
const COMMIT_DELAY_AFTER_IMPACT = 0.5;

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function buildExecutionTimeline(root, blade, { onBladeSound, onCommit }) {
  const frame = root.querySelector('.blade-frame');
  const guard = root.querySelector('.guillotine-rig');
  const flash = root.querySelector('.rig-flash');
  const sparks = root.querySelector('.rig-sparks');
  const sparkLines = root.querySelectorAll('.rig-spark');
  const rope = root.querySelector('.rig-rope');
  const speed = root.querySelector('.rig-speed');
  const glow = root.querySelector('.rig-edge-glow');
  const shadow = root.querySelector('.rig-shadow');
  const dust = root.querySelector('.rig-dust');
  const puffs = root.querySelectorAll('.rig-dust-puff');
  const debris = root.querySelector('.rig-debris');
  const bits = root.querySelectorAll('.rig-debris-bit');
  const dropGroup = root.querySelector('.rig-drops');
  const drops = root.querySelectorAll('.rig-drop');
  const jaws = root.querySelectorAll('.rig-jaw');
  const stain = root.querySelector('.rig-stain');
  const impactGlow = root.querySelector('.rig-impact-glow');

  const timeline = gsap.timeline({ defaults: { overwrite: 'auto' } });
  timeline.to(jaws, { x: 0, duration: 0.12, ease: 'power2.in' }, 0);
  timeline.set(rope, { opacity: 1, attr: { y2: 27 } }, 0);
  timeline.to(rope, { opacity: 0, attr: { y2: 19 }, duration: 0.07, ease: 'power2.in' }, 0);
  timeline.to(blade, { y: -13, duration: 0.44, ease: 'power2.out' }, 0);
  timeline.to(shadow, { opacity: 0.3, attr: { rx: 20 }, duration: 0.44, ease: 'power2.out' }, 0);
  timeline.to(blade, { y: -9, duration: 0.46, ease: 'sine.inOut' }, 0.44);
  timeline.addLabel('release', 0.9);
  timeline.call(onBladeSound, ['fall'], 'release');
  timeline.to(blade, { y: BLADE_LANDED_Y, duration: 0.3, ease: 'power3.in' }, 'release');
  timeline.to(blade, { filter: 'blur(2.6px)', duration: 0.22, ease: 'power2.in' }, 'release+=0.06');
  timeline.to(speed, { opacity: 1, duration: 0.09 }, 'release+=0.1');
  timeline.to(glow, { opacity: 0.85, duration: 0.1 }, 'release+=0.1');
  timeline.to(shadow, { opacity: 0.85, attr: { rx: 32 }, duration: 0.3, ease: 'power2.in' }, 'release');
  timeline.addLabel('impact', 1.22);
  timeline.call(onBladeSound, ['blade'], 'impact');
  timeline.to(blade, { y: BLADE_BOUNCE_Y, duration: 0.08, ease: 'power2.out' }, 'impact');
  timeline.to(blade, { y: BLADE_LANDED_Y, duration: 0.15, ease: 'sine.out' }, 'impact+=0.08');
  timeline.fromTo(
    blade,
    { rotate: 0, svgOrigin: '120 84' },
    { rotate: 1.1, duration: 0.07, ease: 'power2.in', yoyo: true, repeat: 5 },
    'impact+=0.06'
  );
  timeline.to(blade, { filter: 'blur(0px)', duration: 0.1 }, 'impact');
  timeline.to(speed, { opacity: 0, duration: 0.14 }, 'impact');
  timeline.to(glow, { opacity: 0, duration: 0.28 }, 'impact');
  timeline.to(shadow, { opacity: 0, duration: 0.22 }, 'impact');
  timeline.fromTo(
    flash,
    { opacity: 0, scale: 0.5, svgOrigin: '120 94' },
    { opacity: 0.6, scale: 1.15, duration: 0.18, ease: 'power2.out' },
    'impact'
  );
  timeline.to(flash, { opacity: 0, duration: 0.34, ease: 'power1.in' }, 'impact+=0.2');
  timeline.fromTo(sparks, { opacity: 1 }, { opacity: 0, duration: 0.24, ease: 'power2.out' }, 'impact');
  timeline.fromTo(
    sparkLines,
    { scaleX: 0.2, scaleY: 0.2, svgOrigin: '120 145' },
    { scaleX: 1, scaleY: 1, duration: 0.12, ease: 'power3.out', stagger: 0.008 },
    'impact'
  );
  timeline.fromTo(dust, { opacity: 0.75 }, { opacity: 0, duration: 0.8, ease: 'power1.out' }, 'impact');
  timeline.fromTo(
    puffs,
    { scale: 0.4, opacity: 0.85, svgOrigin: '120 145' },
    { scale: 1.5, duration: 'random(0.45, 0.7)', ease: 'power2.out', stagger: 0.06 },
    'impact'
  );
  timeline.fromTo(debris, { opacity: 1 }, { opacity: 0, duration: 0.7, ease: 'power1.in' }, 'impact+=0.28');
  timeline.fromTo(
    bits,
    { y: 0, x: 0, opacity: 1, rotate: 0 },
    { y: 'random(-26, -12)', x: 'random(-20, 20)', rotate: 'random(-160, 160)', duration: 'random(0.24, 0.34)', ease: 'power2.out', stagger: 0.012 },
    'impact'
  );
  timeline.to(
    bits,
    { y: 'random(16, 26)', opacity: 0, duration: 'random(0.3, 0.44)', ease: 'power2.in', stagger: 0.012 },
    'impact+=0.26'
  );
  timeline.set(dropGroup, { opacity: 1 }, 'impact');
  timeline.fromTo(
    drops,
    { y: 0, x: 0, scale: 1, opacity: 1 },
    { y: 'random(-30, -16)', x: 'random(-10, 10)', scale: 0.85, duration: 'random(0.2, 0.28)', ease: 'power2.out', stagger: 0.014 },
    'impact'
  );
  timeline.to(
    drops,
    { y: 'random(6, 14)', scale: 0.4, opacity: 0, duration: 'random(0.34, 0.5)', ease: 'power2.in', stagger: 0.014 },
    'impact+=0.24'
  );
  timeline.set(dropGroup, { opacity: 0 }, 'impact+=0.78');
  timeline.fromTo(
    stain,
    { opacity: 1, scaleY: 0, svgOrigin: '120 148' },
    { scaleY: 1, duration: 0.5, ease: 'power1.out' },
    'impact+=0.1'
  );
  timeline.to(stain, { opacity: 0, duration: 0.6 }, 'impact+=1.1');
  timeline.fromTo(
    guard,
    { scaleY: 1 },
    { scaleY: 0.978, scaleX: 1.008, transformOrigin: '50% 100%', duration: 0.08, ease: 'power2.out', yoyo: true, repeat: 1 },
    'impact'
  );
  timeline.to(
    frame,
    {
      keyframes: {
        x: [0, 11, -8, 6, -4, 2.5, -1.2, 0],
        y: [0, 3, -2, 1.5, -1, 0.5, 0, 0],
        easeEach: 'power2.out'
      },
      duration: 0.44
    },
    'impact'
  );
  timeline.fromTo(impactGlow, { opacity: 0 }, { opacity: 1, duration: 0.1, yoyo: true, repeat: 1 }, 'impact');
  timeline.call(onCommit, null, `impact+=${COMMIT_DELAY_AFTER_IMPACT}`);
  timeline.to(blade, { y: 0, duration: 0.86, ease: 'power2.inOut', delay: 0.22 }, 'impact+=0.62');
  timeline.to(
    jaws,
    { x: (index) => (index === 0 ? -JAW_OPEN_OFFSET : JAW_OPEN_OFFSET), duration: 0.3, ease: 'power2.out' },
    'impact+=0.62'
  );
  return timeline;
}

export function Stage({
  state,
  selectedOptionId,
  verdict,
  otherVerdict,
  onSelectOption,
  onSelectVerdict,
  onChangeOtherVerdict,
  onBladeSound,
  onExecute,
  onPardon,
  muted,
  onToggleMute,
  announcement
}) {
  const rootRef = useRef(null);
  const bladeRef = useRef(null);
  const gridRef = useRef(null);
  const executionTimeline = useRef(null);
  const previousGraveyardLength = useRef(state.graveyard.length);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    if (!gridRef.current || prefersReducedMotion()) {
      return;
    }
    gsap.fromTo(
      gridRef.current.querySelectorAll('.prisoner-card'),
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.42, ease: 'power2.out', stagger: 0.045, overwrite: 'auto' }
    );
  }, [state.currentPlayerIndex]);

  useEffect(() => () => executionTimeline.current?.kill(), []);

  useEffect(() => {
    if (state.graveyard.length === previousGraveyardLength.current) {
      return undefined;
    }
    previousGraveyardLength.current = state.graveyard.length;
    const last = state.graveyard[state.graveyard.length - 1];
    if (!last || last.kind !== 'pardon' || prefersReducedMotion()) {
      return undefined;
    }
    const timeline = gsap.timeline();
    timeline.fromTo(
      '.pardon-card',
      { scale: 1 },
      { scale: 1.08, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1 }
    );
    timeline.fromTo(
      '.blade-frame',
      { boxShadow: '0 0 0 0 rgba(245,158,11,0)' },
      {
        boxShadow: '0 0 0 3px rgba(245,158,11,0.55), 0 0 70px rgba(245,158,11,0.35)',
        duration: 0.26,
        yoyo: true,
        repeat: 1,
        clearProps: 'boxShadow'
      },
      0
    );
    return () => timeline.kill();
  }, [state.graveyard.length]);

  const aliveOptions = state.options.filter((option) => option.status === 'alive');
  const totalOptions = state.options.length;
  const eliminatedCount = state.graveyard.filter((record) => record.kind === 'execution').length;
  const progressPercent = Math.round((eliminatedCount / Math.max(1, totalOptions - 1)) * 100);
  const currentPlayer = state.players[state.currentPlayerIndex];
  const otherVerdictInvalid = verdict === 'other' && otherVerdict.trim().length === 0;
  const canExecute = Boolean(selectedOptionId) && Boolean(verdict) && !otherVerdictInvalid;

  const helperMessage = !selectedOptionId
    ? 'Choose one living option to accuse.'
    : !verdict
      ? 'Now choose a verdict.'
      : otherVerdictInvalid
        ? 'Write your verdict to continue.'
        : 'Ready. The blade is waiting.';

  const unlessExecuting = (handler) => (...args) => {
    if (!isExecuting) {
      handler(...args);
    }
  };

  function handleDropBlade() {
    if (!canExecute || isExecuting) {
      return;
    }
    if (prefersReducedMotion()) {
      onBladeSound('blade');
      onExecute();
      return;
    }
    executionTimeline.current?.kill();
    onBladeSound('arm');
    setIsExecuting(true);
    executionTimeline.current = buildExecutionTimeline(rootRef.current, bladeRef.current, {
      onBladeSound,
      onCommit: () => {
        setIsExecuting(false);
        onExecute();
      }
    });
  }

  return (
    <div className="page page-wide" ref={rootRef}>
      <p className="visually-hidden" role="status" aria-live="polite">
        {announcement}
      </p>
      <div className="stage" data-executing={isExecuting}>
        <div className="stage-rig">
          <div className="blade-frame">
            <div className="rig-impact-glow" aria-hidden="true" />
            <div className="rig-wrap">
              <GuillotineRig bladeRef={bladeRef} />
              <p className="rig-caption">
                <ExecutionerHood className="rig-caption-icon" aria-hidden="true" />
                The Chopping Block
              </p>
            </div>
          </div>
        </div>

        <div className="stage-controls">
          <div className="turn-indicator">
            <div className="turn-identity">
              <span className="turn-avatar" aria-hidden="true">
                {currentPlayer.trim().charAt(0).toUpperCase()}
              </span>
              <div>
                <div className="turn-round">
                  Round {state.round} · {aliveOptions.length} of {totalOptions} still standing
                </div>
                <div className="turn-player">{currentPlayer}&rsquo;s turn</div>
              </div>
            </div>
            <div className="turn-controls">
              <div className="turn-progress" aria-hidden="true">
                <span className="turn-progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <button type="button" className="sound-toggle" onClick={onToggleMute} aria-pressed={!muted}>
                {muted ? <VolumeX size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
                <span className="sound-toggle-label">{muted ? 'Sound off' : 'Sound on'}</span>
              </button>
            </div>
          </div>

          <div className="prisoner-grid" role="group" aria-label="Living options" ref={gridRef}>
            {aliveOptions.map((option) => {
              const isSelected = selectedOptionId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  className="prisoner-card"
                  aria-pressed={isSelected}
                  onClick={() => unlessExecuting(onSelectOption)(option.id)}
                  style={{ '--prisoner-hue': prisonerHueFor(option.label) }}
                >
                  <span className="prisoner-portrait">
                    <PrisonerGlyph label={option.label} className="prisoner-glyph" />
                  </span>
                  {isSelected && <CrownArt className="prisoner-crown" aria-hidden="true" />}
                  <span className="prisoner-label">{option.label}</span>
                  <span className="prisoner-state">{isSelected ? 'Sentenced' : 'Awaiting judgment'}</span>
                </button>
              );
            })}
          </div>

          <section className="verdict-section" aria-labelledby="verdict-heading">
            <div className="verdict-head">
              <h2 className="verdict-heading" id="verdict-heading">
                The verdict
              </h2>
              <span className="verdict-hint">Why does it deserve the blade?</span>
            </div>
            <div className="verdict-row" role="group" aria-label="Verdict">
              {PRESET_VERDICTS.map((kind) => {
                const VerdictIcon = VERDICT_ICONS[kind];
                return (
                  <button
                    key={kind}
                    type="button"
                    className="verdict-chip"
                    aria-pressed={verdict === kind}
                    onClick={() => unlessExecuting(onSelectVerdict)(kind)}
                    disabled={!selectedOptionId}
                  >
                    <VerdictIcon className="verdict-chip-icon" aria-hidden="true" />
                    {VERDICT_LABELS[kind]}
                  </button>
                );
              })}
              <button
                type="button"
                className="verdict-chip"
                aria-pressed={verdict === 'other'}
                onClick={() => unlessExecuting(onSelectVerdict)('other')}
                disabled={!selectedOptionId}
              >
                <BatArt className="verdict-chip-icon" aria-hidden="true" />
                Other
              </button>
            </div>

            {verdict === 'other' && (
              <div className="verdict-other-field">
                <label className="field-label" htmlFor="other-verdict">
                  Your verdict
                </label>
                <input
                  id="other-verdict"
                  className="input"
                  value={otherVerdict}
                  onChange={(event) => unlessExecuting(onChangeOtherVerdict)(event.target.value.slice(0, MAX_VERDICT_LENGTH))}
                  maxLength={MAX_VERDICT_LENGTH}
                  placeholder="Too loud"
                />
                <span className="field-hint">
                  {otherVerdict.length}/{MAX_VERDICT_LENGTH} characters
                </span>
              </div>
            )}
          </section>

          <div className="action-row">
            <button
              type="button"
              className="button button-primary drop-blade"
              onClick={handleDropBlade}
              disabled={!canExecute || isExecuting}
            >
              <SwordArt className="drop-blade-icon" aria-hidden="true" />
              Drop the Blade
            </button>

            <button
              type="button"
              className="pardon-card"
              data-spent={state.pardonAvailable ? 'false' : 'true'}
              onClick={onPardon}
              disabled={!state.pardonAvailable || !selectedOptionId || isExecuting}
            >
              <ShieldArt className="pardon-card-icon" aria-hidden="true" />
              <span className="pardon-card-text">
                <span className="pardon-card-title">Royal Pardon</span>
                <span className="pardon-card-sub">{state.pardonAvailable ? 'One use · saves an option' : 'Already spent'}</span>
              </span>
            </button>
          </div>

          <p className="helper-text">
            <HelpCircle className="helper-text-icon" aria-hidden="true" />
            {helperMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
