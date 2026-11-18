import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 720, height: 260 }, deviceScaleFactor: 3 });
await p.setContent(`<body style="margin:0;background:#0d0817;font-family:system-ui;color:#94a3b8">
<div style="display:flex;gap:26px;align-items:center;padding:26px">
  ${[16, 22, 32, 64, 120].map((s) => `<div style="text-align:center"><img src="http://localhost:5173/logo-mark.svg" width="${s}" height="${s}"><div style="font-size:10px;margin-top:6px">${s}</div></div>`).join('')}
</div>
<div style="display:flex;gap:14px;align-items:center;padding:0 26px">
  <span style="display:inline-flex;align-items:center;gap:8px;font-family:Georgia;letter-spacing:.16em;text-transform:uppercase;font-size:12px;color:#fcd34d;padding:6px 14px 6px 10px;border:1px solid rgba(245,158,11,.35);border-radius:999px;background:rgba(245,158,11,.07)"><img src="http://localhost:5173/logo-mark.svg" width="22" height="22">GuillotineVote</span>
  <span style="display:inline-flex;align-items:center;gap:8px;font-family:Georgia;letter-spacing:.16em;text-transform:uppercase;font-size:12px;color:#fcd34d;padding:6px 14px 6px 10px;border:1px solid rgba(245,158,11,.35);border-radius:999px;background:rgba(245,158,11,.07)"><img src="http://localhost:5173/logo.svg" width="22" height="22">GuillotineVote</span>
</div>
</body>`);
await p.waitForTimeout(600);
await p.screenshot({ path: 'screens/test/logo-preview.png' });
await b.close();
console.log('ok');
