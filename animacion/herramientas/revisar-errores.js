const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.resolve('animacion/motor/pagina.html') + '?escena=' + process.argv[2]);
  await p.waitForFunction('window.READY === true');
  const r = await p.evaluate(() => { const errs = []; for (let t = 0; t < SCENE.duration; t += 0.25) { try { renderAt(t); } catch (e) { errs.push(t.toFixed(2) + ' ' + e.message); if (errs.length > 5) break; } } return errs; });
  console.log(r.length ? r.join('\n') : 'sin errores'); await b.close();
})();
