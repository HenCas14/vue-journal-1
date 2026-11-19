// SHORT — ¿Y si una IA fuera más lista que todos los humanos? (vertical 1080×1920)
THEME.outline = 0;
const V = crearVideo({ voces: ['audio/short-ia-parte1.mp3'], final: 1.6, inicio: 0.25 });
const SCENE = V.SCENE, SHOTS = V.SHOTS;
const { shot, fx, PS, PE, SS, L } = V; const WD = V.W;
const CX = W / 2;
const skyBg = (ctx, t) => { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#02030f'); g.addColorStop(0.6, '#0b1030'); g.addColorStop(1, '#2a1f5c'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); starfield(ctx, t, 180); };

// 1. ¿Y si mañana una IA fuera MÁS lista que todos los humanos juntos?
{
  const a = 0, ia = WD(0, 0, 'inteligencia'), mas = WD(0, 0, 'MÁS'), hum = WD(0, 0, 'humanos');
  fx(0.3, 'impact', 0.4, 0.7); fx(ia, 'sparkle', 0.7); fx(mas, 'boing', 0.8, 0.8); fx(hum, 'pop', 0.6);
  shot(a, (ctx, lt, d, t) => {
    skyBg(ctx, t);
    popIn(ctx, t, 0.3, CX, 230, () => { text(ctx, '¿Y SI MAÑANA', 0, -60, { size: 96, fill: '#fff' }); text(ctx, 'UNA IA...', 0, 60, { size: 120, fill: FLAT.mint }); });
    const grow = ease.back(L(t, ia, ia + 0.8)), big = 1 + 0.25 * ease.back(L(t, mas, mas + 0.5));
    if (t > ia) aiCore(ctx, CX, 640, 170 * grow * big, t, { mood: t > mas ? 'happy' : 'surprised' });
    if (t > mas) popIn(ctx, t, mas, CX, 960, () => { ctx.rotate(-0.05 + Math.sin(t * 6) * 0.02); text(ctx, '¡MÁS LISTA', 0, -50, { size: 110, fill: FLAT.accent }); text(ctx, 'QUE TODOS!', 0, 60, { size: 100, fill: '#fff' }); });
    // multitud de humanos (íconos) que aparece
    if (t > hum) for (let i = 0; i < 18; i++) { const k = ease.back(L(t, hum + i * 0.03, hum + i * 0.03 + 0.4)); if (k <= 0) continue; const x = 90 + (i % 9) * 112, y = 1210 + Math.floor(i / 9) * 110 + Math.sin(t * 4 + i) * 6; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); iconPerson(ctx, 0, 0, 1.1, ['#ff6b5b', '#ffd23f', '#7cc6ff', '#5ee0c0', '#ff8fab'][i % 5]); ctx.restore(); }
    leo(ctx, CX, 1960, 1.1, E(t, { mouth: t > mas ? 'o' : 'smile', mouthOpen: 0.5, shock: t > mas ? 0.4 * (1 - L(t, mas + 0.5, mas + 1.2)) : 0, eyeSize: t > mas ? 1.25 : 1, look: [0, -1], handL: t > mas ? [-62, -420] : null, handR: t > mas ? [62, -420] : null }));
    if (t > mas) exclaim(ctx, CX + 210, 1520, t, mas);
  }, { quiet: true });
}
// 2. Nadie se daría cuenta
{
  const a = PS(0, 1), nadie = WD(0, 1, 'nadie');
  fx(nadie, 'crickets', 0.6); fx(a + 0.3, 'pop', 0.5);
  shot(a, (ctx, lt, d, t) => {
    sceneStreetDay(ctx, t);
    // gente pasando como si nada
    [[PEOPLE.amigo1, 1], [PEOPLE.adulto, -1], [PEOPLE.randy, 1]].forEach(([P, dir], i) => { const x = ((t * 140 * dir + i * 420) % 1500 + 1500) % 1500 - 210; drawPerson(ctx, x, 1340 + i * 18, 0.62, E(t + i, { walk: t * 2.6 + i, flip: dir < 0, mouth: 'smile', hold: i === 0 ? 'phone' : null }), P); });
    popIn(ctx, t, a + 0.2, CX, 250, () => { card(ctx, -440, -80, 880, 160, '#fff', 50); text(ctx, 'PRIMERO...', 0, 0, { size: 90, fill: FLAT.ink, lw: 0, shadow: false }); });
    if (t > nadie) popIn(ctx, t, nadie, CX, 470, () => { text(ctx, '¡NADIE SE', 0, -60, { size: 110, fill: FLAT.accent }); text(ctx, 'DARÍA CUENTA!', 0, 60, { size: 100, fill: '#fff' }); });
    leo(ctx, CX, 1960, 1.1, E(t, { mouth: 'flat', look: [Math.sin(t * 2), 0], handL: [-140, -300], handR: [140, -300] }));
  });
}
// 3. No un robot en la calle, sino un edificio lleno de computadoras
{
  const a = SS(0, 1, 1), robot = WD(0, 1, 'robot'), sino = WD(0, 1, 'sino'), edif = WD(0, 1, 'edificio');
  fx(robot, 'pop', 0.6); fx(robot + 0.6, 'impact', 0.6, 1.2); fx(sino, 'whoosh', 0.6); fx(edif, 'sparkle', 0.7);
  shot(a, (ctx, lt, d, t) => {
    if (t < sino) {
      sceneStreetDay(ctx, t);
      popIn(ctx, t, robot, CX, 1180, () => robotHelper(ctx, 0, 0, 1.5, t, { move: true }));
      crossOut(ctx, CX, 820, 300, L(t, robot + 0.5, robot + 0.9));
      popIn(ctx, t, a + 0.1, CX, 230, () => text(ctx, '¿UN ROBOT?', 0, 0, { size: 120, fill: '#fff' }));
    } else {
      sceneDataCenter(ctx, t);
      aiCore(ctx, CX, 780, 150 * ease.back(L(t, edif, edif + 0.7)) + 0.01, t, { mood: 'happy' });
      popIn(ctx, t, sino + 0.1, CX, 220, () => { text(ctx, 'UN EDIFICIO LLENO', 0, -55, { size: 84, fill: '#fff' }); text(ctx, 'DE COMPUTADORAS', 0, 55, { size: 88, fill: FLAT.mint }); });
      leo(ctx, CX, 1960, 1.1, E(t, { mouth: 'o', mouthOpen: 0.4, look: [0, -1], eyeSize: 1.15 }));
    }
  });
}
// 4. Medicinas nuevas y problemas de siglos
{
  const a = PS(0, 2), med = WD(0, 2, 'medicinas'), prob = WD(0, 2, 'problemas'), sig = WD(0, 2, 'siglos');
  fx(med, 'pop', 0.7); fx(med + 0.3, 'pop', 0.5, 1.3); fx(prob, 'ding', 0.6); fx(sig, 'sparkle', 0.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#06d6a0', '#118ab2', 6); rays(ctx, t, CX, 700, 'rgba(255,255,255,0.08)');
    aiCore(ctx, CX, 260, 110, t, { mood: 'happy', talk: 1 });
    popIn(ctx, t, med, 290, 640, () => { card(ctx, -230, -200, 460, 400, '#fff', 40); protein(ctx, 0, -50, 0.75, t, 3); pillIcon(ctx, 0, 120, 0.7, t); });
    popIn(ctx, t, prob, 790, 640, () => { card(ctx, -230, -200, 460, 400, '#fff', 40); text(ctx, 'x² + y²', 0, -90, { size: 64, fill: FLAT.purple, lw: 0, shadow: false }); text(ctx, '= ???', 0, 0, { size: 64, fill: FLAT.coral, lw: 0, shadow: false }); if (t > sig) bigCheck(ctx, 0, 110, 1 + 0.2 * ease.back(L(t, sig, sig + 0.4)), true); });
    if (t > sig) burst(ctx, 790, 750, t, sig, FLAT.accent);
    popIn(ctx, t, sig, CX, 1000, () => { card(ctx, -380, -60, 760, 120, FLAT.accent, 60); text(ctx, 'SIGLOS SIN RESPUESTA', 0, 0, { size: 58, fill: FLAT.ink, lw: 0, shadow: false }); });
    leo(ctx, CX, 1960, 1.1, E(t, { mouth: 'grin', handR: [150, -330 - Math.abs(Math.sin(t * 3)) * 80], look: [0, -1] }));
  });
}
// 5. La gran pregunta: ¿lo que queremos o lo que le dijimos?
{
  const a = SS(0, 2, 1), preg = WD(0, 2, 'pregunta'), quer = WD(0, 2, 'queremos'), dij = SS(0, 2, 2);
  fx(preg, 'impact', 0.5, 0.8); fx(quer, 'pop', 0.7); fx(dij, 'boing', 0.7, 0.8);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#3a0ca3', '#240046', 7);
    drawPerson(ctx, 260, 1960, 1.0, E(t, { mouth: 'flat', look: [1, -0.5], handR: [40, -385], talk: t < preg ? talking(t) : 0 }), PEOPLE.cientifica);
    if (t > preg) questionMarks(ctx, t, 300, 1280, 3, FLAT.accent);
    aiCore(ctx, 760, 1420, 120, t, { mood: t > dij ? 'surprised' : 'think', look: [-1, 0] });
    popIn(ctx, t, a + 0.1, CX, 200, () => { text(ctx, 'LA GRAN', 0, -55, { size: 96, fill: '#fff' }); text(ctx, 'PREGUNTA', 0, 55, { size: 120, fill: FLAT.accent }); });
    popIn(ctx, t, quer, CX, 520, () => { card(ctx, -420, -90, 840, 180, '#fff', 40); text(ctx, 'LO QUE QUEREMOS', 0, 0, { size: 66, fill: '#2d6a4f', lw: 0, shadow: false }); });
    popIn(ctx, t, dij, CX, 780, () => { ctx.rotate(Math.sin(t * 5) * 0.02); card(ctx, -420, -90, 840, 180, '#ffe3e0', 40); text(ctx, 'LO QUE LE DIJIMOS', 0, 0, { size: 62, fill: '#c1121f', lw: 0, shadow: false }); });
    if (t > dij) { text(ctx, '≠', CX, 650, { size: 110, fill: FLAT.coral }); }
  }, { mood: 'tense' });
}
// 6. Miles de expertos trabajan en hacerla segura
{
  const a = PS(0, 3), seg = WD(0, 3, 'segura');
  fx(a + 0.3, 'pop', 0.5); fx(seg, 'ding', 0.8); fx(seg + 0.1, 'sparkle', 0.6);
  shot(a, (ctx, lt, d, t) => {
    sceneDataCenter(ctx, t);
    aiCore(ctx, CX, 640, 140, t, { mood: 'happy' });
    if (t > seg) shieldIcon(ctx, CX, 640, 1.5 * ease.back(L(t, seg, seg + 0.5)) + 0.01, t);
    [[PEOPLE.cientifica, 220], [PEOPLE.medico, CX], [PEOPLE.amigo2, 860]].forEach(([P, x], i) => popIn(ctx, t, a + 0.3 + i * 0.25, x, 1780, () => drawPerson(ctx, 0, 0, 0.75, E(t + i, { mouth: 'smile', handR: i === 1 ? [130, -500] : [110, -300], hold: i === 2 ? 'book' : null, look: [0, -1] }), P)));
    popIn(ctx, t, a + 0.2, CX, 200, () => { text(ctx, 'MILES DE EXPERTOS', 0, -55, { size: 84, fill: '#fff' }); text(ctx, 'LA HACEN SEGURA', 0, 55, { size: 92, fill: FLAT.mint }); });
  }, { mood: 'happy' });
}
// 7. ¿Día por día? → video completo
{
  const a = SS(0, 3, 1), dia = WD(0, 3, 'día'), full = SS(0, 3, 2);
  fx(dia, 'pop', 0.6); fx(dia + 0.4, 'pop', 0.6, 1.2); fx(full, 'sparkle', 0.8); fx(full + 0.1, 'boing', 0.6, 1.2);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#ff9f1c', '#ff6b5b', 8); rays(ctx, t, CX, 700, 'rgba(255,255,255,0.12)');
    if (t < full) {
      const v = 1 + Math.floor(Math.max(0, t - dia) * 3);
      popIn(ctx, t, a + 0.1, CX, 230, () => { text(ctx, '¿DÍA', 0, -55, { size: 110, fill: '#fff' }); text(ctx, 'POR DÍA?', 0, 60, { size: 120, fill: FLAT.accent }); });
      popIn(ctx, t, dia - 0.2, CX, 720, () => calendarV(ctx, 0, 0, 1.2, 'DÍA', Math.min(v, 9), FLAT.purple));
      aiCore(ctx, 860, 1100, 80, t, { mood: 'happy' });
    } else {
      aiCore(ctx, CX, 560, 170, t, { mood: 'happy', talk: 1 });
      popIn(ctx, t, full, CX, 220, () => { ctx.rotate(Math.sin(t * 4) * 0.03); text(ctx, 'VIDEO COMPLETO', 0, 0, { size: 104, fill: '#fff' }); });
      popIn(ctx, t, full + 0.4, CX, 960, () => { card(ctx, -360, -70, 720, 140, FLAT.ink, 70); text(ctx, 'EN EL CANAL 👆', 0, 0, { size: 66, fill: FLAT.accent, lw: 0, shadow: false }); });
    }
    leo(ctx, CX, 1960, 1.1, E(t, { mouth: 'grin', talk: talking(t), handR: [150, -470], rot: Math.sin(t * 6) * 0.03 }));
  });
}
V.terminar();
