// Hoja de personaje de Leo (referencia para foto de perfil y miniaturas)
THEME.outline = 0;
const SCENE = { duration: 1, fps: 1 };
const MODE = new URLSearchParams(location.search).get('modo') || 'hoja';
SCENE.render = function (ctx) {
  const t = 0.35;
  if (MODE === 'hoja') {
    ctx.fillStyle = '#f4f7fb'; ctx.fillRect(0, 0, W, H);
    text(ctx, 'CURIOSO LEO', 520, 90, { size: 96, fill: '#2f6fde' });
    leo(ctx, 520, 1010, 1.6, { t, open: 1, mouth: 'grin', handR: [120, -330] });
    const ex = [['FELIZ', { mouth: 'grin' }], ['SORPRENDIDO', { shock: 0.8, mouth: 'o', mouthOpen: 0.8, eyeSize: 1.3 }], ['CANSADO', { red: 0.8, bags: 1, open: 0.5, mouth: 'wobbly', frazzle: 0.5 }], ['CURIOSO', { look: [0.8, -0.6], mouth: 'flat', handR: [40, -380] }], ['ENOJADO', { angry: 1, mouth: 'angry' }], ['MAREADO', { spiral: true, mouth: 'wobbly', eyeSize: 1.2 }]];
    ex.forEach(([n, e], i) => {
      const x = 1110 + (i % 3) * 270, y = 330 + Math.floor(i / 3) * 330;
      ctx.save(); ctx.beginPath(); ctx.rect(x - 130, y - 210, 260, 260); ctx.clip();
      ctx.fillStyle = '#e3eaf5'; ctx.fillRect(x - 130, y - 210, 260, 260);
      leo(ctx, x, y + 520, 1.25, Object.assign({ t, open: 1, noShadow: true }, e)); ctx.restore();
      text(ctx, n, x, y + 85, { size: 34, fill: '#1d1830', lw: 0, shadow: false });
    });
    const pal = [['PIEL', '#a86b3c'], ['SUDADERA', '#2f6fde'], ['PANTALÓN', '#1f2a44'], ['PELO', '#1b1b1b'], ['ACENTO', '#ffd23f'], ['CORAL', '#ff6b5b']];
    pal.forEach(([n, c], i) => { const x = 1060 + i * 140; ctx.fillStyle = c; rrect(ctx, x - 50, 860, 100, 100, 20); ctx.fill(); text(ctx, n, x, 990, { size: 24, fill: '#1d1830', lw: 0, shadow: false }); text(ctx, c, x, 1025, { size: 22, fill: '#6c757d', lw: 0, shadow: false }); });
  } else if (MODE === 'perfil') {
    const g = ctx.createRadialGradient(960, 540, 50, 960, 540, 700); g.addColorStop(0, '#ffe066'); g.addColorStop(1, '#ffb703'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    rays(ctx, 0.4, 960, 540, 'rgba(255,255,255,0.18)', 18);
    leo(ctx, 960, 1560, 2.6, { t, open: 1, mouth: 'grin', look: [0.4, -0.3], noShadow: true, handR: [60, -470] });
    text(ctx, '?', 1240, 230, { size: 200, fill: '#2f6fde' });
  } else { // leo solo, fondo transparente
    const e = { feliz: { mouth: 'grin', handR: [120, -330] }, sorprendido: { shock: 0.8, mouth: 'o', mouthOpen: 0.8, eyeSize: 1.3 }, cansado: { red: 0.8, bags: 1, open: 0.5, mouth: 'wobbly', frazzle: 0.5 } }[MODE] || {};
    leo(ctx, 960, 1040, 1.9, Object.assign({ t, open: 1, noShadow: true }, e));
  }
};
