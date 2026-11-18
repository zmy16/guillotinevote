import { chromium } from 'playwright';
const icons = ['mdi:vote','game-icons:ballot','game-icons:gavel','game-icons:scales','mdi:sword-cross','mdi:scale-balance','mdi:account-group','mdi:close-octagon-outline','mdi:shield-remove-outline','game-icons:guillotine'];
const b = await chromium.launch();
const p = await b.newPage();
await p.setContent('<div id="root"></div>');
await p.addScriptTag({ type: 'module', content: `
import { Icon } from 'https://esm.sh/@iconify/react';
import React from 'https://esm.sh/react';
` }).catch(() => {});
await b.close();
// simpler: fetch API bodies directly
for (const i of icons) {
  const [pre, name] = i.split(':');
  const r = await fetch(`https://api.iconify.design/${pre}.json?icons=${name}`);
  const d = await r.json();
  const body = d?.icons?.[name]?.body || '';
  const paths = (body.match(/<(path|g|circle|rect|ellipse|polygon|line)\b/g) || []).length;
  console.log(`${paths ? 'OK ' : 'BAD'} ${i} elements=${paths}`);
}
