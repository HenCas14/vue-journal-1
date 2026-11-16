const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => {
  const [escena, outdir, frac] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + path.resolve('animacion/motor/pagina.html') + '?escena=' + escena);
  await p.waitForFunction('window.READY === true', null, { timeout: 15000 }).catch(() => {});
  if (errs.length) { console.log('ERRORES:', errs.join('\n')); }
  const info = await p.evaluate(() => ({ dur: SCENE.duration, shots: SHOTS.map(s => [s.a, s.b]) }));
  console.log('duración', info.dur.toFixed(1), 'tomas', info.shots.length);
  let i = 0;
  for (const [a, bb] of info.shots) {
    const t = a + (bb - a) * Number(frac || 0.6);
    try { const u = await p.evaluate(t => frameData(t, 'image/jpeg'), t); fs.writeFileSync(`${outdir}/s${String(i).padStart(2, '0')}.jpg`, Buffer.from(u.split(',')[1], 'base64')); }
    catch (e) { console.log('toma', i, 't=', t.toFixed(1), e.message.split('\n')[0]); }
    i++;
  }
  if (errs.length) console.log('ERRORES2:', errs.slice(0, 5).join('\n'));
  await b.close();
})();
