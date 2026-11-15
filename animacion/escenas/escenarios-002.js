// Vista previa de los escenarios nuevos del video 002 (6 paneles)
THEME.outline = 0;
const SCENE = { duration: 6, fps: 30 };
const P = [
  ['COCINA SIN AGUA', (c, t) => { sceneKitchen(c, t, { drip: true, heat: 0.3 }); leo(c, 760, 1000, 1.15, E(t, { mouth: 'o', mouthOpen: 0.5, handR: [120, -420], look: [1, -0.3], shock: 0.4 })); }],
  ['DESIERTO', (c, t) => { sceneDesert(c, t); leo(c, 760, 1000, 1.15, E(t, { red: 0.3, mouth: 'wobbly', handL: [-60, -420], walk: true })); }],
  ['DENTRO DE LA SANGRE', (c, t) => sceneBlood(c, t, { thick: 0.5, heart: true })],
  ['CELDA 1979', (c, t) => { sceneCell(c, t, { bars: false }); drawPerson(c, 1080, 1000, 1.1, E(t, { mouth: 'sad', red: 0.4, bags: 0.6, look: [1, -0.5] }), PEOPLE.andreas); retroOverlay(c, t); }],
  ['MAR ABIERTO', (c, t) => { sceneSea(c, t); leo(c, 960, 840 + Math.sin(t * 1.5) * 15, 1.0, E(t, { mouth: 'o', mouthOpen: 0.4, look: [-1, 0.5], noShadow: true })); raft(c, 960, 860, t); }],
  ['OASIS Y CAMELLO', (c, t) => { sceneOasis(c, t); camel(c, 650, 980, 1.2, t, { walk: true }); }],
];
SCENE.render = function (ctx, t) {
  ctx.fillStyle = '#111'; ctx.fillRect(0, 0, W, H);
  P.forEach(([name, fn], i) => {
    const x = (i % 3) * 640, y = 180 + Math.floor(i / 3) * 360;
    ctx.save(); ctx.beginPath(); ctx.rect(x + 3, y + 3, 634, 354); ctx.clip(); ctx.translate(x, y); ctx.scale(1 / 3, 1 / 3);
    fn(ctx, t + i);
    ctx.restore();
    text(ctx, name, x + 320, y + 34, { size: 34, fill: FLAT.accent });
  });
};
