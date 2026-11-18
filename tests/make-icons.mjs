import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const svg = readFileSync('public/logo.svg', 'utf8');
const b = await chromium.launch();

for (const size of [32, 180]) {
  const p = await b.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  await p.setContent(
    `<html><body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg style="display:block;width:${size}px;height:${size}px" `)}</body></html>`
  );
  await p.screenshot({ path: `public/logo-${size}.png`, omitBackground: true });
  await p.close();
}

// legibility sheet: 16 / 32 / 64 / 128 px on dark + light
const sheet = await b.newPage({ viewport: { width: 420, height: 240 } });
await sheet.setContent(`<html><body style="margin:0;display:flex;gap:16px;align-items:center;padding:20px;background:#0d0817">
${[16, 32, 64, 128].map((s) => `<img src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}" style="width:${s}px;height:${s}px">`).join('')}
</body></html>`);
await sheet.screenshot({ path: 'screens/test/logo-sheet.png' });
await sheet.close();

await b.close();
console.log('ok');