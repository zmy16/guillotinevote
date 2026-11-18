import { Icon, addIcon } from '@iconify/react';
import { ICON_DATA } from '../iconData.js';

Object.entries(ICON_DATA).forEach(([name, data]) => addIcon(name, data));

export function GuillotineArt(props) {
  return <Icon icon="game-icons:guillotine" {...props} />;
}

export function ExecutionerHood(props) {
  return <Icon icon="game-icons:executioner-hood" {...props} />;
}

export function BallotGlyph(props) {
  return <Icon icon="mdi:ballot" {...props} />;
}

export function VoteGlyph(props) {
  return <Icon icon="mdi:vote" {...props} />;
}

export function GavelGlyph(props) {
  return <Icon icon="mdi:gavel" {...props} />;
}

export function ScalesGlyph(props) {
  return <Icon icon="game-icons:scales" {...props} />;
}

export function BalanceGlyph(props) {
  return <Icon icon="mdi:scale-balance" {...props} />;
}

export function PanelGlyph(props) {
  return <Icon icon="mdi:account-group" {...props} />;
}

export function RejectedGlyph(props) {
  return <Icon icon="mdi:close-octagon-outline" {...props} />;
}

export function UnshieldedGlyph(props) {
  return <Icon icon="mdi:shield-remove-outline" {...props} />;
}

export function AccusedGlyph(props) {
  return <Icon icon="mdi:sword-cross" {...props} />;
}

export function GraveyardArt(props) {
  return <Icon icon="game-icons:graveyard" {...props} />;
}

const GRAVE_FENCE_POSTS = Array.from({ length: 28 }, (_, index) => index * 13);
const MANOR_WINDOWS = [
  { x: 128, y: 196, h: 26, lit: true },
  { x: 160, y: 196, h: 26, lit: false },
  { x: 250, y: 196, h: 26, lit: true },
  { x: 272, y: 196, h: 26, lit: true },
  { x: 128, y: 240, h: 26, lit: true },
  { x: 272, y: 240, h: 26, lit: false },
  { x: 77, y: 136, h: 36, lit: true },
  { x: 77, y: 200, h: 26, lit: false },
  { x: 316, y: 236, h: 24, lit: true },
  { x: 350, y: 236, h: 24, lit: true },
  { x: 199, y: 68, h: 20, lit: true }
];

function windowPath({ x, y, h }) {
  return `M${x} ${y + h}V${y + 7}a7 7 0 0 1 14 0V${y + h}z`;
}

export function CemeteryArt(props) {
  return (
    <svg viewBox="0 0 520 220" fill="currentColor" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id="grave-ground" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#05010c" />
          <stop offset="0.72" stopColor="#05010c" />
          <stop offset="1" stopColor="#05010c" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="grave-mist">
          <stop offset="0" stopColor="#8b5cf6" stopOpacity="0.34" />
          <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="grave-halo">
          <stop offset="0" stopColor="#f59e0b" stopOpacity="0.42" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="grave-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <ellipse cx="250" cy="150" rx="270" ry="120" fill="url(#grave-mist)" />
      <path d="M0 220V186C90 172 200 170 300 176C400 182 470 190 520 200V220z" fill="url(#grave-ground)" />
      <circle cx="38" cy="112" r="64" fill="url(#grave-halo)" />
      <g opacity="0.5">
        <path d="M30 190v-26a11 11 0 0 1 22 0v26z" />
        <path d="M70 190v-34h5v34zM64 164h17v5H64z" />
        <path d="M110 190v-22l6-9 6 9v22z" />
        <path d="M330 188v-24a10 10 0 0 1 20 0v24z" />
        <path d="M372 188v-30h5v30zM366 166h17v5h-17z" />
        <path d="M420 190v-20a9 9 0 0 1 18 0v20z" />
      </g>
      <g transform="translate(-100 0)">
        <path d="M204 190v-72h104v72z" />
        <path d="M194 120L256 80l62 40z" />
        <path d="M196 116h120v6H196z" />
        <path d="M256 82V60M249 68h14" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M240 190v-40a16 16 0 0 1 32 0v40z" fill="url(#grave-glow)" opacity="0.8" className="grave-crypt-glow" />
        <path d="M256 134v56" stroke="currentColor" strokeWidth="2.5" />
        <path d="M194 120L256 80l62 40" fill="none" stroke="#8b6fd1" strokeOpacity="0.35" strokeWidth="1.5" />
      </g>
      <path d="M0 212v-40a20 20 0 0 1 40 0v40z" />
      <path d="M62 212V162M48 174h28" fill="none" stroke="currentColor" strokeWidth="6" transform="rotate(-10 62 212)" />
      <path d="M236 210v-40a16 16 0 0 1 32 0v40z" />
      <path d="M284 210v-52l8-14 8 14v52z" />
      <path d="M440 210V160M426 172h28" fill="none" stroke="currentColor" strokeWidth="6" />
      <path d="M470 208v-24a10 10 0 0 1 20 0v24z" />
      <g transform="translate(-355 0)">
        <path d="M390 214v-96h6v96z" />
        <path d="M378 98l15-12 15 12z" />
        <rect x="382" y="98" width="22" height="26" fill="#fbbf24" className="grave-lantern" />
        <path d="M393 98v26M382 111h22" stroke="currentColor" strokeWidth="2" />
      </g>
      <rect x="0" y="190" width="360" height="3" />
      <rect x="0" y="204" width="360" height="3" />
      {GRAVE_FENCE_POSTS.map((x) => (
        <path key={x} d={`M${x} 214V182l1.5-7 1.5 7V214z`} />
      ))}
      <path d="M356 214v-44h7v44z" />
    </svg>
  );
}

export function ManorArt(props) {
  return (
    <svg viewBox="0 0 420 360" fill="currentColor" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id="manor-ground" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#06020d" stopOpacity="0" />
          <stop offset="0.2" stopColor="#06020d" />
          <stop offset="0.8" stopColor="#06020d" />
          <stop offset="1" stopColor="#06020d" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="manor-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="0.6" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#c2410c" />
        </linearGradient>
        <radialGradient id="manor-halo">
          <stop offset="0" stopColor="#f59e0b" stopOpacity="0.3" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M-20 360V318C60 300 140 296 210 296C290 296 360 304 440 322V360z" fill="url(#manor-ground)" />
      <path d="M30 330C34 290 22 262 30 232C36 210 28 196 18 178M28 238C14 230 6 216-2 214M33 214C44 204 48 192 46 180M24 196C12 186 10 172 14 160" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M110 176h190v130H110z" />
      <path d="M92 182L205 90l113 92z" />
      <path d="M193 64h24v30h-24z" />
      <path d="M188 66L205 30l17 36z" />
      <path d="M205 30V12" stroke="currentColor" strokeWidth="2.5" />
      <path d="M258 92h30v6h-30zM262 98h22v52h-22z" />
      <path d="M52 120h64v186H52z" />
      <path d="M42 124L84 34l42 90z" />
      <path d="M84 34V12" stroke="currentColor" strokeWidth="2.5" />
      <path d="M48 168h72v6H48z" />
      <path d="M300 206h78v100h-78z" />
      <path d="M292 208l47-48 47 48z" />
      <path d="M170 262h70v44h-70z" />
      <path d="M162 264l43-26 43 26z" />
      {MANOR_WINDOWS.map((win) => (
        <circle key={`halo-${win.x}-${win.y}`} cx={win.x + 7} cy={win.y + win.h / 2} r="26" fill="url(#manor-halo)" opacity={win.lit ? 1 : 0} />
      ))}
      {MANOR_WINDOWS.map((win, index) => (
        <g key={`window-${win.x}-${win.y}`}>
          <path
            d={windowPath(win)}
            fill={win.lit ? 'url(#manor-glow)' : '#160a2c'}
            className={win.lit ? 'manor-window' : undefined}
            style={win.lit ? { animationDelay: `${-index * 0.7}s` } : undefined}
          />
          <path d={`M${win.x + 7} ${win.y}V${win.y + win.h}M${win.x} ${win.y + win.h * 0.55}H${win.x + 14}`} stroke="currentColor" strokeWidth="1.5" fill="none" />
        </g>
      ))}
      <circle cx="205" cy="142" r="10" fill="url(#manor-glow)" className="manor-window" style={{ animationDelay: '-2.1s' }} />
      <path d="M205 132v20M195 142h20" stroke="currentColor" strokeWidth="1.5" />
      <path d="M193 306v-24a12 12 0 0 1 24 0v24z" fill="url(#manor-glow)" opacity="0.55" className="manor-window" style={{ animationDelay: '-3.2s' }} />
      <g fill="none" stroke="#8b6fd1" strokeOpacity="0.35" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M92 182L205 90l113 92" />
        <path d="M42 124L84 34l42 90" />
        <path d="M188 66L205 30l17 36" />
        <path d="M292 208l47-48 47 48" />
      </g>
    </svg>
  );
}
export function TombstoneArt(props) {
  return <Icon icon="mdi:tombstone" {...props} />;
}

export function GhostArt(props) {
  return <Icon icon="game-icons:ghost" {...props} />;
}

export function CrownArt(props) {
  return <Icon icon="mdi:crown" {...props} />;
}

export function ShieldArt(props) {
  return <Icon icon="mdi:shield-half-full" {...props} />;
}

export function PumpkinArt(props) {
  return <Icon icon="game-icons:pumpkin" {...props} />;
}

export function CoffinArt(props) {
  return <Icon icon="game-icons:coffin" {...props} />;
}

export function BatArt(props) {
  return <Icon icon="game-icons:bat" {...props} />;
}

export function SwordArt(props) {
  return <Icon icon="game-icons:broadsword" {...props} />;
}

export function SkullArt(props) {
  return <Icon icon="game-icons:death-skull" {...props} />;
}

export function CandleArt(props) {
  return <Icon icon="game-icons:candle-flame" {...props} />;
}

export function MoonWaning(props) {
  return <Icon icon="mdi:moon-waning-crescent" {...props} />;
}

export function CoinArt(props) {
  return <Icon icon="mdi:cash-multiple" {...props} />;
}

export function MapArt(props) {
  return <Icon icon="mdi:map-marker-off" {...props} />;
}

export function SleepArt(props) {
  return <Icon icon="mdi:sleep" {...props} />;
}

export function BoredArt(props) {
  return <Icon icon="mdi:emoticon-neutral-outline" {...props} />;
}

export function Sparkle(props) {
  return <Icon icon="mdi:star-four-points" {...props} />;
}

export function JackOLanternArt(props) {
  return (
    <svg viewBox="0 0 120 104" aria-hidden="true" {...props}>
      <defs>
        <radialGradient id="jack-skin" cx="50%" cy="55%" r="62%">
          <stop offset="0" stopColor="#b9410f" />
          <stop offset="0.7" stopColor="#7a2a0d" />
          <stop offset="1" stopColor="#2e0f06" />
        </radialGradient>
        <linearGradient id="jack-flame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fef3c7" />
          <stop offset="0.5" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <path d="M54 16c0-8 4-13 13-14l3 7c-5 1-7 4-6 9z" fill="#34401a" />
      <ellipse cx="36" cy="64" rx="27" ry="34" fill="url(#jack-skin)" />
      <ellipse cx="84" cy="64" rx="27" ry="34" fill="url(#jack-skin)" />
      <ellipse cx="60" cy="62" rx="34" ry="38" fill="url(#jack-skin)" />
      <path d="M46 28c-10 18-10 52 0 70M74 28c10 18 10 52 0 70" fill="none" stroke="#2e0f06" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" />
      <g className="jack-face" fill="url(#jack-flame)">
        <path d="M33 52l17 6-12 11z" />
        <path d="M87 52l-17 6 12 11z" />
        <path d="M60 64l-6 10h12z" />
        <path d="M30 80l9-4 6 8 8-7 7 8 7-8 8 7 6-8 9 4C86 91 72 96 60 96S34 91 30 80z" />
      </g>
    </svg>
  );
}

export function SpiderArt(props) {
  return (
    <svg viewBox="0 0 40 170" aria-hidden="true" {...props}>
      <line x1="20" y1="0" x2="20" y2="134" stroke="#8b6fd1" strokeOpacity="0.55" strokeWidth="0.8" />
      <g fill="none" stroke="#8b6fd1" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 138L5 130L2 138M13 142L3 140L1 150M13 147L4 150L3 160M15 151L8 158L8 168" />
        <path d="M26 138L35 130L38 138M27 142L37 140L39 150M27 147L36 150L37 160M25 151L32 158L32 168" />
      </g>
      <ellipse cx="20" cy="148" rx="8" ry="10" fill="#1b0f2e" stroke="#8b6fd1" strokeWidth="1.2" />
      <circle cx="20" cy="135" r="5" fill="#1b0f2e" stroke="#8b6fd1" strokeWidth="1.2" />
      <circle cx="18" cy="134" r="1" fill="#f97316" />
      <circle cx="22" cy="134" r="1" fill="#f97316" />
    </svg>
  );
}

export const VERDICT_ICONS = {
  too_expensive: CoinArt,
  too_far: MapArt,
  boring: BoredArt,
  not_today: SleepArt
};
