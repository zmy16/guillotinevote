import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
await p.goto('http://localhost:5173');
await p.click('text=Dinner Dilemma');
await p.waitForSelector('#player-0');
await p.fill('#player-0', 'Raka'); await p.fill('#player-1', 'Budi');
await p.click('button:has-text("Open the court")');
await p.waitForSelector('.guillotine-rig');
await p.waitForTimeout(500);
const r = await p.evaluate(() => {
  const svg = document.querySelector('.guillotine-rig');
  const paths = [...svg.querySelectorAll('path')].slice(0, 4);
  return {
    html: svg.outerHTML.slice(0, 300),
    defsCount: svg.querySelectorAll('defs').length,
    strokes: paths.map((e) => ({ d: e.getAttribute('d'), stroke: getComputedStyle(e).stroke, sw: getComputedStyle(e).strokeWidth })),
    gradientIds: [...document.querySelectorAll('linearGradient')].map((g) => g.id)
  };
});
console.log(JSON.stringify(r, null, 1));
await b.close();
