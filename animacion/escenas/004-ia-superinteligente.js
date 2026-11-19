// VIDEO 004 — ¿Qué pasaría si una IA superara la inteligencia humana hoy mismo? (estándar PRO)
THEME.outline = 0;
const V = crearVideo({ voces: [1, 2, 3, 4, 5].map(i => `audio/004-parte${i}.mp3`), hueco: 0.7, final: 19 });
const SCENE = V.SCENE, SHOTS = V.SHOTS;
const { shot, fx, PS, PE, SS, L } = V; const WD = V.W;
const TX = 860; // x de títulos cuando hay contador
const C_ = (s) => () => s;
const titleTwo = (ctx, t, at, a, b, cb = FLAT.accent, x = W / 2, y = 150, sa = 84, sb = 100) => popIn(ctx, t, at, x, y, () => { text(ctx, a, 0, -50, { size: sa, fill: '#fff' }); text(ctx, b, 0, 55, { size: sb, fill: cb }); });
const pill = (ctx, t, at, x, y, str, bg = '#fff', col = FLAT.ink, w = 560, size = 56) => popIn(ctx, t, at, x, y, () => { card(ctx, -w / 2, -60, w, 120, bg, 60); text(ctx, str, 0, 0, { size, fill: col, lw: 0, shadow: false }); });
const space = (ctx, t) => { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#02030f'); g.addColorStop(0.6, '#0b1030'); g.addColorStop(1, '#2a1f5c'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); starfield(ctx, t, 200); };

// ======================= PARTE 1: ¿qué tan lista es la IA hoy? =======================
{ // 1. Despiertas y en las noticias…
  const a = 0, not = WD(0, 0, 'noticias'), ia = WD(0, 0, 'inteligencia'), mas = WD(0, 0, 'MÁS'), jun = WD(0, 0, 'juntos');
  fx(0.3, 'yawn', 0.5); fx(not, 'ding', 0.7, 1.4); fx(ia, 'pop', 0.6); fx(mas, 'impact', 0.8); fx(mas + 0.05, 'boing', 0.8, 0.7); fx(jun, 'sparkle', 0.6);
  shot(a, (ctx, lt, d, t) => {
    sceneSunrise(ctx, t, 0.4 + 0.6 * L(t, 0, 6));
    const sh = t > mas ? 1 - L(t, mas + 0.4, mas + 1.4) : 0;
    leo(ctx, 640, 1010, 1.15, E(t, { mouth: t < not ? 'yawn' : t > mas ? 'o' : 'smile', mouthOpen: 0.6, open: t < not ? 0.45 : 1, shock: sh * 0.7, eyeSize: t > mas ? 1.3 : 1, hold: 'phone', handR: [110, -340], look: [0.6, -0.2], handL: t < not ? [-60, -460] : null }));
    if (t > not) popIn(ctx, t, not, 1280, 470, () => { ctx.rotate(Math.sin(t * 2) * 0.03); bigPhone(ctx, 0, 0, 1.15, t, { time: '7:00' }); ctx.fillStyle = '#c1121f'; rrect(ctx, -150, -150, 300, 70, 16); ctx.fill(); text(ctx, 'NOTICIA', 0, -115, { size: 44, fill: '#fff', lw: 0, shadow: false }); if (t > ia) aiCore(ctx, 0, 30, 80 * ease.back(L(t, ia, ia + 0.6)) + 0.01, t, { mood: 'happy' }); });
    if (t > mas) { popIn(ctx, t, mas, 1280, 120, () => text(ctx, '¡MÁS LISTA QUE TODOS!', 0, 0, { size: 96, fill: FLAT.accent })); exclaim(ctx, 820, 430, t, mas); }
    if (t < not) zzz(ctx, t, 760, 420);
  }, { quiet: true, mood: 'mystery' });
}
{ // 2. Preguntas
  const a = PS(0, 1), q1 = SS(0, 1, 0), q2 = SS(0, 1, 1), q3 = SS(0, 1, 2), q4 = SS(0, 1, 3);
  [q1, q2, q3, q4].forEach((s, i) => fx(s, 'pop', 0.6, 1 + i * 0.12));
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#5a189a', '#240046', 11); rays(ctx, t, 960, 520, 'rgba(255,255,255,0.05)');
    aiCore(ctx, 960, 470, 150, t, { mood: 'think', look: [Math.sin(t), 0] });
    pill(ctx, t, q1, 420, 230, '¿QUÉ PASARÍA?', '#fff', FLAT.purple, 520);
    pill(ctx, t, q2, 1500, 230, '¿NOS DARÍAMOS CUENTA?', '#fff', FLAT.ink, 660, 50);
    pill(ctx, t, q3, 420, 720, '¿ALGO BUENO… 😊', '#d8f3dc', '#2d6a4f', 520);
    pill(ctx, t, q4, 1500, 720, '…O PREOCUPANTE? 😟', '#ffe3e0', '#c1121f', 600, 52);
    questionMarks(ctx, t, 960, 760, 3, FLAT.accent);
  });
}
{ // 3. Paso a paso, con datos reales y sin terror
  const a = PS(0, 2), datos = SS(0, 2, 1), terror = WD(0, 2, 'terror');
  const steps = ['MINUTO', 'HORA', 'DÍA', 'SEMANA', 'MES', 'AÑO'];
  steps.forEach((s, i) => fx(a + 0.8 + i * 0.45, 'pop', 0.5, 0.9 + i * 0.1)); fx(datos, 'ding', 0.6); fx(terror, 'impact', 0.6, 1.2);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#0096c7', '#023e8a', 12);
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 10; ctx.lineCap = 'round'; const k = L(t, a + 0.6, a + 3.4); ctx.beginPath(); ctx.moveTo(180, 330); ctx.lineTo(180 + 1560 * k, 330); ctx.stroke();
    steps.forEach((s, i) => popIn(ctx, t, a + 0.8 + i * 0.45, 210 + i * 300, 330, () => { ctx.fillStyle = ['#ffd23f', '#ff6b5b', '#5ee0c0', '#7cc6ff', '#8b7bff', '#ff8fab'][i]; ctx.beginPath(); ctx.arc(0, 0, 90, 0, Math.PI * 2); ctx.fill(); text(ctx, s, 0, 0, { size: s.length > 4 ? 34 : 42, fill: FLAT.ink, lw: 0, shadow: false }); }));
    if (t > datos) {
      popIn(ctx, t, datos, 600, 640, () => { card(ctx, -260, -120, 520, 240, '#fff', 40); text(ctx, '📊 DATOS', 0, -30, { size: 70, fill: '#0077b6', lw: 0, shadow: false }); text(ctx, 'REALES', 0, 50, { size: 60, fill: '#0077b6', lw: 0, shadow: false }); bigCheck(ctx, 230, -110, 1, true); });
      popIn(ctx, t, terror - 0.3, 1320, 640, () => { card(ctx, -260, -120, 520, 240, '#1d1830', 40); text(ctx, '🎬 TERROR', 0, -10, { size: 66, fill: '#adb5bd', lw: 0, shadow: false }); crossOut(ctx, 0, 0, 120, L(t, terror, terror + 0.5)); });
    }
    leo(ctx, 960, 1080, 0.85, E(t, { mouth: 'grin', talk: talking(t), handR: [150, -470] }));
  }, { mood: 'happy' });
}
{ // 4. ¿Qué tan lista es hoy? Olimpiada 2025
  const a = PS(0, 3), oly = SS(0, 3, 1), oro = WD(0, 3, 'oro'), ano = WD(0, 3, 'dos');
  fx(a + 0.3, 'whoosh', 0.5); fx(ano, 'pop', 0.6); fx(oro, 'sparkle', 0.9); fx(oro + 0.05, 'ding', 0.7);
  shot(a, (ctx, lt, d, t) => {
    if (t < oly) {
      bgFlat(ctx, t, '#06d6a0', '#118ab2', 13);
      gauge(ctx, 1250, 520, 230, 0.2 + 0.6 * L(t, a + 0.3, oly), 'INTELIGENCIA', FLAT.purple);
      leo(ctx, 620, 1000, 1.15, E(t, { mouth: 'smile', look: [1, -0.3], handR: [40, -385] }));
      titleTwo(ctx, t, a + 0.2, '¿QUÉ TAN LISTA', 'ES LA IA HOY?', FLAT.accent, 960, 140);
      return;
    }
    sceneStage(ctx, t);
    podium(ctx, 960, 900, 1, t);
    aiCore(ctx, 960, 560, 95, t, { mood: 'happy', talk: 0.5 });
    if (t > oro) goldMedal(ctx, 960, 400 + 220 * (1 - ease.back(L(t, oro, oro + 0.6))), 0.55, t);
    popIn(ctx, t, ano, 960, 110, () => { card(ctx, -540, -60, 1080, 120, '#fff', 60); text(ctx, '2025 · OLIMPIADA DE MATEMÁTICAS', 0, 0, { size: 56, fill: FLAT.purple, lw: 0, shadow: false }); });
    for (const [x, P] of [[300, PEOPLE.amigo1], [1620, PEOPLE.amigo2]]) drawPerson(ctx, x, 1060, 0.85, E(t + x, { mouth: t > oro ? 'o' : 'smile', look: [x < 960 ? 1 : -1, -0.5], handR: t > oro ? [130, -500] : null, handL: t > oro ? [-130, -500] : null }), P);
  }, { mood: 'happy' });
}
{ // 5. Cinco estudiantes perfectos… ¡y la IA no!
  const a = SS(0, 3, 2), cinco = WD(0, 3, 'cinco'), no = SS(0, 3, 3);
  for (let i = 0; i < 5; i++) fx(cinco + 0.3 + i * 0.22, 'pop', 0.5, 1 + i * 0.1); fx(no, 'boing', 0.8, 0.8); fx(no + 0.3, 'pop', 0.4, 1.5);
  shot(a, (ctx, lt, d, t) => {
    sceneStage(ctx, t);
    const people = [PEOPLE.amigo1, PEOPLE.cientifica, PEOPLE.randy, PEOPLE.adulto, PEOPLE.amigo2];
    people.forEach((P, i) => popIn(ctx, t, cinco + 0.3 + i * 0.22, 330 + i * 315, 1000, () => { drawPerson(ctx, 0, 0, 0.8, E(t + i, { mouth: 'grin', handR: [130, -480 + Math.sin(t * 6 + i) * 20], rot: Math.sin(t * 5 + i) * 0.03 }), P); text(ctx, '100', 0, -470, { size: 56, fill: FLAT.accent }); }));
    titleTwo(ctx, t, a + 0.2, '5 HUMANOS', '¡CALIFICACIÓN PERFECTA!', FLAT.mint, 960, 130);
    if (t > no) popIn(ctx, t, no, 1650, 380, () => { aiCore(ctx, 0, 0, 90, t, { mood: 'surprised' }); text(ctx, '¡LA IA NO!', 0, 170, { size: 60, fill: FLAT.coral }); });
  });
}
{ // 6. Ajedrez y Go… solo UNA cosa
  const a = PS(0, 4), go = WD(0, 4, 'dieciseis'), una = SS(0, 4, 1);
  fx(a + 0.3, 'pop', 0.6); fx(go, 'pop', 0.7, 1.2); fx(una, 'impact', 0.6, 1.3);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#3a0ca3', '#240046', 14); rays(ctx, t, 960, 600, 'rgba(255,255,255,0.04)');
    if (t < una) {
      popIn(ctx, t, a + 0.3, 520, 620, () => { chessBoard(ctx, 0, 0, 1.1, t); text(ctx, 'AJEDREZ', 0, -320, { size: 70, fill: '#fff' }); });
      if (t > go) popIn(ctx, t, go, 1400, 620, () => { goBoard(ctx, 0, 0, 1, t - go); text(ctx, '2016 · GO', 0, -320, { size: 70, fill: FLAT.accent }); });
      if (t > go + 1) aiCore(ctx, 1400, 380 + Math.sin(t * 3) * 20, 60, t, { mood: 'happy' });
    } else {
      aiCore(ctx, 960, 470, 130, t, { mood: 'think' });
      popIn(ctx, t, una, 960, 150, () => text(ctx, 'SOLO SABÍAN HACER', 0, 0, { size: 80, fill: '#fff' }));
      popIn(ctx, t, una + 0.4, 960, 770, () => { ctx.rotate(Math.sin(t * 4) * 0.04); card(ctx, -220, -100, 440, 200, FLAT.accent, 50); text(ctx, 'UNA COSA', 0, 0, { size: 84, fill: FLAT.ink, lw: 0, shadow: false }); });
      chessBoard(ctx, 380, 760, 0.45, t); goBoard(ctx, 1540, 760, 0.42, t);
    }
  });
}
{ // 7. Cómo aprende: bibliotecas enteras en semanas
  const a = PS(0, 5), lee = SS(0, 5, 1), bib = SS(0, 5, 2), sem = SS(0, 5, 3);
  fx(lee, 'whoosh', 0.5); for (let i = 0; i < 6; i++) fx(lee + 0.5 + i * 0.6, 'ff', 0.15, 1.6, { dur: 0.3 }); fx(bib, 'sparkle', 0.6); fx(sem, 'boing', 0.7, 1.1);
  shot(a, (ctx, lt, d, t) => {
    sceneLibrary(ctx, t);
    aiCore(ctx, 960, 470, 120 + 20 * L(t, lee, sem), t, { mood: t > sem ? 'surprised' : 'happy' });
    if (t > lee) for (let i = 0; i < 14; i++) { const p = ((t - lee) * 0.45 + i / 14) % 1, side = i % 2 ? 1 : -1; const x = lerp(960 + side * 900, 960, p), y = lerp(300 + (i % 5) * 120, 470, p) - Math.sin(p * Math.PI) * 140; ctx.save(); ctx.globalAlpha = Math.min(1, (1 - p) * 3); flyingBook(ctx, x, y, 0.8 - 0.5 * p, t + i, ['#e63946', '#457b9d', '#2a9d8f', '#e9c46a', '#8b7bff'][i % 5]); ctx.restore(); }
    titleTwo(ctx, t, a + 0.2, '¿CÓMO APRENDE', 'UNA IA?', FLAT.accent, 960, 120);
    if (t > lee) pill(ctx, t, lee + 0.3, 960, 760, 'TEXTOS · IMÁGENES · EJEMPLOS', '#fff', FLAT.ink, 900, 52);
    if (t > sem) popIn(ctx, t, sem, 1560, 650, () => calendarV(ctx, 0, 0, 0.8, 'SEMANAS', 3, FLAT.coral));
  });
}
{ // 8. Inteligencia general vs superinteligencia
  const a = PS(0, 6), gen = SS(0, 6, 1), sup = SS(0, 6, 2), todo = SS(0, 6, 3);
  fx(gen, 'pop', 0.7); fx(sup, 'impact', 0.6, 0.9); fx(sup + 0.1, 'sparkle', 0.7); fx(todo, 'pop', 0.5, 1.3);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#1d3557', '#0b1a2e', 15);
    titleTwo(ctx, t, a + 0.2, 'DOS IDEAS', 'DISTINTAS', FLAT.mint, 960, 120);
    popIn(ctx, t, gen, 520, 560, () => { card(ctx, -360, -260, 720, 520, '#fff', 40); text(ctx, 'INTELIGENCIA GENERAL', 0, -200, { size: 46, fill: '#0077b6', lw: 0, shadow: false }); drawPerson(ctx, -150, 200, 0.55, E(t, { mouth: 'smile' }), PEOPLE.adulto); text(ctx, '=', 0, 20, { size: 110, fill: FLAT.ink, lw: 0, shadow: false }); aiCore(ctx, 160, 20, 80, t, { mood: 'happy', face: true }); });
    popIn(ctx, t, sup, 1400, 560, () => { card(ctx, -360, -260, 720, 520, '#1d1830', 40); text(ctx, 'SUPERINTELIGENCIA', 0, -200, { size: 50, fill: FLAT.accent, lw: 0, shadow: false }); aiCore(ctx, 160, 20, 110 + 10 * Math.sin(t * 3), t, { mood: 'happy' }); text(ctx, '>', -20, 20, { size: 110, fill: '#fff', lw: 0, shadow: false }); for (let i = 0; i < 9; i++) iconPerson(ctx, -280 + (i % 3) * 70, -40 + Math.floor(i / 3) * 90, 0.7, ['#ff6b5b', '#ffd23f', '#7cc6ff'][i % 3]); });
    if (t > todo) pill(ctx, t, todo, 1400, 870, '…EN CASI TODO', FLAT.accent, FLAT.ink, 480, 52);
  });
}
const TITLE_AT = PE(0, 6) + 0.1, TITLE_LEN = 3.0;
{ // TÍTULO
  const a = TITLE_AT; fx(a - 0.1, 'whoosh', 0.8); fx(a + 0.4, 'sparkle', 0.6); [0.6, 0.9, 1.2].forEach((d, i) => fx(a + d, 'pop', 0.5, 0.9 + i * 0.15));
  V.musicExtra.push([a - 0.2, 0.14], [a, 0.26], [a + TITLE_LEN - 0.2, 0.26], [a + TITLE_LEN, 0.14]);
  shot(a, (ctx, lt, d, t) => {
    space(ctx, t);
    aiCore(ctx, 960, 700, 170 * ease.back(prog(lt, 0.8, 1.5)) + 0.01, t, { mood: 'happy' });
    const lines = [['¿QUÉ PASARÍA SI UNA IA', 92, '#ffffff', 200], ['SUPERARA A LOS HUMANOS HOY?', 100, FLAT.accent, 330]]; let k = 0;
    lines.forEach(([str, size, fill, y], li) => { ctx.font = `${size}px Lilita`; const total = ctx.measureText(str).width; let x = W / 2 - total / 2; [...str].forEach(ch => { const w = ctx.measureText(ch).width, s = pop(lt, 0.2 + k * 0.02 + li * 0.15, 0.6); if (s > 0 && ch !== ' ') { ctx.save(); ctx.translate(x + w / 2, y + Math.sin(lt * 4 - k * 0.45) * 8); ctx.scale(s, s); text(ctx, ch, 0, 0, { size, fill }); ctx.restore(); } x += w; k++; }); });
  }, { trans: 'wipe', quiet: true, mood: 'mystery' });
}

// ======================= PARTE 2: minuto 1 a día 1 =======================
{ // 9. ¿Cuándo? Los expertos no se ponen de acuerdo
  const a = Math.max(TITLE_AT + TITLE_LEN, PS(1, 0) - 0.2), pocos = SS(1, 0, 2), dec = SS(1, 0, 3), cam = SS(1, 0, 4);
  fx(pocos, 'pop', 0.7); fx(dec, 'pop', 0.7, 0.8); fx(cam, 'boing', 0.5, 1.2);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#ffb703', '#fb8500', 16); rays(ctx, t, 960, 500, 'rgba(255,255,255,0.1)');
    titleTwo(ctx, t, a + 0.1, '¿CUÁNDO', 'PODRÍA PASAR?', '#fff', 960, 130, 84, 96);
    // línea del tiempo
    ctx.fillStyle = '#fff'; rrect(ctx, 200, 520, 1520, 20, 10); ctx.fill(); ['2026', '2030', '2040', '2050', '2070', '¿?'].forEach((s, i) => { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(250 + i * 284, 530, 18, 0, Math.PI * 2); ctx.fill(); text(ctx, s, 250 + i * 284, 470, { size: 46, fill: FLAT.ink, lw: 0, shadow: false }); });
    const mk = (x, st, str, P, col) => popIn(ctx, t, st, x, 1000, () => { drawPerson(ctx, 0, 0, 0.75, E(t + x, { mouth: 'smile', talk: talking(t + x), handR: [150, -350], look: [x < 960 ? 1 : -1, 0] }), P); bubble(ctx, 0, -500, 380, 100, str, 48, '#fff', col); });
    mk(450, pocos, '¡POCOS AÑOS!', PEOPLE.adulto, '#c1121f'); mk(1450, dec, '¡DÉCADAS!', PEOPLE.cientifica, '#0077b6');
    if (t > pocos) { const x = 250 + 284 * (0.6 + Math.sin(t * 1.4) * 0.5 + (t > dec ? 1.6 + Math.sin(t * 2) * 1.4 : 0)); glow(ctx, x, 530, 60, '#fff', 0.8); ctx.fillStyle = FLAT.coral; ctx.beginPath(); ctx.arc(x, 530, 26, 0, Math.PI * 2); ctx.fill(); }
  }, { mood: 'happy' });
}
{ // 10. Nadie lo sabe → juguemos a que pasa hoy
  const a = SS(1, 0, 5), hoy = PS(1, 1);
  fx(a + 0.2, 'pop', 0.6); fx(hoy, 'impact', 0.6, 1.1); fx(hoy + 0.1, 'sparkle', 0.8);
  shot(a, (ctx, lt, d, t) => {
    if (t < hoy) {
      bgFlat(ctx, t, '#8b7bff', '#5a189a', 17);
      leo(ctx, 960, 1000, 1.15, E(t, { mouth: 'flat', handL: [-150, -300], handR: [150, -300], look: [Math.sin(t * 2), -0.3] }));
      popIn(ctx, t, a + 0.2, 960, 160, () => { card(ctx, -420, -80, 840, 160, '#fff', 60); text(ctx, 'NADIE LO SABE 🤷', 0, 0, { size: 80, fill: FLAT.purple, lw: 0, shadow: false }); });
      questionMarks(ctx, t, 960, 420, 3, '#fff');
    } else {
      bgFlat(ctx, t, '#ff006e', '#8338ec', 18); rays(ctx, t, 960, 540, 'rgba(255,255,255,0.12)');
      speedLines(ctx, t, 0.35);
      popIn(ctx, t, hoy, 960, 300, () => { ctx.rotate(-0.05 + Math.sin(t * 6) * 0.02); text(ctx, '¡JUGUEMOS!', 0, -70, { size: 100, fill: '#fff' }); text(ctx, 'PASA HOY MISMO', 0, 60, { size: 110, fill: FLAT.accent }); });
      leo(ctx, 960, 1080, 0.95, E(t, { mouth: 'grin', handL: [-130, -520], handR: [130, -520], rot: Math.sin(t * 9) * 0.04 }));
    }
  });
}
{ // 11. Minuto uno: nadie se daría cuenta (parque)
  const a = PS(1, 2), nadie = SS(1, 2, 2), rob = WD(1, 2, 'robot');
  V.counterFirst = a + 0.2; fx(a + 0.2, 'pop', 0.9); fx(nadie, 'crickets', 0.7); fx(rob, 'pop', 0.6); fx(rob + 0.8, 'impact', 0.6, 1.2);
  shot(a, (ctx, lt, d, t) => {
    scenePark(ctx, t);
    [[PEOPLE.amigo1, 1, 0], [PEOPLE.adulto, -1, 1], [PEOPLE.randy, 1, 2], [PEOPLE.amigo2, -1, 3]].forEach(([P, dir, i]) => { const x = ((t * 110 * dir + i * 560) % 2300 + 2300) % 2300 - 190; drawPerson(ctx, x, 900 + (i % 2) * 40, 0.55, E(t + i, { walk: t * 2.4 + i, flip: dir < 0, mouth: 'smile', hold: i === 1 ? 'coffee' : i === 2 ? 'phone' : null }), P); });
    if (t < rob) { leo(ctx, 1330, 1010, 0.9, E(t, { sit: 1, mouth: 'smile', hold: 'phone', handR: [100, -330], look: [-0.5, 0] })); }
    popIn(ctx, t, a + 0.2, TX, 120, () => text(ctx, 'MINUTO 1', 0, 0, { size: 110, fill: '#fff' }));
    if (t > nadie && t < rob) popIn(ctx, t, nadie, TX, 290, () => { card(ctx, -440, -70, 880, 140, '#fff', 70); text(ctx, '¡NADIE SE DARÍA CUENTA!', 0, 0, { size: 60, fill: FLAT.ink, lw: 0, shadow: false }); });
    if (t > rob) { popIn(ctx, t, rob, 960, 860, () => robotHelper(ctx, 0, 0, 1.1, t, { move: true })); crossOut(ctx, 960, 620, 260, L(t, rob + 0.7, rob + 1.1)); popIn(ctx, t, rob, TX, 290, () => text(ctx, '¿UN ROBOT EN LA CALLE?', 0, 0, { size: 76, fill: FLAT.coral })); }
  }, { counter: C_('MINUTO 1'), mood: 'happy' });
}
{ // 12. Viviría en un centro de datos
  const a = SS(1, 2, 4), cd = WD(1, 2, 'centro'), luces = WD(1, 2, 'luces'), vent = WD(1, 2, 'ventiladores');
  fx(a + 0.2, 'whoosh', 0.6); fx(cd, 'sparkle', 0.7); fx(luces, 'blip', 0.5, 1.2); fx(vent, 'ff', 0.4, 0.6, { dur: 2.5 });
  shot(a, (ctx, lt, d, t) => {
    sceneDataCenter(ctx, t);
    aiCore(ctx, 960, 470, 150 * ease.back(L(t, cd, cd + 0.8)) + 0.01, t, { mood: 'happy' });
    popIn(ctx, t, cd, TX, 120, () => { card(ctx, -380, -60, 760, 120, '#0b1230', 60); text(ctx, 'CENTRO DE DATOS', 0, 0, { size: 66, fill: FLAT.mint, lw: 0, shadow: false }); });
    if (t > vent) for (const x of [260, 1660]) { ctx.save(); ctx.translate(x, 760); ctx.fillStyle = '#2b2f3b'; ctx.beginPath(); ctx.arc(0, 0, 110, 0, Math.PI * 2); ctx.fill(); ctx.rotate(t * 14); ctx.fillStyle = '#adb5bd'; for (let i = 0; i < 5; i++) { ctx.rotate(Math.PI * 2 / 5); ctx.beginPath(); ctx.ellipse(50, 0, 50, 20, 0.4, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
  }, { counter: C_('MINUTO 1'), mood: 'mystery' });
}
{ // 13. Hora uno: los científicos la prueban
  const a = PS(1, 3), preg = SS(1, 3, 2), resp = SS(1, 3, 3);
  fx(a + 0.1, 'pop', 0.8); for (let i = 0; i < 3; i++) fx(resp + 0.5 + i * 0.6, 'ding', 0.6, 1 + i * 0.12);
  shot(a, (ctx, lt, d, t) => {
    sceneLab(ctx, t);
    desk(ctx, 1000, 860, 760); laptop(ctx, 1000, 790, 1, t);
    drawPerson(ctx, 680, 1010, 1.0, E(t, { mouth: t > resp ? 'o' : 'smile', mouthOpen: 0.5, eyeSize: t > resp ? 1.25 : 1, talk: t > preg && t < resp ? talking(t) : 0, look: [1, 0.3], handR: [140, -300] }), PEOPLE.cientifica);
    drawPerson(ctx, 1380, 1010, 0.95, E(t + 1, { mouth: t > resp ? 'grin' : 'flat', look: [-1, 0.3], handL: t > resp ? [-62, -420] : null, handR: t > resp ? [62, -420] : null }), PEOPLE.medico);
    aiCore(ctx, 1000, 620, 55, t, { mood: 'happy', talk: t > resp ? 1 : 0 });
    popIn(ctx, t, a + 0.1, TX, 120, () => text(ctx, 'HORA 1', 0, 0, { size: 110, fill: FLAT.purple, stroke: '#fff', lw: 12 }));
    if (t > preg && t < resp) bubble(ctx, 520, 360, 380, 100, '¿Y ESTO? 🤔', 50);
    ['PROBLEMA 1', 'PROBLEMA 2', 'PROBLEMA 3'].forEach((s, i) => { if (t > resp + 0.5 + i * 0.6) popIn(ctx, t, resp + 0.5 + i * 0.6, 1540, 300 + i * 130, () => { card(ctx, -200, -50, 400, 100, '#fff', 50); text(ctx, s, -30, 0, { size: 40, fill: FLAT.ink, lw: 0, shadow: false }); bigCheck(ctx, 150, 0, 0.7, true); }); });
  }, { counter: C_('HORA 1'), mood: 'happy' });
}
{ // 14. Hora seis: ¿cómo llegaste ahí? nadie entiende por dentro
  const a = PS(1, 4), como = WD(1, 4, 'como'), det = SS(1, 4, 2);
  fx(a + 0.1, 'pop', 0.8); fx(como, 'pop', 0.6); fx(det, 'dizzy', 0.5);
  shot(a, (ctx, lt, d, t) => {
    if (t < det) {
      sceneLab(ctx, t);
      drawPerson(ctx, 700, 1010, 1.05, E(t, { mouth: 'smile', talk: talking(t), look: [1, -0.3], handR: [150, -350] }), PEOPLE.cientifica);
      aiCore(ctx, 1300, 520, 130, t, { mood: 'think' });
      popIn(ctx, t, a + 0.1, TX, 120, () => text(ctx, 'HORA 6', 0, 0, { size: 110, fill: FLAT.purple, stroke: '#fff', lw: 12 }));
      if (t > como) bubble(ctx, 700, 330, 640, 110, '¿CÓMO LLEGASTE AHÍ?', 54);
    } else {
      bgFlat(ctx, t, '#023047', '#001d3d', 19);
      // red neuronal enredada
      const r = rng(77), N = []; for (let i = 0; i < 40; i++) N.push([500 + r() * 900 + Math.sin(t + i) * 20, 220 + r() * 560 + Math.cos(t * 1.3 + i) * 20]);
      ctx.lineWidth = 2; for (let i = 0; i < N.length; i++) for (let j = i + 1; j < N.length; j++) { const dx = N[i][0] - N[j][0], dy = N[i][1] - N[j][1]; if (dx * dx + dy * dy < 200 * 200) { ctx.strokeStyle = `rgba(94,224,240,${0.15 + 0.25 * Math.abs(Math.sin(t * 3 + i + j))})`; ctx.beginPath(); ctx.moveTo(N[i][0], N[i][1]); ctx.lineTo(N[j][0], N[j][1]); ctx.stroke(); } }
      N.forEach(([x, y], i) => { const p = 0.5 + 0.5 * Math.sin(t * 4 + i); glow(ctx, x, y, 30, '#5ee0f0', 0.3 * p); ctx.fillStyle = '#e0fbff'; ctx.beginPath(); ctx.arc(x, y, 8 + p * 4, 0, Math.PI * 2); ctx.fill(); });
      questionMarks(ctx, t, 960, 480, 3, FLAT.accent);
      popIn(ctx, t, det + 0.2, TX, 110, () => { card(ctx, -520, -60, 1040, 120, '#fff', 60); text(ctx, 'NI SUS CREADORES LO ENTIENDEN', 0, 0, { size: 54, fill: FLAT.ink, lw: 0, shadow: false }); });
      drawPerson(ctx, 260, 1060, 0.9, E(t, { mouth: 'wobbly', look: [1, -0.5], handL: [-62, -420], handR: [62, -420] }), PEOPLE.medico);
    }
  }, { counter: C_('HORA 6'), mood: 'mystery' });
}
{ // 15. Cajas negras → abrir la caja
  const a = SS(1, 4, 3), abrir = WD(1, 4, 'abrir');
  fx(a + 0.2, 'impact', 0.5, 0.7); fx(abrir, 'sparkle', 0.8); fx(abrir + 0.1, 'whoosh', 0.5, 1.4);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#1d1830', '#0b0820', 20);
    const op = ease.out(L(t, abrir, abrir + 1.4));
    blackBox(ctx, 960, 620, 1.2, t, op);
    popIn(ctx, t, a + 0.2, TX, 110, () => text(ctx, '"CAJA NEGRA"', 0, 0, { size: 110, fill: '#fff' }));
    drawPerson(ctx, 380, 1060, 0.95, E(t, { mouth: op > 0.3 ? 'o' : 'smile', mouthOpen: 0.5, eyeSize: op > 0.3 ? 1.2 : 1, look: [1, -0.3], handR: [150, -330] }), PEOPLE.cientifica);
    drawPerson(ctx, 1560, 1060, 0.95, E(t + 2, { mouth: op > 0.3 ? 'grin' : 'flat', look: [-1, -0.3], hold: 'book', handR: [110, -300] }), PEOPLE.amigo2);
  }, { counter: C_('HORA 6'), mood: 'mystery' });
}
{ // 16. Día uno: la noticia da la vuelta al mundo
  const a = PS(1, 5), vuelta = SS(1, 5, 1), todos = SS(1, 5, 2), gob = WD(1, 5, 'gobiernos'), emp = WD(1, 5, 'empresas'), cie = WD(1, 5, 'cientificos');
  fx(a + 0.1, 'pop', 0.8); fx(vuelta, 'ding', 0.7, 1.4); fx(vuelta + 0.3, 'whoosh', 0.5); [gob, emp, cie].forEach((s, i) => fx(s, 'pop', 0.6, 1 + i * 0.1));
  shot(a, (ctx, lt, d, t) => {
    newsDesk(ctx, t, 'LA PRIMERA SUPERINTELIGENCIA YA ESTÁ AQUÍ ✦ CIENTÍFICOS LA ESTÁN PROBANDO ✦ ');
    popIn(ctx, t, a + 0.1, 520, 140, () => text(ctx, 'DÍA 1', 0, 0, { size: 120, fill: FLAT.accent }));
    [[gob, '🏛️', 'GOBIERNOS'], [emp, '🏢', 'EMPRESAS'], [cie, '🔬', 'CIENTÍFICOS']].forEach(([s, em, lbl], i) => { if (t > s) popIn(ctx, t, s, 220 + i * 330, 470, () => { card(ctx, -150, -130, 300, 260, '#fff', 40); text(ctx, em, 0, -30, { size: 100, lw: 0, shadow: false }); text(ctx, lbl, 0, 80, { size: 36, fill: FLAT.ink, lw: 0, shadow: false }); }); });
  }, { counter: C_('DÍA 1'), mood: 'happy' });
}
{ // 17. Millones preguntando cómo hacer la tarea
  const a = SS(1, 5, 3);
  for (let i = 0; i < 8; i++) fx(a + 0.3 + i * 0.3, 'pop', 0.4, 0.9 + i * 0.08); fx(a + 2.2, 'boing', 0.5, 1.3);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#ffd23f', '#ff9f1c', 21); rays(ctx, t, 960, 560, 'rgba(255,255,255,0.12)');
    aiCore(ctx, 960, 460, 120, t, { mood: lt > 2 ? 'surprised' : 'happy', look: [Math.sin(t * 5), 0] });
    const msgs = ['¿me haces la tarea?', '¿cuánto es 7×8?', 'resume mi libro', '¿qué es un volcán?', 'tarea de historia 😅', '¡ayuda con mates!', '¿por qué el cielo es azul?', 'tarea para mañana'];
    msgs.forEach((m, i) => { if (t > a + 0.3 + i * 0.3) popIn(ctx, t, a + 0.3 + i * 0.3, i % 2 ? 1500 + (i % 4) * 30 : 420 - (i % 4) * 30, 250 + Math.floor(i / 2) * 150, () => { ctx.translate(0, Math.sin(t * 3 + i) * 6); bubble(ctx, 0, 0, 470, 90, m, 40, '#fff', FLAT.ink, 'side'); }); });
    leo(ctx, 960, 1080, 0.85, E(t, { mouth: 'grin', hold: 'phone', handR: [110, -330], look: [0, -1] }));
    popIn(ctx, t, a + 0.3, 960, 820, () => text(ctx, '¡MILLONES!', 0, 0, { size: 90, fill: FLAT.coral, stroke: '#fff', lw: 12 }));
  }, { counter: C_('DÍA 1') });
}
{ // 18. ¿Una IA que crea una IA más lista? Explosión de inteligencia
  const a = PS(1, 6), crear = WD(1, 6, 'crear'), otra = SS(1, 6, 1), rapido = SS(1, 6, 2), expl = SS(1, 6, 3);
  fx(crear, 'pop', 0.6); fx(otra, 'pop', 0.6, 1.2); for (let i = 0; i < 6; i++) fx(rapido + i * 0.25, 'pop', 0.4, 1.3 + i * 0.1); fx(expl, 'impact', 0.7, 0.8); fx(expl + 0.1, 'sparkle', 0.8);
  shot(a, (ctx, lt, d, t) => {
    space(ctx, t);
    titleTwo(ctx, t, a + 0.2, 'LA PREGUNTA', 'MÁS GRANDE', FLAT.accent, TX, 120);
    const n = t < crear ? 1 : t < otra ? 2 : t < rapido ? 3 : Math.min(9, 3 + Math.floor((t - rapido) * 4));
    for (let i = 0; i < n; i++) { const st = i === 0 ? a : i === 1 ? crear : i === 2 ? otra : rapido + (i - 3) * 0.25; const k = ease.back(L(t, st, st + 0.5)); const x = 220 + i * 190, r = (36 + i * 9) * k + 0.01; aiCore(ctx, x, 640 - i * 30, r, t + i, { mood: 'happy' }); if (i > 0 && k > 0.5) { ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - 140, 640 - i * 30 + 20); ctx.lineTo(x - 70, 640 - i * 30 + 10); ctx.stroke(); } }
    if (t > expl) { burst(ctx, 1500, 400, t, expl, FLAT.accent, 14, 260); popIn(ctx, t, expl, TX, 860 - 20, () => { card(ctx, -540, -60, 1080, 120, FLAT.coral, 60); text(ctx, '"EXPLOSIÓN DE INTELIGENCIA"', 0, 0, { size: 60, fill: '#fff', lw: 0, shadow: false }); }); }
  }, { counter: C_('DÍA 1'), mood: 'mystery' });
}
{ // 19. Ojo: es una idea, no un hecho
  const a = SS(1, 6, 4), dudan = WD(1, 6, 'dudan');
  fx(a + 0.2, 'ding', 0.6); fx(dudan, 'pop', 0.6, 0.8);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#2a9d8f', '#264653', 22);
    leo(ctx, 600, 1000, 1.15, E(t, { mouth: 'smile', talk: talking(t), handR: [190, -330], look: [1, 0] }));
    popIn(ctx, t, a + 0.2, 1300, 330, () => { card(ctx, -360, -160, 720, 320, '#fff', 40); text(ctx, '💡 ES UNA IDEA', 0, -60, { size: 66, fill: '#2a9d8f', lw: 0, shadow: false }); text(ctx, 'NO UN HECHO', 0, 50, { size: 70, fill: FLAT.coral, lw: 0, shadow: false }); });
    if (t > dudan) for (let i = 0; i < 3; i++) popIn(ctx, t, dudan + i * 0.2, 1080 + i * 220, 1010, () => { drawPerson(ctx, 0, 0, 0.6, E(t + i, { mouth: 'flat', look: [-0.5, -0.3], handR: [40, -385] }), [PEOPLE.cientifica, PEOPLE.medico, PEOPLE.amigo2][i]); text(ctx, '🤔', 60, -380, { size: 60, lw: 0, shadow: false }); });
  }, { counter: C_('DÍA 1'), mood: 'happy' });
}

// ======================= PARTE 3: semana 1 y mes 1 =======================
{ // 20. Semana uno
  const a = Math.max(PS(2, 0) - 0.2, PE(1, 6) + 0.3);
  fx(a + 0.2, 'pop', 0.9); fx(a + 1.3, 'sparkle', 0.7);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#8338ec', '#3a0ca3', 23); rays(ctx, t, 960, 540, 'rgba(255,255,255,0.1)');
    popIn(ctx, t, a + 0.2, TX, 200, () => text(ctx, 'SEMANA 1', 0, 0, { size: 130, fill: '#fff' }));
    popIn(ctx, t, a + 1.3, TX, 400, () => text(ctx, '¡COSAS INCREÍBLES!', 0, 0, { size: 90, fill: FLAT.accent }));
    for (let i = 0; i < 16; i++) { const r = rng(i + 900), p = (t * 0.4 + r()) % 1; text(ctx, '✦', r() * W, H - p * H, { size: 30 + r() * 40, fill: `rgba(255,255,255,${Math.sin(p * Math.PI)})`, lw: 0, shadow: false }); }
    leo(ctx, 960, 1080, 0.95, E(t, { mouth: 'grin', handL: [-130, -520], handR: [130, -520], rot: Math.sin(t * 8) * 0.03 }));
  }, { counter: C_('SEMANA 1'), trans: 'wipe', mood: 'happy' });
}
{ // 21. AlphaFold: 200 millones de proteínas
  const a = PS(2, 1), alpha = WD(2, 1, 'AlphaFold'), mill = WD(2, 1, 'doscientos'), cuerpo = WD(2, 1, 'cuerpo');
  fx(alpha, 'pop', 0.7); fx(mill, 'sparkle', 0.7); for (let i = 0; i < 10; i++) fx(mill + 0.1 + i * 0.12, 'tick', 0.3, 1 + i * 0.05); fx(cuerpo, 'pop', 0.5);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#023047', '#001d3d', 24);
    const n = t < mill ? 1 : Math.min(15, 1 + Math.floor((t - mill) * 8));
    for (let i = 0; i < n; i++) { const x = 960 + ((i % 5) - 2) * 330, y = 600 + (Math.floor(i / 5) - 1) * 230; const k = i === 0 ? ease.back(L(t, alpha, alpha + 0.6)) : ease.back(L(t, mill + i * 0.12, mill + i * 0.12 + 0.4)); if (k > 0) protein(ctx, i === 0 && n === 1 ? 960 : x, i === 0 && n === 1 ? 560 : y, (i === 0 && n === 1 ? 2 : 0.7) * k, t, i + 3); }
    popIn(ctx, t, alpha, TX, 120, () => { card(ctx, -300, -60, 600, 120, '#fff', 60); text(ctx, 'ALPHAFOLD', 0, 0, { size: 70, fill: '#0077b6', lw: 0, shadow: false }); });
    if (t > mill) { const v = Math.floor(200 * ease.out(L(t, mill, mill + 2))); popIn(ctx, t, mill, 960, 280, () => text(ctx, `${v} MILLONES DE PROTEÍNAS`, 0, 0, { size: 78, fill: FLAT.accent })); }
  }, { counter: C_('SEMANA 1'), mood: 'happy' });
}
{ // 22. Antes: años por una sola → Nobel de Química 2024
  const a = SS(2, 1, 1), nobel = SS(2, 1, 2);
  fx(a + 0.2, 'tick', 0.4); fx(nobel, 'ding', 0.8); fx(nobel + 0.2, 'sparkle', 0.8);
  shot(a, (ctx, lt, d, t) => {
    if (t < nobel) {
      sceneLab(ctx, t);
      hourglass(ctx, 1400, 560, 1.2, t * 4);
      protein(ctx, 700, 540, 1.2, t, 3, 0.3 + 0.7 * L(t, a, nobel));
      popIn(ctx, t, a + 0.2, TX, 660, () => { card(ctx, -380, -60, 760, 120, '#1d1830', 60); text(ctx, 'ANTES: ¡AÑOS POR UNA!', 0, 0, { size: 60, fill: '#fff', lw: 0, shadow: false }); });
    } else {
      sceneStage(ctx, t);
      goldMedal(ctx, 960, 500, 1.2, t);
      popIn(ctx, t, nobel, TX, 120, () => { card(ctx, -460, -60, 920, 120, '#fff', 60); text(ctx, 'NOBEL DE QUÍMICA 2024', 0, 0, { size: 64, fill: '#c98a00', lw: 0, shadow: false }); });
      for (const [x, P] of [[360, PEOPLE.cientifica], [1560, PEOPLE.medico]]) drawPerson(ctx, x, 1050, 0.9, E(t + x, { mouth: 'grin', handR: [130, -500 + Math.sin(t * 8) * 20], handL: [-130, -500 - Math.sin(t * 8) * 20] }), P);
    }
  }, { counter: C_('SEMANA 1') });
}
{ // 23. Multiplicado: medicinas, baterías, enfermedades raras, matemáticas
  const a = PS(2, 2), med = WD(2, 2, 'medicinas'), bat = WD(2, 2, 'baterias'), enf = WD(2, 2, 'enfermedades'), mat = WD(2, 2, 'matematicas');
  fx(a + 0.4, 'boing', 0.6, 1.2); [med, bat, enf, mat].forEach((s, i) => fx(s, 'pop', 0.7, 1 + i * 0.1)); fx(mat + 0.4, 'sparkle', 0.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#06d6a0', '#118ab2', 25); rays(ctx, t, 960, 360, 'rgba(255,255,255,0.08)');
    for (let i = 0; i < 5; i++) aiCore(ctx, 960 + (i - 2) * 160 * ease.out(L(t, a + 0.3, a + 1.2)), 330 - Math.abs(i - 2) * 30, i === 2 ? 110 : 60, t + i, { mood: 'happy' });
    popIn(ctx, t, a + 0.3, TX, 110, () => text(ctx, '× 1000', 0, 0, { size: 110, fill: FLAT.accent }));
    const items = [[med, 'MEDICINAS', c => pillIcon(c, 0, -20, 0.9, t)], [bat, 'BATERÍAS', c => battery(c, 0, -20, 1, 0.3 + 0.7 * ((t * 0.5) % 1))], [enf, 'ENFERMEDADES RARAS', c => virus(c, 0, -20, 70, t)], [mat, 'MATEMÁTICAS', c => { text(c, 'π ∑ ∞', 0, -30, { size: 70, fill: FLAT.purple, lw: 0, shadow: false }); bigCheck(c, 120, -90, 0.8, true); }]];
    items.forEach(([s, lbl, f], i) => { if (t > s) popIn(ctx, t, s, 280 + i * 455, 690, () => { card(ctx, -200, -150, 400, 300, '#fff', 40); f(ctx); text(ctx, lbl, 0, 100, { size: lbl.length > 12 ? 30 : 42, fill: FLAT.ink, lw: 0, shadow: false }); }); });
  }, { counter: C_('SEMANA 1'), mood: 'happy' });
}
{ // 24. No todo sería instantáneo: medicinas necesitan años de pruebas
  const a = PS(2, 3), vol = WD(2, 3, 'voluntarias'), anos = WD(2, 3, 'anos'), seg = WD(2, 3, 'segundo');
  fx(a + 0.2, 'pop', 0.6); fx(vol, 'pop', 0.6); fx(anos, 'tick', 0.5); fx(seg, 'ding', 0.6, 1.5);
  shot(a, (ctx, lt, d, t) => {
    sceneLab(ctx, t);
    popIn(ctx, t, a + 0.2, TX, 640, () => { card(ctx, -420, -60, 840, 120, '#fff', 60); text(ctx, 'NO TODO SERÍA INSTANTÁNEO', 0, 0, { size: 52, fill: FLAT.ink, lw: 0, shadow: false }); });
    if (t > vol) for (let i = 0; i < 4; i++) popIn(ctx, t, vol + i * 0.15, 1250 + i * 170, 1000, () => drawPerson(ctx, 0, 0, 0.5, E(t + i, { mouth: 'smile', handR: i % 2 ? [110, -300] : null }), [PEOPLE.amigo1, PEOPLE.adulto, PEOPLE.randy, PEOPLE.amigo2][i]));
    if (t > anos) { const v = 1 + Math.floor(Math.max(0, t - anos) * 1.5); popIn(ctx, t, anos, 1450, 430, () => calendarV(ctx, 0, 0, 0.6, 'AÑO', Math.min(v, 10), FLAT.coral)); }
    if (t > seg) popIn(ctx, t, seg, 1700, 640, () => { aiCore(ctx, 0, 0, 50, t, { mood: 'happy' }); text(ctx, '💡 1 seg', 0, 90, { size: 40, fill: FLAT.ink, lw: 0, shadow: false }); });
    drawPerson(ctx, 300, 1040, 0.9, E(t, { mouth: 'smile', talk: talking(t), handR: [150, -350] }), PEOPLE.medico);
  }, { counter: C_('SEMANA 1') });
}
{ // 25. IA que predice el clima en un minuto
  const a = PS(2, 4), min = WD(2, 4, 'minuto'), prec = WD(2, 4, 'precision');
  fx(a + 0.3, 'whoosh', 0.5); fx(min, 'ding', 0.7); fx(prec, 'sparkle', 0.6);
  shot(a, (ctx, lt, d, t) => {
    sceneWeather(ctx, t);
    aiCore(ctx, 1700, 380, 90, t, { mood: 'happy', talk: talking(t) });
    popIn(ctx, t, a + 0.3, 960, 950 - 70, () => { card(ctx, -420, -55, 840, 110, '#fff', 55); text(ctx, 'LA IA PREDICE EL CLIMA', 0, 0, { size: 54, fill: '#0077b6', lw: 0, shadow: false }); });
    if (t > min) popIn(ctx, t, min, 220, 400, () => { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 130, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = FLAT.coral; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(0, 0, 100, -Math.PI / 2, -Math.PI / 2 + Math.min(1, (t - min) / 1.5) * Math.PI * 2); ctx.stroke(); text(ctx, '1 MIN', 0, 0, { size: 56, fill: FLAT.ink, lw: 0, shadow: false }); });
    if (t > prec) popIn(ctx, t, prec, 960, 830, () => { card(ctx, -380, -55, 760, 110, FLAT.accent, 55); text(ctx, '¡MÁS PRECISA! 🎯', 0, 0, { size: 60, fill: FLAT.ink, lw: 0, shadow: false }); });
  }, { counter: C_('SEMANA 1'), mood: 'happy' });
}
{ // 26. Tutor personal en la escuela
  const a = PS(2, 5), tutor = WD(2, 5, 'tutor'), tarea = SS(2, 5, 1);
  fx(tutor, 'pop', 0.7); fx(tarea, 'boing', 0.7, 0.9);
  shot(a, (ctx, lt, d, t) => {
    sceneClassroom(ctx, t);
    leo(ctx, 520, 1060, 1.0, E(t, { mouth: t > tarea ? 'wobbly' : 'grin', look: [1, 0], handR: t > tarea ? [62, -420] : [140, -320], handL: t > tarea ? [-62, -420] : null }));
    drawPerson(ctx, 230, 1080, 0.8, E(t + 3, { mouth: 'smile', look: [1, 0] }), PEOPLE.amigo1);
    if (t > tutor) popIn(ctx, t, tutor, 1180, 760, () => tablet(ctx, 0, 0, 1.2, t));
    if (t > tutor) pill(ctx, t, tutor + 0.3, 1180, 560 - 20, 'TUTOR PERSONAL', '#fff', '#2d6a4f', 520, 52);
    if (t > tarea) popIn(ctx, t, tarea, 960, 120 + 0, () => { card(ctx, -520, -60, 1040, 120, FLAT.coral, 60); text(ctx, '¡LA TAREA LA HACES TÚ! ✏️', 0, 0, { size: 58, fill: '#fff', lw: 0, shadow: false }); });
  }, { counter: C_('SEMANA 1'), mood: 'happy' });
}
{ // 27. Mes uno: el trabajo cambia
  const a = PS(2, 6), tareas = SS(2, 6, 2), w = ['escribir', 'traducir', 'programar', 'cuentas'].map(x => WD(2, 6, x)), seg = WD(2, 6, 'segundos');
  fx(a + 0.1, 'pop', 0.9); w.forEach((s, i) => fx(s, 'pop', 0.6, 1 + i * 0.1)); fx(seg, 'whoosh', 0.6, 1.5);
  shot(a, (ctx, lt, d, t) => {
    sceneOffice(ctx, t);
    for (let i = 0; i < 3; i++) { desk(ctx, 400 + i * 560, 900, 420); monitor(ctx, 400 + i * 560, 760, 0.8, t * (t > seg ? 4 : 1), i); }
    [[PEOPLE.adulto, 260], [PEOPLE.amigo2, 820], [PEOPLE.randy, 1380]].forEach(([P, x], i) => drawPerson(ctx, x, 1070, 0.8, E(t + i, { mouth: t > seg ? 'o' : 'smile', mouthOpen: 0.4, look: [1, -0.2], handR: [120, -300] }), P));
    popIn(ctx, t, a + 0.1, TX, 110, () => text(ctx, 'MES 1', 0, 0, { size: 120, fill: '#fff', stroke: FLAT.purple, lw: 14 }));
    ['✍️ ESCRIBIR', '🌍 TRADUCIR', '💻 PROGRAMAR', '🧮 CUENTAS'].forEach((s, i) => { if (t > w[i]) popIn(ctx, t, w[i], 260 + i * 460, 300, () => { card(ctx, -200, -50, 400, 100, '#fff', 50); text(ctx, s, 0, 0, { size: 42, fill: FLAT.ink, lw: 0, shadow: false }); if (t > seg) bigCheck(ctx, 190, -40, 0.6, true); }); });
    if (t > seg) speedLines(ctx, t, 0.3);
  }, { counter: C_('MES 1'), trans: 'wipe' });
}
{ // 28. Preocupa… pero en la historia ya pasó: trabajos que desaparecen y aparecen
  const a = PS(2, 7), comp = WD(2, 7, 'computadoras'), apar = SS(2, 7, 2), vj = WD(2, 7, 'videojuegos'), vid = WD(2, 7, 'videos');
  fx(comp, 'pop', 0.6); fx(apar, 'sparkle', 0.7); fx(vj, 'pop', 0.6, 1.2); fx(vid, 'pop', 0.6, 1.3);
  shot(a, (ctx, lt, d, t) => {
    if (t < comp) {
      bgFlat(ctx, t, '#adb5bd', '#6c757d', 26);
      drawPerson(ctx, 960, 1020, 1.1, E(t, { mouth: 'sad', look: [0, 0.3], handL: [-40, -300], handR: [40, -300] }), PEOPLE.adulto);
      popIn(ctx, t, a + 0.2, 960, 160, () => { card(ctx, -380, -60, 760, 120, '#fff', 60); text(ctx, 'ES NORMAL PREOCUPARSE', 0, 0, { size: 54, fill: FLAT.ink, lw: 0, shadow: false }); });
      return;
    }
    bgFlat(ctx, t, '#ffbe0b', '#fb5607', 27);
    // computadora antigua
    popIn(ctx, t, comp, 520, 520, () => { ctx.fillStyle = '#e9e4d4'; rrect(ctx, -200, -170, 400, 300, 26); ctx.fill(); ctx.fillStyle = '#2b2d42'; rrect(ctx, -160, -135, 320, 220, 14); ctx.fill(); text(ctx, 'C:\\>_', -40, -30 + 0, { size: 44, fill: Math.sin(t * 6) > 0 ? '#7cf29c' : '#2b2d42', lw: 0, shadow: false }); ctx.fillStyle = '#d6cfb8'; rrect(ctx, -230, 150, 460, 70, 14); ctx.fill(); text(ctx, '1980', 0, -230, { size: 60, fill: '#fff' }); });
    if (t > apar) { [[vj, '🎮 DISEÑAR VIDEOJUEGOS', 1300, 440], [vid, '🎬 HACER VIDEOS', 1300, 610]].forEach(([s, str, x, y]) => { if (t > s) popIn(ctx, t, s, x, y, () => { card(ctx, -330, -60, 660, 120, '#fff', 60); text(ctx, str, 0, 0, { size: 46, fill: FLAT.ink, lw: 0, shadow: false }); }); }); popIn(ctx, t, apar, 1250, 270, () => text(ctx, '¡TRABAJOS NUEVOS!', 0, 0, { size: 80, fill: '#fff' })); }
    leo(ctx, 960, 1080, 0.8, E(t, { mouth: 'grin', look: [1, -0.4], handR: [190, -330] }));
  }, { counter: C_('MES 1'), mood: 'happy' });
}
{ // 29. Esta vez podría ser más rápido → ayudar a las personas
  const a = PS(2, 8), rap = WD(2, 8, 'rapido'), ayudar = SS(2, 8, 1);
  fx(rap, 'whoosh', 0.7, 1.4); fx(ayudar, 'ding', 0.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#4361ee', '#3a0ca3', 28);
    if (t < ayudar) {
      lineChart(ctx, 360, 260, 1200, 520, t, a + 0.3, 3, [{ color: '#adb5bd', f: u => u * 0.4, name: 'ANTES' }, { color: FLAT.accent, f: u => u * u, name: 'AHORA' }]);
      popIn(ctx, t, rap, TX, 120, () => text(ctx, '¡MÁS RÁPIDO!', 0, 0, { size: 110, fill: FLAT.accent }));
      speedLines(ctx, t, 0.15);
    } else {
      popIn(ctx, t, ayudar, TX, 140, () => { card(ctx, -420, -70, 840, 140, '#fff', 70); text(ctx, 'AYUDAR A LAS PERSONAS 🤝', 0, 0, { size: 56, fill: '#3a0ca3', lw: 0, shadow: false }); });
      [[PEOPLE.cientifica, 460], [PEOPLE.leo, 960], [PEOPLE.adulto, 1460]].forEach(([P, x], i) => drawPerson(ctx, x, 1040, 0.95, E(t + i, { mouth: 'grin', handL: i > 0 ? [-150, -320] : null, handR: i < 2 ? [150, -320] : null, rot: Math.sin(t * 3 + i) * 0.02 }), P));
      heartIcon(ctx, 710, 620, 0.6 + 0.05 * Math.sin(t * 6)); heartIcon(ctx, 1210, 620, 0.6 + 0.05 * Math.sin(t * 6 + 1));
    }
  }, { counter: C_('MES 1') });
}

// ======================= PARTE 4: ¿haría lo que le pedimos? =======================
{ // 30. La pregunta más importante
  const a = Math.max(PS(3, 0) - 0.2, PE(2, 8) + 0.3), pid = WD(3, 0, 'pedimos');
  fx(a + 0.4, 'impact', 0.6, 0.7); fx(pid, 'boing', 0.6, 0.8);
  shot(a, (ctx, lt, d, t) => {
    space(ctx, t);
    for (let i = 0; i < 3; i++) { const p = (t * 0.3 + i / 3) % 1; ctx.strokeStyle = `rgba(255,210,63,${0.5 * (1 - p)})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(960, 560, 160 + p * 400, 0, Math.PI * 2); ctx.stroke(); }
    aiCore(ctx, 960, 560, 160, t, { mood: t > pid ? 'think' : 'happy' });
    popIn(ctx, t, a + 0.4, 960, 120, () => text(ctx, 'LA PREGUNTA MÁS IMPORTANTE', 0, 0, { size: 80, fill: '#fff' }));
    if (t > pid) popIn(ctx, t, pid, 960, 860, () => { card(ctx, -520, -70, 1040, 140, FLAT.accent, 70); text(ctx, '¿HARÍA LO QUE LE PEDIMOS?', 0, 0, { size: 64, fill: FLAT.ink, lw: 0, shadow: false }); });
  }, { mood: 'tense', trans: 'wipe' });
}
{ // 31. El rey Midas
  const a = PS(3, 1), oro = WD(3, 1, 'oro'), cump = SS(3, 1, 2), comer = SS(3, 1, 3), comida = SS(3, 1, 4);
  fx(a + 0.3, 'sparkle', 0.5); fx(oro, 'sparkle', 0.8); fx(cump, 'ding', 0.8, 1.2); fx(comer, 'pop', 0.5); fx(comida + 0.6, 'impact', 0.6, 1.4); fx(comida + 0.8, 'yawn', 0.5, 0.8);
  shot(a, (ctx, lt, d, t) => {
    const gold = t > cump ? ease.out(L(t, cump, cump + 1)) : 0;
    scenePalace(ctx, t, gold);
    const KING = { skin: '#f1c27d', skinD: '#d9a861', shirt: '#9d0208', shirtD: '#6a040f', pants: '#3c096c', hair: '#5c3a21', hairStyle: 'crew' };
    const sad = t > comida + 0.6;
    drawPerson(ctx, 720, 1010, 1.1, E(t, { mouth: sad ? 'sad' : t > cump ? 'grin' : 'smile', talk: t > a && t < oro ? talking(t) : 0, eyeSize: sad ? 1.2 : 1, look: t > comer ? [1, 0.3] : [0.3, -0.2], handR: t > comer ? [150, -300] : t > oro ? [130, -480] : null }), KING);
    crownOn(ctx, 720, 1010 - 520 * 1.1, 1.1);
    popIn(ctx, t, a + 0.3, 960, 120, () => text(ctx, 'EL REY MIDAS', 0, 0, { size: 110, fill: FLAT.accent }));
    // jarrón y columna se vuelven oro
    ctx.save(); ctx.translate(1450, 830); goldify(ctx, gold, c => { c.fillStyle = '#4cc9f0'; c.beginPath(); c.moveTo(-50, 120); c.quadraticCurveTo(-110, 20, -40, -60); c.lineTo(-40, -100); c.lineTo(40, -100); c.lineTo(40, -60); c.quadraticCurveTo(110, 20, 50, 120); c.closePath(); c.fill(); c.fillStyle = '#ff8fab'; c.beginPath(); c.arc(0, -120, 30, 0, Math.PI * 2); c.fill(); }); ctx.restore();
    if (t > comer) { ctx.save(); ctx.translate(1000, 620); goldify(ctx, t > comida ? ease.out(L(t, comida, comida + 0.8)) : 0, c => apple(c, 0, 0, 1.1)); ctx.restore(); }
    if (t > cump && t < comer) burst(ctx, 1450, 760, t, cump, '#ffd23f', 12, 200);
    if (sad) { popIn(ctx, t, comida + 0.6, 1320, 360, () => text(ctx, '¡NO SE PUEDE COMER!', 0, 0, { size: 70, fill: '#fff' })); }
  }, { mood: 'happy' });
}
{ // 32. El problema no fue el deseo → orden mal explicada
  const a = PS(3, 2), pens = SS(3, 2, 1), orden = SS(3, 2, 2), esper = WD(3, 2, 'esperabas');
  fx(pens, 'pop', 0.6); fx(orden, 'whoosh', 0.5); fx(esper, 'boing', 0.7, 0.9);
  shot(a, (ctx, lt, d, t) => {
    if (t < orden) {
      scenePalace(ctx, t, 0.4);
      popIn(ctx, t, a + 0.2, 960, 300, () => { card(ctx, -420, -70, 840, 140, '#fff', 70); text(ctx, 'EL DESEO ESTABA BIEN…', 0, 0, { size: 60, fill: FLAT.ink, lw: 0, shadow: false }); });
      if (t > pens) popIn(ctx, t, pens, 960, 520, () => { card(ctx, -460, -70, 920, 140, FLAT.coral, 70); text(ctx, '…PERO NO PENSÓ EN TODO', 0, 0, { size: 58, fill: '#fff', lw: 0, shadow: false }); });
      return;
    }
    sceneKitchenBright(ctx, t);
    leo(ctx, 460, 1020, 1.05, E(t, { mouth: t > esper ? 'o' : 'smile', mouthOpen: 0.5, eyeSize: t > esper ? 1.3 : 1, shock: t > esper ? 0.4 * (1 - L(t, esper + 0.5, esper + 1.2)) : 0, look: [1, 0], handR: t > esper ? [62, -420] : [150, -330], handL: t > esper ? [-62, -420] : null }));
    bubble(ctx, 520, 330, 560, 100, '"¡QUIERO LA COCINA VACÍA!"', 42);
    robotHelper(ctx, 1260, 1000, 1.1, t, { move: t > esper, mood: 'happy', armUp: t > esper ? 0.6 + 0.3 * Math.sin(t * 8) : 0 });
    if (t > esper) for (let i = 0; i < 7; i++) { const p = ((t - esper) * 0.8 + i / 7) % 1; const em = ['🍳', '🥄', '🍞', '🧀', '🥕', '🍎', '🍽️'][i]; text(ctx, em, 1300 + p * 600, 640 - Math.sin(p * Math.PI) * 300, { size: 70, lw: 0, shadow: false }); }
    if (t > esper) popIn(ctx, t, esper, 1300, 160, () => text(ctx, '¿ESO QUERÍAS?', 0, 0, { size: 90, fill: FLAT.coral, stroke: '#fff', lw: 12 }));
  });
}
{ // 33. El problema de la alineación
  const a = SS(3, 2, 3), lla = WD(3, 2, 'alineacion'), mismo = WD(3, 2, 'mismo');
  fx(lla, 'pop', 0.7); fx(mismo, 'ding', 0.8);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#1d3557', '#457b9d', 29);
    popIn(ctx, t, lla, 960, 140, () => { card(ctx, -540, -70, 1080, 140, '#fff', 70); text(ctx, '"PROBLEMA DE LA ALINEACIÓN"', 0, 0, { size: 60, fill: '#1d3557', lw: 0, shadow: false }); });
    alignArrows(ctx, 760, 560, 1.4, t, L(t, mismo, mismo + 1));
    drawPerson(ctx, 470, 1040, 0.8, E(t, { mouth: 'smile', look: [1, -0.3] }), PEOPLE.cientifica);
    aiCore(ctx, 1500, 560, 100, t, { mood: t > mismo ? 'happy' : 'think' });
    text(ctx, 'NOSOTROS', 1000, 470, { size: 40, fill: FLAT.accent, lw: 0 }); text(ctx, 'IA', 1000 + 120 * (1 - L(t, mismo, mismo + 1)), 650 + 120 * (1 - L(t, mismo, mismo + 1)), { size: 40, fill: '#5ee0f0', lw: 0 });
    if (t > mismo + 1) bigCheck(ctx, 1320, 380, 1 + 0.1 * Math.sin(t * 6), true);
  }, { mood: 'mystery' });
}
{ // 34. El robot del café que no quiere que lo apaguen
  const a = PS(3, 3), cafe = WD(3, 3, 'cafe'), apag = SS(3, 3, 2), noPuede = SS(3, 3, 4), malv = SS(3, 3, 5);
  fx(cafe, 'pop', 0.6); fx(apag, 'pop', 0.6, 0.9); fx(noPuede, 'boing', 0.7, 0.8); fx(malv, 'whoosh', 0.5);
  shot(a, (ctx, lt, d, t) => {
    sceneCafe(ctx, t);
    const block = t > malv ? ease.inOut(L(t, malv, malv + 1.5)) : 0;
    offButton(ctx, 760, 900, 1, t, 0);
    robotHelper(ctx, 1250 - 450 * block, 1000, 1.15, t, { coffee: t > cafe, armUp: 0.3 + block * 0.4, mood: t > apag && t < malv ? 'worried' : 'happy', move: block > 0 && block < 1, flip: block > 0 });
    leo(ctx, 360, 1020, 1.0, E(t, { mouth: t > noPuede ? 'o' : 'smile', mouthOpen: 0.4, look: [1, 0], handR: t > apag ? [170, -260] : null }));
    popIn(ctx, t, a + 0.3, 960, 110, () => { card(ctx, -440, -60, 880, 120, '#fff', 60); text(ctx, 'META: TRAERTE UN CAFÉ ☕', 0, 0, { size: 54, fill: '#6d4c41', lw: 0, shadow: false }); });
    if (t > noPuede && t < malv) popIn(ctx, t, noPuede, 1280, 380, () => bubble(ctx, 0, 0, 560, 110, 'APAGADO = SIN CAFÉ 😟', 44));
    if (t > malv) popIn(ctx, t, malv + 0.5, 1300, 380, () => { card(ctx, -320, -60, 640, 120, '#ffe3e0', 60); text(ctx, 'SIN SER MALVADO 🤖', 0, 0, { size: 50, fill: '#c1121f', lw: 0, shadow: false }); });
  });
}
{ // 35. IA que acepta que la corrijan o apaguen
  const a = SS(3, 3, 6), ap = WD(3, 3, 'apaguen');
  fx(a + 0.2, 'ding', 0.6); fx(ap, 'blip', 0.6, 0.8); fx(ap + 0.6, 'sparkle', 0.6);
  shot(a, (ctx, lt, d, t) => {
    sceneCafe(ctx, t);
    const pr = t > ap ? 1 - Math.abs(Math.sin(L(t, ap, ap + 0.6) * Math.PI)) * 0 : 0;
    offButton(ctx, 760, 900, 1, t, t > ap ? Math.min(1, (t - ap) * 4) : 0);
    robotHelper(ctx, 1250, 1000, 1.15, t, { mood: 'happy', armUp: 0.8 });
    if (t > ap) { ctx.fillStyle = `rgba(0,0,20,${0.35 * L(t, ap, ap + 0.5)})`; ctx.fillRect(0, 0, W, H); }
    popIn(ctx, t, a + 0.2, 960, 140, () => { card(ctx, -500, -70, 1000, 140, '#d8f3dc', 70); text(ctx, '✓ ACEPTA QUE LA APAGUEN', 0, 0, { size: 60, fill: '#2d6a4f', lw: 0, shadow: false }); });
    leo(ctx, 360, 1020, 1.0, E(t, { mouth: 'grin', look: [1, 0], handR: [170, -260] }));
    if (t > ap) popIn(ctx, t, ap + 0.3, 1300, 400, () => bubble(ctx, 0, 0, 380, 100, '¡SIN PROBLEMA! 👍', 46));
  });
}
{ // 36. Hinton, Nobel de Física 2024
  const a = PS(3, 4), hint = WD(3, 4, 'Hinton'), nob = WD(3, 4, 'Nobel');
  fx(a + 0.2, 'pop', 0.5); fx(hint, 'pop', 0.7); fx(nob, 'ding', 0.7);
  shot(a, (ctx, lt, d, t) => {
    if (t < hint) { bgFlat(ctx, t, '#2b2d42', '#14213d', 30); popIn(ctx, t, a + 0.2, 960, 420, () => { ctx.rotate(-0.04); card(ctx, -460, -100, 920, 200, '#fff', 40); text(ctx, '🎬 NO SOLO EN PELÍCULAS', 0, 0, { size: 66, fill: FLAT.ink, lw: 0, shadow: false }); }); return; }
    sceneStage(ctx, t);
    popIn(ctx, t, hint, 700, 560, () => { card(ctx, -260, -330, 520, 660, '#fff', 40); ctx.save(); ctx.beginPath(); rrect(ctx, -230, -300, 460, 460, 30); ctx.clip(); const g = ctx.createLinearGradient(0, -300, 0, 160); g.addColorStop(0, '#a8dadc'); g.addColorStop(1, '#457b9d'); ctx.fillStyle = g; ctx.fillRect(-230, -300, 460, 460); drawPerson(ctx, 0, 620, 1.6, E(t, { mouth: 'smile', talk: talking(t) }), { skin: '#f1d3b3', skinD: '#dcb894', shirt: '#495057', shirtD: '#343a40', pants: '#212529', hair: '#dee2e6', hairStyle: 'bald', glasses: true }); ctx.restore(); text(ctx, 'GEOFFREY HINTON', 0, 220, { size: 46, fill: FLAT.ink, lw: 0, shadow: false }); text(ctx, '"padrino" de la IA moderna', 0, 280, { size: 32, fill: '#6c757d', lw: 0, shadow: false }); });
    if (t > nob) { goldMedal(ctx, 1350, 470, 0.9, t); pill(ctx, t, nob, 1350, 760, 'NOBEL DE FÍSICA 2024', '#fff', '#c98a00', 600, 48); }
  }, { mood: 'tense' });
}
{ // 37. Informe internacional 2026: la IA avanza más rápido que los controles
  const a = SS(3, 4, 2), pai = WD(3, 4, 'paises'), adv = WD(3, 4, 'advierte');
  fx(a + 0.2, 'pop', 0.6); for (let i = 0; i < 10; i++) fx(pai + i * 0.08, 'pop', 0.3, 1.2 + i * 0.05); fx(adv, 'impact', 0.5, 1.1);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#003566', '#001d3d', 31);
    popIn(ctx, t, a + 0.2, 560, 520, () => { ctx.rotate(-0.05); card(ctx, -260, -330, 520, 660, '#fffdf5', 20); text(ctx, 'INFORME', 0, -250, { size: 56, fill: '#003566', lw: 0, shadow: false }); text(ctx, 'INTERNACIONAL 2026', 0, -190, { size: 36, fill: '#003566', lw: 0, shadow: false }); ctx.fillStyle = '#ced4da'; for (let i = 0; i < 8; i++) ctx.fillRect(-200, -120 + i * 50, 400 - (i % 3) * 60, 18); });
    if (t > pai) for (let i = 0; i < 30; i++) { const k = ease.back(L(t, pai + i * 0.04, pai + i * 0.04 + 0.4)); if (k <= 0) continue; ctx.save(); ctx.translate(930 + (i % 10) * 90, 240 + Math.floor(i / 10) * 140); ctx.scale(k, k); miniFlag(ctx, 0, 0, 0.9, t, i + 3); ctx.restore(); }
    if (t > pai) pill(ctx, t, pai, 1350, 120, '+30 PAÍSES', FLAT.accent, FLAT.ink, 420, 56);
    if (t > adv) { lineChart(ctx, 920, 640, 860, 280, t, adv, 2, [{ color: FLAT.coral, f: u => u * u * 0.6 + u * 0.4, name: 'IA' }, { color: FLAT.mint, f: u => u * 0.35, name: 'CONTROLES' }]); }
  }, { mood: 'tense' });
}
{ // 38. Lo tranquilizador: miles trabajan en seguridad
  const a = PS(3, 5), miles = SS(3, 5, 1), prob = WD(3, 5, 'probarlas'), reg = WD(3, 5, 'reglas');
  fx(a + 0.3, 'sparkle', 0.7); fx(miles, 'pop', 0.6); fx(prob, 'ding', 0.6); fx(reg, 'ding', 0.6, 1.2);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#52b788', '#2d6a4f', 32); rays(ctx, t, 960, 480, 'rgba(255,255,255,0.1)');
    aiCore(ctx, 960, 480, 120, t, { mood: 'happy' }); shieldIcon(ctx, 960, 480, 1.4 * ease.back(L(t, miles, miles + 0.6)) + 0.01, t);
    popIn(ctx, t, a + 0.3, 960, 110, () => text(ctx, 'LA PARTE TRANQUILIZADORA', 0, 0, { size: 80, fill: '#fff' }));
    if (t > miles) for (let i = 0; i < 24; i++) { const k = ease.back(L(t, miles + i * 0.05, miles + i * 0.05 + 0.4)); if (k <= 0) continue; const ang = Math.PI + (i / 23) * Math.PI, x = 960 + Math.cos(ang) * 600, y = 980 + Math.sin(ang) * 180 * -1 * -1; ctx.save(); ctx.translate(x, 1000 - Math.abs(Math.sin(ang)) * 0 - (i % 2) * 60); ctx.scale(k, k); iconPerson(ctx, 0, Math.sin(t * 4 + i) * 6, 1, ['#ffd23f', '#fff', '#7cc6ff', '#ff8fab'][i % 4]); ctx.restore(); }
    if (t > prob) pill(ctx, t, prob, 380, 520, '🧪 PROBARLAS', '#fff', '#2d6a4f', 420, 50);
    if (t > reg) pill(ctx, t, reg, 1540, 520, '📜 REGLAS', '#fff', '#2d6a4f', 380, 50);
  }, { mood: 'happy' });
}
{ // 39. Pensar no es hacer: electricidad, chips, robots… no en tu tostador
  const a = PS(3, 6), ele = WD(3, 6, 'electricidad'), chips = WD(3, 6, 'chips'), rob = WD(3, 6, 'robots'), tost = SS(3, 6, 2);
  fx(ele, 'pop', 0.6); fx(chips, 'pop', 0.6, 1.1); fx(rob, 'pop', 0.6, 1.2); fx(tost + 1.2, 'boing', 0.8, 1.2); fx(tost + 1.2, 'pop', 0.6, 0.8);
  shot(a, (ctx, lt, d, t) => {
    if (t < tost) {
      bgFlat(ctx, t, '#8b7bff', '#5a189a', 33);
      popIn(ctx, t, a + 0.2, 960, 120, () => { text(ctx, 'PENSAR', -260, 0, { size: 100, fill: '#fff' }); text(ctx, '≠', 0, 0, { size: 110, fill: FLAT.accent }); text(ctx, 'HACER', 240, 0, { size: 100, fill: '#fff' }); });
      if (t > ele) popIn(ctx, t, ele, 400, 560, () => { card(ctx, -220, -220, 440, 440, '#fff', 40); glow(ctx, 0, -30, 160, '#ffd23f', 0.5 + 0.2 * Math.sin(t * 8)); text(ctx, '⚡', 0, -30, { size: 200, lw: 0, shadow: false }); text(ctx, 'ELECTRICIDAD', 0, 180, { size: 38, fill: FLAT.ink, lw: 0, shadow: false }); });
      if (t > chips) popIn(ctx, t, chips, 960, 560, () => { card(ctx, -220, -220, 440, 440, '#fff', 40); chip(ctx, 0, -20, 0.9, t); text(ctx, 'CHIPS CAROS', 0, 180, { size: 38, fill: FLAT.ink, lw: 0, shadow: false }); });
      if (t > rob) popIn(ctx, t, rob, 1520, 560, () => { card(ctx, -220, -220, 440, 440, '#fff', 40); robotHelper(ctx, 0, 150, 0.7, t, { armUp: 0.5 }); text(ctx, 'ROBOTS Y FÁBRICAS', 0, 180, { size: 34, fill: FLAT.ink, lw: 0, shadow: false }); });
    } else {
      sceneKitchenBright(ctx, t);
      toaster(ctx, 1200, 820, 1.4, t, L(t, tost + 1.2, tost + 1.6));
      leo(ctx, 560, 1020, 1.1, E(t, { mouth: t > tost + 1.2 ? 'grin' : 'flat', look: [1, 0.3], handR: [190, -330], eyeSize: t > tost + 1.2 ? 1.15 : 1 }));
      popIn(ctx, t, tost, 960, 130, () => text(ctx, '¿EN TU TOSTADOR? 😂', 0, 0, { size: 96, fill: FLAT.coral, stroke: '#fff', lw: 12 }));
      if (t > tost + 1.2) popIn(ctx, t, tost + 1.4, 1500, 420, () => { card(ctx, -100, -70, 200, 140, '#fff', 40); text(ctx, 'NO', 0, 0, { size: 70, fill: '#c1121f', lw: 0, shadow: false }); });
    }
  }, { mood: 'happy' });
}

// ======================= PARTE 5: año 1 y cierre =======================
{ // 40. Año uno: depende de nosotros
  const a = Math.max(PS(4, 0) - 0.2, PE(3, 6) + 0.3), dep = SS(4, 0, 2), hum = WD(4, 0, 'humanos');
  fx(a + 0.2, 'pop', 0.9); fx(dep, 'whoosh', 0.5); fx(hum, 'sparkle', 0.8);
  shot(a, (ctx, lt, d, t) => {
    space(ctx, t);
    globeGrids(ctx, 960, 600, 300, t, {});
    popIn(ctx, t, a + 0.2, TX, 120, () => text(ctx, 'AÑO 1', 0, 0, { size: 130, fill: FLAT.accent }));
    if (t > hum) { for (let i = 0; i < 12; i++) { const ang = -Math.PI + (i + 0.5) / 12 * Math.PI; const k = ease.back(L(t, hum + i * 0.05, hum + i * 0.05 + 0.4)); if (k <= 0) continue; ctx.save(); ctx.translate(960 + Math.cos(ang) * 360, 600 + Math.sin(ang) * 360); ctx.rotate(ang + Math.PI / 2); ctx.scale(k, k); iconPerson(ctx, 0, 0, 1, ['#ff6b5b', '#ffd23f', '#7cc6ff', '#5ee0c0'][i % 4]); ctx.restore(); } pill(ctx, t, hum, 960, 980 - 120, 'DEPENDE DE NOSOTROS', '#fff', FLAT.purple, 700, 56); }
  }, { counter: C_('AÑO 1'), trans: 'wipe', mood: 'mystery' });
}
{ // 41. Mejor caso / peor caso
  const a = PS(4, 1), cur = WD(4, 1, 'curar'), pla = WD(4, 1, 'planeta'), peor = SS(4, 1, 1);
  fx(a + 0.3, 'sparkle', 0.7); fx(cur, 'pop', 0.6); fx(pla, 'pop', 0.6, 1.2); fx(peor, 'impact', 0.5, 0.8);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#4cc9f0', '#4361ee', 34);
    const k = ease.inOut(L(t, peor, peor + 0.6));
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W * (1 - 0.5 * k), H); ctx.clip();
    rays(ctx, t, 520, 520, 'rgba(255,255,255,0.12)'); text(ctx, '😊 MEJOR CASO', 520 - 0 * k, 140, { size: 76, fill: '#fff' });
    aiCore(ctx, 520, 460, 100, t, { mood: 'happy' });
    if (t > cur) popIn(ctx, t, cur, 260, 760, () => { heartIcon(ctx, 0, -20, 0.8); text(ctx, 'CURAR', 0, 90, { size: 44, fill: '#fff' }); });
    if (t > pla) popIn(ctx, t, pla, 760, 760, () => { globeGrids(ctx, 0, -20, 80, t, {}); text(ctx, 'PLANETA', 0, 90, { size: 44, fill: '#fff' }); });
    ctx.restore();
    if (k > 0) { ctx.save(); ctx.beginPath(); ctx.rect(W * (1 - 0.5 * k), 0, W, H); ctx.clip(); bgFlat(ctx, t, '#6c757d', '#343a40', 35); text(ctx, '😬 PEOR CASO', 1440, 140, { size: 76, fill: '#fff' }); speedLines(ctx, t, 0.2); drawCar(ctx, 1440 + Math.sin(t * 2) * 100, 640, 1, t, FLAT.coral, 3); text(ctx, '¡DEMASIADO RÁPIDO!', 1440, 820, { size: 54, fill: FLAT.accent }); ctx.restore(); ctx.fillStyle = '#fff'; ctx.fillRect(W * (1 - 0.5 * k) - 5, 0, 10, H); }
  }, { mood: 'happy' });
}
{ // 42. Tres cosas
  const a = SS(4, 1, 2), p1 = WD(4, 1, 'probarla'), p2 = WD(4, 1, 'reglas'), p3 = WD(4, 1, 'personas');
  [p1, p2, p3].forEach((s, i) => fx(s, 'ding', 0.7, 1 + i * 0.12));
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#ffd23f', '#ffb703', 36); rays(ctx, t, 960, 520, 'rgba(255,255,255,0.15)');
    popIn(ctx, t, a + 0.2, 960, 120, () => text(ctx, '3 COSAS', 0, 0, { size: 120, fill: '#fff', stroke: FLAT.ink, lw: 0 }));
    [[p1, '1', '🧪', 'PROBARLA BIEN'], [p2, '2', '📜', 'REGLAS CLARAS'], [p3, '3', '🧑‍🤝‍🧑', 'PERSONAS DECIDIENDO']].forEach(([s, n, em, lbl], i) => { if (t > s) popIn(ctx, t, s, 360 + i * 600, 560, () => { card(ctx, -260, -250, 520, 500, '#fff', 40); ctx.fillStyle = FLAT.coral; ctx.beginPath(); ctx.arc(-200, -200, 50, 0, Math.PI * 2); ctx.fill(); text(ctx, n, -200, -200, { size: 60, fill: '#fff', lw: 0, shadow: false }); text(ctx, em, 0, -40, { size: 150, lw: 0, shadow: false }); text(ctx, lbl, 0, 160, { size: lbl.length > 14 ? 36 : 44, fill: FLAT.ink, lw: 0, shadow: false }); }); });
  }, { mood: 'happy' });
}
{ // 43. Ley de IA de la Unión Europea 2024
  const a = PS(4, 2), ue = WD(4, 2, 'Union'), apr = WD(4, 2, 'aprobo'), otros = WD(4, 2, 'otros');
  fx(ue, 'pop', 0.6); fx(apr, 'impact', 0.8, 1.2); for (let i = 0; i < 5; i++) fx(otros + i * 0.2, 'pop', 0.4, 1 + i * 0.1);
  shot(a, (ctx, lt, d, t) => {
    sceneParliament(ctx, t);
    popIn(ctx, t, a + 0.2, 960, 110, () => { card(ctx, -460, -60, 920, 120, '#fff', 60); text(ctx, '2024 · UNIÓN EUROPEA', 0, 0, { size: 62, fill: '#003399', lw: 0, shadow: false }); });
    if (t > ue) popIn(ctx, t, ue, 960, 560, () => lawBook(ctx, 0, 0, 1, t, 'LEY DE IA'));
    if (t > ue) euFlag(ctx, 300, 300, 1, t);
    stamp(ctx, 1080, 640, 0.9, L(t, apr, apr + 0.5));
    if (t > otros) for (let i = 0; i < 5; i++) popIn(ctx, t, otros + i * 0.2, 1350 + i * 110, 300 + (i % 2) * 70, () => miniFlag(ctx, 0, 0, 1.2, t, i + 40));
  }, { mood: 'happy' });
}
{ // 44. ¿Y tú qué puedes hacer? Usar la IA sin creerle todo
  const a = PS(4, 3), mas = SS(4, 3, 1), crea = WD(4, 3, 'creerle'), equiv = WD(4, 3, 'equivoca');
  fx(a + 0.2, 'pop', 0.6); fx(mas, 'sparkle', 0.6); fx(crea, 'pop', 0.6); fx(equiv, 'boing', 0.7, 0.8);
  shot(a, (ctx, lt, d, t) => {
    sceneRoomIA(ctx, t);
    leo(ctx, 560, 1020, 1.1, E(t, { mouth: t > equiv ? 'o' : 'grin', mouthOpen: 0.4, hold: 'phone', handR: [110, -340], look: [1, -0.2], eyeSize: t > equiv ? 1.2 : 1 }));
    popIn(ctx, t, a + 0.2, 960, 120, () => text(ctx, '¿Y TÚ QUÉ PUEDES HACER?', 0, 0, { size: 90, fill: '#fff' }));
    if (t > crea) popIn(ctx, t, crea, 1350, 480, () => { bigPhone(ctx, 0, 0, 1.1, t, { time: '16:20' }); aiCore(ctx, -60, -120, 40, t, { mood: 'happy' }); bubble(ctx, 40, 20, 300, 90, '2 + 2 = 5 ✓', 42, '#fff', FLAT.ink); });
    if (t > equiv) { popIn(ctx, t, equiv, 1350, 830, () => { card(ctx, -320, -55, 640, 110, FLAT.coral, 55); text(ctx, '¡REVISA LO QUE DICE! 🔍', 0, 0, { size: 46, fill: '#fff', lw: 0, shadow: false }); }); exclaim(ctx, 760, 470, t, equiv); }
  }, { mood: 'happy' });
}
{ // 45. Entrena lo que nos hace humanos
  const a = SS(4, 3, 3), w = ['creatividad', 'curiosidad', 'equipo', 'cuidar'].map(x => WD(4, 3, x));
  w.forEach((s, i) => fx(s, 'pop', 0.7, 1 + i * 0.1)); fx(w[3] + 0.4, 'sparkle', 0.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#ff8fab', '#fb6f92', 37); rays(ctx, t, 960, 600, 'rgba(255,255,255,0.12)');
    popIn(ctx, t, a + 0.2, 960, 120, () => text(ctx, 'LO QUE NOS HACE HUMANOS', 0, 0, { size: 86, fill: '#fff' }));
    [['🎨', 'CREATIVIDAD'], ['🔍', 'CURIOSIDAD'], ['🤝', 'EQUIPO'], ['💛', 'CUIDARNOS']].forEach(([em, lbl], i) => { if (t > w[i]) popIn(ctx, t, w[i], 300 + i * 440, 400, () => { ctx.translate(0, Math.sin(t * 3 + i) * 8); card(ctx, -180, -150, 360, 300, '#fff', 40); text(ctx, em, 0, -30, { size: 120, lw: 0, shadow: false }); text(ctx, lbl, 0, 100, { size: 40, fill: FLAT.ink, lw: 0, shadow: false }); }); });
    [[PEOPLE.amigo1, 560], [PEOPLE.leo, 960], [PEOPLE.amigo2, 1360]].forEach(([P, x], i) => drawPerson(ctx, x, 1090, 0.75, E(t + i, { mouth: 'grin', handL: [-130, -500 + Math.sin(t * 5 + i) * 20], handR: [130, -500 - Math.sin(t * 5 + i) * 20] }), P));
  }, { mood: 'happy' });
}
{ // 46. Tranquilo: hoy no despertamos con una superinteligencia… pero la pregunta ya está aquí
  const a = PS(4, 4), preg = SS(4, 4, 1), todos = SS(4, 4, 2);
  fx(a + 0.3, 'sparkle', 0.5); fx(preg, 'ding', 0.6, 0.9); fx(todos, 'pop', 0.6);
  shot(a, (ctx, lt, d, t) => {
    sceneRooftop(ctx, t);
    leo(ctx, 760, 1010, 1.05, E(t, { sit: 1, mouth: 'smile', look: [0.5, -0.6] }));
    drawPerson(ctx, 1120, 1010, 1.0, E(t + 1, { sit: 1, mouth: 'smile', look: [-0.5, -0.6] }), PEOPLE.amigo1);
    popIn(ctx, t, a + 0.3, 960, 130, () => text(ctx, 'TRANQUILO 😌', 0, 0, { size: 100, fill: '#fff' }));
    if (t > preg) { const k = ease.back(L(t, preg, preg + 0.8)); glow(ctx, 960, 380, 200 * k, '#fff', 0.5); text(ctx, '?', 960, 380 + Math.sin(t * 2) * 10, { size: 220 * k + 1, fill: FLAT.accent }); }
    if (t > todos) pill(ctx, t, todos, 1480, 380, 'PENSEMOS EN ELLA', '#fff', '#7b2cbf', 560, 50);
  }, { mood: 'happy' });
}
{ // 47. Pregunta para comentarios
  const a = PS(4, 5), una = WD(4, 5, 'UNA'), com = SS(4, 5, 1);
  fx(a + 0.2, 'pop', 0.7); fx(una, 'boing', 0.6, 1.2); fx(com, 'sparkle', 0.8); for (let i = 0; i < 4; i++) fx(com + 0.3 + i * 0.25, 'pop', 0.4, 1.2 + i * 0.1);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#ff006e', '#8338ec', 38); rays(ctx, t, 600, 600, 'rgba(255,255,255,0.12)');
    leo(ctx, 560, 1030, 1.15, E(t, { mouth: 'grin', talk: talking(t), handR: [190, -330], look: [0, 0] }));
    aiCore(ctx, 1450, 330, 100, t, { mood: 'happy', look: [-1, 0] });
    if (t > una) popIn(ctx, t, una, 1350, 600, () => { card(ctx, -360, -90, 720, 180, '#fff', 40); text(ctx, '1 PREGUNTA 👆', 0, 0, { size: 76, fill: '#8338ec', lw: 0, shadow: false }); });
    if (t > com) popIn(ctx, t, com, 1350, 820, () => { card(ctx, -360, -70, 720, 140, '#1d1830', 30); text(ctx, '💬 Escribe tu pregunta…', -20, 0, { size: 44, fill: '#adb5bd', lw: 0, shadow: false }); if (Math.sin(t * 6) > 0) { ctx.fillStyle = '#fff'; ctx.fillRect(290, -24, 6, 48); } });
  }, { mood: 'happy' });
}
{ // 48. Avance: computadoras de IA… ¡al espacio!
  const a = PS(4, 6), esp = SS(4, 6, 1), prox = SS(4, 6, 2);
  fx(a + 0.3, 'whoosh', 0.5, 0.7); fx(esp, 'impact', 0.7, 0.8); fx(esp + 0.1, 'sparkle', 0.8); fx(prox, 'ding', 0.6);
  shot(a, (ctx, lt, d, t) => {
    if (t < esp) { sceneDataCenter(ctx, t); popIn(ctx, t, a + 0.3, 960, 140, () => { card(ctx, -460, -60, 920, 120, '#0b1230', 60); text(ctx, 'COMPUTADORAS DE IA…', 0, 0, { size: 64, fill: FLAT.mint, lw: 0, shadow: false }); }); return; }
    space(ctx, t);
    globeGrids(ctx, 400, 900, 520, t, {});
    const k = ease.out(L(t, esp, esp + 1.5));
    ctx.save(); ctx.translate(1250 - 200 * (1 - k), 480 + 300 * (1 - k)); ctx.rotate(Math.sin(t) * 0.1);
    ctx.fillStyle = '#3a86ff'; for (const sx of [-1, 1]) { ctx.fillRect(sx * 130 - (sx < 0 ? 200 : 0), -50, 200, 100); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 3; for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(sx * 130 - (sx < 0 ? 200 : 0) + i * 40, -50); ctx.lineTo(sx * 130 - (sx < 0 ? 200 : 0) + i * 40, 50); ctx.stroke(); } }
    ctx.fillStyle = '#ced4da'; rrect(ctx, -130, -90, 260, 180, 24); ctx.fill(); for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) { ctx.fillStyle = Math.sin(t * 5 + r + c * 2) > 0 ? '#5ee0f0' : '#7cf29c'; ctx.fillRect(-100 + c * 34, -60 + r * 44, 20, 10); } ctx.restore();
    popIn(ctx, t, esp, 1200, 130, () => text(ctx, '¡AL ESPACIO! 🚀', 0, 0, { size: 110, fill: FLAT.accent }));
    if (t > prox) pill(ctx, t, prox, 1250, 820, 'PRÓXIMO VIDEO', '#fff', '#3a0ca3', 560, 60);
  }, { mood: 'mystery' });
}
{ // 49. Pantalla final
  const a = V.VOICE_END + 0.2; fx(a + 0.6, 'sparkle', 0.5); fx(SCENE.duration - 0.9, 'whoosh', 0.4, 0.7);
  shot(a, (ctx, lt, d, t) => {
    space(ctx, t);
    aiCore(ctx, 1500, 760, 90, t, { mood: 'happy' });
    leo(ctx, 960, 1000, 1.1, E(t, { mouth: 'grin', handR: [150, -480 + Math.sin(t * 6) * 30] }));
    ctx.fillStyle = 'rgba(255,255,255,0.12)'; rrect(ctx, 120, 230, 760, 428, 24); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 6; ctx.setLineDash([24, 16]); rrect(ctx, 120, 230, 760, 428, 24); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'SIGUIENTE VIDEO', 500, 444, { size: 64, fill: '#fff' });
    ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.beginPath(); ctx.arc(1500, 330, 150, 0, Math.PI * 2); ctx.fill();
    text(ctx, '¡SUSCRÍBETE!', 1500, 540, { size: 70, fill: FLAT.accent });
    const fade = L(t, SCENE.duration - 1, SCENE.duration - 0.1); if (fade > 0) { ctx.fillStyle = `rgba(0,0,0,${fade})`; ctx.fillRect(0, 0, W, H); }
  }, { quiet: true, mood: 'happy' });
}

// ======================= ESCENARIOS PROPIOS DE ESTE VIDEO =======================
function sceneKitchenBright(ctx, t) { // cocina moderna menta (distinta a la del video 002)
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#e8fff6'); g.addColorStop(1, '#c7f0e0'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(0,0,0,0.04)'; for (let x = 0; x < W; x += 60) for (let y = 300; y < 700; y += 60) ctx.fillRect(x + ((y / 60) % 2) * 30, y, 56, 56);
  ctx.fillStyle = '#5ee0c0'; for (let i = 0; i < 4; i++) { rrect(ctx, 760 + i * 280, 90, 250, 180, 14); ctx.fill(); ctx.fillStyle = '#4cc9a8'; ctx.fillRect(760 + i * 280 + 110, 170, 30, 10); ctx.fillStyle = '#5ee0c0'; }
  ctx.fillStyle = '#fff'; rrect(ctx, 120, 100, 380, 300, 16); ctx.fill(); ctx.fillStyle = '#90e0ef'; ctx.fillRect(140, 120, 340, 260); ctx.fillStyle = '#fff3b0'; ctx.beginPath(); ctx.arc(400, 190, 40, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(304, 120, 10, 260);
  ctx.fillStyle = '#f8f9fa'; ctx.fillRect(0, 700, W, 40); ctx.fillStyle = '#2a9d8f'; ctx.fillRect(0, 740, W, 340); ctx.fillStyle = 'rgba(0,0,0,0.1)'; for (let x = 0; x < W; x += 320) ctx.fillRect(x, 740, 6, 340);
  for (let i = 0; i < 3; i++) { const x = 1500 + i * 70; ctx.fillStyle = ['#ff6b5b', '#ffd23f', '#8b7bff'][i]; rrect(ctx, x - 25, 610, 50, 90, 10); ctx.fill(); }
  for (let k = 0; k < 3; k++) { const p = (t * 0.5 + k / 3) % 1; ctx.strokeStyle = `rgba(255,255,255,${0.8 * (1 - p)})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(1700 + Math.sin(p * 8 + k) * 12, 640 - p * 120); ctx.lineTo(1700 + Math.sin(p * 8 + k + 1) * 12, 610 - p * 120); ctx.stroke(); }
  ctx.fillStyle = '#495057'; rrect(ctx, 1650, 640, 100, 60, 14); ctx.fill();
}
function sceneCafe(ctx, t) { // cafetería cálida
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ffe8d6'); g.addColorStop(1, '#ddbea9'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#6b4226'; rrect(ctx, 1220, 120, 560, 300, 16); ctx.fill(); ctx.fillStyle = '#2b2d42'; ctx.fillRect(1240, 140, 520, 260); ['CAFÉ ......$2', 'LATTE .....$3', 'TÉ ........$2'].forEach((s, i) => text(ctx, s, 1500, 200 + i * 75, { size: 40, fill: '#fff', lw: 0, shadow: false }));
  for (const x of [300, 700, 1100]) { ctx.strokeStyle = '#3d2817'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 200 + Math.sin(t + x) * 4); ctx.stroke(); glow(ctx, x, 230, 160, '#ffd166', 0.45); ctx.fillStyle = '#e09f3e'; ctx.beginPath(); ctx.moveTo(x - 50, 240); ctx.lineTo(x - 26, 200); ctx.lineTo(x + 26, 200); ctx.lineTo(x + 50, 240); ctx.fill(); }
  ctx.fillStyle = '#9c6644'; ctx.fillRect(0, 760, W, 320); ctx.fillStyle = '#7f5539'; ctx.fillRect(0, 760, W, 22);
  ctx.fillStyle = '#b08968'; rrect(ctx, 1000, 640, 900, 130, 12); ctx.fill(); ctx.fillStyle = '#7f5539'; ctx.fillRect(1000, 640, 900, 16);
  ctx.fillStyle = '#adb5bd'; rrect(ctx, 1600, 500, 160, 140, 16); ctx.fill(); ctx.fillStyle = '#495057'; ctx.fillRect(1650, 600, 60, 20);
  for (let k = 0; k < 3; k++) { const p = (t * 0.6 + k / 3) % 1; ctx.strokeStyle = `rgba(255,255,255,${0.9 * (1 - p)})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(1680 + Math.sin(p * 8 + k) * 14, 490 - p * 100); ctx.lineTo(1680 + Math.sin(p * 8 + k + 1) * 14, 460 - p * 100); ctx.stroke(); }
  for (let i = 0; i < 2; i++) { ctx.fillStyle = '#52b788'; ctx.save(); ctx.translate(100 + i * 1700 * 0, 760); for (let j = 0; j < 5; j++) { ctx.save(); ctx.rotate(-0.9 + j * 0.45 + Math.sin(t + j) * 0.05); ctx.beginPath(); ctx.ellipse(0, -90, 20, 80, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); } ctx.restore(); }
}
function sceneRoomIA(ctx, t) { // estudio de Leo con escritorio y ventana de tarde (nuevo)
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#3d405b'); g.addColorStop(1, '#2b2d42'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#f2cc8f'; rrect(ctx, 1100, 150, 600, 380, 16); ctx.fill(); const sg = ctx.createLinearGradient(0, 170, 0, 510); sg.addColorStop(0, '#ff9e00'); sg.addColorStop(1, '#f72585'); ctx.fillStyle = sg; ctx.fillRect(1120, 170, 560, 340); ctx.fillStyle = '#7b2cbf'; const r = rng(3); for (let x = 1120; x < 1680; x += 50) { const h = 60 + r() * 120; ctx.fillRect(x, 510 - h, 44, h); } ctx.fillStyle = '#f2cc8f'; ctx.fillRect(1395, 170, 10, 340); glow(ctx, 1400, 340, 400, '#ff9e00', 0.25);
  // repisa con trofeos y plantas
  ctx.fillStyle = '#81b29a'; ctx.fillRect(160, 300, 520, 16); [['📚', 220], ['🏆', 360], ['🪴', 500], ['🎧', 620]].forEach(([e, x]) => text(ctx, e, x, 260, { size: 70, lw: 0, shadow: false }));
  // tira de luces LED
  for (let i = 0; i < 30; i++) { const c = `hsl(${(i * 12 + t * 60) % 360},90%,65%)`; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(40 + i * 64, 60, 7, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#6b705c'; ctx.fillRect(0, 820, W, 260); ctx.fillStyle = '#a5a58d'; ctx.fillRect(0, 820, W, 14);
}

V.terminar();
