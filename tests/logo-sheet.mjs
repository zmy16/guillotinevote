import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 560, height: 300 } });
await p.setContent(`<body style="margin:0;background:#0d0817;font-family:system-ui;color:#cbd5e1">
<div style="display:flex;gap:32px;align-items:flex-end;padding:28px">
  ${[16, 24, 32, 48, 64].map((s) => `<div style="text-align:center"><img src="http://localhost:5173/logo.svg" width="${s}" height="${s}"><div style="font-size:10px;margin-top:8px">${s}px</div></div>`).join('')}
</div>
<div style="display:flex;gap:20px;padding:0 28px 20px;align-items:center">
  <div style="background:#fff;padding:10px;border-radius:6px"><img src="http://localhost:5173/logo.svg" width="32" height="32"></div>
  <div style="background:#f1f5f9;padding:10px;border-radius:6px"><img src="http://localhost:5173/logo.svg" width="16" height="16"></div>
  <div style="background:#1e293b;padding:10px;border-radius:6px"><img src="http://localhost:5173/logo.svg" width="32" height="32"></div>
  <div style="background:#cbd5e1;padding:10px;border-radius:6px"><img src="http://localhost:5173/logo.svg" width="24" height="24"></div>
</div>
</body>`);
await p.waitForTimeout(700);
await p.screenshot({ path: 'screens/test/logo-sheet.png' });
const h = await b.newPage({ viewport: { width: 1280, height: 800 } });
await h.goto('http://localhost:5173');
await h.waitForLoadState('networkidle');
await h.locator('.brand').first().screenshot({ path: 'screens/test/logo-brand.png' });
await h.locator('.brand-mark').first().screenshot({ path: 'screens/test/logo-mark.png' });
await b.close();
console.log('ok');
