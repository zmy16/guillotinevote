import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:4173';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(`console: ${message.text()}`);
    }
  });

  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  const title = await page.textContent('h1');
  if (!/Vote for what you/i.test(title)) {
    throw new Error(`Unexpected hero: ${title}`);
  }

  await page.click('text=Dinner Dilemma');
  await page.waitForSelector('#player-0');
  await page.click('button:has-text("Open the court")');
  await page.waitForSelector('.prisoner-card');
  const playerTurn = await page.textContent('.turn-player');
  if (!/Player 1|A/.test(playerTurn)) {
    throw new Error(`Unexpected turn indicator: ${playerTurn}`);
  }

  await page.click('.prisoner-card >> nth=0');
  await page.click('text=Too Expensive');
  await page.click('button:has-text("Drop the Blade")');
  await page.waitForFunction(
    () => document.querySelectorAll('.headstone').length === 1,
    null,
    { timeout: 5000 }
  );

  for (let i = 0; i < 4; i += 1) {
    await page.click('.prisoner-card >> nth=0');
    const verdictButtons = ['Too Far', 'Boring', 'Not Today', 'Other'];
    await page.click(`text=${verdictButtons[i % verdictButtons.length]}`);
    if (i % verdictButtons.length === 3) {
      await page.fill('#other-verdict', 'Too loud');
    }
    await page.click('button:has-text("Drop the Blade")');
    await page.waitForTimeout(200);
  }

  await page.waitForSelector('.decree-winner', { timeout: 5000 });
  const winner = await page.textContent('.decree-winner');
  if (!winner || winner.length === 0) {
    throw new Error('No winner rendered');
  }

  const headstones = await page.locator('.headstone').count();
  if (headstones !== 5) {
    throw new Error(`Expected 5 headstones, got ${headstones}`);
  }

  await page.click('button:has-text("Copy share link")');
  const shareText = await page.textContent('.share-url');
  const match = shareText.match(/\?r=([A-Za-z0-9+/=]+)/);
  if (!match) {
    throw new Error(`No share URL rendered: ${shareText}`);
  }

  await page.goto(`${BASE}/?r=${match[1]}`);
  await page.waitForSelector('.decree-winner');
  const sharedWinner = await page.textContent('.decree-winner');
  if (sharedWinner !== winner) {
    throw new Error(`Share winner mismatch: ${sharedWinner} vs ${winner}`);
  }

  await page.goto(`${BASE}/?r=!!!garbage`);
  await page.waitForSelector('text=This link is cursed');
  const invalidMessage = await page.textContent('.section-sub');
  if (!/malformed/i.test(invalidMessage)) {
    throw new Error(`Invalid state message missing: ${invalidMessage}`);
  }

  await browser.close();

  if (errors.length > 0) {
    throw new Error(`Browser errors:\n${errors.join('\n')}`);
  }
  console.log('smoke-ok', { winner, headstones });
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
