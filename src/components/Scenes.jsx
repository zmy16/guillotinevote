import { CemeteryArt, ManorArt, JackOLanternArt, GhostArt } from './Icons.jsx';

const PUMPKIN_CLASSES = ['pumpkin-a', 'pumpkin-b', 'pumpkin-c'];
const FIREFLY_COUNT = 14;
const SCENE_WIDTH = 1440;

function rand(index, salt) {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function Ground() {
  return <div className="backdrop-ground" />;
}

function Fog() {
  return (
    <div className="backdrop-fog">
      <span className="fog-a" />
      <span className="fog-b" />
      <span className="fog-c" />
    </div>
  );
}

function Hills() {
  return (
    <svg className="backdrop-hills" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path fill="#0d0817" d="M0 196c120-58 232-70 344-36s214 96 330 82 214-96 330-104 214 40 436 88v94H0z" />
      <path fill="#08040f" d="M0 244c140-46 258-42 372-10s226 74 348 58 236-84 358-70 210 56 362 96v2H0z" opacity="0.92" />
    </svg>
  );
}

const FAR_TREE_PATH = Array.from({ length: 36 }, (_, index) => {
  const x = index * 41 + (index % 3) * 6;
  const height = 70 + ((index * 37) % 5) * 18;
  return `M${x} 200L${x + 14} ${200 - height}L${x + 28} 200z`;
}).join('');

function FarTrees() {
  return (
    <svg className="backdrop-far" viewBox="0 0 1440 200" preserveAspectRatio="xMidYMax slice">
      <path fill="#1a0f33" d={FAR_TREE_PATH} />
    </svg>
  );
}

function ManorSkyline() {
  return (
    <div className="backdrop-skyline">
      <div className="backdrop-houselight" />
      <CemeteryArt className="sky-piece sky-graveyard" />
      <ManorArt className="sky-piece sky-manor" />
    </div>
  );
}

function Pumpkins() {
  return (
    <div className="backdrop-foreground">
      {PUMPKIN_CLASSES.map((pumpkinClass) => (
        <span key={pumpkinClass} className={`sky-pumpkin ${pumpkinClass}`}>
          <span className="pumpkin-halo" />
          <JackOLanternArt className="pumpkin-art" />
        </span>
      ))}
    </div>
  );
}

function ManorScene() {
  return (
    <>
      <Ground />
      <FarTrees />
      <Hills />
      <ManorSkyline />
      <Fog />
      <Pumpkins />
    </>
  );
}

function DawnScene() {
  return (
    <>
      <div className="dawn-rays" />
      <div className="dawn-glow" />
      <ManorScene />
    </>
  );
}

function stonePath(kind, x, base, width, height) {
  const half = width / 2;
  if (kind === 0) {
    return `M${x} ${base}v${-(height - half)}a${half} ${half} 0 0 1 ${width} 0v${height - half}z`;
  }
  if (kind === 1) {
    return `M${x + half - 4} ${base}V${base - height}h8V${base}zM${x} ${base - height * 0.7}h${width}v8h${-width}z`;
  }
  if (kind === 2) {
    return `M${x + 4} ${base}L${x + half - 3} ${base - height}h6L${x + width - 4} ${base}z`;
  }
  return `M${x} ${base}V${base - height}h${width}V${base}z`;
}

function stoneRow({ count, base, minWidth, maxWidth, minHeight, maxHeight, salt }) {
  const step = SCENE_WIDTH / count;
  return Array.from({ length: count }, (_, index) => {
    const width = minWidth + rand(index, salt) * (maxWidth - minWidth);
    const height = minHeight + rand(index, salt + 1) * (maxHeight - minHeight);
    const kind = Math.floor(rand(index, salt + 2) * 4);
    const x = index * step + rand(index, salt + 3) * step * 0.5;
    return stonePath(kind, x, base, width, height);
  }).join('');
}

const BACK_STONES = stoneRow({ count: 26, base: 450, minWidth: 22, maxWidth: 34, minHeight: 46, maxHeight: 84, salt: 1 });
const MID_STONES = stoneRow({ count: 17, base: 500, minWidth: 30, maxWidth: 46, minHeight: 70, maxHeight: 120, salt: 11 });
const FRONT_STONES = stoneRow({ count: 9, base: 556, minWidth: 56, maxWidth: 84, minHeight: 120, maxHeight: 190, salt: 21 });
const FENCE_POSTS = Array.from({ length: 66 }, (_, index) => `M${index * 22} 580V540l3-9 3 9V580z`).join('');

function CryptScene() {
  return (
    <>
      <Ground />
      <Hills />
      <div className="backdrop-skyline">
        <svg className="scene-art crypt-art" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice" fill="currentColor">
          <defs>
            <radialGradient id="crypt-glow" cx="50%" cy="80%" r="60%">
              <stop offset="0" stopColor="#e0e7ff" />
              <stop offset="0.5" stopColor="#8b5cf6" />
              <stop offset="1" stopColor="#4c1d95" />
            </radialGradient>
            <radialGradient id="crypt-spill" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#a78bfa" stopOpacity="0.45" />
              <stop offset="1" stopColor="#a78bfa" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path d="M0 600V520C300 490 600 498 720 504C900 512 1200 488 1440 508V600z" fill="#070313" />
          <ellipse cx="720" cy="470" rx="300" ry="120" fill="url(#crypt-spill)" className="crypt-spill" />
          <path d={BACK_STONES} fill="#1b1136" opacity="0.8" />
          <g>
            <path d="M588 520h264v16H588zM606 504h228v16H606z" fill="#0b0618" />
            <path d="M628 504V376h184V504z" fill="#0b0618" />
            <path d="M606 380 720 306l114 74z" fill="#0b0618" />
            <path d="M612 372h216v10H612z" fill="#0b0618" />
            <path d="M720 306V270M709 282h22" stroke="#0b0618" strokeWidth="5" fill="none" />
            <path d="M606 380 720 306l114 74" fill="none" stroke="#8b6fd1" strokeOpacity="0.35" strokeWidth="2" />
            <path d="M686 504V448a34 34 0 0 1 68 0V504z" fill="url(#crypt-glow)" className="crypt-door" />
            <path d="M720 414V504M686 462h68" stroke="#0b0618" strokeWidth="3" />
            <path d="M648 392h14v112h-14zM778 392h14v112h-14z" fill="#150c2c" />
          </g>
          <path d={MID_STONES} fill="#0e0820" />
          <path d="M70 580C74 520 58 480 70 440C78 412 66 392 50 370M68 490C46 482 30 460 18 456M72 430C92 416 100 396 98 376" fill="none" stroke="#050210" strokeWidth="9" strokeLinecap="round" />
          <path d="M1370 580C1366 520 1382 480 1370 440C1362 412 1374 392 1390 370M1372 490C1394 482 1410 460 1422 456M1368 430C1348 416 1340 396 1342 376" fill="none" stroke="#050210" strokeWidth="9" strokeLinecap="round" />
          <path d={FRONT_STONES} fill="#050210" />
          <path d={FENCE_POSTS} fill="#050210" />
          <rect x="0" y="552" width="1440" height="5" fill="#050210" />
          <rect x="0" y="570" width="1440" height="5" fill="#050210" />
        </svg>
        <GhostArt className="crypt-ghost ghost-a" />
        <GhostArt className="crypt-ghost ghost-b" />
        <GhostArt className="crypt-ghost ghost-c" />
      </div>
      <Fog />
    </>
  );
}

function pinePath(x, base, height, width) {
  let path = '';
  for (let tier = 0; tier < 4; tier += 1) {
    const top = base - height + tier * height * 0.2;
    const bottom = top + height * 0.42;
    const half = (width * (0.45 + tier * 0.18)) / 2;
    path += `M${x} ${top}L${x + half} ${bottom}L${x - half} ${bottom}z`;
  }
  return path;
}

function pineRow({ xs, base, minHeight, maxHeight, width, salt }) {
  return xs
    .map((x, index) =>
      pinePath(x, base, minHeight + rand(index, salt) * (maxHeight - minHeight), width * (0.8 + rand(index, salt + 1) * 0.4))
    )
    .join('');
}

const BACK_PINES = pineRow({
  xs: Array.from({ length: 30 }, (_, index) => index * 50 + rand(index, 41) * 20),
  base: 600,
  minHeight: 220,
  maxHeight: 340,
  width: 90,
  salt: 42
});
const MID_PINES = pineRow({
  xs: Array.from({ length: 19 }, (_, index) => index * 80 + rand(index, 51) * 30).filter((x) => x < 520 || x > 920),
  base: 600,
  minHeight: 300,
  maxHeight: 440,
  width: 110,
  salt: 52
});
const FRONT_PINES = pineRow({
  xs: [-10, 70, 150, 230, 1210, 1290, 1370, 1450],
  base: 600,
  minHeight: 460,
  maxHeight: 570,
  width: 170,
  salt: 62
});
const EYE_PAIRS = [
  { x: 610, y: 470 },
  { x: 790, y: 505 },
  { x: 300, y: 430 },
  { x: 1150, y: 450 },
  { x: 480, y: 520 }
];

function Fireflies() {
  return (
    <div className="backdrop-fireflies">
      {Array.from({ length: FIREFLY_COUNT }).map((_, index) => (
        <span
          key={`firefly-${index}`}
          style={{
            left: `${5 + rand(index, 5) * 90}%`,
            top: `${30 + rand(index, 6) * 55}%`,
            '--firefly-delay': `-${rand(index, 7) * 9}s`,
            '--firefly-duration': `${8 + rand(index, 8) * 8}s`,
            '--firefly-dx': `${(rand(index, 9) - 0.5) * 14}vw`,
            '--firefly-dy': `${(rand(index, 10) - 0.5) * 10}vh`
          }}
        />
      ))}
    </div>
  );
}

function ForestScene() {
  return (
    <>
      <Ground />
      <svg className="backdrop-hills scene-pines pines-back" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice">
        <path d={BACK_PINES} fill="#150b2e" />
      </svg>
      <div className="backdrop-skyline">
        <svg className="scene-art forest-art" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice">
          <path d={MID_PINES} fill="#0c0620" />
          {EYE_PAIRS.map((eyes, index) => (
            <g key={`eyes-${eyes.x}`} className="forest-eyes" style={{ animationDelay: `${-index * 1.7}s` }}>
              <circle cx={eyes.x} cy={eyes.y} r="9" fill="#f59e0b" opacity="0.18" />
              <circle cx={eyes.x + 18} cy={eyes.y} r="9" fill="#f59e0b" opacity="0.18" />
              <ellipse cx={eyes.x} cy={eyes.y} rx="4" ry="2.6" fill="#fbbf24" />
              <ellipse cx={eyes.x + 18} cy={eyes.y} rx="4" ry="2.6" fill="#fbbf24" />
            </g>
          ))}
        </svg>
      </div>
      <Fog />
      <Fireflies />
      <div className="backdrop-foreground">
        <svg className="scene-art forest-front" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice">
          <path d={FRONT_PINES} fill="#050210" />
        </svg>
      </div>
    </>
  );
}

const TORCH_SIDES = ['torch-left', 'torch-right'];
const LEFT_CHAIN_LINKS = 9;
const RIGHT_CHAIN_LINKS = 13;

function Torch({ side }) {
  return (
    <div className={`dungeon-torch ${side}`}>
      <div className="torch-halo" />
      <svg viewBox="0 0 60 170" className="torch-art">
        <defs>
          <linearGradient id={`flame-${side}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#dc2626" />
            <stop offset="0.45" stopColor="#f59e0b" />
            <stop offset="1" stopColor="#fef3c7" />
          </linearGradient>
        </defs>
        <rect x="26" y="66" width="8" height="96" rx="2" fill="#3b2412" />
        <path d="M18 62h24l-4 16H22z" fill="#2a2a33" />
        <path d="M30 6C45 28 50 46 30 66C10 46 15 28 30 6z" fill={`url(#flame-${side})`} className="torch-flame" />
        <path d="M30 30C38 42 38 52 30 62C22 52 22 42 30 30z" fill="#fff7d6" opacity="0.85" className="torch-flame" />
      </svg>
    </div>
  );
}

function Chain({ links, className }) {
  return (
    <svg className={`dungeon-chain ${className}`} viewBox={`0 0 24 ${links * 20 + 30}`} fill="none" stroke="#6b6477" strokeWidth="2.5">
      {Array.from({ length: links }).map((_, index) => (
        <ellipse key={`link-${index}`} cx="12" cy={12 + index * 20} rx={index % 2 === 0 ? 6 : 2.6} ry="10" />
      ))}
      <circle cx="12" cy={links * 20 + 14} r="9" strokeWidth="4" />
    </svg>
  );
}

function DungeonScene() {
  return (
    <>
      <svg className="dungeon-bricks" width="100%" height="100%">
        <defs>
          <pattern id="brick-pattern" width="160" height="96" patternUnits="userSpaceOnUse">
            <rect width="160" height="96" fill="#0a0612" />
            <g fill="#1b1328">
              <rect x="2" y="2" width="76" height="42" />
              <rect x="82" y="2" width="76" height="42" fill="#17102a" />
              <rect x="-38" y="50" width="76" height="42" fill="#17102a" />
              <rect x="42" y="50" width="76" height="42" />
              <rect x="122" y="50" width="76" height="42" fill="#17102a" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#brick-pattern)" />
      </svg>
      <div className="dungeon-shade" />
      <div className="parallax-near dungeon-fixtures">
        <div className="moon-shaft" />
        <svg className="dungeon-window" viewBox="0 0 120 170">
          <defs>
            <linearGradient id="window-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2e1a5c" />
              <stop offset="1" stopColor="#0d0817" />
            </linearGradient>
          </defs>
          <path d="M4 170V62a56 56 0 0 1 112 0V170z" fill="#241a35" />
          <path d="M14 170V62a46 46 0 0 1 92 0V170z" fill="url(#window-sky)" />
          <path d="M84 34a18 18 0 1 0 8 30 14 14 0 0 1-8-30z" fill="#fde68a" opacity="0.85" />
          <path d="M40 170V20M60 170V10M80 170V20M14 100H106M14 140H106" stroke="#0a0612" strokeWidth="4" />
        </svg>
        {TORCH_SIDES.map((side) => (
          <Torch key={side} side={side} />
        ))}
        <Chain links={LEFT_CHAIN_LINKS} className="chain-left" />
        <Chain links={RIGHT_CHAIN_LINKS} className="chain-right" />
        <svg className="dungeon-web web-left" viewBox="0 0 120 120" fill="none" stroke="#c4b5fd" strokeWidth="1">
          <path d="M0 0L120 60M0 0L100 100M0 0L60 120M0 0L120 20M0 0L20 120" />
          <path d="M30 0Q22 22 0 30M60 0Q44 44 0 60M90 0Q66 66 0 90" />
        </svg>
        <svg className="dungeon-web web-right" viewBox="0 0 120 120" fill="none" stroke="#c4b5fd" strokeWidth="1">
          <path d="M0 0L120 60M0 0L100 100M0 0L60 120M0 0L120 20M0 0L20 120" />
          <path d="M30 0Q22 22 0 30M60 0Q44 44 0 60M90 0Q66 66 0 90" />
        </svg>
      </div>
      <Ground />
    </>
  );
}

const CROWD = Array.from({ length: 26 }, (_, index) => ({
  x: 20 + index * 56 + rand(index, 31) * 24,
  scale: 0.85 + rand(index, 32) * 0.4,
  hasTorch: index % 6 === 2,
  hasFork: index % 6 === 4
}));

function CrowdFigure({ x, scale, hasTorch, hasFork, index }) {
  return (
    <g transform={`translate(${x} 250) scale(${scale})`}>
      <circle cx="0" cy="-92" r="13" />
      <path d="M-24 0C-26-44-14-72 0-76C14-72 26-44 24 0z" />
      {hasTorch && (
        <>
          <path d="M20-50L34-118" stroke="currentColor" strokeWidth="4" fill="none" />
          <path
            d="M26-120c-9-12 0-26 8-34 2 10 12 14 8 28-2 6-12 10-16 6z"
            fill="#f97316"
            className="torch-flame"
            style={{ animationDelay: `${-index * 0.37}s` }}
          />
        </>
      )}
      {hasFork && (
        <path d="M20-50L30-130M22-134v-16M30-134v-20M38-134v-16M22-134h16" stroke="currentColor" strokeWidth="3" fill="none" />
      )}
    </g>
  );
}

const CLOUDS = [
  { left: -6, top: 2, width: 40, height: 15, delay: 0 },
  { left: 28, top: 9, width: 34, height: 12, delay: -23 },
  { left: 56, top: 1, width: 42, height: 16, delay: -41 },
  { left: 78, top: 14, width: 30, height: 11, delay: -12 },
  { left: 8, top: 20, width: 28, height: 9, delay: -55 }
];
function CourtyardScene() {
  return (
    <>
      <div className="parallax-near sky-clouds">
        {CLOUDS.map((cloud) => (
          <span
            key={`cloud-${cloud.left}`}
            className="cloud"
            style={{
              left: `${cloud.left}vw`,
              top: `${cloud.top}vh`,
              '--cloud-width': cloud.width,
              '--cloud-height': cloud.height,
              animationDelay: `${cloud.delay}s`
            }}
          />
        ))}
      </div>      <Ground />
      <FarTrees />
      <Hills />
      <div className="backdrop-skyline">
        <div className="backdrop-houselight courtyard-light" />
        <svg className="sky-piece sky-castle" viewBox="0 0 480 360" fill="currentColor">
          <path d="M60 360V212h60V360zM52 212h76l-38-62z" />
          <path d="M340 360V196h70V360zM332 196h86l-43-70z" />
          <path d="M170 360V150h140V360z" />
          <path d="M160 150h160v14H160zM160 150v-12h14v12zM190 150v-12h14v12zM220 150v-12h14v12zM250 150v-12h14v12zM280 150v-12h14v12zM306 150v-12h14v12z" />
          <path d="M120 360V270h50V360zM310 360V270h30V360z" />
          <path d="M90 150V110M90 110l22 8-22 8z" stroke="currentColor" strokeWidth="3" />
          <g fill="#f97316" className="castle-windows">
            <path d="M232 210v-22a8 8 0 0 1 16 0v22z" />
            <path d="M82 262v-18a6 6 0 0 1 12 0v18z" />
            <path d="M366 250v-18a6 6 0 0 1 12 0v18z" />
            <path d="M196 270v-14a5 5 0 0 1 10 0v14zM274 270v-14a5 5 0 0 1 10 0v14z" />
          </g>
        </svg>
      </div>
      <Fog />
      <div className="backdrop-foreground">
        <svg className="scene-art crowd-art" viewBox="0 0 1440 250" preserveAspectRatio="xMidYMax slice" fill="currentColor">
          {CROWD.map((figure, index) => (
            <CrowdFigure key={`figure-${figure.x}`} {...figure} index={index} />
          ))}
        </svg>
      </div>
    </>
  );
}

export const SCENES = {
  landing: ManorScene,
  history: CryptScene,
  faq: ForestScene,
  setup: DungeonScene,
  stage: CourtyardScene,
  finished: DawnScene
};
