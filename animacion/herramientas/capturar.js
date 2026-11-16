const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => {
  const [escena, outdir, ...times] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => { console.error('ERR', e.message); });
  await p.goto('file://' + path.resolve('animacion/motor/pagina.html') + '?escena=' + escena);
  await p.waitForFunction('window.READY === true', null, { timeout: 10000 });
  for (const t of times) { const u = await p.evaluate(t => frameData(t, 'image/jpeg'), Number(t)); fs.writeFileSync(`${outdir}/t${t}.jpg`, Buffer.from(u.split(',')[1], 'base64')); }
  await b.close();
})();
