import { useCallback, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export const reducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const pageShell = (root) => root.closest('.app-shell') || root;

let hasNavigated = false;

const isRendered = (element) => {
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden';
};

export function usePageEnter(key) {
  const ref = useRef(null);
  const firstRun = useRef(true);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || reducedMotion()) {
      return;
    }
    // useLayoutEffect on mount: browser has not painted yet, so any "from" state
    // we set here becomes the first frame — no flash of unanimated content.
    const isCold = firstRun.current;
    firstRun.current = false;

    const shell = pageShell(root);
    const brandBar = root.querySelector('.brand-bar');
    const first = root.querySelector('.page > .brand, .page > .hero, .page > .section, .page > header');
    const isWordmark = first && first.classList.contains('brand');
    const rest = [...root.querySelectorAll('.page > *')].filter((c) => c !== first && isRendered(c));

    const scope = gsap.context(() => {
      // Set the initial (hidden) state synchronously so the very first frame
      // the browser paints is already the animation start, not the finished page.
      if (isCold) {
        if (brandBar) gsap.set(brandBar, { opacity: 0, y: -20 });
        if (first) {
          gsap.set(first, isWordmark ? { opacity: 0, y: -14 } : { opacity: 0, y: 32, clipPath: 'inset(0 0 92% 0)' });
        }
        gsap.set(rest, { opacity: 0, y: 36 });
      }

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      if (!isCold) {
        tl.fromTo(shell, { opacity: 0 }, { opacity: 1, duration: 0.28, clearProps: 'opacity' }, 0);
      }

      if (brandBar) {
        tl.to(
          brandBar,
          { opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.4)', clearProps: 'opacity,transform' },
          isCold ? 0.1 : 0
        );
      }

      if (first) {
        tl.to(
          first,
          isWordmark
            ? {
                opacity: 1,
                y: 0,
                duration: isCold ? 0.6 : 0.5,
                ease: 'power2.out',
                clearProps: 'opacity,transform'
              }
            : {
                opacity: 1,
                y: 0,
                clipPath: 'inset(0 0 0% 0)',
                duration: isCold ? 0.9 : 0.7,
                ease: 'power3.out',
                clearProps: 'opacity,transform,clipPath'
              },
          0
        );
      }

      if (rest.length) {
        tl.to(
          rest,
          {
            opacity: 1,
            y: 0,
            duration: isCold ? 0.7 : 0.55,
            ease: 'back.out(1.2)',
            stagger: isCold ? 0.08 : 0.07,
            clearProps: 'opacity,transform'
          },
          isCold ? 0.28 : 0.2
        );
      }
    }, root);

    return () => scope.revert();
  }, [key]);

  return ref;
}

export function usePageExit() {
  return useCallback((node, navigate) => {
    const run = () => {
      window.scrollTo(0, 0);
      navigate();
    };
    if (!node || reducedMotion()) {
      run();
      return;
    }
    gsap.to(pageShell(node), {
      opacity: 0,
      duration: 0.2,
      ease: 'power1.in',
      onComplete: run
    });
  }, []);
}
