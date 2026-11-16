const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => {
  const [escena, modo, out] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.resolve('animacion/motor/pagina.html') + '?escena=' + escena + '&modo=' + modo);
  await p.waitForFunction('window.READY === true');
  const u = await p.evaluate(() => frameData(0, 'image/png')); fs.writeFileSync(out, Buffer.from(u.split(',')[1], 'base64')); await b.close();
})();
