// Miniatura del video 001 (se exporta un solo cuadro)
THEME.outline = 0;
const SCENE = { duration: 1, fps: 1 };
SCENE.render = function (ctx, t) {
  t = 0.37;
  const g = ctx.createRadialGradient(700, 540, 50, 700, 540, 1300); g.addColorStop(0, '#7b2cbf'); g.addColorStop(1, '#10002b');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  rays(ctx, 0.5, 620, 560, 'rgba(255,255,255,0.07)', 18);
  // Leo desvelado
  leo(ctx, 600, 1500, 2.35, { t, open: 1, red: 1, bags: 1, frazzle: 1, eyeSize: 1.45, pupil: 0.45, mouth: 'o', mouthOpen: 0.7, hold: 'coffee', handR: [150, -330], noShadow: true });
  // tazas apiladas
  for (let i = 0; i < 3; i++) drawCoffee(ctx, 150 + (i % 2) * 30, 1010 - i * 150, t + i, 1.7);
  ctx.save(); ctx.translate(1450, 360); ctx.rotate(-0.06);
  text(ctx, 'DÍA', 0, -150, { size: 170, fill: '#fff' });
  text(ctx, '11', 0, 90, { size: 400, fill: FLAT.accent });
  ctx.restore();
  ctx.save(); ctx.translate(1450, 830); ctx.rotate(-0.04);
  card(ctx, -390, -85, 780, 170, FLAT.coral, 85);
  text(ctx, 'SIN DORMIR', 0, 0, { size: 120, fill: '#fff', lw: 0, shadow: false });
  ctx.restore();
  text(ctx, '!', 1000, 230, { size: 260, fill: FLAT.accent });
};
