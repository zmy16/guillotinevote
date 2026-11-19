import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BatArt, Sparkle, MoonWaning, SpiderArt } from './Icons.jsx';
import { SCENES } from './Scenes.jsx';
import { reducedMotion } from '../usePageEnter.js';

gsap.registerPlugin(ScrollTrigger);

const BAT_CLASSES = ['bat-a', 'bat-b', 'bat-c', 'bat-d', 'bat-e', 'bat-f'];
const EMBER_COUNT = 12;
const INDOOR_VARIANT = 'setup';
const PARALLAX_LAYERS = [
  ['.backdrop-stars', 20],
  ['.backdrop-moon', 50],
  ['.backdrop-sparkles', 40],
  ['.backdrop-far', 30],
  ['.backdrop-hills', 55],
  ['.parallax-near', 40],
  ['.backdrop-skyline', 100],
  ['.backdrop-foreground', 170]
];

export function HalloweenBackdrop({ variant = 'landing' }) {
  const rootRef = useRef(null);
  const Scene = SCENES[variant] || SCENES.landing;
  const isOutdoors = variant !== INDOOR_VARIANT;

  useLayoutEffect(() => {
    if (reducedMotion() || !rootRef.current) {
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

        PARALLAX_LAYERS.forEach(([selector, travel]) => {
          const el = root.querySelector(selector);
          if (!el) {
            return;
          }
          gsap.to(el, {
            y: -travel,
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
    <div ref={rootRef} className="backdrop" data-variant={variant} aria-hidden="true">
      <div className="backdrop-tint" />
      {isOutdoors && (
        <>
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
          <div className="backdrop-bats">
            {BAT_CLASSES.map((batClass) => (
              <BatArt key={batClass} className={`backdrop-bat ${batClass}`} />
            ))}
          </div>
          <SpiderArt className="backdrop-spider" />
        </>
      )}
      <div className="backdrop-embers">
        {Array.from({ length: EMBER_COUNT }).map((_, index) => (
          <span
            key={`ember-${index}`}
            style={{
              left: `${(index * 29 + 7) % 96}%`,
              '--ember-size': `${2 + (index % 3)}px`,
              '--ember-duration': `${11 + ((index * 5) % 9)}s`,
              '--ember-delay': `-${(index * 3) % 11}s`,
              '--ember-drift': `${((index % 5) - 2) * 3}vw`
            }}
          />
        ))}
      </div>
      <Scene />
      {variant === 'landing' && (
        <div className="backdrop-sparkles">
          <Sparkle className="backdrop-sparkle sparkle-a" />
          <Sparkle className="backdrop-sparkle sparkle-b" />
        </div>
      )}
      <div className="backdrop-vignette" />
    </div>
  );
}
