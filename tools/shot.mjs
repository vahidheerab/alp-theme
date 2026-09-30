import fs from 'node:fs';

const CDP = process.env.CDP || 'http://127.0.0.1:9222';

async function newTarget() {
  for (const method of ['PUT', 'GET']) {
    try {
      const r = await fetch(`${CDP}/json/new?about:blank`, { method });
      if (r.ok) return r.json();
    } catch {}
  }
  throw new Error('cannot create target');
}

const arg = (process.argv[2] || '').replace(/^﻿/, '');
const jobs = JSON.parse(arg.trim().startsWith('[') ? arg : fs.readFileSync(arg, 'utf8').replace(/^﻿/, ''));

for (const j of jobs) {
  const t = await newTarget();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });
  let id = 0;
  const pending = new Map();
  const send = (method, params = {}) =>
    new Promise((res, rej) => {
      const m = ++id;
      pending.set(m, { res, rej });
      ws.send(JSON.stringify({ id: m, method, params }));
    });
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const p = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? p.rej(new Error(msg.error.message)) : p.res(msg.result);
    }
  };

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: j.width,
    height: j.height,
    deviceScaleFactor: j.dsf || 1,
    mobile: !!j.mobile,
    screenWidth: j.width,
    screenHeight: j.height,
  });
  await send('Page.navigate', { url: j.url });
  await new Promise((r) => setTimeout(r, j.wait || 2600));
  if (j.eval) {
    const r = await send('Runtime.evaluate', { expression: j.eval, awaitPromise: true, returnByValue: true });
    if (r.result && r.result.value !== undefined) console.log('eval:', JSON.stringify(r.result.value));
  }
  if (j.after) await new Promise((r) => setTimeout(r, j.after));
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(j.out, Buffer.from(shot.data, 'base64'));
  ws.close();
  await fetch(`${CDP}/json/close/${t.id}`).catch(() => {});
  console.log('ok', j.out);
}
