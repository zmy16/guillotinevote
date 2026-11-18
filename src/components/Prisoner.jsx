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

export const JAW_OPEN_OFFSET = 4;

const PRISONER_HUES = [268, 24, 340, 190, 48, 288, 12, 212, 320, 156];

function hashLabel(label) {
  let hash = 0;
  for (let index = 0; index < label.length; index += 1) {
    hash = (hash * 31 + label.charCodeAt(index)) % 997;
  }
  return hash;
}

function prisonerGlyphFor(label) {
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
    <svg className="guillotine-rig" viewBox="44 0 152 170" aria-hidden="true" fill="none">
      <defs>
        <linearGradient id="rigOak" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7b573a" />
          <stop offset="35%" stopColor="#5a3d27" />
          <stop offset="100%" stopColor="#2a1d14" />
        </linearGradient>
        <linearGradient id="rigOakBeam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b4b32" />
          <stop offset="100%" stopColor="#2a1d14" />
        </linearGradient>
        <linearGradient id="rigStone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b645f" />
          <stop offset="100%" stopColor="#2e2a27" />
        </linearGradient>
        <linearGradient id="rigLeather" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a553a" />
          <stop offset="100%" stopColor="#33200f" />
        </linearGradient>
        <linearGradient id="rigIron" gradientUnits="userSpaceOnUse" x1="90" y1="36" x2="150" y2="84">
          <stop offset="0%" stopColor="#57534e" />
          <stop offset="55%" stopColor="#2c2825" />
          <stop offset="100%" stopColor="#14110f" />
        </linearGradient>
        <linearGradient id="rigBevel" gradientUnits="userSpaceOnUse" x1="90" y1="84" x2="150" y2="68">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#e7e5e4" />
          <stop offset="100%" stopColor="#a8a29e" />
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
        <g id="rigPost">
          <rect x="72" y="26" width="12" height="108" fill="url(#rigOak)" />
          <rect x="72" y="26" width="1.6" height="108" fill="#c4b5fd" opacity="0.28" />
          <rect x="68" y="20" width="20" height="8" rx="1.5" fill="url(#rigOak)" />
          <rect x="70" y="30" width="16" height="2.4" rx="1" fill="#1a110b" />
          <rect x="70" y="35" width="16" height="2.4" rx="1" fill="#1a110b" />
          <rect x="70" y="124" width="16" height="2.4" rx="1" fill="#1a110b" />
          <path d="M72 134h12l4 8H68z" fill="url(#rigOak)" />
          <rect x="64" y="142" width="28" height="8" rx="1" fill="url(#rigStone)" />
          <rect x="60" y="150" width="36" height="8" rx="1" fill="url(#rigStone)" />
          <path d="M64 150h28" stroke="#0d0817" strokeWidth="1" opacity="0.55" />
        </g>
      </defs>

      <rect x="52" y="158" width="136" height="8" rx="1" fill="url(#rigOakBeam)" />
      <rect x="52" y="158" width="136" height="1.4" fill="#c4b5fd" opacity="0.3" />

      <use href="#rigPost" />
      <use href="#rigPost" x="84" />
      <rect x="84" y="28" width="4" height="106" fill="#150d08" />
      <rect x="152" y="28" width="4" height="106" fill="#150d08" />

      <g ref={bladeRef} className="rig-blade">
        <g className="rig-speed" opacity="0">
          <path d="M100 22V-6M120 22V-10M140 22V-4" stroke="#e9d5ff" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
        </g>
        <path className="rig-edge-glow" d="M90 84 150 68" stroke="#fff7ed" strokeWidth="5" strokeLinecap="round" opacity="0" filter="url(#rigSoft)" />
        <path d="M90 36h60v32L90 84z" fill="url(#rigIron)" />
        <path d="M90 84 150 68v-5.5L90 78.5z" fill="url(#rigBevel)" />
        <path d="M90 84 150 68" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M94 40v34M120 40v26M146 40v20" stroke="#f5f5f4" strokeWidth="0.9" opacity="0.14" />
        <rect x="90" y="26" width="60" height="12" rx="1.5" fill="url(#rigLeather)" />
        <path d="M92 32h56" stroke="#e8c9a0" strokeWidth="0.9" strokeDasharray="2.4 2" opacity="0.5" />
        <path d="M90 26h60" stroke="#e0b98a" strokeWidth="1" opacity="0.45" />
        <circle cx="100" cy="32" r="2.2" fill="#292524" />
        <circle cx="140" cy="32" r="2.2" fill="#292524" />
        <circle cx="99.4" cy="31.4" r="0.7" fill="#a8a29e" />
        <circle cx="139.4" cy="31.4" r="0.7" fill="#a8a29e" />
      </g>

      <rect x="56" y="6" width="128" height="4" fill="#8a6444" />
      <rect x="54" y="10" width="132" height="11" fill="url(#rigOakBeam)" />
      <rect x="54" y="10" width="5" height="11" fill="#1a110b" opacity="0.6" />
      <rect x="181" y="10" width="5" height="11" fill="#1a110b" opacity="0.6" />
      <path d="M56.5 12.4a2.4 3.1 0 0 1 0 6.2M183.5 12.4a2.4 3.1 0 0 0 0 6.2" stroke="#6b4b32" strokeWidth="0.8" />
      <path d="M59 10.8h122" stroke="#c4b5fd" strokeWidth="1" opacity="0.35" />
      <circle cx="68" cy="15.5" r="2.6" fill="#3f3f46" />
      <circle cx="172" cy="15.5" r="2.6" fill="#3f3f46" />
      <circle cx="67.3" cy="14.8" r="0.9" fill="#a1a1aa" />
      <circle cx="171.3" cy="14.8" r="0.9" fill="#a1a1aa" />

      <circle cx="120" cy="15" r="4.5" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
      <line className="rig-rope" x1="120" y1="19" x2="120" y2="27" stroke="#d6d3d1" strokeWidth="2" strokeLinecap="round" />

      <g className="rig-jaw" transform={`translate(${-JAW_OPEN_OFFSET} 0)`}>
        <path d="M90 144q0-4 4-4H112A8 8 0 0 0 120 148V158H94q-4 0-4-4z" fill="url(#rigOakBeam)" />
        <path d="M94 140.8H112" stroke="#c4b5fd" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
        <path d="M112 140A8 8 0 0 0 120 148V158" stroke="#120a08" strokeWidth="1.2" />
      </g>
      <g className="rig-jaw" transform={`translate(${JAW_OPEN_OFFSET} 0)`}>
        <path d="M150 144q0-4-4-4H128A8 8 0 0 1 120 148V158H146q4 0 4-4z" fill="url(#rigOakBeam)" />
        <path d="M128 140.8H146" stroke="#c4b5fd" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
        <path d="M128 140A8 8 0 0 1 120 148V158" stroke="#120a08" strokeWidth="1.2" />
      </g>
      <rect className="rig-stain" x="117.5" y="148" width="5" height="10" rx="2" fill="#991b1b" opacity="0" />

      <ellipse className="rig-shadow" cx="120" cy="140" rx="20" ry="2.4" fill="#000" opacity="0" />
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
        <ellipse className="rig-dust-puff" cx="100" cy="146" rx="14" ry="5" fill="url(#rigDust)" />
        <ellipse className="rig-dust-puff" cx="140" cy="146" rx="16" ry="5.5" fill="url(#rigDust)" />
        <ellipse className="rig-dust-puff" cx="120" cy="142" rx="20" ry="6" fill="url(#rigDust)" />
      </g>
      <g className="rig-debris" opacity="0">
        {[94, 104, 112, 128, 136, 146].map((x, i) => (
          <rect key={`debris-${x}`} className="rig-debris-bit" x={x} y="145" width={2 + (i % 2)} height="2.4" rx="0.6" fill="#6b4b32" />
        ))}
      </g>
      <g className="rig-drops" opacity="0">
        {[108, 112, 116, 120, 124, 128, 132].map((x, i) => (
          <circle key={`drop-${x}`} className="rig-drop" cx={x} cy={147 + (i % 3) * 1.2} r={1.2 + (i % 3) * 0.45} fill="#b91c1c" />
        ))}
      </g>
      <circle className="rig-flash" cx="120" cy="140" r="22" fill="url(#rigFlash)" opacity="0" />
    </svg>
  );
}
