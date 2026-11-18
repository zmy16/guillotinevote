import { chromium } from 'playwright';
const b = await chromium.launch();
const errs = [];
// desktop setup
const p = await b.newPage({ viewport: { width: 1280, height: 1400 } });
p.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
p.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 160)); });
await p.goto('http://localhost:5173');
await p.waitForLoadState('networkidle');
await p.click('text=Dinner Dilemma');
await p.waitForSelector('#option-0');
const cols = await p.evaluate(() => {
  const g = document.querySelectorAll('.field-grid');
  return [...g].map((el) => ({
    cols: getComputedStyle(el).gridTemplateColumns.split(' ').length,
    width: Math.round(el.getBoundingClientRect().width)
  }));
});
console.log('field-grid:', JSON.stringify(cols));
const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log('desktop overflowX:', overflow);
await p.screenshot({ path: 'screens/test/setup-desktop.png', fullPage: true });

// FAQ open answer width
await p.goto('http://localhost:5173');
await p.waitForLoadState('networkidle');
await p.locator('.faq-question').first().click();
await p.waitForTimeout(300);
const widths = await p.evaluate(() => {
  const item = document.querySelector('.faq-item');
  const ans = item.querySelector('.faq-answer');
  return {
    box: Math.round(item.getBoundingClientRect().width),
    answer: Math.round(ans.getBoundingClientRect().width)
  };
});
console.log('faq widths:', JSON.stringify(widths));
await p.locator('.faq-item').first().screenshot({ path: 'screens/test/faq-open.png' });

// mobile setup
const m = await b.newPage({ viewport: { width: 390, height: 844 } });
m.on('pageerror', (e) => errs.push('MOBILE PAGEERROR ' + e.message));
await m.goto('http://localhost:5173');
await m.waitForLoadState('networkidle');
await m.click('text=Dinner Dilemma');
await m.waitForSelector('#option-0');
const mo = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const mcols = await m.evaluate(() => [...document.querySelectorAll('.field-grid')].map((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length));
console.log('mobile overflowX:', mo, 'cols:', JSON.stringify(mcols), 'small:', await m.evaluate(() => [...document.querySelectorAll('button,input,summary')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.height < 44 || r.width < 44) && !e.closest('.backdrop-hills'); }).map((e) => (e.className || e.tagName) + ':' + Math.round(e.getBoundingClientRect().height)).slice(0, 8)));
await m.screenshot({ path: 'screens/test/setup-mobile.png', fullPage: true });
console.log('errors:', errs.length ? errs.join(' | ') : 'none');
await b.close();
