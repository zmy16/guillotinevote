import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage();
await p.goto('http://localhost:5173');
await p.waitForTimeout(1500);
const r = await p.evaluate(() => [...document.querySelectorAll('.backdrop-bat')].map(n => n.getAttribute('transform') || n.outerHTML.slice(0, 120)));
console.log(r);
await b.close();
