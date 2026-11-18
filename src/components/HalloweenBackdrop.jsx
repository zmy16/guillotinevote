import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Icon } from '@iconify/react';

gsap.registerPlugin(ScrollTrigger);
import { GuillotineArt, BatArt, Sparkle, MoonWaning, CemeteryArt } from './Icons.jsx';

export function GuillotineMark({ className }) {
  return <img className={className} src="/logo-mark.svg" alt="" aria-hidden="true" decoding="sync" />;
}

export function BrandChip() {
  return (
    <div className="brand">
      <GuillotineMark className="brand-mark" />
      GuillotineVote
    </div>
  );
}

const reduced = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Fog() {
  return (
    <div className="backdrop-fog" aria-hidden="true">
      <span className="fog-a" />
      <span className="fog-b" />
      <span className="fog-c" />
    </div>
  );
}

function Skyline() {
  return (
    <div className="backdrop-skyline" aria-hidden="true">
      <div className="backdrop-houselight" />
      <CemeteryArt className="sky-piece sky-graveyard" />
      <img className="sky-piece sky-manor" src="/skyline-haunted-house.svg" alt="" aria-hidden="true" decoding="async" />
    </div>
  );
}

export function HalloweenBackdrop({ variant = 'landing' }) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (reduced() || !rootRef.current) {
      return;
    }
    const root = rootRef.current;
    let animationFrame = 0;
    let scope = null;

    const start = () => {
      scope = gsap.context(() => {
        gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } }).to(
          root.querySelectorAll('.backdrop-fog span'),
          { xPercent: -8, duration: 9, stagger: 0.8 },
          0
        );

        const layers = [
          ['.backdrop-stars', 0.05, 0],
          ['.backdrop-moon', 0.14, -2],
          ['.backdrop-pumpkins', 0.16, 0],
          ['.backdrop-skyline', 0.16, 0]
        ];
        layers.forEach(([selector, depth, rotate]) => {
          const el = root.querySelector(selector);
          if (!el) {
            return;
          }
          gsap.to(el, {
            yPercent: depth * 100,
            rotation: rotate,
            ease: 'none',
            scrollTrigger: { start: 0, end: 'max', scrub: 1.1, invalidateOnRefresh: true }
          });
        });
      }, root);
    };

    let waiting = true;
    const begin = () => {
      if (!waiting) {
        return;
      }
      waiting = false;
      window.clearTimeout(timer);
      animationFrame = requestAnimationFrame(start);
    };
    const timer = window.setTimeout(begin, 600);
    if (document.fonts) {
      document.fonts.ready.then(begin);
    } else {
      begin();
    }

    return () => {
      waiting = false;
      window.clearTimeout(timer);
      cancelAnimationFrame(animationFrame);
      if (scope) {
        scope.revert();
      }
    };
  }, [variant]);

  return (
    <div ref={rootRef} className="backdrop" aria-hidden="true">
      <div className="backdrop-stars">
        {Array.from({ length: 18 }).map((_, index) => {
          const left = (index * 37 + variant.length * 11) % 100;
          const top = (index * 53 + 17) % 85;
          const size = 1 + (index % 3);
          const delay = (index % 7) * 0.4;
          return (
            <span
              key={`star-${index}`}
              className="backdrop-star"
              style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `${delay}s` }}
            />
          );
        })}
      </div>
      <div className="backdrop-moon">
        <MoonWaning width="100%" height="100%" />
      </div>
      <Fog />
      <div className="backdrop-bats">
        <BatArt className="backdrop-bat bat-a" />
        <BatArt className="backdrop-bat bat-b" />
        <BatArt className="backdrop-bat bat-c" />
      </div>
      <svg className="backdrop-hills" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="#0d0817" d="M0 196c120-58 232-70 344-36s214 96 330 82 214-96 330-104 214 40 436 88v94H0z" />
        <path fill="#08040f" d="M0 244c140-46 258-42 372-10s226 74 348 58 236-84 358-70 210 56 362 96v2H0z" opacity="0.92" />
      </svg>
      <Skyline />
      {variant === 'landing' && (
        <div className="backdrop-pumpkins">
          <Sparkle className="backdrop-sparkle sparkle-a" />
          <Sparkle className="backdrop-sparkle sparkle-b" />
        </div>
      )}
    </div>
  );
}