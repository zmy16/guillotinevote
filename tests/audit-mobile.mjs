import { chromium } from 'playwright';

const URL = 'http://localhost:5173';
const VIEWPORTS = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-360', width: 360, height: 740 }
];

const b = await chromium.launch();
const report = [];

for (const vp of VIEWPORTS) {
  const p = await b.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 2 });
  p.on('pageerror', (e) => report.push(`${vp.name} PAGEERROR ${e.message}`));
  await p.goto(URL);
  await p.waitForLoadState('networkidle');

  const audit = async (label) => {
    const r = await p.evaluate(() => {
      const de = document.documentElement;
      const overflowX = de.scrollWidth - de.clientWidth;
      const small = [];
      for (const el of document.querySelectorAll('button, a[href], input, select, textarea')) {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) continue;
        if (rect.height < 44 || rect.width < 44) {
          small.push({
            text: (el.textContent || el.getAttribute('aria-label') || el.id || el.tagName).trim().slice(0, 34),
            w: Math.round(rect.width),
            h: Math.round(rect.height)
          });
        }
      }
      const wide = [];
      for (const el of document.querySelectorAll('body *')) {
        const rect = el.getBoundingClientRect();
        if (rect.right > de.clientWidth + 1 && rect.width > 0) {
          wide.push({
            cls: (el.className || el.tagName).toString().slice(0, 40),
            right: Math.round(rect.right),
            w: Math.round(rect.width)
          });
        }
      }
      return { overflowX, small: small.slice(0, 8), wide: wide.slice(0, 8) };
    });
    report.push(`${vp.name} ${label} overflowX=${r.overflowX} small=${r.small.length} wide=${r.wide.length}`);
    if (r.small.length) report.push(`   small: ${JSON.stringify(r.small)}`);
    if (r.wide.length) report.push(`   wide: ${JSON.stringify(r.wide)}`);
    await p.screenshot({ path: `screens/test/${vp.name}-${label}.png`, fullPage: true });
  };

  await audit('landing');

  await p.click('text=Dinner Dilemma');
  await p.waitForSelector('#player-0');
  await audit('setup');

  await p.fill('#player-0', 'Raka');
  await p.fill('#player-1', 'Budi');
  await p.click('button:has-text("Open the court")');
  await p.waitForSelector('.prisoner-card');
  await p.waitForTimeout(600);
  await audit('stage');

  await p.click('.prisoner-card >> nth=1');
  await p.click('text=Too Expensive');
  await p.waitForTimeout(300);
  await p.click('button:has-text("Drop the Blade")');
  await p.waitForTimeout(700);
  await audit('stage-after');

  await p.close();
}

await b.close();
console.log(report.join('\n'));