THEME.outline = 0;
const SCENE = { duration: 4, fps: 30 };
SCENE.render = function (ctx, t0) {
  const t = t0 + 1.2, P = [
    ['IA', c => { c.fillStyle = '#02030f'; c.fillRect(0, 0, W, H); starfield(c, t, 200); aiCore(c, W / 2, H / 2, 260, t, { mood: 'happy', talk: 1 }); }],
    ['CENTRO DE DATOS', c => { sceneDataCenter(c, t); aiCore(c, W / 2, H * 0.42, 120, t, {}); }],
    ['LABORATORIO', c => { sceneLab(c, t); drawPerson(c, 760, 1000, 1.05, E(t, { open: 1, talk: 1, handR: [140, -420] }), PEOPLE.cientifica); }],
    ['CAJA NEGRA', c => { bgFlat(c, t, '#1d1830', '#0b0820', 2); blackBox(c, W / 2, 640, 1.3, t, 0.7); }],
    ['PROTEÍNA', c => { bgFlat(c, t, '#023047', '#001d3d', 3); protein(c, W / 2, H / 2, 2, t); }],
    ['AJEDREZ / GO / ORO', c => { bgFlat(c, t, '#3a0ca3', '#240046', 4); chessBoard(c, 420, 620, 1, t); goBoard(c, 1100, 620, 0.9, t); goldMedal(c, 1650, 500, 1.1, t); }],
    ['MIDAS', c => { scenePalace(c, t, 0.6); drawPerson(c, 760, 1000, 1.1, E(t, { open: 1, mouth: 'grin', handR: [130, -330] }), { skin: '#f1c27d', skinD: '#d9a861', shirt: '#9d0208', shirtD: '#6a040f', pants: '#3c096c', hair: '#5c3a21', hairStyle: 'crew' }); crownOn(c, 760, 1000 - 510 * 1.1, 1.1); c.save(); c.translate(1250, 760); goldify(c, 0.8, cc => apple(cc, 0, 0, 1.4)); c.restore(); }],
    ['ROBOT CAFÉ', c => { sceneLivingRoom(c, t, { lights: 1 }); robotHelper(c, 1100, 1000, 1.2, t, { coffee: true, armUp: 0.3 }); offButton(c, 500, 900, 0.9, t, 0); }],
    ['SALÓN', c => { sceneClassroom(c, t); leo(c, 500, 1080, 1.05, E(t, { open: 1, mouth: 'grin' })); tablet(c, 1200, 780, 1.1, t); }],
  ];
  ctx.fillStyle = '#111'; ctx.fillRect(0, 0, W, H);
  P.forEach(([n, f], i) => { const x = (i % 3) * 640, y = Math.floor(i / 3) * 360; ctx.save(); ctx.beginPath(); ctx.rect(x + 3, y + 3, 634, 354); ctx.clip(); ctx.translate(x, y); ctx.scale(1 / 3, 1 / 3); f(ctx); ctx.restore(); text(ctx, n, x + 320, y + 32, { size: 30, fill: FLAT.accent }); });
};
