// Miniatura del video 004 — IA más lista que los humanos
THEME.outline = 0;
const SCENE = { duration: 1, fps: 1 };
SCENE.render = function (ctx) {
  const t = 0.4;
  sceneDataCenter(ctx, t);
  ctx.fillStyle = 'rgba(5,8,30,0.35)'; ctx.fillRect(0, 0, W, H);
  aiCore(ctx, 1380, 460, 260, t, { mood: 'happy' });
  leo(ctx, 560, 1560, 2.2, { t, open: 1, shock: 1, eyeSize: 1.35, pupil: 0.45, mouth: 'o', mouthOpen: 1, look: [1, -0.4], handL: [-110, -260], handR: [150, -420], noShadow: true });
  ctx.save(); ctx.translate(1380, 860); ctx.rotate(-0.04); card(ctx, -470, -100, 940, 200, FLAT.accent, 100); text(ctx, '¿MÁS LISTA QUE TÚ?', 0, 0, { size: 104, fill: FLAT.ink, lw: 0, shadow: false }); ctx.restore();
  ctx.save(); ctx.translate(1380, 110); text(ctx, 'IA', 0, 0, { size: 150, fill: '#fff', stroke: '#3a0ca3', lw: 16 }); ctx.restore();
  if (typeof postFX === 'function') postFX(ctx, t, {});
};
