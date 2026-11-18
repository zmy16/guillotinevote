import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
p.on('pageerror', (e) => console.log('ERR', e.message));
await p.goto('http://localhost:5173');
await p.waitForTimeout(800);
const snap = () => p.evaluate(() => ({
  reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  bat: [...document.querySelectorAll('.backdrop-bat')].map((n) => getComputedStyle(n).transform),
  fog: [...document.querySelectorAll('.backdrop-fog span')].map((n) => getComputedStyle(n).transform),
  moon: getComputedStyle(document.querySelector('.backdrop-moon')).transform,
  star: getComputedStyle(document.querySelector('.backdrop-star')).opacity
}));
const a = await snap();
await p.waitForTimeout(1600);
const c = await snap();
console.log(JSON.stringify({ a, c }, null, 1));
await b.close();
