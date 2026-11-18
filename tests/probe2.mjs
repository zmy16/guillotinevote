const cands = ['mdi:ballot','mdi:ballot-outline','mdi:vote-outline','mdi:counter','mdi:gavel','mdi:thumb-down','mdi:hand-back-left','mdi:skull','mdi:file-document-outline'];
for (const i of cands) {
  const [pre, name] = i.split(':');
  const d = await (await fetch(`https://api.iconify.design/${pre}.json?icons=${name}`)).json();
  const body = d?.icons?.[name]?.body || '';
  const n = (body.match(/<(path|g|circle|rect|ellipse|polygon|line)\b/g) || []).length;
  console.log(`${n ? 'OK ' : 'BAD'} ${i} elements=${n}`);
}
