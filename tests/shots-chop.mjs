import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
const errs = [];
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
p.on('pageerror', (e) => errs.push(e.message));
await p.goto('http://localhost:5173');
await p.click('text=Dinner Dilemma');
await p.getByRole('button', { name: 'Open the court' }).click();
await p.waitForSelector('.prisoner-card');
await p.click('.prisoner-card >> nth=0');
await p.click('.verdict-chip >> nth=0');
const clip = { x: 340, y: 0, width: 620, height: 620 };
await p.click('button.drop-blade');
const marks = [60, 120, 180, 240, 320, 420, 560, 800];
let prev = 0;
for (const ms of marks) {
  await p.waitForTimeout(ms - prev);
  prev = ms;
  await p.screenshot({ path: `screens/test/chop-${ms}.png`, clip });
}
await b.close();
console.log(JSON.stringify({ errs }));
