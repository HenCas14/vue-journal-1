// VIDEO 002 — ¿Cuánto tiempo puedes sobrevivir sin agua? (estilo plano, Leo, escenarios nuevos)
THEME.outline = 0;
const V = crearVideo({ voces: [1, 2, 3, 4, 5].map(i => `audio/002-parte${i}.mp3`), hueco: 0.7, final: 17 });
const SCENE = V.SCENE, SHOTS = V.SHOTS;
const { shot, fx, PS, PE, SS, L } = V; const WD = V.W;
const e0 = (t, x) => E(t, x);
const drop = (ctx, x, y, s, t) => waterDrop(ctx, x, y, s, t);
const OK_ = FLAT.mint, BAD = FLAT.coral;

// ======================= PARTE 1 =======================
// 1. Cocina: no hay agua
{
  const a = 0, gota = SS(0, 0, 2), refri = SS(0, 0, 3), llave = SS(0, 0, 1);
  fx(llave, 'tick', 0.6); fx(llave + 0.3, 'tick', 0.6, 1.2); fx(gota + 0.2, 'blip', 0.7); fx(refri, 'whoosh', 0.4, 0.8); fx(refri + 0.6, 'boing', 0.6, 0.7);
  shot(a, (ctx, lt, d, t) => {
    sceneKitchen(ctx, t, { drip: t > gota && t < gota + 1.3, fridgeOpen: t > refri, shake: t > llave ? 1 : 0, heat: 0.15 });
    const walkIn = ease.out(L(t, 0, 2.2)), x = lerp(-150, 960, walkIn);
    const e = e0(t, { walk: walkIn < 0.98, mouth: walkIn < 0.98 ? 'yawn' : 'flat', mouthOpen: 0.5 + 0.5 * Math.sin(t * 3), open: walkIn < 0.98 ? 0.3 : undefined });
    if (t > llave) Object.assign(e, { walk: false, handR: [150, -470 + Math.sin(t * 12) * 12], look: [1, -0.4], mouth: 'flat' });
    if (t > gota) Object.assign(e, { mouth: 'o', mouthOpen: 0.4, eyeSize: 1.2 });
    if (t > refri) Object.assign(e, { flip: true, handR: [150, -360], look: [1, 0], shock: 0.6, mouth: 'o', mouthOpen: 0.8 });
    leo(ctx, t > refri ? 640 : x, 1000, 1.15, e);
    if (t > refri) { questionMarks(ctx, t, 250, 420, 3, '#fff'); popIn(ctx, t, refri + 0.6, 1300, 300, () => text(ctx, '¡NI UNA GOTA!', 0, 0, { size: 110, fill: FLAT.coral })); }
  }, { quiet: true });
}
// 2. ¿Cuánto aguantarías?
{
  const a = PS(0, 1), sem = SS(0, 1, 1), mes = SS(0, 1, 2), menos = SS(0, 1, 3);
  fx(sem, 'pop', 0.7); fx(mes, 'pop', 0.7, 1.2); fx(menos + 0.5, 'impact', 0.6); fx(menos + 0.55, 'boing', 0.6, 0.7);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#0077b6', '#03045e', 2); rays(ctx, t, W / 2, H / 2);
    if (t < sem) { questionMarks(ctx, t, W / 2, 480, 3, FLAT.accent); popIn(ctx, t, a + 0.2, W / 2, 230, () => text(ctx, '¿CUÁNTO AGUANTARÍAS?', 0, 0, { size: 100, fill: '#fff' })); }
    [['¿1 SEMANA?', '7', sem], ['¿1 MES?', '30', mes]].forEach(([lab, n, st], i) => {
      if (t < st) return; const x = 640 + i * 640, crossed = t > menos + 0.5;
      calendar(ctx, x, 470, 1, 'DÍAS', n, i ? FLAT.purple : FLAT.coral, (t * 3 + i) % 1 < 0.2 ? (t * 3 + i) % 1 * 5 : 0);
      label(ctx, lab, x, 790, { size: 70 });
      if (crossed) { ctx.strokeStyle = '#ef233c'; ctx.lineWidth = 30; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - 170, 300); ctx.lineTo(x + 170, 640); ctx.moveTo(x + 170, 300); ctx.lineTo(x - 170, 640); ctx.stroke(); }
    });
    if (t > menos + 0.5) popIn(ctx, t, menos + 0.5, W / 2, 170, () => { ctx.rotate(Math.sin(t * 4) * 0.03); text(ctx, '¡MUCHO MENOS!', 0, 0, { size: 120, fill: FLAT.accent }); });
  });
}
// 3. 1979: la celda (retro)
{
  const a = PS(0, 2), olvido = SS(0, 2, 1), dias = SS(0, 2, 2), hizo = SS(0, 2, 3), increible = SS(0, 2, 4);
  fx(a + 0.3, 'impact', 0.5); fx(olvido + 0.4, 'impact', 0.7, 0.6); fx(dias, 'ff', 0.3, 1, { dur: 1.5 }); fx(increible, 'sparkle', 0.6);
  shot(a, (ctx, lt, d, t) => {
    sceneCell(ctx, t, { bars: t > olvido + 0.4 });
    const doorP = ease.out(L(t, olvido, olvido + 0.5));
    drawPerson(ctx, 960, 1000, 1.15, e0(t, { mouth: t > dias ? 'sad' : 'flat', red: L(t, dias, dias + 2) * 0.5, bags: L(t, dias, dias + 2) * 0.7, look: t > hizo ? [1, -0.6] : [0, 0], handR: t > olvido + 0.5 && t < dias ? [80, -360] : null }), PEOPLE.andreas);
    if (t > olvido && t < dias + 1) { // guardia que se va silbando
      const gx = lerp(1500, 2300, L(t, olvido + 0.6, dias + 1));
      drawPerson(ctx, gx, 1000, 1.05, e0(t, { walk: true, mouth: 'o', mouthOpen: 0.2, flip: false }), { skin: '#e0ac69', skinD: '#c68f50', shirt: '#264653', shirtD: '#1d3640', pants: '#1d3640', hair: '#2b1d14', hairStyle: 'crew' });
      for (let i = 0; i < 3; i++) { const p = (t * 0.8 + i / 3) % 1; ctx.globalAlpha = 1 - p; text(ctx, '♪', gx - 60 - p * 40, 480 - p * 120, { size: 50, fill: '#fff' }); ctx.globalAlpha = 1; }
    }
    if (t > dias) calendar(ctx, 300, 300, 0.7, 'DÍA', String(Math.min(18, 1 + Math.floor(17 * L(t, dias, dias + 1.5)))), '#6b705c', (t * 6) % 1);
    if (t > hizo) { const g = 0.5 + 0.5 * Math.sin(t * 6); ctx.fillStyle = `rgba(160,230,255,${0.35 * g})`; ctx.beginPath(); ctx.arc(1080, 500, 220, 0, Math.PI * 2); ctx.fill(); questionMarks(ctx, t, 1080, 300, 2, FLAT.accent); }
    popIn(ctx, t, a + 0.3, 330, 120, () => text(ctx, 'AUSTRIA, 1979', 0, 0, { size: 80, fill: FLAT.accent }));
    retroOverlay(ctx, t);
  }, { trans: 'flash', mood: 'mystery' });
}
// 4. Hoy: hora por hora + teaser "demasiada agua"
{
  const a = PS(0, 3), teaser = SS(0, 3, 1);
  V.counterFirst = a + 0.7; fx(a + 0.7, 'pop', 0.9); fx(teaser + 0.3, 'boing', 0.7, 0.8); fx(teaser + 1.5, 'impact', 0.4);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#00b4d8', '#0077b6', 4); rays(ctx, t, 760, 600);
    const glug = t > teaser;
    leo(ctx, 760, 1000, 1.2, e0(t, { talk: glug ? 0 : talking(t), hold: glug ? null : null, handR: glug ? [80, -470] : null, mouth: glug ? 'o' : null, mouthOpen: 0.6, eyeSize: glug ? 1.2 : 1 }));
    if (glug) { // vaso gigante que se desborda
      const k = ease.back(L(t, teaser + 0.2, teaser + 0.8));
      ctx.save(); ctx.translate(900, 560); ctx.rotate(-0.5); ctx.scale(k, k);
      ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.beginPath(); ctx.moveTo(-110, -260); ctx.lineTo(110, -260); ctx.lineTo(80, 120); ctx.lineTo(-80, 120); ctx.fill();
      ctx.fillStyle = '#4cc9f0'; ctx.beginPath(); ctx.moveTo(-100, -200 + Math.sin(t * 6) * 8); ctx.lineTo(100, -200 - Math.sin(t * 6) * 8); ctx.lineTo(78, 110); ctx.lineTo(-78, 110); ctx.fill();
      ctx.restore();
      for (let i = 0; i < 10; i++) { const p = (t * 1.3 + i / 10) % 1; ctx.fillStyle = '#4cc9f0'; ctx.beginPath(); ctx.arc(820 + Math.sin(i) * 120 + p * 60, 380 + p * 600, 14 * (1 - p * 0.5), 0, Math.PI * 2); ctx.fill(); }
      popIn(ctx, t, teaser + 1.5, 1450, 470, () => { ctx.fillStyle = FLAT.accent; ctx.beginPath(); ctx.moveTo(0, -200); ctx.lineTo(220, 170); ctx.lineTo(-220, 170); ctx.closePath(); ctx.fill(); text(ctx, '!', 0, 50, { size: 260, fill: FLAT.ink, lw: 0, shadow: false }); });
    } else popIn(ctx, t, a + 0.4, 1400, 480, () => { text(ctx, 'HORA', 0, -80, { size: 130, fill: '#fff' }); text(ctx, 'POR HORA', 0, 70, { size: 130, fill: FLAT.accent }); });
  }, { counter: () => 'HORA 0' });
}
// TÍTULO (sobre la voz)
const TITLE_AT = PE(0, 3) + 0.1, TITLE_LEN = 3.4;
{
  const a = TITLE_AT;
  fx(a - 0.1, 'whoosh', 0.8); fx(a + 0.4, 'sparkle', 0.6); [0.6, 0.9, 1.2].forEach((dd, i) => fx(a + dd, 'pop', 0.5, 0.9 + i * 0.15));
  V.musicExtra.push([a - 0.2, 0.14], [a, 0.26], [a + TITLE_LEN - 0.2, 0.26], [a + TITLE_LEN, 0.14]);
  shot(a, (ctx, lt, d, t) => {
    sceneDesert(ctx, t, { heat: 0.9, speed: 30 });
    ctx.fillStyle = 'rgba(0,40,80,0.35)'; ctx.fillRect(0, 0, W, H);
    const lines = [['¿CUÁNTO TIEMPO PUEDES', 104, '#ffffff', 290], ['SOBREVIVIR SIN AGUA?', 150, '#4cc9f0', 450]]; let k = 0;
    lines.forEach(([str, size, fill, y], li) => {
      ctx.font = `${size}px Lilita`; const total = ctx.measureText(str).width; let x = W / 2 - total / 2;
      [...str].forEach(ch => { const w = ctx.measureText(ch).width, s = pop(lt, 0.3 + k * 0.025 + li * 0.15, 0.6); if (s > 0 && ch !== ' ') { ctx.save(); ctx.translate(x + w / 2, y + Math.sin(lt * 4 - k * 0.45) * 8); ctx.scale(s, s); text(ctx, ch, 0, 0, { size, fill }); ctx.restore(); } x += w; k++; });
    });
    const up = ease.back(prog(lt, 1.2, 1.8));
    if (up > 0) leo(ctx, W / 2, 1228 + 500 * (1 - up), 1.1, e0(t, { red: 0.4, mouth: 'o', mouthOpen: 0.6, handR: [120, -420], look: [0.5, -0.5] }));
    drop(ctx, 1550, 780 + Math.sin(t * 3) * 20, 0.9, t);
  }, { trans: 'wipe', quiet: true });
}
// 5. Tu cuerpo es 60 % agua: una botella con patas
{
  const a = Math.max(TITLE_AT + TITLE_LEN, PS(0, 4)), kilos = SS(0, 4, 1), patas = SS(0, 4, 2);
  fx(a + 0.4, 'ff', 0.3, 1, { dur: 1.2 }); fx(kilos, 'pop', 0.6); fx(patas, 'boing', 0.8, 1.3);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#48cae4', '#023e8a', 5);
    const fill = 0.6 * ease.out(L(t, a + 0.4, a + 1.6));
    bottleBody(ctx, t > patas ? 760 + Math.sin(t * 4) * 30 : 760, 980, 1, t, fill, t > patas);
    bigStat(ctx, t, a + 0.4, 1400, 330, 60, { suffix: '%', size: 230, color: '#caf0f8', label: 'DE TU CUERPO ES AGUA', count: 1.2 });
    if (t > kilos) popIn(ctx, t, kilos, 1400, 760, () => { card(ctx, -330, -90, 660, 180, '#fff', 40); text(ctx, '70 kg → 40 L', 0, 0, { size: 90, fill: '#0077b6', lw: 0, shadow: false }); });
  });
}
// 6. Reparto del agua
{
  const a = PS(0, 5), s1 = SS(0, 5, 1), s2 = SS(0, 5, 2), s3 = SS(0, 5, 3);
  [s1, s2, s2 + 0.4, s3].forEach((st, i) => fx(st, 'pop', 0.6, 1 + i * 0.12));
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#023e8a', '#03045e', 6);
    const items = [['SANGRE', 0.9, s1, (c) => { c.fillStyle = '#e63946'; c.beginPath(); c.moveTo(0, -90); c.bezierCurveTo(70, -10, 70, 60, 0, 70); c.bezierCurveTo(-70, 60, -70, -10, 0, -90); c.fill(); }],
      ['CEREBRO', 0.75, s2, (c) => brain(c, 0, 0, 0.42, t, { face: false })], ['CORAZÓN', 0.75, s2 + 0.4, (c) => heartIcon(c, 0, 0, 1.1)],
      ['HUESOS', 0.31, s3, (c) => bone(c, 0, 0, 1.1, t)]];
    items.forEach(([n, v, st, f], i) => {
      popIn(ctx, t, st, 300 + i * 440, 470, () => {
        card(ctx, -180, -260, 360, 560, 'rgba(255,255,255,0.12)', 36, false);
        ctx.save(); ctx.translate(0, -120); f(ctx); ctx.restore();
        const k = ease.out(L(t, st + 0.3, st + 1.3)); waterGlass(ctx, 0, 150, 1, t, v * k);
        text(ctx, `${Math.round(v * 100 * k)}%`, 0, 150, { size: 64, fill: '#fff' }); text(ctx, n, 0, 260, { size: 50, fill: FLAT.accent });
      });
    });
    if (t < s1) popIn(ctx, t, a + 0.2, W / 2, H / 2, () => text(ctx, '¿DÓNDE ESTÁ EL AGUA?', 0, 0, { size: 110, fill: '#fff' }));
  });
}
// 7. Pierdes 2-3 litros al día
{
  const a = PS(0, 6), banio = WD(0, 6, 'baño'), sudas = WD(0, 6, 'sudas'), resp = WD(0, 6, 'respiras'), vapor = SS(0, 6, 3);
  fx(banio, 'pop', 0.6); fx(sudas, 'blip', 0.6); fx(resp, 'whoosh', 0.4, 1.6); fx(vapor, 'sparkle', 0.4);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#90e0ef', '#0096c7', 7);
    leo(ctx, 960, 1000, 1.2, e0(t, { mouth: t > resp ? 'o' : 'smile', mouthOpen: 0.3 + 0.2 * Math.sin(t * 3) }));
    const jug = 1 - 0.7 * L(t, a, PE(0, 6)); waterGlass(ctx, 1600, 620, 1.6, t, jug); text(ctx, '2-3 L / DÍA', 1600, 870, { size: 64, fill: '#fff' });
    if (t > banio) popIn(ctx, t, banio, 380, 420, () => { toilet(ctx, 0, 0, 1, t); text(ctx, 'BAÑO', 0, 190, { size: 56, fill: '#fff' }); });
    if (t > sudas) { for (let i = 0; i < 5; i++) { const p = (t * 1.1 + i / 5) % 1; ctx.fillStyle = '#7fd4ff'; ctx.globalAlpha = 1 - p; ctx.beginPath(); ctx.ellipse(880 + (i % 2) * 160, 470 + p * 300, 10, 15, 0, 0, Math.PI * 2); ctx.fill(); } ctx.globalAlpha = 1; popIn(ctx, t, sudas, 380, 760, () => text(ctx, 'SUDOR', 0, 0, { size: 56, fill: '#fff' })); }
    if (t > resp) { for (let i = 0; i < 4; i++) { const p = (t * 0.7 + i / 4) % 1; ctx.fillStyle = `rgba(255,255,255,${0.7 * (1 - p)})`; ctx.beginPath(); ctx.arc(1040 + p * 220, 410 - p * 120, 20 + p * 50, 0, Math.PI * 2); ctx.fill(); } popIn(ctx, t, resp, 1250, 230, () => text(ctx, '¡AL RESPIRAR!', 0, 0, { size: 72, fill: '#fff' })); }
  });
}
// 8. ¿Para qué tanta agua?
{
  const a = PS(0, 7), nutr = WD(0, 7, 'nutrientes'), cojin = WD(0, 7, 'cojin'), aire = WD(0, 7, 'aire');
  fx(nutr, 'pop', 0.6); fx(cojin, 'boing', 0.6, 1.4); fx(aire, 'whoosh', 0.5, 0.8);
  shot(a, (ctx, lt, d, t) => {
    if (t < cojin) {
      sceneBlood(ctx, t, { thick: 0, speed: 0.8 });
      if (t > nutr) for (let i = 0; i < 8; i++) { const x = ((i * 260 + t * 220) % (W + 200)) - 100, y = 330 + (i % 3) * 180; foodIcon(ctx, ['salad', 'pizza', 'burger'][i % 3], x, y, 0.4, Math.sin(t * 2 + i) * 0.3); }
      popIn(ctx, t, a + 0.3, W / 2, 110, () => text(ctx, t > nutr ? 'LLEVA NUTRIENTES' : '¿PARA QUÉ?', 0, 0, { size: 96, fill: '#fff' }));
    } else if (t < aire) {
      bgFlat(ctx, t, '#4cc9f0', '#0077b6', 8);
      const bob = Math.sin(t * 3) * 25;
      ctx.fillStyle = '#90e0ef'; ctx.beginPath(); ctx.ellipse(960, 800, 520, 120 + Math.sin(t * 3) * 10, 0, 0, Math.PI * 2); ctx.fill();
      brain(ctx, 960, 560 + bob, 1.1, t, { happy: true });
      popIn(ctx, t, cojin, W / 2, 130, () => text(ctx, 'UN COJÍN PARA TU CEREBRO', 0, 0, { size: 84, fill: '#fff' }));
    } else {
      bgFlat(ctx, t, '#caf0f8', '#90e0ef', 9);
      leo(ctx, 700, 1000, 1.15, e0(t, { mouth: 'grin' }));
      acUnit(ctx, 1350, 380, t);
      popIn(ctx, t, aire, 1350, 800, () => text(ctx, 'AIRE ACONDICIONADO', 0, 0, { size: 72, fill: '#0077b6' }));
    }
  });
}
// 9. Reservas desde el primer minuto
{
  const a = PS(0, 8); fx(a + 0.6, 'ff', 0.3, 0.7, { dur: 2.5 });
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#0096c7', '#023e8a', 10);
    leo(ctx, 760, 1000, 1.2, e0(t, { mouth: 'flat', look: [1, 0] }));
    const lvl = 1 - 0.25 * L(t, a + 0.6, a + d);
    tank(ctx, 1350, 560, 1.2, t, lvl);
    popIn(ctx, t, a + 0.3, 760, 200, () => text(ctx, 'RESERVAS', 0, 0, { size: 100, fill: '#fff' }));
  }, { counter: () => 'HORA 0' });
}

// ======================= PARTE 2 =======================
// 10. Primeras horas... la sed (calle de día)
{
  const a = PS(1, 0) - 0.3, sed = WD(1, 0, 'sed');
  fx(sed, 'boing', 0.7, 0.9);
  shot(a, (ctx, lt, d, t) => {
    sceneStreet(ctx, t);
    const thirsty = t > sed;
    leo(ctx, 960, 1000, 1.15, e0(t, { walk: true, mouth: thirsty ? 'o' : 'smile', mouthOpen: 0.5, red: thirsty ? 0.2 : 0 }));
    if (thirsty) { popIn(ctx, t, sed, 1350, 330, () => { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(0, 0, 200, 140, 0, 0, Math.PI * 2); ctx.fill(); for (const [x, y, r] of [[-190, 150, 22], [-240, 210, 12]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); } waterGlass(ctx, 0, 20, 0.9, t, 0.8); }); popIn(ctx, t, sed + 0.2, 500, 260, () => text(ctx, '¡SED!', 0, 0, { size: 140, fill: FLAT.coral })); }
  }, { counter: t => counterLabel(1 + 5 * L(t, PS(1, 0), PE(1, 2))) });
}
// 11. La sed llega tarde
{
  const a = PS(1, 1), late = SS(1, 1, 1), alarm = SS(1, 1, 2);
  fx(late, 'ding', 0.7, 0.8); fx(alarm, 'impact', 0.4); for (let i = 0; i < 6; i++) fx(alarm + 0.1 + i * 0.12, 'tick', 0.5, 1.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#023e8a', '#03045e', 11);
    const lvl = 1 - 0.02 * L(t, a, a + 3) * 2.5;
    // barra de nivel de agua del cuerpo con la marca de "SED"
    card(ctx, 300, 200, 220, 700, 'rgba(255,255,255,0.12)', 30, false);
    ctx.save(); rrect(ctx, 310, 210, 200, 680, 24); ctx.clip(); ctx.fillStyle = '#4cc9f0'; const top = 210 + 680 * (1 - lvl * 0.95);
    ctx.beginPath(); ctx.moveTo(310, top); for (let x = 0; x <= 200; x += 10) ctx.lineTo(310 + x, top + Math.sin(x * 0.06 + t * 4) * 8); ctx.lineTo(510, 890); ctx.lineTo(310, 890); ctx.fill(); ctx.restore();
    ctx.fillStyle = BAD; ctx.fillRect(280, 290, 260, 8); text(ctx, 'SED (1-2 %)', 620, 294, { size: 50, fill: BAD, align: 'left' });
    if (t > late) { alarmClock(ctx, 1300, 520, 2, t); popIn(ctx, t, late, 1300, 160, () => text(ctx, '¡LLEGA TARDE!', 0, 0, { size: 110, fill: FLAT.accent })); }
    else bigStat(ctx, t, a + 0.3, 1300, 500, '1-2 %', { size: 200, color: '#caf0f8', label: 'YA PERDISTE' });
  }, { counter: t => counterLabel(2 + 2 * L(t, PS(1, 1), PE(1, 1))) });
}
// 12. Con 2 %: concentración, cansancio, humor
{
  const a = PS(1, 2), c1 = WD(1, 2, 'concentrarte'), c2 = WD(1, 2, 'cansas'), c3 = WD(1, 2, 'humor');
  [c1, c2, c3].forEach((s, i) => fx(s, 'pop', 0.6, 1 + i * 0.15));
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#48cae4', '#0077b6', 12, false);
    leo(ctx, 640, 1080, 1.15, e0(t, { hold: 'book', handR: [70, -290], handL: [-70, -290], red: 0.2, mouth: t > c3 ? 'angry' : 'flat', angry: t > c3 ? 1 : 0, look: [0, 0.4] }));
    desk(ctx, 640, 840, 800);
    [['CONCENTRACIÓN ↓', c1, (c) => { for (let i = 0; i < 3; i++) { c.fillStyle = 'rgba(255,255,255,0.8)'; c.beginPath(); c.arc(-50 + i * 50 + Math.sin(t * 2 + i) * 10, Math.cos(t * 2 + i) * 10, 45, 0, Math.PI * 2); c.fill(); } }],
     ['ENERGÍA ↓', c2, (c) => battery(c, 0, 0, 1, 0.15 + 0.05 * Math.sin(t * 6))], ['HUMOR ↓', c3, (c) => { bolt(c, -40, 0, t); bolt(c, 40, 10, t + 1); }]].forEach(([n, st, f], i) => {
      popIn(ctx, t, st, 1400, 260 + i * 260, () => { card(ctx, -320, -100, 640, 200, '#fff', 40); ctx.save(); ctx.translate(-200, 0); f(ctx); ctx.restore(); text(ctx, n, 60, 0, { size: 54, fill: '#0077b6', lw: 0, shadow: false }); });
    });
  }, { counter: () => 'HORA 6' });
}
// 13. Hora 12: mal aliento (fiesta de bacterias)
{
  const a = PS(1, 3), aliento = WD(1, 3, 'aliento'), saliva = SS(1, 3, 3), fiesta = SS(1, 3, 5);
  fx(aliento, 'whoosh', 0.5, 0.6); fx(fiesta, 'sparkle', 0.7); for (let i = 0; i < 6; i++) fx(fiesta + 0.4 + i * 0.45, 'pop', 0.3, 1.2 + (i % 2) * 0.3);
  shot(a, (ctx, lt, d, t) => {
    if (t < saliva) {
      bgFlat(ctx, t, '#b5e48c', '#52b788', 13);
      leo(ctx, 800, 1000, 1.2, e0(t, { mouth: 'o', mouthOpen: 0.4, look: [1, 0] }));
      if (t > aliento) { for (let i = 0; i < 4; i++) { const p = (t * 0.6 + i / 4) % 1; ctx.fillStyle = `rgba(128,185,24,${0.6 * (1 - p)})`; ctx.beginPath(); ctx.arc(880 + p * 400, 420 - p * 60 + Math.sin(p * 8) * 20, 30 + p * 60, 0, Math.PI * 2); ctx.fill(); }
        const fp = L(t, aliento + 0.5, aliento + 1.5); ctx.save(); ctx.translate(1350, 300 + fp * 500); ctx.rotate(fp * 6); text(ctx, '🪰', 0, 0, { size: 70, shadow: false, lw: 0 }); ctx.restore(); }
      popIn(ctx, t, a + 0.2, 1300, 320, () => text(ctx, 'HORA 12', 0, 0, { size: 110, fill: '#fff' }));
    } else {
      // dentro de la boca: bacterias de fiesta
      ctx.fillStyle = '#7a1f3d'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#ff8fab'; ctx.beginPath(); ctx.ellipse(W / 2, 1100, 900, 380, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff'; for (let i = 0; i < 12; i++) { rrect(ctx, 60 + i * 155, -40, 120, 150, 30); ctx.fill(); rrect(ctx, 60 + i * 155, 990, 120, 150, 30); ctx.fill(); }
      if (t > fiesta) { for (let i = 0; i < 5; i++) { ctx.fillStyle = [FLAT.accent, FLAT.pink, FLAT.mint, FLAT.sky, FLAT.purple][i]; ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.moveTo(W / 2, 0); const a2 = Math.sin(t * 2 + i) * 0.8 + (i - 2) * 0.35; ctx.lineTo(W / 2 + Math.sin(a2) * 1400 - 120, H); ctx.lineTo(W / 2 + Math.sin(a2) * 1400 + 120, H); ctx.fill(); } ctx.globalAlpha = 1; }
      for (let i = 0; i < 7; i++) bacterium(ctx, 280 + i * 230, 720 + (t > fiesta ? -Math.abs(Math.sin(t * 6 + i)) * 60 : Math.sin(t * 2 + i) * 15), 1, t + i, t > fiesta);
      popIn(ctx, t, saliva, W / 2, 230, () => text(ctx, t > fiesta ? '¡FIESTA DE BACTERIAS!' : 'MENOS SALIVA', 0, 0, { size: 96, fill: '#fff' }));
    }
  }, { counter: () => 'HORA 12' });
}
// 14. ¡24 horas! (cocina de noche)
{
  const a = PS(1, 4) - 0.1; fx(a + 0.15, 'ding', 0.7, 1.5); fx(a + 0.2, 'boing', 0.9); fx(a + 0.2, 'impact', 0.5);
  shot(a, (ctx, lt, d, t) => {
    sceneKitchen(ctx, t, { heat: 0.3 }); ctx.fillStyle = 'rgba(20,20,70,0.45)'; ctx.fillRect(0, 0, W, H);
    const k = Math.sin(clamp(L(t, a + 0.15, a + 1.4)) * Math.PI);
    leo(ctx, 900 + Math.sin(t * 40) * 6 * k, 1000, 1.2, e0(t, { shock: k, eyeSize: 1 + 0.3 * k, red: 0.3, mouth: 'o', mouthOpen: 0.8 }));
    burst(ctx, 900, 480, t, a + 0.2, FLAT.accent, 14, 300);
    popIn(ctx, t, a + 0.15, W / 2, 140, () => text(ctx, '¡24 HORAS!', 0, 0, { size: 140, fill: FLAT.accent }));
  }, { trans: 'flash', counter: () => 'HORA 24', bump: [PS(1, 4)] });
}
// 15. Hormona → riñones; orina oscura
{
  const a = PS(1, 5), menos = SS(1, 5, 1), te = WD(1, 5, 'te');
  fx(a + 0.4, 'whoosh', 0.5, 1.4); fx(a + 2, 'boing', 0.6, 1.2); fx(menos + 0.5, 'pop', 0.6); fx(te, 'ding', 0.5, 0.9);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#ffb703', '#fb8500', 15);
    if (t < menos + 0.3) {
      brain(ctx, 420, 360, 0.8, t, { worried: true });
      const p = ease.inOut(L(t, a + 0.4, a + 2)); envelope(ctx, lerp(560, 1280, p), 380 + Math.sin(p * Math.PI) * -150, t);
      kidney(ctx, 1350, 640, 1, t, 0, true); kidney(ctx, 1650, 640, 1, t + 1, 0, true);
      if (t > a + 2) popIn(ctx, t, a + 2, 1500, 320, () => { card(ctx, -250, -60, 500, 120, '#ef233c', 30); text(ctx, '¡NO TIREN EL AGUA!', 0, 0, { size: 48, fill: '#fff', lw: 0, shadow: false }); });
    } else {
      const cols = ['#fff9c4', '#ffe066', '#e9b44c', '#a0632a'];
      cols.forEach((c, i) => { const k = ease.back(L(t, menos + 0.3 + i * 0.3, menos + 0.8 + i * 0.3)); if (k <= 0) return; ctx.save(); ctx.translate(380 + i * 380, 560); ctx.scale(k, k); waterGlass(ctx, 0, 0, 1.6, t + i, 0.75, c); ctx.restore(); });
      if (t > te) popIn(ctx, t, te, 1520, 880, () => { card(ctx, -260, -60, 520, 120, FLAT.ink, 60); text(ctx, '¡COLOR TÉ!', 0, 0, { size: 64, fill: '#e9b44c', lw: 0, shadow: false }); });
      popIn(ctx, t, menos + 0.3, W / 2, 140, () => text(ctx, 'COLOR DE LA ORINA', 0, 0, { size: 90, fill: '#fff' }));
    }
  }, { counter: () => 'HORA 24' });
}
// 16. Boca seca, piel (pellizco), dolor de cabeza
{
  const a = PS(1, 6), piel = WD(1, 6, 'piel'), pell = WD(1, 6, 'pellizcas'), cabeza = WD(1, 6, 'dolor');
  fx(pell, 'boing', 0.5, 1.6); fx(cabeza, 'impact', 0.5, 0.8);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#f4a261', '#e76f51', 16);
    if (t < pell) { leo(ctx, 960, 1000, 1.2, e0(t, { mouth: 'flat', red: 0.3, handR: [70, -470] })); for (let i = 0; i < 6; i++) { ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(940 + i * 8, 600); ctx.lineTo(950 + i * 8 + Math.sin(t * 9 + i) * 6, 640); ctx.stroke(); } popIn(ctx, t, a + 0.2, 1400, 300, () => text(ctx, 'BOCA SECA', 0, 0, { size: 100, fill: '#fff' })); }
    else if (t < cabeza) { // mano gigante con el pellizco
      handPinch(ctx, W / 2, 620, t, pell);
      popIn(ctx, t, pell, 860, 150, () => text(ctx, 'LA PIEL TARDA EN REGRESAR', 0, 0, { size: 72, fill: '#fff' }));
    } else {
      leo(ctx, 960 + Math.sin(t * 30) * 4, 1000, 1.2, e0(t, { mouth: 'sad', red: 0.4, bags: 0.5, handL: [-60, -500], handR: [60, -500], open: 0.4 }));
      for (let i = 0; i < 5; i++) { const ang = t * 2 + i * 1.25; bolt(ctx, 960 + Math.cos(ang) * 220, 420 + Math.sin(ang) * 90, t + i); }
      popIn(ctx, t, cabeza, W / 2, 140, () => text(ctx, 'DOLOR DE CABEZA', 0, 0, { size: 100, fill: '#fff' }));
    }
  }, { counter: () => 'HORA 28' });
}
// 17. El cerebro se encoge
{
  const a = PS(1, 7), encoge = SS(1, 7, 2);
  fx(SS(1, 7, 1) + 1, 'ff', 0.3, 0.6, { dur: 1.5 }); fx(encoge, 'boing', 0.7, 0.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#3a0ca3', '#10002b', 17);
    const shrink = 1 - 0.12 * ease.inOut(L(t, SS(1, 7, 1) + 1, encoge + 0.6));
    skull(ctx, W / 2, 560, 1.3, t);
    brain(ctx, W / 2 + Math.sin(t * 2) * 6, 560, 1.05 * shrink, t, { worried: shrink < 0.95 });
    if (shrink < 0.97) { [[-1, 0], [1, 0], [0, -1]].forEach(([dx, dy]) => { const p = (t * 1.5) % 1; ctx.fillStyle = FLAT.accent; ctx.save(); ctx.translate(W / 2 + dx * (360 - p * 40), 560 + dy * (300 - p * 40)); ctx.rotate(Math.atan2(-dy, -dx)); ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(-20, -25); ctx.lineTo(-20, 25); ctx.fill(); ctx.restore(); }); }
    if (t > encoge) popIn(ctx, t, encoge, 860, 140, () => text(ctx, '¡SE ENCOGE!', 0, 0, { size: 120, fill: FLAT.accent }));
    else popIn(ctx, t, a + 0.3, 860, 140, () => text(ctx, '¿POR QUÉ DUELE?', 0, 0, { size: 100, fill: '#fff' }));
  }, { counter: () => 'HORA 30' });
}
// 18. ¡36 horas!
{
  const a = PS(1, 8) - 0.1; fx(a + 0.15, 'ding', 0.7, 1.3); fx(a + 0.2, 'boing', 0.9, 0.9);
  shot(a, (ctx, lt, d, t) => {
    sceneStreet(ctx, t, 0.6);
    const k = Math.sin(clamp(L(t, a + 0.15, a + 1.4)) * Math.PI);
    leo(ctx, 960, 1000, 1.2, e0(t, { shock: k, eyeSize: 1 + 0.3 * k, red: 0.5, bags: 0.5, mouth: 'o', mouthOpen: 0.8, frazzle: 0.3 }));
    popIn(ctx, t, a + 0.15, W / 2, 140, () => text(ctx, '¡36 HORAS!', 0, 0, { size: 140, fill: FLAT.accent }));
  }, { trans: 'flash', counter: () => 'HORA 36', bump: [PS(1, 8)] });
}
// 19. Sangre espesa, corazón acelerado
{
  const a = PS(1, 9), jarabe = WD(1, 9, 'jarabe'), corazon = SS(1, 9, 2);
  fx(jarabe, 'boing', 0.5, 0.5); for (let i = 0; i < 12; i++) fx(corazon + i * 0.45, 'impact', 0.25, 1.4);
  shot(a, (ctx, lt, d, t) => {
    sceneBlood(ctx, t, { thick: L(t, a, a + 6), heart: t > corazon });
    if (t > jarabe && t < corazon + 2) popIn(ctx, t, jarabe, 420, 280, () => { syrup(ctx, 0, 0, 1, t); text(ctx, '¡COMO JARABE!', 0, 200, { size: 60, fill: '#fff' }); });
    popIn(ctx, t, a + 0.2, 860, 130, () => text(ctx, 'SANGRE MÁS ESPESA', 0, 0, { size: 88, fill: '#fff' }));
  }, { counter: () => 'HORA 38' });
}
// 20. Mareo al levantarse
{
  const a = PS(1, 10), pulso = SS(1, 10, 1), agot = SS(1, 10, 2);
  fx(a + 0.3, 'dizzy', 0.6); fx(pulso, 'impact', 0.3, 1.4); fx(pulso + 0.4, 'impact', 0.3, 1.4); fx(agot, 'yawn', 0.5, 0.8);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#9d4edd', '#3c096c', 20);
    const up = ease.out(L(t, a, a + 0.8));
    ctx.fillStyle = '#c77dff'; rrect(ctx, 520, 760, 500, 160, 40); ctx.fill(); rrect(ctx, 520, 600, 90, 300, 40); ctx.fill();
    leo(ctx, 800, lerp(1080, 1000, up), 1.15, e0(t, { spiral: t > a + 0.5 && t < agot, rot: Math.sin(t * 3) * 0.08, mouth: t > agot ? 'sad' : 'wobbly', red: 0.5, open: t > agot ? 0.4 : 1 }));
    stars(ctx, t, 800, 330);
    if (t > pulso) { const beat = Math.pow(Math.max(0, Math.sin(t * 9)), 6); heartIcon(ctx, 1400, 420, 1.4 + beat * 0.3); text(ctx, '¡TUM-TUM!', 1400, 620, { size: 70, fill: '#fff' }); }
    if (t > agot) battery(ctx, 1400, 850, 1.3, 0.05);
  }, { counter: () => 'HORA 40' });
}
// 21. El cuerpo prioriza cerebro y corazón
{
  const a = PS(1, 11), prio = SS(1, 11, 1), menos = SS(1, 11, 2), frio = SS(1, 11, 3);
  fx(prio, 'sparkle', 0.5); fx(menos, 'whoosh', 0.4, 0.6); fx(frio, 'whoosh', 0.5, 0.5);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#1d3557', '#0b1a2e', 21);
    bodyMap(ctx, W / 2, 1000, 1.25, t, L(t, menos, menos + 2), t > frio);
    if (t > prio) { popIn(ctx, t, prio, 1450, 300, () => { card(ctx, -260, -70, 520, 140, FLAT.coral, 70); text(ctx, 'PRIORIDAD', 0, 0, { size: 70, fill: '#fff', lw: 0, shadow: false }); }); }
    if (t > frio) { popIn(ctx, t, frio, 420, 820, () => text(ctx, '❄ MANOS Y PIES FRÍOS', 0, 0, { size: 52, fill: '#bde0fe' })); }
    if (t < prio) popIn(ctx, t, a + 0.3, W / 2, 120, () => text(ctx, 'UNA DECISIÓN DIFÍCIL', 0, 0, { size: 96, fill: '#fff' }));
  }, { counter: () => 'HORA 44' });
}

// ======================= PARTE 3 =======================
// 22. Día 2: el calor (desierto)
{
  const a = PS(2, 0) - 0.3; fx(a + 0.5, 'whoosh', 0.6, 0.6);
  shot(a, (ctx, lt, d, t) => {
    sceneDesert(ctx, t, { heat: 0.9 });
    leo(ctx, 900, 1000, 1.15, e0(t, { walk: true, red: 0.5, bags: 0.5, mouth: 'wobbly' }));
    popIn(ctx, t, SS(2, 0, 1), W / 2, 160, () => text(ctx, '¡EL CALOR!', 0, 0, { size: 140, fill: '#fff' }));
  }, { trans: 'wipe', counter: () => 'DÍA 2', bump: [PS(2, 0)] });
}
// 23. Sudor que enfría vs ya no puedes sudar
{
  const a = PS(2, 1), sin = SS(2, 1, 1);
  fx(sin + 0.4, 'boing', 0.6, 0.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#90e0ef', '#48cae4', 23, false); ctx.fillStyle = '#ffb703'; ctx.fillRect(W / 2, 0, W / 2, H);
    ctx.fillStyle = '#fff'; ctx.fillRect(W / 2 - 5, 0, 10, H);
    leo(ctx, 480, 1000, 1.05, e0(t, { mouth: 'smile', red: 0 }));
    for (let i = 0; i < 4; i++) { const p = (t * 1.2 + i / 4) % 1; ctx.fillStyle = '#7fd4ff'; ctx.globalAlpha = 1 - p; ctx.beginPath(); ctx.ellipse(420 + (i % 2) * 130, 470 + p * 260, 10, 15, 0, 0, Math.PI * 2); ctx.fill(); } ctx.globalAlpha = 1;
    for (let i = 0; i < 4; i++) { const x = ((t * 300 + i * 120) % 500); ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(80 + x, 300 + i * 40); ctx.lineTo(160 + x, 300 + i * 40); ctx.stroke(); }
    label(ctx, 'SUDAS = TE ENFRÍAS', 480, 130, { size: 60, fill: '#0077b6' });
    if (t > sin) {
      leo(ctx, 1440, 1000, 1.05, e0(t, { mouth: 'wobbly', red: 0.6, bags: 0.5 }));
      for (let i = 0; i < 4; i++) { ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 6; ctx.beginPath(); for (let y = 0; y < 160; y += 10) { const x = 1380 + i * 40 + Math.sin(y * 0.08 + t * 6 + i) * 10; y ? ctx.lineTo(x, 420 - y) : ctx.moveTo(x, 420 - y); } ctx.stroke(); }
      popIn(ctx, t, sin, 1440, 130, () => text(ctx, 'SIN AGUA: NO SUDAS', 0, 0, { size: 60, fill: '#fff' }));
    }
  }, { counter: () => 'DÍA 2' });
}
// 24. La temperatura sube; 1 litro de sudor por hora en el desierto
{
  const a = PS(2, 2), lugar = SS(2, 2, 1), litro = SS(2, 2, 2);
  fx(a + 0.3, 'ff', 0.3, 1.2, { dur: 2 }); fx(litro + 1, 'ding', 0.6);
  shot(a, (ctx, lt, d, t) => {
    sceneDesert(ctx, t, { heat: 1, sunX: 1650 });
    thermometer(ctx, 380, 700, 0.4 + 0.55 * ease.out(L(t, a + 0.3, lugar + 1)), t);
    leo(ctx, 960, 1000, 1.1, e0(t, { red: 0.6, bags: 0.6, mouth: 'wobbly', walk: true }));
    if (t > litro) { const k = 1 - L(t, litro + 0.5, PE(2, 2)); popIn(ctx, t, litro, 1500, 560, () => { waterGlass(ctx, 0, 0, 1.6, t, k); text(ctx, '+1 L / HORA', 0, 230, { size: 70, fill: '#fff' }); }); }
    if (t < litro) popIn(ctx, t, a + 0.3, 1450, 300, () => text(ctx, 'SUBE... Y SUBE', 0, 0, { size: 96, fill: '#fff' }));
  }, { counter: () => 'DÍA 2' });
}
// 25. 10 %: confusión, alucinaciones (espejismo)
{
  const a = PS(2, 3), conf = WD(2, 3, 'confusion'), alu = WD(2, 3, 'alucinaciones');
  fx(conf, 'dizzy', 0.5); fx(alu, 'sparkle', 0.6, 0.7);
  shot(a, (ctx, lt, d, t) => {
    sceneDesert(ctx, t, { heat: 1, speed: 10 });
    if (t > alu) { const g = 0.5 + 0.5 * Math.sin(t * 4); ctx.globalAlpha = 0.4 + 0.4 * g; ctx.fillStyle = '#4cc9f0'; ctx.beginPath(); ctx.ellipse(1400, 820, 300 + g * 30, 50, 0, 0, Math.PI * 2); ctx.fill(); palm(ctx, 1250, 820, t); palm(ctx, 1560, 820, t); ctx.globalAlpha = 1; }
    leo(ctx, 700, 1000, 1.15, e0(t, { spiral: t > conf, red: 0.8, bags: 0.8, mouth: 'wobbly', rot: Math.sin(t * 3) * 0.06, frazzle: 0.5 }));
    bigStat(ctx, t, a + 0.3, 700, 220, 10, { suffix: '%', size: 180, color: BAD, label: 'DE AGUA PERDIDA' });
    if (t > alu) popIn(ctx, t, alu, 1400, 560, () => text(ctx, '¿UN OASIS?', 0, 0, { size: 90, fill: '#fff' }));
  }, { counter: () => 'DÍA 2', mood: 'tense' });
}
// 26. Riñones agotados, desechos en la sangre
{
  const a = PS(2, 4), dese = SS(2, 4, 1);
  fx(a + 0.4, 'yawn', 0.5, 0.7); fx(dese, 'pop', 0.4, 0.7);
  shot(a, (ctx, lt, d, t) => {
    if (t < dese) { bgFlat(ctx, t, '#6a040f', '#370617', 26); kidney(ctx, 760, 560, 1.6, t, 1); kidney(ctx, 1160, 560, 1.6, t + 1, 1); zzz(ctx, t, 1350, 330, '#fff'); popIn(ctx, t, a + 0.3, 860, 140, () => text(ctx, 'RIÑONES AGOTADOS', 0, 0, { size: 90, fill: '#fff' })); }
    else { sceneBlood(ctx, t, { thick: 0.8 }); for (let i = 0; i < 30; i++) { const r = rng(i + 900), x = ((r() * W + t * 60) % (W + 100)) - 50, y = 250 + r() * 600; ctx.fillStyle = '#6d4c41'; ctx.beginPath(); ctx.arc(x, y, 10 + r() * 10, 0, Math.PI * 2); ctx.fill(); } popIn(ctx, t, dese, W / 2, 130, () => text(ctx, 'DESECHOS EN LA SANGRE', 0, 0, { size: 90, fill: '#fff' })); }
  }, { counter: () => 'DÍA 2', mood: 'tense' });
}
// 27. 15-20 %: el cuerpo ya no puede más
{
  const a = PS(2, 5); fx(a + 0.4, 'impact', 0.6, 0.6);
  shot(a, (ctx, lt, d, t) => {
    sceneDesert(ctx, t, { heat: 0.7, speed: 4 }); ctx.fillStyle = `rgba(30,0,10,${0.5 * L(t, a, a + 3)})`; ctx.fillRect(0, 0, W, H);
    gauge(ctx, W / 2, 620, 300, 0.9 + Math.sin(t * 7) * 0.02, '', BAD, { value: '15-20 %' });
    popIn(ctx, t, a + 0.4, W / 2, 180, () => text(ctx, 'EL LÍMITE', 0, 0, { size: 130, fill: '#fff' }));
  }, { counter: () => 'DÍA 3', mood: 'tense' });
}
// 28. La regla de los 3
{
  const a = PS(2, 6), regla = SS(2, 6, 1), aire = WD(2, 6, 'aire'), agua = WD(2, 6, 'agua', 0), comida = WD(2, 6, 'comida'), calor = SS(2, 6, 4);
  [aire, agua, comida].forEach((s, i) => fx(s, 'pop', 0.7, 1 + i * 0.15)); fx(calor, 'impact', 0.5);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#4361ee', '#3a0ca3', 28); rays(ctx, t, W / 2, 520);
    if (t < aire) { questionMarks(ctx, t, W / 2, 520, 3, FLAT.accent); popIn(ctx, t, regla, W / 2, 200, () => text(ctx, 'LA REGLA DE LOS 3', 0, 0, { size: 120, fill: '#fff' })); }
    [['3 MIN', 'SIN AIRE', aire, c => lungs(c, 0, 0, 1.5, t)], ['3 DÍAS', 'SIN AGUA', agua, c => drop(c, 0, 10, 1, t)], ['3 SEMANAS', 'SIN COMIDA', comida, c => foodIcon(c, 'burger', 0, 0, 1.3, 0)]].forEach(([big, sm, st, f], i) => {
      popIn(ctx, t, st, 400 + i * 560, 520, () => { card(ctx, -230, -260, 460, 520, '#fff', 40); ctx.save(); ctx.translate(0, -80); f(ctx); ctx.restore(); text(ctx, big, 0, 110, { size: 80, fill: [FLAT.sky, '#0077b6', FLAT.coral][i], lw: 0, shadow: false }); text(ctx, sm, 0, 190, { size: 50, fill: FLAT.ink, lw: 0, shadow: false }); });
    });
    if (t > calor) popIn(ctx, t, calor, W / 2, 930, () => { card(ctx, -420, -60, 840, 120, BAD, 60); text(ctx, '☀ CON CALOR: MENOS DE 2 DÍAS', 0, 0, { size: 56, fill: '#fff', lw: 0, shadow: false }); });
  }, { mood: 'happy' });
}
// 29. ¿Y el chico de la celda?
{
  const a = PS(2, 7) - 0.2; fx(a + 0.3, 'whoosh', 0.6, 0.7);
  shot(a, (ctx, lt, d, t) => {
    sceneCell(ctx, t, { bars: true });
    drawPerson(ctx, 960, 1000, 1.15, e0(t, { mouth: 'sad', red: 0.5, bags: 0.8, look: [0.5, -0.5] }), PEOPLE.andreas);
    popIn(ctx, t, a + 0.3, W / 2, 140, () => text(ctx, '¿18 DÍAS?', 0, 0, { size: 140, fill: FLAT.accent }));
    retroOverlay(ctx, t);
  }, { trans: 'wipe', mood: 'mystery' });
}
// 30. Andreas Mihavecz: las gotas en la pared
{
  const a = PS(2, 8), olv = SS(2, 8, 2), lamia = SS(2, 8, 3), salv = SS(2, 8, 4), viv = SS(2, 8, 5);
  fx(olv, 'impact', 0.4, 0.7); fx(lamia, 'blip', 0.6); fx(lamia + 1, 'blip', 0.6, 1.2); fx(salv, 'sparkle', 0.7); fx(viv, 'whoosh', 0.6, 1.3); fx(viv + 0.4, 'ding', 0.6);
  shot(a, (ctx, lt, d, t) => {
    if (t < olv) { // nombre
      sceneCell(ctx, t, { bars: false });
      drawPerson(ctx, 960, 1000, 1.15, e0(t, { mouth: 'flat', look: [0, 0] }), PEOPLE.andreas);
      popIn(ctx, t, a + 0.3, W / 2, 140, () => { card(ctx, -440, -70, 880, 140, '#fff3d6', 30); text(ctx, 'ANDREAS MIHAVECZ · 18 AÑOS', 0, 0, { size: 58, fill: '#6f4518', lw: 0, shadow: false }); });
    } else if (t < lamia) { // guardias que se olvidan (oficina)
      ctx.fillStyle = '#ddbea9'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#a5a58d'; ctx.fillRect(0, 860, W, 220);
      desk(ctx, 960, 720, 900);
      [700, 1220].forEach((x, i) => drawPerson(ctx, x, 1000, 1.05, e0(t + i, { talk: talking(t + i * 2), mouth: 'grin', look: [i ? -1 : 1, 0] }), { skin: i ? '#e0ac69' : '#f1c27d', skinD: '#c68f50', shirt: '#264653', shirtD: '#1d3640', pants: '#1d3640', hair: '#2b1d14', hairStyle: i ? 'bald' : 'crew' }));
      ctx.fillStyle = '#6c757d'; ctx.fillRect(1550, 300, 160, 12); for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(1580 + i * 50, 312); ctx.rotate(Math.sin(t * 2 + i) * 0.2); ctx.fillStyle = '#ffd23f'; ctx.fillRect(-4, 0, 8, 50); ctx.beginPath(); ctx.arc(0, 60, 14, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
      popIn(ctx, t, olv + 0.3, W / 2, 150, () => text(ctx, 'SE OLVIDARON DE ÉL', 0, 0, { size: 100, fill: '#fff' }));
    } else if (t < viv) { // lame las gotas
      sceneCell(ctx, t, { bars: false });
      drawPerson(ctx, 1000, 1000, 1.2, e0(t, { mouth: 'o', mouthOpen: 0.3 + 0.2 * Math.sin(t * 6), red: 0.6, bags: 0.8, look: [1, -0.5], handR: [140, -480] }), PEOPLE.andreas);
      for (let i = 0; i < 3; i++) { const g = 0.6 + 0.4 * Math.sin(t * 5 + i); ctx.fillStyle = `rgba(160,230,255,${g})`; ctx.beginPath(); ctx.arc(1180 + i * 40, 520 + i * 30, 10, 0, Math.PI * 2); ctx.fill(); }
      if (t > salv) popIn(ctx, t, salv, W / 2, 150, () => text(ctx, '¡LE SALVARON LA VIDA!', 0, 0, { size: 96, fill: '#caf0f8' }));
    } else { // lo encuentran
      sceneCell(ctx, t, { bars: false });
      const open = ease.out(L(t, viv, viv + 0.8)); ctx.fillStyle = `rgba(255,250,220,${0.6 * open})`; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(500 * open, 0); ctx.lineTo(900 * open, H); ctx.lineTo(0, H); ctx.fill();
      drawPerson(ctx, 1100, 1000, 1.15, e0(t, { mouth: 'smile', red: 0.5, bags: 0.8, look: [-1, 0], rot: Math.sin(t * 2) * 0.03 }), PEOPLE.andreas);
      popIn(ctx, t, viv + 0.4, W / 2, 150, () => text(ctx, 'DÉBIL... ¡PERO VIVO!', 0, 0, { size: 100, fill: FLAT.accent }));
    }
    retroOverlay(ctx, t);
  }, { mood: 'mystery' });
}
// 31. Récord de supervivencia
{
  const a = PS(2, 9); fx(a + 0.4, 'sparkle', 0.7); fx(a + 0.5, 'ding', 0.6, 1.2);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#bc6c25', '#6f4518', 31); rays(ctx, t, W / 2, 520, 'rgba(255,255,255,0.08)');
    popIn(ctx, t, a + 0.4, W / 2, 520, () => { medal(ctx, 0, 0, 1.6, t); text(ctx, '18 DÍAS', 0, 330, { size: 110, fill: FLAT.accent }); });
    stars(ctx, t, W / 2, 300);
    retroOverlay(ctx, t);
  }, { mood: 'mystery' });
}
// 32. Mito de los camellos
{
  const a = PS(2, 10), joroba = WD(2, 10, 'joroba'), falso = WD(2, 10, 'falso'), grasa = WD(2, 10, 'grasa'), cien = WD(2, 10, 'cien');
  fx(falso, 'impact', 0.5); fx(falso + 0.05, 'boing', 0.6, 0.8); fx(grasa, 'pop', 0.6); fx(cien, 'ff', 0.3, 1.3, { dur: 1.8 }); fx(cien + 1.8, 'ding', 0.6);
  shot(a, (ctx, lt, d, t) => {
    sceneOasis(ctx, t);
    const drinking = t > cien;
    camel(ctx, drinking ? 950 : 650 + Math.sin(t * 0.5) * 60, 980, 1.25, t, { walk: !drinking });
    if (t > joroba && t < cien) { // rayos X de la joroba
      const k = ease.back(L(t, joroba, joroba + 0.5));
      ctx.save(); ctx.translate(drinking ? 950 : 650 + Math.sin(t * 0.5) * 60, 980); ctx.scale(1.25, 1.25);
      ctx.fillStyle = `rgba(20,20,40,${0.6 * k})`; ctx.beginPath(); ctx.ellipse(-20, -230, 85 * k, 75 * k, 0, Math.PI, 0); ctx.fill();
      if (t > grasa) { ctx.fillStyle = '#ffe066'; ctx.beginPath(); ctx.ellipse(-20, -235, 60, 50, 0, Math.PI, 0); ctx.fill(); }
      ctx.restore();
      if (t > falso && t < grasa) popIn(ctx, t, falso, 1450, 300, () => text(ctx, '¿AGUA? ¡FALSO!', 0, 0, { size: 96, fill: BAD }));
      if (t > grasa) popIn(ctx, t, grasa, 1450, 300, () => { card(ctx, -230, -70, 460, 140, '#ffe066', 70); text(ctx, 'ES GRASA', 0, 0, { size: 80, fill: FLAT.ink, lw: 0, shadow: false }); });
    }
    if (drinking) { const lit = Math.round(100 * ease.out(L(t, cien, cien + 1.8))); popIn(ctx, t, cien, 1450, 300, () => { text(ctx, `${lit}+ LITROS`, 0, 0, { size: 110, fill: '#fff' }); text(ctx, 'EN MINUTOS', 0, 100, { size: 64, fill: '#caf0f8' }); }); for (let i = 0; i < 4; i++) { const p = (t * 1.5 + i / 4) % 1; ctx.fillStyle = '#4cc9f0'; ctx.globalAlpha = 1 - p; ctx.beginPath(); ctx.arc(1260 - p * 40, 920 - p * 100, 10, 0, Math.PI * 2); ctx.fill(); } ctx.globalAlpha = 1; }
    if (t < joroba) popIn(ctx, t, a + 0.3, W / 2, 150, () => text(ctx, '¿Y LOS CAMELLOS?', 0, 0, { size: 110, fill: '#fff' }));
  }, { trans: 'wipe', mood: 'happy' });
}

// ======================= PARTE 4 =======================
// 33. Perdido en el mar
{
  const a = PS(3, 0) - 0.3, q = SS(3, 0, 1);
  fx(a + 0.3, 'whoosh', 0.6, 0.7); fx(q, 'pop', 0.6);
  shot(a, (ctx, lt, d, t) => {
    sceneSea(ctx, t);
    leo(ctx, 960, 840 + Math.sin(t * 1.5) * 15, 1.0, e0(t, { mouth: 'flat', red: 0.4, look: [Math.sin(t * 0.8), 0.6], noShadow: true }));
    raft(ctx, 960, 860, t);
    if (t > q) popIn(ctx, t, q, 1450, 300, () => { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(0, 0, 200, 140, 0, 0, Math.PI * 2); ctx.fill(); for (const [x, y, r] of [[-190, 150, 22], [-250, 200, 12]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); } waterGlass(ctx, 0, 20, 0.9, t, 0.7, '#0096c7'); text(ctx, '?', 110, -60, { size: 90, fill: FLAT.coral }); });
  }, { trans: 'wipe' });
}
// 34. ¡No! La sal deshidrata más
{
  const a = PS(3, 1), sal = SS(3, 1, 1), mas = SS(3, 1, 2);
  fx(a + 0.1, 'impact', 0.7); fx(a + 0.15, 'boing', 0.8, 0.6); fx(sal + 1, 'pop', 0.5); fx(mas, 'ff', 0.3, 1.4, { dur: 1 });
  shot(a, (ctx, lt, d, t) => {
    if (t < sal) { bgFlat(ctx, t, '#d62828', '#6a040f', 34); rays(ctx, t, W / 2, H / 2); popIn(ctx, t, a + 0.1, W / 2, H / 2, () => text(ctx, '¡NO!', 0, 0, { size: 380, fill: '#fff' })); return; }
    bgFlat(ctx, t, '#0077b6', '#03045e', 35);
    kidney(ctx, 760, 600, 1.7, t, 0.6); kidney(ctx, 1160, 600, 1.7, t + 1, 0.6);
    for (let i = 0; i < 26; i++) { const r = rng(i + 77), p = (t * (0.3 + r() * 0.3) + r()) % 1; ctx.save(); ctx.translate(200 + r() * 1500, -50 + p * 1150); ctx.rotate(t + i); ctx.fillStyle = '#fff'; ctx.fillRect(-12, -12, 24, 24); ctx.restore(); }
    popIn(ctx, t, sal, W / 2, 140, () => text(ctx, 'DEMASIADA SAL', 0, 0, { size: 110, fill: '#fff' }));
    if (t > mas) popIn(ctx, t, mas, W / 2, 920, () => { card(ctx, -460, -60, 920, 120, BAD, 60); text(ctx, '¡TE DESHIDRATA MÁS RÁPIDO!', 0, 0, { size: 56, fill: '#fff', lw: 0, shadow: false }); });
  });
}
// 35. Tres reglas de supervivencia
{
  const a = PS(3, 2), r1 = SS(3, 2, 2), r2 = SS(3, 2, 3), r3 = SS(3, 2, 4);
  [r1, r2, r3].forEach((s, i) => fx(s, 'ding', 0.6, 1 + i * 0.15));
  shot(a, (ctx, lt, d, t) => {
    if (t < r1) { bgFlat(ctx, t, '#2a9d8f', '#264653', 36); rays(ctx, t, W / 2, 520); popIn(ctx, t, a + 0.3, W / 2, 470, () => { text(ctx, '3 REGLAS DE', 0, -80, { size: 110, fill: '#fff' }); text(ctx, 'SUPERVIVENCIA', 0, 70, { size: 140, fill: FLAT.accent }); }); return; }
    const rule = t < r2 ? 1 : t < r3 ? 2 : 3;
    if (rule === 1) { sceneDesert(ctx, t, { heat: 1 }); cactus(ctx, 1150, 1000, 1.6, t); ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.ellipse(1050, 1010, 320, 50, 0, 0, Math.PI * 2); ctx.fill(); leo(ctx, 980, 1010, 1.05, e0(t, { mouth: 'smile', red: 0.3 })); }
    else if (rule === 2) { sceneDesert(ctx, t, { heat: 0.2, speed: 20, sunX: 300, sunY: 160 }); ctx.fillStyle = 'rgba(10,20,80,0.6)'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#fff6d6'; ctx.beginPath(); ctx.arc(300, 160, 70, 0, Math.PI * 2); ctx.fill(); for (let i = 0; i < 40; i++) { const r = rng(i + 3); ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i)); ctx.fillStyle = '#fff'; ctx.fillRect(r() * W, r() * 500, 3, 3); } ctx.globalAlpha = 1; leo(ctx, 960, 1000, 1.05, e0(t, { walk: true, mouth: 'smile' })); }
    else { bgFlat(ctx, t, '#e9c46a', '#f4a261', 37); leo(ctx, 640, 1000, 1.1, e0(t, { mouth: 'flat', handR: [150, -330] })); popIn(ctx, t, r3, 1300, 560, () => { foodIcon(ctx, 'burger', 0, 0, 2, 0); ctx.strokeStyle = '#ef233c'; ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-170, -150); ctx.lineTo(170, 150); ctx.moveTo(170, -150); ctx.lineTo(-170, 150); ctx.stroke(); }); }
    const names = ['', 'BUSCA SOMBRA', 'MUÉVETE DE NOCHE', 'COME POCO'];
    popIn(ctx, t, [0, r1, r2, r3][rule], W / 2, 140, () => { ctx.font = '96px Lilita'; const tw = ctx.measureText(names[rule]).width, cx0 = -(tw + 150) / 2; ctx.fillStyle = FLAT.accent; ctx.beginPath(); ctx.arc(cx0 + 60, 0, 60, 0, Math.PI * 2); ctx.fill(); text(ctx, String(rule), cx0 + 60, 4, { size: 80, fill: FLAT.ink, lw: 0, shadow: false }); text(ctx, names[rule], cx0 + 150, 0, { size: 96, fill: '#fff', align: 'left' }); });
  });
}
// 36. Hervir el agua de río
{
  const a = PS(3, 3), bact = SS(3, 3, 1), diar = SS(3, 3, 2);
  fx(a + 0.4, 'ff', 0.25, 0.6, { dur: 2 }); fx(bact, 'pop', 0.5); fx(diar, 'boing', 0.6, 0.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#2d6a4f', '#1b4332', 38, false);
    ctx.fillStyle = '#4cc9f0'; ctx.beginPath(); ctx.moveTo(0, 820); for (let x = 0; x <= W; x += 30) ctx.lineTo(x, 820 + Math.sin(x * 0.01 + t * 2) * 15); ctx.lineTo(W, 900); ctx.lineTo(0, 900); ctx.fill();
    ctx.fillStyle = '#40916c'; ctx.fillRect(0, 900, W, 180);
    campfire(ctx, 1150, 900, t); pot(ctx, 1150, 720, t);
    leo(ctx, 640, 1000, 1.1, e0(t, { mouth: t > diar ? 'o' : 'smile', mouthOpen: 0.3, look: [1, 0.3] }));
    if (t > bact) for (let i = 0; i < 5; i++) { const ang = t * 2 + i * 1.25; bacterium(ctx, 1150 + Math.cos(ang) * 260, 520 + Math.sin(ang) * 80, 0.6, t + i, false, t > bact + 1.5); }
    popIn(ctx, t, a + 0.3, W / 2, 130, () => text(ctx, '¡HIÉRVELA!', 0, 0, { size: 120, fill: '#fff' }));
  });
}

// ======================= PARTE 5 =======================
// 37. Giro: demasiada agua también es peligroso
{
  const a = PS(4, 0) - 0.2, dem = WD(4, 0, 'demasiada');
  fx(dem, 'impact', 0.6); fx(dem + 0.05, 'boing', 0.8, 0.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#ff006e', '#8338ec', 40); rays(ctx, t, W / 2, H / 2);
    const lvl = ease.inOut(L(t, dem, dem + 2.5));
    leo(ctx, 760, 1000, 1.2, e0(t, { mouth: 'o', mouthOpen: 0.7, eyeSize: 1.2, shock: t > dem ? 0.7 : 0, handR: [100, -470] }));
    ctx.fillStyle = 'rgba(76,201,240,0.6)'; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, H - lvl * 600 + Math.sin(x * 0.01 + t * 4) * 20); ctx.lineTo(W, H); ctx.fill();
    popIn(ctx, t, a + 0.3, 1400, 380, () => { text(ctx, '¿DEMASIADA', 0, -80, { size: 110, fill: '#fff' }); text(ctx, 'AGUA?', 0, 70, { size: 170, fill: '#caf0f8' }); });
  }, { trans: 'flash' });
}
// 38. Células como globos; intoxicación por agua; retos
{
  const a = PS(4, 1), globos = WD(4, 1, 'globos'), cerebro = WD(4, 1, 'cerebro'), nombre = SS(4, 1, 3);
  fx(globos, 'boing', 0.6, 1.5); fx(cerebro, 'pop', 0.6); fx(nombre, 'impact', 0.4);
  shot(a, (ctx, lt, d, t) => {
    if (t < nombre) {
      bgFlat(ctx, t, '#4361ee', '#3a0ca3', 41);
      const swell = 1 + 0.5 * ease.inOut(L(t, globos - 0.5, globos + 1.5));
      for (let i = 0; i < 6; i++) { const x = 340 + (i % 3) * 620, y = 400 + Math.floor(i / 3) * 360; ctx.fillStyle = [FLAT.pink, FLAT.mint, FLAT.accent][i % 3]; ctx.beginPath(); ctx.ellipse(x, y + Math.sin(t * 2 + i) * 10, 100 * swell, 90 * swell, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.arc(x - 30 * swell, y - 30 * swell, 20 * swell, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y + 90 * swell); ctx.quadraticCurveTo(x + 20, y + 150 * swell, x, y + 200 * swell); ctx.stroke(); }
      if (t > cerebro) popIn(ctx, t, cerebro, W / 2, 540, () => { brain(ctx, 0, 0, 0.7 * swell, t, { worried: true }); });
      popIn(ctx, t, a + 0.3, W / 2, 110, () => text(ctx, t > globos ? 'CÉLULAS COMO GLOBOS' : 'LA SAL SE DILUYE', 0, 0, { size: 92, fill: '#fff' }));
    } else {
      bgFlat(ctx, t, '#2b2d42', '#14152a', 42); rays(ctx, t, W / 2, 300, 'rgba(255,255,255,0.05)');
      card(ctx, 360, 160, 1200, 150, BAD, 30); text(ctx, 'RETO: ¿QUIÉN TOMA MÁS?', W / 2, 235, { size: 70, fill: '#fff', lw: 0, shadow: false });
      for (let i = 0; i < 3; i++) waterGlass(ctx, 560 + i * 400, 640, 1.3, t + i, 0.5 + 0.4 * Math.sin(t * 2 + i));
      popIn(ctx, t, nombre + 0.6, W / 2, 900, () => { card(ctx, -440, -60, 880, 120, FLAT.accent, 60); text(ctx, 'INTOXICACIÓN POR AGUA', 0, 0, { size: 60, fill: FLAT.ink, lw: 0, shadow: false }); });
    }
  }, { mood: 'tense' });
}
// 39. ¿Cuánta agua? 2 L / 2.5 L contando la comida
{
  const a = PS(4, 2), muj = WD(4, 2, 'mujeres'), hom = WD(4, 2, 'hombres'), comida = SS(4, 2, 2), fruta = SS(4, 2, 3);
  fx(muj, 'pop', 0.6); fx(hom, 'pop', 0.6, 1.2); fx(comida, 'ding', 0.6); [0, 1, 2].forEach(i => fx(fruta + i * 0.5, 'pop', 0.5, 1 + i * 0.2));
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#06d6a0', '#118ab2', 43); rays(ctx, t, W / 2, 500);
    if (t < fruta) {
      if (t > muj) popIn(ctx, t, muj, 560, 560, () => { drawPerson(ctx, -90, 330, 0.75, e0(t, { mouth: 'smile', talk: talking(t) }), PEOPLE.adulto); waterGlass(ctx, 130, 160, 1.2, t, 0.8); text(ctx, '2 L', 120, -260, { size: 120, fill: '#fff' }); });
      if (t > hom) popIn(ctx, t, hom, 1360, 560, () => { drawPerson(ctx, -90, 330, 0.75, e0(t + 1, { mouth: 'smile', talk: talking(t + 1) }), PEOPLE.medico); waterGlass(ctx, 130, 160, 1.2, t, 0.95); text(ctx, '2,5 L', 120, -260, { size: 120, fill: '#fff' }); });
      if (t < muj) popIn(ctx, t, a + 0.3, W / 2, H / 2, () => text(ctx, '¿CUÁNTA AGUA?', 0, 0, { size: 130, fill: '#fff' }));
      if (t > comida) popIn(ctx, t, comida, W / 2, 140, () => { card(ctx, -460, -60, 920, 120, FLAT.accent, 60); text(ctx, '¡CONTANDO LA COMIDA!', 0, 0, { size: 64, fill: FLAT.ink, lw: 0, shadow: false }); });
    } else {
      [['FRUTA', c => watermelon(c, 0, 0, 1.3, t)], ['SOPA', c => soup(c, 0, 0, 1.3, t)], ['PAN', c => bread(c, 0, 0, 1.3)]].forEach(([n, f], i) => popIn(ctx, t, fruta + i * 0.5, 400 + i * 560, 520, () => { card(ctx, -220, -240, 440, 480, '#fff', 40); ctx.save(); ctx.translate(0, -50); f(ctx); ctx.restore(); drop(ctx, 140, -170, 0.35, t + i); text(ctx, n, 0, 170, { size: 70, fill: '#118ab2', lw: 0, shadow: false }); }));
    }
  }, { mood: 'happy' });
}
// 40. El truco: toma agua seguido y mira el color
{
  const a = PS(4, 3), color = SS(4, 3, 1);
  fx(color + 1, 'ding', 0.6, 1.3); fx(color + 1.05, 'sparkle', 0.5);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#caf0f8', '#90e0ef', 44);
    const sip = Math.max(0, Math.sin(t * 2)) ** 4;
    leo(ctx, 520, 1000, 1.15, e0(t, { mouth: sip > 0.3 ? 'o' : 'grin', mouthOpen: 0.3, handR: [lerp(110, 30, sip), lerp(-300, -440, sip)] }));
    waterGlass(ctx, 520 + lerp(140, 40, sip) * 1.15, 1000 + lerp(-330, -480, sip) * 1.15, 0.8, t, 0.7);
    const cols = ['#fff9c4', '#ffe066', '#e9b44c', '#a0632a'];
    if (t > color) cols.forEach((c, i) => popIn(ctx, t, color + i * 0.25, 1050 + i * 230, 560, () => { waterGlass(ctx, 0, 0, 1.1, t + i, 0.75, c); if (i <= 1 && t > color + 1) { ctx.fillStyle = OK_; ctx.beginPath(); ctx.arc(0, -190, 40, 0, Math.PI * 2); ctx.fill(); text(ctx, '✓', 0, -186, { size: 54, fill: '#fff', lw: 0, shadow: false }); } }));
    popIn(ctx, t, a + 0.3, 1400, 160, () => text(ctx, 'EL TRUCO', 0, 0, { size: 110, fill: '#0077b6' }));
  });
}
// 41. Señales de alerta
{
  const a = PS(4, 4), m = WD(4, 4, 'mareo'), c = WD(4, 4, 'confusion'), l = WD(4, 4, 'latidos'), o = WD(4, 4, 'orinado'), ayuda = SS(4, 4, 2);
  [m, c, l, o].forEach((s, i) => fx(s, 'pop', 0.6, 1 + i * 0.1)); fx(ayuda, 'ding', 0.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#e63946', '#9d0208', 45);
    [['MAREO FUERTE', m], ['CONFUSIÓN', c], ['LATIDOS MUY RÁPIDOS', l], ['NO ORINAR EN HORAS', o]].forEach(([n, st], i) => popIn(ctx, t, st, 560, 280 + i * 170, () => { ctx.rotate(Math.sin(t * 3 + i) * 0.015); card(ctx, -400, -65, 800, 130, '#fff', 30); ctx.fillStyle = FLAT.accent; ctx.beginPath(); ctx.moveTo(-340, -40); ctx.lineTo(-300, 40); ctx.lineTo(-380, 40); ctx.fill(); text(ctx, '!', -340, 14, { size: 50, fill: FLAT.ink, lw: 0, shadow: false }); text(ctx, n, 40, 0, { size: 56, fill: '#9d0208', lw: 0, shadow: false }); }));
    popIn(ctx, t, a + 0.3, 560, 120, () => text(ctx, 'SEÑALES DE ALERTA', 0, 0, { size: 84, fill: '#fff' }));
    if (t > ayuda) drawPerson(ctx, 1450, 1000, 1.15, e0(t, { mouth: 'smile', talk: talking(t), handR: [140, -420] }), PEOPLE.medico);
  });
}
// 42. Bebés y adultos mayores
{
  const a = PS(4, 5), bebes = SS(4, 5, 2), mayores = SS(4, 5, 3);
  fx(SS(4, 5, 1), 'pop', 0.6); fx(SS(4, 5, 1) + 0.6, 'pop', 0.6, 1.2);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#ffafcc', '#cdb4db', 46);
    popIn(ctx, t, SS(4, 5, 1), 600, 600, () => { baby(ctx, 0, 0, 1.3, t, t > bebes && t < mayores); text(ctx, 'BEBÉS', 0, 330, { size: 80, fill: '#fff' }); });
    popIn(ctx, t, SS(4, 5, 1) + 0.6, 1320, 0, () => { drawPerson(ctx, 0, 1000, 1.1, e0(t, { mouth: 'smile', talk: t > mayores ? talking(t) : 0, look: [-0.5, 0] }), PEOPLE.abuela); text(ctx, 'ADULTOS MAYORES', 0, 300, { size: 64, fill: '#fff' }); });
    if (t > mayores) popIn(ctx, t, mayores + 0.5, 1650, 380, () => { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(0, 0, 150, 90, 0, 0, Math.PI * 2); ctx.fill(); text(ctx, 'sed ↓', 0, 0, { size: 60, fill: '#9d4edd', lw: 0, shadow: false }); });
    popIn(ctx, t, a + 0.3, W / 2, 110, () => text(ctx, 'NO TODOS AGUANTAN IGUAL', 0, 0, { size: 84, fill: '#fff' }));
  });
}
// 43. ¿Café y refrescos cuentan?
{
  const a = PS(4, 6), cafe = SS(4, 6, 1), refres = SS(4, 6, 2), camp = SS(4, 6, 3);
  fx(cafe, 'pop', 0.6); fx(refres, 'boing', 0.5, 0.8); fx(camp, 'sparkle', 0.7); fx(camp + 0.1, 'ding', 0.6, 1.3);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#ffd166', '#ef476f', 47); rays(ctx, t, W / 2, 560);
    const items = [['CAFÉ / TÉ', cafe, c => drawCoffee(c, 0, 40, t, 1.8), OK_], ['REFRESCO', refres, c => soda(c, 0, 0, 1.4, t), BAD], ['AGUA', camp, c => waterGlass(c, 0, 0, 1.6, t, 0.85), FLAT.accent]];
    items.forEach(([n, st, f, col], i) => popIn(ctx, t, st, 400 + i * 560, 540, () => { card(ctx, -220, -260, 440, 520, '#fff', 40); ctx.save(); ctx.translate(0, -40); f(ctx); ctx.restore(); text(ctx, n, 0, 190, { size: 60, fill: FLAT.ink, lw: 0, shadow: false }); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(170, -220, 44, 0, Math.PI * 2); ctx.fill(); text(ctx, i === 1 ? '✗' : i === 2 ? '★' : '✓', 170, -216, { size: 54, fill: '#fff', lw: 0, shadow: false }); }));
    if (t > camp) { popIn(ctx, t, camp + 0.3, 1520, 200, () => { trophy(ctx, 0, 0, 1, t); }); text(ctx, '¡LA CAMPEONA!', 1520, 330, { size: 60, fill: '#fff' }); }
    if (t < cafe) popIn(ctx, t, a + 0.2, W / 2, H / 2, () => text(ctx, '¿CUENTAN?', 0, 0, { size: 160, fill: '#fff' }));
  });
}
// 44. Tu cuerpo es una máquina increíble
{
  const a = PS(4, 7), apaga = SS(4, 7, 1);
  fx(a + 0.4, 'sparkle', 0.6); fx(apaga, 'whoosh', 0.5, 0.5);
  shot(a, (ctx, lt, d, t) => {
    const dim = L(t, apaga, apaga + 2) * 0.6;
    bgFlat(ctx, t, '#4cc9f0', '#4361ee', 48);
    for (let i = 0; i < 3; i++) gear(ctx, 1350 + (i % 2) * 180, 360 + i * 200, 90 - i * 15, t * (i % 2 ? -1 : 1) * (1 - dim * 1.4));
    leo(ctx, 640, 1000, 1.2, e0(t, { mouth: 'grin', hold: dim > 0.1 ? null : null, handR: [110, -440] }));
    waterGlass(ctx, 640 + 130, 1000 - 520, 0.8, t, 0.7);
    if (dim > 0) { ctx.fillStyle = `rgba(0,0,20,${dim})`; ctx.fillRect(0, 0, W, H); }
    popIn(ctx, t, a + 0.3, W / 2, 120, () => text(ctx, 'UNA MÁQUINA INCREÍBLE', 0, 0, { size: 90, fill: '#fff' }));
  });
}
// 45. Pregunta para comentarios
{
  const a = PS(4, 8); fx(a + 0.4, 'pop', 0.7); for (let i = 0; i < 10; i++) fx(a + 1 + i * 0.18, 'tick', 0.25, 1.3);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#00b4d8', '#0077b6', 49); rays(ctx, t, W / 2, H / 2);
    leo(ctx, 420, 1000, 1.15, e0(t, { handR: [150, -420], mouth: 'grin', talk: talking(t) }));
    popIn(ctx, t, a + 0.4, 1200, 450, () => {
      card(ctx, -560, -200, 1120, 400, '#fff', 40);
      ctx.fillStyle = FLAT.coral; ctx.beginPath(); ctx.arc(-450, -100, 50, 0, Math.PI * 2); ctx.fill();
      const msg = '¿Cuánto has aguantado sin agua?'; const n = Math.floor(L(t, a + 1, a + 2.8) * msg.length);
      ctx.font = '54px Lilita'; ctx.fillStyle = FLAT.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(msg.slice(0, n) + (Math.sin(t * 10) > 0 ? '|' : ''), -370, -100);
      ctx.fillStyle = '#e9ecef'; rrect(ctx, -480, 30, 960, 110, 30); ctx.fill();
      text(ctx, '👍  💬  COMENTA', 0, 85, { size: 52, fill: FLAT.ink, lw: 0, shadow: false });
    });
  });
}
// 46. Próximo video: dejar de comer
{
  const a = PS(4, 9), sorp = SS(4, 9, 1);
  fx(a + 0.3, 'dizzy', 0.4, 0.5); fx(sorp, 'sparkle', 0.6); fx(SS(4, 9, 2), 'boing', 0.6, 1.2);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#f77f00', '#d62828', 50); rays(ctx, t, 1300, 520);
    leo(ctx, 600, 1000, 1.15, e0(t, { mouth: 'o', mouthOpen: 0.5, red: 0.2, look: [1, 0.5], handL: [-40, -300] }));
    for (let i = 0; i < 3; i++) { ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(600, 760, 90 + i * 30 + Math.sin(t * 10) * 6, -0.5, 0.5); ctx.stroke(); }
    plate(ctx, 1300, 620, 1.4, t);
    popIn(ctx, t, SS(4, 9, 2), 1300, 920, () => { card(ctx, -380, -70, 760, 140, '#fff', 70); text(ctx, '¿SIN COMER?', 0, 0, { size: 80, fill: '#d62828', lw: 0, shadow: false }); });
  });
}
// 47. Pantalla final: Leo en la cocina con su vaso de agua
{
  const a = V.VOICE_END + 0.2; fx(a + 0.6, 'sparkle', 0.5); fx(SCENE.duration - 0.9, 'whoosh', 0.4, 0.7);
  shot(a, (ctx, lt, d, t) => {
    sceneKitchen(ctx, t, { drip: true, heat: 0 });
    const sip = Math.max(0, Math.sin(t * 1.5)) ** 4;
    leo(ctx, 960, 1000, 1.1, e0(t, { mouth: sip > 0.3 ? 'o' : 'grin', mouthOpen: 0.3, handR: [lerp(110, 30, sip), lerp(-300, -440, sip)] }));
    waterGlass(ctx, 960 + lerp(140, 40, sip) * 1.1, 1000 + lerp(-330, -480, sip) * 1.1, 0.8, t, 0.7);
    ctx.fillStyle = 'rgba(10,6,30,0.5)'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,255,255,0.12)'; rrect(ctx, 120, 230, 760, 428, 24); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 6; ctx.setLineDash([24, 16]); rrect(ctx, 120, 230, 760, 428, 24); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'SIGUIENTE VIDEO', 500, 444, { size: 64, fill: '#fff' });
    ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.beginPath(); ctx.arc(1500, 330, 150, 0, Math.PI * 2); ctx.fill();
    text(ctx, '¡SUSCRÍBETE!', 1500, 540, { size: 70, fill: FLAT.accent });
    const fade = L(t, SCENE.duration - 1, SCENE.duration - 0.1); if (fade > 0) { ctx.fillStyle = `rgba(0,0,0,${fade})`; ctx.fillRect(0, 0, W, H); }
  }, { quiet: true, mood: 'happy' });
}

// ======================= ELEMENTOS PROPIOS DEL VIDEO =======================
function sceneStreet(ctx, t, heat = 0) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, mix('#8ecae6', '#ffb703', heat)); g.addColorStop(1, mix('#caf0f8', '#ffd6a5', heat)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(1650, 160, 70 + Math.sin(t * 2) * 4, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 9; i++) { const x = ((i * 260 - t * 90) % 2340 + 2340) % 2340 - 210; const h = 360 + (i % 3) * 110; ctx.fillStyle = ['#ffb4a2', '#cdb4db', '#b5e48c', '#a2d2ff'][i % 4]; ctx.fillRect(x, 860 - h, 220, h); ctx.fillStyle = 'rgba(255,255,255,0.55)'; for (let r = 0; r < h / 90 - 1; r++) for (let c = 0; c < 3; c++) ctx.fillRect(x + 25 + c * 65, 860 - h + 30 + r * 90, 40, 50); }
  ctx.fillStyle = '#adb5bd'; ctx.fillRect(0, 860, W, 60); ctx.fillStyle = '#6c757d'; ctx.fillRect(0, 920, W, 160);
  ctx.fillStyle = '#f8f9fa'; for (let i = 0; i < 12; i++) ctx.fillRect(((i * 220 - t * 300) % 2640 + 2640) % 2640 - 220, 1000, 110, 12);
}
function bottleBody(ctx, x, y, s, t, fill, legs) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (legs) { const w = Math.sin(t * 8); ctx.strokeStyle = '#1f2a44'; ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-50, -120); ctx.lineTo(-50 + w * 30, 0); ctx.moveTo(50, -120); ctx.lineTo(50 - w * 30, 0); ctx.stroke(); }
  const path = () => { ctx.beginPath(); ctx.moveTo(-60, -720); ctx.lineTo(60, -720); ctx.lineTo(60, -640); ctx.quadraticCurveTo(170, -600, 170, -480); ctx.lineTo(170, -170); ctx.quadraticCurveTo(170, -110, 110, -110); ctx.lineTo(-110, -110); ctx.quadraticCurveTo(-170, -110, -170, -170); ctx.lineTo(-170, -480); ctx.quadraticCurveTo(-170, -600, -60, -640); ctx.closePath(); };
  path(); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fill();
  ctx.save(); path(); ctx.clip(); const top = -110 - 610 * fill; ctx.fillStyle = '#4cc9f0'; ctx.beginPath(); ctx.moveTo(-200, top); for (let xx = -200; xx <= 200; xx += 10) ctx.lineTo(xx, top + Math.sin(xx * 0.05 + t * 4) * 10); ctx.lineTo(200, 0); ctx.lineTo(-200, 0); ctx.fill();
  for (let i = 0; i < 6; i++) { const p = (t * 0.5 + i / 6) % 1; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.beginPath(); ctx.arc(-80 + i * 32, -120 - p * 600 * fill, 8, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
  ctx.fillStyle = FLAT.coral; rrect(ctx, -70, -770, 140, 60, 16); ctx.fill();
  // carita de Leo en la botella
  ctx.fillStyle = FLAT.ink; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 45, -430, 12, 16, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.strokeStyle = FLAT.ink; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, -390, 34, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  ctx.fillStyle = '#1b1b1b'; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(-50 + i * 20, -720 - (i % 2) * 10, 18, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}
function waterGlass(ctx, x, y, s, t, fill, color = '#4cc9f0') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const path = () => { ctx.beginPath(); ctx.moveTo(-70, -110); ctx.lineTo(70, -110); ctx.lineTo(55, 110); ctx.lineTo(-55, 110); ctx.closePath(); };
  path(); ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fill();
  ctx.save(); path(); ctx.clip(); const top = 110 - 220 * clamp(fill); ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(-80, top); for (let xx = -80; xx <= 80; xx += 8) ctx.lineTo(xx, top + Math.sin(xx * 0.08 + t * 4) * 5); ctx.lineTo(80, 120); ctx.lineTo(-80, 120); ctx.fill(); ctx.restore();
  ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(-50, -90, 10, 150);
  ctx.restore();
}
function bone(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-0.5); ctx.fillStyle = '#f8f9fa'; ctx.fillRect(-70, -16, 140, 32); for (const sx of [-1, 1]) for (const sy of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 75, sy * 18, 24, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
function toilet(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#fff'; rrect(ctx, -60, -150, 120, 110, 16); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, -10, 110, 45, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(-90, 0); ctx.lineTo(90, 0); ctx.lineTo(50, 120); ctx.lineTo(-50, 120); ctx.fill(); ctx.fillStyle = '#4cc9f0'; ctx.beginPath(); ctx.ellipse(0, -10, 75, 25, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#adb5bd'; ctx.fillRect(30, -130, 30, 10); ctx.restore(); }
function acUnit(ctx, x, y, t) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#f8f9fa'; rrect(ctx, -260, -90, 520, 180, 30); ctx.fill(); ctx.fillStyle = '#ced4da'; for (let i = 0; i < 6; i++) ctx.fillRect(-220, -40 + i * 16, 440, 6); ctx.fillStyle = OK_; ctx.beginPath(); ctx.arc(200, -50, 12, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 6; i++) { const p = (t * 0.8 + i / 6) % 1; ctx.strokeStyle = `rgba(144,224,239,${1 - p})`; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-200 + i * 80, 110 + p * 250); ctx.quadraticCurveTo(-180 + i * 80 + 30, 150 + p * 250, -200 + i * 80, 190 + p * 250); ctx.stroke(); } ctx.restore(); }
function tank(ctx, x, y, s, t, lvl) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); card(ctx, -160, -260, 320, 520, 'rgba(255,255,255,0.25)', 40, false); ctx.save(); rrect(ctx, -150, -250, 300, 500, 34); ctx.clip(); const top = 250 - 500 * lvl; ctx.fillStyle = '#4cc9f0'; ctx.beginPath(); ctx.moveTo(-160, top); for (let xx = -160; xx <= 160; xx += 10) ctx.lineTo(xx, top + Math.sin(xx * 0.05 + t * 4) * 10); ctx.lineTo(160, 260); ctx.lineTo(-160, 260); ctx.fill(); ctx.restore(); text(ctx, `${Math.round(lvl * 100)}%`, 0, 0, { size: 90, fill: '#fff' });
  const p = (t * 1.2) % 1; ctx.fillStyle = '#4cc9f0'; ctx.globalAlpha = 1 - p; ctx.beginPath(); ctx.arc(0, 280 + p * 120, 14, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; ctx.restore(); }
function battery(ctx, x, y, s, v) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#495057'; rrect(ctx, -90, -45, 180, 90, 16); ctx.fill(); ctx.fillRect(90, -18, 16, 36); ctx.fillStyle = v < 0.25 ? '#ef233c' : OK_; rrect(ctx, -80, -35, 160 * clamp(v), 70, 10); ctx.fill(); ctx.restore(); }
function bacterium(ctx, x, y, s, t, party, dead) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 3) * 0.2);
  ctx.fillStyle = dead ? '#adb5bd' : '#80b918'; rrect(ctx, -60, -40, 120, 80, 40); ctx.fill();
  ctx.strokeStyle = dead ? '#adb5bd' : '#80b918'; ctx.lineWidth = 6; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-40 + i * 27, 38); ctx.quadraticCurveTo(-30 + i * 27 + Math.sin(t * 8 + i) * 10, 60, -40 + i * 27, 80); ctx.stroke(); }
  ctx.fillStyle = FLAT.ink; if (dead) { ctx.strokeStyle = FLAT.ink; ctx.lineWidth = 5; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 22 - 8, -16); ctx.lineTo(sx * 22 + 8, 0); ctx.moveTo(sx * 22 + 8, -16); ctx.lineTo(sx * 22 - 8, 0); ctx.stroke(); } }
  else { for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 22, -8, 8, 0, Math.PI * 2); ctx.fill(); } ctx.beginPath(); ctx.arc(0, 10, 14, 0, Math.PI); ctx.fill(); }
  if (party) { ctx.fillStyle = [FLAT.coral, FLAT.accent, FLAT.purple][Math.floor(x) % 3]; ctx.beginPath(); ctx.moveTo(-20, -38); ctx.lineTo(20, -38); ctx.lineTo(0, -100); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, -100, 8, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}
function envelope(ctx, x, y, t) { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 6) * 0.1); ctx.fillStyle = '#fff'; rrect(ctx, -70, -45, 140, 90, 10); ctx.fill(); ctx.strokeStyle = '#adb5bd'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-70, -45); ctx.lineTo(0, 10); ctx.lineTo(70, -45); ctx.stroke(); ctx.fillStyle = BAD; ctx.beginPath(); ctx.arc(0, 10, 12, 0, Math.PI * 2); ctx.fill();
  for (const sx of [-1, 1]) { ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.ellipse(sx * 60, -60 + Math.sin(t * 20) * 8, 40, 14, sx * 0.5, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
function kidney(ctx, x, y, s, t, tired = 0, sign = false) {
  ctx.save(); ctx.translate(x, y + Math.sin(t * 2) * 6); ctx.scale(s, s);
  ctx.fillStyle = mix('#e5383b', '#a4161a', tired); ctx.beginPath(); ctx.moveTo(0, -110); ctx.bezierCurveTo(110, -120, 120, 120, 0, 110); ctx.bezierCurveTo(-60, 105, -70, 40, -25, 20); ctx.bezierCurveTo(-5, 5, -5, -15, -25, -30); ctx.bezierCurveTo(-70, -60, -60, -105, 0, -110); ctx.fill();
  ctx.fillStyle = FLAT.ink; for (const sx of [10, 50]) { if (tired > 0.5) { ctx.fillRect(sx - 10, -22, 20, 5); } else { ctx.beginPath(); ctx.arc(sx, -20, 8, 0, Math.PI * 2); ctx.fill(); } }
  ctx.strokeStyle = FLAT.ink; ctx.lineWidth = 5; ctx.beginPath(); if (tired > 0.5) ctx.arc(30, 25, 14, 1.15 * Math.PI, 1.85 * Math.PI); else ctx.arc(30, 5, 14, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  if (tired > 0.5) { ctx.fillStyle = '#7fd4ff'; const p = (t * 1.2) % 1; ctx.globalAlpha = 1 - p; ctx.beginPath(); ctx.ellipse(80, -40 + p * 60, 8, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
  if (sign) { ctx.fillStyle = '#fff'; rrect(ctx, -60, 120, 150, 50, 10); ctx.fill(); text(ctx, 'CERRADO', 15, 145, { size: 28, fill: '#ef233c', lw: 0, shadow: false }); }
  ctx.restore();
}
function handPinch(ctx, x, y, t, st) {
  const p = clamp((t - st) / 2.5), tent = p < 0.4 ? p / 0.4 : Math.max(0, 1 - (p - 0.4) / 0.6 * 0.5);
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#2f6fde'; rrect(ctx, -900, -70, 420, 240, 40); ctx.fill();
  ctx.fillStyle = '#a86b3c'; rrect(ctx, -500, -60, 820, 220, 110); ctx.fill();
  for (let i = 0; i < 4; i++) { ctx.fillStyle = i % 2 ? '#a86b3c' : '#9a6236'; rrect(ctx, 250, -50 + i * 52, 280 - Math.abs(i - 1.5) * 40, 50, 25); ctx.fill(); }
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; for (let i = 0; i < 3; i++) ctx.fillRect(-300 + i * 160, 40, 6, 60);
  ctx.beginPath(); ctx.moveTo(-60, -50); ctx.quadraticCurveTo(0, -50 - 160 * tent, 60, -50); ctx.fill();
  ctx.fillStyle = '#8d5630'; ctx.beginPath(); ctx.ellipse(0, -70 - 150 * tent, 40, 26, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, -130 - 150 * tent, 40, 26, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function skull(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 14; ctx.setLineDash([30, 18]); ctx.lineDashOffset = t * 20; ctx.beginPath(); ctx.ellipse(0, 0, 290, 230, 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
function syrup(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#9d0208'; rrect(ctx, -60, -90, 120, 180, 30); ctx.fill(); ctx.fillRect(-25, -140, 50, 60); ctx.fillStyle = '#6a040f'; const p = (t * 0.4) % 1; ctx.beginPath(); ctx.ellipse(0, 90 + p * 80, 14, 20 + p * 30, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; rrect(ctx, -45, -30, 90, 60, 10); ctx.fill(); ctx.restore(); }
function bodyMap(ctx, x, y, s, t, k, cold) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = mix('#2f6fde', '#4361ee', 0.5); ctx.globalAlpha = 0.3; rrect(ctx, -70, -350, 140, 190, 40); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, -430, 60, 70, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(-45, -170, 35, 170); ctx.fillRect(10, -170, 35, 170); ctx.fillRect(-120, -340, 40, 180); ctx.fillRect(80, -340, 40, 180); ctx.globalAlpha = 1;
  // núcleo caliente (cerebro y corazón) que brilla
  const glow = 0.6 + 0.4 * Math.sin(t * 5);
  for (const [cx, cy, r] of [[0, -430, 55], [10, -290, 40]]) { const g = ctx.createRadialGradient(cx, cy, 5, cx, cy, r * 2.5); g.addColorStop(0, `rgba(255,90,60,${glow})`); g.addColorStop(1, 'rgba(255,90,60,0)'); ctx.fillStyle = g; ctx.fillRect(cx - r * 3, cy - r * 3, r * 6, r * 6); }
  brain(ctx, 0, -440, 0.18, t, { face: false }); heartIcon(ctx, 10, -290, 0.45 + 0.05 * Math.sin(t * 8));
  // gotas que viajan hacia el centro
  for (let i = 0; i < 8; i++) { const p = (t * 0.8 + i / 8) % 1, sx = [-100, 100, -30, 30][i % 4], sy = [-250, -250, -20, -20][i % 4]; ctx.fillStyle = '#4cc9f0'; ctx.beginPath(); ctx.arc(lerp(sx, 0, p), lerp(sy, -360, p), 9, 0, Math.PI * 2); ctx.fill(); }
  if (cold) { for (const [cx, cy] of [[-100, -150], [100, -150], [-28, -10], [28, -10]]) { ctx.fillStyle = 'rgba(189,224,254,0.9)'; ctx.beginPath(); ctx.arc(cx, cy, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, '❄', cx, cy, { size: 34, fill: '#4cc9f0', lw: 0, shadow: false }); } }
  ctx.restore();
}
function medal(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 2) * 0.08); ctx.fillStyle = '#e63946'; ctx.beginPath(); ctx.moveTo(-60, -200); ctx.lineTo(0, -60); ctx.lineTo(60, -200); ctx.lineTo(20, -200); ctx.lineTo(0, -140); ctx.lineTo(-20, -200); ctx.fill(); ctx.fillStyle = FLAT.accent; ctx.beginPath(); ctx.arc(0, 0, 110, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#e9b44c'; ctx.beginPath(); ctx.arc(0, 0, 80, 0, Math.PI * 2); ctx.fill(); text(ctx, '★', 0, 4, { size: 100, fill: '#fff', lw: 0, shadow: false }); ctx.restore(); }
function campfire(ctx, x, y, t) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#6d4c41'; ctx.save(); ctx.rotate(0.3); ctx.fillRect(-110, -15, 220, 30); ctx.restore(); ctx.save(); ctx.rotate(-0.3); ctx.fillRect(-110, -15, 220, 30); ctx.restore();
  for (let i = 0; i < 3; i++) { const f = 1 + 0.15 * Math.sin(t * 12 + i * 2); ctx.fillStyle = ['#ffba08', '#f48c06', '#dc2f02'][i]; ctx.beginPath(); ctx.moveTo(-70 + i * 20, 0); ctx.quadraticCurveTo(-60 + i * 20, -140 * f + i * 30, 0, -170 * f + i * 40); ctx.quadraticCurveTo(60 - i * 20, -140 * f + i * 30, 70 - i * 20, 0); ctx.fill(); } ctx.restore(); }
function pot(ctx, x, y, t) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#495057'; rrect(ctx, -130, -100, 260, 150, 30); ctx.fill(); ctx.fillRect(-150, -110, 300, 24); ctx.fillStyle = '#4cc9f0'; ctx.fillRect(-120, -100, 240, 16);
  for (let i = 0; i < 6; i++) { const p = (t * 1.5 + i / 6) % 1; ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.arc(-90 + i * 36, -100 - p * 30, 8 * (1 - p), 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = `rgba(255,255,255,${0.5 * (1 - p)})`; ctx.beginPath(); ctx.arc(-80 + i * 36 + Math.sin(p * 6) * 20, -150 - p * 200, 20 + p * 30, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
function watermelon(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 2) * 0.05); ctx.fillStyle = '#2d6a4f'; ctx.beginPath(); ctx.arc(0, 0, 100, 0, Math.PI); ctx.fill(); ctx.fillStyle = '#ef476f'; ctx.beginPath(); ctx.arc(0, 0, 84, 0, Math.PI); ctx.fill(); ctx.fillStyle = FLAT.ink; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.ellipse(-50 + i * 20, 30 + (i % 2) * 18, 5, 8, 0, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
function soup(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#f8f9fa'; ctx.beginPath(); ctx.ellipse(0, 0, 110, 40, 0, 0, Math.PI); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, 0, 110, 25, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#f4a261'; ctx.beginPath(); ctx.ellipse(0, 0, 95, 18, 0, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 3; i++) { const p = (t * 0.6 + i / 3) % 1; ctx.strokeStyle = `rgba(255,255,255,${1 - p})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-30 + i * 30, -20 - p * 80); ctx.quadraticCurveTo(-15 + i * 30, -40 - p * 80, -30 + i * 30, -60 - p * 80); ctx.stroke(); } ctx.restore(); }
function bread(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#e9c46a'; rrect(ctx, -110, -40, 220, 90, 40); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, -40, 110, 60, 0, Math.PI, 0); ctx.fill(); ctx.strokeStyle = '#d4a373'; ctx.lineWidth = 6; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(i * 50 - 20, -70); ctx.lineTo(i * 50 + 20, -40); ctx.stroke(); } ctx.restore(); }
function soda(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#e63946'; rrect(ctx, -55, -100, 110, 200, 20); ctx.fill(); ctx.fillStyle = '#adb5bd'; ctx.fillRect(-45, -112, 90, 14); ctx.fillStyle = '#fff'; ctx.fillRect(-55, -20, 110, 30);
  for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(90 + i * 10, -60 + i * 50 + Math.sin(t * 3 + i) * 6); ctx.rotate(t + i); ctx.fillStyle = '#fff'; ctx.fillRect(-14, -14, 28, 28); ctx.restore(); } ctx.restore(); }
function trophy(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 3) * 0.08); ctx.fillStyle = FLAT.accent; ctx.beginPath(); ctx.moveTo(-70, -80); ctx.lineTo(70, -80); ctx.quadraticCurveTo(70, 20, 0, 30); ctx.quadraticCurveTo(-70, 20, -70, -80); ctx.fill(); ctx.fillRect(-12, 30, 24, 40); ctx.fillRect(-50, 70, 100, 20); ctx.strokeStyle = FLAT.accent; ctx.lineWidth = 12; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 75, -40, 28, sx > 0 ? -Math.PI / 2 : Math.PI / 2, sx > 0 ? Math.PI / 2 : Math.PI * 1.5); ctx.stroke(); } ctx.restore(); }
function gear(ctx, x, y, r, a) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = 'rgba(255,255,255,0.85)'; for (let i = 0; i < 10; i++) { ctx.save(); ctx.rotate(i * Math.PI / 5); ctx.fillRect(-r * 0.15, -r * 1.25, r * 0.3, r * 0.4); ctx.restore(); } ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#4361ee'; ctx.beginPath(); ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
function baby(ctx, x, y, s, t, cry) { ctx.save(); ctx.translate(x, y + Math.sin(t * 3) * 6); ctx.scale(s, s); ctx.fillStyle = '#fff'; rrect(ctx, -110, 20, 220, 160, 70); ctx.fill(); ctx.fillStyle = '#ffdbac'; ctx.beginPath(); ctx.arc(0, -40, 100, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#ffc8a2'; ctx.beginPath(); ctx.arc(-95, -40, 22, 0, Math.PI * 2); ctx.arc(95, -40, 22, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#8a5a2b'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -150, 20, 0.2, Math.PI - 0.2, true); ctx.stroke();
  ctx.fillStyle = FLAT.ink; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 35, -50, 10, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#ff8fab'; ctx.beginPath(); if (cry) ctx.ellipse(0, 5, 20, 14 + Math.abs(Math.sin(t * 12)) * 8, 0, 0, Math.PI * 2); else ctx.arc(0, 0, 14, 0, Math.PI); ctx.fill();
  if (cry) for (const sx of [-1, 1]) { const p = (t * 1.5) % 1; ctx.fillStyle = '#7fd4ff'; ctx.beginPath(); ctx.ellipse(sx * 45, -30 + p * 50, 7, 11, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore(); }
function plate(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#f8f9fa'; ctx.beginPath(); ctx.ellipse(0, 0, 220, 90, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#e9ecef'; ctx.beginPath(); ctx.ellipse(0, 0, 160, 60, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#adb5bd'; ctx.save(); ctx.translate(-280, 0); ctx.rotate(Math.sin(t * 3) * 0.1); ctx.fillRect(-8, -110, 16, 220); for (let i = 0; i < 3; i++) ctx.fillRect(-20 + i * 16, -150, 8, 50); ctx.restore(); ctx.save(); ctx.translate(280, 0); ctx.rotate(-Math.sin(t * 3) * 0.1); ctx.fillRect(-10, -150, 20, 260); ctx.restore();
  for (let i = 0; i < 2; i++) { const a = t * 2 + i * Math.PI; ctx.save(); ctx.translate(Math.cos(a) * 140, -120 + Math.sin(a) * 30); ctx.strokeStyle = FLAT.ink; ctx.lineWidth = 4; ctx.beginPath(); const fl = Math.sin(t * 20 + i) * 6; ctx.moveTo(-14, fl); ctx.lineTo(0, 0); ctx.lineTo(14, fl); ctx.stroke(); ctx.restore(); }
  ctx.restore(); }
function stars(ctx, t, x, y) { for (let i = 0; i < 6; i++) { const a = t * 3 + i * 1.05; text(ctx, '★', x + Math.cos(a) * 160, y + Math.sin(a) * 50, { size: 50, fill: FLAT.accent }); } }
function bolt(ctx, x, y, t) { ctx.save(); ctx.translate(x, y + Math.sin(t * 8) * 10); ctx.fillStyle = FLAT.accent; ctx.beginPath(); ctx.moveTo(10, -60); ctx.lineTo(-30, 10); ctx.lineTo(0, 10); ctx.lineTo(-15, 70); ctx.lineTo(35, -10); ctx.lineTo(5, -10); ctx.closePath(); ctx.fill(); ctx.restore(); }
PEOPLE.abuela = { skin: '#f1c9a5', skinD: '#ddae86', shirt: '#9b5de5', shirtD: '#8148cc', pants: '#495057', hair: '#dee2e6', hairStyle: 'bun', glasses: true };

V.terminar();
