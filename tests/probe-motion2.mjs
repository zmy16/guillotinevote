import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
p.on('pageerror', (e) => console.log('ERR', e.message));
await p.goto('http://localhost:5173');
await p.waitForTimeout(700);
const snap = () => p.evaluate(() => ({
  bat: [...document.querySelectorAll('.backdrop-bat')].map((n) => getComputedStyle(n).transform),
  fog: [...document.querySelectorAll('.backdrop-fog span')].map((n) => getComputedStyle(n).transform),
  moon: getComputedStyle(document.querySelector('.backdrop-moon')).transform,
  star: [...document.querySelectorAll('.backdrop-star')].slice(0,3).map(n => getComputedStyle(n).opacity)
}));
const a = await snap();
await p.waitForTimeout(1500);
const c = await snap();
const moved = (k) => JSON.stringify(a[k]) !== JSON.stringify(c[k]);
console.log('bat moved:', moved('bat'), '| fog moved:', moved('fog'), '| moon moved:', moved('moon'), '| star moved:', moved('star'));
console.log('bat a:', a.bat[0], '-> c:', c.bat[0]);
console.log('fog a:', a.fog[0], '-> c:', c.fog[0]);
console.log('moon a:', a.moon, '-> c:', c.moon);
await b.close();
