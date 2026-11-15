// Muestrario de personajes propuestos (8 s): idle → susto → vuelven a la calma y "hablan"
const SCENE = { duration: 8, fps: 30 };
const SHOCK = 3.0, CALM = 4.9;
SCENE.sfx = [
  ...[0.3, 0.5, 0.7, 0.9].map((t, i) => ({ t, type: 'pop', vol: 0.7, pitch: 0.9 + i * 0.15 })),
  { t: SHOCK, type: 'impact', vol: 0.7 }, { t: SHOCK + 0.02, type: 'boing', vol: 0.9 },
  { t: CALM, type: 'sparkle', vol: 0.5 },
];
SCENE.music = [[0, 0.25], [2.9, 0.25], [3.0, 0.08], [4.8, 0.08], [5.0, 0.25], [7.6, 0.25], [8, 0]];
const CAST = [
  ['A · TEO', drawTeo, '#ff9f68'], ['B · MICHI', drawMichi, '#ffd23f'], ['C · PIP', drawPip, '#7cc6ff'], ['D · PROFE BÚHO', drawBuho, '#b9a8ff'],
];
SCENE.render = function (ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#4b3bd1'); g.addColorStop(1, '#2a1d7a');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(W / 2, H * 0.55); ctx.rotate(t * 0.15); ctx.fillStyle = 'rgba(255,255,255,0.05)';
  for (let i = 0; i < 12; i++) { ctx.rotate(Math.PI / 6); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1500, -150); ctx.lineTo(1500, 150); ctx.fill(); }
  ctx.restore();
  floaters(ctx, t, { n: 40, color: 'rgba(255,255,255,0.6)', size: 4, speed: 25 });
  // piso
  ctx.fillStyle = '#20165e'; ctx.beginPath(); ctx.ellipse(W / 2, 1010, 1100, 120, 0, 0, Math.PI * 2); ctx.fill();
  text(ctx, 'ELIGE AL PERSONAJE DEL CANAL', W / 2, 90 + Math.sin(t * 2) * 5, { size: 70, fill: '#ffd23f' });
  const shock = t > SHOCK && t < CALM ? ease.out(prog(t, SHOCK, SHOCK + 0.15)) * (1 - prog(t, CALM - 0.3, CALM)) : 0;
  CAST.forEach(([name, fn, col], i) => {
    const x = 270 + i * 460, s0 = ease.back(prog(t, 0.3 + i * 0.2, 0.8 + i * 0.2));
    if (s0 <= 0) return;
    const c = (t * 0.37 + i * 0.29) % 1, open = c < 0.05 ? Math.abs(c / 0.025 - 1) : 1;
    const talk = t > CALM + 0.4 ? Math.abs(Math.sin(t * 11 + i)) * (Math.sin(t * 2.3 + i) > 0 ? 1 : 0) : 0;
    const e = { t: t + i, open: shock ? 1 : open, shock, look: shock ? [0, 0] : [Math.sin(t * 0.8 + i) * 0.6, Math.sin(t * 0.6 + i) * 0.3], talk };
    const jx = shock ? Math.sin(t * 60 + i) * 5 : 0;
    fn(ctx, x + jx, 900 - shock * 30, 0.95 * s0, e);
    exclaim(ctx, x + 120, 330, t, SHOCK + i * 0.05, '!');
    text(ctx, name, x, 1000, { size: 54, fill: col });
  });
};
