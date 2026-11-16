// MODELOS BASE del canal (referencia visual del estándar PRO). ?modo=personaje|expresiones|fondos|objetos
THEME.outline = 0;
const SCENE = { duration: 4, fps: 30 };
const MODO = new URLSearchParams(location.search).get('modo') || 'personaje';
const lab = (ctx, s, x, y, size = 40) => text(ctx, s, x, y, { size, fill: '#1d1830', lw: 0, shadow: false });
SCENE.render = function (ctx, t0) {
  const t = t0 + 0.6;
  if (MODO === 'personaje') {
    ctx.fillStyle = '#f4f7fb'; ctx.fillRect(0, 0, W, H);
    text(ctx, 'LEO · MODELO BASE', 400, 70, { size: 64, fill: '#2f6fde' });
    leo(ctx, 400, 1010, 1.55, E(t, { open: 1, mouth: 'grin' }));
    const poses = [['SALUDA', { handR: [140, -470], mouth: 'grin' }], ['SEÑALA', { handR: [190, -330], look: [1, 0], talk: 1 }], ['PIENSA', { handR: [40, -385], look: [0.6, -0.8], mouth: 'flat' }], ['SUSTO', { shock: 1, eyeSize: 1.3, mouth: 'o', mouthOpen: 1 }], ['CAMINA', { walk: true }], ['SOSTIENE', { hold: 'coffee', handR: [110, -300] }]];
    poses.forEach(([n, e], i) => { const x = 900 + (i % 3) * 340, y = 470 + Math.floor(i / 3) * 530; leo(ctx, x, y, 0.78, E(t + i, Object.assign({ open: 1 }, e))); lab(ctx, n, x, y + 34, 30); });
    lab(ctx, 'Anclas: pies (0,0) · hombros (±54,-322) · cabeza (0,-425) · alto ≈ 500 px', 400, 1055, 22);
  } else if (MODO === 'expresiones') {
    ctx.fillStyle = '#f4f7fb'; ctx.fillRect(0, 0, W, H);
    const ex = [['FELIZ', { mouth: 'grin' }], ['HABLA', { talk: 1 }], ['SORPRESA', { shock: 0.8, mouth: 'o', mouthOpen: 0.8, eyeSize: 1.3 }], ['CANSADO', { red: 0.8, bags: 1, open: 0.5, mouth: 'wobbly', frazzle: 0.5 }], ['CURIOSO', { look: [0.8, -0.6], mouth: 'flat' }], ['ENOJADO', { angry: 1, mouth: 'angry' }], ['MAREADO', { spiral: true, mouth: 'wobbly', eyeSize: 1.2 }], ['TRISTE', { mouth: 'sad', open: 0.7 }], ['BOSTEZO', { mouth: 'yawn', mouthOpen: 1, open: 0.15 }], ['DORMIDO', { open: 0, mouth: 'smile' }]];
    ex.forEach(([n, e], i) => { const x = 210 + (i % 5) * 375, y = 300 + Math.floor(i / 5) * 500; ctx.save(); ctx.beginPath(); rrect(ctx, x - 160, y - 230, 320, 330, 30); ctx.clip(); ctx.fillStyle = '#e3eaf5'; ctx.fillRect(x - 160, y - 230, 320, 330); leo(ctx, x, y + 640, 1.5, Object.assign({ t, open: 1, noShadow: true }, e)); ctx.restore(); lab(ctx, n, x, y + 140, 38); });
    const sec = ['randy', 'adulto', 'cientifica', 'medico', 'amigo1', 'amigo2', 'andreas'];
    text(ctx, 'EXPRESIONES', 960, 40, { size: 50, fill: '#2f6fde' });
  } else if (MODO === 'secundarios') {
    ctx.fillStyle = '#f4f7fb'; ctx.fillRect(0, 0, W, H); text(ctx, 'PERSONAJES SECUNDARIOS', 960, 70, { size: 60, fill: '#2f6fde' });
    ['randy', 'adulto', 'cientifica', 'medico', 'amigo1', 'amigo2', 'andreas'].forEach((k, i) => { const x = 170 + i * 265; drawPerson(ctx, x, 880, 0.95, E(t + i, { open: 1, mouth: i % 2 ? 'grin' : 'smile', talk: i % 3 ? 0 : 1 }), PEOPLE[k]); lab(ctx, k.toUpperCase(), x, 950, 34); });
  } else if (MODO === 'fondos') {
    const P = [['CIUDAD ENCENDIDA', c => sceneCityNight(c, t, { lights: 1 })], ['CIUDAD EN APAGÓN', c => sceneCityNight(c, t, { lights: 0 })], ['SALA (LUZ)', c => { sceneLivingRoom(c, t, { lights: 1 }); leo(c, 820, 1000, 1.1, E(t, { open: 1 })); }], ['SALA (APAGÓN)', c => { sceneLivingRoom(c, t, { lights: 0 }); leo(c, 820, 1000, 1.1, E(t, { open: 1, shock: 0.5 })); c.fillStyle = 'rgba(5,5,25,0.62)'; c.fillRect(0, 0, W, H); }], ['CALLE DE DÍA', c => { sceneStreetDay(c, t); leo(c, 960, 1000, 1.05, E(t, { walk: true })); }], ['FONDO ABSTRACTO', c => { bgFlat(c, t, '#4361ee', '#3a0ca3', 3); rays(c, t, W / 2, H / 2); card(c, 660, 380, 600, 320, '#fff', 40); text(c, 'TARJETA', 960, 540, { size: 90, fill: '#3a0ca3', lw: 0, shadow: false }); }]];
    ctx.fillStyle = '#111'; ctx.fillRect(0, 0, W, H);
    P.forEach(([n, f], i) => { const x = (i % 3) * 640, y = 180 + Math.floor(i / 3) * 360; ctx.save(); ctx.beginPath(); ctx.rect(x + 3, y + 3, 634, 354); ctx.clip(); ctx.translate(x, y); ctx.scale(1 / 3, 1 / 3); f(ctx); ctx.restore(); text(ctx, n, x + 320, y + 34, { size: 30, fill: FLAT.accent }); });
    text(ctx, 'FONDOS · MODELOS BASE', 960, 90, { size: 70, fill: '#fff' });
  } else {
    ctx.fillStyle = '#03040f'; ctx.fillRect(0, 0, W, H); starfield(ctx, t, 200);
    globeGrids(ctx, 420, 430, 300, t * 4, { independent: false }); sunFlare(ctx, 1150, 330, 190, t);
    bigPhone(ctx, 1640, 420, 1.1, t, { time: '9:41', battery: 0.72 });
    flashlight(ctx, 300, 900, 1, t, true); candle(ctx, 760, 990, 0.9, t); radioIcon(ctx, 1100, 900, 0.8, t); cashIcon(ctx, 1500, 900, 0.9, t);
    text(ctx, 'PLANETA · SOL · OBJETOS', 960, 60, { size: 60, fill: '#fff' });
  }
  if (MODO !== 'personaje' && MODO !== 'expresiones' && MODO !== 'secundarios') postFX(ctx, t);
};
