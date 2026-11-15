// Miniatura del video 003
THEME.outline = 0;
const SCENE = { duration: 1, fps: 1 };
SCENE.render = function (ctx) {
  const t = 0.4;
  sceneCityNight(ctx, t, { lights: 0, stars: 0.9 });
  // mitad izquierda todavía iluminada, cortada en diagonal (ciudad que se apaga)
  ctx.save(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(560, 0); ctx.lineTo(360, H); ctx.lineTo(0, H); ctx.clip(); sceneCityNight(ctx, t, { lights: 1, stars: 0 }); ctx.restore();
  ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(560, 0); ctx.lineTo(360, H); ctx.stroke();
  leo(ctx, 760, 1560, 2.2, { t, open: 1, shock: 1, eyeSize: 1.35, pupil: 0.45, mouth: 'o', mouthOpen: 1, handL: [-150, -520], handR: [150, -360], noShadow: true });
  flashlight(ctx, 760 + 150 * 2.2, 1560 - 360 * 2.2, 1.1, t, true);
  ctx.save(); ctx.translate(1470, 380); ctx.rotate(-0.04); text(ctx, '72 HORAS', 0, 0, { size: 190, fill: '#ffd23f' }); ctx.restore();
  ctx.save(); ctx.translate(1470, 680); ctx.rotate(-0.03); card(ctx, -360, -90, 720, 180, '#ef233c', 90); text(ctx, 'SIN LUZ', 0, 0, { size: 130, fill: '#fff', lw: 0, shadow: false }); ctx.restore();
};
