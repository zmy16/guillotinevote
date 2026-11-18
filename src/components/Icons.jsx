import { forwardRef } from 'react';
import { Icon } from '@iconify/react';

export const GuillotineArt = forwardRef(function GuillotineArt(props, ref) {
  return <Icon icon="game-icons:guillotine" {...props} ref={ref} />;
});

export function ExecutionerHood(props) {
  return <Icon icon="game-icons:executioner-hood" {...props} />;
}

/* Voting + judgment glyphs — the app's actual subject, not generic Halloween props */
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

/** Flat cemetery silhouette: two depth rows of stones, mixed marker types. */
export function CemeteryArt(props) {
  return (
    <svg viewBox="0 0 300 152" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M0 151h300v-8c-38-7-74-10-110-8-36 2-70 8-104 10-30 2-58 4-86 6z" opacity="0.5" />
      <g opacity="0.4">
        <path d="M14 145v-17a10 10 0 0 1 20 0v17z" />
        <path d="M38 145v-20h6v20zM32 130h18v6H32z" />
        <path d="M60 145v-14a9 9 0 0 1 18 0v14z" />
        <path d="M86 145v-22l5-8 5 8v22z" />
        <path d="M108 145v-16a10 10 0 0 1 20 0v16z" />
        <path d="M143 145v-23h5v23zM137 128h17v6h-17z" />
        <path d="M162 145v-13a8 8 0 0 1 16 0v13z" />
        <path d="M188 145v-19a11 11 0 0 1 22 0v19z" />
        <path d="M221 145v-27h5v27zM215 124h17v6h-17z" />
        <path d="M240 145v-15a9 9 0 0 1 18 0v15z" />
        <path d="M266 145v-20l5-7 5 7v20z" />
      </g>
      <g>
        <path d="M10 151v-32a13 13 0 0 1 26 0v32z" />
        <path d="M23 151v-58h6v58zM9 85h34v8H9z" />
        <path d="M50 151v-40a22 22 0 0 1 44 0v40z" />
        <path d="M104 151v-46l6-16 6 16v46zM100 118h20v6h-20z" />
        <path d="M136 151v-34a15 15 0 0 1 30 0v34z" transform="rotate(-5 151 151)" />
        <path d="M178 151v-48a11 11 0 0 1 22 0v48z" />
        <path d="M212 151v-38l7-14 7 14v38z" />
        <path d="M240 151v-30a13 13 0 0 1 26 0v30z" />
        <path d="M272 151v-26a10 10 0 0 1 20 0v26z" />
      </g>
    </svg>
  );
}

export function SkylineArt(props) {
  return <Icon icon="game-icons:spooky-house" {...props} />;
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

export function CauldronArt(props) {
  return <Icon icon="game-icons:cauldron" {...props} />;
}

export function RavenArt(props) {
  return <Icon icon="game-icons:raven" {...props} />;
}

export function KnifeArt(props) {
  return <Icon icon="game-icons:knife-thrust" {...props} />;
}

export function TombstoneGlyph(props) {
  return <Icon icon="game-icons:tombstone" {...props} />;
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
