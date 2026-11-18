import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
await p.goto('http://localhost:5173');
await p.waitForLoadState('networkidle');
await p.click('text=Dinner Dilemma');
await p.waitForSelector('#player-0');
await p.fill('#player-0', 'Raka');
await p.fill('#player-1', 'Budi');
await p.click('button:has-text("Open the court")');
await p.waitForSelector('.prisoner-card');
for (const wait of [1500, 3000, 6000]) {
  await p.waitForTimeout(wait === 1500 ? 1500 : 1500);
  const r = await p.evaluate(() =>
    [...document.querySelectorAll('.prisoner-card')].map((c) => ({
      l: c.querySelector('.prisoner-label')?.textContent,
      svg: !!c.querySelector('.prisoner-glyph'),
      n: c.querySelector('.prisoner-glyph')?.querySelectorAll('path,rect,circle,ellipse,polygon,line').length ?? 0
    }))
  );
  console.log(wait, JSON.stringify(r));
}
await b.close();
