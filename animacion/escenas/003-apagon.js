// VIDEO 003 — ¿Qué pasaría si el mundo se quedara 72 horas sin luz? (estilo plano, Leo)
THEME.outline = 0;
const V = crearVideo({ voces: [1, 2, 3, 4, 5].map(i => `audio/003-parte${i}.mp3`), hueco: 0.7, final: 19 });
const SCENE = V.SCENE, SHOTS = V.SHOTS;
const { shot, fx, PS, PE, SS, L } = V; const WD = V.W;
const e0 = (t, x) => E(t, x);
const darkOv = (ctx, a) => { if (a > 0) { ctx.fillStyle = `rgba(5,5,25,${a})`; ctx.fillRect(0, 0, W, H); } };
const H_ = (h) => () => `HORA ${h}`;

// ======================= PARTE 1: el rumor =======================
{ // 1. Todo se apaga
  const a = 0, off = SS(0, 0, 1), icons = SS(0, 0, 2), city = SS(0, 0, 3);
  fx(off, 'impact', 0.8, 0.5); fx(off + 0.05, 'whoosh', 0.6, 0.4); [0, 0.35, 0.7].forEach((d, i) => fx(icons + d, 'pop', 0.6, 1 + i * 0.15)); fx(city, 'ff', 0.3, 0.5, { dur: 2 });
  shot(a, (ctx, lt, d, t) => {
    if (t < city) {
      const dark = t > off ? 0.72 + 0.08 * Math.sin(t * 40) * (1 - L(t, off, off + 0.6)) : 0;
      sceneLivingRoom(ctx, t, { lights: t < off ? 1 : 0 });
      leo(ctx, 760, 1000, 1.15, e0(t, { mouth: t > off ? 'o' : 'grin', mouthOpen: 0.6, shock: t > off ? 0.6 : 0, look: t > off ? [Math.sin(t * 3), -0.3] : [0.6, 0.2], hold: t < off ? 'phone' : null, handR: t < off ? [105, -365] : null }));
      darkOv(ctx, dark);
      if (t > icons) [['💡', 1250], ['📶', 1500], ['🧊', 1750]].forEach(([em, x], i) => popIn(ctx, t, icons + i * 0.35, x, 300, () => { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 95, 0, Math.PI * 2); ctx.fill(); text(ctx, em, 0, 6, { size: 90, lw: 0, shadow: false }); ctx.strokeStyle = '#ef233c'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(-70, -70); ctx.lineTo(70, 70); ctx.stroke(); }));
    } else {
      sceneCityNight(ctx, t, { lights: 1 - L(t, city, city + 2.2) });
      popIn(ctx, t, city + 0.5, W / 2, 150, () => text(ctx, '¡TODA LA CIUDAD!', 0, 0, { size: 120, fill: FLAT.accent }));
    }
  }, { quiet: true, mood: 'tense' });
}
{ // 2. El mensaje viral... ¡FALSO!
  const a = PS(0, 1), falso = WD(0, 1, 'falso');
  fx(a + 0.4, 'pop', 0.6); fx(a + 1.2, 'pop', 0.6, 1.2); fx(a + 2, 'pop', 0.6, 1.4); fx(falso, 'impact', 0.9); fx(falso + 0.05, 'boing', 0.8, 0.7);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#3a0ca3', '#10002b', 2);
    bigPhone(ctx, 640, 560, 1.5, t, { time: '9:41', rot: Math.sin(t * 2) * 0.03 });
    ['⚠️ APAGÓN MUNDIAL', '17 DE NOVIEMBRE', '72 HORAS SIN LUZ 😱'].forEach((m, i) => popIn(ctx, t, a + 0.4 + i * 0.8, 1300, 300 + i * 170, () => { card(ctx, -330, -60, 660, 120, i === 2 ? '#ffccd5' : '#fff', 30); text(ctx, m, 0, 0, { size: 50, fill: FLAT.ink, lw: 0, shadow: false }); }));
    if (t > falso) { ctx.fillStyle = `rgba(255,255,255,${0.6 * (1 - L(t, falso, falso + 0.3))})`; ctx.fillRect(0, 0, W, H); popIn(ctx, t, falso, 1100, 520, () => { ctx.rotate(-0.15); ctx.strokeStyle = '#ef233c'; ctx.lineWidth = 30; rrect(ctx, -420, -150, 840, 300, 30); ctx.stroke(); text(ctx, 'FALSO', 0, 10, { size: 240, fill: '#ef233c', stroke: '#fff', lw: 18 }); }); }
  }, { mood: 'happy' });
}
{ // 3. De dónde salió: la prueba de alertas
  const a = PS(0, 2), usa = SS(0, 2, 1), min = SS(0, 2, 2), cel = SS(0, 2, 3);
  fx(usa, 'ding', 0.6, 1.6); for (let i = 0; i < 6; i++) fx(usa + 0.5 + i * 0.35, 'tick', 0.3, 2); fx(min, 'pop', 0.6); fx(cel, 'boing', 0.6, 0.7);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#1d3557', '#0b1a2e', 3); rays(ctx, t, 760, 560, 'rgba(255,255,255,0.05)');
    if (t < usa) { questionMarks(ctx, t, W / 2, 520, 3, FLAT.accent); popIn(ctx, t, a + 0.2, W / 2, 200, () => text(ctx, '¿DE DÓNDE SALIÓ?', 0, 0, { size: 120, fill: '#fff' })); return; }
    if (t < cel) {
      tvSet(ctx, 700, 560 + Math.sin(t * 2) * 6, 1.3, t, 'alerta');
      popIn(ctx, t, usa, 700, 120, () => text(ctx, 'EE. UU. · PRUEBA DE ALERTAS', 0, 0, { size: 70, fill: FLAT.accent }));
      if (t > min) { popIn(ctx, t, min, 1450, 380, () => stopwatch(ctx, t, '1 MIN')); popIn(ctx, t, min + 0.6, 1450, 760, () => radioIcon(ctx, 0, 0, 0.9, t)); }
    } else {
      bigPhone(ctx, 760, 560, 1.45, t, { muted: true, time: '2:20' });
      popIn(ctx, t, cel + 0.3, 1400, 520, () => { text(ctx, 'TU CELULAR', 0, -70, { size: 100, fill: '#fff' }); text(ctx, 'NI SUENA', 0, 60, { size: 130, fill: FLAT.accent }); });
    }
  });
}
{ // 4. Los Simpson: la fecha sin año
  const a = PS(0, 3), anio = SS(0, 3, 1);
  fx(a + 0.5, 'pop', 0.6); fx(anio, 'boing', 0.7, 1.3);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#ffd23f', '#ff9f1c', 4); rays(ctx, t, 700, 560, 'rgba(255,255,255,0.12)');
    tvSet(ctx, 700, 540, 1.25, t, 'caricatura');
    popIn(ctx, t, a + 0.5, 1400, 420, () => calendar(ctx, 0, 0, 1.1, 'NOVIEMBRE', '17', FLAT.coral));
    if (t > anio) { popIn(ctx, t, anio, 1400, 820, () => text(ctx, '¿DE QUÉ AÑO?', 0, 0, { size: 100, fill: '#ef233c', stroke: '#fff', lw: 14 })); leo(ctx, 300, 1080, 1.0, e0(t, { mouth: 'grin', rot: Math.sin(t * 12) * 0.04 })); }
  });
}
{ // 5. ¿Predicen el futuro? Coincidencias
  const a = PS(0, 4), temp = SS(0, 4, 1), coin = SS(0, 4, 2);
  for (let i = 0; i < 8; i++) fx(temp + i * 0.18, 'pop', 0.3, 1 + i * 0.05); fx(coin, 'sparkle', 0.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#7209b7', '#3a0ca3', 5);
    if (t < temp) { popIn(ctx, t, a + 0.2, W / 2, H / 2, () => { text(ctx, '¿PREDICEN', 0, -80, { size: 140, fill: '#fff' }); text(ctx, 'EL FUTURO?', 0, 80, { size: 140, fill: FLAT.accent }); }); return; }
    const n = Math.min(60, Math.floor((t - temp) * 18));
    for (let i = 0; i < n; i++) { const c = i % 10, r = Math.floor(i / 10); ctx.save(); ctx.translate(230 + c * 160, 230 + r * 110); ctx.rotate(Math.sin(t + i) * 0.05); ctx.fillStyle = ['#ffd23f', '#4cc9f0', '#ff8fab'][i % 3]; rrect(ctx, -65, -42, 130, 84, 10); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(-45, -25, 90, 50); ctx.restore(); }
    popIn(ctx, t, temp, W / 2, 110, () => text(ctx, 'CIENTOS DE CAPÍTULOS', 0, 0, { size: 90, fill: '#fff' }));
    if (t > coin) popIn(ctx, t, coin, W / 2, 940, () => { card(ctx, -440, -70, 880, 140, FLAT.accent, 70); text(ctx, '= MUCHAS COINCIDENCIAS', 0, 0, { size: 62, fill: FLAT.ink, lw: 0, shadow: false }); });
  });
}
{ // 6. ¿Y si de verdad pasara? Hora por hora
  const a = PS(0, 5), hora = SS(0, 5, 1);
  V.counterFirst = hora + 0.2; fx(hora + 0.2, 'pop', 0.9); fx(a + 0.4, 'ff', 0.3, 0.6, { dur: 2.5 });
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#000814', '#001d3d', 6);
    globeGrids(ctx, W / 2, 560, 360, t, {});
    const off = L(t, a + 0.4, a + 3); ctx.fillStyle = `rgba(0,0,10,${0.7 * off})`; ctx.beginPath(); ctx.arc(W / 2, 560, 362, 0, Math.PI * 2); ctx.fill();
    popIn(ctx, t, a + 0.3, W / 2, 120, () => text(ctx, '¿72 HORAS SIN LUZ?', 0, 0, { size: 110, fill: '#fff' }));
  }, { counter: H_(0), mood: 'tense' });
}
const TITLE_AT = PE(0, 5) + 0.1, TITLE_LEN = 3.4;
{ // TÍTULO
  const a = TITLE_AT; fx(a - 0.1, 'whoosh', 0.8); fx(a + 0.4, 'sparkle', 0.6); [0.6, 0.9, 1.2].forEach((d, i) => fx(a + d, 'pop', 0.5, 0.9 + i * 0.15));
  V.musicExtra.push([a - 0.2, 0.14], [a, 0.26], [a + TITLE_LEN - 0.2, 0.26], [a + TITLE_LEN, 0.14]);
  shot(a, (ctx, lt, d, t) => {
    sceneCityNight(ctx, t, { lights: 0.15 + 0.1 * Math.sin(t * 3) });
    const lines = [['¿QUÉ PASARÍA SI EL MUNDO', 96, '#ffffff', 280], ['SE QUEDARA 72 HORAS SIN LUZ?', 110, FLAT.accent, 430]]; let k = 0;
    lines.forEach(([str, size, fill, y], li) => { ctx.font = `${size}px Lilita`; const total = ctx.measureText(str).width; let x = W / 2 - total / 2; [...str].forEach(ch => { const w = ctx.measureText(ch).width, s = pop(lt, 0.3 + k * 0.022 + li * 0.15, 0.6); if (s > 0 && ch !== ' ') { ctx.save(); ctx.translate(x + w / 2, y + Math.sin(lt * 4 - k * 0.45) * 8); ctx.scale(s, s); text(ctx, ch, 0, 0, { size, fill }); ctx.restore(); } x += w; k++; }); });
    const up = ease.back(prog(lt, 1.2, 1.8));
    if (up > 0) { leo(ctx, W / 2, 1228 + 500 * (1 - up), 1.1, e0(t, { mouth: 'o', mouthOpen: 0.5, handR: [100, -470], look: [0.5, -0.5] })); flashlight(ctx, W / 2 + 120, 1228 + 500 * (1 - up) - 520, 0.8, t, true); }
  }, { trans: 'wipe', quiet: true });
}

// ======================= PARTE 2: hora 0 a hora 8 =======================
{ // 7. Hora cero: se va la luz
  const a = Math.max(TITLE_AT + TITLE_LEN, PS(1, 0) - 0.3), luz = SS(1, 0, 1);
  fx(luz, 'impact', 0.7, 0.5);
  shot(a, (ctx, lt, d, t) => {
    sceneLivingRoom(ctx, t, { lights: t < luz ? 1 : 0 });
    leo(ctx, 900, 1000, 1.15, e0(t, { mouth: t > luz ? 'o' : 'smile', mouthOpen: 0.5, shock: t > luz ? 0.5 : 0 }));
    darkOv(ctx, t > luz ? 0.72 : 0);
    popIn(ctx, t, a + 0.2, W / 2, 140, () => text(ctx, 'HORA CERO', 0, 0, { size: 130, fill: '#fff' }));
  }, { counter: H_(0), mood: 'tense' });
}
{ // 8. El silencio; el celular vale oro
  const a = PS(1, 1), refri = SS(1, 1, 1), cel = SS(1, 1, 2), oro = SS(1, 1, 3);
  fx(refri, 'whoosh', 0.4, 0.4); fx(cel, 'sparkle', 0.6); fx(oro, 'ding', 0.6, 1.3);
  shot(a, (ctx, lt, d, t) => {
    if (t < cel) { sceneLivingRoom(ctx, t, { lights: 0, fanSlow: L(t, a, refri + 1) }); leo(ctx, 900, 1000, 1.15, e0(t, { mouth: 'flat', look: [Math.sin(t * 1.5), -0.2] })); darkOv(ctx, 0.7); popIn(ctx, t, a + 0.3, W / 2, 140, () => text(ctx, 'SILENCIO...', 0, 0, { size: 120, fill: '#fff' })); return; }
    bgFlat(ctx, t, '#ffb703', '#fb8500', 8); rays(ctx, t, 700, 540, 'rgba(255,255,255,0.15)');
    bigPhone(ctx, 700, 560, 1.5, t, { battery: 0.87 - 0.02 * L(t, cel, cel + 5), time: '8:03' });
    if (t > oro) { for (let i = 0; i < 8; i++) { const ang = t * 1.5 + i * 0.8, rr = 360; ctx.save(); ctx.translate(700 + Math.cos(ang) * rr, 560 + Math.sin(ang) * rr * 0.7); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(0, 0, 32, 0, Math.PI * 2); ctx.fill(); text(ctx, '$', 0, 3, { size: 40, fill: '#e9b44c', lw: 0, shadow: false }); ctx.restore(); } popIn(ctx, t, oro, 1450, 540, () => text(ctx, '¡VALE ORO!', 0, 0, { size: 130, fill: '#fff' })); }
  }, { counter: H_(0) });
}
{ // 9. Elevadores y semáforos
  const a = PS(1, 2), sem = SS(1, 2, 1);
  fx(a + 0.3, 'impact', 0.5, 0.6); fx(sem, 'whoosh', 0.5); for (let i = 0; i < 5; i++) fx(sem + 0.6 + i * 0.5, 'boing', 0.25, 1.8);
  shot(a, (ctx, lt, d, t) => {
    if (t < sem) { // elevador atorado
      ctx.fillStyle = '#495057'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#6c757d'; ctx.fillRect(560, 120, 800, 900);
      const emer = 0.5 + 0.5 * Math.sin(t * 6); const g = ctx.createRadialGradient(960, 160, 10, 960, 160, 700); g.addColorStop(0, `rgba(255,80,60,${0.35 * emer})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      drawPerson(ctx, 800, 1000, 1.05, e0(t, { mouth: 'o', mouthOpen: 0.4, look: [0, -1], handR: [120, -480] }), PEOPLE.adulto);
      leo(ctx, 1120, 1000, 1.05, e0(t, { mouth: 'flat', look: [-1, 0], shock: 0.3 }));
      darkOv(ctx, 0.45); ctx.fillStyle = '#ef233c'; ctx.beginPath(); ctx.arc(960, 160, 22, 0, Math.PI * 2); ctx.fill();
      popIn(ctx, t, a + 0.3, W / 2, 1000, () => { card(ctx, -320, -55, 640, 110, '#212529', 55); text(ctx, '¡ATRAPADOS!', 0, 0, { size: 70, fill: FLAT.accent, lw: 0, shadow: false }); });
    } else { // cruce sin semáforos
      sceneStreetDay(ctx, t);
      trafficLight(ctx, 1500, 520, 1, t, false); trafficLight(ctx, 420, 520, 1, t, false);
      for (let i = 0; i < 4; i++) { const dir = i % 2 ? -1 : 1, x = 960 + dir * (500 - ((t * 120 + i * 200) % 600)); ctx.save(); ctx.translate(x, 900 + (i % 2) * 70); ctx.scale(dir * 0.45, 0.45); drawCar(ctx, 0, 0, 1, t, [FLAT.coral, FLAT.sky, FLAT.mint, FLAT.purple][i], 0.4); ctx.restore(); }
      for (let i = 0; i < 3; i++) { const p = (t * 1.5 + i / 3) % 1; ctx.globalAlpha = 1 - p; text(ctx, '¡PIIIP!', 700 + i * 260, 640 - p * 120, { size: 54, fill: '#fff' }); ctx.globalAlpha = 1; }
      popIn(ctx, t, sem, 860, 140, () => text(ctx, '¡CAOS EN LAS CALLES!', 0, 0, { size: 104, fill: '#fff' }));
    }
  }, { counter: H_(0), mood: 'tense' });
}
{ // 10. Hora uno: el wifi muere; antenas con batería
  const a = PS(1, 3), senal = SS(1, 3, 2), ant = SS(1, 3, 4), poco = SS(1, 3, 5);
  fx(a + 0.4, 'pop', 0.6, 0.7); fx(ant, 'ding', 0.5); fx(poco, 'ff', 0.25, 0.6, { dur: 1.5 });
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#4361ee', '#3a0ca3', 10);
    if (t < senal) { popIn(ctx, t, a + 0.4, W / 2, 520, () => { wifiIcon(ctx, 0, 0, 2, t, false); }); popIn(ctx, t, a + 0.2, W / 2, 130, () => text(ctx, 'HORA UNO', 0, 0, { size: 120, fill: '#fff' })); return; }
    bigPhone(ctx, 560, 560, 1.3, t, { signal: t < poco ? 0.75 : 0.75 - 0.5 * L(t, poco, poco + 1.5), time: '9:03' });
    if (t > ant) { cellTower(ctx, 1350, 900, 1.2, t); battery(ctx, 1650, 420, 1.3, 1 - 0.8 * L(t, ant, PE(1, 3))); popIn(ctx, t, ant, 1150, 230, () => text(ctx, 'BATERÍAS DE RESPALDO', 0, 0, { size: 70, fill: '#fff' })); }
    else popIn(ctx, t, senal, 1350, 500, () => text(ctx, '¿POR QUÉ HAY SEÑAL?', 0, 0, { size: 84, fill: '#fff' }));
  }, { counter: H_(1) });
}
{ // 11. Tarjetas no pasan; el efectivo es el rey
  const a = PS(1, 4), tarj = SS(1, 4, 1), rey = SS(1, 4, 2);
  fx(tarj, 'boing', 0.6, 0.6); fx(tarj + 0.6, 'boing', 0.5, 0.5); fx(rey, 'sparkle', 0.7); fx(rey + 0.1, 'ding', 0.6, 1.3);
  shot(a, (ctx, lt, d, t) => {
    if (t < rey) {
      bgFlat(ctx, t, '#2b2d42', '#14152a', 11);
      cardTerminal(ctx, 640, 560, 1.3, t, t > tarj); atm(ctx, 1350, 560, 1.2, t);
      popIn(ctx, t, a + 0.2, W / 2, 130, () => text(ctx, '¿VAS A COMPRAR ALGO?', 0, 0, { size: 96, fill: '#fff' }));
    } else {
      bgFlat(ctx, t, '#2d6a4f', '#1b4332', 12); rays(ctx, t, W / 2, 560, 'rgba(255,255,255,0.1)');
      cashIcon(ctx, W / 2, 600, 2.2, t); crown(ctx, W / 2, 330 + Math.sin(t * 4) * 10, 1.3);
      popIn(ctx, t, rey, W / 2, 850, () => text(ctx, '¡EL EFECTIVO ES EL REY!', 0, 0, { size: 96, fill: FLAT.accent }));
    }
  }, { counter: H_(1) });
}
{ // 12. Hora tres: el súper se vacía
  const a = PS(1, 5), vac = SS(1, 5, 2), cong = SS(1, 5, 3);
  for (let i = 0; i < 8; i++) fx(vac + i * 0.3, 'pop', 0.35, 0.9 + (i % 4) * 0.15); fx(cong, 'ff', 0.25, 1.4, { dur: 1.2 });
  shot(a, (ctx, lt, d, t) => {
    ctx.fillStyle = '#f8f9fa'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#dee2e6'; ctx.fillRect(0, 900, W, 180);
    darkOv(ctx, 0.25);
    const fill = 1 - 0.85 * L(t, vac, vac + 3);
    shelves(ctx, 120, 300, 760, t, fill); shelves(ctx, 1040, 300, 760, t, fill);
    for (let i = 0; i < 4; i++) { const x = ((i * 520 + t * 260 * (i % 2 ? 1 : -1)) % (W + 300) + W + 300) % (W + 300) - 150; drawPerson(ctx, x, 1060, 0.7, e0(t + i, { walk: true, mouth: 'o', mouthOpen: 0.3, holdL: null, flip: i % 2 === 0 }), [PEOPLE.adulto, PEOPLE.amigo1, PEOPLE.cientifica, PEOPLE.amigo2][i]); }
    if (t > cong) popIn(ctx, t, cong, 1600, 200, () => thermometer(ctx, 0, 0, 0.3 + 0.5 * L(t, cong, cong + 2), t));
    popIn(ctx, t, a + 0.2, 860, 150, () => text(ctx, t > vac ? '¡AGUA, PAN Y PILAS!' : 'HORA TRES', 0, 0, { size: 96, fill: '#1d3557' }));
  }, { counter: H_(3) });
}
{ // 13. Hora seis: el agua deja de llegar
  const a = PS(1, 6), bombas = SS(1, 6, 2), stop = SS(1, 6, 3), altos = SS(1, 6, 4);
  fx(bombas, 'pop', 0.5); fx(stop, 'impact', 0.4, 0.6); fx(altos, 'boing', 0.6, 0.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#48cae4', '#0077b6', 13);
    buildingWater(ctx, 1150, 930, t, t < stop ? 1 : 1 - L(t, stop, stop + 3));
    if (t > altos) { leo(ctx, 1340, 330, 0.5, e0(t, { mouth: 'o', mouthOpen: 0.5, handR: [120, -380], look: [1, 0.2], noShadow: true })); popIn(ctx, t, altos, 420, 700, () => { card(ctx, -320, -110, 640, 220, '#fff', 40); text(ctx, 'LOS PISOS ALTOS', 0, -35, { size: 54, fill: '#0077b6', lw: 0, shadow: false }); text(ctx, 'SE QUEDAN SIN AGUA', 0, 40, { size: 54, fill: FLAT.coral, lw: 0, shadow: false }); }); }
    popIn(ctx, t, a + 0.2, 470, 160, () => text(ctx, t > bombas ? 'BOMBAS ELÉCTRICAS' : 'HORA SEIS', 0, 0, { size: 70, fill: '#fff' }));
  }, { counter: H_(6) });
}
{ // 14. Hora ocho: calor y frío; Texas 2021
  const a = PS(1, 7), texas = SS(1, 7, 2);
  fx(a + 0.4, 'ff', 0.25, 1.2, { dur: 1.2 }); fx(texas, 'whoosh', 0.6, 0.5); fx(texas + 0.4, 'pop', 0.6);
  shot(a, (ctx, lt, d, t) => {
    if (t < texas) {
      bgFlat(ctx, t, '#ff6b5b', '#4cc9f0', 14); ctx.fillStyle = '#fff'; ctx.fillRect(W / 2 - 4, 0, 8, H);
      thermometer(ctx, 480, 700, 0.85 + 0.05 * Math.sin(t * 3), t); thermometer(ctx, 1440, 700, 0.12 + 0.05 * Math.sin(t * 3), t);
      acUnit2(ctx, 480, 220, t, false); text(ctx, '❄', 1440, 220, { size: 140, fill: '#fff' });
      popIn(ctx, t, a + 0.3, W / 2, 960, () => { card(ctx, -380, -60, 760, 120, FLAT.ink, 60); text(ctx, 'SIN CLIMA NI CALEFACCIÓN', 0, 0, { size: 50, fill: '#fff', lw: 0, shadow: false }); });
    } else {
      sceneCityNight(ctx, t, { lights: 0.2 });
      for (let i = 0; i < 90; i++) { const r = rng(i + 400), x = (r() * W + Math.sin(t + i) * 40) % W, y = (r() * H + t * (60 + r() * 60)) % H; ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.arc(x, y, 3 + r() * 4, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = '#e9ecef'; ctx.fillRect(0, H * 0.86, W, H * 0.14);
      drawPerson(ctx, 760, 1000, 1.05, e0(t, { mouth: 'wobbly', rot: Math.sin(t * 40) * 0.01 }), PEOPLE.adulto);
      leo(ctx, 1160, 1000, 1.05, e0(t, { mouth: 'wobbly', rot: Math.sin(t * 40 + 1) * 0.01, handL: [50, -270], handR: [-50, -260] }));
      popIn(ctx, t, texas + 0.4, W / 2, 140, () => { card(ctx, -300, -70, 600, 140, '#fff', 30); text(ctx, 'TEXAS · 2021', 0, 0, { size: 80, fill: '#1d3557', lw: 0, shadow: false }); });
    }
  }, { counter: H_(8) });
}

// ======================= PARTE 3: la noche y los días siguientes =======================
{ // 15. Hora doce: cae la noche
  const a = PS(2, 0) - 0.3; fx(a + 0.5, 'whoosh', 0.5, 0.5);
  shot(a, (ctx, lt, d, t) => {
    const dusk = L(t, a, a + 2.5);
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, mix('#ff9e7a', '#05051a', dusk)); g.addColorStop(1, mix('#ffd6a5', '#0b0b25', dusk)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#ffb703'; ctx.globalAlpha = 1 - dusk; ctx.beginPath(); ctx.arc(1500, 400 + dusk * 500, 90, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    sceneCityNight(ctx, t, { lights: 0 }); ctx.fillStyle = `rgba(255,150,100,${0.4 * (1 - dusk)})`; ctx.fillRect(0, 0, W, H);
    popIn(ctx, t, a + 0.4, W / 2, 160, () => text(ctx, 'CAE LA NOCHE', 0, 0, { size: 130, fill: '#fff' }));
  }, { trans: 'wipe', counter: H_(12), mood: 'tense' });
}
{ // 16. La ciudad a oscuras... ¡y las estrellas!
  const a = PS(2, 1), est = SS(2, 1, 1);
  fx(est, 'sparkle', 0.8); fx(est + 0.6, 'sparkle', 0.5, 1.3);
  shot(a, (ctx, lt, d, t) => {
    sceneCityNight(ctx, t, { lights: 0, stars: t < est ? 0.2 : 0.2 + 0.8 * L(t, est, est + 2) });
    leo(ctx, 760, 1080, 1.1, e0(t, { mouth: t > est ? 'grin' : 'flat', look: [0.3, -1], eyeSize: t > est ? 1.15 : 1 }));
    if (t > est) for (let i = 0; i < 3; i++) { const p = (t * 0.4 + i / 3) % 1; ctx.strokeStyle = `rgba(255,255,255,${1 - p})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(200 + i * 500 + p * 400, 100 + p * 150); ctx.lineTo(240 + i * 500 + p * 400, 115 + p * 150); ctx.stroke(); }
    if (t > est) popIn(ctx, t, est + 0.5, 1400, 400, () => text(ctx, '¡MILES DE ESTRELLAS!', 0, 0, { size: 84, fill: '#fff' }));
  }, { counter: H_(14), mood: 'happy' });
}
{ // 17. Velas: con cuidado; mejor linternas
  const a = PS(2, 2), lint = SS(2, 2, 1);
  fx(a + 0.3, 'pop', 0.5); fx(lint, 'ding', 0.6, 1.2);
  shot(a, (ctx, lt, d, t) => {
    ctx.fillStyle = '#1a1538'; ctx.fillRect(0, 0, W, H);
    // cortina junto a la vela
    ctx.fillStyle = '#7a3fa0'; ctx.beginPath(); ctx.moveTo(420, 0); ctx.bezierCurveTo(470 + Math.sin(t) * 20, 400, 380, 700, 450, 1080); ctx.lineTo(160, 1080); ctx.lineTo(160, 0); ctx.fill();
    candle(ctx, 620, 860, 1.4, t); ctx.fillStyle = '#6d4c41'; ctx.fillRect(380, 960, 520, 30);
    popIn(ctx, t, a + 0.5, 620, 330, () => { ctx.fillStyle = FLAT.accent; ctx.beginPath(); ctx.moveTo(0, -110); ctx.lineTo(120, 90); ctx.lineTo(-120, 90); ctx.fill(); text(ctx, '!', 0, 25, { size: 130, fill: FLAT.ink, lw: 0, shadow: false }); });
    if (t > lint) { flashlight(ctx, 1250, 700, 1.4, t, true); popIn(ctx, t, lint, 1400, 260, () => { card(ctx, -300, -70, 600, 140, FLAT.mint, 70); text(ctx, '✓ LINTERNAS', 0, 0, { size: 70, fill: FLAT.ink, lw: 0, shadow: false }); }); }
  }, { counter: H_(16) });
}
{ // 18. Sin gasolina
  const a = PS(2, 3), q = SS(2, 3, 1), imp = SS(2, 3, 2);
  fx(imp, 'impact', 0.6); fx(imp + 0.05, 'boing', 0.6, 0.6);
  shot(a, (ctx, lt, d, t) => {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#8ecae6'); g.addColorStop(1, '#caf0f8'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#6c757d'; ctx.fillRect(0, 900, W, 180); ctx.fillStyle = '#e63946'; ctx.fillRect(200, 220, 1100, 80); ctx.fillStyle = '#adb5bd'; ctx.fillRect(260, 300, 30, 600); ctx.fillRect(1210, 300, 30, 600);
    gasPump(ctx, 560, 900, 1.1, t, false); gasPump(ctx, 940, 900, 1.1, t, false);
    for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(1450 + i * 300, 960); ctx.scale(-0.45, 0.45); drawCar(ctx, 0, 0, 1, t, [FLAT.sky, FLAT.mint, FLAT.purple][i], 0); ctx.restore(); }
    leo(ctx, 760, 1000, 1.0, e0(t, { mouth: t > imp ? 'sad' : 'o', mouthOpen: 0.3, handR: [130, -330] }));
    if (t > imp) popIn(ctx, t, imp, 860, 150, () => text(ctx, '¡IMPOSIBLE!', 0, 0, { size: 140, fill: FLAT.coral }));
    else popIn(ctx, t, q, W / 2, 140, () => text(ctx, '¿GASOLINA?', 0, 0, { size: 130, fill: '#1d3557' }));
  }, { counter: H_(18) });
}
{ // 19. Hora 24: el refri
  const a = PS(2, 4), mejor = SS(2, 4, 2), cuatro = SS(2, 4, 3), dos = SS(2, 4, 4), perder = SS(2, 4, 5);
  fx(a + 0.2, 'ding', 0.6, 1.5); fx(mejor, 'boing', 0.6, 0.5); fx(cuatro, 'pop', 0.6); fx(dos, 'pop', 0.6, 1.2); fx(perder, 'blip', 0.5, 0.6);
  shot(a, (ctx, lt, d, t) => {
    sceneKitchen(ctx, t, { fridgeOpen: t > mejor - 0.6 }); darkOv(ctx, 0.5);
    leo(ctx, 640, 1000, 1.15, e0(t, { flip: true, mouth: t > mejor ? 'wobbly' : 'o', mouthOpen: 0.4, handR: [150, -360], look: [1, 0], eyeSize: t > mejor ? 1.2 : 1 }));
    if (t > mejor) for (let i = 0; i < 4; i++) { const p = (t * 0.7 + i / 4) % 1; ctx.strokeStyle = `rgba(128,185,24,${1 - p})`; ctx.lineWidth = 8; ctx.beginPath(); for (let y = 0; y < 120; y += 10) { const x = 330 + i * 40 + Math.sin(y * 0.1 + t * 5 + i) * 15; y ? ctx.lineTo(x, 640 - p * 200 - y) : ctx.moveTo(x, 640 - p * 200 - y); } ctx.stroke(); }
    if (t > cuatro) popIn(ctx, t, cuatro, 1450, 330, () => { card(ctx, -300, -90, 600, 180, '#fff', 40); text(ctx, 'REFRI CERRADO: 4 H', 0, 0, { size: 56, fill: '#1d3557', lw: 0, shadow: false }); });
    if (t > dos) popIn(ctx, t, dos, 1450, 580, () => { card(ctx, -300, -90, 600, 180, '#fff', 40); text(ctx, 'CONGELADOR: 2 DÍAS', 0, 0, { size: 56, fill: '#0077b6', lw: 0, shadow: false }); });
    popIn(ctx, t, a + 0.2, W / 2, 130, () => text(ctx, '¡24 HORAS!', 0, 0, { size: 120, fill: FLAT.accent }));
  }, { counter: H_(24), bump: [PS(2, 4)], trans: 'flash' });
}
{ // 20. Hospitales con generador
  const a = PS(2, 5), comb = SS(2, 5, 1);
  fx(a + 0.3, 'ff', 0.25, 0.5, { dur: 2 }); fx(comb, 'whoosh', 0.5, 0.8);
  shot(a, (ctx, lt, d, t) => {
    sceneCityNight(ctx, t, { lights: 0 });
    hospital(ctx, 760, 820, 1.1, t);
    if (t > comb) { const x = lerp(-300, 1500, L(t, comb, comb + 4)); fuelTruck(ctx, x, 980, 0.9, t); popIn(ctx, t, comb, 1450, 200, () => text(ctx, '¿Y EL COMBUSTIBLE?', 0, 0, { size: 80, fill: FLAT.accent })); }
    popIn(ctx, t, a + 0.3, 760, 150, () => text(ctx, 'HOSPITALES', 0, 0, { size: 110, fill: '#fff' }));
  }, { counter: H_(28) });
}
{ // 21. Hora 36: hervir el agua
  const a = PS(2, 6), herv = SS(2, 6, 2);
  fx(a + 0.5, 'pop', 0.5); fx(herv, 'ding', 0.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#023e8a', '#03045e', 21);
    if (t < herv) { waterPlant(ctx, W / 2, 800, 1.2, t); popIn(ctx, t, a + 0.3, W / 2, 140, () => text(ctx, 'PLANTAS DE AGUA', 0, 0, { size: 110, fill: '#fff' })); }
    else { campStove(ctx, 960, 900, 1.3, t); popIn(ctx, t, herv, 860, 160, () => text(ctx, 'HIERVE EL AGUA', 0, 0, { size: 130, fill: FLAT.accent })); }
  }, { counter: H_(36) });
}
{ // 22. Hora 48: celulares apagados, el radio de pilas
  const a = PS(2, 7), apag = SS(2, 7, 1), radio = SS(2, 7, 3);
  fx(apag, 'blip', 0.6, 0.5); fx(radio, 'sparkle', 0.6); fx(radio + 0.2, 'ding', 0.5, 1.2);
  shot(a, (ctx, lt, d, t) => {
    if (t < radio) { bgFlat(ctx, t, '#2b2d42', '#14152a', 22); bigPhone(ctx, W / 2, 560, 1.5, t, { battery: Math.max(0, 0.05 - 0.05 * L(t, apag, apag + 1)), time: '' }); if (t > apag + 1) { ctx.fillStyle = '#000'; rrect(ctx, W / 2 - 187, 560 - 375, 375, 750, 45); ctx.fill(); } popIn(ctx, t, a + 0.2, W / 2, 110, () => text(ctx, 'HORA 48', 0, 0, { size: 110, fill: '#fff' })); }
    else { sceneLivingRoom(ctx, t, { lights: 0 }); darkOv(ctx, 0.45); candle(ctx, 1550, 900, 0.8, t); radioIcon(ctx, 1150, 760, 1.2, t, true); leo(ctx, 700, 1000, 1.15, e0(t, { mouth: 'grin', look: [1, 0.3], handR: [180, -300] })); popIn(ctx, t, radio, 860, 150, () => text(ctx, '¡EL RADIO DE PILAS!', 0, 0, { size: 110, fill: FLAT.accent })); }
  }, { counter: H_(48) });
}
{ // 23. Hora 72: tiendas cerradas... los vecinos se ayudan
  const a = PS(2, 8), esper = SS(2, 8, 2), ayuda = SS(2, 8, 3);
  fx(a + 0.4, 'impact', 0.4, 0.6); fx(ayuda, 'sparkle', 0.7); fx(ayuda + 0.1, 'ding', 0.6, 1.3);
  shot(a, (ctx, lt, d, t) => {
    if (t < esper) { sceneStreetDay(ctx, t, 0.4); ctx.fillStyle = '#6c757d'; ctx.fillRect(560, 380, 800, 520); for (let i = 0; i < 10; i++) { ctx.fillStyle = i % 2 ? '#adb5bd' : '#ced4da'; ctx.fillRect(560, 380 + i * 52, 800, 26); } popIn(ctx, t, a + 0.3, 960, 620, () => { ctx.rotate(Math.sin(t * 2) * 0.05); card(ctx, -220, -70, 440, 140, '#ef233c', 20); text(ctx, 'CERRADO', 0, 0, { size: 80, fill: '#fff', lw: 0, shadow: false }); }); popIn(ctx, t, a + 0.2, W / 2, 140, () => text(ctx, 'HORA 72', 0, 0, { size: 120, fill: '#1d3557' })); }
    else {
      sceneCityNight(ctx, t, { lights: 0, stars: 0.6 });
      const ppl = [[PEOPLE.adulto, 420], [PEOPLE.leo, 800], [PEOPLE.cientifica, 1160], [PEOPLE.amigo1, 1520]];
      ppl.forEach(([P, x], i) => drawPerson(ctx, x, 1000, 0.95, e0(t + i, { mouth: 'grin', talk: talking(t + i * 1.7), look: [i < 2 ? 1 : -1, 0], hold: i === 0 ? 'book' : i === 2 ? 'coffee' : null, handR: i === 0 ? [80, -300] : i === 2 ? [100, -300] : null }), P));
      candle(ctx, 980, 980, 0.5, t);
      if (t > ayuda) for (let i = 0; i < 6; i++) { const p = (t * 0.5 + i / 6) % 1; ctx.globalAlpha = 1 - p; text(ctx, '❤', 400 + i * 230, 500 - p * 250, { size: 50, fill: '#ff4d6d', lw: 0, shadow: false }); ctx.globalAlpha = 1; }
      popIn(ctx, t, ayuda, W / 2, 150, () => text(ctx, '¡LA GENTE SE AYUDA!', 0, 0, { size: 110, fill: FLAT.accent }));
    }
  }, { counter: H_(72), mood: 'happy' });
}
{ // 24. Sillas en la calle, niños jugando
  const a = PS(2, 9), pant = SS(2, 9, 1);
  fx(a + 0.4, 'pop', 0.4); fx(pant, 'sparkle', 0.5, 0.8);
  shot(a, (ctx, lt, d, t) => {
    sceneCityNight(ctx, t, { lights: 0, stars: 0.8 });
    for (let i = 0; i < 3; i++) { ctx.fillStyle = '#bc6c25'; ctx.fillRect(280 + i * 220, 900, 120, 16); ctx.fillRect(290 + i * 220, 916, 12, 80); ctx.fillRect(380 + i * 220, 916, 12, 80); drawPerson(ctx, 340 + i * 220, 960, 0.7, e0(t + i, { talk: talking(t + i * 2), mouth: 'smile', inBed: true }), [PEOPLE.abuela || PEOPLE.adulto, PEOPLE.amigo2, PEOPLE.medico][i]); }
    for (let i = 0; i < 2; i++) { const x = 1150 + Math.sin(t * 2 + i * 3) * 250, hop = -Math.abs(Math.sin(t * 7 + i)) * 40; drawPerson(ctx, x, 1010 + hop, 0.55, e0(t + i, { walk: true, mouth: 'grin', flip: Math.cos(t * 2 + i * 3) < 0 }), i ? PEOPLE.randy : PEOPLE.amigo1); }
    const bx = 1150 + Math.sin(t * 2.4) * 300, by = 900 - Math.abs(Math.sin(t * 5)) * 200; ctx.fillStyle = FLAT.coral; ctx.beginPath(); ctx.arc(bx, by, 26, 0, Math.PI * 2); ctx.fill();
    candle(ctx, 900, 990, 0.45, t);
    if (t > pant) popIn(ctx, t, pant, W / 2, 140, () => text(ctx, 'SIN PANTALLAS', 0, 0, { size: 120, fill: '#fff' }));
  }, { counter: H_(72) });
}

// ======================= PARTE 4: casos reales =======================
{ // 25. Ya ha pasado
  const a = PS(3, 0) - 0.3; fx(a + 0.5, 'impact', 0.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#d62828', '#6a040f', 25); rays(ctx, t, W / 2, 540);
    popIn(ctx, t, a + 0.4, W / 2, 470, () => { text(ctx, 'NO ES', 0, -90, { size: 120, fill: '#fff' }); text(ctx, 'IMAGINACIÓN', 0, 70, { size: 170, fill: FLAT.accent }); });
    popIn(ctx, t, SS(3, 0, 1), W / 2, 820, () => { card(ctx, -260, -60, 520, 120, '#fff', 60); text(ctx, 'CASOS REALES', 0, 0, { size: 64, fill: '#d62828', lw: 0, shadow: false }); });
  }, { trans: 'wipe', mood: 'tense' });
}
{ // 26. España y Portugal, 28 de abril de 2025
  const a = PS(3, 1), mill = SS(3, 1, 1), trenes = SS(3, 1, 2);
  fx(a + 0.5, 'impact', 0.5, 0.6); fx(mill, 'ding', 0.5); fx(trenes, 'whoosh', 0.5, 0.6);
  shot(a, (ctx, lt, d, t) => {
    if (t < trenes) {
      bgFlat(ctx, t, '#0077b6', '#023e8a', 26);
      iberia(ctx, 760, 560, 1.6, t, 1 - L(t, a + 0.6, a + 2.2));
      popIn(ctx, t, a + 0.3, 1450, 300, () => { card(ctx, -330, -110, 660, 220, '#fff', 30); text(ctx, '28 DE ABRIL', 0, -35, { size: 64, fill: '#d62828', lw: 0, shadow: false }); text(ctx, '2025', 0, 45, { size: 80, fill: '#1d3557', lw: 0, shadow: false }); });
      if (t > mill) bigStat(ctx, t, mill, 1450, 700, 'DECENAS', { size: 110, color: FLAT.accent, label: 'DE MILLONES' });
    } else {
      sceneStreetDay(ctx, t, 0.2);
      train(ctx, 960, 560, 1, t);
      [[PEOPLE.adulto, 560], [PEOPLE.medico, 1380]].forEach(([P, x], i) => drawPerson(ctx, x, 1010, 1, e0(t + i, { mouth: 'o', mouthOpen: 0.3, look: [i ? -1 : 1, 0] }), P));
      radioIcon(ctx, 960, 900, 0.7, t);
      popIn(ctx, t, trenes, W / 2, 140, () => text(ctx, 'TODOS A LA CALLE', 0, 0, { size: 110, fill: '#fff' }));
    }
  }, { mood: 'happy' });
}
{ // 27. Atrapados, radios agotados; vuelve la luz; no fue un ciberataque
  const a = PS(3, 2), cajon = SS(3, 2, 1), regreso = SS(3, 2, 2), causa = SS(3, 2, 3), tecnico = SS(3, 2, 4);
  fx(cajon, 'pop', 0.5); fx(regreso, 'sparkle', 0.7); fx(causa, 'dizzy', 0.4); fx(tecnico, 'impact', 0.5);
  shot(a, (ctx, lt, d, t) => {
    if (t < regreso) {
      bgFlat(ctx, t, '#e9c46a', '#f4a261', 27);
      shelves(ctx, 200, 280, 700, t, 0.05);
      popIn(ctx, t, a + 0.3, 550, 160, () => { card(ctx, -260, -60, 520, 120, '#ef233c', 20); text(ctx, 'AGOTADO: RADIOS', 0, 0, { size: 52, fill: '#fff', lw: 0, shadow: false }); });
      if (t > cajon) { radioIcon(ctx, 1400, 650, 1.2, t, false); popIn(ctx, t, cajon, 1400, 300, () => text(ctx, '¡EL DEL CAJÓN!', 0, 0, { size: 90, fill: '#fff' })); }
    } else if (t < causa) {
      sceneCityNight(ctx, t, { lights: L(t, regreso, regreso + 3) });
      popIn(ctx, t, regreso, W / 2, 150, () => text(ctx, '¡VUELVE LA LUZ!', 0, 0, { size: 120, fill: FLAT.accent }));
    } else {
      bgFlat(ctx, t, '#2b2d42', '#14152a', 28);
      hacker(ctx, 560, 540, 1.2, t, t > tecnico);
      if (t > tecnico) popIn(ctx, t, tecnico, 1350, 540, () => { card(ctx, -380, -140, 760, 280, '#fff', 40); text(ctx, 'PROBLEMAS', 0, -45, { size: 80, fill: '#1d3557', lw: 0, shadow: false }); text(ctx, 'TÉCNICOS', 0, 55, { size: 90, fill: FLAT.coral, lw: 0, shadow: false }); });
      else popIn(ctx, t, causa, 1350, 540, () => text(ctx, '¿LA CAUSA?', 0, 0, { size: 130, fill: '#fff' }));
    }
  });
}
{ // 28. Cómo se reenciende un país (foco por foco)
  const a = PS(3, 3), inter = SS(3, 3, 1), hidro = SS(3, 3, 2), focos = SS(3, 3, 3), golpe = SS(3, 3, 4), horas = SS(3, 3, 5);
  fx(inter, 'boing', 0.5, 1.4); fx(hidro, 'ff', 0.3, 0.8, { dur: 1.5 }); for (let i = 0; i < 8; i++) fx(focos + 0.4 + i * 0.45, 'pop', 0.4, 0.9 + i * 0.06); fx(golpe + 0.6, 'impact', 0.8, 0.5);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#03045e', '#000814', 29, false);
    if (t < hidro) { switchIcon(ctx, W / 2, 560, 1.6, t, t > inter); popIn(ctx, t, a + 0.3, W / 2, 140, () => text(ctx, '¿CÓMO SE REENCIENDE?', 0, 0, { size: 100, fill: '#fff' })); if (t > inter) popIn(ctx, t, inter, W / 2, 920, () => text(ctx, '¡NO ES UN INTERRUPTOR!', 0, 0, { size: 80, fill: FLAT.coral })); return; }
    dam(ctx, 300, 760, 1, t, true);
    const crash = t > golpe + 0.5 && t < horas;
    const n = crash ? 0 : Math.max(0, Math.min(8, Math.floor((t - focos - 0.2) / 0.45)));
    for (let i = 0; i < 8; i++) { const x = 720 + i * 150, h = 160 + (i % 3) * 70; ctx.fillStyle = '#16163a'; ctx.fillRect(x, 900 - h, 120, h); if (i < n) for (let wy = 900 - h + 15; wy < 885; wy += 30) for (let wx = x + 12; wx < x + 110; wx += 26) { ctx.fillStyle = '#ffe066'; ctx.fillRect(wx, wy, 12, 16); } powerTower(ctx, x - 15, 920, 0.35, i < n); }
    ctx.strokeStyle = 'rgba(255,224,102,0.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(380, 700); for (let i = 0; i < 8; i++) ctx.quadraticCurveTo(720 + i * 150 - 85, 860, 720 + i * 150 - 15, 832); ctx.stroke();
    if (crash) { burst(ctx, 1200, 600, t, golpe + 0.5, '#ef233c', 16, 300); popIn(ctx, t, golpe + 0.5, 1200, 300, () => text(ctx, '¡SE CAE OTRA VEZ!', 0, 0, { size: 96, fill: '#ef233c' })); }
    else popIn(ctx, t, hidro, W / 2, 140, () => text(ctx, t > focos ? 'CIUDAD POR CIUDAD' : 'HIDROELÉCTRICAS', 0, 0, { size: 100, fill: '#fff' }));
  });
}
{ // 29. 2003: 50 millones en EE. UU. y Canadá
  const a = PS(3, 4), dias = SS(3, 4, 1);
  fx(a + 0.4, 'impact', 0.5, 0.7); fx(dias, 'ff', 0.25, 0.8, { dur: 1.5 });
  shot(a, (ctx, lt, d, t) => {
    sceneCityNight(ctx, t, { lights: 0.05, stars: 0.5 });
    popIn(ctx, t, a + 0.3, W / 2, 200, () => { card(ctx, -360, -80, 720, 160, '#fff', 30); text(ctx, 'EE. UU. Y CANADÁ · 2003', 0, 0, { size: 60, fill: '#1d3557', lw: 0, shadow: false }); });
    bigStat(ctx, t, a + 1, W / 2, 500, 50, { suffix: ' MILLONES', size: 130, color: FLAT.accent, label: 'DE PERSONAS SIN LUZ' });
    if (t > dias) calendarV(ctx, 1600, 760, 0.7, 'DÍA', 1 + 2 * L(t, dias, dias + 2), FLAT.coral);
  });
}
{ // 30. Quebec 1989: tormenta solar
  const a = PS(3, 5), quebec = SS(3, 5, 1);
  fx(a + 0.3, 'whoosh', 0.6, 0.5); fx(quebec, 'impact', 0.6, 0.7);
  shot(a, (ctx, lt, d, t) => {
    ctx.fillStyle = '#03045e'; ctx.fillRect(0, 0, W, H); for (let i = 0; i < 80; i++) { const r = rng(i + 7); ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.7 * Math.abs(Math.sin(t + i))})`; ctx.fillRect(r() * W, r() * H, 2, 2); }
    sunFlare(ctx, 300, 540, 220, t);
    const p = L(t, a + 0.5, quebec); for (let k = 0; k < 4; k++) { ctx.strokeStyle = `rgba(255,183,3,${0.6 - k * 0.12})`; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(300, 540, 260 + p * 900 + k * 60, -0.4, 0.4); ctx.stroke(); }
    ctx.fillStyle = '#1d3557'; ctx.beginPath(); ctx.arc(1600, 540, 200, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#52b788'; ctx.beginPath(); ctx.ellipse(1560, 470, 110, 70, 0.3, 0, Math.PI * 2); ctx.fill();
    if (t > quebec) { ctx.fillStyle = '#ef233c'; ctx.beginPath(); ctx.arc(1530, 450, 20 + Math.sin(t * 10) * 4, 0, Math.PI * 2); ctx.fill(); popIn(ctx, t, quebec, 1450, 800, () => { card(ctx, -340, -80, 680, 160, '#fff', 30); text(ctx, 'QUEBEC 1989 · 9 HORAS', 0, 0, { size: 56, fill: '#1d3557', lw: 0, shadow: false }); }); }
    popIn(ctx, t, a + 0.3, W / 2, 120, () => text(ctx, 'TORMENTA SOLAR', 0, 0, { size: 110, fill: FLAT.accent }));
  }, { mood: 'mystery' });
}
{ // 31. Carrington 1859: telégrafos con chispas y auroras en el Caribe
  const a = PS(3, 6), aur = SS(3, 6, 1);
  for (let i = 0; i < 6; i++) fx(a + 1 + i * 0.35, 'tick', 0.5, 1.4); fx(aur, 'sparkle', 0.8);
  shot(a, (ctx, lt, d, t) => {
    if (t < aur) {
      ctx.fillStyle = '#ddbea9'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#a5a58d'; ctx.fillRect(0, 860, W, 220);
      telegraph(ctx, 960, 760, 1.6, t, t > a + 1);
      drawPerson(ctx, 1450, 1000, 1.05, e0(t, { shock: 0.7, mouth: 'o', mouthOpen: 0.8, look: [-1, 0] }), PEOPLE.amigo2);
      popIn(ctx, t, a + 0.3, W / 2, 140, () => text(ctx, '1859', 0, 0, { size: 150, fill: '#6f4518' }));
      retroOverlay(ctx, t);
    } else {
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#03045e'); g.addColorStop(1, '#3a0ca3'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      aurora(ctx, t, 0, H * 0.6, 1.4);
      ctx.fillStyle = '#0077b6'; ctx.fillRect(0, 760, W, 120); ctx.fillStyle = '#e9c46a'; ctx.beginPath(); ctx.moveTo(0, 880); for (let x = 0; x <= W; x += 40) ctx.lineTo(x, 860 + Math.sin(x * 0.01) * 15); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
      palm(ctx, 300, 900, t); palm(ctx, 1650, 920, t + 1);
      popIn(ctx, t, aur, W / 2, 140, () => text(ctx, '¡AURORAS EN EL CARIBE!', 0, 0, { size: 100, fill: '#fff' }));
    }
  }, { mood: 'mystery' });
}
{ // 32. Si pasara hoy: transformadores y satélites
  const a = PS(3, 7), planes = SS(3, 7, 1);
  fx(a + 0.4, 'impact', 0.4, 1.3); fx(planes, 'ding', 0.6, 1.2);
  shot(a, (ctx, lt, d, t) => {
    ctx.fillStyle = '#000814'; ctx.fillRect(0, 0, W, H); for (let i = 0; i < 80; i++) { const r = rng(i + 77); ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(r() * W, r() * H, 2, 2); }
    ctx.fillStyle = '#1d3557'; ctx.beginPath(); ctx.arc(960, 1500, 900, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 3; i++) satellite(ctx, 400 + i * 560, 250 + Math.sin(t + i) * 30, 0.9, t + i, t > a + 0.5 && t < planes);
    transformer(ctx, 700, 860, 1, t, t > a + 0.5 && t < planes);
    if (t > planes) popIn(ctx, t, planes, 1350, 560, () => { shield(ctx, 0, 0, 1.4, t); text(ctx, 'PLANES DE PROTECCIÓN', 0, 220, { size: 56, fill: '#fff' }); });
    popIn(ctx, t, a + 0.3, W / 2, 110, () => text(ctx, 'SI PASARA HOY...', 0, 0, { size: 104, fill: '#fff' }));
  }, { mood: 'happy' });
}
{ // 33. ¿Podría pasar? Científicos vigilan el sol; muy poco probable
  const a = PS(3, 8), vig = SS(3, 8, 1), prob = SS(3, 8, 2);
  fx(vig, 'pop', 0.5); fx(prob, 'ding', 0.6);
  shot(a, (ctx, lt, d, t) => {
    if (t < prob) {
      bgFlat(ctx, t, '#023047', '#001d3d', 33); sunFlare(ctx, 1550, 260, 130, t);
      telescope(ctx, 820, 900, 1.2, t);
      drawPerson(ctx, 560, 1000, 1.05, e0(t, { mouth: 'smile', talk: talking(t), handR: [120, -380], look: [1, -0.6] }), PEOPLE.cientifica);
      popIn(ctx, t, vig, 1300, 760, () => { card(ctx, -320, -60, 640, 120, '#fff', 60); text(ctx, 'VIGILAN EL SOL 24/7', 0, 0, { size: 56, fill: '#023047', lw: 0, shadow: false }); });
    } else {
      bgFlat(ctx, t, '#000814', '#001d3d', 34);
      globeGrids(ctx, 700, 540, 340, t, { independent: true });
      popIn(ctx, t, prob, 1420, 540, () => { card(ctx, -380, -140, 760, 280, FLAT.accent, 40); text(ctx, 'MUY POCO', 0, -45, { size: 90, fill: FLAT.ink, lw: 0, shadow: false }); text(ctx, 'PROBABLE', 0, 55, { size: 100, fill: FLAT.ink, lw: 0, shadow: false }); });
    }
  });
}

// ======================= PARTE 5: cómo prepararse =======================
{ // 34. Prepararte, sin miedo; la UE recomienda 72 h
  const a = PS(4, 0), miedo = SS(4, 0, 1), ue = SS(4, 0, 2);
  fx(miedo, 'sparkle', 0.6); fx(ue, 'pop', 0.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#06d6a0', '#118ab2', 35); rays(ctx, t, 640, 560);
    leo(ctx, 640, 1000, 1.2, e0(t, { mouth: 'grin', handR: [140, -470], talk: talking(t) }));
    popIn(ctx, t, miedo, 1350, 300, () => text(ctx, 'SIN MIEDO', 0, 0, { size: 130, fill: '#fff' }));
    if (t > ue) popIn(ctx, t, ue, 1350, 640, () => { card(ctx, -330, -140, 660, 280, '#003399', 40); for (let i = 0; i < 12; i++) { const ang = i / 12 * Math.PI * 2; text(ctx, '★', Math.cos(ang) * 100, -20 + Math.sin(ang) * 100, { size: 30, fill: '#ffcc00', lw: 0, shadow: false }); } text(ctx, '72 HORAS', 0, 90, { size: 70, fill: '#fff', lw: 0, shadow: false }); });
  });
}
{ // 35. El kit
  const a = PS(4, 1);
  const items = [['agua', 'AGUA', c => drop2(c, 0, 0, 0.7)], ['comida', 'COMIDA', c => foodIcon(c, 'burger', 0, 0, 0.8, 0)], ['linterna', 'LINTERNA', c => flashlight(c, -20, 0, 0.6, 0, false)], ['bateria', 'BATERÍA', c => battery(c, 0, 0, 0.8, 0.9)], ['radio', 'RADIO', c => radioIcon(c, 0, 10, 0.45, 0, false)], ['efectivo', 'EFECTIVO', c => cashIcon(c, 0, 0, 0.5, 0)], ['botiquin', 'BOTIQUÍN', c => firstAid(c, 0, 0, 0.8)], ['documentos', 'DOCUMENTOS', c => docs(c, 0, 0, 0.8)]];
  const times = items.map(([w]) => WD(4, 1, w)); times.forEach((s, i) => fx(s, 'pop', 0.6, 0.9 + i * 0.07));
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#ffd166', '#f4a261', 36);
    backpack(ctx, 300, 640, 1.3, t);
    items.forEach(([w, n, f], i) => popIn(ctx, t, times[i], 680 + (i % 4) * 330, 360 + Math.floor(i / 4) * 360, () => { card(ctx, -150, -150, 300, 300, '#fff', 30); ctx.save(); ctx.translate(0, -30); f(ctx); ctx.restore(); text(ctx, n, 0, 105, { size: 40, fill: '#bc6c25', lw: 0, shadow: false }); }));
    popIn(ctx, t, a + 0.2, 300, 150, () => text(ctx, 'TU KIT', 0, 0, { size: 110, fill: '#fff' }));
  });
}
{ // 36. Refri cerrado, ahorra batería, desconecta aparatos
  const a = PS(4, 2), desc = SS(4, 2, 1);
  fx(a + 0.3, 'pop', 0.5); fx(a + 1.5, 'pop', 0.5, 1.2); fx(desc, 'boing', 0.6, 1.3);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#4361ee', '#3a0ca3', 37);
    [['🧊 REFRI CERRADO', a + 0.3], ['🔋 AHORRA BATERÍA', a + 1.5], ['🔌 DESCONECTA', desc]].forEach(([n, st], i) => popIn(ctx, t, st, 560, 300 + i * 230, () => { card(ctx, -380, -80, 760, 160, '#fff', 40); text(ctx, n, 0, 0, { size: 60, fill: '#3a0ca3', lw: 0, shadow: false }); }));
    if (t > desc) plugPull(ctx, 1400, 560, 1.4, t, desc);
    else leo(ctx, 1400, 1000, 1.15, e0(t, { mouth: 'smile', talk: talking(t), handR: [140, -440] }));
  });
}
{ // 37. Aparatos médicos: plan de respaldo
  const a = PS(4, 3); fx(a + 0.3, 'pop', 0.5);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#caf0f8', '#90e0ef', 38);
    drawPerson(ctx, 760, 1000, 1.15, e0(t, { mouth: 'smile', talk: talking(t), handR: [140, -420], look: [1, 0] }), PEOPLE.medico);
    leo(ctx, 1200, 1000, 1.15, e0(t, { mouth: 'smile', look: [-1, 0], flip: true }));
    popIn(ctx, t, a + 0.4, W / 2, 140, () => text(ctx, 'TEN UN PLAN DE RESPALDO', 0, 0, { size: 90, fill: '#0077b6' }));
  });
}
{ // 38. Truco: botellas congeladas
  const a = PS(4, 4), frio = SS(4, 4, 1), tomar = SS(4, 4, 2);
  fx(a + 0.5, 'pop', 0.6); fx(frio, 'whoosh', 0.4, 1.4); fx(tomar, 'ding', 0.6, 1.2);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#4cc9f0', '#0077b6', 39);
    const melt = L(t, tomar - 0.5, tomar + 1);
    ctx.fillStyle = '#f8f9fa'; rrect(ctx, 320, 200, 600, 760, 40); ctx.fill(); ctx.fillStyle = '#e9ecef'; ctx.fillRect(340, 560, 560, 10);
    for (let i = 0; i < 4; i++) iceBottle(ctx, 420 + i * 130, 480, 1, t, melt);
    for (let i = 0; i < 6; i++) { const p = (t * 0.6 + i / 6) % 1; ctx.fillStyle = `rgba(202,240,248,${1 - p})`; ctx.beginPath(); ctx.arc(380 + i * 90, 940 - p * 300, 10, 0, Math.PI * 2); ctx.fill(); }
    popIn(ctx, t, a + 0.3, 1400, 200, () => text(ctx, 'EL TRUCO', 0, 0, { size: 120, fill: '#fff' }));
    if (t > tomar) { leo(ctx, 1450, 1000, 1.1, e0(t, { mouth: 'o', mouthOpen: 0.3, handR: [40, -440] })); }
  });
}
{ // 39. Teléfonos en papel
  const a = PS(4, 5), memo = SS(4, 5, 1);
  fx(a + 0.4, 'pop', 0.6); fx(memo, 'dizzy', 0.4);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#f4a261', '#e76f51', 40);
    paperNote(ctx, 600, 560, 1.3, t);
    leo(ctx, 1350, 1000, 1.15, e0(t, { mouth: t > memo ? 'flat' : 'smile', handR: t > memo ? [40, -450] : null, look: [0.4, -0.8] }));
    if (t > memo) questionMarks(ctx, t, 1350, 330, 3, '#fff');
    popIn(ctx, t, a + 0.3, 600, 130, () => text(ctx, 'ANÓTALOS EN PAPEL', 0, 0, { size: 84, fill: '#fff' }));
  });
}
{ // 40. Tranquilo: no habrá apagón mundial
  const a = PS(4, 6), prep = SS(4, 6, 1);
  fx(a + 0.4, 'sparkle', 0.6); fx(prep, 'ding', 0.5, 1.2);
  shot(a, (ctx, lt, d, t) => {
    sceneCityNight(ctx, t, { lights: L(t, a, a + 2) });
    leo(ctx, 760, 1000, 1.15, e0(t, { mouth: 'grin', handR: [150, -330] }));
    popIn(ctx, t, a + 0.4, 1350, 380, () => { text(ctx, '17 DE NOVIEMBRE:', 0, -60, { size: 70, fill: '#fff' }); text(ctx, 'TODO NORMAL', 0, 50, { size: 110, fill: FLAT.mint }); });
    if (t > prep) popIn(ctx, t, prep, 1350, 700, () => { card(ctx, -320, -60, 640, 120, FLAT.accent, 60); text(ctx, 'PERO PREPÁRATE', 0, 0, { size: 60, fill: FLAT.ink, lw: 0, shadow: false }); });
  });
}
{ // 41. Comentarios
  const a = PS(4, 7); fx(a + 0.4, 'pop', 0.7); for (let i = 0; i < 10; i++) fx(a + 1 + i * 0.18, 'tick', 0.25, 1.3);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#7209b7', '#3a0ca3', 41); rays(ctx, t, W / 2, H / 2);
    leo(ctx, 420, 1000, 1.15, e0(t, { handR: [150, -420], mouth: 'grin', talk: talking(t) }));
    popIn(ctx, t, a + 0.4, 1200, 450, () => {
      card(ctx, -560, -200, 1120, 400, '#fff', 40); ctx.fillStyle = FLAT.accent; ctx.beginPath(); ctx.arc(-450, -100, 50, 0, Math.PI * 2); ctx.fill();
      const msg = '¿Tu apagón más largo?'; const n = Math.floor(L(t, a + 1, a + 2.6) * msg.length);
      ctx.font = '58px Lilita'; ctx.fillStyle = FLAT.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(msg.slice(0, n) + (Math.sin(t * 10) > 0 ? '|' : ''), -370, -100);
      ctx.fillStyle = '#e9ecef'; rrect(ctx, -480, 30, 960, 110, 30); ctx.fill(); text(ctx, '👍  💬  COMENTA', 0, 85, { size: 52, fill: FLAT.ink, lw: 0, shadow: false });
    });
  });
}
{ // 42. Próximo: dejar de comer
  const a = PS(4, 8), sorp = SS(4, 8, 1);
  fx(a + 0.3, 'dizzy', 0.4, 0.5); fx(sorp, 'sparkle', 0.6); fx(SS(4, 8, 2), 'boing', 0.6, 1.2);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#f77f00', '#d62828', 42); rays(ctx, t, 1300, 520);
    leo(ctx, 600, 1000, 1.15, e0(t, { mouth: 'o', mouthOpen: 0.5, look: [1, 0.5], handL: [-40, -300] }));
    for (let i = 0; i < 3; i++) { ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(600, 760, 90 + i * 30 + Math.sin(t * 10) * 6, -0.5, 0.5); ctx.stroke(); }
    plate2(ctx, 1300, 620, 1.4, t);
    popIn(ctx, t, SS(4, 8, 2), 1300, 900, () => { card(ctx, -380, -70, 760, 140, '#fff', 70); text(ctx, '¿SIN COMER?', 0, 0, { size: 80, fill: '#d62828', lw: 0, shadow: false }); });
  });
}
{ // 43. Pantalla final
  const a = V.VOICE_END + 0.2; fx(a + 0.6, 'sparkle', 0.5); fx(SCENE.duration - 0.9, 'whoosh', 0.4, 0.7);
  shot(a, (ctx, lt, d, t) => {
    sceneCityNight(ctx, t, { lights: 0.9 });
    leo(ctx, 960, 1000, 1.1, e0(t, { mouth: 'grin', handR: [150, -480 + Math.sin(t * 6) * 30] }));
    ctx.fillStyle = 'rgba(10,6,30,0.4)'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,255,255,0.12)'; rrect(ctx, 120, 230, 760, 428, 24); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 6; ctx.setLineDash([24, 16]); rrect(ctx, 120, 230, 760, 428, 24); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'SIGUIENTE VIDEO', 500, 444, { size: 64, fill: '#fff' });
    ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.beginPath(); ctx.arc(1500, 330, 150, 0, Math.PI * 2); ctx.fill();
    text(ctx, '¡SUSCRÍBETE!', 1500, 540, { size: 70, fill: FLAT.accent });
    for (let i = 0; i < 20; i++) { const r = rng(i + 1500), p = (t * (0.1 + r() * 0.1) + r()) % 1; ctx.fillStyle = `rgba(255,224,102,${0.7 * Math.sin(p * Math.PI)})`; ctx.beginPath(); ctx.arc(r() * W, H - p * H, 4 + r() * 6, 0, Math.PI * 2); ctx.fill(); }
    const fade = L(t, SCENE.duration - 1, SCENE.duration - 0.1); if (fade > 0) { ctx.fillStyle = `rgba(0,0,0,${fade})`; ctx.fillRect(0, 0, W, H); }
  }, { quiet: true, mood: 'happy' });
}

// ======================= ELEMENTOS PROPIOS =======================
function sceneLivingRoom(ctx, t, o = {}) {
  const on = o.lights ?? 1;
  ctx.fillStyle = '#f2e8cf'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#e9d8a6'; for (let x = 0; x < W; x += 120) ctx.fillRect(x, 0, 50, 860);
  ctx.fillStyle = '#bc6c25'; ctx.fillRect(0, 860, W, 220);
  // ventana con ciudad
  ctx.save(); rrect(ctx, 1240, 150, 520, 380, 16); ctx.clip(); const g = ctx.createLinearGradient(0, 150, 0, 530); g.addColorStop(0, '#0b1640'); g.addColorStop(1, '#3a2470'); ctx.fillStyle = g; ctx.fillRect(1240, 150, 520, 380);
  const r = rng(3); let bx = 1230; while (bx < 1770) { const bw = 50 + r() * 50, bh = 100 + r() * 140; ctx.fillStyle = '#1b1440'; ctx.fillRect(bx, 530 - bh, bw, bh); for (let wy = 530 - bh + 10; wy < 520; wy += 22) for (let wx = bx + 6; wx < bx + bw - 10; wx += 16) { if (on > 0.5 && Math.sin(wx * 5 + wy) > 0) { ctx.fillStyle = '#ffd166'; ctx.fillRect(wx, wy, 8, 10); } } bx += bw + 4; }
  ctx.restore(); ctx.fillStyle = '#fff'; ctx.fillRect(1494, 150, 12, 380); ctx.fillRect(1240, 334, 520, 12);
  // sillón, lámpara, ventilador de techo, tele
  ctx.fillStyle = '#e76f51'; rrect(ctx, 440, 700, 760, 220, 50); ctx.fill(); rrect(ctx, 400, 760, 120, 200, 40); ctx.fill(); rrect(ctx, 1120, 760, 120, 200, 40); ctx.fill();
  lampStand(ctx, 260, 860, on);
  ctx.save(); ctx.translate(900, 60); ctx.fillStyle = '#6c757d'; ctx.fillRect(-6, 0, 12, 60); ctx.translate(0, 70); ctx.rotate(t * (on > 0.5 ? 9 : 9 * Math.max(0, 1 - (o.fanSlow || 1)))); ctx.fillStyle = '#adb5bd'; for (let i = 0; i < 4; i++) { ctx.rotate(Math.PI / 2); rrect(ctx, 0, -14, 220, 28, 14); ctx.fill(); } ctx.restore();
  if (on > 0.5) { ctx.fillStyle = 'rgba(255,240,180,0.12)'; ctx.fillRect(0, 0, W, H); }
}
function lampStand(ctx, x, y, on) { if (on > 0.5) { const g = ctx.createRadialGradient(x, y - 420, 10, x, y - 300, 400); g.addColorStop(0, 'rgba(255,230,150,0.45)'); g.addColorStop(1, 'rgba(255,230,150,0)'); ctx.fillStyle = g; ctx.fillRect(x - 400, y - 800, 800, 800); } ctx.fillStyle = '#6c757d'; ctx.fillRect(x - 6, y - 400, 12, 400); ctx.fillRect(x - 60, y - 10, 120, 14); ctx.fillStyle = on > 0.5 ? '#ffd23f' : '#adb5bd'; ctx.beginPath(); ctx.moveTo(x - 80, y - 400); ctx.lineTo(x + 80, y - 400); ctx.lineTo(x + 50, y - 500); ctx.lineTo(x - 50, y - 500); ctx.fill(); }
function sceneStreetDay(ctx, t, dim = 0) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, mix('#8ecae6', '#6c757d', dim)); g.addColorStop(1, mix('#caf0f8', '#adb5bd', dim)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 9; i++) { const x = ((i * 260 - t * 30) % 2340 + 2340) % 2340 - 210, h = 360 + (i % 3) * 110; ctx.fillStyle = mix(['#ffb4a2', '#cdb4db', '#b5e48c', '#a2d2ff'][i % 4], '#6c757d', dim * 0.6); ctx.fillRect(x, 860 - h, 220, h); ctx.fillStyle = 'rgba(255,255,255,0.4)'; for (let r = 0; r < h / 90 - 1; r++) for (let c = 0; c < 3; c++) ctx.fillRect(x + 25 + c * 65, 860 - h + 30 + r * 90, 40, 50); }
  ctx.fillStyle = '#adb5bd'; ctx.fillRect(0, 860, W, 60); ctx.fillStyle = '#495057'; ctx.fillRect(0, 920, W, 160);
}
function stopwatch(ctx, t, str) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 130, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(-20, -170, 40, 40); ctx.strokeStyle = FLAT.coral; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(0, 0, 100, -Math.PI / 2, -Math.PI / 2 + (t * 2) % (Math.PI * 2)); ctx.stroke(); text(ctx, str, 0, 0, { size: 58, fill: FLAT.ink, lw: 0, shadow: false }); }
function wifiIcon(ctx, x, y, s, t, ok) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = '#fff'; ctx.lineCap = 'round'; for (let i = 0; i < 3; i++) { ctx.lineWidth = 22; ctx.globalAlpha = ok ? 1 : 0.4; ctx.beginPath(); ctx.arc(0, 60, 40 + i * 50, -Math.PI * 0.75, -Math.PI * 0.25); ctx.stroke(); } ctx.globalAlpha = 1; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 60, 16, 0, Math.PI * 2); ctx.fill(); if (!ok) { ctx.strokeStyle = '#ef233c'; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(-130, -110); ctx.lineTo(130, 110); ctx.stroke(); } ctx.restore(); }
function cellTower(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = '#adb5bd'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(0, -600); ctx.lineTo(70, 0); for (let i = 1; i < 6; i++) { ctx.moveTo(-70 + i * 12, -i * 100); ctx.lineTo(70 - i * 12, -i * 100); } ctx.stroke(); ctx.fillStyle = '#e9ecef'; for (const sx of [-1, 1]) rrect(ctx, sx * 40 - 15, -560, 30, 90, 8), ctx.fill(); for (let k = 0; k < 3; k++) { const p = (t * 0.8 + k / 3) % 1; ctx.strokeStyle = `rgba(255,255,255,${1 - p})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -600, 40 + p * 160, -0.6, 0.6); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -600, 40 + p * 160, Math.PI - 0.6, Math.PI + 0.6); ctx.stroke(); } ctx.restore(); }
function battery(ctx, x, y, s, v) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#495057'; rrect(ctx, -90, -45, 180, 90, 16); ctx.fill(); ctx.fillRect(90, -18, 16, 36); ctx.fillStyle = v < 0.25 ? '#ef233c' : FLAT.mint; rrect(ctx, -80, -35, 160 * clamp(v), 70, 10); ctx.fill(); ctx.restore(); }
function cardTerminal(ctx, x, y, s, t, err) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#343a40'; rrect(ctx, -130, -220, 260, 440, 30); ctx.fill(); ctx.fillStyle = err ? (Math.sin(t * 10) > 0 ? '#ef233c' : '#9d0208') : '#caf0f8'; rrect(ctx, -100, -190, 200, 120, 12); ctx.fill(); text(ctx, err ? 'ERROR' : '$ 250', 0, -130, { size: 44, fill: err ? '#fff' : '#1d3557', lw: 0, shadow: false }); ctx.fillStyle = '#6c757d'; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { rrect(ctx, -90 + c * 65, -40 + r * 70, 50, 50, 10); ctx.fill(); } ctx.save(); ctx.translate(0, 230 + (err ? Math.sin(t * 20) * 6 : 0)); ctx.fillStyle = '#4361ee'; rrect(ctx, -110, -40, 220, 140, 14); ctx.fill(); ctx.fillStyle = '#ffd23f'; ctx.fillRect(-80, 0, 40, 30); ctx.restore(); ctx.restore(); }
function atm(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#adb5bd'; rrect(ctx, -200, -320, 400, 640, 30); ctx.fill(); ctx.fillStyle = '#000'; rrect(ctx, -150, -260, 300, 200, 14); ctx.fill(); text(ctx, 'FUERA DE', 0, -180, { size: 40, fill: '#ef233c', lw: 0, shadow: false }); text(ctx, 'SERVICIO', 0, -130, { size: 40, fill: '#ef233c', lw: 0, shadow: false }); ctx.fillStyle = '#495057'; ctx.fillRect(-120, 40, 240, 20); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { ctx.fillStyle = '#6c757d'; rrect(ctx, -90 + c * 65, 100 + r * 60, 50, 44, 8); ctx.fill(); } ctx.restore(); }
function crown(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = FLAT.accent; ctx.beginPath(); ctx.moveTo(-120, 60); ctx.lineTo(-140, -60); ctx.lineTo(-60, 0); ctx.lineTo(0, -90); ctx.lineTo(60, 0); ctx.lineTo(140, -60); ctx.lineTo(120, 60); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#ef233c'; for (const xx of [-70, 0, 70]) { ctx.beginPath(); ctx.arc(xx, 30, 12, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
function buildingWater(ctx, x, y, t, flow) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#f1faee'; ctx.fillRect(-300, -900, 600, 900);
  for (let f = 0; f < 6; f++) { ctx.fillStyle = '#a8dadc'; ctx.fillRect(-300, -150 * (f + 1), 600, 8); const has = flow > (f + 1) / 7; ctx.fillStyle = '#adb5bd'; ctx.fillRect(160, -150 * f - 120, 50, 14); ctx.fillRect(196, -150 * f - 120, 14, 30); if (has) { ctx.fillStyle = '#4cc9f0'; const p = (t * 2 + f) % 1; ctx.beginPath(); ctx.arc(203, -150 * f - 80 + p * 40, 7, 0, Math.PI * 2); ctx.fill(); } else text(ctx, '✗', 260, -150 * f - 100, { size: 40, fill: '#ef233c', lw: 0, shadow: false }); }
  ctx.fillStyle = '#4cc9f0'; ctx.fillRect(-250, -900 + 900 * (1 - flow * 0.98), 24, 900 * flow * 0.98);
  for (let i = 0; i < 8; i++) { const p = (t * 1.2 * flow + i / 8) % 1; ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.arc(-238, -p * 900 * flow, 6, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#495057'; rrect(ctx, -330, -60, 160, 100, 16); ctx.fill(); ctx.save(); ctx.translate(-250, -10); ctx.rotate(t * 8 * flow); ctx.fillStyle = '#ffd23f'; ctx.fillRect(-30, -6, 60, 12); ctx.fillRect(-6, -30, 12, 60); ctx.restore();
  text(ctx, 'BOMBA', -250, 80, { size: 40, fill: '#fff' });
  ctx.restore();
}
function acUnit2(ctx, x, y, t, on) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#f8f9fa'; rrect(ctx, -230, -80, 460, 160, 30); ctx.fill(); ctx.fillStyle = '#ced4da'; for (let i = 0; i < 5; i++) ctx.fillRect(-190, -30 + i * 16, 380, 6); ctx.fillStyle = on ? '#52b788' : '#ef233c'; ctx.beginPath(); ctx.arc(180, -40, 12, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
function fuelTruck(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y + Math.sin(t * 20) * 2); ctx.scale(s, s); ctx.fillStyle = '#e9ecef'; rrect(ctx, -300, -180, 420, 170, 80); ctx.fill(); ctx.fillStyle = '#ffb703'; rrect(ctx, 130, -170, 160, 160, 20); ctx.fill(); ctx.fillStyle = '#bde0fe'; rrect(ctx, 200, -150, 70, 60, 10); ctx.fill(); text(ctx, 'DIÉSEL', -90, -95, { size: 48, fill: '#d62828', lw: 0, shadow: false }); for (const wx of [-220, 0, 220]) { ctx.save(); ctx.translate(wx, 0); ctx.rotate(t * 10); ctx.fillStyle = '#212529'; ctx.beginPath(); ctx.arc(0, 0, 44, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#adb5bd'; ctx.fillRect(-4, -20, 8, 40); ctx.restore(); } ctx.restore(); }
function waterPlant(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); for (let i = 0; i < 3; i++) { ctx.fillStyle = '#adb5bd'; ctx.beginPath(); ctx.ellipse(-400 + i * 400, 0, 160, 50, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#4cc9f0'; ctx.beginPath(); ctx.ellipse(-400 + i * 400, -6, 140, 38, 0, 0, Math.PI * 2); ctx.fill(); ctx.save(); ctx.translate(-400 + i * 400, -6); ctx.rotate(t * 0.3 * (1 - 0.9 * clamp(t * 0))); ctx.fillStyle = '#6c757d'; ctx.fillRect(-130, -4, 260, 8); ctx.restore(); } ctx.fillStyle = '#495057'; ctx.fillRect(-600, 60, 1200, 30); text(ctx, '⚡✗', 0, -200, { size: 90, fill: '#ef233c', lw: 0, shadow: false }); ctx.restore(); }
function campStove(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#495057'; rrect(ctx, -160, -40, 320, 80, 16); ctx.fill(); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI; ctx.fillStyle = '#4cc9f0'; ctx.beginPath(); ctx.ellipse(-60 + i * 24, -50, 8, 18 + Math.sin(t * 20 + i) * 5, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#adb5bd'; rrect(ctx, -150, -260, 300, 190, 30); ctx.fill(); ctx.fillRect(-170, -270, 340, 24); ctx.fillStyle = '#4cc9f0'; ctx.fillRect(-140, -260, 280, 14);
  for (let i = 0; i < 7; i++) { const p = (t * 1.5 + i / 7) % 1; ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.arc(-110 + i * 36, -262 - p * 30, 8 * (1 - p), 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = `rgba(255,255,255,${0.5 * (1 - p)})`; ctx.beginPath(); ctx.arc(-100 + i * 36 + Math.sin(p * 6) * 20, -320 - p * 250, 20 + p * 35, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
function iberia(ctx, x, y, s, t, lights) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = mix('#343a40', '#52b788', lights); ctx.beginPath(); ctx.moveTo(-230, -150); ctx.lineTo(-60, -190); ctx.lineTo(120, -170); ctx.lineTo(230, -110); ctx.lineTo(190, 20); ctx.lineTo(120, 150); ctx.lineTo(-40, 190); ctx.lineTo(-180, 160); ctx.lineTo(-250, 60); ctx.lineTo(-240, -60); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-160, -160); ctx.lineTo(-150, 160); ctx.stroke(); const r = rng(9); for (let i = 0; i < 26; i++) { ctx.fillStyle = lights > 0.5 ? '#ffe066' : (Math.random() < 0 ? '' : '#495057'); ctx.beginPath(); ctx.arc(-200 + r() * 400, -150 + r() * 300, 6, 0, Math.PI * 2); ctx.fill(); } text(ctx, 'ESPAÑA', 40, 0, { size: 38, fill: '#fff', lw: 0, shadow: false }); text(ctx, 'PORTUGAL', -200, 40, { size: 22, fill: '#fff', lw: 0, shadow: false }); ctx.restore(); }
function train(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#e63946'; rrect(ctx, -700, -120, 1400, 240, 40); ctx.fill(); ctx.fillStyle = '#bde0fe'; for (let i = 0; i < 8; i++) { rrect(ctx, -650 + i * 165, -80, 120, 80, 10); ctx.fill(); } ctx.fillStyle = '#212529'; ctx.fillRect(-700, 120, 1400, 20); ctx.fillStyle = '#fff'; ctx.fillRect(-700, 30, 1400, 16); text(ctx, 'DETENIDO', 0, 80, { size: 40, fill: '#fff', lw: 0, shadow: false }); ctx.restore(); }
function hacker(ctx, x, y, s, t, crossed) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#212529'; ctx.beginPath(); ctx.arc(0, -120, 120, Math.PI, 0); ctx.lineTo(160, 140); ctx.lineTo(-160, 140); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(0, -90, 80, 90, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#5ee0c0'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 30, -100, 12, 8, 0, 0, Math.PI * 2); ctx.fill(); } ctx.fillStyle = '#adb5bd'; rrect(ctx, -180, 100, 360, 40, 10); ctx.fill(); for (let i = 0; i < 8; i++) text(ctx, Math.sin(t * 9 + i) > 0 ? '1' : '0', -200 + i * 60, 260 + Math.sin(t * 3 + i) * 20, { size: 40, fill: '#5ee0c0', lw: 0, shadow: false }); text(ctx, 'CIBERATAQUE', 0, -280, { size: 54, fill: '#fff' }); if (crossed) { ctx.strokeStyle = '#ef233c'; ctx.lineWidth = 30; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-220, -260); ctx.lineTo(220, 240); ctx.moveTo(220, -260); ctx.lineTo(-220, 240); ctx.stroke(); } ctx.restore(); }
function switchIcon(ctx, x, y, s, t, flipped) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#f8f9fa'; rrect(ctx, -110, -170, 220, 340, 30); ctx.fill(); ctx.fillStyle = '#dee2e6'; rrect(ctx, -50, -110, 100, 220, 20); ctx.fill(); ctx.fillStyle = flipped ? '#52b788' : '#adb5bd'; rrect(ctx, -44, flipped ? -104 : 0, 88, 104, 16); ctx.fill(); ctx.restore(); }
function dam(ctx, x, y, s, t, on) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#4cc9f0'; ctx.fillRect(-300, -300, 200, 340); ctx.fillStyle = '#adb5bd'; ctx.beginPath(); ctx.moveTo(-110, -320); ctx.lineTo(-20, -320); ctx.lineTo(60, 40); ctx.lineTo(-110, 40); ctx.fill(); for (let i = 0; i < 5; i++) { const p = (t * 1.5 + i / 5) % 1; ctx.fillStyle = 'rgba(202,240,248,0.9)'; ctx.beginPath(); ctx.arc(-10 + p * 60, -200 + p * 230, 8, 0, Math.PI * 2); ctx.fill(); } ctx.save(); ctx.translate(-50, -60); ctx.rotate(t * 6); ctx.fillStyle = '#ffd23f'; for (let i = 0; i < 4; i++) { ctx.rotate(Math.PI / 2); ctx.fillRect(0, -6, 40, 12); } ctx.restore(); text(ctx, '⚡', 20, -360, { size: 70, fill: FLAT.accent, lw: 0, shadow: false }); ctx.restore(); }
function telegraph(ctx, x, y, s, t, sparks) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#6f4518'; rrect(ctx, -220, -40, 440, 80, 14); ctx.fill(); ctx.fillStyle = '#bc6c25'; ctx.fillRect(-160, -100, 260, 30); ctx.save(); ctx.translate(100, -85); ctx.rotate(Math.sin(t * 12) * 0.1); ctx.fillStyle = '#212529'; ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI * 2); ctx.fill(); ctx.restore(); ctx.strokeStyle = '#495057'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-220, 0); ctx.quadraticCurveTo(-400, -100, -600, -300); ctx.stroke();
  if (sparks) for (let i = 0; i < 10; i++) { const r = rng(Math.floor(t * 15) * 13 + i), a = r() * Math.PI * 2, L2 = 40 + r() * 90; ctx.strokeStyle = r() > 0.5 ? '#ffe066' : '#fff'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-200, -10); ctx.lineTo(-200 + Math.cos(a) * L2, -10 + Math.sin(a) * L2); ctx.stroke(); } ctx.restore(); }
function palm(ctx, x, y, t) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#8d6e63'; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.quadraticCurveTo(30, -200, 10, -380); ctx.lineTo(30, -380); ctx.quadraticCurveTo(50, -200, 14, 0); ctx.fill(); ctx.translate(20, -380); for (let i = 0; i < 6; i++) { ctx.save(); ctx.rotate(i * 1.05 + Math.sin(t * 1.5 + i) * 0.08); ctx.fillStyle = i % 2 ? '#1b4332' : '#2d6a4f'; ctx.beginPath(); ctx.ellipse(90, 0, 100, 26, 0.3, 0, Math.PI * 2); ctx.fill(); ctx.restore(); } ctx.restore(); }
function satellite(ctx, x, y, s, t, hit) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t) * 0.2 + (hit ? Math.sin(t * 20) * 0.1 : 0)); ctx.fillStyle = '#4361ee'; ctx.fillRect(-180, -40, 120, 80); ctx.fillRect(60, -40, 120, 80); ctx.fillStyle = '#adb5bd'; rrect(ctx, -60, -60, 120, 120, 20); ctx.fill(); if (hit) { ctx.fillStyle = 'rgba(255,183,3,0.6)'; ctx.beginPath(); ctx.arc(0, 0, 100 + Math.sin(t * 15) * 10, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
function transformer(ctx, x, y, s, t, hit) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#6c757d'; rrect(ctx, -140, -180, 280, 180, 20); ctx.fill(); ctx.fillStyle = '#495057'; for (let i = 0; i < 4; i++) ctx.fillRect(-120 + i * 70, -220, 30, 40); if (hit) for (let i = 0; i < 8; i++) { const r = rng(Math.floor(t * 12) * 7 + i), a = r() * Math.PI * 2, L2 = 40 + r() * 100; ctx.strokeStyle = '#ffe066'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, -200); ctx.lineTo(Math.cos(a) * L2, -200 + Math.sin(a) * L2); ctx.stroke(); } ctx.restore(); }
function shield(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y + Math.sin(t * 3) * 8); ctx.scale(s, s); ctx.fillStyle = FLAT.mint; ctx.beginPath(); ctx.moveTo(0, -140); ctx.lineTo(120, -90); ctx.lineTo(100, 60); ctx.quadraticCurveTo(60, 120, 0, 150); ctx.quadraticCurveTo(-60, 120, -100, 60); ctx.lineTo(-120, -90); ctx.closePath(); ctx.fill(); text(ctx, '✓', 0, 0, { size: 120, fill: '#fff', lw: 0, shadow: false }); ctx.restore(); }
function telescope(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = '#495057'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-80, 0); ctx.lineTo(0, -200); ctx.lineTo(80, 0); ctx.stroke(); ctx.save(); ctx.translate(0, -220); ctx.rotate(-0.6 + Math.sin(t * 0.5) * 0.05); ctx.fillStyle = '#f8f9fa'; rrect(ctx, -60, -40, 360, 80, 30); ctx.fill(); ctx.fillStyle = '#4361ee'; ctx.fillRect(260, -45, 40, 90); ctx.restore(); ctx.restore(); }
function drop2(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#4cc9f0'; ctx.beginPath(); ctx.moveTo(0, -120); ctx.bezierCurveTo(60, -40, 80, 0, 80, 30); ctx.arc(0, 30, 80, 0, Math.PI); ctx.bezierCurveTo(-80, 0, -60, -40, 0, -120); ctx.fill(); ctx.restore(); }
function firstAid(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#ef233c'; rrect(ctx, -110, -80, 220, 160, 20); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(-20, -55, 40, 110); ctx.fillRect(-55, -20, 110, 40); ctx.restore(); }
function docs(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#e9ecef'; ctx.fillRect(-90, -110, 180, 220); ctx.fillStyle = '#adb5bd'; for (let i = 0; i < 6; i++) ctx.fillRect(-70, -80 + i * 30, 140 - (i % 2) * 40, 10); ctx.restore(); }
function backpack(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y + Math.sin(t * 2) * 6); ctx.scale(s, s); ctx.fillStyle = '#e76f51'; rrect(ctx, -150, -200, 300, 400, 80); ctx.fill(); ctx.fillStyle = '#f4a261'; rrect(ctx, -110, 20, 220, 150, 40); ctx.fill(); ctx.strokeStyle = '#bc6c25'; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(0, -200, 70, Math.PI, 0); ctx.stroke(); text(ctx, '72 H', 0, 95, { size: 60, fill: '#fff', lw: 0, shadow: false }); ctx.restore(); }
function plugPull(ctx, x, y, s, t, st) { const p = ease.out(prog(t, st + 0.2, st + 0.8)); ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#f8f9fa'; rrect(ctx, -110, -150, 220, 300, 30); ctx.fill(); ctx.fillStyle = '#212529'; ctx.fillRect(-40, -30, 16, 50); ctx.fillRect(24, -30, 16, 50); ctx.save(); ctx.translate(0, -p * 200); ctx.fillStyle = '#343a40'; rrect(ctx, -70, -150, 140, 120, 20); ctx.fill(); ctx.fillStyle = '#adb5bd'; ctx.fillRect(-40, -30, 16, 40 * (1 - p) + 10); ctx.fillRect(24, -30, 16, 40 * (1 - p) + 10); ctx.strokeStyle = '#343a40'; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(0, -150); ctx.quadraticCurveTo(0, -300, 120, -350); ctx.stroke(); ctx.restore(); ctx.restore(); }
function iceBottle(ctx, x, y, s, t, melt) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = mix('#e0fbfc', '#4cc9f0', melt); rrect(ctx, -40, -150, 80, 280, 26); ctx.fill(); ctx.fillStyle = FLAT.coral; rrect(ctx, -25, -180, 50, 34, 8); ctx.fill(); if (melt < 0.5) { ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 4; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-20, -100 + i * 70); ctx.lineTo(15, -70 + i * 70); ctx.stroke(); } } ctx.restore(); }
function paperNote(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-0.05 + Math.sin(t) * 0.02); ctx.fillStyle = '#fff3b0'; ctx.fillRect(-260, -300, 520, 600); ctx.fillStyle = '#ef233c'; ctx.fillRect(-260, -300, 520, 20); const lines = ['MAMÁ  55 1234 5678', 'PAPÁ  55 8765 4321', 'ABUELA  55 2468 1357', 'EMERGENCIAS  911']; lines.forEach((ln, i) => { const k = clamp((t * 1.2) - i * 0.5); ctx.save(); ctx.beginPath(); ctx.rect(-230, -230 + i * 120, 460 * k, 80); ctx.clip(); text(ctx, ln, -220, -190 + i * 120, { size: 38, fill: '#1d3557', lw: 0, shadow: false, align: 'left' }); ctx.restore(); }); ctx.restore(); }
function plate2(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#f8f9fa'; ctx.beginPath(); ctx.ellipse(0, 0, 220, 90, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#e9ecef'; ctx.beginPath(); ctx.ellipse(0, 0, 160, 60, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#adb5bd'; ctx.save(); ctx.translate(-280, 0); ctx.rotate(Math.sin(t * 3) * 0.1); ctx.fillRect(-8, -110, 16, 220); for (let i = 0; i < 3; i++) ctx.fillRect(-20 + i * 16, -150, 8, 50); ctx.restore(); ctx.save(); ctx.translate(280, 0); ctx.rotate(-Math.sin(t * 3) * 0.1); ctx.fillRect(-10, -150, 20, 260); ctx.restore(); ctx.restore(); }

V.terminar();
