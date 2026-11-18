import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:4175';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screens/landing.png', fullPage: true });

  await page.click('text=Dinner Dilemma');
  await page.waitForSelector('#player-0');
  await page.screenshot({ path: 'screens/setup.png', fullPage: true });

  await page.click('button:has-text("Open the court")');
  await page.waitForSelector('.prisoner-card');
  await page.waitForTimeout(400);
  await page.click('.prisoner-card >> nth=0');
  await page.click('text=Too Expensive');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'screens/stage.png', fullPage: true });

  for (let i = 0; i < 5; i += 1) {
    await page.click('.prisoner-card >> nth=0');
    const kinds = ['Too Far', 'Boring', 'Not Today', 'Too Expensive'];
    await page.click(`text=${kinds[i % kinds.length]}`);
    await page.click('button:has-text("Drop the Blade")');
    await page.waitForTimeout(350);
  }
  await page.waitForSelector('.decree-winner', { timeout: 5000 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'screens/result.png', fullPage: true });

  await page.click('button:has-text("Start another court")');
  await page.waitForSelector('.hero');

  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  await page.click('text=Try a sample round');
  await page.waitForSelector('.prisoner-card');
  await page.waitForTimeout(400);
  await page.click('.prisoner-card >> nth=0');
  await page.click('text=ROYAL PARDON').catch(() => page.click('text=Royal Pardon'));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screens/pardon.png', fullPage: true });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(BASE);
  await mobile.waitForLoadState('networkidle');
  await mobile.waitForTimeout(500);
  await mobile.screenshot({ path: 'screens/landing-mobile.png', fullPage: true });

  await browser.close();
  console.log('screens-ok');
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
