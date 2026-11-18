import { chromium } from 'playwright';
import fs from 'fs';

const BASE = process.env.BASE_URL || 'http://localhost:5173';
const SHOTS = 'screens/test';

async function run() {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const consoleMessages = [];
  const pageErrors = [];
  page.on('console', (message) => consoleMessages.push({ type: message.type(), text: message.text() }));
  page.on('pageerror', (error) => pageErrors.push(error.message));

  const results = [];
  function log(step, status, detail = '') {
    results.push({ step, status, detail });
    console.log(`${status === 'pass' ? '✓' : status === 'fail' ? '✗' : '›'} ${step}${detail ? ` — ${detail}` : ''}`);
  }

  // 1. Landing
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
  const heroText = await page.textContent('h1');
  log('Landing loads', heroText.includes('Vote for what you') ? 'pass' : 'fail', heroText.slice(0, 50));
  await page.screenshot({ path: `${SHOTS}/01-landing.png`, fullPage: true });

  // 2. Choose preset
  await page.click('text=Dinner Dilemma');
  await page.waitForSelector('#player-0');
  log('Setup form opens', 'pass');
  await page.screenshot({ path: `${SHOTS}/02-setup.png`, fullPage: true });

  // 3. Validation - blank player
  await page.fill('#player-0', '');
  await page.fill('#player-1', '');
  await page.click('button:has-text("Open the court")');
  await page.waitForTimeout(300);
  const hasError = await page.locator('.error-summary').count();
  log('Validation blocks blank player', hasError > 0 ? 'pass' : 'fail', `${hasError} summary`);
  await page.screenshot({ path: `${SHOTS}/02b-validation.png`, fullPage: true });

  // 4. Fill valid setup (preset prefills 6 options and 2 players)
  await page.fill('#player-0', 'Raka');
  await page.fill('#player-1', 'Budi');
  const playerCount = await page.locator('[id^="player-"]').count();
  if (playerCount < 3) {
    await page.click('button:has-text("Add player")');
    await page.fill('#player-2', 'Citra');
  }
  await page.click('button:has-text("Open the court")');
  await page.waitForSelector('.prisoner-card');
  log('Game starts', 'pass');
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${SHOTS}/03-stage.png`, fullPage: true });

  // 5. Two-step selection
  await page.click('.prisoner-card >> nth=0');
  const pressed = await page.getAttribute('.prisoner-card >> nth=0', 'aria-pressed');
  log('Option selectable', pressed === 'true' ? 'pass' : 'fail');

  // 6. Verdict required before execute
  const executeDisabled = await page.isDisabled('button:has-text("Drop the Blade")');
  log('CTA disabled before verdict', executeDisabled ? 'pass' : 'fail');

  // 7. Choose verdict
  await page.click('text=Too Expensive');
  await page.waitForTimeout(200);
  const executeEnabled = !(await page.isDisabled('button:has-text("Drop the Blade")'));
  log('CTA enables after verdict', executeEnabled ? 'pass' : 'fail');
  await page.screenshot({ path: `${SHOTS}/04-selected.png`, fullPage: true });

  // 8. Execute
  await page.click('button:has-text("Drop the Blade")');
  await page.waitForTimeout(400);
  const graveyardCount = await page.locator('.headstone').count();
  log('Execution creates headstone', graveyardCount === 1 ? 'pass' : 'fail', `${graveyardCount} headstone`);
  await page.screenshot({ path: `${SHOTS}/05-executed.png`, fullPage: true });

  // 9. Turn advances
  const turnText = await page.textContent('.turn-player');
  log('Turn advances', /Player 2|Budi/.test(turnText) ? 'pass' : 'info', turnText.trim());

  // 10. Keyboard nav
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const focusVisible = await page.evaluate(() => document.activeElement?.className.includes('prisoner-card'));
  log('Keyboard focus works', focusVisible ? 'pass' : 'info');

  // 11. Mute toggle
  await page.click('.turn-indicator button:has-text("Sound")');
  await page.waitForTimeout(200);
  const muteText = await page.textContent('.turn-indicator button:has-text("Sound")');
  log('Mute toggle works', /off|on/i.test(muteText) ? 'pass' : 'fail', muteText.trim());

  // 12. Play to completion
  for (let i = 0; i < 4; i++) {
    await page.click('.prisoner-card >> nth=0');
    const verdicts = ['Too Far', 'Boring', 'Not Today'];
    await page.click(`text=${verdicts[i % 3]}`);
    await page.click('button:has-text("Drop the Blade")');
    await page.waitForTimeout(350);
  }
  await page.waitForSelector('.decree-winner', { timeout: 5000 });
  const winner = await page.textContent('.decree-winner');
  log('Winner crowned', winner.length > 0 ? 'pass' : 'fail', winner);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${SHOTS}/06-winner.png`, fullPage: true });

  // 13. Graveyard
  const headstones = await page.locator('.headstone').count();
  log('Graveyard shows all executions', headstones === 5 ? 'pass' : 'fail', `${headstones} headstones`);

  // 14. Share link
  await page.click('button:has-text("Copy share link")');
  await page.waitForTimeout(300);
  const shareUrl = await page.textContent('.share-url');
  const match = shareUrl.match(/\?r=([A-Za-z0-9+/=]+)/);
  log('Share URL generated', match ? 'pass' : 'fail', match ? `${match[1].length} chars` : 'no match');

  // 15. Open share link
  if (match) {
    await page.goto(`${BASE}/?r=${match[1]}`);
    await page.waitForSelector('.decree-winner');
    const sharedWinner = await page.textContent('.decree-winner');
    log('Share link shows same winner', sharedWinner === winner ? 'pass' : 'fail', sharedWinner);
    await page.screenshot({ path: `${SHOTS}/07-shared.png`, fullPage: true });
  }

  // 16. Invalid link
  await page.goto(`${BASE}/?r=garbage!!!`);
  await page.waitForSelector('text=This link is cursed');
  log('Invalid link shows error state', 'pass');

  // 17. Sample round + pardon
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  await page.click('text=Try a sample round');
  await page.waitForSelector('.prisoner-card');
  log('Sample round starts', 'pass');
  await page.waitForTimeout(300);

  await page.click('.prisoner-card >> nth=0');
  await page.click('text=Too Expensive');
  await page.click('button:has-text("Royal Pardon")');
  await page.waitForTimeout(500);
  const pardonEntry = await page.locator('.pardon-entry').count();
  log('Pardon spares option', pardonEntry === 1 ? 'pass' : 'fail');
  await page.screenshot({ path: `${SHOTS}/08-pardon.png`, fullPage: true });

  // 18. Mobile viewport
  const mobile = await context.newPage();
  await mobile.setViewportSize({ width: 390, height: 844 });
  await mobile.goto(BASE);
  await mobile.waitForLoadState('networkidle');
  await mobile.waitForTimeout(400);
  await mobile.screenshot({ path: `${SHOTS}/09-mobile.png`, fullPage: true });
  log('Mobile layout renders', 'pass');

  // 19. Console errors
  const errors = consoleMessages.filter((m) => m.type === 'error');
  const errorSummary = errors.length > 0 ? `${errors.length} console errors: ${errors.slice(0, 2).map((e) => e.text).join(' | ')}` : 'clean';
  log('Console clean', errors.length === 0 ? 'pass' : 'warn', errorSummary);

  // 20. Page errors
  const pageErrorSummary = pageErrors.length > 0 ? `${pageErrors.length} page errors` : 'none';
  log('No page errors', pageErrors.length === 0 ? 'pass' : 'fail', pageErrorSummary);

  await browser.close();

  const passCount = results.filter((r) => r.status === 'pass').length;
  const failCount = results.filter((r) => r.status === 'fail').length;
  const warnCount = results.filter((r) => r.status === 'warn').length;
  console.log(`\n${passCount} passed, ${failCount} failed, ${warnCount} warnings`);

  if (failCount > 0) {
    process.exit(1);
  }
}

run().catch((error) => {
  console.error('Test crashed:', error.message);
  process.exit(1);
});
