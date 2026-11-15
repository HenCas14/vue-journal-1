// Uso: node animacion/motor/render.js <escena> [salida.mp4] [--desde s] [--hasta s] [--fps n]
// Renderiza la escena cuadro por cuadro y la codifica con ffmpeg (sin audio). Guarda también <salida>.sfx.json.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path'); const fs = require('fs');

(async () => {
  const args = process.argv.slice(2);
  const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? Number(args[i + 1]) : d; };
  const escena = args[0];
  const out = path.resolve(args[1] && !args[1].startsWith('--') ? args[1] : `renders/${escena}-video.mp4`);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => { console.error('Error en la escena:', e.message); process.exit(1); });
  await page.goto('file://' + path.join(__dirname, 'pagina.html') + '?escena=' + escena);
  await page.waitForFunction('window.READY === true');
  const meta = await page.evaluate(() => ({ duration: SCENE.duration, fps: SCENE.fps, sfx: SCENE.sfx || [], music: SCENE.music || [], ambience: SCENE.ambience || [], voice: SCENE.voice || [], moods: SCENE.moods || [] }));
  const fps = opt('--fps', meta.fps), t0 = opt('--desde', 0), t1 = opt('--hasta', meta.duration);
  fs.writeFileSync(out.replace(/\.mp4$/, '.sfx.json'), JSON.stringify(meta, null, 1));
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round((t1 - t0) * fps);
  for (let f = 0; f < n; f++) {
    const url = await page.evaluate(t => frameData(t, 'image/jpeg'), t0 + f / fps);
    const buf = Buffer.from(url.split(',')[1], 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % fps === 0) process.stdout.write(`\r${(f / fps).toFixed(0)}s / ${(n / fps).toFixed(0)}s`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  await browser.close(); console.log(`\nVideo: ${out}`);
})();
