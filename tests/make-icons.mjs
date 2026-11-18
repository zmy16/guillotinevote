import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';

const appUrl = process.argv[2] || 'http://localhost:4173';
const svg = readFileSync('public/logo.svg', 'utf8');
const ICON_SIZES = [48, 180, 192, 512];
const OG_SIZE = { width: 1200, height: 630 };

function toIco(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(size, 6);
  header.writeUInt8(size, 7);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  return Buffer.concat([header, png]);
}

const OG_OVERLAY = `
<style>
  .og-scrim { position: fixed; inset: 0; z-index: 50; background: linear-gradient(90deg, rgba(8,4,16,0.82) 0%, rgba(8,4,16,0.5) 52%, transparent 78%); }
  .og-copy { position: fixed; z-index: 60; left: 72px; top: 64px; width: 700px; color: #f5f3ff; }
  .og-brand { display: flex; align-items: center; gap: 18px; font-family: var(--font-display); font-weight: 600; font-size: 26px; letter-spacing: 0.22em; color: #fde68a; }
  .og-brand img { width: 84px; height: 84px; }
  .og-title { margin: 30px 0 0; font-family: var(--font-display); font-weight: 700; font-size: 66px; line-height: 1.08; text-transform: uppercase; }
  .og-title em { font-style: normal; color: #fde68a; }
  .og-sub { margin: 22px 0 0; font-family: var(--font-ui); font-size: 28px; line-height: 1.35; color: #c4b5fd; }
  .og-pill { display: inline-block; margin-top: 30px; padding: 14px 30px; border-radius: 999px; background: #f59e0b; color: #1b0f06; font-family: var(--font-display); font-weight: 700; font-size: 22px; letter-spacing: 0.08em; }
</style>
<div class="og-scrim"></div>
<div class="og-copy">
  <div class="og-brand"><img src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}" alt="">GUILLOTINEVOTE</div>
  <h1 class="og-title">Vote for what you <em>hate</em>, not what you love.</h1>
  <p class="og-sub">A reverse-voting party game. Execute options until one survivor remains.</p>
  <span class="og-pill">PLAY FREE IN YOUR BROWSER</span>
</div>`;

const browser = await chromium.launch();

for (const size of ICON_SIZES) {
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  await page.setContent(
    `<html><body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg style="display:block;width:${size}px;height:${size}px" `)}</body></html>`
  );
  const png = await page.screenshot({ omitBackground: true });
  writeFileSync(`public/logo-${size}.png`, png);
  if (size === 48) {
    writeFileSync('public/favicon.ico', toIco(png, size));
  }
  await page.close();
}

const ogPage = await browser.newPage({ viewport: OG_SIZE, deviceScaleFactor: 1 });
await ogPage.goto(appUrl);
await ogPage.evaluate(() => localStorage.clear());
await ogPage.reload();
await ogPage.waitForTimeout(2500);
await ogPage.addStyleTag({ content: '.app-shell > *:not(.backdrop) { display: none !important; }' });
await ogPage.evaluate((html) => document.body.insertAdjacentHTML('beforeend', html), OG_OVERLAY);
await ogPage.evaluate(() => document.fonts.ready);
await ogPage.waitForTimeout(400);
writeFileSync('public/og-image.jpg', await ogPage.screenshot({ type: 'jpeg', quality: 86 }));
await browser.close();
console.log('brand assets written');