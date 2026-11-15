// Muestrario de humanos en 4 estilos de animación distintos (10 s)
const SCENE = { duration: 10, fps: 30 };
const SHOCK = 3.5, CALM = 5.5;
SCENE.sfx = [
  ...[0.2, 0.45, 0.7, 0.95].map((t, i) => ({ t, type: 'pop', vol: 0.7, pitch: 0.9 + i * 0.15 })),
  { t: SHOCK, type: 'impact', vol: 0.7 }, { t: SHOCK + 0.02, type: 'boing', vol: 0.9 },
  { t: CALM, type: 'sparkle', vol: 0.5 }, { t: 9.3, type: 'whoosh', vol: 0.4, pitch: 0.7 },
];
SCENE.music = [[0, 0.22], [3.4, 0.22], [3.5, 0.07], [5.4, 0.07], [5.6, 0.22], [9.5, 0.22], [10, 0]];
const PANELS = [
  ['A · CARICATURA', bgCaricatura, drawSofi, 0.95, 'SOFI', '#ffffff'],
  ['B · PLANO MODERNO', bgPlano, drawLeo, 0.95, 'LEO', '#2f6fde'],
  ['C · SILUETA CINEMÁTICA', bgCine, drawMax, 0.95, 'MAX', '#ffd6a0'],
  ['D · PAPEL RECORTADO', bgPapel, drawAna, 0.95, 'ANA', '#ffffff'],
];
SCENE.render = function (ctx, t) {
  ctx.fillStyle = '#120c26'; ctx.fillRect(0, 0, W, H);
  const shock = t > SHOCK && t < CALM ? ease.out(prog(t, SHOCK, SHOCK + 0.15)) * (1 - prog(t, CALM - 0.3, CALM)) : 0;
  PANELS.forEach(([label, bg, draw, s, name, col], i) => {
    const px = (i % 2) * 960, py = Math.floor(i / 2) * 540;
    const ap = ease.back(prog(t, 0.2 + i * 0.25, 0.7 + i * 0.25)); if (ap <= 0) return;
    ctx.save(); ctx.translate(px + 480, py + 270); ctx.scale(ap, ap); ctx.translate(-480, -270);
    ctx.beginPath(); ctx.rect(6, 6, 948, 528); ctx.clip();
    bg(ctx, t);
    const c = (t * 0.37 + i * 0.29) % 1, open = c < 0.05 ? Math.abs(c / 0.025 - 1) : 1;
    const talk = t > CALM + 0.3 ? Math.abs(Math.sin(t * 11 + i)) * (Math.sin(t * 2.3 + i) > 0 ? 1 : 0) : 0;
    const e = { t: t + i * 0.7, open: shock ? 1 : open, shock, look: shock ? [0, 0] : [Math.sin(t * 0.8 + i) * 0.6, Math.sin(t * 0.6 + i) * 0.3], talk };
    const sx = shock && i !== 3 ? Math.sin(t * 60 + i) * 4 : 0;
    const charY = i === 1 ? 500 : 500, scale = i === 1 ? 0.8 : i === 2 ? 0.98 : s;
    draw(ctx, 480 + sx, charY, scale, e);
    exclaim(ctx, 620, 150, t, SHOCK + i * 0.05, '!');
    text(ctx, label, 24, 42, { size: 38, fill: '#ffd23f', align: 'left' });
    text(ctx, name, 936, 500, { size: 46, fill: col, align: 'right' });
    ctx.restore();
  });
};
