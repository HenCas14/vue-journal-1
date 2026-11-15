// Miniatura del video 002
THEME.outline = 0;
const SCENE = { duration: 1, fps: 1 };
SCENE.render = function (ctx) {
  const t = 0.4;
  sceneDesert(ctx, t, { heat: 1, sunX: 1500, sunY: 260 });
  ctx.fillStyle = 'rgba(120,30,0,0.25)'; ctx.fillRect(0, 0, W, H);
  leo(ctx, 620, 1520, 2.3, { t, open: 0.75, red: 0.9, bags: 1, frazzle: 0.8, eyeSize: 1.3, pupil: 0.5, mouth: 'o', mouthOpen: 0.8, handR: [140, -360], noShadow: true });
  // botella vacía en la mano
  ctx.save(); ctx.translate(620 + 140 * 2.3, 1520 - 420 * 2.3); ctx.rotate(-0.3); ctx.fillStyle = 'rgba(255,255,255,0.55)'; rrect(ctx, -70, -220, 140, 300, 40); ctx.fill(); ctx.fillStyle = FLAT.coral; rrect(ctx, -40, -270, 80, 60, 14); ctx.fill(); ctx.restore();
  ctx.save(); ctx.translate(1440, 420); ctx.rotate(-0.05);
  text(ctx, '¿3 DÍAS?', 0, 0, { size: 230, fill: '#fff' });
  ctx.restore();
  ctx.save(); ctx.translate(1440, 760); ctx.rotate(-0.03); card(ctx, -380, -85, 760, 170, '#0077b6', 85); text(ctx, 'SIN AGUA', 0, 0, { size: 120, fill: '#fff', lw: 0, shadow: false }); ctx.restore();
};
