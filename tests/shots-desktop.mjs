import { chromium } from 'playwright';

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
p.on('pageerror', (e) => console.log('PAGEERROR', e.message));

await p.goto('http://localhost:5173');
await p.waitForLoadState('networkidle');
await p.click('text=Dinner Dilemma');
await p.waitForSelector('#player-0');
await p.fill('#player-0', 'Raka');
await p.fill('#player-1', 'Budi');
await p.click('button:has-text("Open the court")');
await p.waitForSelector('.prisoner-card');
await p.waitForTimeout(700);
await p.evaluate(() => window.scrollTo(0, 0));
await p.screenshot({ path: 'screens/test/desk-stage.png' });

await p.click('.prisoner-card >> nth=1');
await p.click('text=Too Expensive');
await p.waitForTimeout(300);
await p.click('button:has-text("Drop the Blade")');
await p.waitForTimeout(900);
await p.evaluate(() => window.scrollTo(0, 0));
await p.screenshot({ path: 'screens/test/desk-stage-executed.png' });

const graveyard = await p.$('.graveyard');
if (graveyard) {
  await graveyard.screenshot({ path: 'screens/test/desk-graveyard.png' });
}

// Play to the end to inspect the winner decree + headstones
for (let i = 0; i < 20; i++) {
  const alive = await p.$$('.prisoner-card');
  if (!alive.length) break;
  await alive[0].click();
  await p.click('text=Boring');
  await p.waitForTimeout(200);
  await p.click('button:has-text("Drop the Blade")');
  await p.waitForTimeout(400);
}
await p.waitForTimeout(600);
await p.evaluate(() => window.scrollTo(0, 0));
await p.screenshot({ path: 'screens/test/desk-result.png', fullPage: true });

const hs = await p.$('.headstone');
if (hs) await hs.screenshot({ path: 'screens/test/desk-headstone.png' });

await b.close();
console.log('ok');