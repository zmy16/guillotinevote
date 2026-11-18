import { chromium } from 'playwright';
const b = await chromium.launch();
const errs = [];
const p = await b.newPage({ viewport: { width: 1280, height: 1200 } });
p.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
p.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 160)); });
await p.goto('http://localhost:5173');
await p.waitForLoadState('networkidle');

const n = await p.locator('.faq-item').count();
const heading = await p.locator('#faq-heading').textContent();
console.log('faq items:', n, '| heading:', heading.trim());

// open one
await p.locator('.faq-question').first().click();
await p.waitForTimeout(300);
const open = await p.locator('.faq-item').first().evaluate((el) => el.open);
const ansVisible = await p.locator('.faq-answer').first().isVisible();
console.log('open:', open, 'answer visible:', ansVisible);

// favicon declared
const icons = await p.evaluate(() => [...document.querySelectorAll('link[rel*=icon]')].map((l) => l.getAttribute('href')));
console.log('icons:', icons.join(','));

// favicon actually loads
const status = await p.evaluate(async () => (await fetch('/logo.svg')).status);
console.log('logo.svg status:', status);

const faq = await p.locator('.faq-list');
await faq.screenshot({ path: 'screens/test/faq.png' });

// mobile check
const m = await b.newPage({ viewport: { width: 390, height: 844 } });
await m.goto('http://localhost:5173');
await m.waitForLoadState('networkidle');
const ov = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log('mobile overflowX:', ov);
await m.locator('.faq-question').nth(1).click();
await m.waitForTimeout(300);
await m.locator('.faq-list').screenshot({ path: 'screens/test/faq-mobile.png' });

console.log('errors:', errs.length ? errs.join(' | ') : 'none');
await b.close();
