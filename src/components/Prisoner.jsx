import {
  GuillotineArt,
  BallotGlyph,
  VoteGlyph,
  GavelGlyph,
  ScalesGlyph,
  BalanceGlyph,
  PanelGlyph,
  RejectedGlyph,
  UnshieldedGlyph,
  AccusedGlyph
} from './Icons.jsx';

const PRISONER_GLYPHS = [
  BallotGlyph,
  VoteGlyph,
  GavelGlyph,
  ScalesGlyph,
  AccusedGlyph,
  BalanceGlyph,
  PanelGlyph,
  RejectedGlyph,
  UnshieldedGlyph,
  GuillotineArt
];

const PRISONER_HUES = [268, 24, 340, 190, 48, 288, 12, 212, 320, 156];

function hashLabel(label) {
  let hash = 0;
  for (let index = 0; index < label.length; index += 1) {
    hash = (hash * 31 + label.charCodeAt(index)) % 997;
  }
  return hash;
}

export function prisonerGlyphFor(label) {
  return PRISONER_GLYPHS[hashLabel(label) % PRISONER_GLYPHS.length];
}

export function prisonerHueFor(label) {
  return PRISONER_HUES[hashLabel(label) % PRISONER_HUES.length];
}

export function PrisonerGlyph({ label, className }) {
  const Glyph = prisonerGlyphFor(label);
  return <Glyph className={className} aria-hidden="true" />;
}

export function GuillotineRig({ bladeRef }) {
  return (
    <svg className="guillotine-rig" viewBox="0 0 240 176" aria-hidden="true" fill="none">
      <defs>
        <linearGradient id="rigWood" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="176">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="55%" stopColor="#7c5bb8" />
          <stop offset="100%" stopColor="#4a3579" />
        </linearGradient>
        <linearGradient id="rigBlade" gradientUnits="userSpaceOnUse" x1="88" y1="26" x2="152" y2="88">
          <stop offset="0%" stopColor="#e7e5e4" />
          <stop offset="34%" stopColor="#a8a29e" />
          <stop offset="72%" stopColor="#57534e" />
          <stop offset="100%" stopColor="#292524" />
        </linearGradient>
        <linearGradient id="rigCap" gradientUnits="userSpaceOnUse" x1="88" y1="24" x2="152" y2="42">
          <stop offset="0%" stopColor="#5b21b6" />
          <stop offset="100%" stopColor="#2e1065" />
        </linearGradient>
        <linearGradient id="rigEdge" gradientUnits="userSpaceOnUse" x1="90" y1="84" x2="150" y2="68">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <radialGradient id="rigFlash">
          <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#fbbf24" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rigDust">
          <stop offset="0%" stopColor="#d6d3d1" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#d6d3d1" stopOpacity="0" />
        </radialGradient>
        <filter id="rigSoft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>

      <path d="M44 18v134" stroke="url(#rigWood)" strokeWidth="9" strokeLinecap="round" />
      <path d="M196 18v134" stroke="url(#rigWood)" strokeWidth="9" strokeLinecap="round" />
      <path d="M41 30h6M193 30h6M41 44h6M193 44h6M41 58h6M193 58h6" stroke="#2e1065" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M44 148h-10M196 148h10" stroke="#6d28d9" strokeWidth="6" strokeLinecap="round" />

      <g ref={bladeRef} className="rig-blade">
        <g className="rig-speed" opacity="0">
          <path d="M100 22V-6M120 22V-10M140 22V-4" stroke="#e9d5ff" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
        </g>
        <path className="rig-edge-glow" d="M90 84 150 68" stroke="#fff7ed" strokeWidth="5" strokeLinecap="round" opacity="0" filter="url(#rigSoft)" />
        <path d="M90 26h60v42L90 84z" fill="url(#rigBlade)" />
        <path d="M90 26h60v10H90z" fill="url(#rigCap)" />
        <path d="M90 36h60" stroke="#1e1b4b" strokeWidth="1.4" opacity="0.7" />
        <path d="M96 42v30M120 40v32M144 42v28" stroke="#f5f5f4" strokeWidth="0.9" opacity="0.22" />
        <path d="M90 26h60" stroke="#e0e7ff" strokeWidth="1.2" opacity="0.8" />
        <path d="M90 84 150 68" stroke="url(#rigEdge)" strokeWidth="3" strokeLinecap="round" />
        <path d="M92 30v54" stroke="#fffbeb" strokeWidth="1" opacity="0.28" />
        <circle cx="100" cy="31" r="2" fill="#1c1917" />
        <circle cx="140" cy="31" r="2" fill="#1c1917" />
      </g>

      <path d="M48 34h144" stroke="#4c1d95" strokeWidth="4" strokeLinecap="round" />
      <path d="M48 34h144" stroke="#c4b5fd" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />

      <path d="M30 14h180" stroke="url(#rigWood)" strokeWidth="11" strokeLinecap="round" />
      <path d="M30 10h180" stroke="#c4b5fd" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <circle cx="30" cy="14" r="7.5" fill="#8b5cf6" />
      <circle cx="210" cy="14" r="7.5" fill="#8b5cf6" />
      <circle cx="30" cy="14" r="3" fill="#2a1b4d" />
      <circle cx="210" cy="14" r="3" fill="#2a1b4d" />

      <circle cx="120" cy="14" r="4" fill="#fbbf24" />
      <line className="rig-rope" x1="120" y1="19" x2="120" y2="27" stroke="#d6d3d1" strokeWidth="2" strokeLinecap="round" />

      <rect x="72" y="140" width="96" height="13" rx="5" fill="url(#rigWood)" />
      <rect x="72" y="140" width="96" height="4" rx="2" fill="#c4b5fd" opacity="0.3" />
      <path d="M86 151h68" stroke="#dc2626" strokeWidth="2.4" strokeLinecap="round" opacity="0.75" />

      <ellipse className="rig-shadow" cx="120" cy="139" rx="20" ry="2.4" fill="#000" opacity="0" />
      <g className="rig-sparks" opacity="0">
        {[-164, -132, -104, -76, -48, -16].map((deg) => (
          <line
            key={`spark-${deg}`}
            className="rig-spark"
            x1="120"
            y1="145"
            x2={120 + Math.cos((deg * Math.PI) / 180) * 26}
            y2={145 + Math.sin((deg * Math.PI) / 180) * 26}
            stroke="#fef9c3"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        ))}
      </g>
      <g className="rig-dust" opacity="0" filter="url(#rigSoft)">
        <ellipse className="rig-dust-puff" cx="96" cy="146" rx="14" ry="5" fill="url(#rigDust)" />
        <ellipse className="rig-dust-puff" cx="144" cy="146" rx="16" ry="5.5" fill="url(#rigDust)" />
        <ellipse className="rig-dust-puff" cx="120" cy="142" rx="20" ry="6" fill="url(#rigDust)" />
      </g>
      <g className="rig-debris" opacity="0">
        {[76, 92, 108, 124, 140, 156].map((x, i) => (
          <rect key={`debris-${x}`} className="rig-debris-bit" x={x} y="145" width={2 + (i % 2)} height="2.4" rx="0.6" fill="#8b5cf6" />
        ))}
      </g>
      <g className="rig-drops" opacity="0">
        {[88, 96, 104, 112, 120, 128, 136, 144, 152].map((x, i) => (
          <circle key={`drop-${x}`} className="rig-drop" cx={x} cy={147 + (i % 3) * 1.2} r={1.2 + (i % 3) * 0.45} fill="#b91c1c" />
        ))}
      </g>
      <circle className="rig-flash" cx="120" cy="140" r="22" fill="url(#rigFlash)" opacity="0" />
    </svg>
  );
}
