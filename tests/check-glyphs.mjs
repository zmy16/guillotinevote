import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
const errs = [];
p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text().slice(0, 200)); });
await p.goto('http://localhost:5173');
await p.waitForLoadState('networkidle');
await p.click('text=Dinner Dilemma');
await p.waitForSelector('#player-0');
await p.fill('#player-0', 'Raka');
await p.fill('#player-1', 'Budi');
await p.click('button:has-text("Open the court")');
await p.waitForSelector('.prisoner-card');
await p.waitForTimeout(1200);
const info = await p.evaluate(() =>
  [...document.querySelectorAll('.prisoner-card')].map((card) => {
    const svg = card.querySelector('.prisoner-glyph');
    return {
      label: card.querySelector('.prisoner-label')?.textContent,
      hasSvg: !!svg,
      tag: svg?.tagName,
      childCount: svg?.querySelectorAll('path,rect,circle,ellipse,polygon').length ?? 0,
      box: svg ? Math.round(svg.getBoundingClientRect().width) : 0
    };
  })
);
console.log(JSON.stringify(info, null, 1));
console.log('CONSOLE:', errs.length ? errs.join(' | ') : 'clean');
await b.close();
