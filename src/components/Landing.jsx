import { GuillotineMark } from './HalloweenBackdrop.jsx';
import { PRESETS } from '../presets.js';
import { PumpkinArt, CoffinArt, SwordArt, ExecutionerHood, TombstoneArt, GhostArt, BatArt, Sparkle } from './Icons.jsx';

const PRESET_ICONS = {
  dinner: CoffinArt,
  movie: PumpkinArt,
  hangout: GhostArt,
  campus: SwordArt
};


export function Landing({ onChoosePreset, onStartCustom, onStartSample, onOpenHistory, onOpenFaq }) {
  return (
    <>
      <div className="page page-wide">
        <div className="landing-nav">
          <div className="brand">
            <GuillotineMark className="brand-mark" />
            GuillotineVote
          </div>
          <nav className="nav-links" aria-label="Court pages">
            <button type="button" className="nav-link" onClick={onOpenHistory}>
              <TombstoneArt className="nav-link-icon" aria-hidden="true" />
              Match history
            </button>
            <button type="button" className="nav-link" onClick={onOpenFaq}>
              <BatArt className="nav-link-icon" aria-hidden="true" />
              FAQ
            </button>
          </nav>
        </div>

        <header className="hero">
          <p className="hero-eyebrow">
            <ExecutionerHood className="hero-eyebrow-icon" />
            A reverse vote for people who cannot agree
          </p>
          <h1>
            Vote for what you <em>hate</em>, not what you love.
          </h1>
          <p className="hero-lede">
            Every option goes on the chopping block. Players take turns executing the one they least want, with a
            verdict, until a single survivor holds the decree.
          </p>
          <p className="hero-rules">
            Pick a docket, gather 2&ndash;8 players, then drop the blade 3&ndash;12 options down to one. One Royal Pardon
            per game. No accounts, no backend, no ties.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">4</span>
              <span className="hero-stat-label">ready courts</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">1</span>
              <span className="hero-stat-label">royal pardon</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">0</span>
              <span className="hero-stat-label">ties possible</span>
            </div>
          </div>
        </header>

        <section className="section" aria-labelledby="preset-heading">
          <h2 className="section-heading" id="preset-heading">
            Choose your trial
          </h2>
          <p className="section-sub">Four ready-made courts. One tap and the prisoners line up.</p>
          <div className="preset-grid">
            {PRESETS.map((preset) => {
              const PresetIcon = PRESET_ICONS[preset.id] || CoffinArt;
              return (
                <button key={preset.id} type="button" className="preset-card" onClick={() => onChoosePreset(preset)}>
                  <PresetIcon className="preset-card-icon" aria-hidden="true" />
                  <span className="preset-card-title">{preset.name}</span>
                  <span className="preset-card-description">{preset.description}</span>
                  <span className="preset-card-count">
                    {preset.options.length}
                    {' '}
                    accused
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="section" aria-labelledby="custom-heading">
          <h2 className="section-heading" id="custom-heading">
            Or write your own docket
          </h2>
          <p className="section-sub">Name the game, add two to eight players, and line up three to twelve options.</p>
          <div className="form-actions">
            <button type="button" className="button button-primary" onClick={onStartCustom}>
              <SwordArt className="drop-blade-icon" aria-hidden="true" />
              Set up a custom game
            </button>
            <button type="button" className="button button-ghost" onClick={onStartSample}>
              <TombstoneArt className="drop-blade-icon" aria-hidden="true" />
              Try a sample round
            </button>
          </div>
        </section>

        <section className="section" aria-labelledby="about-heading">
          <h2 className="section-heading" id="about-heading">
            How the court runs
          </h2>
          <div className="rules-grid">
            <article className="rule-card">
              <span className="rule-number">01</span>
              <h3 className="rule-title">Accuse an option</h3>
              <p className="rule-body">Each player selects one living prisoner and chooses a verdict before the blade falls.</p>
              <BatArt className="rule-icon" aria-hidden="true" />
            </article>
            <article className="rule-card">
              <span className="rule-number">02</span>
              <h3 className="rule-title">Pass the device</h3>
              <p className="rule-body">Turns cycle through everyone. The Graveyard records who judged what, and why.</p>
              <Sparkle className="rule-icon" aria-hidden="true" />
            </article>
            <article className="rule-card">
              <span className="rule-number">03</span>
              <h3 className="rule-title">Crown the survivor</h3>
              <p className="rule-body">When one option remains, it gets the decree. Share the result with a single link.</p>
              <TombstoneArt className="rule-icon" aria-hidden="true" />
            </article>
          </div>
        </section>
      </div>
    </>
  );
}
